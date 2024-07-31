/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_TreatmentRecordFetcher {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static Map<Date, List<BI_PSPB_Treatment_Reminder__c>> getTreatmentRecords(
		Set<Date> targetDates
	) {
		Map<Date, List<BI_PSPB_Treatment_Reminder__c>> remindersByDate = new Map<Date, List<BI_PSPB_Treatment_Reminder__c>>();
		try {
			// Convert Set<Id> to a List<Id>
			Set<Date> targetDatesList = new Set<Date>(targetDates);
			String fields = 'BI_PSPB_Care_Program_Enrollee__c, BI_PSPB_Reminder_Type__c, BI_PSPB_Date_of_Treatment__c';
			// Convert List<Id> to a comma-separated string for the query
			String conditionIds =
				'(\'' +
				String.join(targetDatesList, '\', \'') +
				'\')';
			String conditions =
				'BI_PSPB_Date_of_Treatment__c IN ' +
				conditionIds +
				' ' +
				'AND BI_PSPB_Reminder_Type__c = \'' +
				'Date of Treatment' +
				'\' ' +
				'AND BI_PSPB_Status__c = \'' +
				BI_PSPB_ConstantsClassCtrl.actionTypeActive +
				'\' ';

			// Execute the query using the BI_PSP_CommonQueryUtility class
			List<SObject> records = BI_PSP_CommonQueryUtility.executeQuery(
				'BI_PSPB_Treatment_Reminder__c',
				fields,
				conditions,
				false
			);

			for (SObject record : records) {
				BI_PSPB_Treatment_Reminder__c treatmentReminder = (BI_PSPB_Treatment_Reminder__c) record;
				Date treatmentDate = treatmentReminder.BI_PSPB_Date_of_Treatment__c;

				if (!remindersByDate.containsKey(treatmentDate)) {
					remindersByDate.put(
						treatmentDate,
						new List<BI_PSPB_Treatment_Reminder__c>()
					);
				}
				remindersByDate.get(treatmentDate).add(treatmentReminder);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_NotificatinRmdConstantsCtrl.errorTreatmentReminderService,
				BI_PSPB_NotificationService.class.toString(),
				ex
			);
		}
		return remindersByDate;
	}
}