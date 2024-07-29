// This lightning web component is used to display the Post created by them in the Patient Community (MyPosts) Page
// To import Libraries
import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//  To import Apex Classes
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
import COMMENT_OPTIONS from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.getCommentOptions";
import CHECK_FOLLOW_STATUS from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.checkFollowingStatus";
import EDIT_COMMENT from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.editComment";
import FOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.followUser";
import HARDDELETE_EMOJI_REACTION from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.deleteEmojiReaction";
import MY_POST_FEED from "@salesforce/apex/BI_PSPB_FeedItemCtrl.fetchMyPost";
import REACTIONSBY_FEED_ID from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.getReactionsByFeedItemId";
import SAVE_EMOJI from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.saveEmoji";
import SOFTDELETE_FEEDITEM from "@salesforce/apex/BI_PSPB_FeedItemCtrl.softDeleteFeedItem";
import SOFTDELETE_COMMENT_ITEM from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.softDeleteFeedCommentItem";
import SAVE_COMMENT_OPTION from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.insertComment";
import USER_AVATAR from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import TOTAL_REACTIONS from "@salesforce/apex/BI_PSPB_EmojiReactionCtrl.totalReactionsByType";
import UNFOLLOW_USER from "@salesforce/apex/BI_PSPB_FollowUserCtrl.unfollowUser";
import USER_ENROLLEE_ID from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import VIEW_COMMENTS from "@salesforce/apex/BI_PSPB_FeedCommentCtrl.viewComments";
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceCommunity';

export default class BiPspbMyPost extends LightningElement {
	// Declaration of variables with   
	userEnrolleeId;
	loggedUserAvatar;
	navigationFromNotificationCommentId;
	navigationFromNotificationReactionId;
	isLoading;
	feedItemIdToDelete;
	followUserName;
	countRecord;
	showSpinner;
	thumbsUpResult;
	smileResult;
	foldedHandsResult;
	heartResult;
	thinkingFaceResult;
	enrolleeIdForFollow;
	avatarDataForReaction;
	feedItemIdEmoji;
	emojiText;
	emojiTextSmile;
	emojiTextHands;
	emojiTextHeart;
	emojiTextThinking;
	editComment;
	categoryTitle;
	phraseBody;
	showEditTheComment;
	commentId;
	commentBox;
	feedCommentItemIdToDelete;
	editTheCommentTxt = "editTheCommentTxt"; //css attribute call
	displayHide = "";
	commentResult = false;
	showPostDetails = false;
	showToastMsg = false;
	showDeleteToastMsg = false;
	isNewPopupOpen = false;
	emojiFollowing = false;
	emojiFollowProfile = false;
	followingToastMsg = false;
	showDivUnfollow = false;
	emojiFollowPopup = false;
	emojiFollowingPopup = false;
	noReactionForThisEmoji = false;
	showEmojiPopup = false;
	displayTemplateThumbsUp = true;
	displayTemplateSmile = false;
	displayTemplateFoldedHands = false;
	displayTemplateHeart = false;
	displayTemplateThinkingFace = false;
	isThreeDotClassOpen = false;
	isSecondPopupOpen = false;
	isFirstPopupOpen = false;
	showDeleteToastMsgForComment = false;
	displayComment = [];
	saveEmojiResult = [];
	postDetails = [];
	followAvatar;
	//Declaration of variables
	userId = label.ID;
	editImg = label.EDIT_ICON;
	isCurrentUserCommentCreator = false;
	comment = "";
	commentOption = [];
	imgThumbs = label.THUMBS_UP_IMG;
	imgSmile = label.SMILE_IMG;
	imgHands = label.HANDS_FOLDED_IMG;
	imgLike = label.HEART_IMG;
	imgThought = label.THOUGHTFUL_IMG;
	deleteImg = label.DELETE_ICON_IMG;
	allPostImg = label.NO_FEED_IMG;
	deleteToast = label.TICK_ICON;
	noComment = label.NO_COMMENT_IMG;
	handleResizeBound;

	// To fetch the enrollee Id of the user
	@wire(USER_ENROLLEE_ID)
	wiredGetEnrolleeId({ data }) {
		try {
			if (data && data.length > 0) {
				this.userEnrolleeId = data[0].Id;
			} else {
				this.handleShowToast(label.ACCOUNT_NOT_FOUND);
			}
		} catch (err) {
			this.handleShowToast(err.message); // Catching Potential Error
		}
	}

	// get all records for mypost

	@wire(MY_POST_FEED)
	myPostRecords({ data }) {
		try {
			this.setLoadingState(true);

			if (data && data.length > 0) {
				this.processData(data);
			} else if ((data && data.length === 0) || data === null) {
				this.setLoadingState(false);
				this.showPostDetails = false;
			} else {
				this.setLoadingState(false);
				this.handleShowToast(label.POST_ERROR);
			}
		} catch (err) {
			this.handleShowToast(err.message); // Catching Potential Error
		}
	}

	setLoadingState(isLoading) {
		this.isLoading = isLoading;
	}

	processData(data) {
		this.showPostDetails = true;
		this.setLoadingState(false);
		this.postDetails = this.mapPostDetails(data);
		this.checkAllReactions();
		this.commentBox = true;
		this.handleNotificationNavigation();
	}

	mapPostDetails(data) {
		return data.map((post) => ({
			...post,
			formattedTimeDifference: this.calculateTimeDifference(post.CreatedDate),
			commentCount: post.BI_PSP_FeedComment__r ? post.BI_PSP_FeedComment__r.length : 0,
			countEmoji: post.BI_PSP_EmojiReactionController__r ? post.BI_PSP_EmojiReactionController__r.length : 0,
			toReact: true,
			reactionResult: "",
			showEmojiPopup: false,
			emojiYouReacted: "",
			commentBox:
				this.navigationFromNotificationCommentId && post.Id === this.navigationFromNotificationCommentId
					? !post.commentBox
					: false,
			secondPopupClass:
				this.navigationFromNotificationReactionId && post.Id === this.navigationFromNotificationReactionId
					? "second-popup"
					: "second-popup hidden"
		}));
	}

