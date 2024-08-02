// This Card displays information related to the Introduction, aiding in the presentation and understanding of its contents.
//To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_ASSESSMENTS from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
//To import Static Resource
import letPersonalize from '@salesforce/resourceUrl/BI_PSP_LetsPersnlizeImg';
//To import Custom labels
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
//To get UserId
import Id from '@salesforce/user/Id';
//To import custom labels
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire'; 
export default class BiPspbIntroductionCard extends LightningElement {
	//Global variables(without @track does not trigger automatic re-renders)
	answeredQuestions = 0;
	totalQuestionCount = 15;
	userId = Id;
	patientStatus;
	desiredComponent;
	error;
	expiresIn;
	categoryName = labels.INTRODUCTION_CATEGORY;
	isStartLabel = true;
	cardImage = letPersonalize;
	letptext = labels.LETS_PERSONLIZETEXT;
	rolldate = labels.ROLLOUT_DATE_TEXT;
	answerLabel = labels.ANS_LABEL;
	answerLabelOne =labels.ANS_LABEL_ONE;
	answerLabelTwo =labels.ANS_LABEL_TWO;
	answerLabelThree = labels.ANS_LABEL_THREE;
	answerLabelFour = labels.ANS_LABEL_FOUR;
	answeredlabel = labels.ANS_LABEL_Five;
	urlq;
	draftTruFale = false;

	// To get site Url to find the Current SiteName
	//To get site url
	renderedCallback() {
		try {
			let currentURL = window.location.href;
			let urlObject = new URL(currentURL);
			let path = urlObject.pathname;
			let pathComponents = path.split('/');
			let desiredComponent = pathComponents.find((component) =>
				[labels.BRANDED_URL.toLowerCase(), labels.UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (desiredComponent.toLowerCase() === labels.BRANDED_URL.toLowerCase()) {
				this.urlq = labels.BRANDED_NAVI_URL;
			} else {
				this.urlq = labels.UN_ASSIGNED_URL_NAVI;
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
	@wire(GET_ASSESSMENTS, { questCatgryName: '$categoryName', twoMonths: '$draftTruFale' })
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
						record.ResponseText === labels.YES_LABEL
					) {
						this.totalQuestionCount = 16;
						this.answeredQuestions = this.records.length;
					} else if (
						record.BI_PSP_ResponseOrder__c === 5 &&
						record.ResponseText === labels.NO_LABEL
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
					this.answeredQuestions > 0 || this.answeredQuestions === this.totalQuestionCount
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
			return labels.RESUME;
		}
		if (this.answeredQuestions === 0) {
			this.isStartLabel = true;

			return labels.START_LABEL;
		}
		this.isStartLabel = false;
		return labels.RESUME;
	}
	//Navigation for Questionnaire
	handleButtonClick() {
		if (this.buttonLabel === labels.START_LABEL) {
			window.location.assign(this.urlq + labels.LETSPERSONLIZE_URL);

			this.showRolloutDate = false;
		} else if (this.buttonLabel === labels.RESUME) {
			window.location.assign(this.urlq + labels.LETSPERSONLIZE_URL);
		} else {
			window.location.assign(this.urlq + labels.LETSPERSONLIZE_URL);
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