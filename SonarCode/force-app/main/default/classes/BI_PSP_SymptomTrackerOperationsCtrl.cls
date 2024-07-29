/**
 * @description This class provides functionality for getLastCareTemplate  getLastEntryDate for Symptom Tracker module.
 * @history
 * Version    Author           Date           Detail    Description
 * 1.0        Karthikeyan      23-Jul-2024    Created   Initial development.
 */
public with sharing class BI_PSP_SymptomTrackerOperationsCtrl {
  /**
 * @description Retrieves the last entry date for a specific patient from the Symptom Tracker.
 *              The method queries the `BI_PSP_Symptom_Tracker__c` object for the most recent entry date
 *              associated with the provided patient account ID. It returns the date of the most recent
 *              entry or logs an error if the account ID is blank or no entries are found.
 * @param accountId - The ID of the patient account for which the last entry date is being retrieved.
 * @return Date - The most recent entry date for the specified patient. Returns null if no entries are found
 *                 or if an error occurs.
 */
  @AuraEnabled(cacheable=true)
  public static Date getLastEntryDate(String accountId) {
    try {
      if (String.isBlank(accountId)) {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerConstantCtrl.patientErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        Date entryDate;
       /* List<BI_PSP_Symptom_Tracker__c> results = [
          SELECT BI_PSP_EditEntrydates__c
          FROM BI_PSP_Symptom_Tracker__c
          WHERE BI_PSP_Patient__c = :accountId
          WITH USER_MODE
          ORDER BY BI_PSP_EditEntrydates__c
        ];*/
		 String queryString =
        ' SELECT BI_PSP_EditEntrydates__c FROM BI_PSP_Symptom_Tracker__c WHERE BI_PSP_Patient__c = \'' +
        accountId +
        '\' WITH USER_MODE ORDER BY BI_PSP_EditEntrydates__c';

      List<BI_PSP_Symptom_Tracker__c> results = BI_PSP_CommonQueryUtility.executeWholeQueryInString(
        queryString
      );
        if (!results.isEmpty()) {
          entryDate = results[0].BI_PSP_EditEntrydates__c;
        }

        if (entryDate != null) {
          return entryDate;
        } else {
          BI_PSP_LogMessagesUtility.logError(
            BI_PSP_SymptomTrackerConstantCtrl.error,
            BI_PSP_SymptomTrackerCtrl.class.toString(),
            true
          );
        }
      }
    } catch (Exception ex) {
      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerConstantCtrl.patientErrorMsg,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        true
      );
    }
    return null;
  }

  /**
                
                                @description    Retrieves the last 10 CarePlanTemplate records
                                        USER_MODE cannot be implemented here, as it is querying health cloud object.
                
                                @return         last 10 record return .This return values pass to bipspbiPspbSymptomTracker this components 
                
                
                                */

  @AuraEnabled(cacheable=true)
  public static List<HealthCloudGA__CarePlanTemplate__c> getLastCareTemplate() {
    try {
     /* List<HealthCloudGA__CarePlanTemplate__c> results = [
        SELECT Id, BI_PSP_Symptom_image__c, Name, RecordTypeId
        FROM HealthCloudGA__CarePlanTemplate__c
        WHERE
          RecordType.Name = :BI_PSP_SymptomTrackerConstantCtrl.symptomRecordType
        ORDER BY CreatedDate DESC
        LIMIT 10
      ]; */
		 String queryString =
        ' SELECT Id, BI_PSP_Symptom_image__c, Name, RecordTypeId FROM HealthCloudGA__CarePlanTemplate__c WHERE RecordType.Name =: \'' +
        BI_PSP_SymptomTrackerConstantCtrl.symptomRecordType +
        '\' ORDER BY CreatedDate DESC LIMIT 10';

      List<HealthCloudGA__CarePlanTemplate__c> results = BI_PSP_CommonQueryUtility.executeWholeQueryInString(
        queryString
      );
      // Log the number of records retrieved
      if (!results.isEmpty()) {
        return results;
      } else {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerConstantCtrl.error,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      }
    } catch (Exception ex) {
      // Log the exception

      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerConstantCtrl.error,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        true
      );
      // Return an empty list in case of exception
    }
    return new List<HealthCloudGA__CarePlanTemplate__c>();
  }

  /**
 * Uploads files as `ContentVersion` records and returns the IDs of the associated `ContentDocument` records.
 * 
 * @description This method creates `ContentVersion` records for the uploaded files, associating them with the specified parent record. Note that USER_MODE cannot be implemented here due to querying Health Cloud objects.
 * 
 * @param fileContents - A list of base64-encoded strings representing the file contents to be uploaded. Each string is decoded and saved as a `ContentVersion` record.
 * @param parentId - The ID of the parent record (e.g., a `BI_PSP_Symptom_Tracker__c` record) to which the `ContentVersion` records will be associated.

 * 
 * @return List<String> - A list of IDs of the `ContentDocument` records associated with the uploaded files. These IDs can be passed to other components or processes as needed.
 */
  @AuraEnabled
  public static List<String> saveFiles(
    List<String> fileContents,
    String parentId
  ) {
    List<String> contentDocumentIds = new List<String>();

    try {
      if (fileContents.isEmpty() || String.isBlank(parentId)) {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerConstantCtrl.applicationPhotoMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      }
      // Create ContentVersion records
      List<ContentVersion> contentVersionsToInsert = new List<ContentVersion>();
      for (String fileContent : fileContents) {
        Blob fileBlob = EncodingUtil.base64Decode(fileContent);

        ContentVersion contentVersion = new ContentVersion();
        contentVersion.VersionData = fileBlob;
        contentVersion.Title = BI_PSP_SymptomTrackerConstantCtrl.fileNamePath;
        contentVersion.PathOnClient = BI_PSP_SymptomTrackerConstantCtrl.fileName;
        contentVersion.FirstPublishLocationId = parentId;

        contentVersionsToInsert.add(contentVersion);
      }

      BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
        contentVersionsToInsert,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        false
      );
      // Retrieve the IDs of the inserted ContentVersion records
    } catch (Exception ex) {
      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerConstantCtrl.applicationPhotoMsg,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        true
      );
    }

    return contentDocumentIds;
  }

  /** 
                
                                @description      uploaded files as ContentVersion records.
                                @param           fileIds photos upload 
                                @param           symptomTrackerId 
                
                                */

  // Creates ContentDocumentLink records to link files to Symptom Tracker records.
  @AuraEnabled(cacheable=true)
  public static void createContentDocumentLinks(
    List<String> fileIds,
    Id symptomTrackerId
  ) {
    try {
      if (fileIds.isEmpty() || String.isBlank(symptomTrackerId)) {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        // Delete existing ContentDocumentLink records for the specified entity
      /*  List<ContentDocumentLink> existingLinks = [
          SELECT Id
          FROM ContentDocumentLink
          WHERE LinkedEntityId = :symptomTrackerId
          WITH USER_MODE
        ]; */
           String queryString =
        'SELECT Id FROM ContentDocumentLink  WHERE LinkedEntityId = \'' +
        symptomTrackerId +
        '\'  WITH USER_MODE';

      List<ContentDocumentLink> existingLinks = BI_PSP_CommonQueryUtility.executeWholeQueryInString(
        queryString
      );
          BI_PSP_DatabaseOperationsUtility.deleteHandleErrors(
        existingLinks ,
        BI_PSP_SymptomTrackerOperationsCtrl.class.toString()
      );

        List<ContentDocumentLink> fileLinks = new List<ContentDocumentLink>();
        if (fileIds != null) {
          for (String fileId : fileIds) {
            ContentDocumentLink link = new ContentDocumentLink();
            link.ContentDocumentId = fileId;
            link.LinkedEntityId = symptomTrackerId;
            link.ShareType = 'I'; // 'I' represents Inferred permission
            fileLinks.add(link);
          }

          BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
            fileLinks,
            BI_PSP_SymptomTrackerCtrl.class.toString(),
            false
          );
        }
      }
    } catch (System.DmlException ex) {
      BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        ex
      );
    }
  }

  /**
                
                                @description    Deletes ContentDocumentLink records linked to Symptom Tracker records.
                                @param         symptomTrackerId  details based on the provided user ID
                                */

  @AuraEnabled
  public static void deleteContentDocumentLinks(Id symptomTrackerId) {
    try {
      if (String.isBlank(symptomTrackerId)) {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        // Query for the first ContentDocumentLink related to the symptomTrackerId
       /* List<ContentDocumentLink> linksToDelete = [
          SELECT Id
          FROM ContentDocumentLink
          WHERE LinkedEntityId = :symptomTrackerId
          LIMIT 1
        ];*/
		 String queryString =
        'SELECT Id, FROM ContentDocumentLink WHERE LinkedEntityId = \'' +
        symptomTrackerId +
        '\' LIMIT 1';

       List<ContentDocumentLink> linksToDelete = BI_PSP_CommonQueryUtility.executeWholeQueryInString(
        queryString
      );
        BI_PSP_DatabaseOperationsUtility.deleteHandleErrors(
          linksToDelete,
          BI_PSP_SymptomTrackerCtrl.class.toString()
        );
      }
    } catch (System.DmlException ex) {
      BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSP_SymptomTrackerConstantCtrl.applicationPhotoMsg,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        ex
      );
    }
  }

  /**
                                @description      Retrieves details of the latest Symptom Tracker record for a CareProgramEnrollee.
                                            USER_MODE cannot be implemented here, as it is querying health cloud object.
                                @param          careProgramEnrolleeId  
                                @return         This return values pass to bipspbiPspbSymptomTracker this components 
                                */

  @AuraEnabled(cacheable=true)
  public static Map<String, Object> getSymptomTrackerDetails(
    Id careProgramEnrolleeId
  ) {
    try {
      if (String.isBlank(careProgramEnrolleeId)) {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerConstantCtrl.careProgramErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        // Debug log to check the value of careProgramEnrolleeId

        // Query the most recent record based on the given careProgramEnrolleeId and status not 'inactive'
      /*  BI_PSP_Symptom_Tracker__c record = [
          SELECT Id, BI_PSP_EditEntrydates__c, LastModifiedDate
          FROM BI_PSP_Symptom_Tracker__c
          WHERE
            BI_PSP_Care_Program_Enrollee__c = :careProgramEnrolleeId
            AND BI_PSP_Symptom_Staus__c != :BI_PSP_SymptomTrackerConstantCtrl.inActiveRecord
          ORDER BY LastModifiedDate DESC
          LIMIT 1
        ]; */
            // Define the parameters for the query
      String sObjectType = 'BI_PSP_Symptom_Tracker__c';
      String fields = 'Id, BI_PSP_EditEntrydates__c, LastModifiedDate';
      String conditions = 'BI_PSP_Care_Program_Enrollee__c = \'' +careProgramEnrolleeId +
        '\' AND BI_PSP_Symptom_Staus__c != \'' +BI_PSP_SymptomTrackerConstantCtrl.inActiveRecord +
        '\'  ORDER BY LastModifiedDate DESC LIMIT 1 ';
      Boolean withUserMode = false;

      List<BI_PSP_Symptom_Tracker__c> record = BI_PSP_CommonQueryUtility.executeQuery(
        sObjectType,
        fields,
        conditions,
        withUserMode
      );
		
        if (record[0] != null) {
          // Create a map to store the result
          Map<String, Object> result = new Map<String, Object>();
          result.put('recordId', record[0].Id);
          result.put('lastModifiedDate', record[0].LastModifiedDate);
          result.put('lasttime', record[0].LastModifiedDate);

          // Return the result map
          return result;
        } else {
          BI_PSP_LogMessagesUtility.logError(
            BI_PSP_SymptomTrackerConstantCtrl.error,
            BI_PSP_SymptomTrackerCtrl.class.toString(),
            true
          );
        }
      }
    } catch (Exception ex) {
      // Log and handle the exception

      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        true
      );

      // Return null in case of an exception
      //throw new AuraHandledException(Lastrecord);
    }
    return null;
  }

  /**
                                @description   fetchAccountDetails Person Gender Identity.
                                @param         careProgramEnrolleeId
                                @return        enrollees Person Gender Identity.This return values pass to bipspbiPspbSymptomTracker this components 
                                */

  @AuraEnabled(cacheable=true)
  public static List<CareProgramEnrollee> fetchAccountDetails(
    String careProgramEnrolleeId
  ) {
    List<CareProgramEnrollee> enrollees = new List<CareProgramEnrollee>();
    try {
      if (String.isBlank(careProgramEnrolleeId)) {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerConstantCtrl.careProgramErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      }
        // Perform SOQL query to fetch CareProgramEnrollee and related Account fields
       /* enrollees = [
          SELECT Id, AccountId, Account.Name, Account.HealthCloudGA__Gender__pc
          FROM CareProgramEnrollee
          WHERE Id = :careProgramEnrolleeId
          LIMIT 1
        ]; */
         String queryString =
        'SELECT Id, AccountId, Account.Name, Account.HealthCloudGA__Gender__pc FROM CareProgramEnrollee WHERE Id = \'' +
        careProgramEnrolleeId +
        '\' LIMIT 1';

      enrollees = BI_PSP_CommonQueryUtility.executeWholeQueryInString(
        queryString
      );
      
    } catch (Exception ex) {
      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerConstantCtrl.checkGender,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        true
      );
    }
    return enrollees;
  }
}