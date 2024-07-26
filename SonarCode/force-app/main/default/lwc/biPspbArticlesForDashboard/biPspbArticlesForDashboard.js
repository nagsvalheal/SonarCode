// This Lightning Web Component is designed to display both 'Just for Me' articles and recent articles from the CMS
//To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex Classes
import RETRIEVE_MEDIA_FROM_CMS_NEWS from '@salesforce/apex/BI_PSPB_CmsCtrl.retrieveMediaFromCMSNews';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
import GET_PERSONALIZED_ARTICLES from '@salesforce/apex/BI_PSPB_PersonalizedArticlesCtrl.getPersonalizedArticles';
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_CmsCtrl.updateReaction';
//To import Static Resource
import CLOCK_ICON from '@salesforce/resourceUrl/BI_PSP_ClockIcon';
import ROUND_ICON from '@salesforce/resourceUrl/BI_PSP_RoundNextIcon';
import WHAT_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_WhatGppImg';
import FACTS_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_FactsGppImg';
import RARE_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_RareGppImg';
import HAVE_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_WhyDoIHaveGppImg';
import DIAGNOSIS_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_DiagnosisGppImg';
import GPP_CONTAGIOUS_IMG from '@salesforce/resourceUrl/BI_PSP_GppContagiousImg';
import FRIENDS_FAMILY_IMG from '@salesforce/resourceUrl/BI_PSP_FriendsFamilyImg';
import FEELING_EXCLUDED_IMG from '@salesforce/resourceUrl/BI_PSP_FeelingExcludedImg';
import GPP_INTIMACY_IMG from '@salesforce/resourceUrl/BI_PSP_GppIntimacyImg';
import GPP_PREGNANCY_IMG from '@salesforce/resourceUrl/BI_PSP_GppPregnancyImg';
import MANGE_FLARE_IMG from '@salesforce/resourceUrl/BI_PSP_ManageFlareImg';
import GPP_COMORBIDITIES_IMG from '@salesforce/resourceUrl/BI_PSP_GppComorbiditiesImg';
import MANAGE_GPP_SYMPTOMS_IMG from '@salesforce/resourceUrl/BI_PSP_ManageGppSymptomsImg';
import ASK_DOCTOR_IMG from '@salesforce/resourceUrl/BI_PSP_AskDoctorImg';
import SEEK_MEDICARE_IMG from '@salesforce/resourceUrl/BI_PSP_SeekMediCareImg';
import SEEK_EMERGENCY_IMG from '@salesforce/resourceUrl/BI_PSP_SeekEmergencyImg';
import MANGE_SCARS_IMG from '@salesforce/resourceUrl/BI_PSP_ManageScarsImg';
import COMPLICAT_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_ComplicatGppImg';
import RECOGNIZING_FLARES_IMG from '@salesforce/resourceUrl/BI_PSP_RecognizingFlaresImg';
import VISIT_IMG from '@salesforce/resourceUrl/BI_PSP_VisitDoctorImg';
import DERMATOLOGIST_IMG from '@salesforce/resourceUrl/BI_PSP_DermatologistImg';
import TALK_GPP_IMG from '@salesforce/resourceUrl/BI_PSP_TalkGppImg';
import ALONE_IMG from '@salesforce/resourceUrl/BI_PSP_NotAloneImg';
import CHOICES_IMG from '@salesforce/resourceUrl/BI_PSP_PositiveChoicesImg';
import TREATING_GPP_IMG from '@salesforce/resourceUrl/BI_PSPB_TreatingGppImg';
import INFUSION_IMG from '@salesforce/resourceUrl/BI_PSPB_SpevigoInfusionImg';
import PREVENTION_IMG from '@salesforce/resourceUrl/BI_PSPB_PreventionGppImg';
import INJECTION_IMG from '@salesforce/resourceUrl/BI_PSPB_SpevigoInjectionImg';
import WORK_IN_GPP_IMG from '@salesforce/resourceUrl/BI_PSPB_WorkInGppImg';

