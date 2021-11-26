import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FirstName from '@salesforce/schema/Contact.FirstName';
import LastName from '@salesforce/schema/Contact.LastName';
import Email from '@salesforce/schema/Contact.Email';
import AccountId from '@salesforce/schema/Contact.AccountId';
import MobilePhone from '@salesforce/schema/Contact.MobilePhone';

export default class ModalContactCreating extends LightningElement {
    
    handleCloseCreateContactModal() {
        const selectedEvent = new CustomEvent("handleclosecreatecontactmodal");
        this.dispatchEvent(selectedEvent);
    }

    objectApiName = CONTACT_OBJECT;

    firstName = FirstName;
    lastName = LastName;
    email = Email;
    accountId = AccountId;
    mobilePhone = MobilePhone;

    fields = ['FirstName', 'LastName', 'Email', 'AccountId', 'MobilePhone',];
    handleSuccess(event) {
        const toastEvent = new ShowToastEvent({
            title: "Contact created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
        this.handleCloseCreateContactModal();
    }
}