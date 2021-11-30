import * as fs from 'fs';
import { program } from 'commander';
import * as anchor from '@project-serum/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import log from 'loglevel';
import { PRESALE_IDL } from './presale_idl';

program.version('0.0.1');

log.setLevel(log.levels.INFO);

	// Single one
// const PROGRAM_ID = new PublicKey('9xcrzYhMDGJVXMRV42wMP93nj9Dgz2KUtcMwrWJCR2hq');
// const PROGRAM_ACCOUNT = new PublicKey('4LT3YTFnrwqWeCRVqFxeMjBH4wrLk92Axh24ZwpwAdKL');

	// Multiple one
	const PROGRAM_ID = new PublicKey('9DDCYYriAf5u4vb1kgnuZ476RtNTsLAohnpzVvkWbzi');
	const PROGRAM_ACCOUNT = new PublicKey('QBYmvRqkEgcQUrw4WApefD5ZQW9Jux8i1oM7iQAHt3s');

async function loadAnchorProgram(walletKeyPair: Keypair, env: string) {
  // @ts-ignore
  const solConnection = new anchor.web3.Connection("https://cold-green-frost.solana-devnet.quiknode.pro/8a1ca977a24ae481d6f739d894f8aa606a5b90d6/");
  const walletWrapper = new anchor.Wallet(walletKeyPair);
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  });
  const idl = PRESALE_IDL as anchor.Idl;

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
    console.log(`Sale status is toggled.`);
});

program.
  command('add_whitelist')
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
    '-p, --pubkey <string>',
    'Solana wallet pubkey to whitelist',
    '',
  )
  .action(async (directory, cmd) => {
    const { keypair, env, pubkey } = cmd.opts();

    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await loadAnchorProgram(walletKeyPair, env);

    await anchorProgram.rpc.addWhitelist(
      pubkey,
      {
        accounts: {
          data: PROGRAM_ACCOUNT,
          minter: walletKeyPair.publicKey,
        }
      },
    );
    console.log(`${pubkey} is added to whitelist.`);
});

program.
  command('add_whitelists')
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

		const fileContent = fs.readFileSync(addresses).toString();
    let lines = fileContent.split('\n');
    let list = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
		if (line && line.length >= 32) {
        	list.push(line);
		}
    }

    console.log('Wallet Count: ', list.length);

    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await loadAnchorProgram(walletKeyPair, env);

    await anchorProgram.rpc.addWhitelists(
      list,
      {
        accounts: {
          data: PROGRAM_ACCOUNT,
          minter: walletKeyPair.publicKey,
        }
      },
    );

    console.log(`Addresses are added to whitelist.`);
});

program.
  command('clear_whitelist')
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

    await anchorProgram.rpc.clearWhitelist(
      {
        accounts: {
          data: PROGRAM_ACCOUNT,
          minter: walletKeyPair.publicKey,
        }
      },
    );
    console.log(`Whitelist is cleared.`);
});

program.parse(process.argv);