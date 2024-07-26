// This consolidated component is used to show avatar, message and caregiver notification setting
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import BRANDED_NAVI_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_NAVI_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import CAREGIVER_PROFILE_URL from '@salesforce/label/c.BI_PSPB_CaregiverProfileUrl';
import CAREGIVER_PATIENT_URL from '@salesforce/label/c.BI_PSPB_CaregiverPatientUrl';
import CAREGIVER_SELECT_URL from '@salesforce/label/c.BI_PSPB_CaregiverSelectAvatarUrl';
import CAREGIVER_NOTIFY_URL from '@salesforce/label/c.BI_PSPB_CaregiverNotificationPageUrl';

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
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (DESIRED_COMPONENTS.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_NAVI_URL;
			} else {
				this.urlq = UNASSIGNED_NAVI_URL;
			}
		}
		catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); //catching potential error from LWC
		}
	}
	// navigation for caregiver
	openCarMyProfile() {
		window.location.assign(this.urlq + CAREGIVER_PROFILE_URL);
	}
	openCarMyCaregiver() {
		window.location.assign(this.urlq + CAREGIVER_PATIENT_URL);
	}
	openCarSelectAvatar() {
		window.location.assign(
			this.urlq + CAREGIVER_SELECT_URL
		);
	}
	openCarNotSettings() {
		window.location.assign(
			this.urlq + CAREGIVER_NOTIFY_URL
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