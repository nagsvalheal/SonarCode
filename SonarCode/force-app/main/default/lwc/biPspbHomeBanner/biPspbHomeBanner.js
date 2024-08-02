//This LWC is designed for Account Manager which contains the profile details, avatar settings, notification settings and for logout functinality
//To import Libraries
import { LightningElement} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Imports resourceUrl to reference external resources for proper rendering and functionality.
import SITE_LOGO from '@salesforce/resourceUrl/BI_PSPB_SiteLogo';
import HOME_ICON from '@salesforce/resourceUrl/BI_PSPB_HomeIcon';
import NOTIFICATION_ICON from '@salesforce/resourceUrl/BI_PSPB_NotiIcon';
import MENU_ICON from '@salesforce/resourceUrl/BI_PSPB_MenuIcon';
import NOTIFICATION_ICON_COLOR from '@salesforce/resourceUrl/BI_PSPB_NotIconColored';
import BANNER_IMG from '@salesforce/resourceUrl/BI_PSPB_BannerImage';
import CROSS_ICON from '@salesforce/resourceUrl/BI_PSP_CrossIcon';
import SELECT_ICON from '@salesforce/resourceUrl/BI_PSPB_SelectIcon';
import DOWN_ARROW from '@salesforce/resourceUrl/BI_PSPB_downHeadIcon';
import BEYONDGPP_LOGO from '@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo';
import Id from '@salesforce/user/Id';
// Importing Apex classes to interact with Salesforce backend for data retrieval.
import USER_DETAILS from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import PROFILE_DETAILS from '@salesforce/apex/BI_PSPB_LoginCtrl.profileDetails';
import GET_CAREGIVER_ACCOUNTS from '@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver';
import CHECK_COMMUNITY_USERNAME from '@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername';
import UPDATE_SWITCH_SELECTED_PATIENTID from '@salesforce/apex/BI_PSPB_PatientDetailsCtrl.updateSwitchSelectedPatientID';

