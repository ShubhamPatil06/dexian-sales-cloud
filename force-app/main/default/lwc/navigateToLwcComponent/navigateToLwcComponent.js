import { LightningElement } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class NavigateToLwcComponent extends NavigationMixin(LightningElement) {

    navigateToLwc(){
        let defination={
                componentDef:"c:navigateTargetLwcComponent",
                attributes:{
                    recordId:"005A9vyH897300q1"
                }   
        }
        this[NavigationMixin.Navigate]({
            type:"standard__webPage",
            attributes:{
                url:"/one/one.app#"+btoa(JSON.stringify(defination))
            }
        })
    }
}