//To get Current UserId
import ID from '@salesforce/user/Id';
//To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import STATUS_ACUTE from '@salesforce/label/c.BI_PSPB_Acute';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import PREVENTION_GPP_LABEL from '@salesforce/label/c.BI_PSPB_PreventionGppLabel';
import SPEVIGO_INJECTION_LABEL from '@salesforce/label/c.BI_PSPB_SpevigoInjectionLabel';
import SPEVIGO_INFUSION_LABEL from '@salesforce/label/c.BI_PSPB_SpevigoInfusionLabel';
import TREATING_GPP_LABEL from '@salesforce/label/c.BI_PSPB_TreatingGppLabel';
import WORK_IN_GPP_LABEL from '@salesforce/label/c.BI_PSPB_WorkInGppLabel';
import STATUS_UNASSIGNED from '@salesforce/label/c.BI_PSP_Unassigned';
import FLARE_PREVENTION_LABEL from '@salesforce/label/c.BI_PSPB_FlarePreventionLabel';
import FLARE_TREATMENT_LABEL from '@salesforce/label/c.BI_PSPB_FlareTreatmentLabel';
import CHRONIC_STATUS from '@salesforce/label/c.BI_PSPB_ChronicStatus';
import CHANNEL_NAME from '@salesforce/label/c.BI_PSP_ChannelName';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import DETAIL_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterDetailUrl';
import LANDING_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl';
import ARTICLE_STRING from '@salesforce/label/c.BI_PSPB_ArticleString';
import VIEW_LABEL from '@salesforce/label/c.BI_PSPB_View';
import WHAT_GPP_LABEL from '@salesforce/label/c.BI_PSP_WhatGppLabel';
import FACTS_GPP_LABEL from '@salesforce/label/c.BI_PSP_FactsGppLabel';
import RARE_GPP_LABEL from '@salesforce/label/c.BI_PSP_RareGppLabel';
import WHY_DO_I_HAVE_GPP_LABEL from '@salesforce/label/c.BI_PSP_WhyDoIHaveGppLabel';
import DIAGNOSIS_GPP_LABEL from '@salesforce/label/c.BI_PSP_DiagnosisGppLabel';
import GPP_CONTAGIOUS_LABEL from '@salesforce/label/c.BI_PSP_GppContagiousLabel';
import FRIENDS_FAMILY_LABEL from '@salesforce/label/c.BI_PSP_FriendsFamilyLabel';
import FEELING_EXCLUDED_LABEL from '@salesforce/label/c.BI_PSP_FeelingExcludedLabel';
import GPP_INTIMACY_LABEL from '@salesforce/label/c.BI_PSP_GppIntimacyLabel';
import GPP_PREGNANCY_LABEL from '@salesforce/label/c.BI_PSP_GppPregnancyLabel';
import MANAGE_FLARES_LABEL from '@salesforce/label/c.BI_PSP_ManageFlareLabel';
import GPP_COMORBIDITIES_LABEL from '@salesforce/label/c.BI_PSP_GppComorbiditiesLabel';
import MANAGE_GPP_SYMPTOMS_LABEL from '@salesforce/label/c.BI_PSP_ManageGppSymptomsLabel';
import ASK_DOCTOR_LABEL from '@salesforce/label/c.BI_PSP_AskDoctorLabel';
import SEEK_MEDICARE_LABEL from '@salesforce/label/c.BI_PSP_SeekMediCareLabel';
import SEEK_EMERGENCY_LABEL from '@salesforce/label/c.BI_PSP_SeekEmergencyLabel';
import MANAGE_SCARS_LABEL from '@salesforce/label/c.BI_PSP_ManageScarsLabel';
import COMPLICATE_GPP_LABEL from '@salesforce/label/c.BI_PSP_ComplicatGppLabel';
import RECOGNIZING_FLARES_LABEL from '@salesforce/label/c.BI_PSP_RecognizingFlaresLabel';
import VISIT_DOCTOR_LABEL from '@salesforce/label/c.BI_PSP_VisitDoctorLabel';
import DERMATOLOGIST_LABEL from '@salesforce/label/c.BI_PSP_DermatologistLabel';
import TALK_GPP_LABEL from '@salesforce/label/c.BI_PSP_TalkGppLabel';
import NOT_ALONE_LABEL from '@salesforce/label/c.BI_PSP_NotAloneLabel';
import POSITIVE_CHOICES_LABEL from '@salesforce/label/c.BI_PSP_PositiveChoicesLabel';
import WHAT_GPP_MINS from '@salesforce/label/c.BI_PSP_WhatGppReadTime';
import FACTS_GPP_MINS from '@salesforce/label/c.BI_PSP_FactsGppReadTime';
import RARE_GPP_MINS from '@salesforce/label/c.BI_PSP_RareGppReadTime';
import WHY_DO_I_HAVE_GPP_MINS from '@salesforce/label/c.BI_PSP_WhyDoIHaveGppReadTime';
import DIAGNOSIS_GPP_MINS from '@salesforce/label/c.BI_PSP_DiagnosisGppReadTime';
import GPP_CONTAGIOUS_MINS from '@salesforce/label/c.BI_PSP_GppContagiousReadTime';
import FRIENDS_FAMILY_MINS from '@salesforce/label/c.BI_PSP_FriendsFamilyReadTime';
import FEELING_EXCLUDED_MINS from '@salesforce/label/c.BI_PSP_FeelingExcludedReadTime';
import GPP_INTIMACY_MINS from '@salesforce/label/c.BI_PSP_GppIntimacyReadTime';
import GPP_PREGNANCY_MINS from '@salesforce/label/c.BI_PSP_GppPregnancyReadTime';
import MANAGE_FLARE_MINS from '@salesforce/label/c.BI_PSP_ManageFlareReadTime';
import GPP_COMORBIDITIES_MINS from '@salesforce/label/c.BI_PSP_GppComorbiditiesReadTime';
import MANAGE_GPP_SYMPTOMS_MINS from '@salesforce/label/c.BI_PSP_ManageGppSymptomsReadTime';
import ASK_DOCTOR_MINS from '@salesforce/label/c.BI_PSP_AskDoctorReadTime';
import SEEK_MEDICARE_MINS from '@salesforce/label/c.BI_PSP_SeekMediCareReadTime';
import SEEK_EMERGENCY_MINS from '@salesforce/label/c.BI_PSP_SeekEmergencyReadTime';
import MANAGE_SCARS_MINS from '@salesforce/label/c.BI_PSP_ManageScarsReadTime';
import COMPLICAT_GPP_MINS from '@salesforce/label/c.BI_PSP_ComplicatGppReadTime';
import RECOGNIZING_FLARES_MINS from '@salesforce/label/c.BI_PSP_RecognizingFlaresReadTime';
import VISIT_DOCTOR_MINS from '@salesforce/label/c.BI_PSP_VisitDoctorReadTime';
import DERMATOLOGIST_MINS from '@salesforce/label/c.BI_PSP_DermatologistReadTime';
import TALK_GPP_MINS from '@salesforce/label/c.BI_PSP_TalkGppReadTime';
import NOT_ALONE_MINS from '@salesforce/label/c.BI_PSP_NotAloneReadTime';
import POSITIVE_CHOICES_MINS from '@salesforce/label/c.BI_PSP_PositiveChoicesReadTime';
import TREATING_GPP_MINS from '@salesforce/label/c.BI_PSPB_TreatingGppReadTime';
import SPEVIGO_INFUSION_MINS from '@salesforce/label/c.BI_PSPB_SpevigoInfusionReadTime';
import PREVENTION_GPP_MINS from '@salesforce/label/c.BI_PSPB_PreventionGppReadTime';
import SPEVIGO_INJECTION_MINS from '@salesforce/label/c.BI_PSPB_SpevigoInjectionReadTime';
import WORK_IN_GPP_MINS from '@salesforce/label/c.BI_PSPB_WorkInGppReadTime';

