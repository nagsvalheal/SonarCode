//This Lightning web component purpose is Avatar Prompt message for all the navigation pages
//To import the Libraries
import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import the Apex class
import LOGGEDIN_USER_ACCOUNTS from '@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount';
import USER_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver';
//To Import The Static Resources
import DEFAULT_AVATAR_JPEG_URL from '@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation';
//To Import the Custom Labels
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import CAREGIVER_NOTIFICATION from '@salesforce/label/c.BI_PSPB_CaregiverNotification';
import CAREGIVER_PROFILE_SITE from '@salesforce/label/c.BI_PSPB_CaregiverProfileSite';
import CAREGIVER_PATIENT from '@salesforce/label/c.BI_PSPB_CaregiverPatient';
import CAREGIVER_SELECT_AVATAR from '@salesforce/label/c.BI_PSPB_CaregiverSelectAvatar';
import PATIENT_PROFILE_SITE from '@salesforce/label/c.BI_PSPB_PatientMyProfileUrl';
import PATIENT_NOTIFICATION_SITE from '@salesforce/label/c.BI_PSPB_PatientNotificationUrl';
import PATIENT_SELECT_AVATAR from '@salesforce/label/c.BI_PSPB_PatientSelectAvatarUrl';
import PATIENT_CAREGIVER from '@salesforce/label/c.BI_PSPB_MyCaregiverUrl';
import LETSPERSONALIZE_PAGE_TWO from '@salesforce/label/c.BI_PSPB_LetsPersonalisePageTwo';
import LETSPERSONALIZE_PAGE_ONE from '@salesforce/label/c.BI_PSPB_LetsPersonalisePageOne';
import PRESCRIPTION_URL from '@salesforce/label/c.BI_PSPB_UpdatePrescriptionUrl';
import PRESCRIPTION_STATUS_URL from '@salesforce/label/c.BI_PSPB_PrescriptionStatusUrl';
import CHALLENGES_URL from '@salesforce/label/c.BI_PSP_ChallengesNaviUrl';
import TROPHY_CASE_URL from '@salesforce/label/c.BI_PSP_TrophyPageUrl';
import OUTSTANDING_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import LETSPERSONALIZE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import DLQI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl';
import PSORIASIS_QUEST_URL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import WAPI_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import QUALITATIVE_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import WAPI_COMPLETED_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import PSORIASIS_COMPLETED_QUEST_URL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import TWO_MONTHS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl'
import FOURTEEN_WEEKS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl'
import ACTION_URL from '@salesforce/label/c.BI_PSPB_ActionUrl';
import MESSAGECENTER_URL from '@salesforce/label/c.BI_PSPB_MessageCenterPageUrl';
import REMINDER_URL from '@salesforce/label/c.BI_PSPB_ReminderUrl';
import PLATFORM_PAGE from '@salesforce/label/c.BI_PSPB_PlatformSupportUrl';
import REPORT_EVENT_PAGE from '@salesforce/label/c.BI_PSPB_ReportAdverseEvent';
import MEDICAL_ENQUIRY_PAGE from '@salesforce/label/c.BI_PSPB_MedicalInfoEnquiryUrl';
import SUPPORT_PAGE from '@salesforce/label/c.BI_PSPB_SupportCenterPageUrl';
import SYMPTOM_TRACKER_MAIN from '@salesforce/label/c.BI_PSPB_SymptomTrackerMain';
import SYMPTOMTRACKER_URL from '@salesforce/label/c.BI_PSP_SymptomTrackerLandingPageUrl';
import HISTORY_URL from '@salesforce/label/c.BI_PSPB_HistoryUrl';
import CAREGIVER_FIRST_AVATAR from '@salesforce/label/c.BI_PSPB_CaregiverFirstAvatar';
import PATIENT_FIRST_AVATAR from '@salesforce/label/c.BI_PSPB_PatientFirstAvatar';
import COMPLETED_QUESTIONNAIRES from '@salesforce/label/c.BI_PSPB_CompletedQuestionnaires';
import SYMPTOMTRACKER_GRAPH from '@salesforce/label/c.BI_PSPB_SymptomTrkGraphUrl';
import DLQI_HEADING from '@salesforce/label/c.BI_PSP_DlqiCategory';
import PSS_HEADING from '@salesforce/label/c.BI_PSP_PssCategory';
import WAPI_HEADING from '@salesforce/label/c.BI_PSP_WapiCategory';
import XP_VALUE from '@salesforce/label/c.BI_PSPB_XpValue';
import SUMMARY_URL from '@salesforce/label/c.BI_PSPB_SummaryUrl';
//
import SUPPORT_VALUE_ONE from '@salesforce/label/c.BI_PSPB_SupportValueOne';
import SUPPORT_VALUE_TWO from '@salesforce/label/c.BI_PSP_SupportValueTwo';
import SUPPORT_VALUE_THREE from '@salesforce/label/c.BI_PSPB_SupportValueThree';
import SUPPORT_VALUE_FOUR from '@salesforce/label/c.BI_PSPB_SupportValueFour';
import REPORT_VALUE_ONE from '@salesforce/label/c.BI_PSPB_ReportValueOne';
import REPORT_VALUE_TWO from '@salesforce/label/c.BI_PSPB_ReportValueTwo';
import QUES_VALUE_ONE from '@salesforce/label/c.BI_PSPB_QuesValueOne';
import QUES_VALUE_TWO from '@salesforce/label/c.BI_PSPB_QuesValueTwo';
import QUES_VALUE_THREE from '@salesforce/label/c.BI_PSPB_QuesValueThree';
import QUES_VALUE_FOUR from '@salesforce/label/c.BI_PSPB_QuesValueFour';
import QUES_VALUE_FIVE from '@salesforce/label/c.BI_PSPB_QuesValueFive';
import QUES_VALUE_SIX from '@salesforce/label/c.BI_PSPB_QuesValueSix';
import QUES_VALUE_SEVEN from '@salesforce/label/c.BI_PSPB_QuesValueSeven';
import QUES_VALUE_EIGHT from '@salesforce/label/c.BI_PSPB_QuesValueEight';
import QUES_VALUE_NINE from '@salesforce/label/c.BI_PSPB_QuesValueNine';
import QUES_VALUE_TEN from '@salesforce/label/c.BI_PSPB_QuesValueTen';
import QUES_VALUE_ELEVEN from '@salesforce/label/c.BI_PSPB_QuesValueEleven';
import SELECT_PATIENT_VALUE from '@salesforce/label/c.BI_PSPB_SelectPatientValue';
import SELECT_PATIENT_ONE from '@salesforce/label/c.BI_PSPB_SelectPatientOne';
import PERSONALIZE_MSG_ONE from '@salesforce/label/c.BI_PSPB_PersonalizeMsgOne';
import PRESCRIPTION_MSG_ONE from '@salesforce/label/c.BI_PSPB_PrescriptionMsgOne';
import PRESCRIPTION_MSG_TWO from '@salesforce/label/c.BI_PSPB_PrescriptionMsgTwo';
import PRESCRIPTION_MSG_THREE from '@salesforce/label/c.BI_PSPB_PrescriptionMsgThree';
import SYMPTOM_VALUE_VALUE from '@salesforce/label/c.BI_PSPB_SymptomValueOne';
import PATIENT_VALUE_ONE from '@salesforce/label/c.BI_PSPB_PatientValueOne';
import PATIENT_VALUE_TWO from '@salesforce/label/c.BI_PSPB_PatientValueTwo';
import CHOOSE_AVATAR_ONE from '@salesforce/label/c.BI_PSPB_ChooseAvatarOne';
import CHOOSE_AVATAR_TWO from '@salesforce/label/c.BI_PSPB_ChooseAvatarTwo';
import CARE_NOTIFY_ONE from '@salesforce/label/c.BI_PSPB_CareNotifyOne';
import CARE_NOTIFY_TWO from '@salesforce/label/c.BI_PSPB_CareNotifyTwo';
import PATIENT_AVATAR_ONE from '@salesforce/label/c.BI_PSPB_PatientAvatarOne';
import PATIENT_AVATAR_TWO from '@salesforce/label/c.BI_PSPB_PatientAvatarTwo';
import PATIENT_AVATAR_THREE from '@salesforce/label/c.BI_PSPB_PatientAvatarThree';
import OUSTANDING_VALUE_ONE from '@salesforce/label/c.BI_PSPB_OutstandingValueOne';
import OUSTANDING_VALUE_TWO from '@salesforce/label/c.BI_PSPB_OutstandingValueTwo';
import OUSTANDING_VALUE_THREE from '@salesforce/label/c.BI_PSPB_OutstandingValueThree';
import OUSTANDING_VALUE_FOUR from '@salesforce/label/c.BI_PSPB_OutstandingValueFour';
import OUSTANDING_VALUE_FIVE from '@salesforce/label/c.BI_PSPB_OutstandingValueFive';
import OUSTANDING_VALUE_SIX from '@salesforce/label/c.BI_PSPB_OutstandingValueSix';
import OUSTANDING_VALUE_SEVEN from '@salesforce/label/c.BI_PSPB_OutstandingValueSeven';
import CHALLENGE_VALUE_ONE from '@salesforce/label/c.BI_PSPB_ChallengeValueOne';
import CHALLENGE_VALUE_TWO from '@salesforce/label/c.BI_PSPB_ChallengeValueTwo';
import CHALLENGE_VALUE_THREE from '@salesforce/label/c.BI_PSPB_ChallengeValueThree';
import TROPY_VALUE_ONE from '@salesforce/label/c.BI_PSPB_TropyValueOne';
import TROPY_VALUE_TWO from '@salesforce/label/c.BI_PSPB_TropyValueTwo';
import LETS_PERSONAL_VALUE from '@salesforce/label/c.BI_PSPB_LetsPersonalValue';
import CAREGIVER_VALUE_ONE from '@salesforce/label/c.BI_PSPB_CaregiverValueOne';
import CAREGIVER_VALUE_TWO from '@salesforce/label/c.BI_PSPB_CaregiverValueTwo';
import QUESTIONAIRE_VALUE_ONE from '@salesforce/label/c.BI_PSPB_QuestionnaireValueOne';
import DLQE_VALUE_ONE from '@salesforce/label/c.BI_PSPB_DlqeQuesValueOne';
import DLQE_VALUE_TWO from '@salesforce/label/c.BI_PSPB_DlqeQuesValueTwo';
import PSORIASIS_VALUE_ONE from '@salesforce/label/c.BI_PSPB_PsoriasisValueOne';
import WAPI_VALUE_ONE from '@salesforce/label/c.BI_PSPB_WapiValueOne';
import WAPI_VALUE_TWO from '@salesforce/label/c.BI_PSPB_WapiValueTwo';
import WAPI_VALUE_THREE from '@salesforce/label/c.BI_PSPB_WapiValueThree';
import TWO_MONTHS_ONE from '@salesforce/label/c.BI_PSPB_TwoMonthsOne';
import TWO_MONTHS_TWO from '@salesforce/label/c.BI_PSPB_TwoMonthsTwo';
import MSG_CENTER_ONE from '@salesforce/label/c.BI_PSPB_MsgCenterOne';
import ACTION_MESSAGE_ONE from '@salesforce/label/c.BI_PSPB_ActionMessageOne';
import ACTION_MESSAGE_TWO from '@salesforce/label/c.BI_PSPB_ActionMessageTwo';
import ACTION_MESSAGE_THREE from '@salesforce/label/c.BI_PSPB_ActionMessageThree';
import HISTORY_MESSAGE_ONE from '@salesforce/label/c.BI_PSPB_HistoryMessageOne';
import HISTORY_MESSAGE_TWO from '@salesforce/label/c.BI_PSPB_HistoryMessageTwo';
import SOPPORT_PAGE_ONE from '@salesforce/label/c.BI_PSPB_SupportPageOne';
import SOPPORT_PAGE_TWO from '@salesforce/label/c.BI_PSPB_SupportPageTwo';
import PLATFORM_VALUE_ONE from '@salesforce/label/c.BI_PSPB_PlatformValueOne';
import REMINDER_VALUE_ONE from '@salesforce/label/c.BI_PSPB_ReminderValueOne';
import REMINDER_VALUE_TWO from '@salesforce/label/c.BI_PSPB_ReminderValueTwo';
import REMINDER_VALUE_THREE from '@salesforce/label/c.BI_PSPB_ReminderValueThree';
import SYMPTOM_VALUE_TWO from '@salesforce/label/c.BI_PSPB_SymptomValueTwo';
import WAPI_VALUE_FOUR from '@salesforce/label/c.BI_PSPB_WapiValueFour';
import PSORIASIS_VALUE_TWO from '@salesforce/label/c.BI_PSPB_PsoriasisValueTwo';
import DLQE_VALUE_THREE from '@salesforce/label/c.BI_PSPB_DlqeQuesValueThree';
import TWO_MONTHS_THREE from '@salesforce/label/c.BI_PSPB_TwoMonthsThree';
import MEDICAL_MOB_ONE from '@salesforce/label/c.BI_PSPB_MedicalMobOne';
import MEDICAL_MOB_TWO from '@salesforce/label/c.BI_PSPB_MedicalMobTwo';
import MEDICAL_MOB_THREE from '@salesforce/label/c.BI_PSPB_MedicalMobThree';
import REPORT_MOB_ONE from '@salesforce/label/c.BI_PSPB_ReportMobOne';
import REPORT_MOB_TWO from '@salesforce/label/c.BI_PSPB_ReportMobTwo';
import REPORT_MOB_THREE from '@salesforce/label/c.BI_PSPB_ReportMobThree';
import QUES_MOB_ONE from '@salesforce/label/c.BI_PSPB_QuesMobOne';
import QUES_MOB_TWO from '@salesforce/label/c.BI_PSPB_QuesMobTwo';
import QUES_MOB_THREE from '@salesforce/label/c.BI_PSPB_QuesMobThree';
import QUES_MOB_FOUR from '@salesforce/label/c.BI_PSPB_QuesMobFour';
import PSORIASIS_MOB_ONE from '@salesforce/label/c.BI_PSPB_PsoriasisMobOne';
import PSORIASIS_MOB_TWO from '@salesforce/label/c.BI_PSPB_PsoriasisMobTwo';
import SELECT_MOB_ONE from '@salesforce/label/c.BI_PSPB_SelectMobOne';
import SELECT_MOB_TWO from '@salesforce/label/c.BI_PSPB_SelectMobTwo';
import LETS_PERSONAL_MOB_ONE from '@salesforce/label/c.BI_PSPB_LetsPersonalMobOne';
import PRESCRIPTION_MOB_ONE from '@salesforce/label/c.BI_PSPB_PrescriptionMobOne';
import PRESCRIPTION_MOB_TWO from '@salesforce/label/c.BI_PSPB_PrescriptionMobTwo';
import PRESCRIPTION_MOB_THREE from '@salesforce/label/c.BI_PSPB_PrescriptionMobThree';
import PRESCRIPTION_MOB_FOUR from '@salesforce/label/c.BI_PSPB_PrescriptionMobFour';
import SYMPTOM_MOB_ONE from '@salesforce/label/c.BI_PSPB_SymptomMobOne';
import CARE_AVATAR_MOB_ONE from '@salesforce/label/c.BI_PSPB_CareAvatarMobOne';
import CARE_AVATAR_MOB_TWO from '@salesforce/label/c.BI_PSPB_CareAvatarMobTwo';
import CARE_NOTIFY_MOB_ONE from '@salesforce/label/c.BI_PSPB_CareNotifyMobOne';
import CARE_NOTIFY_MOB_TWO from '@salesforce/label/c.BI_PSPB_CareNotifyMobTwo';
import PATIENT_AVATAR_MOB_ONE from '@salesforce/label/c.BI_PSPB_PatientAvatarMobOne';
import PATIENT_AVATAR_MOB_TWO from '@salesforce/label/c.BI_PSPB_PatientAvatarMobTwo';
import OUTSTATNDING_MOB_ONE from '@salesforce/label/c.BI_PSPB_OutstandingMobOne';
import OUTSTATNDING_MOB_TWO from '@salesforce/label/c.BI_PSPB_OutstandingMobTwo';

