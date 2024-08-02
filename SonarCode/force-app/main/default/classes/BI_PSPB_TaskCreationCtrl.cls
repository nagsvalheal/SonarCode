public with sharing class BI_PSPB_TaskCreationCtrl {
    /**
    * @description Used to create list of task records that
    are to be inserted.
    * @param enrollees List of Careprogram enrollees.
    * @param taskParams Object containing task parameters.
    * @return Returning list of tasks that are to be inserted.
    */
    public static List<Task> createTasks(List<Id> enrollees, BI_PSPB_TaskParameters taskParams) {
        List<Task> tasks = new List<Task>();
        try {
            for (Id enrollee : enrollees) {
                Task task = new Task();
                task.Subject = taskParams.subject;
                task.BI_PSP_Notification_Type__c = taskParams.notificationType;
                task.BI_PSP_Category__c = taskParams.category;
                task.BI_PSPB_Treatment_Type__c = taskParams.treatmentType;
                task.Status = taskParams.status;
                task.WhatId = enrollee;
                tasks.add(task);
            }
        } catch (Exception ex) {
            BI_PSPB_LogUtilities.exceptionLogMessage(
                '',
                BI_PSPB_TaskCreationCtrl.class.toString(),
                ex
            );
        }
        return tasks;
    }
}