// This introductory questionnaire allows you to provide information about yourself
// To import Libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//  To import Apex Classes
import GET_ENROLLE from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import INTRODUCTION_QUESTIONARE from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import PATIENT_STATUS_RETURNS from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.patientstatusreturn';
import DRAFT_RESPONSE_SUBMITION from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_INTRODUCTION from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
//import CREATE_TASK from '@salesforce/apex/BI_PSPB_TreatmentReminderCtrl.createTaskIfNoAssessment';
// To import Custom Labels
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import INTRO_PAGE_ONE_BOTTOM from '@salesforce/label/c.BI_PSP_IntroBottomTxt';
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WAPI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QUALITATIVE_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import WPAI_TEXT from '@salesforce/label/c.BI_PSP_WpaiQstnrTxt';
import LESSTHAN_A_MONTH from '@salesforce/label/c.BI_PSP_RbOneMonth';
import SIX_MONTHS from '@salesforce/label/c.BI_PSP_RbSixMnth';
import LESSTHAN_YEAR from '@salesforce/label/c.BI_PSP_RbOneYear';
import MORETHAN_YEAR from '@salesforce/label/c.BI_PSP_RbOneYearMore';
import MALE from '@salesforce/label/c.BI_PSP_RbMale';
import FEMALE from '@salesforce/label/c.BI_PSP_RbFemale';
import OTHER from '@salesforce/label/c.BI_PSP_RbOther';
import PREFERNOT_TO_SAY from '@salesforce/label/c.BI_PSP_RbNotToSay';
import YES from '@salesforce/label/c.BI_PSP_OptionValueYes';
import NO from '@salesforce/label/c.BI_PSP_OptionValueNo';
import RELATIONSHIPWITH_FF from '@salesforce/label/c.BI_PSP_RbFamAndFriends';
import RELATIONSHIPWITH_PARTNER from '@salesforce/label/c.BI_PSP_RbWithPartner';
import SELFESTEEM from '@salesforce/label/c.BI_PSP_RbSelfEsteem';
import SELECTALL from '@salesforce/label/c.BI_PSP_RbSelectAll';
import ASTHMA from '@salesforce/label/c.BI_PSP_RbAsthma';
import DIABETESMELLITUS from '@salesforce/label/c.BI_PSP_RbDiabetesMellitus';
import DEPRESSION from '@salesforce/label/c.BI_PSP_RbDepression';
import HAY_FEVER from '@salesforce/label/c.BI_PSP_RbHayFever';
import HYPERTENSION from '@salesforce/label/c.BI_PSP_RbHyperTension';
import HIGH_CHOLESTEROL from '@salesforce/label/c.BI_PSP_RbHighCholesterol';
import OBESITY from '@salesforce/label/c.BI_PSP_Obesity';
import OSTEOPOROSIS from '@salesforce/label/c.BI_PSP_Osteoporosis';
import ULCER from '@salesforce/label/c.BI_PSP_Ulcer';
import PSORIASIS from '@salesforce/label/c.BI_PSP_RbPsoriasis';
import PSORIATIC_ARTHRITIS from '@salesforce/label/c.BI_PSP_PsoriaticArthritis';
import DO_YOU_AGREE from '@salesforce/label/c.BI_PSP_QstnDoYouAgree';
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
import ME_AND_GPP from '@salesforce/label/c.BI_PSP_MeAndGppTitle';
import SKIP from '@salesforce/label/c.BI_PSP_SkipButton';
import NEXT from '@salesforce/label/c.BI_PSP_NextButton';
import COMPLETE_ALL from '@salesforce/label/c.BI_PSP_CompleteAll';
import SUBMIT_MESSAGE from '@salesforce/label/c.BI_PSP_SubmitLabel';
import OTHERS from '@salesforce/label/c.BI_PSP_Others';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import ACUTE_DASHBOARD from '@salesforce/label/c.BI_PSPB_AcuteDashboard';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import DASHBOARD from '@salesforce/label/c.BI_PSPB_Dashboad';
import UNASSIGNED from '@salesforce/label/c.BI_PSP_Unassigned';
import ACUTE from '@salesforce/label/c.BI_PSPB_Acute';
// To import current user ID
import Id from '@salesforce/user/Id';
export default class BiPspbMeAndMyGppQuestionnaire extends LightningElement {

