//This lightning web component is used to select the patient for Caregiver
//to Import the Libraries
import { LightningElement, track, wire } from "lwc";
// import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//to Import the UserId
import ID from "@salesforce/user/Id";
//to Import the Apex Class
import CAREGIVER_ACCOUNTS from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver";
import USER_CAREGIVER from "@salesforce/apex/BI_PSP_UpdateNotificationCtrl.userCaregiverPost";
import CHECK_CAREGIVER_PATIENT_STATUS from "@salesforce/apex/BI_PSPB_AvatarCtrl.checkCaregiverPatientStatus";
import UPDATE_SELECTED_PATIENTID from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.updateSwitchSelectedPatientID";
import NAME_FIELD from "@salesforce/schema/User.Name";
//To import the Custom Labels
import UNASSIGNEDSITE_URL from "@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl";
import BRANDEDSITE_URL from "@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import UNASSIGNED from "@salesforce/label/c.BI_PSP_Unassigned";
import ACUTE from "@salesforce/label/c.BI_PSPB_Acute";
import ACUTE_DASHBOARD from "@salesforce/label/c.BI_PSPB_AcuteDashboard";
import DASHBOARD from "@salesforce/label/c.BI_PSPB_Dashboad";
import CAREGIVER_AVATAR_SELECTION from "@salesforce/label/c.BI_PSPB_CaregiverFirstAvatar";
import ACCESS_BLOCKED from "@salesforce/label/c.BI_PSPB_AccessBlocked";
import CAREGIVER_ACCESS from "@salesforce/label/c.BI_PSPB_CaregiverAccess";
import ACTIVE from "@salesforce/label/c.BI_PSP_Active";

export default class BiPspbCaregiverPostLogin extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//Declaration of varaiable with @track
	@track showDetails = false;
	@track showMessage = false;
	@track messageHeader = "";
	@track messageBody = "";
	@track selectedAccountId = "";
	@track cargiverId = "";
	@track Status;
	
	@track showSpinner = false;
	@track caregiverAccounts = [];
	//Declaration of varaiable
	statusMap = new Map();
	status;
	loginAttempt;
	getFieldValue;
	userId = ID;

	user;

	get name() {
		return this.getFieldValue(this.user.data, NAME_FIELD);
	}

	//To fetch the data from caregivers patient
	@wire(CAREGIVER_ACCOUNTS, { userId: "$userId", isActive: false })
	wiredCaregiverAccounts({ error, data }) {
		// Null data is checked and AuraHandledException is thrown from the Apex
		if (data) {
			try {
				this.caregiverAccounts = data.map((patient) => ({
					Id: patient.BI_PSPB_Patient__c,
					Name: patient.BI_PSPB_Patient__r.Name,
					status: patient.BI_PSPB_Status__c,
					login: patient.BI_PSP_Loginattempt__c,
					caregiverId: patient.BI_PSPB_Caregiver__c,
					initial:
						patient?.BI_PSPB_Patient__r.Name?.split(" ").map((name) => name[0]).length >= 2
							? (
								patient.BI_PSPB_Patient__r.Name.split(" ").map((name) => name[0])[0] +
								patient.BI_PSPB_Patient__r.Name.split(" ").map((name) => name[0])[1]
							).toUpperCase()
							: patient.BI_PSPB_Patient__r.Name.split(" ")
								.map((name) => name[0])[0]
								.toUpperCase(),
					showSelectButton: patient.BI_PSPB_Status__c === ACTIVE,
					showBlockMessage: patient.BI_PSPB_Status__c !== ACTIVE,
					blockMessageHeader: ACCESS_BLOCKED,
					blockMessageBody: CAREGIVER_ACCESS
				}));

			} catch (err) {
				this.showToast(ERROR_MESSAGE, err.body.message, ERROR_VARIANT);

			}
		} else if (error) {
			this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);

		}
	}


	handleViewDetails(event) {
		this.selectedAccountId = event.target.dataset.id;
		this.cargiverId = this.caregiverAccounts[0]?.caregiverId;
		this.showSpinner = true;
		// update the
		UPDATE_SELECTED_PATIENTID({
			userId: this.cargiverId,
			selectedAccountId: this.selectedAccountId,
			check: true

		})
			// Null data is checked and AuraHandledException is thrown from the Apex
			// Use newAvatarSrc
			.then(() => {
				
				this.caregiverfunc();
			})
			.catch((error) => {
				// Handle error or show an error message
				this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT);
			});

	}
	caregiverfunc() {
		// Null data is checked and AuraHandledException is thrown from the Apex
		USER_CAREGIVER()
			.then((result) => {
				if (result && result.length > 0) {
					this.loginAttempt = result[0].BI_PSP_Loginattempt__c;
					CHECK_CAREGIVER_PATIENT_STATUS()
						// Null data is checked and AuraHandledException is thrown from the Apex
						.then((patientStatusResult) => {
							if (patientStatusResult && patientStatusResult.length > 0) {
								this.status = patientStatusResult[0].BI_PSPB_PatientStatus__c;
								if (this.loginAttempt === 0) {
									window.location.assign(BRANDEDSITE_URL + CAREGIVER_AVATAR_SELECTION);
								} else if (
									this.loginAttempt === 1 &&
									this.status === UNASSIGNED
								) {
									window.location.assign(UNASSIGNEDSITE_URL);
								} else if (this.loginAttempt === 1 && this.status === ACUTE) {
									window.location.assign(UNASSIGNEDSITE_URL + ACUTE_DASHBOARD);
								} else {
									window.location.assign(BRANDEDSITE_URL + DASHBOARD);
								}
							}
						})
						.catch((patientStatusError) => {
							this.showToast(
								ERROR_MESSAGE,
								patientStatusError.message,
								ERROR_VARIANT
							);

						});
				}
			})
			.catch((error) => {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);

			});
	}
	//This ShowToast Message is used for get error
	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}
}