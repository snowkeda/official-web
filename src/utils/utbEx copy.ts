
import { Web3 } from "web3";

// set a provider in the sepolia testnet using node rpc url
const web3 = new Web3("http://dev.rpc-arb.geagle.top");

// interacting with the smart contract
export const abi = [
    {
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
    }
] as const;

export const userAddress = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
export const utbAddress = "0xcDE89Fb72c0Dc26D30D1918C2cB323B303De87f9";
export const usdtAddress = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";

// create a new contract object, providing the ABI and address
export const contract = new web3.eth.Contract(abi, utbAddress);
export const usdtContract = new web3.eth.Contract(abi, usdtAddress);


// swap手续费分子
contract.methods
    .FEE_RATE()
    .call()
    .then(console.log);

// swap手续费分母
contract.methods
    .FEE_DIV()
    .call()
    .then(console.log);
// 计算swap fee = swap手续费分子 / swap手续费分母


contract.methods
    .balanceOf(userAddress)
    .call()
    .then(console.log);

// 发起交易的地址和私钥
const fromAddress = '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E'; // 发送者地址
const privateKey = '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd'; // 发送者私钥


// 每个币种能兑换多少UTB


//交易量
const amount2 = web3.utils.toBigInt(200000000);
const amount = web3.utils.toBigInt(200000000);
export const ustdAmount = web3.utils.toBigInt(2000000);
// 进行USDT授权给UTB合约
{
    async function buildAndSendApproveTx() {
        const nonce = await web3.eth.getTransactionCount(fromAddress);

        // 构建授权交易对象
        const approveTxObject = {
            from: fromAddress,
            to: usdtAddress,
            gas: 301000,
            gasPrice: '50000000000',
            nonce: nonce,
            data: usdtContract.methods.approve(
                utbAddress,//UTB合约地址
                amount2//授权金额
            ).encodeABI(),
        };

        try {
            // 签名授权交易
            const signedTx = await web3.eth.accounts.signTransaction(approveTxObject, privateKey);

            // 发送已签名的交易
            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Transaction receipt:', receipt);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    buildAndSendApproveTx();

}


// 进行兑换
{
    async function buildAndSendOrderTx() {
        const nonce = await web3.eth.getTransactionCount(fromAddress);
        // 构建下单交易对象
        const txObject = {
            from: fromAddress,
            to: utbAddress,
            gas: 301000, // 适当的 gas 数量
            gasPrice: '50000000000', // 设置 gas 价格，注意这里要用字符串
            nonce: nonce,
            data: contract.methods.addLiquidity(
                usdtAddress, //兑换前的代币合约地址
                amount,         //下单量
                amount,         //能接受最小获得量 (滑点)
                userAddress    //用户地址
            ).encodeABI(),
        };
        // 签名下单交易
        const signedTx = web3.eth.accounts.signTransaction(txObject, privateKey)
            .then(async (signedTx) => {
                // 发送已签名的交易
                const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                console.log('Transaction receipt:', receipt);
            });
    }
    buildAndSendOrderTx();
}


// UTB代币兑换其他代币

{
    async function buildAndSendOutTx() {
        const outUtbAmount = web3.utils.toBigInt(110473272642579357);
        const minAmount = web3.utils.toBigInt(10);
        const nonce = await web3.eth.getTransactionCount(fromAddress);
        // 构建下单交易对象
        const txObject = {
            from: fromAddress,
            to: utbAddress,
            gas: 301000, // 适当的 gas 数量
            gasPrice: '50000000000', // 设置 gas 价格，注意这里要用字符串
            nonce: nonce,
            data: contract.methods.removeLiquidity(
                usdtAddress,//兑换后的代币合约地址
                outUtbAmount,         //要兑换的UTB数量
                minAmount,//最小能接受兑换后的代币数量（滑点
                userAddress//用户地址
            ).encodeABI(),
        };
        // 签名下单交易
        const signedTx = web3.eth.accounts.signTransaction(txObject, privateKey)
            .then(async (signedTx) => {
                // 发送已签名的交易
                const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                console.log('Transaction receipt:', receipt);
            });
    }
    buildAndSendOutTx();
}

