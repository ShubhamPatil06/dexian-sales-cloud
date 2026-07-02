import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class RecordFormLayoutDemo extends LightningElement {
    @api recordId
    @api objectApiName

    successHandler(){
        let event=new ShowToastEvent({
            title:"Success",
            message:"Record Updated Successfully with Record Id : "+this.recordId,
            variant:"success"
        })
        this.dispatchEvent(event)
    }
}