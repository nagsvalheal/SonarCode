// This comppnent is used for navigating to one page to another page for all unassigned pages
// To import Libraries
import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// To import Apex Classes
//import getTaskCount from '@salesforce/apex/BI_PSPB_BellIconCount.getTaskCountUA';
import USER_DETAILS from "@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser";
import PROFILE_DETAILS from "@salesforce/apex/BI_PSPB_LoginCtrl.profileDetails";
import GET_CAREGIVER_ACCOUNT from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver";
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
import PATIENT_STATUS from "@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus";
import COUNT_ASSESSMENT from "@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName";
import GET_PATIENT_AFTER_WEEKS from "@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks";
// To import Static Resource
import SITE_LOGO from "@salesforce/resourceUrl/BI_PSPB_SiteLogo";
import HOME_ICON from "@salesforce/resourceUrl/BI_PSPB_HomeIcon";
import NOTIFIC_ICON from "@salesforce/resourceUrl/BI_PSPB_NotiIcon";
import MENU_ICON from "@salesforce/resourceUrl/BI_PSPB_MenuIcon";
import NOTIFIC_ICON_COLOR from "@salesforce/resourceUrl/BI_PSPB_NotIconColored";
import CRO_ICON from "@salesforce/resourceUrl/BI_PSP_CrossIcon";
import SEL_ICON from "@salesforce/resourceUrl/BI_PSPB_SelectIcon";
import DOWN_ICON from "@salesforce/resourceUrl/BI_PSPB_downHeadIcon";
// To import Custom Labels
import ACUTE_PATIENT from "@salesforce/label/c.BI_PSPB_Acute";
import BRANDED_DEVUI from "@salesforce/label/c.BI_PSP_BrandedDevProfile";
import ADMIN_PROFILE from "@salesforce/label/c.BI_PSP_SystemAdminProfile";
import PATIENT_PROFILE from "@salesforce/label/c.BI_PSP_PatientProfile";
import CAREGIVER_PROFILES from "@salesforce/label/c.BI_PSPB_CaregiverProfile";
import UNASSIGNED_SITE_URL from "@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl";
import CAREGIVE_RPROFILE from "@salesforce/label/c.BI_PSPB_CaregiverProfileUrl";
import PATIENT_INFO from "@salesforce/label/c.BI_PSPB_CaregiverPatientUrl";
import SELECT_AVATAR from "@salesforce/label/c.BI_PSPB_CaregiverSelectAvatarUrl";
import NOTIFICATION from "@salesforce/label/c.BI_PSPB_CaregiverNotificationPageUrl";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import MY_PROFILE from "@salesforce/label/c.BI_PSPB_PatientMyProfileUrl";
import MY_CAREGIVER from "@salesforce/label/c.BI_PSPB_MyCaregiverUrl";
import PATIENT_AVATAR from "@salesforce/label/c.BI_PSPB_PatientSelectAvatarUrl";
import PATIENT_NOTIFICATION from "@salesforce/label/c.BI_PSPB_PatientNotificationUrl";
import ALL_POST from "@salesforce/label/c.BI_PSPB_ChatterAllPost";
import MY_POST from "@salesforce/label/c.BI_PSPB_ChatterMyPost";
import FOLLOWER from "@salesforce/label/c.BI_PSPB_ChatterFollower";
import FOLLOWING from "@salesforce/label/c.BI_PSPB_ChatterFollowing";
import UNASSIGNED from "@salesforce/label/c.BI_PSPB_UnAssignedLabel";
import BI_PSP_UNASSIGNED from "@salesforce/label/c.BI_PSP_Unassigned";
import CHATTER_SIGNUP from "@salesforce/label/c.BI_PSP_ChatterSignUpUrl";
import INFO_LAND from "@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl";
import ACUTE_DASHBOARD from "@salesforce/label/c.BI_PSPB_AcuteDashboard";
import CHALLENGES from "@salesforce/label/c.BI_PSP_ChallengesNaviUrl";
import TROPHY from "@salesforce/label/c.BI_PSP_TrophyPageUrl";
import OUTSTANDING_QUESTIONAIRE from "@salesforce/label/c.BI_PSPB_OutstndngPageUrl";
import SUPPORT_CASE from "@salesforce/label/c.BI_PSPB_SupportCenterPageUrl";
import MESSAGE_CENTER from "@salesforce/label/c.BI_PSPB_MessageCenterPageUrl";
import SUPPORT_CENTER from "@salesforce/label/c.BI_PSPB_SupportCenterPageUrl";
import MY_CASE from "@salesforce/label/c.BI_PSPB_MyCasesPageUrl";
import SUMMARY_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_SummaryUrl";
import WAPI_COMPLETED from "@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire";
import DLQI_COMPLETED from "@salesforce/label/c.BI_PSPB_DlqiCompletedUrl";
import PSS_COMPLETED from "@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl";
import QSQ_ONE_COMPLETED from "@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl";
import QSQ_TWO_COMPLETED from "@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl";
import LET_PERSONALIZE from "@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl";
import PRESCRIPTION_STATUS from "@salesforce/label/c.BI_PSPB_PrescriptionStatusUrl";
import ACTION from "@salesforce/label/c.BI_PSPB_ActionUrl";
import HISTORY from "@salesforce/label/c.BI_PSPB_HistoryUrl";
import SYMPTOM_LANDING from "@salesforce/label/c.BI_PSP_SymptomTrackerLandingPageUrl";
import ARTICLE_CATEGORY from "@salesforce/label/c.BI_PSPB_ArticleCategoryUrl";
import SEARCH_RESULT from "@salesforce/label/c.BI_PSPB_SearchResults";
import DETAILEDARTICLE from "@salesforce/label/c.BI_PSPB_DetailedArticle";
import SYMPTOMTRACKER_GRAPH from "@salesforce/label/c.BI_PSPB_SymptomTrkGraphUrl";
import SYMPTOMTRACKER_MAIN from "@salesforce/label/c.BI_PSPB_SymptomTrackerMainPages";
import PSS_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl";
import WAPI_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_WapiQuestionnaire";
import QUALITATIVE_TWO_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_QualitativeTwoMonths";
import QUALITATIVE_FOUR_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_QualitativeFourteenWeeks";
import MEDICAL_INFORMATION from "@salesforce/label/c.BI_PSPB_MedicalInfoEnquiryUrl";
import REPORT_ADVERSE from "@salesforce/label/c.BI_PSPB_ReportAdverseEvent";
import CREATE_POST from "@salesforce/label/c.BI_PSPB_CreatePostPageUrl";
import BI_PSPB_Acute from "@salesforce/label/c.BI_PSPB_Acute";
import LOGIN_URL from "@salesforce/label/c.BI_PSP_Login";
import BRANDED_URL from "@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl";
import BI_PSPB_SecureLogout from "@salesforce/label/c.BI_PSPB_SecureLogout";
import UPDATERX from "@salesforce/label/c.BI_PSPB_UpdatePrescriptionUrl";
import COMPLETED_LABEL from "@salesforce/label/c.BI_PSP_Completed";
import EXPIRED from "@salesforce/label/c.BI_PSP_Expired";
import LOGIN_PAGE from '@salesforce/label/c.BI_PSPB_LoginPage';
// To get Current UserId
import Id from "@salesforce/user/Id";

