import { LightningElement } from 'lwc';

export default class TemplateLooping extends LightningElement {
    
    countries = ["India", "USA", "UK", "Canada", "Australia", "Japan"];  
    ceoList = [
        {
            id:1,
            company: "Microsoft",
            ceoName: "Satya Nadella",
            website: "https://www.microsoft.com"
        },
        {
            id:2,
            company: "Google",
            ceoName: "Sundar Pichai",
            website: "https://about.google/"

        },
        {
            id:3,
            company: "Apple",
            ceoName: "Tim Cook",
            website:"https://www.apple.com/"
        },
        {
            id:4,
            company: "Amazon",
            ceoName: "Andy Jassy",
            website: "https://www.amazon.jobs/"
            
        },
        {
            id:5,
            company: "Tesla",
            ceoName: "Elon Musk",
            website: "https://www.tesla.com"
        },
        {
            id:6,
            company: "Meta",
            ceoName: "Mark Zuckerberg",
            website: "https://about.meta.com"
        }    
    ]

}