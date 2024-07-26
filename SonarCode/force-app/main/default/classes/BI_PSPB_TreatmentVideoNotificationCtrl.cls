/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_TreatmentVideoNotificationCtrl {
	/**
	* @description  Used to create task when a video is uploaded and calling the
	method to send sms and email.
	*/
	public static void taskForTreatmentVideo() {
		try {
			List<SObject> enrolleeRecords = BI_PSP_CommonQueryUtility.executeQuery(
				'CareProgramEnrollee',
				'Id',
				null,
				false
			);
			if (enrolleeRecords.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NewConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_TreatmentVideoNotificationCtrl.class.toString(),
					false
				);
				return;
			}

			/*List<Task> newTaskList = BI_PSPB_TaskCreationCtrl.createTasks(
				enrolleeRecords,
				BI_PSPB_NewConstantsCtrl.generalDemonstrationVideoSubject
			);
			if (newTaskList.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NewConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_TreatmentVideoNotificationCtrl.class.toString(),
					false
				);
				return;
			}

			BI_PSPB_HandleUtitlites.insertAndHandleErrors(
				newTaskList,
				BI_PSPB_TreatmentVideoNotificationCtrl.class.toString(),
				false
			);*/

			List<Id> enrolleeIds = collectEnrolleeIds(enrolleeRecords);
			if (!enrolleeIds.isEmpty()) {
				BI_PSPB_NotificationSender.sendNotifications(
					enrolleeIds,
					BI_PSPB_NewConstantsCtrl.video,
                    null
				);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_TreatmentVideoNotificationCtrl.class.toString(),
				ex
			);
		}
	}

	/**
	* @description  Used to get all enrollees and adding it to a list.
	* @param enrolleeRecords List of enrollees.
	* @return Returning list of Ids
	*/
	private static List<Id> collectEnrolleeIds(
		List<CareProgramEnrollee> enrolleeRecords
	) {
		List<Id> enrolleeIds = new List<Id>();
		try{
			for (CareProgramEnrollee enrollee : enrolleeRecords) {
				enrolleeIds.add(enrollee.Id);
			}
		} catch (Exception ex) {
			BI_PSPB_LogUtilities.exceptionLogMessage(
				'',
				BI_PSPB_TreatmentVideoNotificationCtrl.class.toString(),
				ex
			);
		}
		return enrolleeIds;
	}
}