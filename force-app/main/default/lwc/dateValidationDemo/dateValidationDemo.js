import { LightningElement } from 'lwc';

export default class DateValidationDemo extends LightningElement {
    startDate
    endDate
    error

    handleChange(event){
        const {name, value} = event.target;
        this[name] = value
    }

    handleSubmit(){
        if(this.validateDate(this.startDate, this.endDate)){
            console.log('Date is Valid!!')
        }else {
            this.error= 'End Date cannot be less than Start Date'
        }
        
    }

    validateDate(startDate, endDate){
        return new Date(startDate).getTime()  < new Date(endDate).getTime()
    }
}