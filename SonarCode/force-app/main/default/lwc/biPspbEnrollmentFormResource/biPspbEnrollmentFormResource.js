// Import current user ID
import ID from "@salesforce/user/Id";
// Importing Custom Labels
import PATIENT_FIRSTNAME from "@salesforce/label/c.BI_PSPB_CaregiverFirstNameErrMsg";
import IAM_PATIENT_URL from "@salesforce/label/c.BI_PSPB_IamPatient";
import MINORAGE from "@salesforce/label/c.BI_PSPB_MInorAge";
import PATIENT_LASTNAME from "@salesforce/label/c.BI_PSPB_CaregiverLastNameErrMsg";
import PATIENT_DATEOFBIRTH from "@salesforce/label/c.BI_PSPB_PatientDateOfBirthErrMsg";
import PATIENT_GENDER from "@salesforce/label/c.BI_PSPB_PatientGenterErrMsg";
import PATIENT_EMAIL from "@salesforce/label/c.BI_PSPB_CaregiverEmailErrMsg";
import COUNTRY from "@salesforce/label/c.BI_PSPB_PatientCountryRequiredErrMsg";
import STATE from "@salesforce/label/c.BI_PSPB_PatientStateErrMsg";
import CITY from "@salesforce/label/c.BI_PSPB_PatientCityErrMsg";
import STREET from "@salesforce/label/c.BI_PSPB_PatientStreetErrMsg";
import PINCODE from "@salesforce/label/c.BI_PSPB_PatientZipCodeErrMsg";
import PATIENT_PHONE from "@salesforce/label/c.BI_PSPB_PhoneRequiredErrMsg";
import PREFERRED_CONTACT_METHOD from "@salesforce/label/c.BI_PSPB_PatientPrefferMethodErrMsg";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import DOB_ERROR from "@salesforce/label/c.BI_PSPB_PatientFutureDateErrMsg";
import PS_URL from "@salesforce/label/c.BI_PSPB_PatientSummaryUrl";
import SMS from "@salesforce/label/c.BI_PSP_SmsLabel";
import PHONE from "@salesforce/label/c.BI_PSPB_Phone";
import YES from "@salesforce/label/c.BI_PSP_SoftDelete";
import ERROR_FOUND from "@salesforce/label/c.BI_PSP_RecordNotFoundMsg";
import SHOW_TOAST from "@salesforce/label/c.BI_PSP_ShowToasts";
import REFERRING_PRACTICE from "@salesforce/label/c.BI_PSPB_PhysicianDetailsErrMsg";
import LICENSE_NUMBER from "@salesforce/label/c.BI_PSPB_PhysicianLicenseErrMsg";
import PRACTICE from "@salesforce/label/c.BI_PSPB_PracticeNameErrMsg";
import Minorvalue from "@salesforce/label/c.BI_PSPB_MInorAge";
import PRACTICE_TYPE_ERR from "@salesforce/label/c.BI_PSPB_PhysicianPracticeTypeErrMsg";
import PHYSICIAN_EMAIL from "@salesforce/label/c.BI_PSPB_PatientEmailErrMsg";
import CAREGIVER_RELATIONSHIP from "@salesforce/label/c.BI_PSPB_CaregiverRelationErrMsg";
import CAREGIVER_EMAIL from "@salesforce/label/c.BI_PSPB_PatientEmailErrMsg";
import DRUGNAME from "@salesforce/label/c.BI_PSPB_DrugNameErrMsg";
import DRUGCODE from "@salesforce/label/c.BI_PSPB_DrugCodeErrMsg";
import DOSAGE from "@salesforce/label/c.BI_PSPB_DosageErrMsg";
import DOSAGE_UNITS from "@salesforce/label/c.BI_PSPB_DosageUnitErrMsg";
import FREQUENCY from "@salesforce/label/c.BI_PSPB_FrequencyErrMsg";
import FREQUENCY_UNITS from "@salesforce/label/c.BI_PSPB_FrequencyUnitErrMsg";
import PRESCRIBED_DATE from "@salesforce/label/c.BI_PSPB_PrescribedDateErrMsg";
import PRESCRIBED_FUTURE_DATE from "@salesforce/label/c.BI_PSPB_PrescribedFutureDateErrMsg";
import LABEL_GENDER from "@salesforce/label/c.BI_PSPB_HealthCloudGender";
import LAST_NAME from "@salesforce/label/c.BI_PSPB_LastName";
import FIRSTNAME from "@salesforce/label/c.BI_PSPB_FirstName";
import HCP from "@salesforce/label/c.BI_PSPB_IamHcp";
import LABEL_PRACTICE_NAME from "@salesforce/label/c.BI_PSPB_PracticeName";
import LABEL_LICENSE_NUMBER from "@salesforce/label/c.BI_PSPB_LicenseNumber";
import MAILING_POSTAL_CODE from "@salesforce/label/c.BI_PSPB_MailingPostalCode";
import MAILING_STREET from "@salesforce/label/c.BI_PSPB_MailingStreet";
import MAILING_CITY from "@salesforce/label/c.BI_PSPB_MailingCity";
import MAILING_STATECODE from "@salesforce/label/c.BI_PSPB_MailingStateCode";
import MAILING_COUNTRYCODE from "@salesforce/label/c.BI_PSPB_MailingCountryCode";
import FAX from "@salesforce/label/c.BI_PSPB_Fax";
import PRACTICE_TYPEE from "@salesforce/label/c.BI_PSPB_PracticeType";
import HCP_SUMMARY from "@salesforce/label/c.BI_PSPB_HcpSummaryUrl";
import REFILL from "@salesforce/label/c.BI_PSPB_Refill";
import FREQUENCY_VALUE from "@salesforce/label/c.BI_PSPB_Frequency";
import DOSAGE_VALUE from "@salesforce/label/c.BI_PSPB_Dosage";
import QUANTITY from "@salesforce/label/c.BI_PSPB_Quantity";
import FREQUCNCY_UNIT from "@salesforce/label/c.BI_PSPB_FrequencyUnit";
import DOSAGE_CODE from "@salesforce/label/c.BI_PSPB_DosageCode";
import DRUG_NAME from "@salesforce/label/c.BI_PSPB_DrugName";
import CAREGIVER_PHONE from "@salesforce/label/c.BI_PSPB_CaregiverPhone";
import CAREGIVER_MAIL from "@salesforce/label/c.BI_PSPB_CaregiverEmail";
import CAREGIVER_FIRSTNAME from "@salesforce/label/c.BI_PSPB_CaregiverFirstName";
import CAREGIVER_LASTNAME from "@salesforce/label/c.BI_PSPB_CaregiverLastName";
import CAREGIVER_RELATION from "@salesforce/label/c.BI_PSPB_CaregiverRelationship";
import EMAIL from "@salesforce/label/c.BI_PSP_NotificationEmail";
import AGREE from "@salesforce/label/c.BI_PSPB_AgreeErrMsg";
import BRANDED_URL from "@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl";
import THANK_FORM_URL from "@salesforce/label/c.BI_PSPB_PreThankFormUrl";
import FEMALE from "@salesforce/label/c.BI_PSP_RbFemale";
import MALE from "@salesforce/label/c.BI_PSP_RbMale";
import OTHER from "@salesforce/label/c.BI_PSP_RbOther";
import PREFER from "@salesforce/label/c.BI_PSP_RbNotToSay";
import PARENT from "@salesforce/label/c.BI_PSP_NotificationParent";
import SIBILING from "@salesforce/label/c.BI_PSP_NotificationSibling";
import LOVEDONE from "@salesforce/label/c.BI_PSP_LovedOne";
import GUARDIAN from "@salesforce/label/c.BI_PSP_NotificationGuardian";
import FRIEND from "@salesforce/label/c.BI_PSP_NotificationFriend";
import RELATIVE from "@salesforce/label/c.BI_PSP_NotificationOtherRelative";
import HCPENROLLMSG from "@salesforce/label/c.BI_PSPB_HcpMinorEnrollMsg";
import THANKYOU_MSG_ONE from "@salesforce/label/c.BI_PSPB_CheckEmail";
import THANKYOU_MSG_TWO from "@salesforce/label/c.BI_PSPB_ThankYouMessage";
import THANKYOU_MSG_THREE from "@salesforce/label/c.BI_PSPB_ThankYouContent";
import THANKYOU_MSG_FOUR from "@salesforce/label/c.BI_PSPB_ThankYouEmailSent";
import IMG from "@salesforce/resourceUrl/BI_PSPB_ThankYouImage";
import SEND_AVATAR_MSG from '@salesforce/label/c.BI_PSPB_SendAvatarMsg';
import PRIVACYURL from '@salesforce/label/c.BI_PSPB_PrivacyNotice';
import TERMSURL from '@salesforce/label/c.BI_PSPB_TermsOfUse';
import CONTACTURL from '@salesforce/label/c.BI_PSPB_ContactUs';
import BI_PSPB_Preferred_Communication_Method__c from '@salesforce/schema/Lead.BI_PSPB_Preferred_Communication_Method__c';
//InnerHtml Contents labels For Hcp
import AVATAR_MSG_ONE from '@salesforce/label/c.BI_PSPB_HcpMsgOne';
import AVATAR_MSG_TWO from '@salesforce/label/c.BI_PSPB_HcpMsgTwo';
import AVATAR_MID_MSG_ONE from '@salesforce/label/c.BI_PSPB_HcpMidMsgOne';
import AVATAR_MID_MSG_TWO from '@salesforce/label/c.BI_PSPB_HcpMidMsgTwo';
import AVATAR_MID_MSG_THREE from '@salesforce/label/c.BI_PSPB_HcpMidMsgThree';
import AVATAR_MID_MSG_FOUR from '@salesforce/label/c.BI_PSPB_HcpMidMsgFour';
import AVATAR_MOB_MSG_ONE from '@salesforce/label/c.BI_PSPB_HcpMobOne';
import AVATAR_MOB_MSG_TWO from '@salesforce/label/c.BI_PSPB_HcpMobTwo';
import AVATAR_MOB_MSG_THREE from '@salesforce/label/c.BI_PSPB_HcpMobThree';
//InnerHtml Contents labels For Patient
import P_AVATAR_MSG_ONE from '@salesforce/label/c.BI_PSPB_PatientMsgOne';
import P_AVATAR_MSG_TWO from '@salesforce/label/c.BI_PSPB_PatientMsgTwo';
import P_AVATAR_MSG_THREE from '@salesforce/label/c.BI_PSPB_PatientMsgThree';
import P_AVATAR_MSG_FOUR from '@salesforce/label/c.BI_PSPB_PatientMsgFour';
import P_AVATAR_MSG_FIVE from '@salesforce/label/c.BI_PSPB_PatientMsgFive';
import P_AVATAR_MID_MSG_ONE from '@salesforce/label/c.BI_PSPB_PatientMidMsgOne';
import P_AVATAR_MID_MSG_TWO from '@salesforce/label/c.BI_PSPB_PatientMidMsgTwo';
import P_AVATAR_LAST_MSG_ONE from '@salesforce/label/c.BI_PSPB_PatientLastMsgOne';
import P_AVATAR_MOB_MSG_ONE from '@salesforce/label/c.BI_PSPB_PatientMobMsgOne';
import P_AVATAR_MOB_MSG_TWO from '@salesforce/label/c.BI_PSPB_PatientMobMsgTwo';
import P_AVATAR_MOB_MSG_THREE from '@salesforce/label/c.BI_PSPB_PatientMobMsgThree';
import P_AVATAR_MOB_MSG_FOUR from '@salesforce/label/c.BI_PSPB_PatientMobMsgFour';
import P_AVATAR_MOB_MSG_FIVE from '@salesforce/label/c.BI_PSPB_PatientMobMsgFive';
import P_AVATAR_MOB_MSG_SIX from '@salesforce/label/c.BI_PSPB_PatientMobMsgSix';
//InnerHtml Contents labels For PrePatient
import PRE_AVATAR_MSG_ONE from '@salesforce/label/c.BI_PSPB_MsgOnePatient';
import PRE_AVATAR_MSG_TWO from '@salesforce/label/c.BI_PSPB_MsgTwoPatient';
import PRE_AVATAR_MSG_THREE from '@salesforce/label/c.BI_PSPB_MsgThreePatient';
import PRE_AVATAR_MSG_FOUR from '@salesforce/label/c.BI_PSPB_MsgFourPatient';
import PRE_AVATAR_MSG_FIVE from '@salesforce/label/c.BI_PSP_MobMsgOnePatient';
import PRE_AVATAR_MSG_SIX from '@salesforce/label/c.BI_PSPB_MobMsgTwoPatient';
//InnerHtml Contents labels For Precaregiver
import CARE_AVATAR_MSG_ONE from '@salesforce/label/c.BI_PSPB_MsgOneCaregiver';
import CARE_AVATAR_MSG_TWO from '@salesforce/label/c.BI_PSPB_MsgTwoCaregiver';
import CARE_AVATAR_MSG_THREE from '@salesforce/label/c.BI_PSPB_MsgThreeCaregiver';
import CARE_AVATAR_MSG_FOUR from '@salesforce/label/c.BI_PSPB_MsgFourCaregiver';
import CARE_AVATAR_MSG_FIVE from '@salesforce/label/c.BI_PSPB_MsgFiveCaregiver';
import CARE_AVATAR_MSG_SIX from '@salesforce/label/c.BI_PSPB_MobMsgOneCaregiver';
import CARE_AVATAR_MSG_SEVEN from '@salesforce/label/c.BI_PSPB_MobMsgTwoCaregiver';
//Loginfooter
import LOGIN_COPYRIGHTS from '@salesforce/label/c.BI_PSP_LoginCopyrights';
import CONTACT_US_LABEL from '@salesforce/label/c.BI_PSPB_ContactUsLabel';
import TERMS_OF_USE_LABEL from '@salesforce/label/c.BI_PSPB_TermsOfUseLabel';
import PRIVACY_NOTICE_LABEL from '@salesforce/label/c.BI_PSPB_PrivacyNoticeLabel';
//Schema
import LEAD from "@salesforce/schema/Lead";
import CONTACT from "@salesforce/schema/Contact";
import PRACTICE_TYPE from "@salesforce/schema/Contact.BI_PSPB_Practice_Type__c";
import GENDER from "@salesforce/schema/Lead.HealthCloudGA__Gender__c";
import FREQUENCY_UNIT from "@salesforce/schema/BI_PSPB_Lead_Prescription__c.BI_PSPB_Frequency_Unit__c";
import LEAD_PRESCRIPTION from "@salesforce/schema/BI_PSPB_Lead_Prescription__c";
import LEAD_CAREGIVER from "@salesforce/schema/BI_PSPB_Lead_Caregiver__c";
import RELATIONSHIP from "@salesforce/schema/BI_PSPB_Lead_Caregiver__c.BI_PSPB_Relationship_to_Patient__c";

