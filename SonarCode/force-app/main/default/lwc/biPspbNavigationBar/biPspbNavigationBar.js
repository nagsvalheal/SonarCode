// This comppnent is used for navigating to one page to another page for all unassigned pages
// To import Libraries
import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { resources } from 'c/biPspLabelAndResourceGeneral';
// To import Apex Classes
import USER_DETAILS from "@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser";
import PROFILE_DETAILS from "@salesforce/apex/BI_PSPB_LoginCtrl.profileDetails";
import GET_CAREGIVER_ACCOUNT from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver";
import CHECK_COMMUNITY_USERNAME from "@salesforce/apex/BI_PSPB_FeedUsernameCtrl.checkCommunityUsername";
import PATIENT_STATUS from "@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus";
import COUNT_ASSESSMENT from "@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName";
import GET_PATIENT_AFTER_WEEKS from "@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks";

// To get Current UserId
import Id from "@salesforce/user/Id";

export default class BiPspbNavigationBar extends LightningElement {
	//Variable Declarations
	accName;
	taskCount;
	patientStatusVal;
	showTreatVideo = false;
	downHeadIcon = resources.DOWN_HEAD_ICON;
	SelectIcon = resources.SELECT_ICON;
	navlogo = resources.SITE_LOGO;
	showMenu;
	showToLogin;
	HIcon = resources.HOME_ICON;
	NIcon = resources.NOTIFIC_ICON;
	MenuIcon = resources.MENU_ICON;
	NIconCol = resources.NOTIFIC_ICON_COLOR;
	CrossIcon = resources.CROSS_ICON;

