import { LightningElement,api } from 'lwc';

export default class SetterDemoChild extends LightningElement {
    userDetails

    @api
    get userData(){
        return this.userDetails
    }

    set userData(data){
        let newAge = (data.age + 10);
        let fullName = data.firstName + " "+ data.lastName;
        this.userDetails = {
            ...data, 
            age : newAge, 
            "fullname" : fullName, 
            "location": "Las Vegas" 
        }
    
    }
}