import { LightningElement,wire } from 'lwc';
import filterAccountByType from '@salesforce/apex/AccountControllerLwc.filterAccountByType';

export default class ApexWireWithParams extends LightningElement {
    selectedType

    @wire(filterAccountByType, {type:'$selectedType'})
    filteredAccounts

    handleChange(event){
        this.selectedType = event.target.value
    }

    get typeOptions(){
        return [
            { label: 'Prospect', value: 'Prospect' },
            { label: 'Customer - Direct', value: 'Customer - Direct' },
            { label: 'Customer - Channel', value: 'Customer - Channel' },
            { label: 'Channel Partner / Reseller', value: 'Channel Partner / Reseller' },
            { label: 'Installation Partner', value: 'Installation Partner' },
            { label: 'Technology Partner', value: 'Technology Partner' },
            { label: 'Other', value: 'Other' }
        ];
    }
}