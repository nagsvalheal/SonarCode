public without sharing class  BI_PSP_SymptomTrackerContantCtrl {
    public static String error = System.Label.BI_PSP_ConsoleError;

  public static String errorMsg = '';
  public static List<BI_PSP_Symptom_Tracker__c> existingRecords = new List<BI_PSP_Symptom_Tracker__c>();
  public static String inActiveRecord = System.Label.BI_PSP_Inactive;
  public static String checkValues = System.Label.BI_PSP_CheckValues;
  public static String symptomErrorMsg = System.Label.BI_PSP_SymptomTrackerError;
  public static String gppErrorMsg = System.Label.BI_PSP_GppValuesErrorMsg;
  public static String careProgramErrorMsg = System.Label.BI_PSP_SymptomTrackerError;
  public static String carePlanErrorMsg = System.Label.BI_PSP_CarePlanErrorMsg;
  public static String patientErrorMsg = System.Label.BI_PSP_PatientErrorMsg;
  public static String contentErrorMsg = System.Label.BI_PSP_ApplicationPhotoMsg;
  public static String applicationPhotoMsg = System.Label.BI_PSP_ApplicationPhotoMsg;
  public static String bodyPartsErrorMsg = System.Label.BI_PSP_BodyPartsErrorMsg;
  public static String checkUniqueDate = System.Label.BI_PSP_CheckUnquieDate;
  public static String checkGender = System.Label.BI_PSP_Gender;
  public static String symptomRecordType = System.Label.BI_PSP_Symptom;
  public static String inActive = System.Label.BI_PSP_AcitveRecord;
  public static String activeLable = System.Label.BI_PSP_Active;
  public static String fileName = System.Label.BI_PSP_UploadedFilePng;
  public static String fileNamePath = System.Label.BI_PSP_UploadedFile;
  public static String symptomTrackerInactive = System.Label.BI_PSPB_EnrolleeCaregiverStatusInactive;
  public static String latestRecord = System.Label.BI_PSP_LatestRecords;
  public static String alleryRecord = System.Label.BI_PSP_AllergyDatas;
  public static String stausChange = System.Label.BI_PSP_SymptomUpdateStatus;

    
    public static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues(
    'PSPB'
    );
    public static String applicationName = settings != null
    ? settings.BI_SFCOE_LOG_Application__c : '';


      /**
                                @description     Retrieves the last entry date for a specific Account
                                        USER_MODE cannot be implemented here, as it is querying health cloud object.
                                @param           accountId  details based on the provided user ID
                                @return          editEntryDate  return insert id symptomrecord id return .This return values pass to bipspbiPspbSymptomTracker this components 
                                */

  @AuraEnabled(cacheable=true)
  public static Date getLastEntryDate(String accountId) {
    try {
      if (String.isBlank(accountId)) {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.patientErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        Date entryDate;
        List<BI_PSP_Symptom_Tracker__c> results = [
          SELECT BI_PSP_EditEntrydates__c
          FROM BI_PSP_Symptom_Tracker__c
          WHERE BI_PSP_Patient__c = :accountId
          WITH USER_MODE
          ORDER BY BI_PSP_EditEntrydates__c
        ];

        if (!results.isEmpty()) {
          entryDate = results[0].BI_PSP_EditEntrydates__c;
        }

        if (entryDate != null) {
          return entryDate;
        } else {
          BI_PSP_LogMessagesUtility.logError(
            BI_PSP_SymptomTrackerContantCtrl.errorMsg,
            BI_PSP_SymptomTrackerCtrl.class.toString(),
            true
          );
        }
      }
    } catch (Exception ex) {
      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerContantCtrl.patientErrorMsg,
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
      List<HealthCloudGA__CarePlanTemplate__c> results = [
        SELECT Id, BI_PSP_Symptom_image__c, Name, RecordTypeId
        FROM HealthCloudGA__CarePlanTemplate__c
        WHERE
          RecordType.Name = :BI_PSP_SymptomTrackerContantCtrl.symptomRecordType
        ORDER BY CreatedDate DESC
        LIMIT 10
      ];

      // Log the number of records retrieved
      if (!results.isEmpty()) {
        return results;
      } else {
        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.errorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      }
    } catch (Exception ex) {
      // Log the exception

      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerContantCtrl.errorMsg,
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
          BI_PSP_SymptomTrackerContantCtrl.applicationPhotoMsg,
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
        contentVersion.Title = BI_PSP_SymptomTrackerContantCtrl.fileNamePath;
        contentVersion.PathOnClient = BI_PSP_SymptomTrackerContantCtrl.fileName;
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
        BI_PSP_SymptomTrackerContantCtrl.applicationPhotoMsg,
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
          BI_PSP_SymptomTrackerContantCtrl.symptomErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        // Delete existing ContentDocumentLink records for the specified entity
        List<ContentDocumentLink> existingLinks = [
          SELECT Id
          FROM ContentDocumentLink
          WHERE LinkedEntityId = :symptomTrackerId
          WITH USER_MODE
        ];
        delete existingLinks;

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
        BI_PSP_SymptomTrackerContantCtrl.symptomErrorMsg,
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
          BI_PSP_SymptomTrackerContantCtrl.symptomErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        // Query for the first ContentDocumentLink related to the symptomTrackerId
        List<ContentDocumentLink> linksToDelete = [
          SELECT Id
          FROM ContentDocumentLink
          WHERE LinkedEntityId = :symptomTrackerId
          LIMIT 1
        ];

        BI_PSP_DatabaseOperationsUtility.deleteHandleErrors(
          linksToDelete,
          BI_PSP_SymptomTrackerCtrl.class.toString()
        );
      }
    } catch (System.DmlException ex) {
      BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSP_SymptomTrackerContantCtrl.applicationPhotoMsg,
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
          BI_PSP_SymptomTrackerContantCtrl.careProgramErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        // Debug log to check the value of careProgramEnrolleeId

        // Query the most recent record based on the given careProgramEnrolleeId and status not 'inactive'
        BI_PSP_Symptom_Tracker__c record = [
          SELECT Id, BI_PSP_EditEntrydates__c, LastModifiedDate
          FROM BI_PSP_Symptom_Tracker__c
          WHERE
            BI_PSP_Care_Program_Enrollee__c = :careProgramEnrolleeId
            AND BI_PSP_Symptom_Staus__c != :BI_PSP_SymptomTrackerContantCtrl.inActiveRecord
          ORDER BY LastModifiedDate DESC
          LIMIT 1
        ];

        if (record != null) {
          // Create a map to store the result
          Map<String, Object> result = new Map<String, Object>();
          result.put('recordId', record.Id);
          result.put('lastModifiedDate', record.LastModifiedDate);
          result.put('lasttime', record.LastModifiedDate);

          // Return the result map
          return result;
        } else {
          BI_PSP_LogMessagesUtility.logError(
            BI_PSP_SymptomTrackerContantCtrl.errorMsg,
            BI_PSP_SymptomTrackerCtrl.class.toString(),
            true
          );
        }
      }
    } catch (Exception ex) {
      // Log and handle the exception

      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerContantCtrl.symptomErrorMsg,
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
          BI_PSP_SymptomTrackerContantCtrl.careProgramErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),
          true
        );
      } else {
        // Perform SOQL query to fetch CareProgramEnrollee and related Account fields
        enrollees = [
          SELECT Id, AccountId, Account.Name, Account.HealthCloudGA__Gender__pc
          FROM CareProgramEnrollee
          WHERE Id = :careProgramEnrolleeId
          LIMIT 1
        ];
      }
    } catch (Exception ex) {
      BI_PSP_LogMessagesUtility.logError(
        BI_PSP_SymptomTrackerContantCtrl.checkGender,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        true
      );
    }
    return enrollees;
  }

    
}