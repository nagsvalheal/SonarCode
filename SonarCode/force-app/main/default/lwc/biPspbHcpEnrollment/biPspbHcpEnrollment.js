//This lightningWebcomponent used for Create a lead for Guest User Created By HCP.
//To import libraries
import { LightningElement, wire,track} from "lwc";
import { loadStyle } from "lightning/platformResourceLoader";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

//To import Apex class
import CREATE_LEAD_RECORD from "@salesforce/apex/BI_PSPB_EnrollmentHcpAndPatient.createLead";
import CREATE_HCP_RECORD from "@salesforce/apex/BI_PSPB_EnrollementPhysician.hcpCreate";
import GET_EXISTING_ACCOUNTS from "@salesforce/apex/BI_PSPB_EnrollementUtilities.getExistingAccounts";
import CREATE_CAREGIVER_RECORD from "@salesforce/apex/BI_PSPB_EnrollementCaregiver.caregiverCreate";
import CREATE_PRESCRIPTION_RECORD from "@salesforce/apex/BI_PSPB_EnrollementPrescription.prescriptionCreate";
import CREATE_CONSENT_RECORD from "@salesforce/apex/BI_PSPB_EnrollementConsent.consentCreate";
import PRODUCT_LIST from "@salesforce/apex/BI_PSPB_ProductListCtrl.getProductList";
import REFERRING_PRACTITIONER from "@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getPractitionerList";
import PRESCRITION_DATA from "@salesforce/apex/BI_PSPB_ProductListCtrl.getPrescritionData";
import COUNTRY from "@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getCountries";
import STATE from "@salesforce/apex/BI_PSPB_ReferringPractitionerCtrl.getStates";

//To import schema for object
import LEAD from "@salesforce/schema/Lead";
import CONTACT from "@salesforce/schema/Contact";
import PRACTICE_TYPE from "@salesforce/schema/Contact.BI_PSPB_Practice_Type__c";
import GENDER from "@salesforce/schema/Lead.HealthCloudGA__Gender__c";
import FREQUENCY_UNIT from "@salesforce/schema/BI_PSPB_Lead_Prescription__c.BI_PSPB_Frequency_Unit__c";
import LEAD_PRESCRIPTION from "@salesforce/schema/BI_PSPB_Lead_Prescription__c";
import LEAD_CAREGIVER from "@salesforce/schema/BI_PSPB_Lead_Caregiver__c";
import RELATIONSHIP from "@salesforce/schema/BI_PSPB_Lead_Caregiver__c.BI_PSPB_Relationship_to_Patient__c";


//To import custom label
import REFERRING_PRACTICE from "@salesforce/label/c.BI_PSPB_PhysicianDetailsErrMsg";
import PHYSICIAN_FIRST_NAME from "@salesforce/label/c.BI_PSPB_PatientFirstNameErrMsg";
import PHYSICIAN_LAST_NAME from "@salesforce/label/c.BI_PSPB_PatientLastNameErrMsg";
import LICENSE_NUMBER from "@salesforce/label/c.BI_PSPB_PhysicianLicenseErrMsg";
import PRACTICE from "@salesforce/label/c.BI_PSPB_PracticeNameErrMsg";
import Minorvalue from "@salesforce/label/c.BI_PSPB_MInorAge";
import PRACTICE_TYPE_ERR from "@salesforce/label/c.BI_PSPB_PhysicianPracticeTypeErrMsg";
import PHYSICIAN_EMAIL from "@salesforce/label/c.BI_PSPB_PatientEmailErrMsg";
import PHYSICIAN_PHONE from "@salesforce/label/c.BI_PSPB_PhysicianPhoneErrMsg";
import PHYSICIAN_COUNTRY from "@salesforce/label/c.BI_PSPB_PatientCountryRequiredErrMsg";
import PHYSICIAN_STATE from "@salesforce/label/c.BI_PSPB_PatientStateErrMsg";
import PHYSICIAN_CITY from "@salesforce/label/c.BI_PSPB_PatientCityErrMsg";
import PHYSICIAN_STREET from "@salesforce/label/c.BI_PSPB_PatientStreetErrMsg";
import PHYSICIAN_ZIPCODE from "@salesforce/label/c.BI_PSPB_PatientZipCodeErrMsg";
import PATIENT_FIRST_NAME from "@salesforce/label/c.BI_PSPB_PatientFirstNameErrMsg";
import PATIENT_LAST_NAME from "@salesforce/label/c.BI_PSPB_PatientLastNameErrMsg";
import PATIENT_DATE_OF_BIRTH from "@salesforce/label/c.BI_PSPB_PatientDateOfBirthErrMsg";
import PATIENT_GENDER from "@salesforce/label/c.BI_PSPB_PatientGenterErrMsg";
import PATIENT_EMAIL from "@salesforce/label/c.BI_PSPB_PatientEmailErrMsg";
import PATIENT_FUTURE_DATE from "@salesforce/label/c.BI_PSPB_PatientFutureDateErrMsg";
import CAREGIVER_FIRST_NAME from "@salesforce/label/c.BI_PSPB_CaregiverFirstNameErrMsg";
import CAREGIVER_LAST_NAME from "@salesforce/label/c.BI_PSPB_CaregiverLastNameErrMsg";
import CAREGIVER_DATE_OF_BIRTH from "@salesforce/label/c.BI_PSPB_MinnorCaregiverErrMsg";
import CAREGIVER_RELATIONSHIP from "@salesforce/label/c.BI_PSPB_CaregiverRelationErrMsg";
import CAREGIVER_EMAIL from "@salesforce/label/c.BI_PSPB_PatientEmailErrMsg";
import DRUGNAME from "@salesforce/label/c.BI_PSPB_DrugNameErrMsg";
import DRUGCODE from "@salesforce/label/c.BI_PSPB_DrugCodeErrMsg";
import DOSAGE from "@salesforce/label/c.BI_PSPB_DosageErrMsg";
import DOSAGE_UNITS from "@salesforce/label/c.BI_PSPB_DosageUnitErrMsg";
import FREQUENCY from "@salesforce/label/c.BI_PSPB_FrequencyErrMsg";
import FREQUENCY_UNITS from "@salesforce/label/c.BI_PSPB_FrequencyUnitErrMsg";
import PRESCRIBED_DATE from "@salesforce/label/c.BI_PSPB_PrescribedDateErrMsg";
import PRESCRIBED_FUTURE_DATE from "@salesforce/label/c.BI_PSPB_PrescribedFutureDateErrMsg";
import LABEL_GENDER from "@salesforce/label/c.BI_PSPB_HealthCloudGender";
import LAST_NAME from "@salesforce/label/c.BI_PSPB_LastName";
import FIRSTNAME from "@salesforce/label/c.BI_PSPB_FirstName";
import HCP from "@salesforce/label/c.BI_PSPB_IamHcp";
import PHONE from "@salesforce/label/c.BI_PSPB_Phone";
import LABEL_PRACTICE_NAME from "@salesforce/label/c.BI_PSPB_PracticeName";
import LABEL_LICENSE_NUMBER from "@salesforce/label/c.BI_PSPB_LicenseNumber";
import MAILING_POSTAL_CODE from "@salesforce/label/c.BI_PSPB_MailingPostalCode";
import MAILING_STREET from "@salesforce/label/c.BI_PSPB_MailingStreet";
import MAILING_CITY from "@salesforce/label/c.BI_PSPB_MailingCity";
import MAILING_STATECODE from "@salesforce/label/c.BI_PSPB_MailingStateCode";
import MAILING_COUNTRYCODE from "@salesforce/label/c.BI_PSPB_MailingCountryCode";
import FAX from "@salesforce/label/c.BI_PSPB_Fax";
import PRACTICE_TYPEE from "@salesforce/label/c.BI_PSPB_PracticeType";
import HCP_SUMMARY from "@salesforce/label/c.BI_PSPB_HcpSummaryUrl";
import REFILL from "@salesforce/label/c.BI_PSPB_Refill";
import FREQUENCY_VALUE from "@salesforce/label/c.BI_PSPB_Frequency";
import DOSAGE_VALUE from "@salesforce/label/c.BI_PSPB_Dosage";
import QUANTITY from "@salesforce/label/c.BI_PSPB_Quantity";
import FREQUCNCY_UNIT from "@salesforce/label/c.BI_PSPB_FrequencyUnit";
import DOSAGE_CODE from "@salesforce/label/c.BI_PSPB_DosageCode";
import DRUG_NAME from "@salesforce/label/c.BI_PSPB_DrugName";
import CAREGIVER_PHONE from "@salesforce/label/c.BI_PSPB_CaregiverPhone";
import CAREGIVER_MAIL from "@salesforce/label/c.BI_PSPB_CaregiverEmail";
import CAREGIVER_FIRSTNAME from "@salesforce/label/c.BI_PSPB_CaregiverFirstName";
import CAREGIVER_LASTNAME from "@salesforce/label/c.BI_PSPB_CaregiverLastName";
import CAREGIVER_RELATION from "@salesforce/label/c.BI_PSPB_CaregiverRelationship";
import EMAIL from "@salesforce/label/c.BI_PSP_NotificationEmail";
import AGREE from "@salesforce/label/c.BI_PSPB_AgreeErrMsg";
import ERROR_FOUND from "@salesforce/label/c.BI_PSP_RecordNotFoundMsg";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import BRANDED_URL from "@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl";
import BGpp from "@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo";
import ICON_CSS from "@salesforce/resourceUrl/BI_PSPB_InputSearchIcon";
import TEXT_ALIGN from "@salesforce/resourceUrl/BI_PSPB_TextAlignmentHcp";
import warning from "@salesforce/resourceUrl/BI_PSPB_WarningIcon";
// To import Static resource
import PATIENT_AVATAR from "@salesforce/resourceUrl/BI_PSPB_HcpEntrollmentPatientAvatar";

