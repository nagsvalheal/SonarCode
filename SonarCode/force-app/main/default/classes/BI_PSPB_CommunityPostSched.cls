/**
* @description Schedule class to execute when a post is created.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_CommunityPostSched implements Schedulable {
	/**
	* @description Used to scehdule a job when a post is created in community.
	* @param ctx The context in which the job is executed. 
	*/
	public void execute(SchedulableContext ctx) {
		try {
			BI_PSPB_CommunityPostService.processCommunityPostReminders();
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
				BI_PSPB_TreatmentRemindersSched.class.toString(),
				ex
			);
		}
	}
}