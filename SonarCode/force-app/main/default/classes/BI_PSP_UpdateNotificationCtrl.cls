/**
 * @description      Controller class for updating and retrieving notification settings.
 * History:
 * Version   Author      Date            Detail          Description
 * 1.0       Adhish      05-Dec-2023     Created         Initial development
 * 1.1       Adhish      15-Apr-2024     Updated         Changed method names
 */

 public with sharing class BI_PSP_UpdateNotificationCtrl {
    private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues('PSPB');
    private static String applicationName = settings != null ? settings.BI_SFCOE_LOG_Application__c : '';
    private static String userName = UserInfo.getName();
    private static String email = UserInfo.getUserEmail();
    private static String errorForThrow = System.Label.BI_PSP_ConsoleError;
    private static String errorMsg = '';
    private static String errorForAccount = System.Label.BI_PSP_AccountError;
    private static String errorForUpdate = System.Label.BI_PSPB_UnableToUpdateRecord;
    private static String errorUpdateCpe = System.Label.BI_PSPB_ErrorUpdateCpe;
    private static String errorGettingEcg = System.Label.BI_PSPB_ErrorGettingEcg;

    /**
     * @description Updates notification settings for a given account based on the provided wrapper values.
     * @param enrolleeId The ID of the Account to update notification settings for.
     * @param wrapper Wrapper object containing email, sms, insite, and phone notification values.
     */
	@AuraEnabled
	public static void updateFieldInObject(String enrolleeId, BI_PSPB_notificationSettingParaWrapper wrapper) {
		validateAccountId(enrolleeId);
	
		List<BI_PSP_Notification_Setting__c> notifyList = retrieveNotificationSettings(enrolleeId, wrapper.typeValue);
	
		updateNotificationSettings(notifyList, wrapper);
	}
	
	/**
 * @description Validates the account ID parameter.
 * @param enrolleeId The account ID to validate.
 */
	private static void validateAccountId(String enrolleeId) {
		if (String.isBlank(enrolleeId)) {
			throw new AuraHandledException('Invalid Account ID');
		}
	}
	
	/**
 * @description Retrieves notification settings based on account ID and notification type.
 * @param enrolleeId The ID of the Account to retrieve notification settings for.
 * @param typeValue The notification type value to filter the settings.
 * @return List of BI_PSP_Notification_Setting__c objects containing notification settings.
 */
	private static List<BI_PSP_Notification_Setting__c> retrieveNotificationSettings(String enrolleeId, String typeValue) {
		List<BI_PSP_Notification_Setting__c> notifyList = [
			SELECT Id, BI_PSP_Email__c, BI_PSP_SMS__c, BI_PSP_Insite_Notification__c, BI_PSP_Phone__c
			FROM BI_PSP_Notification_Setting__c
			WHERE BI_PSP_Notification_Type__c = :typeValue
				  AND BI_PSP_Enrollee__c = :enrolleeId
				  WITH USER_MODE
			LIMIT 1
		];
	
		if (notifyList.isEmpty()) {
			throw new AuraHandledException('No notification settings found for the Account');
		}
	
		return notifyList;
	}
	
	/**
 * @description Updates notification settings with values from the wrapper object.
 * @param notifyList List of BI_PSP_Notification_Setting__c objects to update.
 * @param wrapper Wrapper object containing email, sms, insite, and phone notification values.
 */
	private static void updateNotificationSettings(List<BI_PSP_Notification_Setting__c> notifyList, BI_PSPB_notificationSettingParaWrapper wrapper) {
		for (BI_PSP_Notification_Setting__c notification : notifyList) {
			notification.BI_PSP_Email__c = wrapper.emailValue;
			notification.BI_PSP_SMS__c = wrapper.smsValue;
			notification.BI_PSP_Insite_Notification__c = wrapper.insiteValue;
			notification.BI_PSP_Phone__c = wrapper.phoneValue;
		}
	
		Database.SaveResult[] saveResults = Database.update(notifyList, false);
	
		for (Database.SaveResult saveResult : saveResults) {
			if (!saveResult.isSuccess()) {
				String errorMsg = '';
				for (Database.Error error : saveResult.getErrors()) {
					errorMsg += 'Error ' + error.getFields() + ' -- ' + error.getMessage() + '\n';
				}
				BI_SFCOE_LOG_Util.handleDatabaseSaveResults(saveResults, BI_PSP_UpdateNotificationCtrl.class.toString(), System.now());
				throw new AuraHandledException(errorMsg);
			}
		}
	}
	

    /**BI_PSP_Enrollee__c
     * @description Retrieves notification settings for a given account and type.
     * @param enrolleeId The ID of the Account to retrieve notification settings for.
     * @param type The type of notification settings to retrieve.
     * @return List of BI_PSP_Notification_Setting__c records representing notification settings.
     */
    @AuraEnabled(cacheable = true)
    public static List<BI_PSP_Notification_Setting__c> retrieveNotifications(Id enrolleeId, String type) {
        List<BI_PSP_Notification_Setting__c> notifyList = new List<BI_PSP_Notification_Setting__c>();
        try {
            if (enrolleeId != null && String.isNotBlank(type)) {
                notifyList = [
                    SELECT Id, BI_PSP_Email__c, BI_PSP_SMS__c, BI_PSP_Insite_Notification__c, BI_PSP_Phone__c
                    FROM BI_PSP_Notification_Setting__c
                    WHERE BI_PSP_Notification_Type__c = :type
                          AND BI_PSP_Enrollee__c = :enrolleeId
                    WITH USER_MODE
                    LIMIT 1
                ];
                if (notifyList.isEmpty()) {
                    throw new AuraHandledException(errorForAccount);
                }
            } else {
                throw new AuraHandledException(errorForAccount);
            }
        } catch (Exception ex) {
            BI_PSPB_LogUtilities.exceptionLogMessage(errorForAccount, BI_PSP_UpdateNotificationCtrl.class.toString(),ex);
        }
        return notifyList;
    }

    /**
     * @description Retrieves the list of Accounts associated with the logged-in user's caregiver role.
     * @return List of Account records representing caregiver-associated accounts.
     */
    @AuraEnabled(cacheable = false)
    public static List<Account> userCaregiverPost() {
        try {
            List<BI_PSPB_Enrollee_Caregiver__c> avtLists = [
                SELECT Id, Name, BI_PSPB_Patient__r.Id, BI_PSPB_Contact_Id__r.Email, BI_PSPB_Patient__r.BI_PSP_Loginattempt__c,
                       BI_PSPB_Caregiver__r.BI_PSPB_Patient__c, BI_PSPB_Patient__r.Name, BI_PSPB_Patient__r.BI_PSP_AvatarUrl__c,
                       BI_PSPB_Contact_Id__c, BI_PSPB_Contact_Id__r.BI_PSPB_Selected_Patient_ID__c, BI_PSPB_Caregiver__r.BI_PSPB_Selected_Patient_ID__c
                FROM BI_PSPB_Enrollee_Caregiver__c
                WHERE BI_PSPB_Caregiver__r.Name = :userName
                      AND BI_PSPB_Caregiver__r.PersonEmail = :email
                WITH USER_MODE
                LIMIT 1
            ];
            if (!avtLists.isEmpty()) {
                String patientId = avtLists[0].BI_PSPB_Caregiver__r.BI_PSPB_Selected_Patient_ID__c;
                List<Account> avtList = [
                    SELECT Id, Name, BI_PSP_AvatarUrl__c, BI_PSP_Loginattempt__c
                    FROM Account
                    WHERE Id = :patientId WITH USER_MODE
                    LIMIT 1
                ];
                return avtList;
            } else {
                throw new AurahandledException(errorUpdateCpe);
            }
        } catch (Exception ex) {
            BI_PSPB_LogUtilities.exceptionLogMessage(errorGettingEcg, BI_PSP_UpdateNotificationCtrl.class.toString(),ex);
        }
        return new List<Account>();
    }

    /**
     * @description Wrapper class used for passing notification values.
     */
    public class BI_PSPB_notificationSettingParaWrapper {
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public Boolean emailValue { get; set; }
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public Boolean smsValue { get; set; }
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public Boolean insiteValue { get; set; }
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public Boolean phoneValue { get; set; }
		 /**
     * @description Wrapper class used for passing notification values.
     */
        @AuraEnabled public String typeValue { get; set; }
    }
}