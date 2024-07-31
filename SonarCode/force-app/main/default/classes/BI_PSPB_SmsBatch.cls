/**
 * @description Batch class for sending SMS notifications to a list of contacts.
 * This batch class retrieves contact information and sends SMS notifications using a specified SMS endpoint.
 * It logs the status of each SMS sent and handles exceptions gracefully.
 *
 * History
 * Version 	Author		Date			Detail		Description
 * 1.0		Rajaa		29-Apr-2024		Created		This was an intial development.
 * 1.1		Rajaa		03-May-2024		Updated		Code Review Changes.
 */
public with sharing class BI_PSPB_SmsBatch implements Database.Batchable<SObject>, Database.AllowsCallouts {
	private List<Id> contactIds;
	private String notificationDeveloperName;
	private SmsNotificationWrapper notificationWrapper;
	private String destUrl;
	private String notificationDate;
	private static final String SMS_ENDPOINT = System.Label.BI_PSPB_SmsEndpoint;
	private static final String CONTACT_ERROR = System.Label.BI_PSP_ContactErrorMessage;
	private static final String RECORD_ERROR = System.Label.BI_PSPB_ErrorInRecord;
	private String concatenatedParams = '';
	private static final String FINISH  = System.Label.BI_PSPB_Finish;
	private static final String LOG_SEVERITY_INFO = System.Label.BI_PSP_InfoSeverity;
	/**
	 *@description Constructs a new instance of the BI_PSPB_SmsBatch class with the provided parameters.          
	 * @param notificationWrapper  A list of contact IDs to whom the SMS notifications will be sent.The developer name of the notification settings to be used.The destination URL to include in the SMS notification.The date information to include in the SMS notification, if applicable.
	 * wrapper class
	 */
	public BI_PSPB_SmsBatch(SmsNotificationWrapper notificationWrapper) {
		if (validateInputs(notificationWrapper)) {
			this.notificationWrapper = notificationWrapper;
		} else {
			BI_PSP_LogMessagesUtility.logError(BI_PSPB_ConstantsClassCtrl.parameterError, BI_PSPB_SmsBatch.class.toString(),false,LOG_SEVERITY_INFO);
		}
	}
	private Boolean validateInputs(SmsNotificationWrapper notificationWrapper) {
		return notificationWrapper.contactIds != null && !notificationWrapper.contactIds.isEmpty() &&
			   !String.isBlank(notificationWrapper.notificationDeveloperName) &&
			   !String.isBlank(notificationWrapper.destUrl);
	}

	/**
	 * Returns a Database.QueryLocator instance containing the contacts specified by their IDs.
	 *
	 *@description This method is invoked at the beginning of the batch execution to retrieve the contacts
	 * based on the provided contact IDs for processing.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @return A Database.QueryLocator instance containing the contacts to be processed.
	 */
	public Database.QueryLocator start(Database.BatchableContext context) {
		try {
			return Database.getQueryLocator([SELECT Id, Phone, Name FROM Contact WHERE Id IN :notificationWrapper.contactIds WITH USER_MODE]);
		} catch (Exception LOG_SEVERITY_INFO) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ConstantsClassCtrl.httpResponseError, BI_PSPB_SmsBatch.class.toString(), LOG_SEVERITY_INFO);
			return null;
		}
	}


	/**
	 * Executes the batch process for sending SMS notifications to the provided contacts.
	 *
	 *@description This method is invoked by the batch framework to process each batch of contacts.
	 * It retrieves the necessary access token, API settings, and notification details.
	 * For each contact, it constructs an SMS payload and sends it via HTTP POST request.
	 * It logs the status of each SMS sent and handles exceptions gracefully.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @param scope   The list of contacts to be processed in the current batch.
	 */
	
	 public void execute(Database.BatchableContext context, List<Contact> scope) {
		List<BI_PSPB_OmnichannelLog__c> smsLogList = new List<BI_PSPB_OmnichannelLog__c>();
		try {
			BI_PSPB_Notification__mdt notification = BI_PSPB_Notification__mdt.getInstance(notificationWrapper.notificationDeveloperName);
			String smsBody = notification.BI_PSPB_SmsBody__c;
			String eventName = notification.BI_PSPB_EventName__c;
			String eventType = notification.BI_PSPB_EventType__c;
			String smsBodyLink = createSmsBodyLink(smsBody);
			for (Contact contact : scope) {
				if (isValidContact(contact)) {
					sendSmsAndLog(contact, smsBodyLink, eventName, eventType, smsLogList);
				} else {
					BI_PSP_LogMessagesUtility.logError(BI_PSPB_ConstantsClassCtrl.error, BI_PSPB_SmsBatch.class.toString(),false,LOG_SEVERITY_INFO);
				}
			}
			saveLogs(smsLogList);
		} catch (Exception LOG_SEVERITY_INFO) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ConstantsClassCtrl.httpResponseError, BI_PSPB_SmsBatch.class.toString(), LOG_SEVERITY_INFO);
		}
	}

	private String createSmsBodyLink(String smsBody) {
		return String.isNotBlank(notificationDate) ? smsBody + ' ' + notificationDate + ' ' + destUrl : smsBody + ' ' + destUrl;
	}

	private Boolean isValidContact(Contact contact) {
		return contact.Phone != null && contact.Name != null;
	}

	private void sendSmsAndLog(Contact contact, String smsBodyLink, String eventName, String eventType, List<BI_PSPB_OmnichannelLog__c> smsLogList) {
		try {
			String payload = createPayload(contact.Phone, smsBodyLink);
			HttpResponse response = sendHttpRequest(payload);
			processResponse(contact, response, smsBodyLink, eventName, eventType, smsLogList);
		} catch (Exception LOG_SEVERITY_INFO) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage( BI_PSPB_ConstantsClassCtrl.httpResponseError, BI_PSPB_SmsBatch.class.toString(), LOG_SEVERITY_INFO);
		}
	}

	private String createPayload(String phoneNumber, String smsBodyLink) {
		return '{ "phoneNumber": "' + phoneNumber + '", "body": "' + smsBodyLink + '" }';
	}

	private HttpResponse sendHttpRequest(String payload) {
		BI_PSPB_OmnichannelSetting__mdt filteredSettings = BI_PSPB_OmnichannelSetting__mdt.getInstance(SMS_ENDPOINT);
		String omnichannel = filteredSettings.BI_PSPB_omnichannelentapi__c;
		String country = filteredSettings.BI_PSPB_Country__c;
		String configItem = filteredSettings.BI_PSPB_configItem__c;
		HttpRequest request = new HttpRequest();
		request.setEndpoint('callout:BI_PSPB_OmnichannelEndpoint' + omnichannel + country + configItem);
		request.setMethod('POST');
		request.setHeader('Content-Type', 'application/json');
		request.setBody(payload);
		return new Http().send(request);
	}

	private void processResponse(Contact contact, HttpResponse response, String smsBody, String eventName, String eventType, List<BI_PSPB_OmnichannelLog__c> smsLogList) {
		Integer responseCode = response.getStatusCode();
		Boolean smsResponse = responseCode == 200;
		String messageId = '';
		String status = '';

		if (smsResponse && response.getBody() != null) {
			Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
			status = (String) jsonResponse.get('status');
			messageId = (String) jsonResponse.get('messageId');
		}

		BI_PSPB_OmnichannelLog__c smsLog = createSmsLog(contact, smsBody, eventName, eventType, responseCode, smsResponse, status, messageId);
		smsLogList.add(smsLog);

		if (!smsResponse) {
			BI_PSP_LogMessagesUtility.logError(BI_PSPB_ConstantsClassCtrl.httpResponseError,BI_PSPB_SmsBatch.class.toString(),false,LOG_SEVERITY_INFO);
		}
	}

	private BI_PSPB_OmnichannelLog__c createSmsLog(Contact contact, String smsBody, String eventName, String eventType, Integer responseCode, Boolean smsResponse, String status, String messageId) {
		BI_PSPB_OmnichannelLog__c smsLog = new BI_PSPB_OmnichannelLog__c();
		smsLog.BI_PSPB_ContactName__c = contact.Id;
		smsLog.BI_PSPB_StatusResponse__c = String.valueOf(responseCode);
		smsLog.BI_PSPB_SmsBody__c = smsBody;
		smsLog.BI_PSPB_MobilePhone__c = contact.Phone;
		smsLog.BI_PSPB_EventName__c = eventName;
		smsLog.BI_PSPB_EventType__c = eventType;
		smsLog.BI_PSPB_SMSResponse__c = smsResponse;
		smsLog.BI_PSPB_SMSMessageId__c = messageId;
		smsLog.BI_PSPB_SmsStatus__c = status;
		return smsLog;
	}

	private void saveLogs(List<BI_PSPB_OmnichannelLog__c> smsLogList) {
		if (!smsLogList.isEmpty()) {           
			BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
				smsLogList,
				BI_PSPB_EmailBatch.class.toString(),
				false
			);
		} else {
			BI_PSP_LogMessagesUtility.exceptionLogMessage( BI_PSPB_ConstantsClassCtrl.httpResponseError, BI_PSPB_SmsBatch.class.toString(), null);
		}
	}
