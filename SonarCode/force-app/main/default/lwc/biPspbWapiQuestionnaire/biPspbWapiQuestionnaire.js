//This Lightning Web Component facilitating user measurement of health problem effects on work and regular activities.
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_THE_ASSESSMENT_QUESTION from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import DELETE_SELECTED_RESPONSE from '@salesforce/apex/BI_PSP_LetsPersonliseCtrl.draftRespoDeletion';
import GET_THE_DRAFT_RESPONSE from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import SUBMIT_DRAFT_RESPONSE from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
import GET_ASSMNT_BY_CURRENT_USER_NAME from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_QSQ_RECORDS from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCompletedAssessmentCountsByCurrentUserName';
//To import Static Resource
import PSS_IMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import DLQI_IMAGE from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMAGE from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMAGE from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
import ALERT_ICON from '@salesforce/resourceUrl/BI_PSP_AlertIcon';
//To import Custom labels
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WAPI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QUALITATIVE_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import WAPI from '@salesforce/label/c.BI_PSP_WpaiQstnrTxt';
import WPAI_FOOTER_MSG_FIRST from '@salesforce/label/c.BI_PSP_WpaiBottomTxt';
import WPAI_SEC_FOOTER_MSG from '@salesforce/label/c.BI_PSP_PssBottomSecndMsg';
import YES from '@salesforce/label/c.BI_PSP_OptionValueYes';
import NO from '@salesforce/label/c.BI_PSP_OptionValueNo';
import INCLUDE_TEXT from '@salesforce/label/c.BI_PSP_WpaiIncludeTxt';
import WPAI_ALERT_TEXT from '@salesforce/label/c.BI_PSP_WpaiAlertText';
import HOURS from '@salesforce/label/c.BI_PSP_HoursForChatter';
import WPAI_SKIP from '@salesforce/label/c.BI_PSP_WpaiSkipTxt';
import WPAI_SEC_TEXT from '@salesforce/label/c.BI_PSP_WpaiSecTxt';
import WPAI_WORK_LEFT from '@salesforce/label/c.BI_PSP_WpaiWorkLeft';
import WPAI_WORK_RIGHT from '@salesforce/label/c.BI_PSP_WpaiWorkRight';
import WPAI_SLIDER_QUEST_TEXT from '@salesforce/label/c.BI_PSP_WpaiSliderQuestText';
import WPAI_DAILY_LEFT from '@salesforce/label/c.BI_PSP_WpaiDailyLeft';
import WPAI_DAILY_RIGHT from '@salesforce/label/c.BI_PSP_WpaiDailyRight';
import ANSWERED from '@salesforce/label/c.BI_PSP_NumOfAnsrdQstn';
import BUTTON_SUBMIT from '@salesforce/label/c.BI_PSP_ButtonSubmit';
import DRAFT_BUTTON from '@salesforce/label/c.BI_PSP_DraftButton';
import QUESTIONNAIRE_ROLL_OUT_DATE from '@salesforce/label/c.BI_PSP_QuestnrRollOutDate';
import QUESTIONNAIRE_EXPIRES_ON from '@salesforce/label/c.BI_PSP_QuestnrExpiresOn';
import OUTSTANDING_PAGE_TEXT from '@salesforce/label/c.BI_PSP_OutstndngPageTxt';
import BUTTON_RETURN_BACK from '@salesforce/label/c.BI_PSP_ButtonReturnback';
import BUTTON_CONFIRM_SUB from '@salesforce/label/c.BI_PSP_ButtonConfirmSub';
import CANCEL_BUTTON from '@salesforce/label/c.BI_PSP_CancelButton';
import CONFIRM_BUTTON from '@salesforce/label/c.BI_PSP_ConfirmButton';
import WORKING_FOR_PAY_TEXT from '@salesforce/label/c.BI_PSP_WorkingForPayText';
import WPAI_NAME from '@salesforce/label/c.BI_PSP_WapiCategory';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UN_ASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import SUBMIT_LABEL from '@salesforce/label/c.BI_PSP_SubmitLabel';
import QUALITATIVE_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import QUALITATIVE_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenWeeks';
import DLQI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl';
import PSORIASIS_QUES_URL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import OUTSTANDING_PAGE from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UN_ASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import COMPLETED_ALL from '@salesforce/label/c.BI_PSP_CompleteAll';
import POPUP_MESSAGE from '@salesforce/label/c.BI_PSP_MsgPopupTxt';
import CANNOT_EDIT_MSG from '@salesforce/label/c.BI_PSP_CannotEditMsg';
import ERROR_VARIANT_TOAST from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import IN_PROGRESS from '@salesforce/label/c.BI_PSP_InProgressTxt';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
// To get Current UserId
import Id from '@salesforce/user/Id';

