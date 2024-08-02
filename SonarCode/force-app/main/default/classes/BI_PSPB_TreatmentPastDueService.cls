/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_TreatmentPastDueService {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static void processPastDueReminders() {
		try {
			Integer[] intervals = new List<Integer>{ 0, -1, -3 }; // 0 for today, -1 for 24 hours, -3 for 72 hours
			Set<Date> targetDates = BI_PSPB_TreatmentDateCalculator.calculateTargetDates(
				intervals
			);

			Map<Date, List<BI_PSPB_Treatment_Reminder__c>> remindersByDate = BI_PSPB_TreatmentRecordFetcher.getTreatmentRecords(
				targetDates
			);

			if (remindersByDate.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_SymptomActionNotificationService.class.toString(),
					false,
					BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
			} else {
				BI_PSPB_TreatmentReminderDays pastDueDays = new BI_PSPB_TreatmentReminderDays();
				List<Task> newTaskList = new List<Task>();
				List<Id> enrolleeRecIds = new List<Id>();
				List<Id> enrolleePastOne = new List<Id>();
				List<Id> enrolleePastThree = new List<Id>();

				for (Date targetDate : targetDates) {
					if (remindersByDate.containsKey(targetDate)) {
						for (
							BI_PSPB_Treatment_Reminder__c reminder : remindersByDate.get(
								targetDate
							)
						) {
							BI_PSPB_TaskCreationParams params = new BI_PSPB_TaskCreationParams(
								reminder,
								pastDueDays
							);
							Task newTask = BI_PSPB_PastDueTaskCreator.createTask(
								targetDate,
								enrolleeRecIds,
								enrolleePastOne,
								enrolleePastThree,
								params
							);

							if (newTask != null) {
								newTaskList.add(newTask);
							}
                            System.debug('newTaskList ' + newTaskList);
						}
					}
				}
				handleTasks(newTaskList);
				sendNotifications(
					enrolleeRecIds,
					enrolleePastOne,
					enrolleePastThree,
					pastDueDays
				);
			}
		} catch (System.DmlException ex) {
			BI_PSPB_LogUtilities.catchSystemException(
				BI_PSPB_NotificatinRmdConstantsCtrl.errorTreatmentReminderService,
				BI_PSPB_TreatmentReminderService.class.toString(),
				ex
			);
		}
	}
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	private static void handleTasks(List<Task> newTaskList) {
		try {
			BI_PSPB_HandleUtitlites.insertAndHandleErrors(
				newTaskList,
				BI_PSPB_TreatmentReminderService.class.toString(),
				false
			);
		} catch (System.DmlException ex) {
			BI_PSPB_LogUtilities.catchSystemException(
				BI_PSPB_NotificatinRmdConstantsCtrl.errorTreatmentReminderService,
				BI_PSPB_TreatmentReminderService.class.toString(),
				ex
			);
		}
	}
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	private static void sendNotifications(
		List<Id> enrolleeRecIds,
		List<Id> enrolleePastOne,
		List<Id> enrolleePastThree,
		BI_PSPB_TreatmentReminderDays pastDueDays
	) {
		try {
			BI_PSPB_PastDueNotificationSender.sendNotifications(
				enrolleeRecIds,
				enrolleePastOne,
				enrolleePastThree,
				pastDueDays
			);
		} catch (System.DmlException ex) {
			BI_PSPB_LogUtilities.catchSystemException(
				BI_PSPB_NotificatinRmdConstantsCtrl.errorTreatmentReminderService,
				BI_PSPB_TreatmentReminderService.class.toString(),
				ex
			);
		}
	}
}