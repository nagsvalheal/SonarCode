/**
 * @description This class provides helper methods for managing Symptom Tracker records.
 * It includes methods for retrieving, saving, and validating records, as well as creating
 * and updating related records such as AllergyIntolerance.
 */
public with sharing class BI_PSP_SymptomTrackerHelperCtrl {
	/**
	 * @description Retrieves a Symptom Tracker record by its ID.
	 *
	 * @param symptomTrackerId The ID of the Symptom Tracker record to retrieve.
	 * @return The Symptom Tracker record if found; otherwise, null.
	 */

	public static BI_PSP_Symptom_Tracker__c getSymptomTrackerById(
		String symptomTrackerId
	) {
		if (String.isBlank(symptomTrackerId)) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
		String symptomTrackerIdValue = String.valueOf(symptomTrackerId);

		String queryString =
			'SELECT Id, BI_PSP_Care_Program_Enrollee__c, BI_PSP_Are_you_currently_experiencing__c, BI_PSP_EditEntrydates__c ' +
			'FROM BI_PSP_Symptom_Tracker__c ' +
			'WHERE Id = \'' +
			symptomTrackerIdValue +
			'\' ' +
			'LIMIT 1';

		List<BI_PSP_Symptom_Tracker__c> records = BI_PSP_CommonQueryUtility.executeComplexQuery(
			queryString,false
		);
		return records.isEmpty() ? null : records[0];
	}
	/**
	 * @description Saves the provided Symptom Tracker record and handles any errors that occur during the save operation.
	 *
	 * @param symptomTracker The Symptom Tracker record to be saved.
	 * @throws AuraHandledException If an error occurs during the save operation.
	 */

	// Helper method to save a symptom tracker and handle errors
	public static void saveSymptomTracker(
		BI_PSP_Symptom_Tracker__c symptomTracker
	) {
		try {
			BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(
				new List<BI_PSP_Symptom_Tracker__c>{ symptomTracker },
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				false
			);
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSP_SymptomTrackerConstantCtrl.applicationPhotoMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				ex
			);
		}
	}

	/**
	 * @description Checks if there is an existing inactive Symptom Tracker record for the specified care program enrollee and edit entry date.
	 *
	 * @param cpeList The ID of the Care Program Enrollee.
	 * @param editEntryDate The date when the entry was edited.
	 * @return True if there is at least one inactive record for the given care program enrollee and edit entry date, otherwise false.
	 */

	// Helper method to check if an existing inactive record exists
	public static Boolean isExistingInactiveRecord(
		String cpeList,
		Date editEntryDate
	) {
		if (String.isBlank(cpeList) || editEntryDate == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
			return false; // Early return in case of error
		}

		// Convert variables to strings
		String editEntryDateValue = String.valueOf(editEntryDate);
		String inActiveStatusValue = String.valueOf(
			BI_PSP_SymptomTrackerConstantCtrl.inActive
		);

		// Construct the dynamic query string
		String queryString =
			'SELECT Id ' +
			'FROM BI_PSP_Symptom_Tracker__c ' +
			'WHERE BI_PSP_Care_Program_Enrollee__c = \'' +
			cpeList +
			'\' ' +
			'AND BI_PSP_EditEntrydates__c = ' +
			editEntryDateValue +
			' ' +
			'AND BI_PSP_Symptom_Staus__c = \'' +
			inActiveStatusValue +
			'\' ' +
			'LIMIT 1';

		// Execute the query

		List<BI_PSP_Symptom_Tracker__c> existingRecords = BI_PSP_CommonQueryUtility.executeComplexQuery(
			queryString,false
		);

		// Return true if the list is not empty, otherwise return false
		return !existingRecords.isEmpty();
	}

	/**
	 * @description Validates the input parameters for null values.
	 *
	 * @param record The Symptom Tracker wrapper object that contains symptom-related data.
	 * @param bodyParts A list of body parts associated with the symptom.
	 * @throws AuraHandledException If either the record or bodyParts parameters are null.
	 */
	// Helper method to validate input parameters
	public static void validateInputs(
		BI_PSPB_Symptomtrackerwrapeermethod record,
		List<String> bodyParts
	) {
		if (record == null || bodyParts == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
	}
	/**
	 * @description Retrieves the Account ID associated with the given care program ID.
	 *
	 * @param careProgramId The ID of the care program.
	 * @return The Account ID associated with the care program.
	 * @throws AuraHandledException If the CareProgramEnrollee record is not found or if the Account ID is null.
	 */

	// Helper method to retrieve AccountId
	public static String getAccountId(String careProgramId) {
		CareProgramEnrollee cpes = getCareProgramEnrollee(careProgramId);
		if (cpes == null || cpes.AccountId == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
		return cpes.AccountId;
	}
	/**
	 * @description Retrieves a CareProgramEnrollee record by its ID.
	 *
	 * @param careProgramId The ID of the CareProgramEnrollee record to retrieve.
	 * @return The CareProgramEnrollee record if found, otherwise null.
	 */
	// Helper method to retrieve CareProgramEnrollee
	public static CareProgramEnrollee getCareProgramEnrollee(
		String careProgramId
	) {
		if (String.isBlank(careProgramId)) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}

		Id careProgramIdNew = careProgramId;

		// Construct the query string
		String query =
			'SELECT Id, AccountId ' +
			'FROM CareProgramEnrollee ' +
			'WHERE Id  = \'' +
			careProgramIdNew +
			'\' ' +
			'LIMIT 1';

		// Execute the dynamic query
		List<CareProgramEnrollee> cpesList = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,false
		);

		return cpesList.isEmpty() ? null : cpesList[0];
	}
	/**
	 * @description Retrieves a CarePlanTemplate record by its name.
	 *
	 * @param name The name of the CarePlanTemplate to retrieve.
	 * @return The CarePlanTemplate record if found.
	 * @throws AuraHandledException If no CarePlanTemplate records are found with the given name.
	 */

	// Helper method to retrieve CarePlanTemplate
	public static HealthCloudGA__CarePlanTemplate__c getCarePlanTemplate(
		String name
	) {
		String query =
			'SELECT Id ' +
			'FROM HealthCloudGA__CarePlanTemplate__c ' +
			'WHERE Name = \'' +
			name +
			'\' ' +
			'LIMIT 1';

		// Execute the dynamic query

		List<HealthCloudGA__CarePlanTemplate__c> cptList = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,false
		);
		if (cptList.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}
		return cptList[0];
	}
	/**
	 * @description Retrieves a CareProgramPlanTemplate record associated with a given CarePlanTemplate ID.
	 *
	 * @param cptId The ID of the CarePlanTemplate.
	 * @return The CareProgramPlanTemplate record if found.
	 * @throws AuraHandledException If no CareProgramPlanTemplate records are found.
	 */
	// Helper method to retrieve CareProgramPlanTemplate
	public static HealthCloudGA__CareProgramPlanTemplate__c getCareProgramPlanTemplate(
		Id cptId
	) {
		if (String.isBlank(cptId)) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
				BI_PSP_SymptomTrackerCtrl.class.toString(),
				true,
				BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
			);
		}

		String query =
			'SELECT Id ' +
			'FROM HealthCloudGA__CareProgramPlanTemplate__c ' +
			'WHERE HealthCloudGA__CarePlanTemplate__c = \'' +
			cptId +
			'\' ' +
			'LIMIT 1';

		// Execute the dynamic query
		//

		List<HealthCloudGA__CareProgramPlanTemplate__c> careProgramList = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,false
		);

		return careProgramList[0];
	}
	/**
	 * @description Creates a new AllergyIntolerance record based on the provided symptom tracker data.
	 *
	 * @param record The wrapper method containing data for the new AllergyIntolerance record.
	 * @param bodyParts A list of body parts associated with the symptom.
	 * @param careProgramId The ID of the care program associated with the symptom.
	 * @param accountId The ID of the patient account.
	 * @return The newly created AllergyIntolerance record.
	 */

	// Helper method to create AllergyIntolerance record
	public static AllergyIntolerance createAllergyIntolerance(
		BI_PSPB_Symptomtrackerwrapeermethod record,
		List<String> bodyParts,
		Id careProgramId,
		String accountId
	) {
		AllergyIntolerance ai = new AllergyIntolerance();
		ai.BI_PSP_Symptoms__c = careProgramId;
		ai.BI_PSP_Symptom_Name__c = record.symptomId;
		ai.BI_PSP_Bodyparts__c = (bodyParts != null && !bodyParts.isEmpty())
			? String.join(bodyParts, ';')
			: null;
		ai.BI_PSP_Intensity__c = (record.sliderValue != null &&
			record.sliderValue != 0)
			? Decimal.valueOf(record.sliderValue)
			: null;
		ai.BI_PSP_Temperature__c = (record.valoF != null &&
			String.valueOf(record.valoF) != '0')
			? record.valoF
			: null;
		ai.BI_PSP_Mood__c = (!String.isEmpty(record.moodvalues))
			? record.moodvalues
			: null;
		ai.PatientId = accountId;
		return ai;
	}
	/**
	 * @description Retrieves the most recent existing AllergyIntolerance record for a given account and care program.
	 *
	 * @param accountId The ID of the patient account.
	 * @param careProgramId The ID of the care program associated with the symptom.
	 * @return The most recent AllergyIntolerance record if found.
	 * @throws AuraHandledException If no existing Allergy Intolerance records are found.
	 */
	// Helper method to retrieve existing AllergyIntolerance record
	public static AllergyIntolerance getExistingAllergyIntoleranceRecord(
		String accountId,
		Id careProgramId
	) {
		if (String.isBlank(accountId) || String.isBlank(careProgramId)) {
			throw new AuraHandledException(
				'The accountId parameter is null or empty.'
			);
		}

		String query =
			'SELECT Id, BI_PSP_Bodyparts__c, BI_PSP_Intensity__c, BI_PSP_Temperature__c, BI_PSP_Mood__c ' +
			'FROM AllergyIntolerance ' +
			'WHERE PatientId = \'' +
			accountId +
			'\' AND BI_PSP_Symptoms__c = \'' +
			careProgramId +
			'\' ' +
			'ORDER BY CreatedDate DESC ' +
			'LIMIT 1';

		// Execute the dynamic query
		//

		List<AllergyIntolerance> existingRecords = BI_PSP_CommonQueryUtility.executeComplexQuery(
			query,false
		);

		return existingRecords[0];
	}

	/**
	 * @description Updates an existing AllergyIntolerance record with new values.
	 *
	 * @param existingRecord The existing AllergyIntolerance record to update.
	 * @param record The wrapper method containing new values for the AllergyIntolerance record.
	 * @param bodyParts A list of body parts associated with the symptom.
	 */

	// Helper method to update AllergyIntolerance record
	public static void updateAllergyIntoleranceRecord(
		AllergyIntolerance existingRecord,
		BI_PSPB_Symptomtrackerwrapeermethod record,
		List<String> bodyParts
	) {
		existingRecord.BI_PSP_Symptom_Name__c = record.symptomId;
		existingRecord.BI_PSP_Bodyparts__c = (bodyParts != null &&
			!bodyParts.isEmpty())
			? String.join(bodyParts, ';')
			: null;
		existingRecord.BI_PSP_Intensity__c = (record.sliderValue != null &&
			record.sliderValue != 0)
			? Decimal.valueOf(record.sliderValue)
			: null;
		existingRecord.BI_PSP_Temperature__c = (record.valoF != null &&
			String.valueOf(record.valoF) != '0')
			? record.valoF
			: null;
		existingRecord.BI_PSP_Mood__c = (!String.isEmpty(record.moodvalues))
			? record.moodvalues
			: null;
	}
	/**
	 * @description Logs an exception using the BI_SFCOE_LOG_Util utility.
	 *
	 * @param ex The exception to be logged.
	 */
	// Helper method to log exceptions

	/**
	 * Represents a wrapper class for symptom tracker data in Salesforce.
	 *
	 * @description This class is used to encapsulate the data related to symptom tracking, including various attributes such as care program ID, slider value, symptom ID, and other related information. It is designed to facilitate the transfer of symptom tracker data between components and Apex controllers.
	 */

	public class BI_PSPB_Symptomtrackerwrapeermethod {
		/**
		 * @description The ID of the care program associated with the symptom tracker.
		 */
		@AuraEnabled
		public String careProgramId { get; set; }
		/**
		 * @description The value of the slider used for symptom tracking.
		 */
		@AuraEnabled
		public Integer sliderValue { get; set; }
		/**
		 * @description A decimal value that represents a specific metric or measurement in the symptom tracker data.
		 */
		@AuraEnabled
		public Decimal valoF { get; set; }
		/**
		 * @description The ID of the symptom associated with the symptom tracker.
		 */
		@AuraEnabled
		public String symptomId { get; set; }
		/**
		 * @description The gender of the person for whom the symptom tracker data is recorded.
		 */
		@AuraEnabled
		public String personGender { get; set; }
		/**
		 * @description Mood-related values associated with the symptom tracker data.
		 */
		@AuraEnabled
		public String moodvalues { get; set; }
		/**
		 * @description The name of the symptom being tracked.
		 */
		@AuraEnabled
		public String symptomname { get; set; }
	}
}