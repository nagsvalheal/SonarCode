/**
* @description Test class for BI_PSPB_GraphCtrl class.
* This test class is used for testing the functionality of the BI_PSPB_GraphController class, which is responsible for fetching values from Symptom Tracker and Questionnaire objects for chart.
* Author: Gowsic N
* Code Coverage: 90%
* Last Modified On: 5-02-2024
* Last Modified By: Harish
*/
@istest
public class BI_PSP_GraphCtrlTest
{
	/**
* @description Test data setup method to prepare the necessary data for testing.
*/
	public Date dates = null;
	
	public String name = '';
	
	public String symptom = '';
	
	@testsetup
	public static void testData()
	{
		// Create mock BI_SFCOE_LOG_App_Settings__c record
		BI_SFCOE_LOG_App_Settings__c settings = new BI_SFCOE_LOG_App_Settings__c(
			Name = 'ApplicationName',
			BI_SFCOE_LOG_Application__c = 'Spevigo'
		);
		insert settings;
		String recTypeId= [select Id from RecordType where (Name='Person Account') and (SobjectType='Account')].Id;
		Account accountValue = new Account(
			RecordTypeID=recTypeId,
			LastName='testuserss',
			PersonMailingStreet='test@email.com',
			PersonMailingPostalCode='12345',
			PersonMailingCity='SFO',
			PersonEmail='challenges@email.com',
			PersonHomePhone='1234567',
			PersonMobilePhone='12345678'
		);
		insert accountValue;
		CareProgram program = new CareProgram(name='challenge',StartDate=system.today());
		insert program;
		CareProgramEnrollee enrolle = new CareProgramEnrollee(Name='challengeenrolle',AccountId=accountValue.Id,CareProgramId=program.Id);
		insert enrolle;
		
		Assessment assessmentData = new Assessment(
			Name = 'Introduction',
			AssessmentStatus = 'In Progress',
			BI_PSP_StatusForPersonalization__c = 'Complete',
			BI_PSP_CareProgramEnrollee__c = enrolle.Id,
			BI_PSP_DateForCQ__c = 'test'
		);
		insert assessmentData;
		
		AssessmentQuestion questionData = new AssessmentQuestion(
			Name = 'test questionname',
			DeveloperName = 'Valid_Name_123',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionData;
		
		AssessmentQuestion questionDataTwo = new AssessmentQuestion(
			Name = 'test questionname2',
			DeveloperName = 'Valid_Name_1293',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataTwo;
		
		AssessmentQuestionVersion questionVersionTwo = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataTwo.id,
			QuestionText = 'What is your gender?',
			Name = 'test data2',
			IsActive = true
		);
		insert questionVersionTwo;
		
		AssessmentQuestionResponse testResponseTwo = new AssessmentQuestionResponse(
			ResponseText = 'Female',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionTwo.id,
			Name = 'test data'
		);
		insert testResponseTwo;
		
		AssessmentQuestionVersion questionVersion = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionData.id,
			QuestionText = 'I don’t feel like I am doing enough to stay healthy in terms of diet, exercise, etc.',
			Name = 'test data',
			IsActive = true
		);
		insert questionVersion;
		
		AssessmentQuestionResponse testResponse = new AssessmentQuestionResponse(
			ResponseText = 'Yes',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersion.id,
			Name = 'test data'
		);
		insert testResponse;
		
		AssessmentQuestion questionDataThree = new AssessmentQuestion(
			Name = 'test questionname3',
			DeveloperName = 'Valid_Name_12393',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataThree;
		
		AssessmentQuestionVersion questionVersionThree = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataThree.id,
			QuestionText = 'Do you often discuss GPP with your friends and family?',
			Name = 'test data3',
			IsActive = true
		);
		insert questionVersionThree;
		
		AssessmentQuestionResponse testResponseThree = new AssessmentQuestionResponse(
			ResponseText = 'No',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionThree.id,
			Name = 'test data'
		);
		insert testResponseThree;
		
		AssessmentQuestion questionDataFour = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_12394',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataFour;
		
		AssessmentQuestionVersion questionVersionFour = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataFour.id,
			QuestionText = 'What aspects of your life have been affected by GPP?',
			Name = 'test data4',
			IsActive = true
		);
		insert questionVersionFour;
		
