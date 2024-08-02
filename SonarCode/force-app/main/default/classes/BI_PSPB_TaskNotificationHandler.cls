/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public with sharing class BI_PSPB_TaskNotificationHandler {
        	/**
	* @description Checking for tasks and calling other method
	to send mail.
	*/
    public static void handleNotifications(
        List<CareProgramEnrollee> enrolleeRecords,
        BI_PSPB_NotificationContext context
    ) {
        if (context.category == BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneralCommunity &&
            context.notificationType == BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral) {
            handleGeneralCommunityNotifications(context);
        } else if (context.category == BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeChallenges &&
                   context.notificationType == BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral) {
            handleTriggerWithMessage(context.recordId, BI_PSPB_NotificatinRmdConstantsCtrl.generalChallenges, new List<String>{''});
        } else if (context.category == BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeSymptomTracker &&
                   context.notificationType == BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral) {
            handleTriggerWithMessage(context.recordId, BI_PSPB_NotificatinRmdConstantsCtrl.generalSymptomTracker, new List<String>{''});
        }
    }
        	/**
	* @description Checking for tasks and calling other method
	to send mail.
	*/
    private static void handleGeneralCommunityNotifications(BI_PSPB_NotificationContext context) {
        Map<String, String> chatterTypeToMessageMap = new Map<String, String>{
            BI_PSPB_NotificatinRmdConstantsCtrl.comment => BI_PSPB_NotificatinRmdConstantsCtrl.generalComment,
            BI_PSPB_NotificatinRmdConstantsCtrl.reaction => BI_PSPB_NotificatinRmdConstantsCtrl.generalReaction,
            BI_PSPB_NotificatinRmdConstantsCtrl.follow => BI_PSPB_NotificatinRmdConstantsCtrl.generalFollow
        };

        String messageType = chatterTypeToMessageMap.get(context.chatterType);

        if (messageType != null) {
            handleTriggerWithMessage(context.recordId, messageType, context.communityUserName);
        }
    }
        	/**
	* @description Checking for tasks and calling other method
	to send mail.
	*/
    private static void handleTriggerWithMessage(List<Id> recordId, String messageType, List<String> communityUserName) {
        BI_PSPB_SmsAndEmailSenderCtrl.handleTrigger(recordId, messageType, communityUserName, '');
    }
}