// This components using user reaction save values store this lwc
// To import Libraries
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation'
// To import Static Resources
import HAPPY from '@salesforce/resourceUrl/BI_PSPB_HappyMood';
import SAD from '@salesforce/resourceUrl/BI_PSPB_SadMood';
import SPEECHLESS from '@salesforce/resourceUrl/BI_PSPB_SpeechLessMood';
import WORRIED from '@salesforce/resourceUrl/BI_PSPB_WorriedMood';
import JOYFULL from '@salesforce/resourceUrl/BI_PSPB_JoyFullMood';
import REPLACE_HAPPY from '@salesforce/resourceUrl/BI_PSPB_HappyColouredReal';
import REPLACE_JOYFUL from '@salesforce/resourceUrl/BI_PSPB_JoyFul';
import REPLACE_SAD from '@salesforce/resourceUrl/BI_PSPB_Sad';
import BOXED_ICON from '@salesforce/resourceUrl/BI_PSPB_BoxedIcon';
import REPLACE_SPEECHLESS from '@salesforce/resourceUrl/BI_PSPB_SpeechLess';
import REPLACE_WORRIED from '@salesforce/resourceUrl/BI_PSPB_Worried';
// To import current user ID
import ID from '@salesforce/user/Id';
// To import Apex Classes
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
// To import Custom Labels
import ITCHINESS_VALUES from '@salesforce/label/c.BI_PSP_Mood';
import SAD_MOOD from '@salesforce/label/c.BI_PSP_Sad';
import HAPPY_MOOD from '@salesforce/label/c.BI_PSP_Happy';
import JOYFULL_MOOD from '@salesforce/label/c.BI_PSP_JoyFull';
import SPEECHLESS_MOOD from '@salesforce/label/c.BI_PSP_SpeechLess';
import WORRIED_MOOD from '@salesforce/label/c.BI_PSP_Worried';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT_TOAST from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class biPspbMoodSymptom extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@track variable declaration
	@track currentMoodError = false;
	@track boxedIcon = BOXED_ICON;
	@track valueOfTemperature;
	@track localStorageValueItchiness;
	@track lastSymptomId;
	@track emojiName = [];
	@track sliderValue = 0;
	@track currentMoodErrorSad = false;
	@track insertCount;
	@track itchinessValues = ITCHINESS_VALUES;
	@track allergyIntoleranceData;
	@track carePlanTemplateName;
	@track humanParts = ''
	//Variable declaration
	wooriedMood = WORRIED_MOOD;
	speechLessMood = SPEECHLESS_MOOD;
	joyFullMood = JOYFULL_MOOD;
	happyMood = HAPPY_MOOD;
	sadMood = SAD_MOOD;
	recordInsertCount = 0;
	accountId;
	userId = ID;
	selectedEmoji = null;
	imgUrlSad = WORRIED;
	imgUrlWorried = SAD;
	imgUrlSpeechless = SPEECHLESS;
	imgUrlJoyfull = JOYFULL;
	imgUrlHappy = HAPPY;
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
			if (moodSymptom === SAD_MOOD) {
				this.imgUrlSad = REPLACE_WORRIED;

			}
			if (moodSymptom === HAPPY_MOOD) {
				this.imgUrlHappy = REPLACE_HAPPY;
			}
			if (moodSymptom === JOYFULL_MOOD) {
				this.imgUrlJoyfull = REPLACE_JOYFUL;
			}
			if (moodSymptom === SPEECHLESS_MOOD) {
				this.imgUrlSpeechless = REPLACE_SPEECHLESS;
			}
			if (moodSymptom === WORRIED_MOOD) {
				this.imgUrlWorried = REPLACE_SAD;
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
							this.ERROR_MESSAGE = result[0].error;
						}
					}
				})
				.catch(error => {
					//Handle any errors that occurred during the promise chain
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
					//Additional error handling if needed
				});
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.			
			this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId)
			this.currentMoodError = true;
		} catch (err) {
			// Handle any errors that occurred during the execution of the connectedCallback function
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
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

								if (moodSymptom === SAD_MOOD) {
									this.imgUrlSad = REPLACE_WORRIED;

								}
								if (moodSymptom === HAPPY_MOOD) {
									this.imgUrlHappy = REPLACE_HAPPY;
								}
								if (moodSymptom === JOYFULL_MOOD) {
									this.imgUrlJoyfull = REPLACE_JOYFUL;
								}
								if (moodSymptom === SPEECHLESS_MOOD) {
									this.imgUrlSpeechless = REPLACE_SPEECHLESS;
								}
								if (moodSymptom === WORRIED_MOOD) {
									this.imgUrlWorried = REPLACE_SAD;
									this.currentMoodErrorSad = true;
								}



								this.emojiName = moodSymptom;
							}
						}
					}, 100); // Adjust the delay as needed
				}
			})
			.catch((error) => {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
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
		this.imgUrlHappy = HAPPY;
		this.imgUrlJoyfull = JOYFULL;
		this.imgUrlSpeechless = SPEECHLESS;
		this.imgUrlWorried = SAD;
		this.imgUrlSad = WORRIED;

		// Update image URLs based on the newly selected emoji
		switch (emojiName) {
			case this.happyMood:
				this.imgUrlHappy = REPLACE_HAPPY;
				break;
			case this.joyFullMood:
				this.imgUrlJoyfull = REPLACE_JOYFUL;
				break;
			case this.speechLessMood:
				//Set image URL for speechless emoji
				this.imgUrlSpeechless = REPLACE_SPEECHLESS;
				break;
			case this.wooriedMood:
				//Set image URL for worried emoji
				this.imgUrlWorried = REPLACE_SAD;
				this.currentMoodErrorSad = true;
				break;
			case this.sadMood:
				//Set image URL for sad emoji
				this.imgUrlSad = REPLACE_WORRIED;
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
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
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
							this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
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
											detail: ITCHINESS_VALUES,
										});
										this.dispatchEvent(updateEvent);
									}
								this.recordInsertCount++;
								// Store data labeled as 'myData' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('countmood', this.recordInsertCount);
							}
						})
						.catch(error => {
							this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
						});
				}
			}
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
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