export default class BiPspbArticlesForDashboard extends LightningElement {

	urlq;
	showTreatVideo;
	patientStatusVal;
	categoryValue;
	justForMeArticleList = [];
	results = [];
	userId = ID;
	ClockIcon = CLOCK_ICON;
	NextIcon = ROUND_ICON;
	currentPageUrl;
	urlSegments;
	baseUrl;
	channelName = CHANNEL_NAME;
	firstImg;
	secondImg;
	thirdImg;
	fourthImg;
	firstHeading;
	secondHeading;
	thirdHeading;
	fourthHeading;
	analyticsFirstHeading;
	analyticsSecondHeading;
	analyticsThirdHeading;
	analyticsFourthHeading;
	firstDescription;
	secondDescription;
	thirdDescription;
	fourthDescription;
	threeDifferentNumbers;
	submittedRecord;
	showFirstArticle = true;
	showSecondArticle = true;
	showThirdArticle = true;
	showFourthArticle = true;
	readTimeOne;
	readTimeTwo;
	readTimeThird;
	readTimeFourth;
	siteurl;
	articleTitle;
	topics = {
		[WHAT_GPP_LABEL]: [WHAT_GPP_MINS],
		[FACTS_GPP_LABEL]: [FACTS_GPP_MINS],
		[RARE_GPP_LABEL]: [RARE_GPP_MINS],
		[WHY_DO_I_HAVE_GPP_LABEL]: [WHY_DO_I_HAVE_GPP_MINS],
		[DIAGNOSIS_GPP_LABEL]: [DIAGNOSIS_GPP_MINS],
		[GPP_CONTAGIOUS_LABEL]: [GPP_CONTAGIOUS_MINS],
		[FRIENDS_FAMILY_LABEL]: [FRIENDS_FAMILY_MINS],
		[FEELING_EXCLUDED_LABEL]: [FEELING_EXCLUDED_MINS],
		[GPP_INTIMACY_LABEL]: [GPP_INTIMACY_MINS],
		[GPP_PREGNANCY_LABEL]: [GPP_PREGNANCY_MINS],
		[MANAGE_FLARES_LABEL]: [MANAGE_FLARE_MINS],
		[GPP_COMORBIDITIES_LABEL]: [GPP_COMORBIDITIES_MINS],
		[MANAGE_GPP_SYMPTOMS_LABEL]: [MANAGE_GPP_SYMPTOMS_MINS],
		[ASK_DOCTOR_LABEL]: [ASK_DOCTOR_MINS],
		[SEEK_MEDICARE_LABEL]: [SEEK_MEDICARE_MINS],
		[SEEK_EMERGENCY_LABEL]: [SEEK_EMERGENCY_MINS],
		[MANAGE_SCARS_LABEL]: [MANAGE_SCARS_MINS],
		[COMPLICATE_GPP_LABEL]: [COMPLICAT_GPP_MINS],
		[RECOGNIZING_FLARES_LABEL]: [RECOGNIZING_FLARES_MINS],
		[VISIT_DOCTOR_LABEL]: [VISIT_DOCTOR_MINS],
		[DERMATOLOGIST_LABEL]: [DERMATOLOGIST_MINS],
		[TALK_GPP_LABEL]: [TALK_GPP_MINS],
		[NOT_ALONE_LABEL]: [NOT_ALONE_MINS],
		[POSITIVE_CHOICES_LABEL]: [POSITIVE_CHOICES_MINS],
		[TREATING_GPP_LABEL]: [TREATING_GPP_MINS],
		[SPEVIGO_INFUSION_LABEL]: [SPEVIGO_INFUSION_MINS],
		[PREVENTION_GPP_LABEL]: [PREVENTION_GPP_MINS],
		[SPEVIGO_INJECTION_LABEL]: [SPEVIGO_INJECTION_MINS],
		[WORK_IN_GPP_LABEL]: [WORK_IN_GPP_MINS]
	}

