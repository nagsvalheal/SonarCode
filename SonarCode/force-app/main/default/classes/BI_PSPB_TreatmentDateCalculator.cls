/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_TreatmentDateCalculator {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static Set<Date> calculateTargetDates(Integer[] intervals) {
		Set<Date> targetDates = new Set<Date>();
		for (Integer interval : intervals) {
			targetDates.add(Date.today().addDays(interval));
		}
		return targetDates;
	}
}