//This component is used to Display Tasks based on the Action notification on clicking the Notification icon from the Dashboard.
//To Import the Libraries
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To Import the User Id
import ID from '@salesforce/user/Id';
//To import the Static resources
import NOTIFY_IMG from '@salesforce/resourceUrl/BI_PSPB_ArticleImg';
import NOTIFY_CHALLENGE_IMG from '@salesforce/resourceUrl/BI_PSPB_NotificationChallengesImg';
import NOTIFY_SYMPTOM_IMG from '@salesforce/resourceUrl/BI_PSPB_SymptomImg';
import NOTIFY_TREATMENT_IMG from '@salesforce/resourceUrl/BI_PSPB_ArticleImg';
import DELETE_TOAST_IMAGE from '@salesforce/resourceUrl/BI_PSP_ToastTickIcon';
import QUESTIONNAIRE_ONLY_IMAGE from '@salesforce/resourceUrl/BI_PSP_TreatmentImage';
//To import the Apex class
import UPDATE_DATE from '@salesforce/apex/BI_PSPB_ActionNotificationUpdateStatus.updateActionDateOfTreatment';
import ACTION_TASK from '@salesforce/apex/BI_PSPB_MessageCenterCtrl.getActionNotifyRecords';
import TASK_UPDATE from '@salesforce/apex/BI_PSPB_NotificationStatusUpdationCtrl.markTaskCompleted';
import QUESTION_STATUS_UPDATE from '@salesforce/apex/BI_PSPB_TaskQuestionStatusCompleted.markTaskQuestionCompleted';
import ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
//To import The custom labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import BI_PSPB_TREATMENT from '@salesforce/label/c.BI_PSPB_Treatment';
import BI_PSPB_PRESCRIPTION from '@salesforce/label/c.BI_PSPB_Prescription';
import BI_PSPB_PRESCRIPTION_REMINDER from '@salesforce/label/c.BI_PSPB_PrescriptionReminderValue';
import BI_PSPB_TREATMENT_REMINDER from '@salesforce/label/c.BI_PSPB_TreatmentReminder';
import BI_PSPB_MY_QUESTIONNAIRES from '@salesforce/label/c.BI_PSPB_MyQuestionnaires';
import DLQI_QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_AssessmentDlqi';
import PSS_QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_AssessmentPss';
import WPAI_QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_AssessmentWpai';
import QSQ_QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_Qsq';
import SYMPTOM from '@salesforce/label/c.BI_PSP_SymptomTrackerValue';
import BI_PSPB_ACTION_REQUIRED from '@salesforce/label/c.BI_PSPB_ActionRequiredValue';
import BI_PSPB_DATE_OF_TREATMENT from '@salesforce/label/c.BI_PSPB_DateOfTreatment';
// import BI_PSPB_PAST_DUE_DATE from '@salesforce/label/c.BI_PSPB_PastDueDate';
// import BI_PSPB_PAST_DUE_DATE_TWO from '@salesforce/label/c.BI_PSPB_PastDueDateTwo';
//import BI_PSPB_DAY_OF_TREATMENT from '@salesforce/label/c.statusDateOfTreatment';
import BI_PSPB_HOUR from '@salesforce/label/c.BI_PSPB_SeventyTwoHour';
import BI_PSPB_HR from '@salesforce/label/c.BI_PSPB_TwentyFourHours';
import BI_PSPB_SYMPTOM_TRACKER_MAIN from '@salesforce/label/c.BI_PSPB_SymptomTrackerMain';
import BI_PSPB_DLQI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl';
import BI_PSPB_PSS_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import BI_PSPB_WPAI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import BI_PSPB_QSQ_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import BI_PSPB_PERSONALIZE_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import {resources} from 'c/biPspbNotificationReminderResources';

