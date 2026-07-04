trigger JobOrderTrigger on Job_Order__c (after insert, after update, after delete, after undelete) {

    JobOrderTriggerHandler.handle(trigger.operationType,
                                         trigger.new,
                                         trigger.old,
                                         trigger.oldMap,
                                         trigger.newMap);

}