export default class BiPspbHcpEnrollment extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	searchResults;
	avatarContentTop = `Thank you for choosing Spevigo® for your patients with GPP.`;
	avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo® Patient Support Program, please
						complete the form on this page.`;
	isLoaded = false;
	level = '03';
	numThree = false;
	numFour = false;
	practicetype;
	searchResultsOne;
	isButtonDisabled = false;
	searchResultsTwo;

	mailingCountryCode;
	@track leadFields = {};
	@track caregiverFields = {};
	@track hcpFields = {};
	@track prescriptionFields = {};
	@track consentFields = {};
	fieldMobile = false;
	referringErrorMessage = false;
	firstnameErrorMessage = false;
	lastnameErrorMessage = false;
	relationshipErrorMessage = false;
	dobErrorMessage = false;
	genderErrorMessage = false;
	emailErrorMessage = false;
	careFirstnameErrorMessage = false;
	careLastnameErrorMessage = false;
	careDobErrorMessage = false;
	careEmailErrorMessage = false;
	oneNineZeroZeroErrors = false;
	careOneNineZerZeroErrors = false;
	presOneNineZeroZeroErrors = false;
	code;
	hcpId;
	unique = false;
	matchEmail = false;
	rpFirstnameErrorMessage = false;
	rpLastnameErrorMessage = false;
	rpStateLicenseErrorMessage = false;
	rpPracticeNameErrorMessage = false;
	rpPracticeTypeErrorMessage = false;
	rpPhoneErrorMessage = false;
	rpEmailErrorMessage = false;
	rpStateCodeErrorMessage = false;
	rpCityErrorMessage = false;
	rpStreetErrorMessage = false;
	rpPostalCodeErrorMessage = false;
	drugErrorMessage = false;
	dateErrorMessage = false;
	authorizeErrorMessage = false;
	RpEmailErrorValid = false;
	emailErrorValid = false;
	cEmailErrorValid = false;
	createHcp = false;
	error;
	errors;
	fieldsMandatory = "para";
	errorss;
	minorError;
	isAddNew = false;
	physicianIdInputDisabled = false;
	matchCaregiverEmail = false;
	physicianNameInputDisabled = false;
	addNewHcpSectionClass = "addNewHcpSection";
	searchValueOne = "";
	searchValueTwo = "";
	searchValue = "";
	searchResultEmptyOne = "";
	searchResultEmptyTwo = "";
	searchResultEmpty = "";
	selectedunit;
	isSafari = false;
	rpCityErrorMessageValid = false;
	mobileValue =
		`Thank you for choosing Spevigo® for your patients with GPP...`;
	divFalse = true;
	firstnameErrorMessagevaild = false;
	lastnameErrorMessagevaild = false;
	phnErrorValid = false;
	rpFirstnameErrorMessageVaild = false;
	rpLastnameErrorMessageValid = false;
	rpStateLicenseErrorMessageValid = false;
	rpFaxErrorMessage = false;
	careFirstnameErrorMessageValid = false;
	careLastnameErrorMessageValid = false;
	popupClass = "popup-hidden";
	currentStep;
	mobileValueTwo =
		`Thank you for choosing Spevigo® for your patients with GPP. 
	To enroll your patients in the Beyond GPP: The Spevigo® Patient Support 
	Program, please complete the form on this page.`;
	openModal = false;
	searchMain = true;
	searchMainTwo = true;
	searchValueLogo = true;
	selectedInitials = "";
	selectedName = "";
	isDropdownOpen = false;
	picklistOrderedTwo = [];
	selectedOption = {
		src: PATIENT_AVATAR,
		name: ""
	};
	StateCode;

	label = {
		PHYSICIAN_FIRST_NAME,
		REFERRING_PRACTICE,
		PHYSICIAN_LAST_NAME,
		LICENSE_NUMBER,
		PRACTICE,
		PRACTICE_TYPE_ERR,
		PHYSICIAN_EMAIL,
		PHYSICIAN_PHONE,
		PHYSICIAN_COUNTRY,
		PHYSICIAN_STATE,
		PHYSICIAN_CITY,
		PHYSICIAN_STREET,
		PATIENT_FIRST_NAME,
		PHYSICIAN_ZIPCODE,
		PATIENT_LAST_NAME,
		PATIENT_DATE_OF_BIRTH,
		PATIENT_GENDER,
		PATIENT_EMAIL,
		PATIENT_FUTURE_DATE,
		CAREGIVER_FIRST_NAME,
		CAREGIVER_LAST_NAME,
		CAREGIVER_DATE_OF_BIRTH,
		CAREGIVER_RELATIONSHIP,
		CAREGIVER_EMAIL,
		DRUGNAME,
		DRUGCODE,
		DOSAGE,
		DOSAGE_UNITS,
		FREQUENCY,
		FREQUENCY_UNITS,
		PRESCRIBED_DATE,
		PRESCRIBED_FUTURE_DATE,
		AGREE
	};
	BGpp = BGpp;
	warning = warning;
	uniqueEmail;
	uniqueFName;
	uniqueLname;
	uniqueDOB;
	caregiverID;
	prescriptionID;
	consentID;
	selectedCountry;
	selectedAvatarSrc = PATIENT_AVATAR;

	selectedSearchResultTwo;
	hcpIdVariable;
	picklistOrdered = [];
	picklistOrderedOne = [];
	selectedSearchResult;
	selectedSearchResultOne;
	picklistOrderedThree = [];
	selectedSearchResultThree;

	get SELECTED_VALUE() {
		return this.selectedSearchResult?.label || this.searchValue;
	}
	get selectedValueOne() {
		return this.selectedSearchResultOne?.label || this.searchValueOne;
	}
	get selectedValueTwo() {
		return this.selectedSearchResultTwo?.label || this.searchValueTwo;
	}

	get selectedValueThree() {
		return this.selectedSearchResultThree?.label || this.searchValueThree;
	}

	threeclick() {
		this.mobileValue = this.mobileValueTwo;
		this.divFalse = false;
		this.fieldMobile = true;
	}
	handleClose() {
		this.divFalse = true;
		this.fieldMobile = false;
		this.mobileValue = `Thank you for choosing Spevigo® for your patients with GPP...`;
	}

	//To fetch the lead object data using schema
	@wire(getObjectInfo, { objectApiName: LEAD })
	objectInfo;

	//To fetch the picklist values for Gender
	@wire(getPicklistValues, {
		recordTypeId: "$objectInfo.data.defaultRecordTypeId",
		fieldApiName: GENDER
	})
	leadGenderValues({ data, error }) {
		try {
			if (data) {
				this.leadGender = data.values;
			} else if (error) {
				this.leadGender = undefined; //Since it's taken from the schema builder, error message will not be displayed and it will be undefined
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	//To fetch the contact object in schema
	@wire(getObjectInfo, { objectApiName: CONTACT })
	objectInfos;

	//To fetch the picklist values for Practice type
	@wire(getPicklistValues, {
		recordTypeId: "$objectInfos.data.defaultRecordTypeId",
		fieldApiName: PRACTICE_TYPE
	})
	practicetypeValues({ error, data }) {
		try {
			if (data) {
				this.practicetype = data.values;
			} else if (error) {
				this.practicetype = undefined; //Since it's taken from the schema builder, error message will not be displayed and it will be undefined

				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	//To fetch Lead_Prescription__c object using schema
	@wire(getObjectInfo, { objectApiName: LEAD_PRESCRIPTION })
	objectInf;

	//To fetch the picklist values for Frequency_Unit__c
	@wire(getPicklistValues, {
		recordTypeId: "$objectInf.data.defaultRecordTypeId",
		fieldApiName: FREQUENCY_UNIT
	})
	FrequencyUnitValues({ error, data }) {
		try {
			if (data) {
				this.FrequencyUnit = data.values;
			} else if (error) {
				this.FrequencyUnit = undefined; //Since it's taken from the schema builder, error message will not be displayed and it will be undefined

				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	//To fetch Lead_caregiver__c object using schema
	@wire(getObjectInfo, { objectApiName: LEAD_CAREGIVER })
	objectInfocaregiver;

	//To fetch the picklist values for Relationship_to_Patient__c
	@wire(getPicklistValues, {
		recordTypeId: "$objectInfocaregiver.data.defaultRecordTypeId",
		fieldApiName: RELATIONSHIP
	})
	RelationshipValues({ error, data }) {
		try {
			if (data) {
				this.Relationship = data.values;
			} else if (error) {
				this.Relationship = undefined; //Since it's taken from the schema builder, error message will not be displayed and it will be undefined

				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}
	validateFirstNamePattern() {
        return /^[a-zA-ZÀ-ž\s\-''`.]+$/u;
    }
	PhysicianFnameErr() {
		const FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="pFN"]'
		);
        FIRST_NAME_FIELD.className = "textInput-err";
					this.template.querySelector('label[data-field="pFN"]').className =
						"input-error-label";
    }
	PhysicianFname() {
		const FIRST_NAME_FIELD = this.template.querySelector(
			'lightning-input[data-field="pFN"]'
		);
        FIRST_NAME_FIELD.className = "textInput";
					this.template.querySelector('label[data-field="pFN"]').className =
						"input-label";
    }
	PhysicianLnameErr() {
		const LAST_NAME_CLASS = this.template.querySelector(
			'lightning-input[data-field="pLN"]'
		);
        LAST_NAME_CLASS.className = "textInput-err";
					this.template.querySelector('label[data-field="pLN"]').className =
						"input-error-label";
    }
	PhysicianLname() {
		const LAST_NAME_CLASS = this.template.querySelector(
			'lightning-input[data-field="pLN"]'
		);
        LAST_NAME_CLASS.className = "textInput";
					this.template.querySelector('label[data-field="pLN"]').className =
						"input-label";
    }
	PhysicianEmailErr() {
		const EMAIL_CLASS = this.template.querySelector(
			'lightning-input[data-field="pEmail"]'
		);
        EMAIL_CLASS.className = "textInput-err";
		this.template.querySelector('label[data-field="pEmail"]').className =
			"input-error-label";
    }
	PhysicianEmail() {
		const EMAIL_CLASS = this.template.querySelector(
			'lightning-input[data-field="pEmail"]'
		);
		EMAIL_CLASS.className = "textInput";
		this.template.querySelector('label[data-field="pEmail"]').className =
			"input-label";
    }
	PhysicianPhoneErr() {
		const PHONE_FIELD = this.template.querySelector(
			'lightning-input[data-field="pPhone"]'
		);
        PHONE_FIELD.className = "textInput-err";
					this.template.querySelector('label[data-field="pPhone"]').className =
						"input-error-label";
    }
	PhysicianPhone() {
		const PHONE_FIELD = this.template.querySelector(
			'lightning-input[data-field="pPhone"]'
		);
		PHONE_FIELD.className = "textInput";
					this.template.querySelector('label[data-field="pPhone"]').className =
						"input-label";
    }
	//This is Input onchange function for Patient details form in Hcp Enrollment
	handleInputChange(event) {
		if (event.target.name === LABEL_GENDER) {
			this.selectedGender = event.detail.value;
		} else {
			const FIELD_NAME = event.target.name;
			const FIELD_VALUE = event.target.value;
			this.leadFields[FIELD_NAME] = FIELD_VALUE;
			if (FIELD_NAME === FIRSTNAME) {
				//this.leadFields.FirstName = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
				this.leadFields.FirstName =
					event.target.value.trim().charAt(0).toUpperCase() +
					event.target.value.trim().slice(1);

				if (this.leadFields.FirstName === "") {
					this.firstnameErrorMessage = true;
					this.firstnameErrorMessagevaild = false;
					this.PhysicianFnameErr();
				} else {
					if (!this.validateFirstNamePattern().test(this.leadFields.FirstName)) {
						this.PhysicianFnameErr();
						this.firstnameErrorMessagevaild = true;
						this.firstnameErrorMessage = false;
					} else {
						this.firstnameErrorMessagevaild = false;
						this.firstnameErrorMessage = false;
						this.PhysicianFname();
					}
				}
			} else if (FIELD_NAME === LAST_NAME) {
				this.leadFields.LastName =
					event.target.value.trim().charAt(0).toUpperCase() +
					event.target.value.trim().slice(1);
				
				if (this.leadFields.LastName === "") {
					this.lastnameErrorMessage = true;
					this.lastnameErrorMessagevaild = false;
					this.PhysicianLnameErr();
				} else {
					if (!this.validateFirstNamePattern().test(this.leadFields.LastName)) {
						this.PhysicianLnameErr();
						this.lastnameErrorMessagevaild = true;
						this.lastnameErrorMessage = false;
					} else {
						this.lastnameErrorMessagevaild = false;
						this.lastnameErrorMessage = false;
						this.PhysicianLname();
					}
				}
			} else if (FIELD_NAME === EMAIL) {
				this.leadFields.Email = event.target.value;
				if (!this.leadFields.Email) {
					this.PhysicianEmailErr();
					this.emailErrorMessage = true;
					this.emailErrorValid = false;
					this.matchEmail = false;
				} else {
					this.emailErrorMessage = false;
					this.emailErrorValid = false;
					this.matchEmail = false;
					this.PhysicianEmail();

					// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

					if (!this.validateEmailRegex().test(this.leadFields.Email)) {
						this.emailErrorValid = true;
						this.matchEmail = false;
						this.PhysicianEmailErr();
					} else {
						this.emailErrorValid = false;
						this.PhysicianEmail();
					}
				}
			} else if (FIELD_NAME === PHONE) {
				this.leadFields.Phone = event.target.value;
				

				if (!this.validatePhoneRegex().test(this.leadFields.Phone)) {
					this.phnErrorValid = true;
					this.PhysicianPhoneErr();
				} else {
					this.phnErrorValid = false;
					this.PhysicianPhone();
					if (this.validatePhoneRegex().test(this.leadFields.Phone)) {
						this.phnErrorValid = false;
						this.PhysicianPhone();
					}
					if (this.leadFields.Phone === "") {
						this.phnErrorValid = false;
						this.PhysicianPhone();
					}
				}
			}
		}
	}
	PhysicianGenderErr() {
			this.template.querySelector(
				'lightning-combobox[data-field="pGender"]'
			).className = "textInput-err";
			this.template.querySelector('label[data-field="pGender"]').className =
				"input-error-label";
		}
	
	PhysicianGender() {
		this.template.querySelector(
			'lightning-combobox[data-field="pGender"]'
		).className = "textInput";
		this.template.querySelector('label[data-field="pGender"]').className =
			"input-label";
	}
	handleGenderChange(event) {
		this.selectedGender = event.target.value;
		if (this.selectedGender === "") {
			this.genderErrorMessage = true;

			this.PhysicianGenderErr();
		} else {
			this.genderErrorMessage = false;
			this.PhysicianGender();
		}
	}

	//This is Input onchange function for Physician details form in Hcp Enrollment
	handleInputChangehcp(event) {
		const FIELD_NAME_HCP = event.target.name;
		const TARGET_VALUE_HCP = event.target.value;

		switch (FIELD_NAME_HCP) {
			case FIRSTNAME:
				this.handleFirstNameChange(TARGET_VALUE_HCP, event);
				break;
			case LAST_NAME:
				this.handleLastNameChange(TARGET_VALUE_HCP, event);
				break;
			case LABEL_PRACTICE_NAME:
				this.handlePracticeNameChange(TARGET_VALUE_HCP, event);
				break;
			case LABEL_LICENSE_NUMBER:
				this.handleLicenseNumberChange(TARGET_VALUE_HCP, event);
				break;
			case PRACTICE_TYPEE:
				this.handlePracticeTypeChange(TARGET_VALUE_HCP);
				break;
			case EMAIL:
				this.handleEmailChange(TARGET_VALUE_HCP, event);
				break;
			case PHONE:
				this.handlePhoneChange(TARGET_VALUE_HCP, event);
				break;
			case FAX:
				this.handleFaxChange(TARGET_VALUE_HCP, event);
				break;
			case MAILING_COUNTRYCODE:
				this.handleCountryCodeChange(TARGET_VALUE_HCP);
				break;
			case MAILING_STATECODE:
				this.handleStateCodeChange(TARGET_VALUE_HCP);
				break;
			case MAILING_CITY:
				this.handleCityChange(TARGET_VALUE_HCP, event);
				break;
			case MAILING_STREET:
				this.handleStreetChange(TARGET_VALUE_HCP);
				break;
			case MAILING_POSTAL_CODE:
				this.handlePostalCodeChange(TARGET_VALUE_HCP, event);
				break;
				default:
              // do nothing

		}
	}
	FirstNameTextErr() {
		const FIRST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hFN"]');
		FIRST_NAME_FIELD.className = "textInput-err";
		this.template.querySelector('label[data-field="hFN"]').className = "input-error-label";
	}
	FirstNameText() {
		const FIRST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hFN"]');
		FIRST_NAME_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="hFN"]').className = "input-label";
	}
	handleFirstNameChange(value) {
		this.hcpFields.firstname = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
		

		if (this.hcpFields.firstname === "") {
			this.rpFirstnameErrorMessage = true;
			this.rpFirstnameErrorMessageVaild = false;
			this.FirstNameTextErr();
		} else if (!this.validateFirstNamePattern().test(this.hcpFields.firstname)) {
			this.FirstNameTextErr();
			this.rpFirstnameErrorMessageVaild = true;
			this.rpFirstnameErrorMessage = false;
		} else {
			this.rpFirstnameErrorMessageVaild = false;
			this.rpFirstnameErrorMessage = false;
			this.FirstNameText();
		}
	}
	LastNameErr() {
		const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hLN"]');
		LAST_NAME_FIELD.className = "textInput-err";
		this.template.querySelector('label[data-field="hLN"]').className = "input-error-label";
	}
	LastNameText() {
		const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hLN"]');
		LAST_NAME_FIELD.className = "textInput";
	this.template.querySelector('label[data-field="hLN"]').className = "input-label";
	}
	handleLastNameChange(value) {
		this.hcpFields.lastname = value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
		

		if (this.hcpFields.lastname === "") {
			this.rpLastnameErrorMessage = true;
			this.rpLastnameErrorMessageValid = false;
			this.LastNameErr();
		} else if (!this.validateFirstNamePattern().test(this.hcpFields.lastname)) {
			this.LastNameErr();
			this.rpLastnameErrorMessageValid = true;
			this.rpLastnameErrorMessage = false;
		} else {
			this.rpLastnameErrorMessageValid = false;
			this.rpLastnameErrorMessage = false;
			this.LastNameText();
		}
	}
	PracticeNameErr() {
		const PRACTICE_NAME = this.template.querySelector('lightning-input[data-field="hPN"]');
		PRACTICE_NAME.className = "textInput-err";
			this.template.querySelector('label[data-field="hPN"]').className = "input-error-label";
	}
	PracticeName() {
		const PRACTICE_NAME = this.template.querySelector('lightning-input[data-field="hPN"]');
		PRACTICE_NAME.className = "textInput";
			this.template.querySelector('label[data-field="hPN"]').className = "input-label";
	}
	handlePracticeNameChange(value) {
		this.hcpFields.PRACTICE_NAME = value.charAt(0).toUpperCase() + value.slice(1);
		

		if (this.hcpFields.PRACTICE_NAME === "") {
			this.rpPracticeNameErrorMessage = true;
			this.RPPracticenameerrorMessagevalid = false;
			this.PracticeNameErr();
		} else if (!this.validateFirstNamePattern().test(this.hcpFields.PRACTICE_NAME)) {
			this.RPPracticenameerrorMessagevalid = true;
			this.rpPracticeNameErrorMessage = false;
			this.PracticeNameErr();
		} else {
			this.RPPracticenameerrorMessagevalid = false;
			this.rpPracticeNameErrorMessage = false;
			this.PracticeName();
		}
	}
	LicenseNumberErr() {
		const LICENSE_FIELD = this.template.querySelector('lightning-input[data-field="hLicense"]');
		LICENSE_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="hLicense"]').className = "input-error-label";
	}
	LicenseNumber() {
		const LICENSE_FIELD = this.template.querySelector('lightning-input[data-field="hLicense"]');
		LICENSE_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="hLicense"]').className = "input-label";
	}
	validateLisencePattern() {
        return /^\d+$/u;
    }
	handleLicenseNumberChange(value) {
		this.hcpFields.license = value;
		

		if (!this.validateLisencePattern().test(this.hcpFields.license)) {
			this.rpStateLicenseErrorMessage = false;
			this.rpStateLicenseErrorMessageValid = true;
			this.LicenseNumberErr();
		} else {
			this.rpStateLicenseErrorMessageValid = false;
			if (this.hcpFields.license === "") {
				this.rpStateLicenseErrorMessage = true;
				this.rpStateLicenseErrorMessageValid = false;
				this.LicenseNumber();
			} else {
				this.rpStateLicenseErrorMessage = false;
				this.rpStateLicenseErrorMessageValid = false;
				this.LicenseNumber();
			}
		}
	}
	PracticeFieldErr() {
		const PRACTICE_FIELD = this.template.querySelector('lightning-combobox[data-field="hType"]');
		PRACTICE_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="hType"]').className = "input-error-label";
	}
	PracticeField() {
		const PRACTICE_FIELD = this.template.querySelector('lightning-combobox[data-field="hType"]');
		PRACTICE_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="hType"]').className = "input-label";
	}
	handlePracticeTypeChange(value) {
		
		this.selectedtype = value;

		if (!this.selectedtype) {
			this.rpPracticeTypeErrorMessage = false;
			this.PracticeFieldErr();
		}
	}
	EmailFieldErr() {
		const EMAIL_FIELD = this.template.querySelector('lightning-input[data-field="hEmail"]');
		EMAIL_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="hEmail"]').className = "input-error-label";
	}
	EmailField() {
		const EMAIL_FIELD = this.template.querySelector('lightning-input[data-field="hEmail"]');
		EMAIL_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="hEmail"]').className = "input-label";
	}
	handleEmailChange(value) {
		this.hcpFields.email = value;
		

		if (!this.hcpFields.email) {
			this.rpEmailErrorMessage = false;
			this.RpEmailErrorValid = false;
			this.EmailField();
		} else {
			// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
			if (!this.validateEmailRegex().test(this.hcpFields.email)) {
				this.RpEmailErrorValid = true;
				this.rpEmailErrorMessage = false;
				this.EmailFieldErr();
			} else {
				this.rpEmailErrorMessage = false;
				this.RpEmailErrorValid = false;
				this.EmailField();
			}
		}
	}
	PhoneFieldErr() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="hPhone"]');
		PHONE_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="hPhone"]').className = "input-error-label";
	}
	PhoneField() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="hPhone"]');
		PHONE_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="hPhone"]').className = "input-label";
	}
	handlePhoneChange(value) {
		this.hcpFields.phone = value;
	

		if (this.hcpFields.phone) {
			if (!this.validatePhoneRegex().test(this.hcpFields.phone)) {
				this.rpPhoneErrorMessage = true;
				this.PhoneFieldErr();
			} else {
				this.rpPhoneErrorMessage = false;
				this.PhoneField();
			}
		} else {
			this.rpPhoneErrorMessage = false;
			this.PhoneField();
		}
	}
	FaxFieldErr() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="hPhone"]');
		PHONE_FIELD.className = "textInput-err";
		this.template.querySelector('label[data-field="hPhone"]').className = "input-error-label";
	}
	FaxField() {
		const PHONE_FIELD = this.template.querySelector('lightning-input[data-field="hPhone"]');
		PHONE_FIELD.className = "textInput";
		this.template.querySelector('label[data-field="hPhone"]').className = "input-label";
	}
	handleFaxChange(value) {
		this.hcpFields.fax = value;
		const FAX_FIELD = this.template.querySelector('lightning-input[data-field="hFax"]');

		if (this.hcpFields.fax) {
			if (!this.validatePhoneRegex().test(this.hcpFields.fax)) {
				this.rpFaxErrorMessage = true;
				FAX_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="hFax"]').className = "input-error-label";
			} else {
				this.rpFaxErrorMessage = false;
				FAX_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="hFax"]').className = "input-label";
			}
		} else {
			this.rpFaxErrorMessage = false;
			FAX_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="hFax"]').className = "input-label";
		}
	}

	handleCountryCodeChange(value) {
		this.selectedCountry = value;
		const MAILING_COUNTRY_CODE_FIELD = this.template.querySelector('lightning-combobox[data-field="hcc"]');

		if (!this.selectedCountry) {
			this.RPcountryerrorMessage = true;
			MAILING_COUNTRY_CODE_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="hcc"]').className = "input-error-label";
		} else {
			this.RPcountryerrorMessage = false;
			MAILING_COUNTRY_CODE_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="hcc"]').className = "input-label";
		}
	}

	handleStateCodeChange(value) {
		this.selectedstate = value;
		const MAILING_STATE_CODE_FIELD = this.template.querySelector('lightning-combobox[data-field="hsc"]');

		if (!this.selectedstate) {
			this.rpStateCodeErrorMessage = false;
			MAILING_STATE_CODE_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="hsc"]').className = "input-label";
		}
	}

	handleCityChange(value) {
		this.hcpFields.city = value;
		const CITY_FIELD = this.template.querySelector('lightning-input[data-field="hc"]');

		if (this.hcpFields.city === "") {
			this.rpCityErrorMessage = true;
			this.rpCityErrorMessageValid = false;
			CITY_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="hc"]').className = "input-error-label";
		} else if (!this.validateFirstNamePattern().test(this.hcpFields.city)) {
			this.rpCityErrorMessage = false;
			this.rpCityErrorMessageValid = true;
			CITY_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="hc"]').className = "input-error-label";
		} else {
			this.rpCityErrorMessage = false;
			this.rpCityErrorMessageValid = false;
			CITY_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="hc"]').className = "input-label";
		}
	}

	handleStreetChange(value) {
		this.hcpFields.street = value;
		const MAILING_STREET_FIELD = this.template.querySelector('lightning-textarea[data-field="hs"]');

		if (!this.hcpFields.street) {
			this.rpStreetErrorMessage = true;
			MAILING_STREET_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="hs"]').className = "input-error-label";
		} else {
			this.rpStreetErrorMessage = false;
			MAILING_STREET_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="hs"]').className = "input-label";
		}
	}
	ZipCodeRegex(){
return /^[a-zA-Z0-9]+$/u;
	}
	handlePostalCodeChange(value) {
		this.hcpFields.code = value;
		const ZIP_CODE = this.template.querySelector('lightning-input[data-field="hpc"]');

		if (this.hcpFields.code) {
			if (!this.ZipCodeRegex().test(this.hcpFields.code)) {
				this.rpPostalCodeErrorMessage = false;
				this.RPpostalerrorMessagevalid = true;
				ZIP_CODE.className = "textInput-err";
				this.template.querySelector('label[data-field="hpc"]').className = "input-error-label";
			} else {
				this.rpPostalCodeErrorMessage = false;
				this.RPpostalerrorMessagevalid = false;
				ZIP_CODE.className = "textInput";
				this.template.querySelector('label[data-field="hpc"]').className = "input-label";
			}
		} else {
			this.rpPostalCodeErrorMessage = true;
			this.RPpostalerrorMessagevalid = false;
			ZIP_CODE.className = "textInput-err";
			this.template.querySelector('label[data-field="hpc"]').className = "input-error-label";
		}
	}


	//This is Input onchange function for Caregiver details form in Hcp Enrollment
	handleInputChangeCaregiver(event) {
		const FIELD_NAME_CAREGIVER = event.target.name;
		const TARGET_VALUE_CAREGIVER = event.target.value;

		if (FIELD_NAME_CAREGIVER === CAREGIVER_FIRSTNAME) {
			this.caregiverFields.FirstName = TARGET_VALUE_CAREGIVER;
			this.caregiverFields.FirstName =
				event.target.value.trim().charAt(0).toUpperCase() +
				event.target.value.trim().slice(1);
			if (this.caregiverFields.FirstName === "") {
				this.careFirstnameErrorMessage = true;
				this.careFirstnameErrorMessageValid = false;
				this.template.querySelector("lightning-input.cFN").className =
					"textInput-err cFN";
				this.template.querySelector("label.cFN").className =
					"input-error-label cFN";
			} else {
				if (!this.validateFirstNamePattern().test(this.caregiverFields.FirstName)) {
					this.careFirstnameErrorMessageValid = true;
					this.careFirstnameErrorMessage = false;
					this.template.querySelector("lightning-input.cFN").className =
						"textInput-err cFN";
					this.template.querySelector("label.cFN").className =
						"input-error-label cFN";
				} else {
					this.careFirstnameErrorMessageValid = false;
					this.careFirstnameErrorMessage = false;
					this.template.querySelector("lightning-input.cFN").className =
						"textInput cFN";
					this.template.querySelector("label.cFN").className =
						"input-label cFN";
				}
			}
		} else if (FIELD_NAME_CAREGIVER === CAREGIVER_LASTNAME) {
			this.caregiverFields.LastName = TARGET_VALUE_CAREGIVER;
			this.caregiverFields.LastName =
				event.target.value.trim().charAt(0).toUpperCase() +
				event.target.value.trim().slice(1);
			if (this.caregiverFields.LastName === "") {
				this.careLastnameErrorMessage = true;
				this.careLastnameErrorMessageValid = false;
				this.template.querySelector("lightning-input.cLN").className =
					"textInput-err cLN";
				this.template.querySelector("label.cLN").className =
					"input-error-label cLN";
			} else {
				if (!this.validateFirstNamePattern().test(this.caregiverFields.LastName)) {
					this.careLastnameErrorMessageValid = true;
					this.careLastnameErrorMessage = false;
					this.template.querySelector("lightning-input.cLN").className =
						"textInput-err cLN";
					this.template.querySelector("label.cLN").className =
						"input-error-label cLN";
				} else {
					this.careLastnameErrorMessageValid = false;
					this.careLastnameErrorMessage = false;
					this.template.querySelector("lightning-input.cLN").className =
						"textInput cLN";
					this.template.querySelector("label.cLN").className =
						"input-label cLN";
				}
			}
		} else if (FIELD_NAME_CAREGIVER === CAREGIVER_MAIL) {
			this.caregiverFields.Email = TARGET_VALUE_CAREGIVER;
			if (!this.caregiverFields.Email) {
				this.template.querySelector("lightning-input.cEmail").className =
					"textInput-err cEmail";
				this.template.querySelector("label.cEmail").className =
					"input-error-label cEmail";
				this.careEmailErrorMessage = true;
				this.matchCaregiverEmail = false;
				this.cEmailErrorValid = false;
			} else {
				this.careEmailErrorMessage = false;
				this.matchCaregiverEmail = false;
				// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

				if (!this.validateEmailRegex().test(this.caregiverFields.Email)) {
					this.cEmailErrorValid = true;
					this.matchCaregiverEmail = false;
					this.template.querySelector("lightning-input.cEmail").className =
						"textInput-err cEmail";
					this.template.querySelector("label.cEmail").className =
						"input-error-label cEmail";
				} else {
					this.cEmailErrorValid = false;
					this.template.querySelector("lightning-input.cEmail").className =
						"textInput cEmail";
					this.template.querySelector("label.cEmail").className =
						"input-label cEmail";
				}
			}
		} else if (FIELD_NAME_CAREGIVER === CAREGIVER_PHONE) {
			this.caregiverFields.Phone = TARGET_VALUE_CAREGIVER;
			const PHONE_FIELD = this.template.querySelector(
				'lightning-input[data-field="cPhone"]'
			);
			if (!this.validatePhoneRegex().test(this.caregiverFields.Phone)) {
				this.cphoneerrorvalid = true;
				PHONE_FIELD.className = "textInput-err";
				this.template.querySelector('label[data-field="cPhone"]').className =
					"input-error-label";
			} else {
				this.cphoneerrorvalid = false;
				PHONE_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="cPhone"]').className =
					"input-label";
			}
			if (this.validatePhoneRegex().test(this.caregiverFields.Phone)) {
				this.cphoneerrorvalid = false;
				PHONE_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="cPhone"]').className =
					"input-label";
			}
			if (this.caregiverFields.Phone === "") {
				this.cphoneerrorvalid = false;
				PHONE_FIELD.className = "textInput";
				this.template.querySelector('label[data-field="cPhone"]').className =
					"input-label";
			}
		} else if (FIELD_NAME_CAREGIVER === CAREGIVER_RELATION) {
			this.selectedRelationship = TARGET_VALUE_CAREGIVER;
			if (!this.selectedRelationship) {
				this.template.querySelector("lightning-combobox.cRel").className =
					"textInput-err cRel";
				this.template.querySelector("label.cRel").className =
					"input-error-label cRel";
				this.relationshipErrorMessage = true;
			} else {
				this.relationshipErrorMessage = false;
				this.template.querySelector("lightning-combobox.cRel").className =
					"textInput cRel";
				this.template.querySelector("label.cRel").className =
					"input-label cRel";
			}
		}
	}

	//This is Input onchange function for Prescription details form in Hcp Enrollment
	handleInputChange2(event) {
		const FIELD_NAME = event.target.name;
		const TARGET_VALUE = event.target.value;

		if (FIELD_NAME === DOSAGE_CODE) {
			this.prescriptionFields.DosageCode = TARGET_VALUE;
		} else if (FIELD_NAME === FREQUCNCY_UNIT) {
			this.selectedunit = TARGET_VALUE;
		} else if (FIELD_NAME === DOSAGE_VALUE) {
			this.prescriptionFields.Dosage = TARGET_VALUE;
		} else if (FIELD_NAME === QUANTITY) {
			if (!this.isNumeric(TARGET_VALUE)) {
				// If not numeric, clear the input value
				this.prescriptionFields.Quantity = "";
			} else {
				// If numeric, update the Quantity value
				this.prescriptionFields.Quantity = TARGET_VALUE;
			}

			this.prescriptionFields.Quantity = TARGET_VALUE;
		} else if (FIELD_NAME === FREQUENCY_VALUE) {
			this.prescriptionFields.Frequency = TARGET_VALUE;
		} else if (FIELD_NAME === REFILL) {
			this.prescriptionFields.refill = TARGET_VALUE;
		} else if (FIELD_NAME === DRUG_NAME) {
			this.SELECTED_VALUE = TARGET_VALUE;
		}
	}
	isNumeric(value) {
		return /^\d+$/u.test(value);
	}

	//This is onchange function for term and conditions in Hcp Enrollment
	handleInputChange3(event) {
		const TARGET_VALUE_AGREE = event.target.checked;
		this.consentFields.authorize = TARGET_VALUE_AGREE;
		const checkBox = this.template.querySelector('span[data-field="checkbox"]');
		if (this.consentFields.authorize === "") {
			this.authorizeErrorMessage = true;
			checkBox.className = "custom-checkbox-box_Error";
		} else {
			this.authorizeErrorMessage = false;
			checkBox.className = "custom-checkbox-box";
		}
	}

	//This function is used for creating lead in hcp enrollment
	handleCreateLead() {
    if (this.PrescriptionFieldsForm() && this.authorize() && !this.errorss) {
        this.isButtonDisabled = true;
        
        let hcpData = {
            firstName: this.hcpFields.firstname,
            lastName: this.hcpFields.lastname,
            email: this.hcpFields.email,
            phone: this.hcpFields.phone,
            practice: this.hcpFields.PRACTICE_NAME,
            type: this.selectedtype,
            lisence: this.hcpFields.license,
            city: this.hcpFields.city,
            street: this.hcpFields.street,
            country: this.selectedCountry,
            state: this.selectedstate,
            code: this.hcpFields.code
        };

        if (!this.hcpId) {
            CREATE_HCP_RECORD({ hcpData: hcpData })
                .then((resulthcpId) => {
                    this.hcpId = resulthcpId;
                    this.createHcp = true;

                    this.createLeadRecord();
                })
                .catch((error) => {
                    this.isButtonDisabled = false;
                    this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
                });
        } else {
            this.createLeadRecord();
        }
    } else {
        this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with GPP.`;
        this.avatarContentMid = `To enroll your patients in the Spevigo® Patient Support Program, please complete the form on this page.`;
    }
}

createLeadRecord() {
    const SEX = this.selectedGender;
   // const HCP_LICENCE = this.selectedValueTwo;
    const { FirstName, LastName, Email, Phone, dob } = this.leadFields;

    let data = {
        firstName: FirstName,
        lastName: LastName,
        email: Email || "",
        dob: dob,
        phone: Phone || "",
        sex: SEX
    };

    CREATE_LEAD_RECORD({
        data: data,
        hcpId: this.hcpId,
    })
    .then((leadId) => {
        localStorage.setItem("recordId", leadId);
        localStorage.setItem("count", 1);
        this.isLoaded = true;
        this.handlesuccess(leadId);
        this.resetForm();
    })
    .catch((error) => {
        this.isButtonDisabled = false;
        this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
    });
}


	//This function is used for creating Caregiver and lead consent in hcp enrollment
	handlesuccess(leadId) {
		// Destructure the caregiver fields from this.CaregiverField
		if (this.isAdult !== true) {
			const RELATIONSHIP_TO_PATIENT = this.selectedRelationship;
			// Use the destructured variables in the CREATE_CAREGIVER_RECORD function

			let caregiverData = {
				firstName: this.caregiverFields.FirstName,
				lastName: this.caregiverFields.LastName,
				email: this.caregiverFields.Email,
				phone: this.caregiverFields.Phone ? this.caregiverFields.Phone : "",
				relation: RELATIONSHIP_TO_PATIENT,
				dob: this.caregiverFields.dob
			};
			// Null data is checked and AuraHandledException is thrown from the Apex

			CREATE_CAREGIVER_RECORD({ caregiverData: caregiverData, leadId: leadId })
				.then((careID) => {
					// Further actions if needed
					this.caregiverID = careID;
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		}
		const { Quantity, refill, date } = this.prescriptionFields;
		let prescriptionData = {
			drug: this.SELECTED_VALUE,
			dob: date,
			unit: this.selectedunit ? this.selectedunit : "",
			frequency: this.prescriptionFields.Frequency
				? this.prescriptionFields.Frequency
				: 0
		};
		CREATE_PRESCRIPTION_RECORD({
			prescriptionData: prescriptionData,
			refill: refill ? refill : 0,
			leadId: leadId,
			quantity: Quantity ? Quantity : 0
		})
			.then((prescriptionID) => {
				// Further actions if needed
				this.prescriptionID = prescriptionID;
			})
			.catch((error) => {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			});

		const { authorize } = this.consentFields;

		// Null data is checked and AuraHandledException is thrown from the Apex
		CREATE_CONSENT_RECORD({ firstName: authorize, leadId: leadId })
			.then((consentID) => {
				// Further actions if needed
				this.consentID = consentID;
				window.location.href = BRANDED_URL + HCP_SUMMARY;
			})
			.catch((error) => {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});
	}
	descriptionData;
	resetForm() {
		// Clear form fields
		this.leadFields = {};
		this.caregiverFields = {};
	}
	connectedCallback() {
		try {
			PRODUCT_LIST()
				// The error handle with null value throw from apex
				.then((result) => {
					if (result !== null && result.length > 0) {
						loadStyle(this, ICON_CSS);
						loadStyle(this, TEXT_ALIGN);
						let i;
						for (i = 0; i < result.length; i++) {
							this.picklistOrdered.push({
								label: result[i].Name,
								value: result[i].Id
							});
						}

						this.picklistOrdered = this.picklistOrdered.sort((a, b) => {
							if (a.label < b.label) {
								return -1;
							} else if (a.label > b.label) {
								return 1;
							}
							return 0; // If a.label is equal to b.label
						});
					} else if (result === null) {
						this.showToast(ERROR_MESSAGE, ERROR_FOUND, ERROR_VARIANT); // Catching Potential Error from apex
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from lwc
				});

			REFERRING_PRACTITIONER()
				.then((result) => {
					if (result === null) {
						this.showToast(ERROR_MESSAGE, ERROR_FOUND, ERROR_VARIANT); // Handle null result from Apex
						return;
					}

					if (result.length > 0) {
						let picklistOrderedOne = [];
						let picklistOrderedTwo = [];

						result.forEach(item => {
							if (item.BI_PSPB_License_number__c !== undefined) {
								picklistOrderedTwo.push({
									label: item.BI_PSPB_License_number__c,
									value: item.Id
								});
							} else {
								picklistOrderedOne.push({
									label: item.Name,
									labelForSpecialist: item?.BI_PSPB_Specialist__c,
									labelForCity: item?.MailingCity,
									value: item.Id
								});
							}
						});

						if (picklistOrderedOne.length > 0) {
							this.picklistOrderedOne = picklistOrderedOne.sort((a, b) => a.label.localeCompare(b.label));
						}

						if (picklistOrderedTwo.length > 0) {
							this.picklistOrderedTwo = picklistOrderedTwo.sort((a, b) => a.label.localeCompare(b.label));
						}
					}
				})
				.catch((error) => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Handle errors from LWC
				});


		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}

	openPopUp() {
		this.popupClass = "popup-visible";
	}

	HCPSubmit() {
		if (!this.HCPvalidateForm()) {
			// To call the method
			//no need to return
		}
	}
	Cancel() {
		this.popupClass = "popup-hidden";
	}

	goBackToStepOne() {
		this.handleClose();
		this.currentStep = "1";
		this.template.querySelector("div.stepTwo").classList.add("slds-hide");
		this.template.querySelector("div.stepOne").classList.remove("slds-hide");
		// Progress indicator
		this.template.querySelector("li.li-two").classList.remove("slds-is-active");
		this.template
			.querySelector("li.li-one")
			.classList.remove("slds-is-completed");
		this.template.querySelector("li.li-one").classList.add("slds-is-active");
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with GPP.`;
		this.avatarContentMid = `To enroll your patients in the Beyond
	
	GPP: The Spevigo® Patient Support Program, please complete the form on this page.`;

		this.mobileValueTwo = `Thank you for choosing Spevigo® for your patients with GPP.
	To enroll your patients in the Beyond GPP: The Spevigo® Patient Support Program, please complete the form on this page.`;
	}
	goBackToStepTwo() {
		this.handleClose();
		this.currentStep = "2";
		this.template.querySelector("div.stepThree").classList.add("slds-hide");
		this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
		// Progress indicator
		this.template
			.querySelector("li.li-three")
			.classList.remove("slds-is-active");
		this.template.querySelector("li.li-three").classList.add("slds-hide");
		this.template
			.querySelector("li.li-two")
			.classList.remove("slds-is-completed");
		this.template.querySelector("li.li-two").classList.add("slds-is-active");


		this.level = '03';
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).`;
		this.avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo®
	Patient Support Program, please
	complete the form on this page. If you
	are enrolling a minor patient, please
	provide the caregiver's information as
	well.`;

		this.mobileValueTwo = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).
	To enroll your patients in the Beyond GPP: The Spevigo®
	Patient Support Program, please
	complete the form on this page. If you
	are enrolling a minor patient, please
	provide the caregiver's information as
	well.`;
	}
	goBackToStepThree() {
		this.matchCaregiverEmail = false;
		this.matchEmail = false;
		if (this.isAdult === true) {
			this.handleClose();
			this.currentStep = "2";
			this.fieldsMandatory = "para";
			this.template.querySelector("div.stepFour").classList.add("slds-hide");
			this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
			// Progress indicator
			this.template
				.querySelector("li.li-four")
				.classList.remove("slds-is-active");
			this.template
				.querySelector("li.li-two")
				.classList.remove("slds-is-completed");
			this.template.querySelector("li.li-two").classList.add("slds-is-active");
			//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
			//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
			this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).`;
			this.avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo®
	Patient Support Program, please
	complete the form on this page. If you
	are enrolling a minor patient, please
	provide the caregiver's information as
	well.`;

			this.mobileValueTwo = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).
	To enroll your patients in the Beyond GPP: The Spevigo®
	Patient Support Program, please
	complete the form on this page. If you
	are enrolling a minor patient, please
	provide the caregiver's information as
	well.`;
		} else {
			this.handleClose();
			this.currentStep = "3";
			this.template.querySelector("div.stepFour").classList.add("slds-hide");
			this.template
				.querySelector("div.stepThree")
				.classList.remove("slds-hide");
			// Progress indicator
			this.template
				.querySelector("li.li-four")
				.classList.remove("slds-is-active");
			this.template
				.querySelector("li.li-three")
				.classList.remove("slds-is-completed");
			this.template
				.querySelector("li.li-three")
				.classList.add("slds-is-active");
			//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
			//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
			this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).`;
			this.avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo®
	Patient Support Program, please
	complete the form on this page. If you
	are enrolling a minor patient, please
	provide the caregiver's information as
	well.`;

		}
		this.mobileValueTwo = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).

	To enroll your patients in the Beyond GPP: The Spevigo®
	Patient Support Program, please
	complete the form on this page. If you
	are enrolling a minor patient, please
	provide the caregiver's information as
	well.`;
	}
	goBackToStepFour() {
		this.handleClose();
		this.currentStep = "4";
		this.fieldsMandatory = "para";
		this.template.querySelector("div.stepFive").classList.add("slds-hide");
		this.template.querySelector("div.stepFour").classList.remove("slds-hide");
	}
	goToStepTwo() {
		this.handleClose();
		if (!this.ReferringPracticeValidation()) {
			this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with GPP.`;
			this.avatarContentMid = `To enroll your patients in the Spevigo® Patient Support Program, please complete the form on this page.`;
			return;
		}
		if (
			this.physicianIdInputDisabled === true &&
			this.physicianNameInputDisabled === true
		) {
			this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with GPP.`;
			this.avatarContentMid = `To enroll your patients in the Spevigo® Patient Support Program, please complete the form on this page.`;
			if (!this.HCPvalidateForm()) {
				return;

			}


		}
		this.currentStep = "2";
		this.template.querySelector("div.stepOne").classList.add("slds-hide");
		this.template.querySelector("div.stepTwo").classList.remove("slds-hide");
		// Progress indicator
		this.template.querySelector("li.li-one").classList.remove("slds-is-active");
		this.template.querySelector("li.li-one").classList.add("slds-is-completed");
		this.template.querySelector("li.li-two").classList.add("slds-is-active");
		//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
		//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
		this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).`;
		this.avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo®
	Patient Support Program, please
	complete the form on this page. If you
	are enrolling a minor patient, please
	provide the caregiver's information as
	well.`;
		this.mobileValueTwo = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).

	To enroll your patients in the Beyond GPP: The Spevigo®
	Patient Support Program, please
	complete the form on  this page. If you
	are enrolling a minor patient, please
	provide the caregiver's information as
	well.`;
	}
	goToStepThree() {
    // Close the current step
    this.handleClose();

    // Fetch existing accounts with the given email
    GET_EXISTING_ACCOUNTS({ email: this.leadFields.Email })
        .then((result) => {
            if (result && result.length > 0) {
                this.uniqueEmail = result.map(item => item.PersonEmail);
                this.uniqueFName = result.map(item => item.FirstName);
                this.uniqueLname = result.map(item => item.LastName);
                this.uniqueDOB = result.map(item => item.BI_PSP_Birthdate__c);

                if (!this.UniqueValidation()) {
                    // Handle unique validation failure here if needed
                }
            } else {
                this.handlePatientValidation();
            }
        })
        .catch((error) => {
            this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
        });
}

