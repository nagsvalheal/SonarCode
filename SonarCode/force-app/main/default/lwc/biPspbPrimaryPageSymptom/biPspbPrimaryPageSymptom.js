//This components using user body parts and intencity itchiness values store this lwc
// To import Libraries
import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import { refreshApex } from '@salesforce/apex';
import GET_LATEST_SYMPTOM_RECORD from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getLatestSymptomRecord';
import DELETE_SYMPTOM_TRACKER_RECORDS from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.deleteSymptomTrackerRecords'
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import GET_SYMPTOM_RECORD_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getSymptomRecordData';
import GET_CASE_IMAGE_URL from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getBase64Image';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
// To import current user ID
import ID from '@salesforce/user/Id';
// To import Static Resources
import ITCHINESS from '@salesforce/resourceUrl/BI_PSPB_Itchiness';
import REDNESS from '@salesforce/resourceUrl/BI_PSPB_Redness';
import PAIN from '@salesforce/resourceUrl/BI_PSPB_Pain';
import PUSTULES from '@salesforce/resourceUrl/BI_PSPB_PustulesImg';
import FATIGUE from '@salesforce/resourceUrl/BI_PSPB_Fatigue';
import TEMPERATURE from '@salesforce/resourceUrl/BI_PSPB_TemperatureImg';
import HAPPY from '@salesforce/resourceUrl/BI_PSPB_Happy';
import CALENDER from '@salesforce/resourceUrl/BI_PSPB_CalenderIcon';
import VECTOR from '@salesforce/resourceUrl/BI_PSPB_VectorIcon';
// To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import ITCHINESS_IMG from '@salesforce/label/c.BI_PSP_Itchiness';
import REDNESS_IMG from '@salesforce/label/c.BI_PSP_Redness';
import PAIN_IMG from '@salesforce/label/c.BI_PSP_Pain';
import PUSTULES_IMG from '@salesforce/label/c.BI_PSP_Pustules';
import FATIQUE_IMG from '@salesforce/label/c.BI_PSP_Fatique';
import TEMPERATURE_IMG from '@salesforce/label/c.BI_PSP_Temperrature';
import MOOD_IMG from '@salesforce/label/c.BI_PSP_Mood';
import YES from '@salesforce/label/c.BI_PSPB_Yes';
import NO from '@salesforce/label/c.BI_PSP_OptionValueNo';
import BRANDED_URL_NAVIGATION from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVIGATION from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import SYMPTOM_MAIN_PAGE from '@salesforce/label/c.BI_PSPB_SymptomTrackerMainPages';
import REPLACE_SAD from '@salesforce/resourceUrl/BI_PSPB_Sad';
import REPLACE_HAPPY from '@salesforce/resourceUrl/BI_PSPB_HappyColouredReal';
import REPLACE_JOYFUL from '@salesforce/resourceUrl/BI_PSPB_JoyFul';
import REPLACE_SPEECHLESS from '@salesforce/resourceUrl/BI_PSPB_SpeechLess';
import REPLACE_WORRIED from '@salesforce/resourceUrl/BI_PSPB_Worried';
import SAD_MOOD from '@salesforce/label/c.BI_PSP_Sad';
import HAPPY_MOOD from '@salesforce/label/c.BI_PSP_Happy';
import JOYFULL_MOOD from '@salesforce/label/c.BI_PSP_JoyFull';
import SPEECHLESS_MOOD from '@salesforce/label/c.BI_PSP_SpeechLess';
import WORRIED_MOOD from '@salesforce/label/c.BI_PSP_Worried'
export default class biPspbPrimaryPageSymptom extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@api variable declaration

	@api symptomrecord;
	@api isedit;
	@api recordId;
	@api showeditbtn;
	// The Account Id you want to pass to the Apex method
	//@track variable declaration
	@track symptomData;
	@track moodReaction = ''
	@track symptomGpp;
	@track valueSymptom;
	@track isEditOne;
	@track imageUrls = [];
	@track symptomRecordData;
	@track deleteButton = false;
	@track lastEdit = false;
	@track edit = false;
	//Variable declaration
	allergyIntoleranceData;
	latestRecord;
	accountId;
	itchnessImg = ITCHINESS;
	rednessImg = REDNESS;
	painImg = PAIN;
	pustulesImg = PUSTULES;
	fatigueImg = FATIGUE;
	temperatureImg = TEMPERATURE;
	happyImg = HAPPY;
	vectorImg = VECTOR;
	userId = ID;
	calenderImg = CALENDER;
	sadImage = REPLACE_SAD;
	speechless = REPLACE_SPEECHLESS;
	worried = REPLACE_WORRIED;
	happy = REPLACE_HAPPY;
	joyfull = REPLACE_JOYFUL;
	showeditbtnShow;


	currentDate
	// Process retrieved allergy intolerance data, updating UI and properties, particularly for fatigue symptoms detection.
	@wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$symptomrecord' })
	wiredAllergyIntoleranceData({ error, data }) {
		if (data && data !== null) {
			try {

				this.allergyIntoleranceData = data.map(obj =>
					({
						...obj,
						itchness: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === ITCHINESS_IMG,
						redness: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === REDNESS_IMG,
						pain: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === PAIN_IMG,
						fatigue: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === FATIQUE_IMG,
						pustules: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === PUSTULES_IMG,
						temperature: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === TEMPERATURE_IMG,
						moods: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === MOOD_IMG,
						sadImage: obj?.BI_PSP_Mood__c === SAD_MOOD,
						speechless: obj?.BI_PSP_Mood__c === SPEECHLESS_MOOD,
						worried: obj?.BI_PSP_Mood__c === WORRIED_MOOD,
						joyfull: obj?.BI_PSP_Mood__c === JOYFULL_MOOD,
						happy: obj?.BI_PSP_Mood__c === HAPPY_MOOD
					}));

				// }
			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
			}
		} else if (error) {
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
		}
	}
	@wire(GET_SYMPTOM_RECORD_DATA, { symptomTrackerId: '$symptomrecord' })
	wiredgetsymptomrecorddata({ error, data }) {
		if (data && data !== null) {
			try {
				// Split values using semicolon as the delimiter
				this.symptomData = data[0].BI_PSP_EditEntrydates__c;
				this.symptomGpp = data[0].BI_PSP_Are_you_currently_experiencing__c;
				if (this.symptomGpp === true) {
					this.valueSymptom = YES;
				} else if (this.symptomGpp === false) {
					this.valueSymptom = NO;
				}
				this.symptomRecordData = data[0].BI_PSP_Recent_Activities__c
					?.split(';')
					.map(item => item.trim())
					.filter(item => item !== '');
			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
			}
		} else if (error) {
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
		}
	}
	//To fetch the latest symptom recordId
	@wire(GET_LATEST_SYMPTOM_RECORD, { careProgramEnrolleeId: '$accountId' })
	wiredLatestRecord({ error, data }) {
		if (data && data !== null) {
			try {
				this.latestRecord = data[0];
				this.errorMessage = ''; // Clear any previous error
			} catch (err) {
				this.latestRecord = null;
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
			}
		} else if (error) {
			this.latestRecord = null;
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
		}
	}
	// Used to fetch image URL
	@wire(GET_CASE_IMAGE_URL, { symptomTrackerId: '$symptomrecord' })
	caseImageURL;
	get hasImage() {
		this.imageUrls = [];
		if (this.imageUrls.length === 0) {
			try {
				if (this.caseImageURL && this.caseImageURL.data && this.caseImageURL !== null) {
					let splitArray = this.caseImageURL.data?.map((obj) => obj?.split('data:')[1])
					for (let record of splitArray) {
						if (record !== '') {
							this.imageUrls = [...this.imageUrls, 'data:' + record]
						}
					}
				}
			} catch (error) {
				// Handle the error here
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			}
		}
		return true;
	}
	symptomidgetid
	//It initializes component tasks, including edit button visibility, user data retrieval, URL parsing, setting URLs

	connectedCallback() {
		let globalThis = window;
		try {
			if (this.showeditbtn === false) {
				this.showeditbtnShow = false;
			}
			else {
				this.showeditbtnShow = true;
			}

			GET_ENROLLEE({ userId: this.userId })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then(result => {
					if (result !== null) {
						if (result[0].patientEnrolle !== null) {
							this.accountId = result[0].patientEnrolle.Id;

						} else if (result[0].error !== null) {
							this.errorMessage = result[0].error;
						}
					}
				})
				.catch(error => {
					// Handle any errors occurring during the promise chain
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				});


			const currentURL = globalThis.location?.href;
			// Create a URL object
			const urlObject = new URL(currentURL);
			// Get the path
			const path = urlObject.pathname;
			// Split the path using '/' as a separator
			const pathComponents = path.split('/');
			// Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find(component =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVIGATION;
			}
			else {
				this.urlq = UNASSIGNED_URL_NAVIGATION;
			}
			this.symptomidgetid = this.symptomrecord;
			this.currentDate = new Date().toISOString().slice(0, 10);
			if (this.isedit === true) {
				this.isEditOne = false;
			} else {
				this.isEditOne = true;
			}
		}
		catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}
	// Manually refresh the wire adapter
	refreshWireAdapter() {
		return refreshApex(this.wiredAllergyIntoleranceData);
	}
	//function asynchronously reads a Blob object as a data URL and returns a Promise resolving with the data URL.
	readAsDataURL(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				const base64String = event.target.result;
				resolve(`data:image/${blob.type.split('/')[1]};base64,${base64String}`);
			};
			reader.onerror = (error) => {
				reject(error);
			};
			reader.readAsDataURL(blob);
		});
	}
	//To delete the entry or modify data
	handleDeleteClick() {
		this.opendeletbtn();
	}
	//This function deletes symptom tracker records and it disables a delete button.
	lastrecorddelete() {
		let globalThis = window;
		DELETE_SYMPTOM_TRACKER_RECORDS({ symptomTrackerId: this.symptomrecord })
		globalThis.location.reload()

			.then(result => {
				if (result) {
					//Handle success
					globalThis.location.reload();
				}
			})
			.catch(error => {
				// Handle error
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});
		this.deleteButton = false;
	}
	// Open delete button and prevent scrolling on the body.
	opendeletbtn() {
		// Add your specific logic for opening the mood modal
		this.deleteButton = true;
		document.body.style.overflow = 'hidden';
		this.submitModal = false;
	}
	// Close delete button, restore scrolling, and perform last record deletion.
	closedeletbtn() {
		// Add your specific logic for closing the mood modal
		this.deleteButton = false;
		document.body.style.overflow = ''; // Reset to default
		this.lastrecorddelete();
	}
	// Close delete button and restore scrolling to default.
	closedeletbtnadd() {
		// Add your specific logic for closing the mood modal
		this.deleteButton = false;
		document.body.style.overflow = '';

		// Reset to default   
	}
	//This function opens the mood modal and disables scrolling on the page
	openlastedit() {
		// Add your specific logic for opening the mood modal      
		this.lastEdit = true;
		document.body.style.overflow = 'hidden';
	}
	// Add your specific logic for closing the mood modal
	closelastedit() {
		this.lastEdit = false;
		document.body.style.overflow = ''; // Reset to default
	}
	//Compares the latest record with the current symptom record
	navigatesymptom() {
		if (this.latestRecord !== this.symptomrecord) {
			this.openlastedit()
		} else if (this.latestRecord === this.symptomrecord) {
			// Redirect to a new page and set item in localStorage
			this.openedit();
		}
	}
	// Add your specific logic for opening the mood modal
	openedit() {
		this.edit = true;
		document.body.style.overflow = 'hidden';
	}
	// Add your specific logic for closing the mood modal
	closeedit() {
		this.edit = false;
		this.deleteButton = false;
		document.body.style.overflow = ''; // Reset to default
	}
	lastedtirdate() {
		let globalThis = window;
		if (this.latestRecord !== this.symptomrecord) {
			this.openlastedit();
			this.lastEdit = false;
			document.body.style.overflow = '';
		} else if (this.latestRecord === this.symptomrecord) {
			// Redirect to a new page and set item in localStorage
			globalThis.location?.assign(SYMPTOM_MAIN_PAGE);
			// Store data labeled as 'symptomlastid' in the session storage without altering custom labels.
			globalThis.localStorage.setItem('symptomlastid', this.symptomrecord);
		}
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