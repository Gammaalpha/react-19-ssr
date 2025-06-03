interface AssetInfo {
  name: string;
  size: number;
}

interface WebpackStats {
  hash: string;
  publicPath: string;
  namedChunkGroups: {
    [key: string]: {
      name: string;
      chunks: string[];
      assets: AssetInfo[];
    };
  };
}

export class ChunksManager {
  private stats: WebpackStats;
  private isDevelopment: boolean;

  constructor(stats: WebpackStats, isDevelopment = false) {
    this.stats = stats;
    this.isDevelopment = isDevelopment;
  }

  /**
   * Get all JavaScript assets as an array of URLs
   */
  getJavaScriptAssets(): string[] {
    const mainChunkGroup = this.stats.namedChunkGroups.main;
    if (!mainChunkGroup) {
      console.warn("No main chunk group found");
      return [];
    }

    const jsAssets = mainChunkGroup.assets
      .filter((asset) => asset.name.endsWith(".js"))
      .map((asset) => this.formatAssetPath(asset.name));

    return jsAssets;
  }

  /**
   * Get all CSS assets as an array of URLs
   */
  getCSSAssets(): string[] {
    const mainChunkGroup = this.stats.namedChunkGroups.main;
    if (!mainChunkGroup) return [];

    const cssAssets = mainChunkGroup.assets
      .filter((asset) => asset.name.endsWith(".css"))
      .map((asset) => this.formatAssetPath(asset.name));

    return cssAssets;
  }

  /**
   * Get source map assets (for development)
   */
  getSourceMapAssets(): string[] {
    if (!this.isDevelopment) return [];

    const mainChunkGroup = this.stats.namedChunkGroups.main;
    if (!mainChunkGroup) return [];

    const sourceMapAssets = mainChunkGroup.assets
      // .filter((asset) => asset.name.endsWith(".js.map"))
      .map((asset) => asset.name.replace(".js", ".js.map"))
      .map((asset) => this.formatAssetPath(asset));

    return sourceMapAssets;
  }

  /**
   * Get all assets with their metadata
   */
  getAllAssetsWithInfo(): Array<{ url: string; size: number; type: string }> {
    const mainChunkGroup = this.stats.namedChunkGroups.main;
    if (!mainChunkGroup) return [];

    return mainChunkGroup.assets.map((asset) => ({
      url: this.formatAssetPath(asset.name),
      size: asset.size,
      type: this.getAssetType(asset.name),
    }));
  }

  /**
   * Get bootstrap scripts in the correct loading order
   */
  getBootstrapScripts(): string[] {
    const jsAssets = this.getJavaScriptAssets();

    // Sort by chunk order: vendors -> shared -> main
    const sortedAssets = jsAssets.sort((a, b) => {
      const getChunkPriority = (assetName: string) => {
        if (assetName.includes("vendors")) return 0;
        if (assetName.includes("shared")) return 1;
        if (assetName.includes("main")) return 2;
        return 3;
      };

      return getChunkPriority(a) - getChunkPriority(b);
    });

    return sortedAssets;
  }

  private formatAssetPath(assetName: string): string {
    const publicPath =
      this.stats.publicPath === "auto" ? "/client/" : this.stats.publicPath;
    return `${publicPath}${assetName}`;
  }

  private getAssetType(assetName: string): string {
    if (assetName.endsWith(".js")) return "javascript";
    if (assetName.endsWith(".css")) return "stylesheet";
    if (assetName.endsWith(".js.map")) return "sourcemap";
    return "unknown";
  }
}
