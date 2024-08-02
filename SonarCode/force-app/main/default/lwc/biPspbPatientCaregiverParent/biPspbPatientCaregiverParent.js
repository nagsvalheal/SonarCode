import { LightningElement } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {resources} from 'c/biPspbResourceProfileManager';
export default class  BiPspbPatientCaregiverParent extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	slashSiteUrl = resources.SLASH_URL;
	slashSitePageUrl = resources.SLASHSITE_URL;
	patientMyProfile = resources.PATIENT_MYPROFILE_URL;
	myCaregiver = resources.MYCAREGIVER_URL;
	patientSelectAvatar = resources.PATIENT_SELECTAVATAR_URL;
	patientNotification = resources.PATIENT_NOTIFICATION_URL;

	//connectedcallback is used for assign the url
	renderedCallback() {
		try {
			const currentURL = window.location.href;

			// Create a URL object
			const urlObject = new URL(currentURL);

			// Get the path
			const path = urlObject.pathname;

			// Split the path using '/' as a separator
			const pathComponents = path.split("/");

			// Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find((component) =>
				[resources.BRANDES_URL.toLowerCase(), resources.UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === resources.BRANDES_URL.toLowerCase()) {
				this.urlq = resources.BRANDED_URLS;
			} else {
				this.urlq = resources.UN_ASSIGNED_URLS;
			}
		} catch (error) {
			// Handle error
			this.showToast(resources.ERROR_MESSAGE, error.message, resources.ERROR_VARIANT);
		}
	}

	openPatMyProfile() {
		window.location.assign(this.urlq +this.patientMyProfile);
	}
	openPatMyCaregiver() {
		window.location.assign( this.urlq + this.myCaregiver);
	}

	openPatSelectAvatar() {
		window.location.assign(this.urlq +this.patientSelectAvatar);
	}
	openPatNotSettings() {
		window.location.assign(this.urlq + this.patientNotification);
	}
	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}
}