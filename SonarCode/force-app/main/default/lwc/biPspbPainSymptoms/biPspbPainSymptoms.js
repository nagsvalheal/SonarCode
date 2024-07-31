//This components using user body parts and intencity itchiness values store this lwc
// To import Libraries
import { LightningElement,  api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
export default class biPspbPainSymptom extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// @api variable declaration
	@api resultId;
	// variable declaration
	redness = false;
	valueOfTemperature;
	buttonText = label.BODY_PARTS_SELECT_ALL;
	clickCount = 0;
	totalElements = 0;
	sliderValue = 0;
	sliderValueTwo = label.ZERO_VALUE;
	isCheckedSelectAll = false;
	humanParts = [] // Initialize the array
	moodValues = ''
	painValues = label.PAIN_VALUES;
	insertCount;
	lastSymptomId;
	localStorageValueItchiness;
	clickedElement;
	isButtonDisabled = false;
	fatiqueErrors = true;
	allergyIntoleranceData;
	itchBody;
	intensity
	carePlanTemplateName;
	itchinessErrors = false;
	// Variable declaration
	accountId;
	userId = label.ID
	recordInsertCount = 0;
	//Process retrieved allergy intolerance data, updating UI and properties, particularly for fatigue symptoms detection.
	@wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
	wiredAllergyIntoleranceData({ error, data }) {
		if (data && data !== null) {
			try {
				let itchBody = '';
				for (let record of data) {
					itchBody = record.BI_PSP_Bodyparts__c;
					this.intensity = record.BI_PSP_Intensity__c;
					let carePlanTemplate = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;
					//Check if care plan template name matches 'Temperature' and set corresponding values				
					if (carePlanTemplate === this.painValues) {
						this.carePlanTemplateName = this.painValues;
					}
					if (this.carePlanTemplateName === this.painValues) {
						this.sliderValue = this.intensity;
						this.sliderValueTwo = this.intensity;
						let bodyPartsArr = itchBody?.split(';');
						//Using this with a minimal delay ensures smooth UI updates by deferring DOM manipulation, preventing potential rendering issues.

						try {
							bodyPartsArr.forEach(i => {
								let element = this.template.querySelector(`[data-name='${i}']`);
								if (element) {
									element.style.fill = '#8D89A5';
								} else {
									element.style.fill = '';
								}
							});
							this.humanParts = [...bodyPartsArr];
							this.totalElements = bodyPartsArr.length;
							this.itchinessValues = false;
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
			} catch (err) {
				this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
			}
		} else if (error) {
			this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
		}
	}
	//Upon component connection, retrieves stored session data to initialize UI elements and component state
	connectedCallback() {
		try {
			let globalThis = window;
			//This code retrieves data labeled as 'countred' from the session storage without altering custom labels.
			this.insertCount = globalThis?.sessionStorage.getItem('countpain');
			//This code retrieves data labeled as 'redness' from the session storage without altering custom labels.
			let mybodyparts = globalThis?.sessionStorage.getItem('Paindata');
			//This code retrieves data labeled as 'myDataintensitypainredness' from the session storage without altering custom labels.
			let mybodyinternsity = globalThis?.sessionStorage.getItem('myDataintensitypain');
			if (mybodyparts && mybodyinternsity) {
				let bodyPartsArr = mybodyparts?.split(',');
				Promise.resolve().then(() => {

					try {
						bodyPartsArr.forEach(i => {
							let element = this.template.querySelector(`[data-name='${i}']`);
							if (element) {
								element.style.fill = '#8D89A5';
							} else {
								element.style.fill = '';
							}
						});
						this.humanParts = [...bodyPartsArr];
						this.totalElements = bodyPartsArr.length;
						this.sliderValue = mybodyinternsity;
						this.sliderValueTwo = mybodyinternsity;
						this.itchinessValues = false;
						if (this.totalElements === 30) {
							this.isCheckedSelectAll = true;
							this.buttonText = label.BODY_PARTS_REMOVE;
						}
					} catch (error) {
						this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
					}
				}, 0.111111);
			}
			//This code retrieves data labeled as 'symptomlastid' from the session storage without altering custom labels.
			this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');
			GET_ENROLLEE({ userId: this.userId })
				// Null data is checked and AuraHandledException is thrown from the Apex
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
					this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
				});
			this.updateThumbLabelPosition(this.sliderValue);
			//This code retrieves data labeled as 'Time' from the session storage without altering custom labels.
			this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId);
			this.updateElementCount();
		} catch (error) {
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
		}
	}
	//Count the total number of elements and collect their data names
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
			} else if (this.buttonText === label.DESELECT && element.style.fill === label.BLACK_VALUE) {
				element.style.fill = label.BLACK_VALUE;
			} else {
				this.totalElements = 0;
			}
		});
		this.isButtonDisabled = this.totalElements < 1;
		this.isButtonDisabled = this.sliderValue <= 0;
	}
	//Function to change color of body parts based on checkbox state
	changeColor(event) {
		const targetElements = this.template.querySelectorAll('.body-part');
		const checkbox = event.target;
		const isChecked = checkbox.checked;
		if (isChecked) {
			this.humanParts = []
			this.isCheckedSelectAll = true;
			this.totalElements = 30;
			this.itchinessErrors = false;
			this.buttonText = label.BODY_PARTS_REMOVE;
			targetElements.forEach((element) => {
				const dataNameValue = element.getAttribute('data-name');
				element.style.fill = '#8D89A5';
				//Add selected value to humanparts array
				this.humanParts.push(dataNameValue);
			});
		} else {
			this.totalElements = 0;
			this.isCheckedSelectAll = false;
			this.buttonText = label.BODY_PARTS_SELECT_ALL;
			targetElements.forEach((element) => {
				const dataNameValue = element.getAttribute('data-name');
				element.style.fill = '';
				//Remove unselected value from partsOfBody array
				this.humanParts = this.humanParts.filter(item => item !== dataNameValue);
			});
		}
		this.clickCount++;
	}
	resetCount() {
		this.updateElementCount = 0;
	}
	// Disable button if any element is filled black or empty.
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
	//Handle the remove button click here
	handleRemove() {
		this.sliderValue = 0;
		this.sliderValueTwo = (label.ZERO_VALUE + this.sliderValue).slice(-2)
	}
	//Some condition when you want to disable the button
	handleEmojiClick(event) {
		this.sliderValue = event.target.value
		this.sliderValueTwo = (label.ZERO_VALUE + this.sliderValue).slice(-2);
		this.updateThumbLabelPosition(this.sliderValue);
	}
	//Function to handle click events based on body parts
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
		if (this.partsOfBody?.length === 30) {
			this.isCheckedSelectAll = true;
			this.buttonText = label.BODY_PARTS_REMOVE;
		} else {
			this.isCheckedSelectAll = false;
			this.buttonText = label.BODY_PARTS_SELECT_ALL;
		}
		this.itchinessErrors = this.totalElements <= 0;
		if (this.sliderValue !== 0 && this.totalElements > 0) {
			this.isButtonDisabled = false;
		} else {
			this.isButtonDisabled = true;
		}
	}
	//async function prepares data related to redness for insertion and update, while preserving the current state of body parts.
	handleClickForAccept() {
		let globalThis = window;
		let itchinessAllRecordInsert = {
			sliderValue: parseFloat(this.sliderValue), // Convert to float if valueOfSlider is numeric
			careProgramId: this.accountId,
			floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0, // Convert to float and handle null or invalid values
			symptomId: this.localStorageValueItchiness || this.lastSymptomId, // Use default value if lastsymptomid is null
			symptomName: this.painValues || '', // Use default value if itchinessvalues is null
			valuesOfMood: this.moodValues || '', // Use default value if moodvalues is null
		}; this.partsOfBody = this.humanParts;
		let itchinessAllRecordUpdate = {
			sliderValue: parseFloat(this.sliderValue), // Convert to float if valueOfSlider is numeric
			careProgramId: this.accountId,
			floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0, // Convert to float and handle null or invalid values
			symptomId: this.lastSymptomId || this.localStorageValueItchiness, // Use default value if lastsymptomid is null
			symptomName: this.painValues || '', // Use default value if itchinessvalues is null
			valuesOfMood: this.moodValues || '', // Use default value if moodvalues is null
		}; this.partsOfBody = this.humanParts;
		try {
			if (this.partsOfBody.length > 0 && parseInt(this.sliderValue, 10) > 0) {
				// If slider value is positive and insertcount is 1, update allergy intolerance records
				if (this.insertCount === '1') {
					RECORD_UPDATE_ALLERGY_INTOLERANCE({
						itchinessallrecordupdate: itchinessAllRecordUpdate, bodyParts: this.humanParts
					})
						// Null data is checked and AuraHandledException is thrown from the Apex
						.then(result => {
							if (result && result !== null) {
								// Store data labeled as 'redness' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('Paindata', this.humanParts);
								// Store data labeled as 'myDataintensitypainredness' in the session storage without altering custom labels.
								globalThis?.sessionStorage.setItem('myDataintensitypain', this.sliderValue);
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
							this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
						});
				}
				else {
					if (this.lastSymptomId && this.carePlanTemplateName === this.painValues) {
						RECORD_UPDATE_ALLERGY_INTOLERANCE({
							itchinessallrecordupdate: itchinessAllRecordUpdate, bodyParts: this.humanParts
						})
							// Null data is checked and AuraHandledException is thrown from the Apex
							.then(result => {
								if (result && result !== null) {
									// Store data labeled as 'redness' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('Paindata', this.humanParts);
									globalThis?.sessionStorage.setItem('syptombtn', false);
									// Store data labeled as 'myDataintensitypainredness' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('myDataintensitypain', this.sliderValue);
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
									// Store data labeled as 'redness' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('Paindata', this.humanParts);
									globalThis?.sessionStorage.setItem('syptombtn', false);
									// Store data labeled as 'myDataintensitypainredness' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('myDataintensitypain', this.sliderValue);
									if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('updatechildprop', {
											detail: false
										});
										this.dispatchEvent(updateEvent);
									}

									
										if (typeof window !== 'undefined') {
										const updateEvent = new CustomEvent('addtask', {
											detail: label.PAIN_VALUES,
										});
										this.dispatchEvent(updateEvent);
									}
									this.recordInsertCount++;
									// Store data labeled as 'countfati' in the session storage without altering custom labels.
									globalThis?.sessionStorage.setItem('countpain', this.recordInsertCount);
								}
							})
							.catch(error => {
								this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
							});
					}
				}
			}
			else {
				this.itchinessErrors = true;
			}
		}
		catch (error) {
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
		}
	}
	// It used to display slider values in scroll
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