import CHALLENGE_MOB_ONE from '@salesforce/label/c.BI_PSPB_ChallengeMobOne';
import CHALLENGE_MOB_TWO from '@salesforce/label/c.BI_PSPB_ChallengeMobTwo';
import TROPY_MOB_ONE from '@salesforce/label/c.BI_PSPB_TropyMobOne';
import TROPY_MOB_TWO from '@salesforce/label/c.BI_PSPB_TropyMobTwo';
import TWO_MONTHS_MOB_TWO from '@salesforce/label/c.BI_PSPB_TwoMonthsMobOne';
import DLQE_MOB_MSG from '@salesforce/label/c.BI_PSPB_DlqeMobMsg';
import PATIENT_MOB_ONE from '@salesforce/label/c.BI_PSPB_PatientMobOne';
import PATIENT_MOB_TWO from '@salesforce/label/c.BI_PSPB_PatientMobTwo';
import SYMPTOM_MOB_VALUE from '@salesforce/label/c.BI_PSPB_SymptomMobValue';
import SYMPTOM_MAIN_ONE from '@salesforce/label/c.BI_PSPB_SymptomMainMobOne';
import PSORIASIS_MOB_THREE from '@salesforce/label/c.BI_PSPB_PsoriasisMobThree';
import SYMPTOM_MOB_THREE from '@salesforce/label/c.BI_PSPB_SymtomMainValueOne';
import REMINDER_MOB_ONE from '@salesforce/label/c.BI_PSPB_ReminderMobOne';
import REMINDER_MOB_TWO from '@salesforce/label/c.BI_PSPB_ReminderMobTwo';
import PLATFORM_MOB_VALUE from '@salesforce/label/c.BI_PSPB_PlatformMobValue';
import PATIENTCARE_VALUE_ONE from '@salesforce/label/c.BI_PSPB_PatientCareValueOne';
import PATIENTCARE_VALUE_TWO from '@salesforce/label/c.BI_PSPB_PatientCareValueTwo';
import PERSNALIZE_VALUE_TWO from '@salesforce/label/c.BI_PSPB_LetsPersonalMobTwo';
import DLQE_MOB_ONE from '@salesforce/label/c.BI_PSPB_DlqeMobMsgOne';
import DLQE_MOB_TWO from '@salesforce/label/c.BI_PSPB_DlqeMobMsgTwo';
import PERSONALIZE_MOB from '@salesforce/label/c.BI_PSPB_PersonalizeMob';
import SUPPORT_MOB_ONE from '@salesforce/label/c.BI_PSPB_SupportMobOne';
import SUPPORT_MOB_TWO from '@salesforce/label/c.BI_PSPB_SupportMobTwo';
import HISTORY_MOB_TWO from '@salesforce/label/c.BI_PSPB_HistoryMobOne';
import HISTORY_MOB_THREE from '@salesforce/label/c.BI_PSPB_HistoryMobTwo';
import WAPI_MOB_ONE from '@salesforce/label/c.BI_PSPB_WapiMobOne';
import WAPI_MOB_TWO from '@salesforce/label/c.BI_PSPB_WapiMobTwo';
import WAPI_MOB_THREE from '@salesforce/label/c.BI_PSPB_WapiMobThree';
import TWO_MONTHS_MOB_ONE from '@salesforce/label/c.BI_PSPB_TwoMonthsMobTwo';
import TWO_MONTHS_MOB_THREE from '@salesforce/label/c.BI_PSPB_TwoMonthsMobThree';
import ACTION_MOB_ONE from '@salesforce/label/c.BI_PSPB_ActionMobOne';
import ACTION_MOB_TWO from '@salesforce/label/c.BI_PSPB_ActionMobTwo';
import MESSAGE_CENTER_MOB_VALUE from '@salesforce/label/c.BI_PSPB_MsgCenterMobValue';



