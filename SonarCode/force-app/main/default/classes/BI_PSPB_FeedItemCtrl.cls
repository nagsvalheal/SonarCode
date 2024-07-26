/**
 * @description This class is used for displaying all posts,
 *              soft deleting the posts, creating a new post,
 *              and creating a comment for a particular post.
 * History:
 * Version Author      Date            Detail          Description
 * 1.0     Deepa       05-Dec-2023     Created         Initial development.
 * 1.1     Deepa       01-Jan-2024     Updated         Updated for caregiver.
 * 1.2     Deepa       04-Apr-2024     Updated         Catch log added.
 * 1.3     Deepa       22-Apr-2024     Updated         Code Review.
 * 1.4     Deepa       27-Apr-2024     Updated         Indentation.
 */
public with sharing class BI_PSPB_FeedItemCtrl {
  /**
	* @description	Used to softdelete a post from the database.
	* @param		feedItemId - The Id	of the post to be soft deleted.
	This method is used in biPspbMyPost LWC.
	*/
  @AuraEnabled
  public static void softDeleteFeedItem(String feedItemId) {
    try {
      if (String.isBlank(feedItemId)) {
        // Throwing exception when post is not deleted.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileDeleting,
          BI_PSPB_FeedItemCtrl.class.toString(),
          null
        );
      }
        // Fetching the post of this Id, that is to be deleted.
        BI_PSP_FeedItem__c feedItemToUpdate = [
          SELECT Id, BI_PSP_SoftDelete__c
          FROM BI_PSP_FeedItem__c
          WHERE Id = :feedItemId
          WITH USER_MODE LIMIT 1
        ];
        if (feedItemToUpdate != null) {
          // Updating the 'BI_PSP_SoftDelete__c' field to softdelete the post.
          feedItemToUpdate.BI_PSP_SoftDelete__c = BI_PSPB_CommunityConstantCtrl.softDelete;
          BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(
            new List<BI_PSP_FeedItem__c>{ feedItemToUpdate },
            BI_PSPB_FeedItemCtrl.class.toString(),true
          );
        } else {
          // Throwing exception when post is not found.
          BI_PSP_LogMessagesUtility.exceptionLogMessage(
            BI_PSPB_CommunityConstantCtrl.errorWhileFetchingPost,
            BI_PSPB_FeedItemCtrl.class.toString(),
            null
          );
        }
    } catch (System.DmlException ex) {
      BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSPB_CommunityConstantCtrl.errorWhileDeleting,
        BI_PSPB_FeedItemCtrl.class.toString(),
        ex
      );
    }
  }
  /**
	* @description		Used to create a post with category and 
						subcategory for that user.
	* @param			category - The	category of	the	post.
	* @param			subcategory - The subcategory of the post.
	This method is used in biPspbCreatePost LWC.
	*/
  @AuraEnabled
  public static void insertFeedItem(String category, String subcategory) {
    BI_PSP_FeedItem__c newFeedItem;
    try {
      if (String.isBlank(category) || String.isBlank(subcategory)) {
        // Throwing exception when post is not found.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileCreatingPost,
          BI_PSPB_FeedItemCtrl.class.toString(),
          null
        );
      }
        // Getting account Id for the user.
   /**     List<Account> accountRecords = BI_PSP_CurrentUser.returnTheAccounts();
      String accountId = (accountRecords.isEmpty()) ? null : accountRecords[0].Id;
        if (String.isBlank(accountId)) {   
          // Throwing exception when account is not found.
          BI_PSP_LogMessagesUtility.exceptionLogMessage(
            BI_PSPB_CommunityConstantCtrl.errorWhileGetAccountId,
            BI_PSPB_FeedItemCtrl.class.toString(),
            null
          );
        }*/
        // Getting enrollee records
        List<CareProgramEnrollee> enrolleeRecords = BI_PSP_CurrentUser.getEnrolleeRecords();
        if (enrolleeRecords.isEmpty()) {
            // Throwing exception when enrollee records are not found
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSPB_CommunityConstantCtrl.errorWhileCreatingPost,
                BI_PSPB_FeedItemCtrl.class.toString(),
                null
            );
            return;
        }
          //Creating new post with the entered category and sub category by the user.
          newFeedItem = new BI_PSP_FeedItem__c(
            BI_PSP_Phrase__c = subcategory,
            BI_PSP_Category__c = category,
           	BI_PSP_CareProgramEnrollee__c = enrolleeRecords[0].Id
          );
          BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
            new List<BI_PSP_FeedItem__c>{ newFeedItem },
            BI_PSPB_FeedItemCtrl.class.toString(),
            true
          );
        
    } catch (System.DmlException ex) {
      BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSPB_CommunityConstantCtrl.errorWhileCreatingPost,
        BI_PSPB_FeedItemCtrl.class.toString(),
        ex
      );
    }
  }
  /**
	* @description	Used to get all posts that are created by the logged 
					in user to display in mypost.
	* @return		List<BI_PSP_FeedItem__c> - List of posts that are created 
					by the logged in user.
					The list is returned to biPspbMyPost LWC.
	*/
  @AuraEnabled(cacheable=true)
  public static List<BI_PSP_FeedItem__c> fetchMyPost() {
    List<BI_PSP_FeedItem__c> filteredResults;
    try {
      // Getting the CareProgramEnrollee ID associated with the user ID.
      String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
          if (String.isBlank(cpeId)) {
        // Throwing error when account not found.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
          BI_PSPB_FeedItemCtrl.class.toString(),
          null
        );
      }
      /** List of posts that are created by the logged in user
      with reactions and comments.*/
      List<BI_PSP_FeedItem__c> myPostRecords = [
        SELECT
          Id,
          BI_PSP_Category__c,
          BI_PSP_Phrase__c,
          BI_PSP_SoftDelete__c,
          OwnerId,
          CreatedDate,
          (
            SELECT Id, BI_PSP_Comment__c, BI_PSP_CommentDelete__c
            FROM BI_PSP_FeedComment__r
            WHERE BI_PSP_CommentDelete__c != :BI_PSPB_CommunityConstantCtrl.softDelete
          ),
          (
            SELECT Id, BI_PSP_ReactionResult__c
            FROM BI_PSP_EmojiReactionController__r
          )
        FROM BI_PSP_FeedItem__c
        WHERE BI_PSP_CareProgramEnrollee__c = :cpeId
        ORDER BY CreatedDate DESC
      ];
      filteredResults = new List<BI_PSP_FeedItem__c>();
      for (BI_PSP_FeedItem__c item : myPostRecords) {
        if (item.BI_PSP_SoftDelete__c != BI_PSPB_CommunityConstantCtrl.softDelete) {
          filteredResults.add(item);
        }
      }
    } catch (Exception ex) {
      BI_PSP_LogMessagesUtility.exceptionLogMessage(
        BI_PSPB_CommunityConstantCtrl.errorWhileFetchingPost,
        BI_PSPB_FeedItemCtrl.class.toString(),
        ex
      );
    }
    /** Here 'filteredResults' is not checked for null exception as 
				it is handled in LWC.
				There are two different scenario such as it takes an action when 
				it is returned as null and another action when it is returned with values.
		*/
    return filteredResults;
  }
  /**		
	* @description	Used to fetch all posts from database.Fetch and display 
					allposts and also display if the poster is 
					already being Followed by the current user.
	* @return		List<BI_PSP_FeedItem__c> List of posts	that are to	
					be	displayed in All post page.
					List is returned to biPspbAllPost LWC.
	*/
  @AuraEnabled(cacheable=true)
  public static List<BI_PSP_FeedItem__c> getAllPost() {
    List<BI_PSP_FeedItem__c> filteredResults = new List<BI_PSP_FeedItem__c>();
    try {
      // Getting the CareProgramEnrollee ID associated with the user ID.
      String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
            if (String.isBlank(cpeId)) {
        // Throwing error when account not found.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
          BI_PSPB_FeedItemCtrl.class.toString(),
          null
        );
      }
      // List of all posts with comments and reactions.
      List<BI_PSP_FeedItem__c> allPostRecords = [
        SELECT
          Id,
          BI_PSP_Category__c,
          BI_PSP_Phrase__c,
          BI_PSP_FollowStatus__c,
          BI_PSP_SoftDelete__c,
          BI_PSP_CareProgramEnrollee__c,
          CreatedById,
          CreatedDate,
          	BI_PSP_CareProgramEnrollee__r.BI_PSP_AvatarUrl__c,
          	BI_PSP_CareProgramEnrollee__r.BI_PSP_CommunityUsername__c,
          (
            SELECT Id, BI_PSP_Comment__c, BI_PSP_CommentDelete__c
            FROM BI_PSP_FeedComment__r
            WHERE BI_PSP_CommentDelete__c != :BI_PSPB_CommunityConstantCtrl.softDelete
          ),
          (
            SELECT Id, BI_PSP_ReactionResult__c
            FROM BI_PSP_EmojiReactionController__r
          )
        FROM BI_PSP_FeedItem__c
        WHERE BI_PSP_CareProgramEnrollee__c != NULL
        ORDER BY CreatedDate DESC
      ];
      //Fetching follow status.
      List<BI_PSP_FeedFollow__c> currentUserFollowing = [
        SELECT Id, BI_PSP_CareProgramEnrolleeFollow__c
        FROM BI_PSP_FeedFollow__c
        WHERE 	BI_PSP_CareProgramEnrolleeAccount__c = :cpeId AND BI_PSP_Type__c = :BI_PSPB_CommunityConstantCtrl.following
      ];
      Set<Id> followingUserIds = new Set<Id>();
      for (BI_PSP_FeedFollow__c followRecord : currentUserFollowing) {
        followingUserIds.add(followRecord.BI_PSP_CareProgramEnrolleeFollow__c);
      }
      for (BI_PSP_FeedItem__c item : allPostRecords) {
        if (
          item.BI_PSP_SoftDelete__c != BI_PSPB_CommunityConstantCtrl.softDelete &&
          item.BI_PSP_Category__c != null &&
          item.BI_PSP_Phrase__c != null
        ) {
          //	Check if the creator of	the	post is	being followed.
          if (followingUserIds.contains(item.BI_PSP_CareProgramEnrollee__c)) {
            item.BI_PSP_FollowStatus__c = BI_PSPB_CommunityConstantCtrl.following;
          } else {
            item.BI_PSP_FollowStatus__c = BI_PSPB_CommunityConstantCtrl.follow;
          }
          filteredResults.add(item);
        }
      }
    } catch (Exception ex) {
      BI_PSP_LogMessagesUtility.exceptionLogMessage(
        BI_PSPB_CommunityConstantCtrl.errorWhileFetchingPost,
        BI_PSPB_FeedItemCtrl.class.toString(),
        ex
      );
    }
    /** Here 'filteredResults' is not checked for null exception as 
			it is handled in LWC.
			There are two different scenario such as it takes an action when 
			it is returned as null and another action when it is returned with values.
		*/
    return filteredResults;
  }
}