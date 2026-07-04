@isTest
public class JobOrderTriggerHandlerTest {

    // ─────────────────────────────────────────────────────────────────────
    // @TestSetup
    // Runs once before all test methods. Data is shared across tests.
    // Inserts the minimum records all tests depend on.
    // ─────────────────────────────────────────────────────────────────────
    @TestSetup
    static void makeData() {
        // Two clients created upfront — required for reassignment
        // and multi-client isolation tests
        insert new List<Client__c>{
            new Client__c(
                Client_Name__c   = 'Infosys Technology Ltd',
                Status__c        = 'Active',
                Contract_Type__c = 'Contract (W2)'
            ),
            new Client__c(
                Client_Name__c   = 'TCS Global Services',
                Status__c        = 'Active',
                Contract_Type__c = 'Contract (W2)'
            )
        };
    }

    // ── Shared helpers — keep tests DRY ──────────────────────────────────

    // Single-client tests use this — returns Infosys (first by name)
    public static Client__c getClientA() {
        return [
            SELECT Id, Active_Job_Orders__c
            FROM   Client__c
            WHERE  Client_Name__c = 'Infosys Technology Ltd'
            LIMIT  1
        ];
    }

    // Multi-client and reassignment tests use this — returns TCS
    public static Client__c getClientB() {
        return [
            SELECT Id, Active_Job_Orders__c
            FROM   Client__c
            WHERE  Client_Name__c = 'TCS Global Services'
            LIMIT  1
        ];
    }

    // Keep old getClient() as an alias so existing tests need no changes
    public static Client__c getClient() {
        return getClientA();
    }

    public static Job_Order__c buildJobOrder(Id clientId, String status) {
        return new Job_Order__c(
            Job_Title__c       = 'Senior Java Developer',
            Client__c          = clientId,
            Status__c          = status,
            Employment_Type__c = 'Contract'
        );
    }


    // ═════════════════════════════════════════════════════════════════════
    // POSITIVE SCENARIOS
    // ═════════════════════════════════════════════════════════════════════

    @isTest
    public static void testInsertOneActiveJobOrder_incrementsCountToOne() {
        Client__c client = getClient();

        Test.startTest();
        insert buildJobOrder(client.Id, 'Active');
        Test.stopTest();

        System.assertEquals(
            1,
            (Integer) getClient().Active_Job_Orders__c,
            'Inserting 1 Active JO should set Active_Job_Orders__c to 1'
        );
    }

    @isTest
    public static void testInsertThreeActiveJobOrders_countsAllThree() {
        Client__c client = getClient();

        Test.startTest();
        insert new List<Job_Order__c>{
            buildJobOrder(client.Id, 'Active'),
            buildJobOrder(client.Id, 'Active'),
            buildJobOrder(client.Id, 'Active')
        };
        Test.stopTest();

        System.assertEquals(
            3,
            (Integer) getClient().Active_Job_Orders__c,
            'Inserting 3 Active JOs should set count to 3'
        );
    }

    @isTest
    public static void testUpdateStatusFromActiveToFilled_decrementsCount() {
        Client__c client = getClient();
        Job_Order__c jo = buildJobOrder(client.Id, 'Active');
        insert jo;

        Test.startTest();
        jo.Status__c = 'Filled';
        update jo;
        Test.stopTest();

        System.assertEquals(
            0,
            (Integer) getClient().Active_Job_Orders__c,
            'Updating Status from Active to Filled should decrement count to 0'
        );
    }

    @isTest
    public static void testUpdateStatusFromNewToActive_incrementsCount() {
        Client__c client = getClient();
        Job_Order__c jo = buildJobOrder(client.Id, 'New');
        insert jo;

        System.assertEquals(
            0,
            (Integer) getClient().Active_Job_Orders__c,
            'New status JO should not be counted as Active on insert'
        );

        Test.startTest();
        jo.Status__c = 'Active';
        update jo;
        Test.stopTest();

        System.assertEquals(
            1,
            (Integer) getClient().Active_Job_Orders__c,
            'Updating Status from New to Active should increment count to 1'
        );
    }


    // ═════════════════════════════════════════════════════════════════════
    // NEGATIVE SCENARIOS
    // ═════════════════════════════════════════════════════════════════════

    @isTest
    public static void testInsertNonActiveJobOrders_doesNotIncrementCount() {
        Client__c client = getClient();

        Test.startTest();
        insert new List<Job_Order__c>{
            buildJobOrder(client.Id, 'New'),
            buildJobOrder(client.Id, 'On Hold'),
            buildJobOrder(client.Id, 'Cancelled'),
            buildJobOrder(client.Id, 'Filled')
        };
        Test.stopTest();

        System.assertEquals(
            0,
            (Integer) getClient().Active_Job_Orders__c,
            'JOs with non-Active statuses should not increment the count'
        );
    }

