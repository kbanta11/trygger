
export class FirstTriggerFormData {
    chain: string;
    type: string;
    action: string;
    actionDetails?: any;
    triggerDetails?: any;

    constructor(params: IFirstTriggerData) {
        this.chain = params.chain;
        this.type = params.type;
        this.action = params.action;
        this.actionDetails = params.actionDetails;
        this.triggerDetails = params.triggerDetails;
    }

    updateChain(val: string) {
        return new FirstTriggerFormData({
            chain: val,
            type: this.type,
            action: this.action,
            actionDetails: this.actionDetails,
            triggerDetails: this.triggerDetails
        });
    }

    updateType(val: string) {
        return new FirstTriggerFormData({
            chain: this.chain,
            type: val,
            action: this.action,
            actionDetails: this.actionDetails,
            triggerDetails: this.triggerDetails
        });
    }

    updateAction(val: string) {
        return new FirstTriggerFormData({
            chain: this.chain,
            type: this.type,
            action: val,
            actionDetails: this.actionDetails,
            triggerDetails: this.triggerDetails
        });
    }

    updateActionDetails(val: any) {
        return new FirstTriggerFormData({
            chain: this.chain,
            type: this.type,
            action: this.action,
            actionDetails: val,
            triggerDetails: this.triggerDetails
        });
    }

    updateTriggerDetails(val: any) {
        return new FirstTriggerFormData({
            chain: this.chain,
            type: this.type,
            action: this.action,
            actionDetails: this.actionDetails,
            triggerDetails: val
        });
    }
}

interface IFirstTriggerData {
    chain: string;
    type: string;
    action: string;
    actionDetails?: any;
    triggerDetails?: any;
}