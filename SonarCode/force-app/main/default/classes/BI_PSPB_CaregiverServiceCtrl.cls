public class BI_PSPB_CaregiverServiceCtrl {
 public static List<Account> fetchAccountByUser(String userName, String userEmail) {
     String sObjectType = 'Account';
    String fields = 'Id, Name';
    String conditions = 'Name = \'' + String.escapeSingleQuotes(userName) + '\' AND PersonEmail = \'' + String.escapeSingleQuotes(userEmail) + '\'';
    Boolean withUserMode = false; // Set this to true if you need to enforce user mode

    // Call the executeQuery method
    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
    // Typecast the result to List<Account> and return
    return (List<Account>) sObjectList;
    }

    
    public static String fetchCaregiverIdByAccountId(Id accountId) {
    // Define the parameters for the executeQuery method
    String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
    String fields = 'Id, BI_PSPB_Caregiver__c';
    String conditions = 'BI_PSPB_Caregiver__c = \'' + String.escapeSingleQuotes(accountId) + '\'';
    Boolean withUserMode = false; // Set this to true if you need to enforce user mode

    // Call the executeQuery method
    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
    // Check if the query returned any results
    if (!sObjectList.isEmpty()) {
        BI_PSPB_Enrollee_Caregiver__c caregiver = (BI_PSPB_Enrollee_Caregiver__c) sObjectList[0];
        if (caregiver.BI_PSPB_Caregiver__c != null) {
            return caregiver.BI_PSPB_Caregiver__c;
        }
    }

    // If no valid caregiver is found, throw an exception
 BI_PSP_LogMessagesUtility.logError(BI_PSPB_ProfileManagerConstCtrl.recordCannotUpdate, BI_PSPB_EnrolleeCaregiverCtrl.class.toString(), false, BI_PSPB_ProfileManagerConstCtrl.LOG_SEVERITY_ERROR);
        return null;
}


  

    public static List<Account> fetchCaregiverDetailsById(String caregiverId) {
    // Define the parameters for the executeQuery method
    String sObjectType = 'Account';
    String fields = 'Id, FirstName, LastName, BI_PSP_Birthdate__c, PersonEmail, Phone, BI_PSPB_Preferred_Communication_Method__c, BI_PSPB_Relationship_to_Patient__c';
    String conditions = 'Id = \'' + String.escapeSingleQuotes(caregiverId) + '\'';
    Boolean withUserMode = false; // Set this to true if you need to enforce user mode

    // Call the executeQuery method
    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
    // Typecast the result to List<Account> and return
    return (List<Account>) sObjectList;
}



   public static Boolean isProfileValid(BI_PSPB_ProfileManagerCtrl.BI_PSPB_CaregiverDetailsWrapper cgprofile) {
    return cgprofile != null && cgprofile.accountId != null;
}


   public static List<Account> fetchAccountById(Id accountId) {
    // Define the parameters for the executeQuery method
    String sObjectType = 'Account';
    String fields = 'Id, FirstName, LastName, PersonEmail, BI_PSP_Birthdate__c, BI_PSPB_Relationship_to_Patient__c, Phone, BI_PSPB_Preferred_Communication_Method__c';
    String conditions = 'Id = \'' + String.escapeSingleQuotes(accountId) + '\'';
    Boolean withUserMode = false; // Set this to true if needed

    // Call the executeQuery method
    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
    // Typecast the result to List<Account> and return
    return (List<Account>) sObjectList;
}


     

   public static BI_PSPB_Enrollee_Caregiver__c fetchEnrolleeCaregiver(String userName, String userEmail) {
    // Define the parameters for the executeQuery method
    String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
    String fields = 'Id, BI_PSPB_Patient__r.Id, BI_PSPB_Caregiver__c, BI_PSPB_Contact_Id__r.BI_PSPB_GrantAccess__c, BI_PSPB_Patient__r.Name, BI_PSPB_Contact_Id__c, BI_PSPB_Status__c';
    String conditions = 'BI_PSPB_Patient__r.Name = \'' + String.escapeSingleQuotes(userName) + '\' AND BI_PSPB_Patient__r.PersonEmail = \'' + String.escapeSingleQuotes(userEmail) + '\'';
    Boolean withUserMode = false; // Set this to true if needed

    // Call the executeQuery method
    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
    // Check if the list is not empty and return the first element
    return !sObjectList.isEmpty() ? (BI_PSPB_Enrollee_Caregiver__c) sObjectList[0] : null;
}


   public static String updateEnrolleeCaregiver(BI_PSPB_Enrollee_Caregiver__c ecRecord) {
       BI_PSPB_HandleUtitlites.updateAndHandleErrors(new List<BI_PSPB_Enrollee_Caregiver__c>{ ecRecord },BI_PSPB_ProfileManagerCtrl.class.toString(),FALSE);
       String errorMsg = '';
     return errorMsg;
}


 public static Contact fetchContactById(Id contactId) {
    // Define the parameters for the executeQuery method
    String sObjectType = 'Contact';
    String fields = 'Id, FirstName, LastName, Email, BI_PSPB_GrantAccess__c';
    String conditions = 'Id = \'' + String.escapeSingleQuotes(contactId) + '\'';
    Boolean withUserMode = false; // Set this to true if needed

    // Call the executeQuery method
    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
    // Check if the list is not empty and return the first element
    return !sObjectList.isEmpty() ? (Contact) sObjectList[0] : null;
}


   public static Account fetchAccountId(Id accountId) {
    // Define the parameters for the executeQuery method
    String sObjectType = 'Account';
    String fields = 'Id, FirstName, LastName, PersonEmail, BI_PSPB_GrantCaregiverAccess__c';
    String conditions = 'Id = \'' + String.escapeSingleQuotes(accountId) + '\'';
    Boolean withUserMode = false; // Set this to true if needed

    // Call the executeQuery method
    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);
    
    // Check if the list is not empty and return the first element
    return !sObjectList.isEmpty() ? (Account) sObjectList[0] : null;
}



     

   public static List<BI_PSPB_Enrollee_Caregiver__c> fetchEnrolleeCaregiversByUserEmail(String userEmail) {
    // Define the parameters for the executeQuery method
    String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
    String fields = 'Id, BI_PSPB_Contact_Id__c, BI_PSPB_Contact_Id__r.BI_PSPB_GrantAccess__c, BI_PSPB_Status__c';
    String conditions = 'BI_PSPB_Patient__r.PersonEmail = \'' + String.escapeSingleQuotes(userEmail) + '\'';
    Boolean withUserMode = false; // Set this to true if needed

    // Call the executeQuery method
    List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

    // Convert the List<SObject> to List<BI_PSPB_Enrollee_Caregiver__c> and return
    return (List<BI_PSPB_Enrollee_Caregiver__c>) sObjectList;
}



   public static List<BI_PSPB_Enrollee_Caregiver__c> getCaregiverListByPatientId(Id accountId) {
    try {
        // Define the parameters for the executeQuery method
        String sObjectType = 'BI_PSPB_Enrollee_Caregiver__c';
        String fields = 'Id, Name, BI_PSPB_Patient__r.Id, BI_PSPB_Contact_Id__c, BI_PSPB_Contact_Id__r.FirstName, ' +
                        'BI_PSPB_Contact_Id__r.LastName, BI_PSPB_Contact_Id__r.Phone, BI_PSPB_Contact_Id__r.Email, ' +
                        'BI_PSPB_Contact_Id__r.BI_PSPB_Relationship_To_Patient__c, BI_PSPB_Contact_Id__r.BI_PSP_Birthdate__c, ' +
                        'BI_PSPB_Caregiver__c';
        String conditions = 'BI_PSPB_Patient__c = \'' + String.escapeSingleQuotes(accountId) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Convert the List<SObject> to List<BI_PSPB_Enrollee_Caregiver__c> and return
        return (List<BI_PSPB_Enrollee_Caregiver__c>) sObjectList;
    } catch (Exception ex) {
        // Log or handle the exception as needed
        BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSPB_CaregiverServiceCtrl.class.toString(), ex);
        return new List<BI_PSPB_Enrollee_Caregiver__c>();
    }
}



    public static Contact getContactById(Id contactId) {
    try {
        // Define the parameters for the executeQuery method
        String sObjectType = 'Contact';
        String fields = 'Id, FirstName, LastName, Phone, BI_PSP_Birthdate__c, Email, BI_PSPB_Relationship_To_Patient__c';
        String conditions = 'Id = \'' + String.escapeSingleQuotes(contactId) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Convert the List<SObject> to Contact and return the first element
        return (sObjectList.isEmpty()) ? null : (Contact) sObjectList[0];
    } catch (Exception ex) {
        // Log or handle the exception as needed
        System.debug('Exception occurred in getContactById: ' + ex.getMessage());
        return null;
    }
}


