import { LightningElement } from 'lwc';
import signinTemplate from './signinTemplate.html';
import signupTemplate from './signupTemplate.html';
import renderTemplate from './renderMethodTemplate.html';

export default class RenderMethodTemplate extends LightningElement {
    selectedBtn= '';

    handleClick(event){
        this.selectedBtn = event.target.label;
    }

    render() {
        return this.selectedBtn === "Sign Up" ? signupTemplate :
               this.selectedBtn === "Sign In" ? signinTemplate :
               renderTemplate;
    }

    submitHandler(event){
        console.log(`${this.selectedBtn} Successfull!`)
    }
}