//This components using user body parts and intencity itchiness values store this lwc
//To import library
import { LightningElement,  api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import apex classes
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';

// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
export default class biPspbpustulessymptom extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Define a variable to track the number of record insertions
	@api resultId
	//variable declaration
	valueOfTemperature = ''
	buttonText = label.BODY_PARTS_SELECT_ALL;
	clickCount = 0;
	totalElements = 0;
	sliderValue = 0;
	sliderValueTwo = label.ZERO_VALUE;
	isCheckedSelectAll = false;
	humanParts = []
	pustulesValue = label.PUSTULES_VALUE
	itchinessErrors = false;
	lastSymptomId
	localStorageValueItchiness;
	insertCount
	fatiqueErrors = true;
	moodValues = '';
	clickedElement;
	allergyIntoleranceData;
	itchBody;
	intensity;
	carePlanTemplateName;
	isButtonDisabled = false;
	//Variable declaration
	accountId;
	recordInsertCount = 0;
	userId = label.ID;
	// Process retrieved allergy intolerance data, updating UI and properties, particularly for Itchiness symptoms detection.
	@wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
	wiredAllergyIntoleranceData({ error, data }) {
		if (data && data !== null) {
			try {
				let itchBody = '';
				for (let record of data) {
					itchBody = record.BI_PSP_Bodyparts__c;
					this.intensity = record.BI_PSP_Intensity__c;
					let carePlanTemplate = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;

					if (carePlanTemplate === this.pustulesValue) {
						this.carePlanTemplateName = this.pustulesValue;

						if (this.carePlanTemplateName === this.pustulesValue) {
							this.sliderValue = this.intensity;
							this.sliderValueTwo = this.intensity;
							let bodyPartsArr = itchBody?.split(';');
							//Using this with a minimal delay ensures smooth UI updates by deferring DOM manipulation, preventing potential rendering issues.

							try {
								bodyPartsArr.forEach(i => {
									let element = this.template.querySelector(`[data-name="${i}"]`);
									if (element) {
										element.style.fill = '#8D89A5';
									} else {
										element.style.fill = '';
									}
								});
								this.humanParts = [...bodyPartsArr];
								this.totalElements = bodyPartsArr.length;
								// this.Itchinessvalues = false;
								this.itchinessErrors = this.totalElements <= 0;
								if (this.totalElements === 30) {
									this.isCheckedSelectAll = true;
									this.buttonText = label.BODY_PARTS_REMOVE;
								}
							} catch (err) {
								this.showToast(label.label.ERROR_MESSAGE, err.message, label.label.ERROR_VARIANT);
								// Handle the error as needed
							}

							return;
						}
					}
				}
			} catch (err) {
				this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
				// Handle the error as needed
			}
		} else if (error) {
			this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
		}
	}
	// page rendere call back all values display 
	connectedCallback() {
		try {
			let globalThis = window;
			// This code retrieves data labeled as 'myData' from the session storage without altering custom labels.
			let myBodyParts = globalThis?.sessionStorage.getItem('Pustule');
			this.insertCount = globalThis?.sessionStorage.getItem('countpush');
			let myBodyIntensity = globalThis?.sessionStorage.getItem('myDataintensityPustules');
			if (myBodyParts && myBodyIntensity) {
				let bodyPartsArr = myBodyParts.split(',');

				// Use Promise.resolve().then() to defer DOM manipulation
				Promise.resolve().then(() => {
					try {
						bodyPartsArr.forEach(i => {
							let element = this.template.querySelector(`[data-name="${i}"]`);
							if (element) {
								element.style.fill = '#8D89A5';
							} else {
								element.style.fill = '';
							}
						});
						this.humanParts = [...bodyPartsArr];
						this.totalElements = bodyPartsArr.length;
						this.sliderValue = myBodyIntensity;
						this.sliderValueTwo = myBodyIntensity;
						this.fatiqueErrors = false;
						this.Itchinessvalues = false;
						this.isButtonDisabled = false;
						if (this.totalElements === 30) {
							this.isCheckedSelectAll = true;
							this.buttonText = label.BODY_PARTS_REMOVE;
						}
					} catch (error) {
						this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
					}
				});
			}

			// Store data labeled as 'symptomlastid' in the session storage without altering custom labels.
			this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');

			GET_ENROLLEE({ userId: this.userId })
				.then(result => {
					if (result !== null) {
						if (result[0].patientEnrolle !== null) {
							this.accountId = result[0].patientEnrolle.Id;
						} else if (result[0].error !== null) {
							this.showError = true;
							this.label.ERROR_MESSAGE = result[0].error;
						}
					}
				})
				.catch(error => {
					// Handle any errors occurring during the GET_ENROLLEE call or its subsequent promise chain
					this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
				});

			this.updateThumbLabelPosition(this.sliderValue);
			// Store data labeled as 'Time' in the session storage without altering custom labels.
			this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId);
			this.updateElementCount();
		} catch (error) {
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
		}
	}
	// all body parts select values this function call 
	updateElementCount() {
		const elements = this.template.querySelectorAll('.body-part');
		this.totalElements = elements.length;
		this.humanParts = [];
		elements.forEach((ele) => {
			const dataNameValue = ele.getAttribute('data-name');
			this.humanParts.push(dataNameValue);
		});
		elements.forEach((element) => {
			if (element.style.fill === label.BLACK_VALUE && this.buttonText === label.BODY_PARTS_SELECT_ALL) {
				this.totalElements = elements.length;
				element.style.fill = '';
			} else if (this.buttonText === label.BODY_PARTS_REMOVE && element.style.fill === label.BLACK_VALUE) {
				element.style.fill = label.BLACK_VALUE;
			} else {
				this.totalElements = 0;
			}
		});
		this.isButtonDisabled = this.totalElements < 1;
		this.isButtonDisabled = this.sliderValue <= 0;
	}
	// all body parts select values this function call 
	changeColor(event) {
		const targetElements = this.template.querySelectorAll('.body-part');
		const checkbox = event.target;
		const isChecked = checkbox.checked;
		if (isChecked) {
			this.humanParts = []
			this.isCheckedSelectAll = true;
			this.totalElements = 30;
			this.itchinessErrors = false;
			if (this.sliderValue !== 0) {
				this.isButtonDisabled = false;
			} else {
				this.isButtonDisabled = true;
			}
			this.buttonText = label.BODY_PARTS_REMOVE;
			targetElements.forEach((element) => {
				const dataNameValue = element.getAttribute('data-name');
				element.style.fill = '#8D89A5';
				this.humanParts.push(dataNameValue);
			});
		} else {
			this.totalElements = 0;
			this.isCheckedSelectAll = false;
			this.isButtonDisabled = true;
			this.buttonText = label.BODY_PARTS_SELECT_ALL;
			targetElements.forEach((element) => {
				const dataNameValue = element.getAttribute('data-name');
				element.style.fill = '';
				this.humanParts = this.humanParts.filter(item => item !== dataNameValue);
			});
		}
		this.clickCount++;
	}
	resetCount() {
		this.updateElementCount = 0;
	}
	//fill color to determine if button should be disabled based on user interaction
	handleAccept() {
		const elements = this.template.querySelectorAll('.body-part');
		elements.forEach((element) => {
			if (element.style.fill === label.BLACK_VALUE) {
				this.isButtonDisabled = true;
			} else if (element.style.fill === '') {
				this.isButtonDisabled = true;
			}
		});
	}
	// Function to handle emoji click event
	handleEmojiClick(event) {
		this.sliderValue = event.target.value
		this.sliderValueTwo = (label.ZERO_VALUE + this.sliderValue).slice(-2)
		this.updateThumbLabelPosition(this.sliderValue);
	}
	//toggle fill color and update body parts array based on user interaction
	handleclick(event) {
		this.clickedElement = event.currentTarget;
		const selectedValue = this.clickedElement.getAttribute('data-name');
		const currentColor = this.clickedElement.style.fill;
		if (currentColor === 'rgb(141, 137, 165)') {
			this.clickedElement.style.fill = '';
			this.humanParts = this.humanParts.filter(item => item !== selectedValue);
			this.totalElements--; // Reset to original color
		} else {
			this.clickedElement.style.fill = '#8D89A5';
			this.humanParts.push(selectedValue);
			this.totalElements++;
		}
	}
	// used to display slider values
	handleClickForAccept() {
		let globalThis = window;

		let itchinessAllRecordInsert = {
			sliderValue: parseFloat(this.sliderValue), // Convert to float if valueOfSlider is numeric
			careProgramId: this.accountId,
			floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0, // Convert to float and handle null or invalid values
			symptomId: this.localStorageValueItchiness || this.lastSymptomId, // Use default value if lastsymptomid is null
			symptomName: this.pustulesValue || '', // Use default value if itchinessvalues is null
			valuesOfMood: this.moodValues || '', // Use default value if moodvalues is null
		}; this.partsOfBody = this.humanParts;
		let itchinessAllRecordUpdate = {
			sliderValue: parseFloat(this.sliderValue), // Convert to float if valueOfSlider is numeric
			careProgramId: this.accountId,
			floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0, // Convert to float and handle null or invalid values
			symptomId: this.lastSymptomId || this.localStorageValueItchiness, // Use default value if lastsymptomid is null
			symptomName: this.pustulesValue || '', // Use default value if itchinessvalues is null
			valuesOfMood: this.moodValues || '', // Use default value if moodvalues is null
		}; this.partsOfBody = this.humanParts;
		try {
			if (this.partsOfBody.length > 0 && parseInt(this.sliderValue, 10) > 0) {
				if (this.insertCount === '1') {
					RECORD_UPDATE_ALLERGY_INTOLERANCE({
						itchinessallrecordupdate: itchinessAllRecordUpdate, bodyParts: this.humanParts
					})
						// Null data is checked and AuraHandledException is thrown from the Apex
						.then(result => {
							if (result && result !== null) {
								// Store data labeled as 'myData' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('Pustule', this.humanParts);
								globalThis?.sessionStorage.setItem('syptombtn', false);
								// Store data labeled as 'myDataintensityPustules' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('myDataintensityPustulesPustules', this.sliderValue);
								if (typeof window !== 'undefined') {
									const updateEvent = new CustomEvent('updatechildprop', {
										detail: false
									});
									this.dispatchEvent(updateEvent);
								}
							}

						})
						.catch(error => {
							this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
						});
				}
				else {

					if (this.lastSymptomId && this.carePlanTemplateName === label.PUSTULES_VALUE) {
						RECORD_UPDATE_ALLERGY_INTOLERANCE({
							itchinessallrecordupdate: itchinessAllRecordUpdate, bodyParts: this.humanParts
						})
							// Null data is checked and AuraHandledException is thrown from the Apex
							.then(result => {

								if (result && result !== null) {
									// Store data labeled as 'myData' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('Pustule', this.humanParts);
									globalThis?.sessionStorage.setItem('syptombtn', false);
									// Store data labeled as 'myDataintensityPustules' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('myDataintensityPustules', this.sliderValue);
									if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('updatechildprop', {
											detail: false
										});
										this.dispatchEvent(updateEvent);
									}
								}

							})
							.catch(error => {
								this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
							});
					}
					else {
						
						RECORD_INSERT_ALLERGY_INTOLERANCE({
							itchinessallrecordinsert: itchinessAllRecordInsert, bodyParts: this.humanParts
						})
							// Null data is checked and AuraHandledException is thrown from the Apex
							.then(result => {
								if (result && result !== null) {
									// Store data labeled as 'myData' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('Pustule', this.humanParts);
									globalThis?.sessionStorage.setItem('syptombtn', false);
									// Store data labeled as 'myDataintensityPustules' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('myDataintensityPustules', this.sliderValue);
									if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('updatechildprop', {
											detail: false
										});
										this.dispatchEvent(updateEvent);
									}
									
										if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('addtask', {
											detail: label.PUSTULES_VALUE,
										});
										this.dispatchEvent(updateEvent);
									}
									this.recordInsertCount++;
									// Store data labeled as 'count' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('countpush', this.recordInsertCount);
								}

							})
							.catch(error => {
								this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
							});
					}
				}
			} else {
				this.itchinessErrors = true;
			}
		} catch (error) {
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
		}
	}
	// Update the position of the thumb label relative to the slider based on the current slider value
	//The use of requestAnimationFrame ensures optimal timing for thumb label position updates, enhancing animation smoothness and performance 
	updateThumbLabelPosition(sliderValue) {
		let globalThis = window;
		if (typeof window !== 'undefined' && typeof globalThis?.requestAnimationFrame !== 'undefined') {
			globalThis?.requestAnimationFrame(() => {
				// Get slider and thumb label elements

				let slider = this.template.querySelector('.slider');
				let thumbLabel = this.template.querySelector('.thumb-label');

				// Calculate thumb label position
				let thumbWidth = parseFloat(globalThis.getComputedStyle(thumbLabel).width);
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