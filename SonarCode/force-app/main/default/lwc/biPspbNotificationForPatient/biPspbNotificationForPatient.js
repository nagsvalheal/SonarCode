// This is consolidate component for unassigned patient notification
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Custom Labels
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import MY_PROFILE from '@salesforce/label/c.BI_PSPB_PatientMyProfileUrl';
import MY_CAREGIVER from '@salesforce/label/c.BI_PSPB_MyCaregiverUrl';
import SELECT_AVATAR from '@salesforce/label/c.BI_PSPB_PatientSelectAvatarUrl';
import NOTIFICATION from '@salesforce/label/c.BI_PSPB_PatientNotificationUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class BiPspbNotificationForPatient extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	unassignedUrl = UNASSIGNED_SITE_URL;
	myProfile = MY_PROFILE;
	myCaregiver = MY_CAREGIVER;
	selectAvatar = SELECT_AVATAR;
	patientNotification = NOTIFICATION;
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
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from LWC
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