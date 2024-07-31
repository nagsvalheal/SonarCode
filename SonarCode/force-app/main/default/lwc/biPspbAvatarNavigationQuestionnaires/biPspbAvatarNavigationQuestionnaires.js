//This Lightning web component purpose is Avatar Prompt message for all the navigation pages
//To import the Libraries
import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import the Apex class
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import GET_ASSESSMENT_BY_CURRENT_USERNAME_PSS from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_DRAFT_RESPONSE from '@salesforce/apex/BI_PSP_DraftResponseCtrl.retrieveDrfatResponses';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import the User Id
import Id from '@salesforce/user/Id';
//To Import The Static Resources
import DEFAULT_AVATAR_NAVIGATION from '@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation';
//To Import the Custom Labels
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import BR_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import AVATAR_QUESTIONNAIRE_TWO_URL from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireTwoUrl';
import AVATAR_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireUrl';
import OUTSTANDING_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import LETS_PERSONALIZE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import DLQI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl';
import PSS_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import WAPI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import QSQ_TWOMONTHS_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import QSQ_FOURTEENWEEKS_URL from '@salesforce/label/c.BI_PSPB_FourteenWeeks';
import WAPI_COMPLETED from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import PSS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import QSQ_TWOMONTHS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import QSQ_FOURTEENWEEKS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import PATIENT_FIRST_AVATAR from '@salesforce/label/c.BI_PSPB_PatientFirstAvatar';
import DLQI_CATEGORY from '@salesforce/label/c.BI_PSP_DlqiCategory';
import PSS_CATEGORY from '@salesforce/label/c.BI_PSP_PssCategory';
import WAPI_CATEGORY from '@salesforce/label/c.BI_PSP_WapiCategory';
import XP_VALUE from '@salesforce/label/c.BI_PSPB_XpValue';
import SUMMARY_URL from '@salesforce/label/c.BI_PSPB_SummaryUrl';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETE from '@salesforce/label/c.BI_PSP_Complete';
import IN_PROGRESS from '@salesforce/label/c.BI_PSP_InProgressTxt';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import QUALITATIVE_LABEL from '@salesforce/label/c.BI_PSP_QualitativeCategory';
export default class BiPspbAvatarNavigationQuestionnaires extends LightningElement {
	// Declaration of variables with @track
	saveAsDraftMsg;
	contentDot = true;
	content = false;
	summary = false;
	twoContent = false;
	challangeContent = false;
	mobileName;
	twoMobileName;
	navigationContentDotOne;
	navigationContentFive = 'navigationcontent5'; //css class
	selected;
	selectedName = '';
	selectedNameOne;
	selectedNameThree;
	selectedNameTwo;
	selectedNameFour;
	selectedNameFive;
	caregiver = false;
	main = true;
	showAllCmps = true;
	xpValue;
	closeValue = 'close'; //css class
	cuurentTab;
	contentDotOne = false;
	twoContentMobile = false;
	challengeContentMobile = false;
	subMobile;
	twoContentMobileOne = false;
	// Declaration of variables 
	userContacts;
	name;
	rendered = false;
	avtList;
	selectedAvatarSrc;
	seperateChallenge;
	userAccounts;
	shouldShowComponent = false;
	challengeNameOne;
	challengeNameTwo;
	userId = Id;
	wpaiCategory = WAPI_CATEGORY;
	twoMonthsTrueFalse = false;
	qualitative = false;
	questionResponseForSeven;
	categoryName = QUALITATIVE_LABEL;
	dermo = false;
	showClose = false;
	@api
	get receivedXpValue() {
		return this.xpValue;
	}
	set receivedXpValue(value) {
		this.xpValue = value;
		if (this.xpValue === XP_VALUE) {
			this.challangeContent = false;
		}
	}
	// To het the Response for WAPI

	@wire(GET_DRAFT_RESPONSE, { questCatgryName: '$wpaiCategory', someBooleanParam: '$twoMonthsTrueFalse' })

