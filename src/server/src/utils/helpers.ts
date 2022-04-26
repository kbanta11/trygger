import { supabase } from "..";
import { TransactionEmitter } from "../emitters/TransactionEmitter";
import { Trygger, WalletMonitorTrigger } from "../models/trigger";

export const ServerHelpers = {
    CreateNewTrygger: async (tryggerData: IFormData, txEmitter: TransactionEmitter) => {
        var { data, error } = await supabase.from('tryggers').insert([{...tryggerData, active: true}]);
        console.log(`Trygger Data: ${JSON.stringify(data)}\nError: ${JSON.stringify(error)}`);
        let success = false;
        if(!error) {
            let n = data![0];
            if(n) {
                //create trygger listener and add to 
                let trygger = new Trygger({id: n['id'], createdAt: n['created_at'], 
                    user_id: n['userId'], chain: n['chain'], action: n['action'], action_details: n['actionDetails'],
                    trigger_type: n['type'], trigger_details: n['triggerDetails'], active: n['active']});
                let newTrigger = new WalletMonitorTrigger(trygger);
                
                success = true;
                return { success, newTrigger };
            }
        }
        return { success };
    }
}

export interface IFormData {
    userId: string;
    chain: string;
    type: string;
    action: string;
    actionDetails: any;
    triggerDetails: any;
}