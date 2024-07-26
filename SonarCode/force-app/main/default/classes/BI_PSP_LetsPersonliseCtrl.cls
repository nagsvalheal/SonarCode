/*
 * @description       : Class for managing personalized assessments and questionnaire responses.
 *                      This class provides methods to handle the creation of new assessments,
 *                      association of responses to existing assessments, and deletion of draft responses.
 * History:
 * Version  Author      Date            Detail          Description
 * 1.0      Abinsha     05-Dec-2023     Created         Initial development.
 * 1.1      Abinsha     01-Jan-2024     Updated         Updated for caregiver.
 * 1.2      Abinsha     04-Apr-2024     Updated         Catch log added.
 */

public with sharing class BI_PSP_LetsPersonliseCtrl {
 
    /*
    * @Description Method for inserting multiple draft records.
    * This method checks for an existing 'In Progress' assessment for the user.
    * and either associates responses to it or creates a new assessment.
    * method is Used in biPspbIntroductionQuestionnaire,biPspbIntroductionPageone and biPspbIntroductionPagetwo LWCs.
    * @param darftQuestionIds    List of draft question IDs.
    * @param draftResponseTexts  List of draft response texts.
    * @param inProgressOrCompelete Integer indicating whether the assessment is in progress 
      or complete.
    */
private static Map<String, AssessmentQuestionResponse> existingResponsesMap=new Map<String, AssessmentQuestionResponse>();     
    private static List<AssessmentQuestionResponse> assResList = new List<AssessmentQuestionResponse>();
    private static List<AssessmentQuestionResponse> existingResponsesToUpdate= new List<AssessmentQuestionResponse>();
	private static Set<Id> assessmentIdsToUpdate=new Set<Id>();
    private static List<Assessment> existingAssessments = new List<Assessment>();
    private static String stsOfTheQuestnr;
    private static String assessmentId;
    private static string enrolleeId; 
    private static String activeVersionId;
    //holds the Query result for getting the Assessment Question
    private static List<AssessmentQuestion> listOfAssQuVer;
    //holds the category name
    private static String categoryName;
     private static String pickListValue;
     //this vriable holds the personalisation status.
    public static integer personalizeStatus;
    
    
   @AuraEnabled
public static void mulitipleDraftRecordsInsertion(
    List<String> darftQuestionIds,
    List<String> draftResponseTexts,
    Integer inProgressOrCompelete
) {
    try {
        enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
        if (inProgressOrCompelete != null) {
           personalizeStatus = inProgressOrCompelete;
        } else {
            BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.errorPersnltnStatus, BI_PSP_LetsPersonliseCtrl.class.toString());
            return;
        }

        if (personalizeStatus == 1) {
            pickListValue = BI_PSP_QuestionnaireConstant.complete;
        } else {
            pickListValue = BI_PSP_QuestionnaireConstant.inProgress;
        }

        // Step 2: Check for an existing 'In Progress' assessment for the user.
        // USER_MODE is not used because Assessment is a Salesforce Industry object
        // using Healthcare license.
        if (enrolleeId != null && !String.isBlank(enrolleeId)) {
            String conditions = 'BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\' ' +
                                'AND AssessmentStatus = \'' + BI_PSP_QuestionnaireConstant.inProgress + '\' ' +
                                'AND Name = \'' + BI_PSP_QuestionnaireConstant.introduction + '\' ' +
                                'LIMIT 1';

            List<SObject> queryResult = BI_PSP_CommonQueryUtility.executeQuery(
                'Assessment',
                'Id, Name, AssessmentStatus',
                conditions,
                false
            );

            existingAssessments = (List<Assessment>) queryResult;
        } else {
            BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.patientEnrolleeErrorMsg, BI_PSP_LetsPersonliseCtrl.class.toString());
            return;
        }

        Assessment existingAssessment;

        if (existingAssessments.size() > 0) {
            existingAssessment = existingAssessments[0];
            // Use the existing assessment to associate responses.
            associateResponsesToExistingAssessment(
                existingAssessment.Id,
                darftQuestionIds,
                draftResponseTexts,
                pickListValue
            );
        } else {
            // Create a new assessment if no 'In Progress' assessment exists.
            createNewAssessment(
                darftQuestionIds,
                draftResponseTexts,
                pickListValue,
                enrolleeId
            );
        }
    } catch (Exception ex) {
        BI_PSPB_LogUtilities.exceptionLogMessage(BI_PSP_QuestionnaireConstant.assessmentFailed, BI_PSP_LetsPersonliseCtrl.class.toString(), ex);
    }
}

    /*
     * @Description Helper method to associate responses to an existing assessment.
     * This method updates existing responses or inserts new responses for the provided assessment ID.
     *
     * @param existingAssessmentId   ID of the existing assessment.
     * @param darftQuestionIds       List of draft question IDs.
     * @param draftResponseTexts     List of draft response texts.
     * @param pickListValue          Picklist value for assessment status.
     */