	wiredDraftResponses({ data }) {

		try {

			if (data) {

				const objectsWithResponseOrderSeven = data.filter(item => item.BI_PSP_ResponseOrder__c === 1);
				this.questionResponseForSeven = objectsWithResponseOrderSeven[0].ResponseValue;
			}

		}
		catch (error) {
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
		}
	}
	@api
	get valuefromparent() {
		return this.valueFromParentValue;
	}
	set valuefromparent(value) {

		this.valueFromParentValue = value;
		if (value === 'No') {
			this.mobileName = `Work Productivity and Activity
Impairment Questionnaire (WPAI...`


			this.selectedNameOne = `Work Productivity and Activity
Impairment Questionnaire (WPAI)

This WPAI questionnaire is a 
questionnaire that measures the impact
of generalized pustular psoriasis (GPP)
on work productivity and activity
impairment.

Questions on this page ask about how
your GPP affects your ability to work
and perform regular activities. `

		}

		else {

			this.mobileName = `Questions on this page ask about
the effect of your health problem...`

			this.selectedNameOne = `Questions on this page ask about the
effect of your health problems on your
ability to work and perform regular
activities. By health problems we mean
any physical or emotional problem or 
symptom. The Work Productivity and 
Activity Impairment Questionnaire 
(WPAI) is not a study. It's a questionnaire 
aimed at helping you track how GPP 
impacts your work productivity and 
activity impairment and can be useful 
for discussions with your healthcare 
provider.`
		}

	}
	@api
	get receivedCategory() {
		return this._receivedCategory;
	}