	isMenuOpen;
	patientMenuList;
	caregiverMenuList;
	userName;
	showNavDetails;
	userInfo;
	currentUserIfo;
	showCareGiverMenus;
	activeData;
	caregiverDeskMenu = false;
	patientDeskMenu = false;
	currentPageUrl;
	urlSegments;
	baseUrl;
	showChallenge;
	showSymptomTracker;
	showInformationCenter;
	showQuestionnaires;
	showHomeLine;
	showSupport;
	showCommunity;
	lastSegment;
	showPopup;
	showSupportmenu;
	showquestionnairemenu;
	showInformationCentermenu;
	showChallengesmenu;
	showCommunitymenu;
	showTabMenu;
	targetDate14;
	stwai;
	stpss;
	stdlq;
	stqsq;
	count;
	userId = Id;
	showuserSubmenu;
	userType;
	showPrescriptionmenu;
	showNotificationCentermenu;
	acutePatient = resources.ACUTE;
	brandedDevProfile = resources.BRANDED_DEV_UI_PROFILES;
	adminProfile = resources.SYSTEM_ADMIN_PROFILE;
	patientProfile = resources.PATIENT_PROFILE;
	caregiverProfiles = resources.CAREGIVER_PROFILE;
	myProfile = resources.PATIENT_MYPROFILE_URL;
	myCaregiver = resources.MYCAREGIVER_URL;
	patientAvatar = resources.PATIENT_SELECT_AVATAR_URL;
	patientNotification = resources.PATIENT_NOTIFICATION_URL;
	unAssignedUrl = resources.UNASSIGNED_URL;
	caregiverProfile = resources.CAREGIVER_PROFILE_URL;
	patientInformation = resources.CAREGIVER_PATIENT_URL;
	selectAvatar = resources.CAREGIVER_SELECT_AVATAR_URL;
	caregiverNotification = resources.CAREGIVER_NOTIFICATION_URL;
	allPost = resources.ALLPOST_URL;
	myPost = resources.CHATTER_MYPOST;
	follower = resources.FOLLOWERS_URL;
	following = resources.FOLLOWING_URL;
	chatterSignUp = resources.CHATTER_SIGNUP_URL;
	unAssigned = resources.UNASSIGNED_LABEL;
	infoLanding = resources.INFO_LANDINGPAGE_URL;
	acuteDashboard = resources.ACUTE_DASHBOARD;
	challenges = resources.CHALLENGES_URL;
	trophy = resources.TROPHY_CASE_SITEURL;
	outStanding = resources.OUTSTANDINGPAGE_URL;
	messageCenter = resources.MESSAGE_CENTER_URL;
	supportCenter = resources.SUPPORT_PAGE_URL;
	myCase = resources.MYCASE_PAGE_URL;
	summaryQues = resources.SUMMARY_URL;
	wapiCompleted = resources.WAPI_COMPLETED_SITEURL;
	dlqiCompleted = resources.DLQI_COMPLETED_SITEURL;
	pssCompleted = resources.PSS_COMPLETED_SITEURL;
	qsqOneCompleted = resources.QSQ_COMPLETED_TWOMONTHS_URL;
	qsqTwoCompleted = resources.QSQ_COMPLETED_FOURTEENWEEKS_URL;
	letPersonlize = resources.LETSPERSONALISE_URL;
	prescriptionStatus = resources.PRESCRIPTION_STATUS_URL;
	symptomLanding = resources.SYMPTOM_TRACKER_LP_URL;
	action = resources.ACTION_SITEURL;
	history = resources.HISTORY_SITEURL;
	articleCategory = resources.ARTICLE_CATEGORY_URL;
	detailedArticle = resources.DETAILED_ARTICLE_URL;
	searchResult = resources.SEARCH_RESULT_URL;
	symptomTrackerGraph = resources.SYMPTOM_TRACKER_GRAPH_URL;
	symptomTrackerMain = resources.SYMPTOM_TRACKER_MAINPAGE_URL;
	pssQuestionnaire = resources.PSORIASIS_SITEURL;
	wapiQuestionnaire = resources.WAPI_SITEURL;
	qualitativeTwo = resources.QUALITATIVE_TWOMONTHS_URL;
	qualativeFour = resources.QUALITATIVE_FOURTEENWEEKS_URL;
	medicalInformation = resources.MEDICAL_INFO_ENQUIRY_URL;
	reportAdverse = resources.REPORT_ADVERSE_EVENT_URL;
	// platFormSupport = resources.REPORT_ADVERSE;
	createPost = resources.CREATEPOST_URL;
	unAssignedsite = resources.UNASSIGNED;
	loginUrl = resources.LOGIN;
	brandedUrl = resources.BRSITE_URL;
	secureLogout = resources.SECURE_LOGOUT;
	updateRx = resources.UPDATE_PRESCRIPTION_URL;
	loginPageUrl = resources.LOGIN_PAGE;
	acuteVideoPage = resources.ACUTE_VIDEO_PAGE;
	targetFourteenWeeksDate=null; 
	errorMsg = resources.ERROR_MESSAGE;
	errorVariant = resources.ERROR_VARIANT;
	completedLabel = resources.COMPLETED;
	expiredLabel = resources.EXPIRED;
	//Qualitative Date for topbar navigation
	patientAfterThreeMonthsAndFourteenWeeks() {
		try{
			GET_PATIENT_AFTER_WEEKS()
				.then(data => {
					if (data) {
						this.targetFourteenWeeksDate = data.targetFourteenWeeksDate ?? null;
					}
				})
				.catch(error => {
					this.showToast(this.errorMsg, error.message, this.errorVariant);
				})
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	//Used to get information regarding the loggedin caregiver
	patientInfo() {
		try{
			GET_CAREGIVER_ACCOUNT({ userId: Id, isActive: true })
				.then((patient) => {
					this.activeData = patient.map((pat) => ({
						Id: pat.BI_PSPB_Patient__c,
						Name: pat.BI_PSPB_Patient__r.Name,
						CaregiveID: pat.BI_PSPB_Caregiver__c
					}));
					if (this.activeData.length > 0) {
						this.showCareGiverMenus = true;
					}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	
	//Navigation

	openUpdatePrescription() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.updateRx);
	}
	//Used to get the user and profile information of the current loggedin user to render the navigation bar details.

	connectedCallback() {
		try {
			let globalThis = window;
			this.getPatienStatus();
			this.currentPageUrl = globalThis.location?.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			this.userType = typeof Id;
			const REGEX = /\/([^\\/?#]+)(?:\?.*|)$/iu;
			const MATCH = REGEX.exec(this.currentPageUrl);
			this.lastSegment = MATCH && MATCH[1];
			if (this.lastSegment !== null && this.lastSegment !== "") {
				this.showUnderlineforMenus();
			} else {
				this.showHomeLine = true;
			}
			if (this.userType !== 'undefined') {
				USER_DETAILS()
					.then((user) => {
						this.currentUserIfo = user;
						this.fetchAssessmentCount();
						if (this.currentUserIfo.BI_PSPB_Caregiver__c === true) {
							this.patientInfo();
						}
						this.userName = user.FirstName + " " + user.LastName;
						PROFILE_DETAILS()
							.then((profile) => {
								this.userInfo = profile;
								if (
									this.userInfo.Name === this.adminProfile ||
									this.userInfo.Name === this.patientProfile ||
									this.userInfo.Name === this.caregiverProfiles
								) {
									this.showMenu = true;
									this.showNavDetails = true;
									this.showToLogin = false;
									if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
										this.caregiverDeskMenu = false;
										this.patientDeskMenu = true;
										this.patientAfterThreeMonthsAndFourteenWeeks();
									} else {
										this.caregiverDeskMenu = true;
										this.patientDeskMenu = false;
										this.patientAfterThreeMonthsAndFourteenWeeks();
									}
								} else if (this.userInfo.Name === this.brandedDevProfile) {
									this.showMenu = false;
									this.showNavDetails = false;
									this.showToLogin = true;
								}
							})
							.catch((error) => {
								this.showToast(this.errorMsg, error.message, this.errorVariant);
							});
					})
					.catch((error) => {
						this.showToast(this.errorMsg, error.message, this.errorVariant);
					});
			} else {
				this.showMenu = false;
				this.showNavDetails = false;
				this.showToLogin = true;
			}	
		} catch (error) {
			this.showToast(this.errorMsg, error.message, this.errorVariant);
		}
	}
	// This method is used t collect the assessment deatils.

	fetchAssessmentCount() {
		try{
			COUNT_ASSESSMENT()
				.then((result) => {
					if (result && result.length > 0) {
						this.count = result;
						if (
							this.count[0] !== 0 ||
							this.count[1] !== 0 ||
							this.count[2] !== 0 ||
							this.count[3] !== 0
						) {
							this.showTabMenu = true;
							this.stwai = this.count[0];
							this.stpss = this.count[1];
							this.stdlq = this.count[2];
							this.stqsq = this.count[3];
						} else {
							this.showTabMenu = false;
						}
					} else {
						this.showTabMenu = false;
					}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.message, this.errorVariant); // Catching Potential Error from Apex
					this.showTabMenu = false;
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}


	showUnderlineforMenus() {
		const segmentActions = {
			[this.challenges]: 'showChallenge',
			[this.trophy]: 'showChallenge',
			[this.infoLanding]: 'showInformationCenter',
			[this.articleCategory]: 'showInformationCenter',
			[this.searchResult]: 'showInformationCenter',
			[this.detailedArticle]: 'showInformationCenter',
			[this.acuteVideoPage]: 'showInformationCenter',
			[this.symptomLanding]: 'showSymptomTracker',
			[this.symptomTrackerGraph]: 'showSymptomTracker',
			[this.symptomTrackerMain]: 'showSymptomTracker',
			[this.outStanding]: 'showQuestionnaires',
			[this.summaryQues]: 'showQuestionnaires',
			[this.dlqiCompleted]: 'showQuestionnaires',
			[this.letPersonlize]: 'showQuestionnaires',
			[this.pssQuestionnaire]: 'showQuestionnaires',
			[this.qualitativeTwo]: 'showQuestionnaires',
			[this.qualativeFour]: 'showQuestionnaires',
			[this.wapiCompleted]: 'showQuestionnaires',
			[this.pssCompleted]: 'showQuestionnaires',
			[this.qsqOneCompleted]: 'showQuestionnaires',
			[this.qsqTwoCompleted]: 'showQuestionnaires',
			[this.unAssignedUrl]: 'showHomeLine',
			[this.acuteDashboard]: 'showHomeLine',
			[this.supportCenter]: 'showSupport',
			[this.medicalInformation]: 'showSupport',
			[this.reportAdverse]: 'showSupport',
			// [this.platFormSupport]: 'showSupport',
			[this.myCase]: 'showSupport',
			[this.allPost]: 'showCommunity',
			[this.chatterSignUp]: 'showCommunity',
			[this.myPost]: 'showCommunity',
			[this.createPost]: 'showCommunity',
			[this.follower]: 'showCommunity',
			[this.following]: 'showCommunity',
		};
	
		// Reset all flags
		this.showChallenge = false;
		this.showInformationCenter = false;
		this.showSymptomTracker = false;
		this.showQuestionnaires = false;
		this.showHomeLine = false;
		this.showSupport = false;
		this.showCommunity = false;
	
		// Set the corresponding flag if lastSegment matches any key in segmentActions
		if (segmentActions[this.lastSegment]) {
			this[segmentActions[this.lastSegment]] = true;
		}
	}

	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	getPatienStatus()
	{
		try{
			PATIENT_STATUS({ userId: Id })
				.then((data) => {
					this.patientStatusVal = data;
					if (this.patientStatusVal === this.unAssignedsite) {
						this.showTreatVideo = false;
					} else {
						this.showTreatVideo = true;
					}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	//Used to decide the Navigation for community chatter

	openCommunity() {
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.allPost
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Navigation for Caregiver/Patient

	userNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.myProfile
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.caregiverProfile
			);
		}
	}

	userNavigationMyprofile() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.myProfile
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.caregiverProfile
			);
		}
	}

	userNavigationMyCaregiver() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.myCaregiver
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.patientInformation
			);
		}
	}

	userNavigationSelectAvatar() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.patientAvatar
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.selectAvatar
			);
		}
	}

