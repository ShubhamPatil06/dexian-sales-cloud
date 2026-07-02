import { LightningElement,wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactControllerLwc.getContacts';
import {exportCSVFile} from 'c/csvUtils';
const COLUMNS = [
    {label:"Id", fieldName:"Id", type:"text"},
    {label:"Title", fieldName:"Title", type:"text"},
    {label:"Contact Name", fieldName:"Name", type:"text"},
    {label:"Department", fieldName:"Department", type:"text"},
    {label:"Email", fieldName:"Email", type:"email"},
    {label:"Phone", fieldName:"Phone", type:"phone"},
    {label:"Gender Identity", fieldName:"GenderIdentity", type:"text"},
    {label:"LeadSource", fieldName:"LeadSource", type:"text"}
    
]

export default class CsvGenerationDemo extends LightningElement {
    columns = COLUMNS
    contactList
    contactHeaders = {
        Id:"Contact Id",
        Title: "Title",
        Name:"Contact Name",
        Department:"Department",
        Email:"Email",
        Phone:"Phone",
        GenderIdentity:"Gender Identity",
        LeadSource:"Lead Source"
    }
    @wire(getContacts)
    contactList({data,error}){
        if(data){
            console.log(data)
            this.contactList = data
            //this.csvGenerator(data)
        }
        if(error){
            console.error(error)
        }
    }
    csvGenerator(){
        exportCSVFile(this.contactHeaders, this.contactList, 'contact_records')
    }

}