// Imports labels for descriptive text or identifiers, enhancing accessibility and user understanding.
import SYSTEM_ADMIN_PROFILE from '@salesforce/label/c.BI_PSP_SystemAdminProfile';
import PATIENT_PROFILES from '@salesforce/label/c.BI_PSP_PatientProfile';
import CAREGIVER_PROFILES from '@salesforce/label/c.BI_PSPB_CaregiverProfile';
import BRANDEDSITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import BRANDED_CHALLENGES_SITE_URL from '@salesforce/label/c.BI_PSP_ChallengesNaviUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ALLPOST_SITE_URL from '@salesforce/label/c.BI_PSPB_ChatterAllPost';
import CHATTERSIGNUP_SITE_URL from '@salesforce/label/c.BI_PSP_ChatterSignUpUrl';
import INFO_CENTER_LANDING_PAGESITE_URL from '@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl';
import BRANDED_TROPHYCASE_SITE_URL from '@salesforce/label/c.BI_PSP_TrophyPageUrl';
import SYMPTOMTRACKER_SITE_URL from '@salesforce/label/c.BI_PSP_SymptomTrackerLandingPageUrl';
import LOGINSITE_URL from '@salesforce/label/c.BI_PSP_Login';
import OUTSTANDING_QUESTIONNAIRE_SITEURL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import SUPPORT_PAGESITE_URL from '@salesforce/label/c.BI_PSPB_SupportCenterPageUrl';
import IAMHCP_SITEURL from '@salesforce/label/c.BI_PSPB_IamHcp';
import IAMPATIENT_SITEURL from '@salesforce/label/c.BI_PSPB_IamPatientUrl';
import CHRONICVIDEO_PAGESITE_URL from '@salesforce/label/c.BI_PSPB_ChronicVideoUrl';
import MYCASES_PAGESITE_URL from '@salesforce/label/c.BI_PSPB_MyCasesPageUrl';
import MYPOST_PAGESITE_URL from '@salesforce/label/c.BI_PSPB_ChatterMyPost';
import FOLLOWERS_PAGESITE_URL from '@salesforce/label/c.BI_PSPB_ChatterFollower';
import FOLLOWING_PAGESITE_URL from '@salesforce/label/c.BI_PSPB_ChatterFollowing';
import SUMMARY_PAGESITE_URL from '@salesforce/label/c.BI_PSPB_SummaryUrl';
import LETSPERSNOLISE_SITEURL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import REMINDER_SITEURL from '@salesforce/label/c.BI_PSPB_ReminderUrl';
import UPDATE_PRESCRIPTION_SITEURL from '@salesforce/label/c.BI_PSPB_UpdatePrescriptionUrl';
import PRESCRIPTION_STATUS_SITEURL from '@salesforce/label/c.BI_PSPB_PrescriptionStatusUrl';
import MESSAGE_CENTER_SITEURL from '@salesforce/label/c.BI_PSPB_MessageCenterPageUrl';
import ACTION_MESSAGE_SITEURL from '@salesforce/label/c.BI_PSPB_ActionUrl';
import HISTORY_MESSAGE_SITEURL from '@salesforce/label/c.BI_PSPB_HistoryUrl';
import WAPI_COMPLETED_QUESTION_SITEURL from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import DLQI_COMPLETED_QUESTION_SITEURL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import PSS_COMPLETED_QUESTION_SITEURL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import QSQ1_COMPLETED_QUESTION_SITEURL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import QSQ2_COMPLETED_QUESTION_SITEURL from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import PATIENT_MYPROFILE_SITEURL from '@salesforce/label/c.BI_PSPB_PatientMyProfileUrl';
import CAREGIVER_PROFILE_SITEURL from '@salesforce/label/c.BI_PSPB_CaregiverProfileUrl';
import MYCAREGIVER_SITEURL from '@salesforce/label/c.BI_PSPB_MyCaregiverUrl';
import PATIENT_SELECTAVATAR_SITEURL from '@salesforce/label/c.BI_PSPB_PatientSelectAvatarUrl';
import PATIENT_NOTIFICATION_SITEURL from '@salesforce/label/c.BI_PSPB_PatientNotificationUrl';
import CAREGIVER_PATIENT_SITEURL from '@salesforce/label/c.BI_PSPB_CaregiverPatientUrl';
import CAREGIVER_SELECTAVATAR_SITEURL from '@salesforce/label/c.BI_PSPB_CaregiverSelectAvatarUrl';
import CAREGIVER_NOTIFICATION_SITEURL from '@salesforce/label/c.BI_PSPB_CaregiverNotificationPageUrl';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import DASHBOARD_SITEURL from '@salesforce/label/c.BI_PSPB_Dashboad';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import PSS_COMPLETED_SITEURL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import WAPI_COMPLETED_SITEURL from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import QUALITATIVE_COMPLETED_FOURTEENMONTHS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import QUALITATIVE_COMPLETED_TWOMONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import LOGIN_PAGE from '@salesforce/label/c.BI_PSPB_LoginPage';
import SECURE_LOGOUT from '@salesforce/label/c.BI_PSPB_SecureLogout';
import UNDEFINED from '@salesforce/label/c.BI_PSP_Undefined';
import BEYANDGPP_TITLE from '@salesforce/label/c.BI_PSP_BeyondGpp';
import ACCOUNT_MANAGER from '@salesforce/label/c.BI_PSPB_AccountManager';
import MY_PROFILE from '@salesforce/label/c.BI_PSP_MyProfile';
import PATIENT_INFO from '@salesforce/label/c.BI_PSPB_PatientInformation';
import SELECT_AVATAR from '@salesforce/label/c.BI_PSPB_SelectAvatar';
import NOTIFICATION_SETTING from '@salesforce/label/c.BI_PSPB_NotificationSetting';
import UPDATE_PRESCRIPTION from '@salesforce/label/c.BI_PSPB_UpdatePrescription';
import TREATMENT_REMINDER from '@salesforce/label/c.BI_PSPB_TreatmentAndPresValue';
import MY_CAREGIVER from '@salesforce/label/c.BI_PSPB_MyCaregiver';
import SWITCH_PATIENT from '@salesforce/label/c.BI_PSPB_SwitchPatient';
import LOGOUT from '@salesforce/label/c.BI_PSPB_Logout';
import HOME from '@salesforce/label/c.BI_PSPB_Home';
import INFO_CENTER from '@salesforce/label/c.BI_PSPB_InformationCenter';
import SYMPTOM_TRACKER from '@salesforce/label/c.BI_PSPB_SymptomTrack';
import CHALLENGE from '@salesforce/label/c.BI_PSPB_Challenge';
import MY_QUESTIONAIRE from '@salesforce/label/c.BI_PSPB_MyQuestionnaires';
import COMMINUTY from '@salesforce/label/c.BI_PSPB_Community';
import SUPPORT from '@salesforce/label/c.BI_PSPB_Support';
import LOGIN from '@salesforce/label/c.BI_PSPB_Login';
import WELCOME from '@salesforce/label/c.BI_PSPB_WelcomeTo';
import WELCOME_MSG from '@salesforce/label/c.BI_PSPB_WelcomeMsg';
import IAM_HCP from '@salesforce/label/c.BI_PSPB_IamHcpMsg';
import IAM_PATIENT from '@salesforce/label/c.BI_PSPB_IamPatientMsg';
import BACK from '@salesforce/label/c.BI_PSPB_Back';
import NOTIFICATION_CENTER from '@salesforce/label/c.BI_PSPB_NotficationCenter';
import PRESCRIPTION_STATUS from '@salesforce/label/c.BI_PSPB_PrescriptionStatus';
import GENERAL from '@salesforce/label/c.BI_PSPB_General';
import ACTION_REQUIRED from '@salesforce/label/c.BI_PSPB_ActionRequired';
import HISTORY from '@salesforce/label/c.BI_PSPB_History';
import CARE_BACK from '@salesforce/label/c.BI_PSPB_CareBack';
import TROPY_CASE from '@salesforce/label/c.BI_PSPB_TropyCase';
import PATIENT_TREATMENT from '@salesforce/label/c.BI_PSPB_PatientTreatmentVideo';
import ARTICLE from '@salesforce/label/c.BI_PSPB_Articles';
import SUPPORT_CENTER from '@salesforce/label/c.BI_PSPB_SupportCenterValue';
import MYCASE from '@salesforce/label/c.BI_PSPB_MyCase';
import ALL_POST from '@salesforce/label/c.BI_PSP_AllPosts';
import MY_POST from '@salesforce/label/c.BI_PSP_MyPosts';
import MY_FOLLOWERS from '@salesforce/label/c.BI_PSP_MyFollowers';
import FOLLOWING from '@salesforce/label/c.BI_PSP_Following';
import OUTSTANDING_QEUSTIONAIRE from '@salesforce/label/c.BI_PSP_OutstndngPageTxt';
import SUMMARY from '@salesforce/label/c.BI_PSPB_Summary';
import COMPLETED_QUESTIIONAIRE from '@salesforce/label/c.BI_PSP_CompletedQuestionnaireTxt';
import PATIENT_BACK from '@salesforce/label/c.BI_PSPB_PatientBackValue';
import EXTRA from '@salesforce/label/c.BI_PSPB_Extra';
import LETS_PERSNALIZE from '@salesforce/label/c.BI_PSPB_LetsPersonal';
import LOGOUT_WARNING from '@salesforce/label/c.BI_PSPB_LogoutWarning';
import LOGOUT_CONTENT from '@salesforce/label/c.BI_PSPB_LogoutContent';
import CANCEL_BUTTON from '@salesforce/label/c.BI_PSP_CancelButton';
import YES from '@salesforce/label/c.BI_PSPB_Yes';

