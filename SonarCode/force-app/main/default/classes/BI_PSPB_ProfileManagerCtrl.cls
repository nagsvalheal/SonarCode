/*
* @description   This class is used for getting Account Id, Creating Contact,Creating Enrollee caregiver,grand access
*                Reason for using whithout sharing lead converted can only be accessed by admin user and can't be
*                accessed by external users,Enrolee caregiver contains a lookup field to a Care Program Enrollee, 
				 which is a Health Cloud object; hence, we cannot utilize user mode here.
*                
* History:
* Version	Author			Date			Detail				Description
* 1.0		NandhaKumar	    05-01-2024  	Created				Initial development
* 1.1		NandhaKumar 	01-Dec-2023		Updated				Updated the Caregiver record 
* 1.2		NandhaKumar 	04-Apr-2023		Updated				Catch log added
*/

public without sharing class BI_PSPB_ProfileManagerCtrl {

  
  /**
*  @description :Retrieves caregiver details based on the current user's ID
				 return in lwc biPspbCaregiverProfile.Enrolee caregiver contains a lookup field to a Care Program Enrollee, 
				 which is a Health Cloud object; hence, we cannot utilize user mode here.
* @param        :none.
* @return       :List of Account records representing caregivers.
*/

@AuraEnabled(cacheable=true)
public static List<Account> userCaregiver() {
    List<Account> accounts = BI_PSPB_CaregiverServiceCtrl.fetchAccountByUser(UserInfo.getName(), UserInfo.getUserEmail());
    String caregiverId;
    try {
        
        caregiverId = BI_PSPB_CaregiverServiceCtrl.fetchCaregiverIdByAccountId(accounts[0].Id);
            
        
        if (accounts.isEmpty()) {
               BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotFound, BI_PSPB_ProfileManagerCtrl.class.toString(),TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
             
        }
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
    return BI_PSPB_CaregiverServiceCtrl.fetchCaregiverDetailsById(caregiverId);
}





  /**
   * @description Updates caregiver details in the Salesforce database.return in lwc biPspbCaregiverProfile
   * @param accountId The ID of the account to update.
   * @param firstName The updated first name of the caregiver.
   * @param lastName The updated last name of the caregiver.
   * @param birthdate The updated birth date of the caregiver.
   * @param relationshipVal The updated relationship of the caregiver to the patient.
   * @param personEmailVal The updated email of the caregiver.
   * @param phoneVal The updated phone number of the caregiver.
   * @param communicationMode The updated preferred communication method of the caregiver.
   * @return A success message if the update is successful, otherwise an error message.
   */


  @AuraEnabled
public static void updateCaregiverDetails(BI_PSPB_CaregiverDetailsWrapper cgprofile) {
    try {
        if (BI_PSPB_CaregiverServiceCtrl.isProfileValid(cgprofile)) {
            List<Account> accounts = BI_PSPB_CaregiverServiceCtrl.fetchAccountById(cgprofile.accountId);
            
            if (!accounts.isEmpty()) {
                Account accountToUpdate = accounts[0];
                BI_PSPB_ProfileManagerHelperCtrl.updateAccountDetails(accountToUpdate, cgprofile);
                
                 BI_PSPB_ProfileManagerHelperCtrl.saveAccount(accountToUpdate);
        
            
        } 
    }
    }
    
    catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
}

  /**
* @description  :Updates the status and related records based on the checkbox selection,
				 Retrieves caregiver details based on the current user's ID,Enrolee caregiver contains a lookup field to a Care Program Enrollee, 
				 which is a Health Cloud object; hence, we cannot utilize user mode here. return in lwc biPspbaddcaregiver
* @param        :isChecked A boolean value indicating whether the checkbox is checked or not.True: Checkbox is checked.False: Checkbox is not checked.
* @return       :none
*/
@AuraEnabled
public static void updateContactFromCheckbox(Boolean isChecked) {
    try {
        if (isChecked == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_ProfileManagerCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
           
        }

        BI_PSPB_Enrollee_Caregiver__c ecRecord = BI_PSPB_CaregiverServiceCtrl.fetchEnrolleeCaregiver(BI_PSPB_ProfileManagerConstCtrl.userName, BI_PSPB_ProfileManagerConstCtrl.userEmail);
        if (ecRecord == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_ProfileManagerCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
          
        }

        ecRecord.BI_PSPB_Status__c = isChecked ? BI_PSPB_ProfileManagerConstCtrl.active : BI_PSPB_ProfileManagerConstCtrl.inActive;
         BI_PSPB_CaregiverServiceCtrl.updateEnrolleeCaregiver(ecRecord);
        Contact contact = BI_PSPB_CaregiverServiceCtrl.fetchContactById(ecRecord.BI_PSPB_Contact_Id__c);
        if (contact == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_ProfileManagerCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
            
        }
        contact.BI_PSPB_GrantAccess__c = isChecked;

        Account account = BI_PSPB_CaregiverServiceCtrl.fetchAccountId(ecRecord.BI_PSPB_Caregiver__c);
        if (account != null) {
            account.BI_PSPB_GrantCaregiverAccess__c = isChecked;
        }

         BI_PSPB_ProfileManagerHelperCtrl.updateContactAndAccount(contact, account);
        
    } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
}



  /**
* @description : Retrieves the list of caregiver records with their access permissions based on the logged-in user's email.
				 Enrolee caregiver contains a lookup field to a Care Program Enrollee,which is a Health Cloud object; 
				 hence, we cannot utilize user mode here.return in lwc biPspbaddcaregiver
* @return      : List of BI_PSPB_Enrollee_Caregiver__c records representing caregivers and their access permissions.
*/
 
  @AuraEnabled(cacheable=true)
public static List<BI_PSPB_Enrollee_Caregiver__c> grandAccessButton() {
     List<BI_PSPB_Enrollee_Caregiver__c> ecList = BI_PSPB_CaregiverServiceCtrl.fetchEnrolleeCaregiversByUserEmail(BI_PSPB_ProfileManagerConstCtrl.userEmail);
    try {
       
        
        if (ecList.isEmpty()) {
            return null;// when caregiver data newly insert so the record not available there that's why we return null value
            
        } 
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
    return ecList;
}


  /**
* @description: Retrieves a list of BI_PSPB_Enrollee_Caregiver__c records based on the current user's ID.
*               This method queries the BI_PSPB_Enrollee_Caregiver__c object to retrieve records related to the user's account.
				Enrolee caregiver contains a lookup field to a Care Program Enrollee,which is a Health Cloud object; 
				hence, we cannot utilize user mode here.return in lwc biPspbaddcaregiver
* @param      : none
* @return     : A list of BI_PSPB_Enrollee_Caregiver__c records associated with the user's account. 

*/
  
 @AuraEnabled(cacheable=true)
public static List<BI_PSPB_Enrollee_Caregiver__c> getCaregiverDataView() {
    List<BI_PSPB_Enrollee_Caregiver__c> caregiverListData = new List<BI_PSPB_Enrollee_Caregiver__c> ();
    try {
        Account acc = BI_PSPB_AccountServiceCtrl.getAccountByNameAndEmail(BI_PSPB_ProfileManagerConstCtrl.userName, BI_PSPB_ProfileManagerConstCtrl.userEmail);
        Id accountId = (acc != null) ? acc.Id : null;

       caregiverListData = (accountId != null) ?
            BI_PSPB_CaregiverServiceCtrl.getCaregiverListByPatientId(accountId) : new List<BI_PSPB_Enrollee_Caregiver__c>();

        if (caregiverListData.isEmpty()) {
             return null; // when caregiver data newly insert so the record not available there that's why we return null value
          
        } 
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
      return caregiverListData;
}


  /**
* @description :This method retrieves the contact record associated with the caregiverId and updates the specified fields
				return in lwc biPspbaddcaregiver.
* @param       :caregiverId The ID of the caregiver contact record to update.
* @param       :firstName The new first name of the caregiver.
* @param       :lastName The new last name of the caregiver.
* @param       :relationship The new relationship to the patient of the caregiver.
* @param       :phone The new phone number of the caregiver.
* @param       :email The new email address of the caregiver.
* @return      :A list containing the updated Contact record, or an empty list if the update fails.
*/


@AuraEnabled
public static List<Contact> updateCaregivers(BI_PSPB_CaregiverDetailsWrapper caregiverwrapper) {
    try {
        if (caregiverwrapper == null || caregiverwrapper.accountId == null) {
           BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_ProfileManagerCtrl.class.toString(), TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }
        
        Contact contactToUpdate = BI_PSPB_CaregiverServiceCtrl.getContactById(caregiverwrapper.accountId);
        if (contactToUpdate == null) {
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_ProfileManagerCtrl.class.toString(), TRUE, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        }
        
        BI_PSPB_ProfileManagerHelperCtrl.updateContactDetails(contactToUpdate, caregiverwrapper);
        Database.SaveResult[] saveResult = BI_PSPB_ProfileManagerHelperCtrl.saveContacts(contactToUpdate);

       
        
        return new List<Contact>{ contactToUpdate };
    } 
       catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
              // Ensure the method returns an empty list in case of an exception
        return new List<Contact>();
        }
}



  /**

* @description This method updates various fields of the patient account identified by the accountId parameter
			   return in lwc biPspbCgPatientinfo
* @param accountId The ID of the patient account to update.
* @param firstname The new first name of the patient.
* @param lastname The new last name of the patient.
* @param personEmail The new email address of the patient.
* @param personbirthdate The new birthdate of the patient.
* @param personGender The new gender of the patient.
* @param preferredmethodofcontact The new preferred method of contact for the patient.
* @param street The new street address of the patient.
* @param city The new city of the patient.
* @param state The new state of the patient.
* @param country The new country of the patient.
* @param postalCode The new postal code of the patient.
* @param phone The new phone number of the patient.
* @throws AuraHandledException if the account record with the specified accountId is not found.
*/
 

 @AuraEnabled
public static void updatePatientExcistInfo(BI_PSPB_CaregiverDetailsWrapper wrapper) {
    try {
        
        
        // Fetch the account details
        Account accValue = BI_PSPB_CaregiverServiceCtrl.getAccountById(wrapper.accountId);
       
        // Update the account details
        BI_PSPB_ProfileManagerHelperCtrl.updateAccountDetail(accValue, wrapper);
        
        // Save the updated account and handle errors if any
        Database.SaveResult[] saveResult = BI_PSPB_ProfileManagerHelperCtrl.saveAccounts(accValue);
       
        
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
}



//   /**
// *  @description This method updates various fields of the patient or caregiver account identified by the accountId parameter
// return in lwcbiPspbPatientProfiledetails 
// * @param accountId The ID of the patient or caregiver account to update.
// * @param firstname The new first name of the patient or caregiver.
// * @param lastname The new last name of the patient or caregiver.
// * @param personemail The new email address of the patient or caregiver.
// * @param personbirthdate The new birthdate of the patient or caregiver.
// * @param persongender The new gender of the patient or caregiver.
// * @param preferredmethodofcontact The new preferred method of contact for the patient or caregiver.
// * @param street The new street address of the patient or caregiver.
// * @param city The new city of the patient or caregiver.
// * @param state The new state of the patient or caregiver.
// * @param country The new country of the patient or caregiver.
// * @param postalCode The new postal code of the patient or caregiver.
// * @param phone The new phone number of the patient or caregiver.
// * @throws AuraHandledException if the account record with the specified accountId is not found.
// */
 
 @AuraEnabled
public static void updatePatientorCargiverInfo(BI_PSPB_CaregiverDetailsWrapper wrapper) {
    
    
    Account accValue = BI_PSPB_CaregiverServiceCtrl.getAccountvalue(wrapper.accountId);
   

    try {
        BI_PSPB_ProfileManagerHelperCtrl.updateAccDetails(accValue, wrapper);
        
        Database.SaveResult[] saveResult = BI_PSPB_ProfileManagerHelperCtrl.saveAccountt(accValue);
        
        
    }  catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                ex.getMessage(),
                BI_PSPB_ProfileManagerConstCtrl.class.toString(),
                ex
            );
        }
}


 // /**
 // * @description  Wrapper classes are used to hold a group of related data fields together.used to updateCaregivers,
 //                 updateCaregiverDetails,updatePatientExcistInfo,updatePatientorCargiverInfo
 // * @param        accountId The ID of the patient or caregiver account to update.
 // * @param        firstname The new first name of the patient or caregiver.
 // * @param        lastname The new last name of the patient or caregiver.
 // * @param        personemail The new email address of the patient or caregiver.
 // * @param        personbirthdate The new birthdate of the patient or caregiver.
 // * @param        persongender The new gender of the patient or caregiver.
 // * @param        preferredmethodofcontact The new preferred method of contact for the patient or caregiver.
 // * @param        street The new street address of the patient or caregiver.
 // * @param        city The new city of the patient or caregiver.
 // * @param        state The new state of the patient or caregiver.
 // * @param        country The new country of the patient or caregiver.
 // * @param        postalCode The new postal code of the patient or caregiver.
// * @param        phone The new phone number of the patient or caregiver.


  public class BI_PSPB_CaregiverDetailsWrapper {
    @AuraEnabled
    public String accountId { get; set; }
    @AuraEnabled
    public String firstName { get; set; }
    @AuraEnabled
    public String lastName { get; set; }
    @AuraEnabled
    public String personEmail { get; set; }
    @AuraEnabled
    public Date personBirthdate { get; set; }
    @AuraEnabled
    public String personGender { get; set; }
    @AuraEnabled
    public String preferredMethodOfContact { get; set; }
    @AuraEnabled
    public String street { get; set; }
    @AuraEnabled
    public String city { get; set; }
    @AuraEnabled
    public String state { get; set; }
    @AuraEnabled
    public String country { get; set; }
    @AuraEnabled
    public String postalCode { get; set; }
    @AuraEnabled
    public String phone { get; set; }
    @AuraEnabled
    public String relations { get; set; }
  }
}