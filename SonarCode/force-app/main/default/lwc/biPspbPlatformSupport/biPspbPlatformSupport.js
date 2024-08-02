// This LWC is used to create case record for Type - PSP Platform
// To import Libraries
import { LightningElement,api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import { NavigationMixin } from 'lightning/navigation';
// To import Apex Classes
import INSERT_UPDATE_LEAD_CONSENT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.createCase';
import UPDATE_CASE from '@salesforce/apex/BI_PSPB_SupportCenterCtrl.updateCase';
import UPDATE_DRAFT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.updateDraft';
import CASE_DRAFT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.caseDraft';
import CASE_RECORDS_GET from '@salesforce/apex/BI_PSPB_TransactionDataSupportCtrl.getPSPCaseRecordsPlatformSupport';
import ENROLLE_GET from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import{support} from 'c/biPspbSupportCaseResources';
export default class BiPspbPlatformSupport extends NavigationMixin(LightningElement)
{
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @api
	@api acceptedFormats = '.jpg,.jpeg,.png,.pdf'; // Set the accepted file formats
	@api recordId; // Pass the record ID if applicable

	// Declaration of variables with @track
	urlq;
	showDivSubmit = false;
	showDivDraft = false;
	fileIcon = support.MY_ICON;
	isFormVisible = false;
	isFormVisibleOne = false;
	isFormVisibleTwo = false;
	isFormVisibleThree = false;
	fieldOne = '';
	fieldTwo = '';
	subTypError = false;
	descriptionError = false;
	files = [];
	back = false;
	// to invoke CSS '' are useed
	classFive = 'desc';
	contact = true;
	selectedOption;
	userId = support.ID;
	accName;
	fileName;
	caseRecord;
	caseMedicalId = null;
	caseType;
	medicalSubType;
	medicalDescription;
	selectedOptionValues;
	description = '';
	medicalDataGet;
	descriptionLengthError = false;
	browserName = true;
	fileNames;
	showFileNames = false;
	radioBtnColorChange = ''
	caseSubType;
	dataValue;
	caseDescription;
	selectedItemId;
	// Declaration of variables
	rightImg = support.TIC;
	iconWarning = support.WARNING;
	buttonImage = support.IMG;
	backArrow = support.ARROW;
	parametershnImg = support.PHN_IMG;
	emailImg = support.EMAIL_IMG;
	subType = ''; // Initialize with an empty string
	caseRecordId;
	isButtonDisabled = false;
	isSubmitButtonDisabled;
	// used in HTML file

	connectedCallback() {
		let globalThis = window;
		this.selectedItemId = globalThis.sessionStorage.getItem(
			"caseRecordId"
		);
		globalThis?.addEventListener('beforeunload', this.handlePageRefresh);

		this.loadCaseRecords();
		loadStyle(this, support.CASE_RADIO_BTN);
		try {
			this.detectBrandedOrUnassigned();

			ENROLLE_GET({ userId: this.userId })
				.then(result => {

					if (result !== null) {

						if (result[0].patientEnrolle !== null) {
							this.accName = result[0].patientEnrolle.Id;
						} else if (result[0].error !== null) {
							this.showError = true;
							this.errorMessage = result[0].error;
						}
					}
				})
				// Null data is checked and AuraHandledException is thrown from the Apex
				.catch(error => {
					this.handleError(error.message);
				})
		} catch (error) {
			this.handleError(error.message);
		}
	}
	handlePageRefresh() {
		let globalThis = window;
		globalThis.sessionStorage?.clear();

	}
	loadCaseRecords() {
		CASE_RECORDS_GET({ accountId: this.selectedItemId })
			.then(data => {
				if (data) {
					try {
						this.caseRecord = data[0];
						this.caseMedicalId = data[0].Id;
						this.caseType = data[0].Type;
						this.description1 = data[0].Description;
						this.selectedOptionValues = data[0].BI_PSPB_Sub_Type__c;
						this.selectedOption = this.selectedOptionValues;
						this.description = this.description1;
						this.medStatus = data[0].Status;
						if (this.medStatus === 'Need more Information') {
							this.isReadOnly = true;
						}
					} catch (err) {
						// Handle any errors that occur within the try block
						//this.showToast('Error', err.message, 'error');
					}
				}
			})
			.catch(error => {
				this.handleError(error.body.message);
			});
	}
handleRadioChange(event) {
		this.selectedOption = event.target.value;
		this.subTypError = false;
}
handleDescriptionErr(){
	this.classFive = 'change';
	this.template.querySelector("label[data-field='desc']").className = 'input-error-label';
}
handleDescription(){
	this.classFive = 'desc';
	this.template.querySelector("label[data-field='desc']").className = 'input-label';
}
	handledescription(event) {
		this.description = event.target.value;
		if (this.description === '') {
			this.descriptionError = true;
			this.descriptionLengthError = false;
			// Double quotes can't be avoided since it's invoked from CSS
			this.handleDescriptionErr();
		}
		else {
			this.descriptionError = false;
			this.handleDescription();
			this.descriptionLengthError = false;
			// Double quotes can't be avoided since it's invoked from CSS
			
		}
	}

	handleUploadFinished(event) {
		const UPLOADED_FILES = event.detail.files;
		this.files = UPLOADED_FILES;
		this.fileNames = this.files.map(file => {
			const MAX_LENGTH = 24; // Maximum length of displayed filename
			return file.name.length > MAX_LENGTH ? file.name.substring(0, MAX_LENGTH) + '...' : file.name;
		});
		this.showFileNames = true;
		this.browserName = false;

	}

	handleInsertUpdate(event) {
		this.caseType = event.currentTarget.dataset.value;
		const FILE_IDS = this.files.map(file => file.documentId);
		const PARAMETERS = {
			accountId: this.accName,
			type: this.caseType,
			subType: this.selectedOption,
			description: this.description
		};
	
		if (!this.validateDescription()) {
			return;
		}
		this.processOperation(PARAMETERS, FILE_IDS);
	}
	validateDescription() {
		if (this.description === '') {
			this.descriptionError = true;
			this.descriptionLengthError = false;
			this.handleDescriptionErr();
			return false;
		}
	
		else if (this.description.length > 1000) {
			this.descriptionError = false;
			this.descriptionLengthError = true;
			this.handleDescriptionErr();
			return false;
		}
	
		this.descriptionError = false;
		this.descriptionLengthError = false;
		this.handleDescription();
		return true;
	}
	processOperation(PARAMETERS, FILE_IDS) {
		const globalThis = window;
	try{
		if (this.caseMedicalId === null) {
			this.insertOrUpdateLeadConsent(PARAMETERS, FILE_IDS, globalThis);
		} else {
			this.updateCase(PARAMETERS, FILE_IDS, globalThis);
		}
	}
	catch (error) {
		this.handleError(error.message);
	}
}
	insertOrUpdateLeadConsent(parameters, fileIds, globalThis) {
	
			INSERT_UPDATE_LEAD_CONSENT({ wrapper: parameters, fileIds });
			this.showDivSubmit = true;
			this.showDivDraft = false;
			globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
			this.resetFormState();
		} 
	
	updateCase(fileIds, globalThis) {
		
			UPDATE_CASE({ recId: this.caseMedicalId, type: this.caseType, description: this.description, fileIds });
			this.showDivSubmit = true;
			this.showDivDraft = false;
			globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
			this.resetFormState();
		
	}
	resetFormState() {
		this.description = '';
		this.fileNames = '';
		this.browserName = true;
		this.descriptionLengthError = false;
		this.handleDescription();
	}
					
	handleInsertDraft(event) {
		this.caseType = event.currentTarget.dataset.value;
		const FILE_IDS = this.files.map(file => file.documentId);
		const PARAMETERS = {
			accountId: this.accName,
			type: this.caseType,
			subType: this.selectedOption,
			description: this.description
		};
	
		if (!this.validateDescription()) {
			return;
		}
	
		this.processDraftOperation(PARAMETERS, FILE_IDS);
	}
	processDraftOperation(PARAMETERS, FILE_IDS) {
		const globalThis = window;
	try{
		if (this.caseMedicalId === null) {
			this.insertDraft(PARAMETERS, FILE_IDS, globalThis);
		} else {
			this.updateDraft(PARAMETERS, FILE_IDS, globalThis);
		}
	} catch (error) {
		this.handleError(error.body.message);
	}
	}
	insertDraft(parameters, fileIds, globalThis) {
		this.isButtonDisabled = true;
		this.isSubmitButtonDisabled = true;
	
		
			const button = this.template.querySelector('.button2');
			this.dataValue = button.getAttribute('data-value');
			this.callfunction();
			CASE_DRAFT({ wrapper: parameters, fileIds });
			this.loadCaseRecords();
			this.updateUIAfterInsertDraft(globalThis);
		
	}
	updateDraft(fileIds, globalThis) {
		
			UPDATE_DRAFT({
				recId: this.caseMedicalId,
				type: this.caseType,
				description: this.description,
				fileIds: fileIds
			});
			this.updateUIAfterInsertDraft(globalThis);
		
	}
	updateUIAfterInsertDraft(globalThis) {
		this.showDivDraft = true;
		this.showDivSubmit = false;
		globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
		this.resetFormState();
	}
			
	callfunction() {
		if (this.showDivDraft === true || this.dataValue) {
			this.isSubmitButtonDisabled = true;
		}
		else {
			this.isSubmitButtonDisabled = false;
		}
	}

	handleBack() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + support.SUPPORT_PAGE_URL);
	}
	handleclose() {
		this.showDivSubmit = false;
		this.showDivDraft = false;
		this.isButtonDisabled = false;
		this.isSubmitButtonDisabled = false;
	}
	handleError(error){
		this.showToast(support.ERROR_MESSAGE, error.body.message, support.ERROR_VARIANT);
	}
	detectBrandedOrUnassigned() {
		let globalThis = window;
		const CURRENT_URL = globalThis.location?.href;
		const URL_OBJECT = new URL(CURRENT_URL);
		const PATH = URL_OBJECT.pathname;
		const PATH_COMPONENTS = PATH.split('/');
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
			[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);
		//set the url and navigations are done within branded site 
		if (DESIRED_COMPONENT && DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) {
			this.urlq = support.BRANDED_URL_NAVI;
		}
		//set the url and navigations are done within unassigned site 
		else {
			this.urlq = support.UNASSIGNED_URL_NAVI;
		}
	}

}