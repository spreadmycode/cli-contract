# SMART CONTRACT CLI

## Initialize

``$ ts-node ./src/cli.ts create_presale -e <env> -k <keypair path>``

It will return with storage account address.
Copy this address and update the const value PROGRAM_ACCOUNT in cli.ts.

## Toggle between Pre-sale and Post-sale

``$ ts-node ./src/cli.ts toggle_sale -e <env> -k <keypair path>``

## Set sale in pending to make people waiting for reveal

``$ ts-node ./src/cli.ts set_pending -e <env> -k <keypair path>``

## Add wallet address to whitelist

``$ ts-node ./src/cli.ts add_whitelist -e <env> -k <keypair path> -p <wallet address>``

## Add wallet addresses to whitelist

``$ ts-node ./src/cli.ts add_whitelists -e <env> -k <keypair path> -a <wallet addresses file path>``

## Clear whitelist

``$ ts-node ./src/cli.ts clear_whitelist -e <env> -k <keypair path>``

