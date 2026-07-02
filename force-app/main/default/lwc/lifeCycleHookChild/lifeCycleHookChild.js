import { LightningElement } from 'lwc';

export default class LifeCycleHookChild extends LightningElement {
    constructor(){
        super()
        console.log('Child constructor called')
    }
    connectedCallback(){
        console.log('Child connectedCallback called')
        throw new Error ('Child Component Rendering Failed!')
    }
    renderedCallback(){
        console.log('Child renderedCallback called')
    }
    disconnectedCallback(){
        alert('Child Disconnected called')
    }
}