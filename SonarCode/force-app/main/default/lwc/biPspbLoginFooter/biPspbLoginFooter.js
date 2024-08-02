// To design the footer with copyright text and links in the login page
// To import Libraries
import { LightningElement } from 'lwc';
// To import User Id.
import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbLoginFooter extends LightningElement {
	userId = resource.Id;
	loginCopyrights = resource.LOGIN_COPYRIGHTS;
	contactUsLab = resource.CONTACT_US_LABEL;
	termsOfUseLab = resource.TERMS_OF_USE_LABEL;
	privacyNoticeLab = resource.PRIVACY_NOTICE_LABEL;
	// Navigate to Privacy Notice page.
	privacyNotice() {
		window.location.assign(resource.PRIVACYURL);
	}
	// Navigate to Contact Us page.

	contactUs() {
		window.location.assign(resource.TERMSURL);
	}
	// Navigate to Terms of use page.

	termsOfUse() {
		window.location.assign(resource.CONTACTURL);
	}
}