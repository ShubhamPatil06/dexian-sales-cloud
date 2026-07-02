import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {encodeDefaultFieldValues} from 'lightning/pageReferenceUtils';

export default class NavigateToRecordPage extends NavigationMixin(LightningElement) {

    navigateInViewMode(){
        this[NavigationMixin.Navigate]({
            type:"standard__recordPage",
            attributes:{
                recordId:"0035g000007P37UAAS",
                objectApiName:"Contact",
                actionName:"view"
            }
        })
    }

    navigateInEditMode(){
        this[NavigationMixin.Navigate]({
            type:"standard__recordPage",
            attributes:{
                recordId:"0035g000007P37UAAS",
                objectApiName:"Contact",
                actionName:"edit"
            }
        })
    }
}