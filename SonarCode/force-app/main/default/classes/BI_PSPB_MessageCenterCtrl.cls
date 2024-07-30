/**
* @description Used to send and display all insite notification
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public without sharing class BI_PSPB_MessageCenterCtrl {
	@AuraEnabled(cacheable=true)
	/**
	* @description Fetching all general notifications for an enrollee.
	* @param enroleeId Enrollee Id of the logged in user.
	* @return Returning all general notifications.
	*/
	public static List<Task> getGeneralNotifyRecords(String enroleeId) {
		List<Task> generalNotifications = new List<Task>();
		try {
			if(String.isBlank(enroleeId)){
				BI_PSP_LogMessagesUtility.logError(
						BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
						BI_PSPB_MessageCenterCtrl.class.toString(),
						false,
						BI_PSPB_NotificatinRmdConstantsCtrl.severityError
					);
			} else {
				generalNotifications = getNotifyRecords(
				enroleeId,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeUnRead
			);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
				BI_PSPB_MessageCenterCtrl.class.toString(),
				ex
			);
		}
		return generalNotifications;
	}

	@AuraEnabled(cacheable=true)
	/**
	* @description Fetching all action notifications.
	* @param enroleeId Enrollee Id of the logged in user.
	* @return Returning all the action notifications.
	*/
	public static List<Task> getActionNotifyRecords(String enroleeId) {
		List<Task> actionNotifications = new List<Task>();
		try {
			if(String.isBlank(enroleeId)){
				BI_PSP_LogMessagesUtility.logError(
						BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
						BI_PSPB_MessageCenterCtrl.class.toString(),
						false,
						BI_PSPB_NotificatinRmdConstantsCtrl.severityError
					);
			}
			else {
				actionNotifications = getNotifyRecords(
				enroleeId,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeAction,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeNotificatonTypeAction
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
				BI_PSPB_MessageCenterCtrl.class.toString(),
				ex
			);
		}
		return actionNotifications;
	}

	@AuraEnabled(cacheable=true)
	/**
	* @description Fetching all history notifications.
	* @param enroleeId Enrollee Id of the logged in user.
	* @return Returning history notifications.
	*/
	public static List<Task> getHistoryNotifyRecords(String enroleeId) {
	List<Task> historyNotifications = new List<Task>();
	try {
		if(String.isBlank(enroleeId)){
			BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_MessageCenterCtrl.class.toString(),
					false,
					BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
		} else {
			historyNotifications = getNotificationRecords(
			enroleeId,
			null,
			null,
			true
			);
		}
	} catch (Exception ex) {
		BI_PSP_LogMessagesUtility.exceptionLogMessage(
		BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
		BI_PSPB_MessageCenterCtrl.class.toString(),
		ex
	  );
	}
	system.debug('historyNotifications'+historyNotifications);
	return historyNotifications;
  }
	/**
	* @description Fetching all notifications.
	* @param enroleeId Enrollee Id of the logged in user.
	* @param notificationType Type of notification.
	* @param status Status of the notification.
	* @param isHistory Checking whether notification is history.
	* @return Returning all notification records.
	*/
	private static List<Task> getNotificationRecords(
	String enroleeId,
	String notificationType,
	String status,
	Boolean isHistory
	) {
		List<SObject> relatedTasks = new List<SObject>();
	try {
		if(String.isBlank(enroleeId)){
			BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_MessageCenterCtrl.class.toString(),
					false,
					BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
		} else {
		String fields =
			'ActivityDate, Description, WhoId, WhatId, OwnerId, ' +
			'Priority, Status, BI_PSP_ChatterType__c, BI_PSP_Category__c, ' +
			'CreatedDate, Subject,BI_PSPB_Treatment_Type__c, BI_PSP_Notification_Type__c';
		String conditions;

	if (isHistory) {
		conditions = 'WhatId = \'' + enroleeId + '\' ' +
		'AND (BI_PSP_Notification_Type__c = \'' + BI_PSPB_ConstantsClassCtrl.actionTypeGeneral + '\' ' +
		'OR BI_PSP_Notification_Type__c = \'' + BI_PSPB_ConstantsClassCtrl.actionTypeAction + '\') ' +
		'AND (Status = \'' + BI_PSPB_ConstantsClassCtrl.notificationStatusComplete + '\' ' +
		'OR Status = \'' + BI_PSPB_ConstantsClassCtrl.notificationStatusNotComplete + '\' ' +
		'OR Status = \'' + BI_PSPB_ConstantsClassCtrl.actionTypeRead + '\' ' +
		'OR Status = \'' + BI_PSPB_ConstantsClassCtrl.actionTypeNotificationTypeExpired + '\') ' +
		'ORDER BY CreatedDate DESC';
	} else {
		conditions ='WhatId = \'' +enroleeId +'\' ' +
			'AND BI_PSP_Notification_Type__c = \'' +notificationType +
			'\' ' +'AND Status = \'' +status +'\' ' +
			'ORDER BY CreatedDate DESC';
	}
	relatedTasks = BI_PSP_CommonQueryUtility.executeQuery(
		'Task',
		fields,
		conditions,
		false
	);
}
	} catch (Exception ex) {
		BI_PSP_LogMessagesUtility.exceptionLogMessage(
		BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
		BI_PSPB_MessageCenterCtrl.class.toString(),
		ex
	);
	}
	return relatedTasks;
	}

	/**
	* @description Calling the method to fetch all the notifications
	* @param enroleeId Enrollee Id of the logged in user.
	* @param notificationType Type of notification.
	* @param status Status of the notification.
	* @return Returning the notification records.
	*/
	private static List<Task> getNotifyRecords(
	String enroleeId,
	String notificationType,
	String status
	) {
	List<Task> notificationRecords = new List<Task>();
	try {
		if(String.isBlank(enroleeId)){
			BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_MessageCenterCtrl.class.toString(),
					false,
					BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
		} else{
			notificationRecords = getNotificationRecords(
			enroleeId,
			notificationType,
			status,
			false
			);
		}
	} catch (Exception ex) {
		BI_PSP_LogMessagesUtility.exceptionLogMessage(
		BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
		BI_PSPB_MessageCenterCtrl.class.toString(),
		ex
	);
	}
	return notificationRecords;
	}
}