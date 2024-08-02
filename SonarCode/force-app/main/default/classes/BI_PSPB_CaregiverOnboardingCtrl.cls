/*
@description This class facilitates the creation of caregiver community users.
It eures that caregiver users are created for specific account types and associates them with the appropriate profiles.
Reason for using whithout sharing lead converted can only be accessed by admin user and can't be accessed by external users
This apex is invoked the flow
History:
Version    Author               Date              Detail         Description
1.0        Nandha	     		8-1-2024          Created        Initial development

*/
public without sharing class BI_PSPB_CaregiverOnboardingCtrl {
 @AuraEnabled
    public static Id createCaregiverRecord(DataWrapper newCaregiver) {
        if (newCaregiver == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_ProfileManagerCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }

        List<Id> conList = new List<Id>();
        List<Id> cgList = new List<Id>();
        
        try {
            // Create a new Contact record
            Id recordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByName().get('caregiver').getRecordTypeId();
            Contact contactToInsert = new Contact(
                FirstName = newCaregiver.firstName,
                LastName = newCaregiver.lastName,
                BI_PSPB_Relationship_To_Patient__c = newCaregiver.relation,
                Email = newCaregiver.email,
                BI_PSP_Birthdate__c = Date.valueOf(newCaregiver.dob),
                Phone = newCaregiver.phone,
                RecordTypeId = recordTypeId
            );
            
            conList = BI_PSPB_HandleUtitlites.insertAndHandleErrors(new List<SObject>{ contactToInsert }, BI_PSPB_CaregiverOnboardingCtrl.class.toString(),false);
            
            // Query the CareProgramEnrollee record by Id
            String fields = 'Id, AccountId';
            String conditions = 'Id = \'' + newCaregiver.caregiverId + '\'';
            List<SObject> enrolleeRecords = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, false);
            
            if (!enrolleeRecords.isEmpty()) {
                CareProgramEnrollee enrollee = (CareProgramEnrollee) enrolleeRecords[0];
                
                // Create a new BI_PSPB_Enrollee_Caregiver__c record
                BI_PSPB_Enrollee_Caregiver__c caregiverToInsert = new BI_PSPB_Enrollee_Caregiver__c(
                    Name = contactToInsert.FirstName, // Adjust as needed
                    BI_PSPB_Care_Program_Enrollee__c = enrollee.Id,
                    BI_PSPB_Patient__c = enrollee.AccountId,
                    BI_PSPB_Contact_Id__c = contactToInsert.Id
                );
                
                cgList = BI_PSPB_HandleUtitlites.insertAndHandleErrors(new List<SObject>{ caregiverToInsert }, BI_PSPB_CaregiverOnboardingCtrl.class.toString(),false);
            } else {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_CaregiverOnboardingCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
            }
            
            if (conList.isEmpty()) {
                 BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_CaregiverOnboardingCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
            }

            } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSPB_CaregiverOnboardingCtrl.class.toString(), ex);
        
    }
        return conList[0];
    }
    
    /* @description  Wrapper classes are used to hold a group of related data fields together.used to createLead,
                caregiverCreate,hcpCreate,prescriptionrCreate,consentCreate,createCaregiverRecord.
* @param        firstname The new first name of the patient or caregiver.
* @param        lastname The new last name of the patient or caregiver.
* @param        email The new email address of the patient or caregiver.
* @param        dob The new birthdate of the patient or caregiver.
* @param        sex The new gender of the patient or caregiver.
* @param        lisence The new lisence for the practictioner.
* @param        street The new street address of the patient or caregiver.
* @param        city The new city of the patient or caregiver.
* @param        state The new state of the patient or caregiver.
* @param        country The new country of the patient or caregiver.
* @param        postalCode The new postal code of the patient or caregiver.
* @param        phone The new phone number of the patient or caregiver.
* @param  		relation The new relationwithPatient to the Patient.
* @param        drug The new drug select from the Healthcare provider.
* @param        unit The new unit of the drug which select from healthcare provider.
* @param        frequency The new frequency of the drug select from healthcare provider. 
* @param      	caregiverId this ID is used to query the caregiver record.
*/
    public class DataWrapper {
        @AuraEnabled
        public String firstName { get; set; }
        @AuraEnabled
        public String lastName { get; set; }
        @AuraEnabled
        public String email { get; set; }
        @AuraEnabled
        public String phone { get; set; }
        @AuraEnabled
        public String dob { get; set; }
        @AuraEnabled
        public String relation { get; set; }
       
        @AuraEnabled
        public String caregiverId { get; set; }
    }

}