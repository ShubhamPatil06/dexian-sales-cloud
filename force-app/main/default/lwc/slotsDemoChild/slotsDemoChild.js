import { LightningElement } from 'lwc';

export default class SlotsDemoChild extends LightningElement {

    slotChangeHandler(){
        const footerElem=this.template.querySelector('.slds-card__footer')
        if(footerElem){
            footerElem.classList.remove('slds-hide')
        }
    }
}