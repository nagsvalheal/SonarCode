// This component is consolidate component used to update hcp patient information enrollment form main page.
// To import Libraries
import { LightningElement, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Static Resources
import IMG from '@salesforce/resourceUrl/BI_PSPB_ThankYouImage';
import BGPP from '@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo';
//  To import Apex Classes
import LEAD_GET from '@salesforce/apex/BI_PSPB_LeadCreationCtrl.getLead';
import CAREGIVER_GET from '@salesforce/apex/BI_PSPB_LeadCreationCtrl.getCaregiver';
import PHYSICIAN_GET from '@salesforce/apex/BI_PSPB_CreateLeadCtrl.getHcpDetails';
import COTHANKS_GET from '@salesforce/apex/BI_PSPB_LeadCreationCtrl.checkCaregiverData';
// To import Custom Label
import TO_ACTIVE_MSG from '@salesforce/label/c.BI_PSPB_ThankYouContent';
import EMAIL_SENT_MSG from '@salesforce/label/c.BI_PSPB_ThankYouEmailSent';
import CHECK_MAIL_MSG from '@salesforce/label/c.BI_PSPB_CheckEmail';
import EXISTING_ACCOUNT_MSG from '@salesforce/label/c.BI_PSPB_ThankYouMessage';
import SEND_AVATAR_MSG from '@salesforce/label/c.BI_PSPB_SendAvatarMsg';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class BiPspbPrepopulateSummaryPage extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of variables with  
	age = true;
	head = true;
	recordDetails;
	caregiver;
	cargivers;
	result;
	recordId;
	count;
	email;
	messageContent;
	messageContentTwo;
	contData;
	valueAvatar = false;
	careEmail;
	// Declaration of Global variables
	beyandGpp = BGPP;
	mailImg = IMG;

	//to get Lead's Physician record
	renderedCallback() {
		try {
			// Retrieve the recordId from localStorage
			this.recordId = localStorage.getItem('recordId');

			// this.count = localStorage.getItem('count');

			// if (this.count !== 2) {
			// 	localStorage.setItem('count', 2);
			// } else {
			// 	localStorage.setItem('count', 1);
			// }
			PHYSICIAN_GET({ leadId: this.recordId })
				.then((result) => {

					// Assuming result is an array of physician records
					// Assigning the result to a trackable property for further usage
					this.physicianData = result;

				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	//to get lead records using recordId
	@wire(LEAD_GET, { createLeadId: '$recordId' })
	wiredRecordDetailsLead({ error, data }) {
		try {

			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.recordDetails = data;
				this.email = data[0].Email;
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.body.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	//to get caregiver records using recordId
	@wire(CAREGIVER_GET, { caregiverCreateId: '$recordId' })
	wiredRecordDetailsCaregiver({ error, data }) {
		// Null data is checked and AuraHandledException is thrown from the Apex
		if (data && data.length > 0) {
			try {
				this.caregiver = data;
				this.age = true;
				this.head = true;
				this.careEmail = data[0].BI_PSPB_E_mail_ID__c;
				this.valueAvatar = true;
				if (this.careEmail) {
					this.callcothanks();
				}

				this.dispatchEvent(
					new CustomEvent(SEND_AVATAR_MSG, { detail: this.valueAvatar })
				);
			}
			catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
			}
		} else if (error && data.length > 0) {
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}


	//to get physician records using recordId
	@wire(PHYSICIAN_GET, { leadId: '$recordId' })
	wiredRecordDetailsCaregivers({ error, data }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {

				this.caregivers = data;
				this.age = false;
				this.head = false;
				if (this.age === false) {
					this.messageContent = TO_ACTIVE_MSG;
					this.messageContentTwo = EMAIL_SENT_MSG + ' ' + data[0].Email;
				}

			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	callcothanks() {
		COTHANKS_GET({ caregiverCreateId: this.recordId })
			.then(result => {

				this.contData = result;
				this.age = true;
				this.head = true;
				if (this.contData === true) {
					this.messageContent =
						CHECK_MAIL_MSG + ' ' + this.careEmail;
					this.messageContentTwo = EXISTING_ACCOUNT_MSG;
				} else {
					this.messageContent = TO_ACTIVE_MSG;
					this.messageContentTwo = EMAIL_SENT_MSG + ' ' + this.careEmail;
				}
			})
			.catch(err => {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
			})
	}


	showToast(title, message, variant) {
		const EVENT = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(EVENT);
	}
}