// This lightning web component used to show the acute treatment avatar message
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Static Resource
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation';
// To import Custom Labels
import MESSAGE_DESK from '@salesforce/label/c.BI_PSPB_AcuteDeskMessage';
import MESSAGE_MOB from '@salesforce/label/c.BI_PSPB_AcuteMobMessage';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbAcuteVideoAvatar extends LightningElement {
  
  selectedAvatarSrc;
  userid = ID;
  acuteMessage = MESSAGE_MOB;

  // Method to display message for mobile
  displayMessage() {
    this.acuteMessage = MESSAGE_MOB;
    this.template.querySelector(".paranew").style.display = "block";
  }

  // Method to display message for desktop
  displayExpandedMessage() {
    this.acuteMessage = MESSAGE_DESK;
    this.template.querySelector(".paranew").style.display = "none";
  }


  /* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered. */
	// To retrieve the logged in user selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
			if (data) {
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_IMG;
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