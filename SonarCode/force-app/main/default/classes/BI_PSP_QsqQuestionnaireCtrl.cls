/*
@description       This Apex class handles the creation and management of assessments and assessment question
                   responses related to a specific type of questionnaire within a care program. 
                   It provides methods for inserting responses, managing draft responses, and
                   handling assessments for both page one and page two of the questionnaire.
* History:
* Version	Author		Date			Detail			Description.
* 1.0		Abinsha		05-Dec-2023		Created			Initial development.
* 1.1		Abinsha 	01-Jan-2024		Updated			Updated for caregiver.
* 1.2		Abinsha		04-Apr-2024		Updated			Catch log added.
*/

public with sharing class BI_PSP_QsqQuestionnaireCtrl {

    /**
     * Creates an assessment record and corresponding assessment question responses.
     *
     * This method takes lists of question IDs and response texts along with other necessary parameters
     * to create an assessment record and its associated assessment question responses in Salesforce.
     * @param questionIds       List of question IDs.
     * @param responseTexts     List of response texts corresponding to the question IDs.
     * @param patinetEnrolleeId             Care program enrollee ID.
     * @param timeOfQsqEnrllee Time of care program enrollee's questionnaire enrollment.
     */
    @AuraEnabled
    public static void createAssessmentAndResponses(
        List<String> questionIds,
        List<String> responseTexts,
        Integer twoOrFourteenWks
    ) {
        saveAssessmentAndResponses(questionIds, responseTexts, twoOrFourteenWks, false);
    }

    @AuraEnabled
    public static void saveQsqAsDraftAfterTwoMonths(
        List<String> darftQuestionIds,
        List<String> draftResponseTexts,
        Integer twoOrFourteenWks
    ) {
        saveAssessmentAndResponses(darftQuestionIds, draftResponseTexts, twoOrFourteenWks, true);
    }

    private static void saveAssessmentAndResponses(
        List<String> questionIds,
        List<String> responseTexts,
        Integer twoOrFourteenWks,
        Boolean isDraft
    ) {
        try {
             BI_PSP_QuestionnaireConstant.enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
            if (String.isBlank(BI_PSP_QuestionnaireConstant.enrolleeId )) {
                throw new AuraHandledException(BI_PSP_QuestionnaireConstant.patientEnrolleeErrorMsg);
            }

            CareProgramEnrollee enrollee = getEnrolleeById(BI_PSP_QuestionnaireConstant.enrolleeId);
            DateTime timeOfQsqEnrllee = enrollee.CreatedDate;

            if (questionIds.isEmpty() || responseTexts.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_QsqQuestionnaireCtrl.class.toString(),false);
                throw new AuraHandledException(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse);
            }

            String activeVersionId = questionIds[questionIds.size() - 1];
            if (String.isBlank(activeVersionId)) {
                BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestionversion, BI_PSP_QsqQuestionnaireCtrl.class.toString(),false);
                throw new AuraHandledException(BI_PSP_QuestionnaireConstant.emptyQuestionversion);
            }

            AssessmentQuestion assessmentQuestion = getAssessmentQuestionByVersionId(activeVersionId);
            String categoryName = assessmentQuestion.QuestionCategory;

            Assessment assessment = createAssessment( BI_PSP_QuestionnaireConstant.enrolleeId , categoryName, timeOfQsqEnrllee, twoOrFourteenWks, isDraft);
            String assId = assessment.Id;

            List<AssessmentQuestionResponse> responses = createAssessmentResponses(questionIds, responseTexts, assId, twoOrFourteenWks);
            BI_PSPB_HandleUtitlites.insertAndHandleErrors(responses, BI_PSP_QsqQuestionnaireCtrl.class.toString(), false);

            if (assId != null) {
                deletePreviousInProgressAssessments(UserInfo.getUserId(), categoryName, assId);
            }
        } catch (Exception ex) {
         //   BI_SFCOE_LOG_Util.handleException(ex, BI_PSP_QuestionnaireConstant.applicationName, BI_PSP_QsqQuestionnaireCtrl.class.toString(), null, System.now());
    
        }
    }

    private static CareProgramEnrollee getEnrolleeById(String enrolleeId) {
        return [
            SELECT Id, Name, CreatedDate
            FROM CareProgramEnrollee
            WHERE Id = :enrolleeId
            LIMIT 1
        ];
    }

    private static AssessmentQuestion getAssessmentQuestionByVersionId(String versionId) {
        List<AssessmentQuestion> questions = [
            SELECT Id, QuestionCategory
            FROM AssessmentQuestion
            WHERE ActiveVersionId = :versionId
            LIMIT 1
        ];

        if (questions.isEmpty()) {
            BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_QsqQuestionnaireCtrl.class.toString(),false);
            throw new AuraHandledException(BI_PSP_QuestionnaireConstant.questionsNotAvailable);
        }

        return questions[0];
    }

    private static Assessment createAssessment(String enrolleeId, String categoryName, DateTime timeOfQsqEnrllee, Integer twoOrFourteenWks, Boolean isDraft) {
        Assessment assessment = new Assessment();
        assessment.BI_PSP_CareProgramEnrollee__c = enrolleeId;
        assessment.EffectiveDateTime = DateTime.now();
        assessment.ExpirationDateTime = DateTime.now().addDays(BI_PSP_QuestionnaireConstant.expireDate);
        assessment.AssessmentStatus = isDraft ? BI_PSP_QuestionnaireConstant.inProgress : BI_PSP_QuestionnaireConstant.completed;
        assessment.Name = categoryName;

            if (twoOrFourteenWks == 0 && timeOfQsqEnrllee != null) {
                assessment.BI_PSP_RolloutforCompletedQuestionnarie__c = timeOfQsqEnrllee.addDays(BI_PSP_QuestionnaireConstant.twoMonthsInt);
            } else if (twoOrFourteenWks == 1 && timeOfQsqEnrllee != null) {
                assessment.BI_PSP_RolloutforCompletedQuestionnarie__c = timeOfQsqEnrllee.addDays(BI_PSP_QuestionnaireConstant.fourteenWeeksInt);
            } else {
                BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.rolloutDateerrormessage, BI_PSP_QsqQuestionnaireCtrl.class.toString(),false);
                throw new AuraHandledException(BI_PSP_QuestionnaireConstant.rolloutDateerrormessage);
            }
        
        List<Id> insertedIds = BI_PSPB_HandleUtitlites.insertAndHandleErrors(new List<Assessment>{ assessment }, BI_PSP_QsqQuestionnaireCtrl.class.toString(), false);
        assessment.Id = insertedIds[0];
        return assessment;
    }

    private static List<AssessmentQuestionResponse> createAssessmentResponses(List<String> questionIds, List<String> responseTexts, String assId, Integer twoOrFourteenWks) {
        List<AssessmentQuestionResponse> responses = new List<AssessmentQuestionResponse>();

        for (Integer i = 0; i < questionIds.size(); i++) {
            AssessmentQuestionResponse response = new AssessmentQuestionResponse();
            response.AssessmentQuestionId = questionIds[i];
            response.ResponseText = responseTexts[i];
            response.AssessmentId = assId;
            response.Name = responseTexts[i];

            if (twoOrFourteenWks == 0) {
                response.BI_PSP_QsqAfter2months__c = BI_PSP_QuestionnaireConstant.pageOne;
            } else if (twoOrFourteenWks == 1) {
                response.BI_PSP_QsqAfterWeeks__c = BI_PSP_QuestionnaireConstant.pageTwo;
            }

            responses.add(response);
        }

        return responses;
    }

    private static void deletePreviousInProgressAssessments(String userId, String categoryName, String currentAssId) {
        List<Assessment> previousAssessments = [
            SELECT Id
            FROM Assessment
            WHERE CreatedById = :userId
                AND AssessmentStatus = :BI_PSP_QuestionnaireConstant.inprogress
                AND Id != :currentAssId
                AND Name = :categoryName
        ];

        if (!previousAssessments.isEmpty()) {
            BI_PSPB_HandleUtitlites.deleteHandleErrors(previousAssessments, BI_PSP_QsqQuestionnaireCtrl.class.toString());
        }
    }
}