//This lightning web component helps the user to see the available challenges and gives the ability to make them as active challenge
//To import Libraries
import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { resources } from 'c/biPspLabelAndResourceChallenges';
//To import Apex Classes
import INDIVIDUALSCHALLENGES from '@salesforce/apex/BI_PSP_IndividualChallengesCtrl.getIndividualChallenges';
import COUNT_ASSESMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_CmsCtrl.updateReaction';
//To import Custom labels



export default class BiPspbAvailableChallenges extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Expose properties to parent components
	@api challengeid;
	@api challengeidtoupdate;
	levelOne = resources.CHALLENGE_LEVEL_ONE;
	levelTwo = resources.CHALLENGE_LEVEL_TWO;
	challengeBookworm = resources.CH_BOOK_WORM;
	siteUrlBranded = resources.BR_DITE_URL;
	gppArticle = resources.IC_LANDING_PAGE;
	beingActive = resources.WHY_BEING_ACTIVE;
	errorMsg = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT;
	brandedUrl =resources.BRANDED_URL;
	unAssignedUrl = resources.UNASSIGNED_URL;
	brNaviSiteUrl = resources.BR_SITE_URL;
	unAssignedNaviUrl = resources.UN_ASSIGNED_URL_NAVI;
	brWapiQuestionnaire = resources.BR_WAPI_QUESTIONNAIRE;
	pssQuestionnaire = resources.PSS_QUESTIONNAIRE;
	dlqiQuestionnaire = resources.DLQI_QUESTIONNAIRE;
	challengeLvlThree = resources.CHALLENGE_LEVEL_THREE;
	trackYourGppLbl = resources.TRACK_YOUR_GPP_LABLE;
	brdlqiCmpletedUrl = resources.BRDLQI_COMPLETED_URL;
	brwapiCompletedUrl = resources.BRWAPI_COMPLETED_URL;
	brpssCompletedUrl = resources.BRPSS_COMPLETED_URL;
	viewLabel = resources.VIEW_LABEL;
	// Declare properties to store challenge details
	title;
	level;
	description;
	rewardPoints;
	image;
	linktoArticle;
	whyBeingActive;
	urlq;
	otherChallenges;
	quesChallenges;
	trackYourGppDivWpai;
	trackYourGppDivPss;
	trackYourGppDivDlqi;
	titlear;

	// Wire method to retrieve individual challenge details
	@wire(INDIVIDUALSCHALLENGES, { challengeId: "$challengeid" })
	wiredAccount({ error, data }) {
		if (data) {
			try {
				this.processChallengeData(data[0]);
			} catch (err) {
				this.showToast(this.errorMsg, err.message, this.errorVariant);
			}
		} else if (error) {
			this.showToast(this.errorMsg, error.body.message, this.errorVariant);
		}
	}

	processChallengeData(data) {
		this.setTitleAndLevel(data);
		this.setChallengeVisibility();
		this.setDescription(data);
		this.setRewardPoints(data);
		this.setImage(data);
	}

	setTitleAndLevel(data) {
		this.title = data.Name;
		this.level = data.BI_PSP_Challenge_Level__c;
	}

	setChallengeVisibility() {
		const isBookworm = this.title.includes(this.challengeBookworm);
		const isGpp = this.title.includes(this.trackYourGppLbl);

		this.resetVisibility();

		if (isBookworm) {
			this.setBookwormVisibility();
		} else if (isGpp) {
			this.setGppVisibility();
		} else {
			this.otherChallenges = true;
		}
	}

	setBookwormVisibility() {
		if (this.level === this.levelOne) {
			this.linktoArticle = true;
			this.otherChallenges = true;
		} else if (this.level === this.levelTwo) {
			this.whyBeingActive = true;
			this.otherChallenges = true;
		}
	}

	setGppVisibility() {
		this.quesChallenges = true;
		if (this.level === this.levelOne) {
			this.trackYourGppDivWpai = true;
		} else if (this.level === this.levelTwo) {
			this.trackYourGppDivPss = true;
		} else if (this.level === this.challengeLvlThree) {
			this.trackYourGppDivDlqi = true;
		}
	}

	resetVisibility() {
		this.whyBeingActive = false;
		this.linktoArticle = false;
		this.otherChallenges = false;
		this.quesChallenges = false;
		this.trackYourGppDivWpai = false;
		this.trackYourGppDivPss = false;
		this.trackYourGppDivDlqi = false;
	}

	setDescription(data) {
		if (data.HealthCloudGA__Description__c) {
			this.description = data.HealthCloudGA__Description__c.replace(/<[^>]*>/gu, "");
		}
	}

	setRewardPoints(data) {
		if (data.BI_PSP_Challenge_Reward_Points__c) {
			this.rewardPoints = data.BI_PSP_Challenge_Reward_Points__c;
		}
	}

	setImage(data) {
		if (data.BI_PSP_Challenge_Image__c) {
			const desiredWidth = '135px';
			const desiredHeight = '70px';
			const imgTagRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/giu;

			this.image = data.BI_PSP_Challenge_Image__c.replace(
				imgTagRegex,
				(match, src) => `<img src="${src}" alt="" width="${desiredWidth}" height="${desiredHeight}">`
			);
		}
	}
	@wire(COUNT_ASSESMENT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
			} else if (data) {
				this.count = data;
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
			}
		} catch (err) {
			this.showToast(this.errorMsg, err.message, this.errorVariant); // Catching Potential Error from LWC
		}
	}
	renderedCallback() {
		try {
			const currentURL = window.location.href;
			const urlObject = new URL(currentURL);
			const path = urlObject.pathname;
			const pathComponents = path.split('/');
			const desiredComponent = pathComponents.find((component) =>
				[this.brandedUrl, this.unAssignedUrl].includes(
					component
				)
			);

			if (desiredComponent === this.brandedUrl) {
				this.urlq = this.brNaviSiteUrl;
			} else {
				this.urlq = this.unAssignedNaviUrl;
			}
		} catch (error) {

			this.showToast(this.errorMsg, error.message, this.errorVariant);// Catching Potential Error
		}
	}
	// Method to handle accepting a challenge
	afterAccept() {
		const messageEvent = new CustomEvent("acceptchallenge", {
			detail: {
				challengeid: this.challengeid,
				challengeidtoupdate: this.challengeidtoupdate
			}
		});
		this.dispatchEvent(messageEvent);
	}

	// Method to open articles
	openArticles() {
		UPDATE_REACTION({
			articleName: this.gppArticle, reaction: this.viewLabel
		})
			.then(() => {
				this.titlear = this.viewLabel + ': ' + this.gppArticle;
				window.location.assign(
					this.urlq + this.gppArticle
				);
			})
			.catch((error) => {
				this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				// Handle error, if needed
			});

	}
	openArticlesActive() {
		UPDATE_REACTION({
			articleName: this.beingActive, reaction: this.viewLabel
		})
			.then(() => {
				this.titlear = this.viewLabel + ': ' + this.beingActive;
				window.location.assign(
					this.urlq + this.beingActive
				);
			})
			.catch((error) => {
				this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
				// Handle error, if needed
			});

	}
	TrackYourGppNavigationWPAI() {
		if (this.stwai > 0) {
			window.location.assign(this.urlq + this.brwapiCompletedUrl);
		} else {
			window.location.assign(this.urlq + this.brWapiQuestionnaire);
		}
	}
	TrackYourGppNavigationPSS() {
		if (this.stpss > 0) {
			window.location.assign(this.urlq + this.brpssCompletedUrl);
		} else {
			window.location.assign(this.urlq + this.pssQuestionnaire);
		}
	}
	TrackYourGppNavigationDLQI() {
		if (this.stdlq > 0) {
			window.location.assign(this.urlq + this.brdlqiCmpletedUrl);
		} else {
			window.location.assign(this.urlq + this.dlqiQuestionnaire);
		}
	}
	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if (typeof window !== 'undefined') {
			this.dispatchEvent(event);
		}
	}
}