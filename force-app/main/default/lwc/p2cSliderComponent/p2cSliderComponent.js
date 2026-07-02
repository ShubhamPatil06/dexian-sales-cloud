import { LightningElement,api } from 'lwc';

export default class P2cSliderComponent extends LightningElement {
    sliderValue = 10;

    changeHandler(event){
        this.sliderValue = event.target.value;
    }

    @api resetHandler(){
        this.sliderValue = 50;
    }

}