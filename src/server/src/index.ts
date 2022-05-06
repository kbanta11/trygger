require('dotenv').config();
import { BigNumberish, Contract, ethers } from 'ethers';
import express from 'express';
import bodyParser from 'body-parser';
import { ProcessedTransaction } from './models/transaction';
import { WalletMonitorTrigger, Trygger } from './models/trigger';
import { TransactionEmitter } from './emitters/TransactionEmitter';
import { BlockProcessor } from './processBlock';
import { sendEmail } from './utils/sendEmail';
import { createClient } from '@supabase/supabase-js';
import e from 'express';
import { IFormData, ServerHelpers } from './utils/helpers';

const supabaseURL = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseURL!, supabaseKey!);

const QUIKNODE_ETHEREUM_URL = process.env.QUIKNODE_ETHEREUM_URL;
//const QUIKNODE_RINKEBY_URL = process.env.QUIKNODE_RINKEBY_URL;
const provider = new ethers.providers.JsonRpcProvider(QUIKNODE_ETHEREUM_URL);
const txEmitter = new TransactionEmitter();

interface IMap {
    [key: string]: any[];
}

let erc20abi = [
    "event Transfer(address indexed src, address indexed dst, uint val)"
  ];

const main = async() => {
    //emit transactions and process active tryggers
    txEmitter.on("transaction", (tx: ProcessedTransaction) => {
        (activeTryggers['wallet'] ?? []).forEach((t: WalletMonitorTrigger) => {
            if(t.criteria(tx)) {
                t.action(tx);
            }
        });
    });

    let activeTryggers: IMap = {};

    //function to remove trygger from active tryggers list
    function removeActiveTrygger(type: string, id: number) {
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

    const server = express();
    server.use(bodyParser.urlencoded({ extended: false}));
    server.use(bodyParser.json());

    //get all current active tryggers and create listener
    var { data, error } = await supabase.from('tryggers').select().eq('active', true);
    if(!error) {
        data?.forEach((n) => {
            let trygger = new Trygger({id: n['id'], createdAt: n['created_at'], 
                user_id: n['userId'], chain: n['chain'], action: n['action'], action_details: n['actionDetails'],
                trigger_type: n['type'], trigger_details: n['triggerDetails'], active: n['active']});
            if(trygger.trigger_type === 'wallet') {
                let newTrigger = new WalletMonitorTrigger(trygger);
                activeTryggers[`${trygger.trigger_type}`] ? activeTryggers[`${trygger.trigger_type}`].push(newTrigger) : activeTryggers[`${trygger.trigger_type}`] = [newTrigger];
            }
        });
    }

    //setup api endpoints
    server.post('/checkERC20', async (req, res) => {
        let contract = new Contract(req.body.address, erc20abi, provider);
        let filter = contract.filters.Transfer();
        let resp = contract.queryFilter(filter);
        console.log(`Resp: ${resp}`);
        return res.send({error: false})
    });

    server.post("/sendContactForm", async (req, res) => {
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
            let result = await sendEmail(msg);
            if(result) {
                console.log('SUCCESS: %s', JSON.stringify(result));
                return res.send({result: 'SUCCESS', success: true});
            } else {
                console.log('Error: %s', e);
                return res.send({error: 'Message could not be sent.', success: false});
            }
        } catch (e) {
            console.log('Error: %s', e);
            return res.send({error: 'Message could not be sent.', success: false});
        }
    });

    server.post('/createUserWithTrygger', async (req, res) => {
        console.log(req.body);     
        var { data, error } = await supabase.from('users').select().or(`email.eq.${req.body.actionDetails['email']},phone_number.eq.${req.body.actionDetails['phoneNumber']}`);
        //use user UID if it exists (it should due to trigger on DB) to check if user has any existing tryggers
        let uid = data && data[0] ? data[0]['id'] : null;
        //if user has existing tryggers, return false (not new user) and don't create a new trygger
        var { data, error } = await supabase.from('tryggers').select().eq('userId', uid);
        let existingUser: boolean = (data && data.length > 0) ?? false;
        let createdTrygger = false;
        if(!existingUser) {
            //create trygger
            let tryggerData: IFormData = {
                userId: uid,
                chain: req.body.chain,
                action: req.body.action,
                actionDetails: req.body.actionDetails,
                type: req.body.type,
                triggerDetails: req.body.triggerDetails,
            };

            let { success, newTrigger} = await ServerHelpers.CreateNewTrygger(tryggerData, txEmitter);
            if(success && newTrigger) {
                createdTrygger = success;
                let trygger = newTrigger.trygger;
                activeTryggers[`${trygger.trigger_type}`] ? activeTryggers[`${trygger.trigger_type}`].push(newTrigger) : activeTryggers[`${trygger.trigger_type}`] = [newTrigger];
            }
        }
        return res.send({existing: existingUser, createdTrygger: createdTrygger});
    });

    server.post('/createNewTrygger', async (req, res) => {
        let tryggerData: IFormData = {
            userId: req.body.userId,
            chain: req.body.chain,
            action: req.body.action,
            actionDetails: req.body.actionDetails,
            type: req.body.type,
            triggerDetails: req.body.triggerDetails,
        };
        let { success, newTrigger} = await ServerHelpers.CreateNewTrygger(tryggerData, txEmitter);
        if(success && newTrigger) {
            let trygger = newTrigger.trygger;
            activeTryggers[`${trygger.trigger_type}`] ? activeTryggers[`${trygger.trigger_type}`].push(newTrigger) : activeTryggers[`${trygger.trigger_type}`] = [newTrigger];
        }
        return res.send({success: success});
    });

    server.post('/deleteTrygger', async (req, res) => {
        //remove trygger from active tryggers and delete trygger from database
        removeActiveTrygger(req.body.type, req.body.id);
        const { data, error } = await supabase.from('tryggers').delete().eq('id', req.body.id);
        if(error) {
            return res.send({success: false});
        }
        console.log(`Active Tryggers: ${JSON.stringify(activeTryggers)}`);
        return res.send({success: true});
    })

    server.post('/deactivateTrygger', async (req, res) => {
        //remove trygger from active tryggers and set active to false
        removeActiveTrygger(req.body.type, req.body.id);
        const { data, error } = await supabase.from('tryggers').update({active: false}).match({id: req.body.id});
        if(error) {
            return res.send({success: false});
        }
        console.log(`Active Tryggers: ${JSON.stringify(activeTryggers)}`);
        return res.send({success: true});
    })

    server.post('/activateTrygger', async (req, res) => {
        //create trygger object from database and add to active tryggers
        let { data, error } = await supabase.from('tryggers').update({active: true}).match({id: req.body.id});
        console.log(`Activated Trygger: ${JSON.stringify(data)}`);
        if(error) {
            return res.send({success: false});
        } else {
            let n = data![0];
            if(n) {
                //create trygger listener and add to 
                let trygger = new Trygger({id: n['id'], createdAt: n['created_at'], 
                    user_id: n['userId'], chain: n['chain'], action: n['action'], action_details: n['actionDetails'],
                    trigger_type: n['type'], trigger_details: n['triggerDetails'], active: n['active']});
                let newTrigger = new WalletMonitorTrigger(trygger);
                activeTryggers[`${trygger.trigger_type}`] ? activeTryggers[`${trygger.trigger_type}`].push(newTrigger) : activeTryggers[`${trygger.trigger_type}`] = [newTrigger];
                console.log(`Active Tryggers: ${JSON.stringify(activeTryggers)}`);
                return res.send({success: true});
            }
        }
        console.log(`Active Tryggers: ${JSON.stringify(activeTryggers)}`);
        return res.send({success: false});
    })

    server.post('/saveProEmail', async (req, res) => {
        var { data, error } = await supabase.from('pro_waitlist').insert({
            email: req.body.email,
            created_at: new Date(),
        });
        if(error) {
            res.send({success: false, error: error});
        }  else {
            res.send({success: true, email: req.body.email})
        }
    });

    //start blockProcessors
    //const trigger = new TransactionTrigger(txEmitter, criteria, action);
    const ethProcessor = new BlockProcessor(provider, txEmitter, 10000);
    ethProcessor.startProcessing();

    server.listen(process.env.PORT || 3001, () => {
        console.log('Server is running...');
    })
}

main();