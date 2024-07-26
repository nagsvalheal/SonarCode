// The Lightning Web Component displays All posts, providing a concise overview of each post's content.
// To import Libraries
import { LightningElement, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import USER_ACCOUNT_ID from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
import ALL_POST_FEED from "@salesforce/apex/BI_PSPB_FeedItemCtrl.getAllPost";
import SAVE_COMMENT_OPTION from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.insertComment";
import EDIT_COMMENT from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.editComment";
import VIEW_COMMENTS from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.viewComments";
import SOFTDELETE_COMMENT_ITEM from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.softDeleteFeedCommentItem";
import FOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.followUser";
import UNFOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.unfollowUser";
// import TOTAL_THUMBSUP from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.totalThumbsUp";
// import TOTAL_SMILE from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.totalSmile";
// import TOTAL_FOLDEDHANDS from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.totalFoldedHands";
// import TOTAL_HEART from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.totalHeart";
// import TOTAL_THINKINGFACE from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.totalThinkingFace";
import CHECK_FOLLOW_STATUS from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.checkFollowingStatus";
import SAVE_EMOJI from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.saveEmoji";
import REACTIONSBY_FEED_ID from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.getReactionsByFeedItemId";
import HARDDELETE_EMOJI_REACTION from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.deleteEmojiReaction";

// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';

export default class BiPspbAllPost extends LightningElement {
  // Declaration of variables with @track
  @track navigationCreatePostId;
  @track editTheCommentTxt = "editTheCommentTxt"; //css attribute call
  @track userId = label.ID;
  @track userAccountId;
  @track allPost = [];
  @track accountId;
  @track followAvatar;
  @track isLoading;
  @track loggedUserAvatar;
  @track saveEmojiResult = [];
  @track editComment;
  @track commentId;
  @track postItemId;
  @track feedCommentItemIdToDelete;
  @track followFollowingBtn;
  @track commentBox;
  @track displayComment = [];
  @track avatarDataForReaction;
  @track emojiText;
  @track emojiTextSmile;
  @track emojiTextHands;
  @track emojiTextHeart;
  @track emojiTextThinking;
  @track postIdForFollow;
  @track showSpinner;
  @track thumbsUpResult;
  @track smileResult;
  @track foldedHandsResult;
  @track heartResult;
  @track thinkingFaceResult;
  @track feedItemIdEmoji;
  @track displayHide = "";
  @track selectedUserId;
  @track checkFollowBtn;
  @track followUserName;
  @track followAccountId;
  @track followAvatarResult;
  @track countRecord;
  @track getComments = false;
  @track isFirstPopupOpen = false;
  @track showEditTheComment = false;
  @track isThreeDotClassOpen = false;
  @track showDeleteToastMsg = false;
  @track showFollowToastMsgForMbl = false;
  @track showUnfollowToastMsgForMbl = false;
  @track emojiUnfollowConfirmation = false;
  @track noReactionForThisEmoji = false;
  @track isSecondPopupOpen = false;
  @track emojiFollowingProfile = false;
  @track emojiFollowProfile = false;
  @track isDesktop = false;
  @track emojiFollowConfirmation = false;
  @track showAllPost = false;
  @track followPopupAtFeed = false;
  @track followingPopupAtFeed = false;
  @track followPopupConfirmationAtFeed = false;
  @track followingPopupConfirmationAtFeed = false;
  @track showFollowToastMsg = false;
  @track showUnfollowToastMsg = false;
  @track showEmojiPopup = false;
  @track displayTemplateThumbsUp = true;
  @track displayTemplateSmile = false;
  @track displayTemplateFoldedHands = false;
  @track displayTemplateHeart = false;
  @track displayTemplateThinkingFace = false;
  //Declaration of variables
  imgThumbs = label.THUMBS_UP_IMG;
  imgSmile = label.SMILE_IMG;
  imgHands = label.HANDS_FOLDED_IMG;
  imgLike = label.HEART_IMG;
  imgThought = label.THOUGHTFUL_IMG;
  deleteImg = label.DELETE_ICON_IMG;
  allPostImg = label.NO_FEED_IMG;
  deleteToast = label.TICK_ICON;
  noComment = label.NO_COMMENT_IMG;
  comment = "";
  commentOption = [];
  editImg = label.EDIT_ICON;
  handleResizeBound;
  isCurrentUserCommentCreator = false;

  // To fetch the account Id of the user
  @wire(USER_ACCOUNT_ID)
  wiredUserIdToAccId({ error, data }) {
    try {
      if (data && data.length > 0) {
        this.userAccountId = data[0].Id;
        this.getAllPosts();
      } else if (error) {
        this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); //if data null throw exception
      } else {
        this.showToast(label.ERROR_MESSAGE, label.ACCOUNT_NOT_FOUND, label.ERROR_VARIANT); // Catch Exception
      }
    } catch (err) {
      this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT); // Catch Exception
    }
  }
  // //This connected callback used to get Avatar for reaction,post and comments,get local storage value from notification navigation and detect the site Branded or Unbranded
  connectedCallback() {
    try {
      this.getAllPosts();
      this.detectBrandedOrUnassigned();
      this.checkAllReactions();
      this.avatarImgLeftSide();
      this.getComments = false;
      this.showDeleteToastMsg = false;
      this.isDesktop = this.isDesktopView();
      // Bind the event handler once and store it in a variable
      this.handleResizeBound = this.handleResize.bind(this);
      let globalThis = window;
      // Add the event listener using the bound handler
      globalThis.addEventListener("resize", this.handleResizeBound);
      // Navigation from Notification to view the following user Creates the Post
      let selectedItemIdforCreatepost = globalThis.localStorage.getItem(
        "selectedItemIdforCreatepost"
      );
      if (selectedItemIdforCreatepost) {
        this.navigationCreatePostId = selectedItemIdforCreatepost;
        globalThis.localStorage.removeItem("selectedItemIdforCreatepost");

      }
      // Use MutationObserver to observe changes in the DOM
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
          const POST_ELEMENT_BY_CLASS = this.template.querySelector(
            "." + this.navigationCreatePostId
          );
          if (POST_ELEMENT_BY_CLASS) {
            POST_ELEMENT_BY_CLASS.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
            observer.disconnect(); // Stop observing once the element is found
          }
        });
      });
      // Start observing the target node for configured mutations
      observer.observe(this.template, { childList: true, subtree: true });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // catch Exception
    }
  }
  //Used to remove the Event from the fixed screen
  disconnectedCallback() {
    try {
      window.removeEventListener("resize", this.handleResizeBound);
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // catch Exception
    }
  }

  //set the desktop view to fix the screen for popup
  handleResize() {
    this.isDesktop = this.isDesktopView();
  }

  // This function used to Fix the screen as static if the popup opens as per requirement
  isDesktopView() {
    let globalThis = window;
    const VIEWPORT_PATH = globalThis.innerWidth;
    return VIEWPORT_PATH <= 2024 || VIEWPORT_PATH >= 200;
  }
  //Settimeout function used to close the ToastMessage automatically few SECONDS after it displays
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  handleToastTemplate() {
    try {
      this.delay(6000)
        .then(() => {
          this.showDeleteToastMsg = false;
          this.showFollowToastMsg = false;
          this.showUnfollowToastMsg = false;
          this.showFollowToastMsgForMbl = false;
          this.showUnfollowToastMsgForMbl = false;
          this.showDeleteToastMsgForComment = false;
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // catch Exception
    }
  }
  //Get allPost
  getAllPosts() {
    this.isLoading = true;
        ALL_POST_FEED()
            .then((data) => {
                if ((data && data.length === 0) || data === null) {
                    this.isLoading = false;
                    this.showAllPost = false;
                } else if (data && data.length > 0) {
                    this.showAllPost = true;
                    this.isLoading = false;
                    this.allPost = data;
                   
                    // this map is to display allPost page with specific conditions after got all list of raw data from apex
                    this.allPost = data.map((post) => ({
                        ...post,
                        // calculate the time of post posted
                        formattedTimeDifference: this.calculateTimeDifference(post.CreatedDate),
                        // display total comments count of the post
                        CommentCount: post.BI_PSP_FeedComment__r ? post.BI_PSP_FeedComment__r.length : 0,
                        // display total reaction count of the post
                        CountEmoji: post.BI_PSP_EmojiReactionController__r ? post.BI_PSP_EmojiReactionController__r.length : 0,
                        checkFollowBtn: post.BI_PSP_FollowStatus__c === label.FOLLOWING_LABEL ? label.FOLLOWING_LABEL : label.FOLLOW_LABEL,
                        checkFollowStatusButton: this.userAccountId === post.BI_PSP_CareProgramEnrollee__c ? false : true,
                        postYouName: this.userAccountId === post.BI_PSP_CareProgramEnrollee__c ? label.YOU_LABEL
                            : post.BI_PSP_CareProgramEnrollee__r.BI_PSP_CommunityUsername__c !== null
                                ? post.BI_PSP_CareProgramEnrollee__r.BI_PSP_CommunityUsername__c
                                : label.NO_USERNAME_LABEL,
                        imageAvatar: post.BI_PSP_CareProgramEnrollee__r.BI_PSP_AvatarUrl__c,
                        toReact: true,
                        reactionResult: "",
                        commentBox: false,
                        displayHide: "",
                        showEmojiPopup: false,
                        emojiYouReacted: ""
                    }));
                    this.checkAllReactions();
                    this.commentBox = true;
                }
                else{
                  this.isLoading = false;
                this.showToast(label.ERROR_MESSAGE, label.POST_ERROR, label.ERROR_VARIANT);
                }
            })
            .catch((error) => {
                this.isLoading = false;
                this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT); // data null exception
            })
            .catch((err) => {
                this.isLoading = false;
                this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT); // catch Exception
            });
    }
   

  // To get avatar of the logged in user
  avatarImgLeftSide() {
      USER_AVATAR()
        .then((result) => {
          if (result.length > 0 && result[0].BI_PSP_AvatarUrl__c) {
            this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
          }
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
        });
  }

  //After clicking create a new post go to createPost page with checking communityUsername
  goToCreatePost() {
    try {
      CHECK_COMMUNITY_USERNAME()
        .then((result) => {
          if (result === true) {
            window.location.assign(label.SLASH + this.urlq + label.CREATEPOST_URL);
          } else if (result === false) {
            window.location.assign(label.SLASH + this.urlq + label.COMMUNITY_USERNAME_URL);
          } else {
            this.showToast(label.ERROR_MESSAGE, label.ERROR_MESSAGE, label.ERROR_VARIANT); // catch Exception
          }
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  // Formate the Date with Created Dated like 2 yearsAgo,30 MINUTES ago,etc
  calculateTimeDifference(createdDate) {
    const CURRENT_TIME = new Date();
    const POST_TIME = new Date(createdDate);
    const TIME_DIFFERENCE = CURRENT_TIME - POST_TIME;
    const SECONDS = Math.floor(TIME_DIFFERENCE / 1000);
    const MINUTES = Math.floor(SECONDS / 60);
    const HOURS = Math.floor(MINUTES / 60);
    const DAYS = Math.floor(HOURS / 24);
    const MONTHS = Math.floor(DAYS / 30);
    const YEARS = Math.floor(DAYS / 365);
    if (YEARS > 0) {
      return `${YEARS} ${YEARS === 1 ? label.CHATTER_YEAR : label.CHATTER_YEARS} ${label.CHATTER_AGO}`;
    }
    if (MONTHS > 0) {
      return `${MONTHS} ${MONTHS === 1 ? label.CHATTER_MONTH : label.CHATTER_MONTHS} ${label.CHATTER_AGO}`;
    }
    if (DAYS > 0) {
      return `${DAYS} ${DAYS === 1 ? label.CHATTER_DAY : label.CHATTER_DAYS} ${label.CHATTER_AGO}`;
    }
    if (HOURS > 0) {
      return `${HOURS} ${HOURS === 1 ? label.CHATTER_HOUR : label.CHATTER_HOURS} ${label.CHATTER_AGO}`;
    }
    if (MINUTES > 0) {
      return `${MINUTES} ${MINUTES === 1 ? label.CHATTER_MINUTE : label.CHATTER_MINUTES} ${label.CHATTER_AGO}`;
    }
    return `${SECONDS} ${SECONDS === 1 ? label.CHATTER_SECOND : label.CHATTER_SECONDS} ${label.CHATTER_AGO}`;
  }

  //After clicking the react button show the popup with 5 emoji's (only clicked post's emoji button)
  ReactionBtn(event) {
    const POST_ID = event.currentTarget.dataset.customFeeditemId;
    this.allPost = this.allPost.map((post) => ({
      ...post,
      showEmojiPopup: post.Id === POST_ID ? !post.showEmojiPopup : false,
      commentBox: false,
      displayHide: ""
    }));
  }

  // After clicking the Emoji's  save the details
  reactWith(event) {
    //show loading spinner for react
    this.showSpinner = true;
    const FEED_ID = event.currentTarget.dataset.customFeeditemId;
    const EMOJI_TYPE = event.currentTarget.dataset.reactionType;
    //call apex to store emoji saved information
    try {
      SAVE_EMOJI({
        reactions: EMOJI_TYPE,
        feedItemId: FEED_ID
      })
        .then((result) => {
          //Here it close spinner after react clicked
          this.showSpinner = false;
          this.saveEmojiResult = Array.isArray(result) ? result : [result];
          if (this.saveEmojiResult && this.saveEmojiResult.length > 0) {
            this.resultFinal = true;
            this.allPost = this.allPost.map((post) => {
              if (post.Id === FEED_ID) {
                return {
                  ...post,
                  showEmojiPopup: false,
                  toReact: false,
                  emojiYouReacted: this.getResultEmoji(
                    result.BI_PSP_ReactionResult__c
                  ),
                  CountEmoji: post.CountEmoji + 1,
                  emojiReactedImg: this.getResultEmojiImg(
                    result.BI_PSP_ReactionResult__c
                  )
                };
              }
              return post;
            });
          } else {
            this.showSpinner = false;
            this.allPost = this.allPost.map((post) => ({
              ...post,
              showEmojiPopup: false
            }));
            this.showToast(label.ERROR_MESSAGE, label.UNABLE_TO_REACT, label.ERROR_VARIANT); // catch Exception
          }
        })
        .catch((error) => {
          this.showSpinner = false;
          this.allPost = this.allPost.map((post) => ({
            ...post,
            showEmojiPopup: false
          }));
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
        });
    } catch (error) {
      this.showSpinner = false;
      this.allPost = this.allPost.map((post) => ({
        ...post,
        showEmojiPopup: false
      }));
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //after insert update the emojiBox
  getResultEmoji(reactionResult) {
    switch (reactionResult) {
      case label.THUMSUP_VALUE:
        return label.THUMSUP_NAME;
      case label.SMILE_VALUE:
        return label.SMILE_NAME;
      case label.HANDSFOLDED_VALUE:
        return label.HANDSFOLDED_NAME;
      case label.HEART_VALUE:
        return label.HEART_NAME;
      case label.THOUGHTFUL_VALUE:
        return label.THOUGHTFUL_NAME;
      default:
        return "";
    }
  }

  // after insert update the emojiBox image
  getResultEmojiImg(reactionResult) {
    switch (reactionResult) {
      case label.THUMSUP_VALUE:
        return this.imgThumbs;
      case label.SMILE_VALUE:
        return this.imgSmile;
      case label.HANDSFOLDED_VALUE:
        return this.imgHands;
      case label.HEART_VALUE:
        return this.imgLike;
      case label.THOUGHTFUL_VALUE:
        return this.imgThought;
      default:
        return "";
    }
  }

  //check the reactions if already reacted or not (if any changes made in myPost page)
  checkAllReactions() {
    this.allPost.forEach((post) => {
      this.checkReactions(post.Id);
    });
  }

  // get the id of the post and do the changes accordingly
  checkReactions(postId) {
    try {
      REACTIONSBY_FEED_ID({ feedItemId: postId })
        .then((result) => {
          if (result && result.length > 0) {
            const REACTION = parseInt(result, 10); // Assuming result is a numeric string
            const EMOJI_MAP = {
              1: label.THUMSUP_NAME,
              2: label.SMILE_NAME,
              3: label.HANDSFOLDED_NAME,
              4: label.HEART_NAME,
              5: label.THOUGHTFUL_NAME
            };
            this.allPost = this.allPost.map((post) => {
              if (post.Id === postId) {
                post.toReact = REACTION === undefined || isNaN(REACTION);
                post.emojiYouReacted = EMOJI_MAP[REACTION] || "None";
                switch (post.emojiYouReacted) {
                  case label.THUMSUP_NAME:
                    post.emojiReactedImg = this.imgThumbs || "👍";
                    break;
                  case label.SMILE_NAME:
                    post.emojiReactedImg = this.imgSmile || "😊";
                    break;
                  case label.HANDSFOLDED_NAME:
                    post.emojiReactedImg = this.imgHands || "🙏";
                    break;
                  case label.HEART_NAME:
                    post.emojiReactedImg = this.imgLike || "❤️";
                    break;
                  case label.THOUGHTFUL_NAME:
                    post.emojiReactedImg = this.imgThought || "🤔";
                    break;
                  default:
                    post.emojiReactedImg = "";
                    break;
                }
              }
              return post;
            });
          } else {
            this.showToast(label.ERROR_MESSAGE, label.ERROR_MESSAGE, label.ERROR_VARIANT); // Catching Potential Error
          }
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catching Potential Error
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catching Potential Error
    }
  }

  // To unReact the post
  unreact(event) {
    this.allPost = this.allPost.map((post) => ({
      ...post,
      commentBox: false
    }));
    //show loading spinner for unReact
    this.showSpinner = true;
    this.showEmojiPopup = false;
    const FEED_ID = event.currentTarget.dataset.customFeeditemId;
    //Delete the Emoji data
    try {
      HARDDELETE_EMOJI_REACTION({ feedItemId: FEED_ID })
        .then(() => {
          this.allPost = this.allPost.map((post) => {
            if (post.Id === FEED_ID) {
              return {
                ...post,
                toReact: true,
                CountEmoji: post.CountEmoji - 1
              };
            }
            return post;
          });
          //Here it close spinner after unReact
          this.showSpinner = false;
        })
        .catch((error) => {
          this.showSpinner = false;
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
          this.checkAllReactions();
        });
    } catch (error) {
      this.showSpinner = false;
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //close the emoji reaction popup
  closeEmojiPopup() {
    this.allPost = this.allPost.map((post) => ({
      ...post,
      showEmojiPopup: false
    }));
  }

  // this popup has the information about the reacted user's for the particular post
  closeSecondPopup(event) {
    this.displayTemplateThumbsUp = true;
    this.displayTemplateSmile = false;
    this.displayTemplateFoldedHands = false;
    this.displayTemplateHeart = false;
    this.displayTemplateThinkingFace = false;
    this.noReactionForThisEmoji = false;
    this.isSecondPopupOpen = false;
    document.body.style.overflow = "";
    this.currentPostId = null;
    const CLICKED_POST_ID = event.currentTarget.dataset.customFeeditemId;
    this.allPost = this.allPost.map((post) => ({
      ...post,
      secondPopupClass:
        post.Id === CLICKED_POST_ID ? "!second-popup" : "second-popup hidden"
    }));
  }

  //open the particular reaction popup
  get secondPopupClass() {
    return this.isSecondPopupOpen ? "!second-popup" : "second-popup hidden";
  }

  // After clicking show the thumbsup emoji reacted users
  viewReaction(event) {
    this.emojiText = "emojiTextBox";
    this.emojiTextSmile = "emojiText";
    this.emojiTextHands = "emojiText";
    this.emojiTextHeart = "emojiText";
    this.emojiTextThinking = "emojiText";
    this.feedItemIdEmoji = event.currentTarget.dataset.customFeeditemId;
    this.allPost = this.allPost.map((post) => ({
      ...post,
      secondPopupClass:
        post.Id === this.feedItemIdEmoji
          ? "second-popup"
          : "second-popup hidden",
      showEmojiPopup: false,
      commentBox: false,
      displayHide: ""
    }));
    this.isSecondPopupOpen = true;
    if (this.isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    this.displayTemplateThumbsUp = true;
    try {
      TOTAL_THUMBSUP({ feedItemId: this.feedItemIdEmoji })
        .then((result) => {
          if (result && result.length > 0) {
            this.noReactionForThisEmoji = false;
            this.noReactionForThisEmoji = false;
            this.displayTemplateThumbsUp = true;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
            this.thumbsUpResult = result;
            this.thumbsUpResult = this.thumbsUpResult.map((ThumbsUp) => ({
              ...ThumbsUp,
              avatarDataForReaction:
                ThumbsUp.BI_PSP_CareProgramEnrolleeEmoji__r?.BI_PSP_AvatarUrl__c,
              reactionYouName:
                this.userAccountId === ThumbsUp.BI_PSP_CareProgramEnrolleeEmoji__c
                  ? label.YOU_LABEL
                  : ThumbsUp.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
            }));
          } else {
            this.noReactionForThisEmoji = true;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
          }
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
          this.noReactionForThisEmoji = true;
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //show thumbs emoji reaction - users
  handleShowTemplateThumbsup() {
    this.emojiText = "emojiTextBox";
    this.emojiTextSmile = "emojiText";
    this.emojiTextHands = "emojiText";
    this.emojiTextHeart = "emojiText";
    this.emojiTextThinking = "emojiText";
    try {
      TOTAL_THUMBSUP({ feedItemId: this.feedItemIdEmoji })
        .then((result) => {
          if (result && result.length > 0) {
            this.noReactionForThisEmoji = false;
            this.noReactionForThisEmoji = false;
            this.displayTemplateThumbsUp = true;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
            this.thumbsUpResult = result;
            this.thumbsUpResult = this.thumbsUpResult.map((ThumbsUp) => ({
              ...ThumbsUp,
              avatarDataForReaction:
                ThumbsUp.BI_PSP_CareProgramEnrolleeEmoji__r?.BI_PSP_AvatarUrl__c,
              reactionYouName:
                this.userAccountId === ThumbsUp.BI_PSP_CareProgramEnrolleeEmoji__c
                  ? label.YOU_LABEL
                  : ThumbsUp.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
            }));
          } else {
            this.noReactionForThisEmoji = true;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
          }
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
          this.noReactionForThisEmoji = true;
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  // show smile emoji reaction - users
  handleShowTemplateSmile() {
    this.emojiText = "emojiText";
    this.emojiTextSmile = "emojiTextBox";
    this.emojiTextHands = "emojiText";
    this.emojiTextHeart = "emojiText";
    this.emojiTextThinking = "emojiText";
    try {
      TOTAL_SMILE({ feedItemId: this.feedItemIdEmoji })
        .then((result) => {
          if (result && result.length > 0) {
            this.noReactionForThisEmoji = false;
            this.displayTemplateSmile = true;
            this.smileResult = result;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
            this.smileResult = this.smileResult.map((Smile) => ({
              ...Smile,
              avatarDataForReaction:
                Smile.BI_PSP_CareProgramEnrolleeEmoji__r?.BI_PSP_AvatarUrl__c,
              reactionYouName:
                this.userAccountId === Smile.BI_PSP_CareProgramEnrolleeEmoji__c
                  ? label.YOU_LABEL
                  : Smile.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
            }));
          } else {
            this.noReactionForThisEmoji = true;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
          }
        })
        .catch((error) => {
          this.noReactionForThisEmoji = true;
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //show foldedHands emoji reaction - users
  handleShowTemplateFoldedhands() {
    this.emojiText = "emojiText";
    this.emojiTextSmile = "emojiText";
    this.emojiTextHands = "emojiTextBox";
    this.emojiTextHeart = "emojiText";
    this.emojiTextThinking = "emojiText";
    try {
      TOTAL_FOLDEDHANDS({ feedItemId: this.feedItemIdEmoji })
        .then((result) => {
          if (result && result.length > 0) {
            this.noReactionForThisEmoji = false;
            this.displayTemplateFoldedHands = true;
            this.foldedHandsResult = result;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
            this.foldedHandsResult = this.foldedHandsResult.map(
              (foldedHands) => ({
                ...foldedHands,
                avatarDataForReaction:
                  foldedHands.BI_PSP_CareProgramEnrolleeEmoji__r?.BI_PSP_AvatarUrl__c,
                reactionYouName:
                  this.userAccountId === foldedHands.BI_PSP_CareProgramEnrolleeEmoji__c
                    ? label.YOU_LABEL
                    : foldedHands.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
              })
            );
          } else {
            this.noReactionForThisEmoji = true;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
          }
        })
        .catch((error) => {
          this.noReactionForThisEmoji = true;
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //show heart emoji reaction - users
  handleShowTemplateHeart() {
    this.emojiText = "emojiText";
    this.emojiTextSmile = "emojiText";
    this.emojiTextHands = "emojiText";
    this.emojiTextHeart = "emojiTextBox";
    this.emojiTextThinking = "emojiText";
    try {
      TOTAL_HEART({ feedItemId: this.feedItemIdEmoji })
        .then((result) => {
          if (result && result.length > 0) {
            this.noReactionForThisEmoji = false;
            this.displayTemplateHeart = true;
            this.heartResult = result;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateThinkingFace = false;
            this.heartResult = this.heartResult.map((Heart) => ({
              ...Heart,
              avatarDataForReaction:
                Heart.BI_PSP_CareProgramEnrolleeEmoji__r?.BI_PSP_AvatarUrl__c,
              reactionYouName:
                this.userAccountId === Heart.BI_PSP_CareProgramEnrolleeEmoji__c
                  ? label.YOU_LABEL
                  : Heart.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
            }));
          } else {
            this.noReactionForThisEmoji = true;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
          }
        })
        .catch((error) => {
          this.noReactionForThisEmoji = true;
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //show thinkingFace emoji reaction - users
  handleShowTemplateThinkingFace() {
    this.emojiText = "emojiText";
    this.emojiTextSmile = "emojiText";
    this.emojiTextHands = "emojiText";
    this.emojiTextHeart = "emojiText";
    this.emojiTextThinking = "emojiTextBox";
    try {
      TOTAL_THINKINGFACE({ feedItemId: this.feedItemIdEmoji })
        .then((result) => {
          if (result && result.length > 0) {
            this.noReactionForThisEmoji = false;
            this.displayTemplateThinkingFace = true;
            this.thinkingFaceResult = result;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.thinkingFaceResult = this.thinkingFaceResult.map((think) => ({
              ...think,
              avatarDataForReaction:
                think.BI_PSP_CareProgramEnrolleeEmoji__r?.BI_PSP_AvatarUrl__c,
              reactionYouName:
                this.userAccountId === think.BI_PSP_CareProgramEnrolleeEmoji__c
                  ? label.YOU_LABEL
                  : think.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
            }));
          } else {
            this.noReactionForThisEmoji = true;
            this.displayTemplateThumbsUp = false;
            this.displayTemplateSmile = false;
            this.displayTemplateFoldedHands = false;
            this.displayTemplateHeart = false;
            this.displayTemplateThinkingFace = false;
          }
        })
        .catch((error) => {
          this.noReactionForThisEmoji = true;
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //show these three dot at only mobile view
  get threeDotClass() {
    return this.isThreeDotClassOpen
      ? "threedot-container"
      : "threedot-container hidden";
  }

  threedotOpenActionPopup(event) {
    this.commentId = event.currentTarget.dataset.customFeeditemId;
    this.displayComment = this.displayComment.map((comment) => ({
      ...comment,
      threeDotClass:
        comment.Id === this.commentId ? !comment.threeDotClass : false
    }));
    this.isThreeDotClassOpen = true;
    document.body.style.overflow = "hidden";
  }
  //close the action popup
  closeThreedot() {
    this.isThreeDotClassOpen = false;
    document.body.style.overflow = "";
  }

  //delete comment popup
  get firstPopupClass() {
    return this.isFirstPopupOpen ? "popup-container" : "popup-container hidden";
  }

  //OPEN THE ACTION POPUP after clicking the threedots
  openFirstPopup(event) {
    this.closeThreedot();
    this.feedCommentItemIdToDelete =
      event.currentTarget.dataset.customFeeditemId;
    this.postItemId = event.currentTarget.dataset.customPostitemId;
    this.isFirstPopupOpen = true;
    document.body.style.overflow = "hidden";
  }

  //close the delete comment confirmation popup
  closeFirstPopup() {
    document.body.style.overflow = "";
    this.isFirstPopupOpen = false;
  }

  //close the Comment delete toast message
  closeCommentToastMsg() {
    this.showDeleteToastMsg = false;
  }

  //close CommentBox
  closeCommentBox(event) {
    const POST_ID = event.currentTarget.dataset.customFeeditemId;
    this.allPost = this.allPost.map((post) => ({
      ...post,
      commentBox: post.Id === POST_ID ? false : post.commentBox,
      displayHide: ""
    }));
    this.commentBox = true;
  }

  // close the edit dropdown comment
  closeshoweditthecomment(event) {
    this.editTheCommentTxt = "HideeditTheCommentTxt";
    this.commentId = event.currentTarget.dataset.customFeeditemId;
    this.displayComment = this.displayComment.map((comment) => ({
      ...comment,
      showEditTheComment: false
    }));
  }

  // To delete the comment
  handleDeleteComment() {
    //this.feedCommentItemIdToDelete =
    // event.currentTarget.dataset.customFeeditemId;
    this.isFirstPopupOpen = false;
    document.body.style.overflow = "";
    try {
      SOFTDELETE_COMMENT_ITEM({
        feedCommentItemId: this.feedCommentItemIdToDelete
      })
        .then(() => {
          this.displayComment = this.displayComment.filter(
            (comment) => comment.Id !== this.feedCommentItemIdToDelete
          );
          this.allPost = this.allPost.map((post) => {
            if (post.Id === this.postItemId) {
              return {
                ...post,
                CommentCount: post.CommentCount - 1
              };
            }
            return post;
          });
          this.showDeleteToastMsg = true;
          this.showFollowToastMsg = false;
          this.showUnfollowToastMsg = false;
          this.showDeleteToastMsgforcomment = true;
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.handleToastTemplate();
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //open the follow popup at clicking profile avatar
  followUserpop(event) {
    this.allPost = this.allPost.map((post) => ({
      ...post,
      showEmojiPopup: false,
      commentBox: false,
      displayHide: ""
    }));
    this.postIdForFollow = event.currentTarget.dataset.customFeeditemId;
    this.selectedUserId = event.target.dataset.id;
    this.username = event.target.dataset.username;
    this.followAvatar = event.target.dataset.avatar;
    this.accountId = event.target.dataset.acc;
    this.followFollowingBtn = event.target.dataset.button;
    if (this.accountId === this.userAccountId) {
      this.followPopupAtFeed = false;
      this.followingPopupAtFeed = false;
      document.body.style.overflow = "";
    } else if (this.followFollowingBtn === label.FOLLOW_LABEL) {
      this.followPopupAtFeed = true;
      if (this.isDesktop) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    } else {
      this.followingPopupAtFeed = true;
      if (this.isDesktop) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }

  // To open popup  when clicking profile button
  buttonfollowUserpop(event) {
    this.allPost = this.allPost.map((post) => ({
      ...post,
      showEmojiPopup: false,
      commentBox: false,
      displayHide: ""
    }));
    this.selectedUserId = event.target.dataset.id;
    this.username = event.target.dataset.username;
    this.followAvatar = event.target.dataset.avatar;
    this.accountId = event.target.dataset.acc;
    this.followFollowingBtn = event.target.dataset.button;
    if (this.accountId === this.userAccountId) {
      this.followPopupConfirmationAtFeed = false;
      this.followingPopupConfirmationAtFeed = false;
      document.body.style.overflow = "";
    } else if (this.followFollowingBtn === label.FOLLOW_LABEL) {
      this.followPopupConfirmationAtFeed = true;
      if (this.isDesktop) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    } else {
      this.followingPopupConfirmationAtFeed = true;
      if (this.isDesktop) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }

  // To close popup for follow/unfollow
  closePopup() {
    this.followPopupAtFeed = false;
    this.followPopupConfirmationAtFeed = false;
    this.followingPopupAtFeed = false;
    this.followingPopupConfirmationAtFeed = false;
    document.body.style.overflow = "";
  }

  // open confirmation Following popup
  handleFollowingPopupButtonClick() {
    this.followingPopupConfirmationAtFeed = true;
    if (this.isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    this.followingPopupAtFeed = false;
  }

  // open confirmation Follow popup
  handleFollowPopupButtonClick() {
    this.followPopupConfirmationAtFeed = true;
    if (this.isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    this.followPopupAtFeed = false;
  }

  // To follow the user
  followUserYesBtn() {
    try {
      this.isLoading = true;
      FOLLOW_USER({
        enrolleeIdToFollow: this.accountId
      })
        .then(() => {
          this.allPost = this.allPost.map((post) => ({
            ...post,
            checkFollowBtn:
              post.BI_PSP_CareProgramEnrollee__c === this.accountId
                ? label.FOLLOWING_LABEL
                : post.checkFollowBtn
          }));
          this.isLoading = false;
          this.followPopupAtFeed = false;
          this.followPopupConfirmationAtFeed = false;
          document.body.style.overflow = "";
          this.showFollowToastMsg = true;
          this.showDeleteToastMsg = false;
          this.showUnfollowToastMsg = false;
          this.showDeleteToastMsgForComment = false;
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.handleToastTemplate();
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
          return false;
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  // To unfollow the user
  unfollowUserYesBtn() {
    try {
      this.isLoading = true;
      UNFOLLOW_USER({
        enrolleeIdToUnFollow: this.accountId
      })
        .then(() => {
          this.allPost = this.allPost.map((post) => ({
            ...post,
            checkFollowBtn:
              post.BI_PSP_CareProgramEnrollee__c === this.accountId
                ? label.FOLLOW_LABEL
                : post.checkFollowBtn
          }));
          this.isLoading = false;
          this.followingPopupAtFeed = false;
          this.followingPopupConfirmationAtFeed = false;
          document.body.style.overflow = "";
          this.showUnfollowToastMsg = true;
          this.showDeleteToastMsg = false;
          this.showFollowToastMsg = false;
          this.showDeleteToastMsgForComment = false;
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.handleToastTemplate();
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
          return false;
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //  to follow the user for emoji
  emojiFollowProfileBtn(event) {
    try {
      this.followUserName = event.currentTarget.dataset.name;
      this.username = event.target.dataset.username;
      this.followAccountId = event.currentTarget.dataset.accid;
      this.followAvatarResult = event.currentTarget.dataset.avat;
      CHECK_FOLLOW_STATUS({
        loggedAccountId: this.userAccountId,
        otherAccountId: this.followAccountId
      })
        .then((result) => {
          if (this.userAccountId === this.followAccountId) {
            this.emojiFollowProfile = false;
            this.emojiFollowingProfile = false;
            document.body.style.overflow = "";
          } else if (result && result.length > 0) {
            this.countRecord = result.length;
            if (result[0].BI_PSP_Type__c === label.FOLLOWING_LABEL) {
              this.emojiFollowingProfile = true;
              if (this.isDesktop) {
                document.body.style.overflow = "hidden";
              } else {
                document.body.style.overflow = "";
              }
            } else {
              this.emojiFollowProfile = true;
              if (this.isDesktop) {
                document.body.style.overflow = "hidden";
              } else {
                document.body.style.overflow = "";
              }
            }
          } else {
            this.emojiFollowProfile = true;
            if (this.isDesktop) {
              document.body.style.overflow = "hidden";
            } else {
              document.body.style.overflow = "";
            }
          }
          return result;
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // then-Catch Exception
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  // open following  popup
  emojiFollowPopupButtonClick() {
    this.emojiFollowConfirmation = true;
    this.emojiFollowProfile = false;
    if (this.isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  //close follow/following popup for Emoji
  emojiClosePopup() {
    this.emojiFollowProfile = false;
    this.emojiFollowConfirmation = false;
    this.emojiFollowingProfile = false;
    this.emojiUnfollowConfirmation = false;
    if (this.isSecondPopupOpen === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  // To follow the user for Emoji
  emojiFollowYesBtn() {
    try {
      this.isLoading = true;
      FOLLOW_USER({
        enrolleeIdToFollow: this.followAccountId
      })
        .then(() => {
          this.allPost = this.allPost.map((post) => ({
            ...post,
            checkFollowBtn:
              post.BI_PSP_CareProgramEnrollee__c === this.accountId ||
              post.BI_PSP_CareProgramEnrollee__c === this.followAccountId
                ? label.FOLLOWING_LABEL
                : post.checkFollowBtn
          }));
          this.isLoading = false;
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // then-Catch Exception
          return false;
        });
      this.emojiFollowProfile = false;
      this.emojiFollowConfirmation = false;
      document.body.style.overflow = "";
      this.showFollowToastMsgForMbl = true;
      this.handleToastTemplate();
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  // follow/following popup for confirmation
  emojiFollowingPopupButtonClick() {
    this.emojiUnfollowConfirmation = true;
    this.emojiFollowingProfile = false;
    if (this.isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  // To unfollow the user for Emoji
  emojiUnfollowYesBtn() {
    try {
      this.isLoading = true;
      UNFOLLOW_USER({
        enrolleeIdToUnFollow: this.followAccountId
      })
        .then(() => {
          this.allPost = this.allPost.map((post) => ({
            ...post,
            checkFollowBtn:
              post.BI_PSP_CareProgramEnrollee__c === this.accountId ||
              post.BI_PSP_CareProgramEnrollee__c === this.followAccountId
                ? label.FOLLOW_LABEL
                : post.checkFollowBtn
          }));
          this.isLoading = false;
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // then-Catch Exception
          return false;
        });
      this.emojiFollowingProfile = false;
      this.emojiUnfollowConfirmation = false;
      document.body.style.overflow = "";
      this.showUnfollowToastMsgForMbl = true;
      this.handleToastTemplate();
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  // close the follow toast message
  closeAllFollowToastMsg() {
    this.showFollowToastMsg = false;
    this.showFollowToastMsgForMbl = false;
  }
  //close the unfollow toast message
  closeUnfollowToastMsg() {
    this.showUnfollowToastMsg = false;
    this.showUnfollowToastMsgForMbl = false;
  }

  //close Comment Box
  commentCancel() {
    this.allPost = this.allPost.map((post) => ({
      ...post,
      commentBox: false,
      displayHide: ""
    }));
    this.comment = "";
    this.commentOption = [];
  }
  //insert a comment
  handleCommentChange(event) {
    try {
      this.comment = event.target.value;
      const FEED_ID = event.currentTarget.dataset.customFeeditemId;
      if (this.comment && this.comment !== label.NO_COMMENTS) {
        SAVE_COMMENT_OPTION({
          commentContent: this.comment,
          postId: FEED_ID
        })
          .then(() => {
            this.comment = "";
            this.allPost = this.allPost.map((post) => {
              if (post.Id === FEED_ID) {
                return {
                  ...post,
                  CommentCount: post.CommentCount + 1,
                  commentBox: post.Id === FEED_ID ? !post.commentBox : false,
                  displayHide:
                    post.Id === FEED_ID && !post.commentBox ? "Hide" : ""
                };
              }
              return post;
            });
            this.comment = "";
          })
          .catch((error) => {
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
            this.comment = "";
          });
      } else {
        this.comment = "";
      }
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  //Open the EditComment Dropdown
  editTheComment(event) {
    this.editTheCommentTxt = "editTheCommentTxt";
    this.closeThreedot();
    this.isThreeDotClassOpen = false;
    document.body.style.overflow = "";
    this.commentId = event.currentTarget.dataset.customFeeditemId;
    this.displayComment = this.displayComment.map((comment) => ({
      ...comment,
      showEditTheComment: comment.Id === this.commentId
    }));
  }

  //Edit the Comment
  handleCommentChangeedit(event) {
    try {
      this.editComment = event.target.value;
      this.commentId = event.currentTarget.dataset.customFeeditemId;
      if (this.editComment && this.editComment !== label.NO_COMMENTS) {
        EDIT_COMMENT({
          commentToUpdate: this.editComment,
          commentId: this.commentId
        })
          .then((result) => {
            if (result && result !== null) {
              this.displayComment = this.displayComment.map((comment) => {
                if (comment.Id === this.commentId) {
                  return {
                    ...comment,
                    BI_PSP_Comment__c: result.BI_PSP_Comment__c,
                    comment: "",
                    showEditTheComment: false
                  };
                }
                this.comment = "";
                return comment;
              });
              this.comment = "";
            } else {
              this.showToast(label.ERROR_MESSAGE, label.ERROR_MESSAGE, label.ERROR_VARIANT); // catch Exception if result is null
            }
          })
          .catch((error) => {
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
            this.comment = "";
          });
        this.showEditTheComment = false;
        this.comment = "";
      }
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
  }

  // // To calculate time difference for comments from creaed time
  // calculateTimeDifferenceforcomment(createdDate) {
  //   const CURRENT_TIME = new Date();
  //   const POST_TIME = new Date(createdDate);
  //   const TIME_DIFFERENCE = CURRENT_TIME - POST_TIME;
  //   const SECONDS = Math.floor(TIME_DIFFERENCE / 1000);
  //   const MINUTES = Math.floor(SECONDS / 60);
  //   const HOURS = Math.floor(MINUTES / 60);
  //   const DAYS = Math.floor(HOURS / 24);
  //   const MONTHS = Math.floor(DAYS / 30);
  //   const YEARS = Math.floor(DAYS / 365);
  //   if (YEARS > 0) {
  //     return `${YEARS} ${YEARS === 1 ? label.CHATTER_YEAR : label.CHATTER_YEARS} ${label.CHATTER_AGO}`;
  //   }
  //   if (MONTHS > 0) {
  //     return `${MONTHS} ${MONTHS === 1 ? label.CHATTER_MONTH : label.CHATTER_MONTHS} ${label.CHATTER_AGO}`;
  //   }
  //   if (DAYS > 0) {
  //     return `${DAYS} ${DAYS === 1 ? label.CHATTER_DAY : label.CHATTER_DAYS} ${label.CHATTER_AGO}`;
  //   }
  //   if (HOURS > 0) {
  //     return `${HOURS} ${HOURS === 1 ? label.CHATTER_HOUR : label.CHATTER_HOURS} ${label.CHATTER_AGO}`;
  //   }
  //   if (MINUTES > 0) {
  //     return `${MINUTES} ${MINUTES === 1 ? label.CHATTER_MINUTE : label.CHATTER_MINUTES} ${label.CHATTER_AGO}`;
  //   }
  //   return `${SECONDS} ${SECONDS === 1 ? label.CHATTER_SECOND : label.CHATTER_SECONDS} ${label.CHATTER_AGO}`;
  // }

  //Open  comment Box to view the All comments
  commentBoxOpen(event) {
    const POST_ID = event.currentTarget.dataset.customFeeditemId;
    const TITLE = event.currentTarget.dataset.customFeeditemTitle;
    const BODY = event.currentTarget.dataset.customFeeditemBody;

    this.allPost = this.allPost.map((post) => ({
      ...post,
      commentBox: post.Id === POST_ID ? !post.commentBox : false,
      displayHide: post.Id === POST_ID && !post.commentBox ? "Hide" : "",
      showEmojiPopup: false
    }));
    this.commentBox = true;
    try {
      //show other user comments for a post
      VIEW_COMMENTS({ feedItemId: POST_ID })
        .then((result) => {
          if (result && result.length > 0) {
            this.displayComment = result.map((post) => ({
              ...post,
              formattedTimeDifferenceforcomment:
                this.calculateTimeDifference(post.CreatedDate),
              isCurrentUserCommentCreator:
                this.userAccountId === post.BI_PSP_CareProgramEnrolleeCmt__c,
              avatarDataforcomment:
                post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_AvatarUrl__c,
              youname:
                this.userAccountId === post.BI_PSP_CareProgramEnrolleeCmt__c
                  ? label.YOU_LABEL
                  : post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c !==
                      null
                    ? post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c
                    : label.NO_USERNAME_LABEL
            }));
            this.getComments = true;
          } else {
            this.getComments = false;
          }
        })
        .catch((error) => {
          this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Then-Catch Exception
          this.getComments = false;
        });
    } catch (error) {
      this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT); // Catch Exception
    }
    // Define the comment options based on TITLE and BODY
    const commentOptionsMap = {
      [label.CHATTER_LIFESTYLE]: {
        [label.LIFE_I_MISS]: [
          { label: label.OPT_ROOTING_FOR_YOU, value: label.OPT_ROOTING_FOR_YOU },
          { label: label.OPT_LIFE_FULL_OF, value: label.OPT_LIFE_FULL_OF },
          { label: label.OPT_I_CANT_TELL_WHEN, value: label.OPT_I_CANT_TELL_WHEN }
        ],
        [label.LIFE_WORKING]: [
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_ENJOY_REALITY, value: label.OPT_ENJOY_REALITY },
          { label: label.OPT_BRAVE_STRONG, value: label.OPT_BRAVE_STRONG },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ],
        [label.LIFE_NOT_ALWAYS]: [
          { label: label.OPT_GET_EASY, value: label.OPT_GET_EASY },
          { label: label.OPT_ROOTING_FOR_YOU, value: label.OPT_ROOTING_FOR_YOU },
          { label: label.OPT_THANK_SAYING, value: label.OPT_THANK_SAYING },
          { label: label.OPT_RIGHT_ATTITUDE, value: label.OPT_RIGHT_ATTITUDE }
        ],
        [label.LIFE_MY_CLOTH]: [
          { label: label.OPT_ROOTING_FOR_YOU, value: label.OPT_ROOTING_FOR_YOU },
          { label: label.OPT_OUR_LIFE_FULL, value: label.OPT_OUR_LIFE_FULL },
          { label: label.OPT_MANY_THINGS_CANNOT, value: label.OPT_MANY_THINGS_CANNOT }
        ],
        [label.LIFE_I_WOULD]: [
          { label: label.OPT_I_CANT_TELL_WHEN, value: label.OPT_I_CANT_TELL_WHEN },
          { label: label.OPT_DONT_GIVEUP, value: label.OPT_DONT_GIVEUP },
          { label: label.OPT_MANY_THINGS_CANNOT, value: label.OPT_MANY_THINGS_CANNOT }
        ],
        [label.LIFE_EVEN_GPP]: [
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_PROUD_OF_YOU, value: label.OPT_PROUD_OF_YOU },
          { label: label.OPT_AMAZING, value: label.OPT_AMAZING },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ],
        [label.LIFE_AFTER_OVER]: [
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_INSPIRATION, value: label.OPT_INSPIRATION },
          { label: label.OPT_OUR_LIFE_FULL, value: label.OPT_OUR_LIFE_FULL },
          { label: label.OPT_BRAVE_STRONG, value: label.OPT_BRAVE_STRONG }
        ],
        [label.LIFE_THERE_ARE]: [
          { label: label.OPT_I_CANT_TELL_WHEN, value: label.OPT_I_CANT_TELL_WHEN },
          { label: label.OPT_GET_EASY, value: label.OPT_GET_EASY },
          { label: label.OPT_EVERYTHING_ALRIGHT, value: label.OPT_EVERYTHING_ALRIGHT },
          { label: label.OPT_OUR_LIFE_FULL, value: label.OPT_OUR_LIFE_FULL },
          { label: label.OPT_MANY_THINGS_CANNOT, value: label.OPT_MANY_THINGS_CANNOT }
        ],
        [label.LIFE_I_DID]: [
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ]
      },
      [label.CHATTER_SOCIAL]: {
        [label.SOCIAL_ACTIVELY_WORK]: [
          { label: label.OPT_I_WENT_THROUGH, value: label.OPT_I_WENT_THROUGH },
          { label: label.OPT_BRAVE_STRONG, value: label.OPT_BRAVE_STRONG },
          { label: label.OPT_EVERYTHING_ALRIGHT, value: label.OPT_EVERYTHING_ALRIGHT }
        ],
        [label.SOCIAL_TO_EXPLAIN]: [
          { label: label.OPT_EMBARRASED, value: label.OPT_EMBARRASED },
          { label: label.OPT_DONT_BE_HARD, value: label.OPT_DONT_BE_HARD },
          { label: label.OPT_BRAVE_STRONG, value: label.OPT_BRAVE_STRONG }
        ],
        [label.SOCIAL_TALKING]: [
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_PROUD_OF_YOU, value: label.OPT_PROUD_OF_YOU },
          { label: label.OPT_YOU_AMAZING, value: label.OPT_YOU_AMAZING },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ],
        [label.SOCIAL_ONLY_CLOSE]: [
          { label: label.OPT_TRY_NOT_TO, value: label.OPT_TRY_NOT_TO },
          { label: label.OPT_EMBARRASED, value: label.OPT_EMBARRASED },
          { label: label.OPT_YOU_DEFINE, value: label.OPT_YOU_DEFINE }
        ],
        [label.SOCIAL_SHAREDMY]: [
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ],
        [label.SOCIAL_STAYING]: [
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U },
          { label: label.OPT_ROOTING_FOR_YOU, value: label.OPT_ROOTING_FOR_YOU }
        ],
        [label.SOCIAL_WANT_TO_INTIMATE]: [
          { label: label.OPT_I_WENT_THROUGH, value: label.OPT_I_WENT_THROUGH },
          { label: label.OPT_I_CANT_TELL_WHEN, value: label.OPT_I_CANT_TELL_WHEN },
          { label: label.OPT_EVERYTHING_ALRIGHT, value: label.OPT_EVERYTHING_ALRIGHT },
          { label: label.OPT_BRAVE_STRONG, value: label.OPT_BRAVE_STRONG }
        ],
        [label.SOCIAL_GOT_CHANCE]: [
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ],
        [label.SOCIAL_EMBARRASE]: [
          { label: label.OPT_EMBARRASED, value: label.OPT_EMBARRASED },
          { label: label.OPT_TRY_NOT_TO, value: label.OPT_TRY_NOT_TO },
          { label: label.OPT_YOU_DEFINE, value: label.OPT_YOU_DEFINE },
          { label: label.OPT_YOU_GREAT_WONDER, value: label.OPT_YOU_GREAT_WONDER }
        ],
        [label.SOCIAL_THINGS_BETTER]: [
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_KEEPUP_GOOD, value: label.OPT_KEEPUP_GOOD },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME }
        ]
      },
      [label.CHATTER_MEDICAL]: {
        [label.MEDICAL_DONT_FEEL]: [
          { label: label.OPT_FELT_SAME, value: label.OPT_FELT_SAME },
          { label: label.OPT_TALKING_DOCTOR, value: label.OPT_TALKING_DOCTOR },
          { label: label.OPT_PATIENT_ORG, value: label.OPT_PATIENT_ORG },
          { label: label.OPT_FIND_SOMEONE, value: label.OPT_FIND_SOMEONE }
        ],
        [label.MEDICAL_SEEN_DOC]: [
          { label: label.OPT_STAY_STRONG, value: label.OPT_STAY_STRONG },
          { label: label.OPT_TALK_PSORIASIS, value: label.OPT_TALK_PSORIASIS },
          { label: label.OPT_FELT_SAME, value: label.OPT_FELT_SAME }
        ],
        [label.MEDICAL_FINALLY]: [
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ]
      },
      [label.CHATTER_PSYCHOLOGI]: {
        [label.PSYC_FEEL_ALONE]: [
          { label: label.OPT_I_WENT_THROUGH, value: label.OPT_I_WENT_THROUGH },
          { label: label.OPT_NORMAL_FEEL, value: label.OPT_NORMAL_FEEL },
          { label: label.OPT_FIND_TO_TALK, value: label.OPT_FIND_TO_TALK },
          { label: label.OPT_STAY_STRONG, value: label.OPT_STAY_STRONG },
          { label: label.OPT_HAVING_FEEL, value: label.OPT_HAVING_FEEL }
        ],
        [label.PSYC_FEEL_ANXIOUS]: [
          { label: label.OPT_ROOTING_FOR_YOU, value: label.OPT_ROOTING_FOR_YOU },
          { label: label.OPT_NORMAL_FEEL, value: label.OPT_NORMAL_FEEL },
          { label: label.OPT_I_CANT_TELL_WHEN, value: label.OPT_I_CANT_TELL_WHEN }
        ],
        [label.PSYC_WORN_OUT]: [
          { label: label.OPT_BE_CAREFUL, value: label.OPT_BE_CAREFUL },
          { label: label.OPT_FELT_SAMEWAY, value: label.OPT_FELT_SAMEWAY },
          { label: label.OPT_POSSIBLE_TO, value: label.OPT_POSSIBLE_TO },
          { label: label.OPT_ROOTING_FOR_YOU, value: label.OPT_ROOTING_FOR_YOU }
        ],
        [label.PSYC_THINGS_BETTER]: [
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U },
          { label: label.OPT_GOOD_HEAR, value: label.OPT_GOOD_HEAR },
          { label: label.OPT_WONDERFUL, value: label.OPT_WONDERFUL }
        ],
        [label.PSYC_DONT_LET_GPP]: [
          { label: label.OPT_DISEASE, value: label.OPT_DISEASE },
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_KEEPUP_GOOD, value: label.OPT_KEEPUP_GOOD },
          { label: label.OPT_THANK_INSPIRATION, value: label.OPT_THANK_INSPIRATION },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ],
        [label.PSYC_GPP_HARDBATTLE]: [
          { label: label.OPT_NORMAL_FEEL, value: label.OPT_NORMAL_FEEL },
          { label: label.OPT_EXPERIENCE_MYSELF, value: label.OPT_EXPERIENCE_MYSELF },
          { label: label.OPT_STAY_STRONG, value: label.OPT_STAY_STRONG }
        ],
        [label.PSYC_TODAY_FEEL]: [
          { label: label.OPT_HOPE_OUT, value: label.OPT_HOPE_OUT },
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_KEEPUP_GOOD, value: label.OPT_KEEPUP_GOOD },
          { label: label.OPT_THANK_INSPIRATION, value: label.OPT_THANK_INSPIRATION },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT }
        ],
        [label.PSYC_EVEN_THOUGH]: [
          { label: label.OPT_KEEPUP_GOOD, value: label.OPT_KEEPUP_GOOD },
          { label: label.OPT_THANK_INSPIRATION, value: label.OPT_THANK_INSPIRATION },
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME }
        ],
        [label.PSYC_I_ACCEPT]: [
          { label: label.OPT_KEEP_IT_UP, value: label.OPT_KEEP_IT_UP },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ]
      },
      [label.CHATTER_OCCUPATION]: {
        [label.OCC_I_CANNOT]: [
          { label: label.OPT_DERMATOLOGI, value: label.OPT_DERMATOLOGI },
          { label: label.OPT_TALK_EMPLY, value: label.OPT_TALK_EMPLY },
          { label: label.OPT_I_WENT_THROUGH, value: label.OPT_I_WENT_THROUGH }
        ],
        [label.OCC_COMPLICATE]: [
          { label: label.OPT_DERMATOLOGIST_GPP, value: label.OPT_DERMATOLOGIST_GPP },
          { label: label.OPT_TRY_COMFORT, value: label.OPT_TRY_COMFORT },
          { label: label.OPT_TALKING_DOCTOR, value: label.OPT_TALKING_DOCTOR }
        ],
        [label.OCC_WORL_COLLEAGUE]: [
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U }
        ],
        [label.OCC_FEEL_MYFAMILY]: [
          { label: label.OPT_PLEASED_HELP, value: label.OPT_PLEASED_HELP },
          { label: label.OPT_SPEAK_DERMATO, value: label.OPT_SPEAK_DERMATO }
        ]
      },
      [label.CHATTER_GPP]: {
        [label.GPP_I_DONT_KNOW]: [
          { label: label.OPT_TALK_TO_DOCTOR, value: label.OPT_TALK_TO_DOCTOR },
          { label: label.OPT_FIND_TO_TALK, value: label.OPT_FIND_TO_TALK },
          { label: label.OPT_ANOTHER_DERMATO, value: label.OPT_ANOTHER_DERMATO }
        ],
        [label.GPP_WHILE_GIVING]: [
          { label: label.OPT_WILL_PASS, value: label.OPT_WILL_PASS },
          { label: label.OPT_GOING_FINE, value: label.OPT_GOING_FINE },
          { label: label.OPT_THINGS_IMPROVE, value: label.OPT_THINGS_IMPROVE },
          { label: label.OPT_GET_EASY, value: label.OPT_GET_EASY },
          { label: label.OPT_STAY_POSITIVE, value: label.OPT_STAY_POSITIVE }
        ],
        [label.GPP_SKIN_IMPROVE]: [
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U },
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME }
        ],
        [label.GPP_ACTIVELY_EXPLORE]: [
          { label: label.OPT_STAY_POSITIVE, value: label.OPT_STAY_POSITIVE },
          { label: label.OPT_GOING_ALRIGHT, value: label.OPT_GOING_ALRIGHT },
          { label: label.OPT_I_CANT_TELL_WHEN, value: label.OPT_I_CANT_TELL_WHEN }
        ],
        [label.GPP_UNDERSTANDING]: [
          { label: label.OPT_THAT_GREAT, value: label.OPT_THAT_GREAT },
          { label: label.OPT_AWESOME, value: label.OPT_AWESOME },
          { label: label.OPT_HAPPY_FOR_U, value: label.OPT_HAPPY_FOR_U },
          { label: label.OPT_RIGHT_ATTITUDE, value: label.OPT_RIGHT_ATTITUDE },
          { label: label.OPT_KEEP_POSITIVE, value: label.OPT_KEEP_POSITIVE }
        ],
        [label.GPP_FEEL_ALONE]: [
          { label: label.OPT_SAME_EMOTION, value: label.OPT_SAME_EMOTION },
          { label: label.OPT_TALK_TO_DOCTOR, value: label.OPT_TALK_TO_DOCTOR },
          { label: label.OPT_TALK_DERMATO_HELP, value: label.OPT_TALK_DERMATO_HELP }
        ]
      }
    };

    // Set the comment options based on the TITLE and BODY
    if (commentOptionsMap[TITLE] && commentOptionsMap[TITLE][BODY]) {
      this.commentOption = commentOptionsMap[TITLE][BODY];
    } else {
      this.commentOption = [{ label: label.NO_COMMENTS, value: label.NO_COMMENTS }];
    }
  }
  // To detect the site is branded or unassigned
  detectBrandedOrUnassigned() {
    let globalThis = window;
    const CURRENT_URL = globalThis.location.href;
    const URL_OBJECT = new URL(CURRENT_URL);
    const PATH = URL_OBJECT.pathname;
    const PATH_COMPONENTS = PATH.split("/");
    const DESIRED_COMPONENTS = PATH_COMPONENTS.find((component) =>
      [label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(
        component.toLowerCase()
      )
    );
    if (
      DESIRED_COMPONENTS &&
      DESIRED_COMPONENTS.toLowerCase() === label.BRANDED_URL.toLowerCase()
    ) {
      this.urlq = label.BRANDED_URL;
    }
    //set the url and navigations are done within unassigned site
    else {
      this.urlq = label.UNASSIGNED_URL;
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