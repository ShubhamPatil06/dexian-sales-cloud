import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/MapsAccountController.getAccounts';

export default class MapsInLwc extends LightningElement {
    mapMarkers =[]  
    markersTitle="Accounts Location"
    @wire(getAccounts)
    accountsDataHandler({data,error}){
        if(data){
            console.log(data)
            this.formatData(data)
        }
        if(error){
            console.error(error)
        }
    }

    formatData(data){
        const mapMarkers=data.map(item=>{
            return {
                location:{
                    Street: item.BillingStreet || '',
                    City: item.BillingCity || '',
                    PostalCode: item.BillingPostalCode || '',
                    State: item.BillingState || '',
                    Country: item.BillingCountry || ''
                },
                icon:"utility:salesforce1",
                title:item.Name,
                value: item.Name,
                description:item.Description || ''
            }
        })
        this.mapMarkers = mapMarkers;
        this.selectedMarker = mapMarkers.length ? mapMarkers[0].value : null;
    }
    callMarkerHandler(event){
        this.selectedMarker = event.detail.selectedMarkerValue
    }

}