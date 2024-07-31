//	This Card displays information related to the Qualitative satisfaction questionnaire,aiding in the presentation and understanding of its contents.
//To import Libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_CATEGORY_STATUS from '@salesforce/apex/BI_PSP_AssessmentCtrl.getCategoryStatus';
import GET_ASSESSMENT_BY_CURRENT_USER from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Static Resource
import QUALITATIVE_IMG from '@salesforce/resourceUrl/BI_PSP_QualitativeImage';
//To import Custom labels
import EXPIRE_LABEL from '@salesforce/label/c.BI_PSP_ExpireInLabel';
import QUALITATIVE_LABEL from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import ROLLOUT_DATE_TXT from '@salesforce/label/c.BI_PSP_RolloutDateForCard';
import ANS_LABEL from '@salesforce/label/c.BI_PSP_AnsweredLabel';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import QUALITATIVE_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import QUALITATIVE_FOURTEENWEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenWeeks';
import QUALITATIVE_COMPLETED_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import QUALITATIVE_COMPLETED_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import IN_PROGRESS from '@salesforce/label/c.BI_PSP_InProgressTxt';
import RESUME from '@salesforce/label/c.BI_PSP_ResumeTxt';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETE from '@salesforce/label/c.BI_PSP_Complete';
import START_LABEL from '@salesforce/label/c.BI_PSP_StartLabel';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
//To get UserId
import Id from '@salesforce/user/Id';
export default class BiPspbQualitativeCard extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//Track variable Declarations(re-render variables)
	@track targetTwoMonthsDate;
	@track targetFourteenWeeksDate;
	@track categoryName = QUALITATIVE_LABEL;
	@track totalquestioncount = 0;
	@track answeredQuestions = 0;
	//Global variables(without @track does not trigger automatic re-renders)
	userid = Id;
	assessmentId;
	error;
	statusFourteenWeek;
	rolloutDate;
	expiresIn;
	isStartLabel = false;
	threeMonthsVar = '';
	forteenWeeks = '';
	shouldShowComponent = false;
	showRolloutDateCard = true;
	showAnswerQuestionsText = false;
	cardImage = QUALITATIVE_IMG;
	expireLabel = EXPIRE_LABEL;
	rollOut = ROLLOUT_DATE_TXT;
	answeredLabel = ANS_LABEL;
	urlq;

	//For mobile Response
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
	get dlqiText() {
		let globalThis = window;
		let dlqi = globalThis?.innerWidth;

		if (dlqi <= 600) {
			return this.isStartLabel ? 'dlqi2' : 'dlqi22';
		}
		return 'dlqi2';

	}
	get dlqiChangeTxt() {
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
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVI;
			} else {
				this.urlq = UNASSIGNED_URL_NAVI;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error
		}
	}

	//Getting assessment records and status
	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
    Even if there are no assessment records, we show the cards for the user to create assessment records. 
	The page will not be blank.
    */
	@wire(GET_ASSESSMENT_BY_CURRENT_USER, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
				this.statusFourteenWeek =
					data.length > 0 ? data[0].BI_PSP_StatusForPersonalization__c : null;

				if (this.status === COMPLETED_LABEL) {
					this.shouldShowComponent = false;
				}
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
				return;
			}

			if (data) {
				this.handleEnrollmentData(data);
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	handleEnrollmentData(data) {
		this.targetTwoMonthsDate = data.targetTwoMonthsDate ?? null;
		this.targetFourteenWeeksDate = data.targetFourteenWeeksDate ?? null;

		if (this.targetFourteenWeeksDate !== null) {
			this.processEnrollmentDate(this.targetFourteenWeeksDate, 7);
		} else if (this.targetTwoMonthsDate !== null) {
			this.processEnrollmentDate(this.targetTwoMonthsDate, 6);
		}
	}

	processEnrollmentDate(enrollmentDate, questionCount) {
		this.shouldShowComponent = true;
		let currentDate = new Date(enrollmentDate);
		this.totalquestioncount = questionCount;

		if (!this.assessmentId || this.status === EXPIRED || this.status === IN_PROGRESS || this.status === COMPLETED_LABEL) {
			if (this.status === IN_PROGRESS) {
				this.isStartLabel = false;
			} else if (this.status === COMPLETED_LABEL || this.statusFourteenWeek === COMPLETE) {
				this.shouldShowComponent = false;
			} else {
				this.isStartLabel = true;
			}

			if (this.status === EXPIRED && this.targetFourteenWeeksDate === null) {
				this.shouldShowComponent = false;
			}

			this.setRolloutAndExpireDates(currentDate);
		}
	}

	setRolloutAndExpireDates(currentDate) {
		this.rolloutDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
		let currentDate1 = new Date(this.rolloutDate);
		currentDate1.setDate(currentDate1.getDate() + 30);
		this.expireDate = currentDate1.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

		let todayMs = new Date().getTime();
		let expireDateMs = new Date(this.expireDate).getTime();
		let differenceInDays = Math.ceil((expireDateMs - todayMs) / (1000 * 60 * 60 * 24));
		this.expiresIn = Math.min(differenceInDays, 30); // Ensure expiresIn doesn't exceed 30 days
	}

	//get the assessment related assessment response by passing assessment
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
				if (!this.assessmentId) {
					this.showAnswerQuestionsText = false;
					this.showRolloutDateCard = true;
				} else if (
					this.totalquestioncount === this.answeredQuestions &&
					this.status === IN_PROGRESS
				) {
					this.isStartLabel = false;
				} else if (
					this.totalquestioncount !== this.answeredQuestions &&
					this.answeredQuestions < this.totalquestioncount &&
					this.answeredQuestions > 0 &&
					this.status === IN_PROGRESS
				) {
					this.showRolloutDateCard = true;
					this.showAnswerQuestionsText = false;
					this.isStartLabel = false;
				} else if (this.status === EXPIRED) {
					this.isStartLabel = true;
					this.showAnswerQuestionsText = false;
					this.showRolloutDateCard = true;
					this.answeredQuestions = 0;
				} else if (
					this.answeredQuestions === this.totalquestioncount &&
					this.status === COMPLETED_LABEL
				) {
					this.showRolloutDateCard = true;

					this.isStartLabel = false;
				}
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	//To change dynamic button by button label
	get buttonLabel() {
		if (!this.assessmentId) {
			this.isStartLabel = true;
			return START_LABEL;
		} else if (
			this.totalquestioncount === this.answeredQuestions &&
			this.status === IN_PROGRESS
		) {
			this.isStartLabel = false;
			return RESUME;
		} else if (
			this.totalquestioncount !== this.answeredQuestions &&
			this.status === COMPLETED_LABEL
		) {
			this.isStartLabel = false;
			return COMPLETED_LABEL;
		} else if (
			this.totalquestioncount !== this.answeredQuestions &&
			this.answeredQuestions < this.totalquestioncount &&
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

	//Navigation for Questionnaire
	handleButtonClick() {
		if (this.buttonLabel === START_LABEL) {
			if (this.targetFourteenWeeksDate !== null) {
				window.location.assign(this.urlq + QUALITATIVE_FOURTEENWEEKS);
			} else {
				window.location.assign(this.urlq + QUALITATIVE_TWO_MONTHS);
			}
		} else if (this.buttonLabel === RESUME) {
			if (this.targetFourteenWeeksDate !== null) {
				window.location.assign(this.urlq + QUALITATIVE_FOURTEENWEEKS);
			} else {
				window.location.assign(this.urlq + QUALITATIVE_TWO_MONTHS);
			}
			this.showRolloutDateCard = true;
		} else {
			this.showRolloutDateCard = true;

			if (this.targetFourteenWeeksDate !== null) {
				window.location.assign(this.urlq + QUALITATIVE_COMPLETED_FOURTEEN_WEEKS);
			} else {
				window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWO_MONTHS);
			}
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