import { LightningElement } from 'lwc';
import USER_IMAGE from '@salesforce/resourceUrl/user_image'
import SPRING_PARK_IMAGE from '@salesforce/resourceUrl/spring_park_image'

export default class ImagesStaticResources extends LightningElement {
    userImage = USER_IMAGE;
    springParkImage = SPRING_PARK_IMAGE;
}