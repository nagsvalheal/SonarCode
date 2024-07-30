//This is Dermatology Life Quality Index COMPLETED Questionnaire(LWC). This allows you to see your submited Responses.
//To import Libraries
import { LightningElement, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_DATE_RECORD_FOR_COMPLETED from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getCompletedQuestionares';
import GET_DLQI_COMPLETED_QUESTIONNAIRE from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQstnrcurrentcompleteddate';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
import GET_ASSESSMENT_BY_CURRENT_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
//To import Static Resource
import PSS_Image from '@salesforce/resourceUrl/BI_PSP_PssImage';
import LET_PERSONALIZE from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
import DLQI_IMG from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMG from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMG from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom labels
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WAPI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QUALITATIVE_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import WAPI_TXT from '@salesforce/label/c.BI_PSP_WpaiQstnrTxt';
import COMPLETED_QUESTIONNAIRE_TXT from '@salesforce/label/c.BI_PSP_CompletedQuestionnaireTxt';
import ROLL_OUT_TXT from '@salesforce/label/c.BI_PSP_RolloutDateTxt';
import EXPIRED_ON from '@salesforce/label/c.BI_PSP_ExpiredOnLabel';
import DLQI_BOTTOM from '@salesforce/label/c.BI_PSP_DlqiFirstBottomMsg';
import DLQI_BOTTOM_TEXT_TWO from '@salesforce/label/c.BI_PSP_DlqiSecBottomMsg';
import DLQI_BOTTOM_TEXT_THREE from '@salesforce/label/c.BI_PSP_PssBottomSecndMsg';
import BI_PSP_dlqibottom4 from '@salesforce/label/c.BI_PSP_DlqiThreeBottomMsg';
import ERROR_LOADING from '@salesforce/label/c.BI_PSP_ErrorInLoading';
import SELECT_MONTH from '@salesforce/label/c.BI_PSP_SelectMonthQues';
import NO_ASSESSMENT_RECORD_FOUND from '@salesforce/label/c.BI_PSP_NoAssessmentFound';
import DLQI_CATEGORY_Ques from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import COMPLETED from '@salesforce/label/c.BI_PSP_CompletedOn';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import WAPI_COMPLETED_QUESTIONNARIE from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import PSS_COMPLETED_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import QUALITATIVE_COMPLETED_QUES_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import QUALITATIVE_COMPLETED_QUES_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
//To get UserId
import Id from '@salesforce/user/Id';
export default class BiPspbDlqiCompletedQuestionnaire extends LightningElement {
	//Track variable Declarations(re-render variables)
	storedEffectiveDates = [];
	storedExpirationDates = [];
	htmlEffect;
	htmlExpirationDate;
	//Global variables(without @track does not trigger automatic re-renders)
	storePss = 0;
	storeWpai = 0;
	storeQsq = 0;
	storeDlqi = 0;
	urlq;
	status;
	categoryName = DLQI_CATEGORY_Ques;
	cardimage = LET_PERSONALIZE;
	cardImageDlqi = DLQI_IMG;
	cardImagePss = PSS_Image;
	cardImageWpai = WPAI_IMG;
	cardImageQsq = QUALITATIVE_IMG;
	userId = Id;
	error;
	records = [];
	assessments = []; // Updated to store a list of assessments
	selectedAssessment; // Added variable to store the selected assessment
	rolloutDate;
	expirationDate;
	expireDate;
	assessmentResponsesesDateOne = [];
	assessmentResponsesesDate = [];
	dlqiCategoryname = DLQI_CATEGORY;
	dlqiBottomText = DLQI_BOTTOM;
	dlqiBottomTextOne = DLQI_BOTTOM_TEXT_TWO;
	dlqiBottomTextThree = DLQI_BOTTOM_TEXT_THREE;
	dlqiBottomTextFour = BI_PSP_dlqibottom4;
	introduction = INTRODUCTION_CATEGORY;
	pss = PSS_CATEGORY;
	dlqi = DLQI_CATEGORY;
	wapi = WAPI_CATEGORY;
	qsq = QUALITATIVE_CATEGORY;
	workApi = WAPI_TXT;
	completedOn = COMPLETED;
	completedQn = COMPLETED_QUESTIONNAIRE_TXT;
	rollout = ROLL_OUT_TXT;
	expiredOn = EXPIRED_ON;
	errorLoading = ERROR_LOADING;
	selectMonth = SELECT_MONTH;
	notFound = NO_ASSESSMENT_RECORD_FOUND;

	// To get site Url to find the Current SiteName
	connectedCallback() {
		try {
			let globalThis = window;
			let currentURL = globalThis.location.href;
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
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.targetDateFourteenWks = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}
	//Get the AssessmentID for the current user
	/*Null checks are not performed because if there is no Assessment with COMPLETED Status
	it will not navigate to this page.
    */
	@wire(GET_ASSESSMENT_BY_CURRENT_USER, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	//getting rollout to display in Questionnaire
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.dateResponses = data;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// To getting Dates for particular person Assessments
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_DATE_RECORD_FOR_COMPLETED, { targetDate: '$selectedAssessment', categoryName: '$dlqiCategoryname' })
	wiredRecords({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.records = data;
				this.assessmentResponsesesDate = data.map((response) => ({
					res: response.Assessment.EffectiveDateTime
				}));
				this.assessmentResponsesesDateOne = data.map((response) => ({
					res: response.Assessment.BI_PSP_RolloutforCompletedQuestionnarie__c
				}));

				let dateRecordExpire = this.assessmentResponsesesDate[0];
				let dateRecordRollout = this.assessmentResponsesesDateOne[0];
				let enModifyDateExpire = dateRecordExpire.res;
				let enModifyDateRollout = dateRecordRollout.res;
				//ExpireDate
				let currentDate = new Date(enModifyDateExpire);

				this.expireDate = this.formatDateForCompletedAndExpired(currentDate);
				//RolloutDate:
				let currentDate1 = new Date(enModifyDateRollout);
				this.rolloutDate = this.formatDateForCompletedAndExpired(currentDate1);
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// Options for the assessment dropdown
	get assessmentOptions() {
		return this.assessments.map((assessment) => ({
			label: assessment.formattedDate,
			value: assessment.effectiveDate
		}));
	}
	// getting assessments status which is COMPLETED
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_DLQI_COMPLETED_QUESTIONNAIRE, { categoryName: '$dlqiCategoryname' })
	wiredAssessmentResponses({ data, error }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error Apex
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
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}
	formatDateForCompletedAndExpired(dateString) {
		let options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}
	// Utility method to format the date using Intl.DateTimeFormat
	formatDate(dateString) {
		let options = { year: 'numeric', month: 'long' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	// Handle assessment dropdown change
	handleAssessmentChange(event) {
		let selectedValues = event.target.value;

		//this.selectedAssessment = this.assessments.find(assessment => assessment.effectiveDate === selectedValues);
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
	//To get the count of Assessment record of each category for navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			}
			if (data) {
				this.count = data;
				[this.storeWpai, this.storePss, this.storeDlqi, this.storeQsq] = this.count;

			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	get checkpss() {
		return this.storePss > 0 ? '' : 'disabled';
	}

	get checkwai() {
		return this.storeWpai > 0 ? '' : 'disabled';
	}
	get checkqsq() {
		return this.storeQsq > 0 ? '' : 'disabled';
	}

	//navigation to pss COMPLETED Questionnaire
	navigateToCategory3() {
		window.location.assign(this.urlq + PSS_COMPLETED_QUESTIONNAIRE);
	}
	//navigation to pss COMPLETED Questionnaire
	navigateToCategory4() {
		window.location.assign(this.urlq + WAPI_COMPLETED_QUESTIONNARIE);
	}
	//navigation to pss COMPLETED Questionnaire
	navigateToCategory5() {
		if (this.targetDateFourteenWks !== null) {
			if (this.status === COMPLETED_LABEL || this.status === EXPIRED) {
				window.location.assign(this.urlq + QUALITATIVE_COMPLETED_QUES_FOURTEEN_WEEKS);
			} else {
				window.location.assign(this.urlq + QUALITATIVE_COMPLETED_QUES_TWO_MONTHS);
			}
		} else {
			window.location.assign(this.urlq + QUALITATIVE_COMPLETED_QUES_TWO_MONTHS);
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