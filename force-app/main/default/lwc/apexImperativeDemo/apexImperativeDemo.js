import { LightningElement } from 'lwc';
import getAccounts from '@salesforce/apex/AccountControllerLwc.getAccounts';

export default class ApexImperativeDemo extends LightningElement {
    accounts
    handleClick(){
        getAccounts().then(result => {
            this.accounts = result
        }).catch(error => {
            console.error(error)
        })
    }
}