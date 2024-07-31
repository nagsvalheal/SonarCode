// This LWC is used to create case record for Type - Report Adverse Events
// To import Libraries
import { LightningElement, api } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
// To import Apex Classes
import ENROLLE_GET from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import INSERT_UPDATE_LEAD_CONSENT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.createCase';
import UPDATE_CASE from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.updateCase';
import UPDATE_DRAFT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.updateDraft';
import CASE_DRAFT from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.caseDraft';
import CASE_RECORDS_GET from '@salesforce/apex/BI_PSPB_CreateSupportCaseCtrl.getPSPCaseRecordsReport';
import{support} from 'c/biPspbSupportCaseResources';
export default class BiPspbReportAdverseEvents extends NavigationMixin(LightningElement)
{
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @api
	@api acceptedFormats = '.jpg,.jpeg,.png,.pdf'; // Set the accepted file formats
	@api recordId; // Pass the record ID if applicable
	// Declaration of variables with showDivSubmit = false;
	showDivDraft = false;
	showDivSubmit = false;
	fileIcon = support.MY_ICON;
	isFormVisible = false;
	isFormVisibleOne = false;
	isFormVisibleTwo = false;
	isFormVisibleThree = false;
	fieldOne = '';
	fieldTwo = '';
	subTypeError = false;
	descriptionError = false;
	files = [];
	back = false;
	// to invoke CSS '' are useed
	class5 = 'desc';
	contact = true;
	showCollectButton = true;
	caseType;
	selectedOption;
	userId = support.ID;
	accName;
	caseRecord;
	caseMedicalId = null;
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
	throwError = ''
	faultValue = false;
	caseSubType;
	caseDescription;
	isReadOnly = false;
	medStatus;
	selectedItemId;
	dataValue;
	// Declaration of variables
	boxedicon = support.BOXED_IMG;
	buttonImage = support.IMG;
	backArrow = support.ARROW;
	subType = '';
	caseRecordId;
	rightImg = support.TIC;
	iconWarning = support.WARNING;
	isButtonDisabled = false;
	// used in HTML file


	subTypeErr = support.SUB_TYPE_ERROR;
	descriptionErr = support.DESCRIPTION_ERROR;
	descritionErrChar = support.DESCRIPTION_ERROR_CHAR
	
	subTypeOptions = [
		{ label: support.SUSPECTED, value: support.SUSPECTED },
		{ label: support.UNEXPECTED, value: support.UNEXPECTED },
		{ label: support.OTHER, value: support.OTHER },
	];
	connectedCallback() {
		try {
			this.initializeComponent();
			this.addPageUnloadListener();
			this.loadCaseRecords();
			this.determineNavigationUrl();
			this.loadStyles();
			this.fetchEnrolleeData();
		} catch (error) {
			this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
		}
	}
	
	initializeComponent() {
		let globalThis = window;
		this.selectedItemId = globalThis.sessionStorage.getItem("caseRecordId");
	}
	
	addPageUnloadListener() {
		let globalThis = window;
		globalThis?.addEventListener('beforeunload', this.handlePageRefresh);
	}
	
	determineNavigationUrl() {
		let globalThis = window;
		const CURRENT_URL = globalThis.location?.href;
		const URL_OBJECT = new URL(CURRENT_URL);
		const PATH = URL_OBJECT.pathname;
		const PATH_COMPONENTS = PATH.split('/');
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
			[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);
	
		if (DESIRED_COMPONENT?.toLowerCase() === support.BRANDED_URL.toLowerCase()) {
			this.urlq = support.BRANDED_URL_NAVI;
		} else {
			this.urlq = support.UNASSIGNED_URL_NAVI;
		}
	}
	
	loadStyles() {
		loadStyle(this, support.CASE_RADIO_BTN);
		loadStyle(this, support.RADIO_BTN_COLOR_CHNAGE);
	}
	