public static void associateResponsesToExistingAssessment(
    String existingAssessmentId,
    List<String> draftQuestionIds,
    List<String> draftResponseTexts,
    String pickListValue
) {
    if (String.isBlank(existingAssessmentId) || draftQuestionIds.isEmpty()) {
        BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse,  BI_PSP_LetsPersonliseCtrl.class.toString());
        return;
    }

   existingResponsesMap = fetchExistingResponses(existingAssessmentId, draftQuestionIds);
   assResList = new List<AssessmentQuestionResponse>();
    existingResponsesToUpdate = new List<AssessmentQuestionResponse>();
    assessmentIdsToUpdate = new Set<Id>();

    populateResponses(
        draftQuestionIds,
        draftResponseTexts,
        existingAssessmentId
    );

    handleUpdates(existingResponsesToUpdate, assessmentIdsToUpdate, pickListValue, assResList);
}

private static Map<String, AssessmentQuestionResponse> fetchExistingResponses(
    String existingAssessmentId,
    List<String> draftQuestionIds
) {
    Map<String, AssessmentQuestionResponse> existingResponsesMap = new Map<String, AssessmentQuestionResponse>();

    if (String.isBlank(existingAssessmentId) || draftQuestionIds.isEmpty()) {
        return existingResponsesMap;
    }

    // Convert List<String> to a comma-separated string for the query
    String conditionQuestionIds = '(\'' + String.join(draftQuestionIds, '\', \'') + '\')';
    String conditions = 'AssessmentQuestionId IN ' + conditionQuestionIds + ' AND AssessmentId = \'' + existingAssessmentId + '\' ORDER BY BI_PSP_ResponseOrder__c ASC';

    // Execute the query using the BI_PSP_CommonQueryUtility class
    List<SObject> queryResult = BI_PSP_CommonQueryUtility.executeQuery(
        'AssessmentQuestionResponse',
        'Id, Assessment.Id, ResponseText, BI_PSP_ResponseOrder__c, AssessmentQuestionId',
        conditions,
        false
    );

    // Cast the result to a list of AssessmentQuestionResponse
    List<AssessmentQuestionResponse> existingResponses = (List<AssessmentQuestionResponse>) queryResult;

    for (AssessmentQuestionResponse existingResponse : existingResponses) {
        existingResponsesMap.put(existingResponse.AssessmentQuestionId, existingResponse);
    }

    return existingResponsesMap;
}

private static void populateResponses(
    List<String> draftQuestionIds,
    List<String> draftResponseTexts,
    String existingAssessmentId
) {
    for (Integer i = 0; i < draftQuestionIds.size(); i++) {
        String questionId = draftQuestionIds[i];
        String responseText = draftResponseTexts[i];
        AssessmentQuestionResponse existingResponse = existingResponsesMap.get(questionId);

        if (existingResponse != null) {
            existingResponse.ResponseText = responseText;
            existingResponsesToUpdate.add(existingResponse);
            assessmentIdsToUpdate.add(existingResponse.Assessment.Id);
        } else {
            addNewResponse(
                assResList,
                questionId,
                responseText,
                existingAssessmentId
            );
        }
    }

    if (existingResponsesToUpdate.isEmpty()) {
        BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse,  BI_PSP_LetsPersonliseCtrl.class.toString());
    }
}

private static void addNewResponse(
    List<AssessmentQuestionResponse> assResList,
    String questionId,
    String responseText,
    String assessmentId
) {
    AssessmentQuestionResponse assRes = new AssessmentQuestionResponse();
    assRes.AssessmentQuestionId = questionId;
    assRes.ResponseText = responseText;
    assRes.AssessmentId = assessmentId;
    assRes.Name = responseText;

    assResList.add(assRes);
}

private static void handleUpdates(
    List<AssessmentQuestionResponse> existingResponsesToUpdate,
    Set<Id> assessmentIdsToUpdate,
    String pickListValue,
    List<AssessmentQuestionResponse> assResList
) {
    updateResponses(existingResponsesToUpdate);
    updateAssessments(assessmentIdsToUpdate, pickListValue);
    insertNewResponses(assResList);
}

