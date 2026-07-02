import { LightningElement } from 'lwc';
import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency'

export default class InternationalizationDemo extends LightningElement {
    
    number = 606199424011997.00;

    formattedNumber = new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: CURRENCY,
        currencyDisplay: 'symbol'
    }).format(this.number)
    
    //Setting the locale to arabic and currency to USD explicitly
    /*
        formattedNumber = new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
        }).format(this.number)
    */
}