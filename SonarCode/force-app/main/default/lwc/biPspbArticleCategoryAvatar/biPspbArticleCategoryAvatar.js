// This lightning web component is used to display the avatar message in the Information Center category Page
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbArticleCategoryAvatar extends LightningElement {
	userId = ID;
	renderedCount = 0;
	acuteMessage =
		'This is your information center. Find all the information you need to understand GPP. Learn the tips and tricks to better...';
	cardimage = '';

	// Method to display message for mobile
	displayMessage() {
		this.acuteMessage =
		'This is your information center. Find all the information you need to understand GPP. Learn the tips and tricks to better...';
		this.template.querySelector('.paranew').style.display = 'block';
	}

	// Method to display message for desktop
	displayExpandedMessage() {
		this.acuteMessage =
		'This is your information center. Find all the information you need to understand GPP. Learn the tips and tricks to better manage your condition.';
		this.template.querySelector('.paranew').style.display = 'none';
	}

	/* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
		Therefore, null data won't be encountered. */
	// To retrieve the logged in user name and selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
		if (data) {
			this.cardimage = data[0]?.BI_PSP_AvatarUrl__c
			? data[0]?.BI_PSP_AvatarUrl__c
			: DEFAULT_IMG;
		} else if (error) {
			this.showToast(
			LABELS.ERROR_MESSAGE,
			error.body.message,
			LABELS.ERROR_VARIANT
			); // Catching Potential Error from Apex
		}
		} catch (err) {
		this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	renderedCallback() {
		try {
		if (this.renderedCount === 0) {
			const event = new CustomEvent('childrendered', {
			detail: { rendered: true }
			});
			this.dispatchEvent(event);
			this.renderedCount++;
		}
		} catch (error) {
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
		if (typeof window !== 'undefined') {
		this.dispatchEvent(event);
		}
	}
}