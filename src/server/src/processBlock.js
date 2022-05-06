"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockProcessor = void 0;
const transaction_1 = require("./models/transaction");
class BlockProcessor {
    constructor(_provider, _emitter, _blockTime, _lastBlockNumber) {
        this.lastBlockNumber = -1;
        this.provider = _provider;
        this.emitter = _emitter;
        this.blockTime = _blockTime;
        this.lastBlockNumber = _lastBlockNumber !== null && _lastBlockNumber !== void 0 ? _lastBlockNumber : -1;
    }
    isContractAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let isContract = false;
            try {
                isContract = ((yield this.provider.getCode(address)) !== "0x");
            }
            catch (e) { }
            return isContract;
        });
    }
    startProcessing() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let blockNumber = yield this.provider.getBlockNumber();
                console.log(`Current Block: ${blockNumber} / Last Processed Block: ${this.lastBlockNumber}`);
                while (this.lastBlockNumber < 0 || blockNumber > this.lastBlockNumber) {
                    yield this.processBlock(this.lastBlockNumber < 0 ? blockNumber : this.lastBlockNumber + 1);
                }
            }
            catch (e) {
                console.log(`Error processing block: ${JSON.stringify(e)}`);
            }
            setTimeout(this.startProcessing.bind(this), this.blockTime);
        });
    }
    processBlock(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            let block = yield this.provider.getBlock(blockNumber);
            console.log('Block: %s / Timestamp: %s / TXs: ', blockNumber, block.timestamp, block.transactions.length);
            block.transactions.forEach((t) => __awaiter(this, void 0, void 0, function* () {
                console.log('TX: %s', t);
                let tx = yield this.provider.getTransaction(t);
                if (tx) {
                    const processedTx = new transaction_1.ProcessedTransaction({
                        chainId: tx.chainId,
                        hash: tx.hash,
                        blockHash: tx.blockHash,
                        blockNumber: tx.blockNumber,
                        confirmations: tx.confirmations,
                        from: tx.from,
                        //fromIsContract: await this.isContractAddress(tx.from!),
                        to: tx.to,
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
                        type: tx.type,
                        timestamp: block.timestamp
                    });
                    this.emitter.processTransaction(processedTx);
                }
            }));
            this.lastBlockNumber = blockNumber;
        });
    }
}
exports.BlockProcessor = BlockProcessor;
//# sourceMappingURL=processBlock.js.map