// This LWC is used for prepopulating hcp caregiver information.
// To import Libraries
import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import { loadStyle } from "lightning/platformResourceLoader";
//  To import Apex Classes
import CREATE_LEAD_RECORD from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.updateLeadCareRecord";
import LEAD_ID from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.getPatientDetails";
import CREATE_LEAD from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.updateLead";
import LEAD_CAREGIVER from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.getEnrolleeCaregiverId";
import COUNTRY from '@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getCountries';
import STATE from '@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getStates';
// To import Static Resources
import OLD_GUY_JPEG_URL from "@salesforce/resourceUrl/BI_PSPB_PatientInitiatedAvater";
import BEYOND_GPP_LOGO from "@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo";
import WARNING_ICON from "@salesforce/resourceUrl/BI_PSP_WarningIcon";
import TEXT_ALIGN from "@salesforce/resourceUrl/BI_PSPB_TextAlignmentHcp";
//To import fields from Lead
import LEAD from "@salesforce/schema/Lead";
// To import Custom Labels
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import THANK_FORM_URL from "@salesforce/label/c.BI_PSPB_PreThankFormUrl";
import FEMALE from "@salesforce/label/c.BI_PSP_RbFemale";
import MALE from "@salesforce/label/c.BI_PSP_RbMale";
import OTHER from "@salesforce/label/c.BI_PSP_RbOther";
import PREFER from "@salesforce/label/c.BI_PSP_RbNotToSay";
import PHONE from "@salesforce/label/c.BI_PSPB_Phone";
import SMS from "@salesforce/label/c.BI_PSP_SmsLabel";
import EMAIL from "@salesforce/label/c.BI_PSP_NotificationEmail";
import PARENT from "@salesforce/label/c.BI_PSP_NotificationParent";
import SIBILING from "@salesforce/label/c.BI_PSP_NotificationSibling";
import LOVEDONE from "@salesforce/label/c.BI_PSP_LovedOne";
import GUARDIAN from "@salesforce/label/c.BI_PSP_NotificationGuardian";
import FRIEND from "@salesforce/label/c.BI_PSP_NotificationFriend";
import RELATIVE from "@salesforce/label/c.BI_PSP_NotificationOtherRelative";
export default class biPspbHcpPrepopulateCaregiverForm extends NavigationMixin(
	LightningElement
) {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of variables with @api
	@api searchResults;
	@api searchResultss;
	isLoaded = false;
	Phonedisable = false;
	// Declaration of variables with  
	avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
						We're excited to help your loved one manage their generalized
						pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
	avatarContentMid = `As this user account is for a minor, we require verification
						of the patients information as well as your information as their
						caregiver. Click 'next' to proceed if the pre-filled information is
						correct.`;
	avatarContentLast = `If not, please correct the information and then click 'next'.`;
	selectedCountryCode = "";
	fieldBox = false;
	isButtonDisabled = false;
	selectedStateCode = "";
	phoneNumberMandatory = false;
	phoneNumberVisible = true;
	countryCode = [];
	stateCode = [];
	zipCodeValid = false;
	mobileView = ` Hello! Welcome to Beyond GPP: TheSpevigo® Patient...`;
	leadFields = {};
	caregiverFields = {};
	prescriptionFields = {};
	consentFields = {};
	firstNameErrorMessage = false;
	lastNameErrorMessage = false;
	genderErrorMessage = false;
	emailErrorMessage = false;
	careFirstNameErrorMessage = false;
	careLastNameErrorMessage = false;
	careDobErrorMessage = false;
	careEmailErrorMessage = false;
	drugErrorMessage = false;
	dateErrorMessage = false;
	frequencyErrorMessage = false;
	frequencyUnitErrorMessage = false;
	authorizeErrorMessage = false;
	error;
	errors;
	errorss;
	isAddNew = false;
	threeDot = true;
	caregiverLastName = false;
	caregiverRelationship = false;
	caregiverEmail = false;
	caregiverPhoneNumber = false;
	caregiverPreferred = false;
	careRelationship;
	carePhone;
	prefereedMode;
	checkBoxName = false;
	checkbox;
	country = "";
	state = "";
	city = "";
	street = "";
	zipCode = "";
	leadId;
	showDetails = false;
	showForm = true;
	countryRequire = false;
	stateRequire = false;
	cityRequire = false;
	streetRequire = false;
	zipCodeRequire = false;
	clabelError = false;
	clabelErrors = "input-label";
	slabelError = false;
	slabelErrors = "input-label";
	cilabelError = false;
	cilabelErrors = "input-label";
	stlabelError = false;
	stlabelErrors = "input-label";
	zlabelError = false;
	zlabelerrors = "input-label";
	currentStep;
	normalHeading = true;
	normalHeadingOne = false;
	firstNameValid = false;
	lastNameChangeValid = false;
	dateOfBirthVaild = false;
	phoneNumber = "";
	pmocValue = "";
	genderRequire = false;
	genderValue = "";
	openModal = false;
	@track leadGender = [
		{ label: MALE, value: MALE },
		{ label: FEMALE, value: FEMALE },
		{ label: OTHER, value: OTHER },
		{ label: PREFER, value: PREFER }
	];
	@track rswp = [
		{ label: PARENT, value: PARENT },
		{ label: SIBILING, value: SIBILING },
		{ label: LOVEDONE, value: LOVEDONE },
		{ label: GUARDIAN, value: GUARDIAN },
		{ label: FRIEND, value: FRIEND },
		{ label: RELATIVE, value: RELATIVE }
	];
	@track leadPmc = [
		{ label: SMS, value: SMS },
		{ label: PHONE, value: PHONE },
		{ label: EMAIL, value: EMAIL }
	];
	leadFirstName;
	leadLastName;
	leadDob;
	selectedValue;
	leadEmail;
	lastName = "";
	firstName = "";
	dob = "";
	rwp = "";
	firstNameRequire = false;
	lastNameChangeRequire = false;
	dateOfBirthRequire = false;
	rwpRequire = false;
	phoneRequire = false;
	pmocRequire = false;
	leadCareId;
	leadCareFirstName;
	leadCareLastName;
	leadCareDob;
	leadCareEmail;
	leadCarePhone;
	// Declaration of Global variables
	selectedGender = "";
	warningIcons = WARNING_ICON;
	selectedAvatarSrc = OLD_GUY_JPEG_URL;
	BEYOND_GPP_LOGO = BEYOND_GPP_LOGO;
	picklistOrdered = [];
	picklistOrderedOne = [];
	selectedSearchResult;
	selectedSearchResultOne;
	selectedCountry;

	// Importing wire adapters to retrieve object information and picklist values
	connectedCallback() {
		loadStyle(this, TEXT_ALIGN);
	}
	@wire(getObjectInfo, { objectApiName: LEAD })
	objectInfo;

	// Wire adapter to retrieve picklist values for the State field, based on selected country
	@wire(COUNTRY)
	wiredCountries({ error, data }) {

		if (data) {
			this.countryCode = data.map(country => ({ label: country.label, value: country.value }));
		} else if (error) {
			this.showToast(error);
		}
	}





	// Function to handle input changes related to caregiver information
	handleInputChangecaregiver(event) {
		this.careRelationship = event.target.value;
		this.carePhone = event.target.value;
		this.prefereedMode = event.target.value;
		this.caregiverRelationship = false;
		this.caregiverPreferred = false;
		this.caregiverPhoneNumber = false;
	}

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

	//to validate country
	handleCountryChange(event) {
		this.country = event.target.value;

		STATE({ selectedCountry: this.country })
			.then(result => {

				this.stateCode = result.map(state => ({ label: state.Name, value: state.BI_PSPB_StateCode__c }));

			})
			.catch(error => {
				this.showToast(error);
			});
		// Get the selected country value
		this.country = event.target.value;
		const COUNTRY_FIELD_ERROR = this.template.querySelector(
			'lightning-combobox[data-field="Country"]'
		);
		// Check if the country is empty
		if (this.country === "") {
			this.countryRequire = true;
			COUNTRY_FIELD_ERROR.className = "textInput-err";
			this.clabelErrors = "input-error-label";
			this.clabelError = true;
		} else {
			this.countryRequire = false;
			COUNTRY_FIELD_ERROR.className = "textInput";
			this.clabelErrors = "input-label";
			this.clabelError = false;
		}
	}

	//to validate state
	handleStateChange(event) {
		// Get the selected state value
		this.state = event.target.value;
		const STATE_FIELD_ERROR = this.template.querySelector(
			'lightning-combobox[data-field="State"]'
		);
		// Check if the state is empty
		if (this.state === "") {
			this.stateRequire = true;
			STATE_FIELD_ERROR.className = "textInput-err";
			this.slabelErrors = "input-error-label";
			this.slabelError = true;
		} else {
			this.stateRequire = false;
			STATE_FIELD_ERROR.className = "textInput";
			this.slabelErrors = "input-label";
			this.slabelError = false;
		}
	}

	//to validate city
	handleCityChange(event) {
		// Get the entered city value
		this.city = event.target.value;
		this.city =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		//to get data field value from html
		const cityField = this.template.querySelector(
			'lightning-input[data-field="City"]'
		);
		// Check if the city is empty
		if (this.city === "") {
			this.cityValid = false;
			this.cityRequire = true;
			cityField.className = "textInput-err"; //css classes for UI
			this.template.querySelector('label[data-field="City"]').className =
				"input-error-label";
		}
		// Check if city contains only alphabets
		else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.city)) {
				this.cityRequire = false;
				this.cityValid = true;
				cityField.className = "textInput-err";
				this.template.querySelector('label[data-field="City"]').className =
					"input-error-label";
			} 
			else {
				this.cityRequire = false;
				this.cityValid = false;
				cityField.className = "textInput";
				this.template.querySelector('label[data-field="City"]').className =
					"input-label";
			}
		}
	

	//to validate street
	handleStreetChange(event) {
		// Get the entered street value
		this.street = event.target.value;
		this.street =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const STREET_FIELD = this.template.querySelector(
			'lightning-textarea[data-field="Street"]'
		);
		// Check if the street is empty
		if (this.street === "") {
			this.streetRequire = true;
			STREET_FIELD.className = "textInput-err";
			this.stlabelErrors = "input-error-label";
			this.stlabelError = true;
		} else {
			this.streetRequire = false;
			STREET_FIELD.className = "textInput";
			this.stlabelErrors = "input-label";
			this.stlabelError = false;
		}
	}
	//to validate zipcode
	handleZipCodeChange(event) {
		// Get the entered zip code value
		this.zipCode = event.target.value;
		this.zipCode =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const ZIP_CODE = this.template.querySelector(
			'lightning-input[data-field="ZipCode"]'
		);
		// Check if the zip code is not numeric
		if (!/^[a-zA-Z0-9]+$/u.test(this.zipCode)) {
			this.zipCodeRequire = false;
			this.zipCodeValid = true;
			ZIP_CODE.className = "textInput-err";
			this.template.querySelector('label[data-field="ZipCode"]').className =
				"input-error-label";
		}
		// Check if the zip code is empty
		else if (this.zipCode === "") {
				this.zipCodeRequire = true;
				this.zipCodeValid = false;
				ZIP_CODE.className = "textInput";
				this.template.querySelector('label[data-field="ZipCode"]').className =
					"input-label";
			}
			else{
			// Reset flags and update classes
			this.zipCodeRequire = false;
			this.zipCodeValid = false;
			ZIP_CODE.className = "textInput";
			this.template.querySelector('label[data-field="ZipCode"]').className =
				"input-label";
			}
		
	}


		// Central validation method
		Contactvalidform() {
			let isValid = true;
	
			// Call individual validation methods
			isValid &= this.validateCountry();
			isValid &= this.validateState();
			isValid &= this.validateCity();
			isValid &= this.validateStreet();
			isValid &= this.validateZipCode();
			isValid &= this.validateCheckbox();
	
			// Additional content setup
			this.avatarContentTop = `Hello! Welcome to the Spevigo® patient support program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
			this.avatarContentMid = `As the user account is for a minor, we request a verification of your information including that of your caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
			this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
			this.Xmark();
	
			return !!isValid;  // Convert bitwise result to boolean
		}
	
		// Individual validation methods
	
		validateCountry() {
			const COUNTRY_FIELD_ERR = this.template.querySelector(
				'lightning-combobox[data-field="Country"]'
			);
			if (this.country === "") {
				this.countryRequire = true;
				COUNTRY_FIELD_ERR.className = "textInput-err";
				this.clabelErrors = "input-error-label";
				this.clabelError = true;
				return false;
			}
			
				this.countryRequire = false;
				COUNTRY_FIELD_ERR.className = "textInput";
				this.clabelErrors = "input-label";
				this.clabelError = false;
				return true;
			
			
		}
	
		validateState() {
			const STATE_FIELD_ERR = this.template.querySelector(
				'lightning-combobox[data-field="State"]'
			);
			if (this.state === "") {
				this.stateRequire = true;
				STATE_FIELD_ERR.className = "textInput-err";
				this.slabelErrors = "input-error-label";
				this.slabelError = true;
				return false;
			} 
				this.stateRequire = false;
				STATE_FIELD_ERR.className = "textInput";
				this.slabelErrors = "input-label";
				this.slabelError = false;
				return true;
				
			
		}
	
		validateCity() {
			const cityField = this.template.querySelector(
				'lightning-input[data-field="City"]'
			);
			if (this.city === "") {
				this.cityRequire = true;
				this.cityValid = false;
				cityField.className = "textInput-err";
				this.template.querySelector('label[data-field="City"]').className =
					"input-error-label";
				this.cilabelError = true;
				return false;
			} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.city)) {
				this.cityRequire = false;
				this.cityValid = true;
				cityField.className = "textInput-err";
				this.template.querySelector('label[data-field="City"]').className =
					"input-error-label";
					return false;
			} 
				this.cityRequire = false;
				this.cityValid = false;
				cityField.className = "textInput";
				this.template.querySelector('label[data-field="City"]').className =
					"input-label";
				this.cilabelError = false;
				return true;
			
			
		}
	
		validateStreet() {
			const STREET_FIELD = this.template.querySelector(
				'lightning-textarea[data-field="Street"]'
			);
			if (this.street === "") {
				this.streetRequire = true;
				STREET_FIELD.className = "textInput-err";
				this.stlabelErrors = "input-error-label";
				this.stlabelError = true;
				return false;
			} 
				this.streetRequire = false;
				STREET_FIELD.className = "textInput";
				this.stlabelErrors = "input-label";
				this.stlabelError = false;
				return true;
			
		}
	
		validateZipCode() {
			const ZIP_CODE = this.template.querySelector(
				'lightning-input[data-field="ZipCode"]'
			);
			if (this.zipCode === "") {
				this.zipCodeRequire = true;
				this.zipCodeValid = false;
				ZIP_CODE.className = "textInput-err";
				this.template.querySelector('label[data-field="ZipCode"]').className =
					"input-error-label";
				this.zlabelError = true;
				return false;
			} else if (!/^[a-zA-Z0-9]+$/u.test(this.zipCode)) {
				this.zipCodeRequire = false;
				this.zipCodeValid = true;
				ZIP_CODE.className = "textInput-err";
				this.template.querySelector('label[data-field="ZipCode"]').className =
					"input-error-label";
					return false;
			} 
			
				this.zipCodeRequire = false;
				this.zipCodeValid = false;
				ZIP_CODE.className = "textInput";
				this.template.querySelector('label[data-field="ZipCode"]').className =
					"input-label";
				this.zlabelError = false;
				return true;
			
		}
	
		validateCheckbox() {
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

	//to update lead record
	handleCreateLead() {
		if (!this.Contactvalidform()) {
			return;
		}

		let leadWrapper = {
			leadId: this.leadId,
			country: this.country,
			state: this.state,
			city: this.city,
			street: this.street,
			zipCode: this.zipCode
		};
		try {
			let globalThis = window;
			this.isButtonDisabled = true;
			this.isLoaded = true;

			CREATE_LEAD_RECORD({ leadWrapper: leadWrapper })
				.then(() => {
					CREATE_LEAD({
						leadId: this.leadId,
						preferredMethodofCommunication: this.pmocValue
					})
						.then(() => {
							globalThis?.localStorage.setItem("recordId", this.leadId);
						})
						.catch((error) => {
							this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
						});

					try {
						globalThis.location.assign(THANK_FORM_URL);

					} catch (error) {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from LWC

					}
				})

				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		}
		catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help your loved one manage their generalized pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
		this.avatarContentMid = `As this user account is for a minor, we require verification of the patient’s information as well as your information as their caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
		this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
		this.Xmark();
	}

	//to go to previous page - 1
	goBackToStepOne() {
		this.currentStep = "1";
		this.template.querySelector("div.stepTwo").classList.add("slds-hide");
		this.template.querySelector("div.stepOne").classList.remove("slds-hide");
		this.template.querySelector("div.slds-progress").classList.add("slds-hide");
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help your loved one manage their generalized pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
		this.avatarContentMid = `As this user account is for a minor, we require verification of the patient’s information as well as your information as their caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
		this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
		this.Xmark();
	}

	//to go to previous page - 2
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
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help your loved one manage their generalized pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
		this.avatarContentMid = `As this user account is for a minor, we require verification of the patient’s information as well as your information as their caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
		this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
		this.Xmark();
	}
	//to go to previous page - 3
	goBackToStepThree() {
		this.currentStep = "3";
		this.template.querySelector("div.stepFour").classList.add("slds-hide");
		this.template.querySelector("div.stepThree").classList.remove("slds-hide");
		// Progress indicator
		this.template
			.querySelector("li.li-three")
			.classList.remove("slds-is-active");
		this.template
			.querySelector("li.li-two")
			.classList.remove("slds-is-completed");
		this.template.querySelector("li.li-two").classList.add("slds-is-active");
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help your loved one manage their generalized pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
		this.avatarContentMid = `As this user account is for a minor, we require verification of the patient’s information as well as your information as their caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
		this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
		this.Xmark();

	}
	//to go to previous page - 4
	goBackToStepFour() {
		this.currentStep = "4";
		this.template.querySelector("div.stepFive").classList.add("slds-hide");
		this.template.querySelector("div.stepFour").classList.remove("slds-hide");
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help your loved one manage their generalized pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
		this.avatarContentMid = `As this user account is for a minor, we require verification of the patient’s information as well as your information as their caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
		this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
		this.Xmark();
	}

	//to go to next page by validating fields
	goToStepTwo() {
		const FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="FN"]'
		);
		const LAST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="LN"]'
		);
		const DOB_FIELD = this.template.querySelector(
			'lightning-input[data-field="dob"]'
		);

		if (this.firstName !== "" && this.lastName !== "" && this.dob !== "") {
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
					this.leadCaregiverecordget(result.Id);

					if (this.leadId !== "") {
						this.currentStep = "2";
						this.template
							.querySelector("div.stepOne")
							.classList.add("slds-hide");
						this.template
							.querySelector("div.stepTwo")
							.classList.remove("slds-hide");
						// Progress indicator
						this.template
							.querySelector("div.slds-progress")
							.classList.remove("slds-hide");
					}
					this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
					We're excited to help your loved one manage their generalized
					pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
					this.avatarContentMid = `As this user account is for a minor, we require verification
					of the patients information as well as your information as their
					caregiver. Click 'next' to proceed if the pre-filled information is
					correct.`;
					this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
					this.Xmark();
				})
				.catch(() => {
					// this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
					this.normalHeading = false;
					this.normalHeadingOne = true;
					this.firstNameValid = true;
					this.firstNameRequire = false;
					FIRST_NAME_FIELD.value = "";
					FIRST_NAME_FIELD.className = "textInput-err";
					this.template.querySelector('label[data-field="FN"]').className =
						"input-error-label";
					this.firstname = "";

					this.lastNameChangeValid = true;
					LAST_NAME_FIELD.value = "";
					LAST_NAME_FIELD.className = "textInput-err";
					this.template.querySelector('label[data-field="LN"]').className =
						"input-error-label";
					this.lastName = "";

					this.dateOfBirthVaild = true;
					DOB_FIELD.value = "";
					DOB_FIELD.className = "textInput-err";
					this.template.querySelector('label[data-field="dob"]').className =
						"input-error-label";
					this.leadFields.dob = "";
					this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
						We're excited to help your loved one manage their generalized
						pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
					this.avatarContentMid = `As this user account is for a minor, we require verification
						of the patients information as well as your information as their
						caregiver. Click 'next' to proceed if the pre-filled information is
						correct.`;
					this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
					this.Xmark();

				});


		} else {
			this.validateFirstName();
			this.validateLastName();
			this.validateDOB();
	
			this.avatarContentTop = `Hello! Welcome to the Spevigo® patient support program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
			this.avatarContentMid = `As the user account is for a minor, we request a verification of your information including that of your caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
			this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
			this.Xmark();
		}
	}

    validateFirstName() {
        const FIRST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="FN"]');
        if (!this.FIRST_NAME_FIELD) {
            this.firstNameRequire = true;
            this.firstNameValid = false;
            FIRST_NAME_FIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="FN"]').className = "input-error-label";
            this.normalHeadingOne = true;
            this.normalHeading = false;
            
        } else {
            this.firstNameRequire = false;
            this.firstNameValid = false;
            FIRST_NAME_FIELD.className = "textInput";
            this.template.querySelector('label[data-field="FN"]').className = "input-label";
            this.normalHeadingOne = false;
            this.normalHeading = true;
           
        }
    }

    validateLastName() {
        const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="LN"]');
        if (this.lastName === "") {
            this.lastNameChangeRequire = true;
            this.lastNameChangeValid = false;
            LAST_NAME_FIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="LN"]').className = "input-error-label";
            this.normalHeadingOne = true;
            this.normalHeading = false;
          
        } else {
            this.lastNameChangeRequire = false;
            this.lastNameChangeValid = false;
            LAST_NAME_FIELD.className = "textInput";
            this.template.querySelector('label[data-field="LN"]').className = "input-label";
            this.normalHeadingOne = false;
            this.normalHeading = true;
           
        }
    }

    validateDOB() {
        const DOB_FIELD = this.template.querySelector('lightning-input[data-field="dob"]');
        if (!this.DOB_FIELD) {
            this.dateOfBirthRequire = true;
            this.dateOfBirthVaild = false;
            DOB_FIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="dob"]').className = "input-error-label";
            this.normalHeadingOne = true;
            this.normalHeading = false;
            
        } else {
            this.dateOfBirthRequire = false;
            this.dateOfBirthVaild = false;
            DOB_FIELD.className = "textInput";
            this.template.querySelector('label[data-field="dob"]').className = "input-label";
            this.normalHeadingOne = false;
            this.normalHeading = true;
            
        }
    }
	//to store relationship with patient field
	handlerwcChange(event) {
		this.rwp = event.target.value;
		this.rwpRequire = false;
	}
	handlePhoneChangeEmpty(event) {
		this.phoneNumber = event.target.value;
		const PHONE_FIELD = this.template.querySelector(
			'lightning-input[data-field="phone"]'
		);
		if (this.phoneNumber === "") {
			this.phoneRequire = false;
			this.Phonedisable = false;
			PHONE_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="phone"]').className =
				"input-label";
		}
	}
	//to store value in PHONE field
	handlephoneChange(event) {
		this.phoneNumber = event.target.value;
		const phoneField = this.template.querySelector(
			'lightning-input[data-field="phone"]'
		);
		if (this.phoneNumber === "") {
			this.phoneRequire = true;
			this.Phonedisable = false;
			phoneField.className = "textInput-err";
			this.template.querySelector('label[data-field="phone"]').className =
				"input-error-label";
		} else {
			this.Phonedisable = false;
			this.phoneRequire = false; // Reset error flag
			phoneField.className = "textInput"; // Remove error class
			this.template.querySelector('label[data-field="phone"]').className =
				"input-label";
		}
	}

	//to store preferred method of communication field
	handlepmocChange(event) {
		this.pmocValue = event.target.value;
		const PMOC_FIELD = this.template.querySelector(
			'lightning-combobox[data-field="pmoc"]'
		);
		if (this.pmocValue === SMS || this.pmocValue === PHONE) {
			this.phoneNumberMandatory = true;
			this.phoneNumberVisible = false;
			this.pmocRequire = false;
			PMOC_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="pmoc"]').className =
				"input-label";
		} else if (this.pmocValue === "") {
				this.pmocRequire = true;
				PMOC_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="pmoc"]').className =
					"input-error-label";
			} 
			else {
				this.phoneNumberMandatory = false;
			this.phoneNumberVisible = true;
			this.phoneRequire = false;
				PMOC_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="pmoc"]').className =
					"input-label";
			}
	}
	//to go to next page by validating fields
	goToStepThree() {

		this.Xmark();
		// Reset error flags
		this.rwpRequire = false;
		this.pmocRequire = false;
		this.phoneRequire = false;

		if (this.rwp && this.phoneNumber && this.pmocValue) {
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
			this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help your loved one manage their generalized pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
			this.avatarContentMid = `As this user account is for a minor, we require verification of the patient’s information as well as your information as their caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
			this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
			this.Xmark();
		}
		else if (!this.phoneField && this.pmocValue !== SMS && this.pmocValue !== PHONE && this.pmocValue) {

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
			this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program. We're excited to help your loved one manage their generalized pustular psoriasis (GPP) and make the most of their Spevigo therapy.`;
			this.avatarContentMid = `As this user account is for a minor, we require verification of the patient’s information as well as your information as their caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
			this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
			this.Xmark();
		}
		else {
			this.validatePMOC();
			this.validateRWP();
			this.validatePhoneNumber();
	
			this.avatarContentTop = `Hello! Welcome to the Spevigo® patient support program. We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
			this.avatarContentMid = `As the user account is for a minor, we request a verification of your information including that of your caregiver. Click 'next' to proceed if the pre-filled information is correct.`;
			this.avatarContentLast = `If not, please correct the information and then click 'next'.`;
			this.Xmark();

	}
	
	}
      

    validatePMOC() {
        const PMOC_FIELD = this.template.querySelector('lightning-combobox[data-field="pmoc"]');
        if (!this.pmocValue) {
            this.pmocRequire = true;
            PMOC_FIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="pmoc"]').className = "input-error-label";
            
        } else {
            this.pmocRequire = false; // Reset error flag
            PMOC_FIELD.className = "textInput"; // Remove error class
            this.template.querySelector('label[data-field="pmoc"]').className = "input-label";
           
        }
    }

    validateRWP() {
        const RWP_FIELD = this.template.querySelector('lightning-combobox[data-field="rwp"]');
        if (!this.rwp) {
            this.rwpRequire = true;
            RWP_FIELD.className = "textInput-err";
            this.template.querySelector('label[data-field="rwp"]').className = "input-error-label";
           
        } else {
            this.rwpRequire = false; // Reset error flag
            RWP_FIELD.className = "textInput"; // Remove error class
            this.template.querySelector('label[data-field="rwp"]').className = "input-label";
            
        }
    }

    validatePhoneNumber() {
        const phoneField = this.template.querySelector('lightning-input[data-field="phone"]');
        if (this.phoneNumberMandatory) {
            if (!this.phoneNumber) {
                this.phoneRequire = true;
                this.Phonedisable = false;
                phoneField.className = "textInput-err";
                this.template.querySelector('label[data-field="phone"]').className = "input-error-label";
               
            } else {
                this.phoneRequire = false; // Reset error flag
                phoneField.className = "textInput"; // Remove error class
                this.template.querySelector('label[data-field="phone"]').className = "input-label";
                
            }
        }
        
    }
	//to store value in gender field
	handleGenderChange(event) {
		this.genderValue = event.target.value;
		this.genderRequire = false;
	}

	//to go to next page by validating fields
	goToStepFour() {
		const LAST_NAME_FIELD = this.template.querySelector(
			'lightning-combobox[data-field="GN"]'
		);
		this.Xmark();
		if (this.selectedValue !== "") {
			this.currentStep = "4";
			this.template.querySelector("div.stepThree").classList.add("slds-hide");
			this.template.querySelector("div.stepFour").classList.remove("slds-hide");
			// Progress indicator
			this.template
				.querySelector("li.li-two")
				.classList.remove("slds-is-active");
			this.template
				.querySelector("li.li-two")
				.classList.add("slds-is-completed");
			this.template
				.querySelector("li.li-three")
				.classList.add("slds-is-active");
			// }
		} else {
			if (this.genderValue === "") {
				this.genderRequire = true;
				LAST_NAME_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="GN"]').className =
					"input-error-label";
			}
		}
	}


	//to validate terms and condition checkbox
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
	handleKeyDownThree(event) {
		event.preventDefault();
	}

	//to display terms and condition popup
	showModal() {
		this.openModal = true;
	}
	//to close terms and condition popup
	closeModal() {
		this.openModal = false;
	}

	//to validate firstname field
	handleFirstNameChange(event) {
		this.firstName = event.target.value;
		this.firstName =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="FN"]'
		);
		if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.firstName)) {
				this.firstNameValid = true;
				this.firstNameRequire = false;
				FIRST_NAME_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="FN"]').className =
					"input-error-label";
			} 
			else {
				this.firstNameValid = false;
				this.firstNameRequire = false;
				FIRST_NAME_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="FN"]').className =
					"input-label";
			}
		
	}

	//to validate lastname field
	handleLastNameChange(event) {
		this.lastName = event.target.value;
		this.lastName =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const LAST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="LN"]'
		);
	
			if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.lastName)) {
				this.lastNameChangeValid = true;
				this.lastNameChangeRequire = false;
				LAST_NAME_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="LN"]').className =
					"input-error-label";
			} else {
				this.lastNameChangeValid = false;
				this.lastNameChangeRequire = false;
				LAST_NAME_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="LN"]').className =
					"input-label";
			}
		
	}

	//to validate dob field
	handleDobChange(event) {
		const DOB_FIELD = this.template.querySelector(
			'lightning-input[data-field="dob"]'
		);
		this.dob = event.target.value;
		if (this.dob === "") {
			this.dateOfBirthRequire = true;
			this.dateOfBirthVaild = false;
			DOB_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error-label";
		} else {
			this.normalHeadingOne = false;
			this.dateOfBirthRequire = false;
			this.dateOfBirthVaild = false;
			DOB_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-label";
		}
	}

	//to get lead caregiver from LEAD_ID
	leadCaregiverecordget(resuldId) {
		try {
			LEAD_CAREGIVER({ leadId: resuldId })
				.then((result) => {
					this.leadCareFirstName = result.BI_PSPB_First_Name__c;
					this.leadCareLastName = result.BI_PSPB_Last_Name__c;
					this.leadCareDob = result.BI_PSPB_Date_of_Birth__c;
					this.leadCareEmail = result.BI_PSPB_E_mail_ID__c;
					this.phoneNumber = result.BI_PSPB_Phone_number__c;
					this.rwp = result.BI_PSPB_Relationship_to_Patient__c;
					this.pmocValue = result.BI_PSPB_Preferred_Communication_Method__c;

					if (this.phoneNumber) {
						this.Phonedisable = true;
					} else {
						this.Phonedisable = false;
					}
					if (this.pmocValue === SMS || this.pmocValue === PHONE) {
						this.phoneNumberMandatory = true;
						this.phoneNumberVisible = false;
					} else {
						this.phoneNumberMandatory = false;
						this.phoneNumberVisible = true;

					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
				});
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//to validate PHONE
	handleKeyDown(event) {
		const CHAR_CODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
		if (CHAR_CODE !== 43 && (CHAR_CODE < 48 || CHAR_CODE > 57)) {
			// Allow only digits (48-57) and the plus symbol (43)
			event.preventDefault(); // Prevent the character from being entered
		}
	}
	//to get avatar content
	click() {
		this.threeDot = false;
		this.fieldBox = true;
		this.mobileView = ` Hello! Welcome to Beyond GPP: The
						Spevigo® Patient Support Program.
						We're excited to help your loved one
						manage their generalized pustular
						psoriasis (GPP) and make the most of
						their Spevigo therapy.
						As this user account is for a minor, we
						require verification of the patients
						information as well as your information
						as their caregiver. Click 'next' to
						proceed if the pre-filled information is
						correct.
						If not, please modify to the correct the
						information and then click 'next'.`;

	}
	//to get avatar content in mobile view
	Xmark() {
		this.mobileView = `Hello! Welcome to Beyond GPP: The Spevigo® Patient....`;
		this.threeDot = true;
		this.fieldBox = false;
	}
}