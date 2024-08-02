/**
@description Class used for retrieving care programm erolle with challenges associated 
and updating challenges related values.
Reason for using whithout sharing is we use Care Program Enrollee, 
which is a Health Cloud object;
hence, we cannot utilize user mode here.
History:
Version    Author      Date              Detail         Description
1.0        Nandha      25-7-2023        Created        Initial development 
 
*/
public with sharing class BI_PSP_ChallengeEnrolleCtrl {
 /*
    @description Method to retrieve information about a patient enrollee based on the provided user Id.
    Returns a list of EnrollWrapper objects containing patient enrollee information and any error messages.
    This method is exposed to Aura-enabled components and is cacheable.
    @return List of EnrollWrapper objects containing patient enrollee information and any error messages.
    */

@AuraEnabled(cacheable=true)
public static List<EnrollWrapper> getEnrolle() {
    List<EnrollWrapper> successList = new List<EnrollWrapper>();

    try {
        user userRecord = new user();
       userRecord = BI_PSP_CurrentUser.getCurrentUser();
      

        if (userRecord == null) {
            return successList;
        }

        EnrollWrapper successMessage = new EnrollWrapper();
        String recName = userRecord.Name;
        String email = userRecord.Email;

        if (!userRecord.BI_PSPB_Caregiver__c) {
           
            processNonCaregiver(userRecord, recName, email, successMessage);
        } else {
            
            processCaregiver(userRecord, recName, email, successMessage);
        }

        successList.add(successMessage);

    } catch (Exception ex) {
        BI_PSPB_LogUtilities.exceptionLogMessage(BI_PSP_ChallengeConstantCtrl.userIdErrorMessage, BI_PSP_ChallengeCtrl.class.toString(), ex);
    }

    return successList;
}
 /*
    @description Helper method to process non-caregiver users and retrieve patient enrollee information.
    @param userRecord The User object representing the current user.
    @param recName The name of the current user.
    @param email The email of the current user.
    @param successMessage The EnrollWrapper object to store the retrieved information and any error messages.
    */
private static void processNonCaregiver(User userRecord, String recName, String email, EnrollWrapper successMessage) {
   
    String accountFields = 'Id, Name, PersonEmail';
   
    String accountConditions = 'Name = \'' + recName + '\' AND PersonEmail = \'' + email + '\' AND IsPersonAccount = TRUE';

    List<SObject> accounts = BI_PSP_CommonQueryUtility.executeQuery('Account', accountFields, accountConditions, FALSE);

    if (accounts.isEmpty()) {
        successMessage.error = BI_PSP_ChallengeConstantCtrl.enrolleeNf;
        return;
    }

    Account account = (Account) accounts[0];

    String careProgramEnrolleeFields = 'Id, BI_PSP_Total_Reward_Points__c, BI_PSP_Challenge_Rank__c';
   
    String careProgramEnrolleeConditions = 'AccountId = \'' + account.Id + '\'';
    

    List<SObject> patientEnrolleList = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', careProgramEnrolleeFields, careProgramEnrolleeConditions, FALSE);

    if (!patientEnrolleList.isEmpty()) {
     
        successMessage.patientEnrolle = ((CareProgramEnrollee) patientEnrolleList[0]);
    } else {
       
        successMessage.error = BI_PSP_ChallengeConstantCtrl.enrolleeNf;
    }
}
 /*
    @description Helper method to process caregiver users and retrieve patient enrollee information.
    @param userRecord The User object representing the current user.
    @param recName The name of the current user.
    @param email The email of the current user.
    @param successMessage The EnrollWrapper object to store the retrieved information and any error messages.
    */

private static void processCaregiver(User userRecord, String recName, String email, EnrollWrapper successMessage) {
    String accountFields = 'Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c';
    
    String accountConditions = 'Name = \'' + recName + '\' AND PersonEmail = \'' + email + '\' AND IsPersonAccount = TRUE AND BI_PSPB_Selected_Patient_ID__c != NULL';

    List<SObject> accounts = BI_PSP_CommonQueryUtility.executeQuery('Account', accountFields, accountConditions, FALSE);

    if (accounts.isEmpty()) {
        successMessage.error = BI_PSP_ChallengeConstantCtrl.caregiverNf;
        return;
    }

    Account selectedAccount = (Account) accounts[0];

    String enrolleeCaregiverFields = 'Id, Name, BI_PSPB_Patient__r.Id, BI_PSPB_Patient__r.Name, BI_PSPB_Contact_Id__c, BI_PSPB_Status__c, BI_PSPB_Contact_Id__r.BI_PSPB_Selected_Patient_ID__c, BI_PSPB_Care_Program_Enrollee__c';
    
    String enrolleeCaregiverConditions = 'BI_PSPB_Patient__r.ID = \'' + selectedAccount.BI_PSPB_Selected_Patient_ID__c + '\' AND BI_PSPB_Status__c = \'' + BI_PSP_ChallengeConstantCtrl.challengeActive + '\'';
 
    List<SObject> ecList = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Enrollee_Caregiver__c', enrolleeCaregiverFields, enrolleeCaregiverConditions, FALSE);
 
    if (ecList.isEmpty() || ecList[0].get('BI_PSPB_Care_Program_Enrollee__c') == null) {
        successMessage.error = ecList.isEmpty() ? BI_PSP_ChallengeConstantCtrl.enrolleeNfNs : BI_PSP_ChallengeConstantCtrl.enrolleeNf;
        return;
    }

    BI_PSPB_Enrollee_Caregiver__c enrolleeCaregiver = (BI_PSPB_Enrollee_Caregiver__c) ecList[0];

   
    String careProgramEnrolleeFields = 'Id, BI_PSP_Total_Reward_Points__c, BI_PSP_Challenge_Rank__c';
    
    String careProgramEnrolleeConditions = 'Id = \'' + enrolleeCaregiver.BI_PSPB_Care_Program_Enrollee__c + '\'';

    List<SObject> patientEnrolleList = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', careProgramEnrolleeFields, careProgramEnrolleeConditions, FALSE);

    if (!patientEnrolleList.isEmpty()) {
       
        successMessage.patientEnrolle = (CareProgramEnrollee) patientEnrolleList[0];
    } else {
        
        successMessage.error = BI_PSP_ChallengeConstantCtrl.enrolleeNf;
    }
}
/*
@description Wrapper class to hold information about a patient enrollee and any error messages.
*/
public class EnrollWrapper {
/* The patient enrollee information.*/
@AuraEnabled
public CareProgramEnrollee patientEnrolle;

/* Any error message associated with the patient enrollee.*/
@AuraEnabled
public String error;
}

}