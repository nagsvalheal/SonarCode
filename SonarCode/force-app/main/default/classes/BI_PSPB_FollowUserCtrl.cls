/**
 * @description This class is used to fetch, insert and delete
 *              the follow and following records.
 * History:
 * Version Author      Date            Detail   Description
 * 1.0     Ragavi      05-Dec-2023     Created  Initial development.
 * 1.1     Ragavi      05-Jan-2024     Updated  Updated to filter records without nullpointer exception.
 * 1.2     Ragavi      04-Apr-2024     Updated  Catch log added.
 * 1.3     Ragavi      22-Apr-2024     Updated  Code Review.
 * 1.4     Ragavi      27-Apr-2024     Updated  Indentation.
 */
public with sharing class BI_PSPB_FollowUserCtrl {
	/**
	* @description		Used to follow the accounts as followers and following.
	* @param			enrolleeIdToFollow - Id of the user to follow.
	This method is used in biPspbMyFollowers,biPspbMyFollowing,biPspbAllPost
	and biPspbMyPost LWC.
	*/
	@AuraEnabled(cacheable=false)
	public static void followUser(String enrolleeIdToFollow) {
		try {
			// Getting the CareProgramEnrollee ID associated with the user ID.
			String enrolleeIdWhoFollows = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
			// Check if enrolleeIdWhoFollows and enrolleeIdToFollow are  blank.
			if( String.isBlank(enrolleeIdWhoFollows) || String.isBlank(enrolleeIdToFollow) ){
				BI_PSP_LogMessagesUtility.exceptionLogMessage(
					BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
					BI_PSPB_FollowUserCtrl.class.toString(),
					null
				);
			}

			//Checking for if there any existing records before following.
			List<BI_PSP_FeedFollow__c> existingRecords = [
				SELECT Id
				FROM BI_PSP_FeedFollow__c
				WHERE
					(BI_PSP_CareProgramEnrolleeAccount__c = :enrolleeIdWhoFollows
					AND BI_PSP_CareProgramEnrolleeFollow__c = :enrolleeIdToFollow
					AND BI_PSP_Type__c = :BI_PSPB_CommunityConstantCtrl.following)
					OR (BI_PSP_CareProgramEnrolleeAccount__c = :enrolleeIdToFollow
					AND BI_PSP_CareProgramEnrolleeFollow__c = :enrolleeIdWhoFollows
					AND BI_PSP_Type__c = :BI_PSPB_CommunityConstantCtrl.follower)
				LIMIT 1
			];

			// Check if there are no existing records for the follow relationship.
			if (!existingRecords.isEmpty()) {
				// If no errors occurred during the insertion, but the follow
				//relationship already exists,
				// throw an exception indicating that user is already being followed.
				BI_PSP_LogMessagesUtility.exceptionLogMessage(
					BI_PSPB_CommunityConstantCtrl.alreadyFollowing,
					BI_PSPB_FollowUserCtrl.class.toString(),
					null
				);
			}
			// List to hold new records to be inserted.
			List<BI_PSP_FeedFollow__c> insertFeedFollowList = new List<BI_PSP_FeedFollow__c>();
			// Create a new record for the follower.
			BI_PSP_FeedFollow__c newfollower = new BI_PSP_FeedFollow__c(
				BI_PSP_CareProgramEnrolleeAccount__c = enrolleeIdWhoFollows,
				BI_PSP_CareProgramEnrolleeFollow__c = enrolleeIdToFollow,
				BI_PSP_Type__c = BI_PSPB_CommunityConstantCtrl.following
			);
			insertFeedFollowList.add(newfollower);
			// Create a new record for the user being followed.
			BI_PSP_FeedFollow__c newfollowing = new BI_PSP_FeedFollow__c(
				BI_PSP_CareProgramEnrolleeAccount__c = enrolleeIdToFollow,
				BI_PSP_CareProgramEnrolleeFollow__c = enrolleeIdWhoFollows,
				BI_PSP_Type__c = BI_PSPB_CommunityConstantCtrl.follower
			);
			insertFeedFollowList.add(newfollowing);
			// Insert the new records into the database.
			BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
				insertFeedFollowList,
				BI_PSPB_FeedItemCtrl.class.toString(),
				true
			);
		} catch (System.DmlException ex) {
			// Catch any other exceptions that might occur during the process.
			// Log the exception and throw a general error exception.
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileFollowing,
				BI_PSPB_FollowUserCtrl.class.toString(),
				ex
			);
		}
	}
	/**
	* @description		Used to fetch all followers of the loggedin user.
	* @return			List<BI_PSP_FeedFollow__c> - All followers for that user.
						Returns to biPspbMyFollowers and biPspbMyFollowing LWC.
	*/
	@AuraEnabled(cacheable=false)
	public static List<BI_PSP_FeedFollow__c> getMyFollowers() {
		List<BI_PSP_FeedFollow__c> followers;
		try {
			// Getting the CareProgramEnrollee ID associated with the user ID.
			String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
			// Checking if the accountId obtained is not blank.
			if (String.isBlank(cpeId)) {
				// Handling the case where accountId is blank,
				// indicating a problem with retrieval.
				BI_PSP_LogMessagesUtility.exceptionLogMessage(
					BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
					BI_PSPB_FollowUserCtrl.class.toString(),
					null
				);
			}
				// Querying the database to retrieve followers for the logged-in user.
				followers = [
					SELECT
						BI_PSP_CareProgramEnrolleeFollow__c,
						BI_PSP_CareProgramEnrolleeFollow__r.BI_PSP_CommunityUsername__c,
						BI_PSP_Type__c,
						BI_PSP_CareProgramEnrolleeAccount__c,
						BI_PSP_CareProgramEnrolleeAccount__r.BI_PSP_CommunityUsername__c,
						BI_PSP_CareProgramEnrolleeFollow__r.BI_PSP_AvatarUrl__c
					FROM BI_PSP_FeedFollow__c
					WHERE
						BI_PSP_CareProgramEnrolleeAccount__c = :cpeId
						AND (BI_PSP_Type__c = :BI_PSPB_CommunityConstantCtrl.follower
						OR BI_PSP_Type__c = :BI_PSPB_CommunityConstantCtrl.following)
				];
			
		} catch (Exception ex) {
			// Catch any other exceptions that might occur during the process.
			// Log the exception and throw a general error exception.
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_CommunityConstantCtrl.errorWhileGettingFollowers,
				BI_PSPB_FollowUserCtrl.class.toString(),
				ex
			);
		}
		/** Here 'followers' is not checked for null exception as 
			it is handled in LWC.
			There are two different scenario such as it takes an action when 
			it is returned as null and another action when it is returned with values.
		*/
		return followers;
	}
	/**
	* @description		Used to unfollow the account that is being followed.
	* @param			enrolleeIdToUnFollow - Id of the account that to be unfollowed.
	This method is used in biPspbMyFollowers,biPspbMyFollowing,biPspbAllPost
	and biPspbMyPost LWC.
	*/
	@AuraEnabled(cacheable=false)
	public static void unfollowUser(String enrolleeIdToUnFollow) {
		try {
			// Getting the CareProgramEnrollee ID associated with the user ID.
			String enrolleeIdWhoUnfollows = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
			// Checking if enrolleeIdToUnFollow and accountId obtained are  blank.
			if (String.isBlank(enrolleeIdWhoUnfollows) || String.isBlank(enrolleeIdToUnFollow)){
				BI_PSP_LogMessagesUtility.exceptionLogMessage(
					BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
					BI_PSPB_FollowUserCtrl.class.toString(),
					null
				);
			}

			// Querying  to retrieve the follower and following records to unfollow.
			BI_PSP_FeedFollow__c unfollower = [
				SELECT Id
				FROM BI_PSP_FeedFollow__c
				WHERE
					BI_PSP_CareProgramEnrolleeAccount__c = :enrolleeIdWhoUnfollows
					AND BI_PSP_CareProgramEnrolleeFollow__c = :enrolleeIdToUnFollow
					AND BI_PSP_Type__c = :BI_PSPB_CommunityConstantCtrl.following
				LIMIT 1
			];
			BI_PSP_FeedFollow__c unfollowing = [
				SELECT Id
				FROM BI_PSP_FeedFollow__c
				WHERE
					BI_PSP_CareProgramEnrolleeAccount__c = :enrolleeIdToUnFollow
					AND BI_PSP_CareProgramEnrolleeFollow__c = :enrolleeIdWhoUnfollows
					AND BI_PSP_Type__c = :BI_PSPB_CommunityConstantCtrl.follower
				LIMIT 1
			];
			/*Checking if both follower and following records exist
			 before proceeding with unfollowing. */
			if (unfollowing != null && unfollower != null) {
				// Creating a list to hold the records to be unfollowed.
				List<BI_PSP_FeedFollow__c> insertFeedUnfollowList = new List<BI_PSP_FeedFollow__c>();
				// Adding the follower and following records to the list for deletion.
				insertFeedUnfollowList.add(unfollowing);
				insertFeedUnfollowList.add(unfollower);
				// Deleting the follower and following records.

				BI_PSP_DatabaseOperationsUtility.deleteHandleErrors(
					insertFeedUnfollowList,
					BI_PSPB_FollowUserCtrl.class.toString()
				);
			}
		} catch (System.DmlException ex) {
			// Catch any other exceptions that might occur during the process.
			// Log the exception and throw a general error exception.
			BI_PSP_LogMessagesUtility.catchSystemException(
				BI_PSPB_CommunityConstantCtrl.errorWhileUnfollowing,
				BI_PSPB_FollowUserCtrl.class.toString(),
				ex
			);
		}
	}
}