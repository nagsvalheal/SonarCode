/*
@description       This class provides methods to retrieve dates for Assessment cards in progress for 
                   different categories like PSS, WAPI, and DLQI.It interacts with Assessment and custom objects 
                   to fetch relevant dates based on the current user's role and context.
* History:
* Version	Author		Date			Detail			Description.
* 1.0		Abinsha		05-Dec-2023		Created			Initial development.
* 1.1		Abinsha 	01-Jan-2024		Updated			Updated for caregiver.
* 1.2		Abinsha		04-Apr-2024		Updated			Catch log added.
*/
public with sharing class BI_PSP_AssessmentManagementCtrl {
 
    public static List<AssessmentQuestionResponse> assResList = new List<AssessmentQuestionResponse>();
    public static List<AssessmentQuestionResponse> existingResponsesToUpdate= new List<AssessmentQuestionResponse>();
	public static Set<Id> assessmentIdsToUpdate=new Set<Id>();
    public static List<Assessment> existingAssessments = new List<Assessment>();
    private static String stsOfTheQuestnr;
    private static String assessmentId;
    private static string enrolleeId; 
    private static String activeVersionId;
    //holds the Query result for getting the Assessment Question
    private static List<AssessmentQuestion> listOfAssQuVer;
    //holds the category name.
    private static String categoryName;
   	 private static List<CareProgramEnrollee> caregiverEnrollee;
    private static DateTime timeOfQsqEnrllee;


    @AuraEnabled
public static void mulitipleDraftRecordsInsertion(
    List<String> darftQuestionIds,
    List<String> draftResponseTexts,
    Boolean isItDraftOrSubmit,
    Boolean isQsqAfterTwoMonths
) {
    try {
        // Check for null or empty inputs
        if ((darftQuestionIds == null || darftQuestionIds.isEmpty()) || 
            (draftResponseTexts == null || draftResponseTexts.isEmpty())) {
            throw new IllegalArgumentException(BI_PSP_QuestionnaireConstant.falseParemeter);
        }

        String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
        String categoryName = getCategory(darftQuestionIds);

        String fields = 'Id';
        String conditions = 'BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\'' +
                            ' AND AssessmentStatus = \'' + BI_PSP_QuestionnaireConstant.inProgress + '\'' +
                            ' AND Name = \'' + categoryName + '\'';

        // Use the common query utility to execute the query
        List<SObject> existingAssessments = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);

        Assessment existingAssessment;
        if (!existingAssessments.isEmpty()) {
            existingAssessment = (Assessment) existingAssessments[0];
            String existingAssessmentId = existingAssessment.Id;
            updateExistingResponses(existingAssessmentId, darftQuestionIds, draftResponseTexts, isItDraftOrSubmit);
        } else {
            createNewAssessment(darftQuestionIds, draftResponseTexts, enrolleeId, isItDraftOrSubmit, isQsqAfterTwoMonths);
        }
    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSP_AssessmentCtrl.class.toString(), ex);
    }
}
    
    private static void createNewAssessment(List<String> qstns, List<String> respnones, String enroleeids, Boolean isItDraftOrSubmit, Boolean isQsqAfterTwoMonths) {
    String questionnaireName = getCategory(qstns);

    DateTime timeOfQsqEnrllee = getEnrolleeCreationDate(enroleeids);

    Assessment ass = initializeAssessment(enroleeids, questionnaireName, isItDraftOrSubmit, isQsqAfterTwoMonths, timeOfQsqEnrllee);

    List<Id> insertedIds = BI_PSPB_HandleUtitlites.insertAndHandleErrors(new List<Assessment>{ ass }, BI_PSP_AssessmentManagementCtrl.class.toString(), false);
    ass.Id = insertedIds[0];
     // Check if the insertion was successful
    if (!String.isEmpty(ass.Id)) {
        associateNewAssessmentResponses(qstns, respnones, ass.Id, isQsqAfterTwoMonths, questionnaireName);
    }else{
        BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.assessmentFailed, BI_PSP_AssessmentManagementCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
    }
        
}

private static DateTime getEnrolleeCreationDate(String enroleeids) {
    List<CareProgramEnrollee> caregiverEnrollee = [
        SELECT Id, Name, CreatedDate
        FROM CareProgramEnrollee
        WHERE Id = :enroleeids
    ];

    return caregiverEnrollee.isEmpty() ? null : caregiverEnrollee[0].CreatedDate;
}

