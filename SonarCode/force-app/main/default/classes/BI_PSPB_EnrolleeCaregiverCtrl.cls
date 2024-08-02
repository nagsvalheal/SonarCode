public class BI_PSPB_EnrolleeCaregiverCtrl {
    @AuraEnabled
public static Id createEnroleeCaregiver(
    String patientId,
    String firstName,
    String email
) {
    if (String.isBlank(patientId) || String.isBlank(firstName) || String.isBlank(email)) {
        BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
    }

    List<Id> cgList = new List<Id>();

    try {
        // Query the CareProgramEnrollee record by Id
        String enrolleeFields = 'Id, AccountId';
        String enrolleeConditions = 'Id = \'' + patientId + '\'';
        List<SObject> enrolleeRecords = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', enrolleeFields, enrolleeConditions, false);

        if (enrolleeRecords.isEmpty()) {
             BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }
        
        CareProgramEnrollee enrollee = (CareProgramEnrollee) enrolleeRecords[0];

        // Query the Contact record by email
        String contactFields = 'Id, Email';
        String contactConditions = 'Email = \'' + email + '\'';
        List<SObject> contactRecords = BI_PSP_CommonQueryUtility.executeQuery('Contact', contactFields, contactConditions, false);

        if (contactRecords.isEmpty()) {
           BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);  throw new AuraHandledException(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound);
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
        cgList = BI_PSPB_HandleUtitlites.insertAndHandleErrors(new List<SObject>{ caregiverToInsert }, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(),false);

        if (cgList.isEmpty()) {
             BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }

    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), ex);
        
    }

    return cgList[0];
}


}