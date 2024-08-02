/*
@description      :Apex class to retrieve draft responses for different assessment categories such 
                  as Psoriasis, Work and Activity, and Dermatology. It handles the retrieval of 
                  draft assessment question responses based on the user's role and enrollment 
                  status in the care program.below are the LWCs where this class is used
                  biPspbIntroductionQuestionnaire, biPspbDLQIquestionnaire,biPspbPSSQuestionnaire,
                  biPspbWAPIQuestionnaire,biPspbQSQuestionnaire1,biPspbQSQuestionnaire2.
* History:
* Version   Author      Date            Detail          Description
* 1.0       Abinsha     05-Dec-2023     Created         Initial development.
* 1.1       Abinsha     01-Jan-2024     Updated         Updated for caregiver.
* 1.2       Abinsha     04-Apr-2024     Updated         Catch log added.
*/

public with sharing class BI_PSP_DraftResponseCtrl {
  /**
  * @description Retrieves draft responses for the Psoriasis category.this method is used in
  * biPspbPSSQuestionnaire  LWC component.
  * @return List of draft assessment question responses for the Psoriasis category.
  */
 private static string conditions;
 private static string enrolleeId;
 private static List<AssessmentQuestionResponse> assResList = new List<AssessmentQuestionResponse>();

 public static String buildConditions(String questCatgryName, Boolean twoMonths, String inprogress, String enrolleeId) {
        String conditions = '';
          conditions += 'assessment.BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\'';
         if(questCatgryName ==BI_PSP_QuestionnaireConstant.qualiCategory && twoMonths == true)
         {
             conditions += ' AND ';
             conditions += 'BI_PSP_QsqAfter2months__c = \'' + BI_PSP_QuestionnaireConstant.pageOne + '\'';
         }
       
           if(questCatgryName ==BI_PSP_QuestionnaireConstant.qualiCategory && twoMonths == false)
         {
              conditions += ' AND ';
             conditions += 'BI_PSP_QsqAfterWeeks__c = \'' + BI_PSP_QuestionnaireConstant.pageTwo + '\'';
         }
         conditions += ' AND ';
           conditions += 'Assessment.AssessmentStatus = \'' + BI_PSP_QuestionnaireConstant.inprogress + '\'';
         conditions += ' AND ';
   conditions += 'BI_PSP_Questionnaire_Name__c = \'' + questCatgryName + '\'';
     return conditions;

 }
 
@AuraEnabled(cacheable=true)
public static List<AssessmentQuestionResponse> retrieveDrfatResponses(String questCatgryName, Boolean twoMonths) {
 List<AssessmentQuestionResponse> liAssessRespon = new List<AssessmentQuestionResponse>();
 try {
     enrolleeId =BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
     //questCatName = questCatgryName;
     
     if (enrolleeId != null && !String.isBlank(enrolleeId)) {
         // Build the conditions string
             conditions = buildConditions(questCatgryName, twoMonths, BI_PSP_QuestionnaireConstant.inprogress, enrolleeId);
     }
     else {
       BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyEnrolleRecrd, BI_PSP_DraftResponseCtrl.class.toString(),false,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
       }
             String fields = 'Id, ResponseText, ResponseValue, BI_PSP_Questionnaire_Name__c, BI_PSP_ResponseOrder__c, AssessmentQuestion.Id, Assessment.Id, Assessment.AssessmentStatus';

         // Specify whether to enforce sharing rules
         Boolean withSharingKeywrd = false;
         String orderByClause = 'ORDER BY BI_PSP_ResponseOrder__c ASC';
         conditions += ' ' + orderByClause;
         // Execute the query using the SOQLQueryBuilder
         List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('AssessmentQuestionResponse', fields, conditions, withSharingKeywrd);
         
         // Cast the SObject list to List<AssessmentQuestionResponse>
         for (SObject sObj : sObjectResponses) {
             liAssessRespon.add((AssessmentQuestionResponse) sObj);
         }
     
     if (liAssessRespon.isEmpty()) {
           BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_DraftResponseCtrl.class.toString(),false,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
         }
 } catch (Exception ex) {
 BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSP_DraftResponseCtrl.class.toString(), ex);
 }
 return liAssessRespon;
}


