/*
@description Class used for fetching values from profile. Hence, we cannot utilize user mode here and additionally these methods are used by guest users as
Guest users typically have limited object and field-level permission we haven't used user mode.

@history
Version    Author      Date              Detail         Description
1.0        Gowsic N    6-Dec-2023        Created        Initial development
1.1        Saran S     20-Apr-2024       Updated        Add log, null check, descriptions
1.2        Sowmitha N  12-July-2024      Updated        Complexity fixes and optimisation 
*/
public with sharing class BI_PSPB_LoginCtrl {
    private static String profileIdErrorMessage = BI_PSPB_EnrollmentConstantCtrl.getLabel('PROFILE_ID_ERROR');
    /**
    * @description Fetches profile details based on the provided profile ID.
    * @param profileId The ID of the profile whose details are to be fetched.
    * @return Profile object containing the profile's ID and name.
    * @throws AuraHandledException if profileId is blank or if the profile is not found.
    */
    @AuraEnabled(cacheable=true)
    public static Profile profileDetails() {
        Profile profileRecord = new Profile();
        try {
            String userProfile = UserInfo.getProfileId();
            Boolean withSharingKeywrd = false;
            String conditions = 'Id = \'' + userProfile + '\'';
            String fields = 'Id, Name';
            List<SObject> sObjectResponses = BI_PSP_CommonQueryUtility.executeQuery('Profile', fields, conditions, withSharingKeywrd);
            if (!sObjectResponses.isEmpty()) {
                profileRecord = (Profile) sObjectResponses[0];
            }
            if(profileRecord == null)
            {
                BI_PSP_LogMessagesUtility.logError(profileIdErrorMessage,BI_PSPB_LoginCtrl.class.getName(),true,BI_PSPB_EnrollmentConstantCtrl.getLabel('LOG_SEVERITY_ERROR'));
            }
        } catch (exception ex) {
            BI_PSPB_LogUtilities.exceptionLogMessage(profileIdErrorMessage,BI_PSPB_LoginCtrl.class.getName(),ex);
        }
        return profileRecord;
    }

}