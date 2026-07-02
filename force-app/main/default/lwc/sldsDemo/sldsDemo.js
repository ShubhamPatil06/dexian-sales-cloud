import { LightningElement } from 'lwc';

export default class SldsDemo extends LightningElement {
    colors = ['#ffcccc' /* light red */ , '#ccffcc' /* light green */ , '#ccccff' /* light blue */];
    
    renderedCallback(){
        const gridList= this.template.querySelectorAll('.my-grid .slds-col');
        gridList.forEach((item, index) => {
        item.style.backgroundColor = this.colors[index % this.colors.length];
    });
    }
}