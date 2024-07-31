// This components using user reaction save values store this lwc
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation'
// To import Apex Classes
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';

export default class biPspbMoodSymptom extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//variable declaration
	currentMoodError = false;
	boxedIcon = label.BOXED_ICON;
	valueOfTemperature;
	localStorageValueItchiness;
	lastSymptomId;
	emojiName = [];
	sliderValue = 0;
	currentMoodErrorSad = false;
	insertCount;
	itchinessValues = label.MOOD_VALUES;
	allergyIntoleranceData;
	carePlanTemplateName;
	humanParts = ''
	//Variable declaration
	wooriedMood = label.WORRIED_MOOD;
	speechLessMood = label.SPEECHLESS_MOOD;
	joyFullMood = label.JOYFULL_MOOD;
	happyMood = label.HAPPY_MOOD;
	sadMood = label.SAD_MOOD;
	recordInsertCount = 0;
	accountId;
	userId = label.ID;
	selectedEmoji = null;
	imgUrlSad = label.WORRIED;
	imgUrlWorried = label.SAD;
	imgUrlSpeechless = label.SPEECHLESS;
	imgUrlJoyfull = label.JOYFULL;
	imgUrlHappy = label.HAPPY;
	isButtonDisabled = false;
	fatiqueErrors = false;
	// Process retrieved allergy intolerance data, updating UI and properties, particularly for fatigue symptoms detection.

	// To Fetch enrolle Id and Moodsymptom data
	connectedCallback() {
		let globalThis = window;

		try {
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.			
			this.insertCount = globalThis?.sessionStorage.getItem('countmood');
			//Initialize button disabled state
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.			
			this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid')
			//Retrieve mood symptom from session storage and set last symptom id
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.			
			let moodSymptom = globalThis?.sessionStorage.getItem('mood', this.emojiName);
			if (moodSymptom && moodSymptom !== null) {
				this.fatiqueErrors = true;
			}
			else {
				this.moodDataRefreshData(this.lastSymptomId);
				this.fatiqueErrors = false;
			}
			//Set image URLs based on mood symptom
			if (moodSymptom === label.SAD_MOOD) {
				this.imgUrlSad = label.REPLACE_WORRIED;

			}
			if (moodSymptom === label.HAPPY_MOOD) {
				this.imgUrlHappy = label.REPLACE_HAPPY;
			}
			if (moodSymptom === label.JOYFULL_MOOD) {
				this.imgUrlJoyfull = label.REPLACE_JOYFUL;
			}
			if (moodSymptom === label.SPEECHLESS_MOOD) {
				this.imgUrlSpeechless = label.REPLACE_SPEECHLESS;
			}
			if (moodSymptom === label.WORRIED_MOOD) {
				this.imgUrlWorried = label.REPLACE_SAD;
				this.currentMoodErrorSad = true;
			}
			//Set the selected emoji based on mood symptom
			this.emojiName = moodSymptom;

			GET_ENROLLEE({ userId: this.userId })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then(result => {
					if (result !== null) {
						if (result[0].patientEnrolle !== null) {
							this.accountId = result[0].patientEnrolle.Id;
							//Additional processing if needed
						} else if (result[0].error !== null) {
							this.showError = true;
							this.label.ERROR_MESSAGE = result[0].error;
						}
					}
				})
				.catch(error => {
					//Handle any errors that occurred during the promise chain
					this.showToast(label.label.ERROR_MESSAGE, error.message, label.label.ERROR_VARIANT);
					//Additional error handling if needed
				});
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.			
			this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId)
			this.currentMoodError = true;
		} catch (err) {
			// Handle any errors that occurred during the execution of the connectedCallback function
			this.showToast(label.label.ERROR_MESSAGE, err.message, label.label.ERROR_VARIANT);
		}
	}


	moodDataRefreshData(symptomLastId) {
		GET_ALLERGY_INTOLERANCE_DATA({ symptomTrackerId: symptomLastId })
			.then((data) => {
				if (data && data !== null) {

					// Use setTimeout to delay the execution
					Promise.resolve().then(() => {

						// Initialize variables
						let moodSymptom;

						for (let record of data) {
							moodSymptom = record.BI_PSP_Mood__c;
							this.fatiqueErrors = true;

							let carePlanTemplate = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;

							// Check if care plan template name matches 'Temperature' and set corresponding values
							if (carePlanTemplate === this.itchinessValues) {
								this.carePlanTemplateName = this.itchinessValues;
							}



							if (this.carePlanTemplateName === this.itchinessValues) {
								// Compare with the string 'Mood'
								this.carePlanTemplateName = this.itchinessValues;

								if (moodSymptom === label.SAD_MOOD) {
									this.imgUrlSad = label.REPLACE_WORRIED;

								}
								if (moodSymptom === label.HAPPY_MOOD) {
									this.imgUrlHappy = label.REPLACE_HAPPY;
								}
								if (moodSymptom === label.JOYFULL_MOOD) {
									this.imgUrlJoyfull = label.REPLACE_JOYFUL;
								}
								if (moodSymptom === label.SPEECHLESS_MOOD) {
									this.imgUrlSpeechless = label.REPLACE_SPEECHLESS;
								}
								if (moodSymptom === label.WORRIED_MOOD) {
									this.imgUrlWorried = label.REPLACE_SAD;
									this.currentMoodErrorSad = true;
								}



								this.emojiName = moodSymptom;
							}
						}
					}, 100); // Adjust the delay as needed
				}
			})
			.catch((error) => {
				this.showToast(label.label.ERROR_MESSAGE, error.body.message, label.label.ERROR_VARIANT);
			});
	}

	//Handle emoji click event to set the selected emoji name
	handleEmojiClick(event) {
		const emojiName = event.currentTarget.getAttribute('data-name');
		if (emojiName) {
			this.fatiqueErrors = true;

		}
		else {
			this.fatiqueErrors = false;

		}
		this.emojiName = emojiName;
		this.isButtonDisabled = false;

		// Clear previous error states
		this.currentMoodError = false;
		this.currentMoodErrorSad = false;

		// Reset all images to their normal state
		this.imgUrlHappy = label.HAPPY;
		this.imgUrlJoyfull = label.JOYFULL;
		this.imgUrlSpeechless = label.SPEECHLESS;
		this.imgUrlWorried = label.SAD;
		this.imgUrlSad = label.WORRIED;

		// Update image URLs based on the newly selected emoji
		switch (emojiName) {
			case this.happyMood:
				this.imgUrlHappy = label.REPLACE_HAPPY;
				break;
			case this.joyFullMood:
				this.imgUrlJoyfull = label.REPLACE_JOYFUL;
				break;
			case this.speechLessMood:
				//Set image URL for speechless emoji
				this.imgUrlSpeechless = label.REPLACE_SPEECHLESS;
				break;
			case this.wooriedMood:
				//Set image URL for worried emoji
				this.imgUrlWorried = label.REPLACE_SAD;
				this.currentMoodErrorSad = true;
				break;
			case this.sadMood:
				//Set image URL for sad emoji
				this.imgUrlSad = label.REPLACE_WORRIED;
				break;
			default:
				break;
		}
		// Set the newly selected emoji as the current selectedEmoji
		this.selectedEmoji = this.emojiName;
	}

	//Async function to handle changes when accepting input
	onchangeAccept() {

		let globalThis = window;
		let itchinessAllRecordInsert = {
			valueOfSlider: parseFloat(this.sliderValue), // Convert to float if valueOfSlider is numeric
			careProgramId: this.accountId,
			sliderValue: parseFloat(this.valueOfTemperature) || 0, // Convert to float and handle null or invalid values
			symptomId: this.localStorageValueItchiness || this.lastSymptomId, // Use default value if lastsymptomid is null
			symptomName: this.itchinessValues || '', // Use default value if itchinessValues is null
			moodvalues: this.emojiName || '', // Use default value if moodvalues is null
		}; this.partsOfBody = this.humanParts;
		let itchinessAllRecordUpdate = {
			valueOfSlider: parseFloat(this.sliderValue), // Convert to float if valueOfSlider is numeric
			careProgramId: this.accountId,
			sliderValue: parseFloat(this.valueOfTemperature) || 0, // Convert to float and handle null or invalid values
			symptomId: this.lastSymptomId || this.localStorageValueItchiness, // Use default value if lastsymptomid is null
			symptomName: this.itchinessValues || '', // Use default value if itchinessValues is null
			moodvalues: this.emojiName || '', // Use default value if moodvalues is null
		};

		this.partsOfBody = this.humanParts;
		//Try block to handle potential errors during record update or insertion
		try {
			if (this.insertCount === '1') {

				//Update existing record if insert count is 1             
				RECORD_UPDATE_ALLERGY_INTOLERANCE({
					itchinessallrecordupdate: itchinessAllRecordUpdate, bodyParts: this.partsOfBody
				}).then(result => {
					// Store data labeled as 'myData' in the session storage without altering custom labels.
					if (result && result !== null) {
						globalThis?.sessionStorage.setItem('mood', this.emojiName);
						globalThis?.sessionStorage.setItem('syptombtn', false);
						if (typeof window !== 'undefined') {
							const updateEvent = new CustomEvent('updatechildprop', {
								detail: false
							});
							this.dispatchEvent(updateEvent);
						}
					}
				})
					.catch(error => {
						//Handle error if update fails
						this.showToast(label.label.ERROR_MESSAGE, error.message, label.label.ERROR_VARIANT);
					});
			}
			else {
				//Check condition for update or insert based on last symptom id and care plan template name
				if (this.lastSymptomId) {
					globalThis?.sessionStorage.setItem('syptombtn', false);

					RECORD_UPDATE_ALLERGY_INTOLERANCE({
						itchinessallrecordupdate: itchinessAllRecordUpdate, bodyParts: this.humanparts
					})
						// Null data is checked and AuraHandledException is thrown from the Apex
						.then(result => {
							// Store data labeled as 'myData' in the session storage without altering custom labels.
							if (result && result !== null) {
								globalThis?.sessionStorage.setItem('mood', this.emojiName);
								globalThis?.sessionStorage.setItem('syptombtn', false);
								if (typeof window !== 'undefined') {
									const updateEvent = new CustomEvent('updatechildprop', {
										detail: false
									});
									this.dispatchEvent(updateEvent);
								}
							}
						})
						.catch(error => {
							this.showToast(label.label.ERROR_MESSAGE, error.message, label.label.ERROR_VARIANT);
						});
				}
				else  {

					//Insert new record if conditions don't match
					RECORD_INSERT_ALLERGY_INTOLERANCE({
						itchinessallrecordinsert: itchinessAllRecordInsert, bodyParts: this.humanParts
					})
						// Null data is checked and AuraHandledException is thrown from the Apex
						.then(result => {
							// Store data labeled as 'myData' in the session storage without altering custom labels.
							if (result && result !== null) {
								// Store data labeled as 'myData' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('mood', this.emojiName);
								globalThis?.sessionStorage.setItem('syptombtn', false);
								if (typeof window !== 'undefined') {
									const updateEvent = new CustomEvent('updatechildprop', {
										detail: false
									});
									this.dispatchEvent(updateEvent);
								}

								if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('addtask', {
											detail: label.MOOD_VALUES,
										});
										this.dispatchEvent(updateEvent);
									}
								this.recordInsertCount++;
								// Store data labeled as 'myData' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('countmood', this.recordInsertCount);
							}
						})
						.catch(error => {
							this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
						});
				}
			}
		} catch (error) {
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
		}
	}
	//Reset selected emoji to its default state if selected.

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