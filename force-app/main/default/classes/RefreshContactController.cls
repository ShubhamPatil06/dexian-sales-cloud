public with sharing class RefreshContactController {
    @AuraEnabled(cacheable=true)
    public static list<Contact> getContactList() {
        return [SELECT Id, FirstName, LastName, Title, Phone, Email FROM Contact LIMIT 20];
    }
}