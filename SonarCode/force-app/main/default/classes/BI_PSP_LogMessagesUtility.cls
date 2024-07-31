/*
* @description       : The BI_PSPB_LogUtilities class provides a utility method for logging error
                        messages consistently throughout the Salesforce application. It leverages 
                        the existing BI_SFCOE_LOG_Util class to perform the actual logging.
* History:
* Version  Author      Date            Detail          Description
* 1.0      Abinsha     10-Jul-2024     Created         Initial development.
 */
public inherited sharing class BI_PSP_LogMessagesUtility {
   /**
     * @description : The logError method logs an error message with a consistent format,
     *                including application name, class name, timestamp, and severity level,
     *                using the BI_SFCOE_LOG_Util utility class.
     * @param errorMessage (String): The error message that needs to be logged.
     *                              This message provides details about the error that occurred.
     * @param className (String): The name of the class where the error occurred.
     * @param throwException (Boolean): If true, an AuraHandledException will be thrown with the error message.
     * @return: This method does not return any value.
     */

    public static void logError(String errorMessage, String className, Boolean throwException,String severityType) {
        String currentUserName = UserInfo.getName();
        String formattedMessage = 'Error for user ' + currentUserName + ': ' + errorMessage;

        BI_SFCOE_LOG_Util.logMessage(
            BI_PSP_QuestionnaireConstant.applicationName,
            className,
            '',
            System.now(),
            formattedMessage,
            severityType
        );

        if (throwException) {
            throw new AuraHandledException(formattedMessage);
        }
    }

    /**
     * @description : The exceptionLogMessage method logs an exception with details about the error,
     *                including the application name, class name, and timestamp. It uses the 
     *                BI_SFCOE_LOG_Util utility class for logging.
     * @param errorMessage (String): The error message to log.
     * @param className (String): The name of the class where the error occurred.
     * @param typeName (Exception): The exception that was caught.
     * @return: This method does not return any value.
     */
    public static void exceptionLogMessage(String errorMessage, String className, Exception typeName) {
        String currentUserName = UserInfo.getName();
        String formattedMessage = 'Exception for user ' + currentUserName + ': ' + errorMessage;

        BI_SFCOE_LOG_Util.handleException(
            typeName,
            BI_PSP_QuestionnaireConstant.applicationName,
            className,
            null,
            System.now()
        );

        if (!String.isBlank(errorMessage)) {
            throw new AuraHandledException(formattedMessage+ typeName.getMessage());
        }
    }

    /**
     * @description : The catchSystemException method handles DML exceptions specifically,
     *                logs them, and optionally throws a System.DmlException with additional details.
     * @param errorMessage (String): The error message to log.
     * @param className (String): The name of the class where the error occurred.
     * @param typeName (System.DmlException): The DML exception that was caught.
     * @return: This method does not return any value.
     */
    public static void catchSystemException(String errorMessage, String className, System.DmlException typeName) {
        String currentUserName = UserInfo.getName();
        String formattedMessage = 'System.DmlException for user ' + currentUserName + ': ' + errorMessage;

        BI_SFCOE_LOG_Util.handleException(
            typeName,
            BI_PSP_QuestionnaireConstant.applicationName,
            className,
            null,
            System.now()
        );

        // If you don't want to throw an error message, please provide an empty string for the errorMessage variable.
        if (!String.isBlank(errorMessage)) {
            throw new System.DmlException(formattedMessage + typeName.getMessage());
        }
    }
}