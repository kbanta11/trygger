import { EventEmitter } from "stream";
import { ProcessedTransaction } from "../models/transaction";

export class TransactionEmitter extends EventEmitter {
    constructor() {
        super();
    }

    processTransaction(tx: ProcessedTransaction) {
        this.emit('transaction', tx);
    }
}