export default class BiPspbNotificationActionForm extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @api
	@api messageFromParent = '';
	// Declaration of variables with @track
	selectedWhatId;
	allData = [];
	filteredData = [];
	taskSelectedId;
	showDeleteToastMsg = false;
	minDate;
	maxDate;
	selectedTaskCreatedDate;
	treatmentDate;
	showModal = false;
	noRecords = false;
	recordForAction;
	userId = ID;
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
	noRecordsForTime = false;
	isHoursComboboxDisabled = true;
	// Declaration of variables
	numberOfQuestions;
	contentImg = NOTIFY_IMG;
	letsPersonaliseImg = QUESTIONNAIRE_ONLY_IMAGE;
	symptomImg = NOTIFY_SYMPTOM_IMG;
	challengeImg = NOTIFY_CHALLENGE_IMG;
	treatmentImg = NOTIFY_TREATMENT_IMG;
	questionImg = resources.QUESTIONNAIRE_IMAGE;
	deleteToast = DELETE_TOAST_IMAGE;
	hoursOptions = [{ label: BI_PSPB_HR, value: BI_PSPB_HR }, { label: BI_PSPB_HOUR, value: BI_PSPB_HOUR }];

		connectedCallback() {
		try {
			this.initializeComponent();
		} catch (err) {
			this.showToast(resources.ERROR_MESSAGE, err.message, resources.ERROR_VARIANT);
		}
	}

	initializeComponent() {
		ENROLLE({ userId: this.userId })
			.then(result => {
				if (result && result[0].patientEnrolle) {
					this.accountName = result[0].patientEnrolle.Id;
					this.determineSiteUrlAndHistory();
					this.getbrandedaction(this.accountName);
				} else {
					this.showToast(resources.ERROR_MESSAGE, resources.NO_RECORDS, resources.ERROR_VARIANT);
				}
			})
			.catch(error => {
				this.showToast(resources.ERROR_MESSAGE, error.message, resources.ERROR_VARIANT);
			});
	}

	determineSiteUrlAndHistory() {
		let globalThis = window;
		let CURRENT_URL = globalThis.location?.href;
		const URL_OBJECT = new URL(CURRENT_URL);
		const PATH = URL_OBJECT.pathname;
		const PATH_COMPONENTS = PATH.split('/');
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
			[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);

		if (DESIRED_COMPONENT.toLowerCase() === BRANDED_URL.toLowerCase()) {
			this.urlq = BRANDED_SITE_URL;
			this.actionOptions = [{ label: 'All', value: 'All' }, 
			{label: BI_PSPB_TREATMENT_REMINDER, value: BI_PSPB_TREATMENT_REMINDER }, 
			{ label: SYMPTOM, value: SYMPTOM }, { label: BI_PSPB_MY_QUESTIONNAIRES, value: BI_PSPB_MY_QUESTIONNAIRES }, 
			{ label: BI_PSPB_PRESCRIPTION_REMINDER, value: BI_PSPB_PRESCRIPTION_REMINDER }];
		} else {
			this.urlq = UNASSIGNED_SITE_URL;
			this.actionOptions = [{ label: 'All', value: 'All' }, 
				{ label: SYMPTOM, value: SYMPTOM }, 
				{ label: BI_PSPB_MY_QUESTIONNAIRES, value: BI_PSPB_MY_QUESTIONNAIRES }];
		}
	}

	insertFunc() {
			QUESTION_STATUS_UPDATE({ enrolleeId: this.accountName })
					.then(result => {
						this.numberOfQuestions = result;
						return this.numberOfQuestions;
					})
					.catch(errors => {
						this.showToast(ERROR_MESSAGE, errors.message, ERROR_VARIANT);
					})
	}

	//To fetch the Branded Action Notification
	getbrandedaction(acc) {
		try {
			ACTION_TASK({ enroleeId: acc })
				.then(result => {
					// Null data is checked and AuraHandledException is thrown from the Apex
					if (result) {
						this.allData = result;
						this.showLoadMoreButton = result.length > 3;
						this.noRecords = result.length === 0;
						this.noRecordsForTime = false;
						this.recordForAction = result.length > 0;
						console.log('result',result);
						this.actionTask = result.map(obj => {
							const category = obj.BI_PSP_Category__c;
							const treatmentType = obj.BI_PSPB_Treatment_Type__c;
							console.log('treatmentType',obj.BI_PSPB_Treatment_Type__c);
	
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
							let dateoftreatmentyes = false;
							let sympimg = false;
							let treatimg = false;
							let yesbutton = false;
							let nobutton = false;
							let voilet = false;
							let green = false;
							let amber = false;
							let red = false;
	
							switch (category) {
								case SYMPTOM:
									submitbutton = true;
									sympimg = true;
									voilet = true;
									break;
								case QSQ_QUESTIONNAIRES:
									StartbuttonQsq = true;
									QuestionImgQsq = true;
									voilet = true;
									break;
								case PSS_QUESTIONNAIRES:
									StartbuttonPss = true;
									QuestionImgPss = true;
									voilet = true;
									break;
								case WPAI_QUESTIONNAIRES:
									StartbuttonWpai = true;
									QuestionImgWpai = true;
									voilet = true;
									break;
								case DLQI_QUESTIONNAIRES:
									StartbuttonDlqi = true;
									QuestionImgDlqi = true;
									voilet = true;
									break;
								case BI_PSPB_MY_QUESTIONNAIRES:
									StartbuttonLetPer = true;
									PersonaliseImg = true;
									voilet = true;
									break;
								case BI_PSPB_TREATMENT:
								case BI_PSPB_PRESCRIPTION:
								//case 'Date of Treatment':
									treatimg = true;
									yesbutton = true;
									nobutton = true;
									voilet = true;
									break;
								default:
									break;
							}
	
							switch (treatmentType) {
								case 'Day of Treatment':
									green = true;
									voilet = false;
									treatimg = true;
									dateoftreatmentyes = true;
									nobutton = true;
									break;
								case 'Past Due Date':
									amber = true;
									voilet = false;
									nobutton = true;
									yesbutton = true;
									treatimg = true;
									break;
								case 'Past Due Date2':
									red = true;
									voilet = false;
									treatimg = true;
									nobutton = true;
									yesbutton = true;
									break;
								default:
									break;
							}
	
							return {
								...obj,
								submitbutton,StartbuttonQsq,StartbuttonPss,StartbuttonWpai,
								StartbuttonDlqi,StartbuttonLetPer,QuestionImgWpai,QuestionImgDlqi,
								QuestionImgPss,QuestionImgQsq,PersonaliseImg,sympimg,dateoftreatmentyes,
								treatimg,yesbutton,nobutton,voilet,green,amber,red,
								FormattedDate: this.formatDate(obj.CreatedDate)
							};
						});
					}
				})
				.catch(errors => {
					this.showToast(ERROR_MESSAGE, errors.message, ERROR_VARIANT);
				});
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
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

	handleDateChange(event) {
		this.selectedDate = event.target.value;
	}

	//This function is used to save the date of treatment and create the treatment records
	handleSaveDate() {
			this.showModal = false;
			this.showDeleteToastMsg = true;
			this.handleToastTemplate();
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
	handleComplete() {
		try {
			UPDATE_DATE({recordId:this.taskSelectedId,actionValue:'Yes'})
			.then(() => {
				this.showModal = true;
			})
			.catch(errors => {
				this.showToast(ERROR_MESSAGE, errors.message, ERROR_VARIANT);
			})
			
		}
		catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}
	handleCompleteDateOfTreatment() {
		try {
			UPDATE_DATE({recordId:this.taskSelectedId,actionValue:'Yes'})
			.then(() => {
				// this.showModal = true;
			})
			.catch(errors => {
				this.showToast(ERROR_MESSAGE, errors.message, ERROR_VARIANT);
			})
			
		}
		catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	handleNotCompleted(){
		try {
			UPDATE_DATE({recordId:this.taskSelectedId,actionValue:'No'})
			.then(() => {
				this.showModal = true;
			})
			.catch(errors => {
				this.showToast(ERROR_MESSAGE, errors.message, ERROR_VARIANT);
			})
			
		}
		catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}
	//To get the onchange value in category type
	actioncat(event) {
		this.actionCategory = event.target.value;
		this.hoursValue = [];
		this.isHoursComboboxDisabled = true;
		this.hoursDisplay = false;
		let VALID_CATEGORIES = [];

		switch (this.actionCategory) {
			case 'All':
				this.getbrandedaction(this.accountName);
				break;
			case SYMPTOM:
				this.filterAndMap(this.allData, [SYMPTOM], this.mapSymptom);
				break;
			case BI_PSPB_TREATMENT_REMINDER:
				this.filterAndMap(this.allData, ['Date of Treatment'], this.mapTreatment);
				this.isHoursComboboxDisabled = false;
				this.hoursDisplay = true;
				break;
			case BI_PSPB_PRESCRIPTION_REMINDER:
				this.filterAndMap(this.allData, [BI_PSPB_PRESCRIPTION,BI_PSPB_TREATMENT], this.mapPrescription);
				break;
			case BI_PSPB_MY_QUESTIONNAIRES:
				VALID_CATEGORIES = ['My Questionnaires', 'PSS', 'QSQ', 'WPAI', 'DLQI'];
				this.filterAndMap(this.allData, VALID_CATEGORIES, this.mapQuestionnaires);
				break;
			default:
				break;
		}
	}
	filterAndMap(data, categories, mapFunction) {
		this.filteredData = data.filter(obj => categories.includes(obj.BI_PSP_Category__c));
	
		this.showLoadMoreButton = this.filteredData.length > 3;
		this.noRecords = this.filteredData.length === 0;
	
		this.actionTask = this.filteredData.map(mapFunction.bind(this));
	}

	mapSymptom(obj) {
		return {
			...obj,
			submitbutton: obj.BI_PSP_Category__c === SYMPTOM,
			sympimg: obj.BI_PSP_Category__c === SYMPTOM,
			voilet: obj.BI_PSP_Category__c === SYMPTOM,
			FormattedDate: this.formatDate(obj.CreatedDate)
		};
	}
	
	mapTreatment(obj) {
		return {
			...obj,
			treatimg: obj.BI_PSP_Category__c === 'Date of Treatment' || obj.BI_PSPB_Treatment_Type__c === 'Past Due Date' || 
			obj.BI_PSPB_Treatment_Type__c === 'Past Due Date2',
			nobutton: obj.BI_PSP_Category__c === 'Date of Treatment' || obj.BI_PSPB_Treatment_Type__c === 'Past Due Date' || 
			obj.BI_PSPB_Treatment_Type__c === 'Past Due Date2',
			// voilet: obj.BI_PSP_Category__c === BI_PSPB_TREATMENT && (
			// 	obj.BI_PSPB_Treatment_Type__c !== 'Day of Treatment' && 
			// 	obj.BI_PSPB_Treatment_Type__c !== 'Past Due Date' &&
			// 	obj.BI_PSPB_Treatment_Type__c !== 'Past Due Date2'
			// ),
			green: obj.BI_PSPB_Treatment_Type__c === 'Day of Treatment',
			dateoftreatmentyes: obj.BI_PSP_Category__c === 'Date of Treatment' && obj.BI_PSPB_Treatment_Type__c === 'Day of Treatment',
			yesbutton:
					obj.BI_PSPB_Treatment_Type__c === 'Past Due Date' || 
					obj.BI_PSPB_Treatment_Type__c === 'Past Due Date2',
			amber: obj.BI_PSPB_Treatment_Type__c === 'Past Due Date',
			red: obj.BI_PSPB_Treatment_Type__c === 'Past Due Date2',
			FormattedDate: this.formatDate(obj.CreatedDate)
		};		
		
	}
	
	mapPrescription(obj) {
		return {
			...obj,
			treatimg: obj.BI_PSP_Category__c === BI_PSPB_PRESCRIPTION || obj.BI_PSP_Category__c === BI_PSPB_TREATMENT,
			yesbutton: obj.BI_PSP_Category__c === BI_PSPB_PRESCRIPTION || obj.BI_PSP_Category__c === BI_PSPB_TREATMENT,
			nobutton: obj.BI_PSP_Category__c === BI_PSPB_PRESCRIPTION || obj.BI_PSP_Category__c === BI_PSPB_TREATMENT,
			voilet: obj.BI_PSP_Category__c === BI_PSPB_PRESCRIPTION || obj.BI_PSP_Category__c === BI_PSPB_TREATMENT,
			FormattedDate: this.formatDate(obj.CreatedDate)
		};
	}
	
	mapQuestionnaires(obj) {
		return {
			...obj,
			StartbuttonQsq: obj.BI_PSP_Category__c === 'QSQ',
			StartbuttonPss: obj.BI_PSP_Category__c === 'PSS',
			StartbuttonWpai: obj.BI_PSP_Category__c === 'WPAI',
			StartbuttonDlqi: obj.BI_PSP_Category__c === 'DLQI',
			StartbuttonLetPer:  obj.BI_PSP_Category__c === 'My Questionnaires',
			sympimg: obj.BI_PSP_Category__c === 'My Questionnaires',
			QuestionImgPss: obj.BI_PSP_Category__c === 'PSS' || obj.BI_PSP_Category__c === 'QSQ'
			|| obj.BI_PSP_Category__c === 'WPAI' || obj.BI_PSP_Category__c === 'DLQI',
			voilet: true,
			FormattedDate: this.formatDate(obj.CreatedDate)
		};
	}
	
	//this Function is used for Update the Symptoms Action records
	updatesymptomcompleted(symptomActiontask) {
		try {
			TASK_UPDATE({ taskId: symptomActiontask })
		}
		// Null data is checked and AuraHandledException is thrown from the Apex
		catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
		}
	}

	//Onclick function for symptomm reords
	clickSymptom(event) {
		this.symptomTaskId = event.target.dataset.id;
		this.updatesymptomcompleted(this.symptomTaskId);
		let globalThis = window;
		globalThis.location?.assign(this.urlq + BI_PSPB_SYMPTOM_TRACKER_MAIN);
	}
	//Onclick function for Questionnaires reords
	clickQuestionQsq() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + BI_PSPB_QSQ_QUESTIONNAIRE_URL);
	}
	clickQuestionPss() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + BI_PSPB_PSS_QUESTIONNAIRE_URL);
	}
	clickQuestionWpai() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + BI_PSPB_WPAI_QUESTIONNAIRE_URL);
	}
	clickQuestionDlqi() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + BI_PSPB_DLQI_QUESTIONNAIRE_URL);
	}
	clickLetPerQuestion() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + BI_PSPB_PERSONALIZE_QUESTIONNAIRE_URL);

	}

	//This ShowToast message is used for get error
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
	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	handleToastTemplate() {
		try {
			this.delay(6000).then(() => {
				this.showDeleteToastMsg = false;
				this.showDeleteToastDate = false;
			}).catch((error) => {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});
		} catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}

}