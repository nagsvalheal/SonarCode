// This introductory questionnaire allows you to provide information about yourself
// To import Libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//  To import Apex Classes
//import CREATE_TASK from '@salesforce/apex/BI_PSPB_TreatmentReminderCtrl.createTaskIfNoAssessment';
import GET_ENROLLE from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import INTRODUCTION_QUESTIONARE from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import SUBMIT_ASSESSMENT_RESPONSE from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_INTRODUCTION from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import DELETE_SELECTED_RESPONSE from '@salesforce/apex/BI_PSP_LetsPersonliseCtrl.draftRespoDeletion';
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

	draftTruFale=false;
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

	firstRspValue;
	firstRespVersId;
	secondRspValue;
	secondRespVersId;
	thirdRspValue;
	thirdVersionId;
	fourthRspValue;
	fourthVersionId;
	fifthResonseValue;
	fifthVersionId;
	sixthResponseValue;
	sixthVersiD;
	seventhRespalue;
	seventhVersiD;
	eghtResponseValue;
	eightVersiId;
	ninthResponseValue;
	ninthVersId;
	tenthResponseValue;
	tenthVersId;
	eleventhResponseValue;
	eleventhVersiD;
	twelvthRespalue;
	twelvthVersiD;
	thirteenthResponseValue;
	thirteenthVersiId;
	fourteenthResponseValue;
	fourteenthVersId;
	fifteenthResponseValue;
	fifteenthVersId;
	sixteenthResponseValue;
	sixteenthVersId;

	nameToDraftFirst;
	nameToDraftSecond;
	nameToDraftThird;
	nameToDraftFourth;
	nameToDraftFifth;
	nameToDraftSixth;
	nameToDraftSeventh;
	nameToDraftEighth;
	nameToDraftNinth;
	nameToDrafttenth;
	nameToDrafteEleventh;
	nameToDrafttwelvth;
	nameToDraftThirteenth;
	nameToDraftFourteenth;
	nameToDraftFifteenth;
	nameToDraftSixteenth;
	nameToDraftSeventeeth;
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

	firstQResForEach;
	secQResForEach;
	secQRes;
	secQVersionResForEach;

	thirdQResForEach;
	thirdQVersionResForEach;

	fourQResForEach;
	fourQVersionResForEach;

	fifthQResForEach;
	sixthQResForEach;

	sevenQResForEach;
	sevenQVersionResForEach;

	eigthQResForEach;
	nineQResForEach;
	tenthQResForEach;
	eleventhQResForEach;
	twelthQResForEach;
	thirteenthQResForEach;
	fourteenthQResForEach;
	fifteenthQResForEach;
	sixteenthQResForEach;

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
			GET_ENROLLE()
				.then(result => {
					if (result !== null) {
						if (result[0].id !== null) {
							this.cpeId = result[0].Id;

							// this.fetchEvents();                       
						} else if (result[0].error !== null) {
							this.showError = true;
							this.errorMessage = result[0].error;
						}
					}
				})
				.catch(error => {
					// Handle the error
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
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
	// Wire adapter to fetch draft responses of introduction
	@wire(DRAFT_RESPONSE_OF_INTRODUCTION,{questCatgryName:'$introduction',twoMonths:'$draftTruFale'})
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
		let targetFemale = this.female;
		let targetMale = this.male;
		let targetOther = this.other;
		let prefferNotTosay = this.prefernot;

		let firstLessThanMonth = this.lessthanamonth;
		let firstLessThanSix = this.lessthan6months;
		let firstLessThanYr = this.lessthanyear;
		let firstMoreThan = this.morethanyear;

		let thirdAnswerRF = this.relationshipwithff;
		let thirdRWP = this.relationshipwithpartner;
		let thirdSelEstee = this.selfesteem;

		let asthmaVar = this.asthma;
		let duabetesVar = this.diabetes;
		let depressionVar = this.depression;
		let hayFever = this.hayFever;
		let highBp = this.hypertension;
		let highChol = this.highcholestrol;
		let Obesity = this.obesityc;
		let Osteoporosis = this.osteoporosisc;
		let peptic = this.ulcer;
		let plaque = this.psoriasis;
		let psoriasiArthritis = this.psoriaticarthritis;
		let Others = this.others;

		let thirdYes = this.yes;
		let thirdNo = this.no;

		let seventhYes = this.yes;
		let seventhNo = this.no;

		let eigthYes = this.yes;
		let eigthNo = this.no;
		let eigthMaybe = this.maybe;

		let ninthYes = this.yes;
		let ninthNo = this.no;
		let ninthMaybe = this.maybe;

		let tenthYes = this.yes;
		let tenthNo = this.no;
		let tenthMaybe = this.maybe;

		let eleventhYes = this.yes;
		let eleventhNo = this.no;
		let eleventhMaybe = this.maybe;

		let twelthYes = this.yes;
		let twelthNo = this.no;
		let twelthMaybe = this.maybe;

		let thirteenthYes = this.yes;
		let thirteenthNo = this.no;
		let thirteenthMaybe = this.maybe;

		let fourteenthYes = this.yes;
		let fourteenthNo = this.no;
		let fourteenthMaybe = this.maybe;

		let fifteenthYes = this.yes;
		let fifteenthNo = this.no;
		let fifteenthMaybe = this.maybe;

		let sixteenthYes = this.yes;
		let sixteenthNo = this.no;
		let sixteenthMaybe = this.maybe;

		let seventeethYes = this.yes;
		let seventeethNo = this.no;
		let seventeethMaybe = this.maybe;
		//the below for each will iterate through each of the response and stores the response and id if criteria gets matched.
		this.records.forEach((record) => {
			if (record.BI_PSP_ResponseOrder__c === 2) {
				if (
					record.ResponseValue === targetFemale &&
					record.AssessmentQuestion.Id !== null
				) {
					this.secQResForEach = record.ResponseValue;
					this.secQVersionResForEach = record.AssessmentQuestion.Id;
					this.isFemale = true;
				}

				if (
					record.ResponseValue === targetMale &&
					record.AssessmentQuestion.Id !== null
				) {
					this.isMale = true;
					this.secQResForEach = record.ResponseValue;
					this.secQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === targetOther &&
					record.AssessmentQuestion.Id !== null
				) {
					this.secQResForEach = record.ResponseValue;
					this.secQVersionResForEach = record.AssessmentQuestion.Id;
					this.isOther = true;
				}
				if (
					record.ResponseValue === prefferNotTosay &&
					record.AssessmentQuestion.Id !== null
				) {
					this.iSPrefferNotToSay = true;
					this.secQVersionResForEach = record.AssessmentQuestion.Id;
					this.secQResForEach = record.ResponseValue;
				}
			}
			if (record.BI_PSP_ResponseOrder__c === 1) {
				if (
					record.ResponseValue === firstLessThanMonth &&
					record.AssessmentQuestion.Id !== null
				) {
					this.firstQResForEach = record.ResponseValue;

					this.firstQVersionResForEach = record.AssessmentQuestion.Id;
					this.isFirstLessThanMonth = true;
				}

				if (
					record.ResponseValue === firstLessThanSix &&
					record.AssessmentQuestion.Id !== null
				) {
					this.firstQResForEach = record.ResponseValue;
					this.firstQVersionResForEach = record.AssessmentQuestion.Id;
					this.isFirstLessSix = true;
				}

				if (
					record.ResponseValue === firstLessThanYr &&
					record.AssessmentQuestion.Id !== null
				) {
					this.firstQResForEach = record.ResponseValue;
					this.firstQVersionResForEach = record.AssessmentQuestion.Id;

					this.isFirstLessYear = true;
				}

				if (
					record.ResponseValue === firstMoreThan &&
					record.AssessmentQuestion.Id !== null
				) {
					this.firstQResForEach = record.ResponseValue;

					this.firstQVersionResForEach = record.AssessmentQuestion.Id;

					this.isFirstMoreYear = true;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 4) {
				this.idoFfORU = record.Id;
				if (
					record.ResponseValue.includes(thirdAnswerRF) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourthCheckRelatFam = true;
					this.fourQResForEach = record.ResponseValue;

					this.fourQVersionResForEach = record.AssessmentQuestion.Id;
				}

				if (
					record.ResponseValue.includes(thirdRWP) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourthCheckWithPartner = true;
					this.fourQResForEach = record.ResponseValue;

					this.fourQVersionResForEach = record.AssessmentQuestion.Id;
				}

				if (
					record.ResponseValue.includes(thirdSelEstee) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourthCheckSelfEsteem = true;
					this.fourQResForEach = record.ResponseValue;

					this.fourQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 6) {
				this.storeid5 = record.Id;

				if (
					record.ResponseValue.includes(asthmaVar) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckAsthma = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(duabetesVar) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckDiabetes = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(depressionVar) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckDepression = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(hayFever) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckHayFever = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(highBp) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckBp = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(highChol) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckHighChol = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(Obesity) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckObesity = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(Osteoporosis) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckOsteo = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(peptic) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckPeptic = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(plaque) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckplaque = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(psoriasiArthritis) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckpsoriatic = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(Others) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthCheckOthers = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 3) {
				if (
					record.ResponseValue === thirdYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.thirdQResForEach = record.ResponseValue;
					this.thirdQVersionResForEach = record.AssessmentQuestion.Id;
					this.thirdIsYes = true;
				}
				if (
					record.ResponseValue === thirdNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.thirdQResForEach = record.ResponseValue;
					this.thirdQVersionResForEach = record.AssessmentQuestion.Id;
					this.thirdIsNo = true;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 5) {
				if (
					record.ResponseValue === seventhYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fifthQResForEach = record.ResponseValue;
					this.fifthQVersionResForEach = record.AssessmentQuestion.Id;
					this.fifthRadYes = true;
					this.sixthQuestionVisible = this.fifthQResForEach === this.yes;
				}
				if (
					record.ResponseValue === seventhNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fifthRadNo = true;
					this.fifthQResForEach = record.ResponseValue;
					this.fifthQVersionResForEach = record.AssessmentQuestion.Id;
					if (this.fifthQResForEach === this.no) {
						this.sixthQResForEach = '';
						this.sixthQVersionResForEach = '';
					}
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 7) {
				if (
					record.ResponseValue === eigthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.sevenQResForEach = record.ResponseValue;
					if (this.sevenQResForEach !== null) {
						this.afterSixthRadYes = true;
					}

					this.sevenQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === eigthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.sevenQResForEach = record.ResponseValue;
					this.sevenQVersionResForEach = record.AssessmentQuestion.Id;

					this.afterSixthRadNo = true;
				}
				if (
					record.ResponseValue === eigthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.sevenQResForEach = record.ResponseValue;
					this.sevenQVersionResForEach = record.AssessmentQuestion.Id;

					this.afterSixthRadMaybe = true;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 9) {
				if (
					record.ResponseValue === tenthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.nineQResForEach = record.ResponseValue;
					this.nineQVersionResForEach = record.AssessmentQuestion.Id;

					this.eleventhRadYes = true;
				}
				if (
					record.ResponseValue === tenthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.eleventhRadNo = true;
					this.nineQResForEach = record.ResponseValue;
					this.nineQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === tenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.nineQResForEach = record.ResponseValue;
					this.nineQVersionResForEach = record.AssessmentQuestion.Id;

					this.eleventhRadMaybe = true;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 8) {
				if (
					record.ResponseValue === ninthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.eigthQResForEach = record.ResponseValue;
					this.eigthQVersionResForEach = record.AssessmentQuestion.Id;

					this.sixthRadYes = true;
				}
				if (
					record.ResponseValue === ninthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.eigthQResForEach = record.ResponseValue;
					this.eigthQVersionResForEach = record.AssessmentQuestion.Id;
					this.sixthRadNo = true;
				}
				if (
					record.ResponseValue === ninthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.eigthQResForEach = record.ResponseValue;
					this.eigthQVersionResForEach = record.AssessmentQuestion.Id;

					this.sixthRadMayBe = true;
				}
			}
			if (record.BI_PSP_ResponseOrder__c === 10) {
				if (
					record.ResponseValue === eleventhYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthQResForEach = record.ResponseValue;
					this.tenthQVersionResForEach = record.AssessmentQuestion.Id;

					this.secondRadYes = true;
				}
				if (
					record.ResponseValue === eleventhNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.secondRadNo = true;
					this.tenthQResForEach = record.ResponseValue;
					this.tenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === eleventhMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.secondRadMaybe = true;
					this.tenthQResForEach = record.ResponseValue;
					this.tenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 11) {
				if (
					record.ResponseValue === twelthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.eleventhQResForEach = record.ResponseValue;
					this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;

					this.thirdRadYes = true;
				}
				if (
					record.ResponseValue === twelthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.thirdRadNo = true;
					this.eleventhQResForEach = record.ResponseValue;
					this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === twelthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.thirdRadMaybe = true;
					this.eleventhQResForEach = record.ResponseValue;
					this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 12) {
				if (
					record.ResponseValue === thirteenthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.twelthQResForEach = record.ResponseValue;
					this.twelthQVersionResForEach = record.AssessmentQuestion.Id;

					this.fourthRadYes = true;
				}
				if (
					record.ResponseValue === thirteenthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourthRadNo = true;
					this.twelthQResForEach = record.ResponseValue;
					this.twelthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === thirteenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourthRadMaybe = true;
					this.twelthQResForEach = record.ResponseValue;
					this.twelthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 13) {
				if (
					record.ResponseValue === fourteenthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.thirteenthQResForEach = record.ResponseValue;
					this.thirteenthQVersionResForEach = record.AssessmentQuestion.Id;

					this.seventhRadYes = true;
				}
				if (
					record.ResponseValue === fourteenthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.seventhRadNo = true;
					this.thirteenthQResForEach = record.ResponseValue;
					this.thirteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === fourteenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.seventhRadMaybe = true;
					this.thirteenthQResForEach = record.ResponseValue;
					this.thirteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 14) {
				if (
					record.ResponseValue === fifteenthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourteenthQResForEach = record.ResponseValue;
					this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
					this.twelthRadYes = true;
				}
				if (
					record.ResponseValue === fifteenthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.twelthRadNo = true;
					this.fourteenthQResForEach = record.ResponseValue;
					this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === fifteenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.twelthRadMaybe = true;
					this.fourteenthQResForEach = record.ResponseValue;
					this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 15) {
				if (
					record.ResponseValue === sixteenthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fifteenthQResForEach = record.ResponseValue;
					this.fifteenthQVersionResForEach = record.AssessmentQuestion.Id;

					this.thirteenththRadYes = true;
				}
				if (
					record.ResponseValue === sixteenthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.thirteenththRadNo = true;
					this.fifteenthQResForEach = record.ResponseValue;
					this.fifteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === sixteenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.thirteenththRadMaybe = true;
					this.fifteenthQResForEach = record.ResponseValue;
					this.fifteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 16) {
				//16
				if (
					record.ResponseValue === seventeethYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.sixteenthQResForEach = record.ResponseValue;

					this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;

					this.forteenththRadYes = true;
				}
				if (
					record.ResponseValue === seventeethNo &&
					record.AssessmentQuestion.Id !== null
				) {
					this.forteenthRadNo = true;
					this.sixteenthQResForEach = record.ResponseValue;
					this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === seventeethMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.forteenthRadMaybe = true;
					this.sixteenthQResForEach = record.ResponseValue;
					this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}
		});
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

	//below are the handlers that handles the resposnes from user input(16 hhandlers)
	handleFirstQuestionChange(event) {
		this.nameOfQuestion = event.target.name;
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

		if (this.nameOfQuestion === 'firstQuestionResponse') {
			this.firstQuestionResponse = event.target.value;

			this.nameToDraftFirst = event.target.name;

			if (this.firstQuestionResponse !== '') {
				//pushes the responses and version ids to arrays
				this.arrayForPushResp.push(this.firstQuestionResponse);
				this.arrayForPushId.push(this.firstQuestionVersinId);
			}
			this.firstRspValue = this.getLastRespValue();
			this.firstRespVersId = this.getLastIdValue();
		}
	}
	//getLastRespValue will extract the last input response of the user, its the same for remaining hanler
	getLastRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}
	//getLastIdValue will extract the last input response version  id of the user, its the same for remaining hanler
	getLastIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

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

		this.nameOfQuestion = event.target.name;

		if (this.nameOfQuestion === 'secondQuestionResponse') {
			this.secondQuestionResponse = event.target.value;
			this.nameToDraftSecond = event.target.name;
			if (this.secondQuestionResponse !== '') {
				this.arrayForPushResp.push(this.secondQuestionResponse);
				this.arrayForPushId.push(this.secondQuestionVersinId);
			}
			// Get the last response value
			this.secondRspValue = this.getSecondRespValue();
			// Get the last response version id
			this.secondRespVersId = this.getSecondIdValue();
		}
	}

	getSecondRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getSecondIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleEigthQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.sixthRadYes = true;
		} else {
			this.sixthRadYes = false;
		}

		if (checkedVal === this.no) {
			this.sixthRadNo = true;
		} else {
			this.sixthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.sixthRadMayBe = true;
		} else {
			this.sixthRadMayBe = false;
		}

		this.eightQuestionResponse = event.target.value;
		this.nameToDraftEighth = event.target.name;
		if (this.eightQuestionResponse !== '') {
			this.arrayForPushResp.push(this.eightQuestionResponse);
			this.arrayForPushId.push(this.eightQuestionVersinId);
		}
		// Get the last values separately
		this.eghtResponseValue = this.getEigthRespValue();
		this.eightVersiId = this.getEigthIdValue();
	}

	getEigthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getEigthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

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

		this.nameOfQuestion = event.target.name;

		if (this.nameOfQuestion === 'thirdQuestionRespo') {
			this.thirdQuestionResponse = event.target.value;
			this.nameToDraftThird = event.target.name;
			if (this.thirdQuestionResponse !== '') {
				this.arrayForPushResp.push(this.thirdQuestionResponse);
				this.arrayForPushId.push(this.thirdQuestionVersinId);
			}
			// Get the last values separately
			this.thirdRspValue = this.getThirdRespValue();
			this.thirdVersionId = this.getThirdIdValue();
		}
	}

	getThirdRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getThirdIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	//this handler handles the user input Response
	handleNinthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.eleventhRadYes = true;
		} else {
			this.eleventhRadYes = false;
		}

		if (checkedVal === this.no) {
			this.eleventhRadNo = true;
		} else {
			this.eleventhRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.eleventhRadMaybe = true;
		} else {
			this.eleventhRadMaybe = false;
		}

		this.ninthQuestionResponse = event.target.value;
		this.nameToDraftNinth = event.target.name;
		if (this.ninthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.ninthQuestionResponse);
			this.arrayForPushId.push(this.ninthQuestionVersinId);
		}
		// Get the last values separately
		this.ninthResponseValue = this.getNinthRespValue();
		this.ninthVersId = this.getNinthIdValue();
	}

	getNinthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getNinthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleFifteenthQuestionChange(event) {
		let checkedVal = event.target.value;
		//the below if conditions checks the value if it is true then set the radion buttons as checked otherwise unchecked.
		if (checkedVal === this.yes) {
			this.thirteenththRadYes = true;
		} else {
			this.thirteenththRadYes = false;
		}

		if (checkedVal === this.no) {
			this.thirteenththRadNo = true;
		} else {
			this.thirteenththRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.thirteenththRadMaybe = true;
		} else {
			this.thirteenththRadMaybe = false;
		}

		this.fifteenthQuestionResponse = event.target.value;
		this.nameToDraftFifteenth = event.target.name;

		if (this.fifteenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fifteenthQuestionResponse);
			this.arrayForPushId.push(this.fifteenthQuestionVersinId);
		}

		// Get the last values separately
		this.fifteenthResponseValue = this.getFifteenthRespValue();
		this.fifteenthVersId = this.getFifteenthIdValue();
	}

	getFifteenthRespValue() {
		return this.checkBoxArray.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getFifteenthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleFourteenthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.twelthRadYes = true;
		} else {
			this.twelthRadYes = false;
		}

		if (checkedVal === this.no) {
			this.twelthRadNo = true;
		} else {
			this.twelthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.twelthRadMaybe = true;
		} else {
			this.twelthRadMaybe = false;
		}

		this.fourteenthQuestionResponse = event.target.value;
		this.nameToDraftFourteenth = event.target.name;

		if (this.fourteenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourteenthQuestionResponse);
			this.arrayForPushId.push(this.foteenthQuestionVersinId);
		}
		// Get the last values separately
		this.fourteenthResponseValue = this.getFourteenthRespValue();
		this.fourteenthVersId = this.getFourteenthIdValue();
	}

	getFourteenthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getFourteenthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleThirteenthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.seventhRadYes = true;
		} else {
			this.seventhRadYes = false;
		}

		if (checkedVal === this.no) {
			this.seventhRadNo = true;
		} else {
			this.seventhRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.seventhRadMaybe = true;
		} else {
			this.seventhRadMaybe = false;
		}

		this.thirteenthQuestionResponse = event.target.value;
		this.nameToDraftThirteenth = event.target.name;

		if (this.thirteenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.thirteenthQuestionResponse);
			this.arrayForPushId.push(this.thirteeenthQuestionVersinId);
		}

		this.thirteenthResponseValue = this.getThirteenthRespValue();
		this.thirteenthVersiId = this.getThirteenthIdValue();
	}

	getThirteenthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getThirteenthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleTwelthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.fourthRadYes = true;
		} else {
			this.fourthRadYes = false;
		}

		if (checkedVal === this.no) {
			this.fourthRadNo = true;
		} else {
			this.fourthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.fourthRadMaybe = true;
		} else {
			this.fourthRadMaybe = false;
		}

		this.twelvthQuestionResponse = event.target.value;
		this.nameToDrafttwelvth = event.target.name;

		if (this.twelvthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.twelvthQuestionResponse);
			this.arrayForPushId.push(this.twelthQuestionVersinId);
		}

		this.twelvthRespalue = this.getTwelthRespValue();
		this.twelvthVersiD = this.getTwelthIdValue();
	}

	getTwelthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getTwelthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleEleventhQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.thirdRadYes = true;
		} else {
			this.thirdRadYes = false;
		}

		if (checkedVal === this.no) {
			this.thirdRadNo = true;
		} else {
			this.thirdRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.thirdRadMaybe = true;
		} else {
			this.thirdRadMaybe = false;
		}

		this.eleventhQuestionResponse = event.target.value;
		this.nameToDrafteEleventh = event.target.name;

		if (this.eleventhQuestionResponse !== '') {
			this.arrayForPushResp.push(this.eleventhQuestionResponse);
			this.arrayForPushId.push(this.eleventhQuestionVersinId);
		}
		// Get the last values separately
		this.eleventhResponseValue = this.getEleventhRespValue();
		this.eleventhVersiD = this.getEleventhIdValue();
	}

	getEleventhRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getEleventhIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleTenthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.secondRadYes = true;
		} else {
			this.secondRadYes = false;
		}

		if (checkedVal === this.no) {
			this.secondRadNo = true;
		} else {
			this.secondRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.secondRadMaybe = true;
		} else {
			this.secondRadMaybe = false;
		}

		this.tenthQuestionResponse = event.target.value;
		this.nameToDrafttenth = event.target.name;
		if (this.tenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.tenthQuestionResponse);
			this.arrayForPushId.push(this.tenthQuestionVersinId);
		}

		this.tenthResponseValue = this.getTenthRespValue();
		this.tenthVersId = this.getTenthIdValue();
	}

	getTenthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getTenthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleSeventhQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.afterSixthRadYes = true;
		} else {
			this.afterSixthRadYes = false;
		}

		if (checkedVal === this.no) {
			this.afterSixthRadNo = true;
		} else {
			this.afterSixthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.afterSixthRadMaybe = true;
		} else {
			this.afterSixthRadMaybe = false;
		}
		this.seventhQuestionResponse = event.target.value;
		this.nameToDraftSeventh = event.target.name;

		if (this.seventhQuestionResponse !== '') {
			this.arrayForPushResp.push(this.seventhQuestionResponse);
			this.arrayForPushId.push(this.seventhQuestionVersinId);
		}

		this.seventhRespalue = this.getSeventhRespValue();
		this.seventhVersiD = this.getSeventhIdValue();
	}

	getSeventhRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getSeventhIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleSixthQuestionchange(event) {
    this.sixthDraftVal = this.sixthQResForEach;
    const checkBoval = event.target.checked;
    const vals = event.target.value;

    this.knowSixthChecked = checkBoval;

    // Map of condition values to checkbox variables
    const conditionMap = {
        [this.asthma]: 'tenthCheckAsthma',
        [this.diabetes]: 'tenthCheckDiabetes',
        [this.depression]: 'tenthCheckDepression',
        [this.hayFever]: 'tenthCheckHayFever',
        [this.hypertension]: 'tenthCheckBp',
        [this.highcholestrol]: 'tenthCheckHighChol',
        [this.obesityc]: 'tenthCheckObesity',
        [this.osteoporosisc]: 'tenthCheckOsteo',
        [this.ulcer]: 'tenthCheckPeptic',
        [this.psoriasis]: 'tenthCheckplaque',
        [this.psoriaticarthritis]: 'tenthCheckpsoriatic',
        [this.others]: 'tenthCheckOthers'
    };

    if (checkBoval) {
        this.unCheckedBoolean = true;
        this.sixthCheckedArray.push(vals);
    } else {
        this.unCheckedBoolean = false;
        this.uncheckVar = this.yes;
        this.sixthUnCheckedVals = vals;
        this.sixthUnChekedArray.push(vals);
    }

    if (Object.hasOwn(conditionMap, vals)) {
        this[conditionMap[vals]] = checkBoval;
    }

    this.sixthQuestionResponse = vals;
    this.nameToDraftSixth = event.target.name;

    if (vals !== '') {
        this.arrayForPushResp.push(vals);
        this.arrayForPushId.push(this.sixthQuestionVersinId);
        this.selectMedic.push(vals);
    }

    this.sixthResponseValue = this.getSixthRespValue();
    this.sixthVersiD = this.getSixthIdValue();

    if (typeof this.sixthQResForEach !== 'undefined' && this.filterArr === '') {
        const qResArray = this.sixthQResForEach.split(',');
        this.filteredArray = qResArray.filter(value => value.trim() !== '');

        if (this.filteredArray.length > 0) {
            this.sixthCheckedArray = [...this.sixthCheckedArray, ...this.filteredArray];
        }
    }

    const uniqueUnchekedArray = Array.from(new Set(this.sixthUnChekedArray));
    this.uniqueUncheckedCount = uniqueUnchekedArray.length;

    const uniqueCheckedArray = Array.from(new Set(this.sixthCheckedArray));
    this.uniqueCheckedCount = uniqueCheckedArray.length;

    this.isEqualLength = this.uniqueUncheckedCount === this.uniqueCheckedCount;
}

	getSixthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getSixthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	handleSixteenthQuestionChange(event) {
		let checkedVal = event.target.value;
		if (checkedVal === this.yes) {
			this.forteenththRadYes = true;
		} else {
			this.forteenththRadYes = false;
		}

		if (checkedVal === this.no) {
			this.forteenthRadNo = true;
		} else {
			this.forteenthRadNo = false;
		}
		if (checkedVal === this.maybe) {
			this.forteenthRadMaybe = true;
		} else {
			this.forteenthRadMaybe = false;
		}

		this.sixteenthQuestionResponse = event.target.value;
		this.nameToDraftSixteenth = event.target.name;

		if (this.sixteenthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.sixteenthQuestionResponse);
			this.arrayForPushId.push(this.sixteenthQuestionVersinId);
		}

		this.sixteenthResponseValue = this.getSixteenthRespValue();
		this.sixteenthVersId = this.getSixteenthIdValue();
	}

	getSixteenthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getSixteenthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	deleteYesBasedRes() {
		this.sixthQResForEach = '';
		this.sixthQVersionResForEach = '';
	}

	handleFifthQuestionChange(event) {
		this.sixthQuestionVisible = event.target.value === this.yes;
		this.fifthQuestionresponse = event.target.value;
		this.nameToDraftFifth = event.target.name;
		if (this.fifthQuestionresponse !== '') {
			this.arrayForPushResp.push(this.fifthQuestionresponse);
			this.arrayForPushId.push(this.fifthQuestionVersinId);
		}

		this.fifthResonseValue = this.getFifthRespValue();

		this.fifthVersionId = this.getFifthIdValue();

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
			this.deleteYesBasedRes();
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

	getFifthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getFifthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

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
		this.nameToDraftFourth = event.target.name;

		if (this.fourthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourthQuestionResponse);
			this.arrayForPushId.push(this.fourthQuestionVersinId);
			this.totalValu.push(this.fourthQuestionResponse);
		}

		this.fourthRspValue = this.getFourthRespValue();
		this.fourthVersionId = this.getFourthIdValue();
	}

	getFourthRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getFourthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	//When clicked on Return back to Question buttton.This will close the popup and show you the page with all the previous response selection just before clicking the button.
