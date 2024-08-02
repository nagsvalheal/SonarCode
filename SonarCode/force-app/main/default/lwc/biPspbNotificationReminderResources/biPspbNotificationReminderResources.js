// Import current user ID
import ID from '@salesforce/user/Id';
// Importing Static Resources for Treament Reminders
import ALARM from '@salesforce/resourceUrl/BI_PSPB_AlarmImg';
import OUTLOOK_ICON from "@salesforce/resourceUrl/BI_PSPB_OutlookCalendar";
import GOOGLE_ICON from "@salesforce/resourceUrl/BI_PSPB_GoogleCalendar";
import BOXED_ICON from "@salesforce/resourceUrl/BI_PSPB_BoxedIcon";
import DEFAULT_AVATAR_URL from "@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation";
import TIC from "@salesforce/resourceUrl/BI_PSP_ToastTickIcon";
import WARNING from "@salesforce/resourceUrl/BI_PSPB_WarningIcon";
import YELLOW_ICON from '@salesforce/resourceUrl/BI_PSPB_YellowIcon';
// Importing Static Resources for Notifications
import DOT_IMG from '@salesforce/resourceUrl/BI_PSPB_DotImg';
import CHALLENGES_IMG from '@salesforce/resourceUrl/BI_PSPB_NotificationChallengesImg';
import QUESTIONNAIRE_IMAGE from '@salesforce/resourceUrl/BI_PSP_QuestionnaireImage';
import AVATAR_IMG from '@salesforce/resourceUrl/BI_PSPB_SymptomImg';
import TREATMENT_IMG from '@salesforce/resourceUrl/BI_PSPB_ArticleImg';
import COMMUNITY_IMG from '@salesforce/resourceUrl/BI_PSP_CommunityLogo';
import QUESTIONNAIRE_ONLY_IMAGE from '@salesforce/resourceUrl/BI_PSP_TreatmentImage';
// Importing Custom Labels for Treatment Reminders
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
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
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
// Importing labels for Notifications
import SYMPTOM from '@salesforce/label/c.BI_PSP_SymptomTrackerValue';
import DLQI_QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_AssessmentDlqi';
import PSS_QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_AssessmentPss';
import WPAI_QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_AssessmentWpai';
import QSQ_QUESTIONNAIRES from '@salesforce/label/c.BI_PSP_Qsq';
import NEW_CONTENT from '@salesforce/label/c.BI_PSP_NotificationNewContent';
import CHALLENGES from '@salesforce/label/c.BI_PSP_ChallengesName';
import COMMUNITY from '@salesforce/label/c.BI_PSPB_Community';
import NOT_COMPLETED from '@salesforce/label/c.BI_PSP_NotCompleted';
import BI_PSP_HISTORY from '@salesforce/label/c.BI_PSPB_History';
import MY_QUESTIONNAIRES from '@salesforce/label/c.BI_PSPB_MyQuestionnaires';
import STATUS_EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import GENERAL_NOTIFICATION from '@salesforce/label/c.BI_PSP_GeneralNotification';
import GENERAL from '@salesforce/label/c.BI_PSPB_General';
import ACTION_REQUIRED from '@salesforce/label/c.BI_PSPB_ActionRequiredValue';
import ACTION from '@salesforce/label/c.BI_PSPB_Action';
import READ from '@salesforce/label/c.BI_PSPB_Read';
import TREATMENT from '@salesforce/label/c.BI_PSPB_Treatment';
import PRESCRIPTION from '@salesforce/label/c.BI_PSPB_Prescription';
import PRESCRIPTION_REMINDER from '@salesforce/label/c.BI_PSPB_PrescriptionReminderValue';
import COMPLETED from '@salesforce/label/c.BI_PSP_Completed';
import NOT_COMPLETED_HISTORY from '@salesforce/label/c.BI_PSPB_NotCompletedHistory';
import ALL from '@salesforce/label/c.BI_PSPB_All';
import TREATMENT_VIDEO from '@salesforce/label/c.BI_PSPB_TreatmentVideo';
import PRESCRIPTION_LABEL from '@salesforce/label/c.BI_PSPB_Prescription';
import TREATMENT_REMINDERS from '@salesforce/label/c.BI_PSPB_TreatmentReminders';
import PSS from '@salesforce/label/c.BI_PSP_AssessmentPss';
import DLQI from '@salesforce/label/c.BI_PSP_AssessmentDlqi';
import WPAI from '@salesforce/label/c.BI_PSP_AssessmentWpai';
import QSQ from '@salesforce/label/c.BI_PSP_Qsq';
import HISTORY_HEADING from '@salesforce/label/c.BI_PSPB_HistoryNotification';
import NO_NOTIFICATIONS from '@salesforce/label/c.BI_PSPB_NoNotifications';
import SYMPTOM_BUTTON from '@salesforce/label/c.BI_PSPB_NotificationSymptomButton';
import START_BUTTON from '@salesforce/label/c.BI_PSPB_StartButton';
import READ_BUTTON from '@salesforce/label/c.BI_PSPB_ReadButton'; 
import POST_BUTTON from '@salesforce/label/c.BI_PSPB_ViewPostButton';
import COMMENT_BUTTON from '@salesforce/label/c.BI_PSPB_ViewCommentButton';
import REACTION_BUTTON from '@salesforce/label/c.BI_PSPB_ViewReactionButton';
import FOLLOWER_BUTTON from '@salesforce/label/c.BI_PSPB_ViewFollowerButton';
import WATCH_BUTTON from '@salesforce/label/c.BI_PSPB_NotificationWatchButton';
import LOAD_MORE from '@salesforce/label/c.BI_PSPB_LoadMore';
import TYPE_PLACEHOLDER from '@salesforce/label/c.BI_PSPB_NotificationPlaceHolder';
import CATEGORY_PLACEHOLDER from '@salesforce/label/c.BI_PSPB_CategoryPlaceHolder';
import STATUS_PLACEHOLDER from '@salesforce/label/c.BI_PSPB_StatusPlaceHolder';
import NOTIFY_QUESTION_IMG from '@salesforce/resourceUrl/BI_PSP_QuestionnairesNotification';
import BI_PSP_ALL_POST_URL from '@salesforce/label/c.BI_PSPB_ChatterAllPost';
import BI_PSP_CHATTER_MY_POST from '@salesforce/label/c.BI_PSPB_ChatterMyPost';
import BI_PSP_CHATTER_FOLLOWER from '@salesforce/label/c.BI_PSPB_ChatterFollower';
import BI_PSP_FOLLOW from '@salesforce/label/c.BI_PSP_Follow';
import BI_PSP_REACTION from '@salesforce/label/c.BI_PSP_Reaction';
import BI_PSP_CREATE_POST from '@salesforce/label/c.BI_PSP_CreatePost';
import BI_PSP_COMMENT from '@salesforce/label/c.BI_PSP_Comment';
import BI_PSPB_SYMPTOM_TRACKER_MAIN from '@salesforce/label/c.BI_PSPB_SymptomTrackerMain';
import BI_PSPB_OUTSTANDING_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import BI_PSP_CHALLENGESURL from "@salesforce/label/c.BI_PSP_ChallengesNaviUrl";
import BI_PSP_INFO_CENTER_URL from "@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl";
import NOTIFICATION_HEADING from "@salesforce/label/c.BI_PSPB_NotificationHeading";
import ACTION_URL from '@salesforce/label/c.BI_PSPB_ActionUrl';
import MESSAGE_CENTER_URL from '@salesforce/label/c.BI_PSPB_MessageCenterPageUrl';
import HISTORY_URL from '@salesforce/label/c.BI_PSPB_HistoryUrl';
import ACTION_REQUIRED_HEADING from '@salesforce/label/c.BI_PSPB_ActionRequired';
import GENERAL_HEADING from '@salesforce/label/c.BI_PSPB_GeneralHeading';
import BI_PSPB_TREATMENT_REMINDER from '@salesforce/label/c.BI_PSPB_TreatmentReminder';
import DATE_OF_TREATMENT from '@salesforce/label/c.BI_PSPB_Date_of_Treatment';
import DATE_OF_TREATMENT_FIELD from '@salesforce/label/c.BI_PSPB_TreatmentDateField';
import BI_PSPB_HOUR from '@salesforce/label/c.BI_PSPB_SeventyTwoHour';
import BI_PSPB_HR from '@salesforce/label/c.BI_PSPB_TwentyFourHours';
import BI_PSPB_DLQI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl';
import BI_PSPB_PSS_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl';
import BI_PSPB_WPAI_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_WapiQuestionnaire';
import BI_PSPB_QSQ_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonths';
import BI_PSPB_PERSONALIZE_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import DAY_OF_TREATMENT from '@salesforce/label/c.BI_PSPB_DayOfTreatment';
import PAST_DUE_DATE from '@salesforce/label/c.BI_PSPB_PastDueDate';
import PAST_DUE_DATE_TWO from '@salesforce/label/c.BI_PSPB_PastDueDateTwo';
import YES from '@salesforce/label/c.BI_PSPB_Yes';
import NO from '@salesforce/label/c.BI_PSPB_No';
import SUCCESS_TOAST from '@salesforce/label/c.BI_PSPB_SuccessToast';
import DATE_CAPTURED from '@salesforce/label/c.BI_PSPB_DateCaptured';
import SUCCESS_TOAST_DATE from '@salesforce/label/c.BI_PSPB_SuccessDateToast';
import PRESCRIPTION_OPTION from '@salesforce/label/c.BI_PSPB_PrescriptionReminders';
import ACTION_HEADING from '@salesforce/label/c.BI_PSPB_NotificationActionHeading';
import NO_ACTION_REQUIRED from '@salesforce/label/c.BI_PSPB_NoActionRequired';
import YES_BUTTON from '@salesforce/label/c.BI_PSPB_YesButton';
import NO_BUTTON from '@salesforce/label/c.BI_PSPB_NoButton';
import UPDATE_SYMPTOMS_BUTTON from '@salesforce/label/c.BI_PSPB_UpdateSymptomsButton';
import GET_START_BUTTON from '@salesforce/label/c.BI_PSPB_GetStartedButton';
import CLICK_START_BUTTON from '@salesforce/label/c.BI_PSPB_ClickStartButton';
import CLICK_TO_START from '@salesforce/label/c.BI_PSPB_ClickToStart';
import START from '@salesforce/label/c.BI_PSPB_Start';
import ENTER_DATE from '@salesforce/label/c.BI_PSPB_EnterDate';
import ENTER_DATE_FIELD from '@salesforce/label/c.BI_PSPB_EnterDateField';
import SUBMIT from '@salesforce/label/c.BI_PSPB_SubmitButton';
import REMINDER_AVATAR_TEXT from '@salesforce/label/c.BI_PSPB_ReminderValueTwo';
import REMINDER_AVATAR_ONE from '@salesforce/label/c.BI_PSPB_ReminderValueOne';
import REMINDER_AVATAR_THREE from '@salesforce/label/c.BI_PSPB_ReminderValueThree';
import DONE_LABEL from '@salesforce/label/c.BI_PSPB_DoneLabel';
import SET_TREATMENT from '@salesforce/label/c.BI_PSPB_SetTreatmentText';
import LOOK_REMINDERS from '@salesforce/label/c.BI_PSPB_LookReminders';
import USE_REMINDER_MOBILE from '@salesforce/label/c.BI_PSPB_ReminderUsePageMobView';
import TREATMENT_REMINDER_MOBILE from '@salesforce/label/c.BI_PSPB_TreatmentReminderMobileView';
import SET_TREATMENT_PRESCRIPTION from '@salesforce/label/c.BI_PSPB_SetTreatment';
import TIMELINE from '@salesforce/label/c.BI_PSPB_TimeLine';
import RECEIVE_REMINDER from '@salesforce/label/c.BI_PSPB_ReceiveReminder';
import RECEIVE_REMINDER_DATE from '@salesforce/label/c.BI_PSPB_RecieveReminders';
import DAYS_BEFORE from '@salesforce/label/c.BI_PSPB_DaysBefore';
import DAY_BEFORE from '@salesforce/label/c.BI_PSPB_DayBefore';
import DAY_THREE from '@salesforce/label/c.BI_PSP_GppIntimacyReadTime';
import DAY_ONE from '@salesforce/label/c.BI_PSP_ThumbsUpNumber';
import DAY_SEVEN from '@salesforce/label/c.BI_PSPB_Seven';
import DAY_TEN from '@salesforce/label/c.BI_PSPB_Ten';
import DAY_FOURTEEN from '@salesforce/label/c.BI_PSPB_Fourteen';
import FIELD_REQUIRED from '@salesforce/label/c.BI_PSPB_ERROR_Message_For_Prescription';
import WHEN_TREATMENT from '@salesforce/label/c.BI_PSPB_WhenTreatmentReminder';
import SAVE from '@salesforce/label/c.BI_PSPB_Save';
import ADD_CALENDAR from '@salesforce/label/c.BI_PSPB_AddCalendar';
import REMINDER_TEXT from '@salesforce/label/c.BI_PSPB_TreatmentReminderText';
import SELECT_CALENDAR from '@salesforce/label/c.BI_PSPB_SelectCalendar';
import TOOL_TIP from '@salesforce/label/c.BI_PSPB_PrescriptionToolTip';
import THREE_DAYS_TOOL_TIP from '@salesforce/label/c.BI_PSPB_ThreeDaysToolTip';
import ONE_DAY_TOOL_TIP from '@salesforce/label/c.BI_PSPB_OneDayToolTip';
import TREATMENT_DATE_TOOL_TIP from '@salesforce/label/c.BI_PSPB_TreatmentDateToolTip';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import NO_RECORDS from '@salesforce/label/c.BI_PSP_RecordNotFoundMsg';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
// Exporting all resources in an organized object
export const resources = {
    ID,
    // Static Resources
    ALARM,
    DOT_IMG,
    CHALLENGES_IMG,
    QUESTIONNAIRE_IMAGE,
    AVATAR_IMG,
    TREATMENT_IMG,
    COMMUNITY_IMG,
    // Custom Labels
    ALL,
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
    ADD_CALENDAR,
    REMINDER_AVATAR_ONE,
    REMINDER_PAGE_URL,
    DAYS_BEFORE,
    DAY_BEFORE,
    DAY_THREE,
    WHEN_TREATMENT,
    SELECT_CALENDAR,
    SAVE,
    TREATMENT_REMINDER_MOBILE,
    LOOK_REMINDERS,
    DAY_ONE,
    DAY_SEVEN,DAY_FOURTEEN,
    DAY_TEN,
    ONE_DAY_TOOL_TIP,
    PRESCRIPTION_REMINDER_ONE,
    PRESCRIPTION_REMINDER_TWO,
    REMINDER_TEXT,
    TREATMENT_DATE_TOOL_TIP,
    FIELD_REQUIRED,
    PRESCRIPTION_REMINDER_THREE,
    RECEIVE_REMINDER_DATE,
    TREATMENT_REMINDER_ONE,
    SET_TREATMENT_PRESCRIPTION,
    TIMELINE,
    USE_REMINDER_MOBILE,
    TREATMENT_REMINDER_TWO,
    NO_UPCOMING_REMAINDERS,
    REMINDER_AVATAR_THREE,
    THREE_DAYS_TOOL_TIP,
    NO_REMINDER,
    DONE_LABEL,
    REMINDERS,
    ADD_DATE,
    UPCOMING_DAYS,
    LABEL_US,
    DAYS,
    TOOL_TIP,
    DATE_OF_TREATMENT_FIELD,
    RECEIVE_REMINDER,
    ERROR_MESSAGE,
    ERROR_VARIANT,
    REMINDER_SETUP,
    SET_TREATMENT,
    OUTLOOK_ICON,
    GOOGLE_ICON,
    BOXED_ICON,
    REMINDER_AVATAR_TEXT,
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
    YELLOW_ICON,
    SYMPTOM,
    DLQI_QUESTIONNAIRES,
    PSS_QUESTIONNAIRES,
    WPAI_QUESTIONNAIRES,
    QSQ_QUESTIONNAIRES,
    NEW_CONTENT,
    CHALLENGES,
    COMMUNITY,
    NOT_COMPLETED,
    BI_PSP_HISTORY,
    MY_QUESTIONNAIRES,
    STATUS_EXPIRED,
    GENERAL_NOTIFICATION,
    GENERAL,
    ACTION_REQUIRED,
    ACTION,
    READ,
    TREATMENT,
    PRESCRIPTION,
    PRESCRIPTION_REMINDER,
    COMPLETED,
    NOT_COMPLETED_HISTORY,
    TREATMENT_VIDEO,
    PRESCRIPTION_LABEL,
    TREATMENT_REMINDERS,
    PSS,
    WPAI,
    DLQI,
    QSQ,
    HISTORY_HEADING,
    NO_NOTIFICATIONS,
    LOAD_MORE,
    TYPE_PLACEHOLDER,
    CATEGORY_PLACEHOLDER,
    STATUS_PLACEHOLDER,
    NO_RECORDS,
    NOTIFY_QUESTION_IMG,
    UNASSIGNED_SITE_URL,
    BI_PSP_ALL_POST_URL,
    BI_PSP_CHATTER_MY_POST,
    BI_PSP_CHATTER_FOLLOWER,
    BI_PSP_FOLLOW,
    BI_PSP_REACTION,
    BI_PSP_CREATE_POST,
    BI_PSP_COMMENT,
    BI_PSPB_SYMPTOM_TRACKER_MAIN,
    BI_PSPB_OUTSTANDING_QUESTIONNAIRE_URL,
    BI_PSP_CHALLENGESURL,
    BI_PSP_INFO_CENTER_URL,
    NOTIFICATION_HEADING,
    SYMPTOM_BUTTON,
    START_BUTTON,
    READ_BUTTON,
    POST_BUTTON,
    COMMENT_BUTTON,
    REACTION_BUTTON,
    FOLLOWER_BUTTON,
    WATCH_BUTTON,
    ACTION_URL,
    MESSAGE_CENTER_URL,
    HISTORY_URL,
    ACTION_REQUIRED_HEADING,
    GENERAL_HEADING,
    QUESTIONNAIRE_ONLY_IMAGE,
    BI_PSPB_TREATMENT_REMINDER,
    BI_PSPB_HOUR,
    BI_PSPB_HR,
    BI_PSPB_DLQI_QUESTIONNAIRE_URL,
    BI_PSPB_PSS_QUESTIONNAIRE_URL,
    BI_PSPB_WPAI_QUESTIONNAIRE_URL,
    BI_PSPB_QSQ_QUESTIONNAIRE_URL,
    BI_PSPB_PERSONALIZE_QUESTIONNAIRE_URL,
    DAY_OF_TREATMENT,
    PAST_DUE_DATE_TWO,
    YES,
    NO,
    DATE_OF_TREATMENT,
    PAST_DUE_DATE,
    PRESCRIPTION_OPTION,
    SUCCESS_TOAST,
    SUCCESS_TOAST_DATE,
    DATE_CAPTURED,
    ACTION_HEADING,
    NO_ACTION_REQUIRED,
    YES_BUTTON,
    NO_BUTTON,
    UPDATE_SYMPTOMS_BUTTON,
    GET_START_BUTTON,
    CLICK_START_BUTTON,
    CLICK_TO_START,
    START,
    ENTER_DATE,
    ENTER_DATE_FIELD,
    SUBMIT
};