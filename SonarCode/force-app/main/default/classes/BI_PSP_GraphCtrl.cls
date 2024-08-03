/*
@description Class used for fetching values from Symptom Tracker and Questionnaire objects for chart.
and Questionnaire objects.
History:
Version    Author      Date              Detail         Description
1.0        Gowsic N    10-Dec-2023       Created        Initial development
1.1        Saran S     20-Apr-2024       Updated        Add log, null check, descriptions   
*/
public with sharing class BI_PSP_GraphCtrl {
	/*
@description Method for getting Symptom Tracker details.
Retrieves Symptom Tracker details based on the provided parameters.
@param erolleId The ID of the care program enrollee.
@param firstDate The start date for fetching records.
@param lastDate The end date for fetching records.
@return List of SymptomTracker records.
*/

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
                
                 String fields = 'Id, Name, AssessmentStatus, BI_PSP_DateForCQ__c, BI_PSP_CareProgramEnrollee__r.Name';
                String conditions = 'BI_PSP_CareProgramEnrollee__r.Id = \'' + erolleId + '\' ' +
                                    'AND Name = \'' + questionnaireCategory + '\' ' +
                                    'AND AssessmentStatus != \'' + BI_PSP_QuestionnaireConstant.inProgress + '\' ' +
                                    'ORDER BY EffectiveDateTime ASC';
           
                // Execute the query using the common query method
                List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
                recordAssessment=((List<Assessment>)sObjectResponses);
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
				BI_PSP_QuestionnaireConstant.applicationName,
				BI_PSP_GraphCtrl.class.toString(),
				null,
				System.now()
			);
			throw new AuraHandledException(BI_PSP_QuestionnaireConstant.emptyAssesment);
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
				 String fields = 'Id, Name, AssessmentStatus, BI_PSP_DateForCQ__c, BI_PSP_CareProgramEnrollee__r.Name';
                String conditions = 'BI_PSP_CareProgramEnrollee__r.Id = \'' + erolleId + '\' ' +
                                    'AND Name != \'' + BI_PSP_QuestionnaireConstant.introduction + '\' ' +
                                    'AND Name != \'' + BI_PSP_QuestionnaireConstant.qualiCategory + '\' ' +
                                    'AND AssessmentStatus != \'' + BI_PSP_QuestionnaireConstant.inProgress + '\' ' +
                                    'ORDER BY EffectiveDateTime ASC';

                // Execute the query using the common query method
                List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
                recordAssessment=((List<Assessment>)sObjectResponses);

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
			
		} catch (Exception ex) {
				BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSP_QuestionnaireConstant.emptyAssesment, BI_PSP_GraphCtrl.class.toString(), ex);
		}
        // Return null if no assessment ids found, returning null is required because we have a functionality that requires null value to be returned
			if (assessments.isEmpty()) {
				return null;
			} else {
				return assessments;
			}
	}

}