resetState() {
    this.sixthCheckedArray = [];
    this.sixthUnchekedArray = [];
    this.filteredArray = [];
    this.filterArr = 'true';

    this.customFormModal = false;
    document.body.style.overflow = '';
    this.isPopupOpen1 = false;
    this.isPopupOpen = false;
    this.popupmenu = false;
}

// Helper function to process and update response arrays
processResponses() {
    let fourthResponseArray = [];

    if (this.fourthCheckRelatFam) fourthResponseArray.push(this.relationshipwithff);
    if (this.fourthCheckWithPartner) fourthResponseArray.push(this.relationshipwithpartner);
    if (this.fourthCheckSelfEsteem) fourthResponseArray.push(this.selfesteem);

    let fourthResponse = [...new Set(fourthResponseArray.filter(v => v !== undefined))].join(', ');

    let commonArray = [];
    [
        { flag: this.tenthCheckAsthma, value: this.asthma },
        { flag: this.tenthCheckDiabetes, value: this.diabetes },
        { flag: this.tenthCheckDepression, value: this.depression },
        { flag: this.tenthCheckHayFever, value: this.hayFever },
        { flag: this.tenthCheckBp, value: this.hypertension },
        { flag: this.tenthCheckHighChol, value: this.highcholestrol },
        { flag: this.tenthCheckObesity, value: this.obesityc },
        { flag: this.tenthCheckOsteo, value: this.osteoporosisc },
        { flag: this.tenthCheckPeptic, value: this.ulcer },
        { flag: this.tenthCheckplaque, value: this.psoriasis },
        { flag: this.tenthCheckpsoriatic, value: this.psoriaticarthritis },
        { flag: this.tenthCheckOthers, value: this.others }
    ].forEach(({ flag, value }) => {
        if (flag) commonArray.push(value);
    });

    let concatenatedMedicValues = [...new Set(commonArray.filter(v => v !== undefined))].join(', ');

    return { fourthResponse, concatenatedMedicValues };
}

