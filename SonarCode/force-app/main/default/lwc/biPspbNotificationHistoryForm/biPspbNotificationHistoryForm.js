//This component is used to Display the Read,Complete,Expired notification based on  both General and Action Notification
//To import the Libraries
import { LightningElement} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import the Apex class
import HISTORY_TASK from '@salesforce/apex/BI_PSPB_MessageCenterCtrl.getHistoryNotifyRecords';
import ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
//To import the Custom labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import {resources} from 'c/biPspbNotificationReminderResources';
export default class BiPspbNotificationHistoryForm extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables
	notificationOptions = [];
	accountName;
	userId = resources.ID;
	hasNoRecords = true;
	historyRecords = [];
	history = [];
	recordsToDisplay = 6;
	showLoadMoreButton = false;
	typeOfNotification;
	typePlaceHolder = resources.TYPE_PLACEHOLDER;
	statusPlaceHolder = resources.STATUS_PLACEHOLDER;
	categoryPlaceHolder = resources.CATEGORY_PLACEHOLDER;
	categoryType;
	historyHeading = resources.HISTORY_HEADING;
	noNotifications = resources.NO_NOTIFICATIONS;
	loadMoreButton = resources.LOAD_MORE;
	disableCategory = true;
	disableStatus = true;
	selectedContentCategory = resources.ALL;
	// Declaration of variables
	contentImg = resources.NOTIFY_IMG;
	dotImg = resources.DOT_IMG;
	symptomImg = resources.SYMTOM_IMG;
	challengeImg = resources.CHALLENGES_IMG;
	treatmentImg = resources.TREATMENT_IMG;
	avatarImg = resources.AVATAR_IMG;
	chatterImg = resources.COMMUNITY_IMG;
	questionnaireImg = resources.QUESTIONNAIRE_IMAGE;
	notifyTypeOptions = [
		{ label: resources.ALL, value: resources.ALL },
		{ label: resources.GENERAL_NOTIFICATION, value: resources.GENERAL },
		{ label: resources.ACTION_REQUIRED, value: resources.ACTION }
	];
	statusOptions = [
		{ label: resources.ALL, value: resources.ALL },
		{ label: resources.COMPLETED, value: resources.COMPLETED },
		{ label: resources.NOT_COMPLETED, value: resources.NOT_COMPLETED },
		{
			label: resources.STATUS_EXPIRED,
			value: resources.STATUS_EXPIRED
		},
		{ label: resources.READ, value: resources.READ }
	];
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
					this.historyAllRecords(this.accountName);
				} else {
					this.showToast(resources.ERROR_MESSAGE, resources.NO_RECORDS, resources.ERROR_VARIANT);
				}
			})
			.catch(error => {
				this.showToast(resources.ERROR_MESSAGE, error.message, resources.ERROR_VARIANT);
			});
	}
	
	determineSiteUrlAndHistory() {
		const { siteUrl} = this.getSiteUrlAndType();
		this.urlq = siteUrl;
	}
	
	getSiteUrlAndType() {
		let globalThis = window;
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
	}
	
	// To display recent 3 records, on clicking Load More, shows all the records
	get displayedHistoryValue() {
		return this.historyRecords.slice(0, this.recordsToDisplay);
	}
	//This Function is used to load more notification
	loadMore() {
		this.recordsToDisplay = this.historyRecords.length;
		this.showLoadMoreButton = false;
	}
	// To display the Date in the short format
	formatDate(createdDate) {
		const DATE_OBJECT = new Date(createdDate);
		const YEAR = DATE_OBJECT.getFullYear().toString().slice(-2);
		const OPTIONS = { day: 'numeric', month: 'short' };
		const FORMATTED_DATE = DATE_OBJECT.toLocaleDateString('en-us', OPTIONS);
		return `${FORMATTED_DATE}, ${YEAR}`;
	}

	handletypeChange(event) {
		this.categoryType = [];
		this.typeOfStatus = [];
		this.typeOfNotification = event.target.value;
		this.disableCategory = false;
		this.disableStatus = true;
		
		if (this.typeOfNotification === resources.GENERAL) {
			this.setGeneralOptions();
			this.handleGeneralCategoryChange(resources.ALL);
		} else if (this.typeOfNotification === resources.ACTION) {
			this.setActionOptions();
			this.handleActionCategoryChange(resources.ALL);
		} else if (this.typeOfNotification === resources.ALL) {
			this.historyAllRecords(this.accountName);
			this.disableCategory = true;
		}
	}
	
	setGeneralOptions() {
		const { siteUrl, type } = this.getSiteUrlAndType();
		this.urlq = siteUrl;
	
		if (type === 'branded') {
			this.notificationOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.CHALLENGES, value: resources.CHALLENGES },
				{ label: resources.SYMPTOM, value: resources.SYMPTOM },
				{ label: resources.NEW_CONTENT, value: resources.NEW_CONTENT },
				{ label: resources.COMMUNITY, value: resources.COMMUNITY },
				{ label: resources.TREATMENT_VIDEO, value: resources.TREATMENT_VIDEO }
			];
			this.statusOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.STATUS_EXPIRED, value: resources.STATUS_EXPIRED },
				{ label: resources.READ, value: resources.READ }
			];
		} else {
			this.notificationOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.CHALLENGES, value: resources.CHALLENGES },
				{ label: resources.SYMPTOM, value: resources.SYMPTOM },
				{ label: resources.NEW_CONTENT, value: resources.NEW_CONTENT },
				{ label: resources.COMMUNITY, value: resources.COMMUNITY },
				{ label: resources.TREATMENT_VIDEO, value: resources.TREATMENT_VIDEO }
			];
			this.statusOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.STATUS_EXPIRED, value: resources.STATUS_EXPIRED },
				{ label: resources.READ, value: resources.READ }
			];
		}
	}
	
	setActionOptions() {
		const { siteUrl, type } = this.getSiteUrlAndType();
		this.urlq = siteUrl;
	
		if (type === 'branded') {
			this.notificationOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.SYMPTOM, value: resources.SYMPTOM },
				{ label: resources.TREATMENT_REMINDERS, value: resources.TREATMENT },
				{ label: resources.MY_QUESTIONNAIRES, value: resources.MY_QUESTIONNAIRES },
				{ label: resources.PRESCRIPTION_REMINDER, value: resources.PRESCRIPTION_LABEL }
			];
			this.statusOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.COMPLETED, value: resources.COMPLETED },
				{ label: resources.STATUS_EXPIRED, value: resources.STATUS_EXPIRED }
			];
		} else {
			this.notificationOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.SYMPTOM, value: resources.SYMPTOM },
				{ label: resources.MY_QUESTIONNAIRES, value: resources.MY_QUESTIONNAIRES },
				{ label: resources.PRESCRIPTION_REMINDER, value: resources.PRESCRIPTION_LABEL }
			];
			this.statusOptions = [
				{ label: resources.ALL, value: resources.ALL },
				{ label: resources.COMPLETED, value: resources.COMPLETED },
				{ label: resources.STATUS_EXPIRED, value: resources.STATUS_EXPIRED }
			];
		}
	}

	historyAllRecords(enrolleeId){
		HISTORY_TASK({ enroleeId: enrolleeId})
				.then((result) => {
					if (result) {
						if (result && result.length > 6) {
							this.showLoadMoreButton = true;
						}
						else {
							this.showLoadMoreButton = false;
						}
						if (result && result.length > 0) {
							this.hasNoRecords = false;
						}
						else {
							this.hasNoRecords = true;
						}

						this.historyRecords = result.map((obj) => ({
							...obj,
							sympimg: obj.BI_PSP_Category__c === resources.SYMPTOM,
							quesImg: obj.BI_PSP_Category__c === resources.MY_QUESTIONNAIRES,
							pssImg: obj.BI_PSP_Category__c === resources.PSS_QUESTIONNAIRES,
							qsqImg: obj.BI_PSP_Category__c === resources.QSQ_QUESTIONNAIRES,
							wpaiImg: obj.BI_PSP_Category__c === resources.WPAI_QUESTIONNAIRES,
							dlqiImg: obj.BI_PSP_Category__c === resources.DLQI_QUESTIONNAIRES,
							contentsimg: obj.BI_PSP_Category__c === resources.NEW_CONTENT,
							treatimg:
							obj.BI_PSP_Category__c === resources.TREATMENT ||
							obj.BI_PSP_Category__c === resources.TREATMENT_VIDEO ||
							obj.BI_PSP_Category__c === resources.PRESCRIPTION,
							challimg: obj.BI_PSP_Category__c === resources.CHALLENGES,
							chatterImg: obj.BI_PSP_Category__c === resources.COMMUNITY,
							FormattedDate: this.formatDate(obj.CreatedDate)
						}));
						if(this.historyRecords.length < 6){
							this.showLoadMoreButton = false;
						}
					}
				})
				.catch((errors) => {
					this.showToast(resources.ERROR_MESSAGE, errors.message, resources.ERROR_VARIANT);
				});
	}
	handleCategoryChange(event) {
		this.categoryType = event.target.value;
		this.typeOfStatus = [];
		this.disableStatus = false;
		if (this.typeOfNotification === resources.GENERAL) {
			this.handleGeneralCategoryChange(this.categoryType);
		} else if (this.typeOfNotification === resources.ACTION) {
			this.handleActionCategoryChange(this.categoryType);
		}
	}

	handleGeneralCategoryChange(categoryType) {
		// Define the filter criteria and mapping properties based on the category type
		const criteria = this.getCategoryCriteria(categoryType);
		// Call the general function to fetch and process the history data
		this.fetchAndProcessHistoryData(criteria);
	}
	
	getCategoryCriteria(categoryType) {
		switch (categoryType) {
			case resources.ALL:
				this.disableStatus = true;
				return { 
					type: resources.GENERAL, 
					category: null, 
					mapProps: {
						sympimg: resources.SYMPTOM,
						contentsimg: resources.NEW_CONTENT,
						treatimg: resources.TREATMENT_VIDEO,
						challimg: resources.CHALLENGES,
						chatterImg: resources.COMMUNITY
					}
				};
			case resources.SYMPTOM:
				return { 
					type: resources.GENERAL, 
					category: resources.SYMPTOM, 
					mapProps: { sympimg: resources.SYMPTOM } 
				};
			case resources.NEW_CONTENT:
				return { 
					type: resources.GENERAL, 
					category: resources.NEW_CONTENT, 
					mapProps: { contentsimg: resources.NEW_CONTENT } 
				};
			case resources.COMMUNITY:
				return { 
					type: resources.GENERAL, 
					category: resources.COMMUNITY, 
					mapProps: { chatterImg: resources.COMMUNITY } 
				};
			case resources.CHALLENGES:
				return { 
					type: resources.GENERAL, 
					category: resources.CHALLENGES, 
					mapProps: { challimg: resources.CHALLENGES } 
				};
			case resources.TREATMENT_VIDEO:
				return { 
					type: resources.GENERAL, 
					category: resources.TREATMENT_VIDEO, 
					mapProps: { treatimg: resources.TREATMENT_VIDEO } 
				};
			default:
				return { 
					type: resources.GENERAL_NOTIFICATION, 
					category: null, 
					mapProps: {} 
				};
		}
	}
	
	fetchAndProcessHistoryData(criteria) {
		this.categoryType = criteria.category;
		HISTORY_TASK({ enroleeId: this.accountName })
			.then((result) => {
				// Filter and map the result based on the criteria
				this.historyRecords = result
					.filter(notification => 
						(!criteria.category || notification.BI_PSP_Category__c === criteria.category) &&
						notification.BI_PSP_Notification_Type__c === criteria.type
					)
					.map(notification => ({
						...notification,
						...this.getMappingProperties(notification, criteria.mapProps),
						FormattedDate: this.formatDate(notification.CreatedDate)
					}));
	
				this.showLoadMoreButton = this.historyRecords.length >= 6;
			})
			.catch((errors) => {
				this.showToast(resources.ERROR_MESSAGE, errors.message, resources.ERROR_VARIANT);
			});
	}
	
	getMappingProperties(notification, mapProps) {
		return Object.keys(mapProps).reduce((acc, key) => {
			acc[key] = notification.BI_PSP_Category__c === mapProps[key];
			return acc;
		}, {});
	}
	handleActionCategoryChange(categoryType) {
		this.disableStatus = false;
		// Define the filter criteria and mapping properties based on the category type
		const criteria = this.getActionCategoryCriteria(categoryType);
		// Call the action function to fetch and process the history data
		this.fetchAndProcessHistoryAction(criteria);
	}
	
	getActionCategoryCriteria(categoryType) {
		switch (categoryType) {
			case resources.ALL:
				this.disableStatus = true;
				return { 
					type: resources.ACTION, 
					category: null, 
					mapProps: {
						sympimg: resources.SYMPTOM,
						contentsimg: resources.NEW_CONTENT,
						treatimg: [resources.TREATMENT , resources.PRESCRIPTION],
						pssImg: [resources.MY_QUESTIONNAIRES, resources.PSS, resources.QSQ, resources.WPAI, resources.DLQI]
					}
				};
			case resources.SYMPTOM:
				return { 
					type: resources.ACTION,
					category: resources.SYMPTOM,
					mapProps: { sympimg: resources.SYMPTOM } 
				};
			case resources.TREATMENT:
				return { 
					type: resources.ACTION, 
					category: resources.TREATMENT, 
					mapProps: { treatimg: resources.TREATMENT } 
				};
			case resources.PRESCRIPTION_LABEL:
				return { 
					type: resources.ACTION,
					category: resources.PRESCRIPTION_LABEL,
					mapProps: { treatimg: resources.PRESCRIPTION }
				};
			case resources.MY_QUESTIONNAIRES:
				return { 
					type: resources.ACTION, 
					category: [resources.MY_QUESTIONNAIRES, resources.PSS, resources.QSQ, resources.WPAI, resources.DLQI], 
					mapProps: { pssImg: [resources.MY_QUESTIONNAIRES, resources.PSS, resources.QSQ, resources.WPAI, resources.DLQI] }
				};
			default:
				return { 
					type: resources.ACTION, 
					category: null, 
					mapProps: {} 
				};
		}
	}
	
	fetchAndProcessHistoryAction(criteria) {
		this.categoryType = criteria.category;
		HISTORY_TASK({ enroleeId: this.accountName })
			.then((result) => {
				this.historyRecords = result
					.filter(notification => 
						(!criteria.category || 
							(Array.isArray(criteria.category) 
								? criteria.category.includes(notification.BI_PSP_Category__c)
								: notification.BI_PSP_Category__c === criteria.category)) &&
						notification.BI_PSP_Notification_Type__c === criteria.type
					)
					.map(notification => ({
						...notification,
						...this.getMappingPropertiesAction(notification, criteria.mapProps),
						FormattedDate: this.formatDate(notification.CreatedDate)
					}));
				this.showLoadMoreButton = this.historyRecords.length >= 6;
			})
			.catch((errors) => {
				this.showToast(resources.ERROR_MESSAGE, errors.message, resources.ERROR_VARIANT);
			});
	}
	
	getMappingPropertiesAction(notification, mapProps) {
		return Object.keys(mapProps).reduce((acc, key) => {
			if (Array.isArray(mapProps[key])) {
				acc[key] = mapProps[key].includes(notification.BI_PSP_Category__c);
			} else {
				acc[key] = notification.BI_PSP_Category__c === mapProps[key];
			}
			return acc;
		}, {});
	}
	
	handleStatusValueChange(event) {
		this.typeOfStatus = event.target.value;
		this.handleStatusChange(this.typeOfStatus, this.categoryType, this.typeOfNotification);
		
	}
	handleGeneralStatus(status,category,notification){
		switch (status) {
			case resources.ALL:
				this.selectedContentCategory = resources.ALL;
				this.handleStatusChange(status,category,notification);
				break;
			case resources.READ:
				this.handleStatusChange(status,category,notification);
				this.selectedContentCategory = resources.READ;
				break;
			case resources.STATUS_EXPIRED:
				this.handleStatusChange(status,category,notification);
				this.selectedContentCategory = resources.STATUS_EXPIRED;
				break;
			default:
				break;
		}
	}
	handleActionStatus(status,category,notification){
		switch (status) {
			case resources.ALL:
				this.selectedContentCategory = resources.ALL;
				this.handleStatusChange(status,category,notification);
				break;
			case resources.COMPLETED:
				this.handleStatusChange(status,category,notification);
				this.selectedContentCategory = resources.COMPLETED;
				break;
			case resources.STATUS_EXPIRED:
				this.handleStatusChange(status,category,notification);
				this.selectedContentCategory = resources.STATUS_EXPIRED;
				break;
			default:
				break;
		}
	}
	handleStatusChange(statusValue, categoryType, notificationType) {
		switch (statusValue) {
			case resources.ALL:
				this.selectedContentCategory = resources.ALL;
				break;
			case resources.READ:
				this.selectedContentCategory = resources.READ;
				break;
			case resources.STATUS_EXPIRED:
				this.selectedContentCategory = resources.STATUS_EXPIRED;
				break;
			case resources.COMPLETED:
				this.selectedContentCategory = resources.COMPLETED;
				break;
			default:
				break;
		}
		// Define the filter criteria and mapping properties based on the category type
		if (notificationType === resources.GENERAL) {
			const criteria = this.getHistoryStatusGeneral(statusValue, categoryType);
			this.fetchAndProcessStatusHistory(criteria);
		} else if (notificationType === resources.ACTION) {
			const criteria = this.getHistoryStatusAction(statusValue, categoryType);
			this.fetchAndProcessStatusHistory(criteria);
		}
	}
	

	getHistoryStatusGeneral(statusValue, categoryType) {
		switch (statusValue) {
			case resources.ALL:
				return {
					type: resources.GENERAL,
					status: resources.ALL, 
					category: categoryType, 
					mapProps: {
						sympimg: resources.SYMPTOM,
						contentsimg: resources.NEW_CONTENT,
						treatimg: resources.TREATMENT_VIDEO,
						challimg: resources.CHALLENGES,
						chatterImg: resources.COMMUNITY
					}
				};
			case resources.STATUS_EXPIRED:
			case resources.READ:
				return {
					type: resources.GENERAL,
					status: statusValue,
					category: categoryType,
					mapProps: {
						sympimg: resources.SYMPTOM,
						contentsimg: resources.NEW_CONTENT,
						treatimg: resources.TREATMENT_VIDEO,
						challimg: resources.CHALLENGES,
						chatterImg: resources.COMMUNITY
					}
				};
			default:
				return {
					type: resources.GENERAL,
					category: null,
					status: null,
					mapProps: {}
				};
		}
	}
	
	getHistoryStatusAction(statusValue, categoryType) {
		switch (statusValue) {
			case resources.ALL:
				return {
					type: resources.ACTION,
					status: resources.ALL, 
					category: categoryType, 
					mapProps: {
						sympimg: resources.SYMPTOM,
						contentsimg: resources.NEW_CONTENT,
						treatimg: [resources.TREATMENT, resources.PRESCRIPTION],
						pssImg: [resources.MY_QUESTIONNAIRES, resources.PSS, resources.QSQ, resources.WPAI, resources.DLQI]
					}
				};
			case resources.STATUS_EXPIRED:
			case resources.COMPLETED:
				return {
					type: resources.ACTION,
					status: statusValue,
					category: categoryType,
					mapProps: {
						sympimg: resources.SYMPTOM,
						contentsimg: resources.NEW_CONTENT,
						treatimg: [resources.TREATMENT, resources.PRESCRIPTION],
						pssImg: [resources.MY_QUESTIONNAIRES, resources.PSS, resources.QSQ, resources.WPAI, resources.DLQI]
					}
				};
			default:
				return {
					type: resources.ACTION,
					category: null,
					status: null,
					mapProps: {}
				};
		}
	}
	
	fetchAndProcessStatusHistory(criteria) {
	
		HISTORY_TASK({ enroleeId: this.accountName })
			.then((result) => {
				this.historyRecords = result.filter(notification => {
					const matchesCategory = !criteria.category || 
						(Array.isArray(criteria.category)
							? criteria.category.includes(notification.BI_PSP_Category__c)
							: notification.BI_PSP_Category__c === criteria.category);
	
					const matchesStatus = criteria.status === resources.ALL || notification.Status === criteria.status;
	
					const matchesType = notification.BI_PSP_Notification_Type__c === criteria.type;
	
					return matchesCategory && matchesStatus && matchesType;
				})
				.map(notification => ({
					...notification,
					...this.getMappingPropertiesHistory(notification, criteria.mapProps),
					FormattedDate: this.formatDate(notification.CreatedDate)
				}));
	
				this.showLoadMoreButton = this.historyRecords.length >= 6;
				this.hasNoRecords = this.historyRecords.length === 0;
			})
			.catch((errors) => {
				this.showToast(resources.ERROR_MESSAGE, errors.message, resources.ERROR_VARIANT);
			});
	}	
	
	getMappingPropertiesHistory(notification, mapProps) {
		return {
			sympimg: notification.BI_PSP_Category__c === mapProps.sympimg,
			contentsimg: notification.BI_PSP_Category__c === mapProps.contentsimg,
			treatimg: Array.isArray(mapProps.treatimg) 
				? mapProps.treatimg.includes(notification.BI_PSP_Category__c) 
				: notification.BI_PSP_Category__c === mapProps.treatimg,
			challimg: notification.BI_PSP_Category__c === mapProps.challimg,
			chatterImg: notification.BI_PSP_Category__c === mapProps.chatterImg,
			pssImg: Array.isArray(mapProps.pssImg) 
				? mapProps.pssImg.includes(notification.BI_PSP_Category__c) 
				: notification.BI_PSP_Category__c === mapProps.pssImg
		};
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
}