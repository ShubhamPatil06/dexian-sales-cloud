import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_Owner from '@salesforce/schema/Account.Owner.Name';
import ANNUAL_REVENUE from '@salesforce/schema/Account.AnnualRevenue';
const fields=[ACCOUNT_NAME, ACCOUNT_Owner, ANNUAL_REVENUE]

export default class GetRecordAdapterDemo extends LightningElement {
    accountName
    accountOwner
    annualRevenue

    @api recordId
    //@wire(getRecord, {recordId : '$recordId', fields})
    @wire(getRecord, { recordId : '$recordId',
                       layoutTypes : ['Full'], 
                       modes : ['View']})
    accountHandler({data,error}){
        if(data){
            console.log(data)
            this.accountName = data.fields.Name.displayValue ? data.fields.Name.displayValue : 
                               data.fields.Name.value
            this.accountOwner = data.fields.Owner.displayValue ? data.fields.Owner.displayValue : 
                               data.fields.Owner.value
            this.annualRevenue = data.fields.AnnualRevenue.displayValue ? data.fields.AnnualRevenue.displayValue : 
                               data.fields.AnnualRevenue.value
        }
        if(error){
            console.error(error)
        }
    }
}