	draftTruFale = false;
	resultUnAssigned = '';
	countQuestion = 15;
	isMale = false;
	isFemale = false;
	isOther = false;
	isPrefferNotToSay = false;

	IsfirstLessThanMonth = false;
	IsfirstLessSix = false;
	IsfirstLessYear = false;
	IsfirstMoreYear = false;

	thirdIsNo = false;
	thirdIsYes = false;

	cpeId;
	taskId;

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
	selectedGppImpact = [];
	hasMedicalConditions = '';
	showMedicalConditions = false;
	selectedMedicalConditions = [];

	firstQuestionResponse = '';
	secondQuestionResponse = '';
	thirdQuestionResponse = '';
	fourthQuestionResponse = '';

	fifthQuestionResponse = '';
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
	@track realrespArray = [];
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
	numberOfResponses;
	checkyesorno = false;

	@track totalValu = [];
	@track selectMedic = [];
	@track draftResponses = [];

	checkBoxArray;

	@track records = [];

	@track savedArrayForPushResp = [];
	concatenatedValues;

	showSixteenthQuestion = false;
	isConfirmationDialogOpen = false;
	customFormModal = false;
	isPopupOpen = false;
	isPopupOpen1 = false;

	@track selectedValues = [];
	// Declaration of Global variables
	checkinc;
	questionData = [];
	footerText = INTRO_PAGE_ONE_BOTTOM;
	introduction = INTRODUCTION_CATEGORY;
	pss = PSS_CATEGORY;
	dlqi = DLQI_CATEGORY;
	wapi = WAPI_CATEGORY;
	qsq = QUALITATIVE_CATEGORY;
	workAPI = WPAI_TEXT;
	userid = Id;
	answerQuestion;
	acuteDashboard = ACUTE_DASHBOARD;
	dashBoard = DASHBOARD;
	lessThanMonth = LESSTHAN_A_MONTH;
	sixMontLess = SIX_MONTHS;
	lessThanYear = LESSTHAN_YEAR;
	moreThanYear = MORETHAN_YEAR;
	male = MALE;
	female = FEMALE;
	other = OTHER;
	preferNot = PREFERNOT_TO_SAY;
	yes = YES;
	no = NO;
	relationshipwithff = RELATIONSHIPWITH_FF;
	relationshipwithpartner = RELATIONSHIPWITH_PARTNER;
	selfesteem = SELFESTEEM;
	selectall = SELECTALL;
	brandedSite = BRANDED_SITE_URL;
	asthma = ASTHMA;
	diabetes = DIABETESMELLITUS;
	depression = DEPRESSION;
	hayfever = HAY_FEVER;
	hypertension = HYPERTENSION;
	highcholestrol = HIGH_CHOLESTEROL;
	obesityc = OBESITY;
	osteoporosisc = OSTEOPOROSIS;
	ulcer = ULCER;
	psoriasis = PSORIASIS;
	psoriaticarthritis = PSORIATIC_ARTHRITIS;
	others = OTHERS;
	doyouagree = DO_YOU_AGREE;
	maybe = MAYBE;
	unAssignedSite = UNASSIGNED;
	meandgpp = ME_AND_GPP;
	next = NEXT;
	skip = SKIP;
	acute = ACUTE;
	answered = ANSWERED;
	submit = SUBMIT;
	saveasdraft = SAVE_AS_DRAFT;
	outstandingque = OUTSTANDING_QUESTIONNAIRE;
	returnbackc = RETURN_BACK;

	confirmsub = CONFIRM_SUBMISSION;
	cannotedit = CANNOT_BE_EDITED;
	cancelbt = CANCEL;
	confirmbt = CONFIRM;
	unAssigned = UNASSIGNED_SITE_URL;
	checPrevoiusVal;
	unCheckedResVal;
	@track unCheckedArray = [];
	fifthWithoudNewVals;


	sixthDraftVal;
	sixthUncheckedVals;
	@track sixthUnchekedArray = [];

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
	message = COMPLETE_ALL;
	content1 = SUBMIT_MESSAGE;
	handleResizeBound;


