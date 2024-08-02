public class BI_PSPB_ProfileManagerHelperCtrl {
    
 public static void updateAccountDetails(Account accToUpdate, BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper cgprofile) {
    accToUpdate.FirstName = cgprofile.firstName;
    accToUpdate.LastName = cgprofile.lastName;
    accToUpdate.BI_PSP_Birthdate__c = Date.valueOf(cgprofile.personBirthdate);
    accToUpdate.BI_PSPB_Relationship_to_Patient__c = cgprofile.relations;
    accToUpdate.PersonEmail = cgprofile.personEmail;
    accToUpdate.Phone = cgprofile.phone;
    accToUpdate.BI_PSPB_Preferred_Communication_Method__c = cgprofile.preferredMethodOfContact;
}

public static String saveAccount(Account accountToUpdate) {
    List<Account> accountToUpdateList = new List<Account> { accountToUpdate };
    String errorMsg = '';
      BI_PSPB_HandleUtitlites.updateAndHandleErrors(new List<Account> { accountToUpdate },BI_PSPB_ProfileManagerCtrl.class.toString(),FALSE);
    

    return errorMsg;
}
    
    public static void updateContactDetails(Contact contact, BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper wrapper) {
    contact.FirstName = wrapper.firstName;
    contact.LastName = wrapper.lastName;
    contact.BI_PSPB_Relationship_To_Patient__c = wrapper.relations;
    contact.Phone = wrapper.phone;
    contact.BI_PSP_Birthdate__c = Date.valueOf(wrapper.personBirthdate);
    contact.Email = wrapper.personEmail;
}

public static Database.SaveResult[] saveContacts(Contact contact) {
    
       // return Database.update(new List<Contact>{ contact }, false);
          BI_PSPB_HandleUtitlites.updateAndHandleErrors(new List<Contact>{ contact },BI_PSPB_ProfileManagerCtrl.class.toString(),FALSE);
        
     
        // Log or handle the exception as needed
       
        return new Database.SaveResult[]{};
    
}
    
     public static String updateContactAndAccount(Contact contact, Account account) {
        BI_PSPB_HandleUtitlites.updateAndHandleErrors(new List<SObject>{ contact, account },BI_PSPB_ProfileManagerCtrl.class.toString(),FALSE);
        String errorMsg = '';
    

    return errorMsg;
}
    
    public static void updateAccountDetail(Account account, BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper wrapper) {
    account.FirstName = wrapper.firstName;
    account.LastName = wrapper.lastName;
    account.PersonEmail = wrapper.personEmail;
    account.BI_PSP_Birthdate__c = wrapper.personBirthDate;
    account.HealthCloudGA__Gender__pc = wrapper.personGender;
    account.BI_PSPB_Preferred_Communication_Method__c = wrapper.preferredMethodOfContact;
    account.PersonMailingStreet = wrapper.street;
    account.PersonMailingCity = wrapper.city;
    account.PersonMailingStateCode = wrapper.state;
    account.PersonMailingCountryCode = wrapper.country;
    account.PersonMailingPostalCode = wrapper.postalCode;
    account.Phone = wrapper.phone;
}
public static Database.SaveResult[] saveAccounts(Account account) {
   
        //return Database.update(new List<Account>{ account }, false);
                  BI_PSPB_HandleUtitlites.updateAndHandleErrors(new List<Account>{ account },BI_PSPB_ProfileManagerCtrl.class.toString(),FALSE);
   
        return new Database.SaveResult[]{};
   
}
    
    public static void updateAccDetails(Account account, BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper wrapper) {
    account.FirstName = wrapper.firstName;
    account.LastName = wrapper.lastName;
    account.PersonEmail = wrapper.personEmail;
    account.BI_PSP_Birthdate__c = wrapper.personBirthDate;
    account.HealthCloudGA__Gender__pc = wrapper.personGender;
    account.BI_PSPB_Preferred_Communication_Method__c = wrapper.preferredMethodOfContact;
    account.PersonMailingStreet = wrapper.street;
    account.PersonMailingCity = wrapper.city;
    account.PersonMailingStateCode = wrapper.state;
    account.PersonMailingCountryCode = wrapper.country;
    account.PersonMailingPostalCode = wrapper.postalCode;
    account.Phone = wrapper.phone;
}

public static Database.SaveResult[] saveAccountt(Account account) {
   
       
                 BI_PSPB_HandleUtitlites.updateAndHandleErrors(new List<Account>{ account },BI_PSPB_ProfileManagerCtrl.class.toString(),FALSE);
    
        return new Database.SaveResult[]{};
    
}


}