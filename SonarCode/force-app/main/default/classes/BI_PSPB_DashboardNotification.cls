/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public without sharing class BI_PSPB_DashboardNotification {
    /**
	 * @description This method is used for general insite notification checking for sending symptomtracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param newTasks The list of Task records being inserted.
	 */
    @AuraEnabled(cacheable=true)
    public static List<Task> getEvents(String cpeId) {
        List<Task> taskList = new List<Task>();
        try {
            Set<Id> relatedIds = new Set<Id>();
             relatedIds.add(cpeId);
            // if (!String.isBlank(accountId)) {
                // CareProgramEnrollee careProgramEnrollee = BI_PSPB_DashboardEnrolleeService.getCareProgramEnrollee(accountId);
                // if (careProgramEnrollee != null) {
                    /*List<BI_PSPB_Treatment_Reminder__c> treatmentList = BI_PSPB_TreatmentReminderRecords.getTreatmentReminders(cpeId);
                    
                    Set<Id> relatedIds = new Set<Id>();
                    relatedIds.add(cpeId);
                    for (BI_PSPB_Treatment_Reminder__c treatment : treatmentList) {
                        relatedIds.add(treatment.Id);
                    }*/

                    List<Task> actionTasks = BI_PSPB_DashboardTaskService.getGetTopNotificationTasks(relatedIds);
                    taskList.addAll(actionTasks);
                // } else {
                //     BI_PSP_LogMessagesUtility.logError(
				// 			BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
				// 			BI_PSPB_TaskRecordCtrlM.class.toString(),
				// 			false,
				// 			BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				// 		);
                // }
            // } else {
            //    BI_PSP_LogMessagesUtility.logError(
			// 				BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
			// 				BI_PSPB_TaskRecordCtrlM.class.toString(),
			// 				false,
			// 				BI_PSPB_NotificatinRmdConstantsCtrl.severityError
			// 			);
            // }
            system.debug('taskList ' + taskList);
        } catch (Exception ex) {
            BI_PSPB_LogUtilities.exceptionLogMessage(
				BI_PSPB_CommunityConstantCtrl.errorWhileFetchingPost,
				BI_PSPB_FeedItemCtrl.class.toString(),
				ex
			);
        }
        return taskList;
    }
}