    @isTest
    public static void testJobOrderWithNoClient_doesNotThrowException() {
        // Job Orders without a Client should be safely ignored by the service
        Test.startTest();
        try {
            Job_Order__c jo = new Job_Order__c(
                Job_Title__c       = 'Orphan Role',
                Status__c          = 'Active',
                Employment_Type__c = 'Contract'
                // Client__c intentionally null
            );
            insert jo;
            System.assert(true, 'Insert of JO without Client should not throw');
        } catch (Exception e) {
            System.assert(false, 'No exception should be thrown: ' + e.getMessage());
        }
        Test.stopTest();
    }

    @isTest
    public static void testUpdateNonActiveJobOrder_countRemainsZero() {
        Client__c client = getClient();
        Job_Order__c jo = buildJobOrder(client.Id, 'On Hold');
        insert jo;

        Test.startTest();
        jo.Status__c = 'Cancelled'; // On Hold → Cancelled: neither is Active
        update jo;
        Test.stopTest();

        System.assertEquals(
            0,
            (Integer) getClient().Active_Job_Orders__c,
            'Updating between two non-Active statuses should leave count at 0'
        );
    }


    // ═════════════════════════════════════════════════════════════════════
    // DELETE SCENARIOS
    // ═════════════════════════════════════════════════════════════════════

    @isTest
    public static void testDeleteActiveJobOrder_decrementsCount() {
        Client__c client = getClient();
        Job_Order__c jo = buildJobOrder(client.Id, 'Active');
        insert jo;

        Test.startTest();
        delete jo;
        Test.stopTest();

        System.assertEquals(
            0,
            (Integer) getClient().Active_Job_Orders__c,
            'Deleting an Active JO should decrement count to 0'
        );
    }

    @isTest
    public static void testDeleteNonActiveJobOrder_doesNotAffectCount() {
        Client__c client = getClient();
        Job_Order__c joActive = buildJobOrder(client.Id, 'Active');
        Job_Order__c joFilled = buildJobOrder(client.Id, 'Filled');
        insert new List<Job_Order__c>{ joActive, joFilled };

        Test.startTest();
        delete joFilled; // deleting a Filled JO — should not change Active count
        Test.stopTest();

        System.assertEquals(
            1,
            (Integer) getClient().Active_Job_Orders__c,
            'Deleting a non-Active JO should not change the Active count'
        );
    }


    // ═════════════════════════════════════════════════════════════════════
    // UNDELETE SCENARIOS
    // ═════════════════════════════════════════════════════════════════════

    @isTest
    public static void testUndeleteActiveJobOrder_restoresCount() {
        Client__c client = getClient();
        Job_Order__c jo = buildJobOrder(client.Id, 'Active');
        insert jo;
        delete jo;

        System.assertEquals(
            0,
            (Integer) getClient().Active_Job_Orders__c,
            'Count should be 0 after delete (precondition check)'
        );

        Test.startTest();
        undelete jo;
        Test.stopTest();

        System.assertEquals(
            1,
            (Integer) getClient().Active_Job_Orders__c,
            'Undeleting an Active JO should restore count to 1'
        );
    }


    // ═════════════════════════════════════════════════════════════════════
    // BULK SCENARIOS — 200 records (Salesforce standard batch size)
    // ═════════════════════════════════════════════════════════════════════

    @isTest
    public static void testBulkInsert200ActiveJobOrders_allCounted() {
        Client__c client = getClient();

        List<Job_Order__c> jos = new List<Job_Order__c>();
        for (Integer i = 0; i < 200; i++) {
            jos.add(buildJobOrder(client.Id, 'Active'));
        }

        Test.startTest();
        insert jos;
        Test.stopTest();

        System.assertEquals(
            200,
            (Integer) getClient().Active_Job_Orders__c,
            'Bulk insert of 200 Active JOs should set count to 200'
        );
    }

    @isTest
    public static void testBulkUpdate200ActiveJobOrdersToFilled_countResetsToZero() {
        Client__c client = getClient();

        List<Job_Order__c> jos = new List<Job_Order__c>();
        for (Integer i = 0; i < 200; i++) {
            jos.add(buildJobOrder(client.Id, 'Active'));
        }
        insert jos;

        for (Job_Order__c jo : jos) {
            jo.Status__c = 'Filled';
        }

        Test.startTest();
        update jos;
        Test.stopTest();

        System.assertEquals(
            0,
            (Integer) getClient().Active_Job_Orders__c,
            'Bulk update of 200 Active JOs to Filled should reset count to 0'
        );
    }

    @isTest
    public static void testBulkDelete200ActiveJobOrders_countResetsToZero() {
        Client__c client = getClient();

        List<Job_Order__c> jos = new List<Job_Order__c>();
        for (Integer i = 0; i < 200; i++) {
            jos.add(buildJobOrder(client.Id, 'Active'));
        }
        insert jos;

        Test.startTest();
        delete jos;
        Test.stopTest();

        System.assertEquals(
            0,
            (Integer) getClient().Active_Job_Orders__c,
            'Bulk delete of 200 Active JOs should reset count to 0'
        );
    }


