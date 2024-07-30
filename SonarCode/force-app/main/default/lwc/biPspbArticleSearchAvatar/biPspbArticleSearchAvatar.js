// This lightning web component is used to display the avatar message in the Information Center search article Page
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import USER_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver';
import GET_LOGGED_IN_USER_ACCOUNT from '@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount';
// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';

// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbArticleSearchAvatar extends LightningElement {
	urlq;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showBrandedNav = true;
	userId = ID;
	caregiver = false;
	renderedCount = 0;
	userAccounts;
	cardImage = '';
	acuteMessage = 'This is your information center. Find all the information you need to understand GPP. Learn the tips and tricks to better...';

	// Method to display message for mobile
	displayMessage() {
		this.acuteMessage = 'This is your information center. Find all the information you need to understand GPP. Learn the tips and tricks to better...';
		this.template.querySelector('.paranew').style.display = 'block';
	}

	// Method to display message for desktop
	displayExpandedMessage() {
		this.acuteMessage = 'This is your information center. Find all the information you need to understand GPP. Learn the tips and tricks to better manage your condition.';
		this.template.querySelector('.paranew').style.display = 'none';
	}

	// To retireve current URL, based on that navigation will be set
	connectedCallback() {
		try {
		let globalThis = window;
		let currentUrl = globalThis.location.href;
		// Create a URL object
		let urlObject = new URL(currentUrl);
		// Get the path
		let path = urlObject.pathname;

		// Split the path using '/' as a separator
		let pathComponents = path.split('/');

		// Find the component you need (in this case, 'Branded')
		let desiredComponent = pathComponents.find((component) =>
			[LABELS.BRANDED_URL.toLowerCase(), LABELS.UNASSIGNED_URL.toLowerCase()].includes(
			component.toLowerCase()
			)
		);

		if (desiredComponent.toLowerCase() === LABELS.BRANDED_URL.toLowerCase()) {
			this.urlq = LABELS.BRANDED_URL;
		} else {
			this.urlq = LABELS.UNASSIGNED_URL;
		}
		this.currentPageUrl = globalThis.location.href;
		this.urlSegments = this.currentPageUrl.split('/');
		this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;

		if (this.urlq === LABELS.BRANDED_URL) {
			this.showBrandedNav = true;
		} else {
			this.showBrandedNav = false;
		}
		} catch (error) {
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIANT); // Catching Potential Error
		}
	}

	// renderedCallback to dispatch event for parent component to identify component is rendered
	renderedCallback(){
		try{
			const event = new CustomEvent('childrendered', {
				detail: { rendered: true }
			});
			if(this.renderedCount<=2){
			this.dispatchEvent(event);
			this.renderedCount = this.rendedCount+1;
			}
			
		}
		catch(error){
			this.showToastEvent(LABELS.ERROR_MESSAGE,error.message,LABELS.ERROR_VARIANT);
		}
	}

	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retireve the Avatar of the Caregiver
	@wire(USER_CAREGIVER)
	wiredAvatarList({ error, data }) {
		try {
		if (data && data.length>0) {
			if (data.length > 0) {
			this.caregiver = true;
			this.cardImage = data[0]?.BI_PSP_AvatarUrl__c
				? data[0]?.BI_PSP_AvatarUrl__c
				: DEFAULT_IMG;
			if (data[0]?.BI_PSP_AvatarUrl__c) {
				this.cardImage = data[0]?.BI_PSP_AvatarUrl__c;
			} else {
				this.cardImage = DEFAULT_IMG;
			}
			}
		} else if (error) {
			this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
		}
		} catch (err) {
		this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}
	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retireve the Avatar of the Patient
	@wire(GET_LOGGED_IN_USER_ACCOUNT)
	wiredUserAccounts({ error, data }) {
		try {
		if (data && data.length>0) {
			this.userAccounts = data;
			if (this.caregiver === false) {
			if (this.userAccounts[0]?.BI_PSP_AvatarUrl__c) {
				this.cardImage = this.userAccounts[0]?.BI_PSP_AvatarUrl__c;
			} else {
				this.cardImage = DEFAULT_IMG;
			}
			}
		} else if (error) {
			this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
		}
		} catch (err) {
		this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		let event = new ShowToastEvent({
		title: title,
		message: message,
		variant: variant
		});

		if(typeof window !== 'undefined'){
		this.dispatchEvent(event);
		}
	}
}