	// To generate the random number basded on article list length
	generateRandomNumbers() {
		let numbers = new Set();
		while (numbers.size < this.articleList.length) {
			let randomNumber = Math.floor(Math.random() * this.articleList.length); // Generates numbers from 0 to 8
			numbers.add(randomNumber);
		}
		return Array.from(numbers);
	}

	connectedCallback(){
		try{
			let globalThis = window;
			let currentUrl = globalThis.location.href;

			// Create a URL object
			let urlObject = new URL(currentUrl);

			// Get the path
			let path = urlObject.pathname;

			// Split the path using '/' as a separator
			let pathComponents = path.split('/');

			// Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL;
				this.siteurl = BRANDED_SITE_URL;
			} else {
				this.urlq = UNASSIGNED_URL;
				this.siteurl = UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;

		}catch(err){
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error
		}
	}

	handleButtonClick(event) {
		let finaltitle = event.currentTarget.dataset.name;
		let articleName = finaltitle;
		UPDATE_REACTION({
			articleName: articleName, reaction: VIEW_LABEL
		})
			.then(() => {
				this.articleTitle = VIEW_LABEL+ ': ' + articleName;
			})
			.catch((error) => {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
				// Handle error, if needed
			});

			window.location.assign(
				this.baseUrl + this.siteurl + DETAIL_PAGE + articleName
			);
			
		
	}

