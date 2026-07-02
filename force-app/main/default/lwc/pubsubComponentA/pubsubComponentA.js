import { LightningElement } from 'lwc';
import pubsub from 'c/pubsub';

export default class PubsubComponentA extends LightningElement {

    messageToPublish;

    changeHandler(event){
        this.messageToPublish = event.target.value;
    }

    publishHandler(){
        pubsub.publish('componentA', this.messageToPublish)
    }
}