/**
 * @description This class is used for setting up, fetching the username for the community.
 * History:
 * Version  Author      Date            Detail          Description
 * 1.0      Deepa       05-Dec-2023     Created         Initial development.
 * 1.1      Deepa       20-Jan-2024     Updated         Updated for caregiver.
 * 1.2      Deepa       04-Apr-2024     Updated         Catch log added.
 * 1.3      Deepa       22-Apr-2024     Updated         Code Review.
 * 1.4      Deepa       27-Apr-2024     Updated         Updated for KO.
 */
public with sharing class BI_PSPB_FeedUsernameCtrl {
  /**
    * @description	To check the username for community already exists.
    * @return		Boolean Returns true , if there is a username already.
            Returns false when there is no username.
            Returns boolean value to biPspbCreatPost,biPspbMyPost,
            biPspbAllPost,biPspbNavBar LWC.
    */
    @AuraEnabled
    public static Boolean checkCommunityUsername() {
      //Enrollee cpeRecord;
      CareProgramEnrollee cpeRecord;
      try {
        String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
        if (String.isBlank(cpeId)) {
          // Logging an error if Enrollee ID is blank.
          BI_PSP_LogMessagesUtility.logError(
            BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
            BI_PSPB_FeedUsernameCtrl.class.toString(),true
          );
        }
          cpeRecord = [
            SELECT Id, BI_PSP_CommunityUsername__c
            FROM CareProgramEnrollee
            WHERE Id = :cpeId
            LIMIT 1];
        if (
          cpeRecord != null &&
          cpeRecord.BI_PSP_CommunityUsername__c != null
        ) {
          // Returning true when BI_PSP_CommunityUsername__c is not null.
          return true;
        } else {
          // Returning false when BI_PSP_CommunityUsername__c is null.
          return false;
        }
      } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetUsername,
          BI_PSPB_FeedUsernameCtrl.class.toString(),
          ex
        );
        return false; // Return false in case of an exception
      }
    }
    /**
    * @description	Retrieves the CommunityUsername for a user.
    * @return		CareProgramEnrollee - The CareProgramEnrollee record containing the 
            CommunityUsername, or null if not found.
            Returns to biPspbChatterUsername LWC.
    */
    @AuraEnabled
    public static Account getCommunityUsername() {
      Account accountRecord;
      try {
        // Getting the CareProgramEnrollee ID associated with the user ID.
        String accountId = BI_PSP_CurrentUser.returnTheAccounts()[0].Id;
        if (String.isBlank(accountId)) {
          // Throwing an exception when account ID is blank.
          BI_PSP_LogMessagesUtility.exceptionLogMessage(
            BI_PSPB_CommunityConstantCtrl.errorWhileGetAccountId,
            BI_PSPB_FeedUsernameCtrl.class.toString(),
            null
          );
        }
          // Query for CareProgramEnrollee to get the CommunityUsername.
          accountRecord = [
            SELECT
              Id,
              FirstName,
              LastName,
              PersonEmail,
              Phone
            FROM Account
            WHERE Id = :accountId
            LIMIT 1
          ];
        
      } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetUsername,
          BI_PSPB_FeedUsernameCtrl.class.toString(),
          ex
        );
      }
      /** Here 'cpeRecord' is not checked for null exception as 
          it is handled in LWC.
          There are two different scenario such as it takes an action when 
          it is returned as null and another action when it is returned with values.
      */
      return accountRecord;
    }
    /**
    * @description	Creates a CommunityUsername for the specified
            user if it doesn't exist.
    * @param		username - The username to insert.
    This method is used in biPspbChatterUsername LWC.
    */
    @AuraEnabled
    public static void insertCommunityUsername(string username) {
      try {
        CareProgramEnrollee cpeRecord;
        if (String.isBlank(username)) {
          // Throwing an exception when user ID is blank.
          BI_PSP_LogMessagesUtility.exceptionLogMessage(
            BI_PSPB_CommunityConstantCtrl.errorWhileGetUsername,
            BI_PSPB_FeedUsernameCtrl.class.toString(),
            null
          );
        }
        // Getting the CareProgramEnrollee ID associated with the user ID.
        String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
          if (String.isBlank(cpeId)) {
            // Throwing an exception when account ID is blank.
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
              BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
              BI_PSPB_FeedUsernameCtrl.class.toString(),
              null
            );
          }
            // Query for CareProgramEnrollee to get the CommunityUsername.
            cpeRecord = [
              SELECT
                Id,
                BI_PSP_CommunityUsername__c
              FROM CareProgramEnrollee
              WHERE Id = :cpeId
              LIMIT 1
            ];
            // Updating the CommunityUsername field with the provided username.
            // Here CareProgramEnrolleeRecord cannot be null when cpeId is not null.
            cpeRecord.BI_PSP_CommunityUsername__c = username;
            // Updating the CareProgramEnrollee record.
            BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(
              new List<CareProgramEnrollee>{ cpeRecord },
              BI_PSPB_FeedUsernameCtrl.class.toString(),true
            );
          
        
      } catch (System.DmlException ex) {
        BI_PSP_LogMessagesUtility.catchSystemException(
          BI_PSPB_CommunityConstantCtrl.errorWhileCreatingUsername,
          BI_PSPB_FeedUsernameCtrl.class.toString(),
          ex
        );
      }
    }
  }