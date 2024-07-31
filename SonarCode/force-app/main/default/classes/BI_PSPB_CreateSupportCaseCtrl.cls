/*
 * @description Apex class for creating and managing support cases related to the BI_PSPB module.
 * History
 * Version  Author          Date        Detail      Description
 * 59       Niyas       06-01-2024      Created     Initial Version
 * 59       Niyas       18-04-2024      Updated     Code review changes
 */
public with sharing class BI_PSPB_CreateSupportCaseCtrl {
    private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues(
        'PSPB'
    );
    private static String applicationName = settings != null
        ? settings.BI_SFCOE_LOG_Application__c
        : '';
    private static String caseRecordTypeName = System.Label.BI_PSPB_SupportCenter;
    /**
     *@description  Creates a new support case.
     * @param accountId The ID of the associated account.
     * @param type The type of the case.
     * @param subType The subtype of the case.
     * @param description The description of the case.
     * @param fileIds The IDs of the files to be linked to the case.
     * @return The ID of the created case.
     */
    @AuraEnabled(cacheable=false)
    public static id createCase(LeadWrapper wrapper, List<String> fileIds) {
        //We are not checking LeadWrapper because all fields are mandatory in UI.
        Case supportCaseToInsert = new Case();
        try {
            String errorMsg = '';
            //CareProgramEnrollee is a Healthcloud object. Hence we have not used USER_MODE.
            CareProgramEnrollee careProgramRecord = [
                SELECT Id, AccountId
                FROM CareProgramEnrollee
                WHERE Id = :wrapper.accountId
                LIMIT 1
            ];
            if (careProgramRecord != null) {
                String recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName()
                    .get(caseRecordTypeName)
                    .getRecordTypeId();
                if (String.isBlank(recordTypeId)) {
                    throw new AuraHandledException(
                        BI_PSPB_ConstantsClassCtrl.errorMsgRecordTypeNotFound
                    ); // Return null if leadId is blank
                }
                supportCaseToInsert.Type = wrapper.type;
                supportCaseToInsert.BI_PSPB_Sub_Type__c = wrapper.subType;
                supportCaseToInsert.Description = wrapper.description;
                supportCaseToInsert.BI_PSP_Patient__c = careProgramRecord.Id;
                supportCaseToInsert.AccountId = careProgramRecord.AccountId;
                supportCaseToInsert.RecordTypeId = recordTypeId;
                supportCaseToInsert.Status = BI_PSPB_ConstantsClassCtrl.submitted;
                //insert supportCaseToInsert;
                Database.SaveResult[] saveResults = Database.insert(
                    new List<Case>{ supportCaseToInsert },
                    false
                );
                for (Database.SaveResult saveResult : saveResults) {
                    if (!saveResult.isSuccess()) {
                        for (Database.Error error : saveResult.getErrors()) {
                            errorMsg +='Error '+error.getFields()+'--'+error.getMessage()+'\n';
                        }
                    }
                }
                if (String.isNotBlank(errorMsg)) {
                    BI_SFCOE_LOG_Util.handleDatabaseSaveResults(
                        saveResults,BI_PSPB_CreateSupportCaseCtrl.class.toString(),System.now()
                    );
                    throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgInsert);
                }
               
                if (supportCaseToInsert == null) {
                   throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound);
                } else {
                    if(!fileIds.isEmpty()){
                    	linkFilesToCase(supportCaseToInsert.Id, fileIds);
                    }
                    return supportCaseToInsert.id;
                }
            } else {
               throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgRecordNotFound);     
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.recordCannotFound
            );
        }
    }
    /**
     * @description Associates files with a specified Case record by creating ContentDocumentLink records.
     * Each ContentDocumentLink associates a file with the Case.
     * @param caseId The Id of the Case record to which the files will be linked.
     * @param fileIds A List of file Ids (ContentDocumentIds) to be linked to the Case.
     *
     * @throws Exception If an error occurs during the insertion of ContentDocumentLink records.
     */
    @AuraEnabled(cacheable=false)
    public static void linkFilesToCase(Id caseId, List<String> fileIds) {
        try {
            String errorMsg = '';
            if (String.isBlank(caseId) || fileIds.isEmpty()) {
                throw new AuraHandledException(
                    BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound
                );
            }
            List<ContentDocumentLink> fileLinks = new List<ContentDocumentLink>();
            for (String fileId : fileIds) {
                ContentDocumentLink link = new ContentDocumentLink();
                link.ContentDocumentId = fileId;
                link.LinkedEntityId = caseId;
                link.ShareType = 'I';
                fileLinks.add(link);
            }
            Database.SaveResult[] saveResults = Database.insert(
                fileLinks,
                false
            );
            for (Database.SaveResult saveResult : saveResults) {
                if (!saveResult.isSuccess()) {
                    for (Database.Error error : saveResult.getErrors()) {
                        errorMsg +=
                            'Error ' +
                            error.getFields() +
                            '--' +
                            error.getMessage() +
                            '\n';
                    }
                }
            }
            if (String.isNotBlank(errorMsg)) {
                BI_SFCOE_LOG_Util.handleDatabaseSaveResults(
                    saveResults,
                    BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                    System.now()
                );
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgInsert);
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.recordCannotFound
            );
        }
    }
    /**
     * @description  Updates a Case record with the provided information and links files to it.
     * @param recId The Id of the Case record to update.
     * @param Type The new Type value for the Case.
     * @param description The new Description value for the Case.
     * @param fileIds A List of file Ids (ContentDocumentIds) to link to the Case.
     * @return The Id of the updated Case record.
     */
    @AuraEnabled(cacheable=false)
    public static Id updateCase(
        String recId,
        String type,
        String description,
        List<String> fileIds
    ) {
        try {
            String errorMsg = '';
            Case supportCaseToUpdate = null; // Declare the variable outside the try block
            if (
                String.isBlank(recId) ||
                String.isBlank(type) ||
                String.isBlank(description)
            ) {
                throw new AuraHandledException(
                    BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound
                );
            }
            //Since Careprogramenrollee lookup field is used we cannot use USER_MODE here.
            supportCaseToUpdate = [
                SELECT Id, Description
                FROM Case
                WHERE Id = :recId
                LIMIT 1
            ];
            if (supportCaseToUpdate == null) {
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound);
            }
            supportCaseToUpdate.Type = type;
            supportCaseToUpdate.Description = description;
            supportCaseToUpdate.Status = BI_PSPB_ConstantsClassCtrl.submitted;
            Database.SaveResult[] saveResults = Database.update(
                new List<Case>{ supportCaseToUpdate },
                false
            );
            for (Database.SaveResult saveResult : saveResults) {
                if (!saveResult.isSuccess()) {
                    for (Database.Error error : saveResult.getErrors()) {
                        errorMsg +='Error '+error.getFields()+'--'+error.getMessage()+'\n';
                    }
                }
            }
            if (String.isNotBlank(errorMsg)) {
                BI_SFCOE_LOG_Util.handleDatabaseSaveResults(
                    saveResults,BI_PSPB_CreateSupportCaseCtrl.class.toString(),System.now()
                );
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgUpdate);
            }
            if (supportCaseToUpdate == null) {
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgRecordNotFound);
            } else{
                if(!fileIds.isEmpty()){
                   linkFilesToCase(supportCaseToUpdate.Id, fileIds);
                }
                return supportCaseToUpdate != null ? supportCaseToUpdate.Id : null;
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.recordCannotFound
            );
        }
    }
    /**
     * @description  Updates a Case record with the provided information and links files to it.
     * @param recId The Id of the Case record to update.
     * @param type The new Type value for the Case.
     * @param Description The new Description value for the Case.
     * @param fileIds A List of file Ids (ContentDocumentIds) to link to the Case.
     * @return The Id of the updated Case record.
     */

    @AuraEnabled(cacheable=false)
    public static id caseDraft(LeadWrapper wrapper, List<String> fileIds) {
        //We are not checking LeadWrapper because all fields are mandatory in UI.
        Case supportCaseToUpdate = new Case();
        try {
            String errorMsg = '';
            //CareProgramEnrollee is a Healthcloud object. Hence we have not used USER_MODE.
            CareProgramEnrollee careProgramRecord = [
                SELECT Id, AccountId
                FROM CareProgramEnrollee
                WHERE Id = :wrapper.accountId
                LIMIT 1
            ];
            if (careProgramRecord != null) {
                String recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName()
                    .get(caseRecordTypeName)
                    .getRecordTypeId();
                if (String.isBlank(recordTypeId)) {
                    throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgRecordTypeNotFound);
                }
                supportCaseToUpdate.Type = wrapper.type;
                supportCaseToUpdate.BI_PSPB_Sub_Type__c = wrapper.subType;
                supportCaseToUpdate.Description = wrapper.description;
                supportCaseToUpdate.BI_PSP_Patient__c = careProgramRecord.Id;
                supportCaseToUpdate.AccountId = careProgramRecord.AccountId;
                supportCaseToUpdate.RecordTypeId = recordTypeId;
                supportCaseToUpdate.Status = BI_PSPB_ConstantsClassCtrl.draft;
                Database.SaveResult[] saveResults = Database.insert(
                    new List<Case>{ supportCaseToUpdate },
                    false,
                    AccessLevel.USER_MODE
                );
                for (Database.SaveResult saveResult : saveResults) {
                    if (!saveResult.isSuccess()) {
                        for (Database.Error error : saveResult.getErrors()) {
                            errorMsg +='Error '+error.getFields()+'--'+error.getMessage()+'\n';
                        }
                    }
                }
                if (String.isNotBlank(errorMsg)) {
                    BI_SFCOE_LOG_Util.handleDatabaseSaveResults(
                        saveResults,BI_PSPB_CreateSupportCaseCtrl.class.toString(),System.now()
                    );
                    throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgInsert);
                }
                if (supportCaseToUpdate == null) {
                    throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound);
                } else {
                    if(!fileIds.isEmpty()){
                        linkFilesToCase(supportCaseToUpdate.Id, fileIds);
                    }
                    return supportCaseToUpdate.id;
                }
            } else {
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgRecordNotFound);
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.recordCannotFound
            );
        }
    }
    @AuraEnabled(cacheable=false)
    public static Id updateDraft(
        String recId,
        String type,
        String description,
        List<String> fileIds
    ) {
        try {
            String errorMsg = '';
            Case supportCaseToUpdate = null; // Declare the variable outside the try block
            if (
                String.isBlank(recId) ||
                String.isBlank(description)
            ) {
                throw new AuraHandledException(
                    BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound
                );
            }
            //Since Careprogramenrollee lookup field is used we cannot use USER_MODE here.
            supportCaseToUpdate = [
                SELECT Id, Type, Description
                FROM Case
                WHERE Id = :recId
                LIMIT 1
            ];
            if (supportCaseToUpdate == null) {
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound);
            }
            supportCaseToUpdate.Type = type;
            supportCaseToUpdate.Description = description;
            supportCaseToUpdate.Status = BI_PSPB_ConstantsClassCtrl.draft;
            Database.SaveResult[] saveResults = Database.update(
                new List<Case>{ supportCaseToUpdate },
                false,
                AccessLevel.USER_MODE
            );
            for (Database.SaveResult saveResult : saveResults) {
                if (!saveResult.isSuccess()) {
                    for (Database.Error error : saveResult.getErrors()) {
                        errorMsg +='Error '+error.getFields()+'--'+error.getMessage()+'\n';
                    }
                }
            }
            if (String.isNotBlank(errorMsg)) {
                BI_SFCOE_LOG_Util.handleDatabaseSaveResults(
                    saveResults,BI_PSPB_CreateSupportCaseCtrl.class.toString(),System.now()
                );
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgUpdate);
            }
            if (supportCaseToUpdate == null) {
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgRecordNotFound);
            }
            if(!fileIds.isEmpty()){
                linkFilesToCase(supportCaseToUpdate.Id, fileIds);
            }
            return supportCaseToUpdate != null ? supportCaseToUpdate.Id : null;
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.recordCannotFound
            );
        }
    }

    /**
     * @description Retrieves the latest draft Case record related to a specified Care Program Enrollee.
     * @param accountId The Id of the Care Program Enrollee for which to retrieve the draft Case record.
     * @return The latest draft Case record related to the specified Care Program Enrollee, or null if no matching records are found.
     */

    @AuraEnabled(cacheable=true)
    public static List<Case> getPSPCaseRecordsMedical(String accountId) {
        if (String.isBlank(accountId)) {
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.errorMsgPatientIdNotFound
            );
        }
        try {
            List<Case> relatedCases = new List<Case>();

                // Retrieve cases with Type = 'Medical Information Enquiry'
                //Since Careprogramenrollee lookup field is used we cannot use USER_MODE here.
                relatedCases = [
                    SELECT
                        Id,
                        BI_PSPB_Sub_Type__c,
                        Description,
                        BI_PSP_Patient__r.AccountId,
                        CreatedDate
                    FROM Case
                    WHERE
                        Id = :accountId
                        AND (Status = :BI_PSPB_ConstantsClassCtrl.draft
                        OR Status = :BI_PSPB_ConstantsClassCtrl.needMoreInfo)
                        AND Type = :BI_PSPB_ConstantsClassCtrl.medicalInfoEnquiry
                    ORDER BY CreatedDate DESC
                    LIMIT 1
                ];
           
            if (!relatedCases.isEmpty()) {
                return relatedCases;
            } else {
                throw new AuraHandledException(
                    BI_PSPB_ConstantsClassCtrl.recordCannotFound
                );
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.recordCannotFound
            );
        }
    }

    /**
     *@description  Retrieves the most recent Case record with specific criteria related to adverse events reporting.
     * @param accountId The Id of the CareProgramEnrollee record associated with the Case.
     * @return The most recent Case record meeting the criteria, or null if no matching record is found.
     */

    @AuraEnabled(cacheable=true)
    public static List<Case> getPSPCaseRecordsReport(String accountId) {
        if (String.isBlank(accountId)) {
              BI_SFCOE_LOG_Util.logMessage(
                            applicationName,
                            BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                            BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound,
                            System.now(),
                            '',
                            BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                        );                        
        }
        try {
            List<Case> relatedCases = new List<Case>();
            
                //Since Careprogramenrollee lookup field is used we cannot use USER_MODE here.
                relatedCases = [
                    SELECT
                        Id,
                        BI_PSPB_Sub_Type__c,
                        Description,
                        BI_PSP_Patient__r.AccountId,
                        CreatedDate
                    FROM Case
                    WHERE
                        Id = :accountId
                        AND (Status = :BI_PSPB_ConstantsClassCtrl.draft
                        OR Status = :BI_PSPB_ConstantsClassCtrl.needMoreInfo)
                        AND Type = :BI_PSPB_ConstantsClassCtrl.reportAdverseEvents
                    ORDER BY CreatedDate DESC
                    LIMIT 1
                ];
            
            if (!relatedCases.isEmpty()) {
                return relatedCases;
            } else {
                  BI_SFCOE_LOG_Util.logMessage(
                            applicationName,
                            BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                            BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound,
                            System.now(),
                            '',
                            BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
                        );                        
                        return null;
                //throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.recordCannotFound);
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.recordCannotFound
            );
        }
    }
    /**
     *@description  Retrieves a list of draft Case records related to a specified account.
     * @param accountId The Id of the account for which to retrieve related Case records.
     * @return A list of draft Case records related to the specified account.
     */

    @AuraEnabled(cacheable=true)
    public static List<Case> getPSPCaseRecordsPlatformSupport(
        String accountId
    ) {
        try {
            if (String.isBlank(accountId)) {
                throw new AuraHandledException(BI_PSPB_ConstantsClassCtrl.errorMsgPatientIdNotFound);
            }
            List<Case> relatedCases = new List<Case>();
            
                //Since Careprogramenrollee lookup field is used we cannot use USER_MODE here.
                relatedCases = [
                    SELECT
                        Id,
                        BI_PSPB_Sub_Type__c,
                        Description,
                        BI_PSP_Patient__r.AccountId,
                        CreatedDate
                    FROM Case
                    WHERE
                        Id = :accountId
                        AND (Status = :BI_PSPB_ConstantsClassCtrl.draft
                        OR Status = :BI_PSPB_ConstantsClassCtrl.needMoreInfo)
                        AND Type = :BI_PSPB_ConstantsClassCtrl.platformSupport
                    ORDER BY CreatedDate DESC
                    LIMIT 1
                ];
            // } else {
            //     throw new AuraHandledException(
            //         BI_PSPB_ConstantsClassCtrl.errorMsgRecordNotFound
            //     );
            // }
            if (!relatedCases.isEmpty()) {
                return relatedCases;
            } else {
                throw new AuraHandledException(
                    BI_PSPB_ConstantsClassCtrl.recordCannotFound
                );
            }
        } catch (Exception ex) {
            BI_SFCOE_LOG_Util.handleException(
                ex,
                applicationName,
                BI_PSPB_CreateSupportCaseCtrl.class.toString(),
                null,
                System.now()
            );
            throw new AuraHandledException(
                BI_PSPB_ConstantsClassCtrl.recordCannotFound
            );
        }
    }
    /**
     * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,updateCaregiverDetails
     * updatePatientExcistInfo,updatePatientorCargiverInfo.
     * @param accountId The new accountId of the patient or caregiver.
     * @param type The new type of the patient or caregiver.
     * @param subType The new subtype address of the patient or caregiver.
     * @param description The new description of the patient or caregiver.
     */
    public class LeadWrapper {
        @AuraEnabled
        public String accountId { get; set; }
        @AuraEnabled
        public String type { get; set; }
        @AuraEnabled
        public String subType { get; set; }
        @AuraEnabled
        public String description { get; set; }
    }
}