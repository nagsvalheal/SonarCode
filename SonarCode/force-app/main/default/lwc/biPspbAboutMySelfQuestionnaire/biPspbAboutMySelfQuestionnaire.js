// This introductory questionnaire allows you to provide information about yourself
// To import Libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//  To import Apex Classes
import CREATE_TASK from '@salesforce/apex/BI_PSPB_LetPersonaliseNotification.createTaskIfNoAssessment';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import INTRODUCTION_QUESTIONARE from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import SUBMIT_ASSESSMENT_RESPONSE from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_INTRODUCTION from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import DELETE_SELECTED_RESPONSE from '@salesforce/apex/BI_PSP_LetsPersonliseCtrl.draftRespoDeletion';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCompletedAssessmentCountsByCurrentUserName';
import GET_PATIENT_AFTER_THREE_MONTHS_AND_FOURTEEN_WEEKS from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
import LESSTHAN_A_MONTH from '@salesforce/label/c.BI_PSP_RbOneMonth';
import SIXMONTHS from '@salesforce/label/c.BI_PSP_RbSixMnth';
import LESS_THAN_YEAR from '@salesforce/label/c.BI_PSP_RbOneYear';
import MORE_THAN_YEAR from '@salesforce/label/c.BI_PSP_RbOneYearMore';
import MALE from '@salesforce/label/c.BI_PSP_RbMale';
import FEMALE from '@salesforce/label/c.BI_PSP_RbFemale';
import OTHER from '@salesforce/label/c.BI_PSP_RbOther';
import PREFERNOT_TOSAY from '@salesforce/label/c.BI_PSP_RbNotToSay';
import YES from '@salesforce/label/c.BI_PSP_OptionValueYes';
import NO from '@salesforce/label/c.BI_PSP_OptionValueNo';
import RELATIONSHIPWITH_FF from '@salesforce/label/c.BI_PSP_RbFamAndFriends';
import RELATIONSHIPWITH_PARTNER from '@salesforce/label/c.BI_PSP_RbWithPartner';
import SELF_ESTEEM from '@salesforce/label/c.BI_PSP_RbSelfEsteem';
import SELECT_ALL from '@salesforce/label/c.BI_PSP_RbSelectAll';
import MYSELF from '@salesforce/label/c.BI_PSP_IntroAboutMyself';
import NEXT from '@salesforce/label/c.BI_PSP_NextButton';
import SKIP from '@salesforce/label/c.BI_PSP_SkipButton';
import ASTHMA from '@salesforce/label/c.BI_PSP_RbAsthma';
import DIABETESMELLITUS from '@salesforce/label/c.BI_PSP_RbDiabetesMellitus';
import DEPRESSION from '@salesforce/label/c.BI_PSP_RbDepression';
import HAY_FEVER from '@salesforce/label/c.BI_PSP_RbHayFever';
import HYPERTENSION from '@salesforce/label/c.BI_PSP_RbHyperTension';
import HIGHCHOLESTEROL from '@salesforce/label/c.BI_PSP_RbHighCholesterol';
import OBESITY from '@salesforce/label/c.BI_PSP_Obesity';
import OSTEOPOROSIS from '@salesforce/label/c.BI_PSP_Osteoporosis';
import ULCER from '@salesforce/label/c.BI_PSP_Ulcer';
import PSORIASIS from '@salesforce/label/c.BI_PSP_RbPsoriasis';
import PSORIATICARTHRITIS from '@salesforce/label/c.BI_PSP_PsoriaticArthritis';
import DO_YOU_AGREE from '@salesforce/label/c.BI_PSP_QstnDoYouAgree';
import FIFTH_QUESTION from '@salesforce/label/c.BI_PSP_FifthQstnTxtIntro';
import SIXTH_QUESTION from '@salesforce/label/c.BI_PSP_SixthQstnTxtIntro';
import MAYBE from '@salesforce/label/c.BI_PSP_RbMaybe';
import ANSWERED from '@salesforce/label/c.BI_PSP_NumOfAnsrdQstn';
import SUBMIT from '@salesforce/label/c.BI_PSP_ButtonSubmit';
import OUTSTANDING_QUESTIONNAIRE from '@salesforce/label/c.BI_PSP_OutstndngPageTxt';
import RETURN_BACK from '@salesforce/label/c.BI_PSP_ButtonReturnback';
import CONFIRM_SUBMISSION from '@salesforce/label/c.BI_PSP_ButtonConfirmSub';
import CANNOT_BE_EDITED from '@salesforce/label/c.BI_PSP_CannotBeEditedTxt';
import CANCEL from '@salesforce/label/c.BI_PSP_CancelButton';
import CONFIRM from '@salesforce/label/c.BI_PSP_ConfirmButton';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import POPUP_MESSAGE from '@salesforce/label/c.BI_PSP_MsgPopupTxt';
import SUBMIT_MESSAGE from '@salesforce/label/c.BI_PSP_SubmitLabel';
import PERZONALISE from '@salesforce/label/c.BI_PSPB_LetsPersonalisePageTwo';
import COMPLETE_ALL from '@salesforce/label/c.BI_PSP_CompleteAll';
import OTHERS from '@salesforce/label/c.BI_PSP_Others';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
// To import current user ID
import Id from '@salesforce/user/Id';

export default class BiPspbAboutMySelfQuestionnaire extends LightningElement {

	twoMonthsTrueFalse = false;
	cpeId;
	taskId;
	urlObject;
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of variables with 
	countQuestion = 15;
	isMale = false;
	isFemale = false;
	isOther = false;
	iSPrefferNotToSay = false;

	isFirstLessThanMonth = false;
	isFirstLessSix = false;
	isFirstLessYear = false;
	isFirstMoreYear = false;

	thirdIsNo = false;
	thirdIsYes = false;

	eighthRadYes = false;
	eighthRadNo = false;

	fourthCheckRelatFam = false;
	fourthCheckWithPartner = false;
	fourthCheckSelfEsteem = false;

	ninthRadYes = false;
	ninthRadNo = false;

	tenthCheckAsthma = false;
	tenthCheckDiabetes = false;
	tenthCheckDepression = false;
	tenthCheckHayFever = false;
	tenthCheckBp = false;
	tenthCheckHighChol = false;
	tenthCheckObesity = false;
	tenthCheckOsteo = false;
	tenthCheckPeptic = false;
	tenthCheckplaque = false;
	tenthCheckpsoriatic = false;
	tenthCheckOthers = false;

	afterSixthRadYes = false;
	afterSixthRadMaybe = false;
	afterSixthRadNo = false;

	sixthRadYes = false;
	sixthRadMayBe = false;
	sixthRadNo = false;

	eleventhRadYes = false;
	eleventhRadMaybe = false;
	eleventhRadNo = false;

	secondRadYes = false;
	secondRadMaybe = false;
	secondRadNo = false;

	thirdRadYes = false;
	thirdRadMaybe = false;
	thirdRadNo = false;

	fourthRadYes = false;
	fourthRadMaybe = false;
	fourthRadNo = false;

	fifthRadYes = false;
	fifthRadNo = false;

	seventhRadYes = false;
	seventhRadMaybe = false;
	seventhRadNo = false;

