public with sharing class InterviewService {

    public static void recalculateInterviewCount(set<Id> submissionIds){

        if(submissionIds == null || submissionIds.isEmpty()){
            return;
        }

        list<AggregateResult> results =[SELECT Candidate_submission__c submissionId,
                                        count(Id) interviewCount
                                        FROM Interview__c
                                        WHERE Candidate_submission__c IN:submissionIds
                                        GROUP BY Candidate_submission__c];
        
        Map<Id,Integer> countBySubmission= new Map<id,Integer>();

        for(AggregateResult ar: results){
            Id sId = (Id) ar.get('submissionId');
            Integer count = (Integer) ar.get('interviewCount');
            countBySubmission.put(sId, count);
        }

        list<Candidate_Submission__c> listToUpdate= new list<Candidate_Submission__c>();
        
        for(Id sId:submissionIds){
            Integer count = countBySubmission.containsKey(sId) ?
                            countBySubmission.get(sId) :
                            0;
            // Candidate_Submission__c sub = new Candidate_Submission__c();
            // sub.Id = sId;
            // sub.Interview_Count__c = count;
            // listToUpdate.add(sub);
            listToUpdate.add(new Candidate_Submission__c(
                Id = sId,
                Interview_Count__c = count
            ));
        }

        if(!listToUpdate.isEmpty()){
            update listToUpdate;
        }
    }
}