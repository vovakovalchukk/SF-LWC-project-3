@IsTest
public with sharing class LeadControllerTest {
    @testSetup static void setup() {

        List<Lead> testLeads = new List<Lead>();
        for(Integer i = 0; i < 2; i++) {
            Lead l = new Lead(
                LastName = 'Title' + i,
                Company = 'Company' + i
            );
            testLeads.add(l);
        }
        insert testLeads;
    }

    @isTest static void testGetLeads() {
       
        List<Lead> testLeads = new List<Lead>();
        testLeads = LeadController.getLeads();
        System.assertEquals(2, testLeads.size(), 'receipted incorrect count of Leads');
    }
}
