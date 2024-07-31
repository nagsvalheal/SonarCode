//This is Consolidate Component(LWC) this contains Avatar and Psoriasis Symptom Scale (PSS)Completed Questionnaire to achieve mobile responsive.
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex Class
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import GET_ASSESSMENT_BY_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Custom labels
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIENT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import BRANDED_NAVI_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UN_ASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import OUTSTANDING_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import SUMMARY_URL from '@salesforce/label/c.BI_PSPB_SummaryUrl';
import PSS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import WAPI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import LETS_PERSONALIZE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import QUALITATIVE_COMPLETED_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import QUALITATIVE_COMPLETED_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import QUALITATIVE_LABEL from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
export default class BiPspbPssCompletedQuesParent extends LightningElement {
	//Track variable Declarations(re-render variables)
	@track screenWidth;
	//Global variables(without @track does not trigger automatic re-renders)
	count;
	storeWapi;
	storePss;
	storeDlqi;
	storeQsq;
	urlq;
	target14wksdate;
	categoryname = QUALITATIVE_LABEL;

	//To get all completed Questionnaire count to prevent tab navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIENT); // Catching Potential Error from Apex
			} else if (data) {
				this.count = data;
				//Checking data of index contains 0;
				this.showTabMenu = this.count.some(count => count !== 0);
				//assigning data values to the variables 
				[this.storeWapi, this.storePss, this.storeDlqi, this.storeQsq] = this.count;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIENT); // Catching Potential Error from LWC
		}
	}
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIENT); // Catching Potential Error from Apex
			} else if (data) {
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.target2monthsdate = data.targetTwoMonthsDate ?? null;
				this.target14wksdate = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIENT); // Catching Potential Error from LWC
		}
	}
	//To get assessment and status by current User
	/*Null checks are not performed because if it is null i need to restrict navigation
	for Qualitative Questionnaire .
    */
	@wire(GET_ASSESSMENT_BY_USER, { categoryname: '$categoryname' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIENT); // Catching Potential Error from Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIENT); // Catching Potential Error from LWC
		}
	}
	// To get current site Name
	renderedCallback() {
		try {
			let windowWidth = window.innerWidth;
			if (windowWidth <= 1200) {
				this.screenWidth = '12';
			} else {
				this.screenWidth = '4';
			}
			let currentURL = window.location.href;
			// Create a URL object
			let urlObject = new URL(currentURL); // Get the path
			let path = urlObject.pathname; // Split the path using '/' as a separator
			let pathComponents = path.split('/'); // Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_NAVI_URL;
			} else {
				this.urlq = UN_ASSIGNED_URL_NAVI;
			}
		} catch (error) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIENT); // Catching Potential Error
		}
	}


	//navigation methods
	openOutQuestionnaires() {
		window.location.assign(this.urlq + OUTSTANDING_URL);
	}
	openSummary() {
		window.location.assign(this.urlq + SUMMARY_URL);
	}
	//navigation for tab navigation
	openComQuestionnaires() {
		if (this.storeDlqi > 0) {
			window.location.assign(this.urlq + DLQI_COMPLETED_URL);
		} else if (this.storePss > 0) {
			window.location.assign(this.urlq + PSS_COMPLETED_URL);
		} else if (this.storeWapi > 0) {
			window.location.assign(this.urlq + WAPI_COMPLETED_URL);
		} else if (this.storeQsq > 0) {
			if (this.target14wksdate !== null) {
				if (this.status === COMPLETED_LABEL || this.status === EXPIRED) {
					window.location.assign(
						this.urlq + QUALITATIVE_COMPLETED_FOURTEEN_WEEKS
					);
				} else {
					window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWO_MONTHS);
				}
			} else {
				window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWO_MONTHS);
			}
		}
	}
	openPersonalize() {
		window.location.assign(this.urlq + LETS_PERSONALIZE_URL);
	}
	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		if (typeof window !== 'undefined') {
			let event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}
}