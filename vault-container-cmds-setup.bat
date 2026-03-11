@echo off

@REM Set Vault address and token for local dev
set VAULT_ADDR=http://127.0.0.1:8200
set VAULT_TOKEN=root

@REM Enable AppRole auth method
nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault auth enable approle

@REM Copy the policy file into the container
nerdctl cp react-express-app-policy.hcl vault:/react-express-app-policy.hcl

@REM Apply the policy
nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault policy write react-express-app-policy /react-express-app-policy.hcl

@REM Create a token with this policy
nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault token create -policy=react-express-app-policy

@REM Create a role
nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault write auth/approle/role/react-express-app token_policies="react-express-app-policy" token_ttl=1h token_max_ttl=4h

@REM Get role credentials
nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault read auth/approle/role/react-express-app/role-id

@REM Generate a Secret ID
nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault write -f auth/approle/role/react-express-app/secret-id

@REM -----------------------------------------------------------------------
@REM Useful commands (uncomment as needed)
@REM -----------------------------------------------------------------------

@REM List vault secrets
@REM nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault kv list secret/

@REM List secrets under jwt-tokens path
@REM nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault kv list secret/jwt-tokens

@REM Read a secret
@REM nerdctl exec -e VAULT_ADDR=%VAULT_ADDR% -e VAULT_TOKEN=%VAULT_TOKEN% vault vault kv get secret/jwt-tokens/my-app