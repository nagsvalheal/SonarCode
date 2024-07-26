// This is consolidated component for unassigned notification setting page.
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Custom Labels
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import CAREGIVER_PROFILE from '@salesforce/label/c.BI_PSPB_CaregiverProfileUrl';
import PATIENT_INFO from '@salesforce/label/c.BI_PSPB_CaregiverPatientUrl';
import SELECT_AVATAR from '@salesforce/label/c.BI_PSPB_CaregiverSelectAvatarUrl';
import NOTIFICATION from '@salesforce/label/c.BI_PSPB_CaregiverNotificationPageUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class BiPspbNotificationForCaregiver extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	unAssignedUrl = UNASSIGNED_SITE_URL;
	caregiverProfile = CAREGIVER_PROFILE;
	patientInfo = PATIENT_INFO;
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



	// navigate unassigned site  home page 
	openHome() {
		window.location.assign(this.baseUrl + this.unAssignedUrl);
	}
	// navigate unassigned site caregiverprofile page 
	openCarMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.caregiverProfile);
	}
	// navigate unassigned site caregiverpatient page 
	openCarMyCaregiver() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.patientInfo);
	}
	// navigate unassigned site caregiverselectavatar page
	openCarSelectAvatar() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.selectAvatar);
	}
	// navigate unassigned site caregivernotification page
	openCarNotSettings() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.patientNotification);
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