	handleNotificationNavigation() {
		const globalThis = window;
		if (this.navigationFromNotificationReactionId) {
			globalThis.localStorage.removeItem("selectedItemId");
		}
		if (this.navigationFromNotificationCommentId) {
			globalThis.localStorage.removeItem("selectedItemIdforComment");
		}
	}

	//This connected callback used to get Avatar for reaction,post and comments,get localstorage value from notification navigation and set toastmessage template as false
	connectedCallback() {
		try {
			this.initializeEventListeners();
			this.handleNavigationFromNotification();
			this.initializeComponentStates();
			this.processCurrentPageUrl();
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}
	initializeEventListeners() {
		let global =window;
		this.handleResizeBound = this.handleResize.bind(this);
		global.addEventListener("resize", this.handleResizeBound);
	}
	handleNavigationFromNotification() {
		this.handleNavigationToReactedEmoji();
		this.handleNavigationToComments();
	}
	
	handleNavigationToReactedEmoji() {
		let global =window;
		const selectedItemId = global.localStorage.getItem("selectedItemId");
		if (selectedItemId) {
			this.navigationFromNotificationReactionId = selectedItemId;
			this.viewReactionfromnavigation(this.navigationFromNotificationReactionId);
		}
	}
	
	handleNavigationToComments() {
		let global =window;
		const selectedItemIdForComment = global.localStorage.getItem("selectedItemIdforComment");
		if (selectedItemIdForComment) {
			this.navigationFromNotificationCommentId = selectedItemIdForComment;
			this.commentBtnFromNavigation(this.navigationFromNotificationCommentId);
		}
	}
	initializeComponentStates() {
		this.detectBrandedOrUnassigned();
		this.checkAllReactions();
		this.avatarImgLeftSide();
		this.commentResult = false;
		this.showToastMsg = false;
		this.isDesktop = this.isDesktopView();
	}
	processCurrentPageUrl() {
		let global =window;
		this.currentPageUrl = global.location.href;
		this.urlSegments = this.currentPageUrl.split(label.SLASH);
		this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
	}
					

	//Used to remove the Event from the fixed screen
	disconnectedCallback() {
		try {
			window.removeEventListener("resize", this.handleResizeBound);
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	//set the desktop view to fix the screen for popup
	handleResize() {
		this.isDesktop = this.isDesktopView();
	}

	// This function used to Fix the screen as static if the popup opens as per requirement
	isDesktopView() {
		const globalThis = window;
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
					this.showToastMsg = false;
				})
				.catch((error) => {
					this.handleShowToast(error.message); // catch Exception
				});
		} catch (error) {
			this.handleShowToast(error.message); // catch Exception
		}
	}
	// To get avatar of the logged in user
	avatarImgLeftSide() {
		try {
			USER_AVATAR()
				.then((result) => {
					if (result.length > 0 && result[0].BI_PSP_AvatarUrl__c) {
						this.loggedUserAvatar = result[0].BI_PSP_AvatarUrl__c;
					}
				})
				.catch((error) => {
					this.handleShowToast(error.message); // Catching Potential Error
				});
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	//After clicking create a new post go to createPost page with checking communityUsername
	goToCreatePost() {
		try {
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {
					const globalThis = window;
					if (result === true) {
						globalThis.location.assign(label.SLASH + this.urlName + label.CREATEPOST_URL);
					} else if (result === false) {
						globalThis.location.assign(
							label.SLASH + this.urlName + label.COMMUNITY_USERNAME_URL
						);
					} else {
						this.handleShowToast(label.ERROR_MESSAGE); // Catching Potential Error
					}
				})
				.catch((error) => {
					this.handleShowToast(error.message); // Catching Potential Error
				});
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	// Formate the Date with Created Dated like 2 YEARSAgo,30 MINUTES ago,etc
	calculateTimeDifference(createdDate) {
		const timeUnits = this.calculateTimeUnits(createdDate);
		return this.getTimeDifferenceStringBasedOnUnits(timeUnits);
	}
	
	calculateTimeUnits(createdDate) {
		const CURRENT_TIME = new Date();
		const POST_TIME = new Date(createdDate);
		const TIME_DIFFERENCE = CURRENT_TIME - POST_TIME;
	
		const SECONDS = Math.floor(TIME_DIFFERENCE / 1000);
		const MINUTES = Math.floor(SECONDS / 60);
		const HOURS = Math.floor(MINUTES / 60);
		const DAYS = Math.floor(HOURS / 24);
		const MONTHS = Math.floor(DAYS / 30);
		const YEARS = Math.floor(DAYS / 365);
	
		return { SECONDS, MINUTES, HOURS, DAYS, MONTHS, YEARS };
	}
	
	getTimeDifferenceStringBasedOnUnits(timeUnits) {
		const { SECONDS, MINUTES, HOURS, DAYS, MONTHS, YEARS } = timeUnits;
	
		switch (true) {
			case YEARS > 0:
				return this.getTimeDifferenceString(YEARS, label.CHATTER_YEAR, label.CHATTER_YEARS);
			case MONTHS > 0:
				return this.getTimeDifferenceString(MONTHS, label.CHATTER_MONTH, label.CHATTER_MONTHS);
			case DAYS > 0:
				return this.getTimeDifferenceString(DAYS, label.CHATTER_DAY, label.CHATTER_DAYS);
			case HOURS > 0:
				return this.getTimeDifferenceString(HOURS, label.CHATTER_HOUR, label.CHATTER_HOURS);
			case MINUTES > 0:
				return this.getTimeDifferenceString(MINUTES, label.CHATTER_MINUTE, label.CHATTER_MINUTES);
			default:
				return this.getTimeDifferenceString(SECONDS, label.CHATTER_SECOND, label.CHATTER_SECONDS);
		}
	}
	
	getTimeDifferenceString(value, singularLabel, pluralLabel) {
		return `${value} ${value === 1 ? singularLabel : pluralLabel} ${label.CHATTER_AGO}`;
	}


	// close the Toast message for delete post
	closeToastMsg() {
		this.showToastMsg = false;
	}

	// close the Toast message for delete post
	closeToastMsgForComment() {
		this.showDeleteToastMsgForComment = false;
	}

	// after calling this function for used to open the delete post popup from below
	get newPopupClass() {
		return this.isNewPopupOpen
			? "new-popup-container"
			: "new-popup-container hidden";
	}

	// To open a popup to delete the post
	openNewPopup(event) {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			showEmojiPopup: false,
			commentBox: false,
			displayHide: ""
		}));
		this.feedItemIdToDelete = event.currentTarget.dataset.customFeeditemId;

		this.isNewPopupOpen = true;
		this.isDesktopHandle();
	}
	isDesktopHandle() {
		if (this.isDesktop) {
			this.DocumentStyleHidden();
		} else {
			this.DocumentStyle();
		}
	}
	DocumentStyleHidden() {
		document.body.style.overflow = "hidden";
	}
	DocumentStyle() {
		document.body.style.overflow = "";
	}
	//close the delete post popup toast message
	closeNewPopup() {
		this.isNewPopupOpen = false;
		this.DocumentStyle();
	}

