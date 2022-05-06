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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
require('dotenv').config();
const ethers_1 = require("ethers");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const trigger_1 = require("./models/trigger");
const TransactionEmitter_1 = require("./emitters/TransactionEmitter");
const processBlock_1 = require("./processBlock");
const sendEmail_1 = require("./utils/sendEmail");
const supabase_js_1 = require("@supabase/supabase-js");
const express_2 = __importDefault(require("express"));
const helpers_1 = require("./utils/helpers");
const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
exports.supabase = (0, supabase_js_1.createClient)(supabaseURL, supabaseKey);
const QUIKNODE_ETHEREUM_URL = process.env.QUIKNODE_ETHEREUM_URL;
//const QUIKNODE_RINKEBY_URL = process.env.QUIKNODE_RINKEBY_URL;
const provider = new ethers_1.ethers.providers.JsonRpcProvider(QUIKNODE_ETHEREUM_URL);
const txEmitter = new TransactionEmitter_1.TransactionEmitter();
let erc20abi = [
    "event Transfer(address indexed src, address indexed dst, uint val)"
];
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    //emit transactions and process active tryggers
    txEmitter.on("transaction", (tx) => {
        var _a;
        ((_a = activeTryggers['wallet']) !== null && _a !== void 0 ? _a : []).forEach((t) => {
            if (t.criteria(tx)) {
                t.action(tx);
            }
        });
    });
    let activeTryggers = {};
    //function to remove trygger from active tryggers list
    function removeActiveTrygger(type, id) {
        /*
        let trygger = activeTryggers[type].filter((trigger, index, arr) => {
            return trigger.id === id;
        })[0]
        */
        //remove trygger by setting active tryggers to filtered array
        activeTryggers[type] = activeTryggers[type].filter((trigger, index, arr) => {
            //console.log(`Removing ID: ${id}, This ID: ${trigger.trygger.id}, Keeping: ${trigger.trygger.id !== id}`);
            return trigger.trygger.id !== id;
        });
    }
    const server = (0, express_1.default)();
    server.use((0, cors_1.default)({
        origin: ['https://trygger.xyz']
    }));
    server.use(body_parser_1.default.urlencoded({ extended: false }));
    server.use(body_parser_1.default.json());
    //get all current active tryggers and create listener
    var { data, error } = yield exports.supabase.from('tryggers').select().eq('active', true);
    if (!error) {
        data === null || data === void 0 ? void 0 : data.forEach((n) => {
            let trygger = new trigger_1.Trygger({ id: n['id'], createdAt: n['created_at'],
                user_id: n['userId'], chain: n['chain'], action: n['action'], action_details: n['actionDetails'],
                trigger_type: n['type'], trigger_details: n['triggerDetails'], active: n['active'] });
            if (trygger.trigger_type === 'wallet') {
                let newTrigger = new trigger_1.WalletMonitorTrigger(trygger);
                activeTryggers[`${trygger.trigger_type}`] ? activeTryggers[`${trygger.trigger_type}`].push(newTrigger) : activeTryggers[`${trygger.trigger_type}`] = [newTrigger];
            }
        });
    }
    //setup api endpoints
    server.post('/checkERC20', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let contract = new ethers_1.Contract(req.body.address, erc20abi, provider);
        let filter = contract.filters.Transfer();
        let resp = contract.queryFilter(filter);
        console.log(`Resp: ${resp}`);
        return res.send({ error: false });
    }));
    server.post("/sendContactForm", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        const msg = {
            to: 'contact@trygger.xyz',
            from: 'kbantadevelopment@gmail.com',
            subject: 'Contact Form Submission',
            text: `New Contact Form Message from ${req.body.name}

Email: ${req.body.email}

Message: ${req.body.message}
            `
        };
        try {
            let result = yield (0, sendEmail_1.sendEmail)(msg);
            if (result) {
                console.log('SUCCESS: %s', JSON.stringify(result));
                return res.send({ result: 'SUCCESS', success: true });
            }
            else {
                console.log('Error: %s', express_2.default);
                return res.send({ error: 'Message could not be sent.', success: false });
            }
        }
        catch (e) {
            console.log('Error: %s', e);
            return res.send({ error: 'Message could not be sent.', success: false });
        }
    }));
    server.post('/createUserWithTrygger', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log(req.body);
        var { data, error } = yield exports.supabase.from('users').select().or(`email.eq.${req.body.actionDetails['email']},phone_number.eq.${req.body.actionDetails['phoneNumber']}`);
        //use user UID if it exists (it should due to trigger on DB) to check if user has any existing tryggers
        let uid = data && data[0] ? data[0]['id'] : null;
        //if user has existing tryggers, return false (not new user) and don't create a new trygger
        var { data, error } = yield exports.supabase.from('tryggers').select().eq('userId', uid);
        let existingUser = (_a = (data && data.length > 0)) !== null && _a !== void 0 ? _a : false;
        let createdTrygger = false;
        if (!existingUser) {
            //create trygger
            let tryggerData = {
                userId: uid,
                chain: req.body.chain,
                action: req.body.action,
                actionDetails: req.body.actionDetails,
                type: req.body.type,
                triggerDetails: req.body.triggerDetails,
            };
            let { success, newTrigger } = yield helpers_1.ServerHelpers.CreateNewTrygger(tryggerData, txEmitter);
            if (success && newTrigger) {
                createdTrygger = success;
                let trygger = newTrigger.trygger;
                activeTryggers[`${trygger.trigger_type}`] ? activeTryggers[`${trygger.trigger_type}`].push(newTrigger) : activeTryggers[`${trygger.trigger_type}`] = [newTrigger];
            }
        }
        return res.send({ existing: existingUser, createdTrygger: createdTrygger });
    }));
    server.post('/createNewTrygger', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let tryggerData = {
            userId: req.body.userId,
            chain: req.body.chain,
            action: req.body.action,
            actionDetails: req.body.actionDetails,
            type: req.body.type,
            triggerDetails: req.body.triggerDetails,
        };
        let { success, newTrigger } = yield helpers_1.ServerHelpers.CreateNewTrygger(tryggerData, txEmitter);
        if (success && newTrigger) {
            let trygger = newTrigger.trygger;
            activeTryggers[`${trygger.trigger_type}`] ? activeTryggers[`${trygger.trigger_type}`].push(newTrigger) : activeTryggers[`${trygger.trigger_type}`] = [newTrigger];
        }
        return res.send({ success: success });
    }));
    server.post('/deleteTrygger', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //remove trygger from active tryggers and delete trygger from database
        removeActiveTrygger(req.body.type, req.body.id);
        const { data, error } = yield exports.supabase.from('tryggers').delete().eq('id', req.body.id);
        if (error) {
            return res.send({ success: false });
        }
        console.log(`Active Tryggers: ${JSON.stringify(activeTryggers)}`);
        return res.send({ success: true });
    }));
    server.post('/deactivateTrygger', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //remove trygger from active tryggers and set active to false
        removeActiveTrygger(req.body.type, req.body.id);
        const { data, error } = yield exports.supabase.from('tryggers').update({ active: false }).match({ id: req.body.id });
        if (error) {
            return res.send({ success: false });
        }
        console.log(`Active Tryggers: ${JSON.stringify(activeTryggers)}`);
        return res.send({ success: true });
    }));
    server.post('/activateTrygger', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //create trygger object from database and add to active tryggers
        let { data, error } = yield exports.supabase.from('tryggers').update({ active: true }).match({ id: req.body.id });
        console.log(`Activated Trygger: ${JSON.stringify(data)}`);
        if (error) {
            return res.send({ success: false });
        }
        else {
            let n = data[0];
            if (n) {
                //create trygger listener and add to 
                let trygger = new trigger_1.Trygger({ id: n['id'], createdAt: n['created_at'],
                    user_id: n['userId'], chain: n['chain'], action: n['action'], action_details: n['actionDetails'],
                    trigger_type: n['type'], trigger_details: n['triggerDetails'], active: n['active'] });
                let newTrigger = new trigger_1.WalletMonitorTrigger(trygger);
                activeTryggers[`${trygger.trigger_type}`] ? activeTryggers[`${trygger.trigger_type}`].push(newTrigger) : activeTryggers[`${trygger.trigger_type}`] = [newTrigger];
                console.log(`Active Tryggers: ${JSON.stringify(activeTryggers)}`);
                return res.send({ success: true });
            }
        }
        console.log(`Active Tryggers: ${JSON.stringify(activeTryggers)}`);
        return res.send({ success: false });
    }));
    server.post('/saveProEmail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var { data, error } = yield exports.supabase.from('pro_waitlist').insert({
            email: req.body.email,
            created_at: new Date(),
        });
        if (error) {
            res.send({ success: false, error: error });
        }
        else {
            res.send({ success: true, email: req.body.email });
        }
    }));
    //start blockProcessors
    //const trigger = new TransactionTrigger(txEmitter, criteria, action);
    const ethProcessor = new processBlock_1.BlockProcessor(provider, txEmitter, 10000);
    ethProcessor.startProcessing();
    server.listen(process.env.PORT || 3001, () => {
        console.log('Server is running...');
    });
});
main();
//# sourceMappingURL=index.js.map