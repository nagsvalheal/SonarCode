import { LightningElement } from 'lwc';


export default class BiPspDisplayErrorPage extends LightningElement {
    errorMessage;

    connectedCallback() {
        const globalThis = window;
        // Retrieve data from sessionStorage when the component is connected
        this.errorMessage = globalThis.sessionStorage.getItem('errorMessage');
    }
}