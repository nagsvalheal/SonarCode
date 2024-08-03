//This component is used to Display Tasks based on the Action notification on clicking the Notification icon from the Dashboard.
//To Import the Libraries
import { LightningElement, api } from 'lwc';
//To import the Apex class
import UPDATE_DATE from '@salesforce/apex/BI_PSPB_ActionNotificationUpdateStatus.updateActionDateOfTreatment';
import UPDATE_TASK from '@salesforce/apex/BI_PSPB_ActionNotificationUpdateStatus.updateActionTreatmentStatus';
import ACTION_TASK from '@salesforce/apex/BI_PSPB_MessageCenterCtrl.getActionNotifyRecords';
import TASK_UPDATE from '@salesforce/apex/BI_PSPB_NotificationStatusUpdationCtrl.markTaskCompleted';
import QUESTION_STATUS_UPDATE from '@salesforce/apex/BI_PSPB_TaskQuestionStatusCompleted.markTaskQuestionCompleted';
import ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
// To import site urls
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import {resources} from 'c/biPspbNotificationReminderResources';

export default class BiPspbNotificationActionForm extends LightningElement {
	// Declaration of variables
	@api messageFromParent = '';
	selectedWhatId;
	allData = [];
	filteredData = [];
	taskSelectedId;
	showDeleteToastMsg = false;
	maxDate;
	selectedTaskCreatedDate;
	treatmentDate;
	showModal = false;
	noRecords = false;
	recordForAction;
	userId = resources.ID;
	accountName;
	hoursDisplay = false;
	actionTask = [];
	displayCount = 3;
	showLoadMoreButton = false;
	hoursValue;
	selectedDate;
	showDeleteToastDate = false;
	responseValue;
	actionCategory;
	actionValue;
	symptomTaskId;
	dateOfTreatment = resources.DATE_OF_TREATMENT;
	noRecordsForTime = false;
	isHoursComboboxDisabled = true;
	numberOfQuestions;
	submitButton = resources.SUBMIT;
	heading = resources.ACTION_HEADING;
	noNotification = resources.NO_NOTIFICATIONS;
	yesButton = resources.YES_BUTTON;
	noButton = resources.NO_BUTTON;
	updateSymptoms = resources.UPDATE_SYMPTOMS_BUTTON;
	getStartButton = resources.GET_START_BUTTON;
	clickStartButton = resources.CLICK_START_BUTTON;
	clickToStart = resources.CLICK_TO_START;
	startButton = resources.START;
	enterDate = resources.ENTER_DATE;
	enterDateField = resources.ENTER_DATE_FIELD;
	noActionRequired = resources.NO_ACTION_REQUIRED;
	successToast = resources.SUCCESS_TOAST;
	successToastDate = resources.SUCCESS_TOAST_DATE;
	dateCapturedToast = resources.DATE_CAPTURED;
	contentImg = resources.TREATMENT_IMAGE;
	letsPersonaliseImg = resources.QUESTIONNAIRE_ONLY_IMAGE;
	symptomImg = resources.AVATAR_IMAGE;
	challengeImg = resources.CHALLENGES_IMG;
	treatmentImg = resources.TREATMENT_IMAGE;
	questionImg = resources.QUESTIONNAIRE_IMAGE;
	deleteToast = resources.TICK;
	hoursOptions = [{ label: resources.TWENTY_FOUR_HOURS, value: resources.TWENTY_FOUR_HOURS }, { label: resources.SEVENTY_TWO_HOURS, value: resources.SEVENTY_TWO_HOURS }];
	// Called when the component is inserted into the DOM
	connectedCallback() {
		try {
			this.initializeComponent();
			this.determineSiteUrlAndHistory();
			this.setMinMaxDates();
		} catch (err) {
			this.showToast(resources.ERROR_MESSAGE, err.message, resources.ERROR_VARIANT);
		}
	}
	// Initialize component by fetching enrollee data and action records
	initializeComponent() {
			ENROLLE({ userId: this.userId })
				.then(result => {
					if (result && result[0].patientEnrolle) {
						this.accountName = result[0].patientEnrolle.Id;
						this.insertFunc();
						this.getbrandedaction(this.accountName);
					}
				})
				.catch(() => {
					let globalThis=window;
					globalThis.location.href = resources.ERROR_PAGE;
					globalThis.sessionStorage.setItem('errorMessage', resources.ENROLLEE_NOT_FOUND);
				});
	}
	// To check for the completed action for questions
	insertFunc() {
			return QUESTION_STATUS_UPDATE({ enrolleeId: this.accountName })
				.then(result => {
					this.numberOfQuestions = result;
					return this.numberOfQuestions;
				})
				.catch(() => {
					let globalThis=window;
					globalThis.location.href = resources.ERROR_PAGE;
					globalThis.sessionStorage.setItem('errorMessage', resources.UPDATE_NOTIFICATION_ERROR);
					return null;
				});
	}	
	// To get site url type
	getSiteUrlAndType() {
		try{
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			const URL_OBJECT = new URL(CURRENT_URL);
			const PATH = URL_OBJECT.pathname;
			const PATH_COMPONENTS = PATH.split('/');
			const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
		
			if (DESIRED_COMPONENT?.toLowerCase() === BRANDED_URL.toLowerCase()) {
				return {type: 'branded' };
			}
			return { type: 'unassigned' };
		} catch {
			let globalThis=window;
			globalThis.location.href = resources.ERROR_PAGE;
			globalThis.sessionStorage.setItem('errorMessage', resources.URL_TYPE_ERROR);
			return { type: 'unknown' }
		}
	}
	// Determine the site URL
	determineSiteUrlAndHistory() {
		const { type } = this.getSiteUrlAndType();	
		if (type === 'branded') {
			this.urlq = resources.BRANDED_URL;
			this.actionOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.TREATMENT_REMINDERS, value: resources.TREATMENT_REMINDER },
				{ label: resources.SYMPTOM, value: resources.SYMPTOM },
				{ label: resources.MY_QUESTIONNAIRES, value: resources.MY_QUESTIONNAIRES },
				{ label: resources.PRESCRIPTION_OPTION, value: resources.PRESCRIPTION_REMINDER }
			];
		} else if (type === 'unassigned') {
			this.urlq = resources.UNASSIGNED_SITE_URL;
			this.actionOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.SYMPTOM, value: resources.SYMPTOM },
				{ label: resources.MY_QUESTIONNAIRES, value: resources.MY_QUESTIONNAIRES }
			];
		} else {
			let globalThis=window;
			globalThis.location.href = resources.ERROR_PAGE;
			globalThis.sessionStorage.setItem('errorMessage', resources.URL_TYPE_ERROR);
		}
	}
	//To fetch the Branded Action Notification
	getbrandedaction(acc) {
			ACTION_TASK({ enroleeId: acc })
				.then(result => {
					if (result) {
						this.allData = result;
						this.showLoadMoreButton = result.length > 3;
						if(result.length < 3){
							this.showLoadMoreButton = false;
						}
						this.noRecords = result.length === 0;
						this.noRecordsForTime = false;
						this.recordForAction = result.length > 0;
						this.actionTask = result.map(obj => {
							const category = obj.BI_PSP_Category__c;
							const treatmentType = obj.BI_PSPB_Treatment_Type__c;	
							let submitbutton = false;
							let StartbuttonQsq = false;
							let StartbuttonPss = false;
							let StartbuttonWpai = false;
							let StartbuttonDlqi = false;
							let StartbuttonLetPer = false;
							let QuestionImgWpai = false;
							let QuestionImgDlqi = false;
							let QuestionImgPss = false;
							let QuestionImgQsq = false;
							let PersonaliseImg = false;
							let yesbutton = false;
							let sympimg = false;
							let treatimg = false;
							let dateoftreatmentyes = false;
							let nobutton = false;
							let voilet = false;
							let green = false;
							let amber = false;
							let red = false;	
							switch (category) {
								case resources.SYMPTOM:
									submitbutton = true;
									sympimg = true;
									voilet = true;
									break;
								case resources.QSQ_QUESTIONNAIRES:
									StartbuttonQsq = true;
									QuestionImgQsq = true;
									voilet = true;
									break;
								case resources.PSS_QUESTIONNAIRES:
									StartbuttonPss = true;
									QuestionImgPss = true;
									voilet = true;
									break;
								case resources.WPAI_QUESTIONNAIRES:
									StartbuttonWpai = true;
									QuestionImgWpai = true;
									voilet = true;
									break;
								case resources.DLQI_QUESTIONNAIRES:
									StartbuttonDlqi = true;
									QuestionImgDlqi = true;
									voilet = true;
									break;
								case resources.MY_QUESTIONNAIRES:
									StartbuttonLetPer = true;
									PersonaliseImg = true;
									voilet = true;
									break;
								case resources.TREATMENT:
								case resources.PRESCRIPTION_LABEL:
									treatimg = true;
									yesbutton = true;
									nobutton = true;
									voilet = true;
									break;
								default:
									break;
							}	
							switch (treatmentType) {
								case resources.DAY_OF_TREATMENT:
									green = true;
									voilet = false;
									treatimg = true;
									yesbutton = true;
									nobutton = true;
									break;
								case resources.PAST_DUE_DATE:
									amber = true;
									voilet = false;
									nobutton = true;
									dateoftreatmentyes = true;
									treatimg = true;
									break;
								case resources.PAST_DUE_DATE_TWO:
									red = true;
									voilet = false;
									treatimg = true;
									nobutton = true;
									dateoftreatmentyes = true;
									break;
								default:
									break;
							}	
							return {
								...obj,
								submitbutton,StartbuttonQsq,StartbuttonPss,StartbuttonWpai,
								StartbuttonDlqi,StartbuttonLetPer,QuestionImgWpai,QuestionImgDlqi,
								QuestionImgPss,QuestionImgQsq,PersonaliseImg,sympimg,dateoftreatmentyes,
								treatimg,nobutton,voilet,green,amber,red,yesbutton,
								FormattedDate: this.formatDate(obj.CreatedDate)
							};
						});
					}
				})
				.catch(() => {
					let globalThis=window;
					globalThis.location.href = resources.ERROR_PAGE;
					globalThis.sessionStorage.setItem('errorMessage', resources.ERROR_FOR_ACTION);
				});
	}	
	// To display recent 3 records, on clicking Load More, shows all the records
	get displayedActionValue() {
		this.noRecordsForTime = false;
		return this.actionTask.slice(0, this.displayCount);
	}
	//This Function is used to load more notification
	loadMore() {
		this.displayCount = this.actionTask.length;
		this.showLoadMoreButton = false;
	}
	//This function is used for hide the modal in page
	hideModalBox() {
		this.showModal = false;
	}
	// To get the selected date
	handleDateChange(event) {
		this.selectedDate = event.target.value;
	}
	//This function is used to save the date of treatment and create the treatment records
	handleSaveDate() {
			this.showModal = false;
			this.showDeleteToastMsg = true;
			this.actionTask = this.actionTask.filter(obj => obj.Id !== this.taskSelectedId);
		}						
	// To display the Date in the short format
	formatDate(createdDate) {
		const DATE_OBJECT = new Date(createdDate);
		const YEAR = DATE_OBJECT.getFullYear().toString().slice(-2);
		const OPTIONS = { day: 'numeric', month: 'short' };
		const FORMATTED_DATE = DATE_OBJECT.toLocaleDateString('en-us', OPTIONS);
		return `${FORMATTED_DATE}, ${YEAR}`;
	}
	//This function is used for close the popup
	closetoastmsg() {
		this.showDeleteToastMsg = false;
	}
	//This function is used for close the date popup
	closetoastmsgdate() {
		this.showDeleteToastDate = false;
	}
	//This function is used for Submit the date of treatment
	handleComplete(event) {
			this.taskSelectedId = event.currentTarget.dataset.id;
			UPDATE_DATE({recordId:this.taskSelectedId,actionValue:resources.YES})
			.then(() => {
				this.showModal = true;
			})
			.catch(() => {
				let globalThis=window;
				globalThis.location.href = resources.ERROR_PAGE;
				globalThis.sessionStorage.setItem('errorMessage', resources.UPDATE_NOTIFICATION_ERROR);
			})
	}
	// To update the task to completed
	handleCompleteDateOfTreatment(event) {
			this.taskSelectedId = event.currentTarget.dataset.taskid;
			UPDATE_TASK({recordId:this.taskSelectedId,actionValue:resources.YES})
			.then(() => {
				this.showDeleteToastMsg = true;
			})
			.catch(() => {
				let globalThis=window;
				globalThis.location.href = resources.ERROR_PAGE;
				globalThis.sessionStorage.setItem('errorMessage', resources.UPDATE_NOTIFICATION_ERROR);
			})
	}
	// To update task to not completed
	handleNotCompleted(event){
			this.taskSelectedId = event.currentTarget.dataset.id;
			UPDATE_TASK({recordId:this.taskSelectedId,actionValue:resources.No})
			.then(() => {
				this.actionTask = this.actionTask.filter(obj => obj.Id !== this.taskSelectedId);
				this.showDeleteToastMsg = true;
			})
			.catch(() => {
				let globalThis=window;
				globalThis.location.href = resources.ERROR_PAGE;
				globalThis.sessionStorage.setItem('errorMessage', resources.UPDATE_NOTIFICATION_ERROR);
			})
	}
	//To get the onchange value in category type
	actioncat(event) {
		this.actionCategory = event.target.value;
		this.hoursValue = [];
		this.isHoursComboboxDisabled = true;
		this.hoursDisplay = false;
		let VALID_CATEGORIES = [];
		switch (this.actionCategory) {
			case resources.ALL:
				this.getbrandedaction(this.accountName);
				break;
			case resources.SYMPTOM:
				this.filterAndMap(this.allData, [resources.SYMPTOM], this.mapSymptom);
				break;
			case resources.TREATMENT_REMINDER:
				this.filterAndMap(this.allData, [resources.DATE_OF_TREATMENT], this.mapTreatment);
				this.isHoursComboboxDisabled = false;
				this.hoursDisplay = true;
				break;
			case resources.PRESCRIPTION_REMINDER:
				this.filterAndMap(this.allData, [resources.PRESCRIPTION_LABEL,resources.TREATMENT], this.mapPrescription);
				break;
			case resources.MY_QUESTIONNAIRES:
				VALID_CATEGORIES = [resources.MY_QUESTIONNAIRES, resources.PSS_QUESTIONNAIRES, resources.QSQ_QUESTIONNAIRES, resources.WPAI_QUESTIONNAIRES, resources.DLQI_QUESTIONNAIRES];
				this.filterAndMap(this.allData, VALID_CATEGORIES, this.mapQuestionnaires);
				break;
			default:
				break;
		}
	}
	// Filter all action notifications
	filterAndMap(data, categories, mapFunction) {
		this.filteredData = data.filter(obj => categories.includes(obj.BI_PSP_Category__c));
		this.showLoadMoreButton = this.filteredData.length > 3;
		this.noRecords = this.filteredData.length === 0;	
		this.actionTask = this.filteredData.map(mapFunction.bind(this));
	}
	// Mapping symptom records
	mapSymptom(obj) {
		return {
			...obj,
			submitbutton: obj.BI_PSP_Category__c === resources.SYMPTOM,
			sympimg: obj.BI_PSP_Category__c === resources.SYMPTOM,
			voilet: obj.BI_PSP_Category__c === resources.SYMPTOM,
			FormattedDate: this.formatDate(obj.CreatedDate)
		};
	}
	// Mapping treatment records
	mapTreatment(obj) {
		return {
			...obj,
			treatimg: obj.BI_PSP_Category__c === resources.DATE_OF_TREATMENT || obj.BI_PSPB_Treatment_Type__c === resources.PAST_DUE_DATE || 
				obj.BI_PSPB_Treatment_Type__c === resources.PAST_DUE_DATE_TWO,
			nobutton: obj.BI_PSP_Category__c === resources.DATE_OF_TREATMENT || obj.BI_PSPB_Treatment_Type__c === resources.PAST_DUE_DATE || 
				obj.BI_PSPB_Treatment_Type__c === resources.PAST_DUE_DATE_TWO,
			green: obj.BI_PSPB_Treatment_Type__c === resources.DAY_OF_TREATMENT,
			yesbutton: obj.BI_PSP_Category__c === resources.DATE_OF_TREATMENT && obj.BI_PSPB_Treatment_Type__c === resources.DAY_OF_TREATMENT,
			dateoftreatmentyes:
					obj.BI_PSPB_Treatment_Type__c === resources.PAST_DUE_DATE || 
					obj.BI_PSPB_Treatment_Type__c === resources.PAST_DUE_DATE_TWO,
			amber: obj.BI_PSPB_Treatment_Type__c === resources.PAST_DUE_DATE,
			red: obj.BI_PSPB_Treatment_Type__c === resources.PAST_DUE_DATE_TWO,
			FormattedDate: this.formatDate(obj.CreatedDate)
		};		
	}
	// Mapping prescription records
	mapPrescription(obj) {
		return {
			...obj,
			treatimg: obj.BI_PSP_Category__c === resources.PRESCRIPTION_LABEL || obj.BI_PSP_Category__c === resources.TREATMENT,
			yesbutton: obj.BI_PSP_Category__c === resources.PRESCRIPTION_LABEL || obj.BI_PSP_Category__c === resources.TREATMENT,
			nobutton: obj.BI_PSP_Category__c === resources.PRESCRIPTION_LABEL || obj.BI_PSP_Category__c === resources.TREATMENT,
			voilet: obj.BI_PSP_Category__c === resources.PRESCRIPTION_LABEL || obj.BI_PSP_Category__c === resources.TREATMENT,
			FormattedDate: this.formatDate(obj.CreatedDate)
		};
	}
	// Mapping questionnaires records
	mapQuestionnaires(obj) {
		return {
			...obj,
			StartbuttonQsq: obj.BI_PSP_Category__c === resources.QSQ_QUESTIONNAIRES,
			StartbuttonPss: obj.BI_PSP_Category__c === resources.PSS_QUESTIONNAIRES,
			StartbuttonWpai: obj.BI_PSP_Category__c === resources.WPAI_QUESTIONNAIRES,
			StartbuttonDlqi: obj.BI_PSP_Category__c === resources.DLQI_QUESTIONNAIRES,
			StartbuttonLetPer:  obj.BI_PSP_Category__c === resources.MY_QUESTIONNAIRES,
			sympimg: obj.BI_PSP_Category__c === resources.MY_QUESTIONNAIRES,
			QuestionImgPss: obj.BI_PSP_Category__c === resources.PSS_QUESTIONNAIRES || obj.BI_PSP_Category__c === resources.QSQ_QUESTIONNAIRES
			|| obj.BI_PSP_Category__c === resources.WPAI_QUESTIONNAIRES || obj.BI_PSP_Category__c === resources.DLQI_QUESTIONNAIRES,
			voilet: true,
			FormattedDate: this.formatDate(obj.CreatedDate)
		};
	}	
	//this Function is used for Update the Symptoms Action records
	updatesymptomcompleted(symptomActiontask) {
		try {
			TASK_UPDATE({ taskId: symptomActiontask })
		}
		catch {
			let globalThis=window;
			globalThis.location.href = resources.ERROR_PAGE;
			globalThis.sessionStorage.setItem('errorMessage', resources.UPDATE_NOTIFICATION_ERROR);
		}
	}
	// Navigate to symptom page
	clickSymptom(event) {
		this.symptomTaskId = event.target.dataset.id;
		this.updatesymptomcompleted(this.symptomTaskId);
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.SYMPTOM_TRACKER_MAIN);
	}
	// Navigate to QSQ page
	clickQuestionQsq() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.QSQ_QUESTIONNAIRE_URL);
	}
	// Navigate to PSS page
	clickQuestionPss() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.PSS_QUESTIONNAIRE_URL);
	}
	// Navigate to WPAI page
	clickQuestionWpai() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.WPAI_QUESTIONNAIRE_URL);
	}
	// Navigate to DLQI page
	clickQuestionDlqi() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.DLQI_QUESTIONNAIRE_URL);
	}
	// Navigate to Lets personalise page
	clickLetPerQuestion() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.PERSONALIZE_QUESTIONNAIRE_URL);
	}
	// To set the date value to enter
	setMinMaxDates() {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        this.maxDate = todayFormatted;
    }
}