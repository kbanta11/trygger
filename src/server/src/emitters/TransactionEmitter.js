"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEmitter = void 0;
const stream_1 = require("stream");
class TransactionEmitter extends stream_1.EventEmitter {
    constructor() {
        super();
    }
    processTransaction(tx) {
        this.emit('transaction', tx);
    }
}
exports.TransactionEmitter = TransactionEmitter;
//# sourceMappingURL=TransactionEmitter.js.map