/**
 * @description Controller class for updating patient and caregiver information.
 * This class contains methods for updating lead records and caregiver records.
 * History
 * Version 	Author		Date			Detail		Description
 * 1.0		Sowmitha	30-July-2024	Created		Refactored code
 */
public without sharing class BI_PSPB_PatientEntityCtrl {
    /**
	 * @description Updates the Lead record with the provided information from the LeadWrapper.
	 * This method updates the lead's contact and address information and logs consent.
	 *
	 * @param leadWrapper A LeadWrapper object containing the updated lead information.
	 */
	@AuraEnabled(cacheable=false)
	public static void updateLeadRecord(LeadWrapper leadWrapper) {
		//We are not checking LeadWrapper because all fields are mandatory in UI.
		try {
			// This is regarding to guestuser so can't use User_mode.
			Lead leadToUpdate = new Lead();
			String fields = 'Id,Phone,BI_PSPB_Preferred_Communication_Method__c,Country,State,City,Street,PostalCode';
			String conditions = 'Id = \'' + leadWrapper.leadId + '\''+
								'LIMIT 1';
			Boolean withSharingKeywrd = false;
			List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Lead', fields, conditions, withSharingKeywrd);
			for (SObject sObj : sObjectResponses) {
				leadToUpdate = (Lead) sObjectResponses[0];
			}

			if (leadToUpdate != null) {
				leadToUpdate.Phone = leadWrapper.phone;
				leadToUpdate.BI_PSPB_Preferred_Communication_Method__c = leadWrapper.prefferedMethodOfCom;
				leadToUpdate.CountryCode = leadWrapper.country;
				leadToUpdate.StateCode = leadWrapper.state;
				leadToUpdate.City = leadWrapper.city;
				leadToUpdate.Street = leadWrapper.street;
				leadToUpdate.PostalCode = leadWrapper.zipCode;
				BI_PSP_Lead_Consent__c leadConsentToInsert = new BI_PSP_Lead_Consent__c(
					BI_PSP_Lead__c = leadToUpdate.Id,
					BI_PSP_I_agree__c = true,
					BI_PSPB_Consent_Category__c = BI_PSPB_EnrollmentConstantCtrl.patient,
					BI_PSPB_Conversion__c = true
				);

				BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(new List<Lead>{ leadToUpdate },BI_PSPB_PatientEntityCtrl.class.toString(),false);
				BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(new List<BI_PSP_Lead_Consent__c>{ leadConsentToInsert },BI_PSPB_PatientEntityCtrl.class.toString(),false);
			} else {
				BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.errorMsgRecordNotFound,BI_PSPB_PatientEntityCtrl.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.LOG_SEVERITY_ERROR);
			}
		} catch (Exception ex) {
			BI_PSPB_LogUtilities.exceptionLogMessage(BI_PSPB_EnrollmentConstantCtrl.recordCannotFound,BI_PSPB_PatientEntityCtrl.class.getName(),ex);
		}
	}
	/**
	 * @description Updates the Lead Caregiver record with the preferred method of communication and inserts a new Lead Consent record.
	 * @param leadId The Id of the Lead Caregiver to update.
	 * @param preferredMethodofCommunication The preferred method of communication for the Lead Caregiver.
	 */

	@AuraEnabled(cacheable=false)
	public static void updateLead(
		String leadId,
		String preferredMethodofCommunication
	) {
		try {
			if (
				String.isBlank(leadId) ||
				String.isBlank(preferredMethodofCommunication)
			) {
				BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.errorMsgRecordNotFound,BI_PSPB_PatientEntityCtrl.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.LOG_SEVERITY_ERROR);
			}
			// Update Lead Caregiver
			// This is regarding to guestuser so can't use User_mode.
			String fields = 'Id,BI_PSPB_Preferred_Communication_Method__c,BI_PSPB_Lead__c';
			String conditions = 'BI_PSPB_Lead__c = \'' + leadId + '\''+
								'LIMIT 1';
			Boolean withSharingKeywrd = false;
			BI_PSPB_Lead_Caregiver__c leadCaregiverToUpdate = new BI_PSPB_Lead_Caregiver__c(); 
			List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Lead_Caregiver__c', fields, conditions, withSharingKeywrd);
			for (SObject sObj : sObjectResponses) {
				leadCaregiverToUpdate = (BI_PSPB_Lead_Caregiver__c) sObjectResponses[0];
			}
			if (leadCaregiverToUpdate != null) {
				// Insert Lead Consent
				BI_PSP_Lead_Consent__c leadConsentToInsert = new BI_PSP_Lead_Consent__c();
				leadConsentToInsert.BI_PSP_Lead__c = leadCaregiverToUpdate.BI_PSPB_Lead__c;
				leadCaregiverToUpdate.BI_PSPB_Preferred_Communication_Method__c = preferredMethodofCommunication;
				leadConsentToInsert.BI_PSPB_Consent_Category__c = BI_PSPB_EnrollmentConstantCtrl.caregiver;
				BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(new List<BI_PSPB_Lead_Caregiver__c>{ leadCaregiverToUpdate },BI_PSPB_PatientEntityCtrl.class.toString(),false);
				BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(new List<BI_PSP_Lead_Consent__c>{ leadConsentToInsert },BI_PSPB_PatientEntityCtrl.class.toString(),false);
			}
		} catch (Exception ex) {
			BI_PSPB_LogUtilities.exceptionLogMessage(BI_PSPB_EnrollmentConstantCtrl.recordCannotFound,BI_PSPB_PatientEntityCtrl.class.getName(),ex);
		}
	}

	/**
	 * @description Wrapper class for Lead information.
	 * This class holds the data related to a Lead, including contact details and address.
	 */
	public class LeadWrapper {

		/**
		 * @description The unique identifier for the Lead.
		 */
		@AuraEnabled
		public String leadId { get; set; }

		/**
		 * @description The phone number of the Lead.
		 */
		@AuraEnabled
		public String phone { get; set; }

		/**
		 * @description The preferred method of communication for the Lead.
		 */
		@AuraEnabled
		public String prefferedMethodOfCom { get; set; }

		/**
		 * @description The country where the Lead is located.
		 */
		@AuraEnabled
		public String country { get; set; }

		/**
		 * @description The state where the Lead is located.
		 */
		@AuraEnabled
		public String state { get; set; }

		/**
		 * @description The city where the Lead is located.
		 */
		@AuraEnabled
		public String city { get; set; }

		/**
		 * @description The street address of the Lead.
		 */
		@AuraEnabled
		public String street { get; set; }

		/**
		 * @description The zip code of the Lead's address.
		 */
		@AuraEnabled
		public String zipCode { get; set; }
	}

}