//This Lightning web component is used User Fatiguesymptoms insert values
// To import Libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation'
// To import current user ID
import ID from '@salesforce/user/Id';
// To import Apex Classes
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
// To import Custom Labels
import FATIGUE_VALUES from '@salesforce/label/c.BI_PSP_Fatique';
import ZERO_VALUE from '@salesforce/label/c.BI_PSP_Null';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT_TOAST from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class biPspbFatigueSymptoms extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@track variable declaration
	@track isButtonDisabled = false;
	@track fatigueError = false;
	@track sliderValueTwo = ZERO_VALUE;
	@track valueOfTemperature;
	@track humanParts = ''
	@track sliderValue = 0;
	@track fatigueValues = FATIGUE_VALUES;
	// As this is a css property which changes dynamically so we can't use custom label for this scenario
	@track colorChange = 'symptoms'
	@track localStorageValueItchiness;
	@track insertCount
	@track moodValues = '';
	@track allergyIntoleranceData;
	@track itchBody;
	@track intensity
	@track carePlanTemplateName;
	// Variable declaration
	recordInsertCount = 0;
	userId = ID;
	accountId;
	val = 0;
	// Process retrieved allergy intolerance data, updating UI and properties, particularly for fatigue symptoms detection.
	@wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
	wiredAllergyIntoleranceData({ error, data }) {
		if (data && data !== null) {
			try {
				// Initialize variables
				for (let record of data) {
					// Access values of each record
					this.intensity = record.BI_PSP_Intensity__c;
					let carePlanTemplate = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name
					if (carePlanTemplate === this.fatigueValues) {
						this.carePlanTemplateName = this.fatigueValues;
						this.sliderValue = this.intensity;
						this.sliderValueTwo = this.intensity;
					}

				}
			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
			}
		} else if (error) {
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
		}
	}
	// To fetch enrollee Id and fatigue data
	connectedCallback() {
		try {
			let globalThis = window;
			//This code retrieves data labeled as 'countfati' from the session storage without altering custom labels.
			this.insertCount = globalThis?.sessionStorage.getItem('countfati');
			//This code retrieves data labeled as 'fatigue' from the session storage without altering custom labels.

			//This code retrieves data labeled as 'fatigueintensity' from the session storage without altering custom labels.
			let myBodyIntensity = globalThis?.sessionStorage.getItem('fatigueintensity');

			//The setTimeout with a small delay ensures UI updates occur after the current rendering tasks, preventing glitches.
			if (myBodyIntensity) {

				//The setTimeout with a small delay ensures UI updates occur after the current rendering tasks, preventing glitches.
				Promise.resolve().then(() => {

					try {

						this.sliderValue = myBodyIntensity;
						this.sliderValueTwo = myBodyIntensity;
					} catch (error) {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
					}
				});
			}

			//This code retrieves data labeled as 'symptomlastid' from the session storage without altering custom labels.
			this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid')
			//this.fatigue errors =true; 
			this.isButtonDisabled = true;
			//getAllergyIntoleranceData()	

			GET_ENROLLEE({ userId: this.userId })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then(result => {
					if (result !== null) {
						if (result[0].patientEnrolle !== null) {
							this.accountId = result[0].patientEnrolle.Id;
						} else if (result[0].error !== null) {
							this.showError = true;
							this.ERROR_MESSAGE = result[0].error;
						}
					}
				})
				.catch(error => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
				});

			//Change this value based on your actual condition
			//This code retrieves data labeled as 'Time' from the session storage without altering custom labels.
			this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId)
			// Get the initial count of elements with class 'body-part' on component load	
			this.currentMoodError = true;
			// Change this value based on your actual condition
		}
		catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
		}


	}
	//Manages record updates or inserts based on slider input
	onchangeAccept() {

		let globalThis = window;
		let itchinessAllRecordInsert = {
			sliderValue: parseFloat(this.sliderValue), // Convert to float if sliderValue is numeric
			careProgramId: this.accountId,
			floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0, // Convert to float and handle null or invalid values
			symptomId: this.localStorageValueItchiness || this.lastSymptomId, // Use default value if lastSymptomId is null
			symptomName: this.fatigueValues || '', // Use default value if itchiness values is null
			valuesOfMood: this.moodValues || '', // Use default value if mood values is null
		}; this.partsOfBody = this.humanParts;
		let itchinessAllRecordUpdate = {
			sliderValue: parseFloat(this.sliderValue), // Convert to float if sliderValue is numeric
			careProgramId: this.accountId,
			floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0, // Convert to float and handle null or invalid values
			symptomId: this.lastSymptomId || this.localStorageValueItchiness, // Use default value if lastSymptomId is null
			symptomName: this.fatigueValues || '', // Use default value if itchiness values is null
			valuesOfMood: this.moodValues || '', // Use default value if mood values is null
		}; this.partsOfBody = this.humanParts;
		try {
			if (parseInt(this.sliderValue, 10) > 0) {
					
				// If slider value is positive and insert count is 1, update allergy intolerance records
				if (this.insertCount === '1') {
			
					RECORD_UPDATE_ALLERGY_INTOLERANCE({
						itchinessallrecordupdate: itchinessAllRecordUpdate, bodyParts: this.humanParts
					})
						// Null data is checked and AuraHandledException is thrown from the Apex
						.then(result => {
							if (result && result !== null) {
								// Store data labeled as 'fatigue' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('fatigue', this.sliderValue);
								// Store data labeled as 'fatigueintensity' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('fatigueintensity', this.sliderValue);
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
				else {
					if (this.lastSymptomId && this.carePlanTemplateName === this.fatigueValues)  {
					
						RECORD_UPDATE_ALLERGY_INTOLERANCE({
							itchinessallrecordupdate: itchinessAllRecordUpdate, bodyParts: this.humanParts
						})
							// Null data is checked and AuraHandledException is thrown from the Apex
							.then(result => {
								if (result && result !== null) {
									// Store data labeled as 'fatigue' in the session storage without altering custom labels
									globalThis?.sessionStorage.setItem('fatigue', this.sliderValue);
									// Store data labeled as 'fatigueintensity' in the session storage without altering custom labels
									globalThis?.sessionStorage.setItem('fatigueintensity', this.sliderValue);
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
					else{
					
						RECORD_INSERT_ALLERGY_INTOLERANCE({
							itchinessallrecordinsert: itchinessAllRecordInsert, bodyParts: this.humanParts
						})
							// Null data is checked and AuraHandledException is thrown from the Apex
							.then(result => {
								if (result && result !== null) {
									globalThis?.sessionStorage.setItem('fatigue', this.sliderValue);
									globalThis?.sessionStorage.setItem('syptombtn', false);
									// Store data labeled as 'fatigueintensity' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('fatigueintensity', this.sliderValue);

									this.recordInsertCount++;
									// Store data labeled as 'countfati' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('countfati', this.recordInsertCount);
									if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('updatechildprop', {
											detail: false
										});
										this.dispatchEvent(updateEvent);
									}

									
										if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('addtask', {
											detail: FATIGUE_VALUES,
										});
										this.dispatchEvent(updateEvent);
									}
								}
							})
							.catch(error => {
								this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
							});
					}
				}
			}
			else {
				this.fatigueError = true;
			}
		}
		catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
		}
	}
	// When the value of the slider changes, it reflect the new value selected by the user.
	handleSliderChange(event) {
		this.sliderValue = event.target.value;
	}
	handleEmojiClick(event) {
		this.sliderValue = event.target.value;
		this.sliderValueTwo = ('0' + this.sliderValue).slice(-2);
		this.updateThumbLabelPosition(this.sliderValue);
		//Convert this.sliderValueTwo to a number for comparison
	}

	// used to display slider values
	//The use of requestAnimationFrame ensures optimal timing for thumb label position updates, enhancing animation smoothness and performance 
	updateThumbLabelPosition(sliderValue) {
		let globalThis = window;
		if (typeof window !== 'undefined' && typeof globalThis?.requestAnimationFrame !== 'undefined') {
			globalThis?.requestAnimationFrame(() => {
				// Get slider and thumb label elements

				let slider = this.template.querySelector('.slider');
				let thumbLabel = this.template.querySelector('.thumb-label');

				// Calculate thumb label position
				let thumbWidth = parseFloat(globalThis?.getComputedStyle(thumbLabel).width);
				let sliderWidth = slider.offsetWidth;
				let thumbPosition =
					(sliderValue / slider.max) * (sliderWidth - thumbWidth);

				// Calculate new thumb position
				let newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
				let maxPosition = sliderWidth - thumbWidth;

				// Update thumb label position
				thumbLabel.style.left =
					Math.min(maxPosition, Math.max(0, newPosition)) + 'px';
				thumbLabel.setAttribute('data-value', sliderValue);
			});
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