export default class BiPspbNavigationBarQuestionnaire extends LightningElement {
	accName;
	taskCount;
	patientStatusVal;
	showTreatVideo = false;
	downHeadIcon = DOWN_ICON;
	SelectIcon = SEL_ICON;
	navlogo = SITE_LOGO;
	showMenu;
	showToLogin;
	HIcon = HOME_ICON;
	NIcon = NOTIFIC_ICON;
	MenuIcon = MENU_ICON;
	NIconCol = NOTIFIC_ICON_COLOR;
	CrossIcon = CRO_ICON;

	isMenuOpen;
	patientMenuList;
	caregiverMenuList;
	userName;
	showNavDetails;
	userInfo;
	currentUserIfo;
	showCareGiverMenus;
	activeData;
	caregiverDeskMenu = false;
	patientDeskMenu = false;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showChallenge;
	showSymptomTracker;
	showInformationCenter;
	showQuestionnaires;
	showHomeLine;
	showSupport;
	showCommunity;
	lastSegment;
	showPopup;
	showSupportmenu;
	showquestionnairemenu;
	showInformationCentermenu;
	showChallengesmenu;
	showCommunitymenu;
	showTabMenu;
	targetDate14;
	stwai;
	stpss;
	stdlq;
	stqsq;
	count;
	userId = Id;
	showuserSubmenu;
	userType;
	showPrescriptionmenu;
	showNotificationCentermenu;
	acutePatient = ACUTE_PATIENT;
	brandedDevProfile = BRANDED_DEVUI;
	adminProfile = ADMIN_PROFILE;
	patientProfile = PATIENT_PROFILE;
	caregiverProfiles = CAREGIVER_PROFILES;
	myProfile = MY_PROFILE;
	myCaregiver = MY_CAREGIVER;
	patientAvatar = PATIENT_AVATAR;
	patientNotification = PATIENT_NOTIFICATION;
	unAssignedUrl = UNASSIGNED_SITE_URL;
	caregiverProfile = CAREGIVE_RPROFILE;
	patientInformation = PATIENT_INFO;
	selectAvatar = SELECT_AVATAR;
	caregiverNotification = NOTIFICATION;
	allPost = ALL_POST;
	myPost = MY_POST;
	follower = FOLLOWER;
	following = FOLLOWING;
	chatterSignUp = CHATTER_SIGNUP;
	unAssigned = UNASSIGNED;
	infoLanding = INFO_LAND;
	acuteDashboard = ACUTE_DASHBOARD;
	challenges = CHALLENGES;
	trophy = TROPHY;
	outStanding = OUTSTANDING_QUESTIONAIRE;
	supportCase = SUPPORT_CASE;
	messageCenter = MESSAGE_CENTER;
	supportCenter = SUPPORT_CENTER;
	myCase = MY_CASE;
	summaryQues = SUMMARY_QUESTIONNAIRE;
	wapiCompleted = WAPI_COMPLETED;
	dlqiCompleted = DLQI_COMPLETED;
	pssCompleted = PSS_COMPLETED;
	qsqOneCompleted = QSQ_ONE_COMPLETED;
	qsqTwoCompleted = QSQ_TWO_COMPLETED;
	letPersonlize = LET_PERSONALIZE;
	prescriptionStatus = PRESCRIPTION_STATUS;
	symptomLanding = SYMPTOM_LANDING;
	action = ACTION;
	history = HISTORY;
	articleCategory = ARTICLE_CATEGORY;
	detailedArticle = DETAILEDARTICLE;
	searchResult = SEARCH_RESULT;
	symptomTrackerGraph = SYMPTOMTRACKER_GRAPH;
	symptomTrackerMain = SYMPTOMTRACKER_MAIN;
	pssQuestionnaire = PSS_QUESTIONNAIRE;
	wapiQuestionnaire = WAPI_QUESTIONNAIRE;
	qualitativeTwo = QUALITATIVE_TWO_QUESTIONNAIRE;
	qualativeFour = QUALITATIVE_FOUR_QUESTIONNAIRE;
	medicalInformation = MEDICAL_INFORMATION;
	reportAdverse = REPORT_ADVERSE;
	platFormSupport = REPORT_ADVERSE;
	createPost = CREATE_POST;
	unAssignedsite = BI_PSP_UNASSIGNED;
	acute = BI_PSPB_Acute;
	loginUrl = LOGIN_URL;
	brandedUrl = BRANDED_URL;
	secureLogout = BI_PSPB_SecureLogout;
	updateRx = UPDATERX;
	loginPageUrl = LOGIN_PAGE;

