// This LWC is used for prepopulating hcp patient information.
//To import Libraries
import { LightningElement, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import { loadStyle } from "lightning/platformResourceLoader";
//To import Apex Classes
import CREATE_LEAD_RECORD from "@salesforce/apex/BI_PSPB_PrepopulateRecCtrl.updateLeadRecord";
import LEAD_ID from "@salesforce/apex/BI_PSPB_PrepopulateRecCtrl.getPatientDetails";
import COUNTRY from '@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getCountries';
import STATE from '@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getStates';

//To import fields from Lead object
//To import Custom Labels
import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbHcpPrepopulatePatientForm extends NavigationMixin(
	LightningElement
) {
	// Declaration of variables with   
	avatarContentTop = resource.PRE_AVATAR_MSG_ONE;
	avatarContentMid = resource.PRE_AVATAR_MSG_THREE;
	avatarContentLast = resource.PRE_AVATAR_MSG_FOUR;
	phoneInVisible = false;
	fieldBox = false;
	phoneVisible = true;
	variable = false;
	clickMethod = true;
	mobileValueTwo = resource.PRE_AVATAR_MSG_FIVE;
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
		{ label: resource.MALE, value: resource.MALE },
		{ label: resource.FEMALE, value: resource.FEMALE },
		{ label: resource.PREFER, value: resource.PREFER },
		{ label: resource.OTHER, value: resource.OTHER }
	];
	@track leadPmc = [
		{ label: resource.SMS, value: resource.SMS },
		{ label: resource.PHONE, value: resource.PHONE },
		{ label: resource.EMAIL, value: resource.EMAIL }
	];
	openModal = false;
	// Declaration of Global variables
	selectedAvatarSrc = resource.OLD_GUY_JPEG_URL;
	bgLogo = resource.BGPP;
	warningIcons = resource.WARNING_ICON;
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
		loadStyle(this, resource.TEXT_ALIGN);
	}
	validateFirstNamePattern() {
		return /^[a-zA-ZÀ-ž\s\-''`.]+$/u;
	}
	//to validate firstname
	FirstNameFieldErr(){
		const FIRSTNAMEFIELD = this.template.querySelector(
			'lightning-input[data-field="FN"]'
		);
		FIRSTNAMEFIELD.className = "textInput-err"; //css classes for UI
				this.template.querySelector('label[data-field="FN"]').className =
					"input-error-label";
	}
	FirstNameField(){
		const FIRSTNAMEFIELD = this.template.querySelector(
			'lightning-input[data-field="FN"]'
		);
		FIRSTNAMEFIELD.className = "textInput"; //css classes for UI
				this.template.querySelector('label[data-field="FN"]').className =
					"input-label";
	}
	handleFirstNameChange(event) {
		this.firstName = event.target.value;
		this.firstName =
			//event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		//to get data field value from html
		
		if (!this.validateFirstNamePattern().test(this.firstName)) {
				this.firstNameValid = true;
				this.firstNameRequire = false;
				this.FirstNameFieldErr();
			} else {
				this.firstNameValid = false;
				this.firstNameRequire = false;
				this.FirstNameField();
			}
		
	}
	LastNAmeFieldErr(){
		const LASTNAMEFIELD = this.template.querySelector(
			'lightning-input[data-field="LN"]'
		);
		LASTNAMEFIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="LN"]').className =
					"input-error-label";
	}
	LastNAmeField(){
		const LASTNAMEFIELD = this.template.querySelector(
			'lightning-input[data-field="LN"]'
		);
		LASTNAMEFIELD.className = "textInput";
				this.template.querySelector('label[data-field="LN"]').className =
					"input-label";
	}
	//to validate lastname
	handleLastNameChange(event) {
		this.lastName = event.target.value;

		this.lastName =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);

		if (!this.validateFirstNamePattern().test(this.lastName)) {
				this.lastNameChangeValid = true;
				this.lastNameChangeRequire = false;
				this.LastNAmeFieldErr();
			} else {
				this.lastNameChangeValid = false;
				this.lastNameChangeRequire = false;
				this.LastNAmeField();
			
		}
	}
	DateFieldErr(){
		const DOBFIELD = this.template.querySelector(
			'lightning-input[data-field="dob"]'
		);
		DOBFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error-label";
	}
	DateField(){
		const DOBFIELD = this.template.querySelector(
			'lightning-input[data-field="dob"]'
		);
		DOBFIELD.className = "textInput";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-label";
	}
	//to validate dateofbirth
	handleDobChange(event) {
		this.dob = event.target.value;
		this.validateDate();
		if (this.dob) {
			this.normalHeadingOne = false;
			this.dateOfBirthVaild = false;
			this.dateOfBirthRequire = false;
			this.DateField();
		}
	}
	PhoneFieldErr(){
		const PHONEFIELD = this.template.querySelector(
			'lightning-input[data-field="PhoneNumber"]'
		);
		PHONEFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="PhoneNumber"]').className =
				"input-error-label";
	}
	PhoneField(){
		const PHONEFIELD = this.template.querySelector(
			'lightning-input[data-field="PhoneNumber"]'
		);
		PHONEFIELD.className = "textInput";
			this.template.querySelector('label[data-field="PhoneNumber"]').className =
				"input-label";
	}
	handlePhoneChangeEmpty(event) {
		this.phone = event.target.value;
		this.phoneRequire = false;
		if (this.phoneNumber === "") {
			this.phoneRequire = false;
			this.PhoneerrorMessagevalid = false;
			this.PhoneField();
		}
	}
	PhoneRegex(){
		return /^\+?[0-9]+$/u;
	}
	//to validate phone
	handlePhoneChange(event) {
		this.phone = event.target.value;
		this.phoneRequire = false;
		if (!this.PhoneRegex().test(this.phone)) {
			this.phoneRequire = false;
			this.PhoneerrorMessagevalid = true;
			this.PhoneFieldErr();
		} else if (this.phone === "") {
				this.phoneRequire = true;
				this.PhoneerrorMessagevalid = false;
				this.PhoneFieldErr();
			} else {
				this.PhoneerrorMessagevalid = false;
			this.phoneRequire = false;
			this.PhoneField();
			}
		
	}
PmcFieldErr(){
	const MOCFIELD = this.template.querySelector(
		'lightning-combobox[data-field="Pmc"]'
	);
	MOCFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="Pmc"]').className =
				"input-error-label";
}
PmcField(){
	const MOCFIELD = this.template.querySelector(
		'lightning-combobox[data-field="Pmc"]'
	);
	MOCFIELD.className = "textInput";
			this.template.querySelector('label[data-field="Pmc"]').className =
				"input-label";
}

	//to validate Preferred method of communication
	handlePmcChange(event) {
		
		this.pmc = event.target.value;
		if (this.pmc === resource.SMS || this.pmc === resource.PHONE) {
			this.phoneInVisible = true;
			this.phoneVisible = false;
			this.phoneRequire = false;
			this.pmcRequire = false;
			this.PmcField();
		}
		else if (this.pmc === "") {
			this.pmcRequire = true;
			this.PmcFieldErr();
		}
		else {
			this.pmcRequire = false;
			this.PmcField();
			this.phoneInVisible = false;
			this.phoneVisible = true;
		}
	}
	CountryFieldErr(){
		const COUNTRYFIELD = this.template.querySelector(
			'lightning-combobox[data-field="Country"]'
		);
		COUNTRYFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="Country"]').className =
				"input-error-label";
	}
	CountryField(){
		const COUNTRYFIELD = this.template.querySelector(
			'lightning-combobox[data-field="Country"]'
		);
		COUNTRYFIELD.className = "textInput";
			this.template.querySelector('label[data-field="Country"]').className =
				"input-label";
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

		if (this.country === "") {
			this.countryRequire = true;
			this.CountryFieldErr();
		} else {
			this.countryRequire = false;
			this.CountryField();
		}
	}
	StateFieldErr(){
		const STATEFIELD = this.template.querySelector(
			'lightning-combobox[data-field="State"]'
		);
		STATEFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="State"]').className =
				"input-error-label";
	}
	StateField(){
		const STATEFIELD = this.template.querySelector(
			'lightning-combobox[data-field="State"]'
		);
		STATEFIELD.className = "textInput";
			this.template.querySelector('label[data-field="State"]').className =
				"input-label";
	}
	//to validate state
	handleStateChange(event) {
		this.state = event.target.value;
		
		if (this.state === "") {
			this.stateRequire = true;
			this.StateFieldErr();
		} else {
			this.stateRequire = false;
			this.StateField();
		}
	}
	CityFieldErr(){
		const CITYFIELD = this.template.querySelector(
			'lightning-input[data-field="City"]'
		);
		CITYFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="City"]').className =
				"input-error-label";
	}
	CityField(){
		const CITYFIELD = this.template.querySelector(
			'lightning-input[data-field="City"]'
		);
		CITYFIELD.className = "textInput";
			this.template.querySelector('label[data-field="City"]').className =
				"input-label";
	}

	//to validate city
	handleCityChange(event) {
		this.city = event.target.value;
		this.city =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);

		if (this.city === "") {
			this.cityRequireOne = false;
			this.cityRequire = true;
			this.CityFieldErr();
		} else if (!this.validateFirstNamePattern().test(this.city)) {
				this.cityRequire = false;
				this.cityRequireOne = true;
				this.CityFieldErr();
			}
			else {
				this.cityRequire = false;
				this.cityRequireOne = false;
				this.CityField();
			
		}
	}
	StreetFieldErr(){
		const STREETFIELD = this.template.querySelector(
			'lightning-textarea[data-field="Street"]'
		);
		STREETFIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="Street"]').className =
				"input-error-label";
	}
	StreetField(){
		const STREETFIELD = this.template.querySelector(
			'lightning-textarea[data-field="Street"]'
		);
		STREETFIELD.className = "textInput";
			this.template.querySelector('label[data-field="Street"]').className =
				"input-label";
	}
	//to validate street
	handleStreetChange(event) {
		this.street = event.target.value;
		this.street =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		if (this.street === "") {
			this.streetRequire = true;
			this.StreetFieldErr();
		} else {
			this.streetRequire = false;
			this.StreetField();
		}
	}
	ZipCode(){
		return /^[a-zA-Z0-9]+$/u;
	}
	ZipCodeFieldErr(){
		const ZIPCODE = this.template.querySelector(
			'lightning-input[data-field="ZipCode"]'
		);
		ZIPCODE.className = "textInput-err";
			this.template.querySelector('label[data-field="ZipCode"]').className =
				"input-error-label";
	}
	ZipCodeField(){
		const ZIPCODE = this.template.querySelector(
			'lightning-input[data-field="ZipCode"]'
		);
		ZIPCODE.className = "textInput";
			this.template.querySelector('label[data-field="ZipCode"]').className =
				"input-label";
	}
	//to validate zipcode
	handleZipCodeChange(event) {
		this.zipCode = event.target.value;
		this.zipCode =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		
		if (!this.ZipCode().test(this.zipCode)) {
			this.conZipCodeErrorMessage = false;
			this.zipCodeRequire = true;
			this.ZipCodeFieldErr();
		} else if (this.zipCode === "") {
				this.conZipCodeErrorMessage = true;
				this.zipCodeRequire = false;
				this.ZipCodeFieldErr();
			} else {
				this.conZipCodeErrorMessage = false;
				this.zipCodeRequire = false;
				this.ZipCodeField();
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

        if (this.phoneInVisible === true) {
            if (this.phone === "") {
                this.phoneRequire = true;
                this.PhoneerrorMessagevalid = false;
				this.PhoneFieldErr();
                return false;
            } else if (!this.PhoneRegex().test(this.phone)) {
                this.phoneRequire = false;
                this.PhoneerrorMessagevalid = true;
				this.PhoneFieldErr();
                return false;
            } 
                this.phoneRequire = false;
                this.PhoneerrorMessagevalid = false;
                this.PhoneField();
                return true;
            
        }
		return true;
    }

    validatePmc() {
 
        if (this.pmc === "") {
            this.pmcRequire = true;
            this.PmcFieldErr();
            return false;
        } 
            this.pmcRequire = false;
			this.PmcField();
            return true;
        
    }

    validateCountry() {

        if (this.country === "") {
            this.countryRequire = true;
            this.CountryFieldErr();
            return false;
        } 
            this.countryRequire = false;
			this.CountryField();
            return true;
        
    }

    validateState() {
  
        if (this.state === "") {
            this.stateRequire = true;
            this.StateFieldErr();
            return false;
        } 
            this.stateRequire = false;
            this.StateField();
            return true;
        
    }

    validateCity() {
        
        if (this.city === "") {
            this.cityRequire = true;
            this.cityRequireOne = false;
            this.CityFieldErr();
            return false;
        } else if (!this.validateFirstNamePattern().test(this.city)) {
            this.cityRequire = false;
            this.cityRequireOne = true;
			this.CityFieldErr();
            return false;
        } 
            this.cityRequire = false;
            this.cityRequireOne = false;
            this.CityField();
            return true;
        
    }

    validateStreet() {
       
        if (this.street === "") {
            this.streetRequire = true;
			this.StreetFieldErr();
            return false;
        } 
            this.streetRequire = false;
            this.StreetField();
            return true;
        
    }

    validateZipCode() {
       
        if (this.zipCode === "") {
            this.zipCodeRequire = false;
            this.conZipCodeErrorMessage = true;
			this.ZipCodeFieldErr();
            return false;
        } else if (!this.ZipCode().test(this.zipCode)) {
            this.conZipCodeErrorMessage = false;
            this.zipCodeRequire = true;
            this.ZipCodeFieldErr();
            return false;
        } 
            this.zipCodeRequire = false;
            this.conZipCodeErrorMessage = false;
            this.ZipCodeField();
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
			this.avatarContentTop = resource.PRE_AVATAR_MSG_TWO;
			this.avatarContentMid = resource.PRE_AVATAR_MSG_THREE;
			this.avatarContentLast = resource.PRE_AVATAR_MSG_FOUR;
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
							globalThis.location.assign(resource.THANK_FORM_URL);
						} catch (error) {
							this.showToast(resource.ERROR_MESSAGE, error.message, resource.ERROR_VARIANT); 
						}
						
					})
					.catch((error) => {
						this.showToast(resource.ERROR_MESSAGE, error.message, resource.ERROR_VARIANT); // Catching Potential Error from Apex
					});
			} catch (err) {
				this.showToast(resource.ERROR_MESSAGE, err.message, resource.ERROR_VARIANT); // Catching Potential Error from LWC
			}
		}
		else if (!this.PHONEFIELD && this.pmc !== resource.SMS && this.pmc !== resource.PHONE && this.pmc) {
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
							globalThis.location.assign(resource.THANKFROMURL);
						} catch (error) {
							this.showToast(resource.ERROR_MESSAGE, error.message, resource.ERROR_VARIANT); 
						}
							
						
					})
					.catch((error) => {
						this.showToast(resource.ERROR_MESSAGE, error.message, resource.ERROR_VARIANT); // Catching Potential Error from Apex
					});
			} catch (err) {
				this.showToast(resource.ERROR_MESSAGE, err.message, resource.ERROR_VARIANT); // Catching Potential Error from LWC
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
			this.dobErrorMessage = resource.DOB_ERROR;
			return;
		}

		// Validate that the user is not a minor (you can set a minimum age)
		const MINAGE = resource.MINORAGE;
		const USERBIRTHYEAR = SELECTEDDATE.getFullYear();
		const CURRENTYEAR = CURRENTDATE.getFullYear();

		if (CURRENTYEAR - USERBIRTHYEAR < MINAGE) {
			//   this.dobErrorMessage = false;
			this.dobErrorMessage = resource.HCPENROLLMSG;
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
		this.avatarContentTop = resource.PRE_AVATAR_MSG_ONE;
		this.avatarContentMid = resource.PRE_AVATAR_MSG_THREE;
		this.avatarContentLast = resource.PRE_AVATAR_MSG_FOUR;
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
		this.avatarContentTop = resource.PRE_AVATAR_MSG_ONE;
		this.avatarContentMid = resource.PRE_AVATAR_MSG_THREE;
		this.avatarContentLast = resource.PRE_AVATAR_MSG_FOUR;
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
		this.avatarContentTop = resource.PRE_AVATAR_MSG_ONE;
		this.avatarContentMid = resource.PRE_AVATAR_MSG_THREE;
		this.avatarContentLast = resource.PRE_AVATAR_MSG_FOUR;
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
							this.LeadEmptyCondition();
						}
					})
					.catch(() => {
						// this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex

						this.normalHeading = false;

						this.normalHeadingOne = true;

						this.firstNameValid = true;
						this.firstNameRequire = false;
						FIRSTNAMEFIELD.value = "";
						this.FirstNameFieldErr();
						this.firstname = "";

						this.lastNameChangeValid = true;
						this.lastNameChangeRequire = false;
						LASTNAMEFIELD.value = "";
						this.LastNAmeFieldErr();
						this.lastName = "";

						this.dateOfBirthVaild = true;
						DOBFIELD.value = "";
						this.dateOfBirthRequire = false;
						this.DateFieldErr();
						this.dob = "";
						//innerhtml is used to achieve mobile responsiveness
						this.AvatarContent();
					});
			} catch (err) {
				this.showToast(resource.ERROR_MESSAGE, err.message, resource.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} else {
			
			if (FIRSTNAMEFIELD.value === "") {
				this.normalHeadingOne = true;
				this.normalHeading = false;
				this.firstNameRequire = true;
				this.firstNameValid = false;
				this.FirstNameFieldErr();
			}
			if (this.lastName === "") {
				this.normalHeadingOne = true;
				this.normalHeading = false;
				this.lastNameChangeValid = false;

				this.lastNameChangeRequire = true;
				this.LastNAmeFieldErr();
			}

			if (this.dob === "") {
				this.normalHeadingOne = true;
				this.normalHeading = false;
				this.dateOfBirthVaild = false;
				this.dateOfBirthRequire = true;
				this.DateFieldErr();
			}
			//innerhtml is used to achieve mobile responsiveness
			this.AvatarContent();
		}
	}
	AvatarContent(){
		this.avatarContentTop = resource.PRE_AVATAR_MSG_TWO;
			this.avatarContentMid = resource.PRE_AVATAR_MSG_THREE;
			this.avatarContentLast = resource.PRE_AVATAR_MSG_FOUR;

			this.Xmark();
			this.mobileValueTwo = resource.PRE_AVATAR_MSG_FIVE;
	}
	LeadEmptyCondition(){
		this.sldsProgree = true;
							this.currentStep = "2";
							
							this.toggleClass(this.template.querySelector("div.stepOne"), "slds-hide", true);
							this.toggleClass(this.template.querySelector("div.stepTwo"), "slds-hide", false);
							this.toggleClass(this.template.querySelector("div.slds-progress"), "slds-hide", false);
						
							this.avatarContentTop = resource.PRE_AVATAR_MSG_ONE;
							this.avatarContentMid = resource.PRE_AVATAR_MSG_THREE;
							this.avatarContentLast = resource.PRE_AVATAR_MSG_FOUR;
							this.Xmark();
							this.mobileValueTwo = resource.PRE_AVATAR_MSG_FIVE;
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
			this.AvatarContent();
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
				this.showToast(resource.ERROR_MESSAGE, error.message, resource.ERROR_VARIANT); // Catching Potential Error from Apex
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

		this.mobileValueTwo = resource.PRE_AVATAR_MSG_SIX;
		this.clickMethod = false;
		this.fieldBox = true;
	}
	//to get avatar content in mobile view
	Xmark() {
		this.mobileValueTwo = resource.PRE_AVATAR_MSG_FIVE;
		this.clickMethod = true;
		this.fieldBox = false;
	}
}