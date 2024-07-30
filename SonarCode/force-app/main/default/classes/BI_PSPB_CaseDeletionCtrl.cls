/*
@description Case creation for account deletion request and account access request by patients
History:
Version    Author               Date              Detail         Description
1.0        Divya Bharathi S     6-Dec-2023        Created        Initial development
1.1        Divya Bharathi S     08-Apr-2024       Updated        Add null check
1.2        Divya Bharathi S     18-Apr-2024       Updated        Add Log
*/
public with sharing class BI_PSPB_CaseDeletionCtrl {

    private static String caseRecordType = System.Label.BI_PSPB_RecordTypeForCase;
    private static String deletionReq = System.Label.BI_PSPB_AccDeletionReq;
    private static String high = System.Label.BI_PSPB_PriorityHigh;
    private static String insertError = System.label.BI_PSPB_InsertError;
    private static String errorMsg = '';
    private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues('PSPB');
    private static String applicationName = settings != null ? settings.BI_SFCOE_LOG_Application__c : '';
    private static String accountMessage = System.label.BI_PSP_RecordNotFoundMsg;
    private static String caseDelete = System.label.BI_PSPB_CaseRequestError;

    /*
    @description This method creates a case for account deletion based on the user's role.
    This method is used in biPspbPatientProfiledetails and biPspbCgPatientinfo LWC component.
    */

//     @description Creates a Case record for the current user based on related accounts.
//                The method checks if the current user is a caregiver and retrieves related accounts accordingly.
//               It then creates and inserts Case records for each related account.
//   @throws AuraHandledException If there are any errors during the Case creation process.
    @AuraEnabled
public static void createCase() {
    try {
        String currentUserName = UserInfo.getName();
        String currentUserEmail = UserInfo.getUserEmail();

        User currentUser = getCurrentUser(currentUserName, currentUserEmail);
        List<Account> relatedAccounts = getRelatedAccounts(currentUser, currentUserName, currentUserEmail);

        if (relatedAccounts.isEmpty()) {
            throw new AuraHandledException(accountMessage);
        }

        Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get(caseRecordType).getRecordTypeId();
        if (String.isBlank(recordTypeId)) {
            throw new AuraHandledException(insertError);
        }

        List<Case> casesToInsert = createCases(relatedAccounts, currentUser.Id, recordTypeId);

        if (!casesToInsert.isEmpty()) {
            saveCases(casesToInsert);
        }

    } catch (Exception ex) {
        BI_PSPB_LogUtilities.exceptionLogMessage(insertError, BI_PSPB_CaseDeletionCtrl.class.toString(),ex);
    }
}
//  @description Retrieves the current user record based on the user's name and email.
//   @param currentUserName The name of the current user.
//   @param currentUserEmail The email of the current user.
//   @return The User record of the current user.

private static User getCurrentUser(String currentUserName, String currentUserEmail) {
    return [SELECT Id, Name, Email, BI_PSPB_Caregiver__c
            FROM User
            WHERE Name = :currentUserName AND Email = :currentUserEmail
            WITH USER_MODE
            LIMIT 1];
}
//  @description Retrieves the related accounts for the current user. If the user is a caregiver, it retrieves the selected patient account.
//               Otherwise, it retrieves the accounts matching the user's email and name.
//  @param currentUser The current user record.
//  @param currentUserName The name of the current user.
//  @param currentUserEmail The email of the current user.
//  @return A list of related Account records.

private static List<Account> getRelatedAccounts(User currentUser, String currentUserName, String currentUserEmail) {
    List<Account> relatedAccounts = new List<Account>();

    if (currentUser.BI_PSPB_Caregiver__c) {
        List<Account> selectedPatientAccounts = [SELECT Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c
                                                 FROM Account
                                                 WHERE Name = :currentUserName AND PersonEmail = :currentUserEmail
                                                 AND IsPersonAccount = TRUE
                                                 AND BI_PSPB_Selected_Patient_ID__c != NULL
                                                 WITH USER_MODE];
        if (!selectedPatientAccounts.isEmpty()) {
            relatedAccounts = [SELECT Id, Name, PersonEmail
                               FROM Account
                               WHERE Id = :selectedPatientAccounts[0].BI_PSPB_Selected_Patient_ID__c
                               WITH USER_MODE];
        }
    } else {
        relatedAccounts = [SELECT Id, Name, PersonEmail
                           FROM Account
                           WHERE PersonEmail = :currentUserEmail AND Name = :currentUserName
                           WITH USER_MODE];
    }

    return relatedAccounts;
}
//  @description Creates a list of Case records for the related accounts.
//  @param relatedAccounts The list of related accounts.
//  @param ownerId The owner Id for the Case records.
//  @param recordTypeId The record type Id for the Case records.
//  @return A list of Case records to be inserted.

private static List<Case> createCases(List<Account> relatedAccounts, Id ownerId, Id recordTypeId) {
    List<Case> casesToInsert = new List<Case>();

    for (Account relatedAccount : relatedAccounts) {
        Case newCase = new Case();
        newCase.Subject = deletionReq;
        newCase.Description = deletionReq;
        newCase.BI_PSP_Type__c = deletionReq;
        newCase.Status = '';
        newCase.Origin = '';
        newCase.Priority = high;
        newCase.AccountId = relatedAccount.Id;
        newCase.OwnerId = ownerId;
        newCase.RecordTypeId = recordTypeId;
        casesToInsert.add(newCase);
    }

    return casesToInsert;
}

//   @description Saves the list of Case records and handles any errors that occur during the save operation.
//   @param casesToInsert The list of Case records to be inserted.
//   @throws AuraHandledException If there are any errors during the save operation.
 
private static void saveCases(List<Case> casesToInsert) {
    Database.SaveResult[] saveResults = Database.insert(casesToInsert, false, AccessLevel.USER_MODE);

    String errorMsg = '';
    for (Database.SaveResult saveResult : saveResults) {
        if (!saveResult.isSuccess()) {
            for (Database.Error error : saveResult.getErrors()) {
                errorMsg += 'Error ' + error.getFields() + '--' + error.getMessage() + '\n';
            }
        }
    }

    if (String.isNotBlank(errorMsg)) {
        BI_PSPB_LogUtilities.logError(insertError, BI_PSPB_CaseDeletionCtrl.class.toString());
    }
}

    /*
    @description Retrieves the checkbox values for a given case record.
    This method is used in biPspbPatientProfiledetails and biPspbCgPatientinfo LWC component.
    @param accountId The Id of the related account.
    @return The Case record containing checkbox values.
    */
    @AuraEnabled(cacheable=true)
    public static Case checkboxAccountDeletion(String relatedAccounts) {
        Case casesRecord;
        try {
          
            if (String.isNotBlank(relatedAccounts)) {
                casesRecord = [SELECT Id, BI_PSP_Personal_Information_Request__c, BI_PSP_Account_Deletion_Request__c
                               FROM Case
                               WHERE AccountId = :relatedAccounts AND BI_PSP_Type__c = :deletionReq
                               WITH USER_MODE
                               ORDER BY CreatedDate DESC
                               LIMIT 1];
            } else {
                BI_SFCOE_LOG_Util.logMessage(applicationName, BI_PSPB_CaseCtrl_Deletion.class.toString(), '', System.now(), caseDelete, BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR);
            }

            if (casesRecord != null) {
                return casesRecord;
            } else {
                BI_SFCOE_LOG_Util.logMessage(applicationName, BI_PSPB_CaseCtrl_Deletion.class.toString(), '', System.now(), caseDelete, BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR);
                return null;
            }
        } catch (Exception ex) {
            BI_PSPB_LogUtilities.exceptionLogMessage(caseDelete, BI_PSPB_CaseCtrl_Deletion.class.toString(),ex);
        }
        return casesRecord;
    }
}