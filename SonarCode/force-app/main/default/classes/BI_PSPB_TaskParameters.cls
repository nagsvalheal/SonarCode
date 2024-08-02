/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public class BI_PSPB_TaskParameters {
    public String subject;
    public String notificationType;
    public String category;
    public String treatmentType;
    public String status;
    
   /**
	* @description  Used to create task when a video is uploaded and calling the
	method to send sms and email.
	*/
    public BI_PSPB_TaskParameters(String subject, String notificationType, String category, String treatmentType, String status) {
        this.subject = subject;
        this.notificationType = notificationType;
        this.category = category;
        this.treatmentType = treatmentType;
        this.status = status;
    }
}