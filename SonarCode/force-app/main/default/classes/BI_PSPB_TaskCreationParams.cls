/**
* @description To check the days to send notification and calling
another method to create tasks.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version 
*/
public with sharing class BI_PSPB_TaskCreationParams {
    public BI_PSPB_Treatment_Reminder__c reminder;
    public BI_PSPB_TreatmentReminderDays pastDueDays;
       /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
    public BI_PSPB_TaskCreationParams(
        BI_PSPB_Treatment_Reminder__c reminder,
        BI_PSPB_TreatmentReminderDays pastDueDays
    ) {
        this.reminder = reminder;
        this.pastDueDays = pastDueDays;
    }
}