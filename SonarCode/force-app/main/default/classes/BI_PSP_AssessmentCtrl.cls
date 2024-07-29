/*
* @description       This class provides methods to retrieve questionnaire questions for different categories
                     such as Work & Activity Impairment (WPAI), Introduction, Psoriasis Symptom Scale (PSS), 
                     Dermatology Life Quality Index (DLQI), and Qualitative satisfaction questionnaire.
                     It also includes methods to handle the insertion of assessment records, including completed 
                     assessments and drafts, and methods to get the status of assessments and counts of completed
                     assessments of the current user.
* History:
* Version   Author      Date            Detail          Description
* 1.0       Abinsha     05-Dec-2023     Created         Initial development.
* 1.1       Abinsha     01-Jan-2024     Updated         Updated for caregiver.
* 1.2       Abinsha     04-Apr-2024     Updated         Catch log added.
*/

public with sharing class BI_PSP_AssessmentCtrl {
    // Holds the label for completed assessment status.
    private static String completed = System.Label.BI_PSP_Completed;
    // Stores the ID of the assessment record.
    private static String assessmentId;
    // Stores the expiration date for the Psoriasis Symptom Scale (PSS) questionnaire.
    private static Date expireDatePss;
    // Stores the expiration date for the Work & Activity Impairment (WAI) questionnaire.
    private static Date expireDateWai;
    // Stores the expiration date for the Dermatology Life Quality Index (DLQI) questionnaire.
    private static Date expireDateDlqi;
    // Stores the ID of the Care Program Enrollee associated with the assessment.
    private static string enrolleeId;
    // Stores the introduction category label for the questionnaire.
    private static String introduction = System.Label.BI_PSP_IntroductionTxt;
    // Stores the Psoriasis Symptom Scale (PSS) category label for the questionnaire.
    private static String pss = System.Label.BI_PSP_PssCategory;
    // Stores the Work & Activity Impairment (WAI) category label for the questionnaire.
    private static String wapiCategory = System.Label.BI_PSP_WapiCategory;
    // Stores the Dermatology Life Quality Index (DLQI) category label for the questionnaire.
    private static String dlqiCategory = System.Label.BI_PSP_DlqiCategory;
    // Stores the Qualitative satisfaction questionnaire category label.
    private static String qualiCategory = System.Label.BI_PSP_QualitativeCategory;
    // Stores the label for the 'In Progress' status of an assessment.
    private static String inProgress = System.Label.BI_PSP_InProgressTxt;
    //holds the label for expired text.
    private static String expiredLabel = System.Label.BI_PSP_Expired;
    //holds the label for active text.
    private static String active = System.Label.BI_PSP_Active;
    // Stores the expiration date for the Qualitative satisfaction questionnaire.
    private static Integer expireDate = Integer.valueOf(
        System.Label.BI_PSP_ExpireDateForQualitative
    );
    //varibale that holds the application name retrieved from Custom Settings.
    private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues(
        'PSPB'
    );
    //A variable That holds the name of our application to be used in catch exception handler.
    private static string applicationName = settings != null
        ? settings.BI_SFCOE_LOG_Application__c
        : '';
    //holds the error message.
    private static String errorMsg='';
    //custom label for Assesssment Questions query when the result  is empty.
    private static String questionsNotAvailable = System.Label.BI_PSP_QuestionsUnavailable;
    //custom label for displaying an error message if the patinece enrollement details are null.
    private static String emptyEnrolleeRecrd = System.Label.BI_PSP_EmptyCareProgramEnrl;
    //Custom label for care givers patient.
    private static String caregiversPatientAccountErr = System.Label.BI_PSP_CaregiversPatient;
    //custom label that displays an error message when there is no account records for the selected patient.
    private static String caregiversSelectedPatientErrmsg = System.Label.BI_PSP_SelectedPatientAccount;
    // custom label that displays an error message when there is no careProgramEnrollee records for the selected patient.
    private static String selctdPatientEnrolleeErrorMsg = System.Label.BI_PSP_SelectedPatientEnrollee;
    // custom label that displays an error message when there is no Account records for the patient.
    private static String patientAccountErrorMsg = System.Label.BI_PSP_PatientAccountError;
    // custom label that displays an error message when there is no care program enrollee records for the patient.
    private static String patientEnrolleeErrorMsg = System.Label.BI_PSP_PatientEnrolleeError;
    // custom label that displays an error message when the submit functionality of the assessment fails.
    private static String submitErrormsg = System.Label.BI_PSP_SubmitErrorMsg;
    // custom label that displays an error message when there is no Assessmnet Record.
    private static String emptyAssesment = System.Label.BI_PSP_EmptyAssessment;
    // custom label that displays an error message when there is no AssessmnetQuestionResponse Record.
    private static String emptyQuestionaResponse = System.Label.BI_PSP_EmptyQuestionResponse;
    // custom label that displays an error message when there is no AssessmnetQuestionVersion Record.
    private static String emptyQuestionVersion = System.Label.BI_PSP_EmptyQuestionVersion;
    // custom label that displays an error message when there is no rollout date present.
    private static String rolloutDateErrorMessage = System.Label.BI_PSP_RolloutErrorMsg;
    //List that holds Account Records.
    private static List<Account> caregiverAccount;
    //List that holds Account Records.
    private static List<Account> enrolleeAcount;
    //List that holds CareProgramEnrollee Records
    private static List<CareProgramEnrollee> enrolleeRecord;
    //List that holds Account Records
    private static List<Account> patientAccount;
    //List that holds CareProgramEnrollee Records
    private static List<CareProgramEnrollee> enrolledPatient;
    //List that holds AssessmentQuestion Records
    private static List<AssessmentQuestion> assessmentQuestions;
    //hold the Question id performed by the user
    private static String activeVersionId;
    //holds the Query result for getting the Assessment Question
    private static List<AssessmentQuestion> listOfAssQuVer;
    //holds the category name
    private static String categoryName;
    //variable that holds category
    private static String category;
    //varible that hold the count of answered Questions
    private static Integer answeredQuestions;
    //variable that holds active Questions
    private static Integer activeQuestionCount;
    //Variable that holds the number of assessments
    private static List<Integer> assessmentCounts;
    //Vraible that holds the initial rollout Questionnaire Dates
    private static List<BI_PSP_Questionnaire_Setups__c> questionnairesDate;
    //This variable holds the category name of the question.
    private static String emptyCategoryName = System.Label.BI_PSP_EmptyCategoryError;
    //This label states that the submission assessment has failed.
    private static String assessmentFalied = System.Label.BI_PSP_AssessmentSubFailed;
    //holds an assessment thats status is completed.
    private static List<Assessment> assessments;
    /**
     * @Description AuraEnabled method to retrieve the count of answered questions in a category for a given assessment.
     * Retrieves the category name from the Assessment record based on the provided assessment ID.
     * Retrieves the count of answered questions in the category from the AssessmentQuestionResponse object.
     * We use this method in biPspbPSSCompletedQuestionnaires,biPspbPsoriasisCard,biPspbPSSQuestionnaire,biPspbQSQuestionnaire1,
     * biPspbQSQuestionnaire2,biPspbQualitativeCard,biPspbQualitativeCompletedQuestionnaire,
     * biPspbQualitativeCompletedQuestionnaire2,biPspbWapiCard,biPspbWapiCompletedQuestionnaire,biPspbWAPIQuestionnaire,
     * biPspbIntroductionCard,biPspbIntroductionPageone, biPspbIntroductionPagetwo biPspbIntroductionQuestionnaire,
     * biPspbDlqiCard,biPspbDlqiCompletedQuestionnaire,biPspbDLQIquestionnaire LWC components.
     * @param assessmentId The ID of the assessment
     * @return The count of answered questions in the category
     */

    @AuraEnabled(cacheable=true)
    public static Integer getCategoryStatus(String assessmentId) {
        try {
            // Query to get category from the AssessmentQuestionResponse
            if (assessmentId != null && !String.isBlank(assessmentId)) {
                // USER_MODE is not used because Assessment is an Salesforce Industry object using
                //Healthcare license.
                category = [
                    SELECT Name
                    FROM Assessment
                    WHERE Id = :assessmentId
                    LIMIT 1
                ][0]
                .Name;
            } else {
                BI_SFCOE_LOG_Util.logMessage(
                    applicationName,
                    BI_PSP_AssessmentCtrl.class.toString(),
                    '',
                    System.now(),
                    emptyAssesment,
                    BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
            }
            // Query to get the count of answered questions in the category
            if (category != null && !String.isBlank(category)) {
                // USER_MODE is not used because AssessmentQuestionResponse is an Salesforce Industry
                //object using Healthcare license.
                answeredQuestions = [
                    SELECT COUNT()
                    FROM AssessmentQuestionResponse
                    WHERE
                        AssessmentId = :assessmentId
                        AND BI_PSP_Questionnaire_Name__c = :category
                ];
            } else {
                BI_SFCOE_LOG_Util.logMessage(
                    applicationName,
                    BI_PSP_AssessmentCtrl.class.toString(),
                    '',
                    System.now(),
                    emptyAssesment,
                    BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
            }
            if (answeredQuestions < 0 ) {
                BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),
                    '',System.now(),emptyQuestionaResponse,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
                throw new AuraHandledException(emptyQuestionaResponse);
            }
        } catch (Exception ex) {BI_SFCOE_LOG_Util.handleException(ex,applicationName,BI_PSP_AssessmentCtrl.class.toString(),
                null,System.now());throw new AuraHandledException(emptyCategoryName);
        }
        return answeredQuestions;
    }

    /**
     * @Description AuraEnabled method to retrieve the total count of active questions in a specified category.
     * Retrieves the count of active questions from the AssessmentQuestionVersion object.
     * Filters the questions by the provided category name and status 'Active'.
     * Returns the total count of active questions in the category.
     * We use this method in biPspbPSSQuestionnaire LWC component.
     * @param categoryname The name of the category.
     * @return The total count of active questions in the specified category.
     */

    @AuraEnabled(cacheable=true)
    public static Integer getTotalquestionscount(String categoryname) {
        try {
            // USER_MODE is not used because AssessmentQuestionVersion is an Salesforce Industry
            //object using Healthcare license.
            if (categoryname != null && !String.isBlank(categoryname)) {
                activeQuestionCount = [
                    SELECT COUNT()
                    FROM AssessmentQuestionVersion
                    WHERE
                        status = :active
                        AND AssessmentQuestion.QuestionCategory = :categoryname
                ];
            }
            if (activeQuestionCount < 0 ) {
                BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),
                    '',System.now(),emptyQuestionVersion,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR);
                throw new AuraHandledException(emptyQuestionVersion);
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(ex,applicationName,BI_PSP_AssessmentCtrl.class.toString(),null,System.now()
            );
            throw new AuraHandledException(emptyCategoryName);
        }
        return activeQuestionCount;
    }

    /**
     * @Description AuraEnabled method to create a new Assessment record with predefined values.
     * Creates a new Assessment record with AssessmentStatus set to 'Completed'.
     * Name set to 'Introduction', and EffectiveDateTime and ExpirationDateTime set to current time and
     * future expiration date respectively.
     * Inserts the newly created Assessment record into the database.
     * If an exception occurs during the process, it is caught, logged, and handled gracefully.
     * We use this method in All of the Completed Questionnaire Components such as biPspbQualitativeCompletedQuestionnaire2,
     * biPspbQualitativeCompletedQuestionnaire,biPspbWapiCompletedQuestionnaire,biPspbPSSCompletedQuestionnaires,
     * biPspbDlqiCompletedQuestionnaire
     * @return this method returns a list of integers that has the count of number of assessments present for a specific user.
     */

    @AuraEnabled(cacheable=true)
    public static List<Integer> getAssessmentCountsByCurrentUserName() {
        try {
            String currentUserName = UserInfo.getName();
            String currentUserEmail = UserInfo.getUserEmail();
            //We are getting custom field from User Object. Hence we have to use SOQL.
            User currentUser = [
                SELECT Id, Name, BI_PSPB_Caregiver__c
                FROM User
                WHERE name = :currentUserName
                WITH USER_MODE
                LIMIT 1
            ];

            if (currentUser.BI_PSPB_Caregiver__c == false) {
                patientAccount = [
                    SELECT id, Name, PersonEmail
                    FROM account
                    WHERE
                        PersonEmail = :currentUserEmail
                        AND Name = :currentUserName
                    WITH USER_MODE
                ];
                if (!patientAccount.isEmpty()) {
                    // USER_MODE is not used because CareProgramEnrollee is an Salesforce Industry
                    //object using Healthcare license.
                    enrolledPatient = [
                        SELECT id, Name
                        FROM CareProgramEnrollee
                        WHERE AccountID = :patientAccount[0].id
                    ];
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',System.now(),
                        patientAccountErrorMsg,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
                if (!enrolledPatient.isEmpty()) {
                    enrolleeId = enrolledPatient[0].id;
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',System.now(),
                        patientEnrolleeErrorMsg,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
            } else if (currentUser.BI_PSPB_Caregiver__c == true) {
                caregiverAccount = [
                    SELECT Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c
                    FROM Account
                    WHERE
                        Name = :currentUserName
                        AND PersonEmail = :currentUserEmail
                        AND IsPersonAccount = TRUE
                        AND BI_PSPB_Selected_Patient_ID__c != NULL
                    WITH USER_MODE
                ];
                if (!caregiverAccount.isEmpty()) {
                    enrolleeAcount = [
                        SELECT id, Name, PersonEmail
                        FROM account
                        WHERE
                            id = :caregiverAccount[0]
                                .BI_PSPB_Selected_Patient_ID__c
                        WITH USER_MODE
                    ];
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',System.now(),
                        caregiversPatientAccountErr,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
                if (!enrolleeAcount.isEmpty()) {
                    // USER_MODE is not used because CareProgramEnrollee is an Salesforce Industry
                    //object using Healthcare license.
                    enrolleeRecord = [
                        SELECT id, Name
                        FROM CareProgramEnrollee
                        WHERE AccountID = :enrolleeAcount[0].id
                    ];
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',System.now(),
                        caregiversSelectedPatientErrmsg,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
                if (!enrolleeRecord.isEmpty()) {
                    enrolleeId = enrolleeRecord[0].id;
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),
                        '',System.now(),selctdPatientEnrolleeErrorMsg,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
            }
            // USER_MODE is not used because Assessment is an Salesforce Industry
            //object using Healthcare license.
            if (enrolleeId != null && !String.isBlank(enrolleeId)) {
                assessments = [
                    SELECT
                        Id,
                        Name,
                        AssessmentStatus,
                        EffectiveDateTime,
                        ExpirationDateTime
                    FROM Assessment
                    WHERE
                        BI_PSP_CareProgramEnrollee__c = :enrolleeId
                        AND (AssessmentStatus = :completed
                        OR AssessmentStatus = :expiredLabel)
                ];
            } else {
                BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),
                    '',System.now(),emptyEnrolleeRecrd,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
            }
            Map<String, Integer> assessmentCountMap = new Map<String, Integer>{
                'Work & Activity Impairment (WPAI)' => 0,
                'Psoriasis Symptom Scale (PSS)' => 0,
                'Dermatology Life Quality Index (DLQI)' => 0,
                'Qualitative satisfaction questionnaire' => 0
            };
            if (!assessments.isEmpty()) {
                for (Assessment ass : assessments) {
                    if (assessmentCountMap.containsKey(ass.Name)) {
                        assessmentCountMap.put(
                            ass.Name,
                            assessmentCountMap.get(ass.Name) + 1
                        );
                    }
                }
            } else {
                BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',System.now(),
                    emptyAssesment,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
            }
            // Convert the map values to a list
            assessmentCounts = new List<Integer>(assessmentCountMap.values());
          
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSP_AssessmentCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(emptyQuestionaResponse);
        }
        return assessmentCounts;
    }

    /**
     * @Description Retrieves the counts of completed assessments for the current user.
     * Queries the database for assessments associated with the current user's Care Program Enrollee ID.
     * Counts the number of completed assessments for each predefined assessment type.
     * Returns a list of integers representing the counts of completed assessments for each type.
     * We use this method in All of the Outstanding Questionnaires.In Component such as biPspbIntroductionQuestionnaire,
     * biPspbDLQIquestionnaire,biPspbPSSQuestionnaire,biPspbWAPIQuestionnaire,biPspbQSQuestionnaire1,biPspbQSQuestionnaire2.
     * @return List<Integer> A list of integers representing the counts of completed assessments for each predefined
     * assessment type.
     */
    //Questionnaires
    @AuraEnabled(cacheable=true)
    public static List<Integer> getCompletedAssessmentCountsByCurrentUserName() {
        try {
            String currentUserName = UserInfo.getName();
            String currentUserEmail = UserInfo.getUserEmail();
            //We are getting custom field from User Object. Hence we have to use SOQL
            User currentUser = [
                SELECT Id, Name, BI_PSPB_Caregiver__c
                FROM User
                WHERE name = :currentUserName
                WITH USER_MODE
                LIMIT 1
            ];
            if (currentUser.BI_PSPB_Caregiver__c == false) {
                patientAccount = [
                    SELECT id, Name, PersonEmail
                    FROM account
                    WHERE
                        PersonEmail = :currentUserEmail
                        AND Name = :currentUserName
                    WITH USER_MODE
                ];
                if (!patientAccount.isEmpty()) {
                    // USER_MODE is not used because CareProgramEnrollee is an Salesforce Industry
                    //object using Healthcare license.
                    enrolledPatient = [
                        SELECT Id, Name
                        FROM CareProgramEnrollee
                        WHERE AccountID = :patientAccount[0].id
                    ];

                    if (!enrolledPatient.isEmpty()) {
                        enrolleeId = enrolledPatient[0].id;
                    }
                } else {
                    BI_SFCOE_LOG_Util.logMessage(
                        applicationName,
                        BI_PSP_AssessmentCtrl.class.toString(),
                        '',
                        System.now(),
                        patientAccountErrorMsg,
                        BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                    
                }
            } else if (currentUser.BI_PSPB_Caregiver__c == true) {
                caregiverAccount = [
                    SELECT Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c
                    FROM Account
                    WHERE
                        Name = :currentUserName
                        AND PersonEmail = :currentUserEmail
                        AND IsPersonAccount = TRUE
                        AND BI_PSPB_Selected_Patient_ID__c != NULL
                    WITH USER_MODE
                ];
                if (!caregiverAccount.isEmpty()) {
                    enrolleeAcount = [
                        SELECT id, Name, PersonEmail
                        FROM account
                        WHERE id = :caregiverAccount[0].BI_PSPB_Selected_Patient_ID__c
                        WITH USER_MODE
                    ];
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),
                        '',System.now(),caregiversPatientAccountErr,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
                if (!enrolleeAcount.isEmpty()) {
                    // USER_MODE is not used because CareProgramEnrollee is an Salesforce Industry
                    //object using Healthcare license.
                    enrolleeRecord = [
                        SELECT id, Name
                        FROM CareProgramEnrollee
                        WHERE AccountID = :enrolleeAcount[0].id
                    ];
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',
                    System.now(),caregiversSelectedPatientErrmsg,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR);
                }
                if (!enrolleeRecord.isEmpty()) {
                    enrolleeId = enrolleeRecord[0].id;
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),
                        '',System.now(),selctdPatientEnrolleeErrorMsg,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
            }
            // USER_MODE is not used because Assessment is an Salesforce Industry
            //object using Healthcare license.
            if (enrolleeId != null && !String.isBlank(enrolleeId)) {
                assessments = [
                    SELECT
                        Id,
                        Name,
                        AssessmentStatus,
                        EffectiveDateTime,
                        ExpirationDateTime
                    FROM Assessment
                    WHERE
                        BI_PSP_CareProgramEnrollee__c = :enrolleeId
                        AND AssessmentStatus = :completed
                ];
            } else {
                BI_SFCOE_LOG_Util.logMessage(
                    applicationName,
                    BI_PSP_AssessmentCtrl.class.toString(),
                    '',
                    System.now(),
                    emptyEnrolleeRecrd,
                    BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
            }
            Map<String, Integer> assessmentCountMap = new Map<String, Integer>{
                'Work & Activity Impairment (WPAI)' => 0,
                'Psoriasis Symptom Scale (PSS)' => 0,
                'Dermatology Life Quality Index (DLQI)' => 0,
                'Qualitative satisfaction questionnaire' => 0
            };
            if (!assessments.isEmpty()) {
                for (Assessment ass : assessments) {
                    if (assessmentCountMap.containsKey(ass.Name)) {
                        assessmentCountMap.put(
                            ass.Name,
                            assessmentCountMap.get(ass.Name) + 1
                        );
                    }
                }
            } else {
                BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',
                    System.now(),emptyAssesment,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR);
            }

            // Convert the map values to a list
            assessmentCounts = new List<Integer>(assessmentCountMap.values());
            if (assessmentCounts.isEmpty()) {
                BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',
                    System.now(),emptyAssesment,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
                throw new AuraHandledException(emptyAssesment);
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSP_AssessmentCtrl.class.toString(),
                null,
                System.now()
            );

            throw new AuraHandledException(emptyAssesment);
        }
        return assessmentCounts;
    }

    /**
     * @Description Retrieves the rollout dates of questionnaires for the current user's care program enrollee.
     * Queries the database for the current user's care program enrollee ID based on whether the user is a caregiver or not.
     * Retrieves the rollout dates of questionnaires associated with the care program enrollee.
     * We use this method in All the Questionnaire Cards in the Outastnding Questionnaire Page.
     * @return List<BI_PSP_Questionnaire_Setups__c> A list of BI_PSP_Questionnaire_Setups__c records containing the rollout
     * dates of questionnaires.
     */

    @AuraEnabled(cacheable=true)
    public static List<BI_PSP_Questionnaire_Setups__c> getRolloutdate() {
        try {
            String currentUserName = UserInfo.getName();
            String currentUserEmail = UserInfo.getUserEmail();
            //We are getting custom field from User Object. Hence we have to use SOQL
            User currentUser = [
                SELECT Id, Name, BI_PSPB_Caregiver__c
                FROM User
                WHERE name = :currentUserName
                WITH USER_MODE
                LIMIT 1
            ];
            if (currentUser.BI_PSPB_Caregiver__c == false) {
                patientAccount = [
                    SELECT id, Name, PersonEmail
                    FROM account
                    WHERE
                        PersonEmail = :currentUserEmail
                        AND Name = :currentUserName
                    WITH USER_MODE
                ];
                // USER_MODE is not used because CareProgramEnrollee is an Salesforce Industry
                //object using Healthcare license.
                if (!patientAccount.isEmpty()) {
                    enrolledPatient = [
                        SELECT id, Name
                        FROM CareProgramEnrollee
                        WHERE AccountID = :patientAccount[0].id
                    ];
                } else {
                    BI_SFCOE_LOG_Util.logMessage(
                        applicationName,
                        BI_PSP_AssessmentCtrl.class.toString(),
                        '',
                        System.now(),
                        patientAccountErrorMsg,
                        BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
                if (!enrolledPatient.isEmpty()) {
                    enrolleeId = enrolledPatient[0].id;
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',
                    System.now(),patientEnrolleeErrorMsg,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
            } else if (currentUser.BI_PSPB_Caregiver__c == true) {
                caregiverAccount = [
                    SELECT Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c
                    FROM Account
                    WHERE
                        Name = :currentUserName
                        AND PersonEmail = :currentUserEmail
                        AND IsPersonAccount = TRUE
                        AND BI_PSPB_Selected_Patient_ID__c != NULL
                    WITH USER_MODE
                ];
                if (!caregiverAccount.isEmpty()) {
                    enrolleeAcount = [
                        SELECT Id, Name, PersonEmail
                        FROM Account
                        WHERE
                            Id = :caregiverAccount[0]
                                .BI_PSPB_Selected_Patient_ID__c
                        WITH USER_MODE
                    ];
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',
                    System.now(),caregiversPatientAccountErr,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
                if (!enrolleeAcount.isEmpty()) {
                    // USER_MODE is not used because CareProgramEnrollee is an Salesforce Industry
                    //object using Healthcare license.
                    enrolleeRecord = [
                        SELECT Id, Name
                        FROM CareProgramEnrollee
                        WHERE AccountID = :enrolleeAcount[0].Id
                    ];
                }
                if (!enrolleeRecord.isEmpty()) {
                    enrolleeId = enrolleeRecord[0].Id;
                } else {
                    BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',
                        System.now(),selctdPatientEnrolleeErrorMsg,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                    );
                }
            }
            if (enrolleeId != null && !String.isBlank(enrolleeId)) {
                /*USER_MODE is not used because we have populated a lookup field thats related to CareProgramEnrollee
                 * which is a Salesforce Industry object using Healthcare license.*/
                questionnairesDate = [
                    SELECT
                        Id,
                        Name,
                        BI_PSP_DLQI_RollOutDate__c,
                        BI_PSP_PSS_RollOutDate__c,
                        BI_PSP_WAI_RollOutDate__c
                    FROM BI_PSP_Questionnaire_Setups__c
                    WHERE BI_PSP_CareProgramEnrollee__c = :enrolleeId
                ];
            }
            if (questionnairesDate.isEmpty()) {
                BI_SFCOE_LOG_Util.logMessage(applicationName,BI_PSP_AssessmentCtrl.class.toString(),'',
                    System.now(),rolloutDateErrorMessage,BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                );
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSP_AssessmentCtrl.class.toString(),
                null,
                System.now()
            );

            throw new AuraHandledException(rolloutDateErrorMessage);
        }
        return questionnairesDate;
        }
}