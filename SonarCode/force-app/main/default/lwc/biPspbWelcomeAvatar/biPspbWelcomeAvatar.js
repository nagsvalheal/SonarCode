// This component is utilized for displaying a personalized message and patient's name.
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import FETCH_PERSONALIZED_MESSAGES from '@salesforce/apex/BI_PSPB_PersonalizedMessagesCtrl.fetchPersonalizedMessages';
import GET_CATEGORY_MESSAGES from '@salesforce/apex/BI_PSPB_PersonalizedMessagesCtrl.getCategoryMessages';
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
// To import Static Resource
import {label} from 'c/biPspbAvatarResources';

export default class BiPspbWelcomeAvatar extends LightningElement {
	currentUserName = '';
	userId = label.ID;
	finalMessage;
	finalMessageList = [];
	selectedValue;
	loggedPatient = false;
	caregiver = false;
	personalizeMessage = false;
	message = '';
	personalizedMessages = [];
	generalMessages = [];
	genMessage = '';
	result = '';
	name = '';
	userContacts;
	selectedAvatarSrc = '';
	userAccounts;
	loggedUserData;
	welcomStr = label.WELCOME;

	/* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered. */
	// To retrieve the personalized messages based on questionnaire data
	@wire(FETCH_PERSONALIZED_MESSAGES)
	wiredPersonalizedMessages({ error, data }) {
		try {
			if (data && data.length > 0) {
				this.personalizedMessages = data;
				this.personalizeMessage = true;
				if (this.personalizedMessages.length > 0) {
					this.result = this.getRandomNumber(
						0,
						this.personalizedMessages.length - 1
					);
					this.message = this.personalizedMessages[this.result];
				}
				this.mapMessage();
			} else if (error) {
				// Handle errors
				this.HandleToast(error.body.message); // Catching Potential from Apex
			}
		} catch (err) {
			this.HandleToast(err.message); // Catching Potential Error from lwc
		}
	}

	/* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered. */
	// To retrieve the logged in user name and selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
			if (data) {
					this.name = data.length > 0 ? data[0]?.Account.Name : '';
					this.currentUserName = this.name;
					this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : label.DEFAULT_AVATAR_IMG;
					this.replacePlaceholders();
				}
			else if (error) {
				this.HandleToast(error.body.message);
			}
		} catch (err) {
			this.HandleToast(err.message);
		}
	}
	// To render the personalized messages and name of the user
	mapMessage() {
		if (this.message && this.message.length !== 0) {
			this.finalMessageList.push(this.message);
		}
	
		if (this.genMessage && this.genMessage.length !== 0) {
			this.finalMessageList.push(this.genMessage);
		}
		
		let previousMessage = window.sessionStorage.getItem('message');

		if (previousMessage) {
			// Remove the previous message from finalMessageList
			this.finalMessageList = this.finalMessageList.filter(message => message !== previousMessage);
		}
		if (this.finalMessageList.length === 1) {
			this.finalMessage = this.finalMessageList[0];
		} else if (this.finalMessageList.length > 1) {
			let finalans = this.getRandomNumber(0, 1);
			this.finalMessage = this.finalMessageList[finalans];
		}
		window.sessionStorage.setItem('message', this.finalMessage);
		this.replacePlaceholders();
	}
	

	handleClick() {
		this.personalizeMessage = false;
	}
	handleDotClick() {
		this.personalizeMessage = false;
	}

	// To retrieve the general category messages and Monday, Friday messages
	connectedCallback() {
		// code
		try {
			GET_CATEGORY_MESSAGES({ categoryval: label.GEN_CATEGORY_MESSAGES })
				.then((result) => {
					this.generalMessages = result;
					this.result = this.getRandomNumber(
						0,
						this.generalMessages.length - 1
					);
					this.genMessage = this.generalMessages[this.result];
					this.replacePlaceholders();
				})
				.catch((error) => {
					this.HandleToast(error.message); // Catching Potential Error from apex
				});
		} catch (err) {
			this.HandleToast(err.message); // Catching Potential Error from lwc
		}
	}

	// Generate a random decimal between 0 (inclusive) and 1 (exclusive)
	getRandomNumber(min, max) {
		let randomDecimal = Math.random();

		// Scale the random decimal to the range [min, max)
		let randomNumber = Math.floor(randomDecimal * (max - min + 1)) + min;

		return randomNumber;
	}

	// Replace placeholders with the user's name
	replacePlaceholders() {
		if (!this.name) {
			return;
		}
	
		const replacePlaceholdersInMessage = (message) => {
			if (message) {
				return message.replace(/\{!username\}/gu, this.name).replace(/XXX/gu, this.name);
			}
			return message;
		};
	
		this.message = replacePlaceholdersInMessage(this.message);
		this.genMessage = replacePlaceholdersInMessage(this.genMessage);
		this.finalMessage = replacePlaceholdersInMessage(this.finalMessage);
	}
	HandleToast(err){
		this.showToast(label.ERROR_MESSAGE, err, label.ERROR_VARIANT);
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