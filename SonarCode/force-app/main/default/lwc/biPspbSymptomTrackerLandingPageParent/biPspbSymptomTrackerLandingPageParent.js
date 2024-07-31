// This LWC is used new entry page create  - biPspbsymtomtrackerlandingpageCmp
// To import Libraries
import { LightningElement,  wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
// To import current user ID
import ID from '@salesforce/user/Id';
// To import Apex Classes
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import FETCH_SYMPTOM_ENROLLEE from '@salesforce/apex/BI_PSP_GraphCtrl.getSymptomTrackerDetails';
import getLatestSymptomRecord from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getLatestSymptomRecord';

export default class BiPspbSymptomTrackerLandingPageParent extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//variable declaration
	graphDatas = '';
	isLoading = true;
	edits;
	//Variable declaration
	userId = ID;
	enrolleeId;
	showSymptom = false;
	//It extracts the current URL and determines the desired component based on the URL path.
	connectedCallback() {
		let globalThis = window;
		const currentURL = globalThis.location?.href;
		const urlObject = new URL(currentURL);        // Get the path
		const path = urlObject.pathname;        // Split the path using '/' as a separator
		const pathComponents = path.split(label.SLASH); // Find the component you need (in this case, 'Branded')
		const desiredComponent = pathComponents.find(component =>
			[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);
		if (desiredComponent.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
			this.brandedOrUnassigned = label.BRANDED_URL_NAVIGATION;
		}
		else {
			this.brandedOrUnassigned = label.UNASSIGNED_URL_NAVIGATION;
		}
		try {
			GET_ENROLLEE({ userId: this.userId })
				.then(result => {// Null check has been handled in its respective apex method
					if (result[0].patientEnrolle !== null) {
						this.enrolleeId = result[0].patientEnrolle.Id;
						this.getsymptom();
					} else if (result[0].error !== null) {
						this.showError = true;
						this.ERROR_MESSAGE = result[0].error;
					}
				})
				.catch(error => {
					// Handle any errors occurring during the promise chain
					this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT_TOAST);
				});
		} catch (error) {
			// Handle any synchronous errors outside the promise chain
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT_TOAST);
		}
	}
	//This function is responsible for fetching symptom data for the current month.
	getsymptom() {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		const currentMonthIndex = currentDate.getMonth();
		const currentMonthName = [
			label.JANUARY, label.FEBRUARY, label.MARCH, label.APRIL, label.MAY, label.JUNE,
			label.JULY, label.AUGUST, label.SEPTEMBER, label.OCTOBER, label.NOVEMBER, label.DECEMBER
		][currentMonthIndex];
		const selectedMonthIndex = currentMonthIndex;        // Calculate first date (last date of previous month)
		const firstDate = new Date(currentYear, selectedMonthIndex, 0, 18, 30, 0);
		let lastDate = new Date(currentYear, selectedMonthIndex + 1, 1, 18, 30, 0);        // Adjust for next year if necessary
		if (selectedMonthIndex === 11) {
			lastDate.setFullYear(currentYear + 1);
		}
		this.firstdate = firstDate.toISOString();
		this.lastDate = lastDate.toISOString();
		// this.getSymptomDateWithAllergy(this.enrolleeId, firstDate.toISOString(), lastDate.toISOString(), currentMonthName);
		this.getSymptomDateWithAllergy({
			enrollees: this.enrolleeId,
			firstDate: firstDate.toISOString(),
			lastDate: lastDate.toISOString(),
			currentMonthName: currentMonthName
		});
	}
	//This function is responsible for fetching symptom data for a specific enrollee within a given date range.
	getSymptomDateWithAllergy({ enrollees, firstDate, lastDate, currentMonthName }) {
		let globalThis = window;
		Promise.resolve().then(() => {
			FETCH_SYMPTOM_ENROLLEE({ erolleId: enrollees, firstDate: firstDate, lastDate: lastDate })
				.then(result => {
					if (result || this.graphDatas !== '') {
						let urlParams = new URLSearchParams(globalThis.location.href.split(label.QUESTION_MARK)[1]);
						this.EDITS = urlParams.get(label.EDITS);
						if (!this.EDITS) {
							globalThis.location.assign(this.brandedOrUnassigned + label.SYMPTOM_GRAPH_URL + this.enrolleeId + label.FIRST_DATE_GRAPH + this.firstdate + label.LAST_DATE_GRAPH + this.lastDate + label.MONTH_DATE + currentMonthName);
						} else {
							this.showSymptom = true;
							this.isLoading = false;
						}
					} else {
						this.showSymptom = true;
						this.isLoading = false;
					}
				})
				.catch(error => {
					this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT_TOAST);
				});
		});
	}



	

	@wire(getLatestSymptomRecord, { careProgramEnrolleeId: '$enrolleeId' })
	wiredLatestRecord({ error, data }) {
		if (data && data !== null) {
			try {

				const latestRecord = data;
				this.graphDatas = latestRecord[0];


				this.errorMessage = ''; // Clear any previous error
			} catch (err) {

				this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT_TOAST);
			}
		} else if (error) {

			this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT_TOAST);
		}
	}





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