	twelthRadYes = false;
	twelthRadMaybe = false;
	twelthRadNo = false;

	thirteenththRadYes = false;
	thirteenththRadMaybe = false;
	thirteenththRadNo = false;

	forteenththRadYes = false;
	forteenthRadMaybe = false;
	forteenthRadNo = false;
	sixthQuestionVisible = false;

	firstQuestionText;
	firstQuestionVersinId;
	secondQuestionText;
	secondQuestionVersinId;
	thirdQuestionText;
	thirdQuestionVersinId;
	fourthQuestionText;
	fourthQuestionVersinId;
	fifthQuestionText;
	fifthQuestionVersinId;
	sixthQuestionText;
	sixthQuestionVersinId;
	seventhQuestionText;
	seventhQuestionVersinId;
	eightQuestionText;
	eightQuestionVersinId;
	ninthQuestionText;
	ninthQuestionVersinId;
	tenthQuestionText;
	tenthQuestionVersinId;
	eleventhQuestionText;
	eleventhQuestionVersinId;
	twelthQuestionText;
	twelthQuestionVersinId;
	thirteeenthQuestionText;
	thirteeenthQuestionVersinId;
	foteenthQuestionText;
	foteenthQuestionVersinId;
	fifteenthQuestionText;
	fifteenthQuestionVersinId;
	sixteenthQuestionText;
	sixteenthQuestionVersinId;
	seventeethQuestionText;
	seventeethQuestionVersinId;
	eighteenthQuestionText;
	eighteenthQuestionVersinId;

	selectedDateRange = '';
	selectedGender = '';
	selectedGppDiscussion = '';
	@track selectedGppImpact = [];
	hasMedicalConditions = '';
	showMedicalConditions = false;
	@track selectedMedicalConditions = [];

	firstQuestionResponse = '';
	secondQuestionResponse = '';
	thirdQuestionResponse = '';
	fourthQuestionResponse = '';

	fifthQuestionresponse = '';
	sixthQuestionResponse = '';
	seventhQuestionResponse = '';
	eightQuestionResponse = '';
	ninthQuestionResponse = '';
	tenthQuestionResponse = '';
	eleventhQuestionResponse = '';

	twelvthQuestionResponse = '';
	thirteenthQuestionResponse = '';
	fourteenthQuestionResponse = '';
	fifteenthQuestionResponse = '';
	sixteenthQuestionResponse = '';

	@track realAssesVerArra = [];
	@track realRespArray = [];
	@track arrayForPushResp = [];
	@track arrayForPushId = [];



	firstRspValue = '';
	firstRespVersId = '';
	secondRspValue = '';
	secondRespVersId = '';
	thirdRspValue = '';
	thirdVersionId = '';
	fourthRspValue = '';
	fourthVersionId = '';
	fifthResonseValue = '';
	fifthVersionId = '';
	sixthResponseValue = '';
	sixthVersiD = '';

	eventCheck = false;
	numberOfResponses;
	checkYesOrNo = false;

	@track totalValu = [];
	@track selectMedic = [];
	@track draftResponses = [];

	checkBoxArray;

	@track records = [];
	@track customClass = 'nds-form-element nds-form-containerthree';
	@track savedArrayForPushResp = [];
	concatenatedValues;

	showSixteenthQuestion = false;
	isConfirmationDialogOpen = false;
	customFormModal = false;

	@track selectedValues = [];

	isDraftSavedPopupOpen = false;
	draftSavedMessage = POPUP_MESSAGE;

	isPopupOpen = false;
	isPopupOpen1 = false;

	// Declaration of Global variables
	uniqueUncheckedCount = '';
	uniqueCheckedCount = '';
	itsTrue = false;
	content1 = SUBMIT_MESSAGE;
	message = COMPLETE_ALL;
	aboutmyself = MYSELF;
	skip = SKIP;
	next = NEXT;
	otherss = OTHERS;
	trueOrnOt;
	userid = Id;
	propertyProcessedMap = {};
	storefifthId;
	idoFfORU;
	storeid5;
	knowTheUnchecked;
	fourthCheck;
	knowSixthChecked;
	toShowSixth;
	sixthCheckedArray = [];
	filteredArray = [];
	fe;
	isEqualLength = false;
	filterArr = '';
	popupmenu = false;
	theLab = '';
	checkedboleaan;
	uncheckedBoolean;
	urlq;
	questionData = [];
	handleResizeBound;
	fifthquestion1 = FIFTH_QUESTION;
	sixthquestion1 = SIXTH_QUESTION;

	answerquestion = 0;
	lessthanamonth = LESSTHAN_A_MONTH;
	lessthan6months = SIXMONTHS;
	lessthanyear = LESS_THAN_YEAR;
	morethanyear = MORE_THAN_YEAR;
	male = MALE;
	female = FEMALE;
	other = OTHER;
	prefernot = PREFERNOT_TOSAY;
	yes = YES;
	no = NO;
	relationshipwithff = RELATIONSHIPWITH_FF;
	relationshipwithpartner = RELATIONSHIPWITH_PARTNER;
	selfesteem = SELF_ESTEEM;
	selectall = SELECT_ALL;

	others = OTHERS;
	asthma = ASTHMA;
	diabetes = DIABETESMELLITUS;
	depression = DEPRESSION;
	hayFever = HAY_FEVER;
	hypertension = HYPERTENSION;
	highcholestrol = HIGHCHOLESTEROL;
	obesityc = OBESITY;
	osteoporosisc = OSTEOPOROSIS;
	ulcer = ULCER;
	psoriasis = PSORIASIS;
	psoriaticarthritis = PSORIATICARTHRITIS;
	introduction = INTRODUCTION_CATEGORY;

	doyouagree = DO_YOU_AGREE;
	maybe = MAYBE;

	answered = ANSWERED;
	submit = SUBMIT;
	outstandingque = OUTSTANDING_QUESTIONNAIRE;
	returnbackc = RETURN_BACK;

	confirmsub = CONFIRM_SUBMISSION;
	cannotedit = CANNOT_BE_EDITED;
	cancelbt = CANCEL;
	confirmbt = CONFIRM;

	checPrevoiusVal;
	unCheckedResVal;
	uncheckedArray = [];
	fifthWithoudNewVals;
	uncheckVar;

	sixthDraftVal;
	sixthUncheckedVals;
	sixthUnchekedArray = [];
	checkedResVal;

	firstQResForEach = '';
	firstQVersionResForEach = '';

	secQResForEach = '';
	secQVersionResForEach = '';

	thirdQResForEach = '';
	thirdQVersionResForEach = '';

	fourQResForEach = '';
	fourQVersionResForEach = '';

	fifthQResForEach = '';
	fifthQVersionResForEach = '';
	sixthQResForEach = '';
	sixthQVersionResForEach = '';

	//Below defined getter method to determine the CSS class for the  popup container based on its visibility
	get popupClass() {
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}

	get popupClassSaveDraft() {
		return this.isDraftSavedPopupOpen
			? 'popup-containersaveasdr'
			: '.popup-containersaveasdr hidden';
	}

