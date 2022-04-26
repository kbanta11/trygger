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
exports.ServerHelpers = void 0;
const __1 = require("..");
const trigger_1 = require("../models/trigger");
exports.ServerHelpers = {
    CreateNewTrygger: (tryggerData, txEmitter) => __awaiter(void 0, void 0, void 0, function* () {
        var { data, error } = yield __1.supabase.from('tryggers').insert([Object.assign(Object.assign({}, tryggerData), { active: true })]);
        console.log(`Trygger Data: ${JSON.stringify(data)}\nError: ${JSON.stringify(error)}`);
        let success = false;
        if (!error) {
            let n = data[0];
            if (n) {
                //create trygger listener and add to 
                let trygger = new trigger_1.Trygger({ id: n['id'], createdAt: n['created_at'],
                    user_id: n['userId'], chain: n['chain'], action: n['action'], action_details: n['actionDetails'],
                    trigger_type: n['type'], trigger_details: n['triggerDetails'], active: n['active'] });
                let newTrigger = new trigger_1.WalletMonitorTrigger(trygger);
                success = true;
                return { success, newTrigger };
            }
        }
        return { success };
    })
};
//# sourceMappingURL=helpers.js.map