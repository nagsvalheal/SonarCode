/**
* @description  Used to
    create task when a video is uploaded and calling the method to
    send sms and email.
* History
* Version    Author          Date        Detail      Description
* 1.0        Niyas        24-07-2024        Created        Refactored Version
*/
public with sharing class BI_PSPB_QuestionsSymptomTrackerProcessor {
    /**
     * @description  Used to create task when a video is uploaded and calling the
     * method to send sms and email.
     */
    public static List<Id> processSymptomTrackers(
        Set<Id> enrolleeIds,
        Integer wpaiCount
    ) {
        List<Id> enrolleeRecIds = new List<Id>();
        try {
            List<BI_PSP_Symptom_Tracker__c> symptomTrackers = getEnrolleeQuery(enrolleeIds);
            System.debug('symptomTrackers ' + symptomTrackers);
            if (symptomTrackers.isEmpty()) {
                logRecordNotFound();
                return enrolleeRecIds;
            }

            Map<Id, BI_PSP_Symptom_Tracker__c> latestSymptomMap = buildLatestSymptomMap(symptomTrackers);
            addRecentEnrolleeRecords(enrolleeRecIds, latestSymptomMap, wpaiCount);
            System.debug('enrolleeRecIds ' + enrolleeRecIds);
        } catch (Exception ex) {
            logException(ex);
        }
        return enrolleeRecIds;
    }
        /**
     * @description  Used to create task when a video is uploaded and calling the
     * method to send sms and email.
     */
    private static Map<Id, BI_PSP_Symptom_Tracker__c> buildLatestSymptomMap(List<BI_PSP_Symptom_Tracker__c> symptomTrackers) {
        Map<Id, BI_PSP_Symptom_Tracker__c> latestSymptomMap = new Map<Id, BI_PSP_Symptom_Tracker__c>();
        for (BI_PSP_Symptom_Tracker__c symptom : symptomTrackers) {
            latestSymptomMap.put(symptom.BI_PSP_Care_Program_Enrollee__c, symptom);
        }
        return latestSymptomMap;
    }
        /**
     * @description  Used to create task when a video is uploaded and calling the
     * method to send sms and email.
     */
    private static void addRecentEnrolleeRecords(
        List<Id> enrolleeRecIds,
        Map<Id, BI_PSP_Symptom_Tracker__c> latestSymptomMap,
        Integer wpaiCount
    ) {
        System.debug('latestSymptomMap.values() '+ latestSymptomMap.values());
        for (BI_PSP_Symptom_Tracker__c latestSymptom : latestSymptomMap.values()) {
            if (isRecordWithinDays(latestSymptom, wpaiCount)) {
                enrolleeRecIds.add(latestSymptom.BI_PSP_Care_Program_Enrollee__c);
            }
        }
    }
        /**
     * @description  Used to create task when a video is uploaded and calling the
     * method to send sms and email.
     */
    private static boolean isRecordWithinDays(BI_PSP_Symptom_Tracker__c latestSymptom, Integer wpaiCount) {
        if (latestSymptom.CreatedDate == null) {
            return false;
        }

        Date sevenDaysLaterDate = latestSymptom.CreatedDate.addDays(wpaiCount).date();
        return Date.today() == sevenDaysLaterDate;
    }
        /**
     * @description  Used to create task when a video is uploaded and calling the
     * method to send sms and email.
     */
    private static void logRecordNotFound() {
        BI_PSP_LogMessagesUtility.logError(
            BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
            BI_PSPB_QuestionsSymptomTrackerProcessor.class.toString(),
            false,
            BI_PSPB_NotificatinRmdConstantsCtrl.severityError
        );
    }
        /**
     * @description  Used to create task when a video is uploaded and calling the
     * method to send sms and email.
     */
    private static void logException(Exception ex) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
            '',
            BI_PSPB_QuestionsSymptomTrackerProcessor.class.toString(),
            ex
        );
    }

    /**
     * @description  Used to create task when a video is uploaded and calling the
     * method to send sms and email.
     */
    public static List<BI_PSP_Symptom_Tracker__c> getEnrolleeQuery(Set<Id> enrolleeIds) {
         List<String> enrolleeIdStrings = new List<String>();
    		for (Id id : enrolleeIds) {
        	enrolleeIdStrings.add(id.toString());
    	}
        String conditionIds = '(\'' + String.join(enrolleeIdStrings, '\', \'') + '\')';
        String fields = 'Id, BI_PSP_Care_Program_Enrollee__c, CreatedDate';
        String conditions = 'BI_PSP_Care_Program_Enrollee__c IN ' + conditionIds + ' ORDER BY CreatedDate DESC';
        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('BI_PSP_Symptom_Tracker__c', fields, conditions, false);
        return (List<BI_PSP_Symptom_Tracker__c>) results;
    }
}