import { LightningElement, track } from 'lwc';

export default class CitizenIdentityValidator extends LightningElement {

    identityNumber = '';
    @track message;

    handleInputChange(event) {
        this.identityNumber = event.target.value;
        this.message = null;
    }

    handleSubmit() {
        if (!this.identityNumber) {
            this.message = 'No identity number entered.';
            return;
        }

        this.message = `Identity number captured: ${this.identityNumber}`;
    }

}
