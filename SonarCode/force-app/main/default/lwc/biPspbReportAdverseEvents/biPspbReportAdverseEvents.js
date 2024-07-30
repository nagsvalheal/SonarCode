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
// To import Static Resources
import{support} from 'c/biPspbSupportCaseResources';
export default class BiPspbReportAdverseEvents extends NavigationMixin(LightningElement)
{
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @api
	@api acceptedFormats = '.jpg,.jpeg,.png,.pdf'; // Set the accepted file formats
	@api recordId; // Pass the record ID if applicable

	// Declaration of variables with @track
	showDivSubmit = false;
	showDivDraft = false;
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
	subTypeErr=support.SUB_TYPE_ERROR;
	descriptionErr = support.DESCRIPTION_ERROR;
	descritionErrChar = support.DESCRIPTION_ERROR_CHAR;

	subTypeOptions = [
		{ label: support.SUSPECTED, value: support.SUSPECTED },
		{ label: support.UNEXPECTED, value: support.UNEXPECTED },
		{ label: support.OTHER, value: support.OTHER },
	];
	connectedCallback() {
		try {
			this.initializeSelectedItemId();
			this.setupEventListeners();
			this.loadCaseRecords();
			this.setupUrlNavigation();
			this.loadStyles();
			this.fetchEnrolleData();
		} catch (error) {
			this.handleError(error.message);
		}
	}
	initializeSelectedItemId() {
		const globalThis = window;
		this.selectedItemId = globalThis.sessionStorage.getItem("caseRecordId");
	}
	setupEventListeners() {
		const globalThis = window;
		globalThis?.addEventListener('beforeunload', this.handlePageRefresh);
	}
	setupUrlNavigation() {
		const globalThis = window;
		const CURRENT_URL = globalThis.location?.href;
		const URL_OBJECT = new URL(CURRENT_URL);
		const PATH = URL_OBJECT.pathname;
		const PATH_COMPONENTS = PATH.split('/');
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
			[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);
	
		this.urlq = DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase() ?
			support.BRANDED_URL_NAVI : support.UNASSIGNED_URL_NAVI;
	}
	loadStyles() {
		loadStyle(this, support.CASE_RADIO_BTN);
		loadStyle(this, support.RADIO_BTN_COLOR_CHNAGE);
	}
	fetchEnrolleData() {
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
				this.handleError(error.message);
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
						this.handleError(err.message);
					}
				}
			})
			.catch(error => {
				this.handleError(error.body.message);
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
			this.template.querySelector("label[data-field='desc']").className = 'desnot';
			this.class5 = 'desc'; // invoked in CSS file
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

hadleDescriptionErr(){
	this.class5 = 'change'; 
	this.template.querySelector("label[data-field='desc']").className = 'input-error-label';
}
hadleDescription(){
	this.class5 = 'desc'; 
	this.template.querySelector("label[data-field='desc']").className = 'input-error';
}
handleRadioBtnColor(){
	this.radioBtnColorChange = 'chnageradiobtn'; // invoked in CSS file
			this.subTypeError = true;
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

    if (!this.validateInputs()) {
        return;
    }

    const MAX_LENGTH = 1000;
    if (this.isDescriptionTooLong(MAX_LENGTH)) {
        this.handleDescriptionLengthError();
        return;
    }

    if (this.caseMedicalId === null) {
        this.insertConsent(PARAMETERS, FILE_IDS);
    } else {
        this.updateCase(FILE_IDS);
    }
}
validateInputs() {
    if (!this.selectedOption && !this.description) {
        this.handleRadioBtnColor();
        this.hadleDescriptionErr();
        this.descriptionError = true;
        this.descriptionLengthError = false;
        this.faultValue = true;
        return false;
    }

    else if (this.selectedOption && !this.description) {
        this.descriptionError = true;
        this.descriptionLengthError = false;
        this.hadleDescriptionErr();
        this.faultValue = true;
        return false;
    }

   else if (!this.selectedOption && this.description) {
        this.handleRadioBtnColor();
        this.descriptionError = false;
        this.faultValue = true;
        this.hadleDescription();
        return false;
    }

    return true;
}
isDescriptionTooLong(maxLength) {
    return this.description.length > maxLength;
}
handleDescriptionLengthError() {
    this.descriptionError = false;
    this.descriptionLengthError = true;
    this.hadleDescriptionErr();
    this.faultValue = true;
}
insertConsent(PARAMETERS, FILE_IDS) {
    const globalThis = window;
    try {
        INSERT_UPDATE_LEAD_CONSENT({ wrapper: PARAMETERS, FILE_IDS });
        this.showDivSubmit = true;
        this.showDivDraft = false;
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.resetForm();
    } catch (error) {
        this.handleError(error.message);
    }
}
updateCase(FILE_IDS) {
    const globalThis = window;
    try {
        UPDATE_CASE({
            recId: this.caseMedicalId,
            type: this.caseType,
            description: this.description,
            FILE_IDS
        });
        this.showDivSubmit = true;
        this.showDivDraft = false;
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.resetForm();
        this.isReadOnly = false;
    } catch (error) {
        this.handleError(error.message);
    }
}
resetForm() {
	this.hadleDescription();
    this.descriptionLengthError = false;
    this.caseType = '';
    this.selectedOption = '';
    this.description = '';
    this.fileNames = '';
    this.browserName = true;
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

    if (!this.validateInputs()) {
        return;
    }

    if (this.isDescriptionTooLong(1000)) {
        this.handleDescriptionLengthError();
        return;
    }

    this.processDraft(PARAMETERS, FILE_IDS);
}
processDraft(PARAMETERS, FILE_IDS) {
    const globalThis = window;

    if (this.caseMedicalId === null) {
        this.isButtonDisabled = true;
        this.insertDraft(PARAMETERS, FILE_IDS, globalThis);
    } else {
        this.updateDraft(FILE_IDS, globalThis);
    }
}
insertDraft(PARAMETERS, FILE_IDS, globalThis) {
    try {
        CASE_DRAFT({ wrapper: PARAMETERS, FILE_IDS });
        this.showDivDraft = true;
        this.showDivSubmit = true;
        
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
        this.loadCaseRecords();
    } catch (error) {
        this.handleError(error.message);
    }
}
updateDraft(FILE_IDS, globalThis) {
    try {
        UPDATE_DRAFT({
            recId: this.caseMedicalId,
            type: this.caseType,
            description: this.description,
            FILE_IDS
        });
        this.showDivDraft = true;
        this.showDivSubmit = true;
        
        globalThis?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        this.handleError(error.message);
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
		this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
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