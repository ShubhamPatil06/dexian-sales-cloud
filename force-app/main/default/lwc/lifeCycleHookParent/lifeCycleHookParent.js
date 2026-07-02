import { LightningElement } from 'lwc';

export default class LifeCycleHookParent extends LightningElement {
    constructor(){
        super()
        console.log('Parent constructor called')
    }
    connectedCallback(){
        console.log('Parent connectedCallback called')
    }
    renderedCallback(){
        console.log('Parent renderedCallback called')
    }
    //-----Mounting Phase Example------->
    // userName
    // changeHandler(event){
    //     this.userName=event.target.value;
    // }
    //-----Unmounting Phase Example------->
    isChildVisible= false;
    handleClick(event){
        this.isChildVisible =!this.isChildVisible;
    }
    //-----Error Phase Example------->
    errorCallback(error, stack){
        console.log(error.message)
        console.log(stack)
    }

}