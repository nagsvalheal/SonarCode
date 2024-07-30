/*
@description       This BI_PSP_QualitativeSatisfactionCtrl  class displays the  QSQ Questonnaire in
                   oustanding Questionnaires page based on the enrollment date of the current user.
				   we use this class in biPspbQualitativeCard.
* History:
* Version	Author		Date			Detail			Description
* 1.0		harish		05-Dec-2023		Created			Initial development.
* 1.1		harish   	01-Jan-2024		Updated			Updated for caregiver.
* 1.2		Abinsha		04-Apr-2024		Updated			Catch log added.
*/
public with sharing class BI_PSP_QualitativeSatisfactionCtrl {
    //used to store the care program enrollee id of the patient.
    private static string enrolleeId;
    //holds care program enrollee record details.
    private static List<CareProgramEnrollee> listOfEnrollee;

    /*@Description this method essentially calculates the target dates based on the CreatedDate of
     *CareProgramEnrollee records and checks if those target dates have passed or not.
     *we use this method in biPspbQualitativeCard.*/

    /*@return this method essentially calculates the target dates based on the CreatedDate of
     *CareProgramEnrollee records and checks if those target dates have passed or not. Then,
     *it returns a map containing information about whether the target dates have passed and
     *the actual target dates themselves.*/

   @AuraEnabled(cacheable=true)
public static Map<String, Object> getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks() {
    Map<String, Object> result = new Map<String, Object>();
    try {
        enrolleeId =BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
        
        if (String.isBlank(enrolleeId)) {
            throw new AuraHandledException(BI_PSP_QuestionnaireConstant.emptyEnrollerecrd);
        }

        List<CareProgramEnrollee> listOfEnrollee = getCareProgramEnrolleeRecords(enrolleeId);
        
        result.put('targetTwoMonthsDate', null);
        result.put('targetFourteenWeeksDate', null);

        if (!listOfEnrollee.isEmpty()) {
            processEnrolleeRecords(listOfEnrollee, result);
        } else {
            BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.errorForDates, BI_PSP_QualitativeSatisfactionCtrl.class.toString(),false,BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
        }

        if (result.isEmpty()) {
            throw new AuraHandledException(BI_PSP_QuestionnaireConstant.errorForDates);
        }
    } catch (Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSP_QuestionnaireConstant.emptyEnrollerecrd, BI_PSP_QualitativeSatisfactionCtrl.class.toString(), ex);
    }
    return result;
}

private static List<CareProgramEnrollee> getCareProgramEnrolleeRecords(String enrolleeId) {
    // Define the fields to retrieve
    String fields = 'Id, Name, ownerid, CreatedDate';

    String conditions = 'Id = \'' + enrolleeId + '\'';
    
    List<SObject> result = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, false);
    
    return (List<CareProgramEnrollee>)result;
}

private static void processEnrolleeRecords(List<CareProgramEnrollee> listOfEnrollee, Map<String, Object> result) {
    for (CareProgramEnrollee enrollee : listOfEnrollee) {
        DateTime targetDateTwoMonths = enrollee.CreatedDate.addDays(BI_PSP_QuestionnaireConstant.twoMonthsInt);
        DateTime targetDateFourteenWks = enrollee.CreatedDate.addDays(BI_PSP_QuestionnaireConstant.fourteenWeeksInt);

        if (targetDateTwoMonths <= DateTime.now()) {
            result.put('targetTwoMonthsDate', targetDateTwoMonths);
        }

        if (targetDateFourteenWks <= DateTime.now()) {
            result.put('targetFourteenWeeksDate', targetDateFourteenWks);
        }
    }
}
}