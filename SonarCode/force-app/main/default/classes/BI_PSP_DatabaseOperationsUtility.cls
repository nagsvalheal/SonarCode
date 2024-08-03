/*
 * @description       : A BI_PSPB_HandleUtitlites Class for determining Capturing console messages while performing dmls .
 * History:
 * Version  Author      Date            Detail          Description
 * 1.0      Abinsha     10-Jul-2024     Created         Initial development.
 * 1.1      Ashif       16-Jul-2024     Updated         Updated for Dml Capturing.
 */
public inherited sharing class BI_PSP_DatabaseOperationsUtility {
 private static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues('PSPB');
    public static string applicationName = settings != null ? settings.BI_SFCOE_LOG_Application__c : '';
    public static Database.SaveResult[] insertResults;
    public static Database.SaveResult[] updateResults;
    public static Database.SaveResult[] upsertResults;
    /**  
    * Helper method to perform insert and handle DML errors.
    * @param records List of SObjects to insert.
    * @param className Name of the class invoking the insert.
    * @return List of Ids of successfully inserted records.
    * @throws DmlException If any errors occur during insert.
*/
   public static List<Id> insertAndHandleErrors(List<SObject> records, String className, Boolean userModeLevel) {
    List<Id> insertedIds = new List<Id>();
    try {
        Database.SaveResult[] insertResults;
        
        if (userModeLevel) {
            insertResults = Database.insert(records, false, AccessLevel.USER_MODE);
        } else {
            insertResults = Database.insert(records, false);
        }
        
        for (Database.SaveResult sr : insertResults) {
            if (sr.isSuccess()) {
                insertedIds.add(sr.getId());
            } else {
                // Handle the error here if required
                String errorMsg = '';
                for (Database.Error err : sr.getErrors()) {
                    errorMsg += err.getMessage() + ' ';
                }
                System.debug('Error message: ' + errorMsg);
                throw new AuraHandledException('Unable to insert records in class ' + className + ': ' + errorMsg);
            }
        }
        
        return insertedIds;
    } catch (DmlException e) {
        // Handle DML exceptions
        String errorMsg = 'DML Exception occurred in class ' + className + ': ' + e.getMessage();
        System.debug(errorMsg);
        throw new AuraHandledException(errorMsg);
    } catch (Exception e) {
        // Handle other unexpected exceptions
        String errorMsg = 'Unexpected exception occurred in class ' + className + ': ' + e.getMessage();
        System.debug(errorMsg);
        throw new AuraHandledException(errorMsg);
    }
}

    
    /**
* Helper method to perform delete and handle DML errors.
* @param records List of SObjects to delete.
* @param className Name of the class invoking the delete.
* @return List of Ids of successfully deleteded records.
* @throws DmlException If any errors occur during delete.
*/
    public static List<Id> deleteHandleErrors(List<SObject> records,String className) {
        
        Database.DeleteResult[] deleteResults = Database.delete(records, false);
        List<Id> deletedIds = new List<Id>();
        
        for (Database.DeleteResult sr : deleteResults) {
            if (sr.isSuccess()) {
                deletedIds.add(sr.getId());
            } else {
                return null;
            }
        }
        
        return deletedIds;
    }
    /**
* Helper method to perform update and handle DML errors.
* @param records List of SObjects to update.
* @param className Name of the class invoking the update.
* @return List of Ids of successfully updated records.
* @throws DmlException If any errors occur during update.
*/
    public static List<Id> updateAndHandleErrors(List<SObject> records, String className,Boolean userModeLevel) {
        if (records == null || records.isEmpty()) {
            throw new DmlException('No records to update');
        }
         if(userModeLevel ==true)
        {
            updateResults = Database.update(records, false,AccessLevel.USER_MODE);
        }
        if(userModeLevel ==false)
        {
            updateResults = Database.update(records, false);
        }
        List<Id> updatedIds = new List<Id>();
        
        for (Database.SaveResult sr : updateResults) {
            if (sr.isSuccess()) { 
                updatedIds.add(sr.getId());
            } else {
               return null;
            }
        }   
        return updatedIds;
    }
    
    
   public static List<Id> upsertRecords(List<SObject> records, String className, Boolean userModeLevel) {
    if (records == null || records.isEmpty()) {
        throw new DmlException('No records to update');
    }
    
    List<Database.UpsertResult> upsertResults;
    if (userModeLevel) {
        upsertResults = Database.upsert(records, true, AccessLevel.USER_MODE);
    } else {
        upsertResults = Database.upsert(records, true);
    }
    
    List<Id> updatedIds = new List<Id>();
    for (Database.UpsertResult ur : upsertResults) {
        if (ur.isSuccess()) {
            updatedIds.add(ur.getId());
        } else {
            // Handle errors if necessary
            return null;
        }
    }
    return updatedIds;
}

 public static Database.SaveResult[] insertOperation(List<SObject> records, String className, Boolean userModeLevel) {
       
     try{
        if (userModeLevel) {
            insertResults = Database.insert(records, true, AccessLevel.USER_MODE);
        } else {
            insertResults = Database.insert(records, true);
        }
       
     }
     catch(DMLException ex)
     {
         throw new DMLException('Unable to Insert : ' +ex.getMessage());
     }
        return insertResults;
    }
    
  public static Database.SaveResult[] updateOperation(List<SObject> records, String className, Boolean userModeLevel) {
       
     try{
        if (userModeLevel) {
            insertResults = Database.Update(records, true, AccessLevel.USER_MODE);
        } else {
            insertResults = Database.Update(records, true);
        }
       
     }
     catch(DMLException ex)
     {
         throw new DMLException('Unable to Update : ' +ex.getMessage());
     }
        return insertResults;
    }
  
}