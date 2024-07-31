//This component is used as Footer for all pages
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { resources } from 'c/biPspLabelAndResourceGeneral';

// To import User Id.
import Id from '@salesforce/user/Id';
export default class BiPspbFooterLogo extends LightningElement {
	// Declaring variables.
	decidingBrandedOrUnassigned;
	userId = Id;
	decisionForNavBar=false;
	//Assigning all imported variables to a variable to use in HTML.
	imageOfLogo = resources.IMAGE_FOR_FOOTER;
	questionnairePageOne=resources.QUESTIONNAIRE_ONE_URL;
	questionnairePageTwo=resources.QUESTIONNAIRE_TWO_URL;
	publicPrivacyNotice=resources.PUBLIC_PRIVACY_NOTICE;
	publicTermsOfUse=resources.PUBLIC_TERMS_OF_USE;
	publicContactUs=resources.PUBLIC_CONTACT_US;
	caregiverFirstAvatar = resources.CAREGIVER_FIRST_AVATAR;
	errorMsg = resources.ERROR_MESSAGE;
	errorVariant = resources.ERROR_VARIANT;
	brandedUrl = resources.BRANDED_URL;
	unassignedUrl = resources.UNASSIGNED_LABEL;
	brSiteUrl = resources.BRSITE_URL;
	unassignedSiteUrl = resources.UNASSIGNED_URL;
	contactUsLabel = resources.CONTACT_US;
	contactUsLogin = resources.CONTACT_US_LOGIN;
	termsOfUseLabel = resources.TERMS_OF_USE;
	termsOfLogin = resources.TERMS_LOGIN;
	privacyNoticeLabel = resources.PRIVACY_NOTICE;
	privacyLogin = resources.PRIVACY_LOGIN;
	//ConnectedCallback used to find the site is Branded or Unassigned.
	renderedCallback() {
		try {
			this.detectBrandedOrUnassigned();
			this.detectPageUrl();
		} catch (err) {
			this.showToast(this.errorMsg, err.message, this.errorVariant); // Result Null/other Exception
		}
	}

	// To detect the site is branded or unassigned
	detectBrandedOrUnassigned() {
		let globalThis = window;
		let currentURL = globalThis.location?.href;
		let urlObject = new URL(currentURL);
		let path = urlObject.pathname;
		let pathComponents = path.split('/');
		let desiredComponent = pathComponents.find((component) =>
			[this.brandedUrl.toLowerCase(), this.unassignedUrl.toLowerCase()].includes(
			component.toLowerCase()
			)
		);
		if (
			desiredComponent &&
			desiredComponent.toLowerCase() === this.brandedUrl.toLowerCase()
		) {
			this.decidingBrandedOrUnassigned = this.brSiteUrl;
		}
		//set the url and navigations are done within unassigned site
		else {
			this.decidingBrandedOrUnassigned = this.unassignedSiteUrl;
		}
	}

	detectPageUrl()
	{
		const currentTabName = window.location.pathname.split('/').pop();
		// Get the pathname from the URL
		let pathname = window.location.pathname;
		if (pathname === this.brSiteUrl || pathname === '' || currentTabName === this.questionnairePageOne ||
		currentTabName === this.questionnairePageTwo || currentTabName === this.publicPrivacyNotice || 
		currentTabName === this.publicTermsOfUse || currentTabName === this.publicContactUs || 
		currentTabName === this.caregiverFirstAvatar )
		{
			this.decisionForNavBar=true;
		}else{
			this.decisionForNavBar=false;
		}
	}
	

	// Navigate to Contact Us page.

	contactUs()
	{
		if (!this.userId) {
			window.location.assign(this.contactUsLabel);
		} else {
			if(this.decisionForNavBar)
			{
				window.location.assign(this.contactUsLabel);
			}else{
				window.location.assign(this.decidingBrandedOrUnassigned + this.contactUsLogin);
			}
		}
	}
	// Navigate to Terms of use page.

	termsOfUse() 
	{
		if (!this.userId) {
			window.location.assign(this.termsOfUseLabel);
		} else {
			if(this.decisionForNavBar)
			{
				window.location.assign(this.termsOfUseLabel);
			}else{
				window.location.assign(this.decidingBrandedOrUnassigned + this.termsOfLogin);
			}
		}
	}
	// Navigate to Privacy Notice page.

	privacyNotice() 
	{
		if (!this.userId) {
			window.location.assign(this.privacyNoticeLabel);
		}
		else {
			if(this.decisionForNavBar)
			{
				window.location.assign(this.privacyNoticeLabel);
			}else{
				window.location.assign(this.decidingBrandedOrUnassigned + this.privacyLogin);
			}
		}
	}
	// show the Toast message if the catch runs

	showToast(title, message, variant) 
	{
		if (typeof window !== 'undefined') 
		{
			const event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}
}