//This lightning web component consolidates for thankyou message summary page
//importing the Libraries
import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// Imports resourceUrl to reference external resources for proper rendering and functionality.

// Importing Apex classes to interact with Salesforce backend for data retrieval.
import LEAD from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getExistingLeads";
import CAREGIVER from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getLeadCaregiver";
import PRES_INFO from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getLeadPrescription";
import THANKS from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.checkCaregiverData";

// Imports showToastEvent to display notification messages, informing users about component actions or events.
import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbThankyouForHcpEnrollment extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with  
	age = false;
	recordDetails;
	caregiver;
	presInfo;
	result;
	recordId;
	count;
	email;
	messageContent;
	messageContentTwo;
	contData;
	// Declaration of variables
	BGpp = resource.BGPP;
	mailImg = resource.IMG;

	//To fetch the Patient details
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	//Therefore, null data won't be encountered.
	@wire(LEAD, { createLeadId: "$recordId" })
	wiredRecordDetailsLead({ error, data }) {

		if (data) {
			try {
				this.recordDetails = data;
				this.email = data[0].Email;
			}
			catch (err) {
				this.HandleToast(err.message);
			}
		}
		else if (error) {
			// Handle error
			this.HandleToast(error.message);
		}
	}

	//To fetch the Caregiver details
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	//Therefore, null data won't be encountered.
	@wire(CAREGIVER, { caregiverCreateId: "$recordId" })
	wiredRecordDetailsCaregiver({ error, data }) {

		if (data && data.length > 0) {
			try {
				this.caregiver = data;
				this.age = true;
			}
			catch (err) {
				this.HandleToast(err.body.message); // Catching Potential Error from lwc
			}
		}
		else if (error && data.length > 0) {
			//  Handle error
			this.HandleToast(error.message); // Catching Potential Error from apex
		}
	}

	//To fetch the Prescription details
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	//Therefore, null data won't be encountered.
	@wire(PRES_INFO, { prescriptionCreateId: "$recordId" })
	wiredRecordDetailsPresinfo({ error, data }) {
		if (data) {
			try {
				this.presInfo = data;
			}
			catch (err) {
				this.HandleToast(err.message);// Catching Potential Error from lwc
			}
		}
		else if (error) {
			// Handle error
			this.HandleToast(error.message);// Catching Potential Error from apex
		}
	}

	//To fetch the caregiver details
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	//Therefore, null data won't be encountered.
	@wire(THANKS, { caregiverCreateId: "$recordId" })
	wiredRecordDetailcontact({ error, data }) {

		if (data && data.length > 0) {
			try {
				this.contData = data;
				if (this.contData === true) {
					this.messageContent = resource.THANKYOU_MSG_ONE + this.email;
					this.messageContentTwo = resource.THANKYOU_MSG_TWO;
				}
				else {
					this.messageContent = resource.THANKYOU_MSG_THREE;
					this.messageContentTwo = resource.THANKYOU_MSG_FOUR + this.email;
				}
			}
			catch (err) {
				this.HandleToast(err.message);// Catching Potential Error from lwc
			}
		}
		else if (error && data.length > 0) {
			// Handle error
			this.HandleToast(error.message);// Catching Potential Error from apex
		}

	}
	connectedCallback() {
		try {
			let globalThis = window;
			// Retrieve the recordId from localStorage
			this.recordId = globalThis?.localStorage.getItem("recordId");

			this.count = globalThis?.localStorage.getItem("count");

			if (this.count !== 2) {
				globalThis?.localStorage.setItem("count", 2);
			}
			else {
				globalThis?.localStorage.setItem("count", 1);
			}
		}
		catch (error) {
			this.HandleToast(error.body.message);// Catching Potential Error from lwc
		}
	}
	HandleToast(error){
		this.showToast(resource.ERROR_MESSAGE, error.body.message, resource.ERROR_VARIANT);
	}
	//This ShowToast Message is used For Error
	showToast(title, message, variant) {
		if (typeof window !== 'undefined') {
			const event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}
}