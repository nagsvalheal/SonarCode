/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_SmsAndEmailSenderCtrl {
    /**
	* @description  Used to create task when a video is uploaded and calling the
	* method to send sms and email.
	*/
    public static void handleTrigger(List<Id> recordId, String notificationTypes, List<String> communityUserName, String treatmentDate) {
        if (recordId.isEmpty() && String.isBlank(notificationTypes)) {
            BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_SmsAndEmailCtrlModulation.class.toString(),
					false,
					BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
            return;
        }

        try {
            BI_PSPB_SmsAndEmailNotificationDetails notificationDetails = BI_PSPB_SmsAndEmailNotificationHelper.getNotificationDetails(notificationTypes, communityUserName);
            List<Id> contactIdsToSendSMS = new List<Id>();
            List<Id> contactIdsToSendEmail = new List<Id>();
            List<Id> enrolIds = new List<Id>();
            List<Id> accountRec = new List<Id>();

            // Retrieve enrollees
            List<CareProgramEnrollee> enrollees = BI_PSPB_CareProgramEnrolleeHelperM.getEnrollees(recordId);
            for (CareProgramEnrollee enrollee : enrollees) {
                enrolIds.add(enrollee.Id);
                accountRec.add(enrollee.AccountId);
            }

            // Retrieve notifications
            Map<Id, List<BI_PSP_Notification_Setting__c>> accountToNotificationsMap = BI_PSPB_SmsAndEmailNotificationSetting.getAccountToNotificationsMap(accountRec, notificationDetails.notificationType);

            // Filter and add contacts
            BI_PSPB_SmsAndEmailNotificationHelper.addContactsToSend(accountToNotificationsMap, enrollees, contactIdsToSendEmail, contactIdsToSendSMS);
            
            // URL generation
            String url = BI_PSPB_SmsAndEmailNotificationHelper.getNotificationUrl(notificationDetails);
            if (!contactIdsToSendEmail.isEmpty()) {
				BI_PSPB_EmailBatch sendEmail = new BI_PSPB_EmailBatch(
					contactIdsToSendEmail,
					notificationDetails.emailSubject,
					url,
					null,
					notificationDetails.followName
				);
				database.executeBatch(sendEmail, 45);
			}
			if (!contactIdsToSendSMS.isEmpty()) {
				/*BI_PSPB_SmsBatch sendSms = new BI_PSPB_SmsBatch(
					contactIdsToSendSMS,
					notificationDetails.subject,
					url,
					null
				);
				database.executeBatch(sendSms, 45);*/
			}
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_SmsAndEmailCtrlModulation.class.toString(),
				ex
			);
        }
    }
}