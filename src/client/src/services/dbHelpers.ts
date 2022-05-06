import { FirstTriggerFormData } from "../models/FirstTriggerFormData";
import { IContact } from "../models/ContactForm";
import { supabase } from "./supabaseClient";
import { IFormData } from "../components/NewTrygger/NewTryggerModal";
import { ITryggerUser } from "../models/TryggerUser";

const backendPath = process.env.REACT_APP_ENV === 'production' ? 'https://backend.trygger.xyz' : '';

export const Helpers = {
    checkERC20: async (address: string) => {
        let result = await fetch(`${backendPath}/checkERC20`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({address: address})
        });
        var resData = await result.json();
        return (resData.error); 
    },
    getUserData: async (uid: string) => {
        const { data, error } = await supabase.from('users').select().eq('id', uid);
        if(data) {
            //console.log(JSON.stringify(data));
            let n = data[0];
            let user: ITryggerUser = {
                id: n['id'],
                createdAt: n['created_at'],
                email: n['email'],
                phoneNumber: n['phone_number'],
                walletAddress: n['wallet_address'],
                activated: n['activated'],
                tier: n['tier']
            }
            return user;
        }
        return;
    },
    checkUserExists: async (uid: string) => {
        const { data, error } = await supabase.from('users').select().eq('id', uid);
        //console.log(`Data: ${data} (${data?.length})\nErrors: ${JSON.stringify(error)}`);
        return (data && data.length > 0)
    },
    createNewUserWithTrygger: async (formData: FirstTriggerFormData) => {
        //check whether user record exists for this user and get UID (by phone or email)
        //send all to backend
        var result = await fetch(`${backendPath}/createUserWithTrygger`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(formData)
        });
        var resData = await result.json();
        console.log(JSON.stringify(resData));
        return (resData.createdTrygger);
    },
    createNewTrygger: async (formData: IFormData) => {
        var result = await fetch(`${backendPath}/createNewTrygger`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(formData)
        });
        var resData = await result.json();
        return (resData.success);
    },
    deleteTrygger: async (type: string, id: number) => {
        var result = await fetch(`${backendPath}/deleteTrygger`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({type: type, id: id})
        });
        var resData = await  result.json();
        return resData.success;
    },
    toggleTrygger: async (trygger: any) => {
        if(trygger['active']) {
            //if true then toggle to false (deactivate)
            var result = await fetch(`${backendPath}/deactivateTrygger`, {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({type: trygger['type'], id: trygger['id']})
            });
            var resData = await result.json();
            return resData.success;
        } else {
            //if false or undefined, toggle to true (activate)
            var result = await fetch(`${backendPath}/activateTrygger`, {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({id: trygger['id']})
            });
            var resData = await result.json();
            return resData.success;
        }
    },
    getTryggers: async (uid: string) => {
        let { data, error } = await supabase.from('tryggers').select().eq('userId', uid).order('active', {ascending: false}).order('id', {ascending: true});
        /*
        console.log('Tryggers for ID (%s): %s', uid, JSON.stringify(data))
        data?.forEach((x) => {
            console.log(JSON.stringify(x));
        })
        */
        return data ?? [];
    },
    sendContactForm: async (contactData: IContact) => {
        var result = await fetch(`${backendPath}/sendContactForm`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(contactData)
        });
        //console.log('Result: %s', JSON.stringify(await result.text));
        var resData = await result.json();
        console.log(JSON.stringify(resData));
        return resData.success;
    },
    saveProEmail: async (email: string) => {
        var result = await fetch(`${backendPath}/saveProEmail`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({email: email})
        });
        var resData = await result.json();
        return resData.success;
    },
}