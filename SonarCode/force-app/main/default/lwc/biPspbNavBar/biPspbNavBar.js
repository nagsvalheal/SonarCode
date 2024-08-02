//To design the Navigation bar that contains the required menus and submenus
//To import Libraries
import { LightningElement } from 'lwc';
import { resources } from 'c/biPspLabelAndResourceGeneral';
//To import Apex Classes
import USER_DETAILS from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import PROFILE_DETAILS from '@salesforce/apex/BI_PSPB_LoginCtrl.profileDetails';
import GET_CAREGIVER_ACCOUNTS from '@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver';
import CHECK_COMMUNITY_USERNAME from '@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
import GET_PATIENT_AFTER_WEEKS from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To get Current UserId
import Id from '@salesforce/user/Id';
export default class BiPspbNavBar extends LightningElement {
	patientStatusVal = '';
	showTreatVideo;
	showToLogin;
	accName;
	taskCount;
	showToLoginpatient = 'loginbtn';
	desiredUrl;
	caregiverAvatar = false;
	caregiverAvatarMobile = false;
	bellCaregiver = true;
	TabName;
	results;
	isMenuOpen;
	patientAmList;
	caregiverAmList;
	userName;
	showNavDetails;
	userInfo;
	currentUserIfo;
	showCareGiverMenus;
	activeData;
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
	showCommunityMenu;
	showChallengesMenu;
	showSupportMenu;
	showInformationCenterMenu;
	showQuestionnaireMenu;
	showTabMenu;
	count;
	showUserSubMenu;
	showPrescriptionMenu;
	showNotificationCenterMenu;
	showMobileMenuIcons;
	stwai;
	stpss;
	stdlq;
	stqsq;
	showMenu;
	showForHcpPat;
	showOnlyForHcp;
	userType;
	notificationCount = 0;
	caregiverDeskMenu = false;
	patientDeskMenu = false;
	variable = true;
	userId = Id;
	downHeadIcon = resources.DOWN_HEAD_ICON;
	selectIcon = resources.SELECT_ICON;
	navLogo = resources.SITE_LOGO;
	notificIcon = resources.NOTIFIC_ICON;
	menuIcon = resources.MENU_ICON;
	notificIconCol = resources.NOTIFIC_ICON_COLOR;
	crossIcon = resources.CROSS_ICON;
	acute = resources.ACUTE;
	unAssigned = resources.UNASSIGNED;
	unAssignedUrl = resources.UNASSIGNED_URL;
	
