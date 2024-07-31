/**
@description Class used for retrieving care programm erolle with challenges associated 
and updating challenges related values.
Reason for using whithout sharing is we use Care Program Enrollee, 
which is a Health Cloud object;
hence, we cannot utilize user mode here.
History:
Version    Author      Date              Detail         Description
1.0        Gowsic N    5-Dec-2023        Created        Initial development
1.1        Saran S     20-Apr-2024       Updated        Add log, null check, descriptions   
*/
public without sharing class BI_PSP_ChallengeCtrl {

/**
 * @description Updates challenges based on provided parameters.
 * @param challenge The ID of the challenge to be updated.
 * @param activeAvailable The status of the challenge (active, available, or completed).
 * @param userId The ID of the user performing the update.
 * @return List of ChallengeWrapper objects containing the update status and any error messages.
 * @throws AuraHandledException If any validation fails or an error occurs during execution.
 */

    @AuraEnabled
    public static list<ChallengeWrapper> updateChallenges(
    String challenge,
    String activeAvailable,
    String userId
) {
    try {
        validateInputs(challenge, activeAvailable);

        Award challengetoUpdate = getAward(challenge);
        challengetoUpdate.BI_PSP_Status__c = getChallengeStatus(activeAvailable);
		list<HealthCloudGA__CareProgramPlanTemplate__c> careProgramValues = getCareProgram(challengetoUpdate.BI_PSP_Care_Program_Plan_Template__r.Id);
        //HealthCloudGA__CareProgramPlanTemplate__c careProgram = careProgramValues[0];
        HealthCloudGA__CarePlanTemplate__c carePlan = getTrackingChallenge(careProgramValues[0].HealthCloudGA__CarePlanTemplate__r.Id, challengetoUpdate);

        List<Assessment> assesList = getAssessments(challengetoUpdate.BI_PSP_Care_Program_Enrollee__r.Id);
        ChallengeWrapper successMessage = validateChallenge(activeAvailable, carePlan, assesList, userId, challengetoUpdate);

        if (successMessage != null && successMessage.error == null) {
            saveAward(challengetoUpdate);
        }

        List<ChallengeWrapper> successList = new List<ChallengeWrapper>{ successMessage };
        return successList.isEmpty() ? throwErrorList() : successList;

    } catch (Exception ex) {
        return handleException(ex);
    }
}
/**
 * @description Validates the input parameters.
 * @param challenge The challenge parameter to be validated.
 * @param activeAvailable The activeAvailable parameter to be validated.
 * @throws AuraHandledException If any parameter is blank.
 */
private static void validateInputs(String challenge, String activeAvailable) {
    if (String.isBlank(challenge) || String.isBlank(activeAvailable)) {
		
        throw new AurahandledException(BI_PSP_ChallengeConstantCtrl.challengesErrorMessage);
    }
}

/**
 * @description Retrieves an Award record based on the given challenge ID.
 * @param challenge The ID of the challenge.
 * @return The Award record associated with the challenge ID.
 */
private static Award getAward(String challenge) {
    // Define the SObject type and query parameters
    String sObjectType = 'Award';
    String fields = 'Id, BI_PSP_Care_Program_Enrollee__r.Id, BI_PSP_Care_Program_Enrollee__c, BI_PSP_Care_Program_Plan_Template__r.Id, BI_PSP_Status__c, BI_PSP_Care_Program_Plan_Template__c';
    String conditions = 'Id = \'' + challenge + '\'';
    Boolean withSharingKeyword = FALSE; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Type-cast the first result to Award
    Award awardRecord = (Award)resultList[0];

    // Return the Award record
    return awardRecord;
}

/**
 * @description Retrieves the challenge status based on the activeAvailable parameter.
 * @param activeAvailable The activeAvailable parameter to determine the status.
 * @return The challenge status.
 * @throws AuraHandledException If the activeAvailable parameter does not match any known status.
 */


private static String getChallengeStatus(String activeAvailable) {
    if (activeAvailable == BI_PSP_ChallengeConstantCtrl.challengeActive) {
		
        return BI_PSP_ChallengeConstantCtrl.challengeActive;
		
    } else if (activeAvailable == BI_PSP_ChallengeConstantCtrl.challengeAvailable) {
		
        return BI_PSP_ChallengeConstantCtrl.challengeAvailable;
		
    } else if (activeAvailable == BI_PSP_ChallengeConstantCtrl.challengeCompleted) {
		
        return BI_PSP_ChallengeConstantCtrl.challengeCompleted;
		
    } else {
        throw new AurahandledException(BI_PSP_ChallengeConstantCtrl.challengesErrorMessage);
    }
}

/**
 * @description Retrieves CareProgramPlanTemplate records based on the given plan template ID.
 * @param planTemplateId The ID of the plan template.
 * @return List of CareProgramPlanTemplate records.
 * @throws AuraHandledException If no records are found.
 */

private static List<HealthCloudGA__CareProgramPlanTemplate__c> getCareProgram(String planTemplateId) {
    // Define the query parameters
    String sObjectType = 'HealthCloudGA__CareProgramPlanTemplate__c';
    String fields = 'Id, Name, HealthCloudGA__CarePlanTemplate__r.Id';
    String conditions = 'Id = \'' + planTemplateId + '\'';
    Boolean withSharingKeyword = FALSE; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Type-cast the result to List<HealthCloudGA__CareProgramPlanTemplate__c>
    List<HealthCloudGA__CareProgramPlanTemplate__c> careProgramList = (List<HealthCloudGA__CareProgramPlanTemplate__c>)resultList;

    // Handle the case where no records are found
    if (careProgramList.isEmpty()) {
        throw new AurahandledException(BI_PSP_ChallengeConstantCtrl.challengesErrorMessage);
    }

    // Return the list of Care Program Plan Templates
    return careProgramList;
}

/**
 * @description Retrieves a CarePlanTemplate record based on the given care plan template ID.
 * @param carePlanTemplateId The ID of the care plan template.
 * @param challangersId The ID of the challenger.
 * @return The CarePlanTemplate record or a new CarePlanTemplate object if no valid care plan is found.
 */


private static HealthCloudGA__CarePlanTemplate__c getTrackingChallenge(String carePlanTemplateId, Award challangersId) {
    // Define the query parameters
    String sObjectType = 'HealthCloudGA__CarePlanTemplate__c';
    String fields = 'Id, Name, BI_PSP_Challenge_Level__c, HealthCloudGA__Description__c';
    
    // Construct the conditions string
    String conditions = 'Id = \'' + String.escapeSingleQuotes(carePlanTemplateId) + '\' AND ' +
        'HealthCloudGA__Description__c IN (' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_SymptomOne) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_SymptomTwo) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_QuestionnaireLevelOne) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_QuestionnaireLevelTwo) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_QuestionnaireLevelThree) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_IamRegularLevelOne) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_IamRegularLevelTwo) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_IamRegularLevelThree) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_GppExpertLevelOne) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_GppExpertLevelTwo) + '\', ' +
        '\'' + String.escapeSingleQuotes(System.Label.BI_PSP_GppExpertLevelThree) + '\'' +
        ')';
        
    Boolean withSharingKeyword = FALSE;
    


    // Execute the query using the common query utility
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Check if any results were returned
    if (!resultList.isEmpty()) {
        return (HealthCloudGA__CarePlanTemplate__c) resultList[0];
    } else {
        // Perform fallback operation if no matching care plan is found
        saveAward(challangersId);

        // Return a new HealthCloudGA__CarePlanTemplate__c object to indicate no valid care plan was found
        return new HealthCloudGA__CarePlanTemplate__c();
    }
}
/**
 * @description Retrieves Assessment records based on the given enrollee ID.
 * @param enrolleeId The ID of the enrollee.
 * @return List of Assessment records.
 */
