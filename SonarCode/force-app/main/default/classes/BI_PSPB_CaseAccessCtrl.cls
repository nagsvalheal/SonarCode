public with sharing class BI_PSPB_CaseAccessCtrl {
    private static string accessReq = System.Label.BI_PSPB_AccAccessReq;
    @AuraEnabled
    public static void createAccessCase() {
    try {
      // This class will be utilized only for the logged in user. So, definitely the Name and Email fields will not be null. Hence, the strings are not validated for isBlank or isNotBlank
      String currentUserName = UserInfo.getName();
      String currentUserEmail = UserInfo.getUserEmail();
      User currentUser = [
      SELECT Id, Name, Email, BI_PSPB_Caregiver__c
      FROM User
      WHERE Name = :currentUserName AND Email = :currentUserEmail
      WITH USER_MODE
      LIMIT 1
      ];
      //We are using SOQL to get the User details because we need a custom field from User.
      // List to store related accounts
      /* If the user is a caregiver, retrieve related
      accounts based on BI_PSPB_Selected_Patient_ID__c*/
      List<Account> relatedAccounts = new List<Account>();
      if (currentUser.BI_PSPB_Caregiver__c == true) {
      /* If the user is a caregiver, retrieve related
        accounts based on BI_PSPB_Selected_Patient_ID__c*/
      List<Account> selectedPatientAccounts = [
        SELECT Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c
        FROM Account
        WHERE
        Name = :currentUserName
        AND PersonEmail = :currentUserEmail
        AND IsPersonAccount = TRUE
        AND BI_PSPB_Selected_Patient_ID__c != NULL
        WITH USER_MODE
      ];
      if (!selectedPatientAccounts.isEmpty()) {
        relatedAccounts = [
        SELECT Id, Name, PersonEmail
        FROM Account
        WHERE
        Id = :selectedPatientAccounts[0].BI_PSPB_Selected_Patient_ID__c
        WITH USER_MODE
        ];
            
      }
      } else {
      // If the user is not a caregiver,
      //retrieve accounts directly related to the user
      relatedAccounts = [
        SELECT Id, Name, PersonEmail
        FROM Account
        WHERE PersonEmail = :currentUserEmail AND Name = :currentUserName
        WITH USER_MODE
      ];
            
      }
      Id recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName()
      .get(BI_PSPB_ProfileManagerConstCtrl.caseRecordType)
      .getRecordTypeId();
      List<Case> casesToInsert = new List<Case>();
      if (!relatedAccounts.isEmpty() && String.isNotBlank(recordTypeId)) {
      // Create a new Case record
      for (Account relatedAccount : relatedAccounts) {
        Case newCase = new Case();
        newCase.Subject = accessReq;
        newCase.Description = accessReq;
        newCase.BI_PSP_Type__c = accessReq;
        newCase.Priority = BI_PSPB_ProfileManagerConstCtrl.medium;
        // Assign the case to the specified owner (the logged-in user)
        newCase.OwnerId = currentUser.Id;
        newCase.AccountId = relatedAccount.Id;
        newCase.RecordTypeId = recordTypeId;
        casesToInsert.add(newCase);
      }
      if (!casesToInsert.isEmpty()) {
        Database.SaveResult[] saveResults = Database.insert(
        casesToInsert,
        false,
        AccessLevel.USER_MODE
        );
        for (Database.SaveResult saveResult : saveResults) {
        if (!saveResult.isSuccess()) {
          // Handle the error
          for (Database.Error error : saveResult.getErrors()) {
            BI_PSPB_ProfileManagerConstCtrl.errorMsg +=
            'Error ' +
            error.getFields() +
            '--' +
            error.getMessage() +
            '\n';
          }
        }
        }
        if (String.isNotBlank(BI_PSPB_ProfileManagerConstCtrl.errorMsg)) {
        BI_SFCOE_LOG_Util.handleDatabaseSaveResults(
          saveResults,
          BI_PSPB_CaseCtrl.class.toString(),
          System.now()
        );
        throw new AuraHandledException(BI_PSPB_ProfileManagerConstCtrl.insertError);
        }
      }
      } else {
        BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.accountMessage,BI_PSPB_CaseAccessCtrl.class.toString(),FALSE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
      } //End if (!relatedAccounts.isEmpty() && String.isNotBlank(recordTypeId))
    } catch (Exception ex) {
      BI_SFCOE_LOG_Util.handleException(
      ex,
      BI_PSPB_ProfileManagerConstCtrl.applicationName,
      BI_PSPB_CaseCtrl.class.toString(),
      null,
      System.now()
      );
      throw new AuraHandledException(BI_PSPB_ProfileManagerConstCtrl.insertError);
    }
    }
    
    
    @AuraEnabled(cacheable=true)
public static Case checkboxPersonalAccess(String relatedAccounts) {
    Case caseRecord = null;
    try {
        if (String.isNotBlank(relatedAccounts)) {
            List<Case> caseRecords = [
                SELECT Id, BI_PSP_Personal_Information_Request__c, BI_PSP_Account_Deletion_Request__c
                FROM Case
                WHERE AccountId = :relatedAccounts
                AND BI_PSP_Type__c = :accessReq
                WITH USER_MODE
                ORDER BY CreatedDate DESC
                LIMIT 1
            ];
            
            if (!caseRecords.isEmpty()) {
                caseRecord = caseRecords[0];
            } else {
                BI_SFCOE_LOG_Util.logMessage(
                    BI_PSPB_ProfileManagerConstCtrl.applicationName,
                    BI_PSPB_CaseCtrl.class.toString(),
                    '',
                    System.now(),
                    BI_PSPB_ProfileManagerConstCtrl.caseAccess,
                    BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
            }
        } else {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.accountMessage,BI_PSPB_ProfileManagerCtrl.class.toString(),FALSE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }
    } catch (Exception ex) {
        BI_SFCOE_LOG_Util.handleException(
            ex,
            BI_PSPB_ProfileManagerConstCtrl.applicationName,
            BI_PSPB_CaseCtrl.class.toString(),
            null,
            System.now()
        );
        throw new AuraHandledException(BI_PSPB_ProfileManagerConstCtrl.caseAccess);
    }
    return caseRecord;
}

}