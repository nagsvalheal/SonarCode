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
import CREATE_TASK from '@salesforce/apex/BI_PSPB_LetPersonaliseNotification.createTaskIfNoAssessment';
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
		const targets = {
			female: this.female,
			male: this.male,
			other: this.other,
			preferNotToSay: this.preferNot,
			lessThanMonth: this.lessThanMonth,
			lessThanSix: this.sixMontLess,
			lessThanYr: this.lessThanYear,
			moreThanYr: this.moreThanYear,
			relationshipWithFF: this.relationshipwithff,
			relationshipWithPartner: this.relationshipwithpartner,
			selfEsteem: this.selfesteem,
			asthma: this.asthma,
			diabetes: this.diabetes,
			depression: this.depression,
			hayFever: this.hayfever,
			highBp: this.hypertension,
			highChol: this.highcholestrol,
			obesity: this.obesityc,
			osteoporosis: this.osteoporosisc,
			peptic: this.ulcer,
			plaque: this.psoriasis,
			psoriaticArthritis: this.psoriaticarthritis,
			others: this.others,
			yes: this.yes,
			no: this.no,
			maybe: this.maybe
		};

		this.records.forEach(record => {
			const responseOrder = record.BI_PSP_ResponseOrder__c;
			const responseValue = record.ResponseValue;
			const questionId = record.AssessmentQuestion.Id;

			switch (responseOrder) {
				case 1:
					this.handleFirstQuestion(responseValue, questionId, targets);
					break;
				case 2:
					this.handleSecondQuestion(responseValue, questionId, targets);
					break;
				case 3:
					this.handleThirdQuestion(responseValue, questionId, targets);
					break;
				case 4:
					this.handleFourthQuestion(responseValue, questionId, targets);
					break;
				case 5:
					this.handleFifthQuestion(responseValue, questionId, targets);
					break;
				case 6:
					this.handleSixthQuestion(responseValue, questionId, targets);
					break;
				case 7:
					this.handleSeventhQuestion(responseValue, questionId, targets);
					break;
				case 8:
					this.handleEighthQuestion(responseValue, questionId, targets);
					break;
				case 9:
					this.handleNinthQuestion(responseValue, questionId, targets);
					break;
				case 10:
					this.handleTenthQuestion(responseValue, questionId, targets);
					break;
				case 11:
					this.handleEleventhQuestion(responseValue, questionId, targets);
					break;
				case 12:
					this.handleTwelfthQuestion(responseValue, questionId, targets);
					break;
				case 13:
					this.handleThirteenthQuestion(responseValue, questionId, targets);
					break;
				case 14:
					this.handleFourteenthQuestion(responseValue, questionId, targets);
					break;
				case 15:
					this.handleFifteenthQuestion(responseValue, questionId, targets);
					break;
				case 16:
					this.handleSixteenthQuestion(responseValue, questionId, targets);
					break;
				default:
					break;
			}
		});
	}

	handleFirstQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.lessThanMonth && questionId !== null) {
			this.firstQResForEach = responseValue;
			this.firstQVersionResForEach = questionId;
			this.IsfirstLessThanMonth = true;
		} else if (responseValue === targets.lessThanSix && questionId !== null) {
			this.firstQResForEach = responseValue;
			this.firstQVersionResForEach = questionId;
			this.IsfirstLessSix = true;
		} else if (responseValue === targets.lessThanYr && questionId !== null) {
			this.firstQResForEach = responseValue;
			this.firstQVersionResForEach = questionId;
			this.IsfirstLessYear = true;
		} else if (responseValue === targets.moreThanYr && questionId !== null) {
			this.firstQResForEach = responseValue;
			this.firstQVersionResForEach = questionId;
			this.IsfirstMoreYear = true;
		}
	}

	handleSecondQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.female && questionId !== null) {
			this.secQResForEach = responseValue;
			this.secQVersionResForEach = questionId;
			this.isFemale = true;
		} else if (responseValue === targets.male && questionId !== null) {
			this.secQResForEach = responseValue;
			this.secQVersionResForEach = questionId;
			this.isMale = true;
		} else if (responseValue === targets.other && questionId !== null) {
			this.secQResForEach = responseValue;
			this.secQVersionResForEach = questionId;
			this.isOther = true;
		} else if (responseValue === targets.preferNotToSay && questionId !== null) {
			this.secQResForEach = responseValue;
			this.secQVersionResForEach = questionId;
			this.isPrefferNotToSay = true;
		}
	}

	handleThirdQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.thirdQResForEach = responseValue;
			this.thirdQVersionResForEach = questionId;
			this.thirdIsYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.thirdQResForEach = responseValue;
			this.thirdQVersionResForEach = questionId;
			this.thirdIsNo = true;
		}
	}

	handleFourthQuestion(responseValue, questionId, targets) {
		if (responseValue.includes(targets.relationshipWithFF) && questionId !== null) {
			this.fourthCheckRelatFam = true;
			this.fourQResForEach = responseValue;
			this.fourQVersionResForEach = questionId;
		} else if (responseValue.includes(targets.relationshipWithPartner) && questionId !== null) {
			this.fourthCheckWithPartner = true;
			this.fourQResForEach = responseValue;
			this.fourQVersionResForEach = questionId;
		} else if (responseValue.includes(targets.selfEsteem) && questionId !== null) {
			this.fourthCheckSelfEsteem = true;
			this.fourQResForEach = responseValue;
			this.fourQVersionResForEach = questionId;
		}
	}

	handleFifthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.fifthQResForEach = responseValue;
			this.fifthQVersionResForEach = questionId;
			this.fifthRadYes = true;
			this.sixthQuestionVisible = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.fifthQResForEach = responseValue;
			this.fifthQVersionResForEach = questionId;
			this.fifthRadNo = true;
			this.sixthQuestionVisible = false;
			this.sixthQResForEach = '';
			this.sixthQVersionResForEach = '';
		}
	}

	handleSixthQuestion(responseValue, questionId, targets) {
		const conditions = {
			asthma: 'tenthCheckAsthma',
			diabetes: 'tenthCheckDiabetes',
			depression: 'tenthCheckDepression',
			hayFever: 'tenthCheckHayFever',
			highBp: 'tenthCheckBp',
			highChol: 'tenthCheckHighChol',
			obesity: 'tenthCheckObesity',
			osteoporosis: 'tenthCheckOsteo',
			peptic: 'tenthCheckPeptic',
			plaque: 'tenthCheckplaque',
			psoriaticArthritis: 'tenthCheckpsoriatic',
			others: 'tenthCheckOthers'
		};

		for (let key in conditions) {
			if (Object.prototype.hasOwnProperty.call(conditions, key) && responseValue.includes(targets[key]) && questionId !== null) {
				this[conditions[key]] = true;
				this.sixthQResForEach = responseValue;
				this.sixthQVersionResForEach = questionId;
			}
		}
	}

	handleSeventhQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.sevenQResForEach = responseValue;
			this.sevenQVersionResForEach = questionId;
			this.afterSixthRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.sevenQResForEach = responseValue;
			this.sevenQVersionResForEach = questionId;
			this.afterSixthRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.sevenQResForEach = responseValue;
			this.sevenQVersionResForEach = questionId;
			this.afterSixthRadMaybe = true;
		}
	}

	handleEighthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.eigthQResForEach = responseValue;
			this.eigthQVersionResForEach = questionId;
			this.sixthRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.eigthQResForEach = responseValue;
			this.eigthQVersionResForEach = questionId;
			this.sixthRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.eigthQResForEach = responseValue;
			this.eigthQVersionResForEach = questionId;
			this.sixthRadMayBe = true;
		}
	}

	handleNinthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.nineQResForEach = responseValue;
			this.nineQVersionResForEach = questionId;
			this.eleventhRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.nineQResForEach = responseValue;
			this.nineQVersionResForEach = questionId;
			this.eleventhRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.nineQResForEach = responseValue;
			this.nineQVersionResForEach = questionId;
			this.eleventhRadMaybe = true;
		}
	}

	handleTenthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.tenthQResForEach = responseValue;
			this.tenthQVersionResForEach = questionId;
			this.secondRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.tenthQResForEach = responseValue;
			this.tenthQVersionResForEach = questionId;
			this.secondRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.tenthQResForEach = responseValue;
			this.tenthQVersionResForEach = questionId;
			this.secondRadMaybe = true;
		}
	}

	handleEleventhQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.eleventhQResForEach = responseValue;
			this.eleventhQVersionResForEach = questionId;
			this.thirdRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.eleventhQResForEach = responseValue;
			this.eleventhQVersionResForEach = questionId;
			this.thirdRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.eleventhQResForEach = responseValue;
			this.eleventhQVersionResForEach = questionId;
			this.thirdRadMaybe = true;
		}
	}

	handleTwelfthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.twelthQResForEach = responseValue;
			this.twelthQVersionResForEach = questionId;
			this.fourthRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.twelthQResForEach = responseValue;
			this.twelthQVersionResForEach = questionId;
			this.fourthRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.twelthQResForEach = responseValue;
			this.twelthQVersionResForEach = questionId;
			this.fourthRadMaybe = true;
		}
	}

	handleThirteenthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.thirteenthQResForEach = responseValue;
			this.thirteenthQVersionResForEach = questionId;
			this.seventhRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.thirteenthQResForEach = responseValue;
			this.thirteenthQVersionResForEach = questionId;
			this.seventhRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.thirteenthQResForEach = responseValue;
			this.thirteenthQVersionResForEach = questionId;
			this.seventhRadMaybe = true;
		}
	}

	handleFourteenthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.fourteenthQResForEach = responseValue;
			this.fourteenthQVersionResForEach = questionId;
			this.twelthRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.fourteenthQResForEach = responseValue;
			this.fourteenthQVersionResForEach = questionId;
			this.twelthRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.fourteenthQResForEach = responseValue;
			this.fourteenthQVersionResForEach = questionId;
			this.twelthRadMaybe = true;
		}
	}

	handleFifteenthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.fifteenthQResForEach = responseValue;
			this.fifteenthQVersionResForEach = questionId;
			this.thirteenththRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.fifteenthQResForEach = responseValue;
			this.fifteenthQVersionResForEach = questionId;
			this.thirteenththRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.fifteenthQResForEach = responseValue;
			this.fifteenthQVersionResForEach = questionId;
			this.thirteenththRadMaybe = true;
		}
	}

	handleSixteenthQuestion(responseValue, questionId, targets) {
		if (responseValue === targets.yes && questionId !== null) {
			this.sixteenthQResForEach = responseValue;
			this.sixteenthQVersionResForEach = questionId;
			this.forteenththRadYes = true;
		} else if (responseValue === targets.no && questionId !== null) {
			this.sixteenthQResForEach = responseValue;
			this.sixteenthQVersionResForEach = questionId;
			this.forteenthRadNo = true;
		} else if (responseValue === targets.maybe && questionId !== null) {
			this.sixteenthQResForEach = responseValue;
			this.sixteenthQVersionResForEach = questionId;
			this.forteenthRadMaybe = true;
		}
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
			this.secondRspValue = this.getLastRespValue();
			this.secondRespVersId = this.getLastIdValue();
		}
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
		this.eghtResponseValue = this.getLastRespValue();
		this.eightVersiId = this.getLastIdValue();
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
			this.thirdRspValue = this.getLastRespValue();
			this.thirdVersionId = this.getLastIdValue();
		}
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
		this.ninthResponseValue = this.getLastRespValue();
		this.ninthVersId = this.getLastIdValue();
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
		this.fifteenthResponseValue = this.getLastRespValue();

		this.fifteenthVersId = this.getLastIdValue();

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
		this.fourteenthResponseValue = this.getLastRespValue();
		this.fourteenthVersId = this.getLastIdValue();
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
		// Get the last values separately
		this.twelvthRespalue = this.getLastRespValue();
		this.twelvthVersiD = this.getLastIdValue();
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
		this.eleventhResponseValue = this.getLastRespValue();

		this.eleventhVersiD = this.getLastIdValue();
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

		this.tenthResponseValue = this.getLastRespValue();
		this.tenthVersId = this.getLastIdValue();
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
		this.seventhRespalue = this.getLastRespValue();
		this.seventhVersiD = this.getLastIdValue();
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
		this.sixthResponseValue = this.getLastRespValue();
		this.sixthVersiD = this.getLastIdValue();
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
		this.sixteenthResponseValue = this.getLastRespValue();
		this.sixteenthVersId = this.getLastIdValue();
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
		this.fifthResonseValue = this.getLastRespValue();
		this.fifthVersionId = this.getLastIdValue();
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
		this.fourthRspValue = this.getLastRespValue();
		this.fourthVersionId = this.getLastIdValue();
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

		const responseMappings = {
			firstQResForEach: 'nameToDraftFirst',
			secQResForEach: 'nameToDraftSecond',
			thirdQResForEach: 'nameToDraftThird',
			fourQResForEach: 'nameToDraftFourth',
			fifthQResForEach: 'nameToDraftFifth',
			sixthQResForEach: 'nameToDraftSixth',
			sevenQResForEach: 'nameToDraftSeventh',
			eigthQResForEach: 'nameToDraftEighth',
			nineQResForEach: 'nameToDraftNinth',
			tenthQResForEach: 'nameToDrafttenth',
			eleventhQResForEach: 'nameToDrafteEleventh',
			twelthQResForEach: 'nameToDrafttwelvth',
			thirteenthQResForEach: 'nameToDraftThirteenth',
			fourteenthQResForEach: 'nameToDraftFourteenth',
			fifteenthQResForEach: 'nameToDraftFifteenth',
			sixteenthQResForEach: 'nameToDraftSixteenth'
		};

		// Iterate through the responseMappings to set the corresponding draft names
		for (let response in responseMappings) {
			if (typeof this[response] !== 'undefined' && this[response] !== '') {
				this[responseMappings[response]] = 'firstRes';
			}
		}

		// Check conditions to determine which popup to show
		const allDraftsDefined = [
			'nameToDraftSeventh', 'nameToDraftEighth', 'nameToDraftNinth',
			'nameToDrafttenth', 'nameToDrafteEleventh', 'nameToDrafttwelvth',
			'nameToDraftThirteenth', 'nameToDraftFourteenth', 'nameToDraftFifteenth',
			'nameToDraftSixteenth'
		].every(draft => typeof this[draft] !== 'undefined');

		if (allDraftsDefined) {
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
		pushResponsesAndVersions({
			questionResponse: this.firstQuestionResponse, questionResForEach: this.firstQResForEach,
			rspValue: this.firstRspValue, versionId: this.firstRespVersId, versionResForEach: this.firstQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.secondQuestionResponse, questionResForEach: this.secQResForEach,
			rspValue: this.secondRspValue, versionId: this.secondRespVersId, versionResForEach: this.secQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.thirdQuestionResponse, questionResForEach: this.thirdQResForEach,
			rspValue: this.thirdRspValue, versionId: this.thirdVersionId, versionResForEach: this.thirdQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.fourthQuestionResponse, questionResForEach: this.fourQResForEach,
			rspValue: this.fourthRspValue, versionId: this.fourthVersionId, versionResForEach: this.fourQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.fifthQuestionResponse, questionResForEach: this.fifthQResForEach,
			rspValue: this.fifthResonseValue, versionId: this.fifthVersionId, versionResForEach: this.fifthQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.sixthQuestionResponse, questionResForEach: this.sixthQResForEach,
			rspValue: this.sixthResponseValue, versionId: this.sixthVersiD, versionResForEach: this.sixthQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.seventhQuestionResponse, questionResForEach: this.sevenQResForEach,
			rspValue: this.seventhRespalue, versionId: this.seventhVersiD, versionResForEach: this.sevenQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.eightQuestionResponse, questionResForEach: this.eigthQResForEach,
			rspValue: this.eghtResponseValue, versionId: this.eightVersiId, versionResForEach: this.eigthQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.ninthQuestionResponse, questionResForEach: this.nineQResForEach,
			rspValue: this.ninthResponseValue, versionId: this.ninthVersId, versionResForEach: this.nineQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.tenthQuestionResponse, questionResForEach: this.tenthQResForEach,
			rspValue: this.tenthResponseValue, versionId: this.tenthVersId, versionResForEach: this.tenthQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.eleventhQuestionResponse, questionResForEach: this.eleventhQResForEach,
			rspValue: this.eleventhResponseValue, versionId: this.eleventhVersiD, versionResForEach: this.eleventhQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.twelvthQuestionResponse, questionResForEach: this.twelthQResForEach,
			rspValue: this.twelvthRespalue, versionId: this.twelvthVersiD, versionResForEach: this.twelthQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.thirteenthQuestionResponse, questionResForEach: this.thirteenthQResForEach,
			rspValue: this.thirteenthResponseValue, versionId: this.thirteenthVersiId, versionResForEach: this.thirteenthQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.fourteenthQuestionResponse, questionResForEach: this.fourteenthQResForEach,
			rspValue: this.fourteenthResponseValue, versionId: this.fourteenthVersId, versionResForEach: this.fourteenthQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.fifteenthQuestionResponse, questionResForEach: this.fifteenthQResForEach,
			rspValue: this.fifteenthResponseValue, versionId: this.fifteenthVersId, versionResForEach: this.fifteenthQVersionResForEach
		});
		pushResponsesAndVersions({
			questionResponse: this.sixteenthQuestionResponse, questionResForEach: this.sixteenthQResForEach,
			rspValue: this.sixteenthResponseValue, versionId: this.sixteenthVersId, versionResForEach: this.sixteenthQVersionResForEach
		});

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