	//Custom label variables for navigation urls
	siteUrlBranded = resources.BRSITE_URL;
	siteChallengesUrlBranded = resources.CHALLENGES_URL;
	systemAdmininstrator = resources.SYSTEM_ADMIN_PROFILE;
	patientProfile = resources.PATIENT_PROFILE;
	caregiverProfile = resources.CAREGIVER_PROFILE;
	brandedDevProfile = resources.BRANDED_DEV_UI_PROFILES;
	siteUrlAllPost = resources.ALLPOST_URL;
	siteUrlchatterSignUp = resources.CHATTER_SIGNUP_URL;
	siteUrlinfoCenterLandingPage = resources.INFO_LANDINGPAGE_URL;
	siteTrophyCaseUrlBranded = resources.TROPHY_CASE_SITEURL;
	sitesymptomTrackerLpBranded = resources.SYMPTOM_TRACKER_LP_URL;
	siteloginBranded = resources.LOGIN;
	siteoutstandingQuestionnaireBranded = resources.OUTSTANDINGPAGE_URL;
	sitesupportPageBranded = resources.SUPPORT_PAGE_URL;
	hcpUrl = resources.IAMHCPSITE_URL;
	patientUrl = resources.IAMPATIENTSITE_URL;
	chronicPatientUrl = resources.CHRONICVIDEOPAGE_URL;
	myCasesPageUrl = resources.MYCASE_PAGE_URL;
	myPostSiteUrl = resources.CHATTER_MYPOST;
	followersSiteUrl = resources.FOLLOWERS_URL;
	followingSiteUrl = resources.FOLLOWING_URL;
	summaryPageSiteUrl = resources.SUMMARY_URL;
	letsPersonaliseUrl = resources.LETSPERSONALISE_URL;
	reminderPageUrl = resources.REMINDERSITE_URL;
	updatePrescriptionUrl = resources.UPDATE_PRESCRIPTION_URL;
	prescriptionStatusUrl = resources.PRESCRIPTION_STATUS_URL;
	messageCenterUrl = resources.MESSAGE_CENTER_URL;
	actionUrl = resources.ACTION_SITEURL;
	historyUrl = resources.HISTORY_SITEURL;
	wapiCompletedQuesUrl = resources.WAPI_COMPLETED_SITEURL;
	dlqiCompletedQuesUrl = resources.DLQI_COMPLETED_SITEURL;
	pssCompletedQuesUrl = resources.PSS_COMPLETED_SITEURL;
	qsqCmpltTwoMonthsUrl = resources.QSQ_COMPLETED_TWOMONTHS_URL;
	qsqCmpltFourteenWeeksUrl = resources.QSQ_COMPLETED_FOURTEENWEEKS_URL;
	patientMyProfileUrl = resources.PATIENT_MYPROFILE_URL;
	caregiverProfileUrl = resources.CAREGIVER_PROFILE_URL;
	myCaregiverUrl = resources.MYCAREGIVER_URL;
	patientSelectAvatarUrl = resources.PATIENT_SELECT_AVATAR_URL;
	patientNotificationUrl = resources.PATIENT_NOTIFICATION_URL;
	caregiverPatientUrl = resources.CAREGIVER_PATIENT_URL;
	caregiverSelectAvatarUrl = resources.CAREGIVER_SELECT_AVATAR_URL;
	caregiverNotificationUrl = resources.CAREGIVER_NOTIFICATION_URL;
	articleCategoryUrl = resources.ARTICLE_CATEGORY_URL;
	searchResultUrl = resources.SEARCH_RESULT_URL;
	detailedArticleUrl = resources.DETAILED_ARTICLE_URL;
	symptomTrackerGraphUrl = resources.SYMPTOM_TRACKER_GRAPH_URL;
	symptomTrackerMainPageUrl = resources.SYMPTOM_TRACKER_MAINPAGE_URL;
	pssQuestionnaireUrl = resources.PSORIASIS_SITEURL;
	wapiQuestionnaireUrl = resources.WAPI_SITEURL;
	qualitativeTwoMonthsUrl = resources.QUALITATIVE_TWOMONTHS_URL;
	qualitativeFourteenWeeksUrl = resources.QUALITATIVE_FOURTEENWEEKS_URL;
	dashboardPageUrl = resources.DASHBOARD_SITEURL;
	medicalInformationEnquiryUrl = resources.MEDICAL_INFO_ENQUIRY_URL;
	reportAdverseEventUrl = resources.REPORT_ADVERSE_EVENT_URL;
	platformSupportPageUrl = resources.PLATFORM_SUPPORT_URL;
	createPostPageUrl = resources.CREATEPOST_URL;
	secureLogout = resources.SECURE_LOGOUT;
	acuteVideoPage = resources.ACUTE_VIDEO_PAGE;
	loginPageUrl = resources.LOGIN_PAGE;
	target14wksdate=null;
	errorMsg = resources.ERROR_MESSAGE;
	errorVariant = resources.ERROR_VARIANT;
	caregiverFirstAvatar = resources.CAREGIVER_FIRST_AVATAR;
	completedStatus = resources.COMPLETED;
	expiredLabel = resources.EXPIRED;