handlePatientValidation() {
    // Check various validations for the patient
    if (!this.patientvalidateForm()) {
        this.updateAvatarContent();
    } else if (!this.DOByearvalidationforPatient()) {
        this.updateAvatarContent();
    } else if (!this.DOBfuturevalidationforPatient()) {
        this.updateAvatarContent();
    } else if (this.isAdult === true) {
        this.advanceToStepFour();
    } else {
        this.returnToStepThree();
    }
}

updateAvatarContent() {
    this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).`;
    this.avatarContentMid = `To enroll your patients in the Spevigo® Patient Support Program, please complete the form on this page. If you are enrolling a minor patient, please provide the caregiver's information as well.`;
}

advanceToStepFour() {
    this.numThree = false;
    this.numFour = true;
    this.currentStep = "4";
    this.fieldsMandatory = "paralast";

    this.template.querySelector("div.stepTwo").classList.add("slds-hide");
    this.template.querySelector("div.stepFour").classList.remove("slds-hide");

    this.template.querySelector("li.li-two").classList.remove("slds-is-active");
    this.template.querySelector("li.li-two").classList.add("slds-is-completed");
    this.template.querySelector("li.li-four").classList.add("slds-is-active");

    this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with GPP.`;
    this.avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo® Patient Support Program, please complete the form on this page.`;

    this.mobileValueTwo = `Thank you for choosing Spevigo® for your patients with GPP. To enroll your patients in the Beyond GPP: The Spevigo® Patient Support Program, please complete the form on this page.`;
}

