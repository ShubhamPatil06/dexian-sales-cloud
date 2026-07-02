import { LightningElement } from 'lwc';


export default class C2pChildModalComponent extends LightningElement {

    closeHandler(){
        const event=new CustomEvent('close', {
            //bubbles:true,
            detail : "Modal Closed Successfully!!"
        })
        this.dispatchEvent(event)
        //console.log('closeHandler called on Button')
    }

    // footerHandler(){
    //     console.log('footerHandler called on Child Modal')
    // }
    
    
}