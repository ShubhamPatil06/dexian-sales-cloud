import { LightningElement } from 'lwc';
import LOUD_LOGO from '@salesforce/resourceUrl/LoudLogo';

export default class LoginComp extends LightningElement {
email;
password;
isFormValid = true;
loudLogoUrl = LOUD_LOGO;

fetchDetailsFromForm() {
    let inputFields = this.template.querySelectorAll('.fetchDetails');
    inputFields.forEach(inputField => {
        if(!inputField.checkValidity()) {
            inputField.reportValidity();
            isFormValid = false;
        }
        if(inputField.name = 'emailField')
            this.email = inputField.value;
        if(inputField.name = 'userPassword')
            this.password = inputField.value;
    });
}

handleLogin(){
    this.fetchDetailsFromForm();
    if(this.isFormValid){
        console.log('username = '+this.email);
        console.log('password = '+this.password);
        alert('credentials'+this.email+'/'+this.password);
    }else{
        alert('Please enter Email and Password!');
    }
    
}
}