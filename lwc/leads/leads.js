import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

import getLeads from '@salesforce/apex/LeadController.getLeads';

const COLUMNS = [
    { label: 'Name', fieldName: 'LeadLink', type: 'url', typeAttributes: {
        label: {
            fieldName: 'Name'
        }
    } },
    { label: 'Title', fieldName: 'Title', type: 'text', editable: 'true'  },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: 'true' },
];

export default class Leads extends LightningElement {
    columns = COLUMNS;
    draftValues = [];

    wiredLeadResult;

    @track leads;
    @track error;

    @wire(getLeads)
    imperativeWiring(result) {
        this.wiredLeadResult = result;
        const { data, error } = result;
        if(data) {
            this.leads = data.map(function(item) {
                return {
                    'Id' : item.Id,
                    'Name' : item.Name,
                    'LeadLink' : '/lightning/r/Lead/' + item.Id + '/view',
                    'Title' : item.Title,
                    'Phone' : item.Phone,
                }
            });
        }
    }

    handleCellChange(event) {
        const fields = {}; 
        fields['Id'] = event.detail.draftValues[0].Id;
        fields['Title'] = event.detail.draftValues[0].Title;
        fields['Phone'] = event.detail.draftValues[0].Phone;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Lead updated',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredLeadResult).then(() => {
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