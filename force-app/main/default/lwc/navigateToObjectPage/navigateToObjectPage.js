import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import {encodeDefaultFieldValues} from 'lightning/pageReferenceUtils';

export default class NavigateToObjectPage extends NavigationMixin(LightningElement) {
    navigateToRecordPage(){
        this[NavigationMixin.Navigate]({
            type:"standard__objectPage",
            attributes:{
                objectApiName:"Contact",
                actionName:"new"
            }
        })
    }

    navigateToRecordPageWithDefault(){
        const defaultValues= encodeDefaultFieldValues({
            FirstName:"Shanice",
            LastName:"Shreshta",
            LeadSource:"Other"
        });
        this[NavigationMixin.Navigate]({
            type:"standard__objectPage",
            attributes:{
                objectApiName:"Contact",
                actionName:"new"
            },
            state:{
                defaultFieldValues:defaultValues
            }
        })

    }

    navigateToListView(){
        this[NavigationMixin.Navigate]({
            type:"standard__objectPage",
            attributes:{
                objectApiName:"Contact",
                actionName:"list"
            },
            state:{
                filterName:"Recent"
            }
        })

    }
    navigateToFiles(){
        this[NavigationMixin.Navigate]({
            type:"standard__objectPage",
            attributes:{
                objectApiName:"ContentDocument",
                actionName:"home"
            } 
        })
    }
}