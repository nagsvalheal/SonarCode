//This Lightning Web Component allows users to input responses for qualitative questionnaire questions, enhancing the collection of subjective feedback and opinions.
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex Classes
import GET_ASSESSMENT_QUESTIONS from '@salesforce/apex/BI_PSP_AssessmentQuestionsCtrl.getTheAssesmentQuestion';
import SUBMIT_ASSESSMENT_RESPONSE from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_SUBMISSION from '@salesforce/apex/BI_PSP_AssessmentManagementCtrl.mulitipleDraftRecordsInsertion';
import DRAFT_RESPONSE_OF_PSORIASIS from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCompletedAssessmentCountsByCurrentUserName';
//To import Static Resource
import PSS_IMAGE from '@salesforce/resourceUrl/BI_PSP_PssImage';
import DLQI_IMAGE from '@salesforce/resourceUrl/BI_PSP_DlqiImage';
import WPAI_IMAGE from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
import QSQ_IMAGE from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom Labels
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WPAI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import QSQ_CATEGORY from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import WPAI_TEXT from '@salesforce/label/c.BI_PSP_WpaiQstnrTxt';
import SUBMIT_LABEL from '@salesforce/label/c.BI_PSP_SubmitLabel';
import CLICK_BELOW from '@salesforce/label/c.BI_PSP_ClickBelowText';
import OUTSTANDING_PAGE_TEXT from '@salesforce/label/c.BI_PSP_OutstndngPageTxt';
import INFORMATION_CENTRE from '@salesforce/label/c.BI_PSP_InformationCentreTxt';
import SYMPTOM_TRACKER from '@salesforce/label/c.BI_PSP_SymptomTrackerValue';
import CHALLENGES_NAME from '@salesforce/label/c.BI_PSP_ChallengesName';
import QUESTIONNAIRE from '@salesforce/label/c.BI_PSP_Questionnaire';
import TREATMENT_VIDEOS_TXT from '@salesforce/label/c.BI_PSP_TreatmentVideosTxt';
import SUPPORT_TEXT from '@salesforce/label/c.BI_PSP_SupportTxt';
import OPTION_VALUE_YES from '@salesforce/label/c.BI_PSP_OptionValueYes';
import OPTION_VALUE_NO from '@salesforce/label/c.BI_PSP_OptionValueNo';
import BUTTON_SUBMIT from '@salesforce/label/c.BI_PSP_ButtonSubmit';
import DRAFT_BUTTON from '@salesforce/label/c.BI_PSP_DraftButton';
import RETURN_BACK from '@salesforce/label/c.BI_PSP_ButtonReturnback';
import CONFIRM_SUBMISSION from '@salesforce/label/c.BI_PSP_ButtonConfirmSub';
import CANCEL_BUTTON from '@salesforce/label/c.BI_PSP_CancelButton';
import CONFIRM_BUTTON from '@salesforce/label/c.BI_PSP_ConfirmButton';
import QSQ_TEXT from '@salesforce/label/c.BI_PSP_QualitativeEgTxt';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UN_ASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import POPUP_MESSAGE from '@salesforce/label/c.BI_PSP_MsgPopupTxt';
import COMPLETE_ALL from '@salesforce/label/c.BI_PSP_CompleteAll';
import CANNOT_EDIT_MSG from '@salesforce/label/c.BI_PSP_CannotEditMsg';
import CONSOLE_ERROR_MSG from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT_TOAST from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import DLQI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl';
import WAPI_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import PSORIASIS_QUES_URL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import OUTSTANDING_PAGE_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UN_ASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
//To get Current UserId
import Id from '@salesforce/user/Id';
export default class BiPspbQsqAfterTwoMonths extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//Track variable Declarations(re-render variables)
	isBarRadioChecked = false;
	isNoneChecked = false;
	isMildChecked = false;
	isModerateChecked = false;
	isSevereChecked = false;
	isBarVerySeverChecked = false;
	totalDraftResponses;
	shouldFetchDraftResponses = true;
	secondNone = false;
	secondMild = false;
	secondModerate = false;
	secondSevere = false;
	secondVerySever = false;
	thirdNone = false;
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

	firstQuestionResponse = '';
	secondQuestionResponse = '';
	thirdQuestionResponse = '';
	fourthQuestionResponse = '';
	fifthQuestionresponse = '';
	sixthQuestionResponse = '';
	seventhQuestionResponse = '';
	eightQuestionResponse = '';

	@track realAssesVerArra = [];
	@track realRespArray = [];
	@track arrayForPushResp = [];
	@track arrayForPushId = [];
	@track selectedValues = {};
	@track responsOfDlqi = [];
	@track questionData = [];

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
	seventhRespalue = '';
	seventhVersiD = '';
	eghtResponseValue = '';
	eightVersiId = '';

	nameToDraftFirst = '';
	nameToDraftSecond = '';
	nameToDraftThird = '';
	nameToDraftFourth = '';
	nameToDraftFifth = '';
	nameToDraftSixth = '';
	nameToDraftSeventh = '';
	nameToDraftEighth = '';
	firstResponseText;
	firstResponseVersinId;
	secondResponseText;
	secondResponseVersinId;
	thirdResponseText;
	thirdResponseVersinId;
	fourthResponseText;
	fourthResponseVersinId;
	fifthResponseText;
	fifthResponseVersinId;
	sixthResponseText;
	sixthResponseVersinId;
	seventhResponseText;
	seventhResponseVersinId;
	eighthResponseText;
	eighthResponseVersinId;
	isConfirmationDialogOpen = false;
	customFormModal = false;
	submitLabel = SUBMIT_LABEL;
	//whenever the data gets rentered or selected i should be able to get that here from omniscript
	isDraftSavedPopupOpen = false;
	isPopupOpen = false;
	saveAsDraftPopUp = false;
	sliderValue = 0;
	sliderValuesec = 0;
	sliderValuethree = 0;
	//Global variables(without @track does not trigger automatic re-renders)
	twoMonthsTrueFalse = true;
	popUpMenu = false;
	checkedResVal;
	message = COMPLETE_ALL;
	draftSavedMessage = POPUP_MESSAGE;
	urlq;
	userId = Id;
	firstDraftResp;
	firstDraftVerionId;

	secondDraftResp;
	secondDraftVerionId;

	thirdDraftResp;
	thirdDraftVersionId;

	fourthDraftRes;
	fourthDraftVersionId;
	fifthDraftResp;
	fifthDraftVersionId;
	sixthDraftResp;
	sixthDraftVersionId;
	seventhDrafRes;
	seventhDrafResVersionId;
	eigthDrafRes;
	eigthDrafResVersionId;

	checPrevoiusVal;
	unCheckedResVal;
	unCheckedArray = [];
	fifthWithoudNewVals;
	//the draft number
	fifthArray = [];
	thirdMild = false;
	thirdModerate = false;
	thirdSevere = false;
	thirdVerySever = false;
	isYesChecked = false;
	isNoChecked = false;
	fifthinfo = false;
	fifthSyTr = false;
	fifthChallenges = false;
	fifthQuestionnaire = false;
	fifthTreatmentVideo = false;
	fifthSupport = false;
	seventhYess = false;
	seventhNoo = false;
	eighthYess = false;
	eighthNoo = false;
	dlqiCardImage = DLQI_IMAGE;
	pssCardImage = PSS_IMAGE;
	wpaiCardImage = WPAI_IMAGE;
	qsqCardImage = QSQ_IMAGE;
	pss = PSS_CATEGORY;
	dlqi = DLQI_CATEGORY;
	wapi = WPAI_CATEGORY;
	qsq = QSQ_CATEGORY;
	wpaiText = WPAI_TEXT;
	clickBelow = CLICK_BELOW;
	qsqText = QSQ_TEXT;
	outstandingQue = OUTSTANDING_PAGE_TEXT;
	informationCentre = INFORMATION_CENTRE;
	symptomTracker = SYMPTOM_TRACKER;
	challenges = CHALLENGES_NAME;
	questionnaire = QUESTIONNAIRE;
	treatmentVideos = TREATMENT_VIDEOS_TXT;
	support = SUPPORT_TEXT;
	yes = OPTION_VALUE_YES;
	no = OPTION_VALUE_NO;
	submit = BUTTON_SUBMIT;
	saveasdraft = DRAFT_BUTTON;
	returnbackc = RETURN_BACK;
	confirmsub = CONFIRM_SUBMISSION;
	cannotedit = CANNOT_EDIT_MSG;
	cancelbt = CANCEL_BUTTON;
	confirmbt = CONFIRM_BUTTON;
	draftResponses = [];
	handleResizeBound;
	stqsq = 0;
	stdlq = 0;
	stpss = 0;
	stwai = 0;

	//To get site url
	renderedCallback() {
		try {
			let currentURL = window.location.href;
			// Create a URL object
			let urlObject = new URL(currentURL);
			// Get the path
			let path = urlObject.pathname;
			// Split the path using '/' as a separator
			let pathComponents = path.split('/');
			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVI;
			} else {
				this.urlq = UN_ASSIGNED_URL_NAVI;
			}
			this.updateThumbLabelPosition(this.sliderValue);
			this.updateThumbLabelPositionsec(this.sliderValuesec);
			this.updateThumbLabelPositionthree(this.sliderValuethree);

			this.isDesktop = this.isDesktopView();
			// Bind the event handler once and store it in a variable
			this.handleResizeBound = this.handleResize.bind(this);

			// Add the event listener using the bound handler
			window.addEventListener('resize', this.handleResizeBound);
			this.addSliderEventListener();
		} catch (error) {
			this.showToast(CONSOLE_ERROR_MSG, error.message, ERROR_VARIANT_TOAST); // Catching Potential Error
		}
	}
	//To bind the variable to resize
	disconnectedCallback() {
		window.removeEventListener('resize', this.handleResizeBound);
	}

	handleResize() {
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
	//To get completed Questionarie count
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (data) {
				this.count = data;
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MSG, error.body.message, ERROR_VARIANT_TOAST); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MSG, err.message, ERROR_VARIANT_TOAST); // Catching Potential Error from LWC
		}
	}
	get checkdlqi() {
		return this.stdlq > 0 ? 'disabled' : '';
	}
	get checkpss() {
		return this.stpss > 0 ? 'disabled' : '';
	}

	get checkwai() {
		return this.stwai > 0 ? 'disabled' : '';
	}
	get checkqsq() {
		return this.stqsq > 0 ? 'disabled' : '';
	}

	// slider part 1
	handleInputChange(event) {
		this.sliderValue = event.target.value;
		this.updateThumbLabelPosition(this.sliderValue);

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

	//To place the value in right position inside the slider 
	updateThumbLabelPosition(sliderValue) {
		if (typeof window !== 'undefined') {
			let slider = this.template.querySelector('input');
			let thumbLabel = this.template.querySelector('.thumb-label');

			let thumbWidth = parseFloat(window.getComputedStyle(thumbLabel).width);
			let sliderWidth = slider.offsetWidth;
			let thumbPosition =
				(sliderValue / slider.max) * (sliderWidth - thumbWidth);

			let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
			let maxPosition = sliderWidth - thumbWidth;
			thumbLabel.style.left =
				Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
			thumbLabel.setAttribute('data-value', sliderValue);
		}
	}

	addSliderEventListener() {
		let slidersec = this.template.querySelector('.slidersec');
		let slider = this.template.querySelector('.slider');
		let sliderthree = this.template.querySelector('.sliderthree');

		let updateThumbPosition1 = () => {
			this.updateThumbLabelPosition(slider.value);
		};
		let updateThumbPosition2 = () => {
			this.updateThumbLabelPositionsec(slidersec.value);
		};
		let updateThumbPosition3 = () => {
			this.updateThumbLabelPositionthree(sliderthree.value);
		};

		if (slider) {
			slider.addEventListener('input', updateThumbPosition1);
			slider.addEventListener('mousemove', updateThumbPosition1);
		}

		if (slidersec) {
			slidersec.addEventListener('input', updateThumbPosition2);
			slidersec.addEventListener('mousemove', updateThumbPosition2);
		}
		if (sliderthree) {
			sliderthree.addEventListener('input', updateThumbPosition3);
			sliderthree.addEventListener('mousemove', updateThumbPosition3);
		}
	}

	// slider part 2

	handleInputChangesec(event) {
		this.sliderValuesec = event.target.value;
		this.updateThumbLabelPositionsec(this.sliderValuesec);

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

	//To place the value in right position inside the slider 
	updateThumbLabelPositionsec(sliderValuesec) {
		if (typeof window !== 'undefined') {
			let slidersec = this.template.querySelector('input');
			let thumbLabelsec = this.template.querySelector('.thumb-labelsec');

			let thumbWidthsec = parseFloat(
				window.getComputedStyle(thumbLabelsec).width
			);
			let sliderWidthsec = slidersec.offsetWidth;
			let thumbPositionsec =
				(sliderValuesec / slidersec.max) * (sliderWidthsec - thumbWidthsec);

			let newPositionsec =
				thumbPositionsec + thumbWidthsec / 2 - sliderWidthsec / 2;
			let maxPositionsec = sliderWidthsec - thumbWidthsec;
			thumbLabelsec.style.left =
				Math.min(maxPositionsec, Math.max(0, newPositionsec)) + 'px';
			thumbLabelsec.setAttribute('data-value', sliderValuesec);
		}
	}

	// slider part 3

	handleInputChangethree(event) {
		this.sliderValuethree = event.target.value;
		this.updateThumbLabelPositionthree(this.sliderValuethree);
		this.fourthQuestionResponse = event.target.value;
		this.nameToDraftFourth = event.target.name;

		if (this.fourthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.fourthQuestionResponse);
			this.arrayForPushId.push(this.fourthQuestionVersinId);
		}
		// Get the last values separately
		this.fourthRspValue = this.getLastRespValue();
		this.fourthVersionId = this.getLastIdValue();
	}

	//To place the value in right position inside the slider 
	updateThumbLabelPositionthree(sliderValuethree) {
		if (typeof window !== 'undefined') {
			let slidersec = this.template.querySelector('input');
			let thumbLabelsec = this.template.querySelector('.thumb-labelthree');

			let thumbWidthsec = parseFloat(
				window.getComputedStyle(thumbLabelsec).width
			);
			let sliderWidthsec = slidersec.offsetWidth;
			let thumbPositionsec =
				(sliderValuethree / slidersec.max) * (sliderWidthsec - thumbWidthsec);

			let newPositionsec =
				thumbPositionsec + thumbWidthsec / 2 - sliderWidthsec / 2;
			let maxPositionsec = sliderWidthsec - thumbWidthsec;
			thumbLabelsec.style.left =
				Math.min(maxPositionsec, Math.max(0, newPositionsec)) + 'px';
			thumbLabelsec.setAttribute('data-value', sliderValuethree);
		}
	}
	//popup method
	get popupClass() {
		return this.isPopupOpen ? 'popup-container' : 'popup-container hidden';
	}

	//save as draft popup
	get popupClassSaveDraft() {
		return this.isDraftSavedPopupOpen
			? 'popup-containersaveasdr'
			: ' .popup-containersaveasdr hidden';
	}

	get popupClass1() {
		return this.saveAsDraftPopUp ? 'popup2-container' : 'popup2-container hidden';
	}

	customHideModalPopup() {
		this.isPopupOpen = false;
		this.saveAsDraftPopUp = false;
		this.customFormModal = false;
	}

	//To get Response for the current Assessment for current user.
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(DRAFT_RESPONSE_OF_PSORIASIS, { questCatgryName: '$qsq', someBooleanParam: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ error, data }) {
		try {
			if (this.shouldFetchDraftResponses === true) {
				if (data) {
					this.responsOfDlqi = data;
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
					if (this.draftResponses.length >= 1) {
						let firstQuestion = this.draftResponses[0];
						this.firstResponseText = firstQuestion.questionText;
						this.firstResponseVersinId = firstQuestion.activeVersionId;
						// Check if the array has the expected length before accessing the elements
						if (this.draftResponses.length >= 2) {
							let secondQuestion = this.draftResponses[1];
							this.secondResponseText = secondQuestion.questionText;
							this.secondResponseVersinId = secondQuestion.activeVersionId;

							// Continue similarly for the third question
							if (this.draftResponses.length >= 3) {
								let thirdQuestion = this.draftResponses[2];
								this.thirdResponseText = thirdQuestion.questionText;
								this.thirdResponseVersinId = thirdQuestion.activeVersionId;
								// Continue similarly for the fourth question
								if (this.draftResponses.length >= 4) {
									let fourthQuestion = this.draftResponses[3];
									this.fourthResponseText = fourthQuestion.questionText;
									this.fourthResponseVersinId = fourthQuestion.activeVersionId;

									if (this.draftResponses.length >= 5) {
										let fifthQuestion = this.draftResponses[4];
										this.fifthResponseText = fifthQuestion.questionText;
										this.fifthResponseVersinId = fifthQuestion.activeVersionId;
										if (this.draftResponses.length >= 6) {
											let sixthQuestion = this.draftResponses[5];
											this.sixthResponseText = sixthQuestion.questionText;
											this.secSixthRespTex = this.sixthResponseText;
											this.sixthResponseVersinId =
												sixthQuestion.activeVersionId;
										}
									}
								}
							}
						}
					}
				}
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MSG, error.body.message, ERROR_VARIANT_TOAST); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MSG, err.message, ERROR_VARIANT_TOAST); // Catching Potential Error from LWC
		}
	}

	reposneModeeOn() {
    // Define arrays for response values
    const firstValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const secValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const fourthValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    // Define options for Yes/No
    const secYes = OPTION_VALUE_YES;
    const secNo = OPTION_VALUE_NO;

    // Define UI elements
    const fifthValues = {
        fifth1: this.informationCentre,
        fifth2: this.symptomTracker,
        fifth3: this.challenges,
        fifth4: this.questionnaire,
        fifth5: this.treatmentVideos,
        fifth6: this.support
    };

    // Iterate through response records
    this.responsOfDlqi.forEach((record) => {
        if (record.ResponseValue === null || record.AssessmentQuestion.Id === null) {
            return;
        }

        const responseValue = record.ResponseValue;
        const responseOrder = record.BI_PSP_ResponseOrder__c;
        const questionId = record.AssessmentQuestion.Id;

        switch (responseOrder) {
            case 1:
                this.sliderValue = firstValues.indexOf(responseValue);
                this.firstDraftResp = responseValue;
                this.updateThumbLabelPosition(this.sliderValue);
                this.firstDraftVerionId = questionId;
                break;

            case 2:
                this.isYesChecked = responseValue === secYes;
                this.isNoChecked = responseValue === secNo;
                this.secondDraftResp = responseValue;
                this.secondDraftVerionId = questionId;
                break;

            case 3:
                this.sliderValuesec = secValues.indexOf(responseValue);
                this.thirdDraftResp = responseValue;
                this.updateThumbLabelPositionsec(this.sliderValuesec);
                this.thirdDraftVersionId = questionId;
                break;

            case 4:
                this.sliderValuethree = fourthValues.indexOf(responseValue);
                this.fourthDraftRes = responseValue;
                this.updateThumbLabelPositionthree(this.sliderValuethree);
                this.fourthDraftVersionId = questionId;
                break;

            case 5:
                this.fifthinfo = responseValue.includes(fifthValues.fifth1);
                this.fifthSyTr = responseValue.includes(fifthValues.fifth2);
                this.fifthChallenges = responseValue.includes(fifthValues.fifth3);
                this.fifthQuestionnaire = responseValue.includes(fifthValues.fifth4);
                this.fifthTreatmentVideo = responseValue.includes(fifthValues.fifth5);
                this.fifthSupport = responseValue.includes(fifthValues.fifth6);
                this.fifthDraftResp = responseValue;
                this.fifthWithoudNewVals = responseValue;
                this.fifthDraftVersionId = questionId;
                break;

            case 6:
                this.seventhYess = responseValue === this.yes;
                this.seventhNoo = responseValue === this.no;
                this.sixthDraftResp = responseValue;
                this.sixthDraftVersionId = questionId;
                break;
			default:
				break;
        }
    });
}

	//To get Assessment Question
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_QUESTIONS, { questionnaireName: '$qsq' })
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

				let firstQuestion = this.questionData[0];
				let secondQuestion = this.questionData[1];
				let thirdQuestion = this.questionData[2];
				let fourthQuestion = this.questionData[3];
				let fifthQuestion = this.questionData[4];
				let sixthQuestion = this.questionData[5];
				let seventhQuestion = this.questionData[6];
				let eighthQuestion = this.questionData[7];

				this.firstQuestionText = firstQuestion.questionText;
				this.firstQuestionVersinId = firstQuestion.activeVersionId;
				this.secondQuestionText = secondQuestion.questionText;
				this.secondQuestionVersinId = secondQuestion.activeVersionId;
				this.thirdQuestionText = thirdQuestion.questionText;
				this.thirdQuestionVersinId = thirdQuestion.activeVersionId;
				this.fourthQuestionText = fourthQuestion.questionText;
				this.fourthQuestionVersinId = fourthQuestion.activeVersionId;
				this.fifthQuestionText = fifthQuestion.questionText;
				this.fifthQuestionVersinId = fifthQuestion.activeVersionId;
				this.sixthQuestionText = sixthQuestion.questionText;
				this.sixthQuestionVersinId = sixthQuestion.activeVersionId;
				this.seventhQuestionText = seventhQuestion.questionText;
				this.seventhQuestionVersinId = seventhQuestion.activeVersionId;

				this.eightQuestionText = eighthQuestion.questionText;
				this.eightQuestionVersinId = eighthQuestion.activeVersionId;
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MSG, error.body.message, ERROR_VARIANT_TOAST); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MSG, err.message, ERROR_VARIANT_TOAST); // Catching Potential Error from LWC
		}
	}
	//Handler First Question
	handleFirstQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		this.chekVal = event.target.value;

		if (this.chekVal === this.yes) {
			this.isYesChecked = true;
		} else {
			this.isYesChecked = false;
		}
		if (this.chekVal === this.no) {
			this.isNoChecked = true;
		} else {
			this.isNoChecked = false;
		}

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

	//Navigation methods

	navigateToCategory2() {
		window.location.assign(this.urlq + DLQI_QUESTIONNAIRE_URL);
	}
	navigateToCategory3() {
		window.location.assign(this.urlq + PSORIASIS_QUES_URL);
	}
	navigateToCategory4() {
		window.location.assign(this.urlq + WAPI_QUESTIONNAIRE);
	}

	handleSeve(event) {
		this.nameOfQuestion = event.target.name;
		this.checPrevoiusVal = this.fifthDraftResp;

		let chekVal = event.target.value;
		if (chekVal === this.informationCentre) {
			this.fifthinfo = true;
		}

		if (chekVal === this.symptomTracker) {
			this.fifthSyTr = true;
		}

		if (chekVal === this.challenges) {
			this.fifthChallenges = true;
		}

		if (chekVal === this.questionnaire) {
			this.fifthQuestionnaire = true;
		}

		if (chekVal === this.treatmentVideos) {
			this.fifthTreatmentVideo = true;
		}

		if (chekVal === this.support) {
			this.fifthSupport = true;
		}
		let checkBoval = event.target.checked;
		if (checkBoval) {
			this.checkedResVal = event.target.value;
		} else {
			this.unCheckedResVal = event.target.value;
			this.unCheckedArray.push(this.unCheckedResVal);
		}

		this.fifthQuestionresponse = event.target.value;
		this.nameToDraftFifth = event.target.name;

		if (this.fifthQuestionresponse !== '') {
			this.arrayForPushResp.push(this.fifthQuestionresponse);
			this.fifthArray.push(this.fifthQuestionresponse);
			this.arrayForPushId.push(this.fifthQuestionVersinId);
		}
		// Get the last values separately
		this.fifthResonseValue = this.getLastRespValue();
		this.fifthVersionId = this.getLastIdValue();

		let checke = event.target.checked;
		if (checke) {
			this.checkedResVal = event.target.value;
		} else {
			let uncheked = event.target.value;
			if (uncheked === this.informationCentre) {
				this.fifthinfo = false;
			}
			if (uncheked === this.symptomTracker) {
				this.fifthSyTr = false;
			}

			if (uncheked === this.challenges) {
				this.fifthChallenges = false;
			}

			if (uncheked === this.questionnaire) {
				this.fifthQuestionnaire = false;
			}

			if (uncheked === this.treatmentVideos) {
				this.fifthTreatmentVideo = false;
			}

			if (uncheked === this.support) {
				this.fifthSupport = false;
			}
		}
	}


	handlerealSixthQuestionChange(event) {
		this.nameOfQuestion = event.target.name;

		let chekVal = event.target.value;
		if (chekVal === this.yes) {
			this.seventhYess = true;
		} else {
			this.seventhYess = false;
		}
		if (chekVal === this.no) {
			this.seventhNoo = true;
		} else {
			this.seventhNoo = false;
		}

		this.sixthQuestionResponse = event.target.value;
		this.nameToDraftSixth = event.target.name;
		if (this.sixthQuestionResponse !== '') {
			this.arrayForPushResp.push(this.sixthQuestionResponse);

			this.arrayForPushId.push(this.sixthQuestionVersinId);
		}
		// Get the last values separately
		this.sixthResponseValue = this.getLastRespValue();
		this.sixthVersiD = this.getLastIdValue();
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

	// Utility function to handle value assignments and updates
	handleValues(array, values) {
		array.forEach((value, index) => {
			if (index < 6) {
				values[index] = value;
			}
		});

		// Concatenate the values with a space in between, excluding duplicates
		const concatenatedValues = [
			...new Set(values.filter(value => value !== undefined))
		].join(', ');

		return concatenatedValues;
	}

	// Utility function to update slider values
	updateSliderValue(sliderName, draftValue, responseValue) {
		if (responseValue !== '' && typeof draftValue !== 'undefined') {
			this[sliderName] = responseValue;
			this[`updateThumbLabelPosition${sliderName.charAt(0).toUpperCase() + sliderName.slice(1)}`](this[sliderName]);
		}

		if (typeof draftValue !== 'undefined' && responseValue === '') {
			this[sliderName] = draftValue;
			this[`updateThumbLabelPosition${sliderName.charAt(0).toUpperCase() + sliderName.slice(1)}`](this[sliderName]);
		}
	}

	closePopup() {
		document.body.style.overflow = '';
		this.isPopupOpen = false;
		this.popUpMenu = false;

		// Array to hold values
		const values = [undefined, undefined, undefined, undefined, undefined, undefined];

		// Handle value assignments
		const concatenatedValues = this.handleValues(this.fifthArray, values);
		this.fifthResonseValue = concatenatedValues;

		// Update slider values
		this.updateSliderValue('sliderValue', this.firstDraftResp, this.firstRspValue);
		this.updateSliderValue('sliderValuesec', this.thirdDraftResp, this.thirdRspValue);
		this.updateSliderValue('sliderValuethree', this.fourthDraftRes, this.fourthRspValue);

		// Update checkboxes
		this.isYesChecked = this.secondQuestionResponse === this.yes;
		this.isNoChecked = this.secondQuestionResponse === this.no;
		this.seventhYess = this.sixthQuestionResponse === this.yes;
		this.seventhNoo = this.sixthQuestionResponse === this.no;

		// Update fifth section values
		this.fifthinfo = concatenatedValues.includes(this.informationCentre);
		this.fifthSyTr = concatenatedValues.includes(this.symptomTracker);
		this.fifthChallenges = concatenatedValues.includes(this.challenges);
		this.fifthQuestionnaire = concatenatedValues.includes(this.questionnaire);
		this.fifthTreatmentVideo = concatenatedValues.includes(this.treatmentVideos);
		this.fifthSupport = concatenatedValues.includes(this.support);
	}

	closePopup1() {
		this.customFormModal = false;
		document.body.style.overflow = '';
		this.saveAsDraftPopUp = false;
		this.popUpMenu = false;

		// Array to hold values
		const values = [undefined, undefined, undefined, undefined, undefined, undefined];

		// Handle value assignments
		const concatenatedValues = this.handleValues(this.fifthArray, values);
		this.fifthResonseValue = concatenatedValues;

		// Update slider values
		this.updateSliderValue('sliderValue', this.firstDraftResp, this.firstRspValue);
		this.updateSliderValue('sliderValuesec', this.thirdDraftResp, this.thirdRspValue);
		this.updateSliderValue('sliderValuethree', this.fourthDraftRes, this.fourthRspValue);

		// Update checkboxes
		this.isYesChecked = this.secondQuestionResponse === this.yes;
		this.isNoChecked = this.secondQuestionResponse === this.no;
		this.seventhYess = this.sixthQuestionResponse === this.yes;
		this.seventhNoo = this.sixthQuestionResponse === this.no;

		// Update fifth section values
		this.fifthinfo = concatenatedValues.includes(this.informationCentre);
		this.fifthSyTr = concatenatedValues.includes(this.symptomTracker);
		this.fifthChallenges = concatenatedValues.includes(this.challenges);
		this.fifthQuestionnaire = concatenatedValues.includes(this.questionnaire);
		this.fifthTreatmentVideo = concatenatedValues.includes(this.treatmentVideos);
		this.fifthSupport = concatenatedValues.includes(this.support);
	}
	//Submit Response

	submitResponses() { // Set the flag to false before submitting responses
		if (this.isDesktop) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = ''; // Reset to default
		}

		this.popUpMenu = true;

		if (typeof this.firstDraftResp !== 'undefined') {
			this.nameToDraftFirst = 'firstQuestionResponse';
		}
		if (typeof this.secondDraftResp !== 'undefined') {
			this.nameToDraftSecond = 'secondQuestionResponse';
		}
		if (typeof this.thirdDraftResp !== 'undefined') {
			this.nameToDraftThird = 'thirdQuestionResponse';
		}
		if (typeof this.fourthDraftRes !== 'undefined') {
			this.nameToDraftFourth = 'fourthQuestionResponse';
		}
		if (typeof this.fifthDraftResp !== 'undefined') {
			this.nameToDraftFifth = 'fifthQuestionResponse';
		}
		if (typeof this.sixthDraftResp !== 'undefined') {
			this.nameToDraftSixth = 'fifthQuestionResponse';
		}

		if (
			this.nameToDraftFirst !== '' &&
			this.nameToDraftSecond !== '' &&
			this.nameToDraftThird !== '' &&
			this.nameToDraftFourth !== '' &&
			this.nameToDraftSixth !== ''
		) {
			this.isPopupOpen = true;
		} else {
			this.customFormModal = true;
			this.saveAsDraftPopUp = true;
			this.isPopupOpen = false;
		}
	}
	get popuphide() {
		if (this.popUpMenu === true) {
			return this.popUpMenu === true ? 'disabled' : '';
		}
		return '';
	}
	//SaveAsDraft methods and Navigate to outStanding Questionnaire
	saveAsDraft() {
		// Set the body overflow based on device type
		document.body.style.overflow = this.isDesktop ? 'hidden' : '';

		this.popUpMenu = true;

		// Extract values from fifthArray and handle additional values
		const values = this.extractValuesFromArray(this.fifthArray);
		const additionalValues = (this.checPrevoiusVal || '')
			.split(',')
			.map(value => value.trim());
		const valuesToExclude = new Set(this.unCheckedArray);
		const haveSameElements = additionalValues.every(value =>
			valuesToExclude.has(value)
		);

		if (haveSameElements) {
			this.fifthDraftResp = '';
			this.fifthDraftVersionId = '';
		}

		// Concatenate values and update response value
		const concatenatedValues = this.concatenateValues([
			...values,
			...additionalValues
		], valuesToExclude);
		this.fifthResonseValue = concatenatedValues;

		// Update response arrays
		this.updateResponseArrays();

		// Filter non-empty responses and IDs
		const nonEmptyResponses = this.realRespArray.filter(response => response !== '');
		const nonEmptyIds = this.realAssesVerArra.filter(id => id !== '');
		let draft =false;
		// Submit draft responses
		let twoMonths=true;
		if (nonEmptyResponses.length > 0) {
			DRAFT_RESPONSE_SUBMISSION({
				darftQuestionIds: nonEmptyIds,
				draftResponseTexts: nonEmptyResponses,
				isItDraftOrSubmit: draft,
				isQsqAfterTwoMonths :twoMonths
			})
				.then(() => {
					this.customFormModal = false;
					this.closePopup1 = false;
					this.checkyesorno = false;
					this.popUpMetod();
				})
				.catch((error) => {
					this.showToast(CONSOLE_ERROR_MSG, error.message, ERROR_VARIANT_TOAST);
				});
		} else {
			window.location.assign(this.urlq + OUTSTANDING_PAGE_URL);
		}
	}

	// Utility function to concatenate values with exclusions
	concatenateValues(values, valuesToExclude) {
		return [
			...new Set(
				values.filter(value => value !== undefined && !valuesToExclude.has(value))
			)
		].join(', ');
	}

	// Utility function to update response arrays
	updateResponseArrays() {
		const responses = [
			{ value: this.firstRspValue, draft: this.firstDraftResp, id: this.firstRespVersId, draftId: this.firstDraftVerionId },
			{ value: this.secondRspValue, draft: this.secondDraftResp, id: this.secondRespVersId, draftId: this.secondDraftVerionId },
			{ value: this.thirdRspValue, draft: this.thirdDraftResp, id: this.thirdVersionId, draftId: this.thirdDraftVersionId },
			{ value: this.fourthRspValue, draft: this.fourthDraftRes, id: this.fourthVersionId, draftId: this.fourthDraftVersionId },
			{ value: this.fifthResonseValue, draft: this.fifthDraftResp, id: this.fifthVersionId, draftId: this.fifthDraftVersionId },
			{ value: this.sixthResponseValue, draft: this.sixthDraftResp, id: this.sixthVersiD, draftId: this.sixthDraftVersionId }
		];

		responses.forEach(({ value, draft, id, draftId }) => {
			this.realRespArray.push(value !== '' ? value : draft);
			this.realAssesVerArra.push(id !== '' && value !== '' ? id : draftId);
		});
	}
	//To scroll the popup to above
	popUpMetod() {
		this.isDraftSavedPopupOpen = true;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
	closeDraftSavedPopup() {
		this.isDraftSavedPopupOpen = false;
		window.location.assign(this.urlq + OUTSTANDING_PAGE_URL);
	}
	// Confirm Submission List of Response
	confirmSubmission() {
		// Extract values from the fifthArray
		const values = this.extractValuesFromArray(this.fifthArray);

		// Handle additional values
		const additionalValues = (this.checPrevoiusVal || '')
			.split(',')
			.map(value => value.trim());
		const valuesToExclude = new Set(this.unCheckedArray);
		const haveSameElements = additionalValues.every(value =>
			valuesToExclude.has(value)
		);

		if (haveSameElements) {
			this.fifthDraftResp = '';
			this.fifthDraftVersionId = '';
		}

		// Concatenate values and update response value
		this.fifthResonseValue = this.concatenateValues([
			...values,
			...additionalValues
		], valuesToExclude);

		// Update response arrays
		this.updateResponseArrays();

		// Filter non-empty responses and IDs
		const responseArray = this.filterNonEmpty(this.realRespArray);
		const versionIdArray = this.filterNonEmpty(this.realAssesVerArra);

		this.numberOfResponses = responseArray.length;

		// Submit assessment response if conditions are met
		if (this.numberOfResponses === 5 || this.numberOfResponses === 6) {
			this.submitAssessmentResponse(responseArray, versionIdArray);
		}
	}

	// Utility function to extract values from an array
	extractValuesFromArray(array) {
		const values = [];
		for (let i = 0; i < Math.min(6, array.length); i++) {
			values[i] = array[i];
		}
		return values;
	}

	// Utility function to filter non-empty items
	filterNonEmpty(array) {
		return array.filter(item => item !== '');
	}

	// Utility function to submit assessment response
	submitAssessmentResponse(responses, ids) {
		let twoOrFourtnWeeks = true;
		let twoMonths=true;
		if (responses.length > 0) {
			SUBMIT_ASSESSMENT_RESPONSE({
				darftQuestionIds: ids,
				draftResponseTexts: responses,
				isItDraftOrSubmit: twoOrFourtnWeeks,
				isQsqAfterTwoMonths :twoMonths
			})
				.then(() => {
					window.location.assign(this.urlq + OUTSTANDING_PAGE_URL);
				})
				.catch((error) => {
					this.showToast(CONSOLE_ERROR_MSG, error.message, ERROR_VARIANT_TOAST);
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