	fetchEnrolleeData() {
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
			.catch((error) => {
				this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
			});
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
						this.showToast('Error', err.message, 'error');
					}
				}
			})
			.catch(error => {
				this.showToast('Error', error.body.message, 'error');

			});
	}

	handleRadioChange(event) {
		this.selectedOption = event.target.value;
		this.subTypeError = false;
		this.radioBtnColorChange = 'chnageradiobtn1'; // invoked in CSS file
	}

	handledescription(event) {
		this.description = event.target.value;
		if (this.description !== '') {
			this.descriptionError = false;
			// Double quotes can't be avoided since it's invoked from CSS
			this.HandleDesc();
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

HandleDescErr(){
	this.class5 = 'change';
	this.template.querySelector("label[data-field='desc']").className = 'input-error-label';
}
HandleDesc(){
	this.class5 = 'desc';
	this.template.querySelector("label[data-field='desc']").className = 'input-label';
}
handleInsertUpdate(event) {
    this.caseType = event.currentTarget.dataset.value;
    const globalThis = window;
    const FILE_IDS = this.files.map(file => file.documentId);
    const PARAMETERS = this.getParameters();

    if (this.hasErrors()) {
        this.handleErrors();
        return;
    }

    if (this.isValidDescription()) {
        this.processCase(FILE_IDS, PARAMETERS, globalThis);
    }
}

getParameters() {
    return {
        accountId: this.accName,
        type: this.caseType,
        subType: this.selectedOption,
        description: this.description
    };
}

hasErrors() {
    return (!this.selectedOption && !this.description) ||
           (this.selectedOption && !this.description) ||
           (!this.selectedOption && this.description) ||
           (this.description.length > 1000);
}

handleErrors() {
    if (!this.selectedOption && !this.description) {
        this.radioBtnColorChange = 'chnageradiobtn';
        this.subTypeError = true;
        this.descriptionError = true;
        this.descriptionLengthError = false;
        this.HandleDescErr();
        this.faultValue = true;
    } else if (this.selectedOption && !this.description) {
        this.descriptionError = true;
        this.descriptionLengthError = false;
        this.HandleDescErr();
        this.faultValue = true;
    } else if (!this.selectedOption && this.description) {
        this.radioBtnColorChange = 'chnageradiobtn';
        this.subTypeError = true;
        this.descriptionError = false;
        this.faultValue = true;
        this.HandleDesc();
       this.handleDescriptionValue();
    } else if (this.description.length > 1000) {
        this.descriptionError = false;
        this.descriptionLengthError = true;
        this.HandleDescErr();
        this.faultValue = true;
    }
}
handleDescriptionValue(){
	if (this.description.length > 1000) {
		this.descriptionError = false;
		this.descriptionLengthError = true;
		this.HandleDescErr();
		this.faultValue = true;
	}
}

isValidDescription() {
    return this.selectedOption !== undefined && this.description !== '' && this.description.length <= 1000;
}

processCase(FILE_IDS, PARAMETERS, globalThis) {
    if (this.caseMedicalId === null) {
        this.insertLeadConsent(PARAMETERS, FILE_IDS, globalThis);
    } else {
        this.updateCase(FILE_IDS, globalThis);
    }
}

insertLeadConsent(PARAMETERS, FILE_IDS, globalThis) {
    try {
        INSERT_UPDATE_LEAD_CONSENT({ wrapper: PARAMETERS, fileIds: FILE_IDS });
        this.showDivSubmit = true;
        this.showDivDraft = false;
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.HandleDesc();
        this.HandleCaseEmpty();
    } catch (error) {
        this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
    }
}

updateCase(FILE_IDS, globalThis) {
    try {
        UPDATE_CASE({
            recId: this.caseMedicalId,
            type: this.caseType,
            description: this.description,
            fileIds: FILE_IDS
        });
        this.showDivSubmit = true;
        this.showDivDraft = false;
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.HandleCaseEmpty();
        this.isReadOnly = false;
    } catch (error) {
        this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
    }
}

	HandleCaseEmpty(){
		this.caseType = '';
						this.selectedOption = '';
						this.description = '';
						this.fileNames = '';
						this.browserName = true;
						this.descriptionLengthError = false;
	}
	handleInsertDraft(event) {
		let globalThis = window;
		this.caseType = event.currentTarget.dataset.value;
		const FILE_IDS = this.files.map(file => file.documentId);
		const PARAMETERS = this.getDraftParameters();
	
		if (this.hasDraftErrors()) {
			this.handleErrors();
			return;
		}
	
		if (this.isValidDraftDescription()) {
			this.processDraftCase(FILE_IDS, PARAMETERS, globalThis);
		}
	}
	
	getDraftParameters() {
		return {
			accountId: this.accName,
			type: this.caseType,
			subType: this.selectedOption,
			description: this.description
		};
	}
	
	hasDraftErrors() {
		return (!this.selectedOption && !this.description) ||
			(this.selectedOption && !this.description) ||
			(!this.selectedOption && this.description) ||
			(this.description.length > 1000);
	}
	
	isValidDraftDescription() {
		return this.selectedOption !== undefined && this.description !== '' && this.description.length <= 1000;
	}
	
	processDraftCase(FILE_IDS, PARAMETERS, globalThis) {
		this.getDataValueFromButton();
		this.callfunction();
	
		if (this.caseMedicalId === null) {
			this.insertDraft(PARAMETERS, FILE_IDS, globalThis);
		} else {
			this.updateDraft(FILE_IDS, globalThis);
		}
	}
	
	getDataValueFromButton() {
		const button = this.template.querySelector('.button2');
		this.dataValue = button.getAttribute('data-value');
	}
	
	insertDraft(PARAMETERS, FILE_IDS, globalThis) {
		this.isButtonDisabled = true;
	
		try {
			CASE_DRAFT({ wrapper: PARAMETERS, fileIds: FILE_IDS });
			this.showDivDraft = true;
			this.showDivSubmit = true;
			this.HandleDesc();
			this.HandleCaseEmpty();
			globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
			this.HandleDesc();
			this.loadCaseRecords();
		} catch (error) {
			this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
		}
	}
	
	updateDraft(FILE_IDS, globalThis) {
		try {
			UPDATE_DRAFT({
				recId: this.caseMedicalId,
				type: this.caseType,
				description: this.description,
				fileIds: FILE_IDS
			});
			this.showDivDraft = true;
			this.showDivSubmit = true;
			globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
			this.clearFormData();
		} catch (error) {
			this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
		}
	}
	
	clearFormData() {
		this.isReadOnly = false;
		this.HandleCaseEmpty();
		this.isReadOnly = false;
	}
	

	handleBack() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + support.SUPPORT_PAGE_URL);
	}
	handleclose() {
		this.showDivDraft = false;
		this.isButtonDisabled = false;
		this.isSubmitButtonDisabled = false;
	}
	handleCloseSubmit(){
		this.showDivSubmit = false;
	}
	callfunction() {
		if (this.showDivDraft === true || this.dataValue) {
			this.isSubmitButtonDisabled = true;
		}
		else {
			this.isSubmitButtonDisabled = false;
		}
	}
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