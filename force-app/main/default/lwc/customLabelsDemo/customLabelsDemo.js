import { LightningElement } from 'lwc';
import DESCRIPTION_ONE from '@salesforce/label/c.customLabelDescriptionOne';
import DESCRIPTION_TWO from '@salesforce/label/c.customLabelDescriptionTwo';

export default class CustomLabelsDemo extends LightningElement {
    LABELS = {
        descriptionOne : DESCRIPTION_ONE,
        descriptionTwo : DESCRIPTION_TWO
    }
}