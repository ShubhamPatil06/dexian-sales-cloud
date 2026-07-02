import { LightningElement,wire } from 'lwc';
import getContactList from '@salesforce/apex/RefreshContactController.getContactList';
import {updateRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';
const COLUMNS = [
    { label: 'Title', fieldName: 'Title', editable: true },
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true},
    { label: 'Phone', fieldName: 'Phone', type: 'tel', editable: true},
    { label: 'Email', fieldName: 'Email', type: 'email', editable: true }
]

export default class RefreshApexDatatableDemo extends LightningElement {
    draftValues = []
    columns = COLUMNS
    @wire(getContactList)
    contactList

    handleSave(event){
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft)
            return {fields}
        })
        const promises =recordInputs.map(recordInput => updateRecord(recordInput))
        Promise.all(promises).then(result => {
            this.showToast('Success', 'Records Updated Successfully!')
            this.draftValues = []
            return refreshApex(this.contactList)
        }).catch(error => {
            this.showToast('Error', error.body.message, 'error')
        })
    }

    showToast(title, message, variant){
        const toastEvent = new ShowToastEvent({
            title:title,
            message:message,
            variant:variant || 'success'
        })
        this.dispatchEvent(toastEvent)
    }


}