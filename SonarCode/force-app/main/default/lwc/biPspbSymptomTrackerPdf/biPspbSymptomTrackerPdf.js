//This LWC is used UserSymptomTracker graph download in pdf - biPspbSymptomTrackerPdf
// To import Libraries
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import current user ID
import ID from '@salesforce/user/Id';
// To import Static Resources
import YELLOW_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_YellowEllipse';
import VERTICAL_LINE from '@salesforce/resourceUrl/BI_PSPB_VerticalLine';
import DARK_RED_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_DarkRedEllipse';
import BLUE_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_BlueEllipse';
import GREEN_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_GreenEllipse';
import VIOLET_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_VioletEllipse';
import RED_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_RedEllipse';
import DARK_YELLOW_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_DarkYellowEllipse';
import SITE_LOGO from '@salesforce/resourceUrl/BI_PSPB_SiteLogo';
// To import Apex Classes
import FETCH_SYMPTOM_EROLLE from '@salesforce/apex/BI_PSP_GraphCtrl.getSymptomTrackerDetails';
import USER_DETAILS from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import GET_SELECTED_PATIENT from '@salesforce/apex/BI_PSP_CurrentUser.returnTheAccounts';
// To import Custom Labels
import JANUARY from '@salesforce/label/c.BI_PSP_January';
import FEBRUARY from '@salesforce/label/c.BI_PSP_February';
import MARCH from '@salesforce/label/c.BI_PSP_March';
import APRIL from '@salesforce/label/c.BI_PSP_April';
import MAY from '@salesforce/label/c.BI_PSP_May';
import JUNE from '@salesforce/label/c.BI_PSP_June';
import JULY from '@salesforce/label/c.BI_PSP_July';
import AUGUST from '@salesforce/label/c.BI_PSP_August';
import SEPTEMBER from '@salesforce/label/c.BI_PSP_September';
import OCTOBER from '@salesforce/label/c.BI_PSP_October';
import NOVEMBER from '@salesforce/label/c.BI_PSP_November';
import DECEMBER from '@salesforce/label/c.BI_PSP_December';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT_TOAST from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import MONTH from '@salesforce/label/c.BI_PSP_Month';
import ITCHINESS from '@salesforce/label/c.BI_PSP_Itchiness';
import REDNES from '@salesforce/label/c.BI_PSP_Redness';
import PAINN from '@salesforce/label/c.BI_PSP_Pain';
import PUSSTULES from '@salesforce/label/c.BI_PSP_Pustules';
import FATIQUE from '@salesforce/label/c.BI_PSP_Fatique';
import TEMPERRATURE from '@salesforce/label/c.BI_PSP_Temperrature';
import MOOD from '@salesforce/label/c.BI_PSP_Mood';
import EROLLS from '@salesforce/label/c.BI_PSP_Erolls';
import FIRST_DATEEE from '@salesforce/label/c.BI_PSP_FirstDateee';
import LAST_DATEEE from '@salesforce/label/c.BI_PSP_LastDateee';
import SHORTS from '@salesforce/label/c.BI_PSP_Shorts';
import NUMERICS from '@salesforce/label/c.BI_PSP_Numerics';
import TWO_THOUSAND from '@salesforce/label/c.BI_PSP_TwoThousand';
import QUESTION_MARK from '@salesforce/label/c.BI_PSP_QuestionMark';


