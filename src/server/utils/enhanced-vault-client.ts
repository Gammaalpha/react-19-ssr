import axios, { AxiosResponse, Method } from "axios";

// Type definitions
interface VaultConfig {
  vaultUrl?: string;
  kvPath?: string;
  roleId?: string;
  secretId?: string;
  token?: string;
}

interface TokenMetadata {
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

interface StoredTokenData {
  refresh_token: string;
  created_at: string;
  last_used: string;
  metadata: TokenMetadata;
}

interface VaultAuthResponse {
  auth: {
    client_token: string;
    lease_duration: number;
    renewable: boolean;
    policies: string[];
  };
}

interface VaultKVResponse {
  data: {
    data: StoredTokenData;
    metadata: {
      created_time: string;
      version: number;
    };
  };
}

interface VaultListResponse {
  data: {
    keys: string[];
  };
}

interface TokenMetadataResponse {
  created_at: string;
  last_used: string;
  metadata: TokenMetadata;
}

interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  vault_status?: any;
  authenticated?: boolean;
  error?: string;
  timestamp: string;
}

interface VaultSystemHealthResponse {
  initialized: boolean;
  sealed: boolean;
  standby: boolean;
  performance_standby: boolean;
  replication_performance_mode: string;
  replication_dr_mode: string;
  server_time_utc: number;
  version: string;
  cluster_name: string;
  cluster_id: string;
}

/**
 * Usage example with updated environment variables.
 *
 * .env file additions:
 *
 * ```env
 * VAULT_ROLE_ID=your-role-id-here
 * VAULT_SECRET_ID=your-secret-id-here
 * VAULT_ADDR=https://vault.yourdomain.com
 *
 * # Or keep VAULT_SECRET_ID for development:
 * VAULT_SECRET_ID=your-development-token
 * ```
 *
 * @example
 * ```js
 * const vaultClient = new EnhancedVaultClient({
 *   vaultUrl: process.env.VAULT_ADDR,
 *   roleId: process.env.VAULT_ROLE_ID,
 *   secretId: process.env.VAULT_SECRET_ID,
 *   kvPath: 'secret/data/jwt-tokens'
 * });
 *
 * // Store token with metadata:
 * await vaultClient.storeRefreshToken('username', 'refresh-token', {
 *   ipAddress: req.ip,
 *   userAgent: req.get('User-Agent')
 * });
 *
 * // Periodic cleanup (run as a scheduled job)
 * setInterval(async () => {
 *   try {
 *     await vaultClient.cleanupExpiredTokens(24 * 7); // 1 week
 *   } catch (error) {
 *     console.error('Token cleanup failed:', error);
 *   }
 * }, 24 * 60 * 60 * 1000); // Daily cleanup
 * ```
 */
class EnhancedVaultClient {
  private readonly vaultUrl: string;
  private readonly kvPath: string;
  private readonly roleId?: string;
  private readonly secretId?: string;
  private readonly directToken?: string;

  private token: string | null = null;
  private tokenExpiry: number | null = null;
  private isAuthenticating: boolean = false;

  constructor(config: VaultConfig = {}) {
    this.vaultUrl =
      config.vaultUrl || process.env.VAULT_URL || "http://localhost:8200";
    this.kvPath = config.kvPath || "secret/data/jwt-tokens";

    // AppRole credentials
    this.roleId = config.roleId || process.env.VAULT_ROLE_ID;
    this.secretId = config.secretId || process.env.VAULT_SECRET_ID;

    // Fallback to direct token (for development)
    this.directToken = config.token || process.env.VAULT_TOKEN;

    // Validate configuration
    if (!this.directToken && (!this.roleId || !this.secretId)) {
      throw new Error(
        "Either VAULT_TOKEN or both VAULT_ROLE_ID and VAULT_SECRET_ID must be provided"
      );
    }
  }