returnToStepThree() {
    this.handleClose();
    this.currentStep = "3";

    this.template.querySelector("div.stepTwo").classList.add("slds-hide");
    this.template.querySelector("div.stepThree").classList.remove("slds-hide");

    this.template.querySelector("li.li-two").classList.remove("slds-is-active");
    this.template.querySelector("li.li-two").classList.add("slds-is-completed");
    this.template.querySelector("li.li-three").classList.remove("slds-hide");
    this.template.querySelector("li.li-three").classList.add("slds-is-active");

    this.numFour = false;
    this.numThree = true;
    this.level = '04';

    this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).`;
    this.avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo® Patient Support Program, please complete the form on this page. If you are enrolling a minor patient, please provide the caregiver's information as well.`;

    this.mobileValueTwo = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP). To enroll your patients in the Beyond GPP: The Spevigo® Patient Support Program, please complete the form on this page. If you are enrolling a minor patient, please provide the caregiver's information as well.`;
}

	goToStepFour() {
		this.unique = false;
		this.handleClose();
		GET_EXISTING_ACCOUNTS({ email: this.caregiverFields.Email })
			// Null data is checked and AuraHandledException is thrown from the Apex
			.then((result) => {
				if (result && result.length > 0) {
					this.uniqueEmail = result.map((item) => item.PersonEmail);
					this.uniqueFName = result.map((item) => item.FirstName);
					this.uniqueLname = result.map((item) => item.LastName);
					this.uniqueDOB = result.map((item) => item.BI_PSP_Birthdate__c);

					if (!this.UniquecaregiverValidation()) {
						// to call the method
						// No need for a return here
					}
					else {
						this.Caregivervalidation();

					}
				} else {
					this.Caregivervalidation();

				}
			})
			.catch((error) => {
				// Handle errors here
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);

			});
	}

	//This Function is used for check validation for Patient date of birth in hcp enrollment form
	agecalculationEvent(event) {
		const SELECTED_DATE = event.target.value;

		this.leadFields.dob = SELECTED_DATE;

		const CURRENT_DATE = new Date();
		const SELECTED_DATE_OBJ = new Date(SELECTED_DATE);
		if (SELECTED_DATE === "") {
			this.dobErrorMessage = true;
			this.template.querySelector(
				'lightning-input[data-field="pdob"]'
			).className = "textInput-err";
			this.template.querySelector('label[data-field="pdob"]').className =
				"input-error-label";
			this.error = false;
			this.oneNineZeroZeroErrors = false;
		} else {
			if (SELECTED_DATE_OBJ.getFullYear() < 1900) {
				this.template.querySelector(
					'lightning-input[data-field="pdob"]'
				).className = "textInput-err";
				this.template.querySelector('label[data-field="pdob"]').className =
					"input-error-label";
				this.error = false;
				this.oneNineZeroZeroErrors = true;
				this.dobErrorMessage = false;
				this.isAdult = false;
				this.unique = false;
				this.leadFields.Email = '';
			} else if (SELECTED_DATE_OBJ > CURRENT_DATE) {
				this.template.querySelector(
					'lightning-input[data-field="pdob"]'
				).className = "textInput-err";
				this.template.querySelector('label[data-field="pdob"]').className =
					"input-error-label";
				this.error = true;
				this.dobErrorMessage = false;
				this.isAdult = false;
				this.unique = false;
				this.leadFields.Email = '';
				this.oneNineZeroZeroErrors = false;
			} else {
				this.error = false;
				this.oneNineZeroZeroErrors = false;
				this.dobErrorMessage = false;
				this.template.querySelector(
					'lightning-input[data-field="pdob"]'
				).className = "textInput";
				this.template.querySelector('label[data-field="pdob"]').className =
					"input-label";
				const AGE = Math.floor(
					(CURRENT_DATE - SELECTED_DATE_OBJ) / (365.25 * 24 * 60 * 60 * 1000)
				); // Rounding down to the nearest whole year
				if (AGE >= Minorvalue && this.leadFields.dob) {
					this.isAdult = true;
					this.oneNineZeroZeroErrors = false;
				} else {
					this.isAdult = false;
					this.unique = false;
					this.leadFields.Email = '';
					this.oneNineZeroZeroErrors = false;
				}
			}
		}
	}
	onClickCalendar() {
		this.template.querySelector("div.formContainer").style.zIndex = "1001";
	}

	onBlurCalendar() {
		this.template.querySelector("div.formContainer").style.zIndex = "0";
	}

	//This Function is used for check validation for Caregiver date of birth in hcp enrollment form
	careagecalculation(event) {
		const SELECTED_DATE = event.target.value;
		this.caregiverFields.dob = SELECTED_DATE;

		const CURRENT_DATE = new Date();
		const CARE_SELECTED_DATE_OBJ = new Date(SELECTED_DATE);
		if (SELECTED_DATE === "") {
			this.careDobErrorMessage = true;
			this.minorError = false;
			this.careOneNineZerZeroErrors = false;
			this.errors = false;
			this.template.querySelector("lightning-input.cDob").className =
				"red cDob";
			this.template.querySelector("label.cDob").className = "labelred cDob";
		} else {
			if (CARE_SELECTED_DATE_OBJ.getFullYear() < 1900) {
				this.template.querySelector("lightning-input.cDob").className =
					"red cDob";
				this.template.querySelector("label.cDob").className = "labelred cDob";
				this.careOneNineZerZeroErrors = true;
				this.errors = false;
				this.isAdult = false;
				this.minorError = false;
				this.careDobErrorMessage = false;
			} else if (CARE_SELECTED_DATE_OBJ > CURRENT_DATE) {
				this.template.querySelector("lightning-input.cDob").className =
					"red cDob";
				this.template.querySelector("label.cDob").className = "labelred cDob";
				this.errors = true;
				this.minorError = false;
				this.isAdult = false;
				this.careOneNineZerZeroErrors = false;
				this.careDobErrorMessage = false;
			} else {
				this.errors = false;
				this.minorError = false;
				this.careOneNineZerZeroErrors = false;
				this.careDobErrorMessage = false;

				const AGE = Math.floor(
					(CURRENT_DATE - CARE_SELECTED_DATE_OBJ) /
					(365.25 * 24 * 60 * 60 * 1000)
				); // Rounding down to the nearest whole year
				if (AGE < Minorvalue) {
					this.minorError = true;
					this.errors = false;
					this.template.querySelector("lightning-input.cDob").className =
						"red cDob";
					this.template.querySelector("label.cDob").className = "labelred cDob";
					this.careOneNineZerZeroErrors = false;
					this.careDobErrorMessage = false;
				} else {
					this.minorError = false;
					this.careOneNineZerZeroErrors = false;
					this.careDobErrorMessage = false;
					this.errors = false;
					this.template.querySelector("lightning-input.cDob").className =
						"textInput cDob";
					this.template.querySelector("label.cDob").className =
						"input-label cDob";
				}
			}
		}
	}

	//This Function is used for check validation for Prescription date in hcp enrollment form
	datecalculation(event) {
		const SELECTED_DATE = event.target.value;
		this.prescriptionFields.date = SELECTED_DATE;

		const CURRENT_DATE = new Date();
		const PRES_SELECTED_DATE_OBJ = new Date(SELECTED_DATE);
		if (SELECTED_DATE === "") {
			this.dateErrorMessage = true;
			this.errorss = false;
			this.presOneNineZeroZeroErrors = false;
			this.template.querySelector("lightning-input.hpdate").className =
				"textInput-err hpdate";
			this.template.querySelector("label.hpdate").className =
				"input-error-label hpdate";
		} else {
			if (PRES_SELECTED_DATE_OBJ.getFullYear() < 1900) {
				this.template.querySelector("lightning-input.hpdate").className =
					"textInput-err hpdate";
				this.template.querySelector("label.hpdate").className =
					"input-error-label hpdate";
				this.errorss = false;
				this.presOneNineZeroZeroErrors = true;
				this.dateErrorMessage = false;
			} else if (PRES_SELECTED_DATE_OBJ > CURRENT_DATE) {
				this.template.querySelector("lightning-input.hpdate").className =
					"textInput-err hpdate";
				this.template.querySelector("label.hpdate").className =
					"input-error-label hpdate";
				this.errorss = true;
				this.presOneNineZeroZeroErrors = false;
				this.dateErrorMessage = false;
			} else {
				this.errorss = false;
				this.presOneNineZeroZeroErrors = false;
				this.dateErrorMessage = false;
				this.template.querySelector("lightning-input.hpdate").className =
					"textInput hpdate";
				this.template.querySelector("label.hpdate").className =
					"input-label hpdate";
			}
		}
	}
	//This Function is used for check validation for Patient in hcp enrollment form
	patientvalidateForm() {
		// Add your validation logic here for each required field
		let isValid = true;

		// First Name
		if (!this.leadFields.FirstName) {
			this.PhysicianFnameErr();
			this.firstnameErrorMessage = true;

			isValid = false;
		} else {
			this.firstnameErrorMessage = false;
			if (
				this.firstnameErrorMessage === true ||
				this.firstnameErrorMessagevaild === true
			) {
				this.PhysicianFnameErr();
				isValid = false;
			} else {
				this.PhysicianFname();
			}
		}
		// Last Name
		if (!this.leadFields.LastName) {
			this.PhysicianLnameErr();
			this.lastnameErrorMessage = true;
			isValid = false;
		} else {
			this.lastnameErrorMessage = false;
			if (
				this.lastnameErrorMessage === true ||
				this.lastnameErrorMessagevaild === true
			) {
				this.PhysicianLnameErr();
				isValid = false;
			} else {
				this.PhysicianLname();
			}
		}

		// Date of Birth
		if (!this.leadFields.dob) {
			this.template.querySelector(
				'lightning-input[data-field="pdob"]'
			).className = "textInput-err";
			this.template.querySelector('label[data-field="pdob"]').className =
				"input-error-label";
			this.dobErrorMessage = true;
			isValid = false;
		} else {
			this.dobErrorMessage = false;
			if (this.error === true || this.patientvalidateForm === true) {
				this.template.querySelector(
					'lightning-input[data-field="pdob"]'
				).className = "textInput-err";
				this.template.querySelector('label[data-field="pdob"]').className =
					"input-error-label";
				isValid = false;
			} else {
				this.template.querySelector(
					'lightning-input[data-field="pdob"]'
				).className = "textInput";
				this.template.querySelector('label[data-field="pdob"]').className =
					"input-label";
			}
		}

		// Gender
		if (!this.selectedGender) {
			this.genderErrorMessage = true;
			isValid = false;
			this.PhysicianGenderErr();
		} else {
			this.genderErrorMessage = false;
			this.PhysicianGender();
		}

		// Email
		if (this.isAdult === true) {
			if (!this.leadFields.Email) {
				this.PhysicianEmailErr();
				this.emailErrorMessage = true;
				this.emailErrorValid = false;
				isValid = false;
			} else {
				this.emailErrorMessage = false;
				this.emailErrorValid = false;
				this.PhysicianEmailErr();

				// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

				if (!this.validateEmailRegex().test(this.leadFields.Email)) {
					this.emailErrorValid = true;
					this.PhysicianEmailErr();
					isValid = false;
				} else {
					this.emailErrorValid = false;
					this.PhysicianEmail();
				}
			}
		}
		if (this.isAdult === true) {
			if (this.leadFields.Phone) {
				if (!this.validatePhoneRegex().test(this.leadFields.Phone)) {
					this.phnErrorValid = true;
					this.PhysicianEmailErr();
					isValid = false;
				} else {
					this.phnErrorValid = false;
					this.PhysicianEmail();
				}
			}
		}
		return isValid;
	}

	//This Function is used for check validation for Caregiver in hcp enrollment form
	carevalidateForm() {
		// Add your validation logic here for each required field
		let isValid = true;

		// First Name
		if (!this.caregiverFields.FirstName) {
			this.template.querySelector("lightning-input.cFN").className =
				"textInput-err cFN";
			this.template.querySelector("label.cFN").className =
				"input-error-label cFN";
			this.careFirstnameErrorMessage = true;
			isValid = false;
		} else {
			this.careFirstnameErrorMessage = false;

			if (
				this.careFirstnameErrorMessage === true ||
				this.careFirstnameErrorMessageValid === true
			) {
				this.template.querySelector(
					'lightning-input[data-field="cFN"]'
				).className = "textInput-err";
				this.template.querySelector('label[data-field="cFN"]').className =
					"input-error-label";
				isValid = false;
			} else {
				this.template.querySelector("lightning-input.cFN").className =
					"textInput cFN";
				this.template.querySelector("label.cFN").className = "input-label cFN";
			}
		}

		// Last Name
		if (!this.caregiverFields.LastName) {
			this.template.querySelector("lightning-input.cLN").className =
				"textInput-err cLN";
			this.template.querySelector("label.cLN").className =
				"input-error-label cLN";
			this.careLastnameErrorMessage = true;
			isValid = false;
		} else {
			this.careLastnameErrorMessage = false;

			if (
				this.careLastnameErrorMessage === true ||
				this.careLastnameErrorMessageValid === true
			) {
				this.template.querySelector(
					'lightning-input[data-field="cLN"]'
				).className = "textInput-err";
				this.template.querySelector('label[data-field="cLN"]').className =
					"input-error-label";
				isValid = false;
			} else {
				this.template.querySelector("lightning-input.cLN").className =
					"textInput cLN";
				this.template.querySelector("label.cLN").className = "input-label cLN";
			}
		}

		// Date of Birth
		if (!this.caregiverFields.dob) {
			this.template.querySelector("lightning-input.cDob").className =
				"textInput-err cDob";
			this.template.querySelector("label.cDob").className =
				"input-error-label cDob";
			this.careDobErrorMessage = true;
			isValid = false;
		} else {
			this.careDobErrorMessage = false;
			if (this.errors === true || this.minorError === true) {
				this.template.querySelector("lightning-input.cDob").className =
					"textInput-err cDob";
				this.template.querySelector("label.cDob").className =
					"input-error-label cDob";
				isValid = false;
			} else if (this.careOneNineZerZeroErrors === true) {
				this.template.querySelector("lightning-input.cDob").className =
					"textInput-err cDob";
				this.template.querySelector("label.cDob").className =
					"input-error-label cDob";
				isValid = false;
			} else {
				this.template.querySelector("lightning-input.cDob").className =
					"textInput cDob";
				this.template.querySelector("label.cDob").className =
					"input-label cDob";
			}
		}

		// Email
		if (!this.caregiverFields.Email) {
			this.template.querySelector("lightning-input.cEmail").className =
				"textInput-err cEmail";
			this.template.querySelector("label.cEmail").className =
				"input-error-label cEmail";
			this.careEmailErrorMessage = true;
			isValid = false;
		} else {
			this.careEmailErrorMessage = false;
			// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

			if (!this.validateEmailRegex().test(this.caregiverFields.Email)) {
				this.cEmailErrorValid = true;
				this.template.querySelector("lightning-input.cEmail").className =
					"textInput-err cEmail";
				this.template.querySelector("label.cEmail").className =
					"input-error-label cEmail";
				isValid = false;
			} else {
				this.cEmailErrorValid = false;
				this.template.querySelector("lightning-input.cEmail").className =
					"textInput cEmail";
				this.template.querySelector("label.cEmail").className =
					"input-label cEmail";
			}
		}

		//Realtionship
		if (!this.selectedRelationship) {
			this.template.querySelector("lightning-combobox.cRel").className =
				"textInput-err cRel";
			this.template.querySelector("label.cRel").className =
				"input-error-label cRel";
			this.relationshipErrorMessage = true;
			isValid = false;
		} else {
			this.relationshipErrorMessage = false;
			this.template.querySelector("lightning-combobox.cRel").className =
				"textInput cRel";
			this.template.querySelector("label.cRel").className = "input-label cRel";
		}

		if (this.caregiverFields.Phone) {
			if (!this.validatePhoneRegex().test(this.caregiverFields.Phone)) {
				this.cphoneerrorvalid = true;
				this.template.querySelector(
					'lightning-input[data-field="cPhone"]'
				).className = "textInput-err";
				this.template.querySelector('label[data-field="cPhone"]').className =
					"input-error-label";
				isValid = false;
			} else {
				this.template.querySelector(
					'lightning-input[data-field="cPhone"]'
				).className = "textInput";
				this.cphoneerrorvalid = false;
				this.template.querySelector('label[data-field="cPhone"]').className =
					"input-label";
			}
		}
		return isValid;
	}

	//This Function is used for check validation for prescription in hcp enrollment form
	PrescriptionFieldsForm() {
		// Add your validation logic here for each required field
		let isValid = true;

		// drug
		if (this.searchResultEmpty === true) {
			this.template.querySelector("lightning-input.hDrug").className =
				"textInput-err hDrug";
			this.template.querySelector("label.hDrug").className =
				"input-error-label hDrug";
			this.drugErrorMessage = false;
			isValid = false;
		}

		if (!this.searchValue) {
			this.template.querySelector("lightning-input.hDrug").className =
				"textInput-err hDrug";
			this.template.querySelector("label.hDrug").className =
				"input-error-label hDrug";
			this.drugErrorMessage = true;
			isValid = false;
		} else {
			if (this.searchResultEmpty === true) {
				this.template.querySelector("lightning-input.hDrug").className =
					"textInput-err hDrug";
				this.template.querySelector("label.hDrug").className =
					"input-error-label hDrug";
				this.drugErrorMessage = false;
				isValid = false;
			} else {
				this.drugErrorMessage = false;
				this.template.querySelector("lightning-input.hDrug").className =
					"textInput hDrug";
				this.template.querySelector("label.hDrug").className =
					"input-label hDrug";
			}
		}

		// Prescribed date
		if (!this.prescriptionFields.date) {
			this.template.querySelector("lightning-input.hpdate").className =
				"textInput-err hpdate";
			this.template.querySelector("label.hpdate").className =
				"input-error-label hpdate";
			this.dateErrorMessage = true;
			isValid = false;
		} else {
			if (this.errorss) {
				this.template.querySelector("lightning-input.hpdate").className =
					"textInput-err hpdate";
				this.template.querySelector("label.hpdate").className =
					"input-error-label hpdate";
				isValid = false;
			} else {
				this.dateErrorMessage = false;
				this.template.querySelector("lightning-input.hpdate").className =
					"textInput hpdate";
				this.template.querySelector("label.hpdate").className =
					"input-label hpdate";
			}
		} // authorize
		const checkBox = this.template.querySelector('span[data-field="checkbox"]');
		if (!this.consentFields.authorize || this.consentFields === undefined) {
			this.authorizeErrorMessage = true;
			checkBox.className = "custom-checkbox-box_Error";
			isValid = false;
		} else {
			this.authorizeErrorMessage = false;
			checkBox.className = "custom-checkbox-box";
		}
		return isValid;
	}

	HCPvalidateForm() {
		let isValid = true;
		isValid = this.validateFirstName() && isValid;
		isValid = this.validateLastName() && isValid;
		isValid = this.validateLicenseField() && isValid;
		isValid = this.validatePhoneField() && isValid;
		isValid = this.validateFaxField() && isValid;
		isValid = this.validateEmailField() && isValid;
		isValid = this.validateComboBoxField('hcc', 'RPcountryerrorMessage') && isValid;
		isValid = this.validateComboBoxField('hsc', 'rpStateCodeErrorMessage') && isValid;
		isValid = this.validateCityField() && isValid;
		isValid = this.validateMailingStreetField() && isValid;
		isValid = this.validatePostalCodeField() && isValid;
		isValid = this.validatePracticeNameField() && isValid;
		isValid = this.validatePracticeTypeField() && isValid;
	
		return isValid;
	}
	
	validateFirstName() {
		
		
		if (!this.hcpFields.firstname) {
			this.rpFirstnameErrorMessage = true;
			this.FirstNameTextErr();
			return false;
		}
		
		this.rpFirstnameErrorMessage = false;
		if (this.rpFirstnameErrorMessageVaild) {
			this.FirstNameTextErr();
			return false;
		}
		
		this.FirstNameText();
		return true;
	}
	
	validateLastName() {
		const LAST_NAME_FIELD = this.template.querySelector('lightning-input[data-field="hLN"]');
		const LAST_NAME_LABEL = this.template.querySelector('label[data-field="hLN"]');
		
		if (!this.hcpFields.lastname) {
			this.rpLastnameErrorMessage = true;
			LAST_NAME_FIELD.className = "textInput-err";
			LAST_NAME_LABEL.className = "input-error-label";
			return false;
		}
		
		this.rpLastnameErrorMessage = false;
		if (this.rpLastnameErrorMessageValid) {
			LAST_NAME_FIELD.className = "textInput-err";
			LAST_NAME_LABEL.className = "input-error-label";
			return false;
		}
		
		LAST_NAME_FIELD.className = "textInput";
		LAST_NAME_LABEL.className = "input-label";
		return true;
	}
	
	validateLicenseField() {
		const field = this.template.querySelector('lightning-input[data-field="hLicense"]');
		if (!field.value) {
			this.rpStateLicenseErrorMessage = true;
			this.rpStateLicenseErrorMessageValid = false;
			this.LicenseNumberErr();
			return false;
		}
		if (!this.validateLisencePattern().test(field.value)) {
			this.rpStateLicenseErrorMessage = false;
			this.rpStateLicenseErrorMessageValid = true;
			this.LicenseNumberErr();
			return false;
		}
		this.LicenseNumber();
		return true;
	}
	
	validatePhoneField() {
		const field = this.template.querySelector('lightning-input[data-field="hPhone"]');
		if (field.value && !this.validatePhoneRegex().test(field.value)) {
			this.rpPhoneErrorMessage = true;
			this.PhoneFieldErr();
			return false;
		}
		this.rpPhoneErrorMessage = false;
		this.PhoneField();
		return true;
	}
	validatePhoneRegex() {
          return /^\+?[0-9]+$/u;
	}
	validateFaxField() {
		const field = this.template.querySelector('lightning-input[data-field="hFax"]');
		if (field.value && !this.validatePhoneRegex().test(field.value)) {
			this.rpFaxErrorMessage = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="hFax"]').className = "input-error-label";
			return false;
		}
		this.rpFaxErrorMessage = false;
		field.className = "textInput";
		this.template.querySelector('label[data-field="hFax"]').className = "input-label";
		return true;
	}
	validateEmailRegex(){
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
	}
	validateEmailField() {
		const field = this.template.querySelector('lightning-input[data-field="hEmail"]');
		if (!field.value) {
			this.RpEmailErrorValid = false;
			this.EmailFieldErr();
			this.rpEmailErrorMessage = true;
			return false;
		}
		this.rpEmailErrorMessage = false;
		// const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
		if (!this.validateEmailRegex().test(this.hcpFields.email)) {
			this.RpEmailErrorValid = true;
			this.EmailFieldErr();
			return false;
		}
		this.RpEmailErrorValid = false;
		this.EmailField();
		return true;
	}
	
	validateComboBoxField(dataField, errorMessageFlag) {
		const field = this.template.querySelector(`lightning-combobox[data-field="${dataField}"]`);
		if (!field.value) {
			this[errorMessageFlag] = true;
			field.className = "textInput-err";
			this.template.querySelector(`label[data-field="${dataField}"]`).className = "input-error-label";
			return false;
		}
		this[errorMessageFlag] = false;
		field.className = "textInput";
		this.template.querySelector(`label[data-field="${dataField}"]`).className = "input-label";
		return true;
	}
	
	validateCityField() {
		const field = this.template.querySelector('lightning-input[data-field="hc"]');
		if (!field.value) {
			this.rpCityErrorMessage = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="hc"]').className = "input-error-label";
			return false;
		}
		this.rpCityErrorMessage = false;
		if (this.rpCityErrorMessageValid) {
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="hc"]').className = "input-error-label";
			return false;
		}
		field.className = "textInput";
		this.template.querySelector('label[data-field="hc"]').className = "input-label";
		return true;
	}
	
	validateMailingStreetField() {
		const field = this.template.querySelector('lightning-textarea[data-field="hs"]');
		if (!field.value) {
			this.rpStreetErrorMessage = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="hs"]').className = "input-error-label";
			return false;
		}
		this.rpStreetErrorMessage = false;
		field.className = "textInput";
		this.template.querySelector('label[data-field="hs"]').className = "input-label";
		return true;
	}
	
	validatePostalCodeField() {
		const field = this.template.querySelector('lightning-input[data-field="hpc"]');
		if (!field.value) {
			this.rpPostalCodeErrorMessage = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="hpc"]').className = "input-error-label";
			return false;
		}
		if (!this.ZipCodeRegex().test(this.hcpFields.code)) {
			this.rpPostalCodeErrorMessage = false;
			this.RPpostalerrorMessagevalid = true;
			field.className = "textInput-err";
			this.template.querySelector('label[data-field="hpc"]').className = "input-error-label";
			return false;
		}
		this.rpPostalCodeErrorMessage = false;
		this.ZiperrorMessagevalid = false;
		field.className = "textInput";
		this.template.querySelector('label[data-field="hpc"]').className = "input-label";
		return true;
	}
	
	validatePracticeNameField() {
		const field = this.template.querySelector('lightning-input[data-field="hPN"]');
		if (!field.value) {
			this.rpPracticeNameErrorMessage = true;
			this.PracticeNameErr();
			return false;
		}
		this.rpPracticeNameErrorMessage = false;
		if (this.rpLastnameErrorMessageValid) {
			this.PracticeNameErr();
			return false;
		}
		this.PracticeName();
		return true;
	}
	
	validatePracticeTypeField() {
		const field = this.template.querySelector('lightning-combobox[data-field="hType"]');
		if (!field.value) {
			this.rpPracticeTypeErrorMessage = true;
			this.PracticeFieldErr();
			return false;
		}
		this.rpPracticeTypeErrorMessage = false;
		this.PracticeField();
		return true;
	}
	

	ReferringPracticeValidation() {
		// Add your validation logic here for each required field
		let isValid = true;

		// referring

		if (
			!this.physicianNameInputDisabled &&
			(!this.selectedValueOne || this.searchResultEmptyOne === true)
		) {
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput-err searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-error-label searchHCPName";
			this.referringErrorMessage = true;
			isValid = false;
		} else {
			if (this.physicianNameInputDisabled === true) {
				this.template.querySelector("label.searchHCPName").className =
					"Disable searchHCPName";
			} else {
				this.template.querySelector("lightning-input.searchHCPName").className =
					"textInput searchHCPName";
				this.template.querySelector("label.searchHCPName").className =
					"input-label-front searchHCPName";
				this.referringErrorMessage = false;
			}
		}

		if (
			!this.physicianIdInputDisabled &&
			(!this.selectedValueTwo || this.searchResultEmptyTwo === true)
		) {
			this.template.querySelector("lightning-input.searchHCPId").className =
				"textInput-err searchHCPId";
			this.template.querySelector("label.searchHCPId").className =
				"input-error-label searchHCPId";
			this.referringErrorMessage = true;
			isValid = false;
		} else {
			if (this.physicianIdInputDisabled === true) {
				this.template.querySelector("label.searchHCPId").className =
					"input-label searchHCPId";
			} else {
				this.template.querySelector("lightning-input.searchHCPId").className =
					"textInput searchHCPId";
				this.template.querySelector("label.searchHCPId").className =
					"input-label-front searchHCPId";
				this.referringErrorMessage = false;
			}
		}
		return isValid;
	}
	authorize() {
		// Add your validation logic here for each required field
		let isValid = true;
		const checkBox = this.template.querySelector('span[data-field="checkbox"]');
		if (!this.consentFields.authorize) {
			this.authorizeErrorMessage = true;
			checkBox.className = "custom-checkbox-box_Error";
			isValid = false;
		} else {
			this.authorizeErrorMessage = false;
			checkBox.className = "custom-checkbox-box";
		}
		return isValid;
	}

	showError(message) {
		const ERROR_MESSAGES = {
			title: "Error",
			message: message,
			variant: "error"
		};
		this.dispatchEvent(
			new CustomEvent("showtoast", { detail: ERROR_MESSAGES })
		);
	}
	showModal() {
		this.openModal = true;
		this.template.querySelector("div.formContainer").style.zIndex = 1001;
	}
	closeModal() {
		this.openModal = false;
		this.template.querySelector("div.formContainer").style.zIndex = 1000;
	}
	expandAddNewForm() {
		if (
			(this.physicianIdInputDisabled === true ||
				this.physicianNameInputDisabled === true) &&
			this.isAddNew === false
		) {
			return;
		}
		if (this.isAddNew === false) {
			this.physicianNameInputDisabled = true;
			this.physicianIdInputDisabled = true;
			this.template.querySelector("lightning-input.searchHCPName").className =
				"InputDisabled  searchHCPName";
			this.template.querySelector("lightning-input.searchHCPId").className =
				"InputDisabled  searchHCPId";
			this.template.querySelector("label.searchHCPId").className =
				"Disable searchHCPId";
			this.template.querySelector("label.searchHCPName").className =
				"Disable searchHCPName";

			this.referringErrorMessage = false;
			this.isAddNew = true;
		} else {
			this.physicianNameInputDisabled = false;
			this.physicianIdInputDisabled = false;
			this.template.querySelector("label.searchHCPName").className =
				"input-label-front searchHCPName";
			this.template.querySelector("label.searchHCPId").className =
				"input-label-front searchHCPId";
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput searchHCPName";
			this.template.querySelector("lightning-input.searchHCPId").className =
				"textInput searchHCPId";
			this.isAddNew = false;
		}
		this.rpFirstnameErrorMessage = false;
		this.RPfirstnameerrorMessagevalid = false;
		this.rpLastnameErrorMessage = false;
		this.rpLastnameErrorMessageValid = false;
		this.rpStateLicenseErrorMessage = false;
		this.rpStateLicenseErrorMessageValid = false;
		this.rpPracticeNameErrorMessage = false;
		this.rpPracticeTypeErrorMessage = false;
		this.RpEmailErrorValid = false;
		this.rpEmailErrorMessage = false;
		this.RPpostalerrorMessagevalid = false;
		this.RPpostalerrorMessagevalid = false;
		this.rpPostalCodeErrorMessage = false;
		this.rpStreetErrorMessage = false;
		this.rpCityErrorMessageValid = false;
		this.rpCityErrorMessage = false;
		this.rpStateCodeErrorMessage = false;
		this.RPcountryerrorMessage = false;
		this.rpPhoneErrorMessage = false;
		this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with GPP.`;
		this.avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo® Patient Support Program, please
							complete the form on this page.`;
	}
	goToHome() {
		window.location.href = BRANDED_URL + HCP;
	}

	// HCP Name Search box handling methods
	// Start

	showHcpNamePicklist() {
		if (!this.searchResultsOne === 0) {
			this.searchResultsOne = this.picklistOrderedOne;
		}
	}
	hcpNameOnChange(event) {
		this.selectedSearchResultOne = "";
		this.searchMain = false;
		const INPUT = event.detail.value.toLowerCase();
		this.searchValueOne = event.detail.value;
		if (this.searchValueOne === "") {
			this.searchMain = true;
			this.referringErrorMessage = true;
			this.template.querySelector("label.searchHCPId").className =
				"input-error-label searchHCPId";
			this.template.querySelector("lightning-input.searchHCPId").className =
				"textInput-err searchHCPId";
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput-err searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-error-label searchHCPName";
		} else {
			this.referringErrorMessage = false;
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-label searchHCPName";
		}

		if (INPUT === "") {

			this.physicianIdInputDisabled = false;
			this.referringErrorMessage = true;
			this.addNewHcpSectionClass = "addNewHcpSection";
			this.template.querySelector("label.searchHCPId").className =
				"input-error-label searchHCPId";
			this.template.querySelector("lightning-input.searchHCPId").className =
				"textInput-err searchHCPId";
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput-err searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-error-label searchHCPName";
		} else {
			this.referringErrorMessage = false;
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-label searchHCPName";
		}

		this.searchResultsOne = this.picklistOrderedOne.filter(
			(picklistOptionOne) =>
				picklistOptionOne.label.toLowerCase().includes(INPUT)
		);
		const SEARCHED_RESULT_ONE = this.picklistOrderedOne.filter(
			(picklistOptionOne) =>
				picklistOptionOne.label.toLowerCase().includes(INPUT)
		);

		this.searchResultEmptyOne = SEARCHED_RESULT_ONE.length === 0 ? true : false;

		if (this.searchResultEmptyOne === true) {
			this.physicianIdInputDisabled = true;
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput-err searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-error-label searchHCPName";
			this.template.querySelector("label.searchHCPId").className =
				"input-label searchHCPId";
			this.addNewHcpSectionClass = "addNewHcpSection-disable";
		}
		if (INPUT.length === 0) {
			this.searchResultsOne = null;
		}
	}

	handleHcpNameOptionClick(event) {
		const SELECTED_VALUE_ONE = event.currentTarget.dataset.value;
		this.hcpId = SELECTED_VALUE_ONE;
		this.searchMain = false;

		this.selectedSearchResultOne = this.picklistOrderedOne.find(
			(picklistOptionOne) => picklistOptionOne.value === SELECTED_VALUE_ONE
		);
		const MESSAGE_EVENT = new CustomEvent("changes", {
			detail: SELECTED_VALUE_ONE
		});
		this.dispatchEvent(MESSAGE_EVENT);
		this.physicianIdInputDisabled = true;
		this.template.querySelector("label.searchHCPId").className =
			"input-label searchHCPId";
		this.addNewHcpSectionClass = "addNewHcpSection-disable";
		this.searchResultsOne = null;
	}

	//End
	// HCP Name Search box handling methods
	// Start
	hcpIdOnChange(event) {
		this.selectedSearchResultTwo = "";
		this.searchMainTwo = false;
		const INPUT = event.detail.value;
		this.searchValueTwo = event.detail.value;
		if (this.searchValueTwo === "") {
			this.searchMainTwo = true;
			this.referringErrorMessage = true;
			this.template.querySelector("label.searchHCPId").className =
				"input-error-label searchHCPId";
			this.template.querySelector("lightning-input.searchHCPId").className =
				"textInput-err searchHCPId";
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput-err searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-error-label searchHCPName";
		} else {
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-label searchHCPName";
		}
		if (INPUT === "") {
			this.physicianNameInputDisabled = false;
			this.addNewHcpSectionClass = "addNewHcpSection";
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput-err searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-error-label searchHCPName";
		} else {
			this.template.querySelector("lightning-input.searchHCPName").className =
				"textInput searchHCPName";
			this.template.querySelector("label.searchHCPName").className =
				"input-label searchHCPName";
		}

		this.searchResultsTwo = this.picklistOrderedTwo
			.filter(
				(element) => element?.label !== null && element?.label !== undefined
			)
			.filter((picklistOptionTwo) =>
				picklistOptionTwo?.label.toString().includes(INPUT)
			);

		this.searchResult2 = this.picklistOrderedTwo
			.filter(
				(element) => element?.label !== null && element?.label !== undefined
			)
			.filter((picklistOptionTwo) =>
				picklistOptionTwo?.label.toString().includes(INPUT)
			);

		this.searchResultEmptyTwo = this.searchResult2.length === 0 ? true : false;

		if (this.searchResultEmptyTwo === true) {
			this.physicianNameInputDisabled = true;
			this.template.querySelector("label.searchHCPId").className =
				"input-error-label searchHCPId";
			this.template.querySelector("lightning-input.searchHCPId").className =
				"textInput-err searchHCPId";
			this.addNewHcpSectionClass = "addNewHcpSection-disable";
		}
		if (INPUT.length === 0) {
			this.searchResultsTwo = null;
		}
	}
	showHcpIdPicklist() {
		if (!this.searchResult2.length === 0) {
			this.searchResultsTwo = this.picklistOrderedTwo.filter(
				(element) => element?.label !== null && element?.label !== undefined
			);
		}
	}
	handleHcpIdOptionClick(event) {
		const SELECTED_VALUE_TWO = event.currentTarget.dataset.value;
           this.hcpId = SELECTED_VALUE_TWO;
		  
		this.selectedSearchResultTwo = this.picklistOrderedTwo.find(
			(picklistOptionTwo) => picklistOptionTwo.value === SELECTED_VALUE_TWO
		);
		const MESSAGE_EVENT = new CustomEvent("changes", {
			detail: SELECTED_VALUE_TWO
		});
		this.dispatchEvent(MESSAGE_EVENT);
		this.physicianNameInputDisabled = true;
		this.addNewHcpSectionClass = "addNewHcpSection-disable";
		this.searchResultsTwo = null;
	}
	// We are using setTimeout to search the combobox in the Physician Id picklist field  to reset the searchResults variable to null.


	//End
	// Drug Search box handling methods
	//Start

	showPicklistOptions() {
		if (!this.searchResults.length === 0) {
			this.searchResults = this.picklistOrdered;
		}
	}

	//This function is used to search the Drug code Fields
	search(event) {
		this.searchValueLogo = false;
		this.searchValue = event.detail.value;
		if (this.SELECTED_VALUE === "") {
			this.searchValueLogo = true;
			this.prescriptionFields.DosageCode = "";
			this.prescriptionFields.Dosage = "";
			this.prescriptionFields.Unit = "";
		}
		if (this.searchValue) {
			this.drugErrorMessage = false;
			this.template.querySelector("lightning-input.hDrug").className =
				"textInput hDrug";
			this.template.querySelector("label.hDrug").className =
				"input-label hDrug";
		}
		this.selectedSearchResult = "";
		let input = event.detail.value.toLowerCase();
		if (input === "") {
			this.searchValueLogo = true;
			this.template.querySelector("lightning-input.hDrug").className =
				"textInput-err hDrug";
			this.template.querySelector("label.hDrug").className =
				"input-error-label hDrug";
			this.drugErrorMessage = true;
		} else {
			this.searchValueLogo = false;
			this.template.querySelector("lightning-input.hDrug").className =
				"textInput hDrug";
			this.template.querySelector("label.hDrug").className =
				"input-label hDrug";
			this.drugErrorMessage = false;
		}

		this.searchResults = this.picklistOrdered.filter((picklistOption) =>
			picklistOption.label.toLowerCase().includes(input)
		);
		const SEARCH_RESULT = this.picklistOrdered.filter((picklistOption) =>
			picklistOption.label.toLowerCase().includes(input)
		);
		this.searchResultEmpty = SEARCH_RESULT.length === 0 ? true : false;
		if (this.searchResultEmpty === true) {
			this.drugErrorMessage = false;
		}
		if (input.length === 0) {
			this.searchResults = null;
		}
	}

	selectSearchResult(event) {
		this.searchValue = event.currentTarget.dataset.value;
		const SELECTED_VALUE = event.currentTarget.dataset.value;
		if (!SELECTED_VALUE) {
			this.template.querySelector("lightning-input.hDrug").className =
				"textInput-err hDrug";
			this.template.querySelector("label.hDrug").className =
				"input-error-label hDrug";
			this.drugErrorMessage = true;
		}
		if (SELECTED_VALUE) {
			this.template.querySelector("lightning-input.hDrug").className =
				"textInput hDrug";
			this.template.querySelector("label.hDrug").className =
				"input-label hDrug";
			this.drugErrorMessage = false;
			this.searchValueLogo = false;
			PRESCRITION_DATA({ productId: SELECTED_VALUE })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then((result) => {
					console.log(result)
					this.prescriptionFields.DosageCode =
						result[0].BI_PSPB_Product_code__c;
					this.prescriptionFields.Dosage = result[0].BI_PSPB_Dosage__c;
					this.prescriptionFields.Unit = result[0].BI_PSPB_Unit__r.Name;
				})
				.catch((error) => {
					// Handle any errors from the Apex call

					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});
		} else {
			this.code = "";
		}
		this.selectedSearchResult = this.picklistOrdered.find(
			(picklistOption) => picklistOption.value === SELECTED_VALUE
		);
		const MESSAGE_EVENT = new CustomEvent("changes", {
			detail: SELECTED_VALUE
		});
		this.dispatchEvent(MESSAGE_EVENT);
		this.searchResults = null;
	}

	// We are using setTimeout to search the combobox in the Drug picklist field  to reset the searchResults variable to null.


	@wire(COUNTRY)
	wiredCountries({ error, data }) {
		if (data) {
			this.CountryCode = data.map((country) => ({
				label: country.label,
				value: country.value
			}));
		} else if (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}

	handleCountryChange(event) {
		this.selectedCountry = event.target.value;
		const MAILING_COUNTRY_CODE_FIELD = this.template.querySelector(
			'lightning-combobox[data-field="hcc"]'
		);
		if (!this.selectedCountry) {
			this.RPcountryerrorMessage = true;
			MAILING_COUNTRY_CODE_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="hcc"]').className =
				"input-error-label";

		} else {
			this.RPcountryerrorMessage = false;
			MAILING_COUNTRY_CODE_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="hcc"]').className =
				"input-label";
		}
		STATE({ selectedCountry: this.selectedCountry })
			.then((result) => {
				this.StateCode = result.map((state) => ({
					label: state.Name,
					value: state.BI_PSPB_StateCode__c
				}));
			})
			.catch((error) => {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});
	}

	//This function is used to date validation in date of birth
	DOByearvalidationforPatient() {
		let isValid = true;
		if (this.oneNineZeroZeroErrors === true) {
			this.template.querySelector(
				'lightning-input[data-field="pdob"]'
			).className = "textInput-err";
			this.template.querySelector('label[data-field="pdob"]').className =
				"input-error-label";
			this.oneNineZeroZeroErrors = true;
			isValid = false;
		} else {
			this.oneNineZeroZeroErrors = false;
			this.template.querySelector(
				'lightning-input[data-field="pdob"]'
			).className = "textInput";
			this.template.querySelector('label[data-field="pdob"]').className =
				"input-label";
		}
		return isValid;
	}

	//This function is used to future date validation in date of birth
	DOBfuturevalidationforPatient() {
		let isValid = true;

		if (this.error === true) {
			this.template.querySelector(
				'lightning-input[data-field="pdob"]'
			).className = "textInput-err";
			this.template.querySelector('label[data-field="pdob"]').className =
				"input-error-label";
			this.error = true;
			this.dobErrorMessage = false;
			isValid = false;
		} else {
			this.error = false;
			this.template.querySelector(
				'lightning-input[data-field="pdob"]'
			).className = "textInput";
			this.template.querySelector('label[data-field="pdob"]').className =
				"input-label";
		}
		return isValid;
	}
	////This function is used to Number input fields
	handleKeyDown(event) {
		const CHAR_CODE = event.which ? event.which : event.keyCode; // Get the ASCII code of the pressed key
		if (CHAR_CODE !== 43 && (CHAR_CODE < 48 || CHAR_CODE > 57)) {
			// Allow only digits (48-57) and the plus symbol (43)
			event.preventDefault(); // Prevent the character from being entered
		}
	}

	//This function is used to Text input fields
	handleKeyDownOne(event) {
		// Allow only letters, backspace, and delete
		if (
			!(
				(event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
				(event.keyCode >= 97 && event.keyCode <= 122) || // a-z
				event.keyCode === 8 || // Backspace
				event.keyCode === 46 || // Delete
				(event.keyCode >= 37 && event.keyCode <= 40) ||
				event.keyCode === 9 || // Tab
				(event.shiftKey && event.keyCode === 9)
			)
		) {
			event.preventDefault();
		}
	}
	handleKeyDownTwo(event) {
		// Allow only numbers, backspace, and delete
		if (
			!(
				(event.keyCode >= 48 && event.keyCode <= 57) || // 0-9
				(event.keyCode >= 96 && event.keyCode <= 105) ||
				event.keyCode === 8 || // Backspace
				event.keyCode === 46 || // Delete
				(event.keyCode >= 37 && event.keyCode <= 40) ||
				event.keyCode === 9 || // Tab
				(event.shiftKey && event.keyCode === 9)
			)
		) {
			event.preventDefault();
		}
		// Prevent input of special characters
		if (event.key.match(/[^a-zA-Z0-9]/u)) {
			event.preventDefault();
		}
	}
	handleKeyDownThree(event) {
		event.preventDefault();
	}

	//This function is used to check for Patient Validation
	UniqueValidation() {
		let isValid = true;
		if (this.isAdult === true) {
			if (
				this.uniqueEmail.includes(this.leadFields.Email) &&
				this.uniqueFName.includes(this.leadFields.FirstName) &&
				this.uniqueLname.includes(this.leadFields.LastName) &&
				this.uniqueDOB.includes(this.leadFields.dob)
			) {
				this.unique = true;
				isValid = false;
			} else {
				this.unique = false;
			}

			if (
				this.uniqueEmail.includes(this.leadFields.Email) &&
				this.unique === false
			) {
				this.matchEmail = true;
				this.PhysicianEmailErr();

				isValid = false;
			} else {
				this.matchEmail = false;
				this.PhysicianEmail();
			}
		}
		return isValid;
	}

	//The Caregivervalidation() function likely validates caregiver data for uniqueness
	//based on email and checks for existing caregiver records in the system.
	Caregivervalidation() {
		if (!this.carevalidateForm()) {
			// No need for a return here
			this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with generalized pustular psoriasis (GPP).`;
			this.avatarContentMid = `To enroll your patients in the Spevigo® Patient Support Program, please complete the form on this page. If you are enrolling a minor patient, please provide the caregiver's information as well.`;
		} else if (this.errors === true || this.minorError === true) {
			this.template.querySelector("lightning-input.cDob").className =
				"inputred cDob";
			this.template.querySelector("label.cDob").className = "labelred cDob";
			// No need for a return here
		} else {
			// If none of the above conditions are met, execute the following code
			this.handleClose();
			this.currentStep = "4";
			this.fieldsMandatory = "paralast";
			this.template.querySelector("div.stepThree").classList.add("slds-hide");
			this.template.querySelector("div.stepFour").classList.remove("slds-hide");
			// Progress indicator
			this.template
				.querySelector("li.li-three")
				.classList.remove("slds-is-active");
			this.template
				.querySelector("li.li-three")
				.classList.add("slds-is-completed");
			this.template.querySelector("li.li-four").classList.add("slds-is-active");
			//To achieve the mobile responsiveness, the following strings are hard coded. Custom Labels can't be used, since they truncate the strings.
			//To achieve mobile responsiveness, we are using innerHTML. However, when attempting to use textContent, it does not meet the design requirements
			this.avatarContentTop = `Thank you for choosing Spevigo® for your patients with GPP.`;
			this.avatarContentMid = `To enroll your patients in the Beyond GPP: The Spevigo® Patient Support Program, please complete the form on this page.`;
			this.mobileValueTwo = `Thank you for choosing Spevigo® for your patients with GPP.
	To enroll your patients in the Beyond
	GPP: The Spevigo® Patient Support
	Program, please complete the form on
	this page.`;
		}
	}

	//This function is used to check for Caregiver Validation
	UniquecaregiverValidation() {
		let isValid = true;
		if (
			this.uniqueEmail[0].includes(this.caregiverFields.Email) &&
			this.uniqueFName[0].includes(this.caregiverFields.FirstName) &&
			this.uniqueLname[0].includes(this.caregiverFields.LastName) &&
			this.uniqueDOB[0].includes(this.caregiverFields.dob)
		) {
			// Assuming isValid is declared before this block

			isValid = true;
		} else {
			if (this.uniqueEmail.includes(this.caregiverFields.Email)) {
				this.matchCaregiverEmail = true;
				this.template.querySelector("lightning-input.cEmail").className =
					"inputred cEmail";
				this.template.querySelector("label.cEmail").className =
					"labelred cEmail";
				isValid = false;
			} else {
				this.matchCaregiverEmail = false;
				this.unique = false;
			}
		}
		return isValid;
	}
	//Showtoast message for catch error
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
}