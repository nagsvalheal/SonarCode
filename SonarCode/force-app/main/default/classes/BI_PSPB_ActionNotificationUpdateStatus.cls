/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public without sharing class BI_PSPB_ActionNotificationUpdateStatus {
    /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	@AuraEnabled(cacheable=false)
	public static void updateActionTreatmentStatus(String recordId, String actionValue) {
		try {
			if (String.isBlank(recordId) || String.isBlank(actionValue)) {
				logErrorRecordNotFound();
				return;
			}

			Task taskObj = BI_PSPB_ActionTaskService.getTask(recordId);
			if (taskObj == null) {
				logErrorRecordNotFound();
				return;
			}

			List<BI_PSPB_Treatment_Reminder__c> treatmentReminderRecs = BI_PSPB_ActionService.getTreatmentReminders(taskObj.WhatId, 'Prescription');
			updateTaskAndReminders(taskObj, treatmentReminderRecs, actionValue);
		} catch (Exception ex) {
			logException(ex);
		}
	}

    /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	@AuraEnabled(cacheable=false)
	public static void updateActionDateOfTreatment(String recordId, String actionValue) {
		try {
			if (String.isBlank(recordId) || String.isBlank(actionValue)) {
				logErrorRecordNotFound();
				return;
			}

			Task taskObj = BI_PSPB_ActionTaskService.getTask(recordId);
			if (taskObj == null) {
				logErrorRecordNotFound();
				return;
			}

			BI_PSPB_Treatment_Reminder__c dateOfTreatmentRec = BI_PSPB_ActionService.getDateOfTreatmentReminder(taskObj.WhatId, 'Date of Treatment');
			updateTaskAndReminder(taskObj, dateOfTreatmentRec, actionValue);
		} catch (Exception ex) {
			logException(ex);
		}
	}
    /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	private static void updateTaskAndReminders(Task taskObj, List<BI_PSPB_Treatment_Reminder__c> reminders, String actionValue) {
		if (actionValue.equals(BI_PSPB_NotificatinRmdConstantsCtrl.actionResponseYes)) {
			taskObj.Status = BI_PSPB_NotificatinRmdConstantsCtrl.notificationStatusComplete;
			for (BI_PSPB_Treatment_Reminder__c reminder : reminders) {
				reminder.BI_PSPB_Status__c = BI_PSPB_NotificatinRmdConstantsCtrl.progress;
				updateReminder(reminder);
			}
		} else if (actionValue.equals(BI_PSPB_NotificatinRmdConstantsCtrl.actionResponseNo)) {
			taskObj.Status = BI_PSPB_NotificatinRmdConstantsCtrl.notificationStatusNotComplete;
		}

		updateTask(taskObj);
	}
    /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	private static void updateTaskAndReminder(Task taskObj, BI_PSPB_Treatment_Reminder__c reminder, String actionValue) {
		if (actionValue.equals(BI_PSPB_NotificatinRmdConstantsCtrl.actionResponseYes)) {
			taskObj.Status = BI_PSPB_NotificatinRmdConstantsCtrl.notificationStatusComplete;
			reminder.BI_PSPB_Status__c = BI_PSPB_NotificatinRmdConstantsCtrl.progress;
			updateReminder(reminder);
		} else if (actionValue.equals(BI_PSPB_NotificatinRmdConstantsCtrl.actionResponseNo)) {
			taskObj.Status = BI_PSPB_NotificatinRmdConstantsCtrl.notificationStatusNotComplete;
		}

		updateTask(taskObj);
	}
        /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	private static void updateTask(Task taskObj) {
		if (taskObj != null) {
			BI_PSPB_HandleUtitlites.updateAndHandleErrors(
				new List<Task>{ taskObj },
				BI_PSPB_ActionNotificationUpdateStatus.class.toString(),
				false
			);
		}
	}
        /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	private static void updateReminder(BI_PSPB_Treatment_Reminder__c reminder) {
		if (reminder != null) {
			BI_PSPB_HandleUtitlites.updateAndHandleErrors(
				new List<BI_PSPB_Treatment_Reminder__c>{ reminder },
				BI_PSPB_ActionNotificationUpdateStatus.class.toString(),
				false
			);
		}
	}
        /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	private static void logErrorRecordNotFound() {
		BI_PSP_LogMessagesUtility.logError(
			BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
			BI_PSPB_ActionNotificationUpdateStatus.class.toString(),
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
			BI_PSPB_ActionNotificationUpdateStatus.class.toString(),
			ex
		);
	}
}