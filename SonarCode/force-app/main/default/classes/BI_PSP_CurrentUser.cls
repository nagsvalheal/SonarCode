/*
 * @description       : A CurrentUser Utility Class for determining user type whether it is a patient or caregiver 
                       and capturing console messages while performing DMLs.
 * History:
 * Version  Author      Date            Detail          Description
 * 1.0      Abinsha     10-Jul-2024     Created         Initial development.
 */
public inherited sharing class BI_PSP_CurrentUser {
    private static String selctdPatientEnrolleeErrorMsg = System.Label.BI_PSP_SelectedPatientEnrollee;
    private static String careGiversSelectedPatientErrMsg = System.Label.BI_PSP_SelectedPatientAccount;
    private static String careGiversPatientAccountErr = System.Label.BI_PSP_CaregiversPatient;
    private static String patientEnrolleeErrorMsg = System.Label.BI_PSP_PatientEnrolleeError;
    private static String patientAccountErrorMsg = System.Label.BI_PSP_PatientAccountError;
    
    @AuraEnabled(cacheable=true)
    public static List<Account> returnTheAccounts() {
        User currentUser = getCurrentUser();

        if (currentUser.BI_PSPB_Caregiver__c) {
            return getCaregiverAccounts();
        } else {
            return getPatientAccounts();
        }
    }

    @AuraEnabled(cacheable=true)
    public static User getCurrentUser() {
        List<User> users = [
            SELECT Id, Name, LastName, Email, FirstName, BI_PSPB_Caregiver__c
            FROM User
            WHERE Id = :UserInfo.getUserId()
            WITH USER_MODE
            LIMIT 1
        ];
        return users.isEmpty() ? null : users[0];
    }

    private static List<Account> getCaregiverAccounts() {
        Account caregiverAccount = getCaregiverAccount();
        if (caregiverAccount == null) {
            BI_PSPB_LogUtilities.logError(careGiversPatientAccountErr, BI_PSP_CurrentUser.class.toString());
            return new List<Account>();
        }

        Account selectedPatientAccount = getSelectedPatientAccount(caregiverAccount.BI_PSPB_Selected_Patient_ID__c);
        if (selectedPatientAccount == null) {
            BI_PSPB_LogUtilities.logError(careGiversSelectedPatientErrMsg, BI_PSP_CurrentUser.class.toString());
            return new List<Account>();
        }

        return new List<Account>{selectedPatientAccount};
    }

    private static List<Account> getPatientAccounts() {
        Account patientAccount = getPatientAccount();
        if (patientAccount == null) {
            BI_PSPB_LogUtilities.logError(patientAccountErrorMsg, BI_PSP_CurrentUser.class.toString());
            return new List<Account>();
        }

        return new List<Account>{patientAccount};
    }

    private static Account getCaregiverAccount() {
        List<Account> accounts = [
            SELECT Id, Name, PersonEmail, BI_PSPB_Selected_Patient_ID__c
            FROM Account
            WHERE
                Name = :UserInfo.getName()
                AND PersonEmail = :UserInfo.getUserEmail()
                AND IsPersonAccount = TRUE
                //AND BI_PSPB_Selected_Patient_ID__c != NULL
                AND BI_PSPB_User_Type__c = 'Caregiver'
            WITH USER_MODE
        ];
        return accounts.isEmpty() ? null : accounts[0];
    }

    private static Account getSelectedPatientAccount(Id selectedPatientId) {
        List<Account> accounts = [
            SELECT Id, Name, PersonEmail
            FROM Account
            WHERE Id = :selectedPatientId
            WITH USER_MODE
        ];
        return accounts.isEmpty() ? null : accounts[0];
    }

    private static Account getPatientAccount() {
        List<Account> accounts = [
            SELECT Id, Name, PersonEmail
            FROM Account
            WHERE
                PersonEmail = :UserInfo.getUserEmail()
                AND Name = :UserInfo.getName()
            WITH USER_MODE
        ];
        return accounts.isEmpty() ? null : accounts[0];
    }

    @AuraEnabled(cacheable=true)
    public static List<CareProgramEnrollee> getEnrolleeRecords() {
        List<Account> accounts = returnTheAccounts();
        List<CareProgramEnrollee> enrollees = new List<CareProgramEnrollee>();

        if (!accounts.isEmpty()) {
            enrollees = [
                SELECT Id, Name,BI_PSP_AvatarUrl__c,BI_PSPB_PatientStatus__c,BI_PSP_Loginattempt__c,Account.Name
                FROM CareProgramEnrollee
                WHERE AccountID = :accounts[0].id
            ];

            if (enrollees.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(BI_PSP_QuestionnaireConstant.emptyEnrolleRecrd, BI_PSP_CurrentUser.class.toString(), true, BI_PSP_QuestionnaireConstant.LOG_SEVERITY_ERROR);
            }
        }

        return enrollees;
    }
    
}