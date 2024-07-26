// This lightning web component is used to Create CommunityUsername for Patient Community before Navigate to any Community Page
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import INSERT_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.insertCommunityUsername";
import LOGIN_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.getCommunityUsername";
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';

export default class BiPspbChatterUsername extends LightningElement {
  // Declaration of variables with @track
  userInputBox = "userInputBox";
  loggedUserAvatar;
  communityUsername;
  showError = false;
  showErrorForNull = false;
  normal = true;
  showSpinner;
  errorImg = label.WARNING_ICON;
  userId = label.ID;
  // //ConnectedCallback used to get the PATH and  find the site is Branded or Unassigned
  connectedCallback() {
    try {
      this.avatarFunction();
      this.detectBrandedOrUnassigned();
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); // Catching Potential Error for try-catch
    }
  }
  //Find the site is Branded or Unassigned and do the navigation accordingly
  avatarFunction() {
      USER_AVATAR()
        .then((result) => {
          if (result.length > 0 && result[0].BI_PSP_AvatarUrl__c) {
            this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
          }
        })
        .catch((err) => {
          this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT); // then-catch error
        });
  }
  //create Community username and Validate  if Username is null,Username equal to firstName,lastName,email and phone of Account.
  handleCommunityUsername(event) {
    this.communityUsername = event.target.value;
    this.showError = false;
    this.showErrorForNull = false;
    this.normal = true;
  }
  // To save Community Username
  handleSave() {
      this.userInputBox = "userInputBox";
      if (!this.communityUsername) {
        //If Username is null and the save button is clicked show errors
        this.showErrorForNull = true;
        this.showError = false;
        this.normal = false;
        this.userInputBox = "userInputBoxError";
        return;
      }
      this.showSpinner = true;
      LOGIN_COMMUNITY_USERNAME()
        .then((result) => {
          this.userInputBox = "userInputBox";
          //Validate the Entered Name and Raise error if condition not met
          if (this.isUsernameInvalid(result)) {
            this.userInputBox = "userInputBoxError";
            this.showError = true;
            this.showErrorForNull = false;
            this.normal = false;
            this.showSpinner = false;
          }
          //if all Validations are cleared then Create the Username  and Navigate to all post Page
          else {
            if (this.communityUsername) {
              this.userInputBox = "userInputBox";
              this.normal = true;
              this.showErrorForNull = false;
              this.showError = false;
              this.showSpinner = true;
              this.createUsernameAndNavigate();
            }
          }
        })
        .catch((err) => {
          this.userInputBox = "userInputBox";
          this.showSpinner = false;
          this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT); // Catching Potential Error for then-catch
        });
  }
  isUsernameInvalid(result) {
    return (
      result &&
      ((this.communityUsername &&
        result.FirstName &&
        this.communityUsername
          .toLowerCase()
          .includes(result.FirstName.toLowerCase())) ||
        (result.LastName &&
          this.communityUsername
            .toLowerCase()
            .includes(result.LastName.toLowerCase())) ||
        (result.PersonEmail &&
          this.communityUsername
            .toLowerCase()
            .includes(result.PersonEmail.toLowerCase())) ||
        (result.Phone &&
          this.communityUsername
            .toLowerCase()
            .includes(result.Phone.toLowerCase())))
    );
  }
  createUsernameAndNavigate() {
    INSERT_COMMUNITY_USERNAME({ username: this.communityUsername })
      .then(() => {
        const globalThis = window;
        globalThis.location.assign(label.SLASH + this.urlName + label.ALL_POST_URL);
      })
      .catch((err) => {
        this.showSpinner = false;
        this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT); // Catching Potential Error for then-catch
      });
  }

  // To check the site is branded or unassigned
  detectBrandedOrUnassigned() {
    try {
      const globalThis = window;
      const CURRENT_URL = globalThis.location.href;
      const URL_OBJECT = new URL(CURRENT_URL);
      const PATH = URL_OBJECT.pathname;
      const PATH_COMPONENTS = PATH.split(label.SLASH);
      const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
        [label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(
          component.toLowerCase()
        )
      );

      //set the url and navigation are done within branded site
      if (
        DESIRED_COMPONENTS &&
        DESIRED_COMPONENTS.toLowerCase() === label.BRANDED_URL.toLowerCase()
      ) {
        this.urlName = label.BRANDED_URL;
      } else {
        this.urlName = label.UNASSIGNED_URL;
      }
    } catch (err) {
      this.showToast(label.ERROR_MESSAGE, err.body.message, label.ERROR_VARIANT); // Catching Potential Error for try-catch
    }
  }
  // show the Toast message if the catch runs
  showToast(title, message, variant) {
    if (typeof window !== "undefined") {
      const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      });
      this.dispatchEvent(event);
    }
  }
}