// Helper function to update response states based on conditions
updateResponses(responseData) {
    let { fourthResponse, concatenatedMedicValues } = responseData;

    // Update fourth responses
    this.fourthCheckRelatFam = fourthResponse.includes(this.relationshipwithff);
    this.fourthCheckWithPartner = fourthResponse.includes(this.relationshipwithpartner);
    this.fourthCheckSelfEsteem = fourthResponse.includes(this.selfesteem);

    // Update radio button values
    const updateRadioButton = (response, field) => {
        if (response === this.yes) this[field + 'RadYes'] = true;
        else if (response === this.no) this[field + 'RadNo'] = true;
        else if (response === this.maybe) this[field + 'RadMaybe'] = true;
    };

    [
        { response: this.fifthQuestionresponse, field: 'fifth' },
        { response: this.eightQuestionResponse, field: 'sixth' },
        { response: this.sixteenthQuestionResponse, field: 'forteenthth' },
        { response: this.fifteenthQuestionResponse, field: 'thirteenthth' },
        { response: this.ninthQuestionResponse, field: 'eleventh' },
        { response: this.tenthQuestionResponse, field: 'second' },
        { response: this.firstQuestionResponse, field: 'first' },
        { response: this.eleventhQuestionResponse, field: 'third' },
        { response: this.secondQuestionResponse, field: 'second' },
        { response: this.thirdQuestionResponse, field: 'third' },
        { response: this.seventhQuestionResponse, field: 'afterSixth' },
        { response: this.twelvthQuestionResponse, field: 'fourth' },
        { response: this.thirteenthQuestionResponse, field: 'seventh' },
        { response: this.fourteenthQuestionResponse, field: 'twelth' }
    ].forEach(({ response, field }) => updateRadioButton(response, field));

    // Update check values
    const updateCheckValues = (value, flag) => {
        if (concatenatedMedicValues.includes(value)) this[flag] = true;
    };

    [
        { value: this.asthma, flag: 'tenthCheckAsthma' },
        { value: this.diabetes, flag: 'tenthCheckDiabetes' },
        { value: this.depression, flag: 'tenthCheckDepression' },
        { value: this.hayFever, flag: 'tenthCheckHayFever' },
        { value: this.hypertension, flag: 'tenthCheckBp' },
        { value: this.highcholestrol, flag: 'tenthCheckHighChol' },
        { value: this.obesityc, flag: 'tenthCheckObesity' },
        { value: this.osteoporosisc, flag: 'tenthCheckOsteo' },
        { value: this.ulcer, flag: 'tenthCheckPeptic' },
        { value: this.psoriasis, flag: 'tenthCheckplaque' },
        { value: this.psoriaticarthritis, flag: 'tenthCheckpsoriatic' },
        { value: this.others, flag: 'tenthCheckOthers' }
    ].forEach(({ value, flag }) => updateCheckValues(value, flag));
}

