//This LWC is designed for Account Manager which contains the profile details, avatar settings, notification settings and for logout functinality
//To import Libraries
import { LightningElement,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { resources } from 'c/biPspLabelAndResourceGeneral';

//To get Current UserId
import Id from '@salesforce/user/Id';
// Importing Apex classes to interact with Salesforce backend for data retrieval.
import USER_DETAILS from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import PROFILE_DETAILS from '@salesforce/apex/BI_PSPB_LoginCtrl.profileDetails';
import USER_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver';
import GET_LOGGED_IN_USER_ACCOUNT from '@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount';
import GET_CAREGIVER_ACCOUNTS from '@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver';
import UPDATE_SWITCH_SELECTED_PATIENTID from '@salesforce/apex/BI_PSPB_PatientDetailsCtrl.updateSwitchSelectedPatientID';

export default class BiPspbCommonNavBar extends LightningElement {
	//Variable declaration
	showToLogin;
	activeData;
	desiredUrl;
	showforNotLoggedIn=null;
	isCareGiver = false;
	showWithoutMenu;
	publicTermsOfUse = resources.PUBLIC_TERMS_OF_USE;
	publicPrivacyNotice = resources.PUBLIC_PRIVACY_NOTICE;
	publicContactUs = resources.PUBLIC_CONTACT_US;
	loginPageUrl=resources.LOGIN_PAGE;
	siteUrlBranded = resources.BRSITE_URL;
	siteChallengesUrlBranded = resources.CHALLENGES_URL;
	systemAdmininstrator = resources.SYSTEM_ADMIN_PROFILE;
	patientProfile = resources.PATIENT_PROFILE;
	caregiverProfile = resources.CAREGIVER_PROFILE;
	siteUrlAllPost = resources.ALLPOST_URL;
	siteUrlchatterSignUp = resources.CHATTER_SIGNUP_URL;
	siteUrlinfoCenterLandingPage = resources.INFO_LANDINGPAGE_URL;
	siteTrophyCaseUrlBranded = resources.TROPHY_CASE_SITEURL;
	sitesymptomTrackerLpBranded = resources.SYMPTOM_TRACKER_LP_URL;
	siteLoginBranded = resources.LOGIN;
	siteOutstandingQuestionnaireBranded = resources.OUTSTANDINGPAGE_URL;
	siteSupportPageBranded = resources.SUPPORT_PAGE_URL;
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
	beyondGpp = resources.BEYOND_GPP;
	secureLogout = resources.SECURE_LOGOUT;
	downHeadIcon = resources.DOWN_HEAD_ICON;
	bannerImgae = resources.BANNER_IMG;
	selectIcon = resources.SELECT_ICON;
	errorMsg = resources.ERROR_MESSAGE;
	errorVariant = resources.ERROR_VARIANT;
	caregiverAmList;
	isMenuOpen;
	openWithoutMenu;
	patientDashboardPage;
	navLogo = resources.SITE_LOGO;
	showMenu;
	homeIcon = resources.HOME_ICON;
	notificIcon = resources.NOTIFIC_ICON;
	menuIcon = resources.MENU_ICON;
	notificIconColor = resources.NOTIFIC_ICON_COLOR;
	CrossIcon = resources.CROSS_ICON;
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
	showCommunityMenu;
	showChallengesMenu;
	showSupportMenu;
	showInformationCenterMenu;
	showQuestionnaireMenu;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showTabMenu;
	stwai;
	stpss;
	stdlq;
	stqsq;
	count;
	showUserSubMenu;
	showPrescriptionMenu;
	showNotificationCenterMenu;
	userType;
	connectedCallback() {
		try {
			// this.detectLoggedInUrl();
			// this.getPatientData();
			let globalThis = window;
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			this.userType = typeof Id;
			if (this.userType !== 'undefined') {
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
								this.showToast(this.errorMsg, error.message, this.errorVariant);
							});
					})
					.catch((error) => {
						this.showToast(this.errorMsg, error.message, this.errorVariant);
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
		}catch (error) {
			this.showToast(this.errorMsg, error.message, this.errorVariant);
		}
	}

	
	@wire(USER_CAREGIVER)
	wiredavtList({ data }) {
		try {
			const CURRENT_TAB_NAME = window.location.pathname.split('/').pop();
			if (data && data.length > 0) {
				// Assign the data to the reactive property
				if (data.length > 0) {
					this.isCareGiver = true;
					if(data[0].BI_PSP_Loginattempt__c === 1)
						{
							if(CURRENT_TAB_NAME === this.publicTermsOfUse || 
								CURRENT_TAB_NAME === this.publicPrivacyNotice || CURRENT_TAB_NAME === this.publicContactUs )
								{
									this.showforNotLoggedIn=false;
								}
								this.showforNotLoggedIn=false;
						}else{
							this.showforNotLoggedIn=true;
						}
				}
			}
		} catch (err) {
			this.showToast(this.errorMsg, err.message, this.errorVariant);
		}
	}

	// To fetch the Patient data from  Account object    
	@wire(GET_LOGGED_IN_USER_ACCOUNT)
	wiredUserAccounts({ data }) {
		try {
			const CURRENT_TAB_NAME = window.location.pathname.split('/').pop();
		// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				if (this.isCareGiver === false){
				this.activeData = data;
				if(data[0].BI_PSP_Loginattempt__c === 1)
					{
						if(CURRENT_TAB_NAME === this.publicTermsOfUse || 
							CURRENT_TAB_NAME === this.publicPrivacyNotice || CURRENT_TAB_NAME === this.publicContactUs )
							{
								this.showforNotLoggedIn=false;
							}
							this.showforNotLoggedIn=false;	
					}else{
						this.showforNotLoggedIn=true;		
					}
				}
			}
		} catch (error) {
			this.showToast(this.errorMsg, error.message, this.errorVariant);
		}
	}

	//Used to get information regarding the loggedin caregiver

	patientInfo() {
		try{
			GET_CAREGIVER_ACCOUNTS({ userId: Id , isActive: false})
				.then((patient) => {//Null check has been handled in the respective apex method.
						this.activeData = patient;
						if (this.activeData.length > 0) {
							this.showCareGiverMenus = true;
							this.updateFalse(false);
						}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.message, this.errorVariant);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
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
						this.showToast(this.errorMsg, error.message, this.errorVariant);
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
	//Used to render the components
	openMobWithoutMenu() {
		this.isMenuOpen = false;
		this.caregiverAmList = false;
		this.patientAMlist = false;
		this.openWithoutMenu = true;
	}

	closeMobMenu() {
		this.isMenuOpen = false;
		this.showMenu = true;
		this.openWithoutMenu = false;
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