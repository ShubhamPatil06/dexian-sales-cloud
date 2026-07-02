import { LightningElement,api } from 'lwc';

export default class LwcMetaConfiguration extends LightningElement {
    @api heading
    @api recordId
    @api levels
}