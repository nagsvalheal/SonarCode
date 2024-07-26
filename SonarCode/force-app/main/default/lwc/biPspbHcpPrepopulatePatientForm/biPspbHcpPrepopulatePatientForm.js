// This LWC is used for prepopulating hcp patient information.
//To import Libraries
import { LightningElement, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import { loadStyle } from "lightning/platformResourceLoader";
//To import Apex Classes
import CREATE_LEAD_RECORD from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.updateLeadRecord";
import LEAD_ID from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.getPatientDetails";
import COUNTRY from '@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getCountries';
import STATE from '@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getStates';
//To import Static Resource
import OLD_GUY_JPEG_URL from "@salesforce/resourceUrl/BI_PSPB_PatientEntrollAvatar";
import BG_LOGO from "@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo";
import WARNING_ICON from "@salesforce/resourceUrl/BI_PSP_WarningIcon";
import TEXT_ALIGN from "@salesforce/resourceUrl/BI_PSPB_TextAlignmentHcp";
//To import fields from Lead object
//To import Custom Labels
import PINCODE from "@salesforce/label/c.BI_PSPB_PatientZipCodeErrMsg";
import MINORAGE from "@salesforce/label/c.BI_PSPB_MInorAge";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import FEMALE from "@salesforce/label/c.BI_PSP_RbFemale";
import MALE from "@salesforce/label/c.BI_PSP_RbMale";
import OTHER from "@salesforce/label/c.BI_PSP_RbOther";
import PHONE from "@salesforce/label/c.BI_PSPB_Phone";
import SMS from "@salesforce/label/c.BI_PSP_SmsLabel";
import EMAIL from "@salesforce/label/c.BI_PSP_NotificationEmail";
import PREFER from "@salesforce/label/c.BI_PSP_RbNotToSay";
import THANKFROMURL from "@salesforce/label/c.BI_PSPB_PreThankFormUrl";
import DOBERROR from "@salesforce/label/c.BI_PSPB_PatientFutureDateErrMsg";
import HCPENROLLMSG from "@salesforce/label/c.BI_PSPB_HcpMinorEnrollMsg";

export default class BiPspbHcpPrepopulatePatientForm extends NavigationMixin(
	LightningElement
) {
	// Declaration of variables with   
	avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
						We're excited to help you manage your generalized pustular psoriasis
						(GPP) and make the most of your Spevigo® therapy.`;
	avatarContentMid = `Please continue by verifying your information. Click 'next' to
						proceed if the pre-filled information is correct.`;
	avatarContentLast = `If not, please correct the information and then click 'next'.`;
	phoneInVisible = false;
	fieldBox = false;
	phoneVisible = true;
	variable = false;
	clickMethod = true;
	mobileValueTwo = `Hello! Welcome to the Spevigo® patient ....`;
	sldsProgree = false;
	phone = "";
	isLoaded = false;
	pmc = "";
	country = "";
	state = "";
	city = "";
	street = "";
	zipCode = "";
	phoneRequire = false;
	isButtonDisabled = false;
	pmcRequire = false;
	countryRequire = false;
	stateRequire = false;
	cityRequire = false;
	streetRequire = false;
	zipCodeRequire = false;
	leadId;
	leadFirstName;
	leadLastName;
	leadDob;
	selectedValue = "";
	leadEmail;
	lastName = "";
	firstName = "";
	dob = "";
	firstNameRequire = false;
	lastNameChangeRequire = false;
	dateOfBirthRequire = false;
	genderChangeRequire = false;
	cityRequireOne = false;
	conZipCodeErrorMessage = false;
	dobErrorMessage = false;
	normalHeading = true;
	normalHeadingOne = false;
	firstNameValid = false;
	lastNameChangeValid = false;
	dateOfBirthVaild = false;
	currentStep;
	selectedCountryCode = "";
	selectedStateCode = "";
	CountryCode = [];
	StateCode = [];
	gender = "";
	authorizeErrorMessage = false;
	consentFields = {};
	checkBoxName = false;
	checkBox;
	@track leadGender = [
		{ label: MALE, value: MALE },
		{ label: FEMALE, value: FEMALE },
		{ label: PREFER, value: PREFER },
		{ label: OTHER, value: OTHER }
	];
	@track leadPmc = [
		{ label: SMS, value: SMS },
		{ label: PHONE, value: PHONE },
		{ label: EMAIL, value: EMAIL }
	];
	openModal = false;
	// Declaration of Global variables
	label = { PINCODE };
	selectedAvatarSrc = OLD_GUY_JPEG_URL;
	bgLogo = BG_LOGO;
	warningIcons = WARNING_ICON;
	selectedGender = "";
	selectedCountry;

	//to store values of firstname, lastname, email, checkBox
	handleInputChange(event) {
		const FIELDNAME = event.target.name;
		const FIELDVAL = event.target.value;
		this.selectedGender = event.detail.value;
		this.leadFields[FIELDNAME] = FIELDVAL;
	}

	//to get style format
	connectedCallback() {
		loadStyle(this, TEXT_ALIGN);
	}
	validateFirstNamePattern() {
		return !/^[a-zA-ZÀ-ž\s\-''`.]+$/u;
	}
	//to validate firstname
	handleFirstNameChange(event) {
		this.firstName = event.target.value;
		this.firstName =
			//event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		//to get data field value from html
		const FIRSTNAMEFIELD = this.template.querySelector(
			'lightning-input[data-field="FN"]'
		);
		if (this.validateFirstNamePattern().test(this.firstName)) {
				this.firstNameValid = true;
				this.firstNameRequire = false;
				FIRSTNAMEFIELD.className = "textInput-err"; //css classes for UI
				this.template.querySelector('label[data-field="FN"]').className =
					"input-error-label";
			} else {
				this.firstNameValid = false;
				this.firstNameRequire = false;
				FIRSTNAMEFIELD.className = "textInput";
				this.template.querySelector('label[data-field="FN"]').className =
					"input-label";
			}
		
	}

	//to validate lastname
	handleLastNameChange(event) {
		this.lastName = event.target.value;

		this.lastName =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);

		const LASTNAMEFIELD = this.template.querySelector(
			'lightning-input[data-field="LN"]'
		);
		if (this.validateFirstNamePattern().test(this.lastName)) {
				this.lastNameChangeValid = true;
				this.lastNameChangeRequire = false;
				LASTNAMEFIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="LN"]').className =
					"input-error-label";
			} else {
				this.lastNameChangeValid = false;
				this.lastNameChangeRequire = false;
				LASTNAMEFIELD.className = "textInput";
				this.template.querySelector('label[data-field="LN"]').className =
					"input-label";
			
		}
	}

	//to validate dateofbirth
	handleDobChange(event) {
		const DOBFIELD = this.template.querySelector(
			'lightning-input[data-field="dob"]'
		);
		this.dob = event.target.value;
		this.validateDate();
		if (this.dob) {
			this.normalHeadingOne = false;
			this.dateOfBirthVaild = false;
			this.dateOfBirthRequire = false;
			DOBFIELD.className = "textInput";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error";
		}
	}
	handlePhoneChangeEmpty(event) {
		this.phone = event.target.value;
		this.phoneRequire = false;
		const PHONEFIELD = this.template.querySelector(
			'lightning-input[data-field="PhoneNumber"]'
		);
		if (this.phoneNumber === "") {
			this.phoneRequire = false;
			this.PhoneerrorMessagevalid = false;
			PHONEFIELD.className = "textInput";
			this.template.querySelector('label[data-field="phone"]').className =
				"input-label";
		}
	}
	//to validate phone
	handlePhoneChange(event) {
		this.phone = event.target.value;
		this.phoneRequire = false;
		const PHONEFIELD = this.template.querySelector(
			'lightning-input[data-field="PhoneNumber"]'
		);
		if (!/^\+?[0-9]+$/u.test(this.phone)) {
			this.phoneRequire = false;
			this.PhoneerrorMessagevalid = true;
			PHONEFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="PhoneNumber"]').className =
				"input-error-label";
		} else if (this.phone === "") {
				this.phoneRequire = true;
				this.PhoneerrorMessagevalid = false;
				PHONEFIELD.className = "textInput-err";
				this.template.querySelector(
					'label[data-field="PhoneNumber"]'
				).className = "input-error-label";
			} else {
				this.PhoneerrorMessagevalid = false;
			this.phoneRequire = false;
				PHONEFIELD.className = "textInput";
				this.template.querySelector(
					'label[data-field="PhoneNumber"]'
				).className = "input-label";
			}
		
	}

	//to validate Preferred method of communication
	handlePmcChange(event) {
		const MOCFIELD = this.template.querySelector(
			'lightning-combobox[data-field="Pmc"]'
		);
		this.pmc = event.target.value;
		if (this.pmc === SMS || this.pmc === PHONE) {
			this.phoneInVisible = true;
			this.phoneVisible = false;
			this.phoneRequire = false;
			this.pmcRequire = false;
			MOCFIELD.className = "textInput";
			this.template.querySelector('label[data-field="Pmc"]').className =
				"input-label";
		}
		else if (this.pmc === "") {
			this.pmcRequire = true;
			MOCFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="Pmc"]').className =
				"input-error-label";
		}
		else {
			this.pmcRequire = false;
			MOCFIELD.className = "textInput";
			this.template.querySelector('label[data-field="Pmc"]').className =
				"input-label";
			this.phoneInVisible = false;
			this.phoneVisible = true;
		}
	}

	//to validate country
	handleCountryChange(event) {
		this.country = event.target.value;
		STATE({ selectedCountry: this.country })
			.then(result => {
				this.StateCode = result.map(state => ({ label: state.Name, value: state.BI_PSPB_StateCode__c }));
			})
			.catch(error => {
				this.showToast(error);
			});
		this.country = event.target.value;
		const COUNTRYFIELD = this.template.querySelector(
			'lightning-combobox[data-field="Country"]'
		);
		if (this.country === "") {
			this.countryRequire = true;
			COUNTRYFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="Country"]').className =
				"input-error-label";
		} else {
			this.countryRequire = false;
			COUNTRYFIELD.className = "textInput";
			this.template.querySelector('label[data-field="Country"]').className =
				"input-label";
		}
	}

	//to validate state
	handleStateChange(event) {
		this.state = event.target.value;
		const STATEFIELD = this.template.querySelector(
			'lightning-combobox[data-field="State"]'
		);
		if (this.state === "") {
			this.stateRequire = true;
			STATEFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="State"]').className =
				"input-error-label";
		} else {
			this.stateRequire = false;
			STATEFIELD.className = "textInput";
			this.template.querySelector('label[data-field="State"]').className =
				"input-label";
		}
	}

	//to validate city
	handleCityChange(event) {
		this.city = event.target.value;
		this.city =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const CITYFIELD = this.template.querySelector(
			'lightning-input[data-field="City"]'
		);
		if (this.city === "") {
			this.cityRequireOne = false;
			this.cityRequire = true;
			CITYFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="City"]').className =
				"input-error-label";
		} else if (this.validateFirstNamePattern().test(this.city)) {
				this.cityRequire = false;
				this.cityRequireOne = true;
				CITYFIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="City"]').className =
					"input-error-label";
			}
			else {
				this.cityRequire = false;
				this.cityRequireOne = false;
				CITYFIELD.className = "textInput";
				this.template.querySelector('label[data-field="City"]').className =
					"input-label";
			
		}
	}
	//to validate street
	handleStreetChange(event) {
		this.street = event.target.value;
		this.street =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const STREETFIELD = this.template.querySelector(
			'lightning-textarea[data-field="Street"]'
		);
		if (this.street === "") {
			this.streetRequire = true;
			STREETFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="Street"]').className =
				"input-error-label";
		} else {
			this.streetRequire = false;
			STREETFIELD.className = "textInput";
			this.template.querySelector('label[data-field="Street"]').className =
				"input-label";
		}
	}
	//to validate zipcode
	handleZipCodeChange(event) {
		this.zipCode = event.target.value;
		this.zipCode =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const ZIPCODE = this.template.querySelector(
			'lightning-input[data-field="ZipCode"]'
		);
		if (!/^[a-zA-Z0-9]+$/u.test(this.zipCode)) {
			this.conZipCodeErrorMessage = false;
			this.zipCodeRequire = true;
			ZIPCODE.className = "textInput-err";
			this.template.querySelector('label[data-field="ZipCode"]').className =
				"input-error-label";
		} else if (this.zipCode === "") {
				this.conZipCodeErrorMessage = true;
				this.zipCodeRequire = false;
				ZIPCODE.className = "textInput-err";
				this.template.querySelector('label[data-field="ZipCode"]').className =
					"input-error-label";
			} else {
				this.conZipCodeErrorMessage = false;
				this.zipCodeRequire = false;
				ZIPCODE.className = "textInput";
				this.template.querySelector('label[data-field="ZipCode"]').className =
					"input-label";
			}
		
	}

	//to validate all details filled while submitting
	contactvalidform() {
        let isValid = true;

        isValid = this.validatePhone() && isValid;
        isValid = this.validatePmc() && isValid;
        isValid = this.validateCountry() && isValid;
        isValid = this.validateState() && isValid;
        isValid = this.validateCity() && isValid;
        isValid = this.validateStreet() && isValid;
        isValid = this.validateZipCode() && isValid;
        isValid = this.validateCheckBox() && isValid;

        return isValid;
    }

    validatePhone() {
        const PHONEFIELD = this.template.querySelector('lightning-input[data-field="PhoneNumber"]');
        if (this.phoneInVisible === true) {
            if (this.phone === "") {
                this.phoneRequire = true;
                this.PhoneerrorMessagevalid = false;
                PHONEFIELD.className = "textInput-err";
                this.template.querySelector('label[data-field="PhoneNumber"]').className = "input-error-label";
                return false;
            } else if (!/^\+?[0-9]+$/u.test(this.phone)) {
                this.phoneRequire = false;
                this.PhoneerrorMessagevalid = true;
                PHONEFIELD.className = "textInput-err";
                this.template.querySelector('label[data-field="PhoneNumber"]').className = "input-error-label";
                return false;
            } 
                this.phoneRequire = false;
                this.PhoneerrorMessagevalid = false;
                PHONEFIELD.className = "textInput";
                this.template.querySelector('label[data-field="PhoneNumber"]').className = "input-label";
                return true;
            
        }
		return true;
    }

    validatePmc() {
        const MOCFIELD = this.template.querySelector('lightning-combobox[data-field="Pmc"]');
        if (this.pmc === "") {
            this.pmcRequire = true;
            MOCFIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="Pmc"]').className = "input-error-label";
            return false;
        } 
            this.pmcRequire = false;
            MOCFIELD.className = "textInput";
            this.template.querySelector('label[data-field="Pmc"]').className = "input-label";
            return true;
        
    }

    validateCountry() {
        const COUNTRYFIELD = this.template.querySelector('lightning-combobox[data-field="Country"]');
        if (this.country === "") {
            this.countryRequire = true;
            COUNTRYFIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="Country"]').className = "input-error-label";
            return false;
        } 
            this.countryRequire = false;
            COUNTRYFIELD.className = "textInput";
            this.template.querySelector('label[data-field="Country"]').className = "input-label";
            return true;
        
    }

    validateState() {
        const STATEFIELD = this.template.querySelector('lightning-combobox[data-field="State"]');
        if (this.state === "") {
            this.stateRequire = true;
            STATEFIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="State"]').className = "input-error-label";
            return false;
        } 
            this.stateRequire = false;
            STATEFIELD.className = "textInput";
            this.template.querySelector('label[data-field="State"]').className = "input-label";
            return true;
        
    }

    validateCity() {
        const CITYFIELD = this.template.querySelector('lightning-input[data-field="City"]');
        if (this.city === "") {
            this.cityRequire = true;
            this.cityRequireOne = false;
            CITYFIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="City"]').className = "input-error-label";
            return false;
        } else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.city)) {
            this.cityRequire = false;
            this.cityRequireOne = true;
            CITYFIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="City"]').className = "input-error-label";
            return false;
        } 
            this.cityRequire = false;
            this.cityRequireOne = false;
            CITYFIELD.className = "textInput";
            this.template.querySelector('label[data-field="City"]').className = "input-label";
            return true;
        
    }

    validateStreet() {
        const STREETFIELD = this.template.querySelector('lightning-textarea[data-field="Street"]');
        if (this.street === "") {
            this.streetRequire = true;
            STREETFIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="Street"]').className = "input-error-label";
            return false;
        } 
            this.streetRequire = false;
            STREETFIELD.className = "textInput";
            this.template.querySelector('label[data-field="Street"]').className = "input-label";
            return true;
        
    }

    validateZipCode() {
        const ZIPCODE = this.template.querySelector('lightning-input[data-field="ZipCode"]');
        if (this.zipCode === "") {
            this.zipCodeRequire = false;
            this.conZipCodeErrorMessage = true;
            ZIPCODE.className = "textInput-err";
            this.template.querySelector('label[data-field="ZipCode"]').className = "input-error-label";
            return false;
        } else if (!/^[a-zA-Z0-9]+$/u.test(this.zipCode)) {
            this.conZipCodeErrorMessage = false;
            this.zipCodeRequire = true;
            ZIPCODE.className = "textInput-err";
            this.template.querySelector('label[data-field="ZipCode"]').className = "input-error-label";
            return false;
        } 
            this.zipCodeRequire = false;
            this.conZipCodeErrorMessage = false;
            ZIPCODE.className = "textInput";
            this.template.querySelector('label[data-field="ZipCode"]').className = "input-label";
            return true;
        
    }

    validateCheckBox() {
        const checkBox = this.template.querySelector('span[data-field="checkbox"]');
        if (!this.checkBox) {
            this.checkBoxName = true;
            checkBox.className = "custom-checkbox-box_Error";
            return false;
        } 
            this.checkBoxName = false;
            checkBox.className = "custom-checkbox-box";
            return true;
        
    }

	//to update patient record
	handleCreateLead() {
		let globalThis = window;
		if (!this.contactvalidform()) {
			this.avatarContentTop = `Hello! Welcome to the Spevigo® patient support program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
			this.avatarContentMid = `Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. `;
			this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
			this.Xmark();
			return;
		}
		this.Xmark();

		if (
			this.phone !== "" &&
			this.pmc !== "" &&
			this.country !== "" &&
			this.state !== "" &&
			this.city !== "" &&
			this.street !== "" &&
			this.zipCode !== "" &&
			this.checkBox
		) {
			this.isButtonDisabled = true;
			this.isLoaded = true;
			let leadWrapper = {
				leadId: this.leadId,
				phone: this.phone,
				prefferedMethodOfCom: this.pmc,
				country: this.country,
				state: this.state,
				city: this.city,
				street: this.street,
				zipCode: this.zipCode
			};
			try {
				CREATE_LEAD_RECORD({ leadWrapper: leadWrapper })
					.then(() => {

						globalThis?.localStorage.setItem("recordId", this.leadId);

						try {
							globalThis.location.assign(THANKFROMURL);
						} catch (error) {
							this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); 
						}
							
						
					})
					.catch((error) => {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
					});
			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
			}
		}
		else if (!this.PHONEFIELD && this.pmc !== SMS && this.pmc !== PHONE && this.pmc) {
			this.isButtonDisabled = true;
			this.isLoaded = true;
			let leadWrapper = {
				leadId: this.leadId,
				phone: this.phone,
				prefferedMethodOfCom: this.pmc,
				country: this.country,
				state: this.state,
				city: this.city,
				street: this.street,
				zipCode: this.zipCode
			};
			try {
				CREATE_LEAD_RECORD({ leadWrapper: leadWrapper })
					.then(() => {

						globalThis?.localStorage.setItem("recordId", this.leadId);

						try {
							globalThis.location.assign(THANKFROMURL);
						} catch (error) {
							this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); 
						}
							
						
					})
					.catch((error) => {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
					});
			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
			}
		}
	}

	//to validate that date is not future date
	validateDate() {
		// Validate that the date is not in the future
		const CURRENTDATE = new Date();
		const SELECTEDDATE = new Date(this.dob);
		this.doberrorMessage = false;
		if (SELECTEDDATE > CURRENTDATE) {
			this.dobErrorMessage = DOBERROR;
			return;
		}

		// Validate that the user is not a minor (you can set a minimum age)
		const MINAGE = MINORAGE;
		const USERBIRTHYEAR = SELECTEDDATE.getFullYear();
		const CURRENTYEAR = CURRENTDATE.getFullYear();

		if (CURRENTYEAR - USERBIRTHYEAR < MINAGE) {
			//   this.dobErrorMessage = false;
			this.dobErrorMessage = HCPENROLLMSG;
			return;
		}

		// If both validations pass, clear the error message
		this.dobErrorMessage = false;
	}

	//to go back to previous page - 1
	goBackToStepOne() {
		this.normalHeadingOne = false;
		this.currentStep = "1";
		this.template.querySelector("div.stepTwo").classList.add("slds-hide");
		this.template.querySelector("div.stepOne").classList.remove("slds-hide");
		// Progress indicator
		this.template.querySelector("div.slds-progress").classList.add("slds-hide");
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
		We're excited to help you manage your generalized pustular psoriasis
		(GPP) and make the most of your Spevigo® therapy.`;
		this.avatarContentMid = `Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. `;
		this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
		this.Xmark();
	}

	//to go back to previous page - 2
	goBackToStepTwo() {
		this.currentStep = "2";
		this.template.querySelector("div.stepThree").classList.add("slds-hide");
		this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
		// Progress indicator
		this.template.querySelector("li.li-two").classList.remove("slds-is-active");
		this.template
			.querySelector("li.li-one")
			.classList.remove("slds-is-completed");
		this.template.querySelector("li.li-one").classList.add("slds-is-active");
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
						We're excited to help you manage your generalized pustular psoriasis
						(GPP) and make the most of your Spevigo® therapy.`;
		this.avatarContentMid = `Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. `;
		this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
		this.Xmark();
	}
	//to go back to previous page - 3
	goBackToStepThree() {
		this.currentStep = "3";
		this.template.querySelector("div.stepFour").classList.add("slds-hide");
		this.template.querySelector("div.stepThree").classList.remove("slds-hide");
		// Progress indicator
		this.template
			.querySelector("li.li-four")
			.classList.remove("slds-is-active");
		this.template
			.querySelector("li.li-three")
			.classList.remove("slds-is-completed");
		this.template.querySelector("li.li-three").classList.add("slds-is-active");
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
		We're excited to help you manage your generalized pustular psoriasis
		(GPP) and make the most of your Spevigo® therapy.`;
		this.avatarContentMid = `Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. `;
		this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
		this.Xmark();
	}
	//to go back to previous page - 4
	goBackToStepFour() {
		this.currentStep = "4";
		this.template.querySelector("div.stepFive").classList.add("slds-hide");
		this.template.querySelector("div.stepFour").classList.remove("slds-hide");
	}
	toggleClass(element, className, add) {
        if (element) {
            if (add) {
                element.classList.add(className);
            } else {
                element.classList.remove(className);
            }
        }
    }
	//to go to next page
	goToStepTwo() {
		const FIRSTNAMEFIELD = this.template.querySelector(
			'lightning-input[data-field="FN"]'
		);
		const LASTNAMEFIELD = this.template.querySelector(
			'lightning-input[data-field="LN"]'
		);
		const DOBFIELD = this.template.querySelector(
			'lightning-input[data-field="dob"]'
		);
		if (this.dobErrorMessage) {
			return;
		}
		if (this.firstName !== "" && this.lastName !== "" && this.dob !== "") {
			try {
				LEAD_ID({
					firstName: this.firstName,
					lastName: this.lastName,
					dateOfBirth: this.dob
				})
					.then((result) => {
						this.leadId = result.Id;
						this.leadFirstName = result.FirstName;
						this.leadLastName = result.LastName;
						this.leadDob = result.HealthCloudGA__BirthDate__c;
						this.selectedValue = result.HealthCloudGA__Gender__c;
						this.leadEmail = result.Email;
						this.phone = result.Phone;
						if (this.leadId !== "") {
							this.sldsProgree = true;
							this.currentStep = "2";
							
							this.toggleClass(this.template.querySelector("div.stepOne"), "slds-hide", true);
							this.toggleClass(this.template.querySelector("div.stepTwo"), "slds-hide", false);
							this.toggleClass(this.template.querySelector("div.slds-progress"), "slds-hide", false);
						
							this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
							this.avatarContentMid = `Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. `;
							this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
							this.Xmark();
							this.mobileValueTwo = `Hello! Welcome to Beyond GPP: The Spevigo® Patient....`;
						}
					})
					.catch(() => {
						// this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex

						this.normalHeading = false;

						this.normalHeadingOne = true;

						this.firstNameValid = true;
						this.firstNameRequire = false;
						FIRSTNAMEFIELD.value = "";
						FIRSTNAMEFIELD.className = "textInput-err";
						this.template.querySelector('label[data-field="FN"]').className =
							"input-error-label";
						this.firstname = "";

						this.lastNameChangeValid = true;
						this.lastNameChangeRequire = false;
						LASTNAMEFIELD.value = "";
						LASTNAMEFIELD.className = "textInput-err";
						this.template.querySelector('label[data-field="LN"]').className =
							"input-error-label";
						this.lastName = "";

						this.dateOfBirthVaild = true;
						DOBFIELD.value = "";
						this.dateOfBirthRequire = false;
						DOBFIELD.className = "textInput-err";
						this.template.querySelector('label[data-field="dob"]').className =
							"input-error-label";
						this.dob = "";
						//innerhtml is used to achieve mobile responsiveness
						this.avatarContentTop = `Hello! Welcome to the Spevigo® patient support program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
						this.avatarContentMid = `Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. `;
						this.avatarContentLast = `If not, please correct the information and then click 'next'.`;

						this.Xmark();
						this.mobileValueTwo = `Hello! Welcome to Beyond GPP: The Spevigo® Patient....`;
					});
			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} else {
			

			if (FIRSTNAMEFIELD.value === "") {
				this.normalHeadingOne = true;
				this.normalHeading = false;
				this.firstNameRequire = true;
				this.firstNameValid = false;
				FIRSTNAMEFIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="FN"]').className =
					"input-error-label";
			}
			if (this.lastName === "") {
				this.normalHeadingOne = true;
				this.normalHeading = false;
				this.lastNameChangeValid = false;

				this.lastNameChangeRequire = true;
				LASTNAMEFIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="LN"]').className =
					"input-error-label";
			}

			if (this.dob === "") {
				this.normalHeadingOne = true;
				this.normalHeading = false;
				this.dateOfBirthVaild = false;
				this.dateOfBirthRequire = true;
				DOBFIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="dob"]').className =
					"input-error-label";
			}
			//innerhtml is used to achieve mobile responsiveness
			this.avatarContentTop = `Hello! Welcome to the Spevigo® patient support program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
			this.avatarContentMid = `Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. `;
			this.avatarContentLast = `If not, please correct the information and then click 'next'.`;

			this.Xmark();
			this.mobileValueTwo = `Hello! Welcome to Beyond GPP: The Spevigo® Patient....`;
		}
	}
	handleKeyDownThree(event) {
		event.preventDefault();
	}

	//assign the selected gender
	handleGenderChange(event) {
		this.selectedValue = event.target.value;
		this.genderChangeRequire = false;
	}

	//to go to next page
	goToStepThree() {
		const LASTNAMEFIELD = this.template.querySelector(
			'lightning-combobox[data-field="GN"]'
		);
		this.Xmark();
		if (this.selectedValue !== "") {
			this.currentStep = "3";
			this.template.querySelector("div.stepTwo").classList.add("slds-hide");
			this.template
				.querySelector("div.stepThree")
				.classList.remove("slds-hide");
			// Progress indicator
			this.template
				.querySelector("li.li-one")
				.classList.remove("slds-is-active");
			this.template
				.querySelector("li.li-one")
				.classList.add("slds-is-completed");
			this.template.querySelector("li.li-two").classList.add("slds-is-active");
		} else {
			if (this.selectedValue === "") {
				this.genderChangeRequire = true;
				this.template.querySelector('label[data-field="GN"]').className =
					"input-error-label";
				LASTNAMEFIELD.className = "textInput-err";
			}
			//innerhtml is used to achieve mobile responsiveness
			this.avatarContentTop = `Hello! Welcome to the Spevigo® patient support program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
			this.avatarContentMid = `Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. `;
			this.avatarContentLast = `If not, please correct the information and then click 'next'.`;

			this.Xmark();
			this.mobileValueTwo = `Hello! Welcome to Beyond GPP: The Spevigo® Patient....`;
		}
	}

	//to get dependent records from Lead
	@wire(getObjectInfo, { objectApiName: "Lead" })
	objectInfo;


	@wire(COUNTRY)
	wiredCountries({ error, data }) {

		if (data) {
			this.CountryCode = data.map(country => ({ label: country.label, value: country.value }));
		} else if (error) {
			this.showToast(error);
		}
	}
	// Reset selected state when country changes
	handleCountryCodeChange(event) {
		this.selectedCountryCode = event.detail.value;
		this.selectedStateCode = "";
	}

	//to make checkBox mandatory
	authorize() {
		let isValid = true;

		// authorize
		if (!this.consentFields.authorize) {
			this.authorizeErrorMessage = true;
			isValid = false;
		} else {
			this.authorizeErrorMessage = false;
		}
		return isValid;
	}

	//to check whether the checkBox is checked
	handleInputChange3(event) {
		this.checkBox = event.target.checked;
		const checkBox = this.template.querySelector('span[data-field="checkbox"]');
		if (this.checkBox === "") {
			this.checkBoxName = true;
			checkBox.className = "custom-checkbox-box_Error";
		} else {
			this.checkBoxName = false;
			checkBox.className = "custom-checkbox-box";
		}
	}

	//to show toast message
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

	//to get dependent lead record based on firstname, lastname and dob
	leadrecordget() {
		LEAD_ID({
			firstName: this.firstName,
			lastName: this.lastName,
			dob: this.dob
		})
			.then((result) => {
				this.leadId = result.Id;
				this.leadFirstName = result.FirstName;
				this.leadLastName = result.LastName;
				this.leadDob = result.HealthCloudGA__BirthDate__c;
				this.selectedValue = result.HealthCloudGA__Gender__c;
				this.leadEmail = result.Email;
				this.phone = result.Phone;
			})
			.catch((error) => {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
			});
	}

	//to display terms and condition popup
	showModal() {
		this.openModal = true;
		this.template.querySelector("div.formContainer");
	}
	//to close terms and condition popup
	closeModal() {
		this.openModal = false;
		this.template.querySelector("div.formContainer");
	}

	//to validate phone
	handleKeyDown(event) {
		const CHARCODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
		if (CHARCODE !== 43 && (CHARCODE < 48 || CHARCODE > 57)) {
			// Allow only digits (48-57) and the plus symbol (43)
			event.preventDefault(); // Prevent the character from being entered
		}
	}

	//to get avatar content
	click() {

		this.mobileValueTwo = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.
Please continue by verifying your information. Click 'next' to proceed if the pre-filled information is correct. 
 If not, please correct the information and then click 'next'.`;
		this.clickMethod = false;
		this.fieldBox = true;
	}
	//to get avatar content in mobile view
	Xmark() {
		this.mobileValueTwo = `Hello! Welcome to Beyond GPP: The Spevigo® Patient....`;
		this.clickMethod = true;
		this.fieldBox = false;
	}
}