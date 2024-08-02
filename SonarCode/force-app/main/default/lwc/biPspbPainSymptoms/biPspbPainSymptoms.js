import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
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
    @wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
    handleAllergyIntoleranceData({ error, data }) {
        if (data) {
            this.processAllergyIntoleranceData(data);
        } else if (error) {
            this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
        }
    }

    connectedCallback() {
        try {
            this.initializeSessionData();
            this.fetchEnrolleeData();
            this.updateThumbLabelPosition(this.sliderValue);
            this.updateElementCount();
        } catch (error) {
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
        }
    }

    initializeSessionData() {
        const globalThis = window;
        const myBodyParts = globalThis?.sessionStorage.getItem('Paindata');
        this.insertCount = globalThis?.sessionStorage.getItem('countpain');
        const myBodyIntensity = globalThis?.sessionStorage.getItem('myDataintensitypain');

        if (myBodyParts && myBodyIntensity) {
            this.updateBodyParts(myBodyParts.split(','), myBodyIntensity);
        }

        this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');
        this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId);
    }

    fetchEnrolleeData() {
        GET_ENROLLEE({ userId: this.userId })
            .then(result => {
                if (result?.[0]?.patientEnrolle) {
                    this.accountId = result[0].patientEnrolle.Id;
                } else if (result?.[0]?.error) {
                    this.showToast(label.ERROR_MESSAGE, result[0].error, label.ERROR_VARIANT);
                }
            })
            .catch(error => this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT));
    }

    processAllergyIntoleranceData(data) {
        try {
            data.forEach(record => {
                this.itchBody = record.BI_PSP_Bodyparts__c;
                this.intensity = record.BI_PSP_Intensity__c;
                this.carePlanTemplateName = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;

                if (this.carePlanTemplateName === this.painValues) {
                    this.sliderValue = this.intensity;
                    this.sliderValueTwo = this.intensity;
                    this.updateBodyParts(this.itchBody.split(';'), this.intensity);
                }
            });
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
        }
    }

    updateBodyParts(bodyPartsArr, intensity) {
        Promise.resolve().then(() => {
            bodyPartsArr.forEach(i => {
                const element = this.template.querySelector(`[data-name="${i}"]`);
                if (element) {
                    element.style.fill = '#8D89A5';
                }
            });

            this.humanParts = [...bodyPartsArr];
            this.totalElements = bodyPartsArr.length;
			  this.sliderValue = intensity;
                    this.sliderValueTwo =intensity;
            this.itchinessErrors = this.totalElements <= 0;
            this.isCheckedSelectAll = this.totalElements === 30;
            this.buttonText = this.isCheckedSelectAll ? label.BODY_PARTS_REMOVE : label.BODY_PARTS_SELECT_ALL;
        });
    }

    updateElementCount() {
        const elements = this.template.querySelectorAll('.body-part');
        this.totalElements = elements.length;
        this.humanParts = Array.from(elements).map(ele => ele.getAttribute('data-name'));

        elements.forEach(element => {
            if (element.style.fill === label.BLACK_VALUE && this.buttonText === label.BODY_PARTS_SELECT_ALL) {
                element.style.fill = '';
            } else if (this.buttonText === label.BODY_PARTS_REMOVE && element.style.fill === label.BLACK_VALUE) {
                element.style.fill = label.BLACK_VALUE;
            }
        });

        this.isButtonDisabled = this.totalElements < 1 || this.sliderValue <= 0;
    }

    changeColor(event) {
        const targetElements = this.template.querySelectorAll('.body-part');
        const isChecked = event.target.checked;

        if (isChecked) {
            this.selectAllBodyParts(targetElements);
        } else {
            this.deselectAllBodyParts(targetElements);
        }
    }

    selectAllBodyParts(targetElements) {
        this.humanParts = [];
        this.isCheckedSelectAll = true;
        this.totalElements = 30;
        this.itchinessErrors = false;
        this.isButtonDisabled = this.sliderValue === 0;
        this.buttonText = label.BODY_PARTS_REMOVE;

        targetElements.forEach(element => {
            element.style.fill = '#8D89A5';
            this.humanParts.push(element.getAttribute('data-name'));
        });
    }

    deselectAllBodyParts(targetElements) {
        this.totalElements = 0;
        this.isCheckedSelectAll = false;
        this.isButtonDisabled = true;
        this.buttonText = label.BODY_PARTS_SELECT_ALL;

        targetElements.forEach(element => {
            element.style.fill = '';
            this.humanParts = this.humanParts.filter(item => item !== element.getAttribute('data-name'));
        });
    }

    handleclick(event) {
        this.clickedElement = event.currentTarget;
        const selectedValue = this.clickedElement.getAttribute('data-name');
        const currentColor = this.clickedElement.style.fill;

        if (currentColor === 'rgb(141, 137, 165)') {
            this.clickedElement.style.fill = '';
            this.humanParts = this.humanParts.filter(item => item !== selectedValue);
            this.totalElements--;
        } else {
            this.clickedElement.style.fill = '#8D89A5';
            this.humanParts.push(selectedValue);
            this.totalElements++;
        }

        this.updateButtonState();
    }

    updateButtonState() {
        this.isCheckedSelectAll = this.totalElements === 30;
        this.buttonText = this.isCheckedSelectAll ? label.BODY_PARTS_REMOVE : label.BODY_PARTS_SELECT_ALL;
        this.itchinessErrors = this.totalElements <= 0;
        this.isButtonDisabled = this.sliderValue === 0 || this.totalElements === 0;
    }

    handleAccept() {
        this.isButtonDisabled = this.template.querySelectorAll('.body-part[style*="fill: rgb(141, 137, 165)"]').length === 0;
    }

    handleEmojiClick(event) {
        this.sliderValue = event.target.value;
        this.sliderValueTwo = (label.ZERO_VALUE + this.sliderValue).slice(-2);
        this.updateThumbLabelPosition(this.sliderValue);
    }

   handleClickForAccept() {
    const globalThis = window;

    const commonPayload = {
        sliderValue: parseFloat(this.sliderValue) || 0,
        careProgramId: this.accountId,
        floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0,
        symptomName: this.painValues || '',
        valuesOfMood: this.moodValues || '',
        bodyParts: this.humanParts
    };

    const insertPayload = { ...commonPayload, symptomId: this.localStorageValueItchiness || this.lastSymptomId };
    const updatePayload = { ...commonPayload, symptomId: this.lastSymptomId || this.localStorageValueItchiness };

    if (this.humanParts.length > 0 && parseInt(this.sliderValue, 10) > 0) {
        const recordOperation = this.insertCount === '1' 
            ? RECORD_UPDATE_ALLERGY_INTOLERANCE({ itchinessallrecordupdate: updatePayload , bodyParts: this.humanParts })
            : (this.lastSymptomId && this.carePlanTemplateName === label.PAIN_VALUES
                ? RECORD_UPDATE_ALLERGY_INTOLERANCE({ itchinessallrecordupdate: updatePayload ,bodyParts: this.humanParts })
                : RECORD_INSERT_ALLERGY_INTOLERANCE({ itchinessallrecordinsert: insertPayload ,bodyParts: this.humanParts })
            );

        recordOperation
            .then(result => {
                if (result) {
                    globalThis?.sessionStorage.setItem('Paindata', this.humanParts);
                    globalThis?.sessionStorage.setItem('myDataintensitypain', this.sliderValue);
                    globalThis?.sessionStorage.setItem('syptombtn', false);

                    const updateEvent = new CustomEvent('updatechildprop', { detail: false });
                    this.dispatchEvent(updateEvent);

                    if (this.insertCount !== '1') {
                        const addTaskEvent = new CustomEvent('addtask', { detail: label.PAIN_VALUES });
                        this.dispatchEvent(addTaskEvent);
                        this.recordInsertCount++;
                        globalThis?.sessionStorage.setItem('countpain', this.recordInsertCount);
                    }
                }
            })
            .catch(error => {
                this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
            });
    } else {
        this.itchinessErrors = true;
    }
}


    handleSuccess() {
        this.showToast(label.SUCCESS_MESSAGE, label.SUCCESS_DESCRIPTION, label.SUCCESS_VARIANT);
        const globalThis = window;
        globalThis.sessionStorage.removeItem('Paindata');
        globalThis.localStorage.removeItem('symptomlastid');
     
    }

  

    updateThumbLabelPosition(value) {
        const thumbLabel = this.template.querySelector('.slds-slider__label');
        if (thumbLabel) {
            thumbLabel.innerHTML = `${value}`;
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}