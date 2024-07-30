//This LWC dynamically renders error messages, challenges, and congratulatory messages based on various conditions, enhancing user engagement and interaction in challenges
//To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { resources } from 'c/biPspLabelAndResourceChallenges';
//To get Current UserId
import Id from '@salesforce/user/Id';
//To import Apex Classes
import GET_ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_RANDOM_CHALLENGES from '@salesforce/apex/BI_PSP_RandomChallengesCtrl.getRandomChallenges';
import GET_INDIVIDUAL_CHALLENGES from '@salesforce/apex/BI_PSP_IndividualChallengesCtrl.getIndividualChallenges';
import UPDATE_CHALLENGES from '@salesforce/apex/BI_PSP_ChallengeCtrl.updateChallenges';
import GET_RANK from '@salesforce/apex/BI_PSP_ChallengeRankCtrl.getRank';

export default class BiPspbChallenges extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	availableChallenges = [];
	acceptedChallenges = [];
	activeChallenges = [];
	percentage = 0;
	showChallenges;
	showCongrats;
	showCongratsPre;
	bookLvlTwo = '';

	percentageCompleted;
	showQuestion = true;
	congrats = false;
	siteUrlBranded = resources.BR_SITE_URL;
	siteTrophyCaseUrlBranded = resources.BR_TROPHY_CASE_SITE_URL;
	errorMessagePl = resources.ERR_MSG_PL;
	resultSuccess = '';
	completedLabel = resources.LABLE_STATUS_COMPLETED;
	activeLabel = resources.LABLE_STATUS_ACTIVE;
	availableLabel = resources.LABLE_AVAILABLE;
	levelOne = resources.RANK_LEVEL_ONE;
	levelTwo = resources.RANK_LEVEL_TWO;
	levelThree = resources.RANK_LEVEL_THREE;
	levelFour = resources.RANK_LEVEL_FOUR;
	levelFive = resources.RANK_LEVEL_FIVE;
	levelSix = resources.RANK_LEVEL_SIX;
	rankTwo = resources.CH_RANK_TWO;
	rankThree = resources.CH_RANK_THREE;
	rankFour = resources.CH_RANK_FOUR;
	rankFive = resources.CH_RANK_FIVE;
	rankSix = resources.CH_RANK_SIX;
	challengeArrowSmall = resources.CHALLENGE_ARROW_SMALL;
	challengeArrowLarge = resources.CHALLENGE_ARROW_LARGE;
	crossIcon = resources.CRO_ICON;
	celebration = resources.CELEBRATION;
	activeNo = resources.ACTIVE_NO;
	expertImage = resources.EXPERT_IMAGE;
	ProficientImage = resources.PROFICIENT_IMAGE;
	IntermediateImage = resources.INTERMEDIATE_IMAGE;
	BeginnerImage = resources.BEGINNER_IMAGE;
	NoviceImage = resources.NOVICE_IMAGE;
	errorMessages = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT;
	expertGpp = resources.EXPERT_GPP;
	beginnerGpp = resources.BEGINNER_GPP;
	intermediateGpp = resources.INTERMEDIATE_GPP;
	noviveGpp = resources.NOVICE_GPP;
	proficientGpp = resources.PROFICIENT_GPP;
	noviceGpps = resources.NOVICE_GPPS;
	beginner = resources.BEGINNER;
	intermediate = resources.INTERMEDIATE;
	proficient = resources.PROFICIENT;
	expert = resources.EXPERT;
	totalXp = resources.TOTAL_XP;
	activeCount = 0;
	updateChallenge = {};
	updating;
	showMore;
	updateChallengeTwo = {};
	updateChallengeComplete = {};
	title;
	description;
	rewardPoints;
	image;
	showmodal;
	showbutton;
	showInfo;
	showInfo1;
	showcong;
	isLoading = false;
	rankcompleted;
	currentXP = 0;
	nextrankxp;
	xpNextrank;
	rankLevel;
	rankLevels;
	variable;
	showMoreCount = 3;
	userId = Id;
	selectedAvatarSrc;
	selectedName;
	enrolleId;
	showError;
	errorMessage;
	tImage;
	completedpercentage;
	showFiveHund;
	showNoneFive;
	showLess;
	updateChallengeOne = {};
	availableCount = 0;

	//this function is used for navigating to trophycase page
	navigateTrophy() {
		window.location.assign(this.siteUrlBranded + this.siteTrophyCaseUrlBranded);
	}

	//connectedcallback is used for get the careprogram enrollee id
	connectedCallback() {
		try {
			GET_ENROLLE()
				.then((result) => {
					if (result.length > 0) {//result is returned as a list so we have used result.length
						if (result[0].patientEnrolle !== null) {
							this.enrolleId = result[0].patientEnrolle.Id;
							this.xpMethod();
							this.getActiveAndAvailableChallenge();
						} else if (result[0].error !== null) {
							this.showError = true;
							this.errorMessage = result[0].error;
						}
					} else {
						this.showError = true;
						this.errorMessage = this.errorMessagePl;
					}
				})
				.catch((error) => {
					this.showToast(this.errorMessages, error.message, this.errorVariant);
				});
		} catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	//This method is used for get the active and available challenges.
	getActiveAndAvailableChallenge() {
		this.getRandomChallengesCommon();
		let status = this.activeLabel;
		try{
			GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
				.then((result) => {
					if (
						(Array.isArray(result) &&
							result.length === 1 &&
							Object.keys(result[0]).length === 0) ||
						result === null
					) {
						this.resultSuccess = result;
					}
					else {
						this.activeChallenges = result.filter(
							(obj) => Object.keys(obj).length !== 0
						);
						this.activeCount = this.activeChallenges.length;
					}
					this.showInfos();
				})
				.catch((error) => {
					this.showToast(this.errorMessages, error.message, this.errorVariant);
				});
		}catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//This method is used for get the rank and xp values.
	xpMethod() {
		this.isLoading = true;
		try{
			GET_RANK({ personAccountId: this.enrolleId })
				.then((result) => {
					if (result !== null) {
						this.variable = true;
						this.currentXP = result[0].BI_PSP_Total_Reward_Points__c;

						if (this.currentXP === undefined) {
							this.currentXP = 0;
						}
						if (this.currentXP < this.noviceGpps) {
							this.nextrankxp = this.noviceGpps;
							this.xpNextrank = this.noviceGpps - this.currentXP;
							this.rankLevel = this.levelOne;
							this.rankLevels = this.rankTwo;
							this.percentage = 100 * (this.currentXP / this.nextrankxp);
							this.percentage = Math.floor(this.percentage);
							this.rankcompleted = this.noviveGpp;
							this.tImage = this.NoviceImage;
						} else if (
							this.currentXP >= this.noviceGpps &&
							this.currentXP < this.beginner
						) {
							this.nextrankxp = this.beginner;
							this.xpNextrank = this.beginner - this.currentXP;
							this.rankLevel = this.levelTwo;
							this.rankLevels = this.rankThree;
							this.percentage = 100 * (this.currentXP / this.nextrankxp);
							this.percentage = Math.floor(this.percentage);
							this.rankcompleted = this.beginnerGpp;
							this.tImage = this.BeginnerImage;
						} else if (
							this.currentXP >= this.beginner &&
							this.currentXP < this.intermediate
						) {
							this.nextrankxp = this.intermediate;
							this.xpNextrank = this.intermediate - this.currentXP;
							this.rankLevel = this.levelThree;
							this.rankLevels = this.rankFour;
							this.percentage = 100 * (this.currentXP / this.nextrankxp);
							this.percentage = Math.floor(this.percentage);
							this.rankcompleted = this.intermediateGpp;
							this.tImage = this.IntermediateImage;
						} else if (
							this.currentXP >= this.intermediate &&
							this.currentXP < this.proficient
						) {
							this.nextrankxp = this.proficient;
							this.xpNextrank = this.proficient - this.currentXP;
							this.rankLevel = this.levelFour;
							this.rankLevels = this.rankFive;
							this.percentage = 100 * (this.currentXP / this.nextrankxp);
							this.percentage = Math.floor(this.percentage);
							this.rankcompleted = this.proficientGpp;
							this.tImage = this.ProficientImage;
						} else if (this.currentXP >= this.proficient && this.currentXP < this.expert) {
							this.nextrankxp = this.expert;
							this.xpNextrank = this.nextrankxp - this.currentXP;
							this.rankLevel = this.levelFive;
							this.rankLevels = this.rankSix;
							this.variable = false;
							this.percentage = 100 * (this.currentXP / this.nextrankxp);
							this.percentage = Math.floor(this.percentage);
							this.rankcompleted = this.expertGpp;
							this.tImage = this.expertImage;
						}
						else if (this.currentXP >= this.expert) {
							if (this.currentXP === 1500) {
								this.showFiveHund = true;
								this.showNoneFive = false;
							} else {
								this.showFiveHund = false;
								this.showNoneFive = true;
							}
							this.percentage = 100;
							this.tImage = this.expertImage;
							this.rankLevel = this.levelSix;
							let status = this.availableLabel;
							GET_RANDOM_CHALLENGES({
								personAccountId: this.enrolleId,
								status: status
							})
								.then((datas) => {
									let data = datas;
									data = data.filter((obj) => Object.keys(obj).length !== 0);
									if (data.length === 0) {
										let activeStatus = this.activeLabel;
										GET_RANDOM_CHALLENGES({
											personAccountId: this.enrolleId,
											status: activeStatus
										})
											.then((resultDatas) => {
												let resultData = resultDatas;
												resultData = resultData.filter(
													(obj) => Object.keys(obj).length !== 0
												);
												if (resultData.length === 0) {
													this.showCongratsPre = false;
												} else {
													this.showCongratsPre = true;
												}
											})
											.catch((error) => {
												this.showToast(
													this.errorMessages,
													error.message,
													this.errorVariant
												);
											});
									} else {
										this.showCongratsPre = true;
									}
								})
								.catch((err) => {
									this.showToast(this.errorMessages, err.message, this.errorVariant);
								});
						}
						this.getavailable();
					}
					this.isLoading = false;
					if (typeof window !== 'undefined') {
						this.dispatchEvent(
							new CustomEvent('sendxp', { detail: this.currentXP })
						);
					}
				})
				.catch((error) => {
					this.isLoading = false;
					this.showToast(this.errorMessages, error.message, this.errorVariant);
				});
			}
		catch (error) {
		//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//This method is used for get Only available challenges.
	getavailable() {
		try{
			if (this.currentXP >= 1500) {
				let status = this.availableLabel;
				GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
					.then((results) => {// Null check for result has been handled in Apex class.
						let result = results
						result = result.filter((obj) => Object.keys(obj).length !== 0);
						if (result.length === 0) {
							this.showCongrats = true;
							this.showChallenges = false;
							this.percentage = 100;
							let localStatus = this.activeLabel;
							GET_RANDOM_CHALLENGES({
								personAccountId: this.enrolleId,
								status: localStatus
							})
								.then((resultValues) => {
									let resultValue = resultValues
									resultValue = resultValue.filter((obj) => Object.keys(obj).length !== 0);
									if (resultValue.length === 0) {
										this.showCongrats = true;
										this.showChallenges = false;
										this.percentage = 100;
									} else {
										this.showCongrats = false;
										this.showChallenges = true;
									}
								})
								.catch((error) => {
									this.showToast(this.errorMessages, error.message, this.errorVariant);
								});
						} else {
							this.showCongrats = false;
							this.showChallenges = true;
						}
					})
					.catch((error) => {
						this.showToast(this.errorMessages, error.message, this.errorVariant);
					});
			} else {
				this.showCongrats = false;
				this.showChallenges = true;
			}
		}catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//This is uesd for closing the completed challenge popup
	closeComplete() {
		this.showmodal = false;
		this.showbutton = "";
		this.updateChallengeComplete = {};
		this.showcong = true;
		this.showmodal = false;
		this.basicCannon();
	}
	//Functionality for after completing the challenge
	afterComplete() {
		this.showbutton = true;
		this.simpleUpdateChallenge(this.updateChallengeComplete);
	}
	//Navigation
	closeMobMenu1() {
		window.location.assign(window.location.href);
	}
	//Popup Functionalities
	closeMobMenu() {
		this.closeModal();
	}
	closeModal() {
		this.showmodal = false;
		this.percentageCompleted = 0;
		this.updateChallengeComplete = {};
		document.body.style.overflow = "auto";
	}
	afterClose() {
		this.showcong = false;
		window.location.assign(window.location.href);
	}
	//Functionality for completing the challenge
	completeChallenge(event) {
		const componentId1 = event.detail.activechallengeid;
		const componentId = event.detail.challengeidtoupdate;
		this.updateChallengeTwo = this.activeChallenges.filter(
			(challenges) => challenges.challengeIdToUpdate === componentId
		);
		this.updateChallengeComplete = this.updateChallengeTwo;
		this.showmodal = true;
		this.showbutton = false;
		this.getActiveChallenge(componentId1);
		this.fromNavBar(event);
	}
	//This method is used to get the Active Challenges.
	getActiveChallenge(challengeIds) {
		try{
			GET_INDIVIDUAL_CHALLENGES({ challengeId: challengeIds })
				.then((result) => {//Null check for the returned value has been handled in apex class.
					if (result[0].Name) {
						this.title = result[0].Name;
					}
					if (result[0].HealthCloudGA__Description__c) {
						this.description = result[0].HealthCloudGA__Description__c.replace(
							/<[^>]*>/gu,
							""
						);
						if (this.description === 'Read the following article:') {
							this.bookLvlTwo = '"why being active is important"'
						}

					}
					if (result[0].BI_PSP_Challenge_Reward_Points__c) {
						this.rewardPoints = result[0].BI_PSP_Challenge_Reward_Points__c;
					}
					if (result[0].BI_PSP_Challenge_Image__c) {
						this.image = result[0].BI_PSP_Challenge_Image__c;
						const desiredWidth = '135px';
						const desiredHeight = '70px';
						const imgTagRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/giu;
						const formattedContent = this.image.replace(
							imgTagRegex,
							(match, src) => `<img src="${src}" alt="" width="${desiredWidth}" height="${desiredHeight}">`
						);
						this.image = formattedContent;
					}
				})
				.catch((error) => {
					this.showToast(this.errorMessages, error.message, this.errorVariant);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	//Dynamically modifies the overflow css property accorfing to active challenges
	fromNavBar(event) {
		if (event.detail.activechallengeid) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}

	//This method is used to Update the Available Challenges.
	simpleUpdateChallenge(updatingChallenge) {
		this.updating = this.completedLabel;
		try{
			UPDATE_CHALLENGES({
				challenge: updatingChallenge[0].challengeIdToUpdate,
				activeAvailable: this.updating,
				userId: Id


			})
				.then((result) => {
					if (result[0].error === null || result[0].error === undefined) {
						const activeChallengeIds = new Set(
							this.updateChallengeTwo.map(
								(challenge) => challenge.challengeIdToUpdate
							)
						);
						this.activeChallenges = this.activeChallenges.filter(
							(challenge) =>
								!activeChallengeIds.has(challenge.challengeIdToUpdate)
						);

						this.showInfos();
						this.updateChallengeTwo = {};
						this.isLoading = false;
						this.activeCount = this.activeChallenges.length;
						this.congrats = true;
					} else {
						this.showQuestion = false;
						this.isLoading = false;
						this.congrats = false;
						this.percentageCompleted = result[0].percentage;
					}
				})
				.catch((error) => {
					this.isLoading = false;
					this.showToast(this.errorMessages, error.message, this.errorVariant);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	//This method is used to remove the Active Challenges.
	removeActiveChallenge(event) {
		try{
			this.isLoading = true;
			const componentId = event.detail.challengeidtoupdate;
			this.updateChallengeOne = this.activeChallenges.filter(
				(challenges) => challenges.challengeIdToUpdate === componentId
			);
			this.updating = this.availableLabel;
			UPDATE_CHALLENGES({ challenge: componentId, activeAvailable: this.updating, userId: Id })
				.then(() => {
					const activeChallengeIds = new Set(
						this.availableChallenges.map(
							(challenge) => challenge.challengeIdToUpdate
						)
					);
					const updatedChallenges = this.updateChallengeOne.map((challenge) => {
						if (activeChallengeIds.has(challenge.challengeIdToUpdate)) {
							const existingChallengeIndex = this.availableChallenges.findIndex(
								(existingChallenge) =>
									existingChallenge.challengeIdToUpdate ===
									challenge.challengeIdToUpdate
							);
							if (existingChallengeIndex !== -1) {
								return challenge;
							}
							return false;

						}
						return null;
					});


					this.availableChallenges = [
						...this.availableChallenges,
						...updatedChallenges
					];
					this.showinfo();
					this.updateChallengeOne = {};
					this.isLoading = false;
					this.availableCount = this.availableChallenges.length;
				})

				.catch((error) => {
					this.isLoading = false;
					this.showToast(this.errorMessages, error.message, this.errorVariant);
				});
			this.activeChallenges = this.activeChallenges.filter(
				(challenge) => challenge.challengeIdToUpdate !== componentId
			);
			this.showInfos();
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	//This method is used to remove the Available Challenges.
	removeAvailableChallenge(event) {
		try{
			this.isLoading = true;
			const componentId = event.detail.challengeidtoupdate;
			this.updateChallenge = this.availableChallenges.filter(
				(challenges) => challenges.challengeIdToUpdate === componentId
			);
			this.updating = this.activeLabel;
			UPDATE_CHALLENGES({ challenge: componentId, activeAvailable: this.updating, userId: Id })
				.then(() => {
					this.isLoading = false;
					window.location.assign(window.location.href);
				})
				.catch((error) => {
					this.isLoading = false;
					this.showToast(this.errorMessages, error.body.message, this.errorVariant);
				});
			this.showinfo();
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	showinfo() {
		if (
			Array.isArray(this.availableChallenges) &&
			this.availableChallenges.length === 0
		) {
			this.showInfo1 = true;
		} else {
			this.showInfo1 = false;
		}
	}

	// This is used to get the Available random challlenges
	getRandomChallengesCommon() {
		try {
			let status = this.availableLabel;
			GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
				.then((results) => {
					this.handleChallengeResults(results);
				})
				.catch((error) => {
					this.showToast(this.errorMessages, error.message, this.errorVariant);
				});
		} catch (error) {
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}

	handleChallengeResults(results) {
		// let result = this.filterEmptyResults(results);
		let result = results.filter(
			(obj) => Object.keys(obj).length !== 0
		);
	
		if (
			(Array.isArray(result) &&
			result.length === 1 &&
			Object.keys(result[0]).length === 0) ||
			result === null
		) 
		{
			this.showInfo1 = true;
			this.showMore = false;
			this.showLess = false;
		} else {
			let filteredResult = this.filterActiveChallenges(result);
			// let filteredArray = this.filterEmptyResults(filteredResult);
			let filteredArray = filteredResult.filter(
				(obj) => Object.keys(obj).length !== 0
			);
			this.updateAvailableChallenges(filteredArray);
			this.updateShowMoreLess(filteredArray);
			this.updateShowInfo(filteredArray);
		}
	}

	// filterEmptyResults(results) {
	// 	return results ? results.filter((obj) => Object.keys(obj).length !== 0) : [];
	// }

	filterActiveChallenges(result) {
		if (this.activeChallenges.length > 0) {
			return result.filter((challenge) =>
				!this.activeChallenges.some(
					(activeChallenge) =>
						activeChallenge.challengeIdToUpdate ===
						challenge.challengeIdToUpdate
				)
			);
		}
		return result;
	}
	
	updateAvailableChallenges(filteredArray) {
		if (filteredArray.length < this.showMoreCount) {
			// If there are fewer than 4 records after filtering, set the initial 4 records
			if (filteredArray !== "" || filteredArray !== null) {
				this.availableChallenges = filteredArray;
			}
			this.showMore = false;
		} else {
			// If there are 4 or more records after filtering, set the initial 4
			if (filteredArray !== "" || filteredArray !== null) {
				this.availableChallenges = filteredArray.slice(
					0,
					this.showMoreCount
				);
			}
			if (filteredArray.length > 3) {
				this.showMore = true;
			}
		}
	}

	updateShowMoreLess(filteredArray) {
		if (
			filteredArray.length === this.availableChallenges.length &&
			filteredArray.length !== 0 &&
			filteredArray.length > 3
		) {
			this.showLess = true;
		} else {
			this.showLess = false;
		}
	}

	updateShowInfo(filteredArray) {
		if (filteredArray.length > 0) {
			this.showInfo1 = false;
			this.availableCount = filteredArray.length;
		} else {
			this.showInfo1 = true;
			this.showMore = false;
			this.showLess = false;
		}
	}

	//should be deleted
	// getRandomChallengesCommon1() {
	// 	try{
	// 		let status = this.availableLabel;
	// 		GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
	// 			.then((results) => {
	// 				let result = results
	// 				if (result !== null) {
	// 					result = result.filter((obj) => Object.keys(obj).length !== 0
	// 					);
	// 					if (
	// 						(Array.isArray(result) &&
	// 							result.length === 1 &&
	// 							Object.keys(result[0]).length === 0) ||
	// 						result === null
	// 					) {
	// 						this.showInfo1 = true;
	// 						this.showMore = false;
	// 						this.showLess = false;
	// 					} else {
	// 						let filteredResult;
	// 						if (this.activeChallenges.length > 0) {
	// 							filteredResult = result.filter((challenge) => !this.activeChallenges.some(
	// 								(activeChallenge) =>
	// 									activeChallenge.challengeIdToUpdate ===
	// 									challenge.challengeIdToUpdate
	// 							));
	// 						} else {
	// 							filteredResult = result;
	// 						}
	// 						let filteredArray = filteredResult.filter(
	// 							(obj) => Object.keys(obj).length !== 0
	// 						);
	// 						if (filteredArray.length < this.showMoreCount) {
	// 							// If there are fewer than 4 records after filtering, set the initial 4 records
	// 							if (filteredArray !== "" || filteredArray !== null) {
	// 								this.availableChallenges = filteredArray;
	// 							}
	// 							this.showMore = false;
	// 						} else {
	// 							// If there are 4 or more records after filtering, set the initial 4
	// 							if (filteredArray !== "" || filteredArray !== null) {
	// 								this.availableChallenges = filteredArray.slice(
	// 									0,
	// 									this.showMoreCount
	// 								);
	// 							}
	// 							if (filteredArray.length > 3) {
	// 								this.showMore = true;
	// 							}
	// 						}
	// 						if (
	// 							filteredArray.length === this.availableChallenges.length &&
	// 							filteredArray.length !== 0 &&
	// 							filteredArray.length > 3
	// 						) {
	// 							this.showLess = true;
	// 						} else {
	// 							this.showLess = false;
	// 						}
	// 						if (result.length > 0) {
	// 							this.showInfo1 = false;
	// 							this.availableCount = filteredArray.length;
	// 						} else {
	// 							this.showInfo1 = true;
	// 							this.showMore = false;
	// 							this.showLess = false;
	// 						}
	// 					}
	// 				} else {
	// 					this.showInfo1 = true;
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				this.showToast(this.errorMessages, error.message, this.errorVariant);
	// 			});
	// 	}
	// 	catch (error) {
	// 		//navigate to error page
	// 		this.showToast(this.errorMessages, error.message, this.errorVariant);
	// 	}
	// }

	//Functionality for show less button
	handleShowLessClick() {
		this.showLess = false;
		this.availableChallenges = [];
		this.showMoreCount = 3;
		this.getRandomChallengesCommon();
	}

	//this method used for showing more Available challenges
	handleShowMoreClick() {
		try{
			let status = this.availableLabel;
			this.showMoreCount += 3;
			GET_RANDOM_CHALLENGES({ personAccountId: this.enrolleId, status: status })
				.then((results) => {
					let result = results
					result = result.filter((obj) => Object.keys(obj).length !== 0);
					if (result !== null) {
						this.showInfo1 = false;
						if (result.length > this.availableChallenges.length) {
							const newChallenges = result.slice(
								this.availableChallenges.length,
								this.showMoreCount
							);
							this.availableChallenges = [
								...this.availableChallenges,
								...newChallenges
							];
						}
						if (result.length === this.availableChallenges.length) {
							this.showLess = true;
							this.showMore = false;
						} else if (result.length > 3) {
							this.showLess = false;
							this.showMore = true;
						}
					} else {
						this.showInfo1 = true;
						this.showLess = false;
						this.showMore = false;
					}
				})
				.catch((error) => {
					this.showToast(this.errorMessages, error.message, this.errorVariant);
				});
		}
		catch (error) {
			//navigate to error page
			this.showToast(this.errorMessages, error.message, this.errorVariant);
		}
	}
	// Its shows the Infromation about active challenges
	showInfos() {
		if (this.activeChallenges === null || this.activeChallenges.length === 0) {
			this.showInfo = true;
		} else {
			this.showInfo = false;
		}
	}



	showToast(title, message, variant) {
		if (typeof window !== 'undefined') {
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
}