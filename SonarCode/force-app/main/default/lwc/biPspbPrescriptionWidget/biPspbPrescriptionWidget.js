//This component for unassigned update prescription.
//To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import static resource
import WIDGET_ICON from '@salesforce/resourceUrl/BI_PSPB_UpdateRxIcon';
//To import custom labels
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import UPDATERX from '@salesforce/label/c.BI_PSPB_UpdatePrescriptionUrl';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class BiPspbPrescriptionWidget extends LightningElement {
	// navigation for update prescription component
	myUrl = WIDGET_ICON;
	unassignedUrl = UNASSIGNED_SITE_URL;
	updateRx = UPDATERX;
	baseUrl;
	currentPageUrl;
	urlSegments;
	connectedCallback() {
		try {
		const globalThis = window;
		this.currentPageUrl = globalThis.location.href;
		this.urlSegments = this.currentPageUrl.split('/');
		this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		} catch (error) {
		this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR);
		}
	}
	navigateUpdateRx() {
		window.location.href = this.baseUrl + this.unassignedUrl + this.updateRx;
	}
		// showToast used for all the error messages caught
		showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if (typeof window !== 'undefined') {
		this.dispatchEvent(event);
		}
	}
}