private static List<Assessment> getAssessments(String enrolleeId) {
    // Define the query parameters
    String sObjectType = 'Assessment';
    String fields = 'Id, Name, AssessmentStatus, BI_PSP_DateForCQ__c, BI_PSP_CareProgramEnrollee__c';
    String conditions = 'BI_PSP_CareProgramEnrollee__c = \'' + enrolleeId + '\'';
    Boolean withSharingKeyword = FALSE; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Type-cast the result to List<Assessment>
    List<Assessment> assessmentsList = (List<Assessment>)resultList;

    // Return the list of assessments
    return assessmentsList;
}
/**
 * @description Validates the challenge and returns a ChallengeWrapper object with the update status.
 * @param activeAvailable The status of the challenge (active, available, or completed).
 * @param carePlan The CarePlanTemplate record.
 * @param assesList The list of Assessment records.
 * @param userId The ID of the user performing the validation.
 * @param challengetoUpdate The Award record to be updated.
 * @return ChallengeWrapper object containing the update status and any error messages.
 */

private static ChallengeWrapper validateChallenge(String activeAvailable, HealthCloudGA__CarePlanTemplate__c carePlan, List<Assessment> assesList, String userId, Award challengetoUpdate) {
    ChallengeWrapper successMessage = new ChallengeWrapper();
    
    if (activeAvailable == BI_PSP_ChallengeConstantCtrl.challengeCompleted) {
        if (isSymptomLevel(carePlan)) {
            return validateSymptomTrackerByLevel(carePlan, challengetoUpdate, successMessage);
        } else if (isQuestionnaireLevel(carePlan)) {
            return validateAssessmentByLevel(carePlan, assesList, challengetoUpdate, successMessage);
        } else if (isRegularLevel(carePlan)) {
            return validateLoginHistoryByLevel(carePlan, userId, challengetoUpdate, successMessage);
        } else if (isGppExpertLevel(carePlan)) {
            return validateArticleLikeByLevel(carePlan, challengetoUpdate, successMessage);
        }
    } else {
        successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    }
    
    return successMessage;
}

