@REM Path anchoring
cd /d %~dp0

cd vault_1.20.2_windows_amd64

@REM Use to run the server
@REM vault server -dev -address="http://127.0.0.1:8200"

@REM Set Vault address
set VAULT_ADDR=http://127.0.0.1:8200

@REM Enable AppRole auth method
vault auth enable approle

@REM REM Create a policy file (react-express-app-policy.hcl)
@REM @REM echo path "secret/data/jwt-tokens/*" {> react-express-app-policy.hcl
@REM @REM echo   capabilities = ["create", "read", "update", "delete"]>> react-express-app-policy.hcl
@REM @REM echo }>> react-express-app-policy.hcl

@REM Apply the policy
vault policy write react-express-app-policy react-express-app-policy.hcl

@REM Create a token with this policy
vault token create -policy=react-express-app-policy

@REM Create a role
vault write auth/approle/role/react-express-app token_policies="react-express-app-policy" token_ttl=1h token_max_ttl=4h

@REM Get role credentials
vault read auth/approle/role/react-express-app/role-id

@REM Generate a Secret ID
vault write -f auth/approle/role/react-express-app/secret-id

cd ..

@REM List vault secrets
@REM vault kv list secret/

@REM If your secrets are under secret/data/jwt-tokens/*, then:
@REM vault kv list secret/jwt-tokens

@REM Read a secret
@REM vault kv get secret/jwt-tokens/my-app