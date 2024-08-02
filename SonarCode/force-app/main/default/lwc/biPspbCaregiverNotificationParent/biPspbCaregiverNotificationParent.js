// This consolidated component is used to show avatar, message and caregiver notification setting
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {resources} from 'c/biPspbResourceProfileManager';

export default class BiPspbCaregiverNotificationParent extends LightningElement {
	//this method is used to navigating a user unassigned and branded
	connectedCallback()  {
		try {
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/'); // Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
				[resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (DESIRED_COMPONENTS.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
				this.urlq = resources.BRANDED_NAVI_URL;
			} else {
				this.urlq = resources.UNASSIGNED_NAVI_URL;
			}
		}
		catch (error) {
			this.showToast(resources.ERROR_MESSAGE, error.message, resources.ERROR_VARIANT); //catching potential error from LWC
		}
	}
	// navigation for caregiver
	openCarMyProfile() {
		window.location.assign(this.urlq + resources.CAREGIVER_PROFILE_URL);
	}
	openCarMyCaregiver() {
		window.location.assign(this.urlq + resources.CAREGIVER_PATIENT_URL);
	}
	openCarSelectAvatar() {
		window.location.assign(
			this.urlq + resources.CAREGIVER_SELECT_URL
		);
	}
	openCarNotSettings() {
		window.location.assign(
			this.urlq + resources.CAREGIVER_NOTIFY_URL
		);
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