import { LightningElement } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class NavigateToAura extends NavigationMixin(LightningElement) {
        

        navigateToAura(){
            this[NavigationMixin.Navigate]({
                type:"standard__component",
                attributes:{
                    componentName:"c__AuraNavigationComponent"
                },
                state:{
                    c__id:"0001Ag5801GH0056"
                }
            })
        }
}