	set receivedCategory(value) {
		let globalThis = window;
		let recievedCatgry = globalThis.location?.pathname;
		const currentTabName = recievedCatgry.split('/').pop();
		this._receivedCategory = value;

		this.summary = true;
		this.dermo = true;
		this.main = false;

		if (value === DLQI_CATEGORY) {
			this.content = false;
			this.contentDot = false;
		}

		if (value === DLQI_CATEGORY) {
			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (currentTabName === SUMMARY_URL && value === DLQI_CATEGORY) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDotOne = 'navigationcontentdot1';
				//Strings are hardcoded for css responsiveness
				this.mobileName = `The aim of the questionnaire is to... `
				this.selectedNameSix = `Dermatology Life Quality Index (DLQI)`
				this.selectedNameFive = `The aim of the questionnaire is to
measure how much your skin problem
has affected your life over a given
period.

The graphs on this page show your last
responses on a timeline graph.`
				this.selectedNameFour = `You can download the responses by
clicking on the download button.`
				this.selectedNameTwo = `You can download the responses by
clicking on the download button.`

			}

		}
		else if (value === WAPI_CATEGORY) {
			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (currentTabName === SUMMARY_URL) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDotOne = 'navigationcontentdot1sub1';
				this.selectedNameSix = `Work & Activity Impairment(WPAI)     `
				this.mobileName = `The WPAI measures the impact of generalized pustular... `
				this.selectedNameFive = `The WPAI measures the impact of
generalized pustular psoriasis (GPP) on
work productivity and activity
impairment.

The graphs on this page show how your
responses have evolved over time.`
				this.selectedNameFour = `You can download the responses by
clicking on the download button.`
				this.selectedNameTwo = `You can download the responses by
clicking on the download button.`
			}
		}
		else if (value === PSS_CATEGORY) {
			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (currentTabName === SUMMARY_URL) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDotOne = 'navigationcontentdot1sub2';
				this.mobileName = `Listed on this page is a set of problems that people with... `
				this.selectedNameSix = `Psoriasis Symptom Scale (PSS)              `
				this.selectedNameFive = `Listed on this page is a set of problems
that people with psoriasis have said are
important.

The graph on this page shows the
severity of those symptoms in 24 hours
prior to completing the Questionnaire.`
				this.selectedNameFour = `You can download the responses by
clicking on the download button.`
				this.selectedNameTwo = `You can download the responses by
clicking on the download button.`

			}
		}

	}
	//Getting assessment records and status
	/*Null checks are not performed because sometimes users may or may not have assessment records initially. 
    Even if there are no assessment records, we show the cards for the user to create assessment records. 
	The page will not be blank.
    */

	@wire(GET_ASSESSMENT_BY_CURRENT_USERNAME_PSS, { categoryname: '$categoryName' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
				if (this.status === COMPLETED_LABEL) {
					this.shouldShowComponent = false;
				}
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//To get Qualitative date for side bar navigation
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			}

			if (data) {
				this.handleEnrollmentData(data);
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
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

	processEnrollmentDate(questionCount) {
		this.shouldShowComponent = true;
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

		}
	}


	//To trigger Close icon in Avatar navigation
	handleClose() {
		let globalThis = window;
		this.showClose = false;
		if (this.contentDot === false && this.contentDotOne === false) {
			let handleClse = globalThis.location?.pathname;
			this.saveAsDraftMsg = '';
			const currentTabName = handleClse.split('/').pop();
			this.contentDot = true;

			this.mobileName = this.subMobile;
			if (currentTabName === SUMMARY_URL) {
				this.navigationContentFive = 'navigationcontent5sub';
				this.contentDotOne = true;
				this.contentDot = false;
				this.mobileName = this.subMobile;
			}
			if (currentTabName === OUTSTANDING_QUESTIONNAIRE_URL) {
				this.twoContentMobile = false;

			}
			if (currentTabName === PATIENT_FIRST_AVATAR) {
				this.twoContentMobile = false;
			}
			if (currentTabName === SUMMARY_URL) {
				this.twoContentMobileOne = false;
			}
		}

	}

	//To trigger three Dots in Avatar Navigation
	mobileclick() {
		this.showClose = true;
		const currentTabName = window.location.pathname.split('/').pop();
		this.subMobile = this.mobileName;
		this.mobileName = this.selectedNameOne;
		this.closeValue = 'close1';
		this.contentDot = false;
		this.contentDotOne = false;
		if (currentTabName === SUMMARY_URL) {
			this.navigationContentFive = 'navigationcontent5sub';

			this.mobileName = this.selectedNameFive;
		}
		if (currentTabName === OUTSTANDING_QUESTIONNAIRE_URL) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (currentTabName === PATIENT_FIRST_AVATAR) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (currentTabName === SUMMARY_URL) {
			this.twoContentMobileOne = true;
			this.twoMobileName = this.selectedNameFour;
		}
		if ((currentTabName === QSQ_FOURTEENWEEKS_URL) || (currentTabName === QSQ_TWOMONTHS_URL)) {
			this.saveAsDraftMsg = 'You can save as draft and come back later to submit.';
		}


	}

	renderedCallback() {
		if (this._receivedCategory === DLQI_CATEGORY) {
			this.content = false;
			this.contentDot = false;
		}

	}

	// Unified method to fetch user details
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
			if (data) {
				const currentTabName = window.location.pathname.split('/').pop();
				const isCaregiver = data.isCaregiver;

				this.name = data.length > 0 ? data[0]?.Name : '';
				this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_AVATAR_NAVIGATION;

				this.setTabSpecificContent(currentTabName);

				if (data?.length > 0) {
					if (this.qualitative === false) {
						this.content = true;
					}
					this.contentDot = true;
					this.caregiver = isCaregiver;
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_AVATAR_NAVIGATION;

					let pathname = window.location.pathname;
					if (pathname === BR_SITE_URL || pathname === '') {
						this.mobileName = `Select the patient you would like to 
manage...`;
						this.selectedNameOne = `Select the patient you would like to 
manage: 

Once you have chosen the patient, you 
will represent the patient and perform
actions on their behalf. `;
					}
				}
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	setTabSpecificContent(currentTabName) {
		if (currentTabName === AVATAR_QUESTIONNAIRE_URL || currentTabName === AVATAR_QUESTIONNAIRE_TWO_URL) {
			this.mobileName = `We want to learn more about you. 
Personalise your experience by 
answering a few..`;
			this.selectedNameOne = `We want to learn more about you. 

Personalise your experience by 
answering a few simple questions 
about yourself.`;
		} else if (currentTabName === OUTSTANDING_QUESTIONNAIRE_URL) {
			if (this.shouldShowComponent === true) {
				this.twoContent = true;
			}
			this.mobileName = `Know Your Health, Download Results,
and Share With Your ..`;
			this.selectedNameOne = `Know Your Health, Download Results,
and Share With Your Doctor

Learn more about your health and feel
confident talking to your doctor about it
with our science-based questionnaires.
By working together with your doctor,
you can create a treatment plan that is
tailored to your individual needs. 

Complete our scientific based 
questionnaires which allow you to track
your GPP symptoms as well as the 
impact that having GPP has on your
quality of life and your ability to work.`;
			this.selectedNameTwo = `How did we do?

Please share your feedback by  
completing our "Qualitative Satisfaction  
Questionnaire". Your feedback will help
us better serve the GPP community in 
the future. `;
		} else if (currentTabName === LETS_PERSONALIZE_URL) {
			this.mobileName = `We want to learn more about you.
Personalize your experience by ..`;
			this.selectedNameOne = `We want to learn more about you.

Personalize your experience by
answering a few simple questions about
yourself. `;
		} else if (currentTabName === DLQI_QUESTIONNAIRE_URL) {
			this.mobileName = `The aim of Dermatology Life Quality 
Index (DLQI)...`;
			this.selectedNameOne = `The aim of Dermatology Life Quality 
Index (DLQI) questionnaire is to 
measure how much your skin problem 
has affected your life 
OVER THE LAST WEEK. Please tick one 
box for each question. `;
		} else if (currentTabName === PSS_QUESTIONNAIRE_URL) {
			this.mobileName = `On this page, are a set of problems that
people with ..`;
			this.selectedNameOne = `On this page, are a set of problems that
people with psoriasis have said are
important. For each question, click on
the circle that best describes the
severity of your symptoms during the
past 24 hours. Please answer every
question.`;
		} else if (currentTabName === WAPI_QUESTIONNAIRE_URL) {
			if (this.questionResponseForSeven === 'No') {
				this.mobileName = `Work Productivity and Activity
Impairment Questionnaire (WPAI...`;
				this.selectedNameOne = `Work Productivity and Activity
Impairment Questionnaire (WPAI)

This WPAI questionnaire is a 
questionnaire that measures the impact
of generalized pustular psoriasis (GPP)
on work productivity and activity
impairment.
      
Questions on this page ask about how
your GPP affects your ability to work
and perform regular activities. `;
			} else {
				this.mobileName = `Questions on this page ask about
the effect of your health problem...`;
				this.selectedNameOne = `Questions on this page ask about the
effect of your health problems on your
ability to work and perform regular
activities. By health problems we mean
any physical or emotional problem or 
symptom. The Work Productivity and 
Activity Impairment Questionnaire 
(WPAI) is not a study. It's a questionnaire 
aimed at helping you track how GPP 
impacts your work productivity and 
activity impairment and can be useful 
for discussions with your healthcare 
provider.`;
			}
		} else if (currentTabName === QSQ_TWOMONTHS_URL || currentTabName === QSQ_FOURTEENWEEKS_URL) {
			this.mobileName = `The aim of this questionnaire..`;
			this.content = false;
			this.qualitative = true;
			this.twoContent = true;
			this.selectedNameOne = `The aim of this questionnaire is to
capture your feedback on the
experience you had in the last fourteen
weeks of interactions with the GPP&ME
program. `;
			this.selectedNameTwo = ` You can save as draft and come back     
later to submit.  `;
		} else if (currentTabName === WAPI_COMPLETED) {
			this.mobileName = `You can find your responses to the WPAI 
questionnaire here...`;
			this.selectedNameOne = `You can find your responses to the WPAI 
questionnaire here.`;
		} else if (currentTabName === PSS_COMPLETED_URL) {
			this.mobileName = `You can find your responses to the PSS
questionnaire here.`;
			this.selectedNameOne = `You can find your responses to the PSS
questionnaire here.`;
		} else if (currentTabName === DLQI_COMPLETED_URL) {
			this.mobileName = `You can find your responses to the DLQI
questionnaire here.`;
			this.selectedNameOne = `You can find your responses to the DLQI
questionnaire here.`;
		} else if (currentTabName === QSQ_TWOMONTHS_COMPLETED_URL) {
			this.mobileName = `You can find your responses to the
Qualitative Satisfaction Questionnaire 
here.`;
			this.selectedNameOne = `You can find your responses to the
Qualitative Satisfaction Questionnaire 
here.`;
		} else if (currentTabName === QSQ_FOURTEENWEEKS_COMPLETED_URL) {
			this.mobileName = `You can find your responses to the
Qualitative Satisfaction Questionnaire 
here.`;
			this.selectedNameOne = `You can find your responses to the
Qualitative Satisfaction Questionnaire 
here.`;
		}
	}


	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if (typeof window !== 'undefined') {
			this.dispatchEvent(event);
		}
	}
}