// Imports resourceUrl to reference external resources for proper rendering and functionality.
import BGPP from "@salesforce/resourceUrl/BI_PSPB_BeyondGppLogo";
import TEXT_ALIGN from "@salesforce/resourceUrl/BI_PSPB_TextAlignmentHcp";
import WARNING_ICON from "@salesforce/resourceUrl/BI_PSP_WarningIcon";
import CALENDER_ICON from "@salesforce/resourceUrl/BI_PSPB_CalenderIconSymp";
import ICON_CSS from "@salesforce/resourceUrl/BI_PSPB_InputSearchIcon";
import OLD_GUY_JPEG_URL from "@salesforce/resourceUrl/BI_PSPB_PatientEntrollAvatar";
import SPEVIGO_LOGO_JPEG_URL from '@salesforce/resourceUrl/BI_PSPB_HeaderSpevigo';
import BIFOOTER_LOGO_JPEG_URL from '@salesforce/resourceUrl/BI_PSPB_FooterCopyright';
import CAREGIVER_IMG from '@salesforce/resourceUrl/BI_PSPB_PrepopulatedAvatar';
import HOME_ICON from '@salesforce/resourceUrl/BI_PSPB_HomeIcon';
import HOME_ICON_MOBILE from '@salesforce/resourceUrl/BI_PSPB_HomeIconForMobile';
import PATIENT_AVATAR from "@salesforce/resourceUrl/BI_PSPB_HcpEntrollmentPatientAvatar";

