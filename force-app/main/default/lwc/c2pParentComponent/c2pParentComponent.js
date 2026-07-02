import { LightningElement } from 'lwc';

export default class C2pParentComponent extends LightningElement {
    showModal = false;
    messageFromChild;

    handleClick(){
        this.showModal = true
    }

    handleClose(event){
        this.messageFromChild = event.detail;
        this.showModal = false;
    }
}