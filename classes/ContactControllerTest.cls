@IsTest
public with sharing class ContactControllerTest {
    @testSetup static void setup() {

        List<Contact> testCons = new List<Contact>();
        for(Integer i = 0; i < 2; i++) {
            Contact c = new Contact(
                FirstName = 'FirstName' + i,
                LastName = 'LastName' + i
            );
            testCons.add(c);
        }
        insert testCons;
    }

    @isTest static void testGetContacts() {
       
        List<Contact> testCons = new List<Contact>();
        testCons = ContactController.getContacts();
        System.assertEquals(2, testCons.size(), 'receipted incorrect count of contacts');
    }
}
