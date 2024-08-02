// This LWC is designed for support center main page
// To import Libraries
import { LightningElement} from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Static Resources

// To import Custom Labels
import{support} from 'c/biPspbSupportCaseResources';

export default class BiPspbSupportCenter extends NavigationMixin(LightningElement)
{
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Declaration of variables with @track
	isFormVisible = false;
	isFormVisibleOne = false;
	isFormVisibleTwo = false;
	isFormVisibleThree = false;
	buttonLabel = 'Show Form'; // Initial label
	fieldOne = '';
	fieldTwo = '';
	subTypeError = false;
	descriptionError = false;
	files = [];
	back = false;
	//The following are invoked from CSS
	classOne = 'buttonbox';
	classTwo = 'buttonbox';
	classThree = 'buttonbox';
	contact = true;
	showCollectButton = true;
	caseType;
	// Declaration of variables
	medicalInformation = support.MEDICAL_INFORMATION;
	reportAdverse = support.REPORT_ADVERSE;
	platformSupport = support.PLATFORM_SUPPORT
	backArrow = support.ARROW;
	phnimg = support.PHN_IMG;
	emailimg = support.EMAIL_IMG;
	supportSms = support.SUPPORT_SMS;
	supportEmail = support.SUPPORT_EMAIL;
	/* This method is used to navigate a user to the respective Unassigned or Branded*/
	connectedCallback() {
		let globalThis = window;
		try {
			const CURRENT_URL = globalThis.location?.href;

			// Create a URL object
			const URL_OBJECT = new URL(CURRENT_URL);

			// Get the PATH
			const PATH = URL_OBJECT.pathname;

			// Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/');

			// Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
				[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);

			if (DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) {
				this.urlq = support.BRANDED_URL_NAVI;
			}
			else {
				this.urlq = support.UNASSIGNED_URL_NAVI;
			}
		}
		catch (error) {
			this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
		}
	}
	// To navigate to Medical Information Enquiry page
	medicalInformationtoggle(event) {
		let globalThis = window;
		this.caseType = event.currentTarget.dataset.value;
		globalThis.location?.assign(this.urlq + support.MIE_PAGE);
	}
	// To navigate to Report Adverse Event page
	reportAdverseEventstoggle(event) {
		let globalThis = window;
		this.caseType = event.currentTarget.dataset.value;
		globalThis.location?.assign(this.urlq + support.RAE_PAGE);
	}
	// To navigate to Platform Support page
	platformSupporttoggle(event) {
		let globalThis = window;
		this.caseType = event.currentTarget.dataset.value;
		globalThis.location?.assign(this.urlq + support.PSP_PAGE);
	}
	showToast(title, message, variant) {
		if (typeof window !== 'undefined')
		{
			const EVENT = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(EVENT);
		}
	}
}