// This consolidated component is used to show avatar , message and selecting an avatar whenever user wants to change
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Custom Labels
import {label} from 'c/biPspbAvatarResources';
export default class BiPspbCgSelectAvatarParent extends LightningElement {
	//this method is used to navigating a user unassigned and branded
	renderedCallback() {
		try {
			const CURRENT_URL = window.location.href;
			// Create a URL object
			const URL_OBJECT = new URL(CURRENT_URL);        // Get the PATH
			const PATH = URL_OBJECT.pathname;        // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/');        // Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find(component =>
				[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);


			if (DESIRED_COMPONENTS.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
				this.urlq = label.BRANDED_SITEURL;
			}
			else {
				this.urlq = label.UNASSIGNED_SITE_URL;
			}
		} catch (error) {
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); //catching potential error in LWC
		}
	}
	// navigation for caregiver

	openCarMyProfile() {
		window.location.assign(this.urlq + label.CAREGIVER_PROFILE_URL);
	}
	openCarMyCaregiver() {
		window.location.assign(this.urlq + label.CAREGIVER_PATIENT_URL);
	}
	openCarSelectAvatar() {
		window.location.assign(this.urlq + label.CAREGIVER_SELECT_URL);
	}
	openCarNotSettings() {
		window.location.assign(this.urlq + label.CAREGIVER_NOTIFY_URL);
	}
	showToast(title, message, variant) {
		const EVENT = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(EVENT);
	}
}