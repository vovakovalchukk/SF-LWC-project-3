public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
    
        return [
            SELECT Name
            FROM Contact
            WITH SECURITY_ENFORCED
            LIMIT 50
        ];
    }
}
