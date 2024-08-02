//Labels
import ID from '@salesforce/user/Id';
import MEDICAL_INFORMATION from '@salesforce/resourceUrl/BI_PSPB_MedicalInformationImg';
import REPORT_ADVERSE from '@salesforce/resourceUrl/BI_PSPB_ReportAdverseImg';
import PLATFORM_SUPPORT from '@salesforce/resourceUrl/BI_PSPB_PlatformSupportImg';
import EMAIL_IMG from '@salesforce/resourceUrl/BI_PSPB_Mail';
import ARROW from "@salesforce/resourceUrl/BI_PSPB_BackArrow";
import PHN_IMG from '@salesforce/resourceUrl/BI_PSPB_Phone';
import IMG from '@salesforce/resourceUrl/BI_PSPB_MedicalKit';
import WARNING from '@salesforce/resourceUrl/BI_PSP_WarningIcon';
import CASE_RADIO_BTN from '@salesforce/resourceUrl/BI_PSPB_UploadFileCss';
import RADIO_BTN_COLOR_CHNAGE from '@salesforce/resourceUrl/BI_PSPB_RadioBottom';
import MY_ICON from '@salesforce/resourceUrl/BI_PSPB_UploadIcon';
import TIC from '@salesforce/resourceUrl/BI_PSP_ToastTickIcon';
import BOXED_IMG from '@salesforce/resourceUrl/BI_PSPB_BoxedImage';

//Case 
import LABEL_CASENUMBER from '@salesforce/label/c.BI_PSPB_CaseNumber';
import LABEL_SUBJECT from '@salesforce/label/c.BI_PSPB_Subject';
import LABEL_STATUS from '@salesforce/label/c.BI_PSPB_Status';
import LABEL_PRIORITY from '@salesforce/label/c.BI_PSPB_Priority';
import LABEL_TYPE from '@salesforce/label/c.BI_PSPB_Type';
import LABEL_MIE from '@salesforce/label/c.BI_PSPB_MedicalInformationEnquiry';
import LABEL_RAE from '@salesforce/label/c.BI_PSPB_ReportAdverseEvents';
import LABEL_PSP from '@salesforce/label/c.BI_PSPB_PspPlatform';
import LABEL_DRAFT from '@salesforce/label/c.BI_PSPB_Draft';
import LABEL_SUBMITTED from '@salesforce/label/c.BI_PSPB_Submitted';
import LABEL_ALL from '@salesforce/label/c.BI_PSPB_All';
import LABEL_NEEDMOREINFORMATION from '@salesforce/label/c.BI_PSPB_NeedMore';
import LABEL_NEEDINFO from '@salesforce/label/c.BI_PSPB_NeedInfo';
//Static

