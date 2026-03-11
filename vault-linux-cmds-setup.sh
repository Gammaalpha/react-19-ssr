#!/bin/bash

# How to run
# chmod +x vault-setup.sh
# ./vault-setup.sh

# Set Vault address and token for local dev
export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN=root

# Enable AppRole auth method
nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault auth enable approle

# Copy the policy file into the container
nerdctl cp react-express-app-policy.hcl vault:/react-express-app-policy.hcl

# Apply the policy
nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault policy write react-express-app-policy /react-express-app-policy.hcl

# Create a token with this policy
nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault token create -policy=react-express-app-policy

# Create a role
nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault write auth/approle/role/react-express-app token_policies="react-express-app-policy" token_ttl=1h token_max_ttl=4h

# Get role credentials
nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault read auth/approle/role/react-express-app/role-id

# Generate a Secret ID
nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault write -f auth/approle/role/react-express-app/secret-id

# -----------------------------------------------------------------------
# Useful commands (uncomment as needed)
# -----------------------------------------------------------------------

# List vault secrets
# nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault kv list secret/

# List secrets under jwt-tokens path
# nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault kv list secret/jwt-tokens

# Read a secret
# nerdctl exec -e VAULT_ADDR=$VAULT_ADDR -e VAULT_TOKEN=$VAULT_TOKEN vault vault kv get secret/jwt-tokens/my-app