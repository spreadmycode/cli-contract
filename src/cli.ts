import * as fs from 'fs';
import { program } from 'commander';
import * as anchor from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import log from 'loglevel';

program.version('0.0.1');

log.setLevel(log.levels.INFO);

const PROGRAM_ID = new PublicKey('5d1tajujHvUjbDVGjhQjfcfrJiuL9wjPDwko4X2RHFDS');
const PROGRAM_ACCOUNT = new PublicKey('5d1tajujHvUjbDVGjhQjfcfrJiuL9wjPDwko4X2RHFDS');

async function loadAnchorProgram(walletKeyPair: Keypair, env: string) {
  // @ts-ignore
  const solConnection = new anchor.web3.Connection("https://cold-green-frost.solana-devnet.quiknode.pro/8a1ca977a24ae481d6f739d894f8aa606a5b90d6/");
  const walletWrapper = new anchor.Wallet(walletKeyPair);
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  });
  const idl = await anchor.Program.fetchIdl(PROGRAM_ID, provider);

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
  command('create_presale')
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
    const anchorProgram = await loadAnchorProgram(walletKeyPair, env);

    const programAccount = Keypair.generate();

    await anchorProgram.rpc.initializeContract(
      {
        accounts: {
          data: programAccount.publicKey,
          user: walletKeyPair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [programAccount],
      },
    );
    console.log(`create_presale Done: ${programAccount.publicKey.toBase58()}`);
});

program.
  command('set_pending')
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
    const anchorProgram = await loadAnchorProgram(walletKeyPair, env);

    await anchorProgram.rpc.setPending(
      {
        accounts: {
          data: PROGRAM_ACCOUNT,
          minter: walletKeyPair.publicKey,
        }
      },
    );
    console.log(`Presale is pending`);
});

program.
  command('toggle_sale')
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
    const anchorProgram = await loadAnchorProgram(walletKeyPair, env);

    await anchorProgram.rpc.togglePeriod(
      {
        accounts: {
          data: PROGRAM_ACCOUNT,
          minter: walletKeyPair.publicKey,
        }
      },
    );
    console.log(`Presale is pending`);
});

program.parse(process.argv);
