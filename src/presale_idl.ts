export const PRESALE_IDL = 
{
  "version": "0.0.0",
  "name": "nft_candy_machine",
  "instructions": [
    {
      "name": "initializeContract",
      "accounts": [
        {
          "name": "data",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addWhitelist",
      "accounts": [
        {
          "name": "data",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "minter",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pubKey",
          "type": "string"
        }
      ]
    },
    {
      "name": "addWhitelists",
      "accounts": [
        {
          "name": "data",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "minter",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "string"
          }
        }
      ]
    },
    {
      "name": "clearWhitelist",
      "accounts": [
        {
          "name": "data",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "minter",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "checkMintPossible",
      "accounts": [
        {
          "name": "data",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "minter",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pubKey",
          "type": "string"
        }
      ]
    },
    {
      "name": "setPending",
      "accounts": [
        {
          "name": "data",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "minter",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "togglePeriod",
      "accounts": [
        {
          "name": "data",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "minter",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Data",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "checkStatus",
            "type": "u8"
          },
          {
            "name": "periodStatus",
            "type": "u8"
          },
          {
            "name": "whitelist",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ResultCode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotAvailable"
          },
          {
            "name": "Available"
          },
          {
            "name": "NotExistInWhiteList"
          }
        ]
      }
    },
    {
      "name": "PeriodStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PendingSale"
          },
          {
            "name": "PreSale"
          },
          {
            "name": "PostSale"
          }
        ]
      }
    }
  ]
};
