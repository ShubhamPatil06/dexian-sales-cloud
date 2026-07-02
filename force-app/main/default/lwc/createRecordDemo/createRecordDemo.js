import { LightningElement } from 'lwc';
import {createRecord} from 'lightning/uiRecordApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact'
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class CreateRecordDemo extends LightningElement {
    formFields = {}
    handleChange(event){
        const { name, value } = event.target
        this.formFields[name] = value

    }

    createContactHandler(){
        const recordInput = {apiName : CONTACT_OBJECT.objectApiName, fields : this.formFields}
        createRecord(recordInput).then(result => {
            console.log(result)
            this.showToast('Success', `Contact Created Successfully with Record Id :${result.id}`,'success')
            this.template.querySelector('form.createForm').reset()
            this.formFields = {}
        }).catch(error => {
            this.showToast('Error!!', 'Error Creating Contact', 'error')
        })
    }

    showToast(title, message, variant){
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }))
    }
}