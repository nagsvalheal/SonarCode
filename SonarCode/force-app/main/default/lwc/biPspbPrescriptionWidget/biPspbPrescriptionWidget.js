//This component for unassigned update prescription.
//To import Libraries
import { LightningElement } from 'lwc';
//To import static resource
import WIDGET_ICON from '@salesforce/resourceUrl/BI_PSPB_UpdateRxIcon';
//To import custom labels
import { LABELS } from 'c/biPspbLabelForUpdatePrescription';


export default class BiPspbPrescriptionWidget extends LightningElement {
	// navigation for update prescription component
	myUrl = WIDGET_ICON;
	unassignedUrl = LABELS.UNASSIGNED_URL_NAVI;
	updateRx = LABELS.UPDATERX;
	baseUrl;
	currentPageUrl;
	urlSegments;
	updatePrescriptionLabel = LABELS.UPDATE_PRESCRIPTION_LABEL;
	prescriptionMessage = LABELS.PRESCRIPTION_MESSAGE;
	updateLabel = LABELS.UPDATE_LABEL;
	connectedCallback() {
		try {
		const globalThis = window;
		this.currentPageUrl = globalThis.location.href;
		this.urlSegments = this.currentPageUrl.split('/');
		this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		} catch (error) {
		this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIANT);
		}
	}
	navigateUpdateRx() {
		window.location.href = this.baseUrl + this.unassignedUrl + this.updateRx;
	}
		// showToast used for all the error messages caught
		showToast(title, message, variant) {
			let messageList =title +' '+ message +' ' + variant;
			let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', messageList);
			globalThis.location.href = this.urlq + LABELS.ERROR_PAGE;
	}
}