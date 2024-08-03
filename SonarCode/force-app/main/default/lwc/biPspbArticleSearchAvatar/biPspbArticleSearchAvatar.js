// This lightning web component is used to display the avatar message in the Information Center search article Page
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';

// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';
import ARTICLE_SEARCH_AVATAR_MESSAGE from '@salesforce/label/c.BI_PSPB_ArticleSearchAvatarMessage';

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
	articleSearchAvatarMessage = ARTICLE_SEARCH_AVATAR_MESSAGE;
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
	
	/* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
		Therefore, null data won't be encountered. */
	// To retrieve the logged in user name and selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
		if (data) {
			this.cardImage = data[0]?.BI_PSP_AvatarUrl__c
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