export default class BiPspbHomeBanner extends LightningElement {
	showToLogin;
	activeData;
	desiredUrl;
	loginAttempt;
	showWithoutMenu;
	article = ARTICLE;
	myCase = MYCASE;
	allPost = ALL_POST;
	myPost = MY_POST;
	supportCenter = SUPPORT_CENTER;
	myFollowers = MY_FOLLOWERS;
	following = FOLLOWING;
	outstandingQues = OUTSTANDING_QEUSTIONAIRE;
	summary = SUMMARY;
	completedQues = COMPLETED_QUESTIIONAIRE;
	patientBack = PATIENT_BACK;
	extra = EXTRA;
	letsPersonalize = LETS_PERSNALIZE;
	logoutWarning = LOGOUT_WARNING;
	logoutContent = LOGOUT_CONTENT;
	cancel = CANCEL_BUTTON;
	yes = YES;
	back = BACK;
	notificationCenter = NOTIFICATION_CENTER;
	prescriptionStatus = PRESCRIPTION_STATUS;
	generel = GENERAL;
	careBack = CARE_BACK;
	tropyCase = TROPY_CASE;
	patientTreatment = PATIENT_TREATMENT;
	actionRequired = ACTION_REQUIRED;
	history = HISTORY;
	welcome = WELCOME;
	welcomeMsg = WELCOME_MSG;
	iamHcp = IAM_HCP;
	iamPatient = IAM_PATIENT;
	login = LOGIN;
	logout =LOGOUT;
	home = HOME;
	challange = CHALLENGE;
	community = COMMINUTY;
	support = SUPPORT;
	myQuestionaire = MY_QUESTIONAIRE;
	symptomTracker = SYMPTOM_TRACKER;
	infoCenter = INFO_CENTER;
	switchPatient = SWITCH_PATIENT;
	myCaregiver = MY_CAREGIVER;
	myProfile = MY_PROFILE;
	patientInformation = PATIENT_INFO;
	selectAvatar = SELECT_AVATAR;
	accountManager = ACCOUNT_MANAGER;
	notificationSetting = NOTIFICATION_SETTING;
	updatePrescription = UPDATE_PRESCRIPTION;
	treatmentReminder = TREATMENT_REMINDER;
	beyandGpp = BEYANDGPP_TITLE;
	loginPageUrl=LOGIN_PAGE;
	siteUrlBranded = BRANDEDSITE_URL;
	siteChallengesUrlBranded = BRANDED_CHALLENGES_SITE_URL;
	systemAdmininstrator = SYSTEM_ADMIN_PROFILE;
	patientProfile = PATIENT_PROFILES;
	caregiverProfile = CAREGIVER_PROFILES;
	siteUrlAllPost = ALLPOST_SITE_URL;
	siteUrlchatterSignUp = CHATTERSIGNUP_SITE_URL;
	siteUrlinfoCenterLandingPage = INFO_CENTER_LANDING_PAGESITE_URL;
	siteTrophyCaseUrlBranded = BRANDED_TROPHYCASE_SITE_URL;
	siteSymptomTrackerLpBranded = SYMPTOMTRACKER_SITE_URL;
	siteLoginBranded = LOGINSITE_URL;
	siteOutstandingQuestionnaireBranded = OUTSTANDING_QUESTIONNAIRE_SITEURL;
	siteSupportPageBranded = SUPPORT_PAGESITE_URL;
	healthCareProviderUrl = IAMHCP_SITEURL;
	patientUrl = IAMPATIENT_SITEURL;
	chronicPatientUrl = CHRONICVIDEO_PAGESITE_URL;
	myCasesPageUrl = MYCASES_PAGESITE_URL;
	myPostSiteUrl = MYPOST_PAGESITE_URL;
	followerSiteUrl = FOLLOWERS_PAGESITE_URL;
	followingSiteUrl = FOLLOWING_PAGESITE_URL;
	summaryPageSiteUrl = SUMMARY_PAGESITE_URL;
	letsPersonaliseUrl = LETSPERSNOLISE_SITEURL;
	secureLogout = SECURE_LOGOUT;
	reminderPageUrl = REMINDER_SITEURL;
	updatePrescriptionUrl = UPDATE_PRESCRIPTION_SITEURL;
	prescriptionStatusUrl = PRESCRIPTION_STATUS_SITEURL;
	messageCenterUrl = MESSAGE_CENTER_SITEURL;
	actionUrl = ACTION_MESSAGE_SITEURL;
	historyUrl = HISTORY_MESSAGE_SITEURL;
	wapiCompletedQuestionUrl = WAPI_COMPLETED_QUESTION_SITEURL;
	dlqiCompletedQuestionUrl = DLQI_COMPLETED_QUESTION_SITEURL;
	pssCompletedQuestionUrl = PSS_COMPLETED_QUESTION_SITEURL;
	qsq1CompletedQuestionnaire = QSQ1_COMPLETED_QUESTION_SITEURL;
	qsq2CompletedQuestionnaire = QSQ2_COMPLETED_QUESTION_SITEURL;
	patientMyProfileUrl = PATIENT_MYPROFILE_SITEURL;
	caregiverProfileUrl = CAREGIVER_PROFILE_SITEURL;
	myCaregiverUrl = MYCAREGIVER_SITEURL;
	patientSelectAvatarUrl = PATIENT_SELECTAVATAR_SITEURL;
	patientNotificationUrl = PATIENT_NOTIFICATION_SITEURL;
	caregiverPatientUrl = CAREGIVER_PATIENT_SITEURL;
	caregiverSelectAvatarUrl = CAREGIVER_SELECTAVATAR_SITEURL;
	caregiverNotificationUrl = CAREGIVER_NOTIFICATION_SITEURL;
	dashboardPageurl = DASHBOARD_SITEURL;
	BGpp = BEYONDGPP_LOGO;
	downHeadIcon = DOWN_ARROW;
	bannerImgae = BANNER_IMG;
	selectIcon = SELECT_ICON;
	caregiverAMlist;
	isMenuOpen;
	openwithoutMenu;
	patientDashboardPage;
	navLogo = SITE_LOGO;
	showMenu;
	HIcon = HOME_ICON;
	NIcon = NOTIFICATION_ICON;
	MenuIcon = MENU_ICON;
	NIconCol = NOTIFICATION_ICON_COLOR;
	crossIcon = CROSS_ICON;
	showNavDetails;
	primaryLandingPage;
	userName;
	caregiver;
	patient;
	userInfo;
	currentUserIfo;
	patientOrCare;
	showCareGiverMenus;
	caregiverDeskMenu = false;
	patientDeskMenu = false;
	showPopup;
	showCommunitymenu;
	showChallengesmenu;
	showSupportmenu;
	showInformationCentermenu;
	showQuestionnaireMenu;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showuserSubmenu;
	showPrescriptionmenu;
	showNotificationCentermenu;
	showforNotLoggedIn;
	userType;
	