export default class BiPspbWapiQuestionnaire extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//Track variable Declarations(re-render variables).
	/**** new change*/
	firstNumberRecrdId;
	secondNumberRecrdId;
	thirdNumberRecrdId;
	firstSliderRecrdId;
	fifthRel = false;
	sixththRel = false;
	firstQuesIsNo = false;
	firstQuesIsYes = false;
	/**** */
	twoMonthsTrueFalse = false;
	@track yesOrNo;
	@track secondQuestionVisible = false;
	@track sliderThumb = false;
	@track totalDraftResponses = 0;
	@track nameToDraftFirst;
	@track nameToDraftSecond;
	@track nameToDraftThird;
	@track nameToDraftFourth;
	@track nameToDraftFifth;
	@track nameToDraftSixth;
	@track firstNumberValue = '';
	@track secondNumberValue = '';
	@track thirdNumberValue = '';
	@track displayTotalMessage = false;
	@track totalValueToUi;
	@track errorFlag = false;
	@track responseValue;
	@track firstRspValue = '';
	@track firstRespVersId = '';
	@track secondRspValue = '';
	@track secondRespVersId = '';
	@track thirdRspValue = '';
	@track thirdVersionId = '';
	@track fourthRspValue = '';
	@track fourthVersionId = '';
	@track fifthResonseValue = '';
	@track fifthVersionId = '';
	@track sixthResponseValue = '';
	@track sixthVersiD = '';
	@track numberOfResponses;
	@track checkYesOrNo = false;
	@track firstQuestionResponse = '';
	@track secondQuestionResponse = '';
	@track thirdQuestionResponse = '';
	@track fourthQuestionResponse = '';
	@track fifthQuestionresponse = '';
	@track sixthQuestionResponse = '';
	@track realAssesVerArra = [];
	@track realRespArray = [];
	@track arrayForPushResp = [];
	@track arrayForPushId = [];
	@track isConfirmationDialogOpen = false;
	@track customFormModal = false;
	@track message = COMPLETED_ALL;
	@track saveAsDraftContent = SUBMIT_LABEL;
	@track isDraftSavedPopupOpen = false;
	@track draftSavedMessage = POPUP_MESSAGE;
	@track selectedOption;
	@track isPopupOpen = false;
	@track saveAsDraftPopUp = false;
	@track sliderValue = 0;
	@track sliderValueSec = 0;
	//Global variables(without @track does not trigger automatic re-renders)
	drfatNoCheck = false;
	noCheck;
	errorMessageCheck;
	popUpMenu = false;
	userId = Id;
	firstQuestionText;
	secondQuestionText;
	thirdQuestionText;
	thirdQuestionVersionId;
	fourthQuestionText;
	fourthQuestionVersionId;
	fifthQuestionText;
	fifthQuestionVersionId;
	sixthQuestionText;
	sixthQuestionVerionId;
	urlq;
	firstDraftResp = '';
	firstDraftVerionId = '';
	secondDraftResp = '';
	secondDraftVerionId = '';
	thirdDraftResp = '';
	thirdDraftVersionId = '';
	fourthDraftRes = '';
	fourthDraftVersionId = '';
	fifthDraftResp = '';
	fifthDraftVersionId = '';
	sixthDraftResp = '';
	sixthDraftVersionId = '';
	dateResponses = [];
	storeDate;
	categoryname = WPAI_NAME;
	firstQuestionVersinId;
	secondQuestionVersinId;
	assVerId;
	assVerIdSlider;
	questionData;
	dlqiCardImage = DLQI_IMAGE;
	pssCardImage = PSS_IMAGE;
	wpaiCardImage = WPAI_IMAGE;
	qsqCardImage = QUALITATIVE_IMAGE;
	errorIcon = ALERT_ICON;
	wpaiFirstFooterMsg = WPAI_FOOTER_MSG_FIRST;
	wpaiSecndFooterMsg = WPAI_SEC_FOOTER_MSG;
	introduction = INTRODUCTION_CATEGORY;
	pss = PSS_CATEGORY;
	dlqi = DLQI_CATEGORY;
	wapi = WAPI_CATEGORY;
	qsq = QUALITATIVE_CATEGORY;
	workingForPay = WORKING_FOR_PAY_TEXT;
	wpaiText = WAPI;
	yes = YES;
	no = NO;
	includeHelpText = INCLUDE_TEXT;
	alertText = WPAI_ALERT_TEXT;
	hours = HOURS;
	skipText = WPAI_SKIP;
	sliderText = WPAI_SEC_TEXT;
	workSliderLeft = WPAI_WORK_LEFT;
	workSliderRight = WPAI_WORK_RIGHT;
	sliderTextTwo = WPAI_SLIDER_QUEST_TEXT;
	dailySliderLeft = WPAI_DAILY_LEFT;
	dailySliderRight = WPAI_DAILY_RIGHT;
	answered = ANSWERED;
	submit = BUTTON_SUBMIT;
	saveasdraft = DRAFT_BUTTON;
	rolloutdate = QUESTIONNAIRE_ROLL_OUT_DATE;
	expiresOn = QUESTIONNAIRE_EXPIRES_ON;
	outstandingQue = OUTSTANDING_PAGE_TEXT;
	returnBackc = BUTTON_RETURN_BACK;
	confirmSub = BUTTON_CONFIRM_SUB;
	cannotEdit = CANNOT_EDIT_MSG;
	cancelbt = CANCEL_BUTTON;
	confirmbt = CONFIRM_BUTTON;
	targetDateFourteenWks;
	targetDateTwoMonths;
	forteenWeeks;
	threeMonthsVar;
	lastIdVal;
	expireDate;
	rolloutDate;
	assessmentId;
	countQuestion = 2;
	handleResizeBound;
	targetElement;

	// Wire method to count assessment responses
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ error, data }) {
		try {
			// Check if data is available
			if (data) {
				// Assign data to the 'count' property
				this.count = data;
				// Check if the data array has elements
				if (this.count.length > 0) {
					// Assign specific elements of the data array to properties
					this.stwai = this.count[0];
					this.stpss = this.count[1];
					this.stdlq = this.count[2];
					this.stqsq = this.count[3];
				}
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST); // Catching Potential Error from Apex
			}
			// Handle errors
		} catch (err) {
			// Log any errors that occur during the wire method execution
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST); // Catching Potential Error from LWC
		}
	}

	// Getter method to determine if DLQI responses are available
	get checkdlqi() {
		// Check if the number of DLQI responses is greater than 0
		return this.stdlq > 0 ? 'disabled' : ''; // Return 'disabled' if DLQI responses are available, otherwise return an empty string
	}

	// Getter method to determine if PSS responses are available
	get checkpss() {
		// Check if the number of PSS responses is greater than 0
		return this.stpss > 0 ? 'disabled' : ''; // Return 'disabled' if PSS responses are available, otherwise return an empty string
	}

	// Getter method to determine if WAI responses are available
	get checkwai() {
		// Check if the number of WAI responses is greater than 0
		return this.stwai > 0 ? 'disabled' : ''; // Return 'disabled' if WAI responses are available, otherwise return an empty string
	}

	// Getter method to determine if QSQ responses are available and if target dates are set
	get checkqsq() {
		// Check if either of the target dates is null and if QSQ responses are available
		if (this.targetDateFourteenWks === null && this.targetDateTwoMonths === null) {
			return 'disabled'; // Return 'disabled' if target dates are not set
		} else if (this.stqsq > 0) {
			return 'disabled'; // Return 'disabled' if QSQ responses are available
		}
		// Return an empty string if none of the conditions are met
		return '';
	}



	// Wire method to fetch assessments by current user name
	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
    Even if there are no assessment records, we show the Questionaire page for the user to create assessment records. 
	The page will not be blank.
    */
	@wire(GET_ASSMNT_BY_CURRENT_USER_NAME, { categoryname: '$categoryname' })
	wiredAssessments({ data, error }) {
		this.handleWireResponse(data, error, this.processAssessmentsData);
	}

	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ data, error }) {
		this.handleWireResponse(data, error, this.processRolloutDateData);
	}

	// Common method to handle wire responses
	handleWireResponse(data, error, processDataCallback) {
		try {
			if (data) {
				processDataCallback.call(this, data);
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
		}
	}

	// Method to process assessments data
	processAssessmentsData(data) {
		this.assessmentId = data.length > 0 ? data[0].Id : null;
		this.status = data.length > 0 ? data[0].AssessmentStatus : null;

		if (this.status === EXPIRED) {
			this.calculateDates(data[0].ExpirationDateTime);
		}
		else if (this.status === IN_PROGRESS || this.status === COMPLETED_LABEL) {
			this.calculateDates(data[0].BI_PSP_RolloutforCompletedQuestionnarie__c)
		}
	}

	// Method to process rollout date data
	processRolloutDateData(data) {
		this.dateResponses = data;

		if (!this.assessmentId) {
			this.dateResponses.forEach((item) => {
				this.storeDate = item.BI_PSP_DLQI_RollOutDate__c;
			});
			this.calculateDates(this.storeDate);
		}
	}

	// Method to calculate and set relevant dates and expiration
	calculateDates(dateString) {
		let currentDate = new Date(dateString);
		this.rolloutDate = currentDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		let expirationDate = new Date(this.rolloutDate);
		expirationDate.setDate(expirationDate.getDate() + 30);
		this.expireDate = expirationDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		let todayMs = new Date().getTime();
		let expireDateMs = new Date(this.expireDate).getTime();
		let differenceInDays = Math.ceil((expireDateMs - todayMs) / (1000 * 60 * 60 * 24));

		this.expiresIn = differenceInDays > 30 || differenceInDays < 0 ? 30 : differenceInDays;
	}

	// Wire method to fetch patient data after three months and fourteen weeks
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_QSQ_RECORDS)
	wiredResult({ error, data }) {
		try {
			// Check if data is received
			if (data) {
				// Assign received data to corresponding variables
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				// Assign target dates with null-coalescing operator to handle possible null values
				this.targetDateTwoMonths = data.targetTwoMonthsDate ?? null;
				this.targetDateFourteenWks = data.targetFourteenWeeksDate ?? null;
			} else if (error) {
				// Log any errors if data retrieval fails
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST); // Catching Potential Error from LWC
		}
	}

	//the draft response wire method
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_THE_DRAFT_RESPONSE, { questCatgryName: '$wapi', someBooleanParam: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ error, data }) {
		try {
			if (data) {

				let objectsWithResponseOrderSeven = data.filter(
					(item) => item.BI_PSP_ResponseOrder__c === 1
				);
				this.responsOfDLQI = data;
				this.reposneModeeOn();
				this.draftResponses = data.map((response) => ({
					id: response.Id,
					questionText: response.ResponseValue,
					activeVersionId: response.AssessmentQuestion
						? response.AssessmentQuestion.Id
						: null
				}));

				// Update the totalDraftResponses property

				this.totalDraftResponses = this.draftResponses.length;
				if (objectsWithResponseOrderSeven.length > 0) {
					if (
						this.draftResponses.length > this.countQuestion ||
						objectsWithResponseOrderSeven[0].ResponseValue === this.yes
					) {
						this.countQuestion = 6;
					} else {
						this.countQuestion = 2;
					}
				}

			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST); // Catching Potential Error from Apex
			}
		} catch (err) {
			// Log any errors that occur during processing
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST); // Catching Potential Error from LWC
		}
	}

	//the draft responses are stored on to js class variable so that we can use it later to submit or save as draft.Also change the status of the radio buttons as checked if the value are matched.
	reposneModeeOn() {
		let firstYes = this.yes;
		let firstNo = this.no;
		//this for each will itearte through each of the Resoponse records and store the responses and their ids to respective variables for later usage
		this.responsOfDLQI.forEach((record) => {
			if (record.BI_PSP_ResponseOrder__c === 1) {
				if (record.ResponseValue === firstYes) {
					this.firstQuesIsYes = true;
					this.secondQuestionVisible = true;
					this.sliderThumb = true;
					this.updateThumbLabelPosition(this.sliderValue);
					this.firstDraftResp = record.ResponseValue;
					this.firstDraftVerionId = record.AssessmentQuestion.Id;
				}
				if (record.ResponseValue === firstNo) {
					this.firstQuesIsNo = true;
					this.sliderThumb = false;
					/**** */
					if (this.fifthForhandle !== true) {
						this.fifthRel = false;
					}

					/**** */
					this.firstDraftResp = record.ResponseValue;
					this.firstDraftVerionId = record.AssessmentQuestion.Id;
				}
				if (this.yesOrNo === true) {
					this.firstDraftResp = '';
					this.firstDraftVerionId = '';
					this.firstQuesIsYes = false;
					this.firstQuesIsNo = true;
					this.secondQuestionVisible = false;
				}
				else {
					if (record.ResponseValue === firstYes || this.firstRspValue === firstYes) {
						this.secondQuestionVisible = true;
						this.firstQuesIsYes = true;
						this.firstQuesIsNo = false;
					}


				}

			}

			if (record.BI_PSP_ResponseOrder__c === 2) {
				this.firstNumberRecrdId = record.Id;
				this.firstNumberValue = record.ResponseValue;
				this.secondDraftResp = record.ResponseValue;
				this.secondDraftVerionId = record.AssessmentQuestion.Id;

				if (this.yesOrNo === true) {
					this.secondDraftResp = '';
					this.secondDraftVerionId = '';
					this.firstNumberValue = '';

				}

			}

			if (record.BI_PSP_ResponseOrder__c === 3) {
				this.secondNumberValue = record.ResponseValue;
				this.secondNumberRecrdId = record.Id;
				this.thirdDraftResp = record.ResponseValue;
				this.thirdDraftVersionId = record.AssessmentQuestion.Id;

				if (this.yesOrNo === true) {
					this.thirdDraftResp = '';
					this.thirdDraftVersionId = '';
					this.secondNumberValue = '';

				}
			}

			if (record.BI_PSP_ResponseOrder__c === 4) {
				this.thirdNumberValue = record.ResponseValue;
				this.thirdNumberRecrdId = record.Id;
				this.fourthDraftRes = record.ResponseValue;
				this.fourthDraftVersionId = record.AssessmentQuestion.Id;

				if (this.yesOrNo === true) {
					this.fourthDraftRes = '';
					this.fourthDraftVersionId = '';
					this.thirdNumberValue = '';

				}
			}

			if (record.BI_PSP_ResponseOrder__c === 5) {
				this.firstSliderRecrdId = record.Id;
				const valueMap = {
					'0': 0,
					'1': 1,
					'2': 2,
					'3': 3,
					'4': 4,
					'5': 5,
					'6': 6,
					'7': 7,
					'8': 8,
					'9': 9,
					'10': 10
				};
				//here
				this.fifthRel = true;
				this.sliderValue = valueMap[record.ResponseValue] || 0; // Default to 0 if not found
				this.fifthDraftResp = record.ResponseValue;
				this.fifthDraftVersionId = record.AssessmentQuestion.Id;
				this.updateThumbLabelPosition(this.sliderValue);
			}

			if (this.yesOrNo === true) {
				this.fifthDraftResp = '';
				this.fifthDraftVersionId = '';
				this.sliderValue = '';
			}
			if (record.BI_PSP_ResponseOrder__c === 6) {
				const secValueMap = {
					'0': 0,
					'1': 1,
					'2': 2,
					'3': 3,
					'4': 4,
					'5': 5,
					'6': 6,
					'7': 7,
					'8': 8,
					'9': 9,
					'10': 10
				};
				//here
				this.sixththRel = true;
				this.sliderValueSec = secValueMap[record.ResponseValue] || 0; // Default to 0 if not found
				this.sixthDraftResp = record.ResponseValue;
				this.updateThumbLabelPositionsec(this.sliderValueSec);
				this.sixthDraftVersionId = record.AssessmentQuestion.Id;
			}

		});
	}

	// Lifecycle method called when the component is connected to the DOM
	renderedCallback() {
		try {
			// Get the current URL
			let currentURL = window.location.href;
			// Create a URL object from the current URL
			let urlObject = new URL(currentURL);
			// Get the path from the URL
			let path = urlObject.pathname;
			// Split the path using '/' as a separator
			let pathComponents = path.split('/');
			// Find the desired component in the path
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			// Determine the URL type based on the desired component
			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVI;
			} else {
				this.urlq = UN_ASSIGNED_URL_NAVI;
			}

			// Update thumb label position for a slider
			this.updateThumbLabelPositionsec(this.sliderValueSec);

			// Check if the view is in desktop mode
			this.isDesktop = this.isDesktopView();
			// Bind the event handler once and store it in a variable
			this.handleResizeBound = this.handleResize.bind(this);

			// Add the event listener using the bound handler
			window.addEventListener('resize', this.handleResizeBound);
			this.addSliderEventListener();
		} catch (error) {
			// Log any errors that occur during processing
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST); //Catching Potential Error
		}
	}

	/**
	 * Executes when the component is disconnected from the DOM.
	 * Removes the window resize event listener.
	 */
	disconnectedCallback() {
		window.removeEventListener('resize', this.handleResizeBound);
	}

	/**
	 * Handles the window resize event.
	 * Updates the isDesktop property based on the viewport width.
	 */
	handleResize() {
		this.isDesktop = this.isDesktopView();
	}

	/**
	 * Determines if the current viewport width represents a desktop view.
	 * @returns {boolean} True if the viewport width indicates a desktop view, otherwise false.
	 */
	isDesktopView() {
		let viewportWidth = window.innerWidth;

		// Adjust this threshold based on your design's breakpoints
		return (
			viewportWidth >= 1024 ||
			viewportWidth <= 400 ||
			viewportWidth <= 576 ||
			viewportWidth <= 769 ||
			viewportWidth <= 993 ||
			viewportWidth <= 1200
		); // Example breakpoints at 1024 pixels and 400 pixels
	}

	/**
	 * Handles input change events from the slider.
	 * Updates the sliderValue property and invokes the method to update the thumb label position.
	 * Pushes the response value and version ID to arrays for further processing.
	 * Retrieves the last response value and version ID from the arrays.
	 * @param {Event} event - The input change event.
	 */
	handleInputChange(event) {
		// Update slider value and thumb label position
		this.sliderValue = event.target.value;
		this.updateThumbLabelPosition(this.sliderValue);
		//here
		this.fifthForhandle = true;
		this.fifthRel = true;
		// Update fifth question response value and name for draft
		this.fifthQuestionresponse = event.target.value;
		this.nameToDraftFifth = event.target.name;

		// Push response value and version ID to arrays
		if (this.fifthQuestionresponse !== '') {
			this.arrayForPushResp.push(this.fifthQuestionresponse);
			this.arrayForPushId.push(this.fifthQuestionVersionId);
		}

		// Get the last response value and version ID
		this.fifthResonseValue = this.getLastRespValue();
		this.fifthVersionId = this.getLastIdValue();
	}

	/**
	 * Updates the position of the thumb label based on the slider value.
	 * @param {number} sliderValue - The current value of the slider.
	 */
	updateThumbLabelPosition(sliderValue) {
		Promise.resolve().then(() => {
			// Get slider and thumb label elements
			let slider = this.template.querySelector('.slider');
			let thumbLabel = this.template.querySelector('.thumb-label');

			// Calculate thumb label position
			let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
			let sliderWidth = slider.offsetWidth;
			let thumbPosition =
				(sliderValue / slider.max) * (sliderWidth - thumbWidth);

			// Calculate new thumb position
			let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
			let maxPosition = sliderWidth - thumbWidth;

			// Update thumb label position
			thumbLabel.style.left =
				Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
			thumbLabel.setAttribute('data-value', sliderValue);
		});
	}

	/**
	 * Adds event listeners to slider elements to update thumb positions.
	 * Uses input and mousemove events for real-time updates.
	 */
	addSliderEventListener() {
		// Get primary slider element

		let slider = this.template.querySelector('.slider');

		// Define function to update thumb position for primary slider
		let updateThumbPosition1 = () => {
			this.updateThumbLabelPosition(slider.value);
		};

		// Add event listeners to primary slider
		if (slider) {
			slider.addEventListener('input', updateThumbPosition1);
			slider.addEventListener('mousemove', updateThumbPosition1);
		}

		// Get secondary slider element

		let slidersec = this.template.querySelector('.slidersec');

		// Define function to update thumb position for secondary slider
		let updateThumbPosition2 = () => {
			this.updateThumbLabelPositionsec(slidersec.value);
		};

		// Add event listeners to secondary slider
		if (slidersec) {
			slidersec.addEventListener('input', updateThumbPosition2);
			slidersec.addEventListener('mousemove', updateThumbPosition2);
		}
	}

	/**
	 * Handles input changes for the secondary slider.
	 * Updates the slider value and thumb position, as well as the corresponding question response.
	 */
	handleInputChangesec(event) {
		//here
		this.sixththRel = true;
		// Update slider value and thumb position
		this.sliderValueSec = event.target.value;
		this.updateThumbLabelPositionsec(this.sliderValueSec);

		// Update sixth question response and name for draft
		this.sixthQuestionResponse = event.target.value;
		this.nameToDraftSixth = event.target.name;

		// Push response and version ID to arrays if response is not empty
		if (this.sixthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.sixthQuestionResponse);
			this.arrayForPushId.push(this.sixthQuestionVerionId);
		}

		// Get the last response value and version ID separately
		this.sixthResponseValue = this.getLastRespValue();
		this.sixthVersiD = this.getLastIdValue();
	}

	/**
	 * Updates the position of the thumb label for the secondary slider.
	 * @param {number} sliderValueSec - The current value of the secondary slider.
	 */
	updateThumbLabelPositionsec(sliderValueSec) {
		// Use requestAnimationFrame to wait for the next rendering cycle
		let slider = this.template.querySelector('.slidersec');
		let thumbLabel = this.template.querySelector('.thumb-labelsec');

		// Calculate thumb position and label display
		let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
		let sliderWidth = slider.offsetWidth;
		let thumbPosition =
			(sliderValueSec / slider.max) * (sliderWidth - thumbWidth);
		let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
		let maxPosition = sliderWidth - thumbWidth;

		// Update thumb label position and data value attribute
		thumbLabel.style.left =
			Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
		thumbLabel.setAttribute('data-value', sliderValueSec);
	}
	/**
	 * Determines the CSS class for the popup container based on the state of the popup.
	 * @returns {string} - The CSS class for the popup container.
	 */
	get popupClass() {
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}

	/**
	 * Determines the CSS class for the save draft popup container based on the state of the popup.
	 * @returns {string} - The CSS class for the save draft popup container.
	 */
	get popupClassSaveDraft() {
		return this.isDraftSavedPopupOpen
			? 'popup-containersaveasdr'
			: 'popup-containersaveasdr hidden';
	}

	/**
	 * Determines the CSS class for the secondary popup container based on its state.
	 * @returns {string} - The CSS class for the secondary popup container.
	 */
	get popupClass1() {
		return this.saveAsDraftPopUp ? 'popup2-container' : 'popup2-container hidden';
	}

	/**
	 * Closes all popups.
	 */
	customHideModalPopup() {
		this.customFormModal = false;
		this.isPopupOpen = false;
		this.saveAsDraftPopUp = false;
	}

	//this eire method holds the Questions of Wapi Qustionnsire.
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_THE_ASSESSMENT_QUESTION, { questionnaireName: '$wapi' })
	wiredAssessmentQuestion({ error, data }) {
		try {
			if (data) {
				this.questionData = data.map((question) => ({
					id: question.Id,
					questionText: question.QuestionText,
					activeVersionId: question.ActiveVersion
						? question.ActiveVersion.Id
						: null
				}));
				//the below variables holds the Questions one by one
				let firstQuestion = this.questionData[0];
				let secondQuestion = this.questionData[1];
				let thirdQuestion = this.questionData[2];
				let fourthQuestion = this.questionData[3];
				let fifthQuestion = this.questionData[4];
				let sixthQuestion = this.questionData[5];

				//the below class propertys holds the Questions one by one
				this.firstQuestionText = firstQuestion.questionText;

				this.firstQuestionVersinId = firstQuestion.activeVersionId;
				this.secondQuestionText = secondQuestion.questionText;
				this.secondQuestionVersinId = secondQuestion.activeVersionId;
				this.thirdQuestionText = thirdQuestion.questionText;
				this.thirdQuestionVersionId = thirdQuestion.activeVersionId;
				this.fourthQuestionText = fourthQuestion.questionText;
				this.fourthQuestionVersionId = fourthQuestion.activeVersionId;
				this.fifthQuestionText = fifthQuestion.questionText;
				this.fifthQuestionVersionId = fifthQuestion.activeVersionId;
				this.sixthQuestionText = sixthQuestion.questionText;
				this.sixthQuestionVerionId = sixthQuestion.activeVersionId;
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
		}
	}
	//when the response value  for the first Question is no we will set the values of other radio fields as empty.
	noBasedResponseDeletion() {
		document.body.style.overflow = ''; // Reset to default

		this.secondQuestionResponse = '';

		this.thirdQuestionResponse = '';
		this.fourthQuestionResponse = '';
		this.fifthQuestionresponse = '';

		this.nameToDraftSecond = '';
		this.nameToDraftThird = '';
		this.nameToDraftFourth = '';
		this.nameToDraftFifth = '';

		this.secondDraftResp = '';
		this.secondDraftVerionId = '';
		this.thirdDraftResp = '';
		this.thirdDraftVersionId = '';
		this.fourthDraftRes = '';
		this.fourthDraftVersionId = '';

		this.fifthDraftResp = '';
		this.fifthDraftVersionId = '';

		this.secondRspValue = '';
		this.secondRespVersId = '';
		this.thirdRspValue = '';
		this.thirdVersionId = '';
		this.fourthRspValue = '';
		this.fourthVersionId = '';
		this.fifthResonseValue = '';
		this.fifthVersionId = '';

		this.firstNumberValue = '';
		this.secondNumberValue = '';
		this.thirdNumberValue = '';
		this.sliderValue = '';
		this.errorFlag = false;
	}

	/**
	 * Handles the click event from the first question checkbox.
	 * @param {Event} event - The click event object.
	 */
	onclickFronFirstQuestion(event) {
		let valueToSend = event.target.value; // Get the value of the checkbox

		sessionStorage.setItem('qustion', valueToSend);
		let sendValueEvent = new CustomEvent('sendvalue', {
			detail: { value: valueToSend }
		});
		this.dispatchEvent(sendValueEvent);

		if (event.target.checked) {
			let val = event.target.value;
			if (val === this.yes) {
				this.countQuestion = 6;
				this.sliderValue = 0;
				this.firstQuesIsYes = true;
				this.firstQuesIsNo = false;
				this.secondQuestionVisible = true;
				this.updateThumbLabelPosition(this.sliderValue);
			}

			if (val === this.no) {
				this.countQuestion = 2;
				if (this.totalDraftResponses >= 6) {
					this.totalDraftResponses = 2;
				}

				this.firstQuesIsNo = true;
				this.firstQuesIsYes = false;
				//here too
				this.fifthRel = false;
				let recordIdsToDelete = [
					{ value: this.firstNumberValue, id: this.firstNumberRecrdId },
					{ value: this.secondNumberValue, id: this.secondNumberRecrdId },
					{ value: this.thirdNumberValue, id: this.thirdNumberRecrdId },
					{ value: this.fifthDraftResp, id: this.firstSliderRecrdId }
				]
					.filter(record => !record.value)
					.map(record => record.id);

				this.deleteSelectedResponses(recordIdsToDelete);
				this.noBasedResponseDeletion();
			}
		}
		this.secondQuestionVisible = event.target.value === this.yes;

		this.nameToDraftFirst = event.target.name;

		this.firstQuestionResponse = event.target.value;

		if (this.firstQuestionResponse !== '') {
			this.arrayForPushResp.push(this.firstQuestionResponse);
			this.arrayForPushId.push(this.firstQuestionVersinId);
		}
		// Get the last values separately
		this.firstRspValue = this.getLastRespValue();
		this.firstRespVersId = this.getLastIdValue();
	}


	/**
	* Handles the change event for the first number input field.
	* @param {Event} event - The change event object.
	*/
	oncahngeOfFirstNumber(event) {
		this.firstNumberValue = event.target.value;
		this.checkTotal();
		this.nameToDraftSecond = event.target.name;
		this.secondQuestionResponse = this.firstNumberValue;

		if (this.secondQuestionResponse !== '') {
			this.arrayForPushResp.push(this.secondQuestionResponse);
			this.arrayForPushId.push(this.secondQuestionVersinId);
		}
		// Get the last values separately
		this.secondRspValue = this.getLastRespValue();
		this.secondRespVersId = this.getLastIdValue();
	}


	/**
	* Handles the change event for the second number input field.
	* @param {Event} event - The change event object.
	*/
	handleKeyPress(event) {
		if (event.key === '-' || event.key === '+' || event.key === '=') {
			event.preventDefault();  // Prevent the '-' character from being entered
		}
	}
	handlePaste(event) {

		event.preventDefault();
	}
	handleInput(event) {
		let input = event.target;
		if (input.value > 167) {
			input.value = 167;
		}
		else if (input.value === '000') {
			input.value = 0;
		}
	}
	oncahngeOfSecondNumber(event) {
		this.secondNumberValue = event.target.value;
		this.checkTotal();
		this.nameToDraftThird = event.target.name;
		this.thirdQuestionResponse = this.secondNumberValue;

		if (this.thirdQuestionResponse !== '') {
			this.arrayForPushResp.push(this.thirdQuestionResponse);
			this.arrayForPushId.push(this.thirdQuestionVersionId);
		}
		// Get the last values separately
		this.thirdRspValue = this.getLastRespValue();
		this.thirdVersionId = this.getLastIdValue();
	}


	/**
	* Handles the change event for the third number input field.
	* @param {Event} event - The change event object.
	*/
	oncahngeOfThirdNumber(event) {
		this.thirdNumberValue = event.target.value;
		this.checkTotal();

		this.nameToDraftFourth = event.target.name;
		this.fourthQuestionResponse = this.thirdNumberValue;

		if (this.fourthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourthQuestionResponse);
			this.arrayForPushId.push(this.fourthQuestionVersionId);
		}
		// Get the last values separately
		this.fourthRspValue = this.getLastRespValue();
		this.fourthVersionId = this.getLastIdValue();
	}

	/**
	* Retrieves the last response value from the array.
	* @returns {string|null} - The last response value or null if the array is empty.
	*/
	getLastRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	/**
	* Retrieves the last response ID from the array.
	* @returns {string|null} - The last response ID or null if the array is empty.
	*/
	getLastIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	/**
	* Calculates the total value of the three input fields and checks if it exceeds 168.
	* If the total exceeds 168, sets an error flag and adds a red border to the input fields.
	* If the total is within the limit, clears any error messages and removes the red border.
	*/
	checkTotal() {
		let totalValue =
			parseFloat(this.firstNumberValue, 10) +
			parseFloat(this.secondNumberValue, 10) +
			parseFloat(this.thirdNumberValue, 10);

		this.totalValueToUi = totalValue;
		let viewportWidth = window.innerWidth;
		// Css attribute call for Certain conditions
		if (totalValue >= 168) {
			// Set error flag and add red border to input fields
			this.errorFlag = true;
			this.template
				.querySelectorAll('.numbox')
				.forEach((input) => input.classList.add('red-border'));
			if (viewportWidth >= 320 && viewportWidth <= 399) {
				this.template
					.querySelectorAll('.qnouterbox')
					.forEach((box) => (box.style.height = '322px'));
				this.template
					.querySelectorAll('.qnouterbox1')
					.forEach((box) => (box.style.height = '258px'));
				this.template
					.querySelectorAll('.qnouterbox2')
					.forEach((box) => (box.style.height = '239px'));
			}
			if (viewportWidth >= 399 && viewportWidth <= 576) {
				this.template
					.querySelectorAll('.qnouterbox')
					.forEach((box) => (box.style.height = '303px'));
				this.template
					.querySelectorAll('.qnouterbox1')
					.forEach((box) => (box.style.height = '250px'));
				this.template
					.querySelectorAll('.qnouterbox2')
					.forEach((box) => (box.style.height = '227px'));
			}
			if (viewportWidth >= 1201 && viewportWidth <= 1360) {
				this.template
					.querySelectorAll('.qnouterbox')
					.forEach((box) => (box.style.height = '286px'));
				this.template
					.querySelectorAll('.qnouterbox1')
					.forEach((box) => (box.style.height = '237px'));
				this.template
					.querySelectorAll('.qnouterbox2')
					.forEach((box) => (box.style.height = '210px'));
			}
		} else {
			// Clear error messages and remove red border
			this.errorMessageCheck = '';
			this.errorFlag = false;
			this.template
				.querySelectorAll('.numbox')
				.forEach((input) => input.classList.remove('red-border'));
			if (viewportWidth >= 320 && viewportWidth <= 399) {
				this.template
					.querySelectorAll('.qnouterbox')
					.forEach((box) => (box.style.height = '278px'));
				this.template
					.querySelectorAll('.qnouterbox1')
					.forEach((box) => (box.style.height = '214px'));
				this.template
					.querySelectorAll('.qnouterbox2')
					.forEach((box) => (box.style.height = '195px'));
			}
			if (viewportWidth >= 399 && viewportWidth <= 576) {
				this.template
					.querySelectorAll('.qnouterbox')
					.forEach((box) => (box.style.height = '268px'));
				this.template
					.querySelectorAll('.qnouterbox1')
					.forEach((box) => (box.style.height = '216px'));
				this.template
					.querySelectorAll('.qnouterbox2')
					.forEach((box) => (box.style.height = '198px'));
			}
			if (viewportWidth >= 1201 && viewportWidth <= 1360) {
				this.template
					.querySelectorAll('.qnouterbox')
					.forEach((box) => (box.style.height = '266px'));
				this.template
					.querySelectorAll('.qnouterbox1')
					.forEach((box) => (box.style.height = '218px'));
				this.template
					.querySelectorAll('.qnouterbox2')
					.forEach((box) => (box.style.height = '198px'));
			}
		}

		// Display the error message only when the total exceeds 168 and at least one field has a value
	}

	/**
	* Navigates the user to the DLQI questionnaire page based on the current URL.
	*/
	navigateToCategory2() {
		window.location.assign(this.urlq + DLQI_QUESTIONNAIRE_URL);
	}

	/**
	* Navigates the user to the PSS questionnaire page based on the current URL.
	*/
	navigateToCategory3() {
		window.location.assign(this.urlq + PSORIASIS_QUES_URL);
	}

	/**
	* Navigates the user to the appropriate QSQ questionnaire page based on the presence of target dates.
	* If targetDateFourteenWks is not null, navigates to QSQ questionnaire page 2, else navigates to QSQ questionnaire page 1.
	*/
	navigateToCategory5() {
		if (this.targetDateFourteenWks !== null) {
			window.location.assign(this.urlq + QUALITATIVE_FOURTEEN_WEEKS); // Navigate to page 2
		} else {
			window.location.assign(this.urlq + QUALITATIVE_TWO_MONTHS); // Navigate to page 1
		}
	}

	// Utility function to reset form values
	resetFormValues() {
		this.firstNumberValue = '';
		this.secondNumberValue = '';
		this.thirdNumberValue = '';
		this.sliderValue = '';

		this.secondDraftResp = '';
		this.thirdDraftResp = '';
		this.fourthDraftRes = '';
		this.fifthDraftResp = '';
	}

	// Utility function to handle Yes/No question state
	handleYesNoQuestionState() {
		if (this.firstQuesIsYes === true) {
			this.firstQuesIsYes = true;
			this.firstQuesIsNo = false;
			this.yesOrNo = false;
		} else if (this.firstQuesIsNo === true) {
			this.yesOrNo = true;
			this.firstRspValue = this.no;
			this.firstQuesIsYes = false;
			this.firstQuesIsNo = true;
			this.resetFormValues();
		}
	}

	// Utility function to update slider positions
	updateSliderPositions() {
		if (this.fifthRel === true) {
			this.updateThumbLabelPosition(this.sliderValue);
		}

		if (this.sixththRel === true) {
			this.updateThumbLabelPositionsec(this.sliderValueSec);
		}
	}

	// closePopup1 method
	closePopup1() {
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.saveAsDraftPopUp = false;
		this.popUpMenu = false;

		this.handleYesNoQuestionState();
		this.updateSliderPositions();
	}

	// aMethodForYes method
	aMethodForYes() {
		if (this.fifthQuestionresponse === '') {
			this.sliderValue = 0;
			this.updateThumbLabelPosition(this.sliderValue);
		}
	}

	// closePopup method
	closePopup() {
		document.body.style.overflow = '';
		this.isPopupOpen = false;
		this.popUpMenu = false;

		this.handleYesNoQuestionState();
		this.updateSliderPositions();
	}




	// Utility function to set modal and popup states
	setModalAndPopupStates(customFormModal, saveAsDraftPopUp, isPopupOpen) {
		this.customFormModal = customFormModal;
		this.saveAsDraftPopUp = saveAsDraftPopUp;
		this.isPopupOpen = isPopupOpen;
	}

	// Utility function to check condition for 'No' response
	checkNoResponseConditions() {
		if (this.firstNumberValue === '' && this.secondNumberValue === '' && this.thirdNumberValue === '' 
		&& this.fifthRel === false && this.sixththRel === true) {
			this.setModalAndPopupStates(false, false, true);
		} else {
			this.setModalAndPopupStates(true, true, false);
		}
	}

	// Utility function to check condition for 'Yes' response
	checkYesResponseConditions() {
		if (this.firstNumberValue !== '' && this.secondNumberValue !== '' 
		&& this.thirdNumberValue !== '' && this.fifthRel === true && this.sixththRel === true) {
			this.setModalAndPopupStates(false, false, true);
		} else {
			this.setModalAndPopupStates(true, true, false);
		}
	}

	// Utility function to check condition for neutral response
	checkNeutralResponseConditions() {
		if (!this.firstQuesIsYes && !this.firstQuesIsNo && this.firstNumberValue === '' 
		&& this.secondNumberValue === '' && this.thirdNumberValue === '' && this.fifthRel === false && this.sixththRel === false) {
			this.setModalAndPopupStates(true, true, false);
		}
	}

	// Evaluate response conditions method
	evaluateResponseConditions() {
		if (this.firstQuesIsNo && !this.firstQuesIsYes) {
			this.checkNoResponseConditions();
		} else if (this.firstQuesIsYes && !this.firstQuesIsNo) {
			this.checkYesResponseConditions();
		} else {
			this.checkNeutralResponseConditions();
		}
	}

	// saveResponse method
	saveResponse() {
		if (this.firstRspValue === 'No') {
			this.isDesktop = false;
			this.errorFlag = false;
		}

		this.adjustBodyOverflow();
		this.popUpMenu = true;

		this.evaluateResponseConditions();

		// Check if errorFlag is true and adjust states accordingly
		if (this.errorFlag === true) {
			this.isPopupOpen = false;
			this.popUpMenu = false;
			document.body.style.overflow = '';
		}
	}

	//Returns 'disabled' if the popup menu is visible, otherwise returns an empty string.

	get popuphide() {
		if (this.popUpMenu === true) {
			return this.popUpMenu === true ? 'disabled' : '';
		}
		return '';
	}

	// Utility function to delete selected responses based on record IDs
	deleteSelectedResponses(recordIdsToDelete) {
		if (recordIdsToDelete.length > 0) {
			DELETE_SELECTED_RESPONSE({ idOfRes: recordIdsToDelete })
				.then(() => {
					this.isDelete = true;
				})
				.catch((error) => {
					this.showToast('Error', error.body.message, 'error');
				});
		}
	}

	// Utility function to handle overflow style based on the view
	adjustBodyOverflow() {
		if (this.isDesktop) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = ''; // Reset to default
		}
	}

	// Utility function to prepare response arrays
	prepareResponseArrays() {
		const responses = [
			{ rspValue: this.firstRspValue, draftResp: this.firstDraftResp, respVersId: this.firstRespVersId, draftVersionId: this.firstDraftVerionId, numberValue: '' },
			{ rspValue: this.secondRspValue, draftResp: this.secondDraftResp, respVersId: this.secondRespVersId, draftVersionId: this.secondDraftVerionId, numberValue: this.firstNumberValue },
			{ rspValue: this.thirdRspValue, draftResp: this.thirdDraftResp, respVersId: this.thirdVersionId, draftVersionId: this.thirdDraftVersionId, numberValue: this.secondNumberValue },
			{ rspValue: this.fourthRspValue, draftResp: this.fourthDraftRes, respVersId: this.fourthVersionId, draftVersionId: this.fourthDraftVersionId, numberValue: this.thirdNumberValue },
			{ rspValue: this.fifthResonseValue, draftResp: this.fifthDraftResp, respVersId: this.fifthVersionId, draftVersionId: this.fifthDraftVersionId, numberValue: '' },
			{ rspValue: this.sixthResponseValue, draftResp: this.sixthDraftResp, respVersId: this.sixthVersiD, draftVersionId: this.sixthDraftVersionId, numberValue: '' }
		];

		this.realRespArray = [];
		this.realAssesVerArra = [];

		responses.forEach((response) => {
			if (response.rspValue !== '' && response.respVersId !== '') {
				this.realRespArray.push(response.rspValue);
				this.realAssesVerArra.push(response.respVersId);
			} else if (response.draftResp !== '' && response.rspValue === '') {
				this.realRespArray.push(response.draftResp);
				this.realAssesVerArra.push(response.draftVersionId);
			} else if (response.numberValue !== '' && response.rspValue === null) {
				this.realRespArray.push(response.draftResp);
				this.realAssesVerArra.push(response.draftVersionId);
			}
		});
	}

	// Utility function to submit responses
	submitResponses(draft, twoMonths) {
		let nonEmptyResponses = this.realRespArray.filter(response => response !== '');
		let nonEmptyIds = this.realAssesVerArra.filter(id => id !== '');

		if (nonEmptyResponses.length > 0) {
			SUBMIT_DRAFT_RESPONSE({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: draft,
				isQsqAfterTwoMonths: twoMonths
			})
				.then(() => {
					this.customFormModal = false;
					this.closePopup1 = false;
					this.checkYesOrNo = false;
					this.popUpMetod();
				})
				.catch((error) => {
					this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
				});
		} else {
			window.location.assign(this.urlq + OUTSTANDING_PAGE);
		}
	}

	// saveAsDraft method
	saveAsDraft() {
		if (this.errorFlag !== true) {
			this.adjustBodyOverflow();
			this.popUpMenu = true;

			let recordIdsToDelete = [
				{ value: this.firstNumberValue, id: this.firstNumberRecrdId },
				{ value: this.secondNumberValue, id: this.secondNumberRecrdId },
				{ value: this.thirdNumberValue, id: this.thirdNumberRecrdId },
				{ value: this.fifthDraftResp, id: this.firstSliderRecrdId }
			]
				.filter(record => !record.value)
				.map(record => record.id);

			this.deleteSelectedResponses(recordIdsToDelete);

			this.prepareResponseArrays();
			this.submitResponses(false, false);
		}
	}

	// confirmSubmission method
	confirmSubmission() {
		let recordIdsToDelete = [
			{ value: this.firstNumberValue, id: this.firstNumberRecrdId },
			{ value: this.secondNumberValue, id: this.secondNumberRecrdId },
			{ value: this.thirdNumberValue, id: this.thirdNumberRecrdId },
			{ value: this.fifthDraftResp, id: this.firstSliderRecrdId }
		]
			.filter(record => !record.value)
			.map(record => record.id);

		this.deleteSelectedResponses(recordIdsToDelete);

		window.location.assign(this.urlq + OUTSTANDING_PAGE);

		this.prepareResponseArrays();

		if (this.realRespArray.length === 2 || this.realRespArray.length === 6) {
			this.submitResponses(true, false);
		}
	}

	//this will close the popup method and make a naviagtion
	closeDraftSavedPopup() {
		this.isDraftSavedPopupOpen = false;
		window.location.assign(this.urlq + OUTSTANDING_PAGE);
	}
	//custom pop up method as per requirement it should be deplay for certain ms 
	popUpMetod() {
		try {
			// Create an observer to watch when the scroll reaches the top
			const observer = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					this.isDraftSavedPopupOpen = true;
					observer.disconnect(); // Disconnect the observer once the target is in view
					document.body.removeChild(this.targetElement); // Cleanup the target element
				}
			}, { threshold: 1.0 });

			// Create a target element at the top of the page
			this.targetElement = document.createElement('div');
			this.targetElement.style.position = 'absolute';
			this.targetElement.style.top = '0';
			document.body.appendChild(this.targetElement);

			// Start observing the target
			observer.observe(this.targetElement);

			// Scroll to the top smoothly
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} catch (error) {
			// Handle any errors here
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST); // Catching Potential Error
		}
	}
	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		let event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}

}