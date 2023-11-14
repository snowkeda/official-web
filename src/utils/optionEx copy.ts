
import { Web3 } from "web3";

// set a provider in the sepolia testnet using node rpc url
const web3 = new Web3("https://arbitrum-goerli.publicnode.com");

// interacting with the smart contract
const abiEx = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_calculator",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_feeTo",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_feeHook",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "enpoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalBet",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalWin",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			}
		],
		"name": "Settled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalUnfeed",
				"type": "uint256"
			}
		],
		"name": "UnfeedClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalWin",
				"type": "uint256"
			}
		],
		"name": "WinClaimed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "FEE_DIV",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amountIn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_minLpAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "addLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_epochPeriod",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_stopBetBlockCount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_agg",
				"type": "address"
			}
		],
		"name": "addUnderlying",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "autoClaim",
				"type": "bool"
			}
		],
		"name": "betC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "autoClaim",
				"type": "bool"
			}
		],
		"name": "betP",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "calculator",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "claimUnfeed",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "claimWin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			}
		],
		"name": "currentEpoch",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			}
		],
		"name": "epochPeriod",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "period",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			}
		],
		"name": "epochStopBetBlockCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeHook",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeTo",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "getEpochEnd",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "end",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "getEpochInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "epoch",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "int256",
						"name": "amount",
						"type": "int256"
					},
					{
						"internalType": "uint128",
						"name": "rate",
						"type": "uint128"
					},
					{
						"internalType": "uint128",
						"name": "blockNumber",
						"type": "uint128"
					}
				],
				"internalType": "struct IBinaryOptions.UserInfo[]",
				"name": "infos",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "getEpochResult",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalBet",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "cWin",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pWin",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "getUserEpochInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "epoch",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "int256",
						"name": "amount",
						"type": "int256"
					},
					{
						"internalType": "uint128",
						"name": "rate",
						"type": "uint128"
					},
					{
						"internalType": "uint128",
						"name": "blockNumber",
						"type": "uint128"
					}
				],
				"internalType": "struct IBinaryOptions.UserInfo[]",
				"name": "infos",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "getUserEpochResult",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalWin",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			}
		],
		"name": "oracle",
		"outputs": [
			{
				"internalType": "contract IOracle",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenOut",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_lpAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_minOut",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "removeLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "roundInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalP",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pendingP",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalC",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pendingC",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastBetBlock",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_feeRate",
				"type": "uint256"
			}
		],
		"name": "setFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_hook",
				"type": "address"
			}
		],
		"name": "setFeeHook",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "setFeeTo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "underlying",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "epoch",
				"type": "uint256"
			}
		],
		"name": "settle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "settledEpoch",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_underlying",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "_report",
				"type": "bytes"
			},
			{
				"internalType": "bytes32[]",
				"name": "_rs",
				"type": "bytes32[]"
			},
			{
				"internalType": "bytes32[]",
				"name": "_ss",
				"type": "bytes32[]"
			},
			{
				"internalType": "bytes32",
				"name": "_rawVs",
				"type": "bytes32"
			}
		],
		"name": "transmit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "underlyingInfos",
		"outputs": [
			{
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "oracle",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "aggregator",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "userClaimedEpoch",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "userUnfeedEpoch",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "utb",
		"outputs": [
			{
				"internalType": "contract Standard_Token",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},{
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_initialAmount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_tokenName",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "_decimalUnits",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_tokenSymbol",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "AssetNotListed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "SlippageExceeded",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroAmount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "lpAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            }
        ],
        "name": "LiquidityAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "lpAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            }
        ],
        "name": "LiquidityRemoved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "FEE_DIV",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "FEE_RATE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amountIn",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minLpAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "addLiquidity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            }
        ],
        "name": "addToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allAssets",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "remaining",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "assets",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balances",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amountIn",
                "type": "uint256"
            }
        ],
        "name": "calcAddLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountInAfterFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lpAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenOut",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_lpAmount",
                "type": "uint256"
            }
        ],
        "name": "calcRemoveLiquidity",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "outAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "outAmountAfterFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fee",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            }
        ],
        "name": "delToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "feeDistributor",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "feeReserve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "isListed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "oracle",
        "outputs": [
            {
                "internalType": "contract IMultipleOracle",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenOut",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_lpAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_minOut",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "removeLiquidity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_feeDistributor",
                "type": "address"
            }
        ],
        "name": "setFeeDistributor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_oracle",
                "type": "address"
            }
        ],
        "name": "setOracle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_recipient",
                "type": "address"
            }
        ],
        "name": "withdrawFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },{
        "inputs": [
            {
                "internalType": "string",
                "name": "underlying",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "epoch",
                "type": "uint256"
            }
        ],
        "name": "getEpochRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "callRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "putRate",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

