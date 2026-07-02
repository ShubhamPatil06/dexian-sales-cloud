import { LightningElement,wire } from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import TYPE_FIELD from '@salesforce/schema/Account.Type'

export default class GetPicklistValuesDemo extends LightningElement {
    industryPicklistValues
    typePicklistValues
    selectedIndustryValue = '';
    industryOptions=[];
    typeOptions=[];
    selectedTypeValue = '';
    @wire(getObjectInfo, {objectApiName : ACCOUNT_OBJECT})  
    objectInfo
    

    @wire(getPicklistValues, {recordTypeId : '$objectInfo.data.defaultRecordTypeId', fieldApiName : INDUSTRY_FIELD })
    industryPicklistHandler({data,error}){
        if(data){
            //console.log(data)
            this.industryPicklistValues = data.values
            this.industryOptions = [...this.generatePicklist(data)]
        }
        if(error){
            console.error(error);
        }
    }
    @wire(getPicklistValues, {recordTypeId : '$objectInfo.data.defaultRecordTypeId', fieldApiName : TYPE_FIELD })
    typePicklistHandler({data,error}){
        if(data){
            //console.log(data)
            this.typePicklistValues = data.values
            this.typeOptions = [...this.generatePicklist(data)]
        }
        if(error){
            console.error(error);
        }
    }

    generatePicklist(data){
        return data.values.map(item=> ({label : item.label, value : item.value}))
    }

    handleIndustryChange(event){
        this.selectedIndustryValue = event.detail.value
    }
    handleTypeChange(event){
        this.selectedTypeValue = event.detail.value
    }
}