/**
@description Case creation for account deletion request and account access request by patients
History:
Version    Author               Date              Detail         Description
1.0        Divya Bharathi S     6-Dec-2023        Created        Initial development
1.1        Divya Bharathi S     08-Apr-2024       Updated        Add null check
1.2        Divya Bharathi S     18-Apr-2024       Updated        Add Log
*/
public with sharing class BI_PSPB_CaseAccessCtrl {

    private static String caseRecordType = System.Label.BI_PSPB_RecordTypeForCase;
    private static String accessReq = System.Label.BI_PSPB_AccAccessReq;
    private static String medium = System.Label.BI_PSPB_PriorityMed;
    private static String insertError = System.label.BI_PSPB_InsertError;
    private static String errorMsg = '';
    private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues('PSPB');
    private static String applicationName = settings != null ? settings.BI_SFCOE_LOG_Application__c : '';
    private static String accountMessage = System.label.BI_PSP_RecordNotFoundMsg;
    private static String caseAccess = System.label.BI_PSPB_CaseAccessError;

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
            throw new AuraHandledException(accountMessage);
        }

        Id recordTypeId = getCaseRecordTypeId();
        List<Case> casesToInsert = createCases(relatedAccounts, currentUser.Id, recordTypeId);

        if (!casesToInsert.isEmpty()) {
            saveCases(casesToInsert);
        }

    } catch (Exception ex) {
        BI_PSPB_LogUtilities.exceptionLogMessage(insertError,BI_PSPB_CaseAccessCtrl.class.toString(),ex);
        
    }
}

private static User getCurrentUser(String currentUserName, String currentUserEmail) {
    return [SELECT Id, Name, Email, BI_PSPB_Caregiver__c
            FROM User
            WHERE Name = :currentUserName AND Email = :currentUserEmail
            WITH USER_MODE
            LIMIT 1];
}

private static List<Account> getRelatedAccounts(User currentUser, String currentUserName, String currentUserEmail) {
    List<Account> relatedAccounts = new List<Account>();

    if (currentUser.BI_PSPB_Caregiver__c) {
        List<Account> selectedPatientAccounts = [SELECT Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c
                                                 FROM Account
                                                 WHERE Name = :currentUserName
                                                 AND PersonEmail = :currentUserEmail
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

private static Id getCaseRecordTypeId() {
    Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName().get(caseRecordType).getRecordTypeId();
    if (String.isBlank(recordTypeId)) {
        throw new AuraHandledException(insertError);
    }
    return recordTypeId;
}

private static List<Case> createCases(List<Account> relatedAccounts, Id ownerId, Id recordTypeId) {
    List<Case> casesToInsert = new List<Case>();

    for (Account relatedAccount : relatedAccounts) {
        Case newCase = new Case();
        newCase.Subject = accessReq;
        newCase.Description = accessReq;
        newCase.BI_PSP_Type__c = accessReq;
        newCase.Priority = medium;
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
        BI_PSPB_LogUtilities.logError(insertError, BI_PSPB_CaseAccessCtrl.class.toString());

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
        Case caseRecord;
        try {
           
            // Check if relatedAccounts is blank and log error if necessary
            if (String.isBlank(relatedAccounts)) {
                BI_PSPB_LogUtilities.logError(caseAccess, BI_PSPB_CaseAccessCtrl.class.toString());
            }
    
            // Retrieve the Case record
            caseRecord = [SELECT Id, BI_PSP_Personal_Information_Request__c, BI_PSP_Account_Deletion_Request__c
                               FROM Case
                               WHERE AccountId = :relatedAccounts
                               AND BI_PSP_Type__c = :accessReq
                               WITH USER_MODE
                               ORDER BY CreatedDate DESC
                               LIMIT 1];
    
            // Return the Case record if found; otherwise, log error and return null
            if (caseRecord == null) {
                BI_PSPB_LogUtilities.logError(caseAccess, BI_PSPB_CaseAccessCtrl.class.toString());
                return null;
            }
    
    
        } catch (Exception ex) {
            BI_PSPB_LogUtilities.exceptionLogMessage(caseAccess, BI_PSPB_CaseAccessCtrl.class.toString(),ex);
        }
        return caseRecord;
    }    
}