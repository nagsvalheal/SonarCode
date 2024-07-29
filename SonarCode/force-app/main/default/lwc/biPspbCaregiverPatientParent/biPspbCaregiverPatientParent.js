//This  consolidates component the functionality for caregivers to view patient information and perform updates when logged in
//To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {resources} from 'c/biPspbResourceProfileManager';

export default class BiPspbCaregiverPatientParent extends LightningElement {

	renderedCallback() {
		try {
			const currentURL = window.location.href;
			// Create a URL object
			const urlObject = new URL(currentURL); // Get the path
			const path = urlObject.pathname; // Split the path using '/' as a separator
			const pathComponents = path.split("/"); // Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find((component) =>
				[resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (desiredComponent.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
				this.urlq = resources.BRANDED_SITE_URL;
			} else {
				this.urlq = resources.UNASSIGNED_SITE_URL;
			}
		}
		catch (err) {
			// Handle error
			this.showToast(resources.ERRORMESSAGE, err.message, resources.ERRORVARIANT);
		}
	}

	//These are caregiver account manager Navigation
	openCarMyProfile() {
		window.location.assign(this.urlq + resources.CAREGIVER_PROFILE_SITE);
	}
	openCarMyCaregiver() {
		window.location.assign(this.urlq + resources.CAREGIVER_PATIENT);
	}
	openCarSelectAvatar() {
		window.location.assign(this.urlq + resources.CAREGIVER_SELECT_AVATAR);
	}
	openCarNotSettings() {
		window.location.assign(this.urlq + resources.CAREGIVER_NOTIFICATION);
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