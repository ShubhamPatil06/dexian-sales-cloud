import { LightningElement,wire } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import USER_NAME from '@salesforce/schema/User.Name';
import USER_EMAIL from '@salesforce/schema/User.Email';
const fields = [USER_NAME, USER_EMAIL]

export default class WireFetchUserDetails extends LightningElement {
    // @wire(adapterId, adapterConfig)
    // propertyOrFunctionName

    userId = USER_ID
    userDetails

    @wire(getRecord, {recordId:'$userId', fields})
    userDetailHandler({data,error}){
        if(data){
            console.log(data)
            this.userDetails = data.fields
        }
        if(error){
            console.error(error)
        }
    }
    @wire(getRecord, {recordId:'$userId', fields})
    userDetailProperty
    
}