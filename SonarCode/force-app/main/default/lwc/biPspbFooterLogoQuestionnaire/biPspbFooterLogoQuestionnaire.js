//This component is used as Footer for questionnaire pages
// To import Libraries
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import an image for logo in footer.
import IMAGE_FOR_FOOTER from '@salesforce/resourceUrl/BI_PSP_BiFooter';
// To import Custom Labels
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import CONTACT_US from '@salesforce/label/c.BI_PSPB_ContactUs';
import CONTACT_US_LOGIN from '@salesforce/label/c.BI_PSPB_ContactUsLogin';
import PRIVACY_LOGIN from '@salesforce/label/c.BI_PSPB_PrivacyLogin'
import TERMS_LOGIN from '@salesforce/label/c.BI_PSPB_TermsOfUseLogin'
import TERMS_OF_USE from '@salesforce/label/c.BI_PSPB_TermsOfUse';
import PRIVACY_NOTICE from '@salesforce/label/c.BI_PSPB_PrivacyNotice';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BR_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import QUESTIONNAIRE_ONE_URL from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireUrl';
import QUESTIONNAIRE_TWO_URL from '@salesforce/label/c.BI_PSP_AvatarQuestionnaireTwoUrl';
import BR_SITEURL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import PUBLIC_PRIVACY_NOTICE from '@salesforce/label/c.BI_PSPB_PublicPrivacyNotice';
import PUBLIC_TERMS_OF_USE from '@salesforce/label/c.BI_PSPB_PublicTermsOfUse';
import PUBLIC_CONTACT_US from '@salesforce/label/c.BI_PSPB_PublicContactUs';
import CAREGIVER_FIRST_AVATAR from '@salesforce/label/c.BI_PSPB_CaregiverFirstAvatar';
// To import User Id.
import Id from '@salesforce/user/Id';
export default class BiPspbFooterLogoQuestionnaire extends LightningElement {
  // Declaring variables.
  decidingBrandedOrUnassigned;
  @track userId = Id;
  @track decisionForNavBar=false;
  //Assigning all imported variables to a variable to use in HTML.
  imageOfLogo = IMAGE_FOR_FOOTER;
  questionnairePageOne=QUESTIONNAIRE_ONE_URL;
	questionnairePageTwo=QUESTIONNAIRE_TWO_URL;
  publicPrivacyNotice=PUBLIC_PRIVACY_NOTICE;
  publicTermsOfUse=PUBLIC_TERMS_OF_USE;
  publicContactUs=PUBLIC_CONTACT_US;
  caregiverFirstAvatar = CAREGIVER_FIRST_AVATAR;
  //ConnectedCallback used to find the site is Branded or Unassigned.
  connectedCallback() {
    try {
      this.detectBrandedOrUnassigned();
      this.detectPageUrl();
    } catch (err) {
      this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Result Null/other Exception
    }
  }

  // To detect the site is branded or unassigned
  detectBrandedOrUnassigned() {
    try {
      let globalThis = window;
      const currentURL =globalThis.location?.href; 
      const urlObject = new URL(currentURL);
      const path = urlObject.pathname;
      const pathComponents = path.split('/');
      const desiredComponent = pathComponents.find((component) =>
        [BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
          component.toLowerCase()
        )
      );
      if (
        desiredComponent &&
        desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()
      ) {
        this.decidingBrandedOrUnassigned = BR_SITE_URL;
      }
      //set the url and navigations are done within unassigned site
      else {
        this.decidingBrandedOrUnassigned = UNASSIGNED_SITE_URL;
      }
    } catch (err) {
      this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Result Null/other Exception
    }
  }

  detectPageUrl()
  {
    let globalThis = window;
    const currentTabName = globalThis.location?.pathname.split('/').pop();
		// Get the pathname from the URL
		let pathname =globalThis.location?.pathname;
		if (pathname === BR_SITEURL || pathname === '' || currentTabName === this.questionnairePageOne ||
      currentTabName === this.questionnairePageTwo || currentTabName === this.publicPrivacyNotice || 
      currentTabName === this.publicTermsOfUse || currentTabName === this.publicContactUs ||
      currentTabName === this.caregiverFirstAvatar
    )
      {
        this.decisionForNavBar=true;
      }else{
        this.decisionForNavBar=false;
      }
  }
  

  // Navigate to Contact Us page.

  contactUs()
  {
    try {
      if (!this.userId) {
        window.location.assign(CONTACT_US);
      } else {
        if(this.decisionForNavBar)
          {
            window.location.assign(CONTACT_US);
          }else{
            window.location.assign(this.decidingBrandedOrUnassigned + CONTACT_US_LOGIN);
          }
      }

    } catch (err) {
      this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Result Null/other Exception
    }
  }
  // Navigate to Terms of use page.

  termsOfUse() 
  {
    try {
      if (!this.userId) {
        window.location.assign(TERMS_OF_USE);
      } else {
        if(this.decisionForNavBar)
          {
            window.location.assign(TERMS_OF_USE);
          }else{
            window.location.assign(this.decidingBrandedOrUnassigned + TERMS_LOGIN);
          }
      }
    } catch (err) {
      this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Result Null/other Exception
    }
  }
  // Navigate to Privacy Notice page.

  privacyNotice() 
  {
    try {
      if (!this.userId) {
        window.location.assign(PRIVACY_NOTICE);
      }
      else {
        if(this.decisionForNavBar)
          {
            window.location.assign(PRIVACY_NOTICE);
          }else{
            window.location.assign(this.decidingBrandedOrUnassigned + PRIVACY_LOGIN);
          }
      }
    } catch (err) {
      this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Result Null/other Exception
    }
  }
  // show the Toast message if the catch runs

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