// Close popup and handle previous responses
handleClosePopup() {
    this.resetState();
    let responseData = this.processResponses();
    this.updateResponses(responseData);
}

// When clicked on cancel button, this will close the popup and show you the page with all the previous responses just before clicking the button
closePopup() {
    this.handleClosePopup();
}

// When clicked on cancel button, this will close the popup and show you the page with all the previous responses just before clicking the button
closePopup1() {
    this.handleClosePopup();
}


	//On click the PAGE will become static then it will show you the popup based on the criteria that gets matched.
	submitResponses() {
		if (this.isDesktop) {
			//this will make the page as static
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		//below are if the conditions that checks if the draft responses are not null.if it is then assign a value to the name attribt of each handler.
		if (
			typeof this.firstQResForEach !== 'undefined' &&
			this.firstQResForEach !== ''
		) {
			this.nameToDraftFirst = 'firstRes';
		}
		if (
			typeof this.secQResForEach !== 'undefined' &&
			this.secQResForEach !== ''
		) {
			this.nameToDraftSecond = 'firstRes';
		}
		if (
			typeof this.thirdQResForEach !== 'undefined' &&
			this.thirdQResForEach !== ''
		) {
			this.nameToDraftThird = 'firstRes';
		}
		if (
			typeof this.fourQResForEach !== 'undefined' &&
			this.fourQResForEach !== ''
		) {
			this.nameToDraftFourth = 'firstRes';
		}
		if (
			typeof this.fifthQResForEach !== 'undefined' &&
			this.fifthQResForEach !== ''
		) {
			this.nameToDraftFifth = 'firstRes';
		}

		if (
			typeof this.sixthQResForEach !== 'undefined' &&
			this.sixthQResForEach !== ''
		) {
			this.nameToDraftSixth = 'emptied';
		}

		//the below if conditions will determine which pop up to show
		if (
			typeof this.nameToDraftSixth === 'undefined' &&
			typeof this.nameToDraftFirst === 'undefined' &&
			typeof this.nameToDraftSecond === 'undefined' &&
			typeof this.nameToDraftThird === 'undefined' &&
			typeof this.nameToDraftFifth === 'undefined'
		) {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		}

		if (
			typeof this.nameToDraftSixth === 'undefined' &&
			typeof this.nameToDraftFirst !== 'undefined' &&
			typeof this.nameToDraftSecond !== 'undefined' &&
			typeof this.nameToDraftThird !== 'undefined' &&
			typeof this.nameToDraftFifth !== 'undefined'
		) {
			if (
				typeof this.fifthResonseValue === 'undefined' &&
				this.fifthQResForEach === this.no &&
				typeof this.sixthResponseValue === 'undefined' &&
				this.sixthQResForEach === ''
			) {

				this.customFormModal = true;
				this.isPopupOpen1 = false;
				this.isPopupOpen = true;
				this.checkYesOrNo = false;
			}
			if (
				this.fifthResonseValue === this.no &&
				(typeof this.sixthResponseValue === 'undefined' ||
					this.sixthResponseValue === '') &&
				(this.sixthQResForEach === '' ||
					typeof this.sixthQResForEach === 'undefined')
			) {

				this.customFormModal = true;
				this.isPopupOpen1 = false;
				this.isPopupOpen = true;
				this.checkYesOrNo = false;
			}

			if (
				this.fifthQResForEach === this.yes &&
				typeof this.sixthResponseValue === 'undefined' &&
				typeof this.sixthQResForEach === 'undefined'
			) {

				this.customFormModal = true;
				this.isPopupOpen1 = true;
				this.isPopupOpen = false;
				this.checkYesOrNo = false;
			}

			if (
				this.fifthResonseValue === this.yes &&
				(typeof this.sixthResponseValue === 'undefined' ||
					this.sixthResponseValue === '') &&
				(typeof this.sixthQResForEach === 'undefined' ||
					this.sixthQResForEach === '')
			) {

				this.customFormModal = true;
				this.isPopupOpen1 = true;
				this.isPopupOpen = false;
				this.checkYesOrNo = false;
			}
		} else {

			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		}

		if (
			typeof this.nameToDraftFirst !== 'undefined' &&
			typeof this.nameToDraftSecond !== 'undefined' &&
			typeof this.nameToDraftThird !== 'undefined' &&
			typeof this.nameToDraftFifth !== 'undefined' &&
			typeof this.nameToDraftSixth !== 'undefined'
		) {
			if (this.sixthQResForEach !== '') {
				if (
					(this.fifthResonseValue === this.yes ||
						this.fifthQResForEach === this.yes) &&
					this.isEqualLength === true
				) {

					this.customFormModal = true;

					this.isPopupOpen1 = true;
					this.isPopupOpen = false;
					this.checkYesOrNo = false;
				}

				if (
					this.fifthResonseValue === this.yes &&
					this.fifthQResForEach === this.no &&
					this.isEqualLength === false
				) {

					this.customFormModal = true;
					this.isPopupOpen1 = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (
					this.fifthQResForEach === this.yes &&
					this.isEqualLength === false
				) {

					this.customFormModal = true;
					this.isPopupOpen1 = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (this.fifthQResForEach === this.yes && this.isEqualLength === true) {

					this.customFormModal = true;
					this.isPopupOpen1 = true;
					this.isPopupOpen = false;
					this.checkYesOrNo = false;
				}
			}

			if (
				typeof this.sixthQResForEach === 'undefined' ||
				this.sixthQResForEach === ''
			) {
				if (
					(this.fifthResonseValue === this.yes ||
						this.fifthQResForEach === this.yes) &&
					typeof this.sixthResponseValue === 'undefined'
				) {

					this.customFormModal = true;

					this.isPopupOpen1 = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (
					this.fifthResonseValue === this.yes &&
					typeof this.sixthResponseValue !== 'undefined' &&
					this.isEqualLength === false
				) {

					this.customFormModal = true;

					this.isPopupOpen1 = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (
					this.fifthRadYes === true &&
					this.tenthCheckAsthma === false &&
					this.tenthCheckDiabetes === false &&
					this.tenthCheckDepression === false &&
					this.tenthCheckHayFever === false &&
					this.tenthCheckBp === false &&
					this.tenthCheckHighChol === false &&
					this.tenthCheckObesity === false &&
					this.tenthCheckOsteo === false &&
					this.tenthCheckPeptic === false &&
					this.tenthCheckpsoriatic === false &&
					this.tenthCheckOthers === false

				) {

					this.customFormModal = true;

					this.isPopupOpen1 = true;
					this.isPopupOpen = false;
					this.checkYesOrNo = false;
				}

				if (
					(this.fifthResonseValue === this.yes ||
						this.fifthQResForEach === this.yes) &&
					this.isEqualLength === false &&
					this.knowSixthChecked === false
				) {

					this.customFormModal = true;
					this.isPopupOpen1 = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (
					this.fifthResonseValue === this.no &&
					(typeof this.sixthResponseValue === 'undefined' ||
						typeof this.sixthQResForEach === 'undefined' ||
						this.sixthQResForEach === '')
				) {

					this.customFormModal = true;
					this.isPopupOpen1 = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}
			}
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
    // Helper function to filter and deduplicate array values
    const getUniqueValues = (array) => [
        ...new Set(array.filter(value => value !== undefined))
    ].join(', ');

    // Helper function to update responses
    const updateResponseArrays = (response, versionId, versionIdVar) => {
        if (response === '' && versionId !== '') {
            this.realRespArray.push(versionId);
            this.realAssesVerArra.push(versionIdVar);
        } else {
            this.realRespArray.push(response);
            this.realAssesVerArra.push(versionIdVar);
        }
    };

    // Construct fourth response
    const fourthResponseArray = [
        this.fourthCheckRelatFam && this.relationshipwithff,
        this.fourthCheckWithPartner && this.relationshipwithpartner,
        this.fourthCheckSelfEsteem && this.selfesteem
    ].filter(Boolean);

    this.fourthRspValue = getUniqueValues(fourthResponseArray);

    // Construct sixth response
    const commonArray = [
        this.tenthCheckAsthma && this.asthma,
        this.tenthCheckDiabetes && this.diabetes,
        this.tenthCheckDepression && this.depression,
        this.tenthCheckHayFever && this.hayFever,
        this.tenthCheckBp && this.hypertension,
        this.tenthCheckHighChol && this.highcholestrol,
        this.tenthCheckObesity && this.obesityc,
        this.tenthCheckOsteo && this.osteoporosisc,
        this.tenthCheckPeptic && this.ulcer,
        this.tenthCheckplaque && this.psoriasis,
        this.tenthCheckpsoriatic && this.psoriaticarthritis,
        this.tenthCheckOthers && this.others
    ].filter(Boolean);

    this.sixthResponseValue = getUniqueValues(commonArray);

    // Update response arrays
    updateResponseArrays(this.firstQuestionResponse, this.firstQResForEach, this.firstQVersionResForEach);
    updateResponseArrays(this.secondQuestionResponse, this.secQResForEach, this.secQVersionResForEach);
    updateResponseArrays(this.thirdQuestionResponse, this.thirdQResForEach, this.thirdQVersionResForEach);
    updateResponseArrays(this.fourthQuestionResponse, this.fourQResForEach, this.fourQVersionResForEach);
    
    if (this.fourthRspValue === '') {
        this.fourthVersionId = '';
        this.realAssesVerArra.push(this.fourthVersionId);
        DELETE_SELECTED_RESPONSE({ idOfRes: this.fourthRecId })
            .then(() => {
                this.fourthCheckRelatFam = false;
                this.fourthCheckWithPartner = false;
                this.fourthCheckSelfEsteem = false;
            })
            .catch(error => this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT));
    } else {
        this.realAssesVerArra.push(this.fourthVersionId);
    }

    updateResponseArrays(this.fifthQuestionresponse, this.fifthQResForEach, this.fifthQVersionResForEach);
    updateResponseArrays(this.sixthQuestionResponse, this.sixthQResForEach, this.sixthQVersionResForEach);

    if (this.sixthResponseValue === '') {
        this.sixthVersiD = '';
        this.realAssesVerArra.push(this.sixthVersiD);
        DELETE_SELECTED_RESPONSE({ idOfRes: this.sixthResponseId })
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
            .catch(error => this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT));
    } else {
        this.realAssesVerArra.push(this.sixthVersiD);
    }

    updateResponseArrays(this.seventhQuestionResponse, this.sevenQResForEach, this.sevenQVersionResForEach);
    updateResponseArrays(this.eightQuestionResponse, this.eigthQResForEach, this.eigthQVersionResForEach);
    updateResponseArrays(this.ninthQuestionResponse, this.nineQResForEach, this.nineQVersionResForEach);
    updateResponseArrays(this.tenthQuestionResponse, this.tenthQResForEach, this.tenthQVersionResForEach);
    updateResponseArrays(this.eleventhQuestionResponse, this.eleventhQResForEach, this.eleventhQVersionResForEach);
    updateResponseArrays(this.twelvthQuestionResponse, this.twelthQResForEach, this.twelthQVersionResForEach);
    updateResponseArrays(this.thirteenthQuestionResponse, this.thirteenthQResForEach, this.thirteenthQVersionResForEach);
    updateResponseArrays(this.fourteenthQuestionResponse, this.fourteenthQResForEach, this.fourteenthQVersionResForEach);
    updateResponseArrays(this.fifteenthQuestionResponse, this.fifteenthQResForEach, this.fifteenthQVersionResForEach);
    updateResponseArrays(this.sixteenthQuestionResponse, this.sixteenthQResForEach, this.sixteenthQVersionResForEach);

    // Filter out empty responses and IDs
    const nonEmptyResponses = this.realRespArray.filter(response => response !== '');
    const nonEmptyIds = this.realAssesVerArra.filter(id => id !== '');

    this.checkinc = nonEmptyResponses.length >= 14 ? 1 : 0;

    if (nonEmptyResponses.length > 0) {
        SUBMIT_ASSESSMENT_RESPONSE({
            darftQuestionIds: nonEmptyIds,
            draftResponseTexts: nonEmptyResponses,
            isItDraftOrSubmit: true
        })
            .then(() => window.location.assign(PERZONALISE))
            .catch(error => this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT));
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