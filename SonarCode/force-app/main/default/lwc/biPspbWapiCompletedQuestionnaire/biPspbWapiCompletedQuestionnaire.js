/*This is Work and Activity Impairment (WPAI) COMPLETED Questionnaire and  this allows you to see Wapi Completed Questionnaire 
	with submitted responses.*/
//To import Libraries
import { LightningElement, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_ASSESSMENT from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getCompletedQuestionares';
import GET_ASSESSMENT_QUESTION from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import GET_WPAI_EXPIRED from '@salesforce/apex/BI_PSP_CompletedQuestionnaireCtrl.getQstnrcurrentcompleteddate';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
import GET_ASSESSMENT_BY_USER_NAME from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
//To import Static Resource
import PSS_Img from '@salesforce/resourceUrl/BI_PSP_PssImage';
import INTRODUCTION_IMG from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
import DLQI_IMG from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMG from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMG from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom labels
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WPAI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QUALITATIVE_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import WPAI_TXT from '@salesforce/label/c.BI_PSP_WpaiQstnrTxt';
import WPAI_BOTTOM_TXT from '@salesforce/label/c.BI_PSP_WpaiBottomTxt';
import WPAI_BOTTOM_TXT_TWO from '@salesforce/label/c.BI_PSP_PssBottomSecndMsg';
import SELECT_MONTH from '@salesforce/label/c.BI_PSP_SelectMonthQues';
import COMPLETED_QUESTIONNAIRE from '@salesforce/label/c.BI_PSP_CompletedQuestionnaireTxt';
import ROLLOUT_TXT from '@salesforce/label/c.BI_PSP_RolloutDateTxt';
import EXPIRATION_ON from '@salesforce/label/c.BI_PSP_ExpiredOnLabel';
import ERROR_LOADING from '@salesforce/label/c.BI_PSP_ErrorInLoading';
import NO_ASSESSMENT_FOUND from '@salesforce/label/c.BI_PSP_NoAssessmentFound';
import INCLUDE_TXT from '@salesforce/label/c.BI_PSP_WpaiIncludeTxt';
import HOUR_TXT from '@salesforce/label/c.BI_PSP_HoursForChatter';
import WPAI_SKIP from '@salesforce/label/c.BI_PSP_WpaiSkipTxt';
import WPAI_SEC_TXT from '@salesforce/label/c.BI_PSP_WpaiSecTxt';
import WPAI_SLIDER_TWO from '@salesforce/label/c.BI_PSP_WpaiSliderSecond';
import WPAI_DAILY_LEFT from '@salesforce/label/c.BI_PSP_WpaiDailyLeft';
import WPAI_DAILY_RIGHT from '@salesforce/label/c.BI_PSP_WpaiDailyRight';
import WPAI_WORK_LEFT from '@salesforce/label/c.BI_PSP_WpaiWorkLeft';
import WPAI_WORK_RIGHT from '@salesforce/label/c.BI_PSP_WpaiWorkRight';
import QSQ_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import COMPLETED from '@salesforce/label/c.BI_PSP_CompletedOn';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import PSS_COMPLETED_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import QUALITATIVE_COMPLETED_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import QUALITATIVE_COMPLETED_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
//To get UserId
import Id from '@salesforce/user/Id';
export default class BiPspbWapiCompletedQuestionnaire extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	sliderValue = 0;
	sliderValuesec = 0;
	//Global variables(without @track does not trigger automatic re-renders)
	userid = Id;
	drfatRecords = [];
	completedOn = COMPLETED;
	storePss = 0;
	storeWpai = 0;
	storeQsq = 0;
	storeDlqi = 0;
	assessmentResponseses;
	shouldShowComponent = false;
	questionData;
	categoryName = QSQ_CATEGORY;
	urlq;
	firstQuestionText;
	firstQuestionId;
	secondQuestionId;
	secondQuestionText;
	thirdQuestionText;
	thirdQuestionVersionId;
	fourthQuestionText;
	fourthQuestionVersionId;
	fifthQuestionText;
	fifthQuestionVersionId;
	sixthQuestionText;
	sixthQuestionVerionId;
	firstQuestionResponse;
	secondQuestionResponse;
	thirdQuestionResponse;
	fourthQuestionResponse;
	fifthQuestionResponse;
	sixthQuestionResponse;
	cardImage = INTRODUCTION_IMG;
	cardImageDlqi = DLQI_IMG;
	cardImagePss = PSS_Img;
	cardImageWapi = WPAI_IMG;
	cardImageQsq = QUALITATIVE_IMG;
	wapiCategoryname = WPAI_CATEGORY;
	introduction = INTRODUCTION_CATEGORY;
	pss = PSS_CATEGORY;
	dlqi = DLQI_CATEGORY;
	wapi = WPAI_CATEGORY;
	qsq = QUALITATIVE_CATEGORY;
	workAPI = WPAI_TXT;
	wpaiBot = WPAI_BOTTOM_TXT;
	wpaiBotOne = WPAI_BOTTOM_TXT_TWO;
	selectmonth = SELECT_MONTH;
	completedQn = COMPLETED_QUESTIONNAIRE;
	rollout = ROLLOUT_TXT;
	expiredOn = EXPIRATION_ON;
	errorLoading = ERROR_LOADING;
	notFound = NO_ASSESSMENT_FOUND;
	includeTxt = INCLUDE_TXT;
	hours = HOUR_TXT;
	skipTxt = WPAI_SKIP;
	sliderText = WPAI_SEC_TXT;
	sliderTextSec = WPAI_SLIDER_TWO;
	workSliderLeft = WPAI_WORK_LEFT;
	workSliderRight = WPAI_WORK_RIGHT;
	dailySilderLeft = WPAI_DAILY_LEFT;
	dailySilderRight = WPAI_DAILY_RIGHT;
	dateResponses = [];
	storedate;
	expireDate;
	rolloutDate;
	selectedAssessment;
	assessments = [];
	forTwoResp = false;
	forSixResponse = false;
	// To get site Url to find the Current SiteName
	connectedCallback() {
		try {
			let global=window;
			let CURRENT_URL = global.location.href;
			// Create a URL object
			let URL_OBJECT = new URL(CURRENT_URL);
			// Get the PATH
			let PATH = URL_OBJECT.pathname;
			// Split the PATH using '/' as a separator
			let PATH_COMPONENTS = PATH.split('/');
			// Find the component you need (in this case, 'Branded')
			let DESIRED_COMPONENT = PATH_COMPONENTS.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (DESIRED_COMPONENT.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVI;
			} else {
				this.urlq = UNASSIGNED_URL_NAVI;
			}
		} catch (error) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); //Catching Potential Error
		}
	}

	updateThumbLabelPosition() {
		// Ensure the DOM is ready before querying elements
		Promise.resolve().then(() => {
			this.sliderValue = this.fifthQuestionResponse;

			let slider = this.template.querySelector('.slider');
			let thumbLabel = this.template.querySelector('.thumb-label');

			// Check if both elements exist
			if (slider && thumbLabel) {
				let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
				let sliderWidth = slider.offsetWidth;
				let thumbPosition =
					(this.sliderValue / slider.max) * (sliderWidth - thumbWidth);

				let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
				let maxPosition = sliderWidth - thumbWidth;

				thumbLabel.style.left =
					Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
				thumbLabel.setAttribute('data-value', this.sliderValue);

				// Update the content of the thumb-label
				thumbLabel.textContent = this.sliderValue;
			}
		});
	}

	//To place the value in right position inside the slider
	updateThumbLabelPositionsec() {
		Promise.resolve().then(() => {
			this.sliderValuesec = this.sixthQuestionResponse;

			let slider = this.template.querySelector('.slidersec');
			let thumbLabel = this.template.querySelector('.thumb-labelsec');

			let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
			let sliderWidth = slider.offsetWidth;
			let thumbPosition =
				(this.sliderValuesec / slider.max) * (sliderWidth - thumbWidth);

			let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
			let maxPosition = sliderWidth - thumbWidth;

			thumbLabel.style.left =
				Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
			thumbLabel.setAttribute('data-value', this.sliderValuesec);

			// Update the content of the thumb-label
			thumbLabel.textContent = this.sliderValuesec;
		});
	}
	//Get Qualitative date for side bar navigation
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

	// To get Assessment record and status for particular record
	/*Null checks are not performed because if there is no Assessment with COMPLETED Status
	it will not navigate to this page.
    */
	@wire(GET_ASSESSMENT_BY_USER_NAME, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// To get rollout date
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			}
			if (data) {
				this.dateResponses = data;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// Getting assessment Question
	// There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_QUESTION, { questionnaireName: '$wapi' })
	wiredAssessmentQuestion({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error Apex
			} else if (data) {
				this.processAssessmentQuestions(data);
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	processAssessmentQuestions(data) {
		this.questionData = data.map((question) => ({
			id: question.Id,
			questionText: question.QuestionText,
			activeVersionId: question.ActiveVersion ? question.ActiveVersion.Id : null
		}));

		const questionMapping = [
			{ textKey: 'firstQuestionText', versionKey: 'firstQuestionVersionId' },
			{ textKey: 'secondQuestionText', versionKey: 'secondQuestionVersionId' },
			{ textKey: 'thirdQuestionText', versionKey: 'thirdQuestionVersionId' },
			{ textKey: 'fourthQuestionText', versionKey: 'fourthQuestionVersionId' },
			{ textKey: 'fifthQuestionText', versionKey: 'fifthQuestionVersionId' },
			{ textKey: 'sixthQuestionText', versionKey: 'sixthQuestionVersionId' }
		];

		this.questionData.forEach((question, index) => {
			if (questionMapping[index]) {
				this[questionMapping[index].textKey] = question.questionText;
				this[questionMapping[index].versionKey] = question.activeVersionId;
			}
		});
	}
	//To get the current record COMPLETED data
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_WPAI_EXPIRED, { categoryName: '$wapiCategoryname' })
	wiredwapiexpiredResponses({ data, error }) {
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
				this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	// Utility method to format the date using Intl.DateTimeFormat
	formatDate(dateString) {
		let options = { year: 'numeric', month: 'long' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	// Wire method to fetch data of COMPLETED assessment
	// There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT, { targetDate: '$selectedAssessment', categoryName: '$wapiCategoryname' })
	wiredAssessmentResponses({ error, data }) {
		try {
			if (data) {
				this.drfatRecords = data;
				this.assessmentResponsesesdate = data.map(response => ({ res: response.Assessment.EffectiveDateTime }));
				this.assessmentResponsesesdate1 = data.map(response => ({ res: response.Assessment.BI_PSP_RolloutforCompletedQuestionnarie__c }));
				this.assessmentResponseses = data.map(response => ({ res: response.ResponseText || null }));

				this.setDates();
				this.updateQuestionResponses();

			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	setDates() {
		const expireData = this.assessmentResponsesesdate[0];
		const rolloutData = this.assessmentResponsesesdate1[0];

		const currentDate = new Date(expireData.res);
		this.expireDate = this.formatDateForCompletedAndExpired(currentDate);

		const currentDate1 = new Date(rolloutData.res);
		this.rolloutDate = this.formatDateForCompletedAndExpired(currentDate1);
	}

	updateQuestionResponses() {
		const length = this.assessmentResponseses.length;

		this.forSixResponse = length >= 6;
		this.forTwoResp = length <= 2 || (length > 2 && length <= 4);
		this.shouldShowComponent = this.forTwoResp;
		if (this.forSixResponse) {
			this.setResponses(this.assessmentResponseses.slice(0, 6));
			this.updateThumbLabelPosition();
			this.updateThumbLabelPositionsec();
		} else if (this.forTwoResp) {
			this.setResponses(this.drfatRecords);
			if (length <= 2) {
				this.updateThumbLabelPositionsec();
			}
		}
	}

	setResponses(responses) {
		responses.forEach((response, index) => {
			if (response.res !== null) {
				switch (index) {
					case 0:
						this.firstQuestionResponse = response.res;
						break;
					case 1:
						this.secondQuestionResponse = response.res;
						break;
					case 2:
						this.thirdQuestionResponse = response.res;
						break;
					case 3:
						this.fourthQuestionResponse = response.res;
						break;
					case 4:
						this.fifthQuestionResponse = response.res;
						break;
					case 5:
						this.sixthQuestionResponse = response.res;
						break;
					default:
						break;
				}
			}
		});

		this.drfatRecords.forEach((record) => {
			if (record.BI_PSP_ResponseOrder__c === 1) {
				this.firstQuestionResponse = record.ResponseText;
			}
			if (record.BI_PSP_ResponseOrder__c === 6) {
				this.sixthQuestionResponse = record.ResponseText;
			}
		});
	}

	get assessmentOptions() {
		return this.assessments.map((assessment) => ({
			label: assessment.formattedDate,
			value: assessment.effectiveDate
		}));
	}

	handleAssessmentChange(event) {
		let selectedValues = event.target.value;

		this.selectedAssessment = selectedValues;
	}
	formatDateForCompletedAndExpired(dateString) {
		let options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString(undefined, options);
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

		// Log the stored field values
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

	//To get COMPLETED Assessment for current user
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error Apex
			}
			else if (data) {
				this.count = data;
				[this.storeWpai, this.storePss, this.storeDlqi, this.storeQsq] = this.count;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error LWC
		}
	}

	get checkdlqi() {
		return this.storeDlqi > 0 ? '' : 'disabled';
	}
	get checkpss() {
		return this.storePss > 0 ? '' : 'disabled';
	}

	get checkqsq() {
		return this.storeQsq > 0 ? '' : 'disabled';
	}
	//navigation method for other COMPLETED Questionnaries
	navigateToCategory2() {
		window.location.assign(this.urlq + DLQI_COMPLETED_URL);
	}
	navigateToCategory3() {
		window.location.assign(this.urlq + PSS_COMPLETED_QUESTIONNAIRE);
	}

	navigateToCategory5() {
		if (this.targetDateFourteenWks !== null) {
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