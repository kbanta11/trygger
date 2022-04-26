import { atom } from "recoil";
import { Session, User } from "@supabase/supabase-js";
import { FirstTriggerFormData } from "./models/FirstTriggerFormData";

export const firstTriggerFormState = atom({
    key: 'firstTriggerFormState',
    default: new FirstTriggerFormData({
        chain: 'eth',
        type: 'wallet',
        action: 'sms',
    })
})

export const sessionState = atom({
    key: 'sessionState',
    default: null as Session | null
});

export const userState = atom({
    key: 'userState',
    default: null as User | null
});

export const tryggerListState = atom({
    key: 'tryggerListState',
    default: [] as any[],
});