import { LightningElement, wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Importing Apex classes to interact with Salesforce backend for data retrieval.
// import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_AvatarCtrl.checkPatientStatus';
// import LOGGEDIN_USER_ACCOUNTS from '@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount';
// import LOGGEDIN_USER_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserCaregiver';
// import LOGGED_USER from '@salesforce/apex/BI_PSPB_AvatarCtrl.loggedUser';
// import CAREGIVER_PATIENT_STATUS from '@salesforce/apex/BI_PSPB_AvatarCtrl.checkCaregiverPatientStatus';
// import ACCOUNT_AVATAR from '@salesforce/apex/BI_PSPB_AvatarCtrl.updateAccountAvatar';
// import LOGIN_ATTEMPT from '@salesforce/apex/BI_PSPB_AvatarCtrl.updateLoginAttempt';
// import USER_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver';
// import LOGIN_ATTEMPT_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.updateLoginAttemptcaregiver';
import CURRENT_USER from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import LOGGED_USER from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import AVATAR from '@salesforce/apex/BI_PSPB_AvatarCtrl.updateEnrolleeAvatar';
// Imports resourceUrl to reference external resources for proper rendering and functionality.
import ADULT_AFRO_MAN from '@salesforce/resourceUrl/BI_PSPB_AdultAfroMan';
import ADULT_AFRO_WOMAN from '@salesforce/resourceUrl/BI_PSPB_AdultAfroWomen';
import ADULT_ARAB_MAN from '@salesforce/resourceUrl/BI_PSPB_AdultArabMan';
import ADULT_ARAB_WOMAN from '@salesforce/resourceUrl/BI_PSPB_AdultArabWoman';
import ADULT_ASIAN_MAN from '@salesforce/resourceUrl/BI_PSPB_AdultAsianMan';
import ADULT_ASIAN_WOMAN from '@salesforce/resourceUrl/BI_PSPB_AdultAsianWoman';
import ADULT_CAUCASIAN_MAN from '@salesforce/resourceUrl/BI_PSPB_AdultCaucasianMan';
import ADULT_CAUCASIAN_WOMAN from '@salesforce/resourceUrl/BI_PSPB_AdultCaucasianWoman';
import ADULT_INDIAN_MAN from '@salesforce/resourceUrl/BI_PSPB_AdultIndianMen';
import ADULT_INDIAN_WOMAN from '@salesforce/resourceUrl/BI_PSPB_AdultIndianWoman';
import ADULT_LATINO_MAN from '@salesforce/resourceUrl/BI_PSPB_AdultLatinoMan';
import ADULT_LATINO_WOMAN from '@salesforce/resourceUrl/BI_PSPB_AdultLatinoWoman';
import ELDER_ADULT_AFRO_MAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultAfroMan';
import ELDER_ADULT_AFRO_WOMAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultAfroWoman';
import ELDER_ADULT_ARAB_MAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultArabMan';
import ELDER_ADULT_ARAB_WOMAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultArabWoman';
import ELDER_ADULT_ASIAN_MAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultAsianMan';
import ELDER_ADULT_ASIAN_WOMAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultAsianWoman';
import ELDER_ADULT_CAUCASIAN_MAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultCaucasianMan';
import ELDER_ADULT_CAUCASIAN_WOMAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultCaucasianWoman';
import ELDER_ADULT_INDIAN_MEN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultIndianMen';
import ELDER_ADULT_INDIAN_WOMAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultIndianWoman';
import ELDER_ADULT_LATINO_MAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultLatinoMan';
import ELDER_ADULT_LATINO_WOMAN from '@salesforce/resourceUrl/BI_PSPB_ElderAdultLatinoWoman';
// Imports labels for descriptive text or identifiers, enhancing accessibility and user understanding.
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireUrl';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import UNASSIGNED from '@salesforce/label/c.BI_PSP_Unassigned';
import ACUTE from '@salesforce/label/c.BI_PSPB_Acute';
import ACUTE_DASHBOARD from '@salesforce/label/c.BI_PSPB_AcuteDashboard';
import DASHBOARD from '@salesforce/label/c.BI_PSPB_Dashboad';

export default class BiPspbFirsttimeAvatarSelection extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	avatarImg;
	avatarImage;
	isLoading = true;
	showSpinner = false;
	loginValue;
	loggedPatient;
	@track imageClass = [
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_AFRO_MAN, dataid: 1 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_AFRO_WOMAN, dataid: 2 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_ARAB_MAN, dataid: 3 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_ARAB_WOMAN, dataid: 4 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_ASIAN_MAN, dataid: 5 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_ASIAN_WOMAN, dataid: 6 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_CAUCASIAN_MAN, dataid: 7 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_CAUCASIAN_WOMAN, dataid: 8 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_INDIAN_MAN, dataid: 9 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_INDIAN_WOMAN, dataid: 10 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_LATINO_MAN, dataid: 11 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ADULT_LATINO_WOMAN, dataid: 12 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_AFRO_MAN, dataid: 13 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_AFRO_WOMAN, dataid: 14 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_ARAB_MAN, dataid: 15 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_ARAB_WOMAN, dataid: 16 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_ASIAN_MAN, dataid: 17 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_ASIAN_WOMAN, dataid: 18 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_CAUCASIAN_MAN, dataid: 19 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_CAUCASIAN_WOMAN, dataid: 20 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_INDIAN_MEN, dataid: 21 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_INDIAN_WOMAN, dataid: 22 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_LATINO_MAN, dataid: 23 },
		{ avatarclass: 'avatar', avatarname: 'avatarName', image: ELDER_ADULT_LATINO_WOMAN, dataid: 24 },

	]
	
	results;
	status;
	userAccounts;
	AccountIds;
	//To fetch the data from user tatble 
	@wire(LOGGED_USER)
	wiredLoggedUser({ error, data }) {
		
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.loggedUserData = data;
				if (this.loggedUserData && this.loggedUserData[0]?.BI_PSPB_Caregiver__c === true) {
					this.loggedPatient = false;
				}
				if (this.loggedUserData && this.loggedUserData[0]?.BI_PSPB_Caregiver__c === false) {
					this.loggedPatient = true;
				}
			} else if (error) {

				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			}
			const DEFAULT_SELECTED_AVATAR = this.imageClass.find(avatar => {
				// Assuming this.avatarImg is a JSON string representing an object
				const parsedAvatarImg = 1;
				return avatar.dataid === parsedAvatarImg;
			});
			// If found, set it as selected
			if (DEFAULT_SELECTED_AVATAR) {
				DEFAULT_SELECTED_AVATAR.avatarclass = 'selected';//class
				this.avatarImage = DEFAULT_SELECTED_AVATAR.image;
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	handleavatare(event) {
		
		this.avatarImg = event.target.getAttribute('data-id')
		for (let i = 0; i < this.imageClass.length; i++) {
			this.imageClass[i].avatarclass = 'avatar';
			
		}
		const CLICKED_AVATAR = this.imageClass.find(avatar => {
				// Assuming this.avatarImg is a JSON string representing an object
				const parsedAvatarImg = JSON.parse(this.avatarImg);
				return avatar.dataid === parsedAvatarImg;
			});
		if (CLICKED_AVATAR) {
			CLICKED_AVATAR.avatarclass = 'selected';//class
			this.avatarImage = CLICKED_AVATAR.image

		}
	}



	
	//To save the selected avatar url to patient in account object
	handleSave() {
		if (!this.avatarImage) {
			return;
		}
		
		this.showSpinner = true;
		if (this?.avatarImage && this.userAccounts.length > 0) { // Use length property to check if there are user contacts
		
			const ENROLEE_ID = this.userAccounts[0].Id; // Access the Id from the userContacts array
			const NEW_AVATAR_SRC = this.avatarImage; // Corrected variable name
			AVATAR({ enrolleeId: ENROLEE_ID, avatarSrc: NEW_AVATAR_SRC }) // Use newAvatarSrc
			// Null data is checked and AuraHandledException is thrown from the Apex
				// Use newAvatarSrc
				.then(result => {
					try {

							window.location.assign(BRANDED_SITE_URL + QUESTIONNAIRES);
							this.results = result;

						}
						catch (err) {
							this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
						}


					})
					.catch(error => {
						// Handle error or show an error message
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
					});
		
		}
		//To save the selected avatar url to patient in account object
		
	}

	 connectedCallback() {
        const globalThis = window;
        this.currentPageUrl = globalThis.location?.href;
        this.urlSegments = this.currentPageUrl.split('/');
        this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
    }

    @wire(CURRENT_USER)
    wiredCurrentUser({ error, data }) {
        if (data) {
			this.userAccounts = data;
			
            this.handleCurrentUserResult(data);
        } else if (error) {
            this.showToast('Error', error.body.message, 'error');
        }
    }

    handleCurrentUserResult(data) {
        if (data) {
			
            this.status = data[0].BI_PSPB_PatientStatus__c;
            this.isLoading = true;

            if (data[0].BI_PSP_Loginattempt__c === 0) {
                this.isLoading = false;
            } else if (data[0].BI_PSP_Loginattempt__c === 1) {
                this.isLoading = true;
                
                this.navigateBasedOnStatus(this.status);
            }
            this.isLoading = false;
        }
    }

    navigateBasedOnStatus(status) {
        const globalThis = window;

        try {
            switch (status) {
                case 'UNASSIGNED':
                    globalThis.location?.assign(this.baseUrl + '/unassigned');
                    break;
                case 'ACUTE':
                    globalThis.location?.assign(this.baseUrl + '/acute_dashboard');
                    break;
                default:
                    globalThis.location?.assign(this.baseUrl + '/dashboard');
                    break;
            }
        } catch (error) {
            this.showToast('Error', error.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }


	
	
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