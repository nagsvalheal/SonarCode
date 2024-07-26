// Import current user ID
import ID from '@salesforce/user/Id';

// Importing Static Resources
import ALARM from '@salesforce/resourceUrl/BI_PSPB_AlarmImg';
import OUTLOOK_ICON from "@salesforce/resourceUrl/BI_PSPB_OutlookCalendar";
import GOOGLE_ICON from "@salesforce/resourceUrl/BI_PSPB_GoogleCalendar";
import BOXED_ICON from "@salesforce/resourceUrl/BI_PSPB_BoxedIcon";
import DEFAULT_AVATAR_URL from "@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation";
import TIC from "@salesforce/resourceUrl/BI_PSP_ToastTickIcon";
import WARNING from "@salesforce/resourceUrl/BI_PSPB_WarningIcon";
import YELLOW_ICON from '@salesforce/resourceUrl/BI_PSPB_YellowIcon';

// Importing Custom Labels
import JAN from "@salesforce/label/c.BI_PSPB_Jan";
import FEB from "@salesforce/label/c.BI_PSPB_Feb";
import MARCH from "@salesforce/label/c.BI_PSPB_March";
import APRIL from "@salesforce/label/c.BI_PSPB_April";
import MAY from "@salesforce/label/c.BI_PSPB_May";
import JUNE from "@salesforce/label/c.BI_PSPB_June";
import JULY from "@salesforce/label/c.BI_PSPB_July";
import AUG from "@salesforce/label/c.BI_PSPB_Aug";
import SEP from "@salesforce/label/c.BI_PSPB_Sep";
import OCT from "@salesforce/label/c.BI_PSPB_Oct";
import NOV from "@salesforce/label/c.BI_PSPB_Nov";
import DEC from "@salesforce/label/c.BI_PSPB_Dec";
import DECEMBER from '@salesforce/label/c.BI_PSPB_DecemberValue';
import NOVEMBER from '@salesforce/label/c.BI_PSPB_NovemberValue';
import OCTOBER from '@salesforce/label/c.BI_PSPB_OctoberValue';
import SEPTEMBER from '@salesforce/label/c.BI_PSPB_SeptemberValue';
import AUGUST from '@salesforce/label/c.BI_PSPB_AugustValue';
import JULY_MONTH from '@salesforce/label/c.BI_PSPB_JulyValue';
import JUNE_MONTH from '@salesforce/label/c.BI_PSPB_JuneValue';
import MAY_MONTH from '@salesforce/label/c.BI_PSPB_MayValue';
import APRIL_MONTH from '@salesforce/label/c.BI_PSPB_AprilValue';
import MARCH_MONTH from '@salesforce/label/c.BI_PSPB_MarchValue';
import FEBRUARY from '@salesforce/label/c.BI_PSPB_FebruaryValue';
import JANUARY from '@salesforce/label/c.BI_PSPB_JanuaryValue';
import TH from '@salesforce/label/c.BI_PSPB_ThValue';
import ST from '@salesforce/label/c.BI_PSPB_StValue';
import ND from '@salesforce/label/c.BI_PSPB_NdValue';
import RD from '@salesforce/label/c.BI_PSPB_RdValue';
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import REMINDER_PAGE_URL from '@salesforce/label/c.BI_PSPB_ReminderUrl';
import PRESCRIPTION_REMINDER_ONE from '@salesforce/label/c.BI_PSPB_PrescriptionReminderOne';
import PRESCRIPTION_REMINDER_TWO from '@salesforce/label/c.BI_PSPB_PrescriptionReminderTwo';
import PRESCRIPTION_REMINDER_THREE from '@salesforce/label/c.BI_PSPB_PrescriptionReminderThree';
import TREATMENT_REMINDER_ONE from '@salesforce/label/c.BI_PSPB_TreatmentReminderOne';
import TREATMENT_REMINDER_TWO from '@salesforce/label/c.BI_PSPB_TreatmentReminderTwo';
import NO_UPCOMING_REMAINDERS from '@salesforce/label/c.BI_PSPB_NoUpcomingRemainders';
import NO_REMINDER from '@salesforce/label/c.BI_PSPB_ReminderWidget';
import UPCOMING_DAYS from '@salesforce/label/c.BI_PSPB_UpcomingDays';
import REMINDERS from '@salesforce/label/c.BI_PSPB_Reminders';
import LABEL_US from '@salesforce/label/c.BI_PSPB_EnUsValue';
import ADD_DATE from '@salesforce/label/c.BI_PSPB_AddDate';
import DAYS from '@salesforce/label/c.BI_PSPB_ReminderDays';
import REMINDER_SETUP from '@salesforce/label/c.BI_PSPB_ReminderSetup';
import CAREGIVER_NOTIFICATION_URL from '@salesforce/label/c.BI_PSPB_CaregiverNotificationPageUrl';
import CAREGIVER_PROFILES from '@salesforce/label/c.BI_PSPB_CaregiverProfile';
import PATIENT_NOTIFICATION_URL from '@salesforce/label/c.BI_PSPB_PatientNotificationUrl';
import PATIENT_PROFILES from '@salesforce/label/c.BI_PSP_PatientProfile';
import SLASH from '@salesforce/label/c.BI_PSP_SlashSiteUrl';
import SYSTEM_ADMIN_PROFILE from '@salesforce/label/c.BI_PSP_SystemAdminProfile';
import QUESTION from '@salesforce/label/c.BI_PSPB_ReminderNotificationQues';
import PREFERRED_WAY from '@salesforce/label/c.BI_PSPB_ReminderSetting';
import NOTIFICATION_SETTINGS from '@salesforce/label/c.BI_PSPB_NotificationSetting';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

// Exporting all resources in an organized object
export const resources = {
    ID,
    // Static Resources
    ALARM,
    // Custom Labels
    JAN,
    FEB,
    MARCH,
    APRIL,
    MAY,
    JUNE,
    JULY,
    AUG,
    SEP,
    OCT,
    NOV,
    DEC,
    DECEMBER,
    NOVEMBER,
    OCTOBER,
    SEPTEMBER,
    AUGUST,
    JULY_MONTH,
    JUNE_MONTH,
    MAY_MONTH,
    APRIL_MONTH,
    MARCH_MONTH,
    FEBRUARY,
    JANUARY,
    TH,
    ST,
    ND,
    RD,
    BRANDED_URL,
    REMINDER_PAGE_URL,
    PRESCRIPTION_REMINDER_ONE,
    PRESCRIPTION_REMINDER_TWO,
    PRESCRIPTION_REMINDER_THREE,
    TREATMENT_REMINDER_ONE,
    TREATMENT_REMINDER_TWO,
    NO_UPCOMING_REMAINDERS,
    NO_REMINDER,
    REMINDERS,
    ADD_DATE,
    UPCOMING_DAYS,
    LABEL_US,
    DAYS,
    ERROR_MESSAGE,
    ERROR_VARIANT,
    REMINDER_SETUP,
    OUTLOOK_ICON,
    GOOGLE_ICON,
    BOXED_ICON,
    DEFAULT_AVATAR_URL,
    TIC,
    WARNING,
    PREFERRED_WAY,
    NOTIFICATION_SETTINGS,
    QUESTION,
    CAREGIVER_NOTIFICATION_URL,
    CAREGIVER_PROFILES,
    PATIENT_NOTIFICATION_URL,
    PATIENT_PROFILES,
    SLASH,
    SYSTEM_ADMIN_PROFILE,
    YELLOW_ICON
};