//this method returns the category name of the submitted Questionnaire.
public static String getCategory(List<String> draftQuestionIds) {
 String categoryName;
 String activeVersionId;

 // Check if draftQuestionIds is not empty
 if (!draftQuestionIds.isEmpty()) {
     activeVersionId = draftQuestionIds[0];
 } else {
     BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
     return null;
 }

 // Define query parameters
 String sObjectType = 'AssessmentQuestion';
 String fields = 'Id, QuestionCategory';
 String conditions = 'ActiveVersionId = \'' + activeVersionId + '\' LIMIT 1';
 Boolean withUserMode = false; // Set this to true if user mode is needed

 // Execute the query using the common query method
 List<SObject> queryResults = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

 // Assuming the query only returns one record due to LIMIT 1
 if (!queryResults.isEmpty() && queryResults[0] instanceof AssessmentQuestion) {
     AssessmentQuestion assessmentQuestion = (AssessmentQuestion) queryResults[0];
     categoryName = assessmentQuestion.QuestionCategory;
 } else {
     BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.questionsNotAvailable, BI_PSP_AssessmentCtrl.class.toString(), true, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
     // Handle the case where no category is found
     categoryName = null;
 }

 return categoryName;
}


public static List<AssessmentQuestionResponse> newDraftResponseToInsert(String questionId,String responseText, String existingAssessmentId,Boolean isQsqAfterTwoMonths) {

String catNames = BI_PSP_DraftResponseCtrl.getCategory(new List<String>{questionId});
             AssessmentQuestionResponse assRes = new AssessmentQuestionResponse();
             assRes.AssessmentQuestionId = questionId;
             assRes.ResponseText = responseText;
             assRes.AssessmentId = existingAssessmentId;
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
        return  assResList;    
          
}


 /*For Personalisation field update on assessment object.
    @params isItDraftOrSubmit :-Boolean variable that determines whether the Questionnaire Got Completed or is it a draft.
	@params categoryName:-Questionnaire Category name
	@params existingAssessmentId :-Existing assessment id of the patient.
    */
    public static void updatePersonalisation(Boolean isItDraftOrSubmit, List<String> draftQuestionIds, String existingAssessmentId,Boolean isQsqAfterTwoMonths) {
        // Get category name
        Boolean preventIfAccess;
        String categoryName = BI_PSP_DraftResponseCtrl.getCategory(draftQuestionIds);
        // Determine status based on input conditions
        String stsOfTheQuestnr;
        if (isItDraftOrSubmit) {
            stsOfTheQuestnr = (categoryName == BI_PSP_QuestionnaireConstant.introduction)
                ? BI_PSP_QuestionnaireConstant.inProgress
                : BI_PSP_QuestionnaireConstant.completed;
        } else {
            stsOfTheQuestnr = BI_PSP_QuestionnaireConstant.inProgress;
        }
    
        // Query assessments to update
        String fields = 'Id';
        String conditions = 'Id = \'' + existingAssessmentId + '\'';
        List<SObject> queryResults = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
    
        // Convert query results to List<Assessment> and update records
        List<Assessment> assessmentsToUpdate = new List<Assessment>();
        for (SObject sObj : queryResults) {
            Assessment assessment = (Assessment) sObj;
            assessment.AssessmentStatus = stsOfTheQuestnr;
    		  if(isItDraftOrSubmit ==true && isQsqAfterTwoMonths ==false && categoryName == BI_PSP_QuestionnaireConstant.qualiCategory)
             {
            assessment.BI_PSP_StatusForPersonalization__c = BI_PSP_QuestionnaireConstant.complete;
            preventIfAccess =true;
             }
            if ((categoryName == BI_PSP_QuestionnaireConstant.introduction) ||(categoryName == BI_PSP_QuestionnaireConstant.qualiCategory && preventIfAccess !=true)) {
                assessment.BI_PSP_StatusForPersonalization__c = (isItDraftOrSubmit)
                    ? BI_PSP_QuestionnaireConstant.complete
                    : BI_PSP_QuestionnaireConstant.inProgress;
            }
    
            assessmentsToUpdate.add(assessment);
        }
    
        // Update the assessments in the database if there are any
        if (!assessmentsToUpdate.isEmpty()) {
            BI_PSP_DraftResponseCtrl.updateCurrentUsersExistingResponse(assessmentsToUpdate);
        }
    }
 
 //performs update of assessment responses.
 public static void updateCurrentUsersExistingResponse( List<Assessment> assessmentsToUpdate)
 {
     List<Id> prsnstnUpdate= BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(assessmentsToUpdate, BI_PSP_AssessmentCtrl.class.toString(), false);
      if (prsnstnUpdate.isEmpty()) {
         BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
        }
 }
//Associates the responses submitted by the user to the assessment he finished.
//Method doesnt return anything, just performs insert operation of assessment responses.
public static void insertCurrentUsersExistingAndCurrentResponse( List<AssessmentQuestionResponse> assResList)
 {
     List<Id> insertResponse= BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(assResList, BI_PSP_AssessmentCtrl.class.toString(), false);
        if (insertResponse.isEmpty()) {
         BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyQuestioniareResponse, BI_PSP_AssessmentCtrl.class.toString(), false, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
        }
 }

}