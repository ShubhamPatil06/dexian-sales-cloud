import { LightningElement } from 'lwc';
import JSPDF_URL from '@salesforce/resourceUrl/jsPDFLibrary';
import { loadScript } from 'lightning/platformResourceLoader';

export default class PdfGenerationDemo extends LightningElement {
    isLibraryLoaded = false;

    renderedCallback() {
        if (this.isLibraryLoaded) return;

        console.log('Script URL:', JSPDF_URL); // <-- Q1: what does this print?

        loadScript(this, JSPDF_URL)
            .then(() => {
                this.isLibraryLoaded = true;
                console.log('Loaded! window.jspdf:', window.jspdf); 
            })
            .catch(error => {
                console.error('Error Loading JsPdf Library!', error.message);
            });
    }

    generatePdf() {
        if (!this.isLibraryLoaded) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text('Hello world!', 10, 10);
        doc.save('sample.pdf');
    }
}