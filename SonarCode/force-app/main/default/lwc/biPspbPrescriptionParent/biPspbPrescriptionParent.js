// To import libraries
import { LightningElement } from 'lwc';
// To Import Custom Labels
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LABELS } from 'c/biPspbLabelForUpdatePrescription';

export default class BiPspbPrescriptionParent extends LightningElement {

	brandedUrl = LABELS.BRANDED_URL;
	unassignedUrl = LABELS.UNASSIGNED_URL;
	brandedUrlNavi = LABELS.BRANDED_URL_NAVI;
	updateRx = LABELS.UPDATERX;
	unAssignedUrlNavi = LABELS.UNASSIGNED_URL_NAVI;
	prescription = LABELS.PRESCRIPTION_STATUS;
	urlq;
	updatePrescriptionLabel = LABELS.UPDATE_PRESCRIPTION_LABEL;
	prescriptionStatusLabel = LABELS.PRESCRIPTION_STATUS_LABEL;

	connectedCallback() {
		try {
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/'); // Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[this.brandedUrl.toLowerCase(), this.unassignedUrl.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (DESIRED_COMPONENTS.toLowerCase() === this.brandedUrl.toLowerCase()) {
				this.urlq = this.brandedUrlNavi;
			} else {
				this.urlq = this.unAssignedUrlNavi;
			}

		} catch (error) {
			// Handle error
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIANT);
		}
	}

	// navigate the user into the unassigned update prescription cmp page
	openUpdatePrescription() {
		window.location.assign(this.urlq + this.updateRx);
	}
	// navigate the user into the unassigned priscription status  cmp page
	openStatus() {
		window.location.assign(this.urlq + this.prescription);
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