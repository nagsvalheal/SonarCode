/*
@description Class used for fetching values from Symptom Tracker and Questionnaire objects for chart.
and Questionnaire objects.
History:
Version    Author      Date              Detail         Description
1.0        Gowsic N    10-Dec-2023       Created        Initial development
1.1        Saran S     20-Apr-2024       Updated        Add log, null check, descriptions   
*/
public with sharing class BI_PSP_GraphCtrl {
	private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues(
		'PSPB'
	);
	private static string applicationName = settings != null
		? settings.BI_SFCOE_LOG_Application__c
		: '';
	private static String symptomStatusInactive = System.Label.BI_PSP_Inactive;
	private static String inProgress = System.Label.BI_PSP_InProgressTxt;
	private static String assessmentStatusExpired = System.Label.BI_PSP_Expired;
	private static String introductionCategory = System.Label.BI_PSP_IntroductionLabel;
	private static String qualitativeCategory = System.Label.BI_PSP_QualitativeCategory;
	private static String emptyAssessment = System.Label.BI_PSP_EmptyAssessment;
	private static String symptomErrorMsg = System.Label.BI_PSP_SymptomTrackerError;
	/*
@description Method for getting Symptom Tracker details.
Retrieves Symptom Tracker details based on the provided parameters.
@param erolleId The ID of the care program enrollee.
@param firstDate The start date for fetching records.
@param lastDate The end date for fetching records.
@return List of SymptomTracker records.
*/
	@AuraEnabled(cacheable=true)
	public static List<SymptomTracker> getSymptomTrackerDetails(
		String erolleId,
		Date firstDate,
		Date lastDate
	) {
		List<SymptomTracker> symptoms = new List<SymptomTracker>();
		try {
			List<BI_PSP_Symptom_Tracker__c> recordSymptom = new List<BI_PSP_Symptom_Tracker__c>();
			if (
				!String.isBlank(erolleId) &&
				firstDate != null &&
				lastDate != null
			) {
				recordSymptom = [
					SELECT
						Id,
						LastModifiedDate,
						BI_PSP_Care_Program_Enrollee__c,
						BI_PSP_EditEntrydates__c,
						CreatedDate
					FROM BI_PSP_Symptom_Tracker__c
					WHERE
						BI_PSP_Care_Program_Enrollee__c = :erolleId
						AND BI_PSP_EditEntrydates__c > :firstDate
						AND BI_PSP_EditEntrydates__c < :lastDate
						AND BI_PSP_Symptom_Staus__c != :symptomStatusInactive
					ORDER BY BI_PSP_EditEntrydates__c ASC
				];
			}
			if (!recordSymptom.isEmpty()) {
				Set<Id> symptomIds = new Set<Id>();
				for (BI_PSP_Symptom_Tracker__c symp : recordSymptom) {
					if (symp.BI_PSP_EditEntrydates__c != null) {
						symptomIds.add(symp.Id);
					}
				}
				List<AllergyIntolerance> allergyTrack = [
					SELECT
						Id,
						BI_PSP_Graph_Symptom_Name__c,
						BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c,
						BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name
					FROM AllergyIntolerance
					WHERE
						BI_PSP_Symptom_Name__r.Id IN :symptomIds
						AND BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name != NULL
						AND BI_PSP_Symptoms__c != NULL ORDER BY BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c 
				];

				if (!allergyTrack.isEmpty()) {
					for (AllergyIntolerance allergy : allergyTrack) {
						SymptomTracker symp = new SymptomTracker();
						symp.symptom = allergy.BI_PSP_Symptom_Name__c;
						symp.dates = allergy.BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c;
						symp.name = allergy.BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name;
						symptoms.add(symp);
					}
				}
			}
		} catch (Exception ex) {
			BI_SFCOE_LOG_Util.handleException(
				ex,
				applicationName,
				BI_PSP_GraphCtrl.class.toString(),
				null,
				System.now()
			);
			throw new AuraHandledException(symptomErrorMsg);
		}

		return symptoms.isEmpty() ? null : symptoms;
		//If symptoms is empty we need to return null, because depending on null we do have some functionalities that are handled in LWC
	}
	/*
@description Method for getting Questionnaire details.
Retrieves Questionnaire details based on the provided parameters.
@param erolleId The ID of the care program enrollee.
@param questionnaireCategory The category of the questionnaire.
@param selectedMonths Comma-separated list of selected months.
@return Map containing questionnaire details.
*/
	@AuraEnabled(cacheable=true)
	public static Map<String, List<AssessmentQuestionResponse>> getQuestionnaireDetails(
		String erolleId,
		String questionnaireCategory,
		String selectedMonths
	) {
		Map<String, List<AssessmentQuestionResponse>> returnQuestionResponse = new Map<String, List<AssessmentQuestionResponse>>();
		Set<Id> assessmentIds = new Set<Id>();
		try {
			List<Assessment> recordAssessment = new List<Assessment>();
			// Query Assessments
			if (
				!String.isBlank(erolleId) &&
				!String.isBlank(questionnaireCategory)
			) {
				recordAssessment = [
					SELECT
						Id,
						Name,
						AssessmentStatus,
						BI_PSP_DateForCQ__c,
						BI_PSP_CareProgramEnrollee__r.Name
					FROM Assessment
					WHERE
						BI_PSP_CareProgramEnrollee__r.Id = :erolleId
						AND Name = :questionnaireCategory
						AND AssessmentStatus != :inProgress
					ORDER BY EffectiveDateTime ASC
				];
			}

			// Return null if no assessments, returning null is required because we have a functionality tat requires null value to be returned
			if (recordAssessment.isEmpty()) {
				return null;
			}

			// Collect Assessment Ids for selected months, returning null is required because we have a functionality tat requires null value to be returned
			if (!String.isBlank(selectedMonths)) {
				for (Assessment assess : recordAssessment) {
					if (selectedMonths.contains(assess.BI_PSP_DateForCQ__c)) {
						assessmentIds.add(assess.Id);
					}
				}
			}

			// Return null if no assessment ids found, returning null is required because we have a functionality tat requires null value to be returned
			if (assessmentIds.isEmpty()) {
				return null;
			}

			// Query AssessmentQuestionResponses
			List<AssessmentQuestionResponse> assQuesResponse = [
				SELECT
					Id,
					Assessment.Id,
					AssessmentQuestion.QuestionText,
					AssessmentQuestion.BI_PSP_shortQuestionText__c,
					AssessmentQuestion.Name,
					Assessment.AssessmentStatus,
					ResponseText,
					BI_PSP_Questionnaire_Name__c,
					Assessment.BI_PSP_DateForCQ__c,
					Assessment.Name
				FROM AssessmentQuestionResponse
				WHERE
					AssessmentId IN :assessmentIds
					AND Assessment.Name = :questionnaireCategory
			];

			// Populate returnQuestionResponse map
			if (!assQuesResponse.isEmpty()) {
				for (AssessmentQuestionResponse assres : assQuesResponse) {
					String dateKey = String.valueOf(
						assres.Assessment.BI_PSP_DateForCQ__c
					);
					if (!returnQuestionResponse.containsKey(dateKey)) {
						returnQuestionResponse.put(
							dateKey,
							new List<AssessmentQuestionResponse>()
						);
					}
					returnQuestionResponse.get(dateKey).add(assres);
				}
			}
		} catch (Exception ex) {
			BI_SFCOE_LOG_Util.handleException(
				ex,
				applicationName,
				BI_PSP_GraphCtrl.class.toString(),
				null,
				System.now()
			);
			throw new AuraHandledException(emptyAssessment);
		}

		// Return populated map or null if no records found
		return returnQuestionResponse.isEmpty() ? null : returnQuestionResponse;
		//If Question Response is empty we need to return null, because depending on null we do have some functionalities that are handled in LWC
	}
	/*
@description Method for getting completed Questionnaire details.
Retrieves Questionnaire details based on the provided parameters.
@param erolleId The ID of the care program enrollee.
@param selectedMonths Comma-separated list of selected months.
@return size of questionnaire details.
*/
	@AuraEnabled(cacheable=true)
	public static List<Assessment> getQuestionnaireLast(
		String erolleId,
		String selectedMonths
	) {
		List<Assessment> assessments = new List<Assessment>();
		try {
			List<Assessment> recordAssessment = new List<Assessment>();
			// Query Assessments
			if (!String.isBlank(erolleId) && !String.isBlank(selectedMonths)) {
				recordAssessment = [
					SELECT
						Id,
						Name,
						AssessmentStatus,
						BI_PSP_DateForCQ__c,
						BI_PSP_CareProgramEnrollee__r.Name
					FROM Assessment
					WHERE
						BI_PSP_CareProgramEnrollee__r.Id = :erolleId
						AND Name != :introductionCategory
						AND Name != :qualitativeCategory
						AND AssessmentStatus != :inProgress
					ORDER BY EffectiveDateTime ASC
				];
			}
			// Return null if no assessments found, returning null is required because we have a functionality that requires null value to be returned
			if (recordAssessment.isEmpty()) {
				return null;
			}

			// Collect Assessment Ids for selected months, returning null is required because we have a functionality that requires null value to be returned
			for (Assessment assess : recordAssessment) {
				if (selectedMonths.contains(assess.BI_PSP_DateForCQ__c)) {
					assessments.add(assess);
				}
			}
			// Return null if no assessment ids found, returning null is required because we have a functionality that requires null value to be returned
			if (assessments.isEmpty()) {
				return null;
			} else {
				return assessments;
			}
		} catch (Exception ex) {
			BI_SFCOE_LOG_Util.handleException(
				ex,
				applicationName,
				BI_PSP_GraphCtrl.class.toString(),
				null,
				System.now()
			);
			throw new AuraHandledException(emptyAssessment);
		}
	}
	/*
@description Inner class representing a symptom tracker record.
*/
	public class SymptomTracker {
		@AuraEnabled
		public Date dates; // Date of the symptom tracker record.

		@AuraEnabled
		public String name; // Name associated with the symptom.

		@AuraEnabled
		public String symptom; // Description of the symptom.
	}
}