public class PincodeParser {
    
    public String Message;
    public String Status;
    public list<PostOfficeDetails> PostOffice;
    
    public class PostOfficeDetails {
        @AuraEnabled public String Name{get;set;}
        @AuraEnabled public String BranchType{get;set;}
        @AuraEnabled public String Circle{get;set;}
        @AuraEnabled public String  Division{get;set;}
        @AuraEnabled public String District{get;set;}
        @AuraEnabled public String State{get;set;}
        @AuraEnabled public String Country{get;set;}
        @AuraEnabled public String Pincode{get;set;}
    }

}