private static Boolean isSymptomLevel(HealthCloudGA__CarePlanTemplate__c carePlan) {
    return carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_SymptomOne || 
           carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_SymptomTwo || 
           carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_SymptomThree;
}

private static ChallengeWrapper validateSymptomTrackerByLevel(HealthCloudGA__CarePlanTemplate__c carePlan, Award challengetoUpdate, ChallengeWrapper successMessage) {
    if (carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_SymptomOne && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelOne) {
        return validateSymptomTracker(challengetoUpdate, successMessage, 1, BI_PSP_ChallengeConstantCtrl.completeOneSt);
    } else if (carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_SymptomTwo && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelTwo) {
        return validateSymptomTracker(challengetoUpdate, successMessage, 4, BI_PSP_ChallengeConstantCtrl.completeFourSt);
    } else if (carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_SymptomThree && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelThree) {
        successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    }
    return successMessage;
}

private static Boolean isQuestionnaireLevel(HealthCloudGA__CarePlanTemplate__c carePlan) {
    return carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_QuestionnaireLevelOne || 
           carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_QuestionnaireLevelTwo || 
           carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_QuestionnaireLevelThree;
}

private static ChallengeWrapper validateAssessmentByLevel(HealthCloudGA__CarePlanTemplate__c carePlan, List<Assessment> assesList, Award challengetoUpdate, ChallengeWrapper successMessage) {
    if (carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_QuestionnaireLevelOne && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelOne) {
        return validateAssessment(assesList, challengetoUpdate, BI_PSP_ChallengeConstantCtrl.assessmentWpai, successMessage, BI_PSP_ChallengeConstantCtrl.completeWpai);
    } else if (carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_QuestionnaireLevelTwo && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelTwo) {
        return validateAssessment(assesList, challengetoUpdate, BI_PSP_ChallengeConstantCtrl.assessmentPss, successMessage, BI_PSP_ChallengeConstantCtrl.completePss);
    } else if (carePlan.HealthCloudGA__Description__c == System.Label.BI_PSP_QuestionnaireLevelThree && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelThree) {
        return validateAssessment(assesList, challengetoUpdate, BI_PSP_ChallengeConstantCtrl.assessmentDlqi, successMessage, BI_PSP_ChallengeConstantCtrl.completeDlqi);
    }
    return successMessage;
}

private static Boolean isRegularLevel(HealthCloudGA__CarePlanTemplate__c carePlan) {
    return carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelOne || 
           carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelTwo || 
           carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelThree;
}

private static ChallengeWrapper validateLoginHistoryByLevel(HealthCloudGA__CarePlanTemplate__c carePlan, String userId, Award challengetoUpdate, ChallengeWrapper successMessage) {
    if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelOne && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelOne) {
        return validateLoginHistory(userId, challengetoUpdate, 4, successMessage);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelTwo && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelTwo) {
        return validateLoginHistory(userId, challengetoUpdate, 8, successMessage);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.iamRegularLevelThree && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelThree) {
        return validateLoginHistory(userId, challengetoUpdate, 15, successMessage);
    }
    return successMessage;
}

private static Boolean isGppExpertLevel(HealthCloudGA__CarePlanTemplate__c carePlan) {
    return carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.gppExpertLevelOne || 
           carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.gppExpertLevelTwo || 
           carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.gppExpertLevelThree;
}