	displayErrorPage = resources.BI_PSP_DISPLAYERRORPAGE;
	beyondGpp = resources.BI_PSP_BEYONDGPP;
	accountManager = resources.ACCOUNT_MANAGER;
	notificationCenter = resources.NOTIFICATION_CENTER;
	treatmentPresValue = resources.TREATMENT_PRES_VALUE;
	updatePrescription = resources.UPDATE_PRESCRIPTION;
	switchPatients = resources.SWITCH_PATIENTS;
	logOut = resources.LOGOUT;
	home = resources.HOME;
	informationCenter = resources.INFORMATION_CENTER;
	symptomTracker = resources.SYMPTOM_TRACKER;
	challenges = resources.CHALLENGES;
	myQuestionnaire = resources.MY_QUESTIONNAIRE;
	community = resources.COMMUNITY;
	support = resources.SUPPORT;
	loginLabel = resources.LOGIN_LABEL;
	back = resources.BACK;
	myProfile = resources.MY_PROFILE;
	presStatus = resources.PRES_STATUS;
	general = resources.GENERAL;
	actionRequired = resources.ACTION_REQUIRED;
	history = resources.HISTORY;
	patientInfoLabel = resources.PATIENT_INFO;
	selectAvatar = resources.SELECT_AVATAR;
	notificSetting = resources.NOTIFIC_SETTING;
	supportCenter = resources.SUPPORT_CENTER;
	myCase = resources.MY_CASE;
	article = resources.ARTICLES;
	patientTrtVideo = resources.PATIENT_TREATMENT_VIDEO;
	trophyCase = resources.TROPHY_CASE;
	allPosts = resources.ALL_POSTS;
	myPosts = resources.MY_POSTS;
	myFollowers = resources.MY_FOLLOWERS;
	following = resources.FOLLOWING;
	outstandingPage = resources.OUTSTANDING_PAGE;
	summary = resources.SUMMARY;
	completedQues = resources.COMPLETED_QUES;
	letsPersonalize = resources.LETS_PERSONALIZE;
	myCaregiver = resources.MY_CAREGIVER;
	patientBack = resources.PATIENT_BACK;
	logoutWarning = resources.LOGOUT_WARNING;
	logoutContent = resources.LOGOUT_CONTENT;
	yes = resources.YES;
	cancel = resources.CANCEL;
	//Qualitative Date for topbar navigation