export default class BiPspbAvatarNavigation extends LightningElement {
	// Declaration of variables with @track
	dermo = false;
	contentDot = true;
	content = false;
	summary = false;
	twoContent = false;
	challangeContent = false;
	mobileName;
	twoMobileName;
	navigationContentDot;
	navigationContent = 'navigationcontent5'; //css class
	selected;
	selectedName = '';
	selectedNameOne;
	selectedNameSecond;
	selectedNameThird;
	contentTwo = true;
	contentThree = true;
	selectedNameQues;
	selectedNameThree;
	selectedNameTwo;
	selectedNameFour;
	selectedNameAvatar = false;
	selectedNameFive;
	SelectedNameFiveChild;
	avatarImgClass = 'avatar-container'
	reloaded;
	caregiver = false;
	main = true;
	showAllCmps = true;
	xpValue;
	errorMedical;
	errorReport;
	patientavatar = false;
	closeValue = 'close'; //css class
	closeValueSum = 'closesum'; //css class
	challangeContents = false;
	selectedOption = {
		src: DEFAULT_AVATAR_JPEG_URL,
		name: '',
	};
	mobileValue;
	selectedValue;
	contentDotOne = false;
	twoContentMobile = false;
	challangeContentMobile = false;
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
	challengeNameOne;
	challengeNameTwo;
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

