//This Lightning Web Component fetches user enrollment, ranks, and completed challenges from Apex methods, dynamically updating the UI with pagination controls.
//To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { resources } from 'c/biPspLabelAndResourceChallenges';
//To get current user Id
import Id from "@salesforce/user/Id";
//To import apex classess
import ENROLLE_DETAILS from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import RANDOM_CHALLENGES from '@salesforce/apex/BI_PSP_RandomChallengesCtrl.getRandomChallenges';
import RANK_DETAILS from '@salesforce/apex/BI_PSP_ChallengeRankCtrl.getRank';

export default class BiPspbTrophyCaseComponent extends LightningElement {
	completedChallenges = [];
	imageRanks = [];
	imageRanksToSend = [];
	showInfo;
	userId = Id;
	displayedRecords = 3;
	showMore;
	showLess;
	selectedAvatarSrc;
	novice;
	beginner;
	intermediate;
	proficient;
	recordcount = 0;
	expert;
	showError;
	errorMessage;
	enrolleId;
	noviceImage = resources.NOVICE_IMAGE; 
	beginnerImage = resources.BEGINNER_IMAGE;
	intermediateImage = resources.INTERMEDIATE_IMAGE;
	proficientImage = resources.PROFICIENT_IMAGE;
	expertImage = resources.EXPERT_IMAGE;
	noviceStar = resources.NOVICE_STAR;
	beginnerStar = resources.BEGINNER_STAR;
	immediateStar = resources.INTERMEDIATE_STAR;
	proficientStar = resources.PROFICIENT_STAR;
	expertStar = resources.EXPERT_STAR;
	rankLevelTwo = resources.RANK_LEVEL_TWO;
	rankLevelThree = resources.RANK_LEVEL_THREE;
	rankLevelFour = resources.RANK_LEVEL_FOUR;
	rankLevelFive = resources.RANK_LEVEL_FIVE;
	rankLevelSix = resources.RANK_LEVEL_SIX;
	statusCompleted = resources.LABLE_STATUS_COMPLETED;
	errorMsg = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT;
	expertGpp = resources.EXPERT_GPP;
	beginnerGpp = resources.BEGINNER_GPP;
	intermediateGpp = resources.INTERMEDIATE_GPP;
	noviceGpp = resources.NOVICE_GPP;
	proficientLabel = resources.PROFICIENT_GPP;
	//Used to format the passed date value
	formatDate(dateString) {
		const DATE = new Date(dateString);
		const MONTH = (DATE.getMonth() + 1).toString().padStart(2, '0');
		const DAY = DATE.getDate().toString().padStart(2, '0');
		const YEAR = DATE.getFullYear();
		return `${MONTH}/${DAY}/${YEAR}`;
	}
	//Used to get the patient's enrollee details, calulates the ranks to display the respective trophy
	connectedCallback() {
		try {
			ENROLLE_DETAILS({ userId: this.userId })
				.then(result => { // Null check has been handled in its respective apex method
					if (result[0].patientEnrolle !== null) {
						this.showError = false;
						this.enrolleId = result[0].patientEnrolle.Id;
						this.getRanks();
						this.getCompletedChallenge();
					} else if (result[0].error !== null) {
						this.showError = true;
						this.errorMessage = result[0].error;
					}
				})
				.catch(error => {
					this.showToast(this.errorMsg, error.message, this.errorVariant);
				})
		}
		catch (error) {
			this.showToast(this.errorMsg, error.message, this.errorVariant);
		}
	}