	get popupClass1() {
		return this.isPopupOpen1 ? 'popup2-container' : 'popup2-container hidden';
	}

	// Method to hide both main and secondary popups
	customHideModalPopup() {
		this.customFormModal = false;
		this.isPopupOpen = false;
		this.isPopupOpen1 = false;
	}

	//to check whether the page is in Brandd or unassigned.Also to check the desktop view
	renderedCallback() {
		try {

			let currentURL = window.location.href;

			let urlObject = new URL(currentURL);

			let path = urlObject.pathname;

			let pathComponents = path.split('/');

			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL_NAVI.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent && desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL;
			} else {
				this.urlq = UNASSIGNED_URL_NAVI;
			}

			this.isDesktop = this.isDesktopView();


			// Bind the event handler once and store it in a variable
			this.handleResizeBound = this.handleResize.bind(this);

			// Add the event listener using the bound handler
			window.addEventListener('resize', this.handleResizeBound);

			// Null data is checked and AuraHandledException is thrown from the Apex
			GET_ENROLLEE()
				.then(result => {
					if (result !== null) {
						if (result[0] !== null) {
							this.cpeId = result[0];

							// this.fetchEvents();                       
						} else if (result[0].error !== null) {
							this.showError = true;
							this.errorMessage = result[0].error;
						}
					}
				})
				.catch(error => {
					// Handle the error
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});


		} catch (error) {
			// Handle the error
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}


	disconnectedCallback() {
		// Remove the resize event listener when the component is disconnected
		window.removeEventListener('resize', this.handleResizeBound);

	}

	handleResize() {
		// Handle the resize event by updating the isDesktop property
		this.isDesktop = this.isDesktopView();
	}

	isDesktopView() {
		let globalThis = window;
		let viewportWidth = globalThis.innerWidth;
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


	// Wire adapter to fetch patient data after three months and fourteen weeks
	@wire(GET_PATIENT_AFTER_THREE_MONTHS_AND_FOURTEEN_WEEKS)
	wiredResult({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				// Assign fetched data to component properties
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.targetDate2 = data.targetDate2 ?? null;
				this.targetDate14 = data.targetDate14 ?? null;
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}

	// Wire adapter to count assessment responses
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				// Assign fetched data to component properties
				this.count = data;

				if (this.count.length > 0) {
					// Assign count values to component properties
					this.stwai = this.count[0];
					this.stpss = this.count[1];
					this.stdlq = this.count[2];
					this.stqsq = this.count[3];
				}
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}

	//below are  Getter methods to determine if dlqi ,pss,wapi check is enabled
	get checkdlqi() {
		return this.stdlq > 0 ? 'disabled' : '';
	}

	get checkpss() {
		return this.stpss > 0 ? 'disabled' : '';
	}

	get checkwai() {
		return this.stwai > 0 ? 'disabled' : '';
	}

	// Getter method to determine if qsq check is enabled
	get checkqsq() {
		if (this.targetDate14 === null && this.targetDate2 === null) {
			return 'disabled';
		} else if (this.stqsq > 0) {
			return 'disabled';
		}
		return '';
	}

	// Wire adapter to fetch draft responses of introduction
	@wire(DRAFT_RESPONSE_OF_INTRODUCTION, { questCatgryName: '$introduction', twoMonths: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.records = data;
				this.answerquestion = this.records.length;
				this.draftResponsesforlater();

				this.sixthresponsetruefalse = this.records[4].ResponseText === this.no;

				// Loop through each record to check conditions
				this.records.forEach((record) => {
					if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === this.yes
					) {
						this.countQuestion = 16;
						this.answerquestion = this.records.length;
					} else if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === this.no
					) {
						this.answerquestion = this.records.length;
					}
				});

				// Check if the answer question count exceeds a certain threshold
				if (this.answerquestion > this.countQuestion) {
					this.countQuestion = 16;
				}
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}
	//this method is for storing the draft response and its version id so that we can use these variables to save the draft response later ,also in this method we will be making the radio buttons as checked if the draft values matches with the values that are stored in to variables with their respective radio option values.

	draftResponsesforlater() {
		const responseMappings = {
			2: this.handleSecondQuestionResponse,
			1: this.handleFirstQuestionResponse,
			4: this.handleFourthQuestionResponse,
			6: this.handleSixthQuestionResponse,
			3: this.handleThirdQuestionResponse,
			5: this.handleFifthQuestionResponse,
			7: this.handleSeventhQuestionResponse,
			9: this.handleNinthQuestionResponse,
			8: this.handleEighthQuestionResponse,
			10: this.handleTenthQuestionResponse,
			11: this.handleEleventhQuestionResponse,
			12: this.handleTwelfthQuestionResponse,
			13: this.handleThirteenthQuestionResponse,
			14: this.handleFourteenthQuestionResponse,
			15: this.handleFifteenthQuestionResponse,
			16: this.handleSixteenthQuestionResponse
		};

		this.records.forEach((record) => {
			const handler = responseMappings[record.BI_PSP_ResponseOrder__c];
			if (handler) {
				handler.call(this, record);
			}
		});
	}

	handleSixthQuestionResponse(record) {
		const conditionMapping = {
			"Asthma": "tenthCheckAsthma",
			"Diabetes mellitus": "tenthCheckDiabetes",
			"Depression": "tenthCheckDepression",
			"Hay fever / Allergic conditions": "tenthCheckHayFever",
			"High blood pressure / Hypertension": "tenthCheckBp",
			"High Cholesterol": "tenthCheckHighChol",
			"Obesity": "tenthCheckObesity",
			"Osteoporosis": "tenthCheckOsteo",
			"Peptic ulcer / Gastric ulcer": "tenthCheckPeptic",
			"Plaque psoriasis": "tenthCheckplaque",
			"Psoriatic arthritis": "tenthCheckpsoriatic",
			"Others": "tenthCheckOthers"
		};

		Object.entries(conditionMapping).forEach(([key, value]) => {
			if (record.ResponseValue.includes(key) && record.AssessmentQuestion.Id) {
				this[value] = true;
				this.sixthQResForEach = record.ResponseValue;
				this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
			}
		});
	}

	// The other handler functions remain unchanged
	handleSecondQuestionResponse(record) {
		const targetFemale = this.female;
		const targetMale = this.male;
		const targetOther = this.other;
		const prefferNotTosay = this.prefernot;

		if (record.ResponseValue === targetFemale && record.AssessmentQuestion.Id) {
			this.secQResForEach = record.ResponseValue;
			this.secQVersionResForEach = record.AssessmentQuestion.Id;
			this.isFemale = true;
		}
		if (record.ResponseValue === targetMale && record.AssessmentQuestion.Id) {
			this.isMale = true;
			this.secQResForEach = record.ResponseValue;
			this.secQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === targetOther && record.AssessmentQuestion.Id) {
			this.secQResForEach = record.ResponseValue;
			this.secQVersionResForEach = record.AssessmentQuestion.Id;
			this.isOther = true;
		}
		if (record.ResponseValue === prefferNotTosay && record.AssessmentQuestion.Id) {
			this.iSPrefferNotToSay = true;
			this.secQVersionResForEach = record.AssessmentQuestion.Id;
			this.secQResForEach = record.ResponseValue;
		}
	}

