import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

import getContacts from '@salesforce/apex/ContactController.getContacts';

const COLUMNS = [
    { label: 'IdName', fieldName: 'IdName', type: 'text' },
    { label: 'Name', fieldName: 'ContactLink', type: 'url', typeAttributes: {
        label: {
            fieldName: 'Name'
        }
    }, editable: 'true' },
];

export default class Contacts2 extends LightningElement {
    columns = COLUMNS;
    draftValues = [];

    wiredContactResult;

    @track contacts;
    @track error;

    @wire(getContacts)
    imperativeWiring(result) {
        this.wiredContactResult = result;
        const { data, error } = result;
        if(data) {
            this.contacts = data.map(function(item) {
                return {
                    'Id' : item.Id,
                    'Name' : item.Name,
                    'ContactLink' : '/lightning/r/Contact/' + item.Id + '/view',
                    'IdName' : item.Id + item.Name,
                }
            });
        }
    }

    handleCellChange(event) {
        const fields = {}; 
        fields['Id'] = event.detail.draftValues[0].Id;
        fields['Name'] = event.detail.draftValues[0].Phone;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredContactResult).then(() => {
                this.draftValues = [];
            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

}