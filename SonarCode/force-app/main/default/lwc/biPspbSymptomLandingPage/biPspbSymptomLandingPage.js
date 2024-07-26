// This LWC serves as a landing page for a symptom tracker, offering options to create new entries and displaying a happy face image. 
// It dynamically determines the URL based on the current page and navigates users accordingly.
// To import Libraries
import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Static Resources
import HAPPY from '@salesforce/resourceUrl/BI_PSP_EmptyGraph';
// To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_URL_NAVIGATION from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVIGATION from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import SYMPTOM_MAIN_PAGE_URL from '@salesforce/label/c.BI_PSPB_SymptomTrackerMainPages';
import ERROR_VARIANT_TOAST from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import SLASH from '@salesforce/label/c.BI_PSP_Slash'

export default class biPspbSymptomLandingPage extends NavigationMixin(LightningElement) {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//@track variable declaration
	@track emptyGraph = HAPPY;
	//This method is called when the component is connected to the DOM.
	connectedCallback() {
		let globalThis = window;
		try {
			const currentURL = globalThis.location?.href;
			// Create a URL object
			const urlObject = new URL(currentURL);
			// Get the path
			const path = urlObject.pathname;
			// Split the path using '/' as a separator
			const pathComponents = path.split(SLASH);
			// Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find(component =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.brandedOrUnassigned = BRANDED_URL_NAVIGATION;
			}
			else {
				this.brandedOrUnassigned = UNASSIGNED_URL_NAVIGATION;
			}
		}
		catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
		}
	}
	openEntryDate() {
		let globalThis = window;
		globalThis.location?.assign(SYMPTOM_MAIN_PAGE_URL)
		globalThis.localStorage.clear()
	}
	// showToast used for all the error messages caught
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