    // ═════════════════════════════════════════════════════════════════════
    // CLIENT REASSIGNMENT — Technical Lead review: Test 1
    //
    // Scenario: An Active Job Order is moved from Client A to Client B.
    //
    // Why this matters:
    //   The handler collects Client IDs from BOTH Trigger.old (Client A)
    //   and Trigger.new (Client B) on AFTER_UPDATE. If we only collected
    //   from Trigger.new, Client A's count would never decrement — a silent
    //   data integrity bug that only appears when JOs are reassigned.
    //
    // This test proves both sides of the reassignment are handled correctly.
    // ═════════════════════════════════════════════════════════════════════

    @isTest
    public static void testReassignActiveJobOrderToNewClient_updatesBothCounts() {
        Client__c clientA = getClientA();
        Client__c clientB = getClientB();

        // Start: Active JO belongs to Client A
        Job_Order__c jo = buildJobOrder(clientA.Id, 'Active');
        insert jo;

        // Precondition: A=1, B=0
        System.assertEquals(
            1,
            (Integer) getClientA().Active_Job_Orders__c,
            'Client A should have 1 Active JO before reassignment'
        );
        System.assertEquals(
            0,
            (Integer) getClientB().Active_Job_Orders__c,
            'Client B should have 0 Active JOs before reassignment'
        );

        Test.startTest();
        jo.Client__c = clientB.Id; // reassign to Client B
        update jo;
        Test.stopTest();

        // After reassignment: A=0, B=1
        System.assertEquals(
            0,
            (Integer) getClientA().Active_Job_Orders__c,
            'Client A count should decrement to 0 after JO is moved away'
        );
        System.assertEquals(
            1,
            (Integer) getClientB().Active_Job_Orders__c,
            'Client B count should increment to 1 after JO is moved in'
        );
    }


    // ═════════════════════════════════════════════════════════════════════
    // BULK MIXED STATUSES — Technical Lead review: Test 2
    //
    // Scenario: 200 records inserted across 4 statuses in one DML call.
    //   80 Active, 40 Filled, 30 Cancelled, 50 New = 200 total
    //
    // Why this matters:
    //   The SOQL filter (Status__c = 'Active') must happen at the database
    //   level. This test verifies the service does not accidentally count
    //   non-Active records when they arrive in the same batch as Active ones.
    // ═════════════════════════════════════════════════════════════════════

    @isTest
    public static void testBulkMixedStatuses_onlyActiveAreCounted() {
        Client__c client = getClientA();

        List<Job_Order__c> jos = new List<Job_Order__c>();

        for (Integer i = 0; i < 80;  i++) jos.add(buildJobOrder(client.Id, 'Active'));
        for (Integer i = 0; i < 40;  i++) jos.add(buildJobOrder(client.Id, 'Filled'));
        for (Integer i = 0; i < 30;  i++) jos.add(buildJobOrder(client.Id, 'Cancelled'));
        for (Integer i = 0; i < 50;  i++) jos.add(buildJobOrder(client.Id, 'New'));
        // Total: 200 records — but only 80 are Active

        Test.startTest();
        insert jos;
        Test.stopTest();

        System.assertEquals(
            80,
            (Integer) getClientA().Active_Job_Orders__c,
            'Only the 80 Active JOs should be counted — not Filled, Cancelled, or New'
        );
    }


    // ═════════════════════════════════════════════════════════════════════
    // MULTI-CLIENT ISOLATION — Technical Lead review: Test 3
    //
    // Scenario: Two clients each have Job Orders inserted in the same
    //   DML call. Each client's count must be independently correct.
    //
    //   Client A: 100 Active
    //   Client B:  50 Active
    //
    // Why this matters:
    //   The service uses a Map keyed by Client ID so each client gets its
    //   own independent count. This test verifies the Map grouping works
    //   correctly when records for multiple clients arrive in one batch —
    //   which is exactly how Data Loader and bulk API calls behave in prod.
    // ═════════════════════════════════════════════════════════════════════

    @isTest
    public static void testMultipleClients_eachCountedIndependently() {
        Client__c clientA = getClientA();
        Client__c clientB = getClientB();

        List<Job_Order__c> jos = new List<Job_Order__c>();

        for (Integer i = 0; i < 100; i++) jos.add(buildJobOrder(clientA.Id, 'Active'));
        for (Integer i = 0; i < 50;  i++) jos.add(buildJobOrder(clientB.Id, 'Active'));
        // 150 records total in one DML — mixed across two clients

        Test.startTest();
        insert jos;
        Test.stopTest();

        System.assertEquals(
            100,
            (Integer) getClientA().Active_Job_Orders__c,
            'Client A should have exactly 100 Active JOs'
        );
        System.assertEquals(
            50,
            (Integer) getClientB().Active_Job_Orders__c,
            'Client B should have exactly 50 Active JOs'
        );
    }
}