const userAddress = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
const utbAddress = "0xd4b8aF86B3150Ee84e70843dF8b512293f2540f2";
const optionsAddress = "0xb10D3e6A65De36fD715cf49F592343A10298CaB3";

// create a new contract object, providing the ABI and address
const optionsContract = new web3.eth.Contract(abiEx, optionsAddress);
const utbContract = new web3.eth.Contract(abiEx, utbAddress);

async function getCurrentEpoch() {
    try {
        const currentEpoch = await contract.methods.currentEpoch("ETH").call();
        return currentEpoch;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


// 下单
{
    // 发起交易的地址和私钥
    const fromAddress = '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E'; // 发送者地址
    const privateKey = '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd'; // 发送者私钥

    //下单量
    const amount = web3.utils.toWei('2', 'ether');

    async function buildAndSendApproveTx() {
        const nonce = await web3.eth.getTransactionCount(fromAddress);

        // 构建授权交易对象
        const approveTxObject = {
            from: fromAddress,
            to: utbAddress,
            gas: 301000,
            gasPrice: '50000000000',
            nonce: nonce,
            data: utbContract.methods.approve(
                optionsAddress,
                amount
            ).encodeABI(),
        };

        try {
            // 签名授权交易
            const signedTx = await web3.eth.accounts.signTransaction(approveTxObject, privateKey);

            // 发送已签名的交易
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Transaction receipt:', receipt);

            async function buildAndSendOrderTx() {
                const nonce = await web3.eth.getTransactionCount(fromAddress);
                // 构建下单交易对象
                const txObject = {
                    from: fromAddress,
                    to: optionsAddress,
                    gas: 301000, // 适当的 gas 数量
                    nonce: nonce,
                    gasPrice: '50000000000', // 设置 gas 价格，注意这里要用字符串
                    data: contract.methods.betC(
                        "ETH",
                        amount,         //下单量
                        userAddress,
                        true
                    ).encodeABI(),
                };


                // 签名下单交易
                const signedTx = web3.eth.accounts.signTransaction(txObject, privateKey)
                    .then(async (signedTx) => {
                        // 发送已签名的交易
                        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                        const epoch = await getCurrentEpoch();
                        function calculateEpoch(blockNumber: number): number {
                            return blockNumber - (blockNumber % 100);
                        }
                        const transferEpoch = web3.utils.toBigInt(epoch);
                        // 每轮是多少个区块组成
                        contract.methods
                            .epochPeriod("ETH")
                            .call()
                            .then(result => console.log("epochPeriod:", result));

                        // 赔率分母
                        contract.methods
                            .RATE_DIVIDER()
                            .call()
                            .then(result => console.log("RATE_DIVIDER:", result));


                        //每轮当到第几个区块时停止下注
                        contract.methods
                            .epochStopBetBlockCount("ETH")
                            .call()
                            .then(result => console.log("epochStopBetBlockCount:", result));

                        // 当前轮数要结束的区块 参数：轮数
                        contract.methods
                            .getEpochEnd("ETH",transferEpoch)
                            .call()
                            .then(result => console.log("getEpochEnd:", result));
                        // 获取对应轮数所有用户的下单数据
                        contract.methods
                            .getEpochInfo("ETH",transferEpoch)
                            .call()
                            .then(result => console.log("getEpochInfo:", result));

                        // 获取用户对应轮数下单列表
                        contract.methods
                            .getUserEpochInfo("ETH",userAddress, transferEpoch)
                            .call()
                            .then(result => console.log("getUserEpochInfo:", result));

                        console.log('Transaction receipt:', receipt);
                    });
            }
            buildAndSendOrderTx();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    buildAndSendApproveTx();
}



