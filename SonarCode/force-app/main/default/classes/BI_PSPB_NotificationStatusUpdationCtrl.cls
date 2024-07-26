/**
* @description Updating the status of the Task when notification
is read.
* History
* Version	Author			Date		Detail		Description
* 1.0		Ragavi		24-07-2024		Created		Refactored Version
*/
public without sharing class BI_PSPB_NotificationStatusUpdationCtrl {
	@AuraEnabled
	/**
	* @description Updating the task status as Read.
	* @param taskId Id of the Task to be updated.
	* @return Returning the task marked as read.
	*/
	public static List<Task> markTaskRead(String taskId) {
		List<Task> listOfTasks = new List<Task>();
		try {
			BI_PSPB_InsiteTaskUpdater.validateTaskId(taskId);
			listOfTasks = updateTaskStatus(
				taskId,
				BI_PSPB_ConstantsClassCtrl.actionTypeRead
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
			BI_PSPB_NewConstantsCtrl.recordNotFound,
			BI_PSPB_NotificationStatusUpdationCtrl.class.toString(),
			ex
		);
		}
		return listOfTasks;
	}
	@AuraEnabled
	/**
	* @description Updating the task status as Completed.
	* @param taskId Id of the Task to be updated.
	* @return Returning the task marked as read.
	*/
	public static List<Task> markTaskCompleted(String taskId) {
		List<Task> updateTasks = new List<Task>();
		try {
			BI_PSPB_InsiteTaskUpdater.validateTaskId(taskId);
			updateTasks = updateTaskStatus(
				taskId,
				BI_PSPB_NewConstantsCtrl.notificationStatusComplete
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
			BI_PSPB_NewConstantsCtrl.recordNotFound,
			BI_PSPB_NotificationStatusUpdationCtrl.class.toString(),
			ex
		);
		}
		return updateTasks;
	}
	/**
	* @description Updating the task status as mentioned.
	* @param taskId Id of the Task to be updated.
	* @param newStatus Status of the Task to be updated.
	* @return Returning the task updated.
	*/
	private static List<Task> updateTaskStatus(
		String taskId,
		String newStatus
	) {
		List<SObject> tasksToUpdate = new List<SObject>();
		List<Task> updatedTasks = new List<Task>();
		try {
			BI_PSPB_InsiteTaskUpdater.validateTaskId(taskId);
			BI_PSPB_InsiteTaskUpdater.validateTaskId(newStatus);
			tasksToUpdate = BI_PSPB_InsiteTaskFetcher.fetchTasks(
				taskId
			);
			if (tasksToUpdate.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NewConstantsCtrl.recordNotFound,
					BI_PSPB_NotificationStatusUpdationCtrl.class.toString(),
					true
				);
			}

			updatedTasks = BI_PSPB_InsiteTaskUpdater.updateTaskStatus(
				tasksToUpdate,
				newStatus
			);
			if(!updatedTasks.isEmpty()){
				BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(
					updatedTasks,
					BI_PSPB_NotificationStatusUpdationCtrl.class.toString(),
					false
				);
			}
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_NewConstantsCtrl.errorCreatingTask,
				BI_PSPB_NotificationStatusUpdationCtrl.class.toString(),
				ex
			);
		}
		return updatedTasks;
	}
}