	patientAfterThreeMonthsAndFourteenWeeks() {
		let globalThis = window;
		try{
			GET_PATIENT_AFTER_WEEKS()
				.then(data => {
					if (data) {
						this.target14wksdate = data.targetFourteenWeeksDate ?? null;
					}
				})
				.catch(error => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				})
		}
		catch (err) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}



	//Used to get information regarding the loggedin caregiver
	patientInfo() {
		let globalThis = window;
		try{
			GET_CAREGIVER_ACCOUNTS({ userId: Id, isActive: true })
				.then(patient => {//Null check has been handled in the respective apex method.
					this.activeData = patient.map((pat) => ({
						Id: pat.BI_PSPB_Patient__c,
						Name: pat.BI_PSPB_Patient__r.Name,
						CaregiveID: pat.BI_PSPB_Caregiver__c
					}));
					if (this.activeData.length > 0) {
						this.showCareGiverMenus = true
					}
				})
				.catch(error => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				})
		}
		catch (err) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	//Navigation
	openUpdatePrescription() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.updatePrescriptionUrl);
	}

	//Used to get the user and profile information of the current loggedin user to render the navigation bar details.
	connectedCallback() {
		let globalThis = window;
		try {
			this.userType = typeof Id;
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			const regex = /\/([^/?#]+)(?:\?.*|)$/iu;
			const match = regex.exec(this.currentPageUrl);
			const currentTabName = globalThis.location?.pathname.split('/').pop();
			this.TabName = globalThis.location?.pathname.split('/').pop();
			this.lastSegment = match && match[1];
			if (this.lastSegment !== null && this.lastSegment !== '') {
				this.showUnderlineForMenus();
			}
			else {
				this.showHomeLine = true;
			}
			if (this.userType !== 'undefined') {

				USER_DETAILS()
					.then(user => { // Null check for user record has been handled in its respective apex method.
						this.fetchAssessmentCount();
						this.currentUserIfo = user;
						if (this.currentUserIfo.BI_PSPB_Caregiver__c === true) {
							this.patientInfo();
						}
						this.userName = user.FirstName + ' ' + user.LastName;
						PROFILE_DETAILS()
							.then(profile => { // Null check for user record has been handled in its respective apex method.
								this.userInfo = profile;
								if (this.userInfo.Name === this.systemAdmininstrator || this.userInfo.Name === this.patientProfile || this.userInfo.Name === this.caregiverProfile) {
									this.retrievePatientStatus();
									this.showMenu = true;
									this.showNavDetails = true;
									this.showToLogin = false;
									this.showMobileMenuIcons = true;
									if (currentTabName === this.caregiverFirstAvatar) {
										this.showMenu = false;
										this.showNavDetails = false;
										this.caregiverAvatar = true;
										this.bellCaregiver = false;
									}
									if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
										this.caregiverDeskMenu = false;
										this.patientDeskMenu = true;
										this.patientAfterThreeMonthsAndFourteenWeeks();
									}
									else {
										this.caregiverDeskMenu = true;
										this.patientDeskMenu = false;
										this.patientAfterThreeMonthsAndFourteenWeeks();
									}
								}
								else if (this.userInfo.Name === this.brandedDevProfile) {
									this.showMenu = false;
									this.showNavDetails = false;
									this.showToLogin = true;

								}
							})
							.catch(error => {
								globalThis.sessionStorage.setItem('errorMessage',error.body.message);
								globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
							})
					})
					.catch(error => {
						globalThis.sessionStorage.setItem('errorMessage',error.body.message);
						globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
					})
			} else {
				this.showMenu = false;
				this.showNavDetails = false;
				this.variable = false;
				this.showMobileMenuIcons = false;
				if (currentTabName === this.hcpUrl) {
					this.showToLogin = false;
				} else {
					this.showToLogin = true;
				}
				if (currentTabName === this.hcpUrl || currentTabName === this.patientUrl) {
					this.showForHcpPat = true;
				} else {
					this.showForHcpPat = false;
				}
			}
		}
		catch (err) {
			globalThis.sessionStorage.setItem('errorMessage',err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	//This method is used to get the patient information of the current logged in user
	retrievePatientStatus() {
		let globalThis = window;
		try{
			PATIENT_STATUS({ userId: '$userId' })
				.then(result => {
					if (result && result !== null) {
						this.patientStatusVal = result;
						this.handlePatientStatus();
					}
				})
				.catch(error => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
		}
		catch (error) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}
	//Used for rendering the modules according to the patient information

	handlePatientStatus() {
		if (this.patientStatusVal === this.acute) {
			this.showTreatVideo = true;
		} else if (this.patientStatusVal === this.unAssigned) {
			this.showTreatVideo = false;
		} else {
			this.showTreatVideo = true;
		}
	}

	// This method is used t collect the assessment deatils.
	fetchAssessmentCount() {
		let globalThis = window;
		try{
			COUNT_ASSESSMENT()
				.then(result => {
					if (result && result.length > 0) {
						this.count = result;
						if (this.count[0] !== 0 || this.count[1] !== 0 || this.count[2] !== 0 || this.count[3] !== 0) {
							this.showTabMenu = true;
							this.stwai = this.count[0];
							this.stpss = this.count[1];
							this.stdlq = this.count[2];
							this.stqsq = this.count[3];
						}
						else {
							this.showTabMenu = false;
						}
					}
					else {
						this.showTabMenu = false;
					}
				})
				.catch(error => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
					this.showTabMenu = false;
				});
		}
		catch (err) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}
	//This method is used to identify the current page and renders the highliged bar for menus
	showUnderlineForMenus() {
		const segmentActions = {
			[this.siteChallengesUrlBranded]: 'showChallenge',
			[this.siteTrophyCaseUrlBranded]: 'showChallenge',
			[this.chronicPatientUrl]: 'showInformationCenter',
			[this.acuteVideoPage]: 'showInformationCenter',
			[this.siteUrlinfoCenterLandingPage]: 'showInformationCenter',
			[this.articleCategoryUrl]: 'showInformationCenter',
			[this.searchResultUrl]: 'showInformationCenter',
			[this.detailedArticleUrl]: 'showInformationCenter',
			[this.sitesymptomTrackerLpBranded]: 'showSymptomTracker',
			[this.symptomTrackerGraphUrl]: 'showSymptomTracker',
			[this.symptomTrackerMainPageUrl]: 'showSymptomTracker',
			[this.siteoutstandingQuestionnaireBranded]: 'showQuestionnaires',
			[this.summaryPageSiteUrl]: 'showQuestionnaires',
			[this.dlqiCompletedQuesUrl]: 'showQuestionnaires',
			[this.letsPersonaliseUrl]: 'showQuestionnaires',
			[this.pssQuestionnaireUrl]: 'showQuestionnaires',
			[this.wapiQuestionnaireUrl]: 'showQuestionnaires',
			[this.qualitativeTwoMonthsUrl]: 'showQuestionnaires',
			[this.qualitativeFourteenWeeksUrl]: 'showQuestionnaires',
			[this.wapiCompletedQuesUrl]: 'showQuestionnaires',
			[this.dlqiCompletedQuesUrl]: 'showQuestionnaires',
			[this.pssCompletedQuesUrl]: 'showQuestionnaires',
			[this.qsqCmpltTwoMonthsUrl]: 'showQuestionnaires',
			[this.qsqCmpltFourteenWeeksUrl]: 'showQuestionnaires',
			[this.dashboardPageUrl]: 'showHomeLine',
			[this.sitesupportPageBranded]: 'showSupport',
			[this.medicalInformationEnquiryUrl]: 'showSupport',
			[this.reportAdverseEventUrl]: 'showSupport',
			[this.platformSupportPageUrl]: 'showSupport',
			[this.myCasesPageUrl]: 'showSupport',
			[this.siteUrlAllPost]: 'showCommunity',
			[this.siteUrlchatterSignUp]: 'showCommunity',
			[this.myPostSiteUrl]: 'showCommunity',
			[this.createPostPageUrl]: 'showCommunity',
			[this.followersSiteUrl]: 'showCommunity',
			[this.followingSiteUrl]: 'showCommunity',
		};
	
		// Reset all flags
		this.showChallenge = false;
		this.showInformationCenter = false;
		this.showSymptomTracker = false;
		this.showQuestionnaires = false;
		this.showHomeLine = false;
		this.showSupport = false;
		this.showCommunity = false;
	
		// Set the corresponding flag if lastSegment matches any key in segmentActions
		if (segmentActions[this.lastSegment]) {
			this[segmentActions[this.lastSegment]] = true;
		}
	}
	
	//Used to decide the Navigation for community chatter

	openCommunity() {
		let globalThis = window;
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {// Null check for user record has been handled in its respective apex method.
					if (result === true) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlAllPost);
					}
					if (result === false) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp);
					}
				})
				.catch((error) => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				})
		}
		catch (err) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}
	//Navigation for Caregiver/Patient

	userNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.patientMyProfileUrl);
		}
		else {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverProfileUrl);
		}
	}

	userNavigationMyprofile() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.patientMyProfileUrl);
		}
		else {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverProfileUrl);
		}
	}

	userNavigationMyCaregiver() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.myCaregiverUrl);
		} else {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverPatientUrl);
		}
	}

	userNavigationSelectAvatar() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.patientSelectAvatarUrl);
		} else {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverSelectAvatarUrl);
		}
	}

	userNavigationNotSettings() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.patientNotificationUrl);
		} else {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverNotificationUrl);
		}
	}
	//Navigation

	checkUser() {
		this.showToLogin = false;
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteloginBranded);
	}

	openInformationCenter() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlinfoCenterLandingPage);
	}

	openHome() {

		if (!this.userId) {
			window.location.assign(this.baseUrl + this.siteUrlBranded);

		}
		else {

			if (this.TabName === this.caregiverFirstAvatar) {

				window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverFirstAvatar);
			} else {

				window.location.assign(this.baseUrl + this.siteUrlBranded + this.dashboardPageUrl);
			}


		}
	}

	openChallenges() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteChallengesUrlBranded);
	}

	openTrophyCase() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteTrophyCaseUrlBranded);
	}

	openQuestions() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteoutstandingQuestionnaireBranded);
	}
	//Used to render the components

	openQuestionnaire() {
		this.showMenu = false;
		this.showQuestionnaireMenu = true;
	}

	openSupportCase() {
		this.showMenu = false;
		this.showSupportMenu = true;
	}

	openChallengesPage() {
		this.showMenu = false;
		this.showChallengesMenu = true;
	}

	openInformationCenterPage() {
		this.showMenu = false;
		this.showInformationCenterMenu = true;
	}

	openCommunities() {
		this.showMenu = false;
		this.showCommunityMenu = true;
	}
	//Navigation

	openSymptomTracker() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.sitesymptomTrackerLpBranded);
	}

	openSupport() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.sitesupportPageBranded);
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
		let globalThis = window;
		try{
			this.showPopup = false;
			let currentUrl = window.location.href;
			let urlParts = currentUrl.split('/');
			let index = urlParts.indexOf('s');
			if (index !== -1) {
				this.desiredUrl = urlParts.slice(0, index + 1).join('/');
			}
			window.location.assign(this.desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.siteUrlBranded + this.siteloginBranded);
		
		}catch (error) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}
	//Navigation

	openMyProfile() {
		window.location.assign(this.baseUrl + this.siteUrlBranded);
	}
	//used for rendering the components

	openMobMenu() {
		const currentTabName = window.location.pathname.split('/').pop();
		this.isMenuOpen = true;
		if (currentTabName === this.caregiverFirstAvatar) {
			this.showMenu = false;
			this.caregiverAvatarMobile = true;
		}
		this.caregiverAMlist = false;
		this.patientAMlist = false;
	}

	closeMobMenu() {
		const currentTabName = window.location.pathname.split('/').pop();
		this.isMenuOpen = false;
		if (currentTabName === this.caregiverFirstAvatar) {
			this.showMenu = true;
			this.caregiverAvatarMobile = false;
		}
		this.showMenu = true;

		this.showInformationCenterMenu = false;
		this.showChallengesMenu = false;
		this.showQuestionnaireMenu = false;
		this.showCommunityMenu = false;
		this.showSupportMenu = false;
		this.showUserSubMenu = false;

		this.caregiverAmList = false;
		this.patientAmList = false;
		this.showPrescriptionMenu = false;
		this.showNotificationCenterMenu = false;

	}

	openAmList() {
		this.caregiverAmList = true;
		this.showMenu = false;
		this.isMenuOpen = false;
	}

	userMenuNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			this.caregiverAmList = false;
			this.patientAmList = true;
			this.showMenu = false;
			this.showUserSubMenu = false;
		}
		else {
			this.caregiverAmList = true;
			this.patientAmList = false;
			this.showMenu = false;
			this.showUserSubMenu = false;
		}
	}
	/*   Patient Community SubMenu */

	openAllPosts() {
		let globalThis = window;
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {// Null check for user record has been handled in its respective apex method.
					if (result === true) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlAllPost);
					}
					if (result === false) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp);
					}
				})
				.catch((error) => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
		}
		catch (err) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	openMyPosts() {
		let globalThis = window;
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {// Null check for user record has been handled in its respective apex method.
					if (result === true) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.myPostSiteUrl);
					}
					if (result === false) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp);
					}
				})
				.catch((error) => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
		}
		catch (error) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	openMyFollowers() {
		let globalThis = window;
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {// Null check for user record has been handled in its respective apex method.
					if (result === true) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.followersSiteUrl);
					}
					if (result === false) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp);
					}
				})
				.catch((error) => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
		}
		catch (error) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',error.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}

	openFollowing() {
		let globalThis = window;
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {// Null check for user record has been handled in its respective apex method.
					if (result === true) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.followingSiteUrl);
					}
					if (result === false) {
						window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlchatterSignUp);
					}
				})
				.catch((error) => {
					globalThis.sessionStorage.setItem('errorMessage',error.body.message);
					globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
				});
		}
		catch (err) {
			//navigate to error page
			globalThis.sessionStorage.setItem('errorMessage',err.body.message);
			globalThis.location?.assign(this.baseUrl + this.siteUrlBranded + this.displayErrorPage);
		}
	}
	/*showQuestionnaireMenu links*/

	openOutstandingQuestionnaire() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteoutstandingQuestionnaireBranded);
	}

	openSummary() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.summaryPageSiteUrl);
	}

	openCompletedQuestionnaire() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.dlqiCompletedQuesUrl);
	}

	openLetsPersonalize() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.letsPersonaliseUrl);
	}

	handleBack() {
		this.showMenu = true;
		this.showQuestionnaireMenu = false;
	}

	handleBackCommunity() {
		this.showMenu = true;
		this.showCommunityMenu = false;
	}

	handleBackChallenges() {
		this.showMenu = true;
		this.showChallengesMenu = false;
	}

	handleBackSupport() {
		this.showMenu = true;
		this.showSupportMenu = false;
	}

	handleBackInformationCenter() {
		this.showMenu = true;
		this.showInformationCenterMenu = false;
	}
	/*--Patient Profile Links--*/

	openPatMyProfile() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.patientMyProfileUrl);
	}

	openPatMyCaregiver() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.myCaregiverUrl);
	}

	openPatSelectAvatar() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.patientSelectAvatarUrl);
	}

	openPatNotSettings() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.patientNotificationUrl);
	}
	/*--Patient Profile Links Ends--*/

	/*--Caregiver Profile Links--*/
	openCarMyProfile() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverProfileUrl);

	}

	openCarMyCaregiver() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverPatientUrl);
	}

	openCarSelectAvatar() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverSelectAvatarUrl);
	}

	openCarNotSettings() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.caregiverNotificationUrl);
	}

	openCarNotSettingsOne() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.messageCenterUrl);
	}
	/*--Caregiver Profile Links Ends--*/

	openArticles() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.siteUrlinfoCenterLandingPage);
	}

	openChronicPatient() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.chronicPatientUrl);
	}

	openSupportCenter() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.sitesupportPageBranded);
	}

	openMyCases() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.myCasesPageUrl);
	}

	updatePrescriptionLink() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.updatePrescriptionUrl);
	}

	prescriptionStatusLink() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.prescriptionStatusUrl);
	}

	openTreatmentRemaindersLink() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.reminderPageUrl);
	}

	openMessageCenter() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.messageCenterUrl);
	}

	openActionRequired() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.actionUrl);
	}

	openHistory() {
		window.location.assign(this.baseUrl + this.siteUrlBranded + this.historyUrl);
	}
	//Used to render the components

	backToMenu() {
		this.caregiverAmList = false;
		this.patientAmList = false;
		this.showMenu = false;
		this.showUserSubMenu = true;
	}

	backToMainMenu() {
		this.showMenu = true;
		this.caregiverAmList = false;
		this.patientAmList = false;
		this.showUserSubMenu = false;
		this.showPrescriptionMenu = false;
		this.showNotificationCenterMenu = false;
	}

	backToHomeMenu() {
		this.caregiverAmList = false;
		this.patientAmList = false;
		this.showMenu = false;
		this.showUserSubMenu = true;
		this.showPrescriptionMenu = false;
		this.showNotificationCenterMenu = false;
	}

	openUserDetailMenu() {
		this.showMenu = false;
		this.showUserSubMenu = true;
	}

	openUpdatePrescriptionMenu() {
		this.showPrescriptionMenu = true;
		this.showUserSubMenu = false;
		this.showMenu = false;
	}

	openNotificationCenterMenu() {
		this.showNotificationCenterMenu = true;
		this.showUserSubMenu = false;
		this.showMenu = false;
	}
	//Used to render the components

	openComQuestionnaires() {
		if (this.stdlq > 0) {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.dlqiCompletedQuesUrl);
		} else if (this.stpss > 0) {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.pssCompletedQuesUrl);
		} else if (this.stwai > 0) {
			window.location.assign(this.baseUrl + this.siteUrlBranded + this.wapiCompletedQuesUrl);
		} else if (this.stqsq > 0) {
			if (this.target14wksdate !== null) {
				if (this.status === this.completedStatus || this.status === this.expiredLabel) {
					window.location.assign(
						this.baseUrl + this.siteUrlBranded + this.qsqCmpltFourteenWeeksUrl
					);
				} else {
					window.location.assign(this.baseUrl + this.siteUrlBranded + this.qsqCmpltTwoMonthsUrl);
				}
			} else {
				window.location.assign(this.baseUrl + this.siteUrlBranded + this.qsqCmpltTwoMonthsUrl);
			}
		}
	}

}