	//Used to get information regarding the loggedin caregiver
	patientInfo() {
		try{
			GET_CAREGIVER_ACCOUNTS({ userId: Id, isActive: false })
				.then((patient) => {//Null check has been handled in the respective apex method.
						this.activeData = patient;
						if (this.activeData.length > 0) {
							this.showCareGiverMenus = true;
							this.updateFalse(false);
						}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	receivedloginvalue(event){
		this.loginAttempt=event.detail;
			if(this.loginAttempt=== 0){	
				this.showWithMenu = false;
				this.showWithoutMenu = true;
				this.showToLogin = false;
				this.showMenu = false;
				this.showforNotLoggedIn = false;
			}
	}
	//Used to get the user and profile information of the current loggedin user to render the components according to the details.
	
	connectedCallback() {
		try{
			this.userType = typeof Id;
			let globalThis = window;
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split("/");
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			if (this.userType !== UNDEFINED) {
				USER_DETAILS()
					.then((user) => { // Null check for user record has been handled in its respective apex method.
						this.currentUserIfo = user;
						
						if (this.currentUserIfo.BI_PSPB_Caregiver__c === true) {
							this.patientInfo();
						}
						this.userName = user.FirstName + '' + user.LastName;
						PROFILE_DETAILS()
							.then((profile) => {// Null check for user record has been handled in its respective apex method.
								this.userInfo = profile;
								if (
									this.userInfo.Name === this.systemAdmininstrator ||
									this.userInfo.Name === this.patientProfile ||
									this.userInfo.Name === this.caregiverProfile
								) {
									this.showMenu = true;
									this.showNavDetails = true;
									this.patientDashboardPage = true;
									this.showWithMenu = false;
									if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
										this.showWithMenu = true;
										this.patientOrCare = true;
										this.caregiverDeskMenu = false;
										this.patientDeskMenu = true;
										this.showWithoutMenu = false;
										this.showforNotLoggedIn = false;
								
									} else {
										this.patientOrCare = false;
										this.caregiverDeskMenu = true;
										this.patientDeskMenu = false;
										this.showWithoutMenu = true;
										this.showWithMenu = false;
										this.showforNotLoggedIn = false;
									
									}
									this.primaryLandingPage = false;
									this.showToLogin = false;
									this.showforNotLoggedIn = false;
								} else {
									this.showMenu = false;
									this.showNavDetails = false;
									this.patientDashboardPage = false;
									this.primaryLandingPage = true;
									this.showToLogin = true;
									this.showWithoutMenu = false;
									this.showWithMenu = false;
									this.showforNotLoggedIn = true;
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
				this.patientDashboardPage = false;
				this.primaryLandingPage = true;
				this.showToLogin = true;
				this.showWithoutMenu = false;
				this.showWithMenu = false;
				this.showforNotLoggedIn = true;
			}
		}
		catch(error){
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}

	
	//Used to decide the Navigation for community chatter
	openCommunity() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {// Null check has been handled in its respective apex method
						if (result === true) {
							window.location.assign(
								this.baseUrl + this.siteUrlBranded + this.siteUrlAllPost
							);
						}
						if (result === false) {
							window.location.assign(
								this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
							);
						}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Navigation
	openInformationCenter() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteUrlinfoCenterLandingPage
		);
	}
	openChallenges() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteChallengesUrlBranded
		);
	}
	openTrophycase() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteTrophyCaseUrlBranded
		);
	}
	//Used to render the components
	openChallengesMenu() {
		this.showMenu = false;
		this.showChallengesmenu = true;
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
	handleback() {
		this.showMenu = true;
		this.showQuestionnaireMenu = false;
	}
	//Navigation
	openSymptomTracker() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteSymptomTrackerLpBranded
		);
	}
	//Navigation for Caregiver/Patient
	userNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.patientMyProfileUrl
			);
		} else {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.caregiverProfileUrl
			);
		}
	}
	userNavigationMyprofile() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.patientMyProfileUrl
			);
		} else {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.caregiverProfileUrl
			);
		}
	}
	userNavigationMyCaregiver() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.myCaregiverUrl
			);
		} else {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.caregiverPatientUrl
			);
		}
	}
	userNavigationSelectAvatar() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.patientSelectAvatarUrl
			);
		} else {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.caregiverSelectAvatarUrl
			);
		}
	}
	userNavigationNotSettings() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.patientNotificationUrl
			);
		} else {
			window.location.assign(
				this.baseUrl + this.siteUrlBranded + this.caregiverNotificationUrl
			);
		}
	}
	//Navigation
	openUpdatePrescription() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.updatePrescriptionUrl
		);
	}
	checkUser() {
		this.showToLogin = false;
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteLoginBranded
		);
	}
	openHome() {
		if(!this.userInfo){
			window.location.assign(this.baseUrl + this.siteUrlBranded);
		}
	}
	openQuestions() {
		window.location.assign(
			this.baseUrl +
			this.siteUrlBranded +
			this.siteOutstandingQuestionnaireBranded
		);
	}
	//Used to render the components
	openCommunities() {
		this.showMenu = false;
		this.showCommunitymenu = true;
	}
	openInformationCenter2() {
		this.showMenu = false;
		this.showInformationCentermenu = true;
	}
	handlebackCommunity() {
		this.showMenu = true;
		this.showCommunitymenu = false;
	}
	//Navigation
	openSupport() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteSupportPageBranded
		);
	}
	//Used to render the components
	openSupport2() {
		this.showMenu = false;
		this.showSupportmenu = true;
	}
	openQuestions2() {
		this.showMenu = false;
		this.showQuestionnaireMenu = true;
	}
	logoutFunc() {
		this.showPopup = true;
	}
	doNotLogout() {
		this.showPopup = false;
	}
	//This method is used for logout functionality
	logoutFromSite() {
		this.showPopup = false;
		let currentUrl = window.location.href;
		let urlParts = currentUrl.split('/');
		let index = urlParts.indexOf('s');
		if (index !== -1) {
			this.desiredUrl = urlParts.slice(0, index + 1).join('/');
			this.updateFalse(true);
		}
	}
	//This method is used for logout functionality

	updateFalse(navigation) {
		try{
			let globalThis = window;
			if (this.activeData.length > 0 && this.activeData !== undefined) {
				UPDATE_SWITCH_SELECTED_PATIENTID({
					UserID: this.activeData[0].CaregiveID,
					SelectedAccountId: null,
					check: false
				}) // Use newAvatarSrc
					.then(() => {// Null check has been handled in its respective apex method
						if (navigation === true) {
							globalThis.location?.assign(this.desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.siteUrlBranded +this.siteLoginBranded);
						}
					})
					.catch((error) => {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
					});
			} else if (
				this.userInfo.Name === this.patientProfile ||
				this.userInfo.Name === this.systemAdmininstrator
			) {
				globalThis.location?.assign(this.desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.siteUrlBranded +this.siteLoginBranded);
			}
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Navigation
	openMyProfile() {
		window.location.assign(this.baseUrl + this.siteUrlBranded);
	}
	openHCPpage() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.healthCareProviderUrl);
	}
	openPATpage() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.patientUrl
		);
	}
	//Used to render the components
	openMobMenu() {
		this.isMenuOpen = true;
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.openwithoutMenu = false;
	}
	openMobWithoutMenu() {
		this.isMenuOpen = false;
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.openwithoutMenu = true;
	}
	closeMobMenu() {
		this.isMenuOpen = false;
		this.showMenu = true;
		this.openwithoutMenu = false;
	}
	openAMlist() {
		this.caregiverAMlist = true;
		this.showMenu = false;
		this.openwithoutMenu = false;
	}
	userMenuNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			this.caregiverAMlist = false;
			this.patientAMlist = true;
			this.showMenu = false;
			this.showuserSubmenu = false;
			this.openwithoutMenu = false;
		} else {
			this.caregiverAMlist = true;
			this.patientAMlist = false;
			this.showMenu = false;
			this.showuserSubmenu = false;
			this.openwithoutMenu = false;
		}
	}
	/*--Patient Profile Links--*/
	openPatMyProfile() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.patientMyProfileUrl
		);
	}
	openPatMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.myCaregiverUrl
		);
	}
	openPatSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.patientSelectAvatarUrl
		);
	}
	openPatNotSettings() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.patientNotificationUrl
		);
	}
	/*--Patient Profile Links Ends--*/

	/*--Caregiver Profile Links--*/
	openCarMyProfile() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.caregiverProfileUrl
		);
	}
	openCarMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.caregiverPatientUrl
		);
	}
	openCarSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.caregiverSelectAvatarUrl
		);
	}
	openCarNotSettings() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.caregiverNotificationUrl
		);
	}
	/*--Caregiver Profile Links Ends--*/

	openArticles() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteUrlinfoCenterLandingPage
		);
	}
	openPTV() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.chronicPatientUrl
		);
	}
	openSupportCenter() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.siteSupportPageBranded
		);
	}
	openMyCases() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.myCasesPageUrl
		);
	}
	//Used to navigate the components in community according to thr username
	openAllPosts() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {// Null check has been handled in its respective apex method
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.siteUrlBranded + this.siteUrlAllPost
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Used to navigate the components in community according to thr username
	openMyPosts() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {// Null check has been handled in its respective apex method
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.siteUrlBranded + this.myPostSiteUrl
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Used to navigate the components in community according to thr username
	openMyFollowers() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {// Null check has been handled in its respective apex method
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.siteUrlBranded + this.followerSiteUrl
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Used to navigate the components in community according to thr username
	openFollowing() {
		try{
			CHECK_COMMUNITY_USERNAME({ userId: this.userId })
				.then((result) => {// Null check has been handled in its respective apex method
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.siteUrlBranded + this.followingSiteUrl
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Navigation
	openoutstandingquestionnaire() {
		window.location.assign(
			this.baseUrl +
			this.siteUrlBranded +
			this.siteOutstandingQuestionnaireBranded
		);
	}
	opensummary() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.summaryPageSiteUrl
		);
	}
	opencompletedquestionnaire() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.dlqiCompletedQuestionUrl
		);
	}
	openletspersonalize() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.letsPersonaliseUrl
		);
	}
	openTreatmentRemaindersLink() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.reminderPageUrl
		);
	}
	updatePrescriptionLink() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.updatePrescriptionUrl
		);
	}
	prescriptionStatusLink() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.prescriptionStatusUrl
		);
	}
	openGeneralNC() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.messageCenterUrl
		);
	}
	openActionRequiredNC() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.actionUrl);
	}
	openHistoryNC() {
		window.location.assign(
			this.baseUrl + this.siteUrlBranded + this.historyUrl
		);
	}
	//Used to render the components
	backtoMenu() {
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.showMenu = false;
		this.showuserSubmenu = true;
	}
	backtoMainMenu() {
		this.showMenu = true;
		this.caregiverAMlist = false;
		this.patientAMlist = false;
		this.showuserSubmenu = false;
		this.showPrescriptionmenu = false;
		this.showNotificationCentermenu = false;
	}
	backtohomeMenu() {
		this.caregiverAMlist = false;
		this.patientAMlist = false;
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
	openComQuestionnaires() {
		if (this.stdlq > 0) {
		window.location.assign(this.urlq + DLQI_COMPLETED_URL);
		} else if (this.stpss > 0) {
		window.location.assign(this.urlq + PSS_COMPLETED_SITEURL);
		} else if (this.stwai > 0) {
		window.location.assign(this.urlq + WAPI_COMPLETED_SITEURL);
		} else if (this.stqsq > 0) {
		if (this.target14wksdate !== null) {
			if (this.status === COMPLETED_LABEL || this.status ===EXPIRED) {
			window.location.assign(
				this.urlq + QUALITATIVE_COMPLETED_FOURTEENMONTHS
			);
			} else {
			window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWOMONTHS);
			}
		} else {
			window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWOMONTHS);
		}
		}
	}
	// showToast used for all the error messages caught
	showToast(title, message, variant) {
        if (typeof window !== UNDEFINED) {
            const event = new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            });
            this.dispatchEvent(event);
        } 
    }
}