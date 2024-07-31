/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_AssessmentFetcher {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static List<Id> fetchDueAssessments(
		List<Id> enrolleeRecIds,
		String questionName
	) {
		List<Id> enrolleeSendIds = new List<Id>();
		try {
            List<Assessment> assessmentRecords= getAssessmentQuery(enrolleeRecIds, questionName);
			for (Assessment assessment : assessmentRecords) {
				if (
					assessment.AssessmentStatus ==
					BI_PSPB_ConstantsClassCtrl.inProgressType
				) {
					enrolleeSendIds.add(
						assessment.BI_PSP_CareProgramEnrollee__c
					);
				}
			}

			Map<Id, List<Assessment>> parentChildMap = new Map<Id, List<Assessment>>();

			List<CareProgramEnrollee> parentRecords= getEnrolleeQuery(enrolleeRecIds);
			for (CareProgramEnrollee parent : parentRecords) {
				parentChildMap.put(parent.Id, new List<Assessment>());
			}

            List<Assessment> assessmentChildRecords= getAssessmentChildQuery(new List<Id>(parentChildMap.keySet()), questionName);
			for (Assessment child : assessmentChildRecords) {
				if (
					parentChildMap.containsKey(
						child.BI_PSP_CareProgramEnrollee__c
					)
				) {
					parentChildMap.get(child.BI_PSP_CareProgramEnrollee__c)
						.add(child);
				}
			}

			for (CareProgramEnrollee parent : parentRecords) {
				if (parentChildMap.get(parent.Id).isEmpty()) {
					enrolleeSendIds.add(parent.Id);
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
				BI_PSPB_AssessmentFetcher.class.toString(),
				ex
			);
		}
		return enrolleeSendIds;
	}
    /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
    public static List<Assessment> getAssessmentQuery(List<Id> assessmentIdList, String questionName) {
        String conditionIds = '(\'' + String.join(assessmentIdList, '\', \'') + '\')';
            String fields = 'Id, Name, BI_PSP_CareProgramEnrollee__c, AssessmentStatus, AssessmentRating';
		    String conditions = 'BI_PSP_CareProgramEnrollee__c IN ' + conditionIds + ' ' +
			   'AND (Name = \'' + BI_PSPB_ConstantsClassCtrl.dlqiQuestionName + '\' ' +
               'OR Name = \'' + BI_PSPB_ConstantsClassCtrl.pssQuestionName + '\' ' +
               'OR Name = \'' + BI_PSPB_ConstantsClassCtrl.wpaiQuestionName + '\' ' +
               'OR Name = \'' + BI_PSPB_ConstantsClassCtrl.qsqQuestionName + '\' ' +
               'OR Name = \'' + BI_PSPB_ConstantsClassCtrl.questionnaireRecordName + '\') ' ;
	   		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
        return results;
    }
    /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
    public static List<Assessment> getAssessmentChildQuery(List<Id> assessmentIdList, String questionName) {
        String conditionIds = '(\'' + String.join(assessmentIdList, '\', \'') + '\')';
            String fields = 'Id, Name, BI_PSP_CareProgramEnrollee__c, AssessmentStatus, AssessmentRating';
		    String conditions = 'BI_PSP_CareProgramEnrollee__c IN ' + conditionIds + ' ' +
			   'AND (Name = \'' + questionName + '\' ' +
               'OR Name = \'' + questionName + '\' ' +
               'OR Name = \'' + questionName + '\' ' +
               'OR Name = \'' + questionName + '\' ' +
               'OR Name = \'' + questionName + '\') ' ;
	   		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('Assessment', fields, conditions, false);
        return results;
    }
	public static List<CareProgramEnrollee> getEnrolleeQuery(List<Id> enrolleeList) {
        String conditionIds = '(\'' + String.join(enrolleeList, '\', \'') + '\')';
            String fields = 'Id, CreatedDate';
		    String conditions = 'Id IN ' + conditionIds + ' ' ;
	   		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, false);
        return results;
    }
}