	handleFirstQuestionResponse(record) {
		const firstLessThanMonth = this.lessthanamonth;
		const firstLessThanSix = this.lessthan6months;
		const firstLessThanYr = this.lessthanyear;
		const firstMoreThan = this.morethanyear;

		if (record.ResponseValue === firstLessThanMonth && record.AssessmentQuestion.Id) {
			this.firstQResForEach = record.ResponseValue;
			this.firstQVersionResForEach = record.AssessmentQuestion.Id;
			this.isFirstLessThanMonth = true;
		}
		if (record.ResponseValue === firstLessThanSix && record.AssessmentQuestion.Id) {
			this.firstQResForEach = record.ResponseValue;
			this.firstQVersionResForEach = record.AssessmentQuestion.Id;
			this.isFirstLessSix = true;
		}
		if (record.ResponseValue === firstLessThanYr && record.AssessmentQuestion.Id) {
			this.firstQResForEach = record.ResponseValue;
			this.firstQVersionResForEach = record.AssessmentQuestion.Id;
			this.isFirstLessYear = true;
		}
		if (record.ResponseValue === firstMoreThan && record.AssessmentQuestion.Id) {
			this.firstQResForEach = record.ResponseValue;
			this.firstQVersionResForEach = record.AssessmentQuestion.Id;
			this.isFirstMoreYear = true;
		}
	}

	handleFourthQuestionResponse(record) {
		const thirdAnswerRF = this.relationshipwithff;
		const thirdRWP = this.relationshipwithpartner;
		const thirdSelEstee = this.selfesteem;

		if (record.ResponseValue.includes(thirdAnswerRF) && record.AssessmentQuestion.Id) {
			this.fourthCheckRelatFam = true;
			this.fourQResForEach = record.ResponseValue;
			this.fourQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue.includes(thirdRWP) && record.AssessmentQuestion.Id) {
			this.fourthCheckWithPartner = true;
			this.fourQResForEach = record.ResponseValue;
			this.fourQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue.includes(thirdSelEstee) && record.AssessmentQuestion.Id) {
			this.fourthCheckSelfEsteem = true;
			this.fourQResForEach = record.ResponseValue;
			this.fourQVersionResForEach = record.AssessmentQuestion.Id;
		}
	}

	handleThirdQuestionResponse(record) {
		const thirdYes = this.yes;
		const thirdNo = this.no;

		if (record.ResponseValue === thirdYes && record.AssessmentQuestion.Id) {
			this.thirdQResForEach = record.ResponseValue;
			this.thirdQVersionResForEach = record.AssessmentQuestion.Id;
			this.thirdIsYes = true;
		}
		if (record.ResponseValue === thirdNo && record.AssessmentQuestion.Id) {
			this.thirdQResForEach = record.ResponseValue;
			this.thirdQVersionResForEach = record.AssessmentQuestion.Id;
			this.thirdIsNo = true;
		}
	}

	handleFifthQuestionResponse(record) {
		const seventhYes = this.yes;
		const seventhNo = this.no;

		if (record.ResponseValue === seventhYes && record.AssessmentQuestion.Id) {
			this.fifthQResForEach = record.ResponseValue;
			this.fifthQVersionResForEach = record.AssessmentQuestion.Id;
			this.fifthRadYes = true;
			this.sixthQuestionVisible = this.fifthQResForEach === this.yes;
		}
		if (record.ResponseValue === seventhNo && record.AssessmentQuestion.Id) {
			this.fifthRadNo = true;
			this.fifthQResForEach = record.ResponseValue;
			this.fifthQVersionResForEach = record.AssessmentQuestion.Id;
			if (this.fifthQResForEach === this.no) {
				this.sixthQResForEach = '';
				this.sixthQVersionResForEach = '';
			}
		}
	}

	handleSeventhQuestionResponse(record) {
		const eigthYes = this.yes;
		const eigthNo = this.no;
		const eigthMaybe = this.maybe;

		if (record.ResponseValue === eigthYes && record.AssessmentQuestion.Id) {
			this.sevenQResForEach = record.ResponseValue;
			if (this.sevenQResForEach !== null) {
				this.afterSixthRadYes = true;
			}
			this.sevenQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === eigthNo && record.AssessmentQuestion.Id) {
			this.sevenQResForEach = record.ResponseValue;
			this.sevenQVersionResForEach = record.AssessmentQuestion.Id;
			this.afterSixthRadNo = true;
		}
		if (record.ResponseValue === eigthMaybe && record.AssessmentQuestion.Id) {
			this.sevenQResForEach = record.ResponseValue;
			this.sevenQVersionResForEach = record.AssessmentQuestion.Id;
			this.afterSixthRadMaybe = true;
		}
	}

	handleNinthQuestionResponse(record) {
		const ninthYes = this.yes;
		const ninthNo = this.no;
		const ninthMaybe = this.maybe;

		if (record.ResponseValue === ninthYes && record.AssessmentQuestion.Id) {
			this.eigthQResForEach = record.ResponseValue;
			this.eigthQVersionResForEach = record.AssessmentQuestion.Id;
			this.sixthRadYes = true;
		}
		if (record.ResponseValue === ninthNo && record.AssessmentQuestion.Id) {
			this.eigthQResForEach = record.ResponseValue;
			this.eigthQVersionResForEach = record.AssessmentQuestion.Id;
			this.sixthRadNo = true;
		}
		if (record.ResponseValue === ninthMaybe && record.AssessmentQuestion.Id) {
			this.eigthQResForEach = record.ResponseValue;
			this.eigthQVersionResForEach = record.AssessmentQuestion.Id;
			this.sixthRadMayBe = true;
		}
	}

	handleEighthQuestionResponse(record) {
		const tenthYes = this.yes;
		const tenthNo = this.no;
		const tenthMaybe = this.maybe;

		if (record.ResponseValue === tenthYes && record.AssessmentQuestion.Id) {
			this.nineQResForEach = record.ResponseValue;
			this.nineQVersionResForEach = record.AssessmentQuestion.Id;
			this.eleventhRadYes = true;
		}
		if (record.ResponseValue === tenthNo && record.AssessmentQuestion.Id) {
			this.eleventhRadNo = true;
			this.nineQResForEach = record.ResponseValue;
			this.nineQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === tenthMaybe && record.AssessmentQuestion.Id) {
			this.nineQResForEach = record.ResponseValue;
			this.nineQVersionResForEach = record.AssessmentQuestion.Id;
			this.eleventhRadMaybe = true;
		}
	}

