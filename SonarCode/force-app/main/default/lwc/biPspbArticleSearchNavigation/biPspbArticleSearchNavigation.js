//This lightning web component is used for navigation of article LABELS.CATEGORY_PAGE and spevigo article category page based on patient status
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import GET_ASSESSMENT_RESPONSE from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
// To import Custom Labels
// To get Current UserId
import ID from '@salesforce/user/Id';
import { LABELS } from 'c/biPspbLabelForInfoCenter';

export default class BiPspbArticleSearchNavigation extends LightningElement {

	userId = ID;
	showJustForMe = false;
	patientStatusRecord = '';
	treatmentCategoryLabel;
	adobeTreatmentTag;
	urlq;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showBrandedNav = true;
	renderedCount =0;
	siteUrlq;
	
	/* If user having null assessment record then disabled the just for me navigation */
	// To retrieve the letspersonalized assessment data
	@wire(GET_ASSESSMENT_RESPONSE,{categoryname: LABELS.INTRODUCTION_CATEGORY})
	wireddatashowfilterresponse({ error, data }) {
		try {
			if (data) {
				this.showJustForMe = false;

				let showResponseData = data;
				if (showResponseData.length === 1 && showResponseData[0].BI_PSP_StatusForPersonalization__c===LABELS.COMPLETE_STATUS ) {
					this.showJustForMe = true;
				} else {
					this.showJustForMe = false;
				}
			} else if (error) {
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data === null) {
				this.showJustForMe = false;
			}
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	// To navigate article category  page
	navigateToCategory(event) {
		let finaltitle = event.currentTarget.dataset.name;
		let articlename = finaltitle;

		window.location.href =
			this.baseUrl + this.siteUrlq + LABELS.CATEGORY_PAGE + articlename;
	}


	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retirieve the staus value of a Patient
	@wire(PATIENT_STATUS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientStatusRecord = data;

				if (this.patientStatusRecord === LABELS.ACUTE_STATUS) {
					this.showBrandedNav = true;
					this.treatmentCategoryLabel = LABELS.FLARE_TREATMENT_LABEL;
					this.adobeTreatmentTag = LABELS.FLARE_TREATMENT_CATEGORY;
				} else if (this.patientStatusRecord === LABELS.CHRONIC_STATUS) {
					this.treatmentCategoryLabel = LABELS.FLARE_PREVENTION_LABEL;
					this.adobeTreatmentTag = LABELS.FLARE_PREVENTION_CATEGORY;
				}

				// Handle the data
			} else if (error) {
				// Handle the error
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	// To get the Url based current site name
	connectedCallback() {
		try {
			let globalThis = window;
			let currentUrl = globalThis.location.href;

			// Create a URL object
			let urlObject = new URL(currentUrl);

			// Get the path
			let path = urlObject.pathname;

			// Split the path using '/' as a separator
			let pathComponents = path.split("/");

			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[LABELS.BRANDED_URL.toLowerCase(), LABELS.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === LABELS.BRANDED_URL.toLowerCase()) {
				this.urlq = LABELS.BRANDED_URL;
				this.siteUrlq = LABELS.BRANDED_SITE_URL;
			} else {
				this.urlq = LABELS.UNASSIGNED_URL;
				this.siteUrlq = LABELS.UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split("/");
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;

			if (this.urlq === LABELS.BRANDED_URL) {
				this.showBrandedNav = true;
			} else {
				this.showBrandedNav = false;
			}
		} catch (error) {
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
			// Handle the error as needed
		}
	}

	// renderedCallback to dispatch event for parent component
	renderedCallback(){
		try{
			const event = new CustomEvent('childrendered', {
				detail: { rendered: true }
			});
			if(this.renderedCount <=2){
			this.dispatchEvent(event);
			this.renderedCount = this.renderedCount + 1;
			}
		}
		catch(error){
			this.showToastEvent(LABELS.ERROR_MESSAGE,error.message,LABELS.ERROR_VARIANT);
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