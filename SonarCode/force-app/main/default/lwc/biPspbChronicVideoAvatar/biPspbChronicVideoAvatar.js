// This lightning web component is used for display the chronic patient avatar treatment message
// To import Libraries
import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// To import Apex Classes
import GET_LOGGED_IN_USER_ACCOUNT from "@salesforce/apex/BI_PSPB_AvatarCtrl.getLoggedInUserAccount";
import USER_CAREGIVER from "@salesforce/apex/BI_PSPB_AvatarCtrl.userCaregiver";
// To import Static Resource
import DEFAULT_AVATAR_IMG from "@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation";
// To import Custom Labels
import CHRONIC_MOB_MESSAGE from "@salesforce/label/c.BI_PSPB_ChronicMobMessage";
import CHRONIC_DESK_MESSAGE from "@salesforce/label/c.BI_PSPB_ChronicDeskMessage";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
// To get Current UserId
import ID from "@salesforce/user/Id";

export default class BiPspbChronicVideoAvatar extends LightningElement {
  selectedAvatarSrc;
  caregiver = false;
  userid = ID;
  messageText = CHRONIC_MOB_MESSAGE;

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

  /*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
  // To retrieve avatar selected by caregiver
  @wire(USER_CAREGIVER)
  wiredAvatarList({ error, data }) {
    try {
      if (data && data.length !== 0) {
          this.caregiver = true;
          this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c
            ? data[0]?.BI_PSP_AvatarUrl__c
            : DEFAULT_AVATAR_IMG;
      } else if (error) {
        this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
      }
    } catch (err) {
      this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from Lwc
    }
  }

  /*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
  // To retrieve the avatar selected by patient
  @wire(GET_LOGGED_IN_USER_ACCOUNT)
  wiredUserAccounts({ error, data }) {
    try {
      if (data && this.caregiver === false) {
        this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c
        ? data[0]?.BI_PSP_AvatarUrl__c
        : DEFAULT_AVATAR_IMG;
      } else if (error) {
        this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
      }
    } catch (err) {
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