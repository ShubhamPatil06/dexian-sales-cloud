public with sharing class MapsAccountController {
    @AuraEnabled(cacheable=true)
    public static list<Account> getAccounts(){

        return [Select Id, Name, Description, BillingStreet, BillingCity, BillingPostalCode,
                BillingState, BillingCountry FROM Account ORDER BY Name LIMIT 10];
    }
}