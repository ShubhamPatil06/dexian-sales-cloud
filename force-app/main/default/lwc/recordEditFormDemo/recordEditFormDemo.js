import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import PARENT_ACCOUNT from '@salesforce/schema/Contact.AccountId';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';


export default class RecordEditFormDemo extends LightningElement {
    objectName = CONTACT_OBJECT;
    fields = {
        parentAccount:PARENT_ACCOUNT,
        nameField:NAME_FIELD,
        titleField:TITLE_FIELD,
        phoneField:PHONE_FIELD,
        emailField:EMAIL_FIELD
    }

    successHandler(event){
        const toastEvent=new ShowToastEvent({
            title:"Contact Created!",
            message:"Contact Created Successfully with Record Id : "+event.target.id,
            variant:"success"
        })
        this.dispatchEvent(toastEvent);
    }

    resetHandler(){
        const inputFields = this.template.querySelectorAll('lightning-input-field')
        if(inputFields){
            Array.from(inputFields).forEach(field => {
                field.reset()
            })
        }
    }
}