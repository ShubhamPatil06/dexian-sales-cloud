import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

export default class NavigateToRelatedRelationshipPage extends NavigationMixin(LightningElement) {

        navigateToRelatedList(){
        this[NavigationMixin.Navigate]({
            type:"standard__recordRelationshipPage",
            attributes:{
                recordId:"0015g00000H8N3QAAV",
                objectApiName:"Account",
                relationshipApiName:"Contacts",
                actionName:"view"
            }
        })
    }

}