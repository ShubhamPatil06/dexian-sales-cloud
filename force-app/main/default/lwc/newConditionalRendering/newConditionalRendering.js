import { LightningElement } from 'lwc';

export default class NewConditionalRendering extends LightningElement {
    isVisible=false

    get getLabel() {
        return this.isVisible ? 'Hide Text' : 'Show Text'
    }

    
    showTextHandler(){
         this.isVisible = !this.isVisible
    }

    country = "India"
    newCountry = "Australia"

    changeHandler(event){
        this.country = event.target.value;
    }

    get isCountryIndia() {
        console.log('isCountryIndia is getting called')
        return this.country === "India";
    }
    
    changeHandlerNew(event){
        this.newCountry = event.target.value;
    }
    get isCountryAustralia() {
        console.log('isCountryAustralia is getting called')
        return this.newCountry === "Australia";
    }

    get isCountryCanada(){
        return this.newCountry === "Canada";
    }
    
    
}