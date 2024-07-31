//This components using user  Temperaturesymtom values stroe this component
// To import Libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation'
// To import current user ID
import ID from '@salesforce/user/Id';
// To import static resource
import BOXED_ICON from '@salesforce/resourceUrl/BI_PSPB_BoxedIcon';
// To import Apex Classes
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
// To import Custom Labels
import TEMPERATURE_VALUES from '@salesforce/label/c.BI_PSP_Temperrature';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT_TOAST from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
export default class biPspTemperaturesymtom extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@track variable declaration
	@track boxedIcon = BOXED_ICON;
	@track humanParts = '';
	@track slider = 0;
	@track formatedTextVal;
	@track showMessage = false;
	@track temperatureValues = TEMPERATURE_VALUES;
	@track localStorageValueItchiness;
	@track insertCount
	@track sliderValue = 0;
	@track moodValues = '';
	@track submitModal = false;
	@track allergyIntoleranceData;
	@track carePlanTemplateName;
	@track tempValuesFill = true;
	// Variable declaration
	errorMessage;
	recordInsertCount = 0;
	lastSymptomId;
	accountId;
	userId = ID;
	valOfTemp = 37.5;

	//Wire method to retrieve allergy intolerance data based on symptomTrackerId

	@wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
	wiredAllergyIntoleranceData({ error, data }) {
		if (data && data !== null) {
			try {

				for (let record of data) {

	let carePlanTempla = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;
						if (carePlanTempla === TEMPERATURE_VALUES) {
						this.carePlanTemplateName = carePlanTempla;
					}


					if (record && record.BI_PSP_Temperature__c && record?.BI_PSP_Temperature__c !== null) {
						this.valOfTemp = record?.BI_PSP_Temperature__c;


					}




					if (this.valOfTemp > 41.6) {
						this.showMessage = true;
					}
					//Check if care plan template name matches 'Temperature' and set corresponding values
				
			
					//Check if care plan template name matches 'Temperature' and set corresponding values				
				

				}
			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
			}
		} else if (error) {
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
		}
	}
	connectedCallback() {
		let globalThis = window;

		try {
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.
			this.insertCount = globalThis?.sessionStorage.getItem('counttemp');
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.
			this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid')
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.
			let temprtevalues = globalThis?.sessionStorage.getItem('temprature');


			Promise.resolve().then(() => {

				try {
					if (temprtevalues) {
						this.valOfTemp = temprtevalues;

					}

					if (this.valOfTemp > 38) {
						this.showMessage = true;
					}

				} catch (error) {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);

				}
			});
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
					//Handle any errors occurring during the promise chain
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
					//Optionally, you can also rethrow the error if you want to handle it further upstream
					//throw error;
				});
			//Change this value based on your actual condition
			//This code retrieves data labeled as 'myData' from the session storage without altering custom labels.
			this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId)
			//Get the initial count of elements with class 'body-part' on component load
			this.currntmooderror = true;
			//Change this value based on your actual condition
			// this.valOfTemp = temprtevalues;
		} catch (err) {
			// Handle any errors that occurred during the execution of the connectedCallback function
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
			// Additional error handling if needed
		}
	}








	decimalPattern = /^\d+(\.\d{0,2})?$/u;
	onchangeOfTempa(event) {
		let input = event.target;
		if (input.value > 41.6) {
			input.value = 41.6;
		}

		this.valOfTemp = event.target.value;
		if (!this.valOfTemp.match(/^\d+(\.\d{0,2})?$/u)) {
			this.valOfTemp = parseFloat(this.valOfTemp).toFixed(2);
		}
		let valoFValue = parseFloat(this.valOfTemp);
		if (isNaN(valoFValue) || valoFValue < 33.8 || valoFValue > 41.6) {
			this.tempvaluesfill = true;
		} else {
			this.tempvaluesfill = false;
		}

		if (this.valOfTemp > 38) {
			this.showMessage = true; // Show the regular message
			this.showButton = true; // Show the button if temperature is above 100.4
		} else {
			this.showMessage = false; // Hide the regular message
			this.showButton = false; // Hide the button if temperature is below 100.4
		}
	}
	//Async function to handle changes when accepting input
	onchangeAccept() {

		let globalThis = window;
		let itchinessallrecordinsert = {
			SliderValue: parseFloat(this.sliderValue), // Convert to float if SliderValue is numeric
			CareprogramId: this.accountId,
			ValoF: parseFloat(this.valOfTemp) || 0, // Convert to float and handle null or invalid values
			SymptomId: this.localStorageValueItchiness || this.lastSymptomId, // Use default value if lastSymptomId is null
			Symptomname: this.temperatureValues || '', // Use default value if itchinessvalues is null
			Moodvalues: this.moodValues || '', // Use default value if moodvalues is null
		}; this.bodyparts = this.humanParts;
		let itchinessallrecordupdate = {
			SliderValue: parseFloat(this.sliderValue), // Convert to float if SliderValue is numeric
			CareprogramId: this.accountId,
			ValoF: parseFloat(this.valOfTemp) || 0, // Convert to float and handle null or invalid values
			SymptomId: this.lastSymptomId || this.localStorageValueItchiness, // Use default value if lastSymptomId is null
			Symptomname: this.temperatureValues || '', // Use default value if itchinessvalues is null
			Moodvalues: this.moodValues || '', // Use default value if moodvalues is null
		}; this.bodyparts = this.humanParts;
		try {
			if (this.insertCount === '1') {
			
				RECORD_UPDATE_ALLERGY_INTOLERANCE({
					itchinessallrecordupdate: itchinessallrecordupdate, bodyParts: this.humanParts
				})
					// Null data is checked and AuraHandledException is thrown from the Apex
					.then(result => {
						if (result && result !== null) {
							// Store data labeled as 'myData' in the session storage without altering custom labels.
							globalThis?.sessionStorage.setItem('temprature', this.valOfTemp)
							globalThis?.sessionStorage.setItem('syptombtn', false);
							if (typeof window !== 'undefined') {
								const UPDATE_EVENT = new CustomEvent('updatechildprop', {
									detail: false
								});
								this.dispatchEvent(UPDATE_EVENT);
							}

						}
					})
					.catch(error => {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
					});
			}
			else {
				if (this.lastSymptomId && this.carePlanTemplateName === TEMPERATURE_VALUES) {
				
					RECORD_UPDATE_ALLERGY_INTOLERANCE({
						itchinessallrecordupdate: itchinessallrecordupdate, bodyParts: this.humanParts
					})
						// Null data is checked and AuraHandledException is thrown from the Apex
						.then(result => {
							if (result && result !== null) {
								// Store data labeled as 'myData' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('temprature', this.valOfTemp)
								globalThis?.sessionStorage.setItem('syptombtn', false);
								if (typeof window !== 'undefined') {
									const UPDATE_EVENT = new CustomEvent('updatechildprop', {
										detail: false
									});
									this.dispatchEvent(UPDATE_EVENT);
								}

							}
						})
						.catch(error => {
							this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
						});
				}
				else {
						
					RECORD_INSERT_ALLERGY_INTOLERANCE({
						itchinessallrecordinsert: itchinessallrecordinsert, bodyParts: this.humanParts
					})
						// Null data is checked and AuraHandledException is thrown from the Apex
						.then(result => {
							if (result && result !== null) {
								if (typeof window !== 'undefined') {
									const UPDATE_EVENT = new CustomEvent('updatechildprop', {
										detail: false
									});
									this.dispatchEvent(UPDATE_EVENT);
								}

								if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('addtask', {
											detail: TEMPERATURE_VALUES,
										});
										this.dispatchEvent(updateEvent);
									}

								this.recordInsertCount++;
								// Store data labeled as 'myData' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('counttemp', this.recordInsertCount);
								globalThis?.sessionStorage.setItem('syptombtn', false);
								// Store data labeled as 'myData' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('temprature', this.valOfTemp)
							}
						})
						.catch(error => {
							this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
						});
				}
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
		}
	}
	opensubmitModal() {
		this.submitModal = true;
	}
	closesubmitModal() {
		this.submitModal = false;
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