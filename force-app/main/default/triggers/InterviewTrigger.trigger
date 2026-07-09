trigger InterviewTrigger on Interview__c (after insert, after delete, after undelete) {
    
    InterviewTriggerHandler.handle(trigger.operationType, trigger.new, trigger.old);
    
}