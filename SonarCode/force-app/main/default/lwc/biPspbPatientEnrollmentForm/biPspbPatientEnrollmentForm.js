//This LWC is used for create patient detail record enrollment processs.
//Proper naming conventions with camel case for all the variable will be followed in the future releases
// To import Libraries
import { LightningElement, wire, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle } from "lightning/platformResourceLoader";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { NavigationMixin } from "lightning/navigation";

// To import current user ID
import ID from "@salesforce/user/Id";

// Importing Apex classes to interact with Salesforce backend for data retrieval.
import HCP_ACCESSCODE from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.hcpAccessCode";
import UPDATE_LEAD_PATIENT_RECORD from "@salesforce/apex/BI_PSPB_CreateLeadCtrl.insertLead";
import HCP_CREATE from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.hcpCreate";
import ENROLLEE_CAREGIVER_ID from "@salesforce/apex/BI_PSPB_PrepopulateLeadRecCtrl.getEnrolleeCaregiverId";
import VALUES_GET_FROM_TABLE from "@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getPractitionerList";
import LEAD_GENDER_OPTIONS from "@salesforce/apex/BI_PSPB_CreateLeadCtrl.getCommunicationOptions";
import EXISTING_ACCOUNTS from "@salesforce/apex/BI_PSPB_LeadCreationCtrl.getExistingAccounts";
import COUNTRYS from "@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getCountries";
import STATES from "@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getStates";

// Imports labels for descriptive text or identifiers, enhancing accessibility and user understanding.
import PATIENT_FIRSTNAME from "@salesforce/label/c.BI_PSPB_CaregiverFirstNameErrMsg";
import IAM_PATIENT_URL from "@salesforce/label/c.BI_PSPB_IamPatient";
import MINORAGE from "@salesforce/label/c.BI_PSPB_MInorAge";
import PATIENT_LASTNAME from "@salesforce/label/c.BI_PSPB_CaregiverLastNameErrMsg";
import PATIENT_DATEOFBIRTH from "@salesforce/label/c.BI_PSPB_PatientDateOfBirthErrMsg";
import PATIENT_GENDER from "@salesforce/label/c.BI_PSPB_PatientGenterErrMsg";
import PATIENT_EMAIL from "@salesforce/label/c.BI_PSPB_CaregiverEmailErrMsg";
import COUNTRY from "@salesforce/label/c.BI_PSPB_PatientCountryRequiredErrMsg";
import STATE from "@salesforce/label/c.BI_PSPB_PatientStateErrMsg";
import CITY from "@salesforce/label/c.BI_PSPB_PatientCityErrMsg";
import STREET from "@salesforce/label/c.BI_PSPB_PatientStreetErrMsg";
import PINCODE from "@salesforce/label/c.BI_PSPB_PatientZipCodeErrMsg";
import PATIENT_PHONE from "@salesforce/label/c.BI_PSPB_PhoneRequiredErrMsg";
import PREFERRED_CONTACT_METHOD from "@salesforce/label/c.BI_PSPB_PatientPrefferMethodErrMsg";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import DOB_ERROR from "@salesforce/label/c.BI_PSPB_PatientFutureDateErrMsg";
import PS_URL from "@salesforce/label/c.BI_PSPB_PatientSummaryUrl";
import SMS from "@salesforce/label/c.BI_PSP_SmsLabel";
import PHONE from "@salesforce/label/c.BI_PSPB_Phone";
import YES from "@salesforce/label/c.BI_PSP_SoftDelete";
import ERROR_FOUND from "@salesforce/label/c.BI_PSP_RecordNotFoundMsg";
import SHOW_TOAST from "@salesforce/label/c.BI_PSP_ShowToasts";

// Imports resourceUrl to reference external resources for proper rendering and functionality.
import BGPP from "@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo";
import TEXT_ALIGN from "@salesforce/resourceUrl/BI_PSPB_TextAlignmentHcp";
import WARNING_ICON from "@salesforce/resourceUrl/BI_PSP_WarningIcon";
import CALENDER_ICON from "@salesforce/resourceUrl/BI_PSPB_CalenderIconSymp";
import ICON_CSS from "@salesforce/resourceUrl/BI_PSPB_InputSearchIcon";
import OLD_GUY_JPEG_URL from "@salesforce/resourceUrl/BI_PSPB_PatientEntrollAvatar";

// Imports scheme to define structured data exchange protocol within component for consistency and interoperability.
import LEAD from "@salesforce/schema/Lead";
import HEALTHCLOUDGA__GENDER from "@salesforce/schema/Lead.HealthCloudGA__Gender__c";