  /**
   * Authenticate using AppRole method
   */
  private async authenticateWithAppRole(): Promise<string> {
    if (!this.roleId || !this.secretId) {
      throw new Error("AppRole credentials not provided");
    }

    if (this.isAuthenticating) {
      // Wait for ongoing authentication
      while (this.isAuthenticating) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (!this.token) {
        throw new Error("Authentication failed");
      }
      return this.token;
    }

    this.isAuthenticating = true;

    try {
      const response: AxiosResponse<VaultAuthResponse> = await axios.post(
        `${this.vaultUrl}/v1/auth/approle/login`,
        {
          role_id: this.roleId,
          secret_id: this.secretId,
        }
      );

      const auth = response.data.auth;
      this.token = auth.client_token;
      this.tokenExpiry = Date.now() + auth.lease_duration * 1000;

      console.log("Successfully authenticated with Vault using AppRole");
      return this.token;
    } catch (error: any) {
      console.error(
        "AppRole authentication failed:",
        error.response?.data || error.message
      );
      throw new Error("Vault authentication failed");
    } finally {
      this.isAuthenticating = false;
    }
  }

  /**
   * Get a valid token (authenticate if needed)
   */
  private async getValidToken(): Promise<string> {
    // Use direct token if available (development)
    if (this.directToken) {
      return this.directToken;
    }

    // Check if current token is still valid (with 5-minute buffer)
    if (
      this.token &&
      this.tokenExpiry &&
      Date.now() + 300000 < this.tokenExpiry
    ) {
      return this.token;
    }

    // Authenticate to get a new token
    return await this.authenticateWithAppRole();
  }