	// this event is used for get ranks in Trophy
	getRanks() {
		try
		{
			RANK_DETAILS({ personAccountId: this.enrolleId })
				.then(result => {// Null check has been handled in its respective apex method
					this.imageRanks = result;

					if (this.imageRanks[0].BI_PSP_DOC_Novice__c !== null) {
						const dateString = this.imageRanks[0].BI_PSP_DOC_Novice__c;
						this.novice = this.formatDate(dateString);
					}
					if (this.imageRanks[0].BI_PSP_DOC_Beginner__c !== null) {
						const dateString = this.imageRanks[0].BI_PSP_DOC_Beginner__c;
						this.beginner = this.formatDate(dateString);
					}

					if (this.imageRanks[0].BI_PSP_DOC_Intermediate__c !== null) {
						const dateString = this.imageRanks[0].BI_PSP_DOC_Intermediate__c;
						this.intermediate = this.formatDate(dateString);
					}

					if (this.imageRanks[0].BI_PSP_DOC_Proficient__c !== null) {
						const dateString = this.imageRanks[0].BI_PSP_DOC_Proficient__c;
						this.proficient = this.formatDate(dateString);
					}

					if (this.imageRanks[0].BI_PSP_DOC_Expert__c !== null) {
						const dateString = this.imageRanks[0].BI_PSP_DOC_Expert__c;
						this.expert = this.formatDate(dateString);
					}
					if (this.imageRanks[0].BI_PSP_Challenge_Rank__c === this.noviceGpp) {
						const imageData = { image: this.noviceImage, date: this.novice, level: this.rankLevelTwo };
						this.imageRanksToSend.push(imageData);
						const imageData1 = { image: this.beginnerStar, level: this.rankLevelThree };
						this.imageRanksToSend.push(imageData1);
						const imageData2 = { image: this.immediateStar, level: this.rankLevelFour };
						this.imageRanksToSend.push(imageData2);
						const imageData3 = { image: this.proficientStar, level: this.rankLevelFive };
						this.imageRanksToSend.push(imageData3);
						const imageData5 = { image: this.expertStar, level: this.rankLevelSix };
						this.imageRanksToSend.push(imageData5);
					} else if (this.imageRanks[0].BI_PSP_Challenge_Rank__c === this.beginnerGpp) {
						const imageData = { image: this.noviceImage, date: this.novice, level: this.rankLevelTwo };
						this.imageRanksToSend.push(imageData);
						const imageData1 = { image: this.beginnerImage, date: this.beginner, level: this.rankLevelThree };
						this.imageRanksToSend.push(imageData1);
						const imageData2 = { image: this.immediateStar, level: this.rankLevelFour };
						this.imageRanksToSend.push(imageData2);
						const imageData3 = { image: this.proficientStar, level: this.rankLevelFive };
						this.imageRanksToSend.push(imageData3);
						const imageData5 = { image: this.expertStar, level: this.rankLevelSix };
						this.imageRanksToSend.push(imageData5);
					} else if (this.imageRanks[0].BI_PSP_Challenge_Rank__c === this.intermediateGpp) {
						const imageData = { image: this.noviceImage, date: this.novice, level: this.rankLevelTwo };
						this.imageRanksToSend.push(imageData);
						const imageData1 = { image: this.beginnerImage, date: this.beginner, level: this.rankLevelThree };
						this.imageRanksToSend.push(imageData1);
						const imageData2 = { image: this.intermediateImage, date: this.intermediate, level: this.rankLevelFour };
						this.imageRanksToSend.push(imageData2);
						const imageData3 = { image: this.proficientStar, level: this.rankLevelFive };
						this.imageRanksToSend.push(imageData3);
						const imageData5 = { image: this.expertStar, level: this.rankLevelSix };
						this.imageRanksToSend.push(imageData5);
					} else if (this.imageRanks[0].BI_PSP_Challenge_Rank__c === this.proficientLabel) {
						const imageData = { image: this.noviceImage, date: this.novice, level: this.rankLevelTwo };
						this.imageRanksToSend.push(imageData);
						const imageData1 = { image: this.beginnerImage, date: this.beginner, level: this.rankLevelThree };
						this.imageRanksToSend.push(imageData1);
						const imageData2 = { image: this.intermediateImage, date: this.intermediate, level: this.rankLevelFour };
						this.imageRanksToSend.push(imageData2);
						const imageData3 = { image: this.proficientImage, date: this.proficientLabel, level: this.rankLevelFive };
						this.imageRanksToSend.push(imageData3);
						const imageData5 = { image: this.expertStar, level: this.rankLevelSix };
						this.imageRanksToSend.push(imageData5);
					} else if (this.imageRanks[0].BI_PSP_Challenge_Rank__c === this.expertGpp) {
						const imageData = { image: this.noviceImage, date: this.novice, level: this.rankLevelTwo };
						this.imageRanksToSend.push(imageData);
						const imageData1 = { image: this.beginnerImage, date: this.beginner, level: this.rankLevelThree };
						this.imageRanksToSend.push(imageData1);
						const imageData2 = { image: this.intermediateImage, date: this.intermediate, level: this.rankLevelFour };
						this.imageRanksToSend.push(imageData2);
						const imageData3 = { image: this.proficientImage, date: this.proficientLabel, level: this.rankLevelFive };
						this.imageRanksToSend.push(imageData3);
						const imageData5 = { image: this.expertImage, date: this.expert, level: this.rankLevelSix };
						this.imageRanksToSend.push(imageData5);
					} else {
						const imageData = { image: this.noviceStar, level: this.rankLevelTwo };
						this.imageRanksToSend.push(imageData);
						const imageData1 = { image: this.beginnerStar, level: this.rankLevelThree };
						this.imageRanksToSend.push(imageData1);
						const imageData2 = { image: this.immediateStar, level: this.rankLevelFour };
						this.imageRanksToSend.push(imageData2);
						const imageData3 = { image: this.proficientStar, level: this.rankLevelFive };
						this.imageRanksToSend.push(imageData3);
						const imageData5 = { image: this.expertStar, level: this.rankLevelSix };
						this.imageRanksToSend.push(imageData5);
					}
				})
				.catch(error => {
					this.showToast(this.errorMsg, error.message, this.errorVariant);
				})
		}
		catch(err)
		{
			this.showToast(this.errorMsg, err.message, this.errorVariant);
		}
	}
	
