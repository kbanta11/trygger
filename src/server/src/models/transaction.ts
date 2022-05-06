import { ethers } from 'ethers'

const QUIKNODE_ETHEREUM_URL = process.env.QUIKNODE_ETHEREUM_URL;
const provider = new ethers.providers.JsonRpcProvider(QUIKNODE_ETHEREUM_URL);

async function isContractAddress(address: string) {
    return (await provider.getCode(address) !== "0x");
}

interface IProcessedTransaction {
    chainId: number;
    hash: string;
    blockHash: string;
    blockNumber: number;
    confirmations: number;
    from: string;
    //fromIsContract: boolean;
    to: string;
    //toIsContract: boolean;
    value: ethers.BigNumberish;
    gasPrice?: ethers.BigNumberish;
    gasLimit?: ethers.BigNumberish;
    maxFeePerGas?: ethers.BigNumberish;
    maxPriorityFeePerGas?: ethers.BigNumberish;
    nonce: number;
    data: string;
    r?: string;
    s?: string;
    v?: number;
    type?: number;
    timestamp?: number;
}

export class ProcessedTransaction {
    chainId: number;
    hash: string;
    blockHash: string;
    blockNumber: number;
    confirmations: number;
    from?: string;
    //fromIsContract: boolean = false;
    to?: string;
    //toIsContract: boolean = false;
    value: ethers.BigNumberish;
    gasPrice?: ethers.BigNumberish;
    gasLimit?: ethers.BigNumberish;
    maxFeePerGas?: ethers.BigNumberish;
    maxPriorityFeePerGas?: ethers.BigNumberish;
    nonce: number;
    data: string;
    r?: string;
    s?: string;
    v?: number;
    type?: string;
    timestamp?: number;

    constructor(params: IProcessedTransaction) {
            this.chainId = params.chainId;
            this.hash = params.hash;
            this.blockHash = params.blockHash;
            this.blockNumber = params.blockNumber;
            this.confirmations = params.confirmations;
            this.from = params.from;
            //this.fromIsContract = params.fromIsContract;
            this.to = params.to;
            //this.toIsContract = params.toIsContract;
            this.value = params.value;
            this.gasPrice = params.gasPrice;
            this.gasLimit = params.gasLimit;
            this.maxFeePerGas = params.maxFeePerGas;
            this.maxPriorityFeePerGas = params.maxPriorityFeePerGas;
            this.nonce = params.nonce;
            this.data = params.data;
            this.r = params.r;
            this.s = params.s;
            this.v = params.v;
            this.type = ethers.utils.TransactionTypes[params.type!];
            this.timestamp = params.timestamp;
    }
}