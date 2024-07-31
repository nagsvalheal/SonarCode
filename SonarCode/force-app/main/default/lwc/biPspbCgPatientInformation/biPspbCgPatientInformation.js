// This component is used to retrieve caregiver data, access patient information, and create cases based on the account settings.
// To import Libraries
import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadStyle } from 'lightning/platformResourceLoader';

// To import current user ID
import Id from '@salesforce/user/Id';
//  To import Apex Classes
import UPDATE_PATIENT_DETAILS from '@salesforce/apex/BI_PSPB_ProfileManagerCtrl.updatePatientExcistInfo';
import CREATE_CASE from '@salesforce/apex/BI_PSPB_CaseCtrl.createCase';
import CREATE_ACCESS_CASE from '@salesforce/apex/BI_PSPB_CaseCtrl.createAccessCase';
import ENROLLEE_DETAILS from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import CHECKBOX_VALUES from '@salesforce/apex/BI_PSPB_CaseCtrl.checkboxPersonalAccess';
import CHECKBOX_VALUES_REQUEST from '@salesforce/apex/BI_PSPB_CaseCtrl.checkboxAccountDeletion';
import PATIENT_INFO from '@salesforce/apex/BI_PSPB_PatientFormCtrl.getPatientInfo';
import COUNTRYS from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getCountries";
import STATES from "@salesforce/apex/BI_PSPB_EnrollmentUtilities.getStates";

// To import Static Resources

