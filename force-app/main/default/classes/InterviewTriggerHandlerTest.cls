@isTest
private class InterviewTriggerHandlerTest {

    @TestSetup
    static void makeData(){
        Client__c client= new Client__c(
            Client_Name__c   = 'Infosys Technology Ltd',
            Status__c        = 'Active',
            Contract_Type__c = 'Contract (W2)');
        insert client;

        Job_Order__c jobOrder = new Job_Order__c(
            Job_Title__c       = 'Senior Java Developer',
            Client__c          = client.Id,
            Status__c          = 'Active',
            Employment_Type__c = 'Contract'
        );
        insert jobOrder;

        // Two candidates — needed for multi-submission bulk test
        // insert new List<Candidate__c>{
        //     new Candidate__c(
        //         First_Name__c          = 'Rahul',
        //         Last_Name__c           = 'Sharma',
        //         Email__c               = 'rahul.sharma@test.com',
        //         Work_Authorization__c  = 'H1-B'
        //     ),
        //     new Candidate__c(
        //         First_Name__c          = 'Priya',
        //         Last_Name__c           = 'Patel',
        //         Email__c               = 'priya.patel@test.com',
        //         Work_Authorization__c  = 'Green Card'
        //     )
        // };

        /*Create first candidate*/
        Candidate__c candidate1 = new Candidate__c();
        candidate1.First_Name__c = 'Rahul';
        candidate1.Last_Name__c = 'Sharma';
        candidate1.Email__c = 'rahul.sharma@test.com';
        candidate1.Work_Authorization__c = 'H1-B';

        // Create second candidate
        Candidate__c candidate2 = new Candidate__c();
        candidate2.First_Name__c = 'Priya';
        candidate2.Last_Name__c = 'Patel';
        candidate2.Email__c = 'priya.patel@test.com';
        candidate2.Work_Authorization__c = 'Green Card';

        // Add candidates to a list
        List<Candidate__c> candidateList = new List<Candidate__c>();
        candidateList.add(candidate1);
        candidateList.add(candidate2);
        // Insert all candidates
        insert candidateList;

        // Query inserted candidates
        List<Candidate__c> candidates = [SELECT Id FROM Candidate__c];

        // One submission per candidate
        List<Candidate_Submission__c> subs = new List<Candidate_Submission__c>();
        for (Candidate__c cand : candidates) {
            subs.add(new Candidate_Submission__c(
                Candidate__c        = cand.Id,
                Job_Order__c        = jobOrder.Id,
                Status__c           = 'Submitted to Client',
                Submission_Date__c  = Date.today()
            ));
        }
        insert subs;
    }
        
    /*Shared Helpers */
    private static Candidate_Submission__c getSubmission() {
        return [
            SELECT Id, Interview_Count__c
            FROM   Candidate_Submission__c
            LIMIT  1
        ];
    }

    private static List<Candidate_Submission__c> getAllSubmissions() {
        return [SELECT Id, Interview_Count__c FROM Candidate_Submission__c ORDER BY CreatedDate];
    }

    private static Interview__c buildInterview(Id submissionId, Integer round) {
        return new Interview__c(
            Candidate_Submission__c = submissionId,
            Round_Number__c         = round,
            Round_Label__c          = 'Phone Screen',
            Scheduled_Date_Time__c  = DateTime.now().addDays(3),
            Interview_Format__c     = 'Phone',
            Outcome__c              = 'Pending'
        );
    }

    /**Positive Scenarios */
    @isTest
    static void testInsertOneInterview_setsCountToOne(){

        Candidate_Submission__c sub =getSubmission();

        Test.startTest();
        insert buildInterview(sub.Id, 1);
        Test.stopTest();

        System.assertEquals(
            1, 
            (Integer) getSubmission().Interview_Count__c,
            'Inserting 1 interview should set Interview_Count__c to 1'
            );
    }
    @isTest
    static void testInsertThreeInterviewRounds_countsAllThree() {
        Candidate_Submission__c sub = getSubmission();

        Test.startTest();
        insert new List<Interview__c>{
            buildInterview(sub.Id, 1),
            buildInterview(sub.Id, 2),
            buildInterview(sub.Id, 3)
        };
        Test.stopTest();

        System.assertEquals(
            3,
            (Integer) getSubmission().Interview_Count__c,
            'Inserting 3 interview rounds should set count to 3'
        );
    }

    /**Negative Scenarios */
    @isTest
    static void testUpdateInterviewOutcome_doesNotChangeCount() {
        // Updating an existing interview's Outcome should NOT trigger a
        // recalculation — the trigger is not registered for after update,
        // and the COUNT of interviews is unaffected by an outcome change.
        Candidate_Submission__c sub = getSubmission();
        Interview__c interview = buildInterview(sub.Id, 1);
        insert interview;

        System.assertEquals(
            1,
            (Integer) getSubmission().Interview_Count__c,
            'Precondition: count should be 1 after insert'
        );

        Test.startTest();
        interview.Outcome__c = 'Passed';
        update interview;
        Test.stopTest();

        System.assertEquals(
            1,
            (Integer) getSubmission().Interview_Count__c,
            'Updating Outcome should not change Interview_Count__c — count logic only fires on insert/delete/undelete'
        );
    }

