public with sharing class BI_PSPB_TreatmentPastRemindersSched implements Schedulable {
    public void execute(SchedulableContext sc) {
        try {
            BI_PSPB_TreatmentPastDueService.processPastDueReminders();
        } catch (System.DmlException ex) {
            BI_PSPB_LogUtilities.catchSystemException(
				BI_PSPB_NewConstantsCtrl.errorTreatmentReminderSched,
				BI_PSPB_TreatmentPastRemindersSched.class.toString(),
				ex
			);
        }
    }
}