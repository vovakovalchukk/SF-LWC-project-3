import deleteContacts from '@salesforce/apex/ContactController.deleteContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LightningElement, api } from 'lwc';

export default class ModalContactDeleting extends LightningElement {
    
    @api recordId;

    handleCloseDeleteContactModal() {
        const selectedEvent = new CustomEvent("handleclosedeletecontactmodal");
        this.dispatchEvent(selectedEvent);
    }

    handleDelete() {
        console.log('delete');
        console.log(this.recordId);
        deleteContacts({lstConIds: [this.recordId]})
        .then(result => {
            console.log(result);
            const toastEvent = new ShowToastEvent({
                title: "Contact deleted",
                message: "Record ID: " + this.recordId,
                variant: "success"
            });
            this.dispatchEvent(toastEvent);

            this.handleCloseDeleteContactModal();

        })
        .catch(error => {
            window.console.log(error);
            const toastEvent = new ShowToastEvent({
                title: "Error while getting Contacts",
                message: error.message,
                variant: "error"
            });
            this.dispatchEvent(toastEvent);
        });
        
    }
}