	@api
	get receivedError() {
		return this.errorMedical;
	}
	set receivedError(value) {
		this.errorMedical = value;
		if (this.errorMedical === true) {
			this.handleClose();
			//Strings are hardcoded for css responsiveness
			this.selectedNameOne = SUPPORT_VALUE_ONE;
this.selectedNameSecond = SUPPORT_VALUE_TWO;
			this.mobileName = MEDICAL_MOB_ONE;
this.mobileValue = MEDICAL_MOB_TWO;
		}
		else {
			this.selectedNameOne = SUPPORT_VALUE_THREE;	
this.selectedNameSecond = SUPPORT_VALUE_FOUR;
			this.mobileName =MEDICAL_MOB_ONE;
this.mobileValue = MEDICAL_MOB_THREE;
		}
	}

	@api
	get receivedErrorReport() {
		return this.errorReport;
	}
	set receivedErrorReport(value) {
		this.errorReport = value;
		if (this.errorReport === true) {
			this.handleClose();
			//Strings are hardcoded for css responsiveness
			this.selectedNameOne = REPORT_VALUE_ONE;
this.selectedNameSecond = REPORT_VALUE_TWO;
this.mobileName = REPORT_MOB_ONE;
this.mobileValue = REPORT_MOB_TWO;
		}
		else {
			this.selectedNameOne = REPORT_VALUE_ONE;
this.selectedNameSecond = REPORT_VALUE_TWO;
this.mobileName = REPORT_MOB_ONE;
this.mobileValue = REPORT_MOB_THREE;
		}
	}
	@api
	get receivedcategory() {
		return this.receivedCategory;
	}
	set receivedcategory(value) {
		let globalThis = window;

		const CURRENT_TAB_NAME = globalThis.location?.pathname.split('/').pop();
		this.receivedCategory = value;

		this.summary = true;
		this.dermo = true;
		this.main = false;

		if (value === DLQI_HEADING) {
			this.content = false;
			this.contentDot = false;
		}

		if (value === DLQI_HEADING) {

			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (CURRENT_TAB_NAME === SUMMARY_URL && value === DLQI_HEADING) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDot = 'navigationcontentdot';
				//Strings are hardcoded for css responsiveness
				this.selectedNameSix = QUES_VALUE_ONE;
				this.mobileName = QUES_MOB_ONE;
				this.mobileValue = QUES_MOB_TWO;
				this.selectedNameFive = QUES_VALUE_TWO;
this.SelectedNameFiveChild = QUES_VALUE_THREE;

				this.selectedNameFour = QUES_VALUE_FOUR;
				this.selectedNameTwo =QUES_VALUE_FOUR;

			}

		}
		else if (value === WAPI_HEADING) {

			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (CURRENT_TAB_NAME === SUMMARY_URL) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDot = 'navigationcontentdot1sub1';
				this.selectedNameSix = QUES_VALUE_FIVE;
				this.mobileName = QUES_MOB_THREE;
				this.mobileValue = QUES_MOB_FOUR;

				this.selectedNameFive =QUES_VALUE_SIX;
this.SelectedNameFiveChild = QUES_VALUE_SEVEN;
				this.selectedNameFour = QUES_VALUE_FOUR;
				this.selectedNameTwo = QUES_VALUE_FOUR;
			}
		}
		else if (value === PSS_HEADING) {
			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (CURRENT_TAB_NAME === SUMMARY_URL) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDot = 'navigationcontentdot1sub2';
				this.mobileName = PSORIASIS_MOB_ONE;
				this.mobileValue = PSORIASIS_MOB_TWO;
				this.selectedNameSix = QUES_VALUE_EIGHT;
				this.selectedNameFive = QUES_VALUE_NINE;
				this.SelectedNameFiveChild =QUES_VALUE_TEN;
				this.selectedNameFour = QUES_VALUE_FOUR;
				this.selectedNameTwo = QUES_VALUE_FOUR;
			}
		}

	}

	//To trigger Close icon in Avatar navigation
	handleClose() {
		let globalThis = window;
		const CURRENT_TAB_NAME = globalThis.location?.pathname.split('/').pop();
		if (this.contentDot === false && this.contentDotOne === false) {
			this.contentDot = true;

			this.mobileName = this.subMobile;
			if (CURRENT_TAB_NAME === SUMMARY_URL) {
				this.navigationContent = 'navigationcontent5sub';
				this.contentDotOne = true;
				this.contentDot = false;
				this.mobileName = this.subMobile;
			}
			if (CURRENT_TAB_NAME === OUTSTANDING_QUESTIONNAIRE_URL) {
				this.twoContentMobile = false;

			}
			if (CURRENT_TAB_NAME === PATIENT_FIRST_AVATAR) {
				this.twoContentMobile = false;
			}
			if (CURRENT_TAB_NAME === SUMMARY_URL) {
				this.twoContentMobileOne = false;
			}
			if (CURRENT_TAB_NAME === CHALLENGES_URL) {
				this.challangeContentMobile = false;

			}
		}

	}

	//To trigger three Dots in Avatar Navigation
	mobileclick() {
		const CURRENT_TAB_NAME = window.location.pathname.split('/').pop();
		this.subMobile = this.mobileName;
		this.mobileName = this.mobileValue;
		this.closeValue = 'close1';
		this.contentDot = false;
		this.contentDotOne = false;
		if (CURRENT_TAB_NAME === SUMMARY_URL) {
			this.navigationContent = 'navigationcontent5sub';

			this.mobileName = this.selectedNameFive;
		}
		if (CURRENT_TAB_NAME === OUTSTANDING_QUESTIONNAIRE_URL) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (CURRENT_TAB_NAME === PATIENT_FIRST_AVATAR) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (CURRENT_TAB_NAME === CAREGIVER_FIRST_AVATAR) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (CURRENT_TAB_NAME === SUMMARY_URL) {
			this.twoContentMobileOne = true;
			this.twoMobileName = this.selectedNameFour;
		}
		if (CURRENT_TAB_NAME === CHALLENGES_URL) {
			this.challangeContentMobile = true;
			this.twoMobileName = this.selectedNameThree;
			if (this.xpValue === XP_VALUE) {
				this.challangeContentMobile = false;
			}
		}

	}
	connectedCallback() {
		let globalThis = window;
		if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
			this.reloaded = globalThis?.localStorage.getItem('reload');
		} else {
			this.reloaded = null; // Or some default value
		}
	}
	renderedCallback() {
		if (this.receivedCategory === DLQI_HEADING) {
			this.content = false;
			this.contentDot = false;
		}

	}

	//To fetch the Caregiver details
	@wire(USER_CAREGIVER)
	wiredavtList({ error, data }) {
		if (data) {
			try {
				this.handleData(data);
			} catch (err) {
				this.showToast('Error', err.message, 'error'); // Catching Potential Error from Apex
			}
		} else if (error) {
			this.showToast('Error', error.body.message, 'error'); // Catching Potential Error from LWC
		}
	}
	handleData(data) {
		this.caregiver = true;
		this.name = data.length > 0 ? data[0]?.Name : '';
		this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_AVATAR_JPEG_URL;
		if (!data[0]?.BI_PSP_AvatarUrl__c) {
			this.selectedAvatarSrc = DEFAULT_AVATAR_JPEG_URL;
			this.avatarImgClass = 'defaultclassimg';
		}
		this.content = data.length > 0;
		this.contentDot = data.length > 0;

		this.handlePathname(window.location.pathname);
		this.handleCurrentTabName(window.location.pathname.split('/').pop());
	}

	handlePathname(pathname) {
		if ((pathname === BRANDED_SITE_URL || pathname === '') && this.caregiver === true) {
			this.patientavatar = false;
			this.selectedAvatarSrc = DEFAULT_AVATAR_JPEG_URL;
			this.avatarImgClass = 'defaultclassimg';
			this.mobileName = SELECT_MOB_ONE;
			this.mobileValue =SELECT_MOB_TWO;
			this.selectedNameOne = SELECT_PATIENT_VALUE;
			this.selectedNameSecond = SELECT_PATIENT_ONE;

		}
	}
	handleCurrentTabName(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case COMPLETED_QUESTIONNAIRES:
				
				this.selectedNameOne = QUES_VALUE_ELEVEN;
				break;
			case LETSPERSONALIZE_PAGE_ONE:
			case LETSPERSONALIZE_PAGE_TWO:
				this.setLetsPersonalizeMessages();
				break;
			case PRESCRIPTION_URL:
				this.setPrescriptionMessages();
				break;
			case PRESCRIPTION_STATUS_URL:
				this.setPrescriptionStatusMessages();
				break;
			case SYMPTOMTRACKER_GRAPH:
				this.setSymptomTrackerGraphMessages();
				break;
			case PATIENT_PROFILE_SITE:
			case CAREGIVER_PROFILE_SITE:
				this.setProfileSiteMessages();
				break;
			case CAREGIVER_PATIENT:
				this.setCaregiverPatientMessages();
				break;
			case CAREGIVER_SELECT_AVATAR:
				this.setCaregiverSelectAvatarMessages();
				break;
			case CAREGIVER_NOTIFICATION:
				this.setCaregiverNotificationMessages();
				break;
			case PATIENT_FIRST_AVATAR:
				this.setPatientFirstAvatarMessages();
				break;
			case CHALLENGES_URL:
				this.handleChallengesUrlMessages();
				break;
			case TROPHY_CASE_URL:
				this.handleTrophyCaseUrlMessages();
				break;
			case OUTSTANDING_QUESTIONNAIRE_URL:
				this.setOutstandingQuestionnaireMessages();
				break;
			default:
				break;
		}
	}

	setLetsPersonalizeMessages() {
		this.mobileName = LETS_PERSONAL_MOB_ONE;
this.mobileValue =PERSONALIZE_MSG_ONE;
		this.selectedNameOne = PERSONALIZE_MSG_ONE;
	}

	setPrescriptionMessages() {
		this.mobileName = PRESCRIPTION_MOB_ONE;
this.mobileValue = PRESCRIPTION_MOB_TWO;
		this.selectedNameOne =PRESCRIPTION_MSG_ONE;
this.selectedNameSecond = PRESCRIPTION_MSG_TWO;
	}

	setPrescriptionStatusMessages() {
		this.mobileName = PRESCRIPTION_MOB_THREE;
this.mobileValue =  PRESCRIPTION_MOB_FOUR;
		this.selectedNameOne = PRESCRIPTION_MSG_THREE;

	}

	setSymptomTrackerGraphMessages() {
		this.mobileName = SYMPTOM_MOB_ONE;
this.mobileValue = SYMPTOM_VALUE_VALUE;
		this.selectedNameOne =SYMPTOM_VALUE_VALUE;
	}

	setProfileSiteMessages() {
		this.mobileName = `Hi ${this.name}, you're doing great! 
We appreciate you sharing, it will`;
this.mobileValue = `Hi ${this.name}, you're doing great! We appreciate you sharing, 
it will help us provide you with a better experience if we know more 
about you. Complete your personal information now!`;
		this.selectedNameOne = `Hi ${this.name}, you're doing great!`;
this.selectedNameSecond = PATIENT_VALUE_ONE;
this.selectedNameThird = PATIENT_VALUE_TWO;
	}

	setCaregiverPatientMessages() {
		this.mobileName = `Hi ${this.name}, you're doing great! 
We appreciate you sharing, it will`;
this.mobileValue = `Hi ${this.name}, you're doing great! We appreciate you sharing, 
it will help us provide you with a better experience if we know more about you. 
Complete your personal information now!`;
		this.selectedNameOne = `Hi ${this.name}, you're doing great!`;
this.selectedNameSecond = PATIENT_VALUE_ONE;
this.selectedNameThird = PATIENT_VALUE_TWO;
	}

	setCaregiverSelectAvatarMessages() {
		this.mobileName = CARE_AVATAR_MOB_ONE;
		this.mobileValue =  CARE_AVATAR_MOB_TWO;
		this.selectedNameOne = CHOOSE_AVATAR_ONE;
this.selectedNameSecond = CHOOSE_AVATAR_TWO;
	}

	setCaregiverNotificationMessages() {
		this.mobileName = CARE_NOTIFY_MOB_ONE;
this.mobileValue = CARE_NOTIFY_MOB_TWO;
		this.selectedNameOne = CARE_NOTIFY_ONE;
this.selectedNameSecond = CARE_NOTIFY_TWO;
	}

	setPatientFirstAvatarMessages() {
		this.twoContent = true;
		this.mobileName = PATIENT_AVATAR_MOB_ONE;
this.mobileValue = PATIENT_AVATAR_MOB_TWO;
		this.selectedNameOne = PATIENT_AVATAR_ONE;
this.selectedNameSecond = PATIENT_AVATAR_TWO;
		this.selectedNameTwo = PATIENT_AVATAR_THREE;
	}

	setOutstandingQuestionnaireMessages() {
		this.twoContent = true;
		this.mobileName = OUTSTATNDING_MOB_ONE;
this.mobileValue = OUTSTATNDING_MOB_TWO;
		this.selectedNameOne = OUSTANDING_VALUE_ONE;
this.selectedNameSecond = OUSTANDING_VALUE_TWO;
this.selectedNameThird = OUSTANDING_VALUE_FIVE;
this.selectedNameTwo = OUSTANDING_VALUE_SEVEN;
	}

	handleChallengesUrlMessages() {
		const WINDOW_WIDTH = window.innerWidth;
		this.challangeContents = WINDOW_WIDTH < 601;
		if (this.challangeContents === true) {
			this.setChallengesForMobile();
		} else {
			this.setChallengesForDesktop();
		}
	}

	setChallengesForMobile() {
		this.seperateChallenge = false;
		this.main = true;
		this.mobileName = CHALLENGE_MOB_ONE;
this.mobileValue = CHALLENGE_MOB_TWO;
		this.selectedNameOne = CHALLENGE_VALUE_ONE;
this.selectedNameSecond = CHALLENGE_VALUE_TWO;
		this.selectedNameThree = CHALLENGE_VALUE_THREE;
	}

	setChallengesForDesktop() {
		this.seperateChallenge = true;
		this.main = false;
		this.challangeContent = true;
		this.mobileName = CHALLENGE_MOB_ONE;
this.mobileValue = CHALLENGE_MOB_TWO;
		this.challengeNameOne = CHALLENGE_VALUE_ONE;
		this.challengeNameTwo = CHALLENGE_VALUE_TWO;
		this.selectedNameThree = CHALLENGE_VALUE_THREE;
	}

	handleTrophyCaseUrlMessages() {
		const WINDOW_WIDTH = window.innerWidth;
		this.challangeContents = WINDOW_WIDTH < 601;
		if (this.challangeContents === true) {
			this.setTrophyCaseForMobile();
		} else {
			this.setTrophyCaseForDesktop();
		}
	}

	setTrophyCaseForMobile() {
		this.seperateChallenge = false;
		this.main = true;
		this.mobileName = TROPY_MOB_ONE;
this.mobileValue =TROPY_MOB_TWO;
		this.selectedNameOne = TROPY_VALUE_ONE;
this.selectedNameSecond = TROPY_VALUE_TWO;
	}

	setTrophyCaseForDesktop() {
		this.seperateChallenge = true;
		this.main = false;
		this.mobileName = TROPY_MOB_ONE;
this.mobileValue = TROPY_MOB_TWO;
		this.challengeNameOne = TROPY_VALUE_ONE;
		this.challengeNameTwo = TROPY_VALUE_TWO;
	}



	//To fetch the PAtient details
	@wire(LOGGEDIN_USER_ACCOUNTS)
	wiredUserAccounts({ error, data }) {
		if (data) {
			try {
				this.userAccounts = data;
				if (!this.caregiver) {
					this.setContentProperties();
					this.setWelcomeMessages();
				}
			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} else if (error) {
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	setContentProperties() {
		this.content = true;
		this.name = this.userAccounts.length > 0 ? this.userAccounts[0]?.Name : '';
		this.selectedAvatarSrc = this.userAccounts[0]?.BI_PSP_AvatarUrl__c || DEFAULT_AVATAR_JPEG_URL;
		if (this.selectedAvatarSrc === DEFAULT_AVATAR_JPEG_URL) {
			this.avatarImgClass = 'defaultclassimg';
		}
	}
	setWelcomeMessages() {
		const CURRENT_TAB_NAME = window.location.pathname.split('/').pop();
		const pathname = window.location.pathname;

		if ((pathname === BRANDED_SITE_URL || pathname === '') && this.userAccounts[0].BI_PSPB_User_Type__c === 'Patient' && !this.caregiver) {
			this.setPatientWelcomeMessages();
		}

		this.handleTabSpecificMessagesPart1(CURRENT_TAB_NAME);
		this.handleTabSpecificMessagesPart2(CURRENT_TAB_NAME);
		this.handleTabSpecificMessagesPart3(CURRENT_TAB_NAME);
		this.handleTabSpecificMessagesPart4(CURRENT_TAB_NAME);
		this.handleTabSpecificMessagesPart5(CURRENT_TAB_NAME);
	}
	handleTabSpecificMessagesPart1(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case LETSPERSONALIZE_PAGE_ONE:
			case LETSPERSONALIZE_PAGE_TWO:
				this.selectedNameOne = LETS_PERSONAL_VALUE;
				break;
			case PATIENT_PROFILE_SITE:
				this.setPatientProfileSiteMessages();
				break;
			case SYMPTOMTRACKER_GRAPH:
				this.setSymptomTrackerGraphMessagesPatient();
				break;
			case PATIENT_CAREGIVER:
				this.setPatientCaregiverMessages();
				break;
			case PATIENT_SELECT_AVATAR:
				this.setPatientSelectAvatarMessages();
				break;
			default:
				break;
		}
	}
	handleTabSpecificMessagesPart2(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case PATIENT_NOTIFICATION_SITE:
				this.setPatientNotificationSiteMessages();
				break;
			case CHALLENGES_URL:
				this.setChallengesUrlMessages();
				break;
			case PRESCRIPTION_URL:
				this.setPrescriptionUrlMessages();
				break;
			case PRESCRIPTION_STATUS_URL:
				this.setPrescriptionStatusUrlMessages();
				break;
			case TROPHY_CASE_URL:
				this.setTrophyCaseUrlMessages();
				break;
			default:
				break;
		}
	}
	handleTabSpecificMessagesPart3(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case OUTSTANDING_QUESTIONNAIRE_URL:
				this.setOutstandingQuestionnaireUrlMessages();
				break;
			case COMPLETED_QUESTIONNAIRES:
				this.setCompletedQuestionnairesMessages();
				break;
			case LETSPERSONALIZE_URL:
				this.setLetsPersonalizeUrlMessages();
				break;
			case DLQI_QUESTIONNAIRE_URL:
				this.setDlqiQuestionnaireUrlMessages();
				break;
			case PSORIASIS_QUEST_URL:
				this.setPsoriasisQuestUrlMessages();
				break;
			default:
				break;
		}
	}
	handleTabSpecificMessagesPart4(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case WAPI_QUESTIONNAIRE:
				this.setWapiQuestionnaireMessages();
				break;
			case QUALITATIVE_TWO_MONTHS:
				this.setQualitativeTwoMonthsMessages();
				break;
			case MESSAGECENTER_URL:
				this.setMessageCenterUrlMessages();
				break;
			case ACTION_URL:
				this.setActionUrlMessages();
				break;
			case HISTORY_URL:
				this.setHistoryUrlMessages();
				break;
			default:
				break;
		}
	}
	handleTabSpecificMessagesPart5(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case SUPPORT_PAGE:
				this.setSupportPageMessages();
				break;
			case MEDICAL_ENQUIRY_PAGE:
				this.setMedicalEnquiryPageMessages();
				break;
			case REPORT_EVENT_PAGE:
				this.setReportEventPageMessages();
				break;
			case PLATFORM_PAGE:
				this.setPlatformPageMessages();
				break;
			case REMINDER_URL:
				this.setReminderUrlMessages();
				break;
			case SYMPTOMTRACKER_URL:
				this.setSymptomTrackerUrlMessages();
				break;
			case SYMPTOM_TRACKER_MAIN:
				this.setSymptomTrackerMainMessages();
				break;
			case WAPI_COMPLETED_QUESTIONNAIRE:
				this.setWapiCompletedQuestionnaireMessages();
				break;
			case PSORIASIS_COMPLETED_QUEST_URL:
				this.setPsoriasisCompletedQuestUrlMessages();
				break;
			case DLQI_COMPLETED_URL:
				this.setDlqiCompletedUrlMessages();
				break;
			case TWO_MONTHS_COMPLETED_URL:
				this.setTwoMonthsCompletedUrlMessages();
				break;
			case FOURTEEN_WEEKS_COMPLETED_URL:
				this.setFourteenWeeksCompletedUrlMessages();
				break;
			default:
				break;
		}
	}

	setPatientWelcomeMessages() {
		this.patientavatar = true;
		this.mobileName = PATIENT_MOB_ONE;
		this.mobileValue = PATIENT_MOB_TWO;
		this.selectedNameOne = PATIENT_AVATAR_ONE;
this.selectedNameSecond = PATIENT_AVATAR_TWO;
		this.selectedNameAvatar = PATIENT_AVATAR_THREE;
	}

	setPatientProfileSiteMessages() {
		this.mobileName = `Hi ${this.name}, you're doing great!
We appreciate you sharing, it will...`;
this.mobileValue = `Hi ${this.name}, you're doing great!
We appreciate you sharing, it will help 
us provide you with a better experience 
if we know more about you.
Complete your personal information now!`;
this.selectedNameOne = `Hi ${this.name}, you're doing great!`;
this.selectedNameSecond = PATIENT_VALUE_ONE;
this.selectedNameThird = PATIENT_VALUE_TWO;
	}

	setSymptomTrackerGraphMessagesPatient() {
		this.mobileName = SYMPTOM_MOB_VALUE;
	this.mobileValue = SYMPTOM_VALUE_VALUE;
	
		this.selectedNameOne = SYMPTOM_VALUE_VALUE;
this.contentThree = false;
this.contentTwo = false;
	}

	setPatientCaregiverMessages() {
		this.mobileName = PATIENTCARE_VALUE_ONE;
	this.mobileValue =  PATIENTCARE_VALUE_TWO;
		this.selectedNameOne = CAREGIVER_VALUE_ONE;
this.selectedNameSecond = CAREGIVER_VALUE_TWO;
	}

	setPatientSelectAvatarMessages() {
		this.mobileName = CARE_AVATAR_MOB_ONE;
	this.mobileValue = CARE_AVATAR_MOB_TWO;
		this.selectedNameOne = CHOOSE_AVATAR_ONE;
this.selectedNameSecond = CHOOSE_AVATAR_TWO;
	}

	setPatientNotificationSiteMessages() {
		this.mobileName = CARE_NOTIFY_MOB_ONE;
	this.mobileValue = CARE_NOTIFY_MOB_TWO;
		this.selectedNameOne = CARE_NOTIFY_ONE;
this.selectedNameSecond = CARE_NOTIFY_TWO;
	}

	setChallengesUrlMessages() {
		const WINDOW_WIDTH = window.innerWidth;
		this.challangeContents = WINDOW_WIDTH < 601;
		if (this.challangeContents) {
			this.seperateChallenge = false;
			this.main = true;
			this.mobileValue = CHALLENGE_MOB_TWO;
			this.mobileName = CHALLENGE_MOB_ONE;
			this.selectedNameOne = CHALLENGE_VALUE_ONE;
this.selectedNameSecond = CHALLENGE_VALUE_TWO;
			this.selectedNameThree = CHALLENGE_VALUE_THREE;
		} else {
			this.seperateChallenge = true;
			this.main = false;
			this.challangeContent = true;
			this.mobileName = CHALLENGE_MOB_TWO;
	this.mobileValue =CHALLENGE_MOB_TWO;
			this.challengeNameOne = CHALLENGE_VALUE_ONE;
			this.challengeNameTwo = CHALLENGE_VALUE_TWO;
			this.selectedNameThree = CHALLENGE_VALUE_THREE;
		}
	}

	setPrescriptionUrlMessages() {
		this.mobileName = PRESCRIPTION_MOB_ONE;
		this.mobileValue =  PRESCRIPTION_MOB_TWO;
		this.selectedNameOne = PRESCRIPTION_MSG_ONE;
		this.selectedNameSecond = PRESCRIPTION_MSG_TWO;
	}

	setPrescriptionStatusUrlMessages() {
		this.mobileName = PRESCRIPTION_MOB_THREE;
this.mobileValue =  PRESCRIPTION_MOB_FOUR;
	this.selectedNameOne = PRESCRIPTION_MSG_THREE;
	}

	setTrophyCaseUrlMessages() {
		const WINDOW_WIDTH = window.innerWidth;
		this.challangeContents = WINDOW_WIDTH < 601;
		if (this.challangeContents) {
			this.seperateChallenge = false;
			this.main = true;
			this.mobileName = TROPY_MOB_ONE;
	this.mobileValue = TROPY_MOB_TWO;
			this.selectedNameOne = TROPY_VALUE_ONE;
this.selectedNameSecond = TROPY_VALUE_TWO;
		} else {
			this.seperateChallenge = true;
			this.main = false;
			this.challangeContent = true;
			this.mobileName =TROPY_MOB_ONE;
	this.mobileValue = TROPY_MOB_TWO;
			this.challengeNameOne = TROPY_VALUE_ONE;
			this.challengeNameTwo = TROPY_VALUE_TWO;

		}
	}

	setOutstandingQuestionnaireUrlMessages() {
		this.mobileName = OUTSTATNDING_MOB_ONE;
	this.mobileValue = OUTSTATNDING_MOB_TWO;
		this.selectedNameOne = OUSTANDING_VALUE_ONE;
this.selectedNameSecond = OUSTANDING_VALUE_TWO;
this.selectedNameThird = OUSTANDING_VALUE_SIX;
this.selectedNameTwo = OUSTANDING_VALUE_THREE;
this.selectedNameQues = OUSTANDING_VALUE_FOUR;

	}

	setCompletedQuestionnairesMessages() {
		this.mobileName = DLQE_MOB_MSG;
	this.mobileValue = DLQE_VALUE_THREE;
		this.selectedNameOne = QUESTIONAIRE_VALUE_ONE;
	}

	setLetsPersonalizeUrlMessages() {
		this.mobileName = PERSNALIZE_VALUE_TWO;
	this.mobileValue = PERSONALIZE_MSG_ONE;
		this.selectedNameOne = PERSONALIZE_MSG_ONE;

	}

	setDlqiQuestionnaireUrlMessages() {
		this.mobileName = DLQE_MOB_ONE;
	this.mobileValue = DLQE_MOB_TWO;
		this.selectedNameOne = DLQE_VALUE_ONE;
this.selectedNameSecond = DLQE_VALUE_TWO;
	}

	setPsoriasisQuestUrlMessages() {
		this.mobileName = PERSONALIZE_MOB;
	this.mobileValue = PSORIASIS_VALUE_ONE;
		this.selectedNameOne = PSORIASIS_VALUE_ONE;

	}

	setWapiQuestionnaireMessages() {
		this.mobileName = WAPI_MOB_TWO;
	this.mobileValue = WAPI_MOB_THREE;
		this.selectedNameOne = WAPI_VALUE_ONE;
this.selectedNameSecond = WAPI_VALUE_TWO;
this.selectedNameThird = WAPI_VALUE_THREE;
	}

	setQualitativeTwoMonthsMessages() {
		this.mobileName = TWO_MONTHS_MOB_ONE;
	this.mobileValue = TWO_MONTHS_MOB_THREE;
		this.selectedNameOne = TWO_MONTHS_ONE;
this.selectedNameSecond = TWO_MONTHS_TWO;
	}

	setMessageCenterUrlMessages() {
		this.mobileName = MESSAGE_CENTER_MOB_VALUE;
	this.mobileValue = MSG_CENTER_ONE;
		this.selectedNameOne = MSG_CENTER_ONE;

	}

	setActionUrlMessages() {
		this.mobileName = ACTION_MOB_ONE;
	this.mobileValue = ACTION_MOB_TWO;
		this.selectedNameOne = ACTION_MESSAGE_ONE;
this.selectedNameSecond = ACTION_MESSAGE_TWO;
this.selectedNameThird = ACTION_MESSAGE_THREE;
	}

	setHistoryUrlMessages() {
		this.mobileName = HISTORY_MOB_TWO;
	this.mobileValue = HISTORY_MOB_THREE;
		this.selectedNameOne = HISTORY_MESSAGE_ONE;
this.selectedNameSecond = HISTORY_MESSAGE_TWO;
	}

	setSupportPageMessages() {
		this.mobileName = SUPPORT_MOB_ONE;
	this.mobileValue = SUPPORT_MOB_TWO;
		this.selectedNameOne = SOPPORT_PAGE_ONE;
this.selectedNameSecond = SOPPORT_PAGE_TWO;
	}
	setMedicalEnquiryPageMessages() {
		this.mobileName = MEDICAL_MOB_ONE;
	this.mobileValue = MEDICAL_MOB_TWO;
		this.selectedNameOne = SUPPORT_VALUE_THREE;
this.selectedNameSecond = SUPPORT_VALUE_FOUR;
	}

	setReportEventPageMessages() {
		this.mobileName = REPORT_MOB_ONE;
	this.mobileValue = REPORT_MOB_THREE;
		this.selectedNameOne = REPORT_VALUE_ONE;
this.selectedNameSecond = REPORT_VALUE_TWO;
	}

	setPlatformPageMessages() {
		this.mobileName = PLATFORM_MOB_VALUE;
	this.mobileValue = PLATFORM_VALUE_ONE;
		this.selectedNameOne = PLATFORM_VALUE_ONE;

	}

	setReminderUrlMessages() {
		this.mobileName =REMINDER_MOB_ONE;
	this.mobileValue = REMINDER_MOB_TWO;
		this.selectedNameOne = REMINDER_VALUE_ONE;
this.selectedNameSecond = REMINDER_VALUE_TWO;
this.selectedNameThird = REMINDER_VALUE_THREE;
	}

	setSymptomTrackerUrlMessages() {
		this.mobileName = SYMPTOM_MOB_THREE;
	this.mobileValue = SYMPTOM_VALUE_TWO;
		this.selectedNameOne = SYMPTOM_VALUE_TWO;
	}

	setSymptomTrackerMainMessages() {
		this.mobileName = SYMPTOM_MAIN_ONE;
	this.mobileValue =SYMPTOM_VALUE_TWO;
		this.selectedNameOne = SYMPTOM_VALUE_TWO;
	}

	setWapiCompletedQuestionnaireMessages() {
		this.mobileName = WAPI_MOB_ONE;
	this.mobileValue = WAPI_VALUE_FOUR;
		this.selectedNameOne = WAPI_VALUE_FOUR;
	}

	setPsoriasisCompletedQuestUrlMessages() {
		this.mobileName = PSORIASIS_MOB_THREE;
	this.mobileValue = PSORIASIS_VALUE_TWO;
		this.selectedNameOne = PSORIASIS_VALUE_TWO;

	}

	setDlqiCompletedUrlMessages() {
		this.mobileName = DLQE_MOB_MSG;
	this.mobileValue = DLQE_VALUE_THREE;
		this.selectedNameOne = DLQE_VALUE_THREE;

	}

	setTwoMonthsCompletedUrlMessages() {
		this.mobileName = TWO_MONTHS_MOB_TWO;
	this.mobileValue = TWO_MONTHS_THREE;
		this.selectedNameOne = TWO_MONTHS_THREE;

	}

	setFourteenWeeksCompletedUrlMessages() {
		this.mobileName = TWO_MONTHS_MOB_TWO;
	this.mobileValue = TWO_MONTHS_THREE;
		this.selectedNameOne = TWO_MONTHS_THREE;

	}


	showToast(title, message, variant) {
		const EVENT = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if (typeof window !== 'undefined') {
			this.dispatchEvent(EVENT);
		}
	}
}