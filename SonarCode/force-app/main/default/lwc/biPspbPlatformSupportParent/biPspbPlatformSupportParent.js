// This LWC is designed for Platform Support Main page and contains consolidated component for Avatar, Message
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Custom Labels

import{support} from 'c/biPspbSupportCaseResources';
export default class BiPspbPlatformSupportParent extends LightningElement 
{
	/* This method is used to navigate a user to the respective Unassigned or Branded*/
	connectedCallback() 
	{
		let globalThis = window;
		try
		{
			const CURRENT_URL = globalThis.location.href; // Create a URL object
			const URL_OBJECT = new URL(CURRENT_URL); // Get the PATH
			const PATH = URL_OBJECT.pathname; // Split the PATH using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/'); // Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
				[support.BRANDED_URL.toLowerCase(), support.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);

			if (DESIRED_COMPONENT.toLowerCase() === support.BRANDED_URL.toLowerCase()) 
			{
				this.urlq = support.BRANDED_URL_NAVI;
			}
			else 
			{
				this.urlq = support.UNASSIGNED_URL_NAVI;
			}
		}
		catch(error)
		{
			this.showToast(support.ERROR_MESSAGE, error.message, support.ERROR_VARIANT);
		}
	}
	// To navidate to the My Support page
	openSupportCenter() 
	{
		window.location.assign( this.urlq + support.SUPPORT_PAGE_URL);
	}
	// To navigate to the My Cases page
	openMyCases() {
		window.location.assign(this.urlq + support.MY_CASE_URL);
	}
	showToast(title, message, variant) 
	{ 
		if (typeof window !== "undefined") {
		const EVENT = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(EVENT);
	}
	}
}