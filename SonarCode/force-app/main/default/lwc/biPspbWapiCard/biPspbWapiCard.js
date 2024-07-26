//This Card displays information related to the Work & Activity Impairment (WPAI), aiding in the presentation and understanding of its contents.
//To import Libraries
import { LightningElement, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_CATEGORY_STATUS from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCategoryStatus';
import GET_ASSESSMENT_BY_CURRENT_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_DRAFT_RESPONSE_FOR_WAPI from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import GET_ROLLOUT_DATE from '@salesforce/apex/BI_PSP_AssessmentCtrl.getRolloutdate';
//To import Static Resource
import WORK_ACTIVITY_IMG from '@salesforce/resourceUrl/BI_PSP_WpaiImage';
//To import Custom labels
import WPAI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import EXPIRE_LABEL from '@salesforce/label/c.BI_PSP_ExpireInLabel';
import ROLLOUT_DATE_TEXT from '@salesforce/label/c.BI_PSP_RolloutDateForCard';
import ANS_LABEL from '@salesforce/label/c.BI_PSP_AnsweredLabel';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UN_ASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_NAVI_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UN_ASSIGNED_NAVI_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import COMPLETED from '@salesforce/label/c.BI_PSP_CompletedOn';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import IN_PROGRESS from '@salesforce/label/c.BI_PSP_InProgressTxt';
import RESUME from '@salesforce/label/c.BI_PSP_ResumeTxt';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import YES_LABEL from '@salesforce/label/c.BI_PSP_OptionValueYes';
import START_LABEL from '@salesforce/label/c.BI_PSP_StartLabel';
import WPAI_QUESTIONAIRE from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import WPAI_COMPLETED_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
//To get UserId
import Id from '@salesforce/user/Id';

export default class BiPspbWapiCard extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//Track variable Declarations(re-render variables)
	categoryName = WPAI_CATEGORY;
	totalQuestionCount = 2;
	answeredQuestions = 0;
	//Global variables(without @track does not trigger automatic re-renders)
	dateResponses = [];
	assessmentId;
	rolloutDate;
	expiresIn;
	isStartLabel = true;
	userId = Id;
	cardImage = WORK_ACTIVITY_IMG;
	storeDate;
	status = COMPLETED_LABEL;
	expireDate;
	expireApexDate;
	expiresIntext = EXPIRE_LABEL;
	rollOut = ROLLOUT_DATE_TEXT;
	ansText = ANS_LABEL;
	showCompletedDate = false;
	completedOnDate;
	completedOn = COMPLETED;
	rollOutDateOne;
	isDataLoaded = false;
	completedDateFromAssessment = null;
	twoMonthsTrueFalse=false;
	// To get site Url to find the Current SiteName
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
				this.urlq = BRANDED_NAVI_URL;
			} else {
				this.urlq = UN_ASSIGNED_NAVI_URL;
			}
		} catch (error) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error
		}
	}

	// Mobile responsive Layout
	get flexCard() {
		let globalThis = window;
		let flexCrd = globalThis?.innerWidth;
		if (flexCrd <= 600) {
			return this.isStartLabel ? 'flexCard' : 'flexCard1';
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
	get image() {
		let globalThis = window;
		let img = globalThis?.innerWidth;
		if (img <= 600) {
			return this.isStartLabel ? 'image' : 'image1';
		}
		return 'image1';
	}
	get dlqi2() {
		let globalThis = window;
		let dlqi = globalThis?.innerWidth;
		if (dlqi <= 600) {
			return this.isStartLabel ? 'dlqi2' : 'dlqi22';
		}
		return 'dlqi2';
	}
	get dlqi3() {
		let globalThis = window;
		let dlqiThree = globalThis?.innerWidth;
		if (dlqiThree <= 600) {
			return this.isStartLabel ? 'dlqi3' : 'dlqi33';
		}
		return 'dlqi3';
	}
	get ans() {
		let globalThis = window;
		let answer = globalThis?.innerWidth;
		if (answer <= 600) {
			return this.isStartLabel ? 'ans' : 'ans1';
		}
		return 'ans';
	}
	@wire(GET_ASSESSMENT_BY_CURRENT_USER, { categoryname: '$categoryName' })
	wiredAssessments({ data, error }) {
		if (data) {
			this.handleAssessments(data);
		} else if (error) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
		}
	}
	handleAssessments(data) {
		this.assessmentId = data.length > 0 ? data[0].Id : null;
		this.status = data.length > 0 ? data[0].AssessmentStatus : null;
		this.completedDateFromAssessment = data.length > 0 ? data[0].BI_PSP_RolloutforCompletedQuestionnarie__c : null;
		this.handleDateForCard(this.completedDateFromAssessment);
		if (this.status === EXPIRED) {
			this.setDates(data.length > 0 ? data[0].ExpirationDateTime : null);
		} else if (this.status === COMPLETED_LABEL) {
			this.isStartLabel = false;
			this.showCompletedDate = true;
			this.setCompletedDate(data.length > 0 ? data[0].EffectiveDateTime : null);
		}
	}

	@wire(GET_ROLLOUT_DATE)
	wiredQSPData({ data, error }) {
		if (data) {
			this.handleRolloutDate(data);
		} else if (error) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
		}
	}

	handleDateForCard(data) {
		this.rollOutDateCard = data;
		if (this.status === IN_PROGRESS || this.status === COMPLETED_LABEL) {
			this.setDates(this.rollOutDateCard);
		}
		this.isDataLoaded = true;
	}
	handleRolloutDate(data) {
		this.dateResponses = data;
		if (!this.assessmentId) {
			this.storeDate = data[0]?.BI_PSP_PSS_RollOutDate__c || null;
			this.setDates(this.storeDate);
		}
	}

	setDates(date) {
		let currentDate = new Date(date);
		this.rolloutDate = this.formatDate(currentDate);

		let expireDate = new Date(currentDate);
		expireDate.setDate(expireDate.getDate() + 30);
		this.expireDate = this.formatDate(expireDate);

		this.expiresIn = this.calculateDifferenceInDays(expireDate);
		if (this.expiresIn > 30 || this.expiresIn < 0) {
			this.expiresIn = 30;
		}
	}

	setCompletedDate(date) {
		let currentDate = new Date(date);
		this.completedOnDate = this.formatDate(currentDate);
	}

	formatDate(date) {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	calculateDifferenceInDays(date) {
		let todayMs = new Date().getTime();
		let expireDateMs = date.getTime();
		return Math.ceil((expireDateMs - todayMs) / (1000 * 60 * 60 * 24));
	}
	//getting Response for diplaying in cards on particular senario
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_DRAFT_RESPONSE_FOR_WAPI, { questCatgryName: '$categoryName', someBooleanParam: '$twoMonthsTrueFalse' })
	wiredDraftResponses({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				let objectsWithResponseOrder = data.filter(
					(item) => item.BI_PSP_ResponseOrder__c === 1
				);
				if (objectsWithResponseOrder.length > 0) {
					if (objectsWithResponseOrder[0].ResponseValue === YES_LABEL) {
						this.totalQuestionCount = 6;
					} else {
						this.totalQuestionCount = 2;
					}
				}
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//To get the answered Response by passing Assessment
	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
    Even if there are no assessment records, we show the cards for the user to create assessment records. 
	The page will not be blank.
    */
	@wire(GET_CATEGORY_STATUS, { assessmentId: '$assessmentId' })
	wiredCategoryStatus({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.answeredQuestions = data;
				if (this.answeredQuestions > this.totalQuestionCount) {
					this.totalQuestionCount = 6;
				}
				if (!this.assessmentId) {
					this.showRolloutDate1 = true;
				} else if (
					this.totalQuestionCount === this.answeredQuestions &&
					this.status === IN_PROGRESS
				) {
					this.isStartLabel = false;
				} else if (
					this.totalQuestionCount !== this.answeredQuestions &&
					this.answeredQuestions < this.totalQuestionCount &&
					this.answeredQuestions > 0 &&
					this.status === IN_PROGRESS
				) {
					this.showRolloutDate1 = true;

					this.isStartLabel = false;
				} else if (this.status === EXPIRED) {
					this.isStartLabel = true;

					this.showRolloutDate1 = true;
					this.answeredQuestions = 0;
					this.totalQuestionCount = 2;
				} else if (
					this.answeredQuestions === this.totalQuestionCount &&
					this.status === COMPLETED_LABEL
				) {
					this.showRolloutDate1 = true;

					this.isStartLabel = false;
				}
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	//To change dynamic button

	get buttonLabel() {
		if (!this.assessmentId) {
			this.isStartLabel = true;

			return START_LABEL;
		} else if (
			this.totalQuestionCount === this.answeredQuestions &&
			this.status === IN_PROGRESS
		) {
			this.isStartLabel = false;
			return RESUME;
		} else if (
			this.totalQuestionCount !== this.answeredQuestions &&
			this.answeredQuestions < this.totalQuestionCount &&
			this.answeredQuestions > 0
		) {
			this.isStartLabel = false;
			return RESUME;
		} else if (this.status === EXPIRED) {
			this.isStartLabel = true;
			return START_LABEL;
		}
		this.isStartLabel = false;
		return COMPLETED_LABEL;
	}
	// Navigation for Questionnaire
	handleButtonClick() {
		if (this.buttonLabel === START_LABEL) {
			let rolldate = new Date(this.rolloutDate);
			let currentDate = new Date();

			if (currentDate >= rolldate) {
				window.location.assign(this.urlq + WPAI_QUESTIONAIRE);
			}
			this.showRolloutDate1 = true;
		} else if (this.buttonLabel === RESUME) {
			window.location.assign(this.urlq + WPAI_QUESTIONAIRE);
		} else {
			window.location.assign(this.urlq + WPAI_COMPLETED_QUESTIONNAIRE);
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