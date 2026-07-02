import { LightningElement,wire } from 'lwc';
import SAMPLEMC from '@salesforce/messageChannel/SampleMessageChannel__c';
import {MessageContext, subscribe, unsubscribe, APPLICATION_SCOPE} from 'lightning/messageService';

export default class LmsComponentX extends LightningElement {
    subscribedMessage;
    @wire(MessageContext)
    context;
    subscription;
    

    connectedCallback(){
        this.subscribeHandler()
    }

    //subscribe(messageContext, messageChannel, listener, subscriberOptions)
    subscribeHandler(){
        this.subscription=subscribe(this.context, SAMPLEMC, 
                         (message)=>{
                                    this.messageHandler(message)
                                    }, 
                        {scope : APPLICATION_SCOPE});
    }

    messageHandler(message){
        this.subscribedMessage = message.lmsData.value ?
                               message.lmsData.value :  "No Message Received"
    }

    unsubscribeHandler(){
        unsubscribe(this.subscription)
        this.subscription = null;
    }
}