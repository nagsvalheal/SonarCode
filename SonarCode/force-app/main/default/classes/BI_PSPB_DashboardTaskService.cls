/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public class BI_PSPB_DashboardTaskService {
               /**
	 * @description This method is used for general insite notification checking for sending symptomtracker, challenges,
	 * and community SMS, Email, and Insite Notification.
	 * @param newTasks The list of Task records being inserted.
	 */ 
    public static List<Task> getGetTopNotificationTasks(Set<Id> relatedIds) {
        String conditionIds = '(\'' + String.join(relatedIds, '\', \'') + '\')';
        String fields = 'Id, Subject, CreatedDate, Status, BI_PSP_ChatterFeedId__c, BI_PSP_Category__c, BI_PSP_ChatterType__c, BI_PSP_Notification_Type__c';
        String conditions = 'WhatId IN ' + conditionIds + ' ' +
			   'AND (BI_PSP_Notification_Type__c = \'' + BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeAction + '\' ' +
               'OR BI_PSP_Notification_Type__c = \'' + BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral + '\') ' +
               'AND (Status = \'' + BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeUnRead + '\' ' +
               'OR Status = \'' + BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeNotificatonTypeAction + '\') ORDER BY CreatedDate DESC ';

        // Execute query and return results as List<Task>
        List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('Task', fields, conditions, false);
        return results;
    }
}