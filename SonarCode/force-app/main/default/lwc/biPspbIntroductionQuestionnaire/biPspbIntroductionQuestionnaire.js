// This component is to fill the Introduction questionaries on the “Let’s personalise” page to get a personalized experience of the PSP.
// To import Libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//  To import Apex Classes
import INTRODUCTION_QUESTIONARE from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import SUBMIT_ASSESSMENT_RESPONSE from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_INTRODUCTION from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import DELETE_SELECTED_RESPONSE from '@salesforce/apex/BI_PSP_LetsPersonliseCtrl.draftRespoDeletion';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCompletedAssessmentCountsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
// To import Static Resources
import PSS_IMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import DLQI_IMAGE from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMAGE from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QUALITATIVE_IMAGE from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
// To import Custom Labels
import INTROPAGEONEBOTTOM from '@salesforce/label/c.BI_PSP_IntroBottomTxt';
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WAPI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QUALITATIVE_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import WPAI from '@salesforce/label/c.BI_PSP_WpaiQstnrTxt';
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
import SAVE_AS_DRAFT from '@salesforce/label/c.BI_PSP_DraftButton';
import OUTSTANDING_QUESTIONNAIRE from '@salesforce/label/c.BI_PSP_OutstndngPageTxt';
import RETURN_BACK from '@salesforce/label/c.BI_PSP_ButtonReturnback';
import CONFIRM_SUBMISSION from '@salesforce/label/c.BI_PSP_ButtonConfirmSub';
import CANNOT_BE_EDITED from '@salesforce/label/c.BI_PSP_CannotBeEditedTxt';
import CANCEL from '@salesforce/label/c.BI_PSP_CancelButton';
import CONFIRM from '@salesforce/label/c.BI_PSP_ConfirmButton';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import UNASSIGNEDURL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import POPUP_MESSAGE from '@salesforce/label/c.BI_PSP_MsgPopupTxt';
import SUBMIT_MESSAGE from '@salesforce/label/c.BI_PSP_SubmitLabel';
import QUALITATIVE_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import QUALITATIVE_FOURTEEN_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenWeeks';
import DLQI_URL from '@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl';
import WAPI_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import PSS_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import OUTSTANDING_PAGE from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import COMPLETE_ALL from '@salesforce/label/c.BI_PSP_CompleteAll';
import OTHERS from '@salesforce/label/c.BI_PSP_Others';
// To import current user ID
import Id from '@salesforce/user/Id';
export default class BiPspbIntroductionQuestionnaire extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of variables with @track
	twoMonthsTrueFalse = false;
	@track countQuestion = 15;
	@track isMale = false;
	@track isFemale = false;
	@track isOther = false;
	@track isPrefferNotToSay = false;

	@track isFirstLessThanMonth = false;
	@track isFirstLessSix = false;
	@track isFirstLessYear = false;
	@track isFirstMoreYear = false;

	@track thirdIsNo = false;
	@track thirdIsYes = false;

	@track eighthRadYes = false;
	@track eighthRadNo = false;

	@track fourthCheckRelatFam = false;
	@track fourthCheckWithPartner = false;
	@track fourthCheckSelfEsteem = false;

	@track ninthRadYes = false;
	@track ninthRadNo = false;

	@track tenthCheckAsthma = false;
	@track tenthCheckDiabetes = false;
	@track tenthCheckDepression = false;
	@track tenthCheckHayFever = false;
	@track tenthCheckBp = false;
	@track tenthCheckHighChol = false;
	@track tenthCheckObesity = false;
	@track tenthCheckOsteo = false;
	@track tenthCheckPeptic = false;
	@track tenthCheckplaque = false;
	@track tenthCheckpsoriatic = false;
	@track tenthCheckOthers = false;

	@track afterSixthRadYes = false;
	@track afterSixthRadMaybe = false;
	@track afterSixthRadNo = false;

	@track sixthRadYes = false;
	@track sixthRadMayBe = false;
	@track sixthRadNo = false;

	@track eleventhRadYes = false;
	@track eleventhRadMaybe = false;
	@track eleventhRadNo = false;

	@track secondRadYes = false;
	@track secondRadMaybe = false;
	@track secondRadNo = false;

	@track thirdRadYes = false;
	@track thirdRadMaybe = false;
	@track thirdRadNo = false;

	@track fourthRadYes = false;
	@track fourthRadMaybe = false;
	@track fourthRadNo = false;

	@track seventhRadYes = false;
	@track seventhRadMaybe = false;
	@track seventhRadNo = false;

	@track twelthRadYes = false;
	@track twelthRadMaybe = false;
	@track twelthRadNo = false;

	@track thirteenththRadYes = false;
	@track thirteenththRadMaybe = false;
	@track thirteenththRadNo = false;

	@track forteenththRadYes = false;
	@track forteenthRadMaybe = false;
	@track forteenthRadNo = false;
	@track sixthQuestionVisible = false;

	@track firstQuestionText;
	@track firstQuestionVersinId;
	@track secondQuestionText;
	@track secondQuestionVersinId;
	@track thirdQuestionText;
	@track thirdQuestionVersinId;
	@track fourthQuestionText;
	@track fourthQuestionVersinId;
	@track fifthQuestionText;
	@track fifthQuestionVersinId;
	@track sixthQuestionText;
	@track sixthQuestionVersinId;
	@track seventhQuestionText;
	@track seventhQuestionVersinId;
	@track eightQuestionText;
	@track eightQuestionVersinId;
	@track ninthQuestionText;
	@track ninthQuestionVersinId;
	@track tenthQuestionText;
	@track tenthQuestionVersinId;
	@track eleventhQuestionText;
	@track eleventhQuestionVersinId;
	@track twelthQuestionText;
	@track twelthQuestionVersinId;
	@track thirteeenthQuestionText;
	@track thirteeenthQuestionVersinId;
	@track foteenthQuestionText;
	@track foteenthQuestionVersinId;
	@track fifteenthQuestionText;
	@track fifteenthQuestionVersinId;
	@track sixteenthQuestionText;
	@track sixteenthQuestionVersinId;
	@track seventeethQuestionText;
	@track seventeethQuestionVersinId;
	@track eighteenthQuestionText;
	@track eighteenthQuestionVersinId;

	@track selectedDateRange = '';
	@track selectedGender = '';
	@track selectedGppDiscussion = '';
	@track selectedGppImpact = [];
	@track hasMedicalConditions = '';
	@track showMedicalConditions = false;
	@track selectedMedicalConditions = [];

	@track firstQuestionResponse = '';
	@track secondQuestionResponse = '';
	@track thirdQuestionResponse = '';
	@track fourthQuestionResponse = '';

	@track fifthQuestionresponse = '';
	@track sixthQuestionResponse = '';
	@track seventhQuestionResponse = '';
	@track eightQuestionResponse = '';
	@track ninthQuestionResponse = '';
	@track tenthQuestionResponse = '';
	@track eleventhQuestionResponse = '';

	@track twelvthQuestionResponse = '';
	@track thirteenthQuestionResponse = '';
	@track fourteenthQuestionResponse = '';
	@track fifteenthQuestionResponse = '';
	@track sixteenthQuestionResponse = '';

	@track realAssesVerArra = [];
	@track realRespArray = [];
	@track arrayForPushResp = [];
	@track arrayForPushId = [];

	@track firstRspValue;
	@track firstRespVersId;
	@track secondRspValue;
	@track secondRespVersId;
	@track thirdRspValue;
	@track thirdVersionId;
	@track fourthRspValue;
	@track fourthVersionId;
	@track fifthResonseValue;
	@track fifthVersionId;
	@track sixthResponseValue;
	@track sixthVersiD;
	@track seventhRespalue;
	@track seventhVersiD;
	@track eghtResponseValue;
	@track eightVersiId;
	@track ninthResponseValue;
	@track ninthVersId;
	@track tenthResponseValue;
	@track tenthVersId;
	@track eleventhResponseValue;
	@track eleventhVersiD;
	@track twelvthRespalue;
	@track twelvthVersiD;
	@track thirteenthResponseValue;
	@track thirteenthVersiId;
	@track fourteenthResponseValue;
	@track fourteenthVersId;
	@track fifteenthResponseValue;
	@track fifteenthVersId;
	@track sixteenthResponseValue;
	@track sixteenthVersId;

	@track nameToDraftFirst;
	@track nameToDraftSecond;
	@track nameToDraftThird;
	@track nameToDraftFourth;
	@track nameToDraftFifth;
	@track nameToDraftSixth;
	@track nameToDraftSeventh;
	@track nameToDraftEighth;
	@track nameToDraftNinth;
	@track nameToDrafttenth;
	@track nameToDrafteEleventh;
	@track nameToDrafttwelvth;
	@track nameToDraftThirteenth;
	@track nameToDraftFourteenth;
	@track nameToDraftFifteenth;
	@track nameToDraftSixteenth;
	@track nameToDraftSeventeeth;
	@track eventCheck = false;
	@track numberOfResponses;
	@track checkYesOrNo = false;

	@track totalValu = [];
	@track selectMedic = [];
	@track draftResponses = [];

	@track checkBoxArray;

	@track records = [];

	@track savedArrayForPushResp = [];
	@track concatenatedValues;

	@track showSixteenthQuestion = false;
	@track isConfirmationDialogOpen = false;
	@track customFormModal = false;

	@track submitMessage = SUBMIT_MESSAGE;

	@track selectedValues = [];
	@track customClass = 'nds-form-element nds-form-containerthree';
	@track isDraftSavedPopupOpen = false;
	@track draftSavedMessage = POPUP_MESSAGE;

	@track isPopupOpen = false;
	@track isPopupOpenDraft = false;

	// Declaration of Global variables
	uniqueUncheckedCount = '';
	uniqueCheckedCount = '';
	itsTrue = false;
	message = COMPLETE_ALL;
	trueOrnOt;
	userId = Id;
	propertyProcessedMap = {};
	fourthRecId;
	sixthResponseId;
	knowTheUnChecked;
	fourthCheck;
	knowSixthChecked;
	toShowSixth;
	sixthCheckedArray = [];
	filteredArray = [];
	isEqualLength = false;
	filterArr = '';
	popUpMenu = false;
	theLab = '';
	checkedBoolean;
	unCheckedBoolean;
	urlq;
	questionData = [];
	cardImageDlqi = DLQI_IMAGE;
	cardImagePss = PSS_IMAGE;
	cardImageWpai = WPAI_IMAGE;
	cardImageQsq = QUALITATIVE_IMAGE;
	footerTextMsg = INTROPAGEONEBOTTOM;
	introduction = INTRODUCTION_CATEGORY;
	pss = PSS_CATEGORY;
	dlqi = DLQI_CATEGORY;
	wapi = WAPI_CATEGORY;
	qsq = QUALITATIVE_CATEGORY;
	workActivity = WPAI;
	fifthQuestion = FIFTH_QUESTION;
	sixthQuestion = SIXTH_QUESTION;
	answeredQuestion = 0;
	lessthanMonth = LESSTHAN_A_MONTH;
	lessThanSixMonths = SIXMONTHS;
	lessThanYear = LESS_THAN_YEAR;
	moreThanYear = MORE_THAN_YEAR;
	male = MALE;
	female = FEMALE;
	other = OTHER;
	preferNot = PREFERNOT_TOSAY;
	yes = YES;
	no = NO;
	relationshipWithff = RELATIONSHIPWITH_FF;
	relationshipWithPartner = RELATIONSHIPWITH_PARTNER;
	selfEsteem = SELF_ESTEEM;
	selectAll = SELECT_ALL;

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
	others = OTHERS;
	doYouAgree = DO_YOU_AGREE;
	maybe = MAYBE;

	answered = ANSWERED;
	submit = SUBMIT;
	draftLabel = SAVE_AS_DRAFT;
	outstandingQue = OUTSTANDING_QUESTIONNAIRE;
	returnBack = RETURN_BACK;

	confirmSub = CONFIRM_SUBMISSION;
	cannotEdit = CANNOT_BE_EDITED;
	cancelbt = CANCEL;
	confirmbt = CONFIRM;

	checPrevoiusVal;
	unCheckedResVal;
	uncheckedArray = [];
	uncheckVar;


	sixthDraftVal;
	sixthUnCheckedVals;
	sixthUnChekedArray = [];
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
	handleResizeBound;
	targetElement;
	stqsq = 0;
	stdlq = 0;
	stpss = 0;
	stwai = 0;
	//Below defined getter method to determine the CSS class for the  popup container based on its visibility
	get popupClass() {
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}

	get popupClassSaveDraft() {
		return this.isDraftSavedPopupOpen
			? 'popup-containersaveasdr'
			: 'popup-containersaveasdr hidden';
	}

	get popupClass1() {
		return this.isPopupOpenDraft ? 'popup2-container' : 'popup2-container hidden';
	}

	// Method to hide both main and secondary popups
	customHideModalPopup() {
		this.customFormModal = false;
		this.isPopupOpen = false;
		this.isPopupOpenDraft = false;
	}

	//to check whether the page is in Brandd or unassigned.Also to check the desktop view
	renderedCallback() {
		try {
			let currentURL = window.location.href;

			let urlObject = new URL(currentURL);

			let path = urlObject.pathname;

			let pathComponents = path.split('/');

			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNEDURL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVI;
			} else {
				this.urlq = UNASSIGNED_URL_NAVI;
			}

			this.isDesktop = this.isDesktopView();

			// Bind the event handler once and store it in a variable
			this.handleResizeBound = this.handleResize.bind(this);

			// Add the event listener using the bound handler
			window.addEventListener('resize', this.handleResizeBound);
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from LWC
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

	// Wire adapter to fetch patient data after three months and fourteen weeks
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				// Assign fetched data to component properties
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.targetDateTwoMonths = data.targetTwoMonthsDate ?? null;
				this.targetDateFourteenWks = data.targetFourteenWeeksDate ?? null;
			}
			else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);// Catching Potential from LWC
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
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
			}
			else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);// Catching Potential from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);// Catching Potential from LWC
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
		if (this.targetDateFourteenWks === null && this.targetDateTwoMonths === null) {
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
				this.answeredQuestion = this.records.length;
				this.draftResponsesforlater();

				// Loop through each record to check conditions
				this.records.forEach((record) => {
					if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === this.yes
					) {
						this.countQuestion = 16;
						this.answeredQuestion = this.records.length;
					} else if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === this.no
					) {
						this.answeredQuestion = this.records.length;
					}
				});

				// Check if the answer question count exceeds a certain threshold
				if (this.answeredQuestion > this.countQuestion) {
					this.countQuestion = 16;
				}
			}
			else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);// Catching Potential from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);// Catching Potential from LWC
		}
	}
	//this method is for storing the draft response and its version id so that we can use these variables to save the draft response later ,also in this method we will be making the radio buttons as checked if the draft values matches with the values that are stored in to variables with their respective radio option values.

	draftResponsesforlater() {
		let targetFemale = this.female;
		let targetMale = this.male;
		let targetOther = this.other;
		let prefferNotTosay = this.preferNot;

		let firstLessThanMonth = this.lessthanMonth;
		let firstLessThanSix = this.lessThanSixMonths;
		let firstLessThanYr = this.lessThanYear;
		let firstMoreThan = this.moreThanYear;

		let thirdAnswerRF = this.relationshipWithff;
		let thirdRWP = this.relationshipWithPartner;
		let thirdSelEstee = this.selfEsteem;

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
					this.isPrefferNotToSay = true;
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
				this.fourthRecId = record.Id;
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
				this.sixthResponseId = record.Id;

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
					this.customClass = 'nds-form-element nds-form-containertwo'
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
						this.customClass = 'nds-form-element nds-form-containerthree'
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
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);// Catching Potential from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);// Catching Potential from LWC
		}
	}

	//below are the handlers that handles the resposnes from user input(16 hhandlers)
	handleFirstQuestionChange(event) {
		this.nameOfQuestion = event.target.name;
		let chekVal = event.target.value;
		if (chekVal === this.lessthanMonth) {
			this.isFirstLessThanMonth = true;
		} else {
			this.isFirstLessThanMonth = false;
		}

		if (chekVal === this.lessThanSixMonths) {
			this.isFirstLessSix = true;
		} else {
			this.isFirstLessSix = false;
		}

		if (chekVal === this.lessThanYear) {
			this.isFirstLessYear = true;
		} else {
			this.isFirstLessYear = false;
		}

		if (chekVal === this.moreThanYear) {
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

		if (checkedVal === this.preferNot) {
			this.isPrefferNotToSay = true;
		} else {
			this.isPrefferNotToSay = false;
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
			this.secondRspValue = this.getLastRespValue();
			// Get the last response version id
			this.secondRespVersId = this.getLastIdValue();
		}
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
		this.eghtResponseValue = this.getLastRespValue();
		this.eightVersiId = this.getLastIdValue();
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
			this.thirdRspValue = this.getLastRespValue();
			this.thirdVersionId = this.getLastIdValue();
		}
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
		this.ninthResponseValue = this.getLastRespValue();
		this.ninthVersId = this.getLastIdValue();
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
		this.fifteenthResponseValue = this.getLastRespValue();

		this.fifteenthVersId = this.getLastIdValue();
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
		this.fourteenthResponseValue = this.getLastRespValue();

		this.fourteenthVersId = this.getLastIdValue();
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

		this.thirteenthResponseValue = this.getLastRespValue();
		this.thirteenthVersiId = this.getLastIdValue();
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

		this.twelvthRespalue = this.getLastRespValue();
		this.twelvthVersiD = this.getLastIdValue();
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
		this.eleventhResponseValue = this.getLastRespValue();
		this.eleventhVersiD = this.getLastIdValue();
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

		this.tenthResponseValue = this.getLastRespValue();
		this.tenthVersId = this.getLastIdValue();
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

		this.seventhRespalue = this.getLastRespValue();
		this.seventhVersiD = this.getLastIdValue();
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

		this.sixthResponseValue = this.getLastRespValue();
		this.sixthVersiD = this.getLastIdValue();

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

		this.sixteenthResponseValue = this.getLastRespValue();
		this.sixteenthVersId = this.getLastIdValue();
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

		this.fifthResonseValue = this.getLastRespValue();

		this.fifthVersionId = this.getLastIdValue();

		let val = event.target.value;
		//if the value of the fifth Question is yes then total number of question will be 16 otherwise 15.
		if (val === this.yes) {
			this.fifthRadYes = true;
			this.fifthRadNo = false;
			this.countQuestion = 16;
			this.customClass = 'nds-form-element nds-form-containertwo'
		}

		if (val === this.no) {

			this.fifthRadNo = true;
			this.fifthRadYes = false;
			this.sixthQuestionVisible = false;
			this.customClass = 'nds-form-element nds-form-containerthree'
			this.deleteYesBasedRes();
			//if the response value is No then we will delete the repsones of sixth Questions and also make the checkboxes as unchecked.
			let fifthIdStore = this.sixthResponseId;

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
					this.sixthResponseValue = '';
					this.sixthVersiD = '';
					this.sixthQResForEach = '';
					this.sixthQVersionResForEach = '';

				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});

			this.countQuestion = 15;
		}
	}

	handleFourthQuestionChange(event) {
		this.checPrevoiusVal = this.fourQResForEach;

		let checkval = event.target.value;

		if (checkval === this.relationshipWithff) {
			this.fourthCheckRelatFam = true;
		}

		if (checkval === this.relationshipWithPartner) {
			this.fourthCheckWithPartner = true;
		}

		if (checkval === this.selfEsteem) {
			this.fourthCheckSelfEsteem = true;
		}

		let checkBoval = event.target.checked;

		if (checkBoval) {
			this.fourthCheck = this.yes;
		} else {
			this.unCheckedResVal = event.target.value;
			this.uncheckedArray.push(this.unCheckedResVal);

			let unchVal = event.target.value;

			this.knowTheUnChecked = this.yes;
			if (unchVal === this.relationshipWithff) {
				this.fourthCheckRelatFam = false;
			}

			if (unchVal === this.relationshipWithPartner) {
				this.fourthCheckWithPartner = false;
			}

			if (unchVal === this.selfEsteem) {
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

		this.fourthRspValue = this.getLastRespValue();
		this.fourthVersionId = this.getLastIdValue();
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
	//Navigation to other Questionnaire Pages
	navigateToCategory2() {
		window.location.assign(this.urlq + DLQI_URL);
	}
	navigateToCategory3() {
		window.location.assign(this.urlq + PSS_QUESTIONNAIRE_URL);
	}
	navigateToCategory4() {
		window.location.assign(this.urlq + WAPI_QUESTIONNAIRE);
	}
	navigateToCategory5() {
		if (this.targetDateFourteenWks !== null) {
			window.location.assign(this.urlq + QUALITATIVE_FOURTEEN_MONTHS);
		} else {
			window.location.assign(this.urlq + QUALITATIVE_TWO_MONTHS);
		}
	}

	//When clicked on Return back to Question buttton.This will close the popup and show you the page with all the previous response selection just before clicking the button.
	closePopup1() {
		this.resetPopupDraftState();
		this.resetPopupState();
		this.updateArrays();
		this.updateCheckedConditions();
		this.updateRadios();
	}

	resetPopupDraftState() {
		this.sixthCheckedArray = [];
		this.sixthUnChekedArray = [];
		this.filteredArray = [];
		this.filterArr = 'true';

		if (this.sixthResponseValue === '' && this.sixthQResForEach === '') {
			this.unCheckedBoolean = false;
		}
	}

	resetPopupState() {
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.isPopupOpenDraft = false;
		this.popUpMenu = false;
	}

	updateArrays() {
		const values = this.totalValu.slice(0, 3);
		const concatenatedValues = this.concatenateValues(...values);

		const commonArray = this.getCommonArray();
		const concatenatedMedicValues = this.concatenateValues(...commonArray);

		this.updateFourthChecks(concatenatedValues);
		this.updateMedicalConditionsChecks(concatenatedMedicValues);
	}

	concatenateValues(...values) {
		return [...new Set(values.filter(value => value !== undefined))].join(', ');
	}


	updateFourthChecks(concatenatedValues) {
		const { relationshipWithff: fam, relationshipWithPartner: partner, selfEsteem } = this;

		if (this.knowTheUnChecked === '' && this.fourthCheck !== '') {
			this.fourthCheckRelatFam = concatenatedValues.includes(fam);
			this.fourthCheckWithPartner = concatenatedValues.includes(partner);
			this.fourthCheckSelfEsteem = concatenatedValues.includes(selfEsteem);
		} else if (this.knowTheUnChecked !== '' && this.fourthCheck === '') {
			this.fourthCheckRelatFam = !concatenatedValues.includes(fam);
			this.fourthCheckWithPartner = !concatenatedValues.includes(partner);
			this.fourthCheckSelfEsteem = !concatenatedValues.includes(selfEsteem);
		}
	}

	//When clicked on cancelbuttton.This will close the popup and show you the page with all the previous responses just before clicking the button.
	closePopup() {
		this.resetPopupStateForConfirm();
		this.updateFormModalState();
		this.updateResponseStates();
		this.updateMedicalConditions();
		this.updateRadios();
	}

	resetPopupStateForConfirm() {
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.isPopupOpen = false;
		this.isPopupOpenDraft = false;
		this.popUpMenu = false;
	}

	updateFormModalState() {
		let fam = this.relationshipWithff;
		let partner = this.relationshipWithPartner;
		let selfEsteem = this.selfEsteem;

		let firstValue = this.getTotalValueAtIndex(0);
		let secondValue = this.getTotalValueAtIndex(1);
		let thirdValue = this.getTotalValueAtIndex(2);

		let concatenatedValues = this.concatenateValues(firstValue, secondValue, thirdValue);
		let concatenatedMedicValues = this.getConcatenatedMedicValues();
		// Create an object to encapsulate the family and partner parameters
		let familyPartnerData = {
			fam,
			partner,
			selfEsteem,
			concatenatedValues
		};

		this.updateFamilyAndPartnerChecks(familyPartnerData);
		this.updateMedicalConditionsChecks(concatenatedMedicValues);
	}

	getTotalValueAtIndex(index) {
		return index < this.totalValu.length ? this.totalValu[index] : undefined;
	}


	getConcatenatedMedicValues() {
		let commonArray = this.getCommonArray();
		return this.concatenateValues(...commonArray);
	}

	getCommonArray() {
		let commonArray = [];
		const conditions = [
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
		];
		conditions.forEach(cond => {
			if (cond.flag) commonArray.push(cond.value);
		});
		return commonArray;
	}

	updateFamilyAndPartnerChecks({concatenatedValues, fam, partner, selfEsteem }) {
		if (this.knowTheUnChecked === '' && this.fourthCheck !== '') {
			this.fourthCheckRelatFam = concatenatedValues.includes(fam);
			this.fourthCheckWithPartner = concatenatedValues.includes(partner);
			this.fourthCheckSelfEsteem = concatenatedValues.includes(selfEsteem);
		} else if (this.knowTheUnChecked !== '' && this.fourthCheck === '') {
			this.fourthCheckRelatFam = !concatenatedValues.includes(fam);
			this.fourthCheckWithPartner = !concatenatedValues.includes(partner);
			this.fourthCheckSelfEsteem = !concatenatedValues.includes(selfEsteem);
		}
	}

	updateMedicalConditionsChecks(concatenatedMedicValues) {
		const medicalConditions = [
			{ value: this.asthma, check: 'tenthCheckAsthma' },
			{ value: this.diabetes, check: 'tenthCheckDiabetes' },
			{ value: this.depression, check: 'tenthCheckDepression' },
			{ value: this.hayFever, check: 'tenthCheckHayFever' },
			{ value: this.hypertension, check: 'tenthCheckBp' },
			{ value: this.highcholestrol, check: 'tenthCheckHighChol' },
			{ value: this.obesityc, check: 'tenthCheckObesity' },
			{ value: this.osteoporosisc, check: 'tenthCheckOsteo' },
			{ value: this.ulcer, check: 'tenthCheckPeptic' },
			{ value: this.psoriasis, check: 'tenthCheckplaque' },
			{ value: this.psoriaticarthritis, check: 'tenthCheckpsoriatic' },
			{ value: this.others, check: 'tenthCheckOthers' }
		];
		medicalConditions.forEach(cond => {
			this[cond.check] = concatenatedMedicValues.includes(cond.value);
		});
	}

	updateRadios() {
		this.updateRadioState({
			response: this.fifthQuestionresponse, yesValue: this.yes, noValue: this.no,
			yesKey: 'fifthRadYes', noKey: 'fifthRadNo'
		});

		this.updateRadioState({
			response: this.secondQuestionResponse, yesValue: this.male, noValue: this.female,
			maybeValue: this.other, yesKey: 'isMale', noKey: 'isFemale', maybeKey: 'isOther'
		});

		this.updateRadioState({
			response: this.eightQuestionResponse, yesValue: this.yes, noValue: this.no,
			maybeValue: this.maybe, yesKey: 'sixthRadYes', noKey: 'sixthRadNo', maybeKey: 'sixthRadMayBe'
		});

		this.updateRadioState({
			response: this.sixteenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'forteenththRadYes', noKey: 'forteenthRadNo', maybeKey: 'forteenthRadMaybe'
		});

		this.updateRadioState({
			response: this.fifteenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'thirteenththRadYes', noKey: 'thirteenththRadNo', maybeKey: 'thirteenththRadMaybe'
		});

		this.updateRadioState({
			response: this.ninthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'eleventhRadYes', noKey: 'eleventhRadNo', maybeKey: 'eleventhRadMaybe'
		});

		this.updateRadioState({
			response: this.tenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'secondRadYes', noKey: 'secondRadNo', maybeKey: 'secondRadMaybe'
		});

		this.updateRadioState({
			response: this.firstQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'firstRadYes', maybeKey: 'firstRadMaybe', noKey: 'firstRadNo'
		});

		this.updateRadioState({
			response: this.eleventhQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'thirdRadYes', maybeKey: 'thirdRadMaybe', noKey: 'thirdRadNo'
		});

		this.updateRadioState({
			response: this.secondQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'secondRadYes', maybeKey: 'secondRadMaybe', noKey: 'secondRadNo'
		});

		this.updateRadioState({
			response: this.thirdQuestionResponse, yesValue: this.yes,
			noValue: this.no, yesKey: 'thirdIsYes', noKey: 'thirdIsNo'
		});

		this.updateRadioState({
			response: this.seventhQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'afterSixthRadYes', maybeKey: 'afterSixthRadMaybe', noKey: 'afterSixthRadNo'
		});

		this.updateRadioState({
			response: this.twelvthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'fourthRadYes', maybeKey: 'fourthRadMaybe', noKey: 'fourthRadNo'
		});


		this.updateRadioState({
			response: this.thirteenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'seventhRadYes', maybeKey: 'seventhRadMaybe', noKey: 'seventhRadNo'
		});

		this.updateRadioState({
			response: this.fourteenthQuestionResponse, yesValue: this.yes,
			noValue: this.no, maybeValue: this.maybe, yesKey: 'twelthRadYes', maybeKey: 'twelthRadMaybe', noKey: 'twelthRadNo'
		});
	}

	updateRadioState({ response, yesValue, noValue, maybeValue, yesKey, noKey, maybeKey }) {
		this[yesKey] = response === yesValue;
		this[noKey] = response === noValue;
		if (maybeValue !== undefined) {
			this[maybeKey] = response === maybeValue;
		}
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

		if (
			typeof this.sevenQResForEach !== 'undefined' &&
			this.sevenQResForEach !== ''
		) {
			this.nameToDraftSeventh = 'firstRes';
		}
		if (
			typeof this.eigthQResForEach !== 'undefined' &&
			this.eigthQResForEach !== ''
		) {
			this.nameToDraftEighth = 'firstRes';
		}
		if (
			typeof this.nineQResForEach !== 'undefined' &&
			this.nineQResForEach !== ''
		) {
			this.nameToDraftNinth = 'firstRes';
		}
		if (
			typeof this.tenthQResForEach !== 'undefined' &&
			this.tenthQResForEach !== ''
		) {
			this.nameToDrafttenth = 'firstRes';
		}
		if (
			typeof this.eleventhQResForEach !== 'undefined' &&
			this.eleventhQResForEach !== ''
		) {
			this.nameToDrafteEleventh = 'firstRes';
		}
		if (
			typeof this.twelthQResForEach !== 'undefined' &&
			this.twelthQResForEach !== ''
		) {
			this.nameToDrafttwelvth = 'firstRes';
		}
		if (
			typeof this.thirteenthQResForEach !== 'undefined' &&
			this.thirteenthQResForEach !== ''
		) {
			this.nameToDraftThirteenth = 'firstRes';
		}
		if (
			typeof this.fourteenthQResForEach !== 'undefined' &&
			this.fourteenthQResForEach !== ''
		) {
			this.nameToDraftFourteenth = 'firstRes';
		}
		if (
			typeof this.fifteenthQResForEach !== 'undefined' &&
			this.fifteenthQResForEach !== ''
		) {
			this.nameToDraftFifteenth = 'firstRes';
		}
		if (
			typeof this.sixteenthQResForEach !== 'undefined' &&
			this.sixteenthQResForEach !== ''
		) {
			this.nameToDraftSixteenth = 'firstRes';
		}

		//the below if conditions will determine which pop up to show
		if (
			typeof this.nameToDraftSixth === 'undefined' &&
			typeof this.nameToDraftFirst === 'undefined' &&
			typeof this.nameToDraftSecond === 'undefined' &&
			typeof this.nameToDraftThird === 'undefined' &&
			typeof this.nameToDraftFifth === 'undefined' &&
			typeof this.nameToDraftSeventh === 'undefined' &&
			typeof this.nameToDraftEighth === 'undefined' &&
			typeof this.nameToDraftNinth === 'undefined' &&
			typeof this.nameToDrafttenth === 'undefined' &&
			typeof this.nameToDrafteEleventh === 'undefined' &&
			typeof this.nameToDrafttwelvth === 'undefined' &&
			typeof this.nameToDraftThirteenth === 'undefined' &&
			typeof this.nameToDraftFourteenth === 'undefined' &&
			typeof this.nameToDraftFifteenth === 'undefined' &&
			typeof this.nameToDraftSixteenth === 'undefined'
		) {

			this.customFormModal = true;
			this.isPopupOpenDraft = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		}

		if (
			typeof this.nameToDraftSixth === 'undefined' &&
			typeof this.nameToDraftFirst !== 'undefined' &&
			typeof this.nameToDraftSecond !== 'undefined' &&
			typeof this.nameToDraftThird !== 'undefined' &&
			typeof this.nameToDraftFifth !== 'undefined' &&
			typeof this.nameToDraftSeventh !== 'undefined' &&
			typeof this.nameToDraftEighth !== 'undefined' &&
			typeof this.nameToDraftNinth !== 'undefined' &&
			typeof this.nameToDrafttenth !== 'undefined' &&
			typeof this.nameToDrafteEleventh !== 'undefined' &&
			typeof this.nameToDrafttwelvth !== 'undefined' &&
			typeof this.nameToDraftThirteenth !== 'undefined' &&
			typeof this.nameToDraftFourteenth !== 'undefined' &&
			typeof this.nameToDraftFifteenth !== 'undefined' &&
			typeof this.nameToDraftSixteenth !== 'undefined'
		) {
			if (
				typeof this.fifthResonseValue === 'undefined' &&
				this.fifthQResForEach === this.no &&
				typeof this.sixthResponseValue === 'undefined' &&
				this.sixthQResForEach === ''
			) {

				this.customFormModal = true;
				this.isPopupOpenDraft = false;
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
				this.isPopupOpenDraft = false;
				this.isPopupOpen = true;
				this.checkYesOrNo = false;
			}

			if (
				this.fifthQResForEach === this.yes &&
				typeof this.sixthResponseValue === 'undefined' &&
				typeof this.sixthQResForEach === 'undefined'
			) {

				this.customFormModal = true;
				this.isPopupOpenDraft = true;
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
				this.isPopupOpenDraft = true;
				this.isPopupOpen = false;
				this.checkYesOrNo = false;
			}
		} else {

			this.customFormModal = true;
			this.isPopupOpenDraft = true;
			this.isPopupOpen = false;
			this.checkYesOrNo = false;
		}

		if (
			typeof this.nameToDraftFirst !== 'undefined' &&
			typeof this.nameToDraftSecond !== 'undefined' &&
			typeof this.nameToDraftThird !== 'undefined' &&
			typeof this.nameToDraftFifth !== 'undefined' &&
			typeof this.nameToDraftSixth !== 'undefined' &&
			typeof this.nameToDraftSeventh !== 'undefined' &&
			typeof this.nameToDraftEighth !== 'undefined' &&
			typeof this.nameToDraftNinth !== 'undefined' &&
			typeof this.nameToDrafttenth !== 'undefined' &&
			typeof this.nameToDrafteEleventh !== 'undefined' &&
			typeof this.nameToDrafttwelvth !== 'undefined' &&
			typeof this.nameToDraftThirteenth !== 'undefined' &&
			typeof this.nameToDraftFourteenth !== 'undefined' &&
			typeof this.nameToDraftFifteenth !== 'undefined' &&
			typeof this.nameToDraftSixteenth !== 'undefined'
		) {
			if (this.sixthQResForEach !== '') {
				if (
					(this.fifthResonseValue === this.yes ||
						this.fifthQResForEach === this.yes) &&
					this.isEqualLength === true
				) {

					this.customFormModal = true;

					this.isPopupOpenDraft = true;
					this.isPopupOpen = false;
					this.checkYesOrNo = false;
				}

				if (
					this.fifthResonseValue === this.yes &&
					this.fifthQResForEach === this.no &&
					this.isEqualLength === false
				) {

					this.customFormModal = true;
					this.isPopupOpenDraft = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (this.fifthQResForEach === this.yes && this.isEqualLength === false) {

					this.customFormModal = true;
					this.isPopupOpenDraft = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (this.fifthQResForEach === this.yes && this.isEqualLength === true) {

					this.customFormModal = true;
					this.isPopupOpenDraft = true;
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

					this.isPopupOpenDraft = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (
					this.fifthResonseValue === this.yes &&
					typeof this.sixthResponseValue !== 'undefined' &&
					this.isEqualLength === false &&
					this.sixthResponseValue !== ''
				) {


					this.customFormModal = true;

					this.isPopupOpenDraft = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}

				if (
					(this.fifthResonseValue === this.yes ||
						this.fifthQResForEach === this.yes) &&
					this.isEqualLength === false &&
					this.knowSixthChecked === false
				) {

					this.customFormModal = true;
					this.isPopupOpenDraft = false;
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
					this.isPopupOpenDraft = false;
					this.isPopupOpen = true;
					this.checkYesOrNo = false;
				}
			}
		}
	}

	//hiding the popup
	get popuphide() {
		if (this.popUpMenu === true) {
			return this.popUpMenu === true ? 'disabled' : '';
		}
		return '';
	}
	//on click of the draft button
	saveAsDraft() {

		if (this.isDesktop) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		this.popUpMenu = true;
		//this class variable will be passed as a parameter
		this.checkinc = 0;

		let fourthResponseArray = [];

		if (this.fourthCheckRelatFam === true) {
			fourthResponseArray.push(this.relationshipWithff);
		}

		if (this.fourthCheckWithPartner === true) {
			fourthResponseArray.push(this.relationshipWithPartner);
		}

		if (this.fourthCheckSelfEsteem === true) {
			fourthResponseArray.push(this.selfEsteem);
		}


		let fourthResponse = [
			...new Set(
				fourthResponseArray.filter(
					(value) => value !== undefined
				)
			)
		].join(', ');

		this.fourthRspValue = '';
		//pass the value to the fOURTH questions repsone
		this.fourthRspValue = fourthResponse;
		//same process goes for the below one

		// Initialize an empty array to store the common values
		let commonArray = [];

		if (this.tenthCheckAsthma === true) {
			commonArray.push(this.asthma);
		}

		if (this.tenthCheckDiabetes === true) {
			commonArray.push(this.diabetes);
		}

		if (this.tenthCheckDepression === true) {
			commonArray.push(this.depression);
		}

		if (this.tenthCheckHayFever === true) {

			commonArray.push(this.hayFever);
		}

		if (this.tenthCheckBp === true) {
			commonArray.push(this.hypertension);
		}

		if (this.tenthCheckHighChol === true) {
			commonArray.push(this.highcholestrol);
		}

		if (this.tenthCheckObesity === true) {
			commonArray.push(this.obesityc);
		}

		if (this.tenthCheckOsteo === true) {
			commonArray.push(this.osteoporosisc);
		}

		if (this.tenthCheckPeptic === true) {
			commonArray.push(this.ulcer);
		}

		if (this.tenthCheckplaque === true) {
			commonArray.push(this.psoriasis);
		}

		if (this.tenthCheckpsoriatic === true) {
			commonArray.push(this.psoriaticarthritis);
		}

		if (this.tenthCheckOthers === true) {
			commonArray.push(this.others);
		}

		let concatenatedMedicValues = [
			...new Set(
				commonArray.filter(
					(value) => value !== undefined
				)
			)
		].join(', ');

		this.sixthResponseValue = '';

		this.sixthResponseValue = concatenatedMedicValues;

		// the if conditions checks the resposnes and draft respsones
		if (this.firstQuestionResponse === '' && this.firstQResForEach !== '') {
			//push the draft respone of first queston
			this.realRespArray.push(this.firstQResForEach);
			//push the draft respone verison id of first queston
			this.realAssesVerArra.push(this.firstQVersionResForEach);
		} else {
			//push the repsones and ids to arrays
			this.realRespArray.push(this.firstRspValue);
			this.realAssesVerArra.push(this.firstRespVersId);
		}

		if (this.secondQuestionResponse === '' && this.secQResForEach !== null) {
			this.realRespArray.push(this.secQResForEach);
			this.realAssesVerArra.push(this.secQVersionResForEach);
		} else {
			this.realRespArray.push(this.secondRspValue);
			this.realAssesVerArra.push(this.secondRespVersId);
		}

		if (this.thirdQuestionResponse === '' && this.thirdQResForEach !== '') {
			this.realRespArray.push(this.thirdQResForEach);
			this.realAssesVerArra.push(this.thirdQVersionResForEach);
		} else {
			this.realRespArray.push(this.thirdRspValue);
			this.realAssesVerArra.push(this.thirdVersionId);
		}

		if (this.fourthQuestionResponse === '' && this.fourQResForEach !== '') {
			this.realRespArray.push(this.fourQResForEach);
			this.realAssesVerArra.push(this.fourQVersionResForEach);
		} else {
			this.realRespArray.push(this.fourthRspValue);
			if (this.fourthRspValue === '') {
				this.fourthVersionId = '';

				this.realAssesVerArra.push(this.fourthVersionId);

				let dsds = this.fourthRecId;

				DELETE_SELECTED_RESPONSE({ idOfRes: dsds })
					.then(() => {
						this.fourthCheckRelatFam = false;
						this.fourthCheckWithPartner = false;
						this.fourthCheckSelfEsteem = false;
					})
					.catch((error) => {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
					});
			}
			this.realAssesVerArra.push(this.fourthVersionId);
		}

		if (this.fifthQuestionresponse === '' && this.fifthQResForEach !== '') {
			this.realRespArray.push(this.fifthQResForEach);
			this.realAssesVerArra.push(this.fifthQVersionResForEach);
		} else {
			this.realRespArray.push(this.fifthResonseValue);
			this.realAssesVerArra.push(this.fifthVersionId);
		}
		if (this.sixthQuestionResponse === '' && this.sixthQResForEach !== '') {
			this.realRespArray.push(this.sixthQResForEach);

			this.realAssesVerArra.push(this.sixthQVersionResForEach);
		} else {
			this.realRespArray.push(this.sixthResponseValue);
			if (this.sixthResponseValue === '') {
				this.sixthVersiD = '';
				this.realAssesVerArra.push(this.sixthVersiD);
				//this will delete the fifth repsoonses
				let fifthIdStore = this.sixthResponseId;
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
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
					});
			}
			this.realAssesVerArra.push(this.sixthVersiD);
		}

		if (this.seventhQuestionResponse === '' && this.sevenQResForEach !== '') {
			this.realRespArray.push(this.sevenQResForEach);
			this.realAssesVerArra.push(this.sevenQVersionResForEach);
		} else {
			this.realRespArray.push(this.seventhRespalue);
			this.realAssesVerArra.push(this.seventhVersiD);
		}

		if (this.eightQuestionResponse === '' && this.eigthQResForEach !== '') {
			this.realRespArray.push(this.eigthQResForEach);
			this.realAssesVerArra.push(this.eigthQVersionResForEach);
		} else {
			this.realRespArray.push(this.eghtResponseValue);
			this.realAssesVerArra.push(this.eightVersiId);
		}
		if (this.ninthQuestionResponse === '' && this.nineQResForEach !== '') {
			this.realRespArray.push(this.nineQResForEach);
			this.realAssesVerArra.push(this.nineQVersionResForEach);
		} else {
			this.realRespArray.push(this.ninthResponseValue);
			this.realAssesVerArra.push(this.ninthVersId);
		}

		if (this.tenthQuestionResponse === '' && this.tenthQResForEach !== '') {
			this.realRespArray.push(this.tenthQResForEach);
			this.realAssesVerArra.push(this.tenthQVersionResForEach);
		} else {
			this.realRespArray.push(this.tenthResponseValue);
			this.realAssesVerArra.push(this.tenthVersId);
		}

		if (
			this.eleventhQuestionResponse === '' &&
			this.eleventhQResForEach !== ''
		) {
			this.realRespArray.push(this.eleventhQResForEach);
			this.realAssesVerArra.push(this.eleventhQVersionResForEach);
		} else {
			this.realRespArray.push(this.eleventhResponseValue);
			this.realAssesVerArra.push(this.eleventhVersiD);
		}

		if (this.twelvthQuestionResponse === '' && this.twelthQResForEach !== '') {
			this.realRespArray.push(this.twelthQResForEach);
			this.realAssesVerArra.push(this.twelthQVersionResForEach);
		} else {
			this.realRespArray.push(this.twelvthRespalue);
			this.realAssesVerArra.push(this.twelvthVersiD);
		}

		if (
			this.thirteenthQuestionResponse === '' &&
			this.thirteenthQResForEach !== ''
		) {
			this.realRespArray.push(this.thirteenthQResForEach);
			this.realAssesVerArra.push(this.thirteenthQVersionResForEach);
		} else {
			this.realRespArray.push(this.thirteenthResponseValue);
			this.realAssesVerArra.push(this.thirteenthVersiId);
		}

		if (
			this.fourteenthQuestionResponse === '' &&
			this.fourteenthQResForEach !== ''
		) {
			this.realRespArray.push(this.fourteenthQResForEach);
			this.realAssesVerArra.push(this.fourteenthQVersionResForEach);
		} else {

			this.realRespArray.push(this.fourteenthResponseValue);
			this.realAssesVerArra.push(this.fourteenthVersId);
		}
		if (
			this.fifteenthQuestionResponse === '' &&
			this.fifteenthQResForEach !== ''
		) {
			this.realRespArray.push(this.fifteenthQResForEach);
			this.realAssesVerArra.push(this.fifteenthQVersionResForEach);
		} else {

			this.realRespArray.push(this.fifteenthResponseValue);
			this.realAssesVerArra.push(this.fifteenthVersId);

		}
		if (
			this.sixteenthQuestionResponse === '' &&
			this.sixteenthQResForEach !== ''
		) {
			this.realRespArray.push(this.sixteenthQResForEach);
			this.realAssesVerArra.push(this.sixteenthQVersionResForEach);
		} else {
			this.realRespArray.push(this.sixteenthResponseValue);
			this.realAssesVerArra.push(this.sixteenthVersId);
		}
		//non empty repsones by filtering out empty elements
		let nonEmptyResponses = this.realRespArray.filter(
			(response) => response !== ''
		);
		//non empty ids by filtering out empty elements
		let nonEmptyIds = this.realAssesVerArra.filter((id) => id !== '');
		//this holds the value as zero to say that this is a sved as draft

		if (nonEmptyResponses.length > 0) {
			//submitting the darft repsonse
			SUBMIT_ASSESSMENT_RESPONSE({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: false,
				isQsqAfterTwoMonths: false
			})
				.then(() => {
					this.customFormModal = false;
					this.closePopup1 = false;
					this.checkYesOrNo = false;
					//this will open the save as draft popup
					this.popUpMetod();
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
		else {
			window.location.assign(this.urlq + OUTSTANDING_PAGE);
		}
	}
	//save as draft popup
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
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error
		}
	}
	//closes the save as draft popup
	closeDraftSavedPopup() {
		this.isDraftSavedPopupOpen = false;
		window.location.assign(this.urlq + OUTSTANDING_PAGE);
	}
	//on click of the confirm button the same process goes here for the same as in save as draft
	confirmSubmission() {
		this.checkinc = 1;

		let fourthResponseArray = [];

		if (this.fourthCheckRelatFam === true) {
			fourthResponseArray.push(this.relationshipWithff);
		}

		if (this.fourthCheckWithPartner === true) {
			fourthResponseArray.push(this.relationshipWithPartner);
		}

		if (this.fourthCheckSelfEsteem === true) {
			fourthResponseArray.push(this.selfEsteem);
		}


		let fourthResponse = [
			...new Set(
				fourthResponseArray.filter(
					(value) => value !== undefined
				)
			)
		].join(', ');

		this.fourthRspValue = '';
		//pass the value to the fOURTH questions repsone
		this.fourthRspValue = fourthResponse;
		//same process goes for the below one



		// Initialize an empty array to store the common values
		let commonArray = [];

		if (this.tenthCheckAsthma === true) {
			commonArray.push(this.asthma);
		}

		if (this.tenthCheckDiabetes === true) {
			commonArray.push(this.diabetes);
		}

		if (this.tenthCheckDepression === true) {
			commonArray.push(this.depression);
		}

		if (this.tenthCheckHayFever === true) {
			commonArray.push(this.hayFever);
		}

		if (this.tenthCheckBp === true) {
			commonArray.push(this.hypertension);
		}

		if (this.tenthCheckHighChol === true) {
			commonArray.push(this.highcholestrol);
		}

		if (this.tenthCheckObesity === true) {
			commonArray.push(this.obesityc);
		}

		if (this.tenthCheckOsteo === true) {
			commonArray.push(this.osteoporosisc);
		}

		if (this.tenthCheckPeptic === true) {
			commonArray.push(this.ulcer);
		}

		if (this.tenthCheckplaque === true) {
			commonArray.push(this.psoriasis);
		}

		if (this.tenthCheckpsoriatic === true) {
			commonArray.push(this.psoriaticarthritis);
		}

		if (this.tenthCheckOthers === true) {
			commonArray.push(this.others);
		}

		let concatenatedMedicValues = [
			...new Set(
				commonArray.filter(
					(value) => value !== undefined
				)
			)
		].join(', ');

		this.sixthResponseValue = '';

		this.sixthResponseValue = concatenatedMedicValues;


		if (this.firstQuestionResponse === '' && this.firstQResForEach !== '') {
			this.realRespArray.push(this.firstQResForEach);
			this.realAssesVerArra.push(this.firstQVersionResForEach);
		} else {
			this.realRespArray.push(this.firstRspValue);
			this.realAssesVerArra.push(this.firstRespVersId);
		}

		if (this.secondQuestionResponse === '' && this.secQResForEach !== null) {
			this.realRespArray.push(this.secQResForEach);
			this.realAssesVerArra.push(this.secQVersionResForEach);
		} else {
			this.realRespArray.push(this.secondRspValue);
			this.realAssesVerArra.push(this.secondRespVersId);
		}

		if (this.thirdQuestionResponse === '' && this.thirdQResForEach !== '') {
			this.realRespArray.push(this.thirdQResForEach);
			this.realAssesVerArra.push(this.thirdQVersionResForEach);
		} else {
			this.realRespArray.push(this.thirdRspValue);
			this.realAssesVerArra.push(this.thirdVersionId);
		}

		if (this.fourthQuestionResponse === '' && this.fourQResForEach !== '') {
			this.realRespArray.push(this.fourQResForEach);
			this.realAssesVerArra.push(this.fourQVersionResForEach);
		} else {
			this.realRespArray.push(this.fourthRspValue);
			if (this.fourthRspValue === '') {
				this.fourthVersionId = '';

				this.realAssesVerArra.push(this.fourthVersionId);

				let dsds = this.fourthRecId;

				DELETE_SELECTED_RESPONSE({ idOfRes: dsds })
					.then(() => {
						this.fourthCheckRelatFam = false;
						this.fourthCheckWithPartner = false;
						this.fourthCheckSelfEsteem = false;
					})
					.catch((error) => {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
					});
			}
			this.realAssesVerArra.push(this.fourthVersionId);
		}

		if (this.fifthQuestionresponse === '' && this.fifthQResForEach !== '') {
			this.realRespArray.push(this.fifthQResForEach);
			this.realAssesVerArra.push(this.fifthQVersionResForEach);
		} else {
			this.realRespArray.push(this.fifthResonseValue);
			this.realAssesVerArra.push(this.fifthVersionId);
		}
		if (this.sixthQuestionResponse === '' && this.sixthQResForEach !== '') {
			this.realRespArray.push(this.sixthQResForEach);

			this.realAssesVerArra.push(this.sixthQVersionResForEach);
		} else {
			this.realRespArray.push(this.sixthResponseValue);
			if (this.sixthResponseValue === '') {
				this.sixthVersiD = '';
				this.realAssesVerArra.push(this.sixthVersiD);

				let fifthIdStore = this.sixthResponseId;
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
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
					});
			}
			this.realAssesVerArra.push(this.sixthVersiD);
		}

		if (this.seventhQuestionResponse === '' && this.sevenQResForEach !== '') {
			this.realRespArray.push(this.sevenQResForEach);
			this.realAssesVerArra.push(this.sevenQVersionResForEach);
		} else {
			this.realRespArray.push(this.seventhRespalue);
			this.realAssesVerArra.push(this.seventhVersiD);
		}

		if (this.eightQuestionResponse === '' && this.eigthQResForEach !== '') {
			this.realRespArray.push(this.eigthQResForEach);
			this.realAssesVerArra.push(this.eigthQVersionResForEach);
		} else {
			this.realRespArray.push(this.eghtResponseValue);
			this.realAssesVerArra.push(this.eightVersiId);
		}
		if (this.ninthQuestionResponse === '' && this.nineQResForEach !== '') {
			this.realRespArray.push(this.nineQResForEach);
			this.realAssesVerArra.push(this.nineQVersionResForEach);
		} else {
			this.realRespArray.push(this.ninthResponseValue);
			this.realAssesVerArra.push(this.ninthVersId);
		}

		if (this.tenthQuestionResponse === '' && this.tenthQResForEach !== '') {
			this.realRespArray.push(this.tenthQResForEach);
			this.realAssesVerArra.push(this.tenthQVersionResForEach);
		} else {
			this.realRespArray.push(this.tenthResponseValue);
			this.realAssesVerArra.push(this.tenthVersId);
		}

		if (
			this.eleventhQuestionResponse === '' &&
			this.eleventhQResForEach !== ''
		) {
			this.realRespArray.push(this.eleventhQResForEach);
			this.realAssesVerArra.push(this.eleventhQVersionResForEach);
		} else {
			this.realRespArray.push(this.eleventhResponseValue);
			this.realAssesVerArra.push(this.eleventhVersiD);
		}

		if (this.twelvthQuestionResponse === '' && this.twelthQResForEach !== '') {
			this.realRespArray.push(this.twelthQResForEach);
			this.realAssesVerArra.push(this.twelthQVersionResForEach);
		} else {
			this.realRespArray.push(this.twelvthRespalue);
			this.realAssesVerArra.push(this.twelvthVersiD);
		}

		if (
			this.thirteenthQuestionResponse === '' &&
			this.thirteenthQResForEach !== ''
		) {
			this.realRespArray.push(this.thirteenthQResForEach);
			this.realAssesVerArra.push(this.thirteenthQVersionResForEach);
		} else {
			this.realRespArray.push(this.thirteenthResponseValue);
			this.realAssesVerArra.push(this.thirteenthVersiId);
		}

		if (
			this.fourteenthQuestionResponse === '' &&
			this.fourteenthQResForEach !== ''
		) {
			this.realRespArray.push(this.fourteenthQResForEach);
			this.realAssesVerArra.push(this.fourteenthQVersionResForEach);
		} else {
			this.realRespArray.push(this.fourteenthResponseValue);
			this.realAssesVerArra.push(this.fourteenthVersId);
		}
		if (
			this.fifteenthQuestionResponse === '' &&
			this.fifteenthQResForEach !== ''
		) {
			this.realRespArray.push(this.fifteenthQResForEach);
			this.realAssesVerArra.push(this.fifteenthQVersionResForEach);
		} else {
			this.realRespArray.push(this.fifteenthResponseValue);
			this.realAssesVerArra.push(this.fifteenthVersId);
		}
		if (
			this.sixteenthQuestionResponse === '' &&
			this.sixteenthQResForEach !== ''
		) {
			this.realRespArray.push(this.sixteenthQResForEach);
			this.realAssesVerArra.push(this.sixteenthQVersionResForEach);
		} else {
			this.realRespArray.push(this.sixteenthResponseValue);
			this.realAssesVerArra.push(this.sixteenthVersId);
		}

		let nonEmptyResponses = this.realRespArray.filter(
			(response) => response !== ''
		);
		let nonEmptyIds = this.realAssesVerArra.filter((id) => id !== '');
		if (this.realRespArray.length > 0) {
			SUBMIT_ASSESSMENT_RESPONSE({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: true,
				isQsqAfterTwoMonths: false
			})
				.then(() => {
					//naviagtion to other questionnaire based on avaliable Outatsnding Questionnaires.
					window.location.assign(this.urlq + OUTSTANDING_PAGE);
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
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