/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public class BI_PSPB_SmsAndEmailNotificationDetails {
    public String subject;
    public String emailSubject;
    public String urlPage;
    public String notificationType;
    public List<String> followName;
    /**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
    public BI_PSPB_SmsAndEmailNotificationDetails(String subject, String emailSubject, String urlPage, String notificationType, List<String> followName) {
        this.subject = subject;
        this.emailSubject = emailSubject;
        this.urlPage = urlPage;
        this.notificationType = notificationType;
        this.followName = followName;
    }
}