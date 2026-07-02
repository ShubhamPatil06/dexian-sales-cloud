import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ToastNotificationsDemo extends LightningElement {

    successsToastHandler(){
        this.showToast("Success!", "Account Created Successfully!", "success")
    }
    infoToastHandler(){
        this.showToast("Info!", "{0} Spring 26 Release is Available {1}","info")

    }
    warningToastHandler(){
        this.showToast("Warning!", "Password should have atleast 15 characters!", "warning")
    }
    errorToastHandler(){
        this.showToast("Error!", "Account Creation Failed!", "error")
    }
    showToast(title,message,variant){
        let event = new ShowToastEvent({
            title,
            message,
            variant,
            messageData:[
                'Salesforce',{
                    url:"https://help.salesforce.com/s/articleView?id=release-notes.salesforce_release_notes.htm&release=260&type=5",
                    label:"New Spring Release"
                }
            ],
            mode: "pester"
        })
        this.dispatchEvent(event);
    }
}