    /**Delete Scenarios */
    @isTest
    static void testDeleteOneOfTwoInterviews_decrementsCount() {
        Candidate_Submission__c sub = getSubmission();
        Interview__c round1 = buildInterview(sub.Id, 1);
        Interview__c round2 = buildInterview(sub.Id, 2);
        insert new List<Interview__c>{ round1, round2 };

        System.assertEquals(
            2,
            (Integer) getSubmission().Interview_Count__c,
            'Precondition: count should be 2 after inserting 2 rounds'
        );

        Test.startTest();
        delete round2;
        Test.stopTest();

        System.assertEquals(
            1,
            (Integer) getSubmission().Interview_Count__c,
            'Deleting 1 of 2 interviews should decrement count to 1'
        );
    }

    @isTest
    static void testDeleteLastRemainingInterview_resetsCountToZero() {
        /*
        This is the exact edge case flagged in design review ──
        GROUP BY omits a submission entirely from the aggregate results
        once it has zero matching Interview records. The service must
        still explicitly write 0 by iterating the ORIGINAL Set<Id>,
        not just the Map built from query results. This test proves
        that logic works — it would FAIL if InterviewService only
        looped over the aggregate result Map.
        */
        Candidate_Submission__c sub = getSubmission();
        Interview__c onlyInterview = buildInterview(sub.Id, 1);
        insert onlyInterview;

        System.assertEquals(
            1,
            (Integer) getSubmission().Interview_Count__c,
            'Precondition: count should be 1 with a single interview'
        );

        Test.startTest();
        delete onlyInterview; // this was the LAST interview for this submission
        Test.stopTest();

        System.assertEquals(
            0,
            (Integer) getSubmission().Interview_Count__c,
            'Deleting the last remaining interview must reset count to 0, ' +
            'not leave it stale at 1 — this is the GROUP BY omission edge case'
        );
    }

    /** UnDelete Scenarios */
    @isTest
    static void testUndeleteInterview_restoresCount() {
        Candidate_Submission__c sub = getSubmission();
        Interview__c interview = buildInterview(sub.Id, 1);
        insert interview;
        delete interview;

        System.assertEquals(
            0,
            (Integer) getSubmission().Interview_Count__c,
            'Precondition: count should be 0 after delete'
        );

        Test.startTest();
        undelete interview;
        Test.stopTest();

        System.assertEquals(
            1,
            (Integer) getSubmission().Interview_Count__c,
            'Undeleting an interview should restore count to 1'
        );
    }

    /* Bulk Scenarios: 200 records across MULTIPLE submissions */
    @isTest
    static void testBulkInsert200InterviewsAcrossTwoSubmissions_bothCountedCorrectly() {
        List<Candidate_Submission__c> subs = getAllSubmissions();
        System.assertEquals(2, subs.size(), 'Test setup should have created 2 submissions');

        List<Interview__c> interviews = new List<Interview__c>();
        // 120 interviews for submission 1, 80 for submission 2 = 200 total
        for (Integer i = 0; i < 120; i++) {
            interviews.add(buildInterview(subs[0].Id, Math.mod(i, 10) + 1));
        }
        for (Integer i = 0; i < 80; i++) {
            interviews.add(buildInterview(subs[1].Id, Math.mod(i, 10) + 1));
        }

        Test.startTest();
        insert interviews;
        Test.stopTest();

        Map<Id, Candidate_Submission__c> updated = new Map<Id, Candidate_Submission__c>(getAllSubmissions());

        System.assertEquals(
            120,
            (Integer) updated.get(subs[0].Id).Interview_Count__c,
            'Submission 1 should show exactly 120 interviews'
        );
        System.assertEquals(
            80,
            (Integer) updated.get(subs[1].Id).Interview_Count__c,
            'Submission 2 should show exactly 80 interviews'
        );
    }

    @isTest
    static void testBulkDelete200Interviews_allCountsResetToZero() {
        List<Candidate_Submission__c> subs = getAllSubmissions();

        List<Interview__c> interviews = new List<Interview__c>();
        for (Integer i = 0; i < 100; i++) interviews.add(buildInterview(subs[0].Id, 1));
        for (Integer i = 0; i < 100; i++) interviews.add(buildInterview(subs[1].Id, 1));
        insert interviews;

        Test.startTest();
        delete interviews;
        Test.stopTest();

        Map<Id, Candidate_Submission__c> updated = new Map<Id, Candidate_Submission__c>(getAllSubmissions());

        System.assertEquals(
            0,
            (Integer) updated.get(subs[0].Id).Interview_Count__c,
            'Submission 1 count should reset to 0 after bulk delete'
        );
        System.assertEquals(
            0,
            (Integer) updated.get(subs[1].Id).Interview_Count__c,
            'Submission 2 count should reset to 0 after bulk delete'
        );
    }
}