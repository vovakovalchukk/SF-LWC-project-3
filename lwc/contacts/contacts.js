import { LightningElement, track, wire } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import { refreshApex } from '@salesforce/apex';

import searchContacts from '@salesforce/apex/ContactController.searchContacts';

const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName', type: 'text', },
    { label: 'Last Name', fieldName: 'LastName', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Account Name', fieldName: 'AccountLink', type: 'url', typeAttributes: { 
        label: { 
            fieldName: 'AccountName'
        } 
    } },
    { label: 'Mobule Phone', fieldName: 'MobilePhone', type: 'phone' },
    { label: 'Created Date', fieldName: 'CreatedDate', type: 'date', typeAttributes: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    } },
    { label: 'Action', type: "button", typeAttributes: {
                label: 'Delete',
                name: 'Delete',
                title: 'Delete',
                disabled: false,
                value: 'Delete',
                iconPosition: 'right'
    } },
];

export default class Contacts extends LightningElement {
    columns = COLUMNS;

    wiredContactResult;
    searchTerm = '';
    @track contacts;
    @track error;

    recordId;

    @wire(searchContacts, { searchTerm: '$searchTerm' })
    imperativeWiring(result) {
        this.wiredContactResult = result;
        const { data, error } = result; // destructure the provisioned value    
        if(data) {
            this.contacts = data.map(function(item) {
                return {
                    'Id' : item.Id,
                    'FirstName' : item.FirstName,
                    'LastName' : item.LastName,
                    'Email' : item.Email,
                    'MobilePhone' : item.MobilePhone,
                    'AccountLink' : '/lightning/r/Account/' + item.Account.Id + '/view',
                    'AccountName' : item.Account.Name,
                    'CreatedDate' : item.CreatedDate,
                }
            });
        }
    }
    handleLogACall() {
        // Use the value to refresh wiredGetActivityHistory().
        return refreshApex(this.wiredContactResult);
    }
    
    @track showModalCreateContact = false;
    @track showModalDeleteContact = false;

    handleOpenCreateContactModal() {
        this.showModalCreateContact = true;
    }

    handleOpenDeleteContactModal() {
        this.showModalDeleteContact = true;
    }
 
    handleCloseCreateContactModal() {
        this.showModalCreateContact = false;
        this.refreshApexData();
    }

    handleCloseDeleteContactModal() {
        this.showModalDeleteContact = false;
        this.refreshApexData();
    }

    handleSearch() {
        refreshApex(this.wiredContactResult)
        .then(() => {
            this.searchTerm = this.template.querySelector('.slds-var-m-bottom_small').value;
        });
    }

    handleRowAction(event) {
        this.recordId = event.detail.row.Id;
        this.handleOpenDeleteContactModal();
    }

    refreshApexData() {
        refreshApex(this.wiredContactResult);
    }

    get errors() {
        return (this.error) ?
            reduceErrors(this.error) : [];
    }
}