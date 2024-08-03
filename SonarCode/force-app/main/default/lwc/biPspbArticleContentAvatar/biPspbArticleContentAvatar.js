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
import { LABELS } from 'c/biPspbLabelForInfoCenter';


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
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	// To set the property of para element if the status is unassigned
	renderedCallback() {
		//code
		try {
			if (this.patientStatusRecord === LABELS.UNASSIGNED_STATUS) {
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
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIANT); // Catching Potential Error
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
				[LABELS.BRANDED_URL.toLowerCase(), LABELS.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === LABELS.BRANDED_URL.toLowerCase()) {
				this.urlq = LABELS.BRANDED_URL;
				this.siteUrlq = LABELS.BRANDED_SITE_URL;
			} else {
				this.urlq = LABELS.UNASSIGNED_URL;
				this.siteUrlq = LABELS.UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split("/");
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;

			if (this.urlq === LABELS.BRANDED_URL) {
				this.showBrandedNav = true;
			} else {
				this.showBrandedNav = false;
			}
		}
		catch(error){
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIANT); // Catching Potential Error

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
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
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
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	secureRandom() {
		const array = new Uint32Array(1);
		window.crypto.getRandomValues(array); // Generate a random value
		return array[0] / (0xFFFFFFFF + 1); // Normalize to 0 to 1
	}
	// Generate a random decimal between 0 (inclusive) and 1 (exclusive)
	getRandomNumber(min, max) {
		let randomDecimal = this.secureRandom();

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
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error
		}
	}

	// Function to find the category of the given article
	findCategory() {
		try {
			let categoryArticles = {
				[LABELS.GEN_CATEGORY]: [
					LABELS.WHAT_GPP_LABEL,
					LABELS.FACTS_GPP_LABEL,
					LABELS.RARE_GPP_LABEL,
					LABELS.WHY_DO_I_HAVE_GPP_LABEL,
					LABELS.DIAGNOSIS_GPP_LABEL
				],
				[LABELS.SOCIAL_LIFE_CATEGORY]: [
					LABELS.GPP_CONTAGIOUS_LABEL,
					LABELS.FRIENDS_FAMILY_LABEL,
					LABELS.FEELING_EXCLUDED_LABEL,
					LABELS.GPP_INTIMACY_LABEL
				],
				[LABELS.MANAGEMENT_CATEGORY]: [
					LABELS.GPP_PREGNANCY_LABEL,
					LABELS.MANAGE_FLARE_LABEL,
					LABELS.GPP_COMORBIDITIES_LABEL,
					LABELS.MANAGE_GPP_SYMPTOMS_LABEL,
					LABELS.ASK_DOCTOR_LABEL,
					LABELS.SEEK_MEDICARE_LABEL,
					LABELS.SEEK_EMERGENCY_LABEL,
					LABELS.MANAGE_SCARS_LABEL,
					LABELS.COMPLICAT_GPP_LABEL,
					LABELS.RECOGNIZING_FLARES_LABEL,
					LABELS.VISIT_DOCTOR_LABEL,
					LABELS.DERMATOLOGIST_LABEL,
					LABELS.TREATING_GPP_LABEL,
					LABELS.SPEVIGO_INFUSION_LABEL,
					LABELS.PREVENTION_GPP_LABEL,
					LABELS.SPEVIGO_INJECTION_LABEL,
					LABELS.WORK_IN_GPP_LABEL
				],
				[LABELS.MENTAL_HEALTH_CATEGORY]: [LABELS.TALK_GPP_LABEL, LABELS.NOT_ALONE_LABEL],
				[LABELS.HEALTHY_LIFE_CATEGORY]: [LABELS.POSITIVE_CHOICES_LABEL]
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
				this.categoryRecord = LABELS.GEN_CATEGORY;
			}
		} catch (error) {
			this.showToast(LABELS.ERROR_MESSAGE, error.message, LABELS.ERROR_VARIANT); // Catching Potential Error
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
				this.showToast(LABELS.ERROR_MESSAGE, error.body.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(LABELS.ERROR_MESSAGE, err.message, LABELS.ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	// To navigate information center search results page
	handleSearch(event) {
		let searchTerm = event.target.value.toLowerCase();
		this.searchitems = [];

		if (event.key === LABELS.ENTER_EVENT && searchTerm) {
			window.location.href =
				this.baseUrl + this.siteUrlq + LABELS.SEARCH_PAGE + searchTerm;
		}
	}

	// To load the search method
	handleSearchButtonClick() {
		this.handleSearch();
	}

	// Method to handle key up event for search input
	handleSearchInputKeyUp(event) {
		if (event.key === LABELS.ENTER_EVENT) {
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