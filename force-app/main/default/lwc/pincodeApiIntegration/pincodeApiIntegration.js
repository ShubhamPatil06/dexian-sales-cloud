import { LightningElement,wire } from 'lwc';
import getPincodes from '@salesforce/apex/PincodeController.getPincodes'
const COLUMNS = [
    {label:"Pincode", fieldName:"Pincode"},
    {label:"Post Office Name", fieldName:"Name"},
    {label:"Circle", fieldName:"Circle"},
    {label:"Division", fieldName:"Division"},
    {label:"State", fieldName:"State"},
    {label:"Country", fieldName:"Country"},

]
export default class PincodeApiIntegration extends LightningElement {
    pincodeValue=''
    postOffices=[]
    isLoading=false
    errorMessage=''
    columns = COLUMNS

    get hasResults(){
        return this.postOffices.length > 0
    }
    handlePincodeChange(event){
        this.pincodeValue = event.target.value
        this.errorMessage = '';  // clear error on new input
    }

    handleSearch(){
        if (!this.pincodeValue || this.pincodeValue.length !== 6 || isNaN(this.pincodeValue)) {
            this.errorMessage = 'Please enter a valid 6-digit pincode.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.postOffices = [];

        getPincodes({pincode : this.pincodeValue})
        .then(result => {
           console.log(result)
            this.postOffices = result
        }).catch(error => {
            this.errorMessage = error.body.message || 'Something went wrong'
        }).finally(()=>{
            this.isLoading=false
        })

    }

}





    
