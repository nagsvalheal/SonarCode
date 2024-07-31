// This Lightning Web Component serves as the navigation and parent component for the caregiver profile
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {resources} from 'c/biPspbResourceProfileManager';

export default class BiPspbCaregiverProfileParent extends LightningElement {
	// Declaration of global variables
	siteUrlq;
	urlq;

	// Navigate to the caregiver profile page
	openCarMyProfile() {
		window.location.assign(this.siteUrlq + resources.CAREGIVER_PROFILE);
	}

	// Navigate to the caregiver patient page
	openCarMyCaregiver() {
		window.location.assign(this.siteUrlq + resources.CAREGIVER_PATIENT);
	}

	// Navigate to the caregiver select avatar page
	openCarSelectAvatar() {
		window.location.assign(this.siteUrlq + resources.CAREGIVER_SELECT_AVATAR);
	}

	// Navigate to the caregiver notifications page
	openCarNotSettings() {
		window.location.assign(this.siteUrlq + resources.CAREGIVER_NOTIFICATIONS);
	}

	// To reterieve the site url
	renderedCallback() {
		try {
		let currentUrl = window.location.href;
		let urlObject = new URL(currentUrl); // Get the path
		let path = urlObject.pathname; // Split the path using '/' as a separator
		let pathComponents = path.split('/'); // Find the component you need (in this case, 'Branded')
		let desiredComponent = pathComponents.find((component) =>
			[resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
			component.toLowerCase()
			)
		);

		if (desiredComponent.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
			this.urlq = resources.BRANDED_URL;
			this.siteUrlq = resources.BRANDED_SITE_URL;
		} else {
			this.urlq = resources.UNASSIGNED_URL;
			this.siteUrlq = resources.UNASSIGNED_SITE_URL;
		}
		} catch (error) {
		// Handle error
		this.showToast(resources.ERROR_MESSAGE, error.message, resources.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		let event = new ShowToastEvent({
		title: title,
		message: message,
		variant: variant
		});
		this.dispatchEvent(event);
	}
}