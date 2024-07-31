//This Consolidated component is used to display the General Notification For Patient on click of the notification icon in Dashboard
//To import the Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import the Custom labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UN_ASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import {resources} from 'c/biPspbNotificationReminderResources';

export default class BiPspbNotificationGeneralFormParent extends LightningElement {
	actionRequired = resources.ACTION_REQUIRED_HEADING;
	general = resources.GENERAL_HEADING;
	history = resources.BI_PSP_HISTORY;
	// To fetch the URL path
	connectedCallback() {
		try {
			let globalThis = window;
			let CURRENT_URL = globalThis.location?.href;
			let URL_OBJECT = new URL(CURRENT_URL);
			let PATH = URL_OBJECT.pathname; 
			let PATHCOMPONENTS = PATH.split('/');
			let DESIREDCOMPONENT = PATHCOMPONENTS.find(component =>
				[BRANDED_URL.toLowerCase(), UN_ASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);

			if (DESIREDCOMPONENT.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL;
			}
			else {
				this.urlq = UN_ASSIGNED_URL;
			}
		}
		catch (error) {
			this.showToast(resources.ERROR_MESSAGE, error.message, resources.ERROR_VARIANT);
		}
	}
	// navigation for messagecenter page  
	openGeneral() {
		let globalThis = window;
		globalThis.location?.assign(resources.MESSAGE_CENTER_URL);
	}
	// navigation for action page 
	openActionReq() {
		let globalThis = window;
		globalThis.location?.assign(resources.ACTION_URL);
	}
	// navigation for history
	openHistory() {
		let globalThis = window;
		globalThis.location?.assign(resources.HISTORY_URL);
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