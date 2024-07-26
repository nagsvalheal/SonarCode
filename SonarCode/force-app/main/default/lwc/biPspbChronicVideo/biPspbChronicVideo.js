// This lightning web component is used for display the chronic patient customized video
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex classes
import GET_RECORDS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.getRecords';
// To import Custom Labels
import ERRORMESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERRORVARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbChronicVideo extends LightningElement {
	videoUrl = '';
	isContentVisible = false;
	videoWidth='';
	userId = ID;
	
	// To retrieve the video Url
	@wire(GET_RECORDS)
	wiredVideoData({ data, error }) {
		try {
			if (data && data.length!==0) {
				// Assuming the data is an array with at least one record
				this.videoUrl = data[0].BI_PSPB_URL__c;
			}else if(data === null || (data && data.length === 0) || error) {
				this.showToast(ERRORMESSAGE, ERRORMESSAGE, ERRORVARIANT); 
			}
		} catch (err) {
			this.showToast(ERRORMESSAGE, err.message, ERRORVARIANT); // Catching Potential Error from Lwc
		}
	}

	// Getter method to determine the icon name based on content visibility
	get iconName() {
		return this.isContentVisible ? 'utility:chevronup' : 'utility:chevrondown';
	}

	// Getter method to determine the icon alt text based on content visibility
	get iconAltText() {
		return this.isContentVisible ? 'Collapse Content' : 'Expand Content';
	}

	// Getter method to determine the content class based on content visibility
	get contentClass() {
		return this.isContentVisible ? 'content visible' : 'content';
	}

	// Method to toggle the content visibility
	toggleContent() {
		this.isContentVisible = !this.isContentVisible;
	}

	connectedCallback() {
			const globalThis=window;
			// video width and height hardcoded because the UI is not align with the video player
			if(globalThis.innerWidth<=1200){
				this.videoWidth= '700';
			}
			else{
				this.videoWidth = '905';
			}
	}

	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		let event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if(typeof window !='undefined'){
		this.dispatchEvent(event);
		}
	}
}