/**This Lightning web component helps to display the active challenges that has been chosen by the user**/
//To import Libraries
import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';/**This Lightning web component helps to display the active challenges that has been chosen by the user**/
//To import Libraries

import { resources } from 'c/biPspLabelAndResourceChallenges';
//To import Apex Classes
import GET_INDIVIDUAL_CHALLENGES from '@salesforce/apex/BI_PSP_IndividualChallengesCtrl.getIndividualChallenges';
import COUNT_ASSESSMENT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
//import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_ArticleLikeCtrl.updateReaction';
//To import Custom labels
import CHALLENGE_LEVEL_ONE from '@salesforce/label/c.BI_PSP_ChallengeLevelOne';
import CHALLENGE_LEVEL_TWO from '@salesforce/label/c.BI_PSP_ChallengeLevelTwo';
import CH_BOOK_WORM from '@salesforce/label/c.BI_PSP_ChallengeBookworm';
import IC_LANDING_PAGE from '@salesforce/label/c.BI_PSP_GppArticle';
import WHY_BEING_ACTIVE from '@salesforce/label/c.BI_PSP_ActiveArticle';
import BR_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UN_ASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDES_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UN_ASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import BR_WAPI_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_WapiQuestionnaire";
import PSS_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl";
import DLQI_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl";
import CHALLENGE_LEVEL_THREE from "@salesforce/label/c.BI_PSP_ChallengeLevelThree";
import TRACK_YOUR_GPP_LABEL from "@salesforce/label/c.BI_PSP_TrackYourGppLabel";
import BRDLQICOMPLETEDURL from "@salesforce/label/c.BI_PSPB_DlqiCompletedUrl";
import BRWAPICOMPLETEDURL from "@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire";
import BRPSSCOMPLETEDURL from "@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl";
import VIEW_LABEL from '@salesforce/label/c.BI_PSPB_View';