private static Assessment initializeAssessment(String enroleeids, String questionnaireName, Boolean isItDraftOrSubmit, Boolean isQsqAfterTwoMonths, DateTime timeOfQsqEnrllee) {
    
    Assessment ass = new Assessment();
    ass.BI_PSP_CareProgramEnrollee__c = enroleeids;
    ass.Name = questionnaireName;

    if (isItDraftOrSubmit) {
        ass.BI_PSP_StatusForPersonalization__c = BI_PSP_QuestionnaireConstant.complete;
        ass.AssessmentStatus = questionnaireName == BI_PSP_QuestionnaireConstant.introduction ? BI_PSP_QuestionnaireConstant.inProgress : BI_PSP_QuestionnaireConstant.completed;
    } else {
        ass.BI_PSP_StatusForPersonalization__c = BI_PSP_QuestionnaireConstant.inProgress;
        ass.AssessmentStatus = BI_PSP_QuestionnaireConstant.inProgress;
    }

    if (timeOfQsqEnrllee != null && questionnaireName == BI_PSP_QuestionnaireConstant.qualiCategory) {
        ass.BI_PSP_RolloutforCompletedQuestionnarie__c = timeOfQsqEnrllee.addDays(
            isQsqAfterTwoMonths ? BI_PSP_QuestionnaireConstant.twoMonthsInt : BI_PSP_QuestionnaireConstant.fourteenWeeksInt
        );
    }

    ass.EffectiveDateTime = DateTime.now();
    ass.ExpirationDateTime = DateTime.now().addDays(BI_PSP_QuestionnaireConstant.expireDate);

    return ass;
}
    
   private static void associateNewAssessmentResponses(List<String> qstns, List<String> respnones ,String assIds,Boolean isQsqAfterTwoMonths,String catNames)
   {
       	 List<Id> newResponseResults =new  List<Id> ();
        for (Integer i = 0; i < qstns.size(); i++) {
                String questionId = qstns[i];
                String responseText = respnones[i];

                AssessmentQuestionResponse assRes = new AssessmentQuestionResponse();
                assRes.AssessmentQuestionId = questionId;
                assRes.ResponseText = responseText;
                assRes.AssessmentId = assIds;
                assRes.Name = responseText;
            	if(isQsqAfterTwoMonths == true && catNames==BI_PSP_QuestionnaireConstant.qualiCategory)
                {
                assRes.BI_PSP_QsqAfter2months__c = BI_PSP_QuestionnaireConstant.pageOne;
                }
                else if(isQsqAfterTwoMonths == false && catNames==BI_PSP_QuestionnaireConstant.qualiCategory)
                {
                    assRes.BI_PSP_QsqAfterWeeks__c = BI_PSP_QuestionnaireConstant.pageTwo;
                }

                assResList.add(assRes);
            }
            //for (Database.Error error : responseSaveResult.getErrors()) {
            // Insert all records outside of the loop
            if (!assResList.isEmpty()) {
                
            newResponseResults= BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(assResList, BI_PSP_AssessmentCtrl.class.toString(), false);
            
            }
            if (newResponseResults.isEmpty()) {
       			BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
   }
    
    
    private static void updateExistingResponses(String existingAssessmentId,List<String> darftQuestionIds,List<String> draftResponseTexts,Boolean isItDraftOrSubmit)
    {
        
      List<AssessmentQuestionResponse> listOfResponses= [SELECT
                Id,
                Assessment.Id,
                ResponseText,
                BI_PSP_ResponseOrder__c,
                AssessmentQuestionId
            FROM AssessmentQuestionResponse
            WHERE
                AssessmentQuestionId IN :darftQuestionIds
                AND AssessmentId = :existingAssessmentId
            ORDER BY BI_PSP_ResponseOrder__c ASC
        ];
        
        List<Id> existingUpdateResults =new  List<Id> ();
        for (AssessmentQuestionResponse existingResponse : listOfResponses) {
            BI_PSP_QuestionnaireConstant.existingResponsesMap.put(existingResponse.AssessmentQuestionId, existingResponse);
            assessmentIdsToUpdate.add(existingResponse.Assessment.Id);
        }
    

        for (Integer i = 0; i < darftQuestionIds.size(); i++) {
            String questionId = darftQuestionIds[i];
            String responseText = draftResponseTexts[i];
            AssessmentQuestionResponse existingResponse = BI_PSP_QuestionnaireConstant.existingResponsesMap.get(questionId);

            if (existingResponse != null) {
                // Update existing response
                existingResponse.ResponseText = responseText;
                existingResponsesToUpdate.add(existingResponse);
            } else {
                // Create new response
                AssessmentQuestionResponse assRes = new AssessmentQuestionResponse();
                assRes.AssessmentQuestionId = questionId;
                assRes.ResponseText = responseText;
                assRes.AssessmentId = existingAssessmentId;
                assRes.Name = responseText;

                assResList.add(assRes);
            }
        }
    

    // Update existing responses
    if (!existingResponsesToUpdate.isEmpty()) {
        //Database.update(BI_PSP_QuestionnaireConstant.existingResponsesToUpdate, false);
      existingUpdateResults= BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(existingResponsesToUpdate, BI_PSP_AssessmentCtrl.class.toString(), false);

    }        
     if (existingUpdateResults.isEmpty()) {
       			BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
    updatePersonalisation(isItDraftOrSubmit,darftQuestionIds,existingAssessmentId);
        
    if (!assResList.isEmpty()) {
        insertCurrentUsersExistingAndCurrentResponse(assResList);
    }
    }
    
    /*For Personalisation field update on assessment object.
    @params isItDraftOrSubmit :-Boolean variable that determines whether the Questionnaire Got Completed or is it a draft.
	@params categoryName:-Questionnaire Category name
	@params existingAssessmentId :-Existing assessment id of the patient.
    */
      private static void  updatePersonalisation(Boolean isItDraftOrSubmit,List<String> darftQuestionIds,String existingAssessmentId)
    {
     String categoryName = getCategory(darftQuestionIds);
     if(isItDraftOrSubmit ==true && categoryName != BI_PSP_QuestionnaireConstant.introduction)
    {
        stsOfTheQuestnr=BI_PSP_QuestionnaireConstant.completed;
    }
	if(isItDraftOrSubmit ==true && categoryName == BI_PSP_QuestionnaireConstant.introduction)
    {
        stsOfTheQuestnr=BI_PSP_QuestionnaireConstant.inProgress;
    }
    if(isItDraftOrSubmit ==false)
    {
        stsOfTheQuestnr=BI_PSP_QuestionnaireConstant.inProgress;
    }
        
   List<Assessment> assessmentsToUpdate = new List<Assessment>();
    if (!assessmentIdsToUpdate.isEmpty()) {
        assessmentsToUpdate = [
            SELECT Id
            FROM Assessment
            WHERE Id = :existingAssessmentId
        ];
    }

    for (Assessment assessmentRecord : assessmentsToUpdate) {
        assessmentRecord.AssessmentStatus = stsOfTheQuestnr;
        //update personalisation as complete once the user submits lets personalise Questionnaire.
        if(isItDraftOrSubmit ==true && categoryName == BI_PSP_QuestionnaireConstant.introduction)
      {
        assessmentRecord.BI_PSP_StatusForPersonalization__c=BI_PSP_QuestionnaireConstant.complete;
      }
        //update personalisation as in progress once the user drafts the lets personalise Questionnaire.
       if(isItDraftOrSubmit ==false && categoryName == BI_PSP_QuestionnaireConstant.introduction)
    {
          assessmentRecord.BI_PSP_StatusForPersonalization__c=BI_PSP_QuestionnaireConstant.inProgress;
    }
 }
    //perosnalisation status update.
    if (!assessmentsToUpdate.isEmpty()) {
        updateCurrentUsersExistingResponse(assessmentsToUpdate);
        }
    }
     //performs update of assessment responses.
     private static void updateCurrentUsersExistingResponse( List<Assessment> assessmentsToUpdate)
     {
         List<Id> prsnstnUpdate= BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(assessmentsToUpdate, BI_PSP_AssessmentCtrl.class.toString(), false);
          if (prsnstnUpdate.isEmpty()) {
       			BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
     }
    //Associates the responses submitted by the user to the assessment he finished.
    //Method doesnt return anything, just performs insert operation of assessment responses.
     private static void insertCurrentUsersExistingAndCurrentResponse( List<AssessmentQuestionResponse> assResList)
     {
         List<Id> insertResponse= BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(assResList, BI_PSP_AssessmentCtrl.class.toString(), false);
            if (insertResponse.isEmpty()) {
       			BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
     }
    
   //this method returns the category name of the submitted Questionnaire.
   private static String getCategory(List<String> draftQuestionIds) {
    String categoryName;
    String activeVersionId;
       
    if (!draftQuestionIds.isEmpty()) {
        activeVersionId = draftQuestionIds[0];
    } else {
         BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_AssessmentCtrl.class.toString(), false,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
    }

    listOfAssQuVer = [
        SELECT Id, QuestionCategory
        FROM AssessmentQuestion
        WHERE ActiveVersionId = :activeVersionId
        LIMIT 1
    ];

    if (!listOfAssQuVer.isEmpty()) {
        categoryName = listOfAssQuVer[0].QuestionCategory;
    } else {
        BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_AssessmentCtrl.class.toString(), true,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
        // Handle the case where no category is found
        categoryName = null;
    }

    return categoryName;
}

}