  /**
   * Make authenticated requests to Vault
   */
  private async makeVaultRequest<T = any>(
    method: Method,
    path: string,
    data: any = null,
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      const token = await this.getValidToken();

      const config = {
        method,
        url: `${this.vaultUrl}/v1/${path}`,
        headers: {
          "X-Vault-Token": token,
          "Content-Type": "application/json",
        },
        ...(Object.keys(params).length > 0 && { params }),
        ...(data && { data }),
      };

      const response: AxiosResponse<T> = await axios(config);
      return response.data;
    } catch (error: any) {
      console.error(
        `Vault ${method.toUpperCase()} request failed:`,
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Make LIST requests to Vault (which are GET requests with list=true parameter)
   */
  private async makeVaultListRequest<T = any>(path: string): Promise<T> {
    return this.makeVaultRequest<T>("GET", path, null, { list: "true" });
  }

  /**
   * Store refresh token with metadata
   */
  public async storeRefreshToken(
    username: string,
    refreshToken: string,
    metadata: TokenMetadata = {}
  ): Promise<boolean> {
    if (!username || !refreshToken) {
      throw new Error("Username and refresh token are required");
    }

    try {
      const data = {
        data: {
          refresh_token: refreshToken,
          created_at: new Date().toISOString(),
          last_used: new Date().toISOString(),
          metadata: {
            ip_address: metadata.ipAddress,
            user_agent: metadata.userAgent,
            ...metadata,
          },
        },
      };

      await this.makeVaultRequest("PUT", `${this.kvPath}/${username}`, data);
      console.log(`Refresh token stored for user: ${username}`);

      return true;
    } catch (error: any) {
      console.error("Error storing refresh token:", error.message);
      throw new Error("Failed to store refresh token in Vault");
    }
  }

  /**
   * Retrieve refresh token and optionally update last_used timestamp
   */
  public async getRefreshToken(
    username: string,
    updateLastUsed: boolean = true
  ): Promise<string | null> {
    if (!username) {
      throw new Error("Username is required");
    }

    try {
      // First, get the current data
      const response = await this.makeVaultRequest<VaultKVResponse>(
        "GET",
        `${this.kvPath}/${username}`
      );

      if (!response.data || !response.data.data) {
        return null;
      }

      const tokenData = response.data.data;

      // Update last_used timestamp if requested
      if (updateLastUsed) {
        const updatedData = {
          data: {
            ...tokenData,
            last_used: new Date().toISOString(),
          },
        };

        // Update the record (fire and forget)
        this.makeVaultRequest(
          "PUT",
          `${this.kvPath}/${username}`,
          updatedData
        ).catch((error) =>
          console.error("Failed to update last_used timestamp:", error.message)
        );
      }

      return tokenData.refresh_token;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Error retrieving refresh token:", error.message);
      throw new Error("Failed to retrieve refresh token from Vault");
    }
  }

  /**
   * Get token metadata (without the actual token)
   */
  public async getTokenMetadata(
    username: string
  ): Promise<TokenMetadataResponse | null> {
    if (!username) {
      throw new Error("Username is required");
    }

    try {
      const response = await this.makeVaultRequest<VaultKVResponse>(
        "GET",
        `${this.kvPath}/${username}`
      );

      if (!response.data || !response.data.data) {
        return null;
      }

      const tokenData = response.data.data;
      return {
        created_at: tokenData.created_at,
        last_used: tokenData.last_used,
        metadata: tokenData.metadata || {},
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error("Failed to retrieve token metadata");
    }
  }

  /**
   * Delete refresh token for a user
   */
  public async deleteRefreshToken(username: string): Promise<boolean> {
    if (!username) {
      throw new Error("Username is required");
    }

    try {
      await this.makeVaultRequest("DELETE", `${this.kvPath}/${username}`);
      console.log(`Refresh token deleted for user: ${username}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log(`No refresh token found for user: ${username}`);
        return true;
      }
      console.error("Error deleting refresh token:", error.message);
      return false;
    }
  }

  /**
   * List all users with active refresh tokens (admin function)
   */
  public async listActiveTokens(): Promise<string[]> {
    try {
      const response = await this.makeVaultListRequest<VaultListResponse>(
        `${this.kvPath.replace("/data/", "/metadata/")}`
      );
      return response.data.keys || [];
    } catch (error: any) {
      console.error("Error listing active tokens:", error.message);
      throw new Error("Failed to list active tokens");
    }
  }

  /**
   * Cleanup expired tokens based on last_used timestamp (admin function)
   */
  public async cleanupExpiredTokens(
    maxAgeHours: number = 24 * 7
  ): Promise<number> {
    if (maxAgeHours <= 0) {
      throw new Error("maxAgeHours must be a positive number");
    }

    try {
      const users = await this.listActiveTokens();
      const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);

      let cleanedUp = 0;

      for (const username of users) {
        try {
          const metadata = await this.getTokenMetadata(username);

          if (metadata && new Date(metadata.last_used) < cutoffTime) {
            await this.deleteRefreshToken(username);
            cleanedUp++;
            console.log(`Cleaned up expired token for user: ${username}`);
          }
        } catch (error: any) {
          console.error(`Error processing user ${username}:`, error.message);
        }
      }

      console.log(`Cleaned up ${cleanedUp} expired tokens`);
      return cleanedUp;
    } catch (error: any) {
      console.error("Error during token cleanup:", error.message);
      throw new Error("Failed to cleanup expired tokens");
    }
  }

  /**
   * Perform health check on Vault connection and authentication
   */
  public async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const token = await this.getValidToken();

      // Test basic connectivity
      const healthResponse: AxiosResponse<VaultSystemHealthResponse> =
        await axios.get(`${this.vaultUrl}/v1/sys/health`);

      // Test authentication
      await axios.get(`${this.vaultUrl}/v1/auth/token/lookup-self`, {
        headers: { "X-Vault-Token": token },
      });

      return {
        status: "healthy",
        vault_status: healthResponse.data,
        authenticated: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get current token info (for debugging)
   */
  public getTokenInfo(): {
    hasToken: boolean;
    tokenExpiry: number | null;
    isExpiringSoon: boolean;
  } {
    const now = Date.now();
    const isExpiringSoon = this.tokenExpiry
      ? this.tokenExpiry - now < 300000
      : false; // 5 minutes

    return {
      hasToken: !!this.token || !!this.directToken,
      tokenExpiry: this.tokenExpiry,
      isExpiringSoon,
    };
  }
}

export default EnhancedVaultClient;

// Export types for use in other files
export type {
  VaultConfig,
  TokenMetadata,
  TokenMetadataResponse,
  HealthCheckResponse,
  StoredTokenData,
};