export const resource = {
	ID,

	//static
	BGPP,
	IMG,
	TEXT_ALIGN,
	WARNING_ICON,
	CALENDER_ICON,
	ICON_CSS,
	OLD_GUY_JPEG_URL,

	//CustomLabels
	BI_PSPB_Preferred_Communication_Method__c,
	PRIVACYURL,
	CONTACTURL,
	TERMSURL,
	CARE_AVATAR_MSG_ONE,
	CARE_AVATAR_MSG_TWO,
	CARE_AVATAR_MSG_THREE,
	CARE_AVATAR_MSG_FOUR,
	CARE_AVATAR_MSG_FIVE,
	CARE_AVATAR_MSG_SIX,
	CARE_AVATAR_MSG_SEVEN,
	PRE_AVATAR_MSG_ONE,
	PRE_AVATAR_MSG_TWO,
	PRE_AVATAR_MSG_THREE,
	PRE_AVATAR_MSG_FOUR,
	PRE_AVATAR_MSG_FIVE,
	PRE_AVATAR_MSG_SIX,
	P_AVATAR_MSG_ONE,
	P_AVATAR_MSG_TWO,
	P_AVATAR_MSG_THREE,
	P_AVATAR_MSG_FOUR,
	P_AVATAR_MSG_FIVE,
	P_AVATAR_MID_MSG_ONE,
	P_AVATAR_MID_MSG_TWO,
	P_AVATAR_LAST_MSG_ONE,
	P_AVATAR_MOB_MSG_ONE,
	P_AVATAR_MOB_MSG_TWO,
	P_AVATAR_MOB_MSG_THREE,
	P_AVATAR_MOB_MSG_FOUR,
	P_AVATAR_MOB_MSG_FIVE,
	P_AVATAR_MOB_MSG_SIX,
	AVATAR_MSG_ONE,
	AVATAR_MSG_TWO,
	AVATAR_MID_MSG_ONE,
	AVATAR_MID_MSG_TWO,
	AVATAR_MID_MSG_THREE,
	AVATAR_MID_MSG_FOUR,
	AVATAR_MOB_MSG_ONE,
	AVATAR_MOB_MSG_TWO,
	AVATAR_MOB_MSG_THREE,
	HOME_ICON,
	PATIENT_AVATAR,
	HOME_ICON_MOBILE,
	SPEVIGO_LOGO_JPEG_URL,
	BIFOOTER_LOGO_JPEG_URL,
	CAREGIVER_IMG,
	LEAD,
	CONTACT,
	GENDER,
	RELATIONSHIP,
	LEAD_CAREGIVER,
	LEAD_PRESCRIPTION,
	FREQUENCY_UNIT,
	PRACTICE_TYPE,
	THANKYOU_MSG_ONE,
	SEND_AVATAR_MSG,
	THANKYOU_MSG_TWO,
	THANKYOU_MSG_THREE,
	THANKYOU_MSG_FOUR,
	PATIENT_FIRSTNAME,
	IAM_PATIENT_URL,
	MINORAGE,
	PATIENT_LASTNAME,
	PATIENT_DATEOFBIRTH,
	PATIENT_GENDER,
	PATIENT_EMAIL,
	COUNTRY,
	STATE,
	CITY,
	STREET,
	PINCODE,
	PATIENT_PHONE,
	PREFERRED_CONTACT_METHOD,
	ERROR_MESSAGE,
	ERROR_VARIANT,
	DOB_ERROR,
	PS_URL,HCPENROLLMSG,
	SMS,
	PHONE,
	YES,
	ERROR_FOUND,
	SHOW_TOAST,
	REFERRING_PRACTICE,
	LICENSE_NUMBER,
	PRACTICE,
	Minorvalue,
	PRACTICE_TYPE_ERR,
	PHYSICIAN_EMAIL,
	CAREGIVER_RELATIONSHIP,
	CAREGIVER_EMAIL,
	DRUGNAME,
	DRUGCODE,
	DOSAGE,
	DOSAGE_UNITS,
	FREQUENCY,
	FREQUENCY_UNITS,
	PRESCRIBED_DATE,
	PRESCRIBED_FUTURE_DATE,
	LABEL_GENDER,
	LAST_NAME,
	FIRSTNAME,
	HCP,
	LABEL_PRACTICE_NAME,
	LABEL_LICENSE_NUMBER,
	MAILING_POSTAL_CODE,
	MAILING_STREET,
	MAILING_CITY,
	MAILING_STATECODE,
	MAILING_COUNTRYCODE,
	FAX,
	PRACTICE_TYPEE,
	HCP_SUMMARY,
	REFILL,
	FREQUENCY_VALUE,
	DOSAGE_VALUE,
	QUANTITY,
	FREQUCNCY_UNIT,
	DOSAGE_CODE,
	DRUG_NAME,
	CAREGIVER_PHONE,
	CAREGIVER_MAIL,
	CAREGIVER_FIRSTNAME,
	CAREGIVER_LASTNAME,
	CAREGIVER_RELATION,
	EMAIL,
	AGREE,
	BRANDED_URL,
 THANK_FORM_URL ,
 FEMALE, 
 MALE ,
 OTHER ,
 PREFER ,
 PARENT ,
 SIBILING,
 LOVEDONE,
 GUARDIAN ,
 FRIEND ,
 RELATIVE ,
 LOGIN_COPYRIGHTS,
 CONTACT_US_LABEL,
 TERMS_OF_USE_LABEL,
 PRIVACY_NOTICE_LABEL

}