import { LightningElement } from 'lwc';
import pubsub from 'c/pubsub';

export default class PubsubComponentB extends LightningElement {
    message
    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        pubsub.subscribe('componentA', (message)=> {
            this.message = message
        })
    }
}