export default class BiPspbSymptomTrackerPdf extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@track variable declaration
	 dateWithAllery = [];
	 remainingItems = [];
	 highlight = false;
	 showLine;
	 dateWithAlleryTwo = [];
	 dateWithAlleryThree = [];
	 dateWithAlleryFour = [];
	 dateWithAlleryFive = [];
	 dateWithAlleryAll = [];
	 rightLess;
	 nextSeven;
	 nextSevenOne;
	 nextSevenTwo;
	 nextSevenThree;
	//Variable declaration
	 monthName;
	monthValue;
	currentYear;
	selectedMonthValue;
	yellowEllipse = YELLOW_ELLIPSE;
	verticalLine = VERTICAL_LINE;
	darkRedEllipse = DARK_RED_ELLIPSE;
	blueEllipse = BLUE_ELLIPSE;
	greenEllipse = GREEN_ELLIPSE;
	violetEllipse = VIOLET_ELLIPSE;
	redEllipse = RED_ELLIPSE;
	darkYellowEllipse = DARK_YELLOW_ELLIPSE;
	navLogo = SITE_LOGO;
	userId = ID;
	errorMessage;
	userName;
	placeholder = MONTH;
	showEditBtn = false;
	picklistOptions = [
		{ label: JANUARY, value: JANUARY },
		{ label: FEBRUARY, value: FEBRUARY },
		{ label: MARCH, value: MARCH },
		{ label: APRIL, value: APRIL },
		{ label: MAY, value: MAY },
		{ label: JUNE, value: JUNE },
		{ label: JULY, value: JULY },
		{ label: AUGUST, value: AUGUST },
		{ label: SEPTEMBER, value: SEPTEMBER },
		{ label: OCTOBER, value: OCTOBER },
		{ label: NOVEMBER, value: NOVEMBER },
		{ label: DECEMBER, value: DECEMBER }
	];
	//Each bar represents a date entry and its height is proportional to the number of image URLs.
	get bars() {
		return this.dateWithAllery.map(entry => ({
			height: `${entry.imageUrls.length * 20}px`,
			dates: entry.dates,
			imageUrls: entry.imageUrls
		}));
	}
	//Each bar represents a date entry and its height is proportional to the number of image URLs.
	get barsone() {
		return this.dateWithAlleryTwo.map(entry => ({
			height: `${entry.imageUrls.length * 20}px`,
			dates: entry.dates,
			imageUrls: entry.imageUrls
		}));
	}
	// Each bar represents a date entry and its height is proportional to the number of image URLs.
	get barsTwo() {
		return this.dateWithAlleryThree.map(entry => ({
			height: `${entry.imageUrls.length * 20}px`,
			dates: entry.dates,
			imageUrls: entry.imageUrls
		}));
	}
	//Each bar represents a date entry and its height is proportional to the number of image URLs.
	get barsThree() {
		return this.dateWithAlleryFour.map(entry => ({
			height: `${entry.imageUrls.length * 20}px`,
			dates: entry.dates,
			imageUrls: entry.imageUrls
		}));
	}
	//Each bar represents a date entry and its height is proportional to the number of image URLs.
	get barsFour() {
		return this.dateWithAlleryFive.map(entry => ({
			height: `${entry.imageUrls.length * 20}px`,
			dates: entry.dates,
			imageUrls: entry.imageUrls
		}));
	}

	//It retrieves URL parameters such as 'eroll', 'firstdate', and 'lastdate' to fetch symptom data for a specific enrollee within a given date range.
	connectedCallback() {
	
			let globalThis = window;

			let urlParams = new URLSearchParams(globalThis.location?.href.split(QUESTION_MARK)[1]);
			let eroll = urlParams.get(EROLLS);
			let firstdate = urlParams.get(FIRST_DATEEE);
			let lastdate = urlParams.get(LAST_DATEEE);
			const DATE = new Date(firstdate);
			const MONTH_NAMES = [JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER];
			this.monthName = MONTH_NAMES[DATE.getMonth() + 1];
			let month = this.monthName?.substr(0, 3);
			this.monthValue = month;
			const CURRENT_DATE = new Date();
			this.currentYear = CURRENT_DATE.getFullYear();
			this.getsymptomdatewithallergy(eroll, firstdate, lastdate);
			if (ID !== null && ID !== undefined) {
				USER_DETAILS()
					// Null data is checked and AuraHandledException is thrown from the Apex
					.then(user => {
						if (user.BI_PSPB_Caregiver__c === false) {
							this.userName = user.FirstName + ' ' + user.LastName;
						} else {
							// this.getSelectedPatientId();
							GET_SELECTED_PATIENT()
							.then(data => {
								// Null data is checked and AuraHandledException is thrown from the Apex
								this.userName = data.Name;
								console.log(this.userName,'this.userName')
							})
							.catch(error => {
								this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
							})
						}
					})
					.catch(error => {
						this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
					})
			}
	
	}
	//This method is used to get the selected patient name of the current loggedin Caregiver
	// getSelectedPatientId() {
	// 	GET_SELECTED_PATIENT({ userId: ID })
	// 		.then(data => {
	// 			// Null data is checked and AuraHandledException is thrown from the Apex
	// 			this.userName = data.Name;
	// 		})
	// 		.catch(error => {
	// 			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
	// 		})
	// }
	//The formatted date string.		
	parsedDat(dateToFormat) {
		const PARSED_DATE = new Date(dateToFormat);
		const OPTIONS = { Month: SHORTS, day: NUMERICS };
		this.formattedDate = PARSED_DATE.toLocaleDateString(undefined, OPTIONS);
		return this.formattedDate;
	}
	// Handles the change event when the user selects a new month in the category dropdown.
	handleCategoryChange(event) {
		this.dateWithAllery = [];
		this.remainingItems = [];
		this.selectedMonthValue = event.target.value;
		const CURRENT_DATE = new Date();
		const SELECTED_MONTH_INDEX = new Date(Date.parse(this.selectedMonthValue + TWO_THOUSAND)).getMonth();
		if (SELECTED_MONTH_INDEX <= CURRENT_DATE.getMonth()) {
			const FIRST_DATE = new Date(CURRENT_DATE.getFullYear(), SELECTED_MONTH_INDEX, 1, 18, 30, 0);
			const LAST_DATE = new Date(CURRENT_DATE.getFullYear(), SELECTED_MONTH_INDEX + 1, 0, 18, 30, 0);
			this.getsymptomdatewithallergy(this.enrolleId, FIRST_DATE.toISOString(), LAST_DATE.toISOString());
		} else {
			const FIRST_DATE = new Date(CURRENT_DATE.getFullYear() - 1, SELECTED_MONTH_INDEX, 1, 18, 30, 0);
			const LAST_DATE = new Date(CURRENT_DATE.getFullYear() - 1, SELECTED_MONTH_INDEX + 1, 0, 18, 30, 0);
			this.getsymptomdatewithallergy(this.enrolleId, FIRST_DATE.toISOString(), LAST_DATE.toISOString());
		}
	}
	//Handles errors by displaying a toast message.
	getsymptomdatewithallergy(erolles, firstdate, lastdate) {
		try {
			FETCH_SYMPTOM_EROLLE({ erolleId: erolles, firstDate: firstdate, lastDate: lastdate })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then(result => {
					//If the result is not null, iterates through each item in the result array.
					if (result !== null) {
						result.forEach(item => {
							//Checks if there is an existing date entry in the dateWithAllery array matching the date of the current item.
							const EXISTING_DATE = this.dateWithAllery.find(entry => entry.dates === this.parsedDat(item.dates));
							if (EXISTING_DATE) {
								EXISTING_DATE.imageUrls.push(this.getImagesForName(item.name));
							} else {
								this.dateWithAllery.push({
									dates: this.parsedDat(item.dates),
									imageUrls: [this.getImagesForName(item.name)],
									symptom: item.symptom
								});
							}
						});
						this.dateWithAllery.sort((a, b) => new Date(a.dates) - new Date(b.dates));
						if (this.dateWithAllery.length > 7) {
							this.rightLess = true;
						} else {
							this.rightLess = false;
						}
						this.dateWithAlleryAll = this.dateWithAllery;
						this.dateWithAllery = this.dateWithAlleryAll.slice(0, 7);
						//If there are entries in the dateWithAllery array after slicing, assigns a subset of the entries to the dateWithAlleryTwo property.
						if (this.dateWithAllery.length > 0) {
							this.dateWithAlleryTwo = this.dateWithAlleryAll.slice(7, 14);
							if (this.dateWithAlleryTwo.length > 0) {
								this.nextSeven = true;
							} else {
								this.nextSeven = false;
							}
						}
						//If there are entries in the dateWithAllery array after slicing, assigns a subset of the entries to the dateWithAlleryThree property.
						if (this.dateWithAllery.length > 0) {
							this.dateWithAlleryThree = this.dateWithAlleryAll.slice(14, 21);
							if (this.dateWithAlleryThree.length > 0) {
								this.nextSevenOne = true;
							} else {
								this.nextSevenOne = false;
							}
						}
						//If there are entries in the dateWithAllery array after slicing, assigns a subset of the entries to the dateWithAlleryFour property.
						if (this.dateWithAllery.length > 0) {
							this.dateWithAlleryFour = this.dateWithAlleryAll.slice(21, 28);
							if (this.dateWithAlleryFour.length > 0) {
								this.nextSevenTwo = true;
							} else {
								this.nextSevenTwo = false;
							}
						}
						//If there are entries in the dateWithAllery array after slicing, assigns a subset of the entries to the dateWithAlleryFive property.
						if (this.dateWithAllery.length > 0) {
							this.dateWithAlleryFive = this.dateWithAlleryAll.slice(28, 35);
							if (this.dateWithAlleryFive.length > 0) {
								this.nextSevenThree = true;
							} else {
								this.nextSevenThree = false;
							}
						}
						//If there are entries in the dateWithAllery array, sets the showLine property to true to display a line chart.
						try {
							if (this.dateWithAllery.length > 0) {
								this.showLine = true;
								setTimeout(() => {
									this.myFunction();
								}, 10000);
							} else {
								this.showLine = false;
							}
						} catch (error) {
							this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
							// Handle the error as needed
						}

					}
				})
				.catch(error => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
				});
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
		}

	}
	//This function is typically called to allow users to print the content of the page.
	myFunction() {
		let globalThis = window;
		globalThis.print();
	}
	//The image URL corresponding to the symptom name.
	getImagesForName(name) {
		switch (name) {
			case REDNES:
				return RED_ELLIPSE;
			case ITCHINESS:
				return DARK_YELLOW_ELLIPSE;
			case PAINN:
				return VIOLET_ELLIPSE;
			case PUSSTULES:
				return GREEN_ELLIPSE;
			case FATIQUE:
				return BLUE_ELLIPSE;
			case TEMPERRATURE:
				return DARK_RED_ELLIPSE;
			case MOOD:
				return YELLOW_ELLIPSE;
			default:
				return DARK_RED_ELLIPSE;
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