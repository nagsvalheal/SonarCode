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

export default class BiPspbCommonNavBar extends LightningElement {
	//Variable declaration
	showToLogin;
	desiredUrl;
	showforNotLoggedIn=null;
	isCareGiver = false;
	showWithoutMenu;
	publicTermsOfUse = resources.PUBLIC_TERMS_OF_USE;
	publicPrivacyNotice = resources.PUBLIC_PRIVACY_NOTICE;
	publicContactUs = resources.PUBLIC_CONTACT_US;
	siteUrlBranded = resources.BRSITE_URL;
	systemAdmininstrator = resources.SYSTEM_ADMIN_PROFILE;
	patientProfile = resources.PATIENT_PROFILE;
	caregiverProfile = resources.CAREGIVER_PROFILE;
	siteLoginBranded = resources.LOGIN;
	secureLogout = resources.SECURE_LOGOUT;
	errorMsg = resources.ERROR_MESSAGE;
	errorVariant = resources.ERROR_VARIANT;
	openWithoutMenu;
	navLogo = resources.SITE_LOGO;
	menuIcon = resources.MENU_ICON;
	CrossIcon = resources.CROSS_ICON;
	showNavDetails;
	userInfo;
	currentUserIfo;
	showPopup;
	currentPageUrl;
	urlSegments;
	baseUrl;
	userType;
	beyondGppLabel = resources.BI_PSP_BEYONDGPP;
	loginLabel = resources.LOGIN_LABEL;
	logOut = resources.LOGOUT;
	logoutWarning = resources.LOGOUT_WARNING;
	logoutContent = resources.LOGOUT_CONTENT;
	yes = resources.YES;
	cancel = resources.CANCEL;
	connectedCallback() {
		try {
			let globalThis = window;
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			this.userType = typeof Id;
			if (this.userType !== 'undefined') {
				USER_DETAILS()
					.then((user) => { // Null check for user record has been handled in its respective apex method.
						this.currentUserIfo = user;
						
						PROFILE_DETAILS()
							.then((profile) => {// Null check for user record has been handled in its respective apex method.
								this.userInfo = profile;
								if (
									this.userInfo.Name === this.systemAdmininstrator ||
									this.userInfo.Name === this.patientProfile ||
									this.userInfo.Name === this.caregiverProfile
								) {
									this.showNavDetails = true;
									this.showToLogin = false;
									this.showforNotLoggedIn = false;
								} else {
									this.showNavDetails = false;
									this.showToLogin = true;
									this.showWithoutMenu = false;
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
				this.showNavDetails = false;
				this.showToLogin = true;
				this.showWithoutMenu = false;
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
		try{
			this.showPopup = false;
			let currentUrl = window.location.href;
			let urlParts = currentUrl.split('/');
			let index = urlParts.indexOf('s');
			if (index !== -1) {
				this.desiredUrl = urlParts.slice(0, index + 1).join('/');
			}
			window.location.assign(this.desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.siteUrlBranded +this.siteLoginBranded);
		}catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	
	//Used to render the components
	openMobWithoutMenu() {
		this.patientAMlist = false;
		this.openWithoutMenu = true;
	}

	closeMobMenu() {
		
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