private static void updateResponses(List<AssessmentQuestionResponse> existingResponsesToUpdate) {
    if (!existingResponsesToUpdate.isEmpty()) {
        try {
            BI_PSPB_HandleUtitlites.updateAndHandleErrors(
                existingResponsesToUpdate, 
                BI_PSP_LetsPersonliseCtrl.class.toString(),false
            );
        } catch (System.DmlException ex) {
            BI_PSPB_LogUtilities.catchSystemException(
                BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, 
                BI_PSP_LetsPersonliseCtrl.class.toString(), 
                ex
            );
        }
    }
}

private static void updateAssessments(Set<Id> assessmentIdsToUpdate, String pickListValue) {
    try {
        if (assessmentIdsToUpdate.isEmpty() || String.isBlank(pickListValue)) {
            BI_PSPB_LogUtilities.logError(
                BI_PSP_QuestionnaireConstant.emptyAssesment, 
                BI_PSP_LetsPersonliseCtrl.class.toString()
            );
            return;
        }

        // Convert Set<Id> to a List<Id>
        List<Id> assessmentIdList = new List<Id>(assessmentIdsToUpdate);
        // Convert List<Id> to a comma-separated string for the query
        String conditionIds = '(\'' + String.join(assessmentIdList, '\', \'') + '\')';
        String conditions = 'Id IN ' + conditionIds + ' LIMIT 1';
  
        // Execute the query using the BI_PSP_CommonQueryUtility class
        List<SObject> queryResult = BI_PSP_CommonQueryUtility.executeQuery(
            'Assessment',
            'Id, BI_PSP_StatusForPersonalization__c',
            conditions,
            false
        );

        // Cast the result to a list of Assessment
        List<Assessment> assessmentsToUpdate = (List<Assessment>) queryResult;

        if (!assessmentsToUpdate.isEmpty()) {
            // Update the status for the first assessment
            assessmentsToUpdate[0].BI_PSP_StatusForPersonalization__c = pickListValue;

            // Call the handle utilities to update the assessments
            BI_PSPB_HandleUtitlites.updateAndHandleErrors(
                assessmentsToUpdate, 
                BI_PSP_LetsPersonliseCtrl.class.toString(),false
            );
        }
    } catch (System.DmlException ex) {
        BI_PSPB_LogUtilities.catchSystemException(
            BI_PSP_QuestionnaireConstant.assessmentFailed, 
            BI_PSP_LetsPersonliseCtrl.class.toString(), 
            ex
        );
    }
}



