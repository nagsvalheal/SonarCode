/**
 * @description The Id of the CareProgramEnrollee to which the caregiver will be linked.
 */
public class BI_PSPB_EnrolleeCaregiverCtrl {

    /**
     * @description Creates a new Enrollee Caregiver record by linking a contact to a CareProgramEnrollee.
     * @param patientId The Id of the CareProgramEnrollee.
     * @param firstName The first name of the caregiver.
     * @param email The email address of the caregiver.
     * @return Id of the newly created BI_PSPB_Enrollee_Caregiver__c record.
     */
    @AuraEnabled
    public static Id createEnroleeCaregiver(String patientId, String firstName, String email) {
        if (String.isBlank(patientId) || String.isBlank(firstName) || String.isBlank(email)) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
            return null; // Return null if any parameter is blank
        }

        List<Id> cgList = new List<Id>();

        try {
            // Query the CareProgramEnrollee record by Id
            String enrolleeFields = 'Id, AccountId';
            String enrolleeConditions = 'Id = \'' + patientId + '\'';
            List<SObject> enrolleeRecords = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', enrolleeFields, enrolleeConditions, false);

            if (enrolleeRecords.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
                return null; // Return null if enrollee record is not found
            }

            CareProgramEnrollee enrollee = (CareProgramEnrollee) enrolleeRecords[0];

            // Query the Contact record by email
            String contactFields = 'Id, Email';
            String contactConditions = 'Email = \'' + email + '\'';
            List<SObject> contactRecords = BI_PSP_CommonQueryUtility.executeQuery('Contact', contactFields, contactConditions, false);

            if (contactRecords.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
                throw new AuraHandledException(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound); // Throw an exception if contact record is not found
            }

            Contact contactValue = (Contact) contactRecords[0];

            // Create a new BI_PSPB_Enrollee_Caregiver__c record
            BI_PSPB_Enrollee_Caregiver__c caregiverToInsert = new BI_PSPB_Enrollee_Caregiver__c(
                Name = firstName,
                BI_PSPB_Care_Program_Enrollee__c = enrollee.Id,
                BI_PSPB_Patient__c = enrollee.AccountId,
                BI_PSPB_Contact_Id__c = contactValue.Id
            );

            // Insert the BI_PSPB_Enrollee_Caregiver__c record
            cgList = BI_PSPB_HandleUtitlites.insertAndHandleErrors(new List<SObject>{ caregiverToInsert }, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false);

            if (cgList.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
                return null; // Return null if caregiver insertion fails
            }

        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), ex);
            return null; // Return null if an exception occurs
        }

        return cgList[0];
    }
}