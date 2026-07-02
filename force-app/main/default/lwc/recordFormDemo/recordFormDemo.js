import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import ACCOUNT_NUMBER from '@salesforce/schema/Account.AccountNumber';
import ANNUAL_REVENUE from '@salesforce/schema/Account.AnnualRevenue';

export default class RecordFormDemo extends LightningElement {
    objectName = ACCOUNT_OBJECT;
    fieldList =[NAME_FIELD, PHONE_FIELD, ACCOUNT_NUMBER, RATING_FIELD, WEBSITE_FIELD, ANNUAL_REVENUE];

    successHandler(event){
                const toastEvent = new ShowToastEvent({
                    title:"Account Created!!",
                    message:"Account Created Successfully with Record Id : "+ event.detail.id,
                    variant:"success"
                })
                this.dispatchEvent(toastEvent)
    }
}