	handleTenthQuestionResponse(record) {
		const eleventhYes = this.yes;
		const eleventhNo = this.no;
		const eleventhMaybe = this.maybe;

		if (record.ResponseValue === eleventhYes && record.AssessmentQuestion.Id) {
			this.tenthQResForEach = record.ResponseValue;
			this.tenthQVersionResForEach = record.AssessmentQuestion.Id;
			this.secondRadYes = true;
		}
		if (record.ResponseValue === eleventhNo && record.AssessmentQuestion.Id) {
			this.secondRadNo = true;
			this.tenthQResForEach = record.ResponseValue;
			this.tenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === eleventhMaybe && record.AssessmentQuestion.Id) {
			this.secondRadMaybe = true;
			this.tenthQResForEach = record.ResponseValue;
			this.tenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
	}

	handleEleventhQuestionResponse(record) {
		const twelthYes = this.yes;
		const twelthNo = this.no;
		const twelthMaybe = this.maybe;

		if (record.ResponseValue === twelthYes && record.AssessmentQuestion.Id) {
			this.eleventhQResForEach = record.ResponseValue;
			this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;
			this.thirdRadYes = true;
		}
		if (record.ResponseValue === twelthNo && record.AssessmentQuestion.Id) {
			this.thirdRadNo = true;
			this.eleventhQResForEach = record.ResponseValue;
			this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === twelthMaybe && record.AssessmentQuestion.Id) {
			this.thirdRadMaybe = true;
			this.eleventhQResForEach = record.ResponseValue;
			this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;
		}
	}

	handleTwelfthQuestionResponse(record) {
		const thirteenthYes = this.yes;
		const thirteenthNo = this.no;
		const thirteenthMaybe = this.maybe;

		if (record.ResponseValue === thirteenthYes && record.AssessmentQuestion.Id) {
			this.twelthQResForEach = record.ResponseValue;
			this.twelthQVersionResForEach = record.AssessmentQuestion.Id;
			this.fourthRadYes = true;
		}
		if (record.ResponseValue === thirteenthNo && record.AssessmentQuestion.Id) {
			this.fourthRadNo = true;
			this.twelthQResForEach = record.ResponseValue;
			this.twelthQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === thirteenthMaybe && record.AssessmentQuestion.Id) {
			this.fourthRadMaybe = true;
			this.twelthQResForEach = record.ResponseValue;
			this.twelthQVersionResForEach = record.AssessmentQuestion.Id;
		}
	}

	handleThirteenthQuestionResponse(record) {
		const fourteenthYes = this.yes;
		const fourteenthNo = this.no;
		const fourteenthMaybe = this.maybe;

		if (record.ResponseValue === fourteenthYes && record.AssessmentQuestion.Id) {
			this.thirteenthQResForEach = record.ResponseValue;
			this.thirteenthQVersionResForEach = record.AssessmentQuestion.Id;
			this.seventhRadYes = true;
		}
		if (record.ResponseValue === fourteenthNo && record.AssessmentQuestion.Id) {
			this.seventhRadNo = true;
			this.thirteenthQResForEach = record.ResponseValue;
			this.thirteenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === fourteenthMaybe && record.AssessmentQuestion.Id) {
			this.seventhRadMaybe = true;
			this.thirteenthQResForEach = record.ResponseValue;
			this.thirteenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
	}

	handleFourteenthQuestionResponse(record) {
		const fifteenthYes = this.yes;
		const fifteenthNo = this.no;
		const fifteenthMaybe = this.maybe;

		if (record.ResponseValue === fifteenthYes && record.AssessmentQuestion.Id) {
			this.fourteenthQResForEach = record.ResponseValue;
			this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
			this.twelthRadYes = true;
		}
		if (record.ResponseValue === fifteenthNo && record.AssessmentQuestion.Id) {
			this.twelthRadNo = true;
			this.fourteenthQResForEach = record.ResponseValue;
			this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === fifteenthMaybe && record.AssessmentQuestion.Id) {
			this.twelthRadMaybe = true;
			this.fourteenthQResForEach = record.ResponseValue;
			this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
	}

	handleFifteenthQuestionResponse(record) {
		const sixteenthYes = this.yes;
		const sixteenthNo = this.no;
		const sixteenthMaybe = this.maybe;

		if (record.ResponseValue === sixteenthYes && record.AssessmentQuestion.Id) {
			this.fifteenthQResForEach = record.ResponseValue;
			this.fifteenthQVersionResForEach = record.AssessmentQuestion.Id;
			this.thirteenththRadYes = true;
		}
		if (record.ResponseValue === sixteenthNo && record.AssessmentQuestion.Id) {
			this.thirteenththRadNo = true;
			this.fifteenthQResForEach = record.ResponseValue;
			this.fifteenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === sixteenthMaybe && record.AssessmentQuestion.Id) {
			this.thirteenththRadMaybe = true;
			this.fifteenthQResForEach = record.ResponseValue;
			this.fifteenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
	}

	handleSixteenthQuestionResponse(record) {
		const seventeethYes = this.yes;
		const seventeethNo = this.no;
		const seventeethMaybe = this.maybe;

		if (record.ResponseValue === seventeethYes && record.AssessmentQuestion.Id) {
			this.sixteenthQResForEach = record.ResponseValue;
			this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;
			this.forteenththRadYes = true;
		}
		if (record.ResponseValue === seventeethNo && record.AssessmentQuestion.Id) {
			this.forteenthRadNo = true;
			this.sixteenthQResForEach = record.ResponseValue;
			this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
		if (record.ResponseValue === seventeethMaybe && record.AssessmentQuestion.Id) {
			this.forteenthRadMaybe = true;
			this.sixteenthQResForEach = record.ResponseValue;
			this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;
		}
	}


	//this wire method is for retrieving the introduction Questions and storing them to different variables one by one
	@wire(INTRODUCTION_QUESTIONARE, { questionnaireName: '$introduction' })
	wiredAssessmentQuestion({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.questionData = data.map((question) => ({
					id: question.Id,
					questionText: question.QuestionText ? question.QuestionText : null,
					activeVersionId: question.ActiveVersion
						? question.ActiveVersion.Id
						: null
				}));
				//the below set of varibales holds the Questions of introduction Questionnaire
				let firstQuestion = this.questionData[0];
				let secondQuestion = this.questionData[1];
				let thirdQuestion = this.questionData[2];
				let fourthQuestion = this.questionData[3];
				let FifthQuestion = this.questionData[4];
				let SixthQuestion = this.questionData[5];
				let SeventhQuestion = this.questionData[6];
				let EighthQuestion = this.questionData[7];
				let NinthQuestion = this.questionData[8];
				let TenthQuestion = this.questionData[9];
				let EleventhQuestion = this.questionData[10];
				let TwelthQuestion = this.questionData[11];
				let ThirteenthQuestion = this.questionData[12];
				let FourteenthQuestion = this.questionData[13];
				let FifteenththQuestion = this.questionData[14];
				let SixteenthQuestion = this.questionData[15];

				this.firstQuestionText = firstQuestion.questionText;

				this.firstQuestionVersinId = firstQuestion.activeVersionId;

				this.secondQuestionText = secondQuestion.questionText;

				this.secondQuestionVersinId = secondQuestion.activeVersionId;

				this.thirdQuestionText = thirdQuestion.questionText;

				this.thirdQuestionVersinId = thirdQuestion.activeVersionId;

				this.fourthQuestionText = fourthQuestion.questionText;

				this.fourthQuestionVersinId = fourthQuestion.activeVersionId;

				this.fifthQuestionText = FifthQuestion.questionText;

				this.fifthQuestionVersinId = FifthQuestion.activeVersionId;

				this.sixthQuestionText = SixthQuestion.questionText;

				this.sixthQuestionVersinId = SixthQuestion.activeVersionId;

				this.seventhQuestionText = SeventhQuestion.questionText;

				this.seventhQuestionVersinId = SeventhQuestion.activeVersionId;

				this.eightQuestionText = EighthQuestion.questionText;

				this.eightQuestionVersinId = EighthQuestion.activeVersionId;

				this.ninthQuestionText = NinthQuestion.questionText;

				this.ninthQuestionVersinId = NinthQuestion.activeVersionId;

				this.tenthQuestionText = TenthQuestion.questionText;

				this.tenthQuestionVersinId = TenthQuestion.activeVersionId;

				this.eleventhQuestionText = EleventhQuestion.questionText;
				this.eleventhQuestionVersinId = EleventhQuestion.activeVersionId;

				this.twelthQuestionText = TwelthQuestion.questionText;

				this.twelthQuestionVersinId = TwelthQuestion.activeVersionId;

				this.thirteeenthQuestionText = ThirteenthQuestion.questionText;

				this.thirteeenthQuestionVersinId = ThirteenthQuestion.activeVersionId;

				this.foteenthQuestionText = FourteenthQuestion.questionText;

				this.foteenthQuestionVersinId = FourteenthQuestion.activeVersionId;

				this.fifteenthQuestionText = FifteenththQuestion.questionText;

				this.fifteenthQuestionVersinId = FifteenththQuestion.activeVersionId;
				this.sixteenthQuestionText = SixteenthQuestion.questionText;
				this.sixteenthQuestionVersinId = SixteenthQuestion.activeVersionId;
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}

	getLastItem(array) {
		return array.length > 0 ? array[array.length - 1] : null;
	}
	//valid
	//below are the handlers that handles the resposnes from user input(16 hhandlers)
	handleFirstQuestionChange(event) {
		let chekVal = event.target.value;
		if (chekVal === this.lessthanamonth) {
			this.isFirstLessThanMonth = true;
		} else {
			this.isFirstLessThanMonth = false;
		}

		if (chekVal === this.lessthan6months) {
			this.isFirstLessSix = true;
		} else {
			this.isFirstLessSix = false;
		}

		if (chekVal === this.lessthanyear) {
			this.isFirstLessYear = true;
		} else {
			this.isFirstLessYear = false;
		}

		if (chekVal === this.morethanyear) {
			this.isFirstMoreYear = true;
		} else {
			this.isFirstMoreYear = false;
		}

		this.firstQuestionResponse = event.target.value;

		//pushes the responses and version ids to arrays
		this.arrayForPushResp.push(this.firstQuestionResponse);
		this.arrayForPushId.push(this.firstQuestionVersinId);

		this.firstRspValue = this.getLastItem(this.arrayForPushResp);
		this.firstRespVersId = this.getLastItem(this.arrayForPushId);

	}

	//valid
	handleSecondQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.male) {
			this.isMale = true;
		} else {
			this.isMale = false;
		}

		if (checkedVal === this.female) {
			this.isFemale = true;
		} else {
			this.isFemale = false;
		}

		if (checkedVal === this.other) {
			this.isOther = true;
		} else {
			this.isOther = false;
		}

		if (checkedVal === this.prefernot) {
			this.iSPrefferNotToSay = true;
		} else {
			this.iSPrefferNotToSay = false;
		}

		this.secondQuestionResponse = event.target.value;
		this.arrayForPushResp.push(this.secondQuestionResponse);
		this.arrayForPushId.push(this.secondQuestionVersinId);
		// Get the last response value
		this.secondRspValue = this.getLastItem(this.arrayForPushResp);
		// Get the last response version id
		this.secondRespVersId = this.getLastItem(this.arrayForPushId);

	}


	//valid
	//this handler handles the user input
	handlethirdQuestionChange(event) {
		let checkedval = event.target.value;
		if (checkedval === this.yes) {
			this.thirdIsYes = true;
		} else {
			this.thirdIsYes = false;
		}

		if (checkedval === this.no) {
			this.thirdIsNo = true;
		} else {
			this.thirdIsNo = false;
		}

		this.thirdQuestionResponse = event.target.value;
		this.arrayForPushResp.push(this.thirdQuestionResponse);
		this.arrayForPushId.push(this.thirdQuestionVersinId);
		// Get the last values separately
		this.thirdRspValue = this.getLastItem(this.arrayForPushResp);
		this.thirdVersionId = this.getLastItem(this.arrayForPushId);

	}


	//valid
	handleSixthQuestionchange(event) {
		this.sixthDraftVal = this.sixthQResForEach;
		let checkBoval = event.target.checked;

		if (checkBoval) {
			this.processCheckedValue(event.target.value);
		} else {
			this.processUncheckedValue(event.target.value);
		}

		this.sixthQuestionResponse = event.target.value;

		this.arrayForPushResp.push(this.sixthQuestionResponse);
		this.arrayForPushId.push(this.sixthQuestionVersinId);
		this.selectMedic.push(this.sixthQuestionResponse);

		// Get the last values separately
		this.sixthResponseValue = this.getLastItem(this.arrayForPushResp);
		this.sixthVersiD = this.getLastItem(this.arrayForPushId);

		if (typeof this.sixthQResForEach !== 'undefined' && this.filterArr === '') {
			let qResArray = this.sixthQResForEach.split(',');
			this.filteredArray = qResArray.filter((value) => value.trim() !== '');

			if (this.filteredArray && this.filteredArray.length > 0) {
				// Add elements of filteredArray to sixthCheckedArray
				this.sixthCheckedArray = [
					...this.sixthCheckedArray,
					...this.filteredArray
				];
			}
		}

		// Checking that the sixth checked and unchecked array has the same count or not to make a decision on showing popup message later.
		let uniqueUnchekedArray = Array.from(new Set(this.sixthUnchekedArray));
		this.uniqueUncheckedCount = uniqueUnchekedArray.length;

		let uniqueCheckedArray = Array.from(new Set(this.sixthCheckedArray));
		this.uniqueCheckedCount = uniqueCheckedArray.length;

		this.isEqualLength = (this.uniqueUncheckedCount === this.uniqueCheckedCount);
	}

	processCheckedValue(vals) {
		this.uncheckedBoolean = true;
		this.knowSixthChecked = true;
		this.sixthCheckedArray.push(vals);

		switch (vals) {
			case this.asthma:
				this.tenthCheckAsthma = true;
				break;
			case this.diabetes:
				this.tenthCheckDiabetes = true;
				break;
			case this.depression:
				this.tenthCheckDepression = true;
				break;
			case this.hayFever:
				this.tenthCheckHayFever = true;
				break;
			case this.hypertension:
				this.tenthCheckBp = true;
				break;
			case this.highcholestrol:
				this.tenthCheckHighChol = true;
				break;
			case this.obesityc:
				this.tenthCheckObesity = true;
				break;
			case this.osteoporosisc:
				this.tenthCheckOsteo = true;
				break;
			case this.ulcer:
				this.tenthCheckPeptic = true;
				break;
			case this.psoriasis:
				this.tenthCheckplaque = true;
				break;
			case this.psoriaticarthritis:
				this.tenthCheckpsoriatic = true;
				break;
			case this.others:
				this.tenthCheckOthers = true;
				break;
			default:
				break;
		}
	}

	processUncheckedValue(jos) {
		this.uncheckedBoolean = true;
		this.knowSixthChecked = false;
		this.uncheckVar = this.yes;
		this.sixthUncheckedVals = jos;
		this.sixthUnchekedArray.push(jos);

		switch (jos) {
			case this.asthma:
				this.tenthCheckAsthma = false;
				break;
			case this.diabetes:
				this.tenthCheckDiabetes = false;
				break;
			case this.depression:
				this.tenthCheckDepression = false;
				break;
			case this.hayFever:
				this.tenthCheckHayFever = false;
				break;
			case this.hypertension:
				this.tenthCheckBp = false;
				break;
			case this.highcholestrol:
				this.tenthCheckHighChol = false;
				break;
			case this.obesityc:
				this.tenthCheckObesity = false;
				break;
			case this.osteoporosisc:
				this.tenthCheckOsteo = false;
				break;
			case this.ulcer:
				this.tenthCheckPeptic = false;
				break;
			case this.psoriasis:
				this.tenthCheckplaque = false;
				break;
			case this.psoriaticarthritis:
				this.tenthCheckpsoriatic = false;
				break;
			case this.others:
				this.tenthCheckOthers = false;
				break;
			default:
				break;
		}
	}

	//valid
	handleFifthQuestionChange(event) {
		this.sixthQuestionVisible = event.target.value === this.yes;
		this.fifthQuestionresponse = event.target.value;
		this.arrayForPushResp.push(this.fifthQuestionresponse);
		this.arrayForPushId.push(this.fifthQuestionVersinId);

		this.fifthResonseValue = this.getLastItem(this.arrayForPushResp);

		this.fifthVersionId = this.getLastItem(this.arrayForPushId);

		let val = event.target.value;
		//if the value of the fifth Question is yes then total number of question will be 16 otherwise 15.
		if (val === this.yes) {
			this.fifthRadYes = true;
			this.fifthRadNo = false;
			this.countQuestion = 16;
			this.customClass = 'nds-form-element nds-form-containertwo';
		}

		if (val === this.no) {
			this.fifthRadNo = true;
			this.fifthRadYes = false;
			this.sixthQuestionVisible = false;
			this.customClass = 'nds-form-element nds-form-containerthree';
			this.sixthQResForEach = '';
			this.sixthQVersionResForEach = '';
			//if the response value is No then we will delete the repsones of sixth Questions and also make the checkboxes as unchecked.
			let fifthIdStore = this.storeid5;
			DELETE_SELECTED_RESPONSE({ idOfRes: fifthIdStore })
				.then(() => {
					this.tenthCheckAsthma = false;
					this.tenthCheckDiabetes = false;
					this.tenthCheckDepression = false;
					this.tenthCheckHayFever = false;
					this.tenthCheckBp = false;
					this.tenthCheckHighChol = false;
					this.tenthCheckObesity = false;
					this.tenthCheckOsteo = false;
					this.tenthCheckPeptic = false;
					this.tenthCheckplaque = false;
					this.tenthCheckpsoriatic = false;
					this.tenthCheckOthers = false;

					this.sixthQResForEach = '';
					this.sixthQVersionResForEach = '';
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
				});
			this.countQuestion = 15;
		}
	}


	//valid
	handleFourthQuestionChange(event) {
		this.checPrevoiusVal = this.fourQResForEach;

		let checkval = event.target.value;

		if (checkval === this.relationshipwithff) {
			this.fourthCheckRelatFam = true;
		}

		if (checkval === this.relationshipwithpartner) {
			this.fourthCheckWithPartner = true;
		}

		if (checkval === this.selfesteem) {
			this.fourthCheckSelfEsteem = true;
		}

		let checkBoval = event.target.checked;

		if (checkBoval) {
			this.fourthCheck = this.yes;
		} else {
			this.unCheckedResVal = event.target.value;
			this.uncheckedArray.push(this.unCheckedResVal);

			let unchVal = event.target.value;

			this.knowTheUnchecked = this.yes;
			if (unchVal === this.relationshipwithff) {
				this.fourthCheckRelatFam = false;
			}

			if (unchVal === this.relationshipwithpartner) {
				this.fourthCheckWithPartner = false;
			}

			if (unchVal === this.selfesteem) {
				this.fourthCheckSelfEsteem = false;
			}
		}

		this.fourthQuestionResponse = event.target.value;
		if (this.fourthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourthQuestionResponse);
			this.arrayForPushId.push(this.fourthQuestionVersinId);
			this.totalValu.push(this.fourthQuestionResponse);
		}

		this.fourthRspValue = this.getLastItem(this.arrayForPushResp);
		this.fourthVersionId = this.getLastItem(this.arrayForPushId);
	}


	resetTheValues() {
		this.template.querySelectorAll('input').forEach((el) => {
			const name = el.name;
			const value = el.value;

			switch (name) {
				case 'firstQuestionResponse':
					this.setFirstQuestionResponse(el, value);
					break;
				case 'secondQuestionResponse':
					this.setSecondQuestionResponse(el, value);
					break;
				case 'thirdQuestionRespo':
					this.setThirdQuestionResponse(el, value);
					break;
				case 'NinthQuestionResponse':
					this.setNinthQuestionResponse(el, value);
					break;
				case 'fourthQuestionResponse':
					this.setFourthQuestionResponse(el, value);
					break;
				case 'tenthQuestionResponse':
					this.setTenthQuestionResponse(el, value);
					break;
				default:
					// Default case if needed
					break;
			}
		});
	}

	setFirstQuestionResponse(el, value) {
		if ((value === "Less than a month" && this.state.isFirstLessThanMonth) ||
			(value === "Less than 6 months" && this.state.isFirstLessSix) ||
			(value === "Less than a year" && this.state.isFirstLessYear) ||
			(value === "More than a year" && this.state.isFirstMoreYear)) {
			el.checked = true;
		}
	}

	setSecondQuestionResponse(el, value) {
		if (value === this.state.secondQuestionResponse) {
			el.checked = true;
		}
	}

	setThirdQuestionResponse(el, value) {
		if (value === this.state.thirdQuestionResponse) {
			el.checked = true;
		}
	}

	setNinthQuestionResponse(el, value) {
		if (value === this.state.fifthQuestionresponse) {
			el.checked = true;
		}
	}

	setFourthQuestionResponse(el, value) {
		if ((value === "Relationships with friends and family" && this.state.fourthCheckRelatFam) ||
			(value === "Relationship with Partner" && this.state.fourthCheckWithPartner) ||
			(value === "Self Esteem" && this.state.fourthCheckSelfEsteem)) {
			el.checked = true;
		}
	}

	setTenthQuestionResponse(el, value) {
		const conditionMapping = {
			"Asthma": this.state.tenthCheckAsthma,
			"Diabetes mellitus": this.state.tenthCheckDiabetes,
			"Depression": this.state.tenthCheckDepression,
			"Hay fever / Allergic conditions": this.state.tenthCheckHayFever,
			"High blood pressure / Hypertension": this.state.tenthCheckBp,
			"High Cholesterol": this.state.tenthCheckHighChol,
			"Obesity": this.state.tenthCheckObesity,
			"Osteoporosis": this.state.tenthCheckOsteo,
			"Peptic ulcer / Gastric ulcer": this.state.tenthCheckPeptic,
			"Plaque psoriasis": this.state.tenthCheckplaque,
			"Psoriatic arthritis": this.state.tenthCheckpsoriatic,
			"Others": this.state.tenthCheckOthers
		};

		if (conditionMapping[value]) {
			el.checked = true;
		}
	}

	//When clicked on Return back to Question buttton.This will close the popup and show you the page with all the previous response selection just before clicking the button.
	closePopup1() {
		if (this.isEqualLength === true) {
			this.sixthCheckedArray = [];

			this.sixthUnchekedArray = [];

			this.filteredArray = [];
			this.filterArr = 'true';
		}

		this.customFormModal = false;
		document.body.style.overflow = '';
		this.isPopupOpen1 = false;
		this.isPopupOpen1 = false;
		this.popupmenu = false;
		// Update input elements based on the state object
		this.resetTheValues();

	}
	//When clicked on cancelbuttton.This will close the popup and show you the page with 
	//all the previous responses just before clicking the button.
	closePopup() {
		this.customFormModal = false;
		document.body.style.overflow = '';

		this.isPopupOpen = false;
		this.isPopupOpen1 = false;
		this.popupmenu = false;

		this.resetTheValues();


	}

	//On click the PAGE will become static then it will show you the popup based on the criteria that gets matched.
	submitResponses() {
		if (this.isDesktop) {
			//this will make the page as static
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		const allInputs = this.template.querySelectorAll('input[type="radio"]:checked');
		const fifthQuestionChecked = this.template.querySelector('input[name="NinthQuestionResponse"]:checked');
		const sixthQuestionChecked = this.template.querySelectorAll('input[name="tenthQuestionResponse"]:checked');

		if (allInputs.length < 4) {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		} else if (fifthQuestionChecked && fifthQuestionChecked.value === 'No') {
			this.customFormModal = true;
			this.isPopupOpen1 = false;
			this.isPopupOpen = true;
			this.checkYesOrNo = false;
		} else if (fifthQuestionChecked && fifthQuestionChecked.value === 'Yes' && sixthQuestionChecked.length === 0) {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		} else {
			this.customFormModal = true;
			this.isPopupOpen1 = false;
			this.isPopupOpen = true;
			this.checkYesOrNo = false;
		}
	}

	//hiding the popup
	get popuphide() {
		if (this.popupmenu === true) {
			return this.popupmenu === true ? 'disabled' : '';
		}
		return '';
	}

	//Navigation for second page
	navigationMethod() {
		try {
			let val = this.cpeId;

			// Assuming CREATE_TASK is a promise-based function that creates a task
			CREATE_TASK({ enrolleeId: val })
				.then(result => {
					this.taskId = result;
					this.error = undefined;
				})
				.catch(error => {
					this.error = error.body.message || 'An error occurred while creating the task.'; // Provide a user-friendly message
				});

			window.location.assign(PERZONALISE); // Navigate after task creation (assuming PERZONALISE is a valid URL)


		} catch (error) {
			// Handle unexpected errors here (e.g., display a generic error message)
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}
	//on click of the confirm button the same process goes here for the same as in save as draft
	confirmSubmission() {

		let fourthResponseArray = [];

		if (this.fourthCheckRelatFam) fourthResponseArray.push(this.relationshipwithff);
		if (this.fourthCheckWithPartner) fourthResponseArray.push(this.relationshipwithpartner);
		if (this.fourthCheckSelfEsteem) fourthResponseArray.push(this.selfesteem);

		this.fourthRspValue = [...new Set(fourthResponseArray)].join(', ');
		if (this.fourthRspValue === '') {
			this.fourthVersionId = '';
		}
		let commonArray = [];

		if (this.tenthCheckAsthma) commonArray.push(this.asthma);
		if (this.tenthCheckDiabetes) commonArray.push(this.diabetes);
		if (this.tenthCheckDepression) commonArray.push(this.depression);
		if (this.tenthCheckHayFever) commonArray.push(this.hayFever);
		if (this.tenthCheckBp) commonArray.push(this.hypertension);
		if (this.tenthCheckHighChol) commonArray.push(this.highcholestrol);
		if (this.tenthCheckObesity) commonArray.push(this.obesityc);
		if (this.tenthCheckOsteo) commonArray.push(this.osteoporosisc);
		if (this.tenthCheckPeptic) commonArray.push(this.ulcer);
		if (this.tenthCheckplaque) commonArray.push(this.psoriasis);
		if (this.tenthCheckpsoriatic) commonArray.push(this.psoriaticarthritis);
		if (this.tenthCheckOthers) commonArray.push(this.others);

		this.sixthResponseValue = [...new Set(commonArray)].join(', ');
		if (this.sixthResponseValue === '') {
			this.sixthVersiD = '';
		}
		let responseArray = [];
		let versionArray = [];

		const questions = [
			{ response: this.firstQuestionResponse, each: this.firstQResForEach, version: this.firstQVersionResForEach, value: this.firstRspValue, id: this.firstRespVersId },
			{ response: this.secondQuestionResponse, each: this.secQResForEach, version: this.secQVersionResForEach, value: this.secondRspValue, id: this.secondRespVersId },
			{ response: this.thirdQuestionResponse, each: this.thirdQResForEach, version: this.thirdQVersionResForEach, value: this.thirdRspValue, id: this.thirdVersionId },
			{ response: this.fourthQuestionResponse, each: this.fourQResForEach, version: this.fourQVersionResForEach, value: this.fourthRspValue, id: this.fourthVersionId },
			{ response: this.fifthQuestionresponse, each: this.fifthQResForEach, version: this.fifthQVersionResForEach, value: this.fifthResonseValue, id: this.fifthVersionId },
			{ response: this.sixthQuestionResponse, each: this.sixthQResForEach, version: this.sixthQVersionResForEach, value: this.sixthResponseValue, id: this.sixthVersiD },
		];
		questions.forEach(question => {
			if (question.response === '' && question.each !== '') {
				responseArray.push(question.each);
				versionArray.push(question.version);

			} else {
				responseArray.push(question.value);
				versionArray.push(question.id);
			}
		});

		this.realRespArray = responseArray;
		this.realAssesVerArra = versionArray;
		let nonEmptyResponses = this.realRespArray.filter(
			(response) => response !== ''
		);
		let nonEmptyIds = this.realAssesVerArra.filter((id) => id !== '');
		this.checkinc = 0;
		if (nonEmptyResponses.length >= 14) {

			this.checkinc = 1;
		}
		if (this.realRespArray.length > 0) {
			SUBMIT_ASSESSMENT_RESPONSE({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: true,
				isQsqAfterTwoMonths: false
			})
				.then(() => {

					//naviagtion to other questionnaire based on avaliable Outatsnding Questionnaires.
					window.location.assign(PERZONALISE);
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
				});

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