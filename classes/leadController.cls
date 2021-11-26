public with sharing class leadController {
    
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads() {
    
        return [
            SELECT Name, Title, Phone
            FROM Lead
            WITH SECURITY_ENFORCED
            LIMIT 50
        ];
    }

}
