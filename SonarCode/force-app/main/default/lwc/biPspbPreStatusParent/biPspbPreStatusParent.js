import { LightningElement } from 'lwc';
// To Import Custom Labels
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import PRESCRIPTION_STATUS from '@salesforce/label/c.BI_PSPB_PrescriptionStatusUrl';
import UPDATERX from '@salesforce/label/c.BI_PSPB_UpdatePrescriptionUrl';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';

export default class BiPspbPreStatusParent extends LightningElement {

	brandedUrl = BRANDED_URL;
	unassignedUrl = UNASSIGNED_URL;
	brandedUrlNavi = BRANDED_URL_NAVI;
	updateRx = UPDATERX;
	unAssignedUrlNavi = UNASSIGNED_URL_NAVI;
	prescription = PRESCRIPTION_STATUS;
	urlq;

	// To get the current site path Branded or Unassigned and navigate to the respective page
	connectedCallback() {
		try {
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/');
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[
					this.brandedUrl.toLowerCase(),
					this.unassignedUrl.toLowerCase()
				].includes(component.toLowerCase())
			);

			if (DESIRED_COMPONENTS.toLowerCase() === this.brandedUrl.toLowerCase()) {
				this.urlq = this.brandedUrlNavi;
			} else {
				this.urlq = this.unAssignedUrlNavi;
			}

		} catch (error) {
			// Handle error
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}

	// navigate the user into the unassigned update prescription parent page
	openUpdatePrescription() {
		window.location.assign(this.urlq + this.updateRx);
	}
	// navigate the user into the unassigned priscription status parent page
	openStatus() {
		window.location.assign(this.urlq + this.prescription);
	}
	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		if (typeof window !== 'undefined') {
			const event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}
}