/**
 * @description Wrapper class to encapsulate the details required for sending SMS notifications.
 * This class is used to hold the list of contact IDs, the developer name of the notification,
 * the destination URL, and the notification date.
 */
public class SmsNotificationWrapper {
	/**
    *@description contactIds List of contact IDs 
	 */
    public List<Id> contactIds { get; set; }
    /**
    *@description notificationDeveloperName Developer name of the notification
	 */
    public String notificationDeveloperName { get; set; }
    /**
    *@description destUrl is the  URL for the notification
	 */
    public String destUrl { get; set; }
    /**
    *@description notificationDate Date of the notification notificationDate
	 */
    public String notificationDate { get; set; }

    /**
     * @description Constructs a new instance of the SmsNotificationWrapper class.
     *
     * @param contactIds A list of contact IDs to whom the SMS notifications will be sent.
     * @param notificationDeveloperName The developer name of the notification settings to be used.
     * @param destUrl The destination URL to include in the SMS notification.
     * @param notificationDate The date information to include in the SMS notification, if applicable.
     */
    public SmsNotificationWrapper(
        List<Id> contactIds, 
        String notificationDeveloperName, 
        String destUrl, 
        String notificationDate
    ) {
        this.contactIds = contactIds;
        this.notificationDeveloperName = notificationDeveloperName;
        this.destUrl = destUrl;
        this.notificationDate = notificationDate;
    }
}

	/**
	 * Handles the finishing tasks after the batch execution completes.
	 *
	 *@description This method is invoked by the batch framework once all batches have been processed.
	 * It logs a message indicating the completion of the batch process.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 */
	public void finish(Database.BatchableContext context) {
		BI_PSP_LogMessagesUtility.logError(
			FINISH ,
			BI_PSPB_EmailBatch.class.toString(),
            false,
            LOG_SEVERITY_INFO
            
		);
	}
}