private static ChallengeWrapper validateArticleLikeByLevel(HealthCloudGA__CarePlanTemplate__c carePlan, Award challengetoUpdate, ChallengeWrapper successMessage) {
    if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.gppExpertLevelOne && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelOne) {
        return validateArticleLike(challengetoUpdate, 2, successMessage);
        
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.gppExpertLevelTwo && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelTwo) {
        return validateArticleLike(challengetoUpdate, 5, successMessage);
    } else if (carePlan.HealthCloudGA__Description__c == BI_PSP_ChallengeConstantCtrl.gppExpertLevelThree && carePlan.BI_PSP_Challenge_Level__c == BI_PSP_ChallengeConstantCtrl.challengeLevelThree) {
        return validateArticleLike(challengetoUpdate, 10, successMessage);
    }
    return successMessage;
}



private static ChallengeWrapper validateSymptomTracker(Award challengetoUpdate, ChallengeWrapper successMessage, Integer requiredCount, String errorMessage) {
    // Define the query parameters
    String sObjectType = 'BI_PSP_Symptom_Tracker__c';
    String fields = 'Id, BI_PSP_Care_Program_Enrollee__c';
    String conditions = 'BI_PSP_Care_Program_Enrollee__c = \'' + challengetoUpdate.BI_PSP_Care_Program_Enrollee__r.Id + '\' AND BI_PSP_EditEntrydates__c = THIS_MONTH';
    Boolean withSharingKeyword = FALSE; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Type-cast the result to List<BI_PSP_Symptom_Tracker__c>
    List<BI_PSP_Symptom_Tracker__c> validateSymptom = (List<BI_PSP_Symptom_Tracker__c>)resultList;

    // Update successMessage based on the validation result
    if (validateSymptom.size() >= requiredCount) {
        successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    } else {
        successMessage.error = errorMessage;
        successMessage.percentage = (Decimal) validateSymptom.size() / requiredCount * 100;
    }

    // Return the updated successMessage
    return successMessage;
}


private static ChallengeWrapper validateAssessment(List<Assessment> assesList,Award challengetoUpdate, String assessmentName, ChallengeWrapper successMessage, String errorMessage) {
    Boolean validOne = false;
    for (Assessment asseloop : assesList) {
        if (asseloop.Name.contains(assessmentName) && asseloop.AssessmentStatus == BI_PSP_ChallengeConstantCtrl.assessmentStatusCompleted && asseloop.BI_PSP_DateForCQ__c != null) {
            validOne = true;
            break;
        }
    }
    if (validOne) {
       successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    } else {
        successMessage.error = errorMessage;
        successMessage.percentage = 0;
    }
    return successMessage;
}

private static String padLeft(String input, Integer length, String padChar) {
    while (input.length() < length) {
        input = padChar + input;
    }
    return input;
}


