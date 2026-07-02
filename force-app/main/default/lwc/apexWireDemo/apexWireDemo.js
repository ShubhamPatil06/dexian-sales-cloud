import { LightningElement,wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactControllerLwc.getContactList';

export default class ApexWireDemo extends LightningElement {
    contactList
    @wire(getContactList)
    contacts

    @wire(getContactList)
    contactsHandler({data,error}){
        if(data){
            console.log(data)
            this.contactList = data.map(item => {
                let newLevel = item.Level__c === 'Primary' ?  'Low' :
                    item.Level__c === 'Secondary' ? 'Intermediate' :
                    'Difficult'
                return {...item, newLevel}
            })
        }
        if(error){
            console.error(error)
        }
    }

}