export default class BiPspbPatientEnrollmentForm extends NavigationMixin(
	LightningElement
) {
	@api
	get selectedValueOne() {
		return this.selectedSearchResultOne?.label || this.selectedSearchResultOne;
	}
	get selectedValues() {
		return this.selectedSearchResult ? this.selectedSearchResult.label : null;
	}
	avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program`;
	avatarContentMid = `We're excited to help you manage your generalized pustular psoriasis (GPP) and
							make the most of your Spevigo® therapy.`;
	avatarContentLast = `You need to be 18 or above for self enrollment.`;
	breakLine = true;
	breakLineOne = true;
	avatarContMid = true;
	avatarContLast = true;
	requiredMsg = false;
	phoneMandotary = true;
	phoneVisible = false;
	emailMandatory = true;
	emailVisible = false;
	isLoaded = false;
	selectedValue;
	searchResultsList;
	searchResults;
	recordId;
	addNewHcpSectionClass = "addNewHcpSection"; // to invoke CSS class
	firstNameErrorMessage = false;
	dobSelfMessage = false;
	physicianErrorMessage = false;
	physicianRequireMessage = false;
	lastNameErrorMessage = false;
	genderErrorMessage = false;
	emailErrorMessage = false;
	careFirstNameErrorMessage = false;
	careLastNameErrorMessage = false;
	isButtonDisabled = false;
	careDobErrorMessage = false;
	hcpFirstNameErrorMessage = false;
	hcpLastNameErrorMessage = false;
	hcpPhoneNumberErrorMessage = false;
	hcpEmailErrorMessage = false;
	hcpAddressLineErrorMessage = false;
	isSearchCleared = false;
	emailError = false;
	selectedCountryCode = "";
	selectedStateCode = "";
	CountryCode = [];
	StateCode = [];
	isUnbranded = false;
	showInfoQuestion = false;
	oldYearError = false;
	RpCityErrorMessageValid = false;
	fieldBox = false;
	variable = false;
	doAccess = true;
	doAccessHcp = false;
	careId;
	hideSearchIcon = true;
	hideUpArrow = "hideuparrow";
	matchEmail = false;
	currentStep = "";
	hcpFirstName = "";
	hcpLastName = "";
	hcpPhone = "";
	hcpEmail = "";
	addressLine = "";
	checkBox;
	checkBoxRequired = false;
	selectedReferringPractitioner = "";
	accessCodeId;
	searchResultEmpty = false;
	accessCode;
	openModal = false;
	dobErrorMessage = false;
	submitModal = false;
	divFalse = true;
	subValue;
	isModalOpen = false;
	phone = "";
	pmc = "";
	country = "";
	state = "";
	city = "";
	street = "";
	zipCode = "";
	firstName = "";
	gender = "";
	email = "";
	lastName = "";
	firstNameErrorMessageValid = false;
	lastNameErrorMessageValid = false;
	phoneNumberMandatory = false;
	phoneNumberVisible = true;
	careDob;
	errorMessage = "";
	conPhoneErrorMessage = false;
	conPmcErrorMessage = false;
	conCountryErrorMessage = false;
	conStateErrorMessage = false;
	conCityErrorMessage = false;
	conStreetErrorMessage = false;
	conZipCodeErrorMessage = false;
	showUpdateForm = true;
	showInsertForm = true;
	selectedPreValues = "";
	error = false;
	age;
	showAccessCode = false;
	showReferringPractitioner = false;
	accessCodeErrorMessage = false;
	accordionStatusClose = false;
	accordionStatus = false;
	minor = false; // Initialize to false
	dob; // Date of Birth attribute
	leadId;
	isAdult = false;
	popUpClass = "popup-hidden";
	showContactNumber = false;
	careEmailErrorMessage = false;
	// Custom Labels for the following 2 variables cannot be created since it truncates the content in mobile devices
	mobileView = `Hello! Welcome to Beyond GPP: The
							Spevigo® Patient...`;
	mobileViewSub =
		`Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program
							 We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.
							 You need to be 18 or above for self enrollment.`;
	selectedOption = {
		src: OLD_GUY_JPEG_URL,
		name: ""
	};
	uniqueEmail;
	uniqueFirstName;
	uniqueLastName;
	uniqueDob;
	selectedCountry;
	selectedAvatarSrc = OLD_GUY_JPEG_URL;
	leadGender;
	PreferredMethodOfCommunication;
	account = "";
	leadIds = "";
	calenderIcon = CALENDER_ICON;
	userId = ID;
	showDetailscg6 = false;
	showDetailscg5 = false;
	showDetailscg4 = false;
	showDetails1 = false;
	showDetailscg2 = false;
	showDetailscg3 = false;
	beyandGpp = BGPP;
	warningIcons = WARNING_ICON;
	label = {
		PATIENT_FIRSTNAME,
		PATIENT_LASTNAME,
		PATIENT_DATEOFBIRTH,
		PATIENT_GENDER,
		PATIENT_EMAIL,
		PATIENT_PHONE,
		PREFERRED_CONTACT_METHOD,
		PINCODE,
		STREET,
		CITY,
		STATE,
		COUNTRY
	};
	picklistOrdered = [];
	picklistOrderedGet = [];
	options = [];
	leadPmc = [];

	// Fetches Lead object info and country picklist values, handles errors.

	@wire(getObjectInfo, { objectApiName: "Lead" })
	objectInfo;
	@wire(COUNTRYS)
	wiredCountries({ error, data }) {
		if (data) {
			this.CountryCode = data.map((country) => ({
				label: country.label,
				value: country.value
			}));
		} else if (error) {
			this.showToast(error);
		}
	}

	// Loads styles and fetches values from Table 1, populating a picklist and handling errors.

	connectedCallback() {
		try {
			loadStyle(this, TEXT_ALIGN);
			loadStyle(this, ICON_CSS);
			VALUES_GET_FROM_TABLE()
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then((result) => {
					if (result !== null && result.length > 0) {
						let i;
						for (i = 0; i < result.length; i++) {
							this.picklistOrderedGet.push({
								label: result[i].Name,
								labelForSpecialist: result[i]?.BI_PSPB_Specialist__c,
								labelForCity: result[i]?.MailingCity,
								value: result[i].Id
							});
						}
						this.picklistOrderedGet = this.picklistOrderedGet.sort((a, b) => {
							if (a.label < b.label) {
								return -1;
							} else if (a.label > b.label) {
								return 1;
							}
							return 0;
						});
					} else if (result === null) {
						this.SHOW_TOAST(ERROR_FOUND);
					}
				});
		} catch (error) {
			this.SHOW_TOAST(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}

	// Call an Apex method to retrieve lead PicklistValues
	@wire(getObjectInfo, { objectApiName: LEAD })
	objectsInfo;
	@wire(getPicklistValues, {
		recordTypeId: "$objectInfo.data.defaultRecordTypeId",
		fieldApiName: HEALTHCLOUDGA__GENDER
	})
	wiredLeadGenderValues({ data, error }) {
		try {
			if (data) {
				this.leadGender = data.values;
			} else if (error) {
				this.SHOW_TOAST(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			}
		} catch (err) {
			this.SHOW_TOAST(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}


	// Call an Apex method to retrieve lead gender options
	@wire(LEAD_GENDER_OPTIONS)
	wiredLeadGenderOptions({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				// Map the Apex response to the format expected by lightning-combobox
				this.leadPmc = data.map((option) => ({ label: option, value: option }));
			} else if (error) {
				this.SHOW_TOAST(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			}
		} catch (err) {
			this.SHOW_TOAST(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	handleCountryCodeChange(event) {
		this.selectedCountryCode = event.detail.value;
		this.selectedStateCode = ""; // Reset selected state when country changes
	}

	goBackToStepOne() {
		const PHYSICIAN_FIELD = this.template.querySelector(
			'lightning-input[data-field="physician"]'
		);
		const HCP_ACCESS_CODE_FIELD = this.template.querySelector(
			'lightning-input[data-field="hcpaccesscode"]'
		);
		this.currentStep = "1";
		this.handleBackProgressBar(2, 1);
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program`;
		this.avatarContentMid = `We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
		this.avatarContentLast = `You need to be 18 or above for self enrollment.`;
		this.breakLine = true;
		this.breakLineOne = true;
		this.avatarContLast = true;
		this.avatarContMid = true;
		this.handleClose();
		this.mobileView = `Hello! Welcome to Beyond GPP: The Spevigo® Patient...`;
		this.mobileViewSub = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
			We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.
			You need to be 18 or above for self enrollment.`;
		if (this.physicianRequireMessage === true) {
			this.physicianRequireMessage = false;

			PHYSICIAN_FIELD.className = "textInput";
		} else if (this.accessCodeErrorMessage === true) {
			this.accessCodeErrorMessage = false;
			HCP_ACCESS_CODE_FIELD.className = "textInput";
		}
	}
	goBackToStepTwo() {
		this.currentStep = "2";
		this.handleBackProgressBar(3, 2);
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.avatarContentTop = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program`;
		this.avatarContentMid = `We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
		this.avatarContentLast = `You need to be 18 or above for self enrollment.`;
		this.breakLine = true;
		this.breakLineOne = true;
		this.avatarContLast = true;
		this.avatarContMid = true;
		this.handleClose();
		this.mobileView = `Hello! Welcome to Beyond GPP: The Spevigo® Patient...`;
		this.mobileViewSub = `Hello! Welcome to Beyond GPP: The Spevigo® Patient Support Program.
		We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.
		You need to be 18 or above for self enrollment.`;
	}
	goBackToStepThree() {
		this.currentStep = "3";
		this.handleBackProgressBar(4, 3);
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.avatarContentTop = `You can search for your physician details in our records.`;
		this.avatarContentMid = `If you are unable to locate them, click Add Physician Information to continue.`;
		this.avatarContentLast = ``;
		this.breakLine = false;
		this.breakLineOne = true;
		this.avatarContLast = false;
		this.avatarContMid = true;
		this.handleClose();
		this.mobileView = `You can search for your physician details in our records...`;
		this.mobileViewSub = `You can search for your physician details in our records.
		If you are unable to locate them, click Add Physician Information to continue.`;
	}
	goBackToStepThreeOne() {
		this.currentStep = "2";
		this.handleBackProgressBar(4, 2);
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.avatarContentTop = `You can search for your physician details in our records.`;
		this.avatarContentMid = `If you are unable to locate them, click Add Physician Information to continue.`;
		this.avatarContentLast = ``;
		this.avatarContMid = true;
		this.breakLine = false;
		this.breakLineOne = true;
		this.avatarContLast = false;
		this.handleClose();
		this.mobileView = `You can search for your physician details in our records...`;
		this.mobileViewSub = `You can search for your physician details in our records.
		If you are unable to locate them, click Add Physician Information to continue.`;
	}
	goBackToStepOnes() {
		this.currentStep = "1";
		this.template.querySelector("div.stepFour").classList.add("slds-hide");
		this.template.querySelector("div.stepOne").classList.remove("slds-hide");
	}
	goBackToStepFour() {
		this.currentStep = "4";
		this.template.querySelector("div.stepFive").classList.add("slds-hide");
		this.template.querySelector("div.stepFour").classList.remove("slds-hide");
	}
	goBackToStepFive() {
		this.currentStep = "5";
		this.template.querySelector("div.stepSix").classList.add("slds-hide");
		this.template.querySelector("div.stepFive").classList.remove("slds-hide");
	}
	goBackToStepSix() {
		this.currentStep = "6";
		this.template.querySelector("div.stepSeven").classList.add("slds-hide");
		this.template.querySelector("div.stepSix").classList.remove("slds-hide");
	}
	goBackToStepSeven() {
		this.currentStep = "7";
		this.template.querySelector("div.stepEight").classList.add("slds-hide");
		this.template.querySelector("div.stepSeven").classList.remove("slds-hide");
	}

	handleProgressBar(from, to) {
		this.template
			.querySelector(`li.li-${from}`)
			.classList.remove("slds-is-active");
		this.template
			.querySelector(`li.li-${from}`)
			.classList.add("slds-is-completed");
		this.template.querySelector(`li.li-${to}`).classList.add("slds-is-active");

		this.template.querySelector(`div.step-${from}`).classList.add("slds-hide");
		this.template.querySelector(`div.step-${to}`).classList.remove("slds-hide");
	}

	handleBackProgressBar(from, to) {
		this.template
			.querySelector(`li.li-${from}`)
			.classList.remove("slds-is-active");
		this.template
			.querySelector(`li.li-${from}`)
			.classList.remove("slds-is-completed");
		this.template
			.querySelector(`li.li-${to}`)
			.classList.remove("slds-is-completed");
		this.template.querySelector(`li.li-${to}`).classList.add("slds-is-active");

		this.template.querySelector(`div.step-${from}`).classList.add("slds-hide");
		this.template.querySelector(`div.step-${to}`).classList.remove("slds-hide");
	}

	goToStepTwo() {
		EXISTING_ACCOUNTS({ email: this.email })
			.then((result) => {
				if (result) {
					this.uniqueEmail = result.map((item) => item.PersonEmail);
					this.uniqueFirstName = result.map((item) => item.FirstName);
					this.uniqueLastName = result.map((item) => item.LastName);
					this.uniqueDob = result.map((item) => item.BI_PSP_Birthdate__c);

					if (!this.UniqueValidation()) {
						//To call the method
						// No need for a return here
					}
				} else {
					if (
						this.dobErrorMessage ||
						this.dobSelfMessage ||
						this.oldYearError
					) {
						return;
					}

					if (!this.patientvalidateForm()) {
						//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
						//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
						this.avatarContentTop = `Hello! Welcome to the Spevigo® patient support program`;
						this.avatarContentMid = `We're excited to help you manage your generalized pustular psoriasis (GPP) and make the most of your Spevigo® therapy.`;
						this.avatarContentLast = `You need to be 18 or above for self enrollment.`;
						this.breakLine = true;
						this.breakLineOne = true;
						this.avatarContLast = true;
						this.avatarContMid = true;
						return;
					}
					this.isUnbranded = false;
					this.matchEmail = false;
					this.handleProgressBar(1, 2);
					this.currentStep = "2";
					//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
					//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
					this.avatarContentTop = `You can search for your physician details in our records.`;
					this.avatarContentMid = `If you are unable to locate them, click Add Physician Information to continue.`;
					this.avatarContentLast = ``;
					this.breakLine = false;
					this.breakLineOne = true;
					this.avatarContLast = false;
					this.avatarContMid = true;
					this.handleClose();
					this.mobileView = `You can search for your physician details in our records...`;
					this.mobileViewSub = `You can search for your physician details in our records.
			If you are unable to locate them, click Add Physician Information to continue.`;
				}
			})
			.catch((error) => {
				this.SHOW_TOAST(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});
	}

	UniqueValidation() {
		let isValid = true;
		if (
			this.uniqueEmail.includes(this.email) &&
			this.uniqueFirstName.includes(this.firstName) &&
			this.uniqueLastName.includes(this.lastName) &&
			this.uniqueDob.includes(this.dob)
		) {
			this.submitModal = true;
			isValid = false;
		} else if (this.uniqueEmail.includes(this.email)) {
			this.matchEmail = true;
			this.emailError = false;
			this.emailErrorMessage = false;
			this.template.querySelector(
				'lightning-input[data-field="email"]'
			).className = "textInput-err";
			this.template.querySelector('label[data-field="email"]').className =
				"input-error-label";
			isValid = false;
		} else {
			this.matchEmail = false;
			this.template.querySelector(
				'lightning-input[data-field="email"]'
			).className = "textInput";
			this.template.querySelector('label[data-field="email"]').className =
				"input-label";
		}

		return isValid;
	}


	goToStepThreeOne() {
		if (!this.physicianvalidateForm()) {
			return;
		}

		const HCP_ACCESS_CODE_FIELD = this.template.querySelector(
			'lightning-input[data-field="hcpaccesscode"]'
		);
		let success = false;

		let promise;

		if (this.accordionStatus) {
			promise = this.handleCreateHcp();
		} else if (this.showAccessCode) {
			promise = this.hcpAccessCodeChange();
		} else {
			promise = Promise.resolve();
		}

		promise
			.then(() => {
				if (this.accordionStatus || this.showReferringPractitioner) {
					success = true;
				} else if (this.showAccessCode) {
					if (!this.accessCodeId) {
						this.accessCodeErrorMessage = true;
						HCP_ACCESS_CODE_FIELD.classList.add("textInput-err");
					} else {
						this.accessCodeErrorMessage = false;
						HCP_ACCESS_CODE_FIELD.classList.remove("textInput-err");
						HCP_ACCESS_CODE_FIELD.classList.add("textInput");
						success = true;
					}
				}

				if (success) {
					this.currentStep = "4";
					this.handleProgressBar(2, 4);
					this.avatarContentTop = `Please provide your contact details on this page`;
					this.avatarContentMid = ``;
					this.avatarContentLast = ``;
					this.avatarContLast = false;
					this.breakLine = false;
					this.breakLineOne = false;
					this.avatarContMid = false;
					this.handleClose();
					this.mobileView =
						"Please provide your contact details on this page...";
					this.mobileViewSub = `Please provide your contact details on this page`;
				}
			})
			.catch((error) => {
				this.SHOW_TOAST(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});
	}

	handleCreateHcp() {
		const NAME = this.hcpFirstName + " " + this.hcpLastName;

		return this.createHcp({
			name: NAME,
			phone: this.hcpPhone,
			email: this.hcpEmail,
			addressLine: this.addressLine
		}).catch((error) => {
			this.SHOW_TOAST(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			return Promise.reject(error);
		});
	}

	createHcp(hcpData) {
		return HCP_CREATE(hcpData)
			.then((LEAD_ID) => {
				this.selectedPreValues = LEAD_ID;
			})
			.catch((error) => {
				this.SHOW_TOAST(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				return Promise.reject(error);
			});
	}

	hcpAccessCodeChange() {
		return HCP_ACCESSCODE({ accessCode: this.accessCode })
			.then((accessId) => {
				this.accessCodeId = accessId.Id;
				this.selectedPreValues = this.accessCodeId;
			})
			.catch((error) => {
				this.error = error;
				return Promise.reject(error);
			});
	}

	// goToStepFour() {
	// 	if (!this.carevalidateForm() || this.minorerror === true) {
	// 		// No need for a return here
	// 	} else {
	// 		this.currentStep = "4";
	// 		this.template.querySelector("div.stepThree").classList.add("slds-hide");
	// 		this.template.querySelector("div.stepFour").classList.remove("slds-hide");
	// 		this.updateBtn();
	// 	}
	// }

	// goToStepFive() {
	// 	this.currentStep = "5";
	// 	this.template.querySelector("div.stepFour").classList.add("slds-hide");
	// 	this.template.querySelector("div.stepFive").classList.remove("slds-hide");
	// }

	checkboxrequire(event) {
		this.checkBox = event.target.checked;
		const CHECK_BOX = this.template.querySelector(
			'span[data-field="checkbox"]'
		);
		if (this.checkBox === "") {
			this.checkBoxRequired = true;
			CHECK_BOX.className = "custom-checkbox-box_Error";
		} else {
			this.checkBoxRequired = false;
			CHECK_BOX.className = "custom-checkbox-box";
		}
	}
	handleKeyDownThree(event) {
		event.preventDefault();
	}

	handleHcpFirstNameChange(event) {
		// Define the field and label elements
		const HCP_FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="pFN"]'
		);
		const LABEL_FIELD = this.template.querySelector('label[data-field="pFN"]');

		// Get and format the HCP first name
		let newFirstName = event.target.value.trim();
		this.hcpFirstName = newFirstName.charAt(0).toUpperCase() + newFirstName.slice(1);

		// Regular expression for valid characters
		const firstNameRegex = /^[a-zA-ZÀ-ž\s\-''`.]+$/u;

		// Check if the new name is valid
		if (this.hcpFirstName === "") {
			// Handle empty name case
			this.hcpFirstNameErrorMessage = true;
			this.firstNameErrorMessageValid = false;
			HCP_FIRST_NAME_FIELD.className = "textInput-err";
			LABEL_FIELD.className = "input-error-label";
		} else if (!firstNameRegex.test(this.hcpFirstName)) {
			// Handle invalid characters case
			this.hcpFirstNameErrorMessage = false;
			this.firstNameErrorMessageValid = true;
			HCP_FIRST_NAME_FIELD.className = "textInput-err";
			LABEL_FIELD.className = "input-error-label";
		} else {
			// Handle valid name case
			this.hcpFirstNameErrorMessage = false;
			this.firstNameErrorMessageValid = false;
			HCP_FIRST_NAME_FIELD.className = "textInput";
			LABEL_FIELD.className = "input-label";
		}
	}

	handleHcpLastNameChange(event) {
		// Define the field and label elements
		const HCP_LAST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="pLN"]'
		);
		const LABEL_FIELD = this.template.querySelector('label[data-field="pLN"]');

		// Get and format the HCP last name
		let newLastName = event.target.value.trim();
		this.hcpLastName = newLastName.charAt(0).toUpperCase() + newLastName.slice(1);

		// Regular expression for valid characters
		const lastNameRegex = /^[a-zA-ZÀ-ž\s\-''`.]+$/u;

		// Check if the new name is valid
		if (this.hcpLastName === "") {
			// Handle empty name case
			this.hcpLastNameErrorMessage = true;
			this.lastNameErrorMessageValid = false;
			HCP_LAST_NAME_FIELD.className = "textInput-err";
			LABEL_FIELD.className = "input-error-label";
		} else if (!lastNameRegex.test(this.hcpLastName)) {
			// Handle invalid characters case
			this.hcpLastNameErrorMessage = false;
			this.lastNameErrorMessageValid = true;
			HCP_LAST_NAME_FIELD.className = "textInput-err";
			LABEL_FIELD.className = "input-error-label";
		} else {
			// Handle valid name case
			this.hcpLastNameErrorMessage = false;
			this.lastNameErrorMessageValid = false;
			HCP_LAST_NAME_FIELD.className = "textInput";
			LABEL_FIELD.className = "input-label";
		}
	}

	handleHcpAccNameChange(event) {
		this.addressLine = event.target.value;
		// Double quotes can't be avoided since it's invoked from CSS
		const HCP_ADDRESS_LINE_FIELD = this.template.querySelector(
			'lightning-textarea[data-field="pAddressLine"]'
		);
		if (this.addressLine === "") {
			this.hcpAddressLineErrorMessage = true;
			this.accordionStatusClose = true;
			this.hideUpArrow = "hidearrowforclose";
			HCP_ADDRESS_LINE_FIELD.className = "textInput-err";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector(
				'label[data-field="pAddressLine"]'
			).className = "input-error-label";
		} else {
			this.hideUpArrow = "hideuparrow";
			this.accordionStatusClose = false;
			this.hcpAddressLineErrorMessage = false;
			HCP_ADDRESS_LINE_FIELD.className = "textInput";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector(
				'label[data-field="pAddressLine"]'
			).className = "input-label";
		}
	}
	handleHcpPhoneChangeEmpty(event) {
		this.hcpPhone = event.target.value;

		// Double quotes can't be avoided since it's invoked from CSS
		const HCP_PHONE_NUMBER_FIELD = this.template.querySelector(
			'lightning-input[data-field="pPhone"]'
		);
		this.hcpPhoneNumberErrorMessage = false;
		this.PhoneerrorMessagevalid = false;

		if (!/^\+?[0-9]+$/u.test(this.hcpPhone)) {
			this.emailMandatory = true;

			this.emailVisible = false;
			this.hcpPhoneNumberErrorMessage = false;
			this.PhoneerrorMessagevalid = true;
			HCP_PHONE_NUMBER_FIELD.className = "textInput-err";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="pPhone"]').className =
				"input-error-label";
		} else {
			this.emailMandatory = true;
			this.emailVisible = false;
			this.PhoneerrorMessagevalid = false;
			HCP_PHONE_NUMBER_FIELD.className = "textInput";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="pPhone"]').className =
				"input-label";
		}
	}
	handleHcpPhoneChange(event) {
		// Get the phone input field and label elements
		const HCP_PHONE_NUMBER_FIELD = this.template.querySelector(
			'lightning-input[data-field="pPhone"]'
		);
		const LABEL_FIELD = this.template.querySelector('label[data-field="pPhone"]');

		// Get and store the phone number value
		const newPhone = event.target.value;
		this.hcpPhone = newPhone;

		// Regular expression for valid phone numbers
		const phoneRegex = /^\+?[0-9]+$/u;

		// Initial states
		this.hcpPhoneNumberErrorMessage = false;
		this.PhoneerrorMessagevalid = false;
		this.emailMandatory = true;
		this.emailVisible = false;

		// Validate phone number
		if (newPhone === "") {
			// Handle empty phone number
			this.hcpPhoneNumberErrorMessage = true;
			HCP_PHONE_NUMBER_FIELD.className = "textInput-err";
			LABEL_FIELD.className = "input-error-label";
		} else if (!phoneRegex.test(newPhone)) {
			// Handle invalid phone number
			this.hcpPhoneNumberErrorMessage = false;
			this.PhoneerrorMessagevalid = true;
			HCP_PHONE_NUMBER_FIELD.className = "textInput-err";
			LABEL_FIELD.className = "input-error-label";
		} else {
			// Handle valid phone number
			this.hcpPhoneNumberErrorMessage = false;
			this.PhoneerrorMessagevalid = false;
			this.emailMandatory = false;
			this.emailVisible = true;
			HCP_PHONE_NUMBER_FIELD.className = "textInput";
			LABEL_FIELD.className = "input-label";
		}
	}


	handleHcpEmailChangeEmpty(event) {
		this.hcpEmail = event.target.value;

		// Double quotes can't be avoided since it's invoked from CSS
		const HCP_EMAIL_FIELD = this.template.querySelector(
			'lightning-input[data-field="pEmail"]'
		);
		this.hcpEmailErrorMessage = false;
		this.emailError = false;
		if (!this.validateEmail(this.hcpEmail)) {
			this.hcpEmailErrorMessage = false;
			this.emailError = true;
			this.matchEmail = false;
			this.accordionStatusClose = true;
			this.hideUpArrow = "hidearrowforclose";
			HCP_EMAIL_FIELD.className = "textInput-err";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="pEmail"]').className =
				"input-error-label";
		} else {
			this.hideUpArrow = "hideuparrow";
			this.accordionStatusClose = false;
			this.emailError = false;
			this.hcpEmailErrorMessage = false;
			HCP_EMAIL_FIELD.className = "textInput";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="pEmail"]').className =
				"input-label";
		}
	}
	handleHcpEmailChange(event) {
		// Define the email field and label elements
		const HCP_EMAIL_FIELD = this.template.querySelector(
			'lightning-input[data-field="pEmail"]'
		);
		const LABEL_FIELD = this.template.querySelector('label[data-field="pEmail"]');

		// Get and store the email value
		const newEmail = event.target.value;
		this.hcpEmail = newEmail;

		// Initial states
		this.hcpEmailErrorMessage = false;
		this.emailError = false;
		this.phoneMandotary = true;
		this.phoneVisible = false;
		this.accordionStatusClose = true;
		this.hideUpArrow = "hidearrowforclose";

		// Validate email
		if (newEmail === "") {
			// Handle empty email case
			this.hcpEmailErrorMessage = true;
			HCP_EMAIL_FIELD.className = "textInput-err";
			LABEL_FIELD.className = "input-error-label";
		} else if (!this.validateEmail(newEmail)) {
			// Handle invalid email case
			this.hcpEmailErrorMessage = false;
			this.emailError = true;
			this.matchEmail = false;
			HCP_EMAIL_FIELD.className = "textInput-err";
			LABEL_FIELD.className = "input-error-label";
		} else {
			// Handle valid email case
			this.phoneMandotary = false;
			this.phoneVisible = true;
			this.accordionStatusClose = false;
			this.hideUpArrow = "hideuparrow";
			HCP_EMAIL_FIELD.className = "textInput";
			LABEL_FIELD.className = "input-label";
		}
	}




	handleHcpAccessCode(event) {
		this.accessCode = event.detail.value;
		const HCP_ACCESS_CODE_FIELD = this.template.querySelector(
			'lightning-input[data-field="hcpaccesscode"]'
		);
		if (this.showAccessCode) {
			if (!HCP_ACCESS_CODE_FIELD.value) {
				this.accessCodeErrorMessage = true;
				HCP_ACCESS_CODE_FIELD.className = "textInput-err";
			} else {
				this.accessCodeErrorMessage = false;
				HCP_ACCESS_CODE_FIELD.className = "textInput";
			}
		}
	}
	handleChange(event) {
		this.selectedReferringPractitioner = event.detail.value;
	}

	showModal() {
		this.openModal = true;
	}
	closeModal() {
		this.openModal = false;
	}

	handleChange2() {
		this.showDetailscg2 = !this.showDetailscg2;
	}

	handleChange3() {
		this.showDetailscg3 = !this.showDetailscg3;
	}

	handleChange1(event) {
		if (event.detail.value === YES) {
			this.showDetails1 = true;
		} else {
			this.showDetails1 = false;
		}
	}

	handleChange4() {
		this.showDetailscg4 = !this.showDetailscg4;
	}

	handleChange5() {
		this.showDetailscg5 = !this.showDetailscg5;
	}

	handleChange6() {
		this.showDetailscg6 = !this.showDetailscg6;
	}

	handleContactSaveSuccess() {
		if (typeof window !== "undefined") {
			this.dispatchEvent(
				new ShowToastEvent({
					title: "Enrollment Completed",
					message: "You have successfully enrolled in Patient Support Program!",
					variant: "success"
				})
			);
		}
	}

	handleNavigation() {
		this[NavigationMixin.Navigate]({
			type: "comm__namedPage",
			attributes: {
				name: "thankyou__c"
			}
		});
	}

	showToast(title, message, variant) {
		if (typeof window !== "undefined") {
			const event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}

	showError(message) {
		if (typeof window !== "undefined") {
			const ERROR_MESSAGE_TOAST = {
				title: "Error",
				message: message,
				variant: "error"
			};
			this.dispatchEvent(
				new CustomEvent(SHOW_TOAST, { detail: ERROR_MESSAGE_TOAST })
			);
		}
	}

	validateFirstName() {
		const FIRST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="FN"]');
		if (!this.firstName) {
			this.firstNameErrorMessage = true;
			this.firstNameErrorMessageValid = false;
			FIRST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="FN"]').className = "input-error-label";
			return false;
		}
		else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.firstName)) {
			this.firstNameErrorMessageValid = true;
			this.firstNameErrorMessage = false;
			FIRST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="FN"]').className = "input-error-label";
			return false;
		}
		this.firstNameErrorMessage = false;
		this.firstNameErrorMessageValid = false;
		FIRST_NAME_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="FN"]').className = "input-label";
		return true;
	}
	validateLastName() {
		const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="LN"]');
		if (!this.lastName) {
			this.lastNameErrorMessage = true;
			this.lastNameErrorMessageValid = false;
			LAST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="LN"]').className = "input-error-label";
			return false;
		}
		else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.lastName)) {
			this.lastNameErrorMessageValid = true;
			this.lastNameErrorMessage = false;
			LAST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="LN"]').className = "input-error-label";
			return false;
		}
		this.lastNameErrorMessage = false;
		this.lastNameErrorMessageValid = false;
		LAST_NAME_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="LN"]').className = "input-label";
		return true;
	}
	validateDOB() {
		const DOB_FIELD = this.template.querySelector('lightning-input[data-field="dob"]');
		if (!DOB_FIELD.value) {
			this.doberrorMessage = true;
			DOB_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="dob"]').className = "input-error-label";
			return false;
		}
		this.doberrorMessage = false;
		DOB_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="dob"]').className = "input-label";
		return true;
	}
	validateGender() {
		const GENDER_FIELD = this.template.querySelector('lightning-combobox[data-field="gender"]');
		if (!GENDER_FIELD.value) {
			this.genderErrorMessage = true;
			GENDER_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="gender"]').className = "input-error-label";
			return false;
		}
		this.genderErrorMessage = false;
		GENDER_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="gender"]').className = "input-label";
		return true;
	}
	validateTheEmail() {
		const EMAIL_FIELD = this.template.querySelector('lightning-input[data-field="email"]');
		if (!EMAIL_FIELD.value) {
			this.emailErrorMessage = true;
			this.matchEmail = false;
			this.emailError = false;
			EMAIL_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="email"]').className = "input-error-label";
			return false;
		}
		else if (!this.validateEmail(EMAIL_FIELD.value)) {
			this.emailErrorMessage = false;
			this.emailError = true;
			this.matchEmail = false;
			EMAIL_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="email"]').className = "input-error-label";
			return false;
		}
		this.emailError = false;
		this.emailErrorMessage = false;
		EMAIL_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="email"]').className = "input-label";
		return true;
	}
	patientvalidateForm() {
		let isValid = true;
	
		isValid = this.validateFirstName() && isValid;
		isValid = this.validateLastName() && isValid;
		isValid = this.validateDOB() && isValid;
		isValid = this.validateGender() && isValid;
		isValid = this.validateTheEmail() && isValid;
	
		return isValid;
	}


	validateAccordionFields() {
		let isValid = true;
	
		isValid = this.validateHcpFirstName() && isValid;
		isValid = this.validateHcpLastName() && isValid;
		isValid = this.validatePhoneNumber() && isValid;
		isValid = this.validateHcpEmail() && isValid;
		isValid = this.validateAddressLine() && isValid;
	
		return isValid;
	}
	
	validateHcpFirstName() {
		const FIELD = this.template.querySelector('lightning-input[data-field="pFN"]');
		const value = FIELD.value;
	
		if (!value) {
			this.accordionStatusClose = true;
			this.doAccessHcp = true;
			this.doAccess = false;
			this.hideUpArrow = " hidearrowforclose";
			this.hcpFirstNameErrorMessage = true;
			this.firstNameErrorMessageValid = false;
			FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pFN"]').className = "input-error-label";
			return false;
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(value)) {
			this.firstNameErrorMessageValid = true;
			this.hcpFirstNameErrorMessage = false;
			FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pFN"]').className = "input-error-label";
			return false;
		} 
			this.hideUpArrow = "hideuparrow";
			this.accordionStatusClose = false;
			this.doAccessHcp = false;
			this.doAccess = true;
			this.hcpFirstNameErrorMessage = false;
			this.firstNameErrorMessageValid = false;
			FIELD.className = "textInput";
			this.template.querySelector('label[data-field="pFN"]').className = "input-label";
			return true;
		
	}
	
	validateHcpLastName() {
		const FIELD = this.template.querySelector('lightning-input[data-field="pLN"]');
		const value = FIELD.value;
	
		if (!value) {
			this.accordionStatusClose = true;
			this.hideUpArrow = " hidearrowforclose";
			this.hcpLastNameErrorMessage = true;
			this.lastNameErrorMessageValid = false;
			FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pLN"]').className = "input-error-label";
			return false;
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(value)) {
			this.lastNameErrorMessageValid = true;
			this.hcpLastNameErrorMessage = false;
			FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pLN"]').className = "input-error-label";
			return false;
		} 
			this.hideUpArrow = "hideuparrow";
			this.accordionStatusClose = false;
			this.hcpLastNameErrorMessage = false;
			FIELD.className = "textInput";
			this.template.querySelector('label[data-field="pLN"]').className = "input-label";
			return true;
		
	}
	
	validatePhoneNumber() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="pPhone"]');
		const EMAIL_FIELD = this.template.querySelector('lightning-input[data-field="pEmail"]');
		const phoneValue = PHONE_FIELD.value;
		const emailValue = EMAIL_FIELD.value;
	
		if (emailValue && !phoneValue) {
			this.hideUpArrow = "hideuparrow";
			this.accordionStatusClose = false;
			this.hcpPhoneNumberErrorMessage = false;
			this.PhoneerrorMessagevalid = false;
			PHONE_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="pPhone"]').className = "input-label";
			return true;
		}
	
		else if (!phoneValue) {
			this.accordionStatusClose = true;
			this.hideUpArrow = " hidearrowforclose";
			this.hcpPhoneNumberErrorMessage = true;
			this.PhoneerrorMessagevalid = false;
			PHONE_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pPhone"]').className = "input-error-label";
			return false;
		}
	
		else if (!/^\+?[0-9]+$/u.test(phoneValue)) {
			this.hcpPhoneNumberErrorMessage = false;
			this.PhoneerrorMessagevalid = true;
			PHONE_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pPhone"]').className = "input-error-label";
			return false;
		}
	
		this.hideUpArrow = "hideuparrow";
		this.accordionStatusClose = false;
		this.hcpPhoneNumberErrorMessage = false;
		this.PhoneerrorMessagevalid = false;
		PHONE_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="pPhone"]').className = "input-label";
		return true;
	}
	
	validateHcpEmail() {
		const EMAIL_FIELD = this.template.querySelector('lightning-input[data-field="pEmail"]');
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="pPhone"]');
		const emailValue = EMAIL_FIELD.value;
		const phoneValue = PHONE_FIELD.value;
	
		if (!emailValue && phoneValue) {
			this.hideUpArrow = "hideuparrow";
			this.accordionStatusClose = false;
			this.emailError = false;
			this.hcpEmailErrorMessage = false;
			EMAIL_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="pEmail"]').className = "input-label";
			return true;
		}
	
		else if (!emailValue) {
			this.accordionStatusClose = true;
			this.hideUpArrow = " hidearrowforclose";
			this.hcpEmailErrorMessage = true;
			this.emailError = false;
			EMAIL_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pEmail"]').className = "input-error-label";
			return false;
		}
	
		else if (!this.validateEmailFormat(emailValue)) {
			this.hcpEmailErrorMessage = false;
			this.emailError = true;
			this.matchEmail = false;
			this.accordionStatusClose = true;
			this.hideUpArrow = " hidearrowforclose";
			EMAIL_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pEmail"]').className = "input-error-label";
			return false;
		}
	
		this.hideUpArrow = "hideuparrow";
		this.accordionStatusClose = false;
		this.emailError = false;
		this.hcpEmailErrorMessage = false;
		EMAIL_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="pEmail"]').className = "input-label";
		return true;
	}
	
	validateAddressLine() {
		const FIELD = this.template.querySelector('lightning-textarea[data-field="pAddressLine"]');
		const value = FIELD.value;
	
		if (!value) {
			this.hcpAddressLineErrorMessage = true;
			this.accordionStatusClose = true;
			this.hideUpArrow = " hidearrowforclose";
			FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="pAddressLine"]').className = "input-error-label";
			return false;
		}
	
		this.hideUpArrow = "hideuparrow";
		this.accordionStatusClose = false;
		this.hcpAddressLineErrorMessage = false;
		FIELD.className = "textInput";
		this.template.querySelector('label[data-field="pAddressLine"]').className = "input-label";
		return true;
	}
	
	validateEmailFormat(email) {
		// Assuming this is a custom method for email validation.
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
		return emailPattern.test(email);
	}
	

	validateNonAccordionFields() {
		let isValid = true;
		const PHYSICIAN_FIELD = this.template.querySelector(
			'lightning-input[data-field="physician"]'
		);
		const HCP_ACCESS_CODE_FIELD = this.template.querySelector(
			'lightning-input[data-field="hcpaccesscode"]'
		);

		if (!this.showAccessCode && !this.showReferringPractitioner) {
			this.requiredMsg = true;
			isValid = false;
		} else {
			this.requiredMsg = false;
		}

		if (this.showAccessCode) {
			if (!HCP_ACCESS_CODE_FIELD.value) {
				this.accessCodeErrorMessage = true;
				HCP_ACCESS_CODE_FIELD.className = "textInput-err";
				isValid = false;
			} else {
				this.accessCodeErrorMessage = false;
				HCP_ACCESS_CODE_FIELD.className = "textInput";
			}
		}

		if (this.showReferringPractitioner) {
			if (this.searchResultEmpty === true) {
				this.physicianRequireMessage = false;
				this.hideSearchIcon = false;
				PHYSICIAN_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="physician"]').className =
					"input-label";
				isValid = false;
			} else if (!PHYSICIAN_FIELD.value) {
				this.physicianRequireMessage = true;
				this.searchResultEmpty = false;
				this.physicianErrorMessage = false;
				PHYSICIAN_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="physician"]').className =
					"input-label";
				isValid = false;
			} else {
				this.physicianRequireMessage = false;
				this.physicianErrorMessage = false;
				this.searchResultEmpty = false;
				this.hideSearchIcon = false;
				PHYSICIAN_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="physician"]').className =
					"input-label";
			}
		}

		return isValid;
	}

	physicianvalidateForm() {
		let isValid = true;

		if (this.accordionStatus) {
			isValid = this.validateAccordionFields();
		} else {
			isValid = this.validateNonAccordionFields();
		}

		return isValid;
	}

	// carevalidateForm() {
	// 	// Add your validation logic here for each required field
	// 	let isValid = true;

	// 	// First Name
	// 	const FIRST_NAME_FIELD = this.template.querySelector(
	// 		'lightning-input-field[data-field="CFN"]'
	// 	);
	// 	if (!FIRST_NAME_FIELD.value) {
	// 		this.careFirstNameErrorMessage = true;
	// 		isValid = false;
	// 	} else {
	// 		this.careFirstNameErrorMessage = false;
	// 	}

	// 	// Last Name
	// 	// Double quotes can't be avoided since it's invoked from CSS
	// 	const LAST_NAME_FIELD = this.template.querySelector(
	// 		'lightning-input-field[data-field="CLN"]'
	// 	);
	// 	if (!LAST_NAME_FIELD.value) {
	// 		this.careLastNameErrorMessage = true;
	// 		isValid = false;
	// 	} else {
	// 		this.careLastNameErrorMessage = false;
	// 	}

	// 	// Date of Birth
	// 	// Double quotes can't be avoided since it's invoked from CSS
	// 	const DOB_FIELD = this.template.querySelector(
	// 		'lightning-input-field[data-field="dob"]'
	// 	);
	// 	if (!DOB_FIELD.value) {
	// 		this.careDobErrorMessage = true;
	// 		DOB_FIELD.className = "textInput-err";
	// 		// Double quotes can't be avoided since it's invoked from CSS
	// 		this.template.querySelector('label[data-field="dob"]').className =
	// 			"input-error-label";
	// 		isValid = false;
	// 	} else {
	// 		this.careDobErrorMessage = false;
	// 		DOB_FIELD.className = "textInput";
	// 		// Double quotes can't be avoided since it's invoked from CSS
	// 		this.template.querySelector('label[data-field="dob"]').className =
	// 			"input-label";
	// 	}

	// 	// Email
	// 	// Double quotes can't be avoided since it's invoked from CSS
	// 	const EMAIL_FIELD = this.template.querySelector(
	// 		'lightning-input-field[data-field="Cemail"]'
	// 	);
	// 	if (!EMAIL_FIELD.value) {
	// 		this.careEmailErrorMessage = true;
	// 		isValid = false;
	// 	} else {
	// 		this.careEmailErrorMessage = false;
	// 	}
	// 	return isValid;
	// }

	accordionBodyChange() {
		this.searchResultsList = null;
		this.physicianRequireMessage = false;
		this.accordionStatus = !this.accordionStatus;
		if (this.accordionStatus === false) {
			this.doAccessHcp = false;
			this.doAccess = true;
			this.hideSearchIcon = true;
			this.hideUpArrow = "hideuparrow";
			this.accordionStatusClose = false;
			this.physicianvalidateFormerrorclear();
		} else {
			this.hideSearchIcon = false;
			// Double quotes can't be avoided since it's invoked from CSS
			const PHYSICIAN_FIELD = this.template.querySelector(
				'lightning-input[data-field="physician"]'
			);
			this.hideSearchIcon = false;
			this.hideUpArrow = "hideuparrow";
			this.physicianErrorMessage = false;
			PHYSICIAN_FIELD.className = "textInput";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="physician"]').className =
				"input-label";
		}
	}
	physicianvalidateFormerrorclear() {
		// Double quotes can't be avoided since it's invoked from CSS for the following

		const HCP_FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="pFN"]'
		);
		const HCP_LAST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="pLN"]'
		);
		const HCP_PHONE_NUMBER_FIELD = this.template.querySelector(
			'lightning-input[data-field="pPhone"]'
		);
		const HCP_EMAIL_FIELD = this.template.querySelector(
			'lightning-input[data-field="pEmail"]'
		);
		const HCP_ADDRESS_LINE_FIELD = this.template.querySelector(
			'lightning-textarea[data-field="pAddressLine"]'
		);

		this.hcpFirstNameErrorMessage = false;
		this.firstNameErrorMessageValid = false;
		HCP_FIRST_NAME_FIELD.className = "textInput";
		// Double quotes can't be avoided since it's invoked from CSS
		this.template.querySelector('label[data-field="pFN"]').className =
			"input-label";

		this.hcpLastNameErrorMessage = false;
		this.lastNameErrorMessageValid = false;
		HCP_LAST_NAME_FIELD.className = "textInput";
		// Double quotes can't be avoided since it's invoked from CSS
		this.template.querySelector('label[data-field="pLN"]').className =
			"input-label";

		this.hcpPhoneNumberErrorMessage = false;
		HCP_PHONE_NUMBER_FIELD.className = "textInput";
		// Double quotes can't be avoided since it's invoked from CSS
		this.template.querySelector('label[data-field="pPhone"]').className =
			"input-label";

		this.emailError = false;
		this.hcpEmailErrorMessage = false;
		HCP_EMAIL_FIELD.className = "textInput";
		// Double quotes can't be avoided since it's invoked from CSS
		this.template.querySelector('label[data-field="pEmail"]').className =
			"input-label";

		this.hcpAddressLineErrorMessage = false;
		HCP_ADDRESS_LINE_FIELD.className = "textInput";
		// Double quotes can't be avoided since it's invoked from CSS
		this.template.querySelector('label[data-field="pAddressLine"]').className =
			"input-label";
	}
	handleAccessCodeChange(event) {
		this.requiredMsg = false;
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		const SELECTED_VALUE = event.target.value;
		if (SELECTED_VALUE === YES) {
			this.showAccessCode = true;
			this.physicianRequireMessage = false;
			this.physicianErrorMessage = false;
			this.doAccess = true;
			this.doAccessHcp = false;
			this.accordionStatus = false;
			this.showReferringPractitioner = false;
			this.showInfoQuestion = false;
			this.accordionStatusClose = false;
			this.searchResultEmpty = false;
			this.hideSearchIcon = true;
			this.selectedSearchResultOne = "";
			this.addNewHcpSectionClass = "addNewHcpSection";
			this.hcpFirstNameErrorMessage = false;
			this.hcpLastNameErrorMessage = false;
			this.hcpPhoneNumberErrorMessage = false;
			this.hcpEmailErrorMessage = false;
			this.hcpAddressLineErrorMessage = false;

			//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
			//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
			this.avatarContentTop = `Please provide us with your access code (you'll find it in your patient welcome kit) for us to find your physician details. If you do not have an access code, click 'no' and add your physician details on the next screen.`;
			this.avatarContentMid = ``;
			this.avatarContentLast = ``;
			this.avatarContLast = false;
			this.avatarContMid = false;
			this.breakLine = false;
			this.breakLineOne = false;
			this.handleClose();
			this.mobileView = `Please provide us with your access code (you'll find it in your...`;
			this.mobileViewSub = `Please provide us with your access code (you'll find it in your patient welcome kit) for us to find your physician details. If you do not have an access code, click 'no' and add your physician details on the next screen.`;
		} else {
			this.showAccessCode = false;
			this.showReferringPractitioner = true;
			this.accessCodeErrorMessage = false;
			this.showInfoQuestion = true;
			this.accessCode = "";
			//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
			//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
			this.avatarContentTop = `You can search for your physician details in our records.`;
			this.avatarContentMid = `If you are unable to locate them, click Add Physician Information to continue.`;
			this.avatarContentLast = ``;
			this.breakLine = false;
			this.breakLineOne = true;
			this.avatarContLast = false;
			this.avatarContMid = true;
			this.handleClose();
			this.mobileView = `You can search for your physician details in our records...`;
			this.mobileViewSub = `You can search for your physician details in our records.
	  If you are unable to locate them, click Add Physician Information to continue.`;
		}
	}

	handleCommunicationMethodChange(event) {
		const SELECTED_VALUE = event.detail.value;
		this.PreferredMethodOfCommunication = SELECTED_VALUE;
		if (SELECTED_VALUE === PHONE || SELECTED_VALUE === SMS) {
			this.showContactNumber = true;
		} else {
			this.showContactNumber = false;
		}
	}

	openPopUp() {
		this.popUpClass = "popup-visible";
	}

	HCPSubmit() {
		// Double quotes can't be avoided since it's invoked from CSS
		let regForm = this.template.querySelector(
			'lightning-record-edit-form[data-id="regForm"]'
		);
		regForm.submit();
		this.popUpClass = "popup-hidden";
		if (typeof window !== "undefined") {
			this.dispatchEvent(
				new ShowToastEvent({
					title: "New Practitioner Submitted",
					message: "You have successfully Submitted!",
					variant: "success"
				})
			);
		}
	}

	Cancel() {
		this.popUpClass = "popup-hidden";
	}

	agecalculationEvent(event) {
		const DOB_DATE = new Date(event.target.value);
		const TODAY = new Date();
		const AGE = Math.floor((TODAY - DOB_DATE) / (365.25 * 24 * 60 * 60 * 1000));
		// Check if the individual is under 18 years old
		this.minor = AGE < MINORAGE;

		// Check if the selected date is in the future
		if (DOB_DATE > TODAY) {
			// Display the validation message
			const ERROR_MESSAGE_DOB = DOB_ERROR;
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('[data-field="dob-error"]').textContent =
				ERROR_MESSAGE_DOB;

			// Clear the input field or take other appropriate actions as needed
			event.target.value = "";

			// You can also prevent the form from submitting if needed
			event.preventDefault();
		} else {
			// Clear the validation message if the date is valid
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('[data-field="dob-error"]').textContent = "";
			if (AGE < MINORAGE) {
				this.patientorcaregiver = this.caregiver;
				this.consentName = this.consentNameCaregiver;
			} else {
				this.patientorcaregiver = this.patient;
				this.consentName = this.consentNamePatient;
			}
		}
	}

	handleLeadIdChange(event) {
		this.leadId = event.target.value;
	}

	updateBtn() {
		if (this.careId !== null) {
			this.showUpdateForm = false;
			this.showInsertForm = true;
		} else {
			// Handle error
			this.showInsertForm = false;
			this.showUpdateForm = true;
		}
	}

	handleButtonClick() {
		try {
			ENROLLEE_CAREGIVER_ID({ firstName: this.firstName })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then((result) => {
					this.recordId = result;
				})
				.catch((error) => {
					this.SHOW_TOAST(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		} catch (err) {
			this.SHOW_TOAST(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	search(event) {
		const INPUT = event.detail.value.toLowerCase();
		const RESULT = this.picklistOrdered.filter((picklistOption) =>
			picklistOption.label.toLowerCase().includes(INPUT)
		);
		this.searchResults = RESULT;
	}
	searchOne(event) {
		const PHYSICIAN_FIELD = this.template.querySelector(
			'lightning-input[data-field="physician"]'
		);
		this.hideSearchIcon = false;


		const INPUT = event.detail.value.toLowerCase();
		if (INPUT === "") {
			this.isSearchCleared = true;
			this.physicianRequireMessage = false;
			this.searchResultEmpty = false;
			this.addNewHcpSectionClass = "addNewHcpSection";
			this.hideSearchIcon = false;
			PHYSICIAN_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="physician"]').className =
				"input-label";
		} else if (INPUT) {
			this.physicianRequireMessage = false;
		} else if (this.showReferringPractitioner) {
			if (this.searchResultEmpty === true) {
				this.physicianRequireMessage = false;
				this.hideSearchIcon = false;
				PHYSICIAN_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="physician"]').className =
					"input-label";
			}
		} else {
			this.physicianRequireMessage = false;
			this.physicianErrorMessage = false;
			this.searchResultEmpty = false;
			PHYSICIAN_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="physician"]').className =
				"input-label";
		}
		this.searchResultsList = this.picklistOrderedGet.filter((picklistOption1) =>
			picklistOption1.label.toLowerCase().includes(INPUT)
		);
		const SEARCHEDRESULTONE = this.picklistOrderedGet.filter(
			(picklistOption1) => picklistOption1.label.toLowerCase().includes(INPUT)
		);
		this.searchResultEmpty = SEARCHEDRESULTONE.length === 0 ? true : false;

		PHYSICIAN_FIELD.className = "textInput-err";
		this.template.querySelector('label[data-field="physician"]').className =
			"input-label";
		if (SEARCHEDRESULTONE.length === 0 ? false : true) {
			PHYSICIAN_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="physician"]').className =
				"input-label";
		}
		if (INPUT.length === 0) {
			this.searchResultsList = null;
		}
	}


	selectSearchResult(event) {
		const SELECTED_VALUE = event.currentTarget.dataset.value;
		this.selectedSearchResult = this.picklistOrdered.find(
			(picklistOption) => picklistOption.value === SELECTED_VALUE
		);
		const MESSAGE_EVENT = new CustomEvent("change", {
			detail: {
				SELECTED_VALUE: this.SELECTED_VALUE
			}
		});
		if (typeof window !== "undefined") {
			this.dispatchEvent(MESSAGE_EVENT);
			this.clearSearchResults();
		}
	}
	selectSearchResultOne(event) {
		const PHYSICIAN_FIELD = this.template.querySelector(
			'lightning-input[data-field="physician"]'
		);
		this.hideSearchIcon = false;
		const SELECTED_VALUE_ONE = event.currentTarget.dataset.value;
		this.selectedPreValues = event.currentTarget.dataset.value;

		this.searchResultEmpty = false;
		this.physicianErrorMessage = false;
		this.physicianRequireMessage = false;
		PHYSICIAN_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="physician"]').className =
			"input-label";
		this.selectedSearchResultOne = this.picklistOrderedGet.find(
			(picklistOption1) => picklistOption1.value === SELECTED_VALUE_ONE
		);

		const MESSAGE_EVENT = new CustomEvent("changes", {
			detail: {
				SELECTED_VALUE_ONE: SELECTED_VALUE_ONE
			}
		});
		this.addNewHcpSectionClass = "addNewHcpSection-disable";
		if (typeof window !== "undefined") {
			this.dispatchEvent(MESSAGE_EVENT);
			this.clearSearchResultsOne();
		}
		this.searchResultsList = null;
	}
	clearSearchResults() {
		this.searchResults = null;
	}
	clearSearchResultsOne() {
		this.searchResultsList = null;
	}
	showPicklistOptions() {
		if (!this.searchResults) {
			this.searchResults = this.picklistOrdered;
		}
	}


	ContactvalidateForm() {
		let isValid = true;
	
		isValid = this.validateMOCField() && isValid;
		isValid = this.validateCountryField() && isValid;
		isValid = this.validateStateField() && isValid;
		isValid = this.validateCityField() && isValid;
		isValid = this.validateStreetField() && isValid;
		isValid = this.validateZipCodeField() && isValid;
		isValid = this.validateCheckBox() && isValid;
		if (this.phoneNumberMandatory) {
			isValid = this.validatePhoneField() && isValid;
		}
	
		return isValid;
	}
	
	validateMOCField() {
		const field = this.template.querySelector('lightning-combobox[data-field="conPmc"]');
		if (!field.value) {
			this.conPmcErrorMessage = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conPmc"]').className = "input-error-label";
			return false;
		} 
			this.conPmcErrorMessage = false;
			field.className = "textInput";
			this.template.querySelector('label[data-field="conPmc"]').className = "input-label";
			return true;
		
	}
	
	validateCountryField() {
		const field = this.template.querySelector('lightning-combobox[data-field="conCountry"]');
		if (!field.value) {
			this.conCountryErrorMessage = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conCountry"]').className = "input-error-label";
			return false;
		} 
			this.conCountryErrorMessage = false;
			field.className = "textInput";
			this.template.querySelector('label[data-field="conCountry"]').className = "input-label";
			return true;
		
	}
	
	validateStateField() {
		const field = this.template.querySelector('lightning-combobox[data-field="conState"]');
		if (!field.value) {
			this.conStateErrorMessage = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conState"]').className = "input-error-label";
			return false;
		} 
			this.conStateErrorMessage = false;
			field.className = "textInput";
			this.template.querySelector('label[data-field="conState"]').className = "input-label";
			return true;
		
	}
	
	validateCityField() {
		const field = this.template.querySelector('lightning-input[data-field="conCity"]');
		if (!field.value) {
			this.conCityErrorMessage = true;
			this.RpCityErrorMessageValid = false;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conCity"]').className = "input-error-label";
			return false;
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.city)) {
			this.conCityErrorMessage = false;
			this.RpCityErrorMessageValid = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conCity"]').className = "input-error-label";
			return false;
		} 
			this.conCityErrorMessage = false;
			this.RpCityErrorMessageValid = false;
			field.className = "textInput";
			this.template.querySelector('label[data-field="conCity"]').className = "input-label";
			return true;
		
	}
	
	validateStreetField() {
		const field = this.template.querySelector('lightning-textarea[data-field="conStreet"]');
		if (!field.value) {
			this.conStreetErrorMessage = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conStreet"]').className = "input-error-label";
			return false;
		}
			this.conStreetErrorMessage = false;
			field.className = "textInput";
			this.template.querySelector('label[data-field="conStreet"]').className = "input-label";
			return true;
		
	}
	
	validateZipCodeField() {
		const field = this.template.querySelector('lightning-input[data-field="conZipCode"]');
		this.ZiperrorMessagevalid = false;
		if (!field.value) {
			this.conZipCodeErrorMessage = true;
			this.ZiperrorMessagevalid = false;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conZipCode"]').className = "input-error-label";
			return false;
		} else if (!/^[a-zA-Z0-9]+$/u.test(this.ZIP_CODE)) {
			this.conZipCodeErrorMessage = false;
			this.ZiperrorMessagevalid = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conZipCode"]').className = "input-error-label";
			return false;
		} 
			this.conZipCodeErrorMessage = false;
			this.ZiperrorMessagevalid = false;
			field.className = "textInput";
			this.template.querySelector('label[data-field="conZipCode"]').className = "input-label";
			return true;
		
	}
	
	validateCheckBox() {
		const checkBox = this.template.querySelector('span[data-field="checkbox"]');
		if (!this.checkBox) {
			this.checkBoxRequired = true;
			checkBox.className = "custom-checkbox-box_Error";
			return false;
		} 
			this.checkBoxRequired = false;
			checkBox.className = "custom-checkbox-box";
			return true;
		
	}
	
	validatePhoneField() {
		const field = this.template.querySelector('lightning-input[data-field="conPhoneNumber"]');
		if (!field.value) {
			this.conPhoneErrorMessage = true;
			this.PhoneerrorMessagevalid = false;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conPhoneNumber"]').className = "input-error-label";
			return false;
		} else if (!/^\+?[0-9]+$/u.test(this.phone)) {
			this.conPhoneErrorMessage = false;
			this.PhoneerrorMessagevalid = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="conPhoneNumber"]').className = "input-error-label";
			return false;
		} 
			this.conPhoneErrorMessage = false;
			field.className = "textInput";
			this.template.querySelector('label[data-field="conPhoneNumber"]').className = "input-label";
			return true;
		
	}
	
	handleFirstNameChange(event) {
		const FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="FN"]'
		);
		this.firstName = event.target.value;
		this.firstName =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.firstName)) {
			this.firstNameErrorMessageValid = true;
			this.firstNameErrorMessage = false;
			FIRST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="FN"]').className =
				"input-error-label";
		} else if (this.firstName === "") {
			this.firstNameErrorMessage = true;
			FIRST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="FN"]').className =
				"input-error-label";
			this.firstNameErrorMessageValid = false;
		} else {
			this.firstNameErrorMessageValid = false;
			this.firstNameErrorMessage = false;
			FIRST_NAME_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="FN"]').className =
				"input-label";
		}
	}

	handlelastNameChange(event) {
		// Double quotes can't be avoided since it's invoked from CSS
		const LAST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="LN"]'
		);
		this.lastName = event.target.value;
		this.lastName =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.lastName)) {
			this.lastNameErrorMessageValid = true;
			this.lastNameErrorMessage = false;
			LAST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="LN"]').className =
				"input-error-label";
		} else if (this.lastName === "") {
			this.lastNameErrorMessage = true;
			this.lastNameErrorMessageValid = false;
			LAST_NAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="LN"]').className =
				"input-error-label";
		}
		else {
			this.lastNameErrorMessage = false;
			this.lastNameErrorMessageValid = false;
			LAST_NAME_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="LN"]').className =
				"input-label";
		}

	}
	handleGenderChange(event) {
		// Double quotes can't be avoided since it's invoked from CSS
		const GENDER_FIELD = this.template.querySelector(
			'lightning-combobox[data-field="gender"]'
		);
		this.gender = event.target.value;
		if (this.gender === "") {
			this.genderErrorMessage = true;
			this.lastNameErrorMessageValid = false;
			GENDER_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="gender"]').className =
				"input-error-label";
		} else {
			this.genderErrorMessage = false;
			this.lastNameErrorMessageValid = false;
			GENDER_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="gender"]').className =
				"input-label";
		}
	}
	handleDobChange(event) {
		this.dob = event.target.value;
		const SELECTED_DATE_ONES = new Date(this.dob);
		const CURRENT_DATE = new Date();
		const YEAR = SELECTED_DATE_ONES.getFullYear();
		const DOB_FIELD = this.template.querySelector(
			'lightning-input[data-field="dob"]'
		);
		if (YEAR < 1900) {
			this.oldYearError = true;
			DOB_FIELD.className = "textInput-err";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error-label";
		} else {
			this.oldYearError = false;
			DOB_FIELD.className = "textInput";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="dob"]').className =
				"input-label";
		}
		if (!DOB_FIELD.value) {
			this.doberrorMessage = true;
			DOB_FIELD.className = "textInput-err";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error-label";
		} else {
			this.doberrorMessage = false;
			DOB_FIELD.className = "textInput";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="dob"]').className =
				"input-label";
		}

		const MIN_AGE = MINORAGE;
		const Age = Math.floor(
			(CURRENT_DATE - SELECTED_DATE_ONES) / (365.25 * 24 * 60 * 60 * 1000)
		);

		if (Age < MIN_AGE) {
			this.dobSelfMessage = true;
			DOB_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error-label";
		} else {
			this.dobSelfMessage = false;
			DOB_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-label";
		}

		this.validateDate();
	}

	validateDate() {
		// Double quotes can't be avoided since it's invoked from CSS
		const DOB_FIELD = this.template.querySelector(
			'lightning-input[data-field="dob"]'
		);
		const SELECTED_DATE_ONES = new Date(this.dob);
		const YEAR = SELECTED_DATE_ONES.getFullYear();
		if (YEAR < 1900) {
			this.oldYearError = true;
			DOB_FIELD.className = "textInput-err";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error-label";
		} else {
			this.oldYearError = false;
			DOB_FIELD.className = "textInput";
			// Double quotes can't be avoided since it's invoked from CSS
			this.template.querySelector('label[data-field="dob"]').className =
				"input-label";
		}
		// Validate that the date is not in the future
		const CURRENT_DATE = new Date();
		const SELECTED_DATE = new Date(this.dob);
		if (SELECTED_DATE > CURRENT_DATE) {
			this.dobErrorMessage = DOB_ERROR;
			this.dobSelfMessage = false;
			DOB_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error-label";
			return;
		}
		this.dobErrorMessage = false;

		// Validate that the user is not a minor (you can set a minimum age)
		const MIN_AGE = MINORAGE;
		const Age = Math.floor(
			(CURRENT_DATE - SELECTED_DATE_ONES) / (365.25 * 24 * 60 * 60 * 1000)
		);

		if (Age < MIN_AGE) {
			this.dobSelfMessage = true;
			DOB_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="dob"]').className =
				"input-error-label";

			return;
		}
		// If both validations pass, clear the error message
		this.dobErrorMessage = false;
	}

	handleEmailChange(event) {
		// Double quotes can't be avoided since it's invoked from CSS
		this.email = event.target.value;

		const EMAIL_FIELD = this.template.querySelector(
			'lightning-input[data-field="email"]'
		);
		if (this.email === "") {
			this.emailErrorMessage = true;
			this.matchEmail = false;
			this.emailError = false;
			EMAIL_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="email"]').className =
				"input-error-label";
		} else if (!this.validateEmail(this.email)) {
			this.emailErrorMessage = false;
			this.emailError = true;
			this.matchEmail = false;
			EMAIL_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="email"]').className =
				"input-error-label";
		} else {
			this.emailError = false;
			this.emailErrorMessage = false;
			this.matchEmail = false;
			EMAIL_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="email"]').className =
				"input-label";
		}

	}

	handlePhoneChange(event) {
		// Double quotes can't be avoided since it's invoked from CSS
		this.phone = event.target.value;
		this.phone =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const PHONE_FIELD = this.template.querySelector(
			'lightning-input[data-field="conPhoneNumber"]'
		);
		if (this.phone === "") {
			this.conPhoneErrorMessage = true;
			this.PhoneerrorMessagevalid = false;
			PHONE_FIELD.className = "textInput-err";
			this.template.querySelector(
				'label[data-field="conPhoneNumber"]'
			).className = "input-error-label";
		} else if (!/^\+?[0-9]+$/u.test(this.phone)) {
			this.conPhoneErrorMessage = false;
			this.PhoneerrorMessagevalid = true;
			PHONE_FIELD.className = "textInput-err";
			this.template.querySelector(
				'label[data-field="conPhoneNumber"]'
			).className = "input-error-label";
		} else {
			this.conPhoneErrorMessage = false;
			this.PhoneerrorMessagevalid = false;
			PHONE_FIELD.className = "textInput";
			this.template.querySelector(
				'label[data-field="conPhoneNumber"]'
			).className = "input-label";
		}
	}
	handlePhoneChangeempty(event) {
		this.phone = event.target.value;
		const PHONE_FIELD = this.template.querySelector(
			'lightning-input[data-field="conPhoneNumber"]'
		);
		if (this.phone === "") {
			this.conPhoneErrorMessage = false;
			this.PhoneerrorMessagevalid = false;
			PHONE_FIELD.className = "textInput";
			this.template.querySelector(
				'label[data-field="conPhoneNumber"]'
			).className = "input-label";
		} else if (!/^\+?[0-9]+$/u.test(this.phone)) {
			this.conPhoneErrorMessage = false;
			this.PhoneerrorMessagevalid = true;
			PHONE_FIELD.className = "textInput-err";
			this.template.querySelector(
				'label[data-field="conPhoneNumber"]'
			).className = "input-error-label";
		} else {
			this.conPhoneErrorMessage = false;
			this.PhoneerrorMessagevalid = false;
			PHONE_FIELD.className = "textInput";
			this.template.querySelector(
				'label[data-field="conPhoneNumber"]'
			).className = "input-label";
		}
	}
	handlePmcChange(event) {
		this.pmc = event.target.value;
		const MOC_FIELD = this.template.querySelector(
			'lightning-combobox[data-field="conPmc"]'
		);
		if (this.pmc === SMS || this.pmc === PHONE) {
			this.phoneNumberMandatory = true;
			this.phoneNumberVisible = false;
			this.conPmcErrorMessage = false;
			MOC_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="conPmc"]').className =
				"input-label";
		} else {
			this.phoneNumberMandatory = false;
			this.phoneNumberVisible = true;
			this.conPmcErrorMessage = true;
			MOC_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="conPmc"]').className =
				"input-error-label";
			if (this.pmc === "") {
				this.conPmcErrorMessage = true;
				MOC_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="conPmc"]').className =
					"input-error-label";
			} else {
				this.conPmcErrorMessage = false;
				MOC_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="conPmc"]').className =
					"input-label";
			}
		}
	}

	handleCountryChange(event) {
		this.country = event.target.value;
		STATES({ selectedCountry: this.country })
			.then((result) => {
				this.StateCode = result.map((state) => ({
					label: state.Name,
					value: state.BI_PSPB_StateCode__c
				}));
			})
			.catch((error) => {
				this.showToast(error);
			});
		// Double quotes can't be avoided since it's invoked from CSS
		this.country = event.target.value;
		const COUNTRY_FIELD_CONT = this.template.querySelector(
			'lightning-combobox[data-field="conCountry"]'
		);
		if (this.country === "") {
			this.conCountryErrorMessage = true;
			COUNTRY_FIELD_CONT.className = "textInput-err";
			this.template.querySelector('label[data-field="conCountry"]').className =
				"input-error-label";
		} else {
			this.conCountryErrorMessage = false;
			COUNTRY_FIELD_CONT.className = "textInput";
			this.template.querySelector('label[data-field="conCountry"]').className =
				"input-label";
		}
	}
	handleStateChange(event) {
		// Double quotes can't be avoided since it's invoked from CSS
		this.state = event.target.value;
		const STATE_FIELD_CONT = this.template.querySelector(
			'lightning-combobox[data-field="conState"]'
		);
		if (this.state === "") {
			this.conStateErrorMessage = true;
			STATE_FIELD_CONT.className = "textInput-err";
			this.template.querySelector('label[data-field="conState"]').className =
				"input-error-label";
		} else {
			this.conStateErrorMessage = false;
			STATE_FIELD_CONT.className = "textInput";
			this.template.querySelector('label[data-field="conState"]').className =
				"input-label";
		}
	}
	handleCityChange(event) {
		// Double quotes can't be avoided since it's invoked from CSS
		this.city = event.target.value;
		this.city =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const CITY_FIELD = this.template.querySelector(
			'lightning-input[data-field="conCity"]'
		);
		if (this.city === "") {
			this.conCityErrorMessage = true;
			this.RpCityErrorMessageValid = false;
			CITY_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="conCity"]').className =
				"input-error-label";
		} else if (!/^[a-zA-ZÀ-ž\s\-''`.]+$/u.test(this.city)) {
			this.conCityErrorMessage = false;
			this.RpCityErrorMessageValid = true;
			CITY_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="conCity"]').className =
				"input-error-label";
		} else {
			this.conCityErrorMessage = false;
			this.RpCityErrorMessageValid = false;
			CITY_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="conCity"]').className =
				"input-label";
		}
	}
	handleStreetChange(event) {
		// Double quotes can't be avoided since it's invoked from CSS
		this.street = event.target.value;
		this.street =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const STREET_FIELD = this.template.querySelector(
			'lightning-textarea[data-field="conStreet"]'
		);
		if (this.street === "") {
			this.conStreetErrorMessage = true;
			STREET_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="conStreet"]').className =
				"input-error-label";
		} else {
			this.conStreetErrorMessage = false;
			STREET_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="conStreet"]').className =
				"input-label";
		}
	}
	handleZipCodeChange(event) {
		// Double quotes can't be avoided since it's invoked from CSS
		this.zipCode = event.target.value;
		this.zipCode =
			event.target.value.trim().charAt(0).toUpperCase() +
			event.target.value.trim().slice(1);
		const ZIP_CODE = this.template.querySelector(
			'lightning-input[data-field="conZipCode"]'
		);

		if (this.zipCode === "") {
			this.conZipCodeErrorMessage = true;
			this.ZiperrorMessagevalid = false;
			ZIP_CODE.className = "textInput-err";
			this.template.querySelector('label[data-field="conZipCode"]').className =
				"input-error-label";
		} else if (!/^[a-zA-Z0-9]+$/u.test(this.zipCode)) {
			this.conZipCodeErrorMessage = false;
			this.ZiperrorMessagevalid = true;
			ZIP_CODE.className = "textInput-err";
			this.template.querySelector('label[data-field="conZipCode"]').className =
				"input-error-label";
		} else {
			this.conZipCodeErrorMessage = false;
			this.ZiperrorMessagevalid = false;
			ZIP_CODE.className = "textInput";
			this.template.querySelector('label[data-field="conZipCode"]').className =
				"input-label";
		}
	}

	handleCreateLead() {
		let globalThis = window;
		if (!this.ContactvalidateForm()) {
			return;
		}
		let leadWrapper = {
			firstName: this.firstName,
			lastName: this.lastName,
			dateOfBirth: this.dob,
			gender: this.gender,
			email: this.email,
			phone: this.phone,
			prefferedMethodOfCom: this.pmc,
			country: this.country,
			state: this.state,
			city: this.city,
			street: this.street,
			zipCode: this.zipCode,
			selectedPrescription: this.selectedPreValues
		};

		try {
			this.isButtonDisabled = true;
			UPDATE_LEAD_PATIENT_RECORD({ leadWrapper: leadWrapper })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then((leadId) => {
					this.leadIds = leadId;

					globalThis?.localStorage.setItem("recordId", this.leadIds);

					this.isLoaded = true;
					globalThis.location.assign(PS_URL);
					// Perform any additional actions on success
				})
				.catch((error) => {
					this.error = error;
					// Check if it's a specific Salesforce API error
					if (error.body && error.body.message) {
						this.SHOW_TOAST(ERROR_MESSAGE, error.message, ERROR_VARIANT);
						// Handle specific error cases if needed
					} else {
						this.SHOW_TOAST(ERROR_MESSAGE, error.message, ERROR_VARIANT);
						// Handle other types of errors
					}
				});
		} catch (err) {
			// Handle any unexpected errors
			this.SHOW_TOAST(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}

	}
	goToHome() {
		let globalThis = window;
		globalThis.location.assign(IAM_PATIENT_URL);
	}

	openModalOne() {
		// Handle your submit logic here

		// Set the isModalOpen to true to show the modal
		this.isModalOpen = true;
	}

	closeModalOne() {
		// Set the isModalOpen to false to hide the modal
		this.isModalOpen = false;
	}

	openItchinessModal() {
		this.submitModal = true;
	}
	closeItchinessModal() {
		this.submitModal = false;
	}

	validateEmail(email) {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|.('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u
			);
	}

	handleKeyDown(event) {
		const CHAR_CODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
		if (CHAR_CODE !== 43 && (CHAR_CODE < 48 || CHAR_CODE > 57)) {
			// Allow only digits (48-57) and the plus symbol (43)
			event.preventDefault(); // Prevent the character from being entered
		}
	}

	click() {
		this.subValue = this.mobileView;
		this.mobileView = this.mobileViewSub;
		this.divFalse = false;
		this.fieldBox = true;
	}
	handleClose() {
		this.divFalse = true;
		this.mobileView = this.subValue;
		this.fieldBox = false;
	}
}