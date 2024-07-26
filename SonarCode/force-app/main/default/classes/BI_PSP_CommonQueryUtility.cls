public inherited sharing class BI_PSP_CommonQueryUtility {
  // Method for executing a SOQL query without sharing rules
    public static List<SObject> executeQuery(String sObjectType, String fields, String conditions, Boolean withUserMode) {
        // Start building the SOQL query string
        String query = 'SELECT ' + fields + ' FROM ' + sObjectType;
        
        if (!String.isBlank(conditions)) {
            conditions = escapeSingleQuotes(conditions);
            query += ' WHERE ' + conditions;
        }
        
        // Add the WITH SECURITY_ENFORCED clause to enforce sharing rules
        if (withUserMode) {
            query += ' WITH USER_MODE';
        }
        
        System.debug('Generated Query: ' + query);

        // Execute the query and return the results
        return Database.query(query);
    }
    
    // Method to escape single quotes in the conditions string
    private static String escapeSingleQuotes(String str) {
        return str.replaceAll('\'', '\\\'');
    }
    
     // Method for executing a SOQL query, optionally adding the USER_MODE clause
    public static List<SObject> executeComplexQuery(String queryString, Boolean withUserMode) {
        if (withUserMode) {
            queryString += ' WITH USER_MODE';
        }

        //System.debug('Generated Query: ' + queryString);

        // Execute the query and return the results
        return Database.query(queryString);
    }
    
}