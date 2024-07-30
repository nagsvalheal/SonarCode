/**
 * @description Used to update the status of the Task.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public with sharing class BI_PSPB_InsiteTaskFetcher {
	/**
	 * @description Validating the String is blank or not.
	 * @param taskId Id of the Task to be updated.
	 * @param return Id of the Task to be updated.
	 */
	public static List<Task> fetchTasks(String taskId) {
		String fields = 'Id, Status, BI_PSP_Category__c, BI_PSP_ChatterType__c, BI_PSP_ChatterFeedId__c';
		String conditions =
			'Id = \'' +
			taskId +
			'\' ' +
			'LIMIT 1';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Task',
			fields,
			conditions,
			false
		);
		return (List<Task>) results;
	}
}