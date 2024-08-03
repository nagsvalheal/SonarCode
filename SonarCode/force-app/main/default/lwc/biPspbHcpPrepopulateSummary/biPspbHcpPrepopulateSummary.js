import { LightningElement, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Imports resourceUrl to reference external resources for proper rendering and functionality.
// Importing Apex classes to interact with Salesforce backend for data retrieval.
import LEAD_GET from '@salesforce/apex/BI_PSPB_ThankyouPageUtilites.getExistingLeads';
import CAREGIVER_GET from '@salesforce/apex/BI_PSPB_EnrollmentUtilities.getHcpDetails';
// Imports showToastEvent to display notification messages, informing users about component actions or events.
import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbHcpPrepopulateSummary extends LightningElement {
	toActive = resource.TO_ACTIVE;
	enrollThank = resource.ENROLL_THANK;
	addressColan = resource.ADRRESS_COLAN;
enrollHead = resource.ENROLL_SUMMARY;
nameColan = resource.NAME_COLAN;
dobColan = resource.DOB_COLAN;
emailColan = resource.EMAIL_COLAN;
phoneColan = resource.PHONE_COLAN;
prescriptionInfo = resource.PRESCRIPTION_INFO;
patientinfo = resource.PATIENT_INFO ;
physicianInfo = resource.PHYSICIAN_INFO ;
	age = true;
	recordDetails;
	caregiver;
	result;
	recordId;
	count;
	patientEmail;
	mailImg = resource.IMG;
	beyandGpp = resource.BGPP;

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
				this.HandleToast(error.message);// Catching Potential Error from apex
			}
		}
		catch (err) {
			// Handle any errors that occur within the try block

			this.HandleToast(err.message);// Catching Potential Error from lwc

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
				this.HandleToast(error.message);// Catching Potential Error from apex

			}
		}
		catch (err) {
			// Handle any errors that occur within the try block

			this.HandleToast(err.message);// Catching Potential Error from lwc

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

			this.HandleToast(error.message);// Catching Potential Error from lwc
		}
	}

	HandleToast(error){
		this.showToast(resource.ERROR_MESSAGE, error.message, resource.ERROR_VARIANT);
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