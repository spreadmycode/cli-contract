import * as fs from 'fs';
import * as bs58 from 'bs58';
import { program } from 'commander';
import * as anchor from '@project-serum/anchor';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import log from 'loglevel';
import { WHITELIST_IDL } from './whitelist_idl';

const WHITELIST_LEN = 3000;

program.version('0.0.1');

log.setLevel(log.levels.INFO);

const PROGRAM_ID = new PublicKey('2LtzaPN7S87FfWTUKxXk4KjTcYp4Pkb3vTEnq2TZSoTg');
const WHITELIST_STATE = new PublicKey('');
const WHITELIST_DATA = new PublicKey('');

async function loadAnchorProgram(walletKeyPair: Keypair, env: string) {
  // @ts-ignore
  const solConnection = new anchor.web3.Connection("https://cold-green-frost.solana-devnet.quiknode.pro/8a1ca977a24ae481d6f739d894f8aa606a5b90d6/");
  const walletWrapper = new anchor.Wallet(walletKeyPair);
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  });
  const idl = WHITELIST_IDL as anchor.Idl;

  const program = new anchor.Program(idl, PROGRAM_ID, provider);
  return program;
}

function loadWalletKey(keypair): Keypair {
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())),
  );
  return loaded;
}

program.
  command('init_whitelist')
  .option(
    '-e, --env <string>',
    'Solana cluster env name',
    'devnet', //mainnet-beta, testnet, devnet
  )
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair, env } = cmd.opts();

    const walletKeyPair = loadWalletKey(keypair);
    const whitelistState = anchor.web3.Keypair.generate();
    const whitelistData = anchor.web3.Keypair.generate();

    const whitelistDataSize = 8 + 32 * WHITELIST_LEN;
    const program = await loadAnchorProgram(walletKeyPair, env);

    let tx = await program.rpc.initialize(walletKeyPair.publicKey, {
        accounts: {
            whitelistState: whitelistState.publicKey,
            whitelistData: whitelistData.publicKey,
            user: walletKeyPair.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [whitelistState, whitelistData],
        instructions: [
            anchor.web3.SystemProgram.createAccount({
                fromPubkey: program.provider.wallet.publicKey,
                lamports:
                    await program.provider.connection.getMinimumBalanceForRentExemption(
                        whitelistDataSize
                    ),
                newAccountPubkey: whitelistData.publicKey,
                programId: program.programId,
                space: whitelistDataSize,
            }),
        ],
    });

    console.log('tx: ', tx);
    console.log('Whitelist initialized');
    console.log('Whitelist State: ', whitelistState.publicKey.toString());
    console.log('Whitelist Data: ', whitelistData.publicKey.toString());
});

program.
  command('add_addresses')
  .option(
    '-e, --env <string>',
    'Solana cluster env name',
    'devnet', //mainnet-beta, testnet, devnet
  )
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .option(
    '-a, --addresses <path>',
    `Wallet addresses to be added on whitelist`,
    '--addresses not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair, env, addresses } = cmd.opts();

    const fileContent = fs.readFileSync(keypair).toString();
    let lines = fileContent.split('\n');
    let list = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        list.push(new PublicKey(line));
    }

    console.log('Wallet Count: ', list.length);

    const walletKeyPair = loadWalletKey(keypair);
    const program = await loadAnchorProgram(walletKeyPair, env);

    let tx = await program.rpc.addWhitelistAddresses(list, {
        accounts: {
            WHITELIST_STATE,
            WHITELIST_DATA,
            authority: walletKeyPair.publicKey,
        },
        signers: [walletKeyPair],
    });
    console.log(tx);
});

program.
  command('reset_whitelist')
  .option(
    '-e, --env <string>',
    'Solana cluster env name',
    'devnet', //mainnet-beta, testnet, devnet
  )
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair, env } = cmd.opts();

    const walletKeyPair = loadWalletKey(keypair);
    const program = await loadAnchorProgram(walletKeyPair, env);

    let tx = await program.rpc.resetWhitelistCounter({
        accounts: {
            whitelist: WHITELIST_STATE,
            authority: walletKeyPair.publicKey,
        },
        signers: [walletKeyPair],
    });
    console.log(tx);
});

program.
  command('update_whitelist')
  .option(
    '-e, --env <string>',
    'Solana cluster env name',
    'devnet', //mainnet-beta, testnet, devnet
  )
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .option(
    '-a, --addresses <path>',
    `Wallet addresses to be added on whitelist`,
    '--addresses not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair, env, addresses } = cmd.opts();

    const fileContent = fs.readFileSync(keypair).toString();
    let lines = fileContent.split('\n');
    let list = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        list.push(new PublicKey(line));
    }

    console.log('Wallet Count: ', list.length);

    const walletKeyPair = loadWalletKey(keypair);
    const program = await loadAnchorProgram(walletKeyPair, env);

    let tx = await program.rpc.updateWhitelist(list, {
        accounts: {
            whitelist: WHITELIST_STATE,
            authority: walletKeyPair.publicKey,
        },
        signers: [walletKeyPair],
    });
    console.log(tx);
});

program.
  command('show_whitelist')
  .option(
    '-e, --env <string>',
    'Solana cluster env name',
    'devnet', //mainnet-beta, testnet, devnet
  )
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
  .action(async (directory, cmd) => {
    const { keypair, env } = cmd.opts();

    const walletKeyPair = loadWalletKey(keypair);
    const program = await loadAnchorProgram(walletKeyPair, env);

    let offset = 8;
    let info = await program.provider.connection.getAccountInfo(WHITELIST_DATA);
    for (let i = 0; i < WHITELIST_LEN; i++) {
        let decoded = bs58.encode(
            info.data.slice(offset + i * 32, offset + (i + 1) * 32)
        );
        console.log(decoded);
    }
});

program.parse(process.argv);