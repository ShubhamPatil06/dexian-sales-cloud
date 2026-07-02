import { LightningElement,track } from 'lwc';
import MOMENT from '@salesforce/resourceUrl/moment';
import ANIMATE from '@salesforce/resourceUrl/animate';
import {loadScript, loadStyle} from 'lightning/platformResourceLoader';


export default class ThirdPartyCssResources extends LightningElement {
    formattedDate = '';
    isLibLoaded = false;
    animationInterval;
    @track isAnimating = true;

    get dateClass() {
        return this.isAnimating
            ? 'slds-text-title_caps animate__animated animate__flash'
            : 'slds-text-title_caps';
    }

    get textClass() {
        return this.isAnimating
            ? 'animate__animated animate__flash'
            : '';
    }

    renderedCallback() {
        if (this.isLibLoaded) return;

        Promise.all([
            loadStyle(this, ANIMATE + '/animate/animate.min.css'),
            loadScript(this, MOMENT + '/moment/moment.min.js')
        ]).then(() => {
            this.isLibLoaded = true;
            this.setDateOnScreen();
            this.startAnimationInterval();
        }).catch(error => {
            console.error(error);
        });
    }

    setDateOnScreen() {
        this.formattedDate = moment().format('lll');
    }

    startAnimationInterval() {
        this.animationInterval = setInterval(() => {
            // Step 1: Remove animation class (LWC re-renders the element)
            this.isAnimating = false;

            // Step 2: After a tick, re-add it — forces LWC to re-render fresh
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                this.isAnimating = true;
                this.setDateOnScreen();
            }, 50); // 50ms gap is enough for LWC to flush the DOM update

        }, 15000); // Repeat every 3 seconds
    }

    disconnectedCallback() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
    
}