//This Lightning web component facilitates setting up reminders and treatment schedules, allowing users to save and manage their healthcare appointments efficiently
// To import Libraries
import { LightningElement,wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import AVATAR from '@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver';
import GOOGLE_URL from "@salesforce/apex/BI_PSPB_GoogleCalendarCtrl.generateGoogleCalendarUrl";
import OUTLOOK_URL from "@salesforce/apex/BI_PSPB_OutlookReminderCalendarCtrl.generateOutlookCalendarUrl";
import REMINDER_DATES from "@salesforce/apex/BI_PSPB_TreatmentCtrl.createRemainderRecord";
import LOGGEDIN_USER_ACCOUNTS from "@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount";
import PREPOPULATED_VALUES from "@salesforce/apex/BI_PSPB_WidgetCtrl.prepopulatedValues";
import {resources} from 'c/biPspbNotificationReminderResources';

export default class BiPspbReminderSetup extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//Variable declaration
	dobErrorMessage;
	showDiv = false;
	variable = true;
	selectedDate;
	reminderSetup = resources.REMINDER_SETUP;
	selectedReminders = [];
	selectedTreatment = [];
	showMessage = false;
	showMessageTwo = false;
	value = [];
	treatValue = [];
	formattedReminderDates = [];
	cpeId;
	content = false;
	isPartVisible = false;
	googleCalendarUrls = [];
	outlookCalendarUrls = [];
	prepopulatedValues = [];
	existingReminder = [];
	userId = resources.ID;
	boxedIcon = resources.BOXED_ICON;
	valueOne;
	valueTwo;
	valueThree;
	treatValueOne;
	treatmentValue;
	closeDot = true;
	clss = true;
	defaultClass = true;
	checkingdata = false;
	disableFourteen = false;
	disableTen = false;
	disableSeven = false;
	checkedFourteen = false;
	checkedTen = false;
	checkedSeven = false;
	checkedThree = false;
	checkedOne = false;
	showAfterSaveContent = true;
	showBeforeSaveContent = true;
	checkdata = false;
	caregiver = false;
	selectedOption = {
		src: resources.DEFAULT_AVATAR_URL,
		name: ""
	};
	//Variable declaration
	userAccounts;
	selectedAvatarSrc;
	rightimg = resources.TIC;
	googleCalIcon = resources.GOOGLE_ICON;
	outlookCalIcon = resources.OUTLOOK_ICON;
	warning = resources.WARNING;
	name;
	rendered = false;
	// To fetch URLs of Google Calender
	@wire(GOOGLE_URL, { eventDate: "$selectedDate" })
	wiredGoogleCalendarURL({ error, data }) {
		try{
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
					this.googleCalendarUrls = data;
			} else if (error) {
				this.showToast(resources.ERROR_MESSAGE, error.body.message, resources.ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(resources.ERROR_MESSAGE, err.message, resources.ERROR_VARIANT);
		}
	}
	//To fetch data for the treatment reminder 
	@wire(PREPOPULATED_VALUES)
	wiredPrepopulatedValues({ data }) {
		
			if (data) {
				this.prepopulatedValues = data;
				this.selectedDate = data.DayofTreatment;
				this.existingReminder = data.selectedCheckboxes ? data.selectedCheckboxes.split(';').filter(item => item).map(item => parseFloat(item)) : [];
				this.updateCheckboxDisabling();
				this.updateValueArrays();
			}
		
	}
	// To fetch URLs of Outlook Calender
	@wire(OUTLOOK_URL, { eventDate: "$selectedDate" })
	wiredOutlookCalendarURL({ error, data }) {
		
			if (data) {
				// Null data is checked and AuraHandledException is thrown from the Apex
				this.outlookCalendarUrls = data;
			}
		
	}
	// To fetch URL of Avatar image
	@wire(LOGGEDIN_USER_ACCOUNTS)
	wiredUserAccounts({ error, data }) {
		try{
			if (data) {
					this.userAccounts = data;
					if (!this.caregiver) {
						this.name =
							this.userAccounts.length > 0 ? this.userAccounts[0]?.Name : "";
						this.selectedAvatarSrc = this.userAccounts[0]?.BI_PSP_AvatarUrl__c
							? this.userAccounts[0]?.BI_PSP_AvatarUrl__c
							: resources.DEFAULT_AVATAR_URL;
					}
			} else if (error) {
				this.showToast(resources.ERROR_MESSAGE, error.body.message, resources.ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(resources.ERROR_MESSAGE, err.message, resources.ERROR_VARIANT);
		}
	}
	// Getting avatar of the logged in user.
	@wire(AVATAR)
	wiredavtList({ error, data }) {
		try{
			if (data) {
					// Set the name and avatar for the caregiver or default to a placeholder if not available
					this.name = data.length > 0 ? data[0]?.Name : '';
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : resources.DEFAULT_AVATAR_URL;
					// Additional content visibility settings for caregiver
					if (data.length > 0) {
						this.content = true;
						this.contentdot = true;
						this.caregiver = true;
					}
			} else if (error) {
				this.showToast('Error', error.message, resources.ERROR_VARIANT);
			}
		} catch (err) {
			this.showToast(resources.ERROR_MESSAGE, err.message, resources.ERROR_VARIANT);
		}
	}
	//Updating the values of the checked boxes.
	updateValueArrays() {
		this.value = [];
		this.treatValue = [];
		const reminders = [14, 10, 7, 3, 1];
		const reminderMappings = {
			14: { array: 'value', checkProp: 'checkedFourteen' },
			10: { array: 'value', checkProp: 'checkedTen' },
			7: { array: 'value', checkProp: 'checkedSeven' },
			3: { array: 'treatValue', checkProp: 'checkedThree' },
			1: { array: 'treatValue', checkProp: 'checkedOne' }
		};
		reminders.forEach(reminder => {
			this.updateReminder(reminder, reminderMappings[reminder]);
		});
		this.showMessage = this.value.length === 0;
		this.showMessageTwo = this.treatValue.length === 0;
	}
	// Updates the reminder status and associated array based on its existence in the existingReminder list.
	updateReminder(reminder, config) {
		const isChecked = this.existingReminder.includes(reminder);
		if (isChecked) {
			this[config.array].push(reminder);
		}
		this[config.checkProp] = isChecked;
	}
	// Disables checkboxes based on the number of days between the current date and the selected date.
	updateCheckboxDisabling() {
		const CURRENT_DATE = new Date();
		let selectedDate = new Date(this.selectedDate);
		const DIFFERENCE_DAYS = Math.floor(
			(selectedDate - CURRENT_DATE) / (1000 * 60 * 60 * 24)
		);

		this.disableFourteen = DIFFERENCE_DAYS < 14;
		this.disableTen = DIFFERENCE_DAYS < 10;

		// Update the checked properties based on the disabling status
		if (this.disableFourteen) this.checkedFourteen = false;
		if (this.disableTen) this.checkedTen = false;
	}
	// Calling the method setMinDate.
	connectedCallback() {
		try {
			this.setMinDate();
		} catch (err) {
			this.showToast(resources.ERROR_MESSAGE, err.message, resources.ERROR_VARIANT);
		}
	}
	// Sets the minimum date to 8 days from today when the component is initialized.
	setMinDate() {
		const TODAY = new Date();
		const FUTURE_DATE = new Date(TODAY);
		FUTURE_DATE.setDate(FUTURE_DATE.getDate() + 8);
		this.minDate = FUTURE_DATE.toISOString().slice(0, 10);
	}
	// Prevent manual input
	handleKeyDown(event) {
		event.preventDefault();
	}
	// Ensure the value is only set by the date picker
	handleInput(event) {
		const INPUT = event.target;
		const DATE_VALUE = INPUT.value;
		// Clear the input value if it is not a valid date
		if (isNaN(Date.parse(DATE_VALUE))) {
			INPUT.value = '';
		}
	}
	// To get the values of the check box enabled
	setCheckboxValues(callback) {
		this.value = [];
		this.treatValue = [];
		// Define configuration for checkbox values
		const checkboxConfigs = [
		{ value: 14, disabledProp: 'disableFourteen' },
		{ value: 10, disabledProp: 'disableTen' },
		{ value: 7, disabledProp: 'disableSeven' }
		];
		// Add values to 'value' array based on the configuration
		checkboxConfigs.forEach(config => {
			if (!this[config.disabledProp]) {
				this.value.push(config.value);
			}
		});
		// Add treatment values if they are not null
		[this.treatValueOne, this.treatmentValue].forEach(val => {
			if (val !== null) {
			this.treatValue.push(val);
			}
		});
		// Invoke callback if provided
		if (callback && typeof callback === 'function') {
			callback();
		}
	}
	// To display the Date with the suffix format
	getOrdinalNumber(number) {
		const SUFFIXES = [resources.TH, resources.ST, resources.ND, resources.RD];
		const VNUMBER = number % 100;
		return number + (SUFFIXES[(VNUMBER - 20) % 10] || SUFFIXES[VNUMBER] || SUFFIXES[0]);
	}
	// To close the modal box
	Xbtn() {
		this.showBeforeSaveContent = true;
		this.defaultClass = true;
		this.clss = false;
		this.cls = false;
		this.closeDot = true;
		this.closingdot = false;
		this.variable = true;
		this.checkdata = false;
	}
	mobileclick1() {
		this.checkingdata = true;
		this.clss = true;
		this.variable = false;
		this.showAfterSaveContent = true;
		this.showBeforeSaveContent = false;
	}
	// To display the short names of the month
	renderedCallback() {
		// Iterate over each class name
		const MONTH_CLASSNAMES = [resources.DEC, resources.NOV, resources.OCT, resources.SEP, resources.AUG, resources.JULY,
			resources.JUNE, resources.MAY, resources.APRIL, resources.MARCH, resources.FEB, resources.JAN];
			MONTH_CLASSNAMES.forEach((className) => {
				// Find all elements with the current class name
				const CLASS_SHORT = className.substr(0, 3)
				const ELEMENTS = this.template.querySelectorAll(`.${CLASS_SHORT}`);
				// Get the last element
				const LAST_ELEMENT = ELEMENTS[ELEMENTS.length - 1];
				// Change its background color to red
				if (LAST_ELEMENT) {
					LAST_ELEMENT.classList.add("red-background");
				}
			}
		);
		const MONTHNAME_CLASSNAMES = [
			resources.DECEMBER,resources.NOVEMBER, resources.OCTOBER, resources.SEPTEMBER,
			resources.AUGUST, resources.JULY_MONTH, resources.JUNE_MONTH, resources.MAY_MONTH,
			resources.APRIL_MONTH,resources.MARCH_MONTH,resources.FEBRUARY,resources.JANUARY
		];
		MONTHNAME_CLASSNAMES.forEach((className) => {
			// Find all elements with the current class name
			const ELEMENTS = this.template.querySelectorAll(`.${className}`);
			// Get the last element
			const MIDDLE_ELEMENT = ELEMENTS[0];
			// Change its background color to red
			if (MIDDLE_ELEMENT) {
				MIDDLE_ELEMENT.textContent = className.substring(0, 3);
			}
		});
		const CIRCLE_BUTTON = ["circlebutton"];
		CIRCLE_BUTTON.forEach((className) => {
			// Find all elements with the current class name
			const ELEMENTS = this.template.querySelectorAll(`.${className}`);
			// Get the last element
			const LAST_ELEMENT = ELEMENTS[ELEMENTS.length - 1];
			// Change its background color to red
			if (LAST_ELEMENT) {
				LAST_ELEMENT.classList.add("treatmentDate");
			}
		});
	}
	mobileclick() {
		this.clss = true;
		this.closeDot = false;
		this.checkdata = true;
		this.variable = false;
	}
	// Handle change event when date is selected
	handleDateChange(event) {
		this.selectedDate = event.target.value;
		// Calculate difference in days between selected date and current date
		const CURRENT_DATE = new Date();
		let selectedDate = new Date(this.selectedDate);
		const DIFFERENCE_DAYS = Math.floor(
			(selectedDate - CURRENT_DATE) / (1000 * 60 * 60 * 24)
		);
		// Update checkbox disable and checked properties based on date difference
		this.disableFourteen = DIFFERENCE_DAYS < 14;
		this.disableTen = DIFFERENCE_DAYS < 10;
		// Set initial values for checkboxes
		this.checkedFourteen = !this.disableFourteen;
		this.checkedTen = !this.disableTen; // Uncheck checkbox 10
		this.checkedSeven = true;
		this.checkedOne = true;
		this.checkedThree = true;
		this.value = [];
		this.treatValue = [];
		// Call handlers directly for checkboxes
		this.handle14({ target: { checked: !this.disableFourteen, value: 14 } });
		this.handle10({ target: { checked: !this.disableTen, value: 10 } });
		this.handle7({ target: { checked: true, value: 7 } });
		this.handle3({ target: { checked: true, value: 3 } });
		this.handle1({ target: { checked: true, value: 1 } });
	}
	// Handle checkbox change for 14 days reminder
	handle14(event) {
		// Update valueOne based on checkbox state
		this.valueOne = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		// Update value array based on checkbox state
		if (event.target.checked) {
			this.value.push(this.valueOne);
			this.checkedFourteen = true;
		} else {
			let valueToRemove = 14;
			let index = this.value.findIndex((item) => item === valueToRemove);
			this.checkedFourteen = false;
			if (index > -1) {
				this.value.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedFourteen = false;
			}
		}
	}
	// Handle checkbox change for 10 days reminder
	handle10(event) {
		// Update valueTwo based on checkbox state
		this.valueTwo = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		// Update value array based on checkbox state
		if (event.target.checked) {
			this.value.push(this.valueTwo);
			this.checkedTen = true;
		} else {
			let valueToRemove = 10;
			let index = this.value.findIndex((item) => item === valueToRemove);
			this.checkedTen = false;
			if (index > -1) {
				this.value.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedTen = false;
			}
		}
	}
	// Handle checkbox change for 7 days reminder
	handle7(event) {
		// Update valueThree based on checkbox state
		this.valueThree = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		// Update value array based on checkbox state
		if (event.target.checked) {
			this.value.push(this.valueThree);
			this.checkedSeven = true;
		} else {
			let valueToRemove = 7;
			let index = this.value.findIndex((item) => item === valueToRemove);
			this.checkedSeven = false;
			if (index > -1) {
				this.value.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedSeven = false;
			}
		}
	}
	// Handle checkbox change for 3 days reminder
	handle3(event) {
		// Update treatValueOne based on checkbox state
		this.treatValueOne = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		this.disable3 = this.treatValueOne === null;
		// Update treatValue array based on checkbox state
		if (event.target.checked) {
			this.treatValue.push(this.treatValueOne);
			this.checkedThree = true;
		} else {
			let valueToRemove = 3;
			let index = this.treatValue.findIndex((item) => item === valueToRemove);
			this.checkedThree = false;
			if (index > -1) {
				this.treatValue.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedThree = false;
			}
		}
	}
	// Handle checkbox change for 1 day reminder
	handle1(event) {
		// Update treatmentValue based on checkbox state
		this.treatmentValue = event.target.checked
			? parseInt(event.target.value, 10)
			: null;
		this.disable1 = this.treatmentValue === null;
		// Update treatValue array based on checkbox state
		if (event.target.checked) {
			this.treatValue.push(this.treatmentValue);
			this.checkedOne = true;
		} else {
			let valueToRemove = 1;
			let index = this.treatValue.findIndex((item) => item === valueToRemove);
			this.checkedOne = false;
			if (index > -1) {
				this.treatValue.splice(index, 1);
			}
			// Remove from existingReminder
			let reminderIndex = this.existingReminder.indexOf(valueToRemove);
			if (reminderIndex > -1) {
				this.existingReminder.splice(reminderIndex, 1);
				this.checkedOne = false;
			}
		}
	}
	handleclose() {
		this.showDiv = false;
	}
	// Handle success after saving reminders    
	handleSuccess() {
		// Check if any required fields are not filled
		this.allReminderDates = [];
		this.formattedReminderDates = [];
		this.defaultClass = false;
		this.showMessage = this.value.length === 0;
		this.showMessageTwo = this.treatValue.length === 0;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		this.showDiv = false;
		this.showAddToCalendarBtn = true;
		this.selectedReminders = this.value;
		this.selectedTreatment = this.treatValue;
		// Proceed if all required fields are filled
		const LASTNAME_FIELD = this.template.querySelector(
			'input[data-field="DOB"]'
		);
		if (!LASTNAME_FIELD.value) {
			this.dobERROR_MESSAGE = true;
			LASTNAME_FIELD.className = "textInput-err";
			this.template.querySelector('label[data-field="DOB"]').className =
				"input-error-label";
		} else {
			this.dobERROR_MESSAGE = false;
			LASTNAME_FIELD.className = "textInput";
			this.template.querySelector('label[data-field="DOB"]').className =
				"input-label";
		}
		if (!this.showMessage &&
			!this.showMessageTwo &&
			this.selectedDate &&
			this.selectedReminders.length > 0
		) {
			let allReminderDates = [];

			// Iterate over selectedReminders and selectedTreatment arrays
			// this.value.forEach((days, index) => {
			// const selectedDateTime = new Date(this.selectedDate).getTime();
			[14, 10, 7, 3, 1].forEach((days, index) => {
				const SELECTED_DATE_TIME = new Date(this.selectedDate).getTime();
				const REMINDER_DATE_TIME = SELECTED_DATE_TIME - days * 24 * 60 * 60 * 1000;
				const REMINDER_DATE = new Date(REMINDER_DATE_TIME);
				// Format reminder date
				let formattedDate = this.formatDate(REMINDER_DATE);
				let formattedDatemonth = formattedDate.split(" ")[0] + 1;
				let month = formattedDate.split(" ")[0]
				formattedDate = this.getOrdinalNumber(formattedDate.split(" ")[1])
				// Push formatted reminder date into allReminderDates array
				allReminderDates.push({
					id: index,
					days: days,
					formattedDate,
					formattedDatemonth,
					month
				});
			}
			);
			// Add next three days' reminders to allReminderDates
			for (let i = 1; i <= 3; i++) {
				const SELECTED_DATE_TIME = new Date(this.selectedDate).getTime();
				const NEXT_DATE = new Date(SELECTED_DATE_TIME + i * 24 * 60 * 60 * 1000);
				// Format next date
				let formattedDate = this.formatDate(NEXT_DATE);
				allReminderDates.push({
					id: `nextThreeDays-${i}`,
					formattedDate
				});
			}
			// Add selectedDate reminder to allReminderDates
			const SELECTED_DATE_FORMATTED = this.formatDate(
				new Date(this.selectedDate)
			);
			let formattedDatemonth = SELECTED_DATE_FORMATTED.split(" ")[0] + 1;
			let month = SELECTED_DATE_FORMATTED.split(" ")[0];
			allReminderDates.push({
				id: "selectedDate",
				days: 0,
				formattedDate: this.getOrdinalNumber(SELECTED_DATE_FORMATTED.split(" ")[1]),
				formattedDatemonth,
				month
			});
			// Sort allReminderDates by date
			allReminderDates.sort((a, b) => {
				const DATE_A = new Date(a.formattedDate);
				const DATE_B = new Date(b.formattedDate);
				return DATE_A.getTime() - DATE_B.getTime();
			});
			// Update formattedReminderDates with filtered reminder dates
			this.formattedReminderDates = allReminderDates.filter(
				(date) => date.days !== undefined
			);
			this.showDiv = true;
			this.checkedFourteen = this.value.includes(14);
			this.checkedTen = this.value.includes(10);
			this.checkedSeven = this.value.includes(7);
			this.checkedThree = this.treatValue.includes(3);
			this.checkedOne = this.treatValue.includes(1);
			this.saveTaskRecords(); // Save task records
			this.showAfterSaveContent = false;
			this.showBeforeSaveContent = false;
			this.content = true;
			this.closeDot = false;
			this.closingdot = true;
			this.cls = true;
			this.defaultClass = false;
		}
	}
	// Function to format date
	formatDate(date) {
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'short' });
		return `${month} ${day}`;
	}
	// Save task records to Salesforce
	saveTaskRecords() {
		let selectedDate = this.selectedDate;
		const SELECTED_REMINDERS_FILTERED = this.selectedReminders.filter(days => days === 14 && !this.disableFourteen ||
			days === 10 && !this.disableTen ||
			days === 7 && !this.disableSeven);
		const SELECTED_TREATMENT_FILTERED = this.selectedTreatment.filter(days => days === 3 && !this.disable3 ||
			days === 1 && !this.disable1);
		// Call Apex method to save reminder records
		REMINDER_DATES({
			selectedDate,
			selectedReminders: SELECTED_REMINDERS_FILTERED,
			selectedTreatment: SELECTED_TREATMENT_FILTERED
		})
			// Null data is checked and AuraHandledException is thrown from the Apex
			.then(() => {
				// Successful save
				this.showDiv = true;
				this.showAfterSaveContent = false;
			})
			.catch((error) => {
				// Error handling
				this.showToast(resources.ERROR_MESSAGE, error.message, resources.ERROR_VARIANT);
			})
			.finally(() => {
				this.showDiv = false;
			});
	}
	// Handler for clicking the 'Add to Calendar' button
	handleAddCalendarButtonClick() {
		// Set the visibility of the calendar modal to true
		this.isPartVisible = true;
		document.body.style.overflow = 'hidden';
	}
	// Handler to close the calendar modal
	closeModal() {
		this.isPartVisible = false;
		document.body.style.overflow = '';
	}
	// Open Google Calendar for adding reminders
	openGoogleCalendar() {
		// Check if Google Calendar URLs are available
		if (this.googleCalendarUrls && this.googleCalendarUrls.length > 0) {
			// Open each Google Calendar URL in a new tab
			for (let i = 0; i < this.googleCalendarUrls.length; i++) {
				window.open(this.googleCalendarUrls[i], "_blank");
			}
		}
	}
	// Open Outlook Calendar for adding reminders
	openOutlookCalendar() {
		// Check if Outlook Calendar URLs are available
		if (this.outlookCalendarUrls && this.outlookCalendarUrls.length > 0) {
			// Open each Outlook Calendar URL in a new tab
			for (let i = 0; i < this.outlookCalendarUrls.length; i++) {
				window.open(this.outlookCalendarUrls[i], "_blank");
			}
		}
	}
	// To show toast message when an error occurs.
	showToast(title, message, variant) {
		if (typeof window !== 'undefined') {
			const EVENT = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(EVENT);
		}
	}
}