import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import MIE_PAGE from '@salesforce/label/c.BI_PSPB_MedicalInfoEnquiryUrl';
import RAE_PAGE from '@salesforce/label/c.BI_PSPB_ReportAdverseEvent';
import PSP_PAGE from '@salesforce/label/c.BI_PSPB_PlatformSupportUrl';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import SUPPORT_SMS from '@salesforce/label/c.BI_PSPB_SupportSms';
import SUPPORT_EMAIL from '@salesforce/label/c.BI_PSPB_SupportEmail';
import SUPPORT_PAGE_URL from '@salesforce/label/c.BI_PSPB_SupportCenterPageUrl';
import MY_CASE_URL from '@salesforce/label/c.BI_PSPB_MyCasesPageUrl';
import DRAFT from '@salesforce/resourceUrl/BI_PSPB_Draft';
import SLDSCLASS from '@salesforce/resourceUrl/BI_PSPB_SldsClassCc';
import SUBTYPE_ERROR from '@salesforce/label/c.BI_PSPB_SelectCaseType';
import DESCRIPTION_ERROR from '@salesforce/label/c.BI_PSPB_DescriptionError';
import DESCRIPTION_ERROR_CHAR from '@salesforce/label/c.BI_PSPB_ErrorCharacterLength';
import PRODUCT from '@salesforce/label/c.BI_PSPB_ProductInformation';
import TREATMENT from '@salesforce/label/c.BI_PSPB_Treatment';
import SYMPTOM from '@salesforce/label/c.BI_PSPB_Symptoms';
import SUB_TYPE_ERROR from '@salesforce/label/c.BI_PSPB_SelectCaseType';
import SUSPECTED from '@salesforce/label/c.BI_PSPB_SuspectedEffectMsg';
import UNEXPECTED from '@salesforce/label/c.BI_PSPB_UnexpectedOutComeMsg';
import OTHER from '@salesforce/label/c.BI_PSPB_Other';
import ERROR_PAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';
import NEED_MORE_INFO from '@salesforce/label/c.BI_PSPB_NeedMore';
import SUCCESS_MSG from '@salesforce/label/c.BI_PSPB_SuccessToastOne';
import SUCCESS_MESSAGE from '@salesforce/label/c.BI_PSPB_SuccessToastTwo';
import REPORT_TITLE from '@salesforce/label/c.BI_PSPB_ReportAdverseEvents';
import BACK from '@salesforce/label/c.BI_PSPB_Back';
import REPORT_CONTENT from '@salesforce/label/c.BI_PSPB_ReportContent';
import SELECT_TYPE from '@salesforce/label/c.BI_PSPB_SelectSubType';
import DESCRIPTION from '@salesforce/label/c.BI_PSPB_Description';
import ATTACHMENT from '@salesforce/label/c.BI_PSPB_Attachments';
import BROWS_AND_UPLOAD from '@salesforce/label/c.BI_PSPB_BrowsAndUpload';
import FIVEMB from '@salesforce/label/c.BI_PSPB_FiveMb';
import MAX_LIMIT from '@salesforce/label/c.BI_PSPB_MaxLimit';
import CREATE_CASE from '@salesforce/label/c.BI_PSPB_CreateNewCase';
import CREATE_DRAFT from '@salesforce/label/c.BI_PSP_DraftButton';
import SUPPORT_CENTER from '@salesforce/label/c.BI_PSPB_SupportCenterValue';
import MYCASE from '@salesforce/label/c.BI_PSPB_MyCase';
export const support ={

    //labels
    SUCCESS_MSG,
    MYCASE,
    SUPPORT_CENTER,
    REPORT_CONTENT,
    SELECT_TYPE,
    DESCRIPTION,
    FIVEMB,
    CREATE_CASE,
    CREATE_DRAFT,
    MAX_LIMIT,
    BACK,
    BROWS_AND_UPLOAD,
    ATTACHMENT,
    REPORT_TITLE,
    SUCCESS_MESSAGE,
    NEED_MORE_INFO,
    SUB_TYPE_ERROR,
    ERROR_PAGE,
    SUSPECTED,
    UNEXPECTED,
    OTHER,
    BOXED_IMG,
    IMG,
    WARNING,
    CASE_RADIO_BTN,
    RADIO_BTN_COLOR_CHNAGE,
    MY_ICON,
    TIC,
    SUBTYPE_ERROR,
    DESCRIPTION_ERROR_CHAR,
    DESCRIPTION_ERROR,
    PRODUCT,
    TREATMENT,
    SYMPTOM,
    ID,
    DRAFT,
    SLDSCLASS,
    LABEL_CASENUMBER,
    LABEL_SUBJECT,
    LABEL_STATUS,
    LABEL_PRIORITY,
    LABEL_TYPE,
    LABEL_MIE,
    LABEL_RAE,
    LABEL_PSP,
    LABEL_DRAFT,
    LABEL_SUBMITTED,
    LABEL_ALL,
    LABEL_NEEDMOREINFORMATION,
    LABEL_NEEDINFO,
    SUPPORT_PAGE_URL,
    MY_CASE_URL,
    MEDICAL_INFORMATION,
    REPORT_ADVERSE,
    PLATFORM_SUPPORT,
    EMAIL_IMG,
    ARROW,
    PHN_IMG,
    BRANDED_URL,
    UNASSIGNED_URL,
    MIE_PAGE,
    RAE_PAGE,
    PSP_PAGE,
    BRANDED_URL_NAVI,
    UNASSIGNED_URL_NAVI,
    ERROR_MESSAGE,
    ERROR_VARIANT,
    SUPPORT_SMS,
    SUPPORT_EMAIL
}