import { LightningElement } from 'lwc';

export default class ShadowDomStyling extends LightningElement {

    isLoaded = false

    renderedCallback(){
        if(this.isLoaded) return
        let style= document.createElement('style')
        style.innerText = ` c-shadow-dom-styling .slds-button {
        color: white;
        background-color: red;
        }
        `
        this.template.querySelector('lightning-button').appendChild(style)
        this.isLoaded= true;
    }
}