	// Used for navigation to landing page of information center
	navtoinforcenter() {
			window.location.assign(
				this.baseUrl + this.siteurl + LANDING_PAGE
			);
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retrieve the cms article names, images and descriptions based on given channelname
	@wire(RETRIEVE_MEDIA_FROM_CMS_NEWS, { channelName: '$channelName' })
	wiredData({ error, data }) {
		try {
			if (data && data.length > 0) {
				let objStr = JSON.parse(data);

				objStr.map((element) => {
					let timestamp = new Date().getTime();
					let cbValue = `cb=${timestamp}`;

					return (this.results = [
						...this.results,
						{
							image: element.url + '?' + cbValue,
							text: element.title,
							text2: element.subtitle,
							page: element.url,
							readtime: this.topics[element.title]
						}
					]);
				});
				this.mapArticles();
			} else if (error) {
				this.error = error;
				this.results = undefined;
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}


	get dynamicProperty() {
		// Generate a random number between 2 and 4 (inclusive)
		let newRandomNumber = Math.floor(Math.random() * 3) + 2;
		return newRandomNumber;
	}
	get dynamicsecond() {
		// Generate a random number between 0 and 60 (inclusive)
		let newRandomNumber = Math.floor(Math.random() * 61);
		return newRandomNumber;
	}

	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To reterive the patient status (acute or chronic or unassigned)
	@wire(PATIENT_STATUS)
	wiredpatientstatus({ error, data }) {
		try {
			if (data && data.length > 0) {
				this.patientStatusVal = data;
				// Handle the data
				if (this.patientStatusVal === STATUS_ACUTE) {
					this.categoryValue = FLARE_TREATMENT_LABEL;
				} else if (this.patientStatusVal === CHRONIC_STATUS) {
					this.categoryValue = FLARE_PREVENTION_LABEL;
				} else if (this.urlq === BRANDED_URL) {
						this.categoryValue = FLARE_PREVENTION_LABEL;
				} else {
						this.categoryValue = FLARE_TREATMENT_LABEL;
				}
			} else if (error) {
				// Handle the error
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	// To map the articles heading and image
	mapArticles(){
		if (this.results.length > 0) {
			if (this.justForMeArticleList.length !== 0) {
				let finalresult = this.filterResultsByTitles(
					this.justForMeArticleList
				);
				this.articleList = finalresult;
				if (this.articleList.length === 1) {
					this.showSecondArticle = false;
					this.showThirdArticle = false;
					this.showFourthArticle = false;
				}
				if (this.articleList.length === 2) {
					this.showThirdArticle = false;
					this.showFourthArticle = false;
				}
				if (this.articleList.length === 3) {
					this.showFourthArticle = false;
				}
			} else {
				this.articleList = this.results;
			}

			if (this.urlq === UNASSIGNED_URL) {
				if (this.patientStatusVal === STATUS_ACUTE) {
					this.showTreatVideo = true;

					let filteredDataacute = this.articleList.filter(
						(entry) =>
							entry.text !== PREVENTION_GPP_LABEL &&
							entry.text !== SPEVIGO_INJECTION_LABEL
					);
					this.articleList = filteredDataacute;
				}
			}

			if (this.urlq !== BRANDED_URL) {
				if (this.patientStatusVal !== STATUS_ACUTE) {
					let filteredData = this.articleList.filter(
						(entry) =>
							entry.text !== PREVENTION_GPP_LABEL &&
							entry.text !== SPEVIGO_INJECTION_LABEL &&
							entry.text !== SPEVIGO_INFUSION_LABEL &&
							entry.text !== TREATING_GPP_LABEL &&
							entry.text !== WORK_IN_GPP_LABEL
					);
					this.articleList = filteredData;
				}
				if (this.patientStatusVal === STATUS_UNASSIGNED) {
					this.showTreatVideo = false;
				}
			}
			if (this.urlq === BRANDED_URL) {
				if (this.patientStatusVal === CHRONIC_STATUS) {
					let filteredData = this.articleList.filter(
						(entry) =>
							entry.text !== SPEVIGO_INFUSION_LABEL &&
							entry.text !== TREATING_GPP_LABEL
					);
					this.articleList = filteredData;
				}
				if (this.patientStatusVal === STATUS_UNASSIGNED) {
					this.showTreatVideo = false;
				}
			}

			this.threeDifferentNumbers = this.generateRandomNumbers();

			if (this.articleList[this.threeDifferentNumbers[0]]) {
				this.firstImg = this.articleList[this.threeDifferentNumbers[0]].image;
				this.firstHeading = this.articleList[this.threeDifferentNumbers[0]].text;
				this.firstDescription =
					this.articleList[this.threeDifferentNumbers[0]].text2;
				this.readTimeOne = this.articleList[this.threeDifferentNumbers[0]].readtime;
			}

			if (this.articleList[this.threeDifferentNumbers[1]]) {
				this.secondImg = this.articleList[this.threeDifferentNumbers[1]].image;
				this.secondHeading = this.articleList[this.threeDifferentNumbers[1]].text;
				this.secondDescription =
					this.articleList[this.threeDifferentNumbers[1]].text2;
				this.readTimeTwo = this.articleList[this.threeDifferentNumbers[1]].readtime;

			}

			if (this.articleList[this.threeDifferentNumbers[2]]) {
				this.thirdImg = this.articleList[this.threeDifferentNumbers[2]].image;
				this.thirdHeading = this.articleList[this.threeDifferentNumbers[2]].text;
				this.thirdDescription =
					this.articleList[this.threeDifferentNumbers[2]].text2;
				this.readTimeThird = this.articleList[this.threeDifferentNumbers[2]].readtime;

			}
			if (this.articleList[this.threeDifferentNumbers[3]]) {
				this.fourthImg = this.articleList[this.threeDifferentNumbers[3]].image;
				this.fourthHeading = this.articleList[this.threeDifferentNumbers[3]].text;
				this.fourthDescription =
					this.articleList[this.threeDifferentNumbers[3]].text2;
				this.readTimeFourth = this.articleList[this.threeDifferentNumbers[3]].readtime;

			}
		}

		this.error = undefined;
		this.articleList = this.results;

		this.articleList = this.results;
		this.analyticsFirstHeading = ARTICLE_STRING + ' ' + this.firstHeading;
		this.analyticsSecondHeading = ARTICLE_STRING + ' ' + this.secondHeading;
		this.analyticsThirdHeading = ARTICLE_STRING + ' ' + this.thirdHeading;
		this.analyticsFourthHeading = ARTICLE_STRING + ' ' + this.fourthHeading;
		this.mapImage();
	}

	mapImage(){
		let imgele1 = this.template.querySelector('.backimg1');
		let imgele2 = this.template.querySelector('.backimg2');
		let imgele3 = this.template.querySelector('.backimg3');
		let imgele4 = this.template.querySelector('.backimg4');
		if (imgele1) {
			this.firstImg = this.getStaticResource(this.firstHeading);
			imgele1.style.backgroundImage = "url('" + this.firstImg + "')";
		}
		if (imgele2) {
			this.secondImg = this.getStaticResource(this.secondHeading);
			imgele2.style.backgroundImage = "url('" + this.secondImg + "')";
		}
		if (imgele3) {
			this.thirdImg = this.getStaticResource(this.thirdHeading);
			imgele3.style.backgroundImage = "url('" + this.thirdImg + "')";
		}
		if (imgele4) {
			this.fourthImg = this.getStaticResource(this.fourthHeading);
			imgele4.style.backgroundImage = "url('" + this.fourthImg + "')";
		}
	}
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To reterieve the Just for me articles from cms based on given channelname
	@wire(GET_PERSONALIZED_ARTICLES, { channelName: '$channelName' })
	wiredarticleData({ error, data }) {
		try {
			if (data && data.length > 0) {
				this.justForMeArticleList = [];

				this.justForMeArticleList = JSON.parse(JSON.stringify(data));
				this.mapArticles();

			} else if (error) {
				this.error = error;
				this.results = undefined;
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from Lwc
		}
	}

	// Filter the articles by titles
	filterResultsByTitles(titlesToFilter) {
		let shuffledResults;

		shuffledResults = this.results;

		let filteredResults = [];
		let count = 1;

		for (let i = 0; i < shuffledResults.length; i++) {
			let result = shuffledResults[i];
			let titleFound = false;
		
			for (let j = 0; j < titlesToFilter.length; j++) {
				if (
					result.text.trim().toLowerCase() ===
					titlesToFilter[j].trim().toLowerCase()
				) {
					titleFound = true;
					break;
				}
			}
		
			if (titleFound) {
				result.count = count % 2 !== 0;
				count += 1;
				filteredResults.push(result);
			}
		}
		return filteredResults;
	}

	// To get the static resource for given article
	getStaticResource(title) {
		let imageMap = {
			[WHAT_GPP_LABEL]: WHAT_GPP_IMG,
			[FACTS_GPP_LABEL]: FACTS_GPP_IMG,
			[RARE_GPP_LABEL]: RARE_GPP_IMG,
			[WHY_DO_I_HAVE_GPP_LABEL]: HAVE_GPP_IMG,
			[DIAGNOSIS_GPP_LABEL]: DIAGNOSIS_GPP_IMG,
			[GPP_CONTAGIOUS_LABEL]: GPP_CONTAGIOUS_IMG,
			[FRIENDS_FAMILY_LABEL]: FRIENDS_FAMILY_IMG,
			[FEELING_EXCLUDED_LABEL]: FEELING_EXCLUDED_IMG,
			[GPP_INTIMACY_LABEL]: GPP_INTIMACY_IMG,
			[GPP_PREGNANCY_LABEL]: GPP_PREGNANCY_IMG,
			[MANAGE_FLARES_LABEL]: MANGE_FLARE_IMG,
			[GPP_COMORBIDITIES_LABEL]: GPP_COMORBIDITIES_IMG,
			[MANAGE_GPP_SYMPTOMS_LABEL]: MANAGE_GPP_SYMPTOMS_IMG,
			[ASK_DOCTOR_LABEL]: ASK_DOCTOR_IMG,
			[SEEK_MEDICARE_LABEL]: SEEK_MEDICARE_IMG,
			[SEEK_EMERGENCY_LABEL]: SEEK_EMERGENCY_IMG,
			[MANAGE_SCARS_LABEL]: MANGE_SCARS_IMG,
			[COMPLICATE_GPP_LABEL]: COMPLICAT_GPP_IMG,
			[RECOGNIZING_FLARES_LABEL]: RECOGNIZING_FLARES_IMG,
			[VISIT_DOCTOR_LABEL]: VISIT_IMG,
			[DERMATOLOGIST_LABEL]: DERMATOLOGIST_IMG,
			[TALK_GPP_LABEL]: TALK_GPP_IMG,
			[NOT_ALONE_LABEL]: ALONE_IMG,
			[POSITIVE_CHOICES_LABEL]: CHOICES_IMG,
			[TREATING_GPP_LABEL]: TREATING_GPP_IMG,
			[SPEVIGO_INFUSION_LABEL]: INFUSION_IMG,
			[PREVENTION_GPP_LABEL]: PREVENTION_IMG,
			[SPEVIGO_INJECTION_LABEL]: INJECTION_IMG,
			[WORK_IN_GPP_LABEL]: WORK_IN_GPP_IMG
		};

		if (title in imageMap) {
			return imageMap[title];
		}
		return ''; // Default return value if title doesn't match any known articles
	}
	

	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		let event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if(typeof window !== 'undefined'){
		this.dispatchEvent(event);
		}
	}
}