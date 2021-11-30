export const WHITELIST_IDL = 
{
  "version": "0.0.0",
  "name": "whitelist",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "whitelistState",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "whitelistData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
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
      "name": "addWhitelistAddresses",
      "accounts": [
        {
          "name": "whitelistState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelistData",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "resetWhitelistCounter",
      "accounts": [
        {
          "name": "whitelistState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "WhitelistState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "counter",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "WhitelistData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "type": {
              "array": [
                "publicKey",
                3000
              ]
            }
          }
        ]
      }
    }
  ]
};
