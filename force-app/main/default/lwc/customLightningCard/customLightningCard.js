import { LightningElement } from 'lwc';

export default class CustomLightningCard extends LightningElement {

    slotChangeHandler(){
        const footerElem = this.refs.cardfooter;
        if(footerElem){
            footerElem.classList.remove('slds-hide')
        }    
    }
}