private static void insertNewResponses(List<AssessmentQuestionResponse> assResList) {
    if (!assResList.isEmpty()) {
        try {
            BI_PSPB_HandleUtitlites.insertAndHandleErrors(
                assResList, 
                BI_PSP_LetsPersonliseCtrl.class.toString(), 
                false
            );
        } catch (System.DmlException ex) {
            BI_PSPB_LogUtilities.catchSystemException(
                BI_PSP_QuestionnaireConstant.assessmentFailed, 
                BI_PSP_LetsPersonliseCtrl.class.toString(), 
                ex
            );
        }
    }
}

    /*
     *@Description Helper method to create a new assessment and associate responses.
     * This method creates a new assessment record and associates responses to it.
     *
     * @param userId              ID of the user performing the operation.
     * @param darftQuestionIds    List of draft question IDs.
     * @param draftResponseTexts  List of draft response texts.
     * @param pickListValue       Picklist value for assessment status.
     */
    @AuraEnabled
    public static void createNewAssessment(
        List<String> draftQuestionIds,
        List<String> draftResponseTexts,
        String pickListValue,
        String enrolleeId
    ) {
        try {
            //String activeVersionId;
            // String categoryName;
			
            // Loop through the draft question IDs to get the active version ID.
            if (!draftQuestionIds.isEmpty()) {
                activeVersionId = draftQuestionIds[draftQuestionIds.size() - 1]; 
            } else {
                BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.emptyQuestionVersion, BI_PSP_LetsPersonliseCtrl.class.toString());
                return;
            }
            
            // Query the category name based on the active version ID.
            if (activeVersionId != null && !String.isBlank(activeVersionId)) {
                String conditions = 'ActiveVersionId = \'' + activeVersionId + '\'';
                List<SObject> queryResult = BI_PSP_CommonQueryUtility.executeQuery('AssessmentQuestion', 'Id, QuestionCategory', conditions, false);

                    AssessmentQuestion question = (AssessmentQuestion) queryResult[0];
                    categoryName = question.QuestionCategory;
            } else {
                BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.emptyQuestionVersion, BI_PSP_LetsPersonliseCtrl.class.toString());
                return;
            }

            // Create a new Assessment record.
            Assessment insertAssessment = new Assessment();
            insertAssessment.BI_PSP_CareProgramEnrollee__c = enrolleeId;
            insertAssessment.AssessmentStatus = BI_PSP_QuestionnaireConstant.inProgress;
            insertAssessment.Name = categoryName;
            insertAssessment.EffectiveDateTime = DateTime.now();
            insertAssessment.ExpirationDateTime = DateTime.now().addDays(BI_PSP_QuestionnaireConstant.expireDate);
            insertAssessment.BI_PSP_StatusForPersonalization__c = pickListValue;

            List<Id> insertedIds = BI_PSPB_HandleUtitlites.insertAndHandleErrors(new List<Assessment>{ insertAssessment }, BI_PSP_LetsPersonliseCtrl.class.toString(), false);
                
            if (insertedIds.isEmpty()) {
                BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.emptyQuestionVersion, BI_PSP_LetsPersonliseCtrl.class.toString());
                return;
            }

            // Get the Assessment ID after insertion.
            String assId = insertedIds[0];
            
            // Call the method to insert AssessmentQuestionResponse records.
            insertAssessmentResponse(draftQuestionIds, draftResponseTexts, assId);
                                    
        } catch (System.DmlException ex) {
            BI_PSPB_LogUtilities.catchSystemException(BI_PSP_QuestionnaireConstant.assessmentFailed, BI_PSP_LetsPersonliseCtrl.class.toString(), ex);
        }
    }

    private static void insertAssessmentResponse(List<String> darftQuestionIds,List<String> draftResponseTexts,String idOfAssessment)
    {
          List<AssessmentQuestionResponse> assResList = new List<AssessmentQuestionResponse>();
         
                    if (
                        (idOfAssessment != null && !String.isBlank(idOfAssessment)) &&
                        (!draftResponseTexts.isEmpty())
                    ) {
                        for (Integer i = 0; i < darftQuestionIds.size(); i++) {
                            String questionId = darftQuestionIds[i];
                            String responseText = draftResponseTexts[i];

                            AssessmentQuestionResponse assRes = new AssessmentQuestionResponse();
                            assRes.AssessmentQuestionId = questionId;
                            assRes.ResponseText = responseText;
                            assRes.AssessmentId = idOfAssessment;
                            assRes.Name = responseText;

                            assResList.add(assRes);
                        }
                    } else {
                       BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.emptyAssesment, BI_PSP_LetsPersonliseCtrl.class.toString());
                    }

                   BI_PSPB_HandleUtitlites.insertAndHandleErrors(assResList, BI_PSP_LetsPersonliseCtrl.class.toString(), false);

    }
    /*
     * @Description Method for deleting the unselected response from Introduction questionnaire.
     * This method deletes the unselected response identified by the provided response ID.
     *This method is used in biPspbIntroductionPageone and biPspbIntroductionQuestionnaire
     * @param idOfRes  ID of the response to be deleted.
     */

    @AuraEnabled
    public static void draftRespoDeletion(String idOfRes) {
        List<AssessmentQuestionResponse> responseToDelete = new List<AssessmentQuestionResponse>();

        // Step 1: Get the ID of the user performing the deleting.
        try {
            enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
            
            // Check if idOfRes is not null and not blank
            if (idOfRes != null && !String.isBlank(idOfRes)) {
                // Construct the conditions string for the query
                String conditions = 'Id = \'' + idOfRes + '\' AND Assessment.BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\'';
                
                // Use the common query utility method to execute the query
                List<SObject> queryResult = BI_PSP_CommonQueryUtility.executeQuery('AssessmentQuestionResponse', 'Id, Assessment.BI_PSP_CareProgramEnrollee__c', conditions, false);
                
                // Cast the query result to the appropriate type
                for (SObject sobj : queryResult) {
                    responseToDelete.add((AssessmentQuestionResponse) sobj);
                }
            } else {
                BI_PSPB_LogUtilities.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_LetsPersonliseCtrl.class.toString());
            }

            // If responses to delete were found, handle the deletion
            if (!responseToDelete.isEmpty()) {
                BI_PSPB_HandleUtitlites.deleteHandleErrors(responseToDelete, BI_PSP_LetsPersonliseCtrl.class.toString());
            }
        } catch (Exception ex) {
            BI_PSPB_LogUtilities.exceptionLogMessage(BI_PSP_QuestionnaireConstant.respnsNotDeltd, BI_PSP_LetsPersonliseCtrl.class.toString(), ex);
        }
    }
}