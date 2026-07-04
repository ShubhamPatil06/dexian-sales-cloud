public with sharing class JobOrderService {

    public static void recalculateActiveJobOrders(set<Id> clientIds){
        if(clientIds == null || clientIds.isEmpty()){
            return;
        }

        list<AggregateResult> results = [
            Select Client__c clientId, count(Id) total
            FROM Job_Order__c
            WHERE Client__c IN:clientIds
            AND Status__c = 'Active'
            GROUP BY Client__c
        ];

        Map<Id, Integer> countByClient = new Map<Id, Integer>();
        for (AggregateResult ar : results) {
            Id      cId   = (Id) ar.get('clientId');
            Integer count = (Integer) ar.get('total');
            countByClient.put(cId, count);
        }

        List<Client__c> toUpdate = new List<Client__c>();
        for (Id cId : clientIds) {
            Integer count = countByClient.containsKey(cId)
                            ? countByClient.get(cId)
                            : 0;

            toUpdate.add(new Client__c(
                Id                   = cId,
                Active_Job_Orders__c = count
            ));
        }
        if (!toUpdate.isEmpty()) {
            Database.update(toUpdate,false);
        }
    }
}