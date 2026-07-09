public with sharing class InterviewTriggerHandler {

    public static void handle(System.TriggerOperation operationType, 
                              list<Interview__c> newList, 
                              list<Interview__c> oldList){
        switch on operationType{
	
	        WHEN AFTER_INSERT{
                Set<Id> submissionIds = getSubmissionIds(newList);
		        InterviewService.recalculateInterviewCount(submissionIds);
		    }
		    WHEN AFTER_DELETE{
                Set<Id> submissionIds = getSubmissionIds(oldList);
		        InterviewService.recalculateInterviewCount(submissionIds);
		    }
		    WHEN AFTER_UNDELETE{
                Set<Id> submissionIds = getSubmissionIds(newList);
		        InterviewService.recalculateInterviewCount(submissionIds);
		    }
	    }
    }

    private static set<Id> getSubmissionIds(list<Interview__c> interviews){
        
        Set<Id> ids = new Set<Id>();
        if(interviews == null || interviews.isEmpty()){
            return ids;
        }
        for(Interview__c i: interviews){
            if(i.Candidate_Submission__c != null){
                ids.add(i.Candidate_Submission__c);
            }   
        }
        return ids;
    }
}