	//Qualitative Date for topbar navigation
	@wire(GET_PATIENT_AFTER_WEEKS)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.targetTwoMonthsDate = data.targetTwoMonthsDate ?? null;
				this.targetFourteenWeeksDate = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	//Used to get information regarding the loggedin caregiver
	patientInfo() {
		try{
			GET_CAREGIVER_ACCOUNT({ userId: Id, isActive: true })
				.then((patient) => {
					this.activeData = patient.map((pat) => ({
						Id: pat.BI_PSPB_Patient__c,
						Name: pat.BI_PSPB_Patient__r.Name,
						CaregiveID: pat.BI_PSPB_Caregiver__c
					}));
					if (this.activeData.length > 0) {
						this.showCareGiverMenus = true;
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	
	//Navigation

	openUpdatePrescription() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.updateRx);
	}
	//Used to get the user and profile information of the current loggedin user to render the navigation bar details.

	connectedCallback() {
		let globalThis = window;
		this.currentPageUrl = globalThis.location?.href;
		this.urlSegments = this.currentPageUrl.split("/");
		this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		this.userType = typeof Id;
		const REGEX = /\/([^\\/?#]+)(?:\?.*|)$/iu;
		const MATCH = REGEX.exec(this.currentPageUrl);
		this.lastSegment = MATCH && MATCH[1];
		if (this.lastSegment !== null && this.lastSegment !== "") {
			this.showUnderlineforMenus();
		} else {
			this.showHomeLine = true;
		}
		if (this.userType !== 'undefined') {
			USER_DETAILS()
				.then((user) => {
					this.currentUserIfo = user;
					this.fetchAssessmentCount();
					if (this.currentUserIfo.BI_PSPB_Caregiver__c === true) {
						this.patientInfo();
					}
					this.userName = user.FirstName + " " + user.LastName;
					PROFILE_DETAILS()
						.then((profile) => {
							this.userInfo = profile;
							if (
								this.userInfo.Name === this.adminProfile ||
								this.userInfo.Name === this.patientProfile ||
								this.userInfo.Name === this.caregiverProfiles
							) {
								this.showMenu = true;
								this.showNavDetails = true;
								this.showToLogin = false;
								if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
									this.caregiverDeskMenu = false;
									this.patientDeskMenu = true;
								} else {
									this.caregiverDeskMenu = true;
									this.patientDeskMenu = false;
								}
							} else if (this.userInfo.Name === this.brandedDevProfile) {
								this.showMenu = false;
								this.showNavDetails = false;
								this.showToLogin = true;
							}
						})
						.catch((error) => {
							this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
						});
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		} else {
			this.showMenu = false;
			this.showNavDetails = false;
			this.showToLogin = true;
		}
		try {
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split("/");
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}
	// This method is used t collect the assessment deatils.

	fetchAssessmentCount() {
		try{
			COUNT_ASSESSMENT()
				.then((result) => {
					if (result && result.length > 0) {
						this.count = result;
						if (
							this.count[0] !== 0 ||
							this.count[1] !== 0 ||
							this.count[2] !== 0 ||
							this.count[3] !== 0
						) {
							this.showTabMenu = true;
							this.stwai = this.count[0];
							this.stpss = this.count[1];
							this.stdlq = this.count[2];
							this.stqsq = this.count[3];
						} else {
							this.showTabMenu = false;
						}
					} else {
						this.showTabMenu = false;
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
					this.showTabMenu = false;
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}


	showUnderlineforMenus() {
		if (this.lastSegment) {
			const questionnaireSegments = new Set([
				this.outStanding,
				this.summaryQues,
				this.dlqiCompleted,
				this.letPersonlize,
				this.pssQuestionnaire,
				this.qualitativeTwo,
				this.qualativeFour,
				this.wapiCompleted,
				this.pssCompleted,
				this.qsqOneCompleted,
				this.qsqTwoCompleted
			]);

			this.resetMenuFlags();

			if (questionnaireSegments.has(this.lastSegment)) {
				this.showQuestionnaires = true;
			}
		}
	}

	resetMenuFlags() {
		this.showChallenge = false;
		this.showInformationCenter = false;
		this.showSymptomTracker = false;
		this.showQuestionnaires = false;
		this.showHomeLine = false;
		this.showSupport = false;
		this.showCommunity = false;
	}
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.

	@wire(PATIENT_STATUS, { userid: `$userId` })
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientStatusVal = data;
				if (this.patientStatusVal === this.unAssignedsite) {
					this.showTreatVideo = false;
				} else {
					this.showTreatVideo = true;
				}
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//Used to decide the Navigation for community chatter

	openCommunity() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.allPost
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Navigation for Caregiver/Patient

	userNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.myProfile
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.caregiverProfile
			);
		}
	}

	userNavigationMyprofile() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.myProfile
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.caregiverProfile
			);
		}
	}

	userNavigationMyCaregiver() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.myCaregiver
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.patientInformation
			);
		}
	}

	userNavigationSelectAvatar() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.patientAvatar
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.selectAvatar
			);
		}
	}

	userNavigationNotSettings() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.patientNotification
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.caregiverNotification
			);
		}
	}
	//Navigation

	checkUser() {
		this.showToLogin = false;
		window.location.assign(this.baseUrl + this.brandedUrl + this.loginUrl);
	}

	openInformationCenter() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.infoLanding
		);
	}

	openHome() {
		if (this.patientStatusVal === this.acute) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.acuteDashboard
			);
		} else {
			window.location.assign(this.baseUrl + this.unAssignedUrl);
		}
	}

	openChallenges() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.challenges);
	}
	//Navigation

	openQuestions() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.outStanding
		);
	}

	openSymptomTracker() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.symptomLanding
		);
	}

	openSupport() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.supportCase
		);
	}

	logoutFunc() {
		this.showPopup = true;
		document.body.style.overflow = 'hidden';
	}

	doNotLogout() {
		this.showPopup = false;
		document.body.style.overflow = '';
	}
	//This method is used for logout functionality

	logoutFromSite() {
		this.showPopup = false;
		let currentUrl = window.location.href;
		let urlParts = currentUrl.split("/");
		let index = urlParts.indexOf("s");
		let desiredUrl;
		if (index !== -1) {
			desiredUrl = urlParts.slice(0, index + 1).join("/");
		}
		window.location.assign(desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.brandedUrl + this.loginUrl);

	}

	openMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl);
	}
	//used for rendering the components

	openMobMenu() {
		this.isMenuOpen = true;
		this.caregiverMenuList = false;
		this.patientMenuList = false;
	}

	closeMobMenu() {
		this.isMenuOpen = false;
		this.showMenu = true;

		this.showInformationCentermenu = false;
		this.showChallengesmenu = false;
		this.showquestionnairemenu = false;
		this.showCommunitymenu = false;
		this.showSupportmenu = false;
		this.showuserSubmenu = false;

		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showNotificationCentermenu = false;
		this.showPrescriptionmenu = false;
	}

	openMenuList() {
		this.caregiverMenuList = true;
		this.showMenu = false;
	}

	userMenuNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			this.caregiverMenuList = false;
			this.patientMenuList = true;
			this.showMenu = false;
			this.showuserSubmenu = false;
		} else {
			this.caregiverMenuList = true;
			this.patientMenuList = false;
			this.showMenu = false;
			this.showuserSubmenu = false;
		}
	}
	/*--Patient Profile Links--*/

	openPatMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.myProfile);
	}

	openPatMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.myCaregiver
		);
	}

	openPatSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientAvatar
		);
	}

	openPatNotSettings() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientNotification
		);
	}
	/*--Patient Profile Links Ends--*/

	/*--Caregiver Profile Links--*/
	openCarMyProfile() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.caregiverProfile
		);
	}

	openCarMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientInformation
		);
	}

	openCarSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.selectAvatar
		);
	}

	openCarNotSettings() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.caregiverNotification
		);
	}

	openCarNotSettingsOne() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.messageCenter
		);
	}
	/*--Caregiver Profile Links Ends--*/

	openSupportTwo() {
		this.showMenu = false;
		this.showSupportmenu = true;
	}
	//Used to render the components

	openQuestionsTwo() {
		this.showMenu = false;
		this.showquestionnairemenu = true;
	}

	openInformationCenterTwo() {
		this.showMenu = false;
		this.showInformationCentermenu = true;
	}

	openChallengesTwo() {
		this.showMenu = false;
		this.showChallengesmenu = true;
	}

	openCommunities() {
		this.showMenu = false;
		this.showCommunitymenu = true;
	}

	handleBack() {
		this.showMenu = true;
		this.showquestionnairemenu = false;
	}
	/*   Patient Community SubMenu */

	openAllPosts() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.allPost
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	openMyPosts() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.myPost
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	openMyFollowers() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssigned + this.follower
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	openFollowing() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssigned + this.following
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	handlebackCommunity() {
		this.showMenu = true;
		this.showCommunitymenu = false;
	}

	handlebackChallenges() {
		this.showMenu = true;
		this.showChallengesmenu = false;
	}

	handlebackSupport() {
		this.showMenu = true;
		this.showSupportmenu = false;
	}

	handlebackInformationCenter() {
		this.showMenu = true;
		this.showInformationCentermenu = false;
	}

	openArticles() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.infoLanding
		);
	}

	openPTV() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.acutePatient
		);
	}

	openSupportCenter() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.supportCenter
		);
	}

	openMyCases() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.myCase);
	}

	openTrophycase() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.trophy);
	}
	/*showquestionnairemenu links*/

	openOutstandingQuestionnaire() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.outStanding
		);
	}

	openSummary() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.summaryQues
		);
	}

	openCompletedQuestionnaire() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.dlqiCompleted
		);
	}

	openLetsPersonalize() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.letPersonlize
		);
	}

	updatePrescriptionLink() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.updateRx);
	}

	prescriptionStatusLink() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.prescriptionStatus
		);
	}

	openGeneralNC() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.messageCenter
		);
	}

	openActionRequiredNC() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.action);
	}

	openHistoryNC() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.history);
	}
	//Used to render the components

	backtoMenu() {
		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showMenu = false;
		this.showuserSubmenu = true;
	}

	backtoMainMenu() {
		this.showMenu = true;
		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showuserSubmenu = false;
		this.showPrescriptionmenu = false;
		this.showNotificationCentermenu = false;
	}

	backtoHomeMenu() {
		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showMenu = false;
		this.showuserSubmenu = true;
		this.showPrescriptionmenu = false;
		this.showNotificationCentermenu = false;
	}

	openUserDetailmenu() {
		this.showMenu = false;
		this.showuserSubmenu = true;
	}

	openUpdatePrescriptionMenu() {
		this.showPrescriptionmenu = true;
		this.showuserSubmenu = false;
		this.showMenu = false;
	}

	openNotificationCenterMenu() {
		this.showNotificationCentermenu = true;
		this.showuserSubmenu = false;
		this.showMenu = false;
	}
	//Used to render the components

	openComQuestionnaires() {
		if (this.stdlq > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.dlqiCompleted
			);
		} else if (this.stpss > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.pssCompleted
			);
		} else if (this.stwai > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.wapiCompleted
			);
		} else if (this.stqsq > 0) {
			if (this.targetFourteenWeeksDate !== null) {
				if (this.status === COMPLETED_LABEL || this.status === EXPIRED) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.qsqTwoCompleted
					);
				} else {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.qsqOneCompleted
					);
				}
			} else {
				window.location.assign(
					this.baseUrl + this.unAssignedUrl + this.qsqOneCompleted
				);
			}
		}
	}
	// showToast used for all the error messages caught

	showToast(title, message, variant) {
		if (typeof window !== 'undefined') {
			const event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}
}