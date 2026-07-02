import { LightningElement,wire } from 'lwc';
import {getObjectInfo, getObjectInfos} from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';

export default class GetObjectInfoDemo extends LightningElement {
    apiName
    defaultRecordTypeId
    @wire(getObjectInfo, {objectApiName : ACCOUNT_OBJECT})
    objectInfo({data,error}){
        if(data){
            this.defaultRecordTypeId = data.defaultRecordTypeId;
            this.apiName = data.apiName;
            //console.log(data)
        }
        if(error){
            console.error(error)
        }
    }

    objectInfos
    objectApiNames = [ACCOUNT_OBJECT, OPPORTUNITY_OBJECT]
    @wire(getObjectInfos, {objectApiNames : '$objectApiNames'})
    objectInfosHandler({error, data}){
        if(data){
            //console.log(data)
            this.objectInfos = data.results;
        }
        if(error){
            console.error(error)
        }
    }

}