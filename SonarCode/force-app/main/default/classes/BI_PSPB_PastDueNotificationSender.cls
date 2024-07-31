/**
* @description To check the days to send notification and calling
another method to create tasks.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version 
*/
public with sharing class BI_PSPB_PastDueNotificationSender {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static void sendNotifications(
		List<Id> enrolleeRecIds,
		List<Id> enrolleePastOne,
		List<Id> enrolleePastThree,
		BI_PSPB_TreatmentReminderDays pastDueDays
	) {
		try {
			if (!enrolleeRecIds.isEmpty()) {
				BI_PSPB_SmsAndEmailCtrl.handleTrigger(
					enrolleeRecIds,
					BI_PSPB_ConstantsClassCtrl.pastDueDateZero,
					null,
					''
				);
			}
			if (!enrolleePastOne.isEmpty()) {
				BI_PSPB_SmsAndEmailCtrl.handleTrigger(
					enrolleePastOne,
					BI_PSPB_ConstantsClassCtrl.pastDueDateOne,
					null,
					''
				);
			}
			if (!enrolleePastThree.isEmpty()) {
				BI_PSPB_SmsAndEmailCtrl.handleTrigger(
					enrolleePastThree,
					BI_PSPB_ConstantsClassCtrl.pastDueDateThree,
					null,
					''
				);
			}
		} catch (System.DmlException ex) {
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileDeleting,
				BI_PSPB_FeedItemCtrl.class.toString(),
				ex
			);
		}
	}
}