public with sharing class JobOrderTriggerHandler {
    
    public static void handle(System.TriggerOperation operationType,
                                      list<Job_Order__c> newList,
                                      list<Job_Order__c> oldList,
                                      map<Id,Job_Order__c> newMap,
                                      map<Id,Job_Order__c> oldMap
                                      ){
        switch on operationType(){
            WHEN AFTER_INSERT{
                // New Job Orders — collect their Client IDs
                Set<Id> clientIds = getClientIdsFromNew(newList);
                JobOrderService.recalculateActiveJobOrders(clientIds);
            }
            WHEN AFTER_UPDATE{
                // Status may have changed — collect BOTH old and new Client IDs
                // This handles reassignment of a Job Order from Client A to Client B:
                //   Trigger.new has Client B's ID
                //   Trigger.old has Client A's ID
                // Both clients need recalculation
                Set<Id> clientIds = getClientIdsFromBoth(newList, oldList);
                JobOrderService.recalculateActiveJobOrders(clientIds);

            }
            WHEN AFTER_DELETE{
                // Deleted records are in oldList — Trigger.new is null on delete
                Set<Id> clientIds = getClientIdsFromOld(oldList);
                JobOrderService.recalculateActiveJobOrders(clientIds);

            }
            WHEN AFTER_UNDELETE{
                // Restored records come back in Trigger.new
                Set<Id> clientIds = getClientIdsFromNew(newList);
                JobOrderService.recalculateActiveJobOrders(clientIds);
            }
        }
        
    }
    // ── Private helpers — ID collection only, zero logic ──────────────

    private static Set<Id> getClientIdsFromNew(List<Job_Order__c> newList) {
        Set<Id> ids = new Set<Id>();
        if (newList == null) return ids;
        for (Job_Order__c jo : newList) {
            if (jo.Client__c != null){
                ids.add(jo.Client__c);
            } 
        }
        return ids;
    }

    private static Set<Id> getClientIdsFromOld(List<Job_Order__c> oldList) {
        Set<Id> ids = new Set<Id>();
        if (oldList == null) return ids;
        for (Job_Order__c jo : oldList) {
            if (jo.Client__c != null) {
                ids.add(jo.Client__c);
            }
        }
        return ids;
    }

    private static Set<Id> getClientIdsFromBoth(List<Job_Order__c> newList,
                                                List<Job_Order__c> oldList) {
        Set<Id> ids = new Set<Id>();
        ids.addAll(getClientIdsFromNew(newList));
        ids.addAll(getClientIdsFromOld(oldList));
        return ids;
    }
}