	// To delete a post
	handleDeletePost() {
		try {
			this.softDeleteFeedItem(this.feedItemIdToDelete)
				.then(() => {
					this.updatePostDetails();
					this.closePopup();
					this.updateDocumentStyle();
					this.scrollToTop();
					this.setToastMessages();
					this.handleToastTemplate();
					if (this.postDetails.length === 0) {
						this.redirectToMyPosts();
					}
				})
				.catch((error) => {
					this.handleShowToast(error.message); // Catching Potential Error
				});
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	softDeleteFeedItem(feedItemId) {
		return SOFTDELETE_FEEDITEM({ feedItemId });
	}

	updatePostDetails() {
		this.postDetails = this.postDetails.filter(
			(post) => post.Id !== this.feedItemIdToDelete
		);
	}

	closePopup() {
		this.isNewPopupOpen = false;
	}

	updateDocumentStyle() {
		this.DocumentStyle();
	}

	scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	setToastMessages() {
		this.showToastMsg = true;
		this.showDeleteToastMsg = true;
		this.showDeleteToastMsgForComment = false;
		this.showDivUnfollow = false;
		this.followingToastMsg = false;
	}

	redirectToMyPosts() {
		window.location.assign(label.SLASH + this.urlName + label.MY_POST_URL);
	}

	// close Follow and unfollow toast message popup
	closeFollowingToastMsg() {
		this.followingToastMsg = false;
	}

	closeShowDivUnfollow() {
		this.showDivUnfollow = false;
	}

	// To check whether the user is being followed or not
	profileFollowUnfollow(event) {
		this.followAvatar = event.currentTarget.dataset.avat;
		this.followUserName = event.currentTarget.dataset.name;
		this.enrolleeIdForFollow = event.currentTarget.dataset.enrollee;
		try {
			this.checkFollowStatus();
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	checkFollowStatus() {
		CHECK_FOLLOW_STATUS({
			loggedEnrolleeId: this.userEnrolleeId,
			otherEnrolleeId: this.enrolleeIdForFollow
		})
			.then((result) => {
				this.handleFollowResult(result);
			})
			.catch((error) => {
				this.handleShowToast(error.message); // Catching Potential Error
			});
	}

	handleFollowResult(result) {
		if (this.userEnrolleeId === this.enrolleeIdForFollow) {
			this.handleSelfFollow();
		} else if (result && result.length > 0) {
			this.countRecord = result.length;
			if (result[0].BI_PSP_Type__c === label.FOLLOWING_LABEL) {
				this.handleFollowing();
			} else {
				this.handleFollowProfile();
			}
		} else {
			this.handleFollowProfile();
		}
		return result;
	}

	handleSelfFollow() {
		this.emojiFollowProfile = false;
		this.emojiFollowing = false;
		this.DocumentStyle();
	}

	handleFollowing() {
		this.emojiFollowing = true;
		this.isDesktopHandle();
	}

	handleFollowProfile() {
		this.emojiFollowProfile = true;
		this.isDesktopHandle();
	}

	//open the follow/unfollow popup with fixed screen
	emojiFollowPopupButtonClick() {
		this.emojiFollowPopup = true;
		this.emojiFollowProfile = false;
		this.isDesktopHandle();
	}

	//close the follow/unfollow popup
	emojiCloseFollowPopup() {
		this.emojiFollowProfile = false;
		this.emojiFollowPopup = false;
		this.emojiFollowing = false;
		this.emojiFollowingPopup = false;
		if (this.isSecondPopupOpen === true) {
			this.DocumentStyleHidden();
		} else {
			this.DocumentStyle();
		}
	}

	// To follow the user
	emojiFollowConfirmationPopup() {
		try {
			FOLLOW_USER({
				enrolleeIdToFollow: this.enrolleeIdForFollow
			})
				.then(() => {
					this.showToastMsg = true;
					this.followingToastMsg = true;
					this.showDeleteToastMsg = false;
					this.showDeleteToastMsgForComment = false;
					this.showDivUnfollow = false;
					window.scrollTo({ top: 0, behavior: "smooth" });
					this.handleToastTemplate();
					this.showDivUnfollow = false;
				})
				.catch((error) => {
					this.handleShowToast(error.message); // Catching Potential Error
					return false;
				});
			this.emojiFollowProfile = false;
			this.emojiFollowPopup = false;
			this.DocumentStyle();
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	//open the following popup with fixed screen
	emojiFollowingPopupButtonClick() {
		this.emojiFollowingPopup = true;
		this.emojiFollowing = false;
		this.isDesktopHandle();
	}

	// To unfollow the user
	emojiUnfollowConfirmationPopup() {
		try {
			UNFOLLOW_USER({
				enrolleeIdToUnFollow: this.enrolleeIdForFollow
			})
				.then(() => {
					this.followingToastMsg = false;
					this.showDivUnfollow = true;
					this.showToastMsg = true;
					this.showDeleteToastMsg = false;
					this.showDeleteToastMsgForComment = false;
					window.scrollTo({ top: 0, behavior: "smooth" });
					this.handleToastTemplate();
				})
				.catch((error) => {
					this.handleShowToast(error.message); // Catching Potential Error
					return false;
				});
			this.emojiFollowing = false;
			this.emojiFollowingPopup = false;
			this.DocumentStyle();
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	//After clicking the react button show the popup with 5 emoji's (only clicked post's emoji button)
	reactPopupButton(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			showEmojiPopup: post.Id === POST_ID ? !post.showEmojiPopup : false,
			commentBox: false,
			displayHide: ""
		}));
	}

	// After cliking the Emoji's  save the details
	userReactedEmoji(event) {
		// Show loading spinner for react
		this.showSpinner = true;
		const FEED_ID = event.currentTarget.dataset.customFeeditemId;
		const EMOJI_REACTION_TYPE = event.currentTarget.dataset.reactionType;

		// Call apex to store emoji saved information
		try {
			this.saveEmojiReaction(FEED_ID, EMOJI_REACTION_TYPE);
		} catch (error) {
			this.showSpinner = false;
			this.handleFailedReaction(error.message);
		}
	}

	saveEmojiReaction(feedItemId, reactionType) {
		SAVE_EMOJI({ reactions: reactionType, feedItemId })
			.then((result) => {
				this.showSpinner = false;
				this.handleSuccessfulReaction(feedItemId, result);
			})
			.catch((error) => {
				this.showSpinner = false;
				this.handleFailedReaction(error.message);
			});
	}

	handleSuccessfulReaction(feedItemId, result) {
		this.saveEmojiResult = Array.isArray(result) ? result : [result];
		if (this.saveEmojiResult && this.saveEmojiResult.length > 0) {
			this.updatingPostDetails(feedItemId, result);
		} else {
			this.handleFailedReaction(label.UNABLE_TO_REACT);
		}
	}

	updatingPostDetails(feedItemId, result) {
		this.postDetails = this.postDetails.map((post) => {
			if (post.Id === feedItemId) {
				return {
					...post,
					showEmojiPopup: false,
					toReact: false,
					emojiYouReacted: this.getResultEmoji(result.BI_PSP_ReactionResult__c), // Change the react button to the emoji name that you reacted
					countEmoji: post.countEmoji + 1, // After emoji inserted increase emoji count by 1
					emojiReactedImg: this.getResultEmojiImg(result.BI_PSP_ReactionResult__c)
				};
			}
			return post;
		});
	}

	handleFailedReaction(errorMessage) {
		this.postDetailsCatch();
		this.handleShowToast(label.ERROR_MESSAGE, errorMessage, label.ERROR_VARIANT); // Catching Potential Error
	}

	postDetailsCatch() {
		this.showSpinner = false;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			showEmojiPopup: false
		}));
	}
	// after insert update the emojibox
	getReactionData(reactionResult) {
		const reactionMap = {
			[label.THUMSUP_VALUE]: { name: label.THUMSUP_NAME, img: this.imgThumbs },
			[label.SMILE_VALUE]: { name: label.SMILE_NAME, img: this.imgSmile },
			[label.HANDSFOLDED_VALUE]: { name: label.HANDSFOLDED_NAME, img: this.imgHands },
			[label.HEART_VALUE]: { name: label.HEART_NAME, img: this.imgLike },
			[label.THOUGHTFUL_VALUE]: { name: label.THOUGHTFUL_NAME, img: this.imgThought }
		};
	
		return reactionMap[reactionResult] || { name: "", img: "" };
	}
	
	getResultEmoji(reactionResult) {
		const reactionData = this.getReactionData(reactionResult);
		return reactionData.name;
	}
	
	// after insert update the emojibox image
	getResultEmojiImg(reactionResult) {
		const reactionData = this.getReactionData(reactionResult);
		return reactionData.img;
	}
	

	//check the reactions if already reacted or not (if any changes made in mypost page)
	checkAllReactions() {
		this.postDetails.forEach((post) => {
			this.checkReactions(post.Id);
		});
	}

	// get the id of the post and do the changes accordingly
	checkReactions(postId) {
		REACTIONSBY_FEED_ID({ feedItemId: postId })
			.then(result => this.processReactionResult(postId, result))
			.catch(error => this.handleShowToast(error.message));
	}

	processReactionResult(postId, result) {
		const REACTION_TYPE = parseInt(result, 10); // Assuming result is a numeric string
		const EMOJI_MAP = {
			1: label.THUMSUP_NAME,
			2: label.SMILE_NAME,
			3: label.HANDSFOLDED_NAME,
			4: label.HEART_NAME,
			5: label.THOUGHTFUL_NAME
		};

		this.updatePostDetailsWithReactions(postId, REACTION_TYPE, EMOJI_MAP);
	}

	updatePostDetailsWithReactions(postId, reactionType, emojiMap) {
		this.postDetails = this.postDetails.map((post) => {
			if (post.Id === postId) {
				post.toReact = reactionType === undefined || isNaN(reactionType);
				post.emojiYouReacted = emojiMap[reactionType] || "None";

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
	}

	// To unReact the post
	unReact(event) {
		this.closeAllCommentBoxes();
		this.showSpinner = true;
		this.showEmojiPopup = false;
		const FEED_ID = event.currentTarget.dataset.customFeeditemId;
		this.handleUnreact(FEED_ID);
	}

	closeAllCommentBoxes() {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: false
		}));
	}

	handleUnreact(feedItemId) {
		HARDDELETE_EMOJI_REACTION({ feedItemId })
			.then(() => this.handleUnreactSuccess(feedItemId))
			.catch((error) => this.handleUnreactError(error));
	}

	handleUnreactSuccess(feedItemId) {
		this.updatePostDetailsAfterUnreact(feedItemId);
		this.showSpinner = false;
	}

	handleUnreactError(error) {
		this.showSpinner = false;
		this.handleShowToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
		this.checkAllReactions();
	}

	updatePostDetailsAfterUnreact(feedItemId) {
		this.postDetails = this.postDetails.map((post) => {
			if (post.Id === feedItemId) {
				return {
					...post,
					toReact: true,
					countEmoji: post.countEmoji - 1 // Decrease the emoji count
				};
			}
			return post;
		});
	}



	//close the emoji reaction popup
	// closeEmojiPopup() {
	// 	this.postDetails = this.postDetails.map((post) => ({
	// 		...post,
	// 		showEmojiPopup: false
	// 	}));
	// }

	// this popup has the information about the reacted user's for the particular post
	closeSecondPopup(event) {
		this.ThumbsUptrue();
		const CLICKED_POST_ID = event.currentTarget.dataset.customFeeditemId;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			secondPopupClass:
				post.Id === CLICKED_POST_ID ? "!second-popup" : "second-popup hidden"
		}));
		this.isSecondPopupOpen = false;
		this.DocumentStyle();
		this.currentPostId = null;
	}

	//open the particular reaction popup
	get secondPopupClass() {
		return this.isSecondPopupOpen ? "!second-popup" : "second-popup hidden";
	}
	EmojiText() {
		this.emojiText = "emojiText";
		this.emojiTextSmile = "emojiText";
		this.emojiTextHands = "emojiText";
		this.emojiTextHeart = "emojiText";
		this.emojiTextThinking = "emojiText";
	}
	ThumbsUptrue() {
		this.noReactionForThisEmoji = false;
		this.displayTemplateThumbsUp = true;
		this.displayTemplateSmile = false;
		this.displayTemplateFoldedHands = false;
		this.displayTemplateHeart = false;
		this.displayTemplateThinkingFace = false;
	}
	// After clicking show the thumbsup emoji reacted users
	viewReaction(event) {
		this.EmojiText();
		this.emojiText = "emojiTextbox";
		const CLICKED_POST_ID = event.currentTarget.dataset.customFeeditemId;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			secondPopupClass:
				post.Id === CLICKED_POST_ID ? "second-popup" : "second-popup hidden",
			showEmojiPopup: false,
			commentBox: false,
			displayHide: ""
		}));
		this.isSecondPopupOpen = true;
		this.isDesktopHandle();
		this.currentPostId = CLICKED_POST_ID;
		this.displayTemplateThumbsUp = true;
		this.feedItemIdEmoji = event.currentTarget.dataset.customFeeditemId;
		try {
			TOTAL_REACTIONS({ feedItemId: this.feedItemIdEmoji, reactionType: label.THUMSUP_VALUE })
				.then(this.handleTotalReactionsSuccess.bind(this))
				.catch(this.handleTotalReactionsError.bind(this));
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	handleTotalReactionsSuccess(result) {
		if (result && result.length > 0) {
			this.ThumbsUptrue();
			this.thumbsUpResult = result;
			this.thumbsUpResult = this.thumbsUpResult.map((Thumbsup) => ({
				...Thumbsup,
				avatarDataForReaction:
					Thumbsup.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_AvatarUrl__c,
				reactionyouname:
					this.userEnrolleeId === Thumbsup.BI_PSP_CareProgramEnrolleeEmoji__c
						? label.YOU_LABEL
						: Thumbsup.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
			}));
		} else {
			this.NoReactionComment();
		}
	}

	handleTotalReactionsError(error) {
		this.handleShowToast(error.message); // Catching Potential Error
		this.noReactionForThisEmoji = true;
	}


	//show thumbs emoji reaction - users
	showTemplateThumbsupResult() {
		this.EmojiText();
		this.emojiText = "emojiTextbox";
		try {
			TOTAL_REACTIONS({ feedItemId: this.feedItemIdEmoji, reactionType: label.THUMSUP_VALUE })
				.then(this.handleTotalReactionsSuccess.bind(this))
				.catch(this.handleTotalReactionsError.bind(this));
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	// show smile emoji reaction - users
	showTemplateSmileResult() {
		this.EmojiText();
		this.emojiTextSmile = "emojiTextbox";
		try {
			TOTAL_REACTIONS({ feedItemId: this.feedItemIdEmoji, reactionType: label.SMILE_VALUE })
				.then((result) => {
					if (result && result.length > 0) {
						this.handleSmileTrue();
						this.smileResult = result;
						this.smileResult = this.smileResult.map((Smile) => ({
							...Smile,
							avatarDataForReaction:
								Smile.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_AvatarUrl__c,
							reactionyouname:
								this.userEnrolleeId === Smile.BI_PSP_CareProgramEnrolleeEmoji__c
									? label.YOU_LABEL
									: Smile.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
						}));
					} else {
						this.NoReactionComment();
					}
				})
				.catch((error) => {
					this.handleTotalReactionsError(error.message); // Catching Potential Error
				});
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}
	handleSmileTrue() {
		this.noReactionForThisEmoji = false;
		this.displayTemplateSmile = true;
		this.displayTemplateThumbsUp = false;
		this.displayTemplateFoldedHands = false;
		this.displayTemplateHeart = false;
		this.displayTemplateThinkingFace = false;
	}

	//show foldedhands emoji reaction - users
	showTemplateFoldedhandsResult() {
		this.EmojiText();
		this.emojiTextHands = "emojiTextbox";

		try {
			TOTAL_REACTIONS({ feedItemId: this.feedItemIdEmoji, reactionType: label.HANDSFOLDED_VALUE })
				.then((result) => {
					if (result && result.length > 0) {
						this.handleFoldsHandTrue();
						this.foldedHandsResult = result;
						this.foldedHandsResult = this.foldedHandsResult.map(
							(foldedhands) => ({
								...foldedhands,
								avatarDataForReaction:
									foldedhands.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_AvatarUrl__c,
								reactionyouname:
									this.userEnrolleeId === foldedhands.BI_PSP_CareProgramEnrolleeEmoji__c
										? label.YOU_LABEL
										: foldedhands.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
							})
						);
					} else {
						this.NoReactionComment();
					}
				})
				.catch((error) => {
					this.handleTotalReactionsError(error.message); // Catching Potential Error
				});
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}
	handleFoldsHandTrue() {
		this.noReactionForThisEmoji = false;
		this.displayTemplateFoldedHands = true;
		this.displayTemplateThumbsUp = false;
		this.displayTemplateSmile = false;
		this.displayTemplateHeart = false;
		this.displayTemplateThinkingFace = false;
	}
	//show heart emoji reaction - users
	showTemplateHeartResult() {
		this.EmojiText();
		this.emojiTextHeart = "emojiTextbox";
		try {
			TOTAL_REACTIONS({ feedItemId: this.feedItemIdEmoji, reactionType: label.HEART_VALUE })
				.then((result) => {
					if (result && result.length > 0) {
						this.handleHeartTrue();
						this.heartResult = result;
						this.heartResult = this.heartResult.map((Heart) => ({
							...Heart,
							avatarDataForReaction:
								Heart.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_AvatarUrl__c,
							reactionyouname:
								this.userEnrolleeId === Heart.BI_PSP_CareProgramEnrolleeEmoji__c
									? label.YOU_LABEL
									: Heart.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
						}));
					} else {
						this.NoReactionComment();
					}
				})
				.catch((error) => {
					this.handleTotalReactionsError(error.message); // Catching Potential Error
				});
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}
	handleHeartTrue() {
		this.noReactionForThisEmoji = false;
		this.displayTemplateHeart = true;
		this.displayTemplateThumbsUp = false;
		this.displayTemplateSmile = false;
		this.displayTemplateFoldedHands = false;
		this.displayTemplateThinkingFace = false;
	}
	NoReactionComment() {
		this.noReactionForThisEmoji = true;
		this.displayTemplateThumbsUp = false;
		this.displayTemplateSmile = false;
		this.displayTemplateFoldedHands = false;
		this.displayTemplateHeart = false;
		this.displayTemplateThinkingFace = false;
	}
	//show thinkingface emoji reaction - users
	showTemplateThinkingfaceResult() {
		this.EmojiText();
		this.emojiTextThinking = "emojiTextbox";
		try {
			TOTAL_REACTIONS({ feedItemId: this.feedItemIdEmoji, reactionType: label.THOUGHTFUL_VALUE })
				.then((result) => {
					if (result && result.length > 0) {
						this.handleThinkFaceTrue();
						this.thinkingFaceResult = result;
						this.thinkingFaceResult = this.thinkingFaceResult.map((think) => ({
							...think,
							avatarDataForReaction:
								think.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_AvatarUrl__c,
							reactionyouname:
								this.userEnrolleeId === think.BI_PSP_CareProgramEnrolleeEmoji__c
									? label.YOU_LABEL
									: think.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
						}));
					} else {
						this.NoReactionComment();
					}
				})
				.catch((error) => {
					this.handleTotalReactionsError(error.message); // Catching Potential Error
				});
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}
	handleThinkFaceTrue() {
		this.noReactionForThisEmoji = false;
		this.displayTemplateThinkingFace = true;
		this.displayTemplateThumbsUp = false;
		this.displayTemplateSmile = false;
		this.displayTemplateFoldedHands = false;
		this.displayTemplateHeart = false;
	}
	//show these three dot at only mobile view
	get threedotClass() {
		return this.isThreeDotClassOpen
			? "threedot-container"
			: "threedot-container hidden";
	}

	threedotOpen(event) {
		this.commentId = event.currentTarget.dataset.customFeeditemId;
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			threedotClass:
				comment.Id === this.commentId ? !comment.threedotClass : false
		}));
		this.isThreeDotClassOpen = true;
		this.DocumentStyleHidden();
	}

	//close the action popup
	closeThreedotActionPopup() {
		this.isThreeDotClassOpen = false;
		this.DocumentStyle();
	}

	get firstPopupClass() {
		return this.isFirstPopupOpen ? "popup-container" : "popup-container hidden";
	}

	//OPEN THE ACTION POPUP after clicking the threedots
	openFirstPopup(event) {
		this.isThreeDotClassOpen = false;
		this.DocumentStyle();
		this.feedCommentItemIdToDelete =
			event.currentTarget.dataset.customFeeditemId;
		this.postitemid = event.currentTarget.dataset.customPostitemId;
		this.isFirstPopupOpen = true;
		this.DocumentStyleHidden();
	}

	//close the delete comment confirmation popup
	closeFirstPopup() {
		this.isFirstPopupOpen = false;
		this.DocumentStyle();
	}

	// To delete the comment
	handleDeleteComment() {
		this.isFirstPopupOpen = false;
		this.DocumentStyle();
		try {
			SOFTDELETE_COMMENT_ITEM({
				feedCommentItemId: this.feedCommentItemIdToDelete
			})
				.then(() => {
					this.displayComment = this.displayComment.filter(
						(comment) => comment.Id !== this.feedCommentItemIdToDelete
					);
					this.postDetails = this.postDetails.map((post) => {
						if (post.Id === this.postitemid) {
							return {
								...post,
								commentCount: post.commentCount - 1
							};
						}
						return post;
					});
					window.scrollTo({ top: 0, behavior: "smooth" });
					this.showToastTrue();
					this.handleToastTemplate();
				})
				.catch((error) => {
					this.handleShowToast(error.message); // Catching Potential Error
				});
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}
	showToastTrue() {
		this.showToastMsg = true;
		this.showDeleteToastMsgForComment = true;
		this.showDeleteToastMsg = false;
		this.showDivUnfollow = false;
		this.followingToastMsg = false;
	}
	//close the commentbox
	commentCancelButton() {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: false,
			displayHide: ""
		}));
		this.emptyCommand();
		this.commentOption = [];
	}
	emptyCommand() {
		this.comment = "";
	}
	editCommand() {
		this.editComment = "";
	}
	// To comment on a post
	handleCommentChange(event) {
		this.comment = event.target.value;
		try {
			if (this.comment && this.comment !== label.NO_COMMENTS) {
				const FEED_ITEM_ID = event.currentTarget.dataset.customFeeditemId;
				SAVE_COMMENT_OPTION({
					commentContent: this.comment,
					postId: FEED_ITEM_ID
				})
					.then(() => {
						this.emptyCommand();
						this.postDetails = this.postDetails.map((post) => {
							if (post.Id === FEED_ITEM_ID) {
								return {
									...post,
									commentCount: post.commentCount + 1,
									commentBox:
										post.Id === FEED_ITEM_ID ? !post.commentBox : false,
									displayHide:
										post.Id === FEED_ITEM_ID && !post.commentBox ? "Hide" : ""
								};
							}
							return post;
						});
						this.emptyCommand();
					})
					.catch((error) => {
						this.handleToast(error.message); // Catching Potential Error

					});
			} else {
				this.emptyCommand();
			}
		} catch (error) {
			this.handleShowToast(error.message); // Catching Potential Error
		}
	}

	// To edit the comment for a post
	editTheComment(event) {
		this.editTheCommentTxt = "editTheCommentTxt";
		this.isThreeDotClassOpen = false;
		this.DocumentStyle();

		this.commentId = event.currentTarget.dataset.customFeeditemId;
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			showEditTheComment:
				comment.Id === this.commentId ? !comment.showEditTheComment : false
		}));
	}

	//Hide the edit dropdown
	closeShowEditTheComment() {
		this.editTheCommentTxt = "HideeditTheCommentTxt";
		this.displayComment = this.displayComment.map((comment) => ({
			...comment,
			showEditTheComment: false
		}));
	}

	//To update the comment
	handleCommentChangeEdit(event) {
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
										showEditTheComment: false
									};
								}
								return comment;
							});
							this.editCommand();
							this.emptyCommand();
						} else {
							this.editCommand();
							this.handleToast(label.ERROR_MESSAGE); // Catching Potential Error
						}
					})
					.catch((error) => {
						this.handleToast(error.message); // Catching Potential Error
						this.editCommand();

					});
			}
		} catch (error) {
			this.editCommand();
			this.handleToast(error.message); // Catching Potential Error
		}
	}
	handleToast(error) {
		this.emptyCommand();
		this.handleShowToast(error.message);
	}
	// To calculate time difference for comments from creaed time
	calculateTimeDifferenceForComment(createdDate) {
		const timeUnits = this.calculateTimeUnits(createdDate);
		return this.formatTimeDifferenceBasedOnUnits(timeUnits);
	}
	
	formatTimeDifferenceBasedOnUnits(timeUnits) {
		const { SECONDS, MINUTES, HOURS, DAYS, MONTHS, YEARS } = timeUnits;
	
		switch (true) {
			case YEARS > 0:
				return this.formatTimeDifference(YEARS, label.CHATTER_YEAR, label.CHATTER_YEARS);
			case MONTHS > 0:
				return this.formatTimeDifference(MONTHS, label.CHATTER_MONTH, label.CHATTER_MONTHS);
			case DAYS > 0:
				return this.formatTimeDifference(DAYS, label.CHATTER_DAY, label.CHATTER_DAYS);
			case HOURS > 0:
				return this.formatTimeDifference(HOURS, label.CHATTER_HOUR, label.CHATTER_HOURS);
			case MINUTES > 0:
				return this.formatTimeDifference(MINUTES, label.CHATTER_MINUTE, label.CHATTER_MINUTES);
			default:
				return this.formatTimeDifference(SECONDS, label.CHATTER_SECOND, label.CHATTER_SECONDS);
		}
	}
	
	formatTimeDifference(value, singularLabel, pluralLabel) {
		return `${value} ${value === 1 ? singularLabel : pluralLabel} ${label.CHATTER_AGO}`;
	}

	//comment button and show the comments (users who commented for the post with date,name,comment etc...)
	closecomment(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: post.Id === POST_ID ? !post.commentBox : false,
			displayHide: ""
		}));
		this.commentBox = true;
	}

	// Toggles the visibility of the comment box
	toggleCommentBox(POST_ID) {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: post.Id === POST_ID ? !post.commentBox : false,
			displayHide: post.Id === POST_ID && !post.commentBox ? "Hide" : "",
			showEmojiPopup: false
		}));
		this.commentBox = true;
	}

	// Fetches comments from the server and updates the component state
	fetchComments(POST_ID) {
		VIEW_COMMENTS({ feedItemId: POST_ID })
			.then((result) => this.processComments(result))
			.catch((error) => this.handleCommentError(error));
	}

	// Processes and formats the fetched comments
	processComments(result) {
		if (result && result.length > 0) {
			this.displayComment = result.map((post) => ({
				...post,
				formattedTimeDifferenceForComment: this.calculateTimeDifference(post.CreatedDate),
				isCurrentUserCommentCreator: this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c,
				avatarDataForComment: post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_AvatarUrl__c,
				youname: this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c
					? label.YOU_LABEL
					: post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c !== null
						? post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c
						: label.NO_USERNAME_LABEL
			}));
			this.commentResult = true;
		} else {
			this.commentResult = false;
		}
	}

	// Handles errors when fetching comments
	handleCommentError(error) {
		this.handleShowToast(error.message);
		this.commentResult = false;
	}

	// Defines comment options based on TITLE and BODY
	setCommentOptions(TITLE, BODY) {
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
					{
						label: label.OPT_EVERYTHING_ALRIGHT,
						value: label.OPT_EVERYTHING_ALRIGHT
					},
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
					{
						label: label.OPT_EVERYTHING_ALRIGHT,
						value: label.OPT_EVERYTHING_ALRIGHT
					},
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

		if (commentOptionsMap[TITLE] && commentOptionsMap[TITLE][BODY]) {
			this.commentOption = commentOptionsMap[TITLE][BODY];
		} else {
			this.commentOption = [{ label: label.NO_COMMENTS, value: label.NO_COMMENTS }];
		}
	}

	// Main method called when the comment button is clicked
	commentBtn(event) {
		const POST_ID = event.currentTarget.dataset.customFeeditemId;
		const TITLE = event.currentTarget.dataset.customFeeditemTitle;
		const BODY = event.currentTarget.dataset.customFeeditemBody;

		this.toggleCommentBox(POST_ID);
		this.fetchComments(POST_ID);
		this.setCommentOptions(TITLE, BODY);
	}

	//after clicking the reactions button on the notification components it redirect to mypost, so open the particular reacted post
	//scroll to the particular post and open the viewReaction popup
	viewReactionfromnavigation(navigationFromNotificationReactionId) {
		this.EmojiText();
		this.emojiText = "emojiTextbox";
		const CLICKED_POST_ID = navigationFromNotificationReactionId;
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			secondPopupClass:
				post.Id === CLICKED_POST_ID ? "second-popup" : "second-popup hidden",
			showEmojiPopup: false,
			commentBox: false,
			displayHide: ""
		}));
		this.isSecondPopupOpen = true;
		this.isDesktopHandle();
		this.currentPostId = CLICKED_POST_ID;
		this.displayTemplateThumbsUp = true;
		this.feedItemIdEmoji = CLICKED_POST_ID;
		TOTAL_REACTIONS({ feedItemId: this.feedItemIdEmoji, reactionType: label.THUMSUP_VALUE })
			.then((result) => {
				if (result && result.length > 0) {
					this.ThumbsUptrue();
					this.thumbsUpResult = result;
					this.thumbsUpResult = this.thumbsUpResult.map((Thumbsup) => ({
						...Thumbsup,
						avatarDataForReaction:
							Thumbsup.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_AvatarUrl__c,
						reactionyouname:
							this.userEnrolleeId === Thumbsup.BI_PSP_CareProgramEnrolleeEmoji__c
								? label.YOU_LABEL
								: Thumbsup.BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c
					}));
				} else {
					this.NoReactionComment();
				}
			})
			.catch((error) => {
				this.handleShowToast(error.message); // Catching Potential Error
				this.noReactionForThisEmoji = true;
			});
		// Use MutationObserver to observe changes in the DOM
		this.openCommentByClickId(CLICKED_POST_ID);
	}
	openCommentByClickId(CLICKED_POST_ID) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				let postElementbyclass = this.template.querySelector(
					"." + CLICKED_POST_ID
				);
				if (postElementbyclass) {
					postElementbyclass.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
					observer.disconnect(); // Stop observing once the element is found
				}
			});
		});
		// Start observing the target node for configured mutations
		observer.observe(this.template, { childList: true, subtree: true });
	}
	//scroll to the particular comment and open the commentBox
	commentBtnFromNavigation(navigationFromNotificationCommentId) {
		this.toggleCommentBoxNavi(navigationFromNotificationCommentId);
		this.openCommentById(navigationFromNotificationCommentId);
		this.fetchCommentsNavi(navigationFromNotificationCommentId);
		this.fetchCommentOptions(navigationFromNotificationCommentId);
	}

	toggleCommentBoxNavi(postId) {
		this.postDetails = this.postDetails.map((post) => ({
			...post,
			commentBox: post.Id === postId ? !post.commentBox : false,
			displayHide: post.Id === postId && !post.commentBox ? "Hide" : "",
			showEmojiPopup: false
		}));
		this.commentBox = true;
	}

	openCommentById(postId) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				let postElementbyclass = this.template.querySelector("." + postId);
				if (postElementbyclass) {
					postElementbyclass.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
					observer.disconnect(); // Stop observing once the element is found
				}
			});
		});
		observer.observe(this.template, { childList: true, subtree: true });
	}

	fetchCommentsNavi(postId) {
		VIEW_COMMENTS({ feedItemId: postId })
			.then((result) => {
				if (result && result.length > 0) {
					this.displayComment = result.map((post) => ({
						...post,
						formattedTimeDifferenceForComment: this.calculateTimeDifference(post.CreatedDate),
						isCurrentUserCommentCreator: this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c,
						avatarDataForComment: post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_AvatarUrl__c,
						youname: this.userEnrolleeId === post.BI_PSP_CareProgramEnrolleeCmt__c ? label.YOU_LABEL : post.BI_PSP_CareProgramEnrolleeCmt__r.BI_PSP_CommunityUsername__c
					}));
					this.commentResult = true;
				} else {
					this.commentResult = false;
				}
			})
			.catch((error) => {
				this.handleShowToast(error.message);
				this.commentResult = false;
			});
	}

	fetchCommentOptions(postId) {
		COMMENT_OPTIONS({ feedItemId: postId })
			.then((result) => {
				if (result && result.length > 0) {
					this.categoryTitle = result[0].BI_PSP_Category__c;
					this.phraseBody = result[0].BI_PSP_Phrase__c;
					this.setCommentOptions(this.categoryTitle, this.phraseBody);
				}
			})
			.catch((error) => {
				this.handleShowToast(error.message);
			});
	}
handleShowToast(error){
	this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
}

	// To detect the site is branded or unassigned
	detectBrandedOrUnassigned() {
		const globalThis = window;
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
			this.urlName = label.BRANDED_URL;
		}
		//set the url and navigations are done within unassigned site
		else {
			this.urlName = label.UNASSIGNED_URL;
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