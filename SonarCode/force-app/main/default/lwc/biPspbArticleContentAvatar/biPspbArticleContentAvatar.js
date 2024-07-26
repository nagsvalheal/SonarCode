// This lightning web component is used for display the personalized messages based on category of the article selected
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
// To import Apex Classes
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
import GET_CATEGORY_MESSAGES from '@salesforce/apex/BI_PSPB_PersonalizedMessagesCtrl.getCategoryMessages';
import USER_CAREGIVER from '@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver';
import GET_LOGGED_IN_USER_ACCOUNT from '@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount';
// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
// To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import WHAT_GPP_LABEL from '@salesforce/label/c.BI_PSP_WhatGppLabel';
import FACTS_GPP_LABEL from '@salesforce/label/c.BI_PSP_FactsGppLabel';
import RARE_GPP_LABEL from '@salesforce/label/c.BI_PSP_RareGppLabel';
import WHY_DO_I_HAVE_GPP_LABEL from '@salesforce/label/c.BI_PSP_WhyDoIHaveGppLabel';
import DIAGNOSIS_GPP_LABEL from '@salesforce/label/c.BI_PSP_DiagnosisGppLabel';
import GPP_CONTAGIOUS_LABEL from '@salesforce/label/c.BI_PSP_GppContagiousLabel';
import FRIENDS_FAMILY_LABEL from '@salesforce/label/c.BI_PSP_FriendsFamilyLabel';
import FEELING_EXCLUDED_LABEL from '@salesforce/label/c.BI_PSP_FeelingExcludedLabel';
import GPP_INTIMACTY_LABEL from '@salesforce/label/c.BI_PSP_GppIntimacyLabel';
import GPP_PREGNANCY_LABEL from '@salesforce/label/c.BI_PSP_GppPregnancyLabel';
import MANAGE_FLARE_LABEL from '@salesforce/label/c.BI_PSP_ManageFlareLabel';
import GPP_COMORBIDITIES_LABEL from '@salesforce/label/c.BI_PSP_GppComorbiditiesLabel';
import MANAGE_GPP_SYMPTOMS_LABEL from '@salesforce/label/c.BI_PSP_ManageGppSymptomsLabel';
import ASK_DOCTOR_LABEL from '@salesforce/label/c.BI_PSP_AskDoctorLabel';
import SEEK_MEDICARE_LABEL from '@salesforce/label/c.BI_PSP_SeekMediCareLabel';
import SEEK_EMERGENCY_LABEL from '@salesforce/label/c.BI_PSP_SeekEmergencyLabel';
import MANAGE_SCARS_LABEL from '@salesforce/label/c.BI_PSP_ManageScarsLabel';
import COMPLICAT_GPP_LABEL from '@salesforce/label/c.BI_PSP_ComplicatGppLabel';
import RECOGNIZING_FLARES_LABEL from '@salesforce/label/c.BI_PSP_RecognizingFlaresLabel';
import VISIT_DOCTOR_LABEL from '@salesforce/label/c.BI_PSP_VisitDoctorLabel';
import DERMATOLOGIST_LABEL from '@salesforce/label/c.BI_PSP_DermatologistLabel';
import TALK_GPP_LABEL from '@salesforce/label/c.BI_PSP_TalkGppLabel';
import NOT_ALONE_LABEL from '@salesforce/label/c.BI_PSP_NotAloneLabel';
import POSITIVE_CHOICES_LABEL from '@salesforce/label/c.BI_PSP_PositiveChoicesLabel';
import TREATING_GPP_LABEL from '@salesforce/label/c.BI_PSPB_TreatingGppLabel';
import SPEVIGO_INFUSION_LABEL from '@salesforce/label/c.BI_PSPB_SpevigoInfusionLabel';
import PREVENTION_GPP_LABEL from '@salesforce/label/c.BI_PSPB_PreventionGppLabel';
import SPEVIGO_INJECTION_LABEL from '@salesforce/label/c.BI_PSPB_SpevigoInjectionLabel';
import WORK_IN_GPP_LABEL from '@salesforce/label/c.BI_PSPB_WorkInGppLabel';
import GEN_CATEGORY from '@salesforce/label/c.BI_PSP_GenMessageCategory';
import SOCIAL_LIFE_CATEGORY from '@salesforce/label/c.BI_PSP_SocialLifeCategory';
import MANAGEMENT_CATEGORY from '@salesforce/label/c.BI_PSP_ManagementCategory';
import MENTAL_HEALTH_CATEGORY from '@salesforce/label/c.BI_PSP_MentalHealthCategory';
import HEALTHY_LIFE_CATEGORY from '@salesforce/label/c.BI_PSPB_HealthyLifeCategory';
import UNASSIGNED_STATUS from '@salesforce/label/c.BI_PSP_Unassigned';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import SEARCH_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterSearchUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIENT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ENTER_EVENT from '@salesforce/label/c.BI_PSP_EventEnter';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbArticleContentAvatar extends LightningElement {

	message = '';
	generalMessages = [];
	genMessageRecord = '';
	result = '';
	currentUserName = '';
	currentUserId = '';
	userId = ID;
	articleTitle = '';
	categoryRecord = '';
	caregiver = false;
	name;
	urlq;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showBrandedNav = true;
	patientStatusRecord = '';
	selectedAvatarSrc;
	userAccounts;
	siteUrlq;
	cardImage = '';

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retirieve the staus value of a Patient
	@wire(PATIENT_STATUS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientStatusRecord = data;

				// Handle the data
			} else if (error) {
				// Handle the error
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIENT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIENT); // Catching Potential Error from Lwc
		}
	}

	// To set the property of para element if the status is unassigned
	renderedCallback() {
		//code
		try {
			if (this.patientStatusRecord === UNASSIGNED_STATUS) {
				// Assuming you have a paragraph element with the class 'para'
				let paraElement = this.template.querySelector(".para");

				// Check if the element with the class "para" exists
				if (paraElement) {
					if (window.innerWidth > 1115) {
						// Set the top property to 10%
						paraElement.style.top = "326px";
					}
				}
			}
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIENT); // Catching Potential Error
		}
	}

	connectedCallback() {
		try{
			let globalThis = window;
			let currentUrl = globalThis.location.href;

			// Create a URL object
			let urlObject = new URL(currentUrl);

			// Get the path
			let path = urlObject.pathname;

			// Split the path using '/' as a separator
			let pathComponents = path.split("/");

			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL;
				this.siteUrlq = BRANDED_SITE_URL;
			} else {
				this.urlq = UNASSIGNED_URL;
				this.siteUrlq = UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split("/");
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;

			if (this.urlq === BRANDED_URL) {
				this.showBrandedNav = true;
			} else {
				this.showBrandedNav = false;
			}
		}
		catch(error){
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIENT); // Catching Potential Error

		}
	}
	// To clear the search input
	clearInput() {
		let inputElement = this.template.querySelector(".search-bar");
		if (inputElement) {
			inputElement.value = "";
		}
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retireve the Avatar of the Caregiver
	@wire(USER_CAREGIVER)
	wiredAvatarList({ error, data }) {
		try {
			if (data) {
				// Assign the data to the reactive property

				if (data.length > 0) {
					this.caregiver = true;
					this.name = data.length > 0 ? data[0].Name : "";
					this.currentUserName = this.name;

					if (this.genMessageRecord.includes("{!username}")) {
						this.genMessageRecord = this.genMessageRecord.replace(
							/\{!username\}/gu,
							this.currentUserName
						);
					}

					if (this.genMessageRecord.includes("XXX")) {
						this.genMessageRecord = this.genMessageRecord.replace(
							/XXX/gu,
							this.currentUserName
						);
					}
					this.cardImage = data[0]?.BI_PSP_AvatarUrl__c
						? data[0]?.BI_PSP_AvatarUrl__c
						: DEFAULT_IMG;
					if (data[0]?.BI_PSP_AvatarUrl__c) {
						this.cardImage = data[0]?.BI_PSP_AvatarUrl__c;
					} else {
						this.cardImage = DEFAULT_IMG;
					}
				}
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIENT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIENT); // Catching Potential Error from Lwc
		}
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retireve the Avatar of the Patient
	@wire(GET_LOGGED_IN_USER_ACCOUNT)
	wiredUserAccounts({ error, data }) {
		try {
			if (data) {
				this.userAccounts = data;
				if (this.caregiver === false) {
					this.name =
						this.userAccounts.length > 0 ? this.userAccounts[0]?.Name : "";
					this.currentUserName = this.name;

					if (this.genMessageRecord.includes("{!username}")) {
						this.genMessageRecord = this.genMessageRecord.replace(
							/\{!username\}/gu,
							this.currentUserName
						);
					}

					if (this.genMessageRecord.includes("XXX")) {
						this.genMessageRecord = this.genMessageRecord.replace(
							/XXX/gu,
							this.currentUserName
						);
					}

					if (this.userAccounts[0]?.BI_PSP_AvatarUrl__c) {
						this.cardImage = this.userAccounts[0]?.BI_PSP_AvatarUrl__c;
					} else {
						this.cardImage = DEFAULT_IMG;
					}
				}
			} else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIENT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIENT); // Catching Potential Error from Lwc
		}
	}

	// Generate a random decimal between 0 (inclusive) and 1 (exclusive)
	getRandomNumber(min, max) {
		let randomDecimal = Math.random();

		// Scale the random decimal to the range [min, max)
		let randomNumber = Math.floor(randomDecimal * (max - min + 1)) + min;

		return randomNumber;
	}

	// Wire method to capture the current page reference and extract the state id value
	@wire(CurrentPageReference)
	pageReference({ state }) {
		try {
			if (state && state.id) {
				this.articleTitle = state.id;
				this.findCategory();
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIENT); // Catching Potential Error
		}
	}

	// Function to find the category of the given article
	findCategory() {
		try {
			let categoryArticles = {
				[GEN_CATEGORY]: [
					WHAT_GPP_LABEL,
					FACTS_GPP_LABEL,
					RARE_GPP_LABEL,
					WHY_DO_I_HAVE_GPP_LABEL,
					DIAGNOSIS_GPP_LABEL
				],
				[SOCIAL_LIFE_CATEGORY]: [
					GPP_CONTAGIOUS_LABEL,
					FRIENDS_FAMILY_LABEL,
					FEELING_EXCLUDED_LABEL,
					GPP_INTIMACTY_LABEL
				],
				[MANAGEMENT_CATEGORY]: [
					GPP_PREGNANCY_LABEL,
					MANAGE_FLARE_LABEL,
					GPP_COMORBIDITIES_LABEL,
					MANAGE_GPP_SYMPTOMS_LABEL,
					ASK_DOCTOR_LABEL,
					SEEK_MEDICARE_LABEL,
					SEEK_EMERGENCY_LABEL,
					MANAGE_SCARS_LABEL,
					COMPLICAT_GPP_LABEL,
					RECOGNIZING_FLARES_LABEL,
					VISIT_DOCTOR_LABEL,
					DERMATOLOGIST_LABEL,
					TREATING_GPP_LABEL,
					SPEVIGO_INFUSION_LABEL,
					PREVENTION_GPP_LABEL,
					SPEVIGO_INJECTION_LABEL,
					WORK_IN_GPP_LABEL
				],
				[MENTAL_HEALTH_CATEGORY]: [TALK_GPP_LABEL, NOT_ALONE_LABEL],
				[HEALTHY_LIFE_CATEGORY]: [POSITIVE_CHOICES_LABEL]
			};

			// Input article
			let article = this.articleTitle;
			for (let category in categoryArticles) {
				if (categoryArticles[category].includes(article)) {
					this.categoryRecord = category;
					break;
				}
			}
			if (this.categoryRecord.length === 0) {
				this.categoryRecord = GEN_CATEGORY;
			}
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIENT); // Catching Potential Error
			// Handle the error as needed
		}
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve personalized message based on given category
	@wire(GET_CATEGORY_MESSAGES, { category: "$categoryRecord" }) // Use dynamic parameter
	wiredCategoryMessages({ error, data }) {
		try {
			if (data) {
				this.generalMessages = data;
				this.result = this.getRandomNumber(0, this.generalMessages.length - 1);
				this.genMessageRecord = this.generalMessages[this.result];

				// Replace placeholders in message
				if (this.genMessageRecord.includes("{!username}")) {
					if (this.currentUserName !== "") {
						this.genMessageRecord = this.genMessageRecord.replace(
							/\{!username\}/gu,
							this.currentUserName
						);
					}
				}

				if (this.genMessageRecord.includes("XXX")) {
					if (this.currentUserName !== "") {
						this.genMessageRecord = this.genMessageRecord.replace(
							/XXX/gu,
							this.currentUserName
						);
					}
				}

				if (this.genMessageRecord === this.message) {
					this.genMessageRecord = this.generalMessages[this.result - 1];
				}

				// Handle other replacements as needed
			} else if (error) {
				// Handle errors
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIENT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIENT); // Catching Potential Error from Lwc
		}
	}

	// To navigate information center search results page
	handleSearch(event) {
		let searchTerm = event.target.value.toLowerCase();
		this.searchitems = [];

		if (event.key === ENTER_EVENT && searchTerm) {
			window.location.href =
				this.baseUrl + this.siteUrlq + SEARCH_PAGE + searchTerm;
		}
	}

	// To load the search method
	handleSearchButtonClick() {
		this.handleSearch();
	}

	// Method to handle key up event for search input
	handleSearchInputKeyUp(event) {
		if (event.key === ENTER_EVENT) {
			this.handleSearch(event);
		}
	}

	// Method to handle focus on the search bar
	handleSearchBarFocus() {
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderColor = "#7B4D00";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderWidth = "2px";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.transition = "0.1s";
	}

	// Method to handle blur event on the search bar
	handleSearchBarBlur() {
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderColor = "rgba(111, 81, 29, 1)";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.borderWidth = "2px";
		this.template.querySelector(
			"hr.search-bar-border-bottom"
		).style.transition = "0.1s";
	}

	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		let event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
	if(typeof window !== 'undefined'){
		this.dispatchEvent(event);
	}
	}
}