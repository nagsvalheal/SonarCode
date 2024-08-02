/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_SymptomTrackerFetcher {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static List<BI_PSP_Symptom_Tracker__c> fetchSymptomTrackers(
		List<SObject> enrolleeIds
	) {
		Date sevenDaysAgo = System.today().addDays(-7);
        List<BI_PSP_Symptom_Tracker__c> symptomTrackers = [SELECT
				Id,
				BI_PSP_Care_Program_Enrollee__c,
				BI_PSP_Care_Program_Enrollee__r.AccountId,
				BI_PSP_Are_you_currently_experiencing__c,
				BI_PSP_EditEntrydates__c,
				CreatedDate
			FROM BI_PSP_Symptom_Tracker__c
			WHERE
				BI_PSP_Care_Program_Enrollee__c IN :enrolleeIds
            AND BI_PSP_Are_you_currently_experiencing__c = TRUE
				AND CreatedDate >= :sevenDaysAgo
			ORDER BY CreatedDate Desc
			];
        Map<Id, BI_PSP_Symptom_Tracker__c> latestSymptomMap = new Map<Id, BI_PSP_Symptom_Tracker__c>();
				for (BI_PSP_Symptom_Tracker__c symptom : symptomTrackers) {
					latestSymptomMap.put(
						symptom.BI_PSP_Care_Program_Enrollee__c,
						symptom
					);
				}
		return new List<BI_PSP_Symptom_Tracker__c>(latestSymptomMap.values());
	}
}