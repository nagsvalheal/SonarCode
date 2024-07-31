//This components using user body parts and intencity itchiness values store this lwc
// To import Libraries
import { LightningElement, wire, api } from 'lwc';
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
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
export default class biPspbPrimaryPageSymptom extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@api variable declaration

	@api symptomrecord;
	@api isedit;
	@api recordId;
	@api showeditbtn;
	// The Account Id you want to pass to the Apex method
	//@track variable declaration
	symptomData;
	moodReaction = ''
	symptomGpp;
	valueSymptom;
	isEditOne;
	imageUrls = [];
	symptomRecordData;
	deleteButton = false;
	lastEdit = false;
	edit = false;
	//Variable declaration
	allergyIntoleranceData;
	latestRecord;
	accountId;
	itchnessImg = label.ITCHINESS_IMG;
	rednessImg = label.REDNESS;
	painImg = label.PAIN;
	pustulesImg = label.PUSTULES;
	fatigueImg = label.FATIGUE;
	temperatureImg = label.TEMPERATURE;
	happyImg = label.HAPPY;
	vectorImg = label.VECTOR;
	userId = label.ID;
	calenderImg = label.CALENDER;
	sadImage = label.REPLACE_SAD;
	speechless = label.REPLACE_SPEECHLESS;
	worried = label.REPLACE_WORRIED;
	happy = label.REPLACE_HAPPY;
	joyfull = label.REPLACE_JOYFUL;
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
						itchness: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.ITCHINESS_VALUES,
						redness: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.REDNESS_VALUE,
						pain: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.PAIN_VALUES,
						fatigue: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.FATIGUE_VALUES,
						pustules: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.PUSTULES_VALUE,
						temperature: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.TEMPERATURE_VALUES,
						moods: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.MOOD_VALUES,
						sadImage: obj?.BI_PSP_Mood__c === label.SAD_MOOD,
						speechless: obj?.BI_PSP_Mood__c === label.SPEECHLESS_MOOD,
						worried: obj?.BI_PSP_Mood__c === label.WORRIED_MOOD,
						joyfull: obj?.BI_PSP_Mood__c === label.JOYFULL_MOOD,
						happy: obj?.BI_PSP_Mood__c === label.HAPPY_MOOD
					}));

				// }
			} catch (err) {
				this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
			}
		} else if (error) {
			this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
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
					this.valueSymptom = label.YES;
				} else if (this.symptomGpp === false) {
					this.valueSymptom = label.NO;
				}
				this.symptomRecordData = data[0].BI_PSP_Recent_Activities__c
					?.split(';')
					.map(item => item.trim())
					.filter(item => item !== '');
			} catch (err) {
				this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
			}
		} else if (error) {
			this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
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
				this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
			}
		} else if (error) {
			this.latestRecord = null;
			this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
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
				this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
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
					this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
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
				[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
			if (desiredComponent.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
				this.urlq = label.BRANDED_URL_NAVIGATION;
			}
			else {
				this.urlq = label.UNASSIGNED_URL_NAVIGATION;
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
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
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
				this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
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
			globalThis.location?.assign(label.SYMPTOM_MAIN_PAGE_URL);
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