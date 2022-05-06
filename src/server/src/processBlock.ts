import { ethers } from "ethers";
import { EventEmitter } from "stream";
import { TransactionEmitter } from "./emitters/TransactionEmitter";
import { ProcessedTransaction } from "./models/transaction";

export class BlockProcessor {
    provider: ethers.providers.BaseProvider;
    emitter: TransactionEmitter;
    blockTime: number;
    lastBlockNumber: number = -1;

    constructor(_provider: ethers.providers.BaseProvider, _emitter: TransactionEmitter, _blockTime: number, _lastBlockNumber?: number) {
        this.provider = _provider;
        this.emitter = _emitter;
        this.blockTime = _blockTime;
        this.lastBlockNumber = _lastBlockNumber ?? -1;
    }

    async isContractAddress(address: string) {
        let isContract = false;
        try {
            isContract = (await this.provider.getCode(address) !== "0x")
        } catch (e) {}
        return isContract;
    }

    async startProcessing() {
        try {
            let blockNumber: number = await this.provider.getBlockNumber();
            console.log(`Current Block: ${blockNumber} / Last Processed Block: ${this.lastBlockNumber}`);
            while(this.lastBlockNumber < 0 || blockNumber > this.lastBlockNumber) {
                await this.processBlock(this.lastBlockNumber < 0 ? blockNumber : this.lastBlockNumber + 1);
            }
        } catch (e) {
            console.log(`Error processing block: ${JSON.stringify(e)}`);
        }
        setTimeout(this.startProcessing.bind(this), this.blockTime);
    }

    async processBlock(blockNumber: number) {
        let block = await this.provider.getBlock(blockNumber); 
        console.log('Block: %s / Timestamp: %s / TXs: ', blockNumber, block.timestamp, block.transactions.length);

        block.transactions.forEach(async (t: string) => {
            console.log('TX: %s', t);
            let tx = await this.provider.getTransaction(t);
            if (tx) {
                const processedTx = new ProcessedTransaction({
                    chainId: tx.chainId,
                    hash: tx.hash,
                    blockHash: tx.blockHash!,
                    blockNumber: tx.blockNumber!,
                    confirmations: tx.confirmations,
                    from: tx.from,
                    //fromIsContract: await this.isContractAddress(tx.from!),
                    to: tx.to!,
                    //toIsContract: await this.isContractAddress(tx.to!),
                    value: tx.value,
                    gasPrice: tx.gasPrice,
                    gasLimit: tx.gasLimit,
                    maxFeePerGas: tx.maxFeePerGas,
                    maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
                    nonce: tx.nonce,
                    data: tx.data,
                    r: tx.r,
                    s: tx.s,
                    v: tx.v,
                    type: tx.type!,
                    timestamp: block.timestamp
                });
                this.emitter.processTransaction(processedTx);   
            }
        })
        this.lastBlockNumber = blockNumber;
    }
}