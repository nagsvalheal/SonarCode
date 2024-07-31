/**
 * @description    This class is used to create a Physician .
 *                 Lead is being created by a guest user, so this class is enabled without sharing mode.
 * 
 * History:
 * Version    Author        Date         Detail              Description
 * 1.0        Ashif         20-07-2024   Created             Initial development
 * 1.0        Ashif         30-07-2024   Updated             Add LogMessages
 */
public without sharing class BI_PSPB_EnrollmentPhysician {
   
    /**
     * @description   Creates a Contact record for an HCP (Healthcare Provider).
     * @param         hcpData - The wrapper class containing the HCP data.
     * @param         hcpdetail - The wrapper class containing the HCP data.
     * @return        Id - The ID of the created Contact.
     */
     @AuraEnabled
    public static Id hcpCreate(BI_PSPB_EnrollementWrapper.DataWrapper hcpData,BI_PSPB_EnrollementWrapper.HcpWrapper hcpdetail) {
        if (hcpData == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.paramError,BI_PSPB_EnrollmentPhysician.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.LOG_SEVERITY_ERROR);
        }

        List<Id> conList = new List<Id>();
        try {
            Id recordTypeId = BI_PSP_CommonQueryUtility.retrieveRecordTypeId('Contact',BI_PSPB_EnrollmentConstantCtrl.physician );

            Contact con = new Contact(
                FirstName = hcpData.firstName,
                LastName = hcpData.lastName,
                BI_PSPB_License_number__c = hcpdetail.lisence,
                BI_PSPB_Practice__c = hcpdetail.practice,
                BI_PSPB_Practice_Type__c = hcpdetail.type,
                Phone = hcpData.phone,
                Email = hcpData.email,
                MailingCountryCode = hcpData.country,
                MailingStateCode = hcpData.state,
                MailingCity = hcpData.city,
                MailingStreet = hcpData.street,
                MailingPostalCode = hcpData.code,
                BI_PSPB_Address_Line__c = hcpdetail.addressLine,
                RecordTypeId = recordTypeId
            );

            conList = BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
                new List<Contact>{ con },
                BI_PSPB_EnrollmentPhysician.class.toString(),
                false
            );

            if (conList.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_EnrollmentConstantCtrl.recordCannotFound,BI_PSPB_EnrollmentPhysician.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.LOG_SEVERITY_ERROR);
            }

        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
            BI_PSPB_EnrollmentConstantCtrl.InsertionFailed,
                BI_PSPB_EnrollmentPhysician.class.getName(),
                ex
            );
        }

        return conList[0];
    }

   
}