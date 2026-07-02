import { LightningElement,wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactControllerLwc.getContacts';
const DELAY = 500;

export default class FilteringAndSortingDemo extends LightningElement {
    tableHeadings = ["Id", "Title", "FirstName", "LastName", "Department", "Email"];
    filterByValue = "FirstName";
    sortByValue = 'FirstName'
    timerId;
    fullDataTable = [];
    filteredDataTable = [];

    @wire(getContacts)
    contactListHandler({ data, error }) {
        if (data) {
            this.fullDataTable = data;
            this.filteredDataTable = [...this.sortByMethod(data)]
        }
        if (error) {
            console.error(error);
        }
    }

    get filterOptions() {
        return [
            { label: "All", value: "All" },
            { label: "Id", value: "Id" },
            { label: "Title", value: "Title" },
            { label: "First Name", value: "FirstName" },
            { label: "Last Name", value: "LastName" },
            { label: "Department", value: "Department" },
            { label: "Email", value: "Email" }
        ];
    }
    get sortOptions(){
        return [
            { label: "Title", value: "Title" },
            { label: "First Name", value: "FirstName" },
            { label: "Last Name", value: "LastName" },
            { label: "Department", value: "Department" },
            { label: "Email", value: "Email" }
        ];
    }

    handleFilterChange(event) {
        this.filterByValue = event.detail.value;
    }

    filterContactHandler(event) {
        const inputValue = event.target.value;
        window.clearTimeout(this.timerId);

        this.timerId = window.setTimeout(() => {
            if (!inputValue) {
                this.filteredDataTable = [...this.fullDataTable];
                return;
            }

            const searchTerm = inputValue.toLowerCase();

            this.filteredDataTable = this.fullDataTable.filter(eachObj => {
                if (this.filterByValue === "All") {
                    return Object.keys(eachObj).some(key => {
                        const val = eachObj[key];
                        return typeof val === 'string' && val.toLowerCase().includes(searchTerm);
                    });
                } else {
                    const val = eachObj[this.filterByValue] || '';
                    return val.toLowerCase().includes(searchTerm);
                }
            });
        }, DELAY);
    }
    /*Sorting  Logic*/
    sortChangeHandler(event){
        this.sortByValue = event.detail.value
        this.filteredDataTable = [...this.sortByMethod(this.filteredDataTable)]
    }
    sortByMethod(data){
        const cloneData =[...data]
        cloneData.sort((a,b) => {
            if(a[this.sortByValue] === b[this.sortByValue]){
                return 0;
            }
            return this.sortDirection === 'desc' ?
            a[this.sortByValue] > b[this.sortByValue] ? -1 : 1 :
            a[this.sortByValue] < b[this.sortByValue] ? -1 : 1
        })
        return cloneData
    }
}