import { LightningElement } from 'lwc';
// Imports resourceUrl to reference external resources for proper rendering and functionality.
import {label} from 'c/biPspbAvatarResources';

//To import Custom lable

export default class BiPspbIamPatientLandingParent extends LightningElement {
	Brandedsiteurl = label.BRANDED_SITEURL;
	patientEnrollemetUrl = label.PATIENTENROLLMENT;
	BGpp = label.BGpp;
	mobilepic = label.MOBILE;
	patientBannerDesktop=label.PATIENT_BANNER_DESKTOP;
	patientBanner = label.PATIENT_BANNER;
	patientIconCalender = label.PATIENT_ICON_CALENDER;
	patientIconCenter = label.PATIENT_ICON_CENTER;
	patientIconSecurity  = label.PATIENT_ICON_SECURITY;
	patientFeatureBanner = label.PATIENT_FEATURE_BANNER;
	patientIconEarn = label.PATIENT_ICON_EARN;
	patientIconHub = label.PATIENT_ICON_HUB;
	patientIconUnique = label.PATIENT_ICON_UNIQUE;
	patientIconVisual = label.PATIENT_ICON_VISUAL;
	get displayBackgroundImage() {
		return `background-image: url('${this.patientBannerDesktop}');background-size: cover; background-repeat: no-repeat;`;
	}
	openPAENpage() {
		window.location.assign(this.Brandedsiteurl + this.patientEnrollemetUrl);
	}
}