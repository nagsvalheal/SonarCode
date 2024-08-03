// This lightning web component is used to display the landing avatar message in the Information Center Landing Page
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Static Resources
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
//  To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';
import SEARCH_AVATAR_MESSAGE from '@salesforce/label/c.BI_PSPB_ArticleSearchAvatarMessage';


export default class BiPspbInfoLandingAvatar extends LightningElement {
	patientStatusRecord = '';
	caregiver = false;
	renderedCount=0;
	userAccounts;
	cardImage = '';
	searchAvatarMessage = SEARCH_AVATAR_MESSAGE;

	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retirieve the staus value of a Patient
	@wire(PATIENT_STATUS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientStatusRecord = data;
			} else if (error) {
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
			}
			
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	// To set the property of para element if the status is unassigned
	renderedCallback() {
		try {
			if (this.patientStatusRecord === LABELS.UNASSIGNED_STATUS) {
				// Assuming you have a paragraph element with the class para
				let paraElement = this.template.querySelector(".para");
				// Check if the element with the class para exists
				if (paraElement) {
					if (window.innerWidth > 1115) {
						// Set the top property to 10%
						// Double quotes is used to render the CSS value - Unavoidable
						paraElement.style.marginTop = "-27px";
					}
				}
			}
			const event = new CustomEvent('childrendered', {
				detail: { rendered: true }
			});
			if(this.renderedCount===0){
			this.dispatchEvent(event);
			this.renderedCount++;
			}
		} catch (error) {
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIANT); // Catching Potential Error
		}
	}

	/* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
		Therefore, null data won't be encountered. */
	// To retrieve the logged in user selected avatar
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
		this.dispatchEvent(event);
	}
}