import { EventEmitter } from "stream";
import { ethers } from "ethers";
import { ProcessedTransaction } from "./transaction";
import { sendSMS } from "../utils/sendText";
import { sendEmail } from "../utils/sendEmail";

interface ITrygger{
    id?: number;
    createdAt?: Date;
    user_id: string;
    chain: string;
    action: string;
    action_details?: any;
    trigger_type: string;
    trigger_details?: any;
    active: boolean;
}

export class Trygger {
    id?: number;
    createdAt?: Date;
    user_id: string;
    chain: string;
    action: string;
    action_details?: any;
    trigger_type: string;
    trigger_details?: any;
    active: boolean;

    constructor(params: ITrygger) {
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

export class WalletMonitorTrigger {
    trygger: Trygger;
    criteria: (tx: ProcessedTransaction) => boolean;
    action: (tx: ProcessedTransaction) => void;
    //criteria: (tx: ProcessedTransaction) => boolean = (tx: ProcessedTransaction) => false;
    //action: (tx: ProcessedTransaction) => void = (tx: ProcessedTransaction) => {};
    
    constructor(_trygger: Trygger) {
        this.trygger = _trygger;
        //build criteria
        this.criteria = (tx: ProcessedTransaction) => {
            let watchTo = this.trygger.trigger_details['to'] ?? true;
            let watchFrom = this.trygger.trigger_details['from'] ?? true;
            let watchAddress = this.trygger.trigger_details['walletAddress'];
            let qualifies = false;
            if(watchTo && tx.to === watchAddress) {
                qualifies = true;
            }
            if(watchFrom && tx.from === watchAddress) {
                qualifies = true;
            }
            return qualifies;
        }

        this.action = (tx: ProcessedTransaction) => {
            let message = `Wallet Activity Alert

A transaction involving a wallet you are watching has been detected:

Trygger ID: ${this.trygger.id}
From: ${tx.from}
To: ${tx.to}
Value: ${ethers.utils.formatEther(tx.value)}
Block: ${tx.blockNumber}
${tx.timestamp ? new Date((tx.timestamp ?? 0) * 1000) : ''}`

            if(this.trygger.action === 'sms') {
                //send text alert
                sendSMS(message, this.trygger.action_details['phoneNumber'] ?? '');
            }
            if(this.trygger.action === 'email') {
                //send email alert
                const msg = {
                    to: this.trygger.action_details['email'] ?? '',
                    from: 'kbantadevelopment@gmail.com',
                    subject: 'Wallet Activity Alert - Trygger.xyz',
                    text: message
                };
                sendEmail(msg);
            }
        }    
    }
}