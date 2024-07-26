/**
 * @description         This class is used for reacting to a post,
 *                     fetching reactions for a post, deleting reactions, and
 *                     fetching accounts that have reacted with particular reactions.
 * History:
 * Version  Author      Date            Detail          Description
 * 1.0      Deepa       05-Dec-2023     Created         Initial development.
 * 1.1      Deepa       01-Jan-2024     Updated         Updated for caregiver.
 * 1.2      Deepa       04-Apr-2024     Updated         Catch log added.
 * 1.3      Deepa       22-Apr-2024     Updated         Code Review.
 * 1.4      Deepa       27-Apr-2024     Updated         Indentation.
 */

public with sharing class BI_PSPB_EmojiReactionCtrl {
  /**
   * @description    Used to save a reaction for a particular post.
   * @param          reactions - The Reaction that is to be saved.
   * @param          feedItemId - The Id of the post for which the
   *                 Reaction is being saved.
   * @return         BI_PSP_EmojiReactionController__c - The saved Emoji
   *                 Reaction record.
   *                 Returns saved record to biPspbMyPost and biPspbAllPost LWC.
   */
  @AuraEnabled
  public static BI_PSP_EmojiReactionController__c saveEmoji(
    String reactions,
    String feedItemId
  ) {
    BI_PSP_EmojiReactionController__c newReactions;
    try {
      //checking reactions and  feedItemId is not null.
      if (String.isBlank(feedItemId) || String.isBlank(reactions)) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileReacting,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
      // Get account Id for the user.
      List<Account> accountRecords = BI_PSP_CurrentUser.returnTheAccounts();
      String accountId = (accountRecords.isEmpty()) ? null : accountRecords[0].Id;
      // Check if accountId is not blank
      if (String.isBlank(accountId)) {
        // Throwing exception when account not found.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
      // Query if existing reactions there for the given feed item and account.
      List<BI_PSP_EmojiReactionController__c> existingReactions = [
        SELECT Id, BI_PSP_ReactionResult__c
        FROM BI_PSP_EmojiReactionController__c
        WHERE
          BI_PSP_FeedItem__c = :feedItemId
          AND BI_PSP_AccountE__c = :accountId
        WITH USER_MODE
        LIMIT 1
      ];
      // Check if existing reactions are found.
      if (!existingReactions.isEmpty()) {
        // Update the existing reaction record.
        existingReactions[0].BI_PSP_ReactionResult__c = reactions;
        // update the  records into the database.
        BI_PSP_DatabaseOperationsUtility.updateAndHandleErrors(
          new List<BI_PSP_EmojiReactionController__c>{ existingReactions[0] },
          BI_PSPB_EmojiReactionCtrl.class.toString(),true
        );

        //return the updated value.
        return existingReactions[0];
      } else {
        // Create a new reaction record.
        newReactions = new BI_PSP_EmojiReactionController__c(
          BI_PSP_ReactionResult__c = reactions,
          BI_PSP_FeedItem__c = feedItemId,
          BI_PSP_AccountE__c = accountId
        );
        // Insert the new reaction record.
        BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
          new List<BI_PSP_EmojiReactionController__c>{ newReactions },
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          true
        );
        /** Here 'newReactions' is not checked for null exception as
        it is handled in LWC.		*/
      }
    } catch (System.DmlException ex) {
      // Catch any other exceptions that might occur during the process.
      // Log the exception and throw a general error exception.
      BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSPB_CommunityConstantCtrl.errorWhileReacting,
        BI_PSPB_EmojiReactionCtrl.class.toString(),
        ex
      );
    }
    return newReactions;
  }
  /**
   * @description    Used to check if the reaction for the post is saved or not.
   * @param          feedItemId - The Id of the post for which the
   *                 Reaction is being saved.
   * @return         String - A string representing the reactions for
   *                 the specified post.
   *                 Returns to biPspbMyPost and biPspbAllPost LWC.
   */

  @AuraEnabled(cacheable=true)
  public static String getReactionsByFeedItemId(String feedItemId) {
    List<BI_PSP_EmojiReactionController__c> reactions;
    try {
      // Check  feedItemId  for not null.
      if (String.isBlank(feedItemId)) {
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetReactions,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
      // Getting the CareProgramEnrollee ID associated with the user ID.
      String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
      if (String.isBlank(cpeId)) {
        // Throw an exception if account ID retrieval fails.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
      // Query EmojiReactions for the specific feed item and user's account.
      reactions = [
        SELECT Id, BI_PSP_ReactionResult__c, BI_PSP_CareProgramEnrolleeEmoji__c
        FROM BI_PSP_EmojiReactionController__c
        WHERE
          BI_PSP_FeedItem__c = :feedItemId
          AND BI_PSP_CareProgramEnrolleeEmoji__c = :cpeId
        LIMIT 1
      ];

      // Check if any reactions were found.
      if (!reactions.isEmpty()) {
        // Returning reactions when record is found.
        return reactions[0].BI_PSP_ReactionResult__c;
      } else {
        // Return a placeholder value  if no reactions are found.
        return BI_PSPB_CommunityConstantCtrl.noReaction;
      }
    } catch (Exception ex) {
      // Catch any other exceptions that might occur during the process.
      // Log the exception and throw a general error exception.
      BI_PSP_LogMessagesUtility.exceptionLogMessage(
        BI_PSPB_CommunityConstantCtrl.errorWhileGetReactions,
        BI_PSPB_EmojiReactionCtrl.class.toString(),
        ex
      );
      return null; //Null value checking done in lwc
    }
  }
  /**
   * @description    This is the method to delete the reaction for a post.
   * @param          feedItemId - The Id of the post from which the emoji
   *                 reaction is being deleted.
   * This method is used in biPspbAllPost and biPspbMyPost LWC.
   */

  @AuraEnabled
  public static void deleteEmojiReaction(String feedItemId) {
    try {
      // Check for valid feedItemId
      if (String.isBlank(feedItemId)) {
        // Throw a generic exception if feedItemId  is blank.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileUnreacting,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
      // Getting the CareProgramEnrollee ID associated with the user ID.
      String cpeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].Id;
      if (String.isBlank(cpeId)) {
        // Throw an exception if account ID retrieval fails.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
      // Query EmojiReactions for the specific feed item and user's account
      List<BI_PSP_EmojiReactionController__c> reactions = [
        SELECT Id, BI_PSP_ReactionResult__c, CreatedById, BI_PSP_CareProgramEnrolleeEmoji__c
        FROM BI_PSP_EmojiReactionController__c
        WHERE
          BI_PSP_FeedItem__c = :feedItemId
          AND BI_PSP_CareProgramEnrolleeEmoji__c = :cpeId
        WITH USER_MODE
        LIMIT 1
      ];
      if (reactions.isEmpty()) {
        // Throw an exception if no reactions are found to delete.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetReactions,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
      // Delete the reactions.
      BI_PSP_DatabaseOperationsUtility.deleteHandleErrors(
        new List<BI_PSP_EmojiReactionController__c>{ reactions[0] },
        BI_PSPB_EmojiReactionCtrl.class.toString()
      );
    } catch (System.DmlException ex) {
      // Catch any other exceptions that might occur during the process.
      // Log the exception and throw a general error exception.
      BI_PSP_LogMessagesUtility.catchSystemException(
        BI_PSPB_CommunityConstantCtrl.errorWhileUnreacting,
        BI_PSPB_EmojiReactionCtrl.class.toString(),
        ex
      );
    }
  }

    /**
	@description 	To count the total number of thinking face reactions 
					for a particular post.
	@param 			feedItemId - The Id of the feed item for which 
					thinking face reactions are counted.
	@return 		List<BI_PSP_EmojiReactionController__c> - A list of
					thinking face reactions.
					Returns to biPspbMyPost and biPspbAllPost LWC.
	*/
  @AuraEnabled
  public static List<BI_PSP_EmojiReactionController__c> totalReactionsByType(
    String feedItemId , string reactionType
  ) {
    List<BI_PSP_EmojiReactionController__c> totalReactionsRecords;
    try {
      if (String.isNotBlank(feedItemId)) {
        // Query to count total thinking face reactions for a post.
        totalReactionsRecords = [
          SELECT
            Id,
            BI_PSP_ReactionResult__c,
            CreatedById,
            BI_PSP_CareProgramEnrolleeEmoji__c,
            BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_CommunityUsername__c,
            BI_PSP_CareProgramEnrolleeEmoji__r.BI_PSP_AvatarUrl__c
          FROM BI_PSP_EmojiReactionController__c
          WHERE
            BI_PSP_FeedItem__c = :feedItemId
            AND BI_PSP_ReactionResult__c = :reactionType
            AND BI_PSP_CareProgramEnrolleeEmoji__c != NULL
          ORDER BY CreatedDate DESC
        ];
      } else {
        // Throw an exception if feedItemId ID is null.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
    } catch (Exception ex) {
      // Catch any other exceptions that might occur during the process.
      // Log the exception and throw a general error exception.
      BI_PSP_LogMessagesUtility.exceptionLogMessage(
        BI_PSPB_CommunityConstantCtrl.errorWhileGetReactions,
        BI_PSPB_EmojiReactionCtrl.class.toString(),
        ex
      );
    }
    /** Here 'totalReactionsRecords' is not checked for null exception as 
			it is handled in LWC.
			There are two different scenario such as it takes an action when 
			it is returned as null and another action when it is returned with values.
		*/
    return totalReactionsRecords;
  }
  /**
	@description 	Used to check if the user reacting to the post
					is following the posted user.
	@param 			loggedAccountId - The Id of the logged-in user's account.
	@param 			otherAccountId - The Id of the account being checked for 
					follow status.
	@return 		List<BI_PSP_FeedFollow__c> - A list of feed follow records.
					Returns to biPspbMyPost and biPspbAllPost LWC.
	*/
  @AuraEnabled
  public static List<BI_PSP_FeedFollow__c> checkFollowingStatus(
    String loggedAccountId,
    String otherAccountId
  ) {
    List<BI_PSP_FeedFollow__c> feedFollowRecords;
    try {
      //check loggedAccountId and otherAccountId is not null.
      if (
        String.isBlank(loggedAccountId) || String.isBlank(otherAccountId)
      ) {
        // Throw an exception if loggedAccountId and otherAccountId is null.
        BI_PSP_LogMessagesUtility.exceptionLogMessage(
          BI_PSPB_CommunityConstantCtrl.errorWhileGetEnrolleeId,
          BI_PSPB_EmojiReactionCtrl.class.toString(),
          null
        );
      }
        // Query to check if the reacted user is following the posted user.
        feedFollowRecords = [
          SELECT Id, BI_PSP_Account__c, BI_PSP_AccountUser__c, BI_PSP_Type__c
          FROM BI_PSP_FeedFollow__c
          WHERE
          BI_PSP_CareProgramEnrolleeAccount__c = :loggedAccountId
            AND BI_PSP_CareProgramEnrolleeFollow__c = :otherAccountId
            AND BI_PSP_Type__c = :BI_PSPB_CommunityConstantCtrl.following
          WITH USER_MODE
          LIMIT 1
        ];
      
    } catch (Exception ex) {
      // Catch any other exceptions that might occur during the process.
      // Log the exception and throw a general error exception.
      BI_PSP_LogMessagesUtility.exceptionLogMessage(
        BI_PSPB_CommunityConstantCtrl.errorWhileGetFollowStatus,
        BI_PSPB_EmojiReactionCtrl.class.toString(),
        ex
      );
    }
    /** Here 'feedFollowRecords' is not checked for null exception as 
			it is handled in LWC.
			There are two different scenario such as it takes an action when 
			it is returned as null and another action when it is returned with values.
		*/
    return feedFollowRecords;
  }
}