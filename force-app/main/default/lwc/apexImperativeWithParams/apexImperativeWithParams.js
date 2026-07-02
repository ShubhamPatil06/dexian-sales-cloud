import { LightningElement } from 'lwc';
import findAccounts from '@salesforce/apex/AccountControllerLwc.findAccounts';

export default class ApexImperativeWithParams extends LightningElement {
    searchkey=''
    accounts
    handleChange(event){
        this.searchkey = event.target.value
        findAccounts({searchKey:this.searchkey})
        .then(result =>{
            this.accounts = result
        }).catch(error => {
            console.error(error)
        })
    }
}