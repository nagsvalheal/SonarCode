/*This LWC checks for patient or caregiver and navigates to
notification settings*/ 
// To import libraries
import { LightningElement } from 'lwc';
// Import Apex Classes
import PROFILE_DETAILS from '@salesforce/apex/BI_PSPB_LoginCtrl.profileDetails';
// Importing all the resources used here from the file biPspbReminderNotificationSettResources.js.
import {resources} from 'c/biPspbNotificationReminderResources';
export default class BiPspbReminderNotificationSetting extends LightningElement {
	// Variable declaration and assigning values to it.
	question = resources.QUESTION;
	boxedIcon = resources.YELLOW_ICON;
	preferredWay = resources.PREFERRED_WAY;
	notificationSettings = resources.NOTIFICATION_SETTINGS;
	userId = resources.ID;
	caregiverNotificationUrl = resources.CAREGIVER_NOTIFICATION_URL;
	patientNotificationUrl = resources.PATIENT_NOTIFICATION_URL;
	systemAdmininstrator = resources.SYSTEM_ADMIN_PROFILE;
	patientProfile = resources.PATIENT_PROFILES;
	caregiverProfile = resources.CAREGIVER_PROFILES;
	siteUrlBranded = resources.BRANDED_URL;
	baseUrl;
	notificationSettingsUrl;
	profileName;
	// To check on the page URLs while loading the page.
	connectedCallback() {
		try {
			this.setCurrentPageUrl();
			this.parseUrlSegments();
			this.fetchProfileDetails();
		} catch {
			let globalThis=window;
			globalThis.location.href = resources.ERROR_PAGE;
			globalThis.sessionStorage.setItem('errorMessage', resources.ERROR_FOR_PROFILE);
		}
	}
	// To get the url of the current page.
	setCurrentPageUrl() {
		let globalThis = window;
		this.currentPageUrl = globalThis.location.href;
	}
	// To split the url based on protocol and host.
	parseUrlSegments() {
        let url = new URL(this.currentPageUrl);
        this.baseUrl = `${url.protocol}//${url.host}`;
    }
	// To fetch whether the user is a patient or a caregiver.
	fetchProfileDetails() {
		PROFILE_DETAILS()
			.then(profile => {
				this.profileName = profile.Name;
			})
			.catch(() => {
				let globalThis=window;
				globalThis.location.href = resources.ERROR_PAGE;
				globalThis.sessionStorage.setItem('errorMessage', resources.ERROR_FOR_PROFILE);
			});
	}
	// Redirects users to their notification settings based on their profile (patient or caregiver).
	openNotificationSettings() 
	{	
		if (this.profileName === this.patientProfile) 
			{
			const MERGED_URL =  this.siteUrlBranded + this.patientNotificationUrl;
			window.location.assign(MERGED_URL);
			} 
		else if (this.profileName === this.caregiverProfile) 
			{
			const MERGED_URL =  this.siteUrlBranded + this.caregiverNotificationUrl;
			window.location.assign(MERGED_URL);
			}    
	}
}