public static Account getAccountById(Id accountId) {
    try {
        // Define the parameters for the executeQuery method
        String sObjectType = 'Account';
        String fields = 'Id, FirstName, LastName, PersonEmail, BI_PSP_Birthdate__c, BI_PSP_Age__c, PersonMobilePhone, Phone, ' +
                        'HealthCloudGA__Gender__pc, BI_PSPB_Preferred_Communication_Method__c, PersonMailingAddress, ' +
                        'PersonMailingCity, PersonMailingCountryCode, PersonMailingPostalCode, PersonMailingStateCode, PersonMailingStreet';
        String conditions = 'Id = \'' + String.escapeSingleQuotes(accountId) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Convert the List<SObject> to Account and return the first element
        return sObjectList.isEmpty() ? null : (Account) sObjectList[0];
    } catch (Exception ex) {
       
        return null;
    }
}

   public static Account getAccountvalue(Id accountId) {
    try {
        // Define the parameters for the executeQuery method
        String sObjectType = 'Account';
        String fields = 'Id, FirstName, LastName, PersonEmail, BI_PSP_Birthdate__c, BI_PSP_Age__c, PersonMobilePhone, Phone, ' +
                        'HealthCloudGA__Gender__pc, BI_PSPB_Preferred_Communication_Method__c, PersonMailingAddress, ' +
                        'PersonMailingCity, PersonMailingCountryCode, PersonMailingPostalCode, PersonMailingStateCode, PersonMailingStreet';
        String conditions = 'Id = \'' + String.escapeSingleQuotes(accountId) + '\'';
        Boolean withUserMode = false; // Set this to true if needed

        // Call the executeQuery method
        List<SObject> sObjectList = BI_PSP_CommonQueryUtility.executeQuery(sObjectType, fields, conditions, withUserMode);

        // Convert the List<SObject> to Account and return the first element
        return sObjectList.isEmpty() ? null : (Account) sObjectList[0];
    } catch (Exception ex) {
        // Log or handle the exception as needed
         BI_PSP_LogMessagesUtility.exceptionLogMessage('', BI_PSPB_CaregiverServiceCtrl.class.toString(), ex);
        return null;
    }
}





}