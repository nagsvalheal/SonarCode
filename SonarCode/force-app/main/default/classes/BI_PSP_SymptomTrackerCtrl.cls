/**
				* @description This class provides functionalities related to caregivers and patients.
				* It includes methods for retrieving caregiver details, updating caregiver information,
				* managing access permissions, and handling patient data.When a class is declared with "without sharing," it allows the code in that class to access and manipulate records even if the user 
				running the code does not have the necessary permissions based on the organization's sharing settings or record-level security.	 

				* History
				* Version 	Author					Date			Detail		Description
				* 1.0		Karthikeyan.P		05-Jan-2024		Created		This was an intial development.
				* 1.1		Karthikeyan.P		06-Apr-2024		Updated		Code Review Changes.
				*/

public without sharing class BI_PSP_SymptomTrackerCtrl {
 
/**
                                @description   Checks if a record with a unique date already exists for a specific Account
                                    USER_MODE cannot be implemented here, as it is querying health cloud object.
                                @param         editedDate -old date or nwe date.
                                @param         accountId - accountId The ID of the user.
                                @return        editedDate checking with true or false values. This returns values to bipspbiPspbSymptomTracker this components 
                                */

                                @AuraEnabled(cacheable=true)
                                public static Boolean checkUniqueDate(Date editedDate, String accountId) {
                                  try {
                                    if (editedDate == null || String.isBlank(accountId)) {
                                      
                                        BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.checkValues,
          BI_PSP_SymptomTrackerCtrl.class.toString(),true
        );
                                    } else {
                                      List<BI_PSP_Symptom_Tracker__c> existingRecords = [
                                        SELECT Id, BI_PSP_Symptom_Staus__c
                                        FROM BI_PSP_Symptom_Tracker__c
                                        WHERE
                                          BI_PSP_Care_Program_Enrollee__r.Id = :accountId
                                          AND BI_PSP_EditEntrydates__c = :editedDate
                                          AND BI_PSP_Symptom_Staus__c = :BI_PSP_SymptomTrackerContantCtrl.activeLable
                                        ORDER BY createdDate DESC
                                        LIMIT 1
                                      ]; //USER_MODE cannot be implemented here, as it is related to  health cloud object.
                              
                                      if (!existingRecords.isEmpty()) {
                                        for (BI_PSP_Symptom_Tracker__c record : existingRecords) {
                                          if (record.BI_PSP_Symptom_Staus__c == BI_PSP_SymptomTrackerContantCtrl.inActiveRecord) {
                                            // If an 'Inactive' record with the same edit entry date is found, return true to allow insertion
                                            return true;
                                          }
                                        }
                                        // No 'Inactive' records found for the same edit entry date, but there are records with 'null' status, return false to disallow insertion
                                        return false;
                                      }
                                    }
                                    // No existing records. Proceed with insertion.
                                    return true;
                                  } catch (Exception ex) {
                                    // Log the exception
                              
                                   BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.checkUniqueDate,
          BI_PSP_SymptomTrackerCtrl.class.toString(),true
        );
                                    Return false;
                              
                                   
                                  }
                                }
                              
    /**
 * Inserts a new Symptom Tracker record for a CareProgramEnrollee.
 * 
 * @description This method inserts a new `BI_PSP_Symptom_Tracker__c` record for the specified Care Program Enrollee (CPE) based on the provided account ID and entry date. It first validates the input parameters, checks if there is already an inactive record for the given date, and if not, creates and inserts a new symptom tracker record. The method returns the ID of the inserted record or null if insertion fails or if an existing inactive record is found.
 * 
 * @param accId - The ID of the account associated with the Care Program Enrollee.
 * @param editEntryDate - The date when the symptom entry is made.
 * @return The ID of the inserted symptom tracker record or null if the record is not inserted.
 */
    @AuraEnabled
    public static Id insertSymptomTracker(String accId, Date editEntryDate) {
        if (editEntryDate == null || String.isBlank(accId)) {
         
            BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.checkValues,
          BI_PSP_SymptomTrackerCtrl.class.toString(),true
        );
        }

        String cpeList =BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;

        if (String.isBlank(cpeList)) {
            return null;
        }

        if (BI_PSP_SymptomTrackerhelperCtrl.isExistingInactiveRecord(cpeList, editEntryDate)) {
            return null;
        }

        BI_PSP_Symptom_Tracker__c symptomTracker = new BI_PSP_Symptom_Tracker__c(
            BI_PSP_Care_Program_Enrollee__c = cpeList,
            BI_PSP_EditEntrydates__c = editEntryDate,
            BI_PSP_Symptom_Staus__c = BI_PSP_SymptomTrackerContantCtrl.activeLable
        );

        try {
            List<Id> insertedIds = BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
                new List<BI_PSP_Symptom_Tracker__c>{ symptomTracker },
                BI_PSP_SymptomTrackerCtrl.class.toString(),false
            );
            return insertedIds.isEmpty() ? null : insertedIds[0];
        } catch (System.DmlException ex) {
          BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSP_SymptomTrackerContantCtrl.gppErrorMsg,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        ex
      );
            return null;
        }
    }

    /**
 * Updates an existing Symptom Tracker record.
 * 
 * @description This method updates a `BI_PSP_Symptom_Tracker__c` record identified by the given ID. It sets the user's symptom status (`gpp`) and the entry date (`editEntryDate`) for the record. If the record is found, it updates the record with the new values and saves it. If the ID or `gpp` is invalid, an `AuraHandledException` is thrown.
 * 
 * @param symptomTrackerId - The ID of the symptom tracker record to be updated.
 * @param gpp - A Boolean value indicating whether the user is currently experiencing symptoms (true) or not (false).
 * @param editEntryDate - The date of the symptom entry.
 */
    @AuraEnabled
    public static void updateSymptomTracker(String symptomTrackerId, Boolean gpp, Date editEntryDate) {
        if (String.isBlank(symptomTrackerId) || gpp == null) {
             BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.checkValues,
          BI_PSP_SymptomTrackerCtrl.class.toString(),true
        );
        }

        BI_PSP_Symptom_Tracker__c symptomTracker = BI_PSP_SymptomTrackerhelperCtrl.getSymptomTrackerById(symptomTrackerId);
        if (symptomTracker != null) {
            symptomTracker.BI_PSP_Are_you_currently_experiencing__c = gpp;
            symptomTracker.BI_PSP_EditEntrydates__c = editEntryDate;
            BI_PSP_SymptomTrackerhelperCtrl.saveSymptomTracker(symptomTracker);
        }
    }

    /**
 * Updates the "Are you currently experiencing?" field in a Symptom Tracker record.
 * 
 * @description This method updates the `BI_PSP_Are_you_currently_experiencing__c` field in a `BI_PSP_Symptom_Tracker__c` record identified by the given `symptomTrackerId`. If the ID is blank or the `gpp` value is null, an `AuraHandledException` with an appropriate error message is thrown. If the record is not found, a different exception is thrown.
 * 
 * @param symptomTrackerId - The ID of the symptom tracker record to be updated.
 * @param gpp - A Boolean value indicating whether the user is currently experiencing symptoms (true) or not (false).
 */
    @AuraEnabled
    public static void updateGppValue(String symptomTrackerId, Boolean gpp) {
        if (String.isBlank(symptomTrackerId) || gpp == null) {
     
              BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.gppErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),true
        );
        }

        BI_PSP_Symptom_Tracker__c symptomTracker =BI_PSP_SymptomTrackerhelperCtrl.getSymptomTrackerById(symptomTrackerId);
        if (symptomTracker == null) {
             BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.symptomErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),true
        );
        }

        symptomTracker.BI_PSP_Are_you_currently_experiencing__c = gpp;
        BI_PSP_SymptomTrackerhelperCtrl.saveSymptomTracker(symptomTracker);
    }

    /**
 * Updates recent activities in a Symptom Tracker record.
 * 
 * @description This method updates the `BI_PSP_Recent_Activities__c` field in a `BI_PSP_Symptom_Tracker__c` record identified by the given `symptomTrackerId`. The field is updated with a semicolon-separated list of recent activities provided in the `valuesToUpdate` parameter. If the ID is blank or the list of values is empty, an `AuraHandledException` is thrown. If the record with the given ID is not found, no update occurs.
 * 
 * @param symptomTrackerId - The ID of the symptom tracker record to be updated.
 * @param valuesToUpdate - A list of recent activities to be set in the `BI_PSP_Recent_Activities__c` field. These activities will be concatenated into a single string separated by semicolons.
 */
    @AuraEnabled
    public static void updateRecentSymptomActivity(String symptomTrackerId, List<String> valuesToUpdate) {
        if (String.isBlank(symptomTrackerId) || valuesToUpdate.isEmpty()) {
              BI_PSP_LogMessagesUtility.logError(
          BI_PSP_SymptomTrackerContantCtrl.symptomErrorMsg,
          BI_PSP_SymptomTrackerCtrl.class.toString(),true
        );
        }

        BI_PSP_Symptom_Tracker__c symptomTracker = BI_PSP_SymptomTrackerhelperCtrl.getSymptomTrackerById(symptomTrackerId);
        if (symptomTracker != null) {
            symptomTracker.BI_PSP_Recent_Activities__c = String.join(valuesToUpdate, ';');
            BI_PSP_SymptomTrackerhelperCtrl.saveSymptomTracker(symptomTracker);
        }
    }  /**
    * Inserts an AllergyIntolerance record based on the provided data.
    * 
    * @description This method inserts a new `AllergyIntolerance` record into the system using the information provided in `itchinessallrecordinsert` and `bodyParts`. The method validates the inputs, retrieves necessary data from Health Cloud, and creates the `AllergyIntolerance` record. Note that USER_MODE cannot be implemented here because it queries Health Cloud objects.
    * 
    * @param itchinessallrecordinsert - A wrapper object containing symptom tracker information, including symptom name and care program ID. This is used to retrieve related data and create the `AllergyIntolerance` record.
    * @param bodyParts - A list of strings representing body parts related to the allergy or intolerance. This information is used to complete the record creation.
    * 
    * @return Id - The ID of the newly inserted `AllergyIntolerance` record. If the insertion fails or no record is created, `null` is returned.
    */
   @AuraEnabled(cacheable=false)
   public static Id recordInsertAllergyIntolerance(
       BI_PSP_SymptomTrackerhelperCtrl.BI_PSPB_Symptomtrackerwrapeermethod itchinessallrecordinsert,
       List<String> bodyParts
   ) {
       try {
           BI_PSP_SymptomTrackerhelperCtrl.validateInputs(itchinessallrecordinsert, bodyParts);
   
           String itchinessCarePlan = itchinessallrecordinsert.symptomname;
           String accountId = BI_PSP_SymptomTrackerhelperCtrl.getAccountId(itchinessallrecordinsert.careProgramId);
   
           HealthCloudGA__CarePlanTemplate__c cpt = BI_PSP_SymptomTrackerhelperCtrl.getCarePlanTemplate(itchinessCarePlan);
           HealthCloudGA__CareProgramPlanTemplate__c careProgram = BI_PSP_SymptomTrackerhelperCtrl.getCareProgramPlanTemplate(cpt.Id);
   
           AllergyIntolerance ai = BI_PSP_SymptomTrackerhelperCtrl.createAllergyIntolerance(itchinessallrecordinsert, bodyParts, careProgram.Id, accountId);
   
           List<Id> insertedIds = BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(new List<AllergyIntolerance>{ ai }, BI_PSP_SymptomTrackerCtrl.class.toString(), false);
           return insertedIds.isEmpty() ? null : insertedIds[0];
       } catch (System.DmlException ex) {
          BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSP_SymptomTrackerContantCtrl.gppErrorMsg,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        ex
      );
           return null;
       }
   }
   
   /**
    * Updates an existing AllergyIntolerance record based on the provided data.
    * 
    * @description This method updates an existing `AllergyIntolerance` record using the information provided in `itchinessallrecordupdate` and `bodyParts`. It validates the inputs, retrieves necessary data from Health Cloud, and updates the existing `AllergyIntolerance` record. Note that USER_MODE cannot be implemented here due to querying Health Cloud objects.
    * 
    * @param itchinessallrecordupdate - A wrapper object containing updated symptom tracker information, including symptom name and care program ID. This is used to retrieve and update the existing `AllergyIntolerance` record.
    * @param bodyParts - A list of strings representing body parts related to the allergy or intolerance. This information is used to complete the record update.
    * 
    * @return Id - The ID of the updated `AllergyIntolerance` record. If the update fails or no record is updated, `null` is returned.
    */
   @AuraEnabled(cacheable=false)
   public static Id recordUpdateAllergyIntolerance(
       BI_PSP_SymptomTrackerhelperCtrl.BI_PSPB_Symptomtrackerwrapeermethod itchinessallrecordupdate,
       List<String> bodyParts
   ) {
       try {
           BI_PSP_SymptomTrackerhelperCtrl.validateInputs(itchinessallrecordupdate, bodyParts);
   
           String accountId = BI_PSP_SymptomTrackerhelperCtrl.getAccountId(itchinessallrecordupdate.careProgramId);
           HealthCloudGA__CarePlanTemplate__c cpt = BI_PSP_SymptomTrackerhelperCtrl.getCarePlanTemplate(itchinessallrecordupdate.symptomname);
           HealthCloudGA__CareProgramPlanTemplate__c careProgram = BI_PSP_SymptomTrackerhelperCtrl.getCareProgramPlanTemplate(cpt.Id);
   
           AllergyIntolerance existingRecord = BI_PSP_SymptomTrackerhelperCtrl.getExistingAllergyIntoleranceRecord(accountId, careProgram.Id);
           BI_PSP_SymptomTrackerhelperCtrl.updateAllergyIntoleranceRecord(existingRecord, itchinessallrecordupdate, bodyParts);
   
           List<Id> updatedIds = BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(new List<AllergyIntolerance>{ existingRecord }, BI_PSP_SymptomTrackerCtrl.class.toString(), false);
           return updatedIds.isEmpty() ? null : updatedIds[0];
       } catch (System.DmlException ex) {
          BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSP_SymptomTrackerContantCtrl.gppErrorMsg,
        BI_PSP_SymptomTrackerCtrl.class.toString(),
        ex
      );
           return null;
       }
   }
   
 

}