	userNavigationNotSettings() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.patientNotification
			);
		} else {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.caregiverNotification
			);
		}
	}
	//Navigation

	checkUser() {
		this.showToLogin = false;
		window.location.assign(this.baseUrl + this.brandedUrl + this.loginUrl);
	}

	openInformationCenter() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.infoLanding
		);
	}

	openHome() {
		if (this.patientStatusVal === this.acutePatient) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.acuteDashboard
			);
		} else {
			window.location.assign(this.baseUrl + this.unAssignedUrl);
		}
	}

	openChallenges() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.challenges);
	}
	//Navigation

	openQuestions() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.outStanding
		);
	}

	openSymptomTracker() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.symptomLanding
		);
	}

	openSupport() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.supportCenter
		);
	}

	logoutFunc() {
		this.showPopup = true;
		document.body.style.overflow = 'hidden';
	}

	doNotLogout() {
		this.showPopup = false;
		document.body.style.overflow = '';
	}
	//This method is used for logout functionality

	logoutFromSite() {
		this.showPopup = false;
		let currentUrl = window.location.href;
		let urlParts = currentUrl.split("/");
		let index = urlParts.indexOf("s");
		let desiredUrl;
		if (index !== -1) {
			desiredUrl = urlParts.slice(0, index + 1).join("/");
		}
		window.location.assign(desiredUrl.replace(/\/s/gu, '/') + this.secureLogout + this.baseUrl + this.brandedUrl + this.loginUrl);

	}

	openMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl);
	}
	//used for rendering the components

	openMobMenu() {
		this.isMenuOpen = true;
		this.caregiverMenuList = false;
		this.patientMenuList = false;
	}

	closeMobMenu() {
		this.isMenuOpen = false;
		this.showMenu = true;

		this.showInformationCentermenu = false;
		this.showChallengesmenu = false;
		this.showquestionnairemenu = false;
		this.showCommunitymenu = false;
		this.showSupportmenu = false;
		this.showuserSubmenu = false;

		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showNotificationCentermenu = false;
		this.showPrescriptionmenu = false;
	}

	openMenuList() {
		this.caregiverMenuList = true;
		this.showMenu = false;
	}

	userMenuNavigation() {
		if (this.currentUserIfo.BI_PSPB_Caregiver__c === false) {
			this.caregiverMenuList = false;
			this.patientMenuList = true;
			this.showMenu = false;
			this.showuserSubmenu = false;
		} else {
			this.caregiverMenuList = true;
			this.patientMenuList = false;
			this.showMenu = false;
			this.showuserSubmenu = false;
		}
	}
	/*--Patient Profile Links--*/

	openPatMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.myProfile);
	}

	openPatMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.myCaregiver
		);
	}

	openPatSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientAvatar
		);
	}

	openPatNotSettings() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientNotification
		);
	}
	/*--Patient Profile Links Ends--*/

	/*--Caregiver Profile Links--*/
	openCarMyProfile() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.caregiverProfile
		);
	}

	openCarMyCaregiver() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.patientInformation
		);
	}

	openCarSelectAvatar() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.selectAvatar
		);
	}

	openCarNotSettings() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.caregiverNotification
		);
	}

	openCarNotSettingsOne() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.messageCenter
		);
	}
	/*--Caregiver Profile Links Ends--*/

	openSupportTwo() {
		this.showMenu = false;
		this.showSupportmenu = true;
	}
	//Used to render the components

	openQuestionsTwo() {
		this.showMenu = false;
		this.showquestionnairemenu = true;
	}

	openInformationCenterTwo() {
		this.showMenu = false;
		this.showInformationCentermenu = true;
	}

	openChallengesTwo() {
		this.showMenu = false;
		this.showChallengesmenu = true;
	}

	openCommunities() {
		this.showMenu = false;
		this.showCommunitymenu = true;
	}

	handleBack() {
		this.showMenu = true;
		this.showquestionnairemenu = false;
	}
	/*   Patient Community SubMenu */

	openAllPosts() {
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.allPost
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	openMyPosts() {
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.myPost
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	openMyFollowers() {
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssigned + this.follower
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	openFollowing() {
		try{
			CHECK_COMMUNITY_USERNAME()
				.then((result) => {
					if (result === true) {
						window.location.assign(
							this.baseUrl + this.unAssigned + this.following
						);
					}
					if (result === false) {
						window.location.assign(
							this.baseUrl + this.unAssignedUrl + this.chatterSignUp
						);
					}
				})
				.catch((error) => {
					this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	handlebackCommunity() {
		this.showMenu = true;
		this.showCommunitymenu = false;
	}

	handlebackChallenges() {
		this.showMenu = true;
		this.showChallengesmenu = false;
	}

	handlebackSupport() {
		this.showMenu = true;
		this.showSupportmenu = false;
	}

	handlebackInformationCenter() {
		this.showMenu = true;
		this.showInformationCentermenu = false;
	}

	openArticles() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.infoLanding
		);
	}

	openPTV() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.acutePatient
		);
	}

	openSupportCenter() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.supportCenter
		);
	}

	openMyCases() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.myCase);
	}

	openTrophycase() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.trophy);
	}
	/*showquestionnairemenu links*/

	openOutstandingQuestionnaire() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.outStanding
		);
	}

	openSummary() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.summaryQues
		);
	}

	openCompletedQuestionnaire() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.dlqiCompleted
		);
	}

	openLetsPersonalize() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.letPersonlize
		);
	}

	updatePrescriptionLink() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.updateRx);
	}

	prescriptionStatusLink() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.prescriptionStatus
		);
	}

	openGeneralNC() {
		window.location.assign(
			this.baseUrl + this.unAssignedUrl + this.messageCenter
		);
	}

	openActionRequiredNC() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.action);
	}

	openHistoryNC() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.history);
	}
	//Used to render the components

	backtoMenu() {
		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showMenu = false;
		this.showuserSubmenu = true;
	}

	backtoMainMenu() {
		this.showMenu = true;
		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showuserSubmenu = false;
		this.showPrescriptionmenu = false;
		this.showNotificationCentermenu = false;
	}

	backtoHomeMenu() {
		this.caregiverMenuList = false;
		this.patientMenuList = false;
		this.showMenu = false;
		this.showuserSubmenu = true;
		this.showPrescriptionmenu = false;
		this.showNotificationCentermenu = false;
	}

	openUserDetailmenu() {
		this.showMenu = false;
		this.showuserSubmenu = true;
	}

	openUpdatePrescriptionMenu() {
		this.showPrescriptionmenu = true;
		this.showuserSubmenu = false;
		this.showMenu = false;
	}

	openNotificationCenterMenu() {
		this.showNotificationCentermenu = true;
		this.showuserSubmenu = false;
		this.showMenu = false;
	}
	//Used to render the components

	openComQuestionnaires() {
		if (this.stdlq > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.dlqiCompleted
			);
		} else if (this.stpss > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.pssCompleted
			);
		} else if (this.stwai > 0) {
			window.location.assign(
				this.baseUrl + this.unAssignedUrl + this.wapiCompleted
			);
		} else if (this.stqsq > 0) {
			if (this.targetFourteenWeeksDate !== null) {
				if (this.status === this.completedLabel || this.status === this.expiredLabel) {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.qsqTwoCompleted
					);
				} else {
					window.location.assign(
						this.baseUrl + this.unAssignedUrl + this.qsqOneCompleted
					);
				}
			} else {
				window.location.assign(
					this.baseUrl + this.unAssignedUrl + this.qsqOneCompleted
				);
			}
		}
	}
	// showToast used for all the error messages caught

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