// This Card displays information related to the Introduction, aiding in the presentation and understanding of its contents.
//To import Libraries
import { LightningElement, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_CATEGORY_STATUS from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import GET_ASSESSMENT_BY_USER_NAME from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
//To import Static Resource
import letPersonalize from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
//To import Custom labels
import INTRODUCTION_CATEGORY from '@salesforce/label/c.BI_PSP_IntroductionTxt';
import LETS_PERSONLIZETEXT from '@salesforce/label/c.BI_PSP_PersonlizeHeading';
import ROLLOUT_DATE_TEXT from '@salesforce/label/c.BI_PSP_RolloutDateForCard';
import ANS_LABEL from '@salesforce/label/c.BI_PSP_AnwerLabel';
import ANS_LABEL_ONE from '@salesforce/label/c.BI_PSP_LetsPersonlizeMessage';
import ANS_LABEL_TWO from '@salesforce/label/c.BI_PSP_LetsPersonlizeMsgOne';
import ANS_LABEL_THREE from '@salesforce/label/c.BI_PSP_LetsPersonlizeMsgTwo';
import ANS_LABEL_FOUR from '@salesforce/label/c.BI_PSP_LetsPersonlizeMsgThree';
import ANS_LABEL_Five from '@salesforce/label/c.BI_PSP_AnsweredLabel';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UN_ASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_NAVI_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UN_ASSIGNED_NAVI_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import RESUME from '@salesforce/label/c.BI_PSP_ResumeTxt';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import YES_LABEL from '@salesforce/label/c.BI_PSP_OptionValueYes';
import NO_LABEL from '@salesforce/label/c.BI_PSP_OptionValueNo';
import START_LABEL from '@salesforce/label/c.BI_PSP_StartLabel';
import LETSPERSONLIZE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
//To get UserId
import Id from '@salesforce/user/Id';
export default class BiPspbIntroductionCard extends LightningElement {
	//Track variable Declarations(re-render variables)
	answeredQuestions = 0;
	totalQuestionCount = 15;
	//Global variables(without @track does not trigger automatic re-renders)
	userId = Id;
	patientStatus;
	desiredComponent;
	assessmentId=null;
	error;
	expiresIn;
	categoryName = INTRODUCTION_CATEGORY;
	isStartLabel = true;
	cardImage = letPersonalize;
	letptext = LETS_PERSONLIZETEXT;
	rolldate = ROLLOUT_DATE_TEXT;
	answerLabel = ANS_LABEL;
	answerLabelOne = ANS_LABEL_ONE;
	answerLabelTwo = ANS_LABEL_TWO;
	answerLabelThree = ANS_LABEL_THREE;
	answerLabelFour = ANS_LABEL_FOUR;
	answeredlabel = ANS_LABEL_Five;
	urlq;
	draftTruFale=false;

	// To get site Url to find the Current SiteName
	//To get site url
	renderedCallback() {
		try {
			let currentURL = window.location.href;
			let urlObject = new URL(currentURL);
			let path = urlObject.pathname;
			let pathComponents = path.split('/');
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_NAVI_URL;
			} else {
				this.urlq = UN_ASSIGNED_NAVI_URL;
			}
		} catch (error) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error
		}
	}

	// for mobile css call property
	get flexCard() {
		let globalThis = window;
		let flexCrd = globalThis?.innerWidth;
		if (flexCrd <= 600) {
			return this.isStartLabel ? 'flexCard' : 'flexcard1';
		}
		return 'flexCard';
	}
	get bottomBar() {
		let globalThis = window;
		let bottmBar = globalThis?.innerWidth;
		if (bottmBar <= 600) {
			return this.isStartLabel ? 'bottomBar' : 'bottomBar1';
		}
		return 'bottomBar';
	}
	get ans() {
		let globalThis = window;
		let answer = globalThis?.innerWidth;
		if (answer <= 600) {
			return this.isStartLabel ? 'ans' : 'ans1';
		}
		return 'ans';
	}
	get shiftImage() {
		let globalThis = window;
		let img = globalThis?.innerWidth;
		if (img <= 600) {
			return this.isStartLabel ? 'image' : 'image1';
		}
		return 'image';
	}
	get totalQuestion() {
		let globalThis = window;
		let overallQstns = globalThis?.innerWidth;
		if (overallQstns <= 600) {
			return this.isStartLabel ? 'dlqi1' : 'dlqi11';
		}
		return 'dlqi1';
	}

	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
    Even if there are no assessment records, we show the cards for the user to create assessment records. 
	The page will not be blank.
    */
	@wire(GET_ASSESSMENT_BY_USER_NAME, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
    Even if there are no assessment records, we show the cards for the user to create assessment records. 
	The page will not be blank.
    */
	@wire(GET_CATEGORY_STATUS, {questCatgryName:'$categoryName',twoMonths:'$draftTruFale' })
	wiredCategoryStatus({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from apex
			} else if (data) {
				this.records = data;
				this.answeredQuestions = this.records.length;

				this.records.forEach((record) => {
					if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === YES_LABEL
					) {
						this.totalQuestionCount = 16;
						this.answeredQuestions = this.records.length;
					} else if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === NO_LABEL
					) {
						this.answeredQuestions = this.records.length;
					}
				});
				if (this.answeredQuestions > this.totalQuestionCount) {
					this.totalQuestionCount = 16;
					
				}
				else if (
					this.totalQuestionCount !== this.answeredQuestions &&
					this.answeredQuestions < this.totalQuestionCount &&
					this.answeredQuestions > 0 
				) {
					this.isStartLabel = false;
				} else if (this.status === EXPIRED) {
					this.isStartLabel = true;
					this.answeredQuestions = 0;
				} else if (
					this.answeredQuestions === this.totalQuestionCount
				) {
					this.isStartLabel = false;
				}
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	// To update the dynamic button label arrow and button
	get buttonLabel() {

		if (
			this.totalQuestionCount !== this.answeredQuestions &&
			this.answeredQuestions < this.totalQuestionCount &&
			this.answeredQuestions > 0
		) {
			this.isStartLabel = false;
			return RESUME;
		}
		if (!this.assessmentId) {
			this.isStartLabel = true;

			return START_LABEL;
		} 
		this.isStartLabel = false;
		return RESUME;
	}
	//Navigation for Questionnaire
	handleButtonClick() {
		if (this.buttonLabel === START_LABEL) {
			window.location.assign(this.urlq + LETSPERSONLIZE_URL);

			this.showRolloutDate = false;
		} else if (this.buttonLabel === RESUME) {
			window.location.assign(this.urlq + LETSPERSONLIZE_URL);
		} else {
			window.location.assign(this.urlq + LETSPERSONLIZE_URL);
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