import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbCgPatientInformation extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of variables with @api

	@api isLoaded = false;
	@api account;
	@api caregiverForm;
	@api selectedValue;

	// Declaration of variables with @track
	@track patientFirstName = '';
	@track firstNameErrorMessageValid = false;
	@track lastNameErrorMessageValid = false;
	@track RpCityErrorMessageValid = false;
	@track showDiv = false;
	@track showDiv1 = false;
	@track isFirstNameDisabled = true;
	@track isLastNameDisabled = true;
	@track isDOBDisabled = true;
	@track isEmailDisabled = true;
	@track isMobilePhoneDisabled = true;
	@track isGenderDisabled = true;
	@track isPOMDisabled = true;
	@track isMaillingCountryDisabled = true;
	@track isMaillingStateDisabled = true;
	@track isMaillingStreetDisabled = true;
	@track isMaillingPostalcodeDisabled = true;
	@track isMaillingCityDisabled = true;
	@track firstNameErrorMessage = false;
	@track lastNameErrorMessage = false;
	@track relationshipErrorMessage = false;
	@track dobErrorMessage = false;
	@track emailErrorMessage = false;
	@track phoneErrorMessage = false;
	@track conPmcErrorMessage = false;
	@track MobileErrorMessage = false;
	@track genderMessage = false;
	@track pmcMessage = false;
	@track countryCodeMessage = false;
	@track stateCodeMessage = false;
	@track cityMessage = false;
	@track streetMessage = false;
	@track postalCodeMessage = false;
	@track adult = false;
	@track ZipErrorMessagevalid = false;
	@track isCaregiver = false;
	@track patientId;
	@track patientLastName = '';
	@track patientDOB = '';
	@track patientAge = '';
	@track patientGender = '';
	@track patientEmail = '';
	@track preferredCommunication = '';
	@track patientMobilePhone = '';
	@track patientCountry = '';
	@track patientState = '';
	@track patientCity = '';
	@track patientStreet = '';
	@track patientZipCode = '';
	@track PersonBirthDate = '';

	@track futureDobError;
	@track openModal = false;
	@track validerrorMessage = false;
	@track FirstName;
	@track accountId;
	@track result;
	@track isDeletePopupOpen = false;
	@track isAccessPopupOpen = false;
	@track isAdult = false;
	@track relation = [];
	@track selectedCountryCode = '';
	@track selectedStateCode = '';
	@track countryCode = [];

	@track relations = '';
	@track dobrequired = false;
	@track country;
	@track state;

	@track deletepopup;
	@track accesspopup;

	@track GenderErrorMessage = false;
	@track DeleteMessage = false;
	@track accessMessage = false;
	@track colorChnage = 'outlined-button' //css class
	@track colorChanage = 'outlined-button' //css class
	@track boxedIcon = resources.BOXEDD_ICON;
	@track minorError = false;
	@track leadPmc = [{ label: resources.MALE, value: resources.MALE },
	{ label: resources.FEMALE, value: resources.FEMALE },
	{ label: resources.PREFERNOT, value: resources.PREFERNOT },
	{ label: resources.OTHERS, value: resources.OTHERS }
	];
	@track preffer = [
		{ label: resources.SMS_STRING, value: resources.SMS_STRING },
		{ label: resources.PHONE_STRING, value: resources.PHONE_STRING },
		{ label: resources.EMAIL_STRING, value: resources.EMAIL_STRING }
	];
	@track phoneNumberMandatory = false;
	@track accountSettingHide = true;

	@track updatePopup = false;
	@track touch = false;
	@track down = true;
	@track up = false;
	@track pmcName = resources.PHONE_NUMBER_REQUIRED;
	// Declaration of Global variables
	enrolleeids;
	isButtonDeleteDisabled = false;
	isAccessButtonDisabled = false;

	userId = Id;
	caregiverAccountIds;
	rightimg = resources.RIGHT_ICONE;
	firstNameError=resources.FIRST_NAMEERROR;
	lastNameError=resources.LAST_NAMEERROR;
	emailError=resources.EMAIL_ERROR;
	dobError=resources.DOB;
	genderError=resources.GENDER;
	aboveError=resources.ABOVE_ERROR;
	futureError=resources.FUTHURE_DATE;
	minorMsg=resources.MINOR_ERROR;
	mobileError=resources.MOBILE;
	phoneError=resources.PHONE;
	preferredMode=resources.PREFERRED_CONTACT_METHOD;
	countryError=resources.COUNTRY;
	stateError=resources.STATE;
	cityError=resources.CITY;
	streetError=resources.STREET;
	pincodeError=resources.PINCODE;

	Warningicon = resources.WARNING;
	StateCode = [];
	checkbox1Value;
	checkbox2Value;




	// Wire method to retrieve object information for the Account object

	//get country values 
	@wire(COUNTRYS)
	wiredCountries({ error, data }) {
		if (data) {
			this.countryCode = data.map((country) => ({
				label: country.label,
				value: country.value
			}));
		} else if (error) {
			this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT);
		}
	}


	//getcurrunt enrollee

	connectedCallback() {
		loadStyle(this, resources.TEXT_ALIGN);
		try {
			ENROLLEE_DETAILS({ userId: this.userId })

				.then(result => {


					if (result !== null) {
						if (result[0].patientEnrolle !== null) {
							this.enrolleeids = result[0].patientEnrolle.Id;

						} else if (result[0].error !== null) {
							this.showError = true;
							this.errorMessage = result[0].error;
						}
					}
				})
				.catch(error => {

					this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT);// Catching Potential Error from Apex
				});
		} catch (err) {
			this.showToast(resources.ERRORMESSAGE, err.message, resources.ERRORVARIANT);//Catching Potential Error from LWC

		}

	}

	//wire method for prepopulating patient information
	@wire(PATIENT_INFO)
	wiredCaregiverAccounts({ error, data }) {
		try {
			if (data && data !== null) {

				this.accountId = data.Id;
				this.patientFirstName = data.FirstName;
				this.patientLastName = data.LastName;
				this.patientDOB = data.BI_PSP_Birthdate__c;
				this.patientAge = data.BI_PSP_Age__c;
				this.patientEmail = data.PersonEmail;
				this.patientMobilePhone = data.Phone;
				this.relations = data.HealthCloudGA__Gender__pc;
				this.preferredCommunication = data.BI_PSPB_Preferred_Communication_Method__c;
				this.country = data.PersonMailingCountryCode;
				this.state = data.PersonMailingStateCode;
				this.patientCity = data.PersonMailingCity;
				this.patientStreet = data.PersonMailingStreet;
				this.patientZipCode = data.PersonMailingPostalCode;

				if (this.country && this.state) {
					this.loadState();
				}

				if ((this.patientDOB !== null || this.patientDOB !== undefined) && this.patientAge <= resources.MINOR_AGE) {
					this.phoneNumberMandatory = true;
					this.isFirstNameDisabled = false;
					this.isLastNameDisabled = false;
					this.isDOBDisabled = false;
					this.isGenderDisabled = false;
					this.isEmailDisabled = false;
					this.isMobilePhoneDisabled = false;
					this.isPOMDisabled = false;
					this.isMaillingCityDisabled = false;
					this.isMaillingCountryDisabled = false;
					this.isMaillingPostalcodeDisabled = false;
					this.isMaillingStateDisabled = false;
					this.isMaillingStreetDisabled = false;
					this.isMobilePhoneDisabled = false;
					this.isAdult = true;
				}
				else if ((this.patientDOB !== null || this.patientDOB !== undefined) && this.patientAge > resources.MINOR_AGE) {
					if (this.preferredCommunication === 'Email') {
						this.pmcName = resources.PHONE_NUMBER_LABEL;
					} else {
						this.pmcName = resources.PHONE_NUMBER_REQUIRED;
					}
					this.isFirstNameDisabled = true;
					this.accountSettingHide = false;
					this.isLastNameDisabled = true;
					this.isDOBDisabled = true;
					this.isGenderDisabled = true;
					this.isEmailDisabled = true;
					this.isMobilePhoneDisabled = false;
					this.isPOMDisabled = false;
					this.isMaillingCityDisabled = false;
					this.isMaillingCountryDisabled = false;
					this.isMaillingPostalcodeDisabled = false;
					this.isMaillingStateDisabled = false;
					this.isMaillingStreetDisabled = false;
					this.isMobilePhoneDisabled = false;
					this.isAdult = false;
				}

			}

			else if (error) {
				this.showToast(resources.ERRORMESSAGE, error.body.message, resources.ERRORVARIANT);// Catching Potential Error from Apex
			}
			else if (data === null) {
				this.showToast(resources.ERRORMESSAGE, error.body.message, resources.ERRORVARIANT);// Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(resources.ERRORMESSAGE, err.message, resources.ERRORVARIANT); //Catching Potential Error from LWC

		}
	}
	//Get the checkbox values from created cases for patient in account setting(Request access)
	@wire(CHECKBOX_VALUES, { relatedAccounts: '$accountId' })
	wiredCheckboxValues({ data }) {
		try {
			/*For a null check, the error is logged. It cannot be thrown as an Aura handled Exception because there may 
          be a possibility the user has no case records. The toast message can be disruptive to the UI/UX design.*/
			if (data) {

				this.checkbox1Value = data.BI_PSP_Personal_Information_Request__c;

				if (this.checkbox1Value === true) {
					this.isAccessButtonDisabled = false;
					this.colorChnage = 'outlined-button'

				}
				else {
					this.isAccessButtonDisabled = true;
					this.colorChnage = 'button-bttn'
					this.accessMessage = true;
				}
			}

		} catch (error) {
			this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT); //Catching Potential Error from LWC

		}

	}
	//Get the checkbox values from created cases for patient in account setting (Delete Access)
	@wire(CHECKBOX_VALUES_REQUEST, { relatedAccounts: '$accountId' })
	wiredCheckboxValuestwo({ data }) {
		try {
			/*For a null check, the error is logged. It cannot be thrown as an Aura handled Exception because there may 
          be a possibility the user has no case records. The toast message can be disruptive to the UI/UX design.*/
			if (data) {

				this.checkbox2Value = data.BI_PSP_Account_Deletion_Request__c;
				if (this.checkbox2Value === true) {
					this.isButtonDeleteDisabled = false;
					this.colorChanage = 'outlined-button'
				}
				else {
					this.isButtonDeleteDisabled = true;
					this.colorChanage = 'button-bttn'
					this.DeleteMessage = true;
				}
			}
		} catch (error) {
			this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT); //Catching Potential Error from LWC

		}

	}

	//to validate the first name
	handleFieldChange(event) {
		// Assuming you're using event.target.value to get the value from the input field
		this.patientFirstName = event.target.value;
		this.patientFirstName =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);

		this.firstNameErrorMessage = false;


		this.validateFirstName(); // Call the method to validate the first name
	}

	// to validate the first name
	validateFirstName() {
		const FIRST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="FirstName"]');
		if (!this.patientFirstName) {
			this.firstNameErrorMessage = true;
			this.firstNameErrorMessageValid = false;
			// Add CSS classes to highlight the input field and label with an error
			//to get data field value from html
			FIRST_NAME_FIELD.className = 'textInput-err';
			this.template.querySelector('label[data-field="FirstName"]').className = "input-error-label";
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.patientFirstName)) {
			this.firstNameErrorMessage = false;
			this.firstNameErrorMessageValid = true;
			FIRST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="FirstName"]').className =
				"input-error-label";

		} else {
			this.firstNameErrorMessage = false;
			this.firstNameErrorMessageValid = false;
			// Remove CSS classes if the validation passes
			FIRST_NAME_FIELD.className = 'textInput';
			this.template.querySelector('label[data-field="FirstName"]').className = "input-label";
		}
	}


	// to validate the last name
	handlelastname(event) {

		this.patientLastName = event.target.value;
		this.patientLastName =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);

		this.lastNameErrorMessage = false;
		this.validatelastName();

	}

	// to validate the last name
	validatelastName() {
		const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="LastName"]');
		if (!this.patientLastName) {
			this.lastNameErrorMessage = true;
			this.lastNameErrorMessageValid = false;
			// Add CSS classes to highlight the input field and label with an error
			LAST_NAME_FIELD.className = 'textInput-err';
			this.template.querySelector('label[data-field="LastName"]').className = "input-error-label";
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.patientLastName)) {
			this.lastNameErrorMessage = false;
			this.lastNameErrorMessageValid = true;
			LAST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="LastName"]').className =
				"input-error-label";

		}
		else {
			this.lastNameErrorMessage = false;
			this.lastNameErrorMessageValid = false;
			// Remove CSS classes if the validation passes
			LAST_NAME_FIELD.className = 'textInput';
			this.template.querySelector('label[data-field="LastName"]').className = "input-label";
		}
	}


	agecalculationEvent(event) {
		this.patientDOB = event.target.value;
		this.validateDate();
	}

	validateDate() {
		const CURRENTDATE = new Date();
		const SELECTEDDATE = new Date(this.patientDOB);
		const MINAGE = resources.MINOR_AGE;

		// Reset error messages and input styles
		this.resetErrors();

		// Check if the date is in the future
		if (SELECTEDDATE > CURRENTDATE) {
			this.minorErrorThree = true;
			this.dobrequired = false;
			this.dobErrorMessage = false;
			this.setFieldError('Birthdate');

			return;
		}

		if (!this.patientDOB) {

			this.dobrequired = true;
			this.template.querySelector('lightning-input[data-field="Birthdate"]').className = "textInput-err";
			this.template.querySelector('label[data-field="Birthdate"]').className = "input-error-label";

		}
		else {
			this.dobrequired = false;
			this.template.querySelector('lightning-input[data-field="Birthdate"]').className = "textInput";
			this.template.querySelector('label[data-field="Birthdate"]').className = "input-label";

		}
		// Check if the user is a MINOR


		if (SELECTEDDATE > MINAGE || this.patientDOB > MINAGE) {

			this.adult = true;

		}
		// Check if the date is before 1900
		if (SELECTEDDATE < new Date('1900-01-01')) {
			this.minorErrorTwo = true;
			this.dobErrorMessage = false;
			this.setFieldError('Birthdate');
			return;
		}

		// If all validations pass, clear the error message
		this.dobErrorMessage = '';
	}

	resetErrors() {
		this.minorError = false;
		this.minorErrorTwo = false;
		this.minorErrorThree = false;
		this.clearFieldError('Birthdate');
	}

	setFieldError(fieldName) {
		const INPUT_FIELD = this.template.querySelector(`lightning-input[data-field="${fieldName}"]`);
		INPUT_FIELD.className = 'textInput-err';
		const labelField = this.template.querySelector(`label[data-field="${fieldName}"]`);
		labelField.className = 'input-error-label';
	}

	clearFieldError(fieldName) {
		const INPUT_FIELD = this.template.querySelector(`lightning-input[data-field="${fieldName}"]`);
		INPUT_FIELD.className = 'textInput';
		const labelField = this.template.querySelector(`label[data-field="${fieldName}"]`);
		labelField.className = 'input-label';
	}


	//to validate phone field
	handleFielphone(event) {
		this.patientMobilePhone = event.target.value;
		if (this.patientMobilePhone === '' && this.pmcName === resources.PHONE_NUMBER_REQUIRED) {

			this.phoneErrorMessage = true;
			this.template.querySelector('lightning-input[data-field="phone"]').className = "textInput-err";
			this.template.querySelector('label[data-field="phone"]').className = "input-error-label";
		} else {
			this.phoneErrorMessage = false;
			this.template.querySelector('lightning-input[data-field="phone"]').className = "textInput";
			this.template.querySelector('label[data-field="phone"]').className = "input-label";
		}
	}
	//to validate relationship field
	relationshipEvent(event) {
		this.relations = event.target.value;
		this.relationshipErrorMessage = false;
		this.template.querySelector('lightning-combobox[data-field="relationship"]').className = "textInput";
		this.template.querySelector('label[data-field="relationship"]').className = "input-label";

	}

	//to validate preferred communication method
	handlePmcChange(event) {
		this.preferredCommunication = event.target.value;

		if (this.preferredCommunication === resources.SMS_STRING || this.preferredCommunication === resources.PHONE_STRING) {
			this.pmcName = resources.PHONE_NUMBER_REQUIRED;
			if (this.patientMobilePhone === '' || this.patientMobilePhone === undefined) {

				this.phoneErrorMessage = true;
				this.template.querySelector('lightning-input[data-field="phone"]').className = "textInput-err";
				this.template.querySelector('label[data-field="phone"]').className = "input-error-label";
			} else {
				this.pmcName = resources.PHONE_NUMBER_REQUIRED;

				this.phoneErrorMessage = false;
				this.template.querySelector('lightning-input[data-field="phone"]').className = "textInput";
				this.template.querySelector('label[data-field="phone"]').className = "input-label";
			}
		} else {
			this.pmcName = resources.PHONE_NUMBER_LABEL;

			this.phoneErrorMessage = false;
			this.template.querySelector('lightning-input[data-field="phone"]').className = "textInput";
			this.template.querySelector('label[data-field="phone"]').className = "input-label";
		}

		if (this.preferredCommunication === '') {
			this.conPmcErrorMessage = true;
			this.template.querySelector('lightning-combobox[data-field="conPmc"]').className = "textInput-err";
			this.template.querySelector('label[data-field="conPmc"]').className = "input-error-label";
		}
		else {
			this.conPmcErrorMessage = false;
			this.template.querySelector('lightning-combobox[data-field="conPmc"]').className = "textInput";
			this.template.querySelector('label[data-field="conPmc"]').className = "input-label";
		}
	}
	//to validate country field
	handleFielcountry(event) {
		const COUNTRYCLASS = this.template.querySelector('lightning-input[data-field="country"]');
		this.country = event.target.value;
		this.state = null;
		this.loadState();
		if (this.country === '') {
			this.countryCodeMessage = true;
			COUNTRYCLASS.className = 'textInput-err';
			this.template.querySelector('label[data-field="country"]').className = "input-error-label";
		}
		this.countryCodeMessage = false;
		COUNTRYCLASS.className = 'textInput';
		this.template.querySelector('label[data-field="country"]').className = "input-label";
	}
	loadState() {
		STATES({ selectedCountry: this.country })
			.then((result) => {
				this.StateCode = result.map((state) => ({
					label: state.Name,
					value: state.BI_PSPB_StateCode__c
				}));
			})
			.catch((error) => {
				this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT);
			});
	}
	//to validate state field
	handleFieldstate(event) {
		this.state = event.target.value;

		if (this.state === '') {
			this.stateCodeMessage = true;
			this.template.querySelector('lightning-combobox[data-field="state"]').className = "textInput-err";
			this.template.querySelector('label[data-field="state"]').className = "input-error-label";
		}
		else {
			this.stateCodeMessage = false;
			this.template.querySelector('lightning-combobox[data-field="state"]').className = "textInput";
			this.template.querySelector('label[data-field="state"]').className = "input-label";
		}
	}
	//to validate city field
	handleFieldCity(event) {
		const CITYCLASS = this.template.querySelector('lightning-input[data-field="city"]');
		this.patientCity = event.target.value;
		this.patientCity =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		if (this.patientCity === '') {
			this.cityMessage = true;
			this.RpCityErrorMessageValid = false;
			CITYCLASS.className = 'textInput-err';
			this.template.querySelector('label[data-field="city"]').className = "input-error-label";
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.patientCity)) {
			this.cityMessage = false;
			this.RpCityErrorMessageValid = true;
			CITYCLASS.className = 'textInput-err';
			this.template.querySelector('label[data-field="city"]').className = "input-error-label";


		}
		else {
			this.cityMessage = false;
			this.RpCityErrorMessageValid = false;
			CITYCLASS.className = 'textInput';
			this.template.querySelector('label[data-field="city"]').className = "input-label";
		}
	}
	//validate street field
	handleFieldstreet(event) {
		const STREETCLASS = this.template.querySelector('lightning-input[data-field="street"]');
		this.patientStreet = event.target.value;
		if (this.patientStreet === '') {
			this.streetMessage = true;
			STREETCLASS.className = 'textInput-err';
			this.template.querySelector('label[data-field="street"]').className = "input-error-label";
		} else {
			this.streetMessage = false;
			STREETCLASS.className = 'textInput';
			this.template.querySelector('label[data-field="street"]').className = "input-label";
		}
	}
	//validate pincode field
	handleFieldcode(event) {
		const PINCODECLASS = this.template.querySelector('lightning-input[data-field="zipcode"]');
		this.patientZipCode = event.target.value;
		if (this.patientZipCode === '') {
			this.postalCodeMessage = true;
			this.ZipErrorMessagevalid = false;
			PINCODECLASS.className = 'textInput-err';
			this.template.querySelector('label[data-field="zipcode"]').className = "input-error-label";
		}
		else if (!/^[a-zA-Z0-9]+$/u.test(this.patientZipCode)) {
			this.postalCodeMessage = false;
			this.ZipErrorMessagevalid = true;
			PINCODECLASS.className = 'textInput-err';
			this.template.querySelector('label[data-field="zipcode"]').className = "input-error-label";

		} else {
			this.postalCodeMessage = false;
			this.ZipErrorMessagevalid = false;
			PINCODECLASS.className = 'textInput';
			this.template.querySelector('label[data-field="zipcode"]').className = "input-label";
		}

	}

	//validate phone field
	validatePhoneInput(event) {
		const CHARCODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
		if (CHARCODE !== 43 && (CHARCODE < 48 || CHARCODE > 57)) { // Allow only digits (48-57) and the plus symbol (43)
			event.preventDefault(); // Prevent the character from being entered
		}
	}

	//FIRST_NAME and LAST_NAME regex
	handleKeyDown1(event) {
		const ALLOWEDCHARACTERS = /^[A-Za-z]+$/u;
		if (!ALLOWEDCHARACTERS.test(event.key)) {
			event.preventDefault();
		}
	}
	// Not allow paste event in FIRST_NAME and last name
	handlePaste(event) {
		// Prevent default paste behavior
		event.preventDefault();
	}

	handleKeyDownThree(event) {
		event.preventDefault();
	}
	//checks whether all fields have values and updates patient information
	handle_Success() {
		this.validateTheFirstName();
		this.validateLastName();
		this.validateDOB();
		this.validateRelationship();
		this.validateCountry();
		this.validateState();
		this.validateCity();
		this.validateStreet();
		this.validateZipCode();
		this.validatePhoneAndCommunication();
	}
	
	validateTheFirstName() {
		const FIRST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="FirstName"]');
		if (!this.patientFirstName) {
			this.firstNameErrorMessage = true;
			this.firstNameErrorMessageValid = false;
			FIRST_NAME_FIELD.className = 'textInput-err';
			this.template.querySelector('label[data-field="FirstName"]').className = "input-error-label";
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.patientFirstName)) {
			this.firstNameErrorMessage = false;
			this.firstNameErrorMessageValid = true;
			FIRST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="FirstName"]').className = "input-error-label";
		} else {
			this.firstNameErrorMessage = false;
			this.firstNameErrorMessageValid = false;
			FIRST_NAME_FIELD.className = 'textInput';
			this.template.querySelector('label[data-field="FirstName"]').className = "input-label";
		}
	}
	
	validateLastName() {
		const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="LastName"]');
		if (!this.patientLastName) {
			this.lastNameErrorMessage = true;
			this.lastNameErrorMessageValid = false;
			LAST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="LastName"]').className = "input-error-label";
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.patientLastName)) {
			this.lastNameErrorMessage = false;
			this.lastNameErrorMessageValid = true;
			LAST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="LastName"]').className = "input-error-label";
		} else {
			this.lastNameErrorMessage = false;
			this.lastNameErrorMessageValid = false;
			LAST_NAME_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="LastName"]').className = "input-label";
		}
	}
	
	validateDOB() {
		if (!this.patientDOB) {
			this.dobrequired = true;
			this.template.querySelector('lightning-input[data-field="Birthdate"]').className = "textInput-err";
			this.template.querySelector('label[data-field="Birthdate"]').className = "input-error-label";
		} else {
			this.dobrequired = false;
			this.template.querySelector('lightning-input[data-field="Birthdate"]').className = "textInput";
			this.template.querySelector('label[data-field="Birthdate"]').className = "input-label";
			this.validateDate();
		}
	}
	
	validateRelationship() {
		if (!this.relations) {
			this.relationshipErrorMessage = true;
			this.template.querySelector('lightning-combobox[data-field="relationship"]').className = "textInput-err";
			this.template.querySelector('label[data-field="relationship"]').className = "input-error-label";
		} else {
			this.relationshipErrorMessage = false;
			this.template.querySelector('lightning-combobox[data-field="relationship"]').className = "textInput";
			this.template.querySelector('label[data-field="relationship"]').className = "input-label";
		}
	}
	
	validateCountry() {
		if (!this.country) {
			this.countryCodeMessage = true;
			this.template.querySelector('lightning-combobox[data-field="country"]').className = "textInput-err";
			this.template.querySelector('label[data-field="country"]').className = "input-error-label";
		} else {
			this.countryCodeMessage = false;
			this.template.querySelector('lightning-combobox[data-field="country"]').className = "textInput";
			this.template.querySelector('label[data-field="country"]').className = "input-label";
		}
	}
	
	validateState() {
		if (!this.state) {
			this.stateCodeMessage = true;
			this.template.querySelector('lightning-combobox[data-field="state"]').className = "textInput-err";
			this.template.querySelector('label[data-field="state"]').className = "input-error-label";
		} else {
			this.stateCodeMessage = false;
			this.template.querySelector('lightning-combobox[data-field="state"]').className = "textInput";
			this.template.querySelector('label[data-field="state"]').className = "input-label";
		}
	}
	
	validateCity() {
		if (!this.patientCity) {
			this.cityMessage = true;
			this.RpCityErrorMessageValid = false;
			this.template.querySelector('lightning-input[data-field="city"]').className = "textInput-err";
			this.template.querySelector('label[data-field="city"]').className = "input-error-label";
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.patientCity)) {
			this.cityMessage = false;
			this.RpCityErrorMessageValid = true;
			this.template.querySelector('lightning-input[data-field="city"]').className = "textInput-err";
			this.template.querySelector('label[data-field="city"]').className = "input-error-label";
		} else {
			this.cityMessage = false;
			this.RpCityErrorMessageValid = false;
			this.template.querySelector('lightning-input[data-field="city"]').className = "textInput";
			this.template.querySelector('label[data-field="city"]').className = "input-label";
		}
	}
	
	validateStreet() {
		if (!this.patientStreet) {
			this.streetMessage = true;
			this.template.querySelector('lightning-input[data-field="street"]').className = "textInput-err";
			this.template.querySelector('label[data-field="street"]').className = "input-error-label";
		} else {
			this.streetMessage = false;
			this.template.querySelector('lightning-input[data-field="street"]').className = "textInput";
			this.template.querySelector('label[data-field="street"]').className = "input-label";
		}
	}
	
	validateZipCode() {
		if (!this.patientZipCode) {
			this.postalCodeMessage = true;
			this.template.querySelector('lightning-input[data-field="zipcode"]').className = "textInput-err";
			this.template.querySelector('label[data-field="zipcode"]').className = "input-error-label";
		} else if (!/^[a-zA-Z0-9]+$/u.test(this.patientZipCode)) {
			this.postalCodeMessage = false;
			this.ZipErrorMessagevalid = true;
			this.template.querySelector('lightning-input[data-field="zipcode"]').className = "textInput-err";
			this.template.querySelector('label[data-field="zipcode"]').className = "input-error-label";
		} else {
			this.postalCodeMessage = false;
			this.ZipErrorMessagevalid = false;
			this.template.querySelector('lightning-input[data-field="zipcode"]').className = "textInput";
			this.template.querySelector('label[data-field="zipcode"]').className = "input-label";
		}
	}
	
	validatePhoneAndCommunication() {
		if (this.patientAge > resources.MINOR_AGE) {
			this.validatePhone();
			this.validatePreferredCommunication();
			this.validateEmail();
			this.checkAndExecuteUpdate();
		} else {
			this.checkAndUpdateForMinor();
		}
	}
	
	validatePhone() {
		if (!this.patientMobilePhone && (this.preferredCommunication === resources.SMS_STRING || this.preferredCommunication === resources.PHONE_STRING)) {
			this.phoneErrorMessage = true;
			this.setFieldErrorStyles('phone');
		} else {
			this.phoneErrorMessage = false;
		}
	}
	
	validatePreferredCommunication() {
		if (!this.preferredCommunication) {
			this.conPmcErrorMessage = true;
			this.setFieldErrorStyles('conPmc');
		} else {
			this.conPmcErrorMessage = false;
		}
	}
	
	validateEmail() {
		this.emailErrorMessage = !this.patientEmail;
	}
	
	checkAndExecuteUpdate() {
		if (!this.hasAnyError() && !this.hasAnyValidationError()) {
			this.updatePatientDetails();
		}
	}
	
	checkAndUpdateForMinor() {
		if (this.dobrequired === false && this.patientMobilePhone === undefined && !this.hasAnyValidationError()) {
			this.updatePatientDetails();
		}
	}
	
	hasAnyError() {
		return (
			this.firstNameErrorMessage ||
			this.lastNameErrorMessage ||
			this.relationshipErrorMessage ||
			this.countryCodeMessage ||
			this.stateCodeMessage ||
			this.cityMessage ||
			this.streetMessage ||
			this.postalCodeMessage ||
			this.phoneErrorMessage ||
			this.conPmcErrorMessage
		);
	}
	
	hasAnyValidationError() {
		return (
			this.dobrequired ||
			this.ZipErrorMessagevalid ||
			this.minorErrorTwo ||
			this.minorErrorThree ||
			this.minorError ||
			this.dobErrorMessage ||
			this.firstNameErrorMessageValid ||
			this.lastNameErrorMessageValid ||
			this.RpCityErrorMessageValid
		);
	}
	
	setFieldErrorStyles(fieldName) {
		this.template.querySelector(`lightning-input[data-field="${fieldName}"]`).className = "textInput-err";
		this.template.querySelector(`label[data-field="${fieldName}"]`).className = "input-error-label";
	}
	
	updateThePatientDetails() {
		let caregiverDetails = {
			accountId: this.accountId,
			firstName: this.patientFirstName,
			lastName: this.patientLastName,
			personEmail: this.patientEmail,
			personBirthdate: this.patientDOB,
			personGender: this.relations,
			preferredMethodOfContact: this.preferredCommunication,
			street: this.patientStreet,
			city: this.patientCity,
			state: this.state,
			country: this.country,
			postalCode: this.patientZipCode,
			phone: this.patientMobilePhone
		};
	
		UPDATE_PATIENT_DETAILS({
			wrapper: caregiverDetails
		})
		.then(() => {
			this.updatePopup = true;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		})
		.catch(error => {
			this.updatePopup = false;
			this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT); // Catching Potential Error from Apex
		});
	}
	
	
	updatePatientDetails() {
		let caregiverDetails = {
			accountId: this.accountId,
			firstName: this.patientFirstName,
			lastName: this.patientLastName,
			personEmail: this.patientEmail,
			personBirthdate: this.patientDOB,
			personGender: this.relations,
			preferredMethodOfContact: this.preferredCommunication,
			street: this.patientStreet,
			city: this.patientCity,
			state: this.state,
			country: this.country,
			postalCode: this.patientZipCode,
			phone: this.patientMobilePhone
		};
	
		UPDATE_PATIENT_DETAILS({
			wrapper: caregiverDetails
		})
		.then(() => {
			this.updatePopup = true;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		})
		.catch(error => {
			this.updatePopup = false;
			this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT); // Catching Potential Error from Apex
		});
	}
	


	// Now use this placeholderText in your template

	handleDeletPopup() {
		this.isDeletePopupOpen = !this.isDeletePopupOpen;
		document.body.style.overflow = '';
	}
	handleDeletPopupopen() {
		this.isDeletePopupOpen = !this.isDeletePopupOpen;
		document.body.style.overflow = 'hidden';
	}

	handleAccessPopup() {
		this.isAccessPopupOpen = !this.isAccessPopupOpen;
		this.accesspopup = false;
		document.body.style.overflow = '';
	}
	handleAccessPopupopen() {
		this.isAccessPopupOpen = !this.isAccessPopupOpen;
		this.accesspopup = false;
		document.body.style.overflow = 'hidden';
	}
	handleYesButtonClick() {

		this.isButtonDeleteDisabled = true;

		this.colorChanage = 'button-bttn'
		this.DeleteMessage = true;
		this.deletepopup = true;
		this.isDeletePopupOpen = false;
		this.showDiv1 = true;
		document.body.style.overflow = '';

		// Call the Apex method to create a case

		CREATE_CASE()
			.then(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			})
			.catch(error => {
				this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT); // Catching Potential Error
			});


		if (this.checkbox1Value.checked) {
			this.isButtonDeleteDisabled = false;
		}
		else {
			this.isButtonDeleteDisabled = true;
		}

	}

	showToast(title, message, variant) {
		const toastEvent = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant,
		});
		if (typeof window !== 'undefined') {
			this.dispatchEvent(toastEvent);
		}
	}

	handleYesButtonClickTwo() {

		this.isAccessPopupOpen = false;
		this.isAccessButtonDisabled = true;
		this.colorChnage = 'button-btn'
		this.accessMessage = true;
		this.accesspopup = true;
		document.body.style.overflow = '';
		this.showDiv = true;


		// Call the Apex method to create a case

		CREATE_ACCESS_CASE()
			.then(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			})
			.catch(error => {
				this.showToast(resources.ERRORMESSAGE, error.message, resources.ERRORVARIANT); // Catching Potential Error
			});


		if (this.checkbox2Value.checked) {
			this.isAccessButtonDisabled = false;
		}
		else {
			this.isAccessButtonDisabled = true;
		}
	}


	handleclose() {
		this.showDiv = false;
		this.showDiv1 = false;
		this.updatePopup = false;
	}

	click() {
		this.touch = true;
		this.down = false;
		this.up = true;
	}
	notclick() {
		this.touch = false;
		this.down = true;
		this.up = false;
	}


}