public with sharing class AccountControllerLwc {
    
    @AuraEnabled(cacheable=true)
    public static list<Account> filterAccountByType(String type){

        return [Select Id, Name, Type From Account Where Type=:type];

    }
    @AuraEnabled(cacheable=true)
    public static list<Account> getAccounts(){

        return [Select Id, Name From Account limit 10];
    }
    @AuraEnabled(cacheable=true)
    public static list<Account> findAccounts(String searchKey){
        String key = searchKey+'%';
        //String key = '%'+searchKey+'%';
        return [SELECT Id, Name, Type, Industry FROM Account WHERE Name LIKE :key];
    }
}