	// This event is used for get  Complete challenges record
	getCompletedChallenge() {
		try{
			let status = this.statusCompleted;
			RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
			.then(results => {
				if(results!==null)
				{
					let result = results
					result = result.filter(obj => Object.keys(obj).length !== 0)
					this.completedChallenges = result;
					this.recordcount = result.length;
					if (result.length > 3) {
						this.completedChallenges = result.slice(0, this.displayedRecords);
						this.showMore = true;
						this.displayedRecords += 3;
					} else {
						this.showMore = false;
						this.completedChallenges = result;
					}
					this.showInfos();
				}else
				{
					//navigation logic
				}

			}).catch(error => {
				this.showToast(this.errorMsg, error.message, this.errorVariant);
			});
		}
		catch(err)
		{
			this.showToast(this.errorMsg, err.message, this.errorVariant);
		}
	}
	showInfos() {
		if (Array.isArray(this.completedChallenges) && this.completedChallenges.length === 0) {
			this.showInfo = true;
		} else {
			this.showInfo = false;
		}
	}

	// this event is used for show morw button
	handleShowMoreClick() {
		let status = this.statusCompleted;
		try{
			RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
			.then(results => {
				if(results!== null)
				{
					let result = results
					result = result.filter(obj => Object.keys(obj).length !== 0);
					let filteredResult;
					if (result !== null || result !== '') {
						filteredResult = result;
						if (filteredResult.length < this.displayedRecords) {
							// If there are fewer than 3 records after filtering, set the initial 3 records
							this.completedChallenges = filteredResult;
							this.showMore = false;
							this.displayedRecords += 3;
						} else {
							// If there are 3 or more records after filtering, set the initial 3
							this.completedChallenges = filteredResult.slice(0, this.displayedRecords);
							this.showMore = true;
							this.displayedRecords += 3;
						}
						if (this.displayedRecords < this.completedChallenges.length) {
							// Increment the number of displayed records.
							this.displayedRecords += 3; // You can change this number as needed.
							this.showInfos();
						}
						if (filteredResult.length === this.completedChallenges.length) {
							this.showLess = true;
							this.showMore = false;
						} else {
							this.showLess = false;
							this.showMore = true;
						}
					}
				}else
				{
					//navigate to error page
				}

			}).catch(error => {
				this.showToast(this.errorMsg, error.message, this.errorVariant);
			});
		}
		catch(err)
		{
			this.showToast(this.errorMsg, err.message, this.errorVariant);
		}

	}
	//Used for show less button functionality
	handleShowLessClick() {
		this.showLess = false;
		this.completedChallenges = [];
		this.displayedRecords = 3;
		this.getCompletedChallenge();
	}
	
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