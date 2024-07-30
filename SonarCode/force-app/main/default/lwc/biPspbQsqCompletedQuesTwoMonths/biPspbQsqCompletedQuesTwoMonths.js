//This is Qualitative satisfaction questionnaire COMPLETED Questionnaire(LWC). This allows you to see your submited Responses.
//To import Libraries
import { LightningElement, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_ASSESSMENT_QUESTION from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import GET_ASSESSMENT_FOR_TWO_MONTHS from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQSQCompletedQuestionaresTwoMonths';
import GET_EXPIRATION_DATE from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQSQExpiredQuestionnaireTwoMonths';
import GET_QSQ_EXPIRED_DATE_FOURTEEN_WEEKS from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQSQExpiredQuestionnaireFourteenWks';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Static Resource
import PSS_IMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import INTRODUCTION_IMG from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
import DLQI_IMG from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WAPI_IMG from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMG from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom labels
import INFORMATION_CENTER from '@salesforce/label/c.BI_PSP_InformationCentreTxt';
import SYMPTOM_TRACKER from '@salesforce/label/c.BI_PSP_SymptomTrackerValue';
import CHALLENGES_TXT from '@salesforce/label/c.BI_PSP_ChallengesName';
import QUESTIONNAIRE_TXT from '@salesforce/label/c.BI_PSP_Questionnaire';
import TREATEMENT_TXT from '@salesforce/label/c.BI_PSP_TreatmentVideosTxt';
import SUPPORT_TXT from '@salesforce/label/c.BI_PSP_SupportTxt';
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WAPI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QUALITATIVE_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import WPAI_TXT from '@salesforce/label/c.BI_PSP_WpaiQstnrTxt';
import COMPLETED_QUESTIONNAIRE_TXT from '@salesforce/label/c.BI_PSP_CompletedQuestionnaireTxt';
import ROLLOUT_DATE_TXT from '@salesforce/label/c.BI_PSP_RolloutDateTxt';
import EXPIRED_ON_TXT from '@salesforce/label/c.BI_PSP_ExpiredOnLabel';
import SELECT_MONTH from '@salesforce/label/c.BI_PSP_SelectMonthQues';
import NO_ASSESSMENT_FOUND from '@salesforce/label/c.BI_PSP_NoAssessmentFound';
import QUALITATIVE_TXT from '@salesforce/label/c.BI_PSP_QualitativeEgTxt';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import COMPLETED from '@salesforce/label/c.BI_PSP_CompletedOn';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import WPAI_COMPLETED_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import PSS_COMPLETED_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import QUALITATIVE_COMPLETED_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import YES_LABEL from '@salesforce/label/c.BI_PSP_OptionValueYes';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
//To get UserId
import Id from '@salesforce/user/Id';
export default class BiPspbQsqCompletedQuesTwoMonths extends LightningElement {
	//Track variable Declarations(re-render variables)
	firstQuestionText;
	secondQuestionText;
	thirdQuestionText;
	fourthQuestionText;
	fifthQuestionText;
	sixthQuestionText;
	seventhQuestionText;
	eightQuestionText;
	sliderValue = 0;
	sliderValueSec = 0;
	sliderValueThree = 0;
	//Global variables(without @track does not trigger automatic re-renders)
	informationCentre = INFORMATION_CENTER;
	symptomTracker = SYMPTOM_TRACKER;
	challenges = CHALLENGES_TXT;
	questionnaire = QUESTIONNAIRE_TXT;
	treatmentVideos = TREATEMENT_TXT;
	support = SUPPORT_TXT;
	userid = Id;
	records = [];
	questionData = [];
	storePss = 0;
	storeWpai = 0;
	storeQsq = 0;
	storeDlqi = 0;
	urlq;
	completedOn = COMPLETED;
	cardimage = INTRODUCTION_IMG;
	cardImageDlqi = DLQI_IMG;
	cardImagePss = PSS_IMAGE;
	cardImageWpai = WAPI_IMG;
	cardImageQsq = QUALITATIVE_IMG;
	fifthQuestDisplay = true;
	unselectedFifthQues = false; //new one
	isFiveThere;
	introduction = INTRODUCTION_CATEGORY;
	pss = PSS_CATEGORY;
	dlqi = DLQI_CATEGORY;
	wapi = WAPI_CATEGORY;
	qsq = QUALITATIVE_CATEGORY;
	workAPI = WPAI_TXT;
	selectmonth = SELECT_MONTH;
	notfound = NO_ASSESSMENT_FOUND;
	completedqn = COMPLETED_QUESTIONNAIRE_TXT;
	rollout = ROLLOUT_DATE_TXT;
	expiredon = EXPIRED_ON_TXT;
	qsqtext = QUALITATIVE_TXT;
	assessmentlen;
	assessmentResponses;
	firstQuestionResponse;
	secondQuestionResponse;
	thirdQuestionResponse;
	fourthQuestionResponse;
	fifthQuestionResponse;
	sixthQuestionResponse;
	assessments = []; // Updated to store a list of assessments
	selectedAssessment; // Added variable to store the selected assessment
	assessmentResponseses = [];
	rolloutDate;
	expireDate;
	//to get site url
	connectedCallback() {
		try {
			let global = window;
			let currentURL = global.location.href;
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
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT);//Catching Potential Error
		}
	}
	//To get the Assessment record which is expired
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_QSQ_EXPIRED_DATE_FOURTEEN_WEEKS)
	wiredwapiexpiredResponses({ data, error }) {
		try {
			if (data) {
				this.assessmentlen = data.length;
			} else if (error) {
				/*we are already handling exception for this apex wired method in Qualitative after 14 weeks 
				and this can be method can hold empty data since after fourteen weeks is only avaialbe after
				the completion after 2 months Qualitative.*/

			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT);//Catching Potential Error LWC
		}
	}

	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT);//Catching Potential Error Apex
			} else if (data) {
				this.target2monthsdate = data.targetTwoMonthsDate ?? null;
				this.target14wksdate = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT);//Catching Potential Error LWC
		}
	}

	// Method to update the thumb label position
	updateThumbLabelPosition(sliderClass, thumbLabelClass, value) {
		Promise.resolve().then(() => {
			let slider = this.template.querySelector(sliderClass);
			let thumbLabel = this.template.querySelector(thumbLabelClass);

			if (!slider || !thumbLabel) return;

			let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
			let sliderWidth = slider.offsetWidth;
			let thumbPosition = (value / slider.max) * (sliderWidth - thumbWidth);

			let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
			let maxPosition = sliderWidth - thumbWidth;

			thumbLabel.style.left = Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
			thumbLabel.setAttribute('data-value', value);

			// Update the content of the thumb-label
			thumbLabel.textContent = value;
		});
	}

	// To get Assessment Question
	// There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_QUESTION, { questionnaireName: '$qsq' })
	wiredAssessmentQuestion({ error, data }) {
		try {
			if (data) {
				this.questionData = data.map((question) => ({
					id: question.Id,
					questionText: question.QuestionText,
					activeVersionId: question.ActiveVersion ? question.ActiveVersion.Id : null
				}));

				this.questionTexts = this.questionData.map(q => q.questionText);

				// Assign the question texts to properties
				[
					this.firstQuestionText,
					this.secondQuestionText,
					this.thirdQuestionText,
					this.fourthQuestionText,
					this.fifthQuestionText,
					this.sixthQuestionText,
					this.seventhQuestionText,
					this.eightQuestionText
				] = this.questionTexts;
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}



	// To get the selected Assessment
	@wire(GET_ASSESSMENT_FOR_TWO_MONTHS, { targetDate: '$selectedAssessment' })
	wiredAssessmentResponses({ error, data }) {
		try {
			if (data) {
				this.records = data;
				this.processAssessmentData(data);
				this.setDates();
				this.extractQuestionResponses();
				this.updateUIComponents();
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	processAssessmentData(data) {
		this.assessmentResponsesesdate = data.map(response => ({
			res: response.Assessment.EffectiveDateTime
		}));

		this.assessmentResponsesesdate1 = data.map(response => ({
			res: response.Assessment.BI_PSP_RolloutforCompletedQuestionnarie__c
		}));
	}

	setDates() {
		let expireDate = new Date(this.assessmentResponsesesdate[0].res);
		this.expireDate = expireDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		let rolloutDate = new Date(this.assessmentResponsesesdate1[0].res);
		this.rolloutDate = rolloutDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}


	extractQuestionResponses() {
		this.records.forEach(record => {
			switch (record.BI_PSP_ResponseOrder__c) {
				case 1:
					this.firstQuestionResponse = record.ResponseText;
					break;
				case 2:
					this.secondQuestionResponse = record.ResponseText;
					break;
				case 3:
					this.thirdQuestionResponse = record.ResponseText;
					break;
				case 4:
					this.fourthQuestionResponse = record.ResponseText;
					break;
				case 5:
					this.isFiveThere = YES_LABEL;
					this.fifthQuestionResponse = Array.from(record.ResponseText.split(',').filter(element => element.trim() !== ''));
					break;
				case 6:
					this.sixthQuestionResponse = record.ResponseText;
					break;
				default:
					break;
			}
		});

		if (this.isFiveThere !== YES_LABEL) {
			this.fifthQuestDisplay = false;
			this.unselectedFifthQues = false;
		} else {
			this.fifthQuestDisplay = true;
			this.unselectedFifthQues = false;
		}
	}

	updateUIComponents() {
		this.updateThumbLabelPosition('.slider', '.thumb-label', this.firstQuestionResponse);
		this.updateThumbLabelPosition('.slidersec', '.thumb-labelsec', this.thirdQuestionResponse);
		this.updateThumbLabelPosition('.sliderthree', '.thumb-labelthree', this.fourthQuestionResponse);
	}
	get assessmentOptions() {
		return this.assessments.map((assessment) => ({
			label: assessment.formattedDate,
			value: assessment.effectiveDate
		}));
	}
	//To get Rollout and expire date
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_EXPIRATION_DATE)
	wiredExpiresResponses({ data, error }) {
		try {
			if (data) {
				// Map the assessments and format the date for each
				this.assessments = data.map((response) => ({
					effectiveDate: this.formatDate(response.EffectiveDateTime),
					expirationDate: this.formatDate(response.ExpirationDateTime),
					formattedDate: this.formatDate(response.EffectiveDateTime)
				}));

				this.mapAssessment();
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	// Utility method to format the date using Intl.DateTimeFormat
	formatDate(dateString) {
		let options = { year: 'numeric', month: 'long' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

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

	//To get total assessment count
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (data) {
				this.count = data;
				[this.storeWpai, this.storePss, this.storeDlqi, this.storeQsq] = this.count;
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT);//Catching Potential Error Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT);//Catching Potential Error LWC
		}
	}
	get checkdlqi() {
		return this.storeDlqi > 0 ? '' : 'disabled';
	}
	get checkpss() {
		return this.storePss > 0 ? '' : 'disabled';
	}

	get checkwai() {
		return this.storeWpai > 0 ? '' : 'disabled';
	}

	//navigation for side bar
	navigateToCategory2() {
		window.location.assign(this.urlq + DLQI_COMPLETED_URL);
	}
	navigateToCategory3() {
		window.location.assign(this.urlq + PSS_COMPLETED_QUESTIONNAIRE);
	}
	navigateToCategory4() {
		window.location.assign(this.urlq + WPAI_COMPLETED_QUESTIONNAIRE);
	}
	navigateToCategory5() {
		if (this.target14wksdate !== null && this.assessmentlen > 0) {
			window.location.assign(this.urlq + QUALITATIVE_COMPLETED_FOURTEEN_WEEKS);
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