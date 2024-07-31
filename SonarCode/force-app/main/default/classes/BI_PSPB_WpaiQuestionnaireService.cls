/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_WpaiQuestionnaireService {
    /**
	* @description  Used to create task when a video is uploaded and calling the
	* method to send sms and email.
	*/
    public static void processWpaiQuestionnaires() {
        try {
            List<Task> newTaskList = new List<Task>();
            List<Id> enrolleeSendIds = new List<Id>();

            Set<Id> enrolleeIds = BI_PSPB_EnrolleeFetcher.fetchEnrolleeIds();

            if (!enrolleeIds.isEmpty()) {
                Integer wpaiCount = BI_PSPB_QuestionsDaysCountFetcher.fetchWpaiCount();
                List<Id> enrolleeRecIds = BI_PSPB_QuestionsSymptomTrackerProcessor.processSymptomTrackers(enrolleeIds, wpaiCount);

                if (!enrolleeRecIds.isEmpty()) {
                    enrolleeSendIds = BI_PSPB_AssessmentFetcher.fetchDueAssessments(enrolleeRecIds, BI_PSPB_ConstantsClassCtrl.wpaiQuestionName);
                    BI_PSPB_TaskParameters params = new BI_PSPB_TaskParameters(
						System.Label.BI_PSPB_ActionWpaiNotification,
						BI_PSPB_ConstantsClassCtrl.actionTypeAction,
						'WPAI',
						'',
						BI_PSPB_ConstantsClassCtrl.actionTypeNotificatonTypeAction
					);
					newTaskList = BI_PSPB_TaskCreationCtrl.createTasks(
						enrolleeSendIds,
						params
					);
                    if (!newTaskList.isEmpty()) {
                    	BI_PSPB_HandleUtitlites.insertAndHandleErrors(
							newTaskList,
							BI_PSPB_WpaiQuestionnaireService.class.toString(),
							false
						);
                    }
                    BI_PSPB_NotificationSender.sendNotifications(enrolleeSendIds, BI_PSPB_ConstantsClassCtrl.wpai, null);
                }
            } else {
                BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_DlqiQuestionnaireService.class.toString(),
					false,
                    BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_WpaiQuestionnaireService.class.toString(),
				ex
			);
        }
    }
}