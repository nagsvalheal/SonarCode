// This Lwc is used for Parent component to display footer links
// To import Libraries
import { LightningElement } from 'lwc';
// To Import Custom Labels

import { resource } from "c/biPspbEnrollmentFormResource";
export default class BiPspbFooterQuickLinks extends LightningElement {
	//navigation
	openPrivacyNotice() {
		window.location.assign(resource.PRIVACYURL);
	}
	openTerms() {
		window.location.assign(resource.TERMSURL);
	}
	openContactUs() {
		window.location.assign(resource.CONTACTURL);
	}
}