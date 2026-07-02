import { LightningElement,api } from 'lwc';

export default class P2cChildComponent extends LightningElement {

    @api message;
    @api cardTitle;
    @api randomNum;
    @api isValid;

}