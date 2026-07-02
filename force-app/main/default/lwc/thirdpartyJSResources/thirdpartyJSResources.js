import { LightningElement } from 'lwc';
import MOMENT from '@salesforce/resourceUrl/moment';
import { loadScript } from 'lightning/platformResourceLoader'

export default class ThirdpartyJSResources extends LightningElement {
    formattedDate='';
    isLibraryLoaded = false;

    renderedCallback(){
        if(this.isLibraryLoaded){
            return
        }else {       
            loadScript(this, MOMENT+'/moment/moment.min.js').then(() => {
                this.setDateOnScreen()
            }).catch(error =>{
                console.error(error);
            })
            this.isLibraryLoaded = true;
        }
    }
    setDateOnScreen(){
        this.formattedDate = moment().format('lll'); 
    }    
}