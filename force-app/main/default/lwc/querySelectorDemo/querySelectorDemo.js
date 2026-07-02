import { LightningElement } from 'lwc';

export default class QuerySelectorDemo extends LightningElement {

    userNames = ["James","Jazzy", "Hershie", "Mizo", "Zgod"]

    fetchDetailsHandler(){
        const headerElem = this.template.querySelector('h1')
        headerElem.style.border = "1px solid red";
        console.log(headerElem.innerText);

        const userList= this.template.querySelectorAll('.name')
        Array.from(userList).forEach(item => {
            console.log(item.innerText)
            item.setAttribute("title", item.innerText)
        })

        //lwc:dom="manual" Demo
        const elem = this.template.querySelector('.child')
        elem.innerHTML ="<p>I am a child coming from lwc:dom demo</p>"


    }
}