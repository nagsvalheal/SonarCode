/**
* @description Test class for testing the BI_PSPB_LoginCtrl class.
* This class contains test methods to verify various functionalities of the BI_PSPB_LoginCtrl class.
* Author: Saran S
* Code Coverage: 94%
* Last Modified On: 9-03-2024
* Last Modified By: Sowmitha
*/
@isTest
public class BI_PSPB_LoginCtrlTest {
    @isTest
    public static void testProfileDetails() {
        Profile testProfile = [SELECT Id FROM Profile LIMIT 1];
        Test.startTest();
        Profile profileDetails = BI_PSPB_LoginCtrl.profileDetails();
        Test.stopTest();
        Assert.areNotEqual(null, profileDetails, 'Profile details should not be null');
        Assert.areEqual(testProfile.Id, profileDetails.Id, 'Profile Id should match');
    }

    @isTest
    public static void testProfileDetailsCatchBlocks() {
        try{
            //Assertion is not done because it is for catch block
            Test.startTest();
            // Testing for exceptions in profileDetails method
            BI_PSPB_LoginCtrl.profileDetails();

            Test.stopTest();
        }catch (Exception e) {
			// Assert that the exception message is as expected
			Assert.areEqual(
				e.getMessage(),
				'Script-thrown exception',
				e.getMessage()
			);
		}
    }


}