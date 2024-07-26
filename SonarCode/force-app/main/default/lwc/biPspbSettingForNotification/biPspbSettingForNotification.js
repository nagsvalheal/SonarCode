// This LWC is designed to display Notification Settings on clicking the Account Manager in the Dashboard
// To import Libraries
import { LightningElement,wire } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Static Resources
import NEW_CONTENT_IMG from '@salesforce/resourceUrl/BI_PSP_NewContent';
import CHALLENGE_IMG from '@salesforce/resourceUrl/BI_PSP_Challenges';
import QUESTIONNAIRE_IMG from '@salesforce/resourceUrl/BI_PSP_Questionnaires';
import TREATMENT_IMG from '@salesforce/resourceUrl/BI_PSPB_TreatmentImage';
import COMMUNITY_IMG from '@salesforce/resourceUrl/BI_PSP_Community';
import SYMPTOMS_IMG from '@salesforce/resourceUrl/BI_PSP_SymptomTracker';
import CHECK_BOX_ICON from '@salesforce/resourceUrl/BI_PSPB_CheckBoxIcon';
// To import Apex Classes
import GET_USER_ACCOUNT_ID from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import UPDATE_NOTIFY from '@salesforce/apex/BI_PSP_UpdateNotificationCtrl.updateFieldInObject';
import UPDATE_RECENT_NOTIFY from '@salesforce/apex/BI_PSP_UpdateNotificationCtrl.retrieveNotifications';
// To import current user ID
import ID from '@salesforce/user/Id';
// To import Custom Labels
import TREATMENT from "@salesforce/label/c.BI_PSPB_TreatmentRxRemainders";
import SYMPTOM from "@salesforce/label/c.BI_PSP_SymptomTrackerValue";
import NEW_CONTENT from "@salesforce/label/c.BI_PSP_NotificationNewContent";
import CHALLENGES from "@salesforce/label/c.BI_PSP_ChallengesName";
import COMMUNITY from "@salesforce/label/c.BI_PSPB_Community";
import QUESTIONNAIRES from "@salesforce/label/c.BI_PSP_NotificationQuestionnaires";
import PHONE from "@salesforce/label/c.BI_PSP_NotificationPhone";
import EMAIL from "@salesforce/label/c.BI_PSP_NotificationEmail";
import SMS from "@salesforce/label/c.BI_PSP_SmsLabel";
import INSITE from "@salesforce/label/c.BI_PSP_NotificationInsiteNotification";
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class BiPspbSettingForNotification extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//Variable Declaration with 
symptomAll = false;
isCheckboxSympEmail = false;
isCheckboxSympSms = false;
isCheckboxSympInsite = false;
isCheckboxSympPhone = false;
questionAll = false;
isCheckboxQuesEmail = false;
isCheckboxQuesSms = false;
isCheckboxQuesInsite = false;
isCheckboxQuesPhone = false;
newContentAll = false;
isCheckboxNewEmail = false;
isCheckboxNewSms = false;
isCheckboxNewInsite = false;
isCheckboxNewPhone = false;
challengeAll = false;
isCheckboxChalEmail = false;
isCheckboxChalSms = false;
isCheckboxChalInsite = false;
isCheckboxChalPhone = false;
communityAll = false;
iscommunityEmail = false;
iscommunityInsite = false;
treatmentAll = false;
isCheckboxtreatmentEmail = false;
isCheckboxtreatmentSms = false;
isCheckboxtreatmentInsite = true;
isCheckboxtreatmentPhone = false;
accountName;
	// Variable Declaration
	userId = ID;
	communityUrl = COMMUNITY_IMG;
	newContentUrl = NEW_CONTENT_IMG;
	symptomsUrl = SYMPTOMS_IMG;
	challengeUrl = CHALLENGE_IMG;
	questionnaireUrl = QUESTIONNAIRE_IMG;
	treatmentUrl = TREATMENT_IMG;
	// To fetch the Account IDs
	connectedCallback() {
	loadStyle(this, CHECK_BOX_ICON);
	}
	@wire(GET_USER_ACCOUNT_ID)
	wiredAccId({ data, error }) {
		try {
			// Null data is checked and AuraHandledException is thrown from the Apex
			if (data) {
				this.accountName = data[0].id;
				this.treatmentFunction(this.accountName);
				this.challengeFunction(this.accountName);
				this.symptomFunction(this.accountName);
				this.questionFunction(this.accountName);
				this.newContentFunction(this.accountName);
				this.communityFunction(this.accountName);
			}
			else if (error) {
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);//Catching Potential error 1
			}
		}
		catch (err) {
			this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);//Catching Potential error 2
		}
	}
	// To fetch the TREATMENT type records from Notification Settings object
	treatmentFunction(accidname) {
		UPDATE_RECENT_NOTIFY({ accId: accidname, type: TREATMENT })
		// Null data is checked and AuraHandledException is thrown from the Apex
			.then(data => {
				this.isCheckboxtreatmentEmail = data[0].BI_PSP_Email__c;
				this.isCheckboxtreatmentSms = data[0].BI_PSP_SMS__c
				this.isCheckboxtreatmentInsite = true;
				this.isCheckboxtreatmentPhone = data[0].BI_PSP_Phone__c;
				if (this.isCheckboxtreatmentEmail === true || this.isCheckboxtreatmentSms === true || this.isCheckboxtreatmentInsite === true || this.isCheckboxtreatmentPhone === true) {
					this.treatmentAll = true;
				}
				else {
					this.treatmentAll = false;
				}
			})
			.catch(error => {
				// Handle any errors that occur within the try block
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);

			})
	}
	// To fetch the Questionnaire records from Notification Settings object
	questionFunction(accidname) {
		UPDATE_RECENT_NOTIFY({ accId: accidname, type: QUESTIONNAIRES })
		// Null data is checked and AuraHandledException is thrown from the Apex
			.then(data => {
				this.isCheckboxQuesEmail = data[0].BI_PSP_Email__c;
				this.isCheckboxQuesSms = data[0].BI_PSP_SMS__c
				this.isCheckboxQuesInsite = data[0].BI_PSP_Insite_Notification__c;
				this.isCheckboxQuesPhone = data[0].BI_PSP_Phone__c;
				if (this.isCheckboxQuesEmail === true ||this.isCheckboxQuesSms === true || this.isCheckboxQuesInsite === true || this.isCheckboxQuesPhone === true) {
					this.questionAll = true;
				}
				else {
					this.questionAll = false;
				}
			})
			.catch(error => {
				// Handle any errors that occur within the try block
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);

			})
	}
	// To fetch the Symptom Tracker records from Notification Settings object
	symptomFunction(accidname) {
		UPDATE_RECENT_NOTIFY({ accId: accidname, type: SYMPTOM })
		// Null data is checked and AuraHandledException is thrown from the Apex
			.then(data => {

				this.isCheckboxSympEmail = data[0].BI_PSP_Email__c;
				this.isCheckboxSympSms = data[0].BI_PSP_SMS__c
				this.isCheckboxSympInsite = data[0].BI_PSP_Insite_Notification__c;
				this.isCheckboxSympPhone = data[0].BI_PSP_Phone__c;
				if (this.isCheckboxSympEmail === true || this.isCheckboxSympSms === true || this.isCheckboxSympInsite === true || this.isCheckboxSympPhone === true) {
					this.symptomAll = true;
				}
				else {
					this.symptomAll = false;
				}
			})
			.catch(error => {
				// Handle any errors that occur within the try block
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);

			})
	}
	// To fetch the Challenges records from Notification Settings object
	challengeFunction(accidname) {
		UPDATE_RECENT_NOTIFY({ accId: accidname, type: CHALLENGES })
		// Null data is checked and AuraHandledException is thrown from the Apex
			.then(data => {

				this.isCheckboxChalEmail = data[0].BI_PSP_Email__c;
				this.isCheckboxChalSms = data[0].BI_PSP_SMS__c
				this.isCheckboxChalInsite = data[0].BI_PSP_Insite_Notification__c;
				this.isCheckboxChalPhone = data[0].BI_PSP_Phone__c;
				if (this.isCheckboxChalEmail === true || this.isCheckboxChalSms === true || this.isCheckboxChalInsite === true || this.isCheckboxChalPhone === true) {
					this.challengeAll = true;
				}
				else {
					this.challengeAll = false;
				}
			})
			.catch(error => {
				// Handle any errors that occur within the try block
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);

			})

	}
	// To fetch the Community records from Notification Settings object
	communityFunction(accidname) {
		UPDATE_RECENT_NOTIFY({ accId: accidname, type: COMMUNITY })
		// Null data is checked and AuraHandledException is thrown from the Apex
			.then(data => {

				this.iscommunityEmail = data[0].BI_PSP_Email__c;
				this.iscommunityInsite = data[0].BI_PSP_Insite_Notification__c;
				if (this.iscommunityEmail === true || this.iscommunityInsite === true) {
					this.communityAll = true;
				}
				else {
					this.communityAll = false;
				}
			})
			.catch(error => {
				// Handle any errors that occur within the try block
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);

			})
	}
	// To fetch the Information center records from Notification Settings object
	newContentFunction(accidname) {
		UPDATE_RECENT_NOTIFY({ accId: accidname, type: NEW_CONTENT })
		// Null data is checked and AuraHandledException is thrown from the Apex
			.then(data => {

				this.isCheckboxNewEmail = data[0].BI_PSP_Email__c;
				this.isCheckboxNewSms = data[0].BI_PSP_SMS__c
				this.isCheckboxNewInsite = data[0].BI_PSP_Insite_Notification__c;
				this.isCheckboxNewPhone = data[0].BI_PSP_Phone__c;
				if (this.isCheckboxNewEmail === true || this.isCheckboxNewSms === true || this.isCheckboxNewInsite === true || this.isCheckboxNewPhone === true) {
					this.newContentAll = true;
				}
				else {
					this.newContentAll = false;
				}
			})
			.catch(error => {
				// Handle any errors that occur within the try block
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);

			})

	}
	// To trigger the Check box for Symptom Tracker
	sympCheckboxChange(event) {
		const checkBox = event.target;
		const label = checkBox.label;
		if (label === EMAIL) {
			this.isCheckboxSympEmail = checkBox.checked;
		} else if (label === SMS) {
			this.isCheckboxSympSms = checkBox.checked;
		} else if (label === INSITE) {
			this.isCheckboxSympInsite = checkBox.checked;
		}
		else if (label === PHONE) {
			this.isCheckboxSympPhone = checkBox.checked;
		}

		// Check the toggle switch if all checkBoxes are checked.
		if (this.isCheckboxSympEmail || this.isCheckboxSympSms || this.isCheckboxSympInsite || this.isCheckboxSympPhone) {
			this.symptomAll = true;
		} else {
			this.symptomAll = false;
		}
	}
	// To trigger the toggle for Symptom Tracker 
	handleSwitchChangeSymp(event) {
		this.symptomAll = event.target.checked;

		// If the toggle switch is checked, check all the checkBoxes.
		if (this.symptomAll) {
			this.isCheckboxSympEmail = true;
			this.isCheckboxSympSms = true;
			this.isCheckboxSympInsite = true;
			this.isCheckboxSympPhone = true;

		} else {
			// Otherwise, uncheck all the checkBoxes.
			this.isCheckboxSympEmail = false;
			this.isCheckboxSympSms = false;
			this.isCheckboxSympPhone = false;

		}
	}
	// To trigger the Check box for Articles
	NewCheckboxChange(event) {
		const checkBox = event.target;
		const label = checkBox.label;
		if (label === EMAIL) {
			this.isCheckboxNewEmail = checkBox.checked;
		} else if (label === SMS) {
			this.isCheckboxNewSms = checkBox.checked;
		} else if (label === INSITE) {
			this.isCheckboxNewInsite = checkBox.checked;
		}
		else if (label === PHONE) {
			this.isCheckboxNewPhone = checkBox.checked;
		}
		if (this.isCheckboxNewEmail || this.isCheckboxNewSms || this.isCheckboxNewInsite || this.isCheckboxNewPhone) {
			this.newContentAll = true;
		} else {
			this.newContentAll = false;
		}
	}
	// To trigger the toggle for Articles
	handleSwitchChangeNew(event) {
		this.newContentAll = event.target.checked;

		// If the toggle switch is checked, check all the checkBoxes.
		if (this.newContentAll) {
			this.isCheckboxNewEmail = true;
			this.isCheckboxNewSms = true;
			this.isCheckboxNewInsite = true;
			this.isCheckboxNewPhone = true;

		} else {
			// Otherwise, uncheck all the checkBoxes.
			this.isCheckboxNewEmail = false;
			this.isCheckboxNewSms = false;
			this.isCheckboxNewPhone = false;

		}
	}
	// To trigger the Check box for Community
	ComCheckboxChange(event) {
		const checkBox = event.target;
		const label = checkBox.label;
		if (label === EMAIL) {
			this.iscommunityEmail = checkBox.checked;

		} else if (label === INSITE) {
			this.iscommunityInsite = checkBox.checked;

		}
		if (this.iscommunityEmail || this.iscommunityInsite) {
			this.communityAll = true;
		} else {
			this.communityAll = false;
		}
	}
	// To trigger the toggle for Community
	handleSwitchChangeCommunity(event) {
		this.communityAll = event.target.checked;

		// If the toggle switch is checked, check all the checkBoxes.
		if (this.communityAll) {
			this.iscommunityEmail = true;
			this.iscommunityInsite = true;

		} else {
			// Otherwise, uncheck all the checkBoxes.
			this.iscommunityEmail = false;
			

		}
	}






	// To trigger the Check box for QUESTIONNAIRES
	QuesCheckboxChange(event) {
		const checkBox = event.target;
		const label = checkBox.label;
		if (label === EMAIL) {
			this.isCheckboxQuesEmail = checkBox.checked;
		} else if (label === SMS) {
			this.isCheckboxQuesSms = checkBox.checked;
		} else if (label === INSITE) {
			this.isCheckboxQuesInsite = checkBox.checked;
		}
		else if (label === PHONE) {
			this.isCheckboxQuesPhone = checkBox.checked;
		}


		if (this.isCheckboxQuesEmail || this.isCheckboxQuesSms || this.isCheckboxQuesInsite || this.isCheckboxQuesPhone) {
			this.questionAll = true;
		} else {
			this.questionAll = false;
		}
	}
	// To trigger the toggle for QUESTIONNAIRES
	handleSwitchChangeQues(event) {
		this.questionAll = event.target.checked;

		// If the toggle switch is checked, check all the checkBoxes.
		if (this.questionAll) {
			this.isCheckboxQuesEmail = true;
			this.isCheckboxQuesSms = true;
			this.isCheckboxQuesInsite = true;
			this.isCheckboxQuesPhone = true;

		} else {
			// Otherwise, uncheck all the checkBoxes.
			this.isCheckboxQuesEmail = false;
			this.isCheckboxQuesSms = false;
			this.isCheckboxQuesPhone = false;


		}
	}
	// To trigger the Check box for Challenges
	ChalCheckboxChange(event) {
		const checkBox = event.target;
		const label = checkBox.label;
		if (label === EMAIL) {
			this.isCheckboxChalEmail = checkBox.checked;
		} else if (label === SMS) {
			this.isCheckboxChalSms = checkBox.checked;
		} else if (label === INSITE) {
			this.isCheckboxChalInsite = checkBox.checked;
		}
		else if (label === PHONE) {
			this.isCheckboxChalPhone = checkBox.checked;
		}


		if (this.isCheckboxChalEmail || this.isCheckboxChalSms || this.isCheckboxChalInsite || this.isCheckboxChalPhone) {
			this.challengeAll = true;
		} else {
			this.challengeAll = false;
		}
	}
	// To trigger the toggle for Challenges
	handleSwitchChangeChal(event) {
		this.challengeAll = event.target.checked;

		// If the toggle switch is checked, check all the checkBoxes.
		if (this.challengeAll) {
			this.isCheckboxChalEmail = true;
			this.isCheckboxChalSms = true;
			this.isCheckboxChalInsite = true;
			this.isCheckboxChalPhone = true;

		} else {
			// Otherwise, uncheck all the checkBoxes.
			this.isCheckboxChalEmail = false;
			this.isCheckboxChalSms = false;
			
			this.isCheckboxChalPhone = false;

		}
	}
	// To trigger the Check box for Treatment Reminders
	tretCheckboxChange(event) {
		const checkBox = event.target;
		const label = checkBox.label;
		if (label === EMAIL) {
			this.isCheckboxtreatmentEmail = checkBox.checked;
		} else if (label === SMS) {
			this.isCheckboxtreatmentSms = checkBox.checked;
		} else if (label === PHONE) {
			this.isCheckboxtreatmentPhone = checkBox.checked;
		}

		// Check the toggle switch if all checkBoxes are checked.
		if (this.isCheckboxtreatmentEmail || this.isCheckboxtreatmentSms || this.isCheckboxtreatmentInsite || this.isCheckboxtreatmentPhone) {
			this.treatmentAll = true;
		} else {
			this.treatmentAll = false;
		}
	}
	// To trigger the toggle for Treatment Reminders
	handleSwitchChangetreat(event) {
		this.treatmentAll = event.target.checked;

		// If the toggle switch is checked, check all the checkBoxes.
		if (this.treatmentAll) {
			this.isCheckboxtreatmentEmail = true;
			this.isCheckboxtreatmentSms = true;
			this.isCheckboxtreatmentPhone = true;

		} else {
			// Otherwise, uncheck all the checkBoxes.
			this.isCheckboxtreatmentEmail = false;
			this.isCheckboxtreatmentSms = false;
			this.isCheckboxtreatmentPhone = false;

		}
	}
	// To update the captured notification settings in Notification Settings object
	updateFunc({accids, type, email, sms, insite, phone}){


		let caseUpdate = {
			typeValue: type,
			emailValue: email,
			smsValue: sms,
			insiteValue: insite,
			phoneValue: phone,

		};

		UPDATE_NOTIFY({ accId: accids, wrapper: caseUpdate })
		// Null data is checked and AuraHandledException is thrown from the Apex
			.then(() => {
			
			})
			.catch(error => {
				// Handle any errors that occur within the try block
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			})
	}
	//To Save the changes in notification settings
	// handleSave() {
	// 	this.updateFunc(this.accountName, TREATMENT, this.isCheckboxtreatmentEmail, this.isCheckboxtreatmentSms, true, this.isCheckboxtreatmentPhone);
	// 	this.updateFunc(this.accountName, SYMPTOM, this.isCheckboxSympEmail, this.isCheckboxSympSms, this.isCheckboxSympInsite, this.isCheckboxSympPhone);
	// 	this.updateFunc(this.accountName, QUESTIONNAIRES, this.isCheckboxQuesEmail, this.isCheckboxQuesSms, this.isCheckboxQuesInsite, this.isCheckboxQuesPhone);
	// 	this.updateFunc(this.accountName, CHALLENGES, this.isCheckboxChalEmail, this.isCheckboxChalSms, this.isCheckboxChalInsite, this.isCheckboxChalPhone);
	// 	this.updateFunc(this.accountName, NEW_CONTENT, this.isCheckboxNewEmail, this.isCheckboxNewSms, this.isCheckboxNewInsite, this.isCheckboxNewPhone);
	// 	this.updateFunc(this.accountName, COMMUNITY, this.iscommunityEmail, '', this.iscommunityInsite, '')
	// }
		handleSave() {
    this.updateFunc({ accids: this.accountName, type: TREATMENT, email: this.isCheckboxtreatmentEmail, sms: this.isCheckboxtreatmentSms, insite: true, phone: this.isCheckboxtreatmentPhone });
    this.updateFunc({ accids: this.accountName, type: SYMPTOM, email: this.isCheckboxSympEmail, sms: this.isCheckboxSympSms, insite: this.isCheckboxSympInsite, phone: this.isCheckboxSympPhone });
    this.updateFunc({ accids: this.accountName, type: QUESTIONNAIRES, email: this.isCheckboxQuesEmail, sms: this.isCheckboxQuesSms, insite: this.isCheckboxQuesInsite, phone: this.isCheckboxQuesPhone });
    this.updateFunc({ accids: this.accountName, type: CHALLENGES, email: this.isCheckboxChalEmail, sms: this.isCheckboxChalSms, insite: this.isCheckboxChalInsite, phone: this.isCheckboxChalPhone });
    this.updateFunc({ accids: this.accountName, type: NEW_CONTENT, email: this.isCheckboxNewEmail, sms: this.isCheckboxNewSms, insite: this.isCheckboxNewInsite, phone: this.isCheckboxNewPhone });
    this.updateFunc({ accids: this.accountName, type: COMMUNITY, email: this.iscommunityEmail, sms: '', insite: this.iscommunityInsite, phone: '' });
}
	//This showToast is used for error 
	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}
}