// This lightning web component is used to display the avatar message in the Information Center category Page
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import USER_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver';
import GET_LOGGED_IN_USER_ACCOUNT from '@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount';
// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
// To import Custom Labels
import {LABELS} from 'c/biPspbLabelForInfoCenter';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbArticleCategoryAvatar extends LightningElement {
	urlq;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showBrandedNav = true;
	userId = ID;
	caregiver = false;
	renderedCount=0;
	acuteMessage = 'This is your information center. Find all the information you need to understand GPP. Learn the tips and tricks to better...';
	userAccounts;
	cardimage = '';
	
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

	// To retrieve the current site url
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
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIENT); // Catching Potential Error
		}
	}

	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve the caregiver's selected avatar
	@wire(USER_CAREGIVER)
	wiredavtList({ error, data }) {
		try {
			if (data) {
				if (data.length > 0) {
					this.caregiver = true;
					this.cardimage = data[0]?.BI_PSP_AvatarUrl__c
						? data[0]?.BI_PSP_AvatarUrl__c
						: DEFAULT_IMG;
					if (data[0]?.BI_PSP_AvatarUrl__c) {
						this.cardimage = data[0]?.BI_PSP_AvatarUrl__c;
					} else {
						this.cardimage = DEFAULT_IMG;
					}
				}
			} else if (error) {
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIENT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIENT); // Catching Potential Error from Lwc
		}
	}

	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve the patient's selected avatar
	@wire(GET_LOGGED_IN_USER_ACCOUNT)
	wiredUserAccounts({ error, data }) {
		try {
			if (data) {
				this.userAccounts = data;
				if (this.caregiver === false) {
					if (this.userAccounts[0]?.BI_PSP_AvatarUrl__c) {
						this.cardimage = this.userAccounts[0]?.BI_PSP_AvatarUrl__c;
					} else {
						this.cardimage = DEFAULT_IMG;
					}
				}
			} else if (error) {
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIENT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIENT); // Catching Potential Error from Lwc
		}
	}

	renderedCallback(){
		try{
			if(this.renderedCount===0){
				const event = new CustomEvent('childrendered', {
				detail: { rendered: true }
			});
			this.dispatchEvent(event);
				this.renderedCount++;
			}
		}
		catch(error){
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIENT); // Catching Potential Error from Lwc
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