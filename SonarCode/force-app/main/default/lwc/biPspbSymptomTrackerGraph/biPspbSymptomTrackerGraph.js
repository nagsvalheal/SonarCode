//This LWC is Used for display allergy values and symptom values based on month wise  - biPspbSymptomTrackerGraph
// To import Libraries
import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import current user ID
import Id from '@salesforce/user/Id';
// To import Static Resources
import YELLOW_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_YellowEllipse';
import DARK_RED_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_DarkRedEllipse';
import BLUE_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_BlueEllipse';
import GREEN_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_GreenEllipse';
import VIOLET_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_VioletEllipse';
import RED_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_RedEllipse';
import VERTICAL_LINE from '@salesforce/resourceUrl/BI_PSPB_VerticalLine';
import DARK_YELLOW_ELLIPSE from '@salesforce/resourceUrl/BI_PSPB_DarkYellowEllipse';
import RIGHT_ICON from '@salesforce/resourceUrl/BI_PSPB_DeleteToastMsg';
// To import Apex Classes
import GET_ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import FETCH_SYMPTOM_EROLLE from '@salesforce/apex/BI_PSP_GraphCtrl.getSymptomTrackerDetails';
import GET_LATEST_SYMPTOM_RECORD from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getLatestSymptomRecord';
// To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
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
import ERROR_MESSAGES from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import SYMPTOM_MAIN_PAGE_URL from '@salesforce/label/c.BI_PSPB_SymptomTrackerMainPages';
import SYMPTOM_TRACKER_PDF from '@salesforce/label/c.BI_PSP_SymptomTrackerPdf';
import UNEXPECTED_ERROR from '@salesforce/label/c.BI_PSP_UnExpectedError';
import LATEST_RECORD from '@salesforce/label/c.BI_PSP_LatestRecords';
import MONTH from '@salesforce/label/c.BI_PSP_Month';
import ITCHINESS from '@salesforce/label/c.BI_PSP_Itchiness';
import REDNESS from '@salesforce/label/c.BI_PSP_Redness';
import PAIN from '@salesforce/label/c.BI_PSP_Pain';
import PUSSTULES from '@salesforce/label/c.BI_PSP_Pustules';
import FATIQUE from '@salesforce/label/c.BI_PSP_Fatique';
import TEMPERRATURE from '@salesforce/label/c.BI_PSP_Temperrature';
import MOOD from '@salesforce/label/c.BI_PSP_Mood';
import SYMPTOM_TRACKERS from '@salesforce/label/c.BI_PSP_SymptomTrackers';
import PDF from '@salesforce/label/c.BI_PSP_Pdf';
import HIGHLIGHT_BACK from '@salesforce/label/c.BI_PSP_HighLightBack';
import EROLLS from '@salesforce/label/c.BI_PSP_Erolls';
import FIRST_DATE from '@salesforce/label/c.BI_PSP_FirstDateee';
import LAST_DATE from '@salesforce/label/c.BI_PSP_LastDateee';
import PRIMARY_PAGES from '@salesforce/label/c.BI_PSP_PrimaryPages';
import MONTHS from '@salesforce/label/c.BI_PSP_Months';
import FIRST_DATE_GRAPH from '@salesforce/label/c.BI_PSP_FirstDateGraph';
import LAST_DATE_GRAPH from '@salesforce/label/c.BI_PSP_LastDateGraph';
import ZERO from '@salesforce/label/c.BI_PSP_Null';
import SLASH from '@salesforce/label/c.BI_PSP_Slash';
import SLASH_LATTER from '@salesforce/label/c.BI_PSP_SlashLatter';
import QUESTION_MARK from '@salesforce/label/c.BI_PSP_QuestionMark';


