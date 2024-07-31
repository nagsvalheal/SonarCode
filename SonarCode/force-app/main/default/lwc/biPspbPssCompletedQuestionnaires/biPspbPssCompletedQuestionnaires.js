//This is Psoriasis Symptom Scale (PSS) completed Questionnaire (LWC),this allows you to see Completed Questionnaire with submitted responses.
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_DATE_FOR_COMPLETED_QUESTIONNAIRE from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getCompletedQuestionares';
import GET_PSS_COMPLETED_QUESTIONNAIRE from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQstnrcurrentcompleteddate';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
import GET_ASSESSMENT_BY_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Static Resource
import PSS from '@salesforce/resourceUrl/BI_PSP_PssImage';
import LET_PERSONLIZE from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
import DLQI_IMG from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMG from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMG from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To get UserId
import Id from '@salesforce/user/Id';
//To import Custom labels
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WPAI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QUALITATIVE_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import WPAI_TXT from '@salesforce/label/c.BI_PSP_WpaiQstnrTxt';
import SELECT_MONTH from '@salesforce/label/c.BI_PSP_SelectMonthQues';
import COMPLETED_QUESTION from '@salesforce/label/c.BI_PSP_CompletedQuestionnaireTxt';
import ROLLOUT_TXT from '@salesforce/label/c.BI_PSP_RolloutDateTxt';
import EXPIRED_ON from '@salesforce/label/c.BI_PSP_ExpiredOnLabel';
import COMPLETED_ON from '@salesforce/label/c.BI_PSP_CompletedOn';
import NO_ASSESSMENT_FOUND from '@salesforce/label/c.BI_PSP_NoAssessmentFound';
import PSS_BOTTOM_TXT from '@salesforce/label/c.BI_PSP_PssBottomMsg';
import PSS_BOTTOM_TXT_ONE from '@salesforce/label/c.BI_PSP_PssBottomSecndMsg';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import WPAI_COMPLETED_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import QUALITATIVE_COMPLETED_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import QUALITATIVE_COMPLETED_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
export default class BiPspbPssCompletedQuestionnaires extends LightningElement {
	//Track variable Declarations(re-render variables)
	@track storedEffectiveDates = [];
	@track storedExpirationDates = [];
	@track htmlEffect;
	@track htmlExpirationDate;
	@track selectedValue;
	//Global variables(without @track does not trigger automatic re-renders)
	assessmentResponseses = [];
	categoryName = QUALITATIVE_CATEGORY;
	urlq;
	records = [];
	storePss = 0;
	storeWpai = 0;
	storeQsq = 0;
	storeDlqi = 0;
	userid = Id;
	assessments = []; // Updated to store a list of assessments
	selectedAssessment; // Added variable to store the selected assessment
	rolloutDate;
	expirationDate;
	expireDate;
	targetFourteenWeekDate;
	pssCategoryname = PSS_CATEGORY;
	introduction = INTRODUCTION_CATEGORY;
	pss = PSS_CATEGORY;
	dlqi = DLQI_CATEGORY;
	wapi = WPAI_CATEGORY;
	qsq = QUALITATIVE_CATEGORY;
	workAPI = WPAI_TXT;
	cardimage = LET_PERSONLIZE;
	cardImageDlqi = DLQI_IMG;
	cardImagePss = PSS;
	cardImageWpai = WPAI_IMG;
	cardImageQsq = QUALITATIVE_IMG;
	dateResponses = [];
	pssBottomTxt = PSS_BOTTOM_TXT;
	pssBottomTxtOne = PSS_BOTTOM_TXT_ONE;
	selectMonth = SELECT_MONTH;
	notFound = NO_ASSESSMENT_FOUND;
	completedQn = COMPLETED_QUESTION;
	rollOut = ROLLOUT_TXT;
	expiredOn = EXPIRED_ON;
	completedOn = COMPLETED_ON;
	// To get site Url to find the Current SiteName
	connectedCallback() {
		try {
			let globalthis = window;
			let currentURL = globalthis.location.href;
			// Create a URL object
			let urlObject = new URL(currentURL);
			// Get the path
			let path = urlObject.pathname;
			// Split the path using '/' as a separator
			let pathComponents = path.split('/');
			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVI;
			} else {
				this.urlq = UNASSIGNED_URL_NAVI;
			}
		} catch (error) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); //Catching Potential Error
		}
	}
	//To get date for all pss COMPLETED_ON assessment by current user
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_DATE_FOR_COMPLETED_QUESTIONNAIRE, { targetDate: '$selectedAssessment', categoryName: '$pssCategoryname' })
	wiredRecords({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.records = data;
				this.assessmentResponsesesdate = data.map((response) => ({
					res: response.Assessment.EffectiveDateTime
				}));

				this.assessmentResponsesesdate1 = data.map((response) => ({
					res: response.Assessment.BI_PSP_RolloutforCompletedQuestionnarie__c
				}));

				let dateRollout = this.assessmentResponsesesdate[0];
				let dateExpire = this.assessmentResponsesesdate1[0];
				let theDate = dateRollout.res;
				let theDateTwo = dateExpire.res;
				//rolloutdate:
				let currentDate = new Date(theDate);

				this.expireDate = this.formatDateForCompletedAndExpired(currentDate)
				//expireDate:
				let currentDate1 = new Date(theDateTwo);
				this.rolloutDate = this.formatDateForCompletedAndExpired(currentDate1)
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	// Options for the assessment dropdown
	get assessmentOptions() {
		return this.assessments.map((assessment) => ({
			label: assessment.formattedDate,
			value: assessment.effectiveDate
		}));
	}
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.targetFourteenWeekDate = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	//To get existing assessment record and their status
	/*Null checks are not performed because if there is no Assessment with completed Status
	it will not navigate to this page.
    */
	@wire(GET_ASSESSMENT_BY_USER, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); //Catching Potential Error LWC
		}
	}
	// To get rollOut date for Questionnaire to display
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.dateResponses = data;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	//To get the completed Assessment record in pss
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PSS_COMPLETED_QUESTIONNAIRE, { categoryName: '$pssCategoryname' })
	wiredAssessmentResponses({ data, error }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				// Map the assessments and format the date for each
				this.assessments = data.map((response) => ({
					effectiveDate: this.formatDate(response.EffectiveDateTime),
					expirationDate: this.formatDate(response.ExpirationDateTime),
					formattedDate: this.formatDate(response.EffectiveDateTime)
				}));

				this.mapAssessment();
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); //Catching Potential Error LWC
		}
	}

	// Utility method to format the date using Intl.DateTimeFormat
	formatDate(dateString) {
		let options = { year: 'numeric', month: 'long' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}
	//Formatting the date for Rollout and Expired
	formatDateForCompletedAndExpired(dateString) {
		let options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	// Handle assessment dropdown change
	handleAssessmentChange(event) {
		let selectedValues = event.target.value;
		this.selectedAssessment = selectedValues;
	}

	// Example of iterating through this.assessments and storing field values in other properties
	mapAssessment() {
		// Example: Store the field values in other properties
		this.storedEffectiveDates = this.assessments.map(
			(assessment) => assessment.effectiveDate
		);
		this.storedExpirationDates = this.assessments.map(
			(assessment) => assessment.expirationDate
		);
		this.storedFormattedDates = this.assessments.map(
			(assessment) => assessment.formattedDate
		);

		// Access the first record from the storedEffectiveDates and storedExpirationDates arrays
		if (
			this.storedEffectiveDates.length > 0 &&
			this.storedExpirationDates.length > 0
		) {
			let firstEffectiveDate = this.storedEffectiveDates[0];
			let firstExpirationDate = this.storedExpirationDates[0];
			// Log or use the retrieved values as needed
			this.htmlEffect = firstEffectiveDate;
			this.selectedAssessment = firstEffectiveDate;
			this.htmlExpirationDate = firstExpirationDate;
		}
	}
	//To get all completed Questionnaire count for tab navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); //Catching Potential Error Apex
			} else if (data) {
				this.count = data;
				[this.storeWpai, this.storePss, this.storeDlqi, this.storeQsq] = this.count;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); //Catching Potential Error LWC
		}
	}
	get checkdlqi() {
		return this.storeDlqi > 0 ? '' : 'disabled';
	}

	get checkwai() {
		return this.storeWpai > 0 ? '' : 'disabled';
	}
	get checkqsq() {
		return this.storeQsq > 0 ? '' : 'disabled';
	}


	//navigation methods for all completed Questionnaire
	navigateToCategory2() {
		window.location.assign(this.urlq + DLQI_COMPLETED_URL);
	}

	navigateToCategory4() {
		window.location.assign(this.urlq + WPAI_COMPLETED_QUESTIONNAIRE);
	}
	navigateToCategory5() {
		if (this.targetFourteenWeekDate !== null) {
			if (this.status === COMPLETED_LABEL || this.status === EXPIRED) {
				window.location.assign(this.urlq + QUALITATIVE_COMPLETED_FOURTEEN_WEEKS);
			} else {
				window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWO_MONTHS);
			}
		} else {
			window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWO_MONTHS);
		}
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