		AssessmentQuestionResponse testResponseFour = new AssessmentQuestionResponse(
			ResponseText = 'Relationships with friends and family,Relationship with Partner,Self Esteem',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionFour.id,
			Name = 'test data'
		);
		insert testResponseFour;
		
		AssessmentQuestion questionDataFive = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_12395',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataFive;
		
		AssessmentQuestionVersion questionVersionFive = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataFive.id,
			QuestionText = 'Do you have other medical conditions?',
			Name = 'test data5',
			IsActive = true
		);
		insert questionVersionFive;
		
		AssessmentQuestionResponse testResponseFive = new AssessmentQuestionResponse(
			ResponseText = 'Yes',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionFive.id,
			Name = 'test data'
		);
		insert testResponseFive;
		
		AssessmentQuestion questionDataSix = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_12396',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataSix;
		
		AssessmentQuestionVersion questionVersionSix = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataSix.id,
			QuestionText = 'I have a complete understanding of my Generalized pustular psoriasis (GPP).',
			Name = 'test data6',
			IsActive = true
		);
		insert questionVersionSix;
		
		AssessmentQuestionResponse testResponseSix = new AssessmentQuestionResponse(
			ResponseText = 'No',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionSix.id,
			Name = 'test data'
		);
		insert testResponseSix;
		
		AssessmentQuestion questionDataSeven = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_12397',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataSeven;
		
		AssessmentQuestionVersion questionVersionSeven = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataSeven.id,
			QuestionText = 'I feel confident about recognizing GPP flares.',
			Name = 'test data7',
			IsActive = true
		);
		insert questionVersionSeven;
		
		AssessmentQuestionResponse testResponseSeven = new AssessmentQuestionResponse(
			ResponseText = 'No',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionSeven.id,
			Name = 'test data'
		);
		insert testResponseSeven;
		AssessmentQuestion questionDataEight = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_12398',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataEight;
		
		AssessmentQuestionVersion questionVersionEight = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataEight.id,
			QuestionText = 'I can manage my GPP flares.',
			Name = 'test data8',
			IsActive = true
		);
		insert questionVersionEight;
		
		AssessmentQuestionResponse testResponseEight = new AssessmentQuestionResponse(
			ResponseText = 'No',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionEight.id,
			Name = 'test data'
		);
		insert testResponseEight;
		
		AssessmentQuestion questionDataNine = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_12399',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataNine;
		
		AssessmentQuestionVersion questionVersionNine = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataNine.id,
			QuestionText = 'I have a complete understanding of Spevigo (spesolimab) and how it is used to treat my GPP',
			Name = 'test data9',
			IsActive = true
		);
		insert questionVersionNine;
		
		AssessmentQuestionResponse testResponseNine = new AssessmentQuestionResponse(
			ResponseText = 'No',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionNine.id,
			Name = 'test data'
		);
		insert testResponseNine;
		
		AssessmentQuestion questionDataTen = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_1231010',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataTen;
		
		AssessmentQuestionVersion questionVersionTen = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataTen.id,
			QuestionText = 'I am not good at talking to my physician about my GPP.',
			Name = 'test data10',
			IsActive = true
		);
		insert questionVersionTen;
		
		AssessmentQuestionResponse testResponseTen = new AssessmentQuestionResponse(
			ResponseText = 'Yes',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionTen.id,
			Name = 'test data'
		);
		insert testResponseTen;
		
		AssessmentQuestion questionDataEleven = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_1231111',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataEleven;
		
		AssessmentQuestionVersion questionVersionEleven = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataEleven.id,
			QuestionText = 'I rely only on my physician to manage my GPP.',
			Name = 'test data11',
			IsActive = true
		);
		insert questionVersionEleven;
		
		AssessmentQuestionResponse testResponseEleven = new AssessmentQuestionResponse(
			ResponseText = 'No',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionEleven.id,
			Name = 'test data'
		);
		insert testResponseEleven;
		
		AssessmentQuestion questionDataTwelve = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_1231212',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataTwelve;
		
		AssessmentQuestionVersion questionVersionTwelve = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataTwelve.id,
			QuestionText = 'GPP is affecting my mental health (e.g. leading to depression and/or anxiety).',
			Name = 'test data12',
			IsActive = true
		);
		insert questionVersionTwelve;
		
		AssessmentQuestionResponse testResponseTwelve = new AssessmentQuestionResponse(
			ResponseText = 'Yes',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionTwelve.id,
			Name = 'test data'
		);
		insert testResponseTwelve;
		
		AssessmentQuestion questionDataThirteen = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_1331313',
			DataType = 'Decimal',
			QuestionCategory = 'Introduction'
		);
		insert questionDataThirteen;
		
		AssessmentQuestionVersion questionVersionThirteen = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataThirteen.id,
			QuestionText = 'I have required support at home from my family members and/or caregiver to manage my GPP condition.',
			Name = 'test data13',
			IsActive = true
		);
		insert questionVersionThirteen;
		
		AssessmentQuestionResponse testResponseThirteen = new AssessmentQuestionResponse(
			ResponseText = 'No',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionThirteen.id,
			Name = 'test data'
		);
		insert testResponseThirteen;
		String recType= [select Id from RecordType where (Name='BI_PSP_Challenge') and (SobjectType='HealthCloudGA__CarePlanTemplate__c')].Id;
		HealthCloudGA__CarePlanTemplate__c carePlanTemp = new HealthCloudGA__CarePlanTemplate__c(
			Name='challenge',
			recordtypeId=recType,
			HealthCloudGA__Description__c='Description',
			BI_PSP_Challenge_Level__c='Level 1',
			BI_PSP_Challenge_Reward_Points__c=30
		);
		insert carePlanTemp;
		HealthCloudGA__CareProgramPlanTemplate__c carePrgm = 
			new HealthCloudGA__CareProgramPlanTemplate__c(
				HealthCloudGA__CareProgram__c=program.Id,HealthCloudGA__CarePlanTemplate__c=carePlanTemp.Id
			);
		insert carePrgm;
		BI_PSP_Symptom_Tracker__c symptomData = new BI_PSP_Symptom_Tracker__c(
			BI_PSP_EditEntrydates__c = System.Today(),
			BI_PSP_Recent_Activities__c = 'Stress',
			BI_PSP_Care_Program_Enrollee__c= enrolle.Id
		);
		insert symptomData;
		AllergyIntolerance allergyIntoleranceData = new AllergyIntolerance(
			BI_PSP_Symptoms__c = carePrgm.Id,
			BI_PSP_Symptom_Name__c = symptomData.id,
			BI_PSP_Bodyparts__c = ' head',
			BI_PSP_Intensity__c =  10,
			PatientId = accountValue.Id,
			BI_PSP_Temperature__c = Decimal.valueof ('100.5'),
			BI_PSP_Mood__c = 'sad'
		);
		insert allergyIntoleranceData;
	}
	
	/**
* @description Test methd responsible for fetching values from Questionnaire.
*/
	@isTest
	public static void testPositiveOne() {
		
		// Retrieve CareProgramEnrollee record created in test setup
		CareProgramEnrollee enrollee = [SELECT Id FROM CareProgramEnrollee WHERE Name = 'challengeenrolle' LIMIT 1];
		Assessment assessmentData = new Assessment(
			Name = 'Psoriasis Symptom Scale (PSS)',
			AssessmentStatus = 'Completed',
			BI_PSP_StatusForPersonalization__c = 'Complete',
			BI_PSP_CareProgramEnrollee__c = enrollee.Id,
			BI_PSP_DateForCQ__c = 'test'
		);
		insert assessmentData;
		AssessmentQuestion questionDataThirteen = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_13313134',
			DataType = 'Decimal',
			QuestionCategory = 'Psoriasis Symptom Scale (PSS)'
		);
		insert questionDataThirteen;
		AssessmentQuestionVersion questionVersionThirteen = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataThirteen.id,
			QuestionText = 'I have required support at home from my family members and/or caregiver to manage my GPP condition.',
			Name = 'Psoriasis Symptom Scale (PSS)',
			IsActive = true
		);
		insert questionVersionThirteen;
		
		AssessmentQuestionResponse testResponseTwelve = new AssessmentQuestionResponse(
			ResponseText = 'Yes',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionThirteen.id,
			Name = assessmentData.Name
		);
		insert testResponseTwelve;
		
		Test.startTest();
		try{
		// Call the method under test
		BI_PSP_GraphCtrl.getQuestionnaireDetails(enrollee.Id, 'Psoriasis Symptom Scale (PSS)', 'Completed');
		}catch(Exception e){
					Assert.areEqual(
		  e.getMessage(),
		  'Script-thrown exception',
		  e.getMessage()
		);
		}
		Test.stopTest();
	}
	
	@isTest
	static void testGetSymptomTrackerDetailsException() {
		Test.startTest();
		// Call the method with parameters that will cause an exception
		try{
		BI_PSP_GraphCtrl.getSymptomTrackerDetails('true', null, null);
		
		BI_PSP_GraphCtrl.getQuestionnaireDetails('false', '3', 'true');
		}catch(Exception e){
					Assert.areEqual(
		  e.getMessage(),
		  'Script-thrown exception',
		  e.getMessage()
		);
		}
		Test.stopTest();
	}
	
	/**
* @description Test methd responsible for fetching values from Symptom Tracker.
*/
	@isTest
	public static void testPositiveTwo() {
		
		Test.StartTest();
		// Retrieving CareProgramEnrollee record for testing
		CareProgramEnrollee userAccount = [Select id,name from CareProgramEnrollee where Name='challengeenrolle'];
		Date firstDate = system.today()-1;
		Date lastDate = system.today()+30;
		try{
		// Testing getSymptomTrackerDetails method with null inputs
		List<BI_PSP_GraphCtrl.SymptomTracker> resultOne = BI_PSP_GraphCtrl.getSymptomTrackerDetails(null,null,null);
		System.assert(resultOne == null || resultOne.size() == 0, 'Expecting null or empty list for null inputs');
		
		// Testing getSymptomTrackerDetails method with valid inputs
		List<BI_PSP_GraphCtrl.SymptomTracker> resultTwo = BI_PSP_GraphCtrl.getSymptomTrackerDetails(userAccount.id, firstDate, lastDate);
	   
		
		// Assert that the result list contains expected number of elements
		Assert.areEqual(1, resultTwo.size(), 'Result list should contain one element');
		
		}catch(Exception e){
					Assert.areEqual(
		  e.getMessage(),
		  'Script-thrown exception',
		  e.getMessage()
		);
		}
		Test.StopTest();
	}
	
	
	@isTest
	static void testGetQuestionnaireLast() {
		
		// Create test data
		CareProgramEnrollee userAccount = [Select id,name from CareProgramEnrollee where Name='challengeenrolle'];
		List<Assessment> assessments = new List<Assessment>();
		assessments.add(new Assessment(/*BI_PSP_DateForCQ__c='Mar 2024',*/Name = 'Assessment 1',AssessmentStatus = 'Completed', BI_PSP_CareProgramEnrollee__c = userAccount.Id));
		assessments.add(new Assessment(/*BI_PSP_DateForCQ__c='Mar 2024',*/Name = 'Assessment 2',AssessmentStatus = 'Completed', BI_PSP_CareProgramEnrollee__c = userAccount.Id));
		insert assessments; 
		// Call the method being tested
		Test.startTest();
		try{
		BI_PSP_GraphCtrl.getQuestionnaireLast(userAccount.Id, 'Mar 2024');
		}catch(Exception e){
					Assert.areEqual(
		  e.getMessage(),
		  'Script-thrown exception',
		  e.getMessage()
		);
		}
		Test.stopTest();
	}
	@isTest
	static void testGetQuestionnairePos() {
		// Retrieve CareProgramEnrollee record created in test setup
		CareProgramEnrollee enrollee = [SELECT Id FROM CareProgramEnrollee WHERE Name = 'challengeenrolle' LIMIT 1];
		Assessment assessmentData = new Assessment(
			Name = 'Psoriasis Symptom Scale (PSS)',
			AssessmentStatus = 'Completed',BI_PSP_DateForCQ__c='Mar 2024',
			BI_PSP_StatusForPersonalization__c = 'Complete',
			BI_PSP_CareProgramEnrollee__c = enrollee.Id
		);
		insert assessmentData;
		AssessmentQuestion questionDataThirteen = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_13313134',
			DataType = 'Decimal',
			QuestionCategory = 'Psoriasis Symptom Scale (PSS)'
		);
		insert questionDataThirteen;
		AssessmentQuestionVersion questionVersionThirteen = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataThirteen.id,
			QuestionText = 'I have required support at home from my family members and/or caregiver to manage my GPP condition.',
			Name = 'Psoriasis Symptom Scale (PSS)',
			IsActive = true
		);
		insert questionVersionThirteen;
		
		AssessmentQuestionResponse testResponseTwelve = new AssessmentQuestionResponse(
			ResponseText = 'Yes',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionThirteen.id,
			Name = assessmentData.Name
		);
		insert testResponseTwelve;
		
		Test.startTest();
		try{
		// Call the method under test
		BI_PSP_GraphCtrl.getQuestionnaireDetails(enrollee.Id, 'Psoriasis Symptom Scale (PSS)',  'Mar 2024');
		}catch(Exception e){
					Assert.areEqual(
		  e.getMessage(),
		  'Script-thrown exception',
		  e.getMessage()
		);
		}
		Test.stopTest();
	}
		@isTest
	static void testGetQuestionnairePosOne() {
		// Retrieve CareProgramEnrollee record created in test setup
		CareProgramEnrollee enrollee = [SELECT Id FROM CareProgramEnrollee WHERE Name = 'challengeenrolle' LIMIT 1];
		Assessment assessmentData = new Assessment(
			Name = 'Psoriasis Symptom Scale (PSS)',
			AssessmentStatus = 'Completed',
			BI_PSP_StatusForPersonalization__c = 'Complete',
			BI_PSP_CareProgramEnrollee__c = enrollee.Id
		);
		insert assessmentData;
		AssessmentQuestion questionDataThirteen = new AssessmentQuestion(
			Name = 'test questionname4',
			DeveloperName = 'Valid_Name_13313134',
			DataType = 'Decimal',
			QuestionCategory = 'Psoriasis Symptom Scale (PSS)'
		);
		insert questionDataThirteen;
		AssessmentQuestionVersion questionVersionThirteen = new AssessmentQuestionVersion(
			AssessmentQuestionId = questionDataThirteen.id,
			QuestionText = 'I have required support at home from my family members and/or caregiver to manage my GPP condition.',
			Name = 'Psoriasis Symptom Scale (PSS)',
			IsActive = true
		);
		insert questionVersionThirteen;
		
		AssessmentQuestionResponse testResponseTwelve = new AssessmentQuestionResponse(
			ResponseText = 'Yes',
			BI_PSP_Category__c = '',
			AssessmentId = assessmentData.id,
			AssessmentQuestionId = questionVersionThirteen.id,
			Name = assessmentData.Name
		);
		insert testResponseTwelve;
		
		Test.startTest();
		try{
		// Call the method under test
		BI_PSP_GraphCtrl.getQuestionnaireDetails(enrollee.Id, 'Psoriasis Symptom Scale (PSS)',  'Mar 2024');
		}catch(Exception e){
					Assert.areEqual(
		  e.getMessage(),
		  'Script-thrown exception',
		  e.getMessage()
		);
		}
		Test.stopTest();
	}    
	@isTest
	static void testGetQuestionnaireLastPos() {
		
		// Create test data
		CareProgramEnrollee userAccount = [Select id,name from CareProgramEnrollee where Name='challengeenrolle'];
		List<Assessment> assessments = new List<Assessment>();
		assessments.add(new Assessment(BI_PSP_DateForCQ__c='Mar 2024',Name = 'Assessment 1',AssessmentStatus = 'Completed', BI_PSP_CareProgramEnrollee__c = userAccount.Id));
		assessments.add(new Assessment(BI_PSP_DateForCQ__c='Mar 2024',Name = 'Assessment 2',AssessmentStatus = 'Completed', BI_PSP_CareProgramEnrollee__c = userAccount.Id));
		insert assessments; 
		// Call the method being tested
		Test.startTest();
		try{
		BI_PSP_GraphCtrl.getQuestionnaireLast(userAccount.Id, 'Mar 2024');
		}Catch(Exception e){
					Assert.areEqual(
		  e.getMessage(),
		  'Script-thrown exception',
		  e.getMessage()
		);
		}
		Test.stopTest();
		// Assert the result
	}
}