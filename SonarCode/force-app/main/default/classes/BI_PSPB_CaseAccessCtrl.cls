/**
@description Case creation for account deletion request and account access request by patients
History:
Version    Author               Date              Detail         Description
1.0        Divya Bharathi S     6-Dec-2023        Created        Initial development
1.1        Divya Bharathi S     08-Apr-2024       Updated        Add null check
1.2        Divya Bharathi S     18-Apr-2024       Updated        Add Log
*/
public with sharing class BI_PSPB_CaseAccessCtrl {

    /**
    @description This method creates a case for account access based on the user's role.
    This method is used in biPspbPatientProfiledetails and biPspbCgPatientinfo LWC component.
    */
    @AuraEnabled
public static void createAccessCase() {
    try {
        String currentUserName = UserInfo.getName();
        String currentUserEmail = UserInfo.getUserEmail();

        User currentUser = getCurrentUser(currentUserName, currentUserEmail);
        List<Account> relatedAccounts = getRelatedAccounts(currentUser, currentUserName, currentUserEmail);

        if (relatedAccounts.isEmpty()) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.accountMessage, BI_PSPB_ProfileManagerCtrl.class.toString(),TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }

        Id recordTypeId = getCaseRecordTypeId();
        List<Case> casesToInsert = createCases(relatedAccounts, currentUser.Id, recordTypeId);

        if (!casesToInsert.isEmpty()) {
            saveCases(casesToInsert);
        }

    } catch (Exception ex) {
        BI_PSPB_LogUtilities.exceptionLogMessage(BI_PSPB_ProfileManagerConstCtrl.insertError,BI_PSPB_CaseAccessCtrl.class.toString(),ex);
        
    }
}

private static User getCurrentUser(String currentUserName, String currentUserEmail) {
    // Define query parameters
    String sObjectType = 'User';
    String userName='currentUserName';
    String userEmail='currentUserEmail';
    String fields = 'Id, Name, Email, BI_PSPB_Caregiver__c';
    String conditions = 'Name = \'' + userName + 
                        '\' AND Email = \'' + userEmail + '\'';
    Boolean withUserMode = true; // Set to true to enforce sharing rules
    
    // Execute the query using the common query method
    List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
    // Return the first User or null if no user was found
    return results.isEmpty() ? null : (User)results[0];
}


private static List<Account> getRelatedAccounts(User currentUser, String currentUserName, String currentUserEmail) {
    List<Account> relatedAccounts = new List<Account>();

    // Define the sObjectType and withUserMode parameter
    String sObjectType = 'Account';
    Boolean withUserMode = true;

    if (currentUser.BI_PSPB_Caregiver__c) {
        // Define query fields and conditions for the first query
        String fields = 'Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c';
        String conditions = 'Name = \'' + currentUserName + 
                            '\' AND PersonEmail = \'' + currentUserEmail + 
                            '\' AND IsPersonAccount = TRUE AND BI_PSPB_Selected_Patient_ID__c != NULL';

        // Execute the first query
        List<SObject> result = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Check if results are returned and execute the second query if needed
        if (!result.isEmpty()) {
            Account selectedPatientAccount = (Account)result[0];
            String selectedPatientId = (String)selectedPatientAccount.BI_PSPB_Selected_Patient_ID__c;

            // Define fields and conditions for the second query
            fields = 'Id, Name, PersonEmail';
            conditions = 'Id = \'' + selectedPatientId + '\'';

            // Execute the second query
            relatedAccounts = (List<Account>)BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
        }
    } else {
        // Define query fields and conditions for the else case
        String fields = 'Id, Name, PersonEmail';
        String conditions = 'PersonEmail = \'' + currentUserEmail + 
                            '\' AND Name = \'' + currentUserName + '\'';

        // Execute the query
        relatedAccounts = (List<Account>)BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    }

    return relatedAccounts;
}


private static Id getCaseRecordTypeId() {
    Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get(BI_PSPB_ProfileManagerConstCtrl.caseRecordType).getRecordTypeId();
    if (String.isBlank(recordTypeId)) {
        BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.insertError, BI_PSPB_ProfileManagerCtrl.class.toString(),TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
    }
    return recordTypeId;
}

private static List<Case> createCases(List<Account> relatedAccounts, Id ownerId, Id recordTypeId) {
    List<Case> casesToInsert = new List<Case>();

    for (Account relatedAccount : relatedAccounts) {
        Case newCase = new Case();
        newCase.Subject = BI_PSPB_ProfileManagerConstCtrl.accessReq;
        newCase.Description = BI_PSPB_ProfileManagerConstCtrl.accessReq;
        newCase.BI_PSP_Type__c = BI_PSPB_ProfileManagerConstCtrl.accessReq;
        newCase.Priority = BI_PSPB_ProfileManagerConstCtrl.medium;
        newCase.OwnerId = ownerId;
        newCase.AccountId = relatedAccount.Id;
        newCase.RecordTypeId = recordTypeId;
        casesToInsert.add(newCase);
    }

    return casesToInsert;
}

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
        BI_PSPB_LogUtilities.logError(BI_PSPB_ProfileManagerConstCtrl.insertError, BI_PSPB_CaseAccessCtrl.class.toString());

    }
}


    /**
     * @description Retrieves the checkbox values for a given case record.
     *              This method is used in biPspbPatientProfiledetails and biPspbCgPatientinfo LWC components.
     * @param relatedAccounts The Id of the related account.
     * @return The Case record containing checkbox values if found; otherwise, null.
     */
    @AuraEnabled(cacheable=true)
public static Case checkboxPersonalAccess(String relatedAccounts) {
    Case caseRecord = null; // Initialize to null
    try {
        // Check if relatedAccounts is blank and log error if necessary
        if (String.isBlank(relatedAccounts)) {
            BI_PSPB_LogUtilities.logError(
                BI_PSPB_ProfileManagerConstCtrl.caseAccess, 
                BI_PSPB_CaseAccessCtrl.class.toString()
            );
            return null; // Return null if relatedAccounts is blank
        }
    
        // Define query parameters
        String sObjectType = 'Case';
        String fields = 'Id, BI_PSP_Personal_Information_Request__c, BI_PSP_Account_Deletion_Request__c';
        String conditions = 'AccountId = \'' + relatedAccounts +
                            '\' AND BI_PSP_Type__c = \'' + BI_PSPB_ProfileManagerConstCtrl.accessReq + '\'';
        Boolean withUserMode = true;
    
        // Execute the query using the common query method
        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
        // Process results
        if (!results.isEmpty()) {
            caseRecord = (Case)results[0];
        } else {
            // Log an error if no Case record is found
            BI_PSPB_LogUtilities.logError(
                BI_PSPB_ProfileManagerConstCtrl.caseAccess, 
                BI_PSPB_CaseAccessCtrl.class.toString()
            );
        }
    
    } catch (Exception ex) {
        // Log any exceptions
        BI_PSPB_LogUtilities.exceptionLogMessage(
            BI_PSPB_ProfileManagerConstCtrl.caseAccess, 
            BI_PSPB_CaseAccessCtrl.class.toString(), 
            ex
        );
    }
    return caseRecord;
}
}