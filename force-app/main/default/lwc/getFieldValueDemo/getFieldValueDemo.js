import { LightningElement,api,wire } from 'lwc';
import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import ANNUAL_REVENUE from '@salesforce/schema/Account.AnnualRevenue';
import ACCOUNT_NUMBER from '@salesforce/schema/Account.AccountNumber';
const fields = [NAME_FIELD, WEBSITE_FIELD, ANNUAL_REVENUE, ACCOUNT_NUMBER]

export default class GetFieldValueDemo extends LightningElement {
    accountName
    accountWebsite
    annualRevenue
    accountNumber

    @api recordId
    @wire(getRecord, {recordId : '$recordId', fields})
    accountHandler({data,error}){
        if(data){
            console.log(data)
            this.accountName = getFieldValue( data, NAME_FIELD)
            this.accountWebsite = getFieldValue( data, WEBSITE_FIELD)
            this.annualRevenue = getFieldDisplayValue( data, ANNUAL_REVENUE)
            this.accountNumber = getFieldValue( data, ACCOUNT_NUMBER)
        }
        if(error){
            console.error(error)
        }
    }
}