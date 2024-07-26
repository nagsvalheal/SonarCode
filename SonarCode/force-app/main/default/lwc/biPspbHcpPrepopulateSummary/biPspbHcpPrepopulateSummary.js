import { LightningElement, wire} from 'lwc';
// Imports resourceUrl to reference external resources for proper rendering and functionality.
import IMG from '@salesforce/resourceUrl/BI_PSPB_ThankYouImage';
import BGPP from '@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo';
// Importing Apex classes to interact with Salesforce backend for data retrieval.
import LEAD_GET from '@salesforce/apex/BI_PSPB_LeadCreationCtrl.getLead';
import CAREGIVER_GET from '@salesforce/apex/BI_PSPB_CreateLeadCtrl.getHcpDetails';
// Imports labels for descriptive text or identifiers, enhancing accessibility and user understanding.
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
// Imports showToastEvent to display notification messages, informing users about component actions or events.
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class BiPspbHcpPrepopulateSummary extends LightningElement {

	age = true;
	recordDetails;
	caregiver;
	result;
	recordId;
	count;
	patientEmail;
	mailImg = IMG;
	beyandGpp = BGPP;

	//  get lead record from apex
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	//Therefore, null data won't be encountered.
	@wire(LEAD_GET, { createLeadId: '$recordId' })
	wiredRecordDetailsLead({ error, data }) {
		try {
			if (data && data.length > 0) {
				this.recordDetails = data;
				this.patientEmail = data[0].Email;

			}
			else if (error) {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from apex
			}
		}
		catch (err) {
			// Handle any errors that occur within the try block

			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);// Catching Potential Error from lwc

		}

	}
	// get hcp record from apex
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	//Therefore, null data won't be encountered.
	@wire(CAREGIVER_GET, { leadId: '$recordId' })
	wiredRecordDetailsCaregiver({ error, data }) {
		try {
			if (data && data.length > 0) {
				this.caregiver = data;

				this.age = true;

			}
			else if (error) {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from apex

			}
		}
		catch (err) {
			// Handle any errors that occur within the try block

			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);// Catching Potential Error from lwc

		}
	}

	renderedCallback() {
		try {
			// Retrieve the recordId from localStorage
			this.recordId = localStorage.getItem('recordId');
			this.count = localStorage.getItem('count');
			if (this.count !== 2) {
				localStorage.setItem('count', 2);
			}
		} catch (error) {
			// Handle any errors that occur within the try block

			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from lwc
		}
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