export default class BiPspbSymptomTrackerGraph extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@track variable declaration
	@track receivedValue;
	@track dateWithAllery = [];
	@track highlight = false;
	@track showDiv = false;
	@track remainingItems = [];
	@track pdfName;
	@track firstDate;
	@track lastDate;
	@track symptomIdGet
	@track checkValue = false;
	@track showLine;
	@track currentDisplayIndex = 0;
	@track dateWithAlleryTwo = [];
	@track dateWithAlleryThree = [];
	@track dateWithAlleryFour = [];
	@track leftLess;
	@track rightLess;
	@track showChart = false;
	@track updateValue = false;
	@track understand = false;
	@track latestRecord;
	@track throwErrorMessage = false;
	@track showLoading = true;
	// @track isLoading ;
	//Variable declaration
	urlq;
	enrolleId;
	montss;
	yellowEllipse = YELLOW_ELLIPSE;
	rightImg = RIGHT_ICON;
	darkRedEllipse = DARK_RED_ELLIPSE;
	blueEllipse = BLUE_ELLIPSE;
	verticalLine = VERTICAL_LINE;
	greenEllipse = GREEN_ELLIPSE;
	violetEllipse = VIOLET_ELLIPSE;
	redEllipse = RED_ELLIPSE;
	darkYellowEllipse = DARK_YELLOW_ELLIPSE;
	bubbles = '';
	userId = Id;
	errorMessage;
	showError;
	CURRENT_INDEX = 0;
	showPopup;
	placeholder = MONTH;
	selectedMonthValue;
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
	// Handles the response from the getLatestSymptomRecord Apex method. 
	@wire(GET_LATEST_SYMPTOM_RECORD, { careProgramEnrolleeId: '$enrolleId' })
	wiredLatestRecord({ error, data }) {
		if (data && data !== null) {
			try {
				this.latestRecord = data[0];
				this.errorMessage = ''; // Clear any previous error
			} catch (ex) {
				this.showToast(ERROR_MESSAGES, ex.message, ERROR_VARIANT);
				// Handle the error accordingly, such as displaying an error message to the user
				this.errorMessage = UNEXPECTED_ERROR;
				this.latestRecord = null;
			}
		} else if (error) {
			this.showToast(ERROR_MESSAGES, error.body.message, ERROR_VARIANT);
			this.latestRecord = null;
			this.errorMessage = LATEST_RECORD;
		}
	}
	// Determines the current URL and sets a navigation URL based on certain PATH components.
	get picklistLabels() {
		return this.picklistOptions.map(option => option.label);

	}
	connectedCallback() {
		let globalThis = window;

		// 		// this.isLoading = true;
		// 	const queryParams = new URLSearchParams(window.location.search);
		// // Get the value of the 'valuess' parameter
		// this.receivedValue = queryParams.get('value');

		this.receivedValue = globalThis?.sessionStorage.getItem('someDynamicValue')


		if (this.receivedValue) {
			this.showDiv = true;
			this.receivedValue = globalThis?.sessionStorage.removeItem('someDynamicValue')

		}



		// Check if the value is received

		// You can use the value here as needed

		const CURRENT_URL = globalThis.location?.href;
		// Create a URL object
		const URL_OBJECT = new URL(CURRENT_URL);
		// Get the PATH
		const PATH = URL_OBJECT.pathname;
		// Split the PATH using '/' as a separator
		const PATH_COMPONENTS = PATH.split(SLASH);
		// Find the component you need (in this case, 'Branded')
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
			[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);
		if (DESIRED_COMPONENT.toLowerCase() === BRANDED_URL.toLowerCase()) {
			this.urlq = BRANDED_URL_NAVI;
		}
		else {
			this.urlq = UNASSIGNED_URL_NAVI;
		}
		let primarypopup = globalThis?.sessionStorage.getItem(PRIMARY_PAGES);
		if (primarypopup) {
			this.openundersatand()
		}
		try {
			GET_ENROLLE({ userId: this.userId })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then(result => {

					if (result[0].patientEnrolle !== null) {

						this.enrolleId = result[0].patientEnrolle.Id;
						let urlParams = new URLSearchParams(globalThis.location?.href.split(QUESTION_MARK)[1]);
						let eroll = urlParams.get(EROLLS);
						let firstdate1 = urlParams.get(FIRST_DATE);
						let lastdate1 = urlParams.get(LAST_DATE);
						this.firstDate = firstdate1;
						this.lastDate = lastdate1;
						let month = urlParams.get(MONTHS);
						this.selectedMonthValue = month;
						if (eroll !== null && firstdate1 !== null && lastdate1 !== null) {
							const SELECT_ELEMENT = this.template.querySelector('.selectWidth');//This is the querySelector which uses html class 


							SELECT_ELEMENT.value = month;
							this.getsymptomdatewithallergy(eroll, firstdate1, lastdate1);
						}
					} else if (result[0].error !== null) {
						this.showError = true;
						this.errorMessage = result[0].error;
					}
				})
				.catch(error => {
					// Handle any errors occurring during the promise chain
					this.showToast(ERROR_MESSAGES, error.message, ERROR_VARIANT);
				});
		} catch (error) {
			// Handle any synchronous errors outside the promise chain
			this.showToast(ERROR_MESSAGES, error.message, ERROR_VARIANT);
		}
	}
	//Returns the formatted date string.	
	parsedDat(dateToFormat) {
		const PARSED_DATE = new Date(dateToFormat);
		const OPTIONS = { month: 'short' };

		// Get the short month name
		const month = PARSED_DATE.toLocaleDateString('en-US', OPTIONS).split(' ')[0];

		// Get the numeric day
		const day = PARSED_DATE.getDate();

		// Return formatted date as "Jun 6"
		return `${month} ${day}`;
	}
	//Captures the current state of the component and generates a PDF report
	captureComponent() {
		let globalThis = window;
		if (this.selectedMonthValue !== null && this.dateWithAllery !== null) {
			let currenturl = globalThis.location.href?.split(SLASH_LATTER)[0];
			globalThis.open(currenturl + SYMPTOM_TRACKER_PDF + this.enrolleId + FIRST_DATE_GRAPH + this.firstDate + LAST_DATE_GRAPH + this.lastDate);
		}
	}
	handleclose() {
		this.showDiv = false;
	}
	//To Updates the selectedMonthValue property with the value of the selected category.
	handleCategoryChange(event) {
		this.showChart = false;
		this.checkValue = false;
		this.currentDisplayIndex = 0;
		this.dateWithAllery = [];
		this.dateWithAlleryTwo = [];
		this.dateWithAlleryThree = [];
		this.dateWithAlleryFour = [];
		this.remainingItems = [];
		this.rightLess = false;
		this.leftLess = false;
		this.selectedMonthValue = event.target.value;

		this.pdfName = SYMPTOM_TRACKERS + this.selectedMonthValue + PDF;

		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		const monthIndex = months.findIndex(month => month === this.selectedMonthValue);

		const day = 1;

		const selectedDate = new Date(new Date().getFullYear(), monthIndex, day);

		// const SELECTED_DATE = new Date(this.selectedMonthValue + ZERO_ONE);

		const SELECTED_MONTH_INDEX = selectedDate.getMonth();

		const SELECTED_YEAR = selectedDate.getFullYear();
		const CURRENT_DATE = new Date();
		const CURRENT_YEAR = CURRENT_DATE.getFullYear();

		if (SELECTED_YEAR < CURRENT_YEAR || (SELECTED_YEAR === CURRENT_YEAR && SELECTED_MONTH_INDEX <= CURRENT_DATE.getMonth())) {
			// Calculate first date of next month
			this.montss = this.getDatesOfMonth();
			const FIRST_DATE_OF_NEXT_MONTH = new Date(CURRENT_YEAR, SELECTED_MONTH_INDEX + 1, 1);
			FIRST_DATE_OF_NEXT_MONTH.setHours(18, 30, 0, 0); // Set time to 18:30:00.000

			// Calculate last date of previous month
			const LAST_DATE_OF_PREVIOUS_MONTH = new Date(CURRENT_YEAR, SELECTED_MONTH_INDEX, 0);
			LAST_DATE_OF_PREVIOUS_MONTH.setHours(18, 30, 0, 0); // Set time to 18:30:00.000

			// Subtract one day from the first date of next month
			FIRST_DATE_OF_NEXT_MONTH.setDate(FIRST_DATE_OF_NEXT_MONTH.getDate() - 1);

			// Assign values to this.firstDate and this.lastDate
			this.firstDate = LAST_DATE_OF_PREVIOUS_MONTH.toISOString();
			this.lastDate = FIRST_DATE_OF_NEXT_MONTH.toISOString();
			// Call your function with the desired date range
			this.getsymptomdatewithallergy(this.enrolleId, this.firstDate, this.lastDate);
		} else {
			this.montss = this.getDatesOfMonth();

			// Calculate first date of current month
			const FIRST_DATE_OF_CURRENT_MONTH = new Date(CURRENT_YEAR, SELECTED_MONTH_INDEX, + 1, 1);
			FIRST_DATE_OF_CURRENT_MONTH.setHours(18, 30, 0, 0); // Set time to 18:30:00.000

			// Calculate last date of previous month
			const LAST_DATE_OF_PREVIOUS_MONTH = new Date(CURRENT_YEAR, SELECTED_MONTH_INDEX, 0);
			LAST_DATE_OF_PREVIOUS_MONTH.setHours(18, 30, 0, 0); // Set time to 18:30:00.000

			// Subtract one day from the first date of current month
			FIRST_DATE_OF_CURRENT_MONTH.setDate(FIRST_DATE_OF_CURRENT_MONTH.getDate() - 1);

			// Assign values to this.firstDate and this.lastDate
			this.firstDate = LAST_DATE_OF_PREVIOUS_MONTH.toISOString();
			this.lastDate = FIRST_DATE_OF_CURRENT_MONTH.toISOString();

			// Call your function with the desired date range
			this.getsymptomdatewithallergy(this.enrolleId, this.firstDate, this.lastDate);
		}
	}

	openundersatand() {
		// Add your specific logic for opening the mood modal
		this.understand = true;
		this.submitModal = false;
	}
	closeundersatand() {
		// Add your specific logic for closing the mood modal
		this.understand = false;
	}
	formatDate(inputDate) {
		// Regular expression PATTERN for "Month Day" format, e.g., "Aug 27"
		const PATTERN = /^[A-Za-z]{3}\s\d{1,2}$/u;
		// Use test method of the regular expression to check if the format matches
		let checkFormat = PATTERN.test(inputDate);
		if (!checkFormat) {
			// Split the input date string into month and day parts
			let [day, month] = inputDate.split(' ');
			// Return the formatted date string with day first and month second
			return `${month} ${day}`;
		}

		return inputDate;

	}

	//Fetches symptom and allergy data for the specified enrollee and date range using the FETCH_SYMPTOM_EROLLE method.

	getsymptomdatewithallergy(erolles, firstDate, lastDate) {
		// this.isLoading = true;
		FETCH_SYMPTOM_EROLLE({ erolleId: erolles, firstDate: firstDate, lastDate: lastDate })
			.then(result => {

				// this.isLoading = false;
				if (result !== null) {
					result.forEach(item => {
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

					if (this.dateWithAllery.length > 7) {
						this.rightLess = true;
						Promise.resolve().then(() => {
							this.changeNextSeven();
						});
					}

					// Sorting the array by dates in ascending order
					this.dateWithAllery.sort((a, b) => new Date(a.dates) - new Date(b.dates));


					this.dateWithAlleryTwo = this.dateWithAllery;
					//this.generatePdf(JSON.stringify(this.dateWithAlleryTwo), null, null);
					this.dateWithAlleryThree = this.dateWithAllery;
					this.dateWithAlleryFour = this.dateWithAllery;



					//

					// Limit to 7 items if needed, but preserve the full list in dateWithAlleryTwo, 3, and 4
					this.dateWithAllery = this.dateWithAllery.slice(0, 7);


					if (this.dateWithAllery.length > 0) {
						// this.isLoading = false;
						this.throwErrorMessage = false;
						this.showLine = true;
						this.showChart = true;
					} else {
						// this.isLoading = false;
						this.showLine = false;
						this.showChart = false;
					}





					// Filtering the dateWithAllery array based on selected dates
					this.dateWithAllery = this.dateWithAllery.filter(item => {
						// Check if the item's date is included in the selectedDates array                        
						let isDateAvailable = false;
						for (let i = 0; i < this.montss.length; i++) {
							if (this.montss[i] === this.formatDate(item.dates)) {
								isDateAvailable = true;
								break;
							}
						}
						return isDateAvailable;
					});
				} else {
					this.showChart = false;
					this.checkValue = false;
					this.throwErrorMessage = true;
				}

			})



			.catch(error => {
				this.ERROR_MESSAGES = error;
			});
	}


	// Function to generate an array of dates for the selected month
	getDatesOfMonth() {
		const MONTH_NAMES = [
			JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE,
			JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER
		];
		const SELECTED_MONTH_INDEX = MONTH_NAMES.indexOf(this.selectedMonthValue);
		const NUMBER_OF_DAYS = new Date(new Date().getFullYear(), SELECTED_MONTH_INDEX + 1, 0).getDate();
		const DATES_OF_MONTH = [];
		for (let day = 1; day <= NUMBER_OF_DAYS; day++) {
			DATES_OF_MONTH.push(`${this.selectedMonthValue.substr(0, 3)} ${day}`);
		}
		return DATES_OF_MONTH;
	}
	// Returns an array of formatted dates like "Jan 1", "Jan 2", ...
	get bars() {


		return this.dateWithAllery.map(entry => ({
			height: `${entry.imageUrls.length * 20}px`,
			dates: entry.dates,
			imageUrls: entry.imageUrls
		}));
	}
	// Function to return the appropriate image URL based on the given symptom name
	getImagesForName(name) {
		switch (name) {
			case REDNESS:
				return RED_ELLIPSE;
			case ITCHINESS:
				return DARK_YELLOW_ELLIPSE;
			case PAIN:
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
	// Function to toggle the CSS class for highlighting background
	highlightbackground() {
		if (this.bubbles === '') {
			this.bubbles = HIGHLIGHT_BACK;
		} else {
			this.bubbles = '';
		}
	}

	//Function to highlight the selected bar and update related properties
	showHighlighter(event) {
		let clickedKey = event.target.dataset.item;
		let bars = this.template.querySelectorAll('.bar');//This is the css property of overflow so this can't be through customlabel
		bars.forEach((bar) => {
			if (bar.dataset.item === clickedKey) {
				bar.style.backgroundColor = '#ECDCA8';//This is the css property of overflow so this can't be through customlabel
				bar.style.borderRadius = '12px';//This is the css property of overflow so this can't be through customlabel
			} else {
				bar.style.backgroundColor = '';
			}
		});
		const EXISTING_DATE = this.dateWithAlleryFour.find(entry => entry.dates === clickedKey);
		this.symptomIdGet = EXISTING_DATE.symptom;
		if (this.symptomIdGet) {
			this.checkValue = true;
		}
		else {
			this.checkValue = false;
		}
	}
	// Function to update the displayed data to the next seven days
	changeNextSeven() {

		this.dateWithAlleryTwo = this.dateWithAlleryFour;
		this.currentDisplayIndex += 7;
		this.updateBars();
	}
	// Function to update the displayed data to the previous seven days
	changePreviousSeven() {
		this.dateWithAlleryThree = this.dateWithAlleryFour;
		this.currentDisplayIndex -= 7;
		if (JSON.stringify(this.currentDisplayIndex) === ZERO) {
			this.leftLess = false;
		}
		this.updateBars1();
	}
	// Function to update the displayed bars based on the current display index
	updateBars1() {
		let endIndex = this.currentDisplayIndex + 7;
		if (endIndex === -(this.currentDisplayIndex)) {
			// this.currentDisplayIndex = 0;
			this.rightLess = true;
		} else {
			this.rightLess = true;
		}
		this.dateWithAlleryThree = this.dateWithAlleryThree.slice(this.currentDisplayIndex, endIndex);
		this.dateWithAllery = this.dateWithAlleryThree;
		if (this.dateWithAllery.length > 0) {
			this.showLine = true;
			this.bars();
		} else {
			this.showLine = false;
		}
		this.dateWithAlleryThree = this.dateWithAlleryFour;
	}
	//Calculates end index for the displayed data and adjusts if it exceeds the length of the data array
	updateBars() {
		let endIndex = this.currentDisplayIndex + 7;
		if (endIndex > this.dateWithAlleryTwo.length) {
			endIndex = this.dateWithAlleryTwo.length;
			this.rightLess = false;
			this.leftLess = true;
		} else {
			this.leftLess = false;
		}
		this.dateWithAlleryTwo = this.dateWithAlleryTwo.slice(this.currentDisplayIndex, endIndex);
		this.dateWithAllery = this.dateWithAlleryTwo;
		if (this.dateWithAllery.length > 0) {
			this.showLine = true;
			this.bars();
		} else {
			this.showLine = false;
		}
		this.dateWithAlleryTwo = this.dateWithAlleryFour;
	}

	updatesymptom() {
		let globalThis = window;
		// window.location.assign('/' + this.urlq + '/s/bi-pspb-symptomtrackerlandingpage?edit=true');
		globalThis.location.assign(this.urlq + SYMPTOM_MAIN_PAGE_URL);
		globalThis.localStorage.clear();
		globalThis.sessionStorage.clear();
	}
	doNotLogout() {
		this.showPopup = false;
		document.body.style.overflow = ''; // Reset to default
	}
	openShowPopUp() {
		this.showPopup = true;
		document.body.style.overflow = 'hidden'; //This is the css property of overflow so this can't be through customlabel
	}
	// Function to move the selection in a dropdown menu upwards
	moveSelectionUp() {
		const SELECT_ELEMENT = this.template.querySelector('select');//This is the querySelector which uses html class 
		const CURRENT_INDEX = SELECT_ELEMENT.selectedIndex;
		if (CURRENT_INDEX > 0) {
			SELECT_ELEMENT.selectedIndex = CURRENT_INDEX - 1;
			this.handleSelectionChange();
		}
	}
	// Function to move the selection in a dropdown menu downwards
	moveSelectionDown() {
		const SELECT_ELEMENT = this.template.querySelector('select');//This is the querySelector which uses html class 
		const CURRENT_INDEX = SELECT_ELEMENT.selectedIndex;
		if (CURRENT_INDEX < SELECT_ELEMENT.OPTIONS.length - 1) {
			SELECT_ELEMENT.selectedIndex = CURRENT_INDEX + 1;
			this.handleSelectionChange();
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