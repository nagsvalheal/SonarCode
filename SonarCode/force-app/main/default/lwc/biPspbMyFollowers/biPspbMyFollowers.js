//This component is used to display all followers Who are following the logedUser and the user can follow and unfollow others.
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import FOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.followUser";
import DISPLAY_FOLLOWERS from "@salesforce/apex/BI_PSPB_FollowUserCtrl.getMyFollowers";
import UNFOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.unfollowUser";
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';
export default class BiPspbMyFollowers extends LightningElement {
  // Declaration of variables with @track
  userNames;
  numberOfFollowers = 0;
  followingPopup = false;
  followingPopupConfirmation = false;
  followOrUnfollowButton = false;
  follow = false;
  following = false;
  selectedUserId;
  popup = false;
  selectedUser;
  avatarFollow;
  isLoading;
  loggedUserAvatar;
  isDesktop = false;
  button;
  showToastMessage = false;
  showToastForFollowing = false;
  showToastForUnfollow = false;
  followPopup = false;
  followPopupConfirmation = false;
  //Declaration of variables
  tickIcon = label.TICK_ICON;
  handleResizeBound;
  allpostImg = label.ALL_POST;
  followersCount = false;
  //This connected callback used to get Avatar,Get followers list and resize the desktop view when popup opens
  connectedCallback() {
    try {
      this.retrieveFollowers();
      this.retrieveAvatar();
      this.isDesktop = this.isDesktopView();
      // Bind the event handler once and store it in a variable
      this.handleResizeBound = this.handleResize.bind(this);
      let globalThis = window;
      // Add the event listener using the bound handler
      globalThis.addEventListener("resize", this.handleResizeBound);
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); // Catching Potential Error
    }
  }

  //Used to remove the Event from the fixed screen
  disconnectedCallback() {
      window.removeEventListener("resize", this.handleResizeBound);
  }

  //set the desktop view to fix the screen for popup
  handleResize() {
    this.isDesktop = this.isDesktopView();
  }

  // This function used to Fix the screen as static if the popup opens as per requirement
  isDesktopView() {
    let globalThis = window;
    return globalThis.innerWidth <= 2024 || globalThis.innerWidth >= 200;
  }

  //Settimeout function used to close the ToastMessage automatically few SECONDS after it displays
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  handleToastTemplate() {
    try {
      this.delay(6000)
        .then(() => {
          this.showToastMessage = false;
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); // catch Exception
    }
  }

  // To get avatar of the users
  retrieveAvatar() {
    try{
      USER_AVATAR()
        .then((result) => {
          if (result.length > 0 && result[0].BI_PSP_AvatarUrl__c) {
            this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
          }
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catching Potential Error for then-catch
        });
      } catch (error) {
        this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); // Catching Potential Error for try-catch
      }
  }

  // To retrieve all followers list
  retrieveFollowers() {
    try{
    this.isLoading = true;
    DISPLAY_FOLLOWERS()
        .then((result) => {
            if (result && result.length > 0) {
                let followers = result.filter(follower => follower?.BI_PSP_Type__c === label.FOLLOWER_LABEL);
                let followingList = result.filter(follower => follower?.BI_PSP_Type__c === label.FOLLOWING_LABEL);

                this.numberOfFollowers = followers.length;
                this.followersCount = this.numberOfFollowers > 0;

                if (this.numberOfFollowers > 0) {
                    this.userNames = followers.map((follower) => ({
                        ...follower,
                        followOrUnfollowButton: followingList.some(
                            (obj) => obj.BI_PSP_CareProgramEnrolleeFollow__c === follower?.BI_PSP_CareProgramEnrolleeFollow__c
                        ) ? label.FOLLOWING_LABEL : label.FOLLOW_LABEL,
                        userAvatarForEnrollee: follower.BI_PSP_CareProgramEnrolleeFollow__r?.BI_PSP_AvatarUrl__c || this.loggedUserAvatar
                    }));
                }
            } else {
                this.numberOfFollowers = 0;
                this.followersCount = false;
            }
            this.isLoading = false;
        })
        .catch((error) => {
            this.isLoading = false;
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
        });
    } catch (error) {
        this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); // Catching Potential Error for try-catch
    }
}

  // To unfollow the user
  handleUnFollowConfirmation() {
    try{
      this.isLoading = true;
      this.closeToastMessage();
      UNFOLLOW_USER({
        enrolleeIdToUnFollow: this.enrolleeIdToFollow
      })
        .then(() => {
          this.userNames = this.userNames.map((follower) => ({
            ...follower,
            followOrUnfollowButton:
              follower.BI_PSP_CareProgramEnrolleeFollow__c === this.enrolleeIdToFollow
                ? label.FOLLOW_LABEL
                : follower.followOrUnfollowButton
          }));
          this.showToastMessage = true;
          this.showToastForUnfollow = true;
          this. showToastForFollowing = false;
          this.isLoading = false;
          this.handleToastTemplate();
        })
        .catch((error) => {
          this.isLoading = false;
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catching Potential Error for then-catch
        });
      this.followingPopup = false;
      this.followingPopupConfirmation = false;
      document.body.style.overflow = "";
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); // Catching Potential Error for try-catch
    }
  }
  // To follow the user
  handleFollowConfirmation() {
    try{
      this.isLoading = true;
      this.closeToastMessage();
      FOLLOW_USER({
        enrolleeIdToFollow: this.enrolleeIdToFollow
      })
        .then(() => {
          this.userNames = this.userNames.map((follower) => ({
            ...follower,
            followOrUnfollowButton:
              follower.BI_PSP_CareProgramEnrolleeFollow__c === this.enrolleeIdToFollow
                ? label.FOLLOWING_LABEL
                : follower.followOrUnfollowButton
          }));
          this.showToastMessage = true;
          this.showToastForFollowing = true;
          this.showToastForUnfollow = false;
          this.isLoading = false;
          this.handleToastTemplate();
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catching Potential Error for then-catch
        });
      this.followPopup = false;
      this.followPopupConfirmation = false;
      document.body.style.overflow = "";
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); // Catching Potential Error for try-catch
    }
  }
  // To close the popups
  closePopup() {
    this.followPopup = false;
    this.followPopupConfirmation = false;
    this.followingPopup = false;
    this.followingPopupConfirmation = false;
    document.body.style.overflow = "";
  }

  // To open popup when follow button is clicked
  handleFollowPopupButtonClick() {
    this.follow = false;
    this.followPopup = false;
    this.followPopupConfirmation = true;
  }

  // To close toast message
  closeToastMessage() {
    this.showToastMessage = false;
  }

  // To handle following button when clicked
  handleFollowingPopupButtonClick() {
    this.following = false;
    this.followingPopup = false;
    this.followingPopupConfirmation = true;
    document.body.style.overflow = this.isDesktop ? "hidden" : "";
  }

  // To open popup when following button is clicked
  handleFollowingButtonClick(event) {
    this.selectedUserId = event.target.dataset.id;
    this.selectedUser = event.target.dataset.username;
    this.enrolleeIdToFollow = event.target.dataset.enrollee;
  }
  handleFollowButtonClick(event) {
    this.handleButtonClick(event, false);
  }
  
  handleFollowUserButton(event) {
    this.handleButtonClick(event, true);
  }
  handleButtonClick(event, isConfirmation) {
    this.selectedUserId = event.target.dataset.id;
    this.selectedUser = event.target.dataset.username;
    this.enrolleeIdToFollow = event.target.dataset.enrollee;
    this.button = event.target.dataset.following;
    this.avatarFollow = event.target.dataset.avatar;
    
    // Determine the state of follow or following
    let isFollow = this.button === label.FOLLOW_LABEL;
    
    // Set the popup state based on whether it's a confirmation popup or not
    if (isFollow) {
      this.follow = !isConfirmation;
      this.followPopup = !isConfirmation;
      this.followPopupConfirmation = isConfirmation;
    } else {
      this.following = !isConfirmation;
      this.followingPopup = !isConfirmation;
      this.followingPopupConfirmation = isConfirmation;
    }
    // Adjust the body overflow based on the device type
    document.body.style.overflow = this.isDesktop ? "hidden" : "";
  }
  // show the Toast message if the catch runs
  showToast(title, message, variant) {
    if (typeof window !== "undefined") {
      let event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      });
      this.dispatchEvent(event);
    }
  }
}