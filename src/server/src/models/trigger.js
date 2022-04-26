"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletMonitorTrigger = exports.Trygger = void 0;
const ethers_1 = require("ethers");
const sendText_1 = require("../utils/sendText");
const sendEmail_1 = require("../utils/sendEmail");
class Trygger {
    constructor(params) {
        this.id = params.id;
        this.createdAt = params.createdAt;
        this.user_id = params.user_id;
        this.chain = params.chain;
        this.action = params.action;
        this.action_details = params.action_details;
        this.trigger_type = params.trigger_type;
        this.trigger_details = params.trigger_details;
        this.active = params.active;
    }
}
exports.Trygger = Trygger;
class WalletMonitorTrigger {
    //criteria: (tx: ProcessedTransaction) => boolean = (tx: ProcessedTransaction) => false;
    //action: (tx: ProcessedTransaction) => void = (tx: ProcessedTransaction) => {};
    constructor(_trygger) {
        this.trygger = _trygger;
        //build criteria
        this.criteria = (tx) => {
            var _a, _b;
            let watchTo = (_a = this.trygger.trigger_details['to']) !== null && _a !== void 0 ? _a : true;
            let watchFrom = (_b = this.trygger.trigger_details['from']) !== null && _b !== void 0 ? _b : true;
            let watchAddress = this.trygger.trigger_details['walletAddress'];
            let qualifies = false;
            if (watchTo && tx.to === watchAddress) {
                qualifies = true;
            }
            if (watchFrom && tx.from === watchAddress) {
                qualifies = true;
            }
            return qualifies;
        };
        this.action = (tx) => {
            var _a, _b, _c;
            let message = `Wallet Activity Alert

A transaction involving a wallet you are watching has been detected:

Trygger ID: ${this.trygger.id}
From: ${tx.from}
To: ${tx.to}
Value: ${ethers_1.ethers.utils.formatEther(tx.value)}
Block: ${tx.blockNumber}
${tx.timestamp ? new Date(((_a = tx.timestamp) !== null && _a !== void 0 ? _a : 0) * 1000) : ''}`;
            if (this.trygger.action === 'sms') {
                //send text alert
                (0, sendText_1.sendSMS)(message, (_b = this.trygger.action_details['phoneNumber']) !== null && _b !== void 0 ? _b : '');
            }
            if (this.trygger.action === 'email') {
                //send email alert
                const msg = {
                    to: (_c = this.trygger.action_details['email']) !== null && _c !== void 0 ? _c : '',
                    from: 'kbantadevelopment@gmail.com',
                    subject: 'Wallet Activity Alert - Trygger.xyz',
                    text: message
                };
                (0, sendEmail_1.sendEmail)(msg);
            }
        };
    }
}
exports.WalletMonitorTrigger = WalletMonitorTrigger;
//# sourceMappingURL=trigger.js.map