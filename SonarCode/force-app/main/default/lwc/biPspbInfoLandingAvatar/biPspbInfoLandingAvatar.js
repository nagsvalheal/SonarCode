// This lightning web component is used to display the landing avatar message in the Information Center Landing Page
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Static Resources
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
//  To import Apex Classes
import USER_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver';
import GET_LOGGED_IN_USER_ACCOUNT from '@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';

export default class BiPspbInfoLandingAvatar extends LightningElement {
	patientStatusRecord = '';
	caregiver = false;
	renderedCount=0;
	userAccounts;
	cardImage = '';

	
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
	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retireve the Avatar of the Caregiver
	@wire(USER_CAREGIVER)
	wiredAvatarList({ error, data }) {
		try {
			if (data) {
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
			if (data) {
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
		this.dispatchEvent(event);
	}
}