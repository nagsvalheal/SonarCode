import { LightningElement } from 'lwc';
// Imports resourceUrl to reference external resources for proper rendering and functionality.

// Imports NavigationMixin for seamless component navigation between views/pages.
import { NavigationMixin } from 'lightning/navigation';
//To import Custom lable
import {label} from 'c/biPspbAvatarResources';
export default class BiPspbIamHcpLandingParent extends NavigationMixin(LightningElement)
{
	BGpp = label.BGpp;
	hcpBannerImage = label.HCP_BANNER_IMAGE;
	patientIconCalender = label.PATIENT_ICON_CALENDER;
	patientIconCenter = label.PATIENT_ICON_CENTER;
	patientIconSecurity = label.PATIENT_ICON_SECURITY;
	hcpFeatureBanner= label.HCP_FEATURE_BANNER;
	patientIconEarn = label.PATIENT_ICON_EARN;
	patientIconHub = label.PATIENT_ICON_HUB;
	patientIconUnique = label.PATIENT_ICON_UNIQUE;
	patientIconVisual= label.PATIENT_ICON_VISUAL;
	iamHcpIconChat= label.IAM_HCP_ICON_CHAT;
	iamHcpIconYoutube= label.IAM_HCP_ICON_YOUTUBE;
	iamHcpIconBooks= label.IAM_HCP_ICON_BOOKS;
	brandedSiteUrl = label.BRANDED_SITEURL;
	hcpEnrollemetUrl = label.HCP_ENROLLEMENT;
	handleDownload() {
		const globalThis = window;
		globalThis.open(label.PATIENT_ENROLMENT_FROM);
		return null;
	}

	get displayBackgroundImage() {
		return `background-image: url('${label.HCP_BANNER_DESKTOP}');background-size: cover; background-repeat: no-repeat;`;
	}

	openHCPpage() {
    const globalThis = window;
    globalThis.location.href = this.brandedSiteUrl + this.hcpEnrollemetUrl;
}

}