export default class BiPspbActiveChallenges extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	@api activechallengeid;
	@api challengeidtoupdate;
	levelOne = CHALLENGE_LEVEL_ONE;
	levelTwo = CHALLENGE_LEVEL_TWO;
	challengeBookworm = CH_BOOK_WORM;
	siteUrlBranded = BR_SITE_URL;
	gppArticle = IC_LANDING_PAGE;
	beingActive = WHY_BEING_ACTIVE;
	errorMsg = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT;
	brandedUrl = BRANDED_URL;
	unAssignedUrl = UN_ASSIGNED_URL_NAVI;
	brSiteUrl = BRANDES_URL_NAVI;
	unAssignedUrlNavi = UN_ASSIGNED_URL;
	brWapiQuestionnaire = BR_WAPI_QUESTIONNAIRE ;
	pssQuestionnaire = PSS_QUESTIONNAIRE;
	dlqiQuestonnaire = DLQI_QUESTIONNAIRE;
	challengeLevelThree = CHALLENGE_LEVEL_THREE;
	trackYourGppLable = TRACK_YOUR_GPP_LABEL;
	dlqiCompletedUrl = BRDLQICOMPLETEDURL;
	biPspbWapiCompletedQuestionnaire = BRWAPICOMPLETEDURL;
	brCompletedUrl = BRPSSCOMPLETEDURL;
	viewLable = VIEW_LABEL;
	beingActiveLink = resources.BEING_ACTIVE;
	trackYourAns = resources.TRACK_YOUR_ANSWER;
	linkArticle =resources.LINKARTICLE;
	gppWrkLifeLink =resources.GPPWORKLIFELINK;
	gppSymptomsLink = resources.GPPSYMPTOMSLINK;
	gppQualityLifeLink = resources.GPPQUALITYLIFELINK;
	questionnairelink = resources.QuestonnaireValue;
	completeChallengeButton = resources.COMPLETECHALLENGEBUTTON;

	title;
	level;
	description;
	rewardPoints;
	linktoArticle;
	whyBeingActive;
	image;
	urlq;
	otherChallenges;
	quesChallenges;
	trackYourGppDivWpai;
	trackYourGppDivPss;
	trackYourGppDivDlqi;
	titlear;

	//This wire method is used to get the individual challenges with the help of active challenges id
	@wire(GET_INDIVIDUAL_CHALLENGES, { challengeId: "$activechallengeid" })
	wiredAccount({ error, data }) {
		if (data) {
			try {
				this.processData(data[0]);
			} catch (err) {
				this.showToast(this.errorMsg, err.message, this.errorVariant);
			}
		} else if (error) {
			//this.showToast(this.errorMsg, error.body.message, this.errorVariant);
		}
	}

	processData(data) {
		if (data.Name) {
			this.setTitleAndLevel(data);
			this.setChallengeVisibility();
		}
		if (data.HealthCloudGA__Description__c) {
			this.description = data.HealthCloudGA__Description__c.replace(/<[^>]*>/gu, "");
		}
		if (data.BI_PSP_Challenge_Reward_Points__c) {
			this.rewardPoints = data.BI_PSP_Challenge_Reward_Points__c;
		}
		if (data.BI_PSP_Challenge_Image__c) {
			this.setImage(data.BI_PSP_Challenge_Image__c);
		}
	}

	setTitleAndLevel(data) {
		this.title = data.Name;
		this.level = data.BI_PSP_Challenge_Level__c;
	}

	setChallengeVisibility() {
		const isBookworm = this.title.includes(this.challengeBookworm);
		const isGpp = this.title.includes(this.trackYourGppLable);

		this.resetVisibility();

		if (isBookworm) {
			if (this.level === this.levelOne) {
				this.linktoArticle = true;
				this.otherChallenges = true;
			} else if (this.level === this.levelTwo) {
				this.whyBeingActive = true;
				this.otherChallenges = true;
			}
		} else if (isGpp) {
			this.quesChallenges = true;
			if (this.level === this.levelOne) {
				this.trackYourGppDivWpai = true;
			} else if (this.level === this.levelTwo) {
				this.trackYourGppDivPss = true;
			} else if (this.level === this.challengeLevelThree) {
				this.trackYourGppDivDlqi = true;
			}
		} else {
			this.otherChallenges = true;
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

	setImage(image) {
		const desiredWidth = '135px';
		const desiredHeight = '70px';
		const imgTagRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/giu;

		this.image = image.replace(
			imgTagRegex,
			(match, src) => `<img src="${src}" alt="" width="${desiredWidth}" height="${desiredHeight}">`
		);
	}
	@wire(COUNT_ASSESSMENT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
			} else if (data) {
				this.count = data;
				//assigning data values to the variables 
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
				this.urlq = this.brSiteUrl;
			} else {
				this.urlq = this.unAssignedUrlNavi;
			}
		} catch (error) {
			// Catching Potential Error
			this.showToast(this.errorMsg, error.message, this.errorVariant);
		}
	}
	//Used for challenge cancel functionality
	aftercancel() {
		const messageEvent = new CustomEvent('cancelchallenge', {
			detail: {
				activechallengeid: this.activechallengeid,
				challengeidtoupdate: this.challengeidtoupdate
			}
		});
		this.dispatchEvent(messageEvent);
	}
	//Used for challenge complete functionality
	afterComplete() {
		const messageEvent = new CustomEvent('completechallenge', {
			detail: {
				activechallengeid: this.activechallengeid,
				challengeidtoupdate: this.challengeidtoupdate
			}
		});
		this.dispatchEvent(messageEvent);
	}
	//Used for navigating to articles
	openArticles() {
		// UPDATE_REACTION({
		// 	articleName: this.gppArticle, reaction: this.viewLable
			
		// })
		// 	.then(() => {

		// 		this.titlear = this.viewLable + ': ' + this.gppArticle;
		// 		window.location.assign(
		// 			this.urlq + this.gppArticle
					
					
		// 		);
		// 		console.log('OUTPUT : ',this.gppArticle,);

		// 	})
		// 	.catch((error) => {
		// 		this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
		// 		// Handle error, if needed
		// 	});

	}
	openArticlesActive() {
		// UPDATE_REACTION({
		// 	articleName: this.beingActive, reaction: this.viewLable
		// })
		// 	.then(() => {
		// 		this.titlear = this.viewLable + ': ' + this.beingActive;
		// 		window.location.assign(
		// 			this.urlq + this.beingActive
		// 		);
		// 	})
		// 	.catch((error) => {
		// 		this.showToast(this.errorMsg, error.body.message, this.errorVariant); // Catching Potential Error from Apex
		// 		// Handle error, if needed
		// 	});

	}
	TrackYourGppNavigationWPAI() {
		if (this.stwai > 0) {
			window.location.assign(this.urlq + this.biPspbWapiCompletedQuestionnaire);
		} else {
			window.location.assign(this.urlq + this.brWapiQuestionnaire);
		}
	}
	TrackYourGppNavigationPSS() {
		if (this.stpss > 0) {
			window.location.assign(this.urlq + this.brCompletedUrl);
		} else {
			window.location.assign(this.urlq + this.pssQuestionnaire);
		}
	}
	TrackYourGppNavigationDLQI() {
		if (this.stdlq > 0) {
			window.location.assign(this.urlq + this.dlqiCompletedUrl);
		} else {
			window.location.assign(this.urlq + this.dlqiQuestonnaire);
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