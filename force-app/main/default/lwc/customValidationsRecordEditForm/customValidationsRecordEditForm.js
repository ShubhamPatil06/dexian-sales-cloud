import { LightningElement } from 'lwc';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

export default class CustomValidationsRecordEditForm extends LightningElement {
    objectName = ACCOUNT_OBJECT
    inputValue = ''

    changeHandler(event){
        this.inputValue = event.target.value;
    }
       
    submitHandler(event){
        event.preventDefault()
        const inputElement = this.template.querySelector('lightning-input')
        const nameInputFieldValue = inputElement.value
        if(!nameInputFieldValue.includes('Australia')){
            inputElement.setCustomValidity("The Account Name Must Include 'Australia")
        }else{
            inputElement.setCustomValidity("")
            const fields = event.detail.fields
            fields.Name = nameInputFieldValue
            this.template.querySelector("lightning-record-edit-form").submit(fields)
        }
        inputElement.reportValidity()
    }

    successhandler(event){
        const toastEvent = new ShowToastEvent({
            title:"Account Created",
            message:"Account created successfully with record id "+event.detail.id,
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
    }

    errorHandler(event){
        const toastEvent = new ShowToastEvent({
            title:"Account Creation Failed!!",
            message:event.detail.message,
            variant:"error"
        })
        this.dispatchEvent(toastEvent)  
    }
}