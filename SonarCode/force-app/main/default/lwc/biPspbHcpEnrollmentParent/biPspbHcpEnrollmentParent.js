import { LightningElement } from "lwc";
//To import Static resources
import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbHcpEnrollmentParent extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	homeIcon = resource.HOME_ICON;
	beyondGpp = resource.BEYOND_GPP_LOGO;
	footerSrc = resource.FOOTER_COPYRIGHT;
	logoSrc = resource.HEADER_SPEVIGO;
}