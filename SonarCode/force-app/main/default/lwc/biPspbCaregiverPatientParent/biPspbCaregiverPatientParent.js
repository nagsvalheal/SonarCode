//This  consolidates component the functionality for caregivers to view patient information and perform updates when logged in
//To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//To import Static resources
import BRANDED_URL from "@salesforce/label/c.BI_PSPB_SiteLabel";
import UNASSIGNED_URL from "@salesforce/label/c.BI_PSPB_UnAssignedLabel";
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SIT_EURL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
//To import The Custom labels
import CAREGIVER_NOTIFICATION from '@salesforce/label/c.BI_PSPB_CaregiverNotification';
import CAREGIVER_PROFILE_SITE from '@salesforce/label/c.BI_PSPB_CaregiverProfileSite';
import CAREGIVER_PATIENT from '@salesforce/label/c.BI_PSPB_CaregiverPatient';
import CAREGIVER_SELECT_AVATAR from '@salesforce/label/c.BI_PSPB_CaregiverSelectAvatar';
import errormessage from '@salesforce/label/c.BI_PSP_ConsoleError';
import errorvariant from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class BiPspbCaregiverPatientParent extends LightningElement {

	renderedCallback() {
		try {
			const currentURL = window.location.href;
			// Create a URL object
			const urlObject = new URL(currentURL); // Get the path
			const path = urlObject.pathname; // Split the path using '/' as a separator
			const pathComponents = path.split("/"); // Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_SITE_URL;
			} else {
				this.urlq = UNASSIGNED_SIT_EURL;
			}
		}
		catch (err) {
			// Handle error
			this.showToast(errormessage, err.message, errorvariant);
		}
	}

	//These are caregiver account manager Navigation
	openCarMyProfile() {
		window.location.assign(this.urlq + CAREGIVER_PROFILE_SITE);
	}
	openCarMyCaregiver() {
		window.location.assign(this.urlq + CAREGIVER_PATIENT);
	}
	openCarSelectAvatar() {
		window.location.assign(this.urlq + CAREGIVER_SELECT_AVATAR);
	}
	openCarNotSettings() {
		window.location.assign(this.urlq + CAREGIVER_NOTIFICATION);
	}

	//this ShowToast message is used for Error
	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}

}