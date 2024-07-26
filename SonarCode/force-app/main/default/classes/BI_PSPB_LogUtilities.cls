/*
* @description       : 	The BI_PSPB_LogUtilities class provides a utility method for logging error
						messages consistently throughout the Salesforce application. It leverages 
						the existing BI_SFCOE_LOG_Util class to perform the actual logging.
* History:
* Version  Author      Date            Detail          Description
* 1.0      Abinsha     10-Jul-2024     Created         Initial development.
 */
public class BI_PSPB_LogUtilities {
    /**
* @description : The logError method logs an error message with a consistent format,
				including application name, class name, timestamp, and severity level,
using the BI_SFCOE_LOG_Util utility class.
* @param errorMessage (String): The error message that needs to be logged.
								This message provides details about the error that occurred..
* @return: This method does not return any value.
*/
       //varibale that holds the application name retrieved from Custom Settings.
    private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues(
        'PSPB'
    );
    //A variable That holds the name of our application to be used in catch exception handler.
    private static string applicationName = settings != null
        ? settings.BI_SFCOE_LOG_Application__c
        : '';
    
    
      public static void logError(String errorMessage ,String className) {
        BI_SFCOE_LOG_Util.logMessage(
           applicationName,
            className,
            '',
            System.now(),
            errorMessage,
            BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR
        );
    }
	 
      // use this method in the catch exception.
      public static void exceptionLogMessage(String errorMessage, String className,Exception typeName) {
       BI_SFCOE_LOG_Util.handleException(
            typeName,
             applicationName,
            className,
            null,
            System.now()
        );
          if(errorMessage !='')
          {
              throw new AuraHandledException(errorMessage);
          }
        
    }
    //use this
     public static void catchSystemException(String errorMessage, String className,System.DmlException typeName) {
       BI_SFCOE_LOG_Util.handleException(
            typeName,
             applicationName,
            className,
            null,
            System.now()
        );
         //If you dont want to throw error message please provide the value as '' for errorMessage variable.
        if(errorMessage !='' )
        {
            throw new System.DmlException(errorMessage + typeName.getMessage());
        }
        
    }

}