private static ChallengeWrapper validateLoginHistory(String userId, Award challengetoUpdate, Integer requiredCount, ChallengeWrapper successMessage) {
    // Define start and end date of the month
    Date startDateOfMonth = Date.today().toStartOfMonth();
    Date endDateOfMonth = startDateOfMonth.addMonths(1).addDays(-1);
    
    // Construct DateTime values for SOQL query
    DateTime startDateTime = DateTime.newInstance(startDateOfMonth, Time.newInstance(0, 0, 0, 0));
    DateTime endDateTime = DateTime.newInstance(endDateOfMonth, Time.newInstance(23, 59, 59, 999));
    
    // Define the query parameters
    String sObjectType = 'LoginHistory';
    String fields = 'Id, UserId, LoginTime, Status, LoginType';
    String conditions = 'UserId = \'' + String.escapeSingleQuotes(userId) + '\' AND ' +
                        'LoginTime >= ' + startDateTime.format('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'') + ' AND ' +
                        'LoginTime <= ' + endDateTime.format('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'');
    Boolean withSharingKeyword = true;

    // Execute the query using the common query utility
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Process the results
    Set<Integer> uniqueDates = new Set<Integer>();
    for (SObject record : resultList) {
        LoginHistory logHistory = (LoginHistory) record;
        if (logHistory.Status == BI_PSP_ChallengeConstantCtrl.loginSuccess) {
            uniqueDates.add(logHistory.LoginTime.dayGMT());
        }
    }

    Integer uniqueDateCount = uniqueDates.size();
    if (uniqueDateCount >= requiredCount) {
        successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    } else {
        successMessage.error = BI_PSP_ChallengeConstantCtrl.completeFourSt + uniqueDateCount + BI_PSP_ChallengeConstantCtrl.currentlyCompleted;
        successMessage.percentage = (Decimal) uniqueDateCount / requiredCount * 100;
    }

    return successMessage;
}

private static ChallengeWrapper validateArticleLike(Award challengetoUpdate, Integer requiredCount, ChallengeWrapper successMessage) {
    // Define the query parameters
    String sObjectType = 'BI_PSPB_Article_like__c';
    String fields = 'BI_PSPB_CareProgramEnrollee__c, BI_PSPB_Reaction__c';
    String conditions = 'BI_PSPB_CareProgramEnrollee__c = \'' + challengetoUpdate.BI_PSP_Care_Program_Enrollee__r.Id + '\' AND BI_PSPB_Reaction__c = \'' + BI_PSP_ChallengeConstantCtrl.view + '\'';
    Boolean withSharingKeyword = FALSE; // or false, based on your requirement

    // Execute the query using the utility class
    List<SObject> resultList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withSharingKeyword);

    // Type-cast the result to List<BI_PSPB_Article_like__c>
    List<BI_PSPB_Article_like__c> articleLikeRecords = (List<BI_PSPB_Article_like__c>)resultList;

    // Update successMessage based on the count of article likes
    if (articleLikeRecords.size() >= requiredCount) {
       
        successMessage.challengeUpdated = challengetoUpdate;
        successMessage.percentage = 100;
    } else {
        
        successMessage.error = BI_PSP_ChallengeConstantCtrl.completeFourSt + articleLikeRecords.size() + BI_PSP_ChallengeConstantCtrl.currentlyCompleted;
        successMessage.percentage = (Decimal) articleLikeRecords.size() / requiredCount * 100;
    }

    // Return the updated successMessage
    return successMessage;
}
/**
 * @description Saves the given Award record.
 * @param challengetoUpdate The Award record to be saved.
 */

private static void saveAward(Award challengetoUpdate) {
    
   BI_PSPB_HandleUtitlites.updateAndHandleErrors(new List<Award>{ challengetoUpdate },BI_PSP_ChallengeCtrl.class.toString(),FALSE);
}
/**
 * @description Returns an error list with a default error message.
 * @return List of ChallengeWrapper objects containing the error message.
 */
private static List<ChallengeWrapper> throwErrorList() {
    throw new AurahandledException(BI_PSP_ChallengeConstantCtrl.challengesErrorMessage);
}
/**
 * @description Handles exceptions and returns a list of ChallengeWrapper objects containing the error message.
 * @param ex The exception to be handled.
 * @return List of ChallengeWrapper objects containing the error message.
 */
private static List<ChallengeWrapper> handleException(Exception ex) {
    ChallengeWrapper errorMessage = new ChallengeWrapper();
    errorMessage.error = ex.getMessage();
    List<ChallengeWrapper> errorList = new List<ChallengeWrapper>{ errorMessage };
    BI_SFCOE_LOG_Util.handleException(ex, BI_PSP_ChallengeConstantCtrl.applicationName, BI_PSP_ChallengeCtrl.class.toString(), null, System.now());
    return errorList.isEmpty() ? throwErrorList() : errorList;
}



 
/**
@description Wrapper class to hold information about a patient enrollee and any error messages.
*/
public class EnrollWrapper {
/* The patient enrollee information.*/
@AuraEnabled
public CareProgramEnrollee patientEnrolle;

/** Any error message associated with the patient enrollee.*/
@AuraEnabled
public String error;
}

/** @description Wrapper class for Challenge details including the updated challenge, error message, and completion percentage.*/
public class ChallengeWrapper {
// AuraEnabled attributes to be exposed to the client side

// The updated challenge
@AuraEnabled
public Award challengeUpdated;

// Error message if an exception occurs
@AuraEnabled
public String error;

// Completion percentage of the challenge
@AuraEnabled
public Decimal percentage;
}
/**
@description Wrapper class to represent common attributes of a challenge.
This class is used to structure data related to challenges in Aura-enabled components.
*/
public class ChallengeWrapperCommon {
// Represents the available challenge Id
@AuraEnabled
public String availableChallenge;

// Represents the challenge Id to update
@AuraEnabled
public String challengeIdToUpdate;

// Represents the rank of the challenge image
@AuraEnabled
public String imageRank;
}
}