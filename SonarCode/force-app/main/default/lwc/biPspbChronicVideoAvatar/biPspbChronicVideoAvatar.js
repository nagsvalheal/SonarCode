// This lightning web component is used for display the chronic patient avatar treatment message
// To import Libraries
import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Static Resource
import DEFAULT_AVATAR_IMG from "@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation";
// To import Custom Labels
import CHRONIC_MOB_MESSAGE from "@salesforce/label/c.BI_PSPB_ChronicMobMessage";
import CHRONIC_DESK_MESSAGE from "@salesforce/label/c.BI_PSPB_ChronicDeskMessage";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import TREATMENT_VIDEO_AVATAR_HEADING from "@salesforce/label/c.BI_PSP_TreatmentVideoAvatarHeading";
import VIDEO_AVATAR_MESSAGE_CHRONIC from "@salesforce/label/c.BI_PSPB_VideoAvatarMessageChronic";
// To get Current UserId
import ID from "@salesforce/user/Id";

export default class BiPspbChronicVideoAvatar extends LightningElement {
  selectedAvatarSrc;
  caregiver = false;
  userid = ID;
  messageText = CHRONIC_MOB_MESSAGE;
  treatmentVideoAvatarHeading = TREATMENT_VIDEO_AVATAR_HEADING;
  videoAvatarMessageChronic =  VIDEO_AVATAR_MESSAGE_CHRONIC;

  // Method to display message for mobile
  displayMessage() {
    this.messageText = CHRONIC_MOB_MESSAGE;
    this.template.querySelector(".paranew").style.display = "block";
  }

  // Method to display message for desktop
  displayExpandedMessage() {
    this.messageText = CHRONIC_DESK_MESSAGE;
    this.template.querySelector(".paranew").style.display = "none";
  }

    /* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered. */
	// To retrieve the logged in user name and selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
			if (data) {
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_AVATAR_IMG;
				}
			else if (error) {
        this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex			}
		}
    }catch (err) {
      this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from Lwc
		}
  }

  // showToast used for all the error messages caught
  showToast(title, message, variant) {
    let event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }
}