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
exports.ProcessedTransaction = void 0;
const ethers_1 = require("ethers");
const QUIKNODE_ETHEREUM_URL = process.env.QUIKNODE_ETHEREUM_URL;
const provider = new ethers_1.ethers.providers.JsonRpcProvider(QUIKNODE_ETHEREUM_URL);
function isContractAddress(address) {
    return __awaiter(this, void 0, void 0, function* () {
        return ((yield provider.getCode(address)) !== "0x");
    });
}
class ProcessedTransaction {
    constructor(params) {
        this.fromIsContract = false;
        this.toIsContract = false;
        this.chainId = params.chainId;
        this.hash = params.hash;
        this.blockHash = params.blockHash;
        this.blockNumber = params.blockNumber;
        this.confirmations = params.confirmations;
        this.from = params.from;
        this.fromIsContract = params.fromIsContract;
        this.to = params.to;
        this.toIsContract = params.toIsContract;
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
        this.type = ethers_1.ethers.utils.TransactionTypes[params.type];
        this.timestamp = params.timestamp;
    }
}
exports.ProcessedTransaction = ProcessedTransaction;
//# sourceMappingURL=transaction.js.map