	//To get the viewpoint
	renderedCallback() {
		try {
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

							//this.fetchEvents();                       
						}
						else if (result[0].error !== null) {

							this.showError = true;
							this.errorMessage = result[0].error;
						}
					}
				})
				.catch(error => {

					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
				});
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}
	disconnectedCallback() {
		window.removeEventListener('resize', this.handleResizeBound);
	}

	handleResize() {
		this.isDesktop = this.isDesktopView();
	}

	isDesktopView() {
		let viewportWidth = window.innerWidth;
		// Adjust this threshold based on your design's breakpoints
		return viewportWidth >= 1024 || viewportWidth <= 400; // Example breakpoints at 1024 pixels and 400 pixels
	}



	//popup css
	get popupClass() {
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}


	//close popup css call
	get popupClass1() {
		return this.isPopupOpen1 ? 'popup2-container' : 'popup2-container hidden';
	}

	customHideModalPopup() {
		this.isPopupOpen = false;
		this.isPopupOpen1 = false;
		this.customFormModal = false;
	}

	@wire(PATIENT_STATUS_RETURNS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.resultUnAssigned = data;
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}
	//To get Response for current user
	@wire(DRAFT_RESPONSE_OF_INTRODUCTION, { questCatgryName: '$introduction', twoMonths: '$draftTruFale' })
	wiredDraftResponses({ error, data }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.records = data;

				this.cong();
				this.answerQuestion = this.records.length;
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}
	}

	//ordering the Response
	cong() {
		let targetFemale = this.female;
		let targetMale = this.male;
		let targetOther = this.other;
		let prefferNotTosay = this.preferNot;

		let firstLessThanMonth = this.lessThanMonth;
		let firstLessThanSix = this.sixMontLess;
		let firstLessThanYr = this.lessThanYear;
		let firstMoreThan = this.moreThanYear;
		let thirdAnswerRF = this.relationshipwithff;
		let thirdRWP = this.relationshipwithpartner;
		let thirdSelEstee = this.selfesteem;

		let asthmaVar = this.asthma;
		let duabetesVar = this.diabetes;
		let depressionVar = this.depression;
		let hayFever = this.hayfever;
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

		//submitting the response
		this.records.forEach((record) => {
			if (record.BI_PSP_ResponseOrder__c === 2) {
				if (
					record.ResponseValue === targetFemale &&
					record.AssessmentQuestion.Id !== null
				) {
					this.secQResForEach = record.ResponseValue;

					this.secQVersionResForEach = record.AssessmentQuestion.Id;

					// Perform your logic here
					this.isFemale = true;

					// Additional logic goes here...
				}

				if (
					record.ResponseValue === targetMale &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.isMale = true;
					this.secQResForEach = record.ResponseValue;
					this.secQVersionResForEach = record.AssessmentQuestion.Id;

					// Additional logic goes here...
				}
				if (
					record.ResponseValue === targetOther &&
					record.AssessmentQuestion.Id !== null
				) {
					this.secQResForEach = record.ResponseValue;

					this.secQVersionResForEach = record.AssessmentQuestion.Id;

					// Perform your logic here
					this.isOther = true;

					// Additional logic goes here...
				}
				if (
					record.ResponseValue === prefferNotTosay &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
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
					// Perform your logic here
					this.firstQResForEach = record.ResponseValue;

					this.firstQVersionResForEach = record.AssessmentQuestion.Id;
					this.IsfirstLessThanMonth = true;
				}

				if (
					record.ResponseValue === firstLessThanSix &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here

					this.firstQResForEach = record.ResponseValue;

					this.firstQVersionResForEach = record.AssessmentQuestion.Id;
					this.IsfirstLessSix = true;

					// Additional logic goes here...
				}

				if (
					record.ResponseValue === firstLessThanYr &&
					record.AssessmentQuestion.Id !== null
				) {
					this.firstQResForEach = record.ResponseValue;

					this.firstQVersionResForEach = record.AssessmentQuestion.Id;
					// Perform your logic here
					this.IsfirstLessYear = true;
				}

				if (
					record.ResponseValue === firstMoreThan &&
					record.AssessmentQuestion.Id !== null
				) {
					this.firstQResForEach = record.ResponseValue;

					this.firstQVersionResForEach = record.AssessmentQuestion.Id;
					// Perform your logic here
					this.IsfirstMoreYear = true;
				}
				//second ends here
			}

			if (record.BI_PSP_ResponseOrder__c === 4) {
				if (
					record.ResponseValue.includes(thirdAnswerRF) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourthCheckRelatFam = true;
					this.fourQResForEach = record.ResponseValue; //fourQResForEach POINS oUT THE ACTUTAL QUEST NUMBER

					this.fourQVersionResForEach = record.AssessmentQuestion.Id;

					// Additional logic goes here...
				}

				if (
					record.ResponseValue.includes(thirdRWP) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourthCheckWithPartner = true;
					this.fourQResForEach = record.ResponseValue; //fourQResForEach POINS oUT THE ACTUTAL QUEST NUMBER

					this.fourQVersionResForEach = record.AssessmentQuestion.Id;
				}

				if (
					record.ResponseValue.includes(thirdSelEstee) &&
					record.AssessmentQuestion.Id !== null
				) {
					this.fourthCheckSelfEsteem = true;
					this.fourQResForEach = record.ResponseValue; //fourQResForEach POINS oUT THE ACTUTAL QUEST NUMBER

					this.fourQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			//fifth Stads here
			if (record.BI_PSP_ResponseOrder__c === 6) {
				if (
					record.ResponseValue.includes(asthmaVar) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckAsthma = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
					// Additional logic goes here...
				}
				if (
					record.ResponseValue.includes(duabetesVar) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckDiabetes = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;

					// Additional logic goes here...
				}
				if (
					record.ResponseValue.includes(depressionVar) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckDepression = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;

					// Additional logic goes here...
				}
				if (
					record.ResponseValue.includes(hayFever) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckHayFever = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(highBp) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckBp = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(highChol) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckHighChol = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(Obesity) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckObesity = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(Osteoporosis) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckOsteo = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(peptic) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckPeptic = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(plaque) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckplaque = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(psoriasiArthritis) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckpsoriatic = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue.includes(Others) &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.tenthCheckOthers = true;
					this.sixthQResForEach = record.ResponseValue;
					this.sixthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}

			if (record.BI_PSP_ResponseOrder__c === 3) {
				////sixth starts here
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
					// Perform your logic here
					this.thirdQResForEach = record.ResponseValue;
					this.thirdQVersionResForEach = record.AssessmentQuestion.Id;
					this.thirdIsNo = true;
				}
			}

			//seventh ends here
			if (record.BI_PSP_ResponseOrder__c === 5) {
				if (
					record.ResponseValue === seventhYes &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.fifthQResForEach = record.ResponseValue;
					this.fifthQVersionResForEach = record.AssessmentQuestion.Id;
					this.fifthRadYes = true;
					this.sixthQuestionVisible = this.fifthQResForEach === this.yes;

					// Additional logic goes here...
				}
				if (
					record.ResponseValue === seventhNo &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.fifthRadNo = true;
					this.fifthQResForEach = record.ResponseValue;
					this.fifthQVersionResForEach = record.AssessmentQuestion.Id;
					// Additional logic goes here...
				}
			}

			////sixth starts here

			//seventh ends here

			if (record.BI_PSP_ResponseOrder__c === 7) {
				//eight starts here I completely understand my generalized 7
				if (
					record.ResponseValue === eigthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.sevenQResForEach = record.ResponseValue;
					if (this.sevenQResForEach !== null) {
						this.afterSixthRadYes = true;
					}

					this.sevenQVersionResForEach = record.AssessmentQuestion.Id;

					// Additional logic goes here...
				}
				if (
					record.ResponseValue === eigthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.sevenQResForEach = record.ResponseValue;
					this.sevenQVersionResForEach = record.AssessmentQuestion.Id;

					this.afterSixthRadNo = true;

					// Additional logic goes here...
				}
				if (
					record.ResponseValue === eigthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					this.sevenQResForEach = record.ResponseValue;
					this.sevenQVersionResForEach = record.AssessmentQuestion.Id;

					this.afterSixthRadMaybe = true;
				}
				//eigth ends here
			}

			if (record.BI_PSP_ResponseOrder__c === 9) {
				if (
					record.ResponseValue === tenthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.nineQResForEach = record.ResponseValue;
					this.nineQVersionResForEach = record.AssessmentQuestion.Id;

					// Perform your logic here
					this.eleventhRadYes = true;
				}
				if (
					record.ResponseValue === tenthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
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
					// Perform your logic here
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
					// Perform your logic here
					this.sixthRadYes = true;
				}
				if (
					record.ResponseValue === ninthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
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
					// Perform your logic here
					this.sixthRadMayBe = true;
				}
			}
			//ninth starts here  8

			if (record.BI_PSP_ResponseOrder__c === 10) {
				//eleventh starts here 10
				if (
					record.ResponseValue === eleventhYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.tenthQResForEach = record.ResponseValue;
					this.tenthQVersionResForEach = record.AssessmentQuestion.Id;
					// Perform your logic here
					this.secondRadYes = true;

					// Additional logic goes here...
				}
				if (
					record.ResponseValue === eleventhNo &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.secondRadNo = true;
					this.tenthQResForEach = record.ResponseValue;
				}
				if (
					record.ResponseValue === eleventhMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.secondRadMaybe = true;
					this.tenthQResForEach = record.ResponseValue;
					this.tenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				//eleventh ends here
			}

			if (record.BI_PSP_ResponseOrder__c === 11) {
				//  11
				if (
					record.ResponseValue === twelthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.eleventhQResForEach = record.ResponseValue;
					this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;
					// Perform your logic here
					this.thirdRadYes = true;
				}
				if (
					record.ResponseValue === twelthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.thirdRadNo = true;
					this.eleventhQResForEach = record.ResponseValue;
					this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === twelthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.thirdRadMaybe = true;
					this.eleventhQResForEach = record.ResponseValue;
					this.eleventhQVersionResForEach = record.AssessmentQuestion.Id;
				}
				//twelth ends here
			}

			if (record.BI_PSP_ResponseOrder__c === 12) {
				//12
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
					// Perform your logic here
					this.fourthRadNo = true;
					this.twelthQResForEach = record.ResponseValue;
					this.twelthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === thirteenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.fourthRadMaybe = true;
					this.twelthQResForEach = record.ResponseValue;
					this.twelthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				//thirteenth ends here
			}

			if (record.BI_PSP_ResponseOrder__c === 13) {
				//fourteenth starts here 13
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
					// Perform your logic here
					this.seventhRadNo = true;
					this.thirteenthQResForEach = record.ResponseValue;
					this.thirteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === fourteenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.seventhRadMaybe = true;
					this.thirteenthQResForEach = record.ResponseValue;
					this.thirteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				//fourteenth ends here
			}

			if (record.BI_PSP_ResponseOrder__c === 14) {
				//fifteenth starts here 14
				if (
					record.ResponseValue === fifteenthYes &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.fourteenthQResForEach = record.ResponseValue;
					this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
					this.twelthRadYes = true;
				}
				if (
					record.ResponseValue === fifteenthNo &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.twelthRadNo = true;
					this.fourteenthQResForEach = record.ResponseValue;
					this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === fifteenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.twelthRadMaybe = true;
					this.fourteenthQResForEach = record.ResponseValue;
					this.fourteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				//fifteenth ends here
			}

			if (record.BI_PSP_ResponseOrder__c === 15) {
				//sixteenth starts here 15
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
					// Perform your logic here
					this.thirteenththRadNo = true;
					this.fifteenthQResForEach = record.ResponseValue;
					this.fifteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === sixteenthMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.thirteenththRadMaybe = true;
					this.fifteenthQResForEach = record.ResponseValue;
					this.fifteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				//sixteenth ends here
			}

			if (record.BI_PSP_ResponseOrder__c === 16) {
				//16
				if (
					record.ResponseValue === seventeethYes &&
					record.AssessmentQuestion.Id !== null
				) {
					this.sixteenthQResForEach = record.ResponseValue;
					this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;
					// Perform your logic here
					this.forteenththRadYes = true;
				}
				if (
					record.ResponseValue === seventeethNo &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.forteenthRadNo = true;
					this.sixteenthQResForEach = record.ResponseValue;
					this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
				if (
					record.ResponseValue === seventeethMaybe &&
					record.AssessmentQuestion.Id !== null
				) {
					// Perform your logic here
					this.forteenthRadMaybe = true;
					this.sixteenthQResForEach = record.ResponseValue;
					this.sixteenthQVersionResForEach = record.AssessmentQuestion.Id;
				}
			}
		});
	}

	//To get the Introduction Questionnaire
	@wire(INTRODUCTION_QUESTIONARE, { questionnaireName: '$introduction' })
	wiredAssessmentQuestion({ error, data }) {
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

	//Getting response from event
	handleFirstQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		let chekVal = event.target.value;
		if (chekVal === this.lessThanMonth) {
			this.IsfirstLessThanMonth = true;
		} else {
			this.IsfirstLessThanMonth = false;
		}

		if (chekVal === this.sixMontLess) {
			this.IsfirstLessSix = true;
		} else {
			this.IsfirstLessSix = false;
		}

		if (chekVal === this.lessThanYear) {
			this.IsfirstLessYear = true;
		} else {
			this.IsfirstLessYear = false;
		}

		if (chekVal === this.moreThanYear) {
			this.IsfirstMoreYear = true;
		} else {
			this.IsfirstMoreYear = false;
		}

		if (this.nameOfQuestion === 'firstQuestionResponse') {
			this.firstQuestionResponse = event.target.value;
			this.nameToDraftFirst = event.target.name;

			if (this.firstQuestionResponse !== '') {
				this.arrayForPushResp.push(this.firstQuestionResponse);
				this.arrayForPushId.push(this.firstQuestionVersinId);
			}
			// Get the last values separately
			this.firstRspValue = this.getLastRespValue();
			this.firstRespVersId = this.getLastIdValue();
		}
	}

	getLastRespValue() {
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getLastIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	//Getting response from event
	handleSecondQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		if (this.nameOfQuestion === 'secondQuestionResponse') {
			this.secondQuestionResponse = event.target.value;
			this.nameToDraftSecond = event.target.name;

			if (this.secondQuestionResponse !== '') {
				this.arrayForPushResp.push(this.secondQuestionResponse);
				this.arrayForPushId.push(this.secondQuestionVersinId);
			}
			// Get the last values separately
			this.secondRspValue = this.getSecondRespValue();
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

	//Getting response from event
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

	//Getting response from event
	handlethirdQuestionChange(event) {
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
			? this.arrayForPushResp[this.arrayForPushResp.length - 0]
			: null;
	}

	getThirdIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 0]
			: null;
	}

	//Getting response from event

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

	//Getting response from event

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
		return this.arrayForPushResp.length > 0
			? this.arrayForPushResp[this.arrayForPushResp.length - 1]
			: null;
	}

	getFifteenthIdValue() {
		return this.arrayForPushId.length > 0
			? this.arrayForPushId[this.arrayForPushId.length - 1]
			: null;
	}

	//Getting response from event
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

	//Getting response from event
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
		// Get the last values separately
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
		// Get the last values separately
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

	//Getting response from event
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

	//Getting response from event
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

	//Getting response from event
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
		// Get the last values separately
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

	//Getting response from event
	handleSixthQuestionchange(event) {
		this.sixthDraftVal = this.sixthQResForEach;

		let checkBoval = event.target.checked;
		if (!checkBoval) {
			this.sixthUncheckedVals = event.target.value;
			this.sixthUnchekedArray.push(this.sixthUncheckedVals);
		}
		this.sixthQuestionResponse = event.target.value;
		this.nameToDraftSixth = event.target.name;

		if (this.sixthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.sixthQuestionResponse);
			this.arrayForPushId.push(this.sixthQuestionVersinId);
			this.selectMedic.push(this.sixthQuestionResponse);
		}
		// Get the last values separately
		this.sixthResponseValue = this.getSixthRespValue();
		this.sixthVersiD = this.getSixthIdValue();
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

	//Getting response from event
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
		// Get the last values separately
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
		this.sixthQuestionResponse = '';
		this.sixthQResForEach = '';
		this.sixthQVersionResForEach = '';
		this.sixthResponseValue = '';
		this.sixthVersiD = '';
		this.selectMedic = '';
		this.sixthUnchekedArray = '';
	}

	handleFifthQuestionChange(event) {
		if (event.target.checked) {
			this.closePopup();
			let val = event.target.value;
			if (val === this.yes) {
				this.fifthRadYes = true;
				this.fifthRadNo = false;
				this.countQuestion = 16;
			}

			if (val === this.no) {
				this.fifthRadNo = true;
				this.fifthRadYes = false;
				this.sixthQuestionVisible = false;
				this.deleteYesBasedRes();
				this.countQuestion = 15;
			}
		}
		this.sixthQuestionVisible = event.target.value === this.yes;

		this.fifthQuestionResponse = event.target.value;
		this.nameToDraftFifth = event.target.name;

		if (this.fifthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fifthQuestionResponse);
			this.arrayForPushId.push(this.fifthQuestionVersinId);
		}
		// Get the last values separately
		this.fifthResonseValue = this.getFifthRespValue();
		this.fifthVersionId = this.getFifthIdValue();
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

		let checkBoval = event.target.checked;
		if (!checkBoval) {
			this.unCheckedResVal = event.target.value;
			this.unCheckedArray.push(this.unCheckedResVal);
		}
		this.fourthQuestionResponse = event.target.value;
		this.nameToDraftFourth = event.target.name;

		if (this.fourthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourthQuestionResponse);
			this.arrayForPushId.push(this.fourthQuestionVersinId);
			this.totalValu.push(this.fourthQuestionResponse);
		}
		// Get the last values separately
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
	//To submit reponse of all stored
	submitResponses() {
		if (this.isDesktop) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = ''; // Reset to default
		}

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
			this.nameToDraftSixth = 'firstRes';
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

		if (
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
			this.isPopupOpen = true;
		} else {
			this.customFormModal = true;
			this.isPopupOpen1 = true;
			this.isPopupOpen = false;
			this.checkyesorno = false;
		}
	}

	navigationMethod() {
		try {
			let val = this.cpeId;
			CREATE_TASK({ enrolleeId: val })
				.then(result => {
					this.taskId = result;
					this.error = undefined;
				})
				.catch(error => {

					this.taskId = undefined;
					this.error = error.body.message;
				});

		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);// Catching Potential Error from Apex
		}

		if (this.resultUnAssigned === this.unAssignedSite) {
			window.location.assign(this.unAssigned);
		} else if (this.resultUnAssigned === this.acute) {
			window.location.assign(this.unAssigned + this.acuteDashboard);
		} else {
			window.location.assign(this.brandedSite + this.dashBoard);
		}
	}
	//To save the response
	saveAsDraft() {
		this.checkinc = false;

		// Extract first three values from this.totalValu
		const [firstValue, secondValue, thirdValue] = this.totalValu.slice(0, 3);

		// Process additional values
		const additionalValues = (this.checPrevoiusVal || '').split(',').map(value => value.trim());
		const valuesToExclude = new Set(this.unCheckedArray);

		// Concatenate unique values excluding duplicates
		const concatenatedValues = [...new Set(
			[firstValue, secondValue, thirdValue, ...additionalValues].filter(value => value !== undefined && !valuesToExclude.has(value))
		)].join(', ');
		this.fourthRspValue = concatenatedValues;

		// Process medic values
		let medicValues = this.selectMedic.slice(0, 12);
		const additionalMedicValues = (this.sixthDraftVal || '').split(',').map(value => value.trim());
		medicValues = medicValues.concat(additionalMedicValues);
		const medicValuesToExclude = new Set(this.sixthUnchekedArray);

		// Concatenate unique medic values excluding duplicates
		const concatenatedMedicValues = [...new Set(
			medicValues.filter(value => value !== undefined && !medicValuesToExclude.has(value))
		)].join(', ');
		this.sixthResponseValue = concatenatedMedicValues;

		// Helper function to push responses and version IDs
		const pushResponsesAndVersions = ({ questionResponse, questionResForEach, rspValue, versionId, versionResForEach }) => {
			if (questionResponse === '' && questionResForEach !== '') {
				this.realrespArray.push(questionResForEach);
				this.realAssesVerArra.push(versionResForEach);
			} else {
				this.realrespArray.push(rspValue);
				this.realAssesVerArra.push(versionId);
			}
		};

		// Push responses and version IDs for all questions
		pushResponsesAndVersions({ questionResponse: this.firstQuestionResponse, questionResForEach: this.firstQResForEach, rspValue: this.firstRspValue, versionId: this.firstRespVersId, versionResForEach: this.firstQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.secondQuestionResponse, questionResForEach: this.secQResForEach, rspValue: this.secondRspValue, versionId: this.secondRespVersId, versionResForEach: this.secQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.thirdQuestionResponse, questionResForEach: this.thirdQResForEach, rspValue: this.thirdRspValue, versionId: this.thirdVersionId, versionResForEach: this.thirdQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.fourthQuestionResponse, questionResForEach: this.fourQResForEach, rspValue: this.fourthRspValue, versionId: this.fourthVersionId, versionResForEach: this.fourQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.fifthQuestionResponse, questionResForEach: this.fifthQResForEach, rspValue: this.fifthResonseValue, versionId: this.fifthVersionId, versionResForEach: this.fifthQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.sixthQuestionResponse, questionResForEach: this.sixthQResForEach, rspValue: this.sixthResponseValue, versionId: this.sixthVersiD, versionResForEach: this.sixthQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.seventhQuestionResponse, questionResForEach: this.sevenQResForEach, rspValue: this.seventhRespalue, versionId: this.seventhVersiD, versionResForEach: this.sevenQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.eightQuestionResponse, questionResForEach: this.eigthQResForEach, rspValue: this.eghtResponseValue, versionId: this.eightVersiId, versionResForEach: this.eigthQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.ninthQuestionResponse, questionResForEach: this.nineQResForEach, rspValue: this.ninthResponseValue, versionId: this.ninthVersId, versionResForEach: this.nineQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.tenthQuestionResponse, questionResForEach: this.tenthQResForEach, rspValue: this.tenthResponseValue, versionId: this.tenthVersId, versionResForEach: this.tenthQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.eleventhQuestionResponse, questionResForEach: this.eleventhQResForEach, rspValue: this.eleventhResponseValue, versionId: this.eleventhVersiD, versionResForEach: this.eleventhQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.twelvthQuestionResponse, questionResForEach: this.twelthQResForEach, rspValue: this.twelvthRespalue, versionId: this.twelvthVersiD, versionResForEach: this.twelthQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.thirteenthQuestionResponse, questionResForEach: this.thirteenthQResForEach, rspValue: this.thirteenthResponseValue, versionId: this.thirteenthVersiId, versionResForEach: this.thirteenthQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.fourteenthQuestionResponse, questionResForEach: this.fourteenthQResForEach, rspValue: this.fourteenthResponseValue, versionId: this.fourteenthVersId, versionResForEach: this.fourteenthQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.fifteenthQuestionResponse, questionResForEach: this.fifteenthQResForEach, rspValue: this.fifteenthResponseValue, versionId: this.fifteenthVersId, versionResForEach: this.fifteenthQVersionResForEach });
		pushResponsesAndVersions({ questionResponse: this.sixteenthQuestionResponse, questionResForEach: this.sixteenthQResForEach, rspValue: this.sixteenthResponseValue, versionId: this.sixteenthVersId, versionResForEach: this.sixteenthQVersionResForEach });

		// Filter non-empty responses and IDs
		const nonEmptyResponses = this.realrespArray.filter(response => response !== '');
		const nonEmptyIds = this.realAssesVerArra.filter(id => id !== '');

		// Set checkinc to true if there are 14 or more non-empty responses
		if (nonEmptyResponses.length >= 14) {
			this.checkinc = true;
		}

		// Submit draft response
		if (this.realrespArray.length > 0) {
			DRAFT_RESPONSE_SUBMITION({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: this.checkinc
			})
				.then(() => {
					const redirectTo = this.resultUnAssigned === this.unAssignedSite ? this.unAssigned :
						this.resultUnAssigned === this.acute ? this.unAssigned + this.acuteDashboard :
							this.brandedSite + this.dashBoard;
					window.location.assign(redirectTo);
				})
				.catch(error => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		}
	}



	showToast(title, message, variant) {
		let event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}
}