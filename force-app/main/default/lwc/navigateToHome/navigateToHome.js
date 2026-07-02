import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class NavigateToHome extends NavigationMixin(LightningElement) {

    navigateHomeHandler(){
        this[NavigationMixin.Navigate]({
            type: "standard__namedPage",
            attributes: {
                pageName : 'home'
            }
        })
    }
}