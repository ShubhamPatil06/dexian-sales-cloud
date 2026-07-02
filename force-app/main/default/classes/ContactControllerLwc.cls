public with sharing class ContactControllerLwc {
    
    @AuraEnabled(cacheable = true)
    public static list<Contact> getContactList(){

        return [Select Id, Title, Name, Email, Level__c From Contact];
    }

    @AuraEnabled(cacheable = true)
    public static list<Contact> getContacts(){

        return [Select Id, Title, Name, Department, Email, Phone, GenderIdentity, LeadSource From Contact LIMIT 15];
    }
    
}