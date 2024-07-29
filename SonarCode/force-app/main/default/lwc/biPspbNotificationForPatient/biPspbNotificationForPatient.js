// This is consolidate component for unassigned patient notification
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbNotificationForPatient extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	unassignedUrl = resources.UNASSIGNED_SITE_URL;
	myProfile = resources.MY_PROFILE;
	myCaregiver = resources.MY_CAREGIVER;
	selectAvatar = resources.SELECT_AVATAR;
	patientNotification = resources.NOTIFICATION;
	baseUrl;
	currentPageUrl;
	urlSegments;

	connectedCallback() {
		try {
			const globalThis = window;
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		}
		catch (error) {
			this.showToast(resources.ERROR_MESSAGE, error.body.message, resources.ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	// navigate unassigned site home page
	openHome() {
		window.location.assign(this.baseUrl + this.unassignedUrl);
	}
	// navigate unassigned site patientprofile page
	openPatMyProfile() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.myProfile);
	}
	// navigate unassigned site patientcaregiver page
	openPatMyCaregiver() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.myCaregiver);
	}
	openPatSelectAvatar() {
		// navigate unassigned site patientselectavatar page
		window.location.assign(this.baseUrl + this.unassignedUrl + this.selectAvatar);
	}
	// navigate unassigned site patientnotificationt page
	openPatNotSettings() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.patientNotification);
	}

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