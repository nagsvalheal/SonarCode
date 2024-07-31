/*** @description This class provides support for managing the My Cases page. It is responsible for retrieving and displaying case records.
 * History
 * Version   Author   Date         Detail          Description
 * 1.0       Rajaa    20-Dec-2024  Created         Initial development.
 * 1.1       Rajaa    06-Apr-2024  Updated         Code review changes. */

 public with sharing class BI_PSPB_CaseSupportCtrl {
	private static String statusSubmitted = System.Label.BI_PSPB_Submitted;
	private static String statusDraft = System.Label.BI_PSPB_Draft;
	private static String statusNeedmoreInformation = System.Label.BI_PSPB_NeedMore;
	private static String baseImage = System.Label.BI_PSPB_BaseImage;
	private static String supportCenter = System.Label.BI_PSPB_SupportCenter;
	private static final String LOG_SEVERITY_ERROR = System.Label.BI_PSP_ErrorSeverity;
	/** * @description Retrieves a list of cases based on the provided filter criteria, including type, status, and account Id.
	 * Queries the Case object and returns matching records. The query uses the CareProgramEnrollee lookup field, so user mode cannot be added here.
	 * @param type The type of cases to retrieve. Pass 'all' to retrieve all types.
	 * @param status The status of cases to retrieve. Pass 'all' to retrieve cases with all statuses.
	 * @return A list of Case records matching the provided filter criteria. This return is used in the BI_PSPB_CaseSupportCtrl component.
	 */
	@AuraEnabled(cacheable=true)
	public static List<Case> getCases(String type, String status) {
		String programId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
		String enrolleeFields = 'Id, AccountId';
		String enrolleeConditions = 'Id = \'' + programId + '\' LIMIT 1';
		Boolean withUserMode = false;

		List<SObject> enrolleeResults = BI_PSP_CommonQueryUtility.executeQuery(
			'CareProgramEnrollee',
			enrolleeFields,
			enrolleeConditions,
			withUserMode
		);
		if (enrolleeResults.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				LOG_SEVERITY_ERROR
			);
			return null;
		}

		CareProgramEnrollee careProgram = (CareProgramEnrollee) enrolleeResults[0];
		Id accountId = careProgram.AccountId;

		List<SObject> caseResults = buildCaseQuery(accountId, status, type);

		if (caseResults.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				LOG_SEVERITY_ERROR
			);
			return null;
		}
		return (List<Case>) caseResults;
	}

	private static List<SObject> buildCaseQuery(
		Id accountId,
		String status,
		String type
	) {
		String caseFields = 'Id, CaseNumber, Subject, Status, Priority, Type, BI_PSP_Patient__c, BI_PSPB_Sub_Type__c, Description, CreatedDate';
		String caseConditions =
			'AccountId = \'' +
			accountId +
			'\' AND RecordType.Name = \'' +
			supportCenter +
			'\'';

		String statusFilter = buildStatusFilter(status);
		String typeFilter = buildTypeFilter(type, status);

		if (!String.isBlank(statusFilter)) {
			caseConditions += statusFilter;
		}
		if (!String.isBlank(typeFilter)) {
			caseConditions += typeFilter;
		}

		Boolean withUserMode = false;
		return BI_PSP_CommonQueryUtility.executeQuery(
			'Case',
			caseFields,
			caseConditions,
			withUserMode
		);
	}

	private static String buildStatusFilter(String status) {
		if (String.isBlank(status)) {
			return '';
		}
		if (status.equalsIgnoreCase('all')) {
			return ' AND (Status = \'Submitted\' OR Status = \'Draft\' OR Status = \'Need More Information\')';
		}
		if (status.equalsIgnoreCase('Draft')) {
			return ' AND (Status = \'Draft\' OR Status = \'Need More Information\')';
		}
		return ' AND Status = \'' + status + '\'';
	}

	private static String buildTypeFilter(String type, String status) {
		if (type.equalsIgnoreCase('all') || status.equalsIgnoreCase('Draft')) {
			return '';
		}
		return ' AND Type = \'' + type + '\'';
	}
	/** * @description Retrieves the details of a specific Case record identified by the caseId parameter.
	 * Queries the Case object and returns the corresponding Case record with various details.
	 * @param caseId The Id of the Case record to retrieve details for.
	 * @return The Case record containing details such as Id, Subject, Type, Description, Status, Sub-Type, Created Date, and Created By Id. */
	@AuraEnabled
	public static Case getCaserecord(Id caseId) {
		if (caseId == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ConstantsClassCtrl.parameterError,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				LOG_SEVERITY_ERROR
			);
			return null;
		}
		String caseFields = 'Id, Subject, Type, Description, Status, BI_PSPB_Sub_Type__c, CreatedDate, CreatedBy.Name';
		String caseConditions = 'Id = \'' + caseId + '\'';
		Boolean withUserMode = true;
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Case',
			caseFields,
			caseConditions,
			withUserMode
		);
		if (results.isEmpty()) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				LOG_SEVERITY_ERROR
			);
			return null;
		}
		return (Case) results[0];
	}

	/** * @description Retrieves the base64 encoded image data associated with the provided caseId.
	 * If image data is found, it is returned as a base64 encoded string. If no image data is found, an empty string is returned.
	 * @param caseId The Id of the Case for which to retrieve the image data.
	 * @return A base64 encoded string representing the image data, or an empty string if no image data is found.*/

	@AuraEnabled(cacheable=true)
	public static String getBaseImage(Id caseId) {
		if (caseId == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ConstantsClassCtrl.parameterError,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				LOG_SEVERITY_ERROR
			);
		}
		Id contentDocumentId = getContentDocumentId(caseId);
		if (contentDocumentId == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				LOG_SEVERITY_ERROR
			);
		}
		return getImage(contentDocumentId);
	}

	/** * @description Retrieves the ContentDocumentId related to the provided caseId.
	 * @param caseId The Id of the Case for which to retrieve the ContentDocumentId.
	 * @return The ContentDocumentId associated with the Case, or null if no document link is found.*/

	private static Id getContentDocumentId(Id caseId) {
		String fields = 'ContentDocumentId';
		String sObjectType = 'ContentDocumentLink';
		String conditions =
			'LinkedEntityId = \'' +
			caseId +
			'\' AND ContentDocument.FileType IN (\'jpg\', \'png\')';
		Boolean withUserMode = true; // Enforce sharing rules

		// Use the utility method to execute the query
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			sObjectType,
			fields,
			conditions,
			withUserMode
		);
		List<ContentDocumentLink> docLinks = (List<ContentDocumentLink>) results;

		return docLinks.isEmpty() ? null : docLinks[0].ContentDocumentId;
	}

	/** * @description Retrieves the base64 encoded image data from the ContentVersion based on the provided ContentDocumentId.
	 * @param contentDocumentId The Id of the ContentDocument to retrieve image data for.
	 * @return A base64 encoded string representing the image data, or an empty string if no image data is found. */
	private static String getImage(Id contentDocumentId) {
		String sObjectType = 'ContentVersion';
		String fields = 'VersionData';
		String conditions =
			'ContentDocumentId = \'' +
			contentDocumentId +
			'\' AND FileType IN (\'jpg\', \'png\')';
		Boolean withUserMode = true;

		// Use the utility method to execute the query
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			sObjectType,
			fields,
			conditions,
			withUserMode
		);
		List<ContentVersion> contents = (List<ContentVersion>) results;

		if (contents.isEmpty() || contents[0].VersionData == null) {
			BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ConstantsClassCtrl.error,
				BI_PSPB_CaseSupportCtrl.class.toString(),
				false,
				LOG_SEVERITY_ERROR
			);
		}

		return baseImage + EncodingUtil.base64Encode(contents[0].VersionData);
	}
}