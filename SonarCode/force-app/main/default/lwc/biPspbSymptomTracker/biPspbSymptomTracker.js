//This components using  Main component connect all child components user date and recntactivty gpp symptoms
// To import Libraries
import { LightningElement, track, api, wire } from "lwc";
import { loadStyle } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
// To import Apex Classes
import GET_ALLERGYINTOLERANCE_DATA from "@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData";
import RECORD_INSERT_STS from "@salesforce/apex/BI_PSP_SymptomTrackerCtrl.insertSymptomTracker";
import RECORD_INSERTST_UPDATE from "@salesforce/apex/BI_PSP_SymptomTrackerCtrl.updateSymptomTracker";
import CHECK_UNIQUE_DATE from "@salesforce/apex/BI_PSP_SymptomTrackerCtrl.checkUniqueDate";
import UPDATE_GPP_VALUE from "@salesforce/apex/BI_PSP_SymptomTrackerCtrl.updateGppValue";
import UPDATE_RECENT_VALUE from "@salesforce/apex/BI_PSP_SymptomTrackerCtrl.updateRecentSymptomActivity";
import CREATE_CONTENT_DOCUMENT_LINKS from "@salesforce/apex/BI_PSP_SymptomTrackerOperationsCtrl.createContentDocumentLinks";
import GET_LAST from "@salesforce/apex/BI_PSP_SymptomTrackerOperationsCtrl.getLastCareTemplate";
import GET_SYMPTOM_RECORD_DATA from "@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getSymptomRecordData";
import GET_CASE_IMAGE_URL from "@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getBase64Image";
import DELETE_CONTENT_DOCUMENT_LINKS from "@salesforce/apex/BI_PSP_SymptomTrackerOperationsCtrl.deleteContentDocumentLinks";
import FETCH_ACCOUNT_DETAILS from "@salesforce/apex/BI_PSP_SymptomTrackerOperationsCtrl.fetchAccountDetails";
import SAVE_FILES from "@salesforce/apex/BI_PSP_SymptomTrackerOperationsCtrl.saveFiles";
import GET_ENROLLE from "@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle";
// To import Static Resources
import BOXED_ICON from "@salesforce/resourceUrl/BI_PSPB_BoxedIcon";
import UPLOAD_IMG from "@salesforce/resourceUrl/BI_PSPB_UploadImg";
import SYMPTOM_TICK_IMG from "@salesforce/resourceUrl/BI_PSPB_SymptomTickImg";
import ITCHINESS_COLOR_VARIENT from "@salesforce/resourceUrl/BI_PSPB_ItchinessColorVarient";
import REDNESS_COLOR_VARIENT from "@salesforce/resourceUrl/BI_PSPB_RednessColorVarient";
import PAIN_COLOR_VARIENT from "@salesforce/resourceUrl/BI_PSPB_PainColorVarient";
import PUSTULES_COLOR_VARIENT from "@salesforce/resourceUrl/BI_PSPB_PustulesColorVarient";
import FATIGUE_COLOR_VARIENT from "@salesforce/resourceUrl/BI_PSPB_FatigueColorVarient";
import MOOD_COLOR_VARIENT from "@salesforce/resourceUrl/BI_PSPB_MoodColorVarient";
import TEMPERATURE_COLOR_VARIENT from "@salesforce/resourceUrl/BI_PSPB_TemperatureColorVarient";
import SYMPTOM_TICK_ICON from "@salesforce/resourceUrl/BI_PSPB_SymptomTickIcon";
import SYMPTOMS_IMG from "@salesforce/resourceUrl/BI_PSPB_SymptomsImg";
import FILE_UPLOADER_CSS from "@salesforce/resourceUrl/BI_PSPB_SymptomCss";
// To import current user ID
import ID from "@salesforce/user/Id";
// To import Custom Labels
import BRANDED_URL_NAVI from "@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl";
import UNASSIGNED_URL_NAVI from "@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl";
import SYMPTOM_GRAPH_PAGE from "@salesforce/label/c.BI_PSPB_SymptomTrackerGraphPages";
import BRANDED_URL from "@salesforce/label/c.BI_PSPB_SiteLabel";
import UN_ASSIGNED_URL from "@salesforce/label/c.BI_PSPB_UnAssignedLabel";
import ITCHINESS from "@salesforce/label/c.BI_PSP_Itchiness";
import REDNESS from "@salesforce/label/c.BI_PSP_Redness";
import PAIN from "@salesforce/label/c.BI_PSP_Pain";
import PUSTULES from "@salesforce/label/c.BI_PSP_Pustules";
import FATIQUE from "@salesforce/label/c.BI_PSP_Fatique";
import TEMPERATURE from "@salesforce/label/c.BI_PSP_Temperrature";
import MOOD from "@salesforce/label/c.BI_PSP_Mood";
import YES from "@salesforce/label/c.BI_PSP_SoftDelete";
import NO from "@salesforce/label/c.BI_PSP_OptionValueNo";
import FEMALE from "@salesforce/label/c.BI_PSP_RbFemale";
import ERROR_MESSAGE from "@salesforce/label/c.BI_PSP_ConsoleError";
import ERROR_VARIANT_TOAST from "@salesforce/label/c.BI_PSP_ErrorVariantToast";
import LABEL_US from "@salesforce/label/c.BI_PSPB_EnUsValue";
import DYNAMIC_VALUE from "@salesforce/label/c.BI_PSP_SomeDynamicValue";
import DATE_INPUT_PAGE from "@salesforce/label/c.BI_PSP_DateInputPage";
import UPLOADED_FILE from "@salesforce/label/c.BI_PSP_UploadedFile";
import UPLOADED_FILE_PNG from "@salesforce/label/c.BI_PSP_UploadedFilePng";
import GET_SYMPTOM_TRACKER_DETAILS from "@salesforce/apex/BI_PSP_SymptomTrackerOperationsCtrl.getSymptomTrackerDetails";
export default class biPspbSymptomTracker extends NavigationMixin(
    LightningElement
) {
    //Proper naming conventions with camel case for all the variable will be followed in the future releases
    //@api variable declaration
    @api symptomrecord1;
    @api symptomTrackerId;
    @track imageUrls = [];
    @api recordId;
    //@track variable declaration
 symptomCompleteTick = SYMPTOM_TICK_IMG;
 symptomrecordValuesbtn;
 itchinessColorVarient = ITCHINESS_COLOR_VARIENT;
 rednessColorVarient = REDNESS_COLOR_VARIENT;
 painColorVarient = PAIN_COLOR_VARIENT;
 pustulesColorVarient = PUSTULES_COLOR_VARIENT;
 fatigueColorVarient = FATIGUE_COLOR_VARIENT;
 moodColorVarient = MOOD_COLOR_VARIENT;
 temperatureColorVarient = TEMPERATURE_COLOR_VARIENT;
 symptomTickIcon = SYMPTOM_TICK_ICON;
 lasteDatedIsPlay = false;
 isDeskTop = false;
 rednessChange = false;
 painChange = false;
 pustlesChange = false;
 fatiquesChange = false;
 moodChange = false;
 temperatureChange = false;
 sliderValue = 8;
 whichValuesOne = "Which of the below apply to your recent";
 boxedIcon = BOXED_ICON;
 limtUpLoad = UPLOAD_IMG;
 accName;
 isPopupOpenUndersatand = false;
    // @track understand = false;
 isPopupOpenDisable = true;
 lastModifi = false;
 entryDate;
 chsngedVal;
 isDateUnique = false;
 isGppExperiencing;
 lastEntryDate;
 accDate;
 gpp;
 editEntryDate = [];
 accGender = false;
 accGenderCheck;
 isDropDownVisible = false;
 isDropDownSymptom = false;
 isDropDownRecent = false;
 bodyParts = [];
 inputFieldValue = "";
 inputFieldColor = "";
 showFirstSVG = true;
 showFirstSVG1 = true;
 showFirstSVG2 = true;
 showFirstSVG3 = true;
 showFirstSVG4 = true;
 showFirstSVG5 = true;
 showFirstSVG6 = true;
 showFirstSVG7 = true;
 changeValue = "";
 storedData = "";
 isDropDownOpen = false;
 isPopUpOpen = false;
 isDropDownOpen1 = false;
 isPopUpOpen1 = false;
 isDropDownOpen2 = false;
 isPopUpOpen2 = false;
 isDropDownOpen3 = false;
 isPopUpOpen3 = false;
 isDropDownOpen4 = false;
 isPopUpOpen4 = false;
 isDrop = false;
 result = "";
 currentDate;
 currentDate2;
 isFutureDateError = false;
 selectedValue;
 isDrop2 = false;
 colorChange = "";
 colorChange1 = "";
 colorChange2 = "";
 colorChange3 = "";
 colorChange4 = "";
 colorChange5 = "";
 colorChange6 = "";
 itchinessChange1 = false;
 formattedLastModifiedDate;
 lastModifiedTime;
 accordColor;
 accordColorSymptom;
 itchinessChange = false;
 primaryPage;
 extraImg;
 submitModal = false;
 undersatand = false;
 showFiles = false;
 selectedLabels = [];
 dataLabel;
 recntBtn = []; // Initialize recntBtn as an empty array
 btnColorChange = "dropdown3-activity-btn";
 isButtonDisabled = true;
 accordColorBtn;
 files = [];
 fileIds = [];
 latestImageBase64;
 upLoadedFiles = [];
 isLimitReached = false;
 isLimitReachedUpLoad = true;

 upLoadedLarge = false;
 attachmentIdsValues;
 fileChangeColour;
 fileWork = false;
 fileMessage = false;
 isEditMode = false;
 resultId;
 dataMandatory = false;
 dataMantroyDispable = true;
 currentlyGpp = false;
 changerAdioBtn;
 changerAdioBtn1;
 formattedSymptomData;
 symptomData;
 symptomGpp;
 showMessage = false;
 options1 = [];
 recentActivity = false;
 dateDisable = false;
 firstTime = false;
 recentImages = false;
 allergyIntoleranceData;
 itchBody;
 intensity;
 carePlanTemplateNam;
 whichSymptom;
 fileTitle = UPLOADED_FILE;
 filePath = UPLOADED_FILE_PNG;
 Editdatedisable = false;
 oldimageurl = [];
 totalSize = [];
 vari;



    dynamicValue = DYNAMIC_VALUE;
    // Variable declaration
    userId = ID;
    selectedOption = [];
    accountId;
    personGendercheck;
    fileData;
    lastsymptomid;
    receivedValue;
    gppvaluesradio;
    image;
    image1;
    image2;
    image3;
    image4;
    image5;
    image6;
    userIddata;
    MAX_FILE_COUNT = 5;
    imageUrl;
    acceptedFormats = ".png, .jpg";
    showItchinessModal = false;
    showPainModal = false;
    showMoodModal = false;
    showFatigueModal = false;
    showTemperatureModal = false;
    showrednessModal = false;
    showPustulesModal = false;
    // popup end
    openrpopup() {
        this.ispoup = true;
    }
    closrpopup() {
        this.ispoup = false;
    }
    openPopup1() {
        this.isPopUpOpen1 = true;
        // this.understand = true;
    }
    closePopup1() {
        this.isPopUpOpen1 = false;
    }
    openPopup() {
        this.isPopUpOpen = true;
    }
    closePopup() {
        this.isPopUpOpen = false;
    }
    // lAST MODFIED START
    //Wire method to call the fetchAccountDetails Apex method
    @wire(FETCH_ACCOUNT_DETAILS, {
        careProgramEnrolleeId: "$accountId"
    })
    wiredAccountDetails({
        error,
        data
    }) {
        if (data && data.length > 0) {
            try {
                console.log('data : ',data);
                const enrollee = data[0];

                const personGenderIdentity = enrollee.Account.HealthCloudGA__Gender__pc;
                // Assign values to component properties if needed
                this.accGenderCheck = personGenderIdentity;

                if (this.accGenderCheck === FEMALE) {
                    this.accGender = true;
                }
            } catch (err) {
                this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
                   console.log(err,';1')
            }
        } else if (error) {
            // Handle any errors
            this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
                           console.log(error,';2')
        }
    }

    options = [{
        label: YES,
        value: YES
    },
    {
        label: NO,
        value: NO
    }
        // Add more options as needed
    ];
    toggleDropdown() {
        this.isDropDownVisible = !this.isDropDownVisible;
    }
    // end modified

    // Dropdown 2 state
    // addEvents() {
    // 	window.addEventListener('beforeunload', () => {
    // 		sessionStorage.clear();
    // 	});
    // }
    handleChange(event) {
        this.selectedOption = event.target.value;
    }

    formatDate(date) {
        const options = {
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true
        };
        return date.toLocaleString(LABEL_US, options);
    }


   
  

changerecord(event){
  this.vari = event.detail;
  
          if (this.vari === ITCHINESS) {
   
                this.isPopupOpenDisable = false;
                this.colorChange = "colorChange";
                this.accordColorSymptom = "card-header-accord";
                this.itchinessChange = true;
                this.itchinessChange1 = true;
            } else {
                this.colorChange = "symptoms";
            }
              if (this.vari === REDNESS)  {
           
                this.isPopupOpenDisable = false;
                this.colorChange1 = "colorChange1";
                this.rednessChange = true;
                this.itchinessChange1 = true;
                this.accordColorSymptom = "card-header-accord";
            } else {
                this.colorChange1 = "symptoms";
            }
          if  (this.vari === PAIN)    {
          
                this.isPopupOpenDisable = false;
                this.colorChange2 = "colorChange2";
                this.accordColorSymptom = "card-header-accord";
                this.painChange = true;
                this.itchinessChange1 = true;
            } else {
                this.colorChange3 = "symptoms";
            }
            if (this.vari === PUSTULES)    {
      
                this.isPopupOpenDisable = false;
                this.colorChange3 = "colorChange3";
                this.pustlesChange = true;
                this.itchinessChange1 = true;
                this.accordColorSymptom = "card-header-accord";
            } else {
                this.colorChange3 = "symptoms";
            }
            if  (this.vari === FATIQUE)    {
                this.isPopupOpenDisable = false;
                this.colorChange4 = "colorChange4";
                this.fatiquesChange = true;
                this.itchinessChange1 = true;
                this.accordColorSymptom = "card-header-accord";
            } else {
                this.colorChange4 = "";
            }
              if (this.vari === TEMPERATURE)    {
                this.isPopupOpenDisable = false;
                this.colorChange5 = "colorChange5";
                this.accordColorSymptom = "card-header-accord";
                this.itchinessChange1 = true;
                this.temperatureChange = true;
            } else {
                this.colorChange4 = "";
            }
                if (this.vari === MOOD)    {
                    console.log(this.moodChange,'this.moodChange')
                this.isPopupOpenDisable = false;
                this.moodChange = true;
                this.itchinessChange1 = true;
                this.colorChange6 = "colorChange6";
                this.accordColorSymptom = "card-header-accord";

            } 

            else{
                     this.colorChange6 = "";
            }
            
            
          

}
    renderedCallback() {
        if (this.recntBtn && this.recntBtn.length > 0) {
            this.recntBtn?.forEach((item) => {
                let clickedElement = this.template.querySelector(
                    `[data-name='${item}']`
                );
                if (
                    clickedElement &&
                    (clickedElement.style.backgroundColor === "" ||
                        clickedElement.style.backgroundColor === "white")
                ) {
                    // If the background color is white, it means it's not selected
                    clickedElement.style.backgroundColor = "#C6AA76"; // Set to selected color
                    clickedElement.style.fontFamily = "Eina-Semibold";

                } else {
                    // If the background color is not white, it means it's selected
                    if (clickedElement) {
                        clickedElement.style.backgroundColor = "white"; // Reset to original color
                    }
                    // this.recntBtn = this.recntBtn.filter(option => option !== selectedOption);
                }
            });
        }
        let globalThis = window;
        globalThis.addEventListener("beforeunload", this.handlePageRefresh);


    }

    connectedCallback() {

        let globalThis = window;
        loadStyle(this, FILE_UPLOADER_CSS);
        loadStyle(this, SYMPTOMS_IMG);

        const queryParams = new URLSearchParams(globalThis.location?.search);
        // Get the value of the 'value' parameter
        this.receivedValue = queryParams.get("value");
        globalThis.history.replaceState({},
            globalThis.document?.title,
            globalThis.location?.pathname
        );
        // Check if the value is received
        if (this.receivedValue) {
            try {
                this.lastModifi = false;
            } catch (error) {
                this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
                    console.log(error,';3')
            }

            // You can use the value here as needed
        }
        //This code retrieves data labeled as 'recentactivity' from the session storage without altering custom labels.

        let recntBtn = globalThis?.sessionStorage.getItem("recentActivity");
        //The use of setInterval ensures optimal timing for thumb label position updates, enhancing animation smoothness and performance
        Promise.resolve().then(() => {
            recntBtn?.forEach((item) => {
                let element = this.template.querySelector(`[data-name='${item}']`);
                if (element) {
                    element.style.backgroundColor = "#C6AA76";
                    element.style.fontFamily = "Eina-Semibold";
                }

                this.accordColor = "card-header-accord";
                this.accordColorBtn = "card-header-accord";
                this.recentactivity = true;
            });
        });
        const currentURL = globalThis.location?.href;
        // Create a URL object
        const urlObject = new URL(currentURL);
        // Get the path
        const path = urlObject.pathname;
        // Split the path using '/' as a separator
        const pathComponents = path.split("/");
        // Find the component you need (in this case, 'Branded')
        const desiredComponent = pathComponents.find((component) => [BRANDED_URL.toLowerCase(), UN_ASSIGNED_URL.toLowerCase()].includes(
            component.toLowerCase()
        ));
        if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
            this.urlq = BRANDED_URL_NAVI;
        } else {
            this.urlq = UNASSIGNED_URL_NAVI;
        }

        //This code retrieves data labeled as 'stopprcocess' from the session storage without altering custom labels.
        this.primaryPage = globalThis?.localStorage.getItem("stopprcocess");
        if (this.primaryPage === DATE_INPUT_PAGE) {
            this.dataMandatory = false;
        }
        //This code retrieves data labeled as 'symptomlastid' from the session storage without altering custom labels.
        this.lastsymptomid = globalThis?.localStorage.getItem("symptomlastid");
        try {
            GET_ENROLLE({
                userId: this.userId
            })
                // Null data is checked and AuraHandledException is thrown from the Apex
                .then((result) => {
                    if (result !== null) {
                        if (result[0].patientEnrolle !== null) {
                            this.accountId = result[0].patientEnrolle.Id;
                        } else if (result[0].error !== null) {
                            this.showError = true;
                            this.errorMessage = result[0].error;
                        }
                    }
                })
                .catch((error) => {
                    // Handle any errors occurring during the promise chain
                    this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
                       console.log(error,';second')
                });
        } catch (error) {
            // Handle any synchronous errors outside the promise chain
            this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
            console.log(error,';first')
        }




            //This code retrieves data labeled as 'Time' from the session storage without altering custom labels.
            const localStorageValue = globalThis?.localStorage.getItem(
                "Time",
                this.resultId
            );
            //This code retrieves data labeled as 'gppvalues' from the session storage without altering custom labels.
            this.sessionstrogegpp = globalThis?.sessionStorage.getItem(
                "gppvalues",
                this.resultId
            );
            this.gppvaluesradio = this.sessionstrogegpp;
            this.time = localStorageValue;
      
          




        // this.handleSaveDate();
        this.currentDate = new Date().toISOString().slice(0, 10);
        const today = new Date();
        this.maxDate = today.toISOString().slice(0, 10);
        // window.addEventListener('beforeunload', this.handlePageRefresh);
        //The use of setInterval ensures optimal timing for thumb label position updates, enhancing animation smoothness and performance

        this.currentDate = new Date().toISOString().slice(0, 10);
    }
    // disconnectedCallback() {
    // 	window.removeEventListener('beforeunload', this.handlePageRefresh);
    // }
    handlePageRefresh(event) {
        let globalThis = window;
        globalThis.sessionStorage?.clear();
        event.returnValue = "";
    }
    handleEditDate() {
        this.isEditMode = true;
    }

    get dropdownButtonClass() {
        return this.isDropDownOpen ?
            "dropdown-arrow-button dropdown-arrow-button-open" :
            "dropdown-arrow-button";
    }
    get dropdownButtonClass1() {
        return this.isDropDownOpen1 ?
            "dropdown-arrow-button dropdown-arrow-button-open" :
            "dropdown-arrow-button";
    }
    get dropdownButtonClass2() {
        return this.isDropDownOpen2 ?
            "dropdown-arrow-button dropdown-arrow-button-open" :
            "dropdown-arrow-button";
    }
    get dropdownButtonClass3() {
        return this.isDropDownOpen3 ?
            "dropdown-arrow-button dropdown-arrow-button-open" :
            "dropdown-arrow-button";
    }
    get dropdownButtonClass4() {
        return this.isDropDownOpen4 ?
            "dropdown-arrow-button dropdown-arrow-button-open" :
            "dropdown-arrow-button";
    }

    toggleDropdown1() {
        this.isDropDownOpen1 = !this.isDropDownOpen1;
        this.isDropDownOpen2 = false;
        this.isDropDownOpen4 = false;
        this.isDropDownOpen3 = false;
    }
    toggleDropdown2() {
        this.isDropDownOpen2 = !this.isDropDownOpen2;
        this.isDropDownOpen3 = false;
        this.isDropDownOpen1 = false;
        this.isDropDownOpen4 = false;

    }
    toggleDropdown3() {
        this.isDropDownOpen3 = !this.isDropDownOpen3;
        this.isDropDownOpen2 = false;
        this.isDropDownOpen1 = false;
        this.isDropDownOpen4 = false;
        //The setTimeout with a small delay ensures UI updates occur after the current rendering tasks, preventing glitches.

        if (this.recntBtn && this.recntBtn.length > 0) {
            this.recntBtn?.forEach((item) => {
                let clickedElement = this.template.querySelector(
                    `[data-name='${item}']`
                );
                if (
                    clickedElement &&
                    (clickedElement.style.backgroundColor === "" ||
                        clickedElement.style.backgroundColor === "white")
                ) {
                    // If the background color is white, it means it's not selected
                    clickedElement.style.backgroundColor = "#C6AA76"; // Set to selected color
                    clickedElement.style.fontFamily = "Eina-Semibold";
                    // this.recntBtn.push(selectedOption);
                } else {
                    // If the background color is not white, it means it's selected
                    if (clickedElement) {
                        clickedElement.style.backgroundColor = "white"; // Reset to original color
                    }
                    // this.recntBtn = this.recntBtn.filter(option => option !== selectedOption);
                }
            });
        }

    }
    toggleDropdown4() {
        this.isDropDownOpen4 = !this.isDropDownOpen4;
        this.isDropDownOpen3 = false;
        this.isDropDownOpen2 = false;
        this.isDropDownOpen1 = false;
    }






    handlechnagedropdown() {
        let globalThis = window;
        //This code retrieves data labeled as from the session storage without altering custom labels using for all function.
        const changeValue = globalThis?.sessionStorage.getItem("myData");
        const changeValue1 = globalThis?.sessionStorage.getItem("redness");
        const changeValue2 = globalThis?.sessionStorage.getItem("Paindata");
        const changeValue3 = globalThis?.sessionStorage.getItem("Pustule");
        const changeValue6 = globalThis?.sessionStorage.getItem("mood");
        const changeValue7 = globalThis?.sessionStorage.getItem("fatigue");
        const changeValue8 = globalThis?.sessionStorage.getItem("temprature");
        globalThis?.sessionStorage.setItem("syptombtn", true);

        if (
            !changeValue &&
            !changeValue1 &&
            !changeValue2 &&
            !changeValue3 &&
            !changeValue6 &&
            !changeValue7 &&
            !changeValue8 &&
            this.chsngedVal === YES
        ) {
            this.opensubmitModal();
        } else if (this.chsngedVal === NO) {
            this.accordColorSymptom = "card-header-accord";
            this.itchinessChange1 = true;
            this.isDropDownOpen3 = !this.isDropDownOpen3;
            this.isDropDownOpen2 = false;
            this.isDropDownOpen1 = false;
            this.isDropDownOpen4 = false;
        } else {
            this.isDropDownOpen3 = !this.isDropDownOpen3;
            this.isDropDownOpen2 = false;
            this.isDropDownOpen1 = false;
            this.isDropDownOpen4 = false;
        }
    }
    handleButtonClick() {
        let globalThis = window;
        //This code retrieves data labeled as from the session storage without altering custom labels for all function.
        const changeValue = globalThis?.sessionStorage.getItem("myData");
        const changeValue1 = globalThis?.sessionStorage.getItem("redness");
        const changeValue2 = globalThis?.sessionStorage.getItem("Paindata");
        const changeValue3 = globalThis?.sessionStorage.getItem("Pustule");
        const changeValue6 = globalThis?.sessionStorage.getItem("mood");
        const changeValue7 = globalThis?.sessionStorage.getItem("fatigue");
        const changeValue8 = globalThis?.sessionStorage.getItem("temprature");
        const changeValue9 = globalThis?.sessionStorage.getItem("gpp");
        const symptbtn = globalThis?.sessionStorage.getItem("syptombtn");
        if (
            !changeValue &&
            !changeValue1 &&
            !changeValue2 &&
            !changeValue3 &&
            !changeValue6 &&
            !changeValue7 &&
            !changeValue8 &&
            changeValue9?.toLocaleLowerCase() === "yes"
        ) {
            this.opensubmitModal();
            this.isPopupOpenDisable = false;
        } else if (
            (!symptbtn || symptbtn === "false") &&
            changeValue9?.toLocaleLowerCase() === "yes"
        ) {
            this.opensubmitModal();
            this.isPopupOpenDisable = false;
        } else {
            this.openundersatand();
            this.isPopupOpenDisable = false;
        }
    }
    opensubmitModal() {
        this.submitModal = true;
        document.body.style.overflow = "hidden";
    }
    closesubmitModal() {
        this.submitModal = false;
        document.body.style.overflow = ""; // Reset to default
    }
    openundersatand() {
        let globalThis = window;
        this.undersatand = true;
        document.body.style.overflow = "hidden";
        this.submitModal = false;
        globalThis?.localStorage.clear();
    }
    closeundersatand() {
        this.undersatand = false;
        document.body.style.overflow = ""; // Reset to default
    }
    addsymtom() {
        if (!this.isDropDownOpen) {
            this.isDropDownOpen2 = true;
            this.isDropDownOpen1 = false;
            this.submitModal = false;
            document.body.style.overflow = ""; // Reset to default
        } else {
            this.isDropDownOpen2 = false;
            this.isPopUpOpen = false;
        }
    }

    understand() {
        let globalThis = window;
        globalThis.location.assign(this.urlq + SYMPTOM_GRAPH_PAGE);
        globalThis?.sessionStorage.setItem(DYNAMIC_VALUE,'someDynamicValue')
    }
    openItchinessModal() {
        this.showItchinessModal = true;
        document.body.style.overflow = "hidden";
    }
    closeItchinessModal() {
        this.showItchinessModal = false;
        document.body.style.overflow = ""; // Reset to default
    }
    // PainModal
    openPainModal() {
        this.showPainModal = true;
        document.body.style.overflow = "hidden";
    }
    closePainModal() {
        let globalThis = window;
        this.showPainModal = false;
        document.body.style.overflow = ""; // Reset to default
        // Store data labeled as 'Paindatavalues' in the session storage without altering custom labels.
        globalThis?.sessionStorage.setItem("Paindatavalues", 0);
    }
    // RednessModal
    openRednessModal() {
        this.showrednessModal = true;
        document.body.style.overflow = "hidden";
    }
    closeRednessModal() {
        let globalThis = window;
        this.showrednessModal = false;
        document.body.style.overflow = ""; // Reset to default
        // Store data labeled as 'rednessvalues' in the session storage without altering custom labels.
        globalThis?.sessionStorage.setItem("rednessvalues", 0);
    }
    // pustel model
    openPustulesModal() {
        this.showPustulesModal = true;
        document.body.style.overflow = "hidden";
    }
    closePustulesModal() {
        let globalThis = window;
        this.showPustulesModal = false;
        document.body.style.overflow = ""; // Reset to default
        // Store data labeled as 'Pustulevalues' in the session storage without altering custom labels.
        globalThis?.sessionStorage.setItem("Pustulevalues", 0);
    }
    // Fatigue Modal
    openFatigueModal() {
        this.showFatigueModal = true;
        document.body.style.overflow = "hidden";
    }
    closeFatigueModal() {
        let globalThis = window;
        this.showFatigueModal = false;
        document.body.style.overflow = ""; // Reset to default
        // Store data labeled as 'fatiguevalues' in the session storage without altering custom labels.
        globalThis?.sessionStorage.setItem("fatiguevalues", 0);
    }
    // Temperature Modal
    openTemperatureModal() {
        this.showTemperatureModal = true;
        document.body.style.overflow = "hidden";
    }
    closeTemperatureModal() {
        this.showTemperatureModal = false;
        document.body.style.overflow = "";
    }
    // Mood Modal
    openMoodModal() {
        this.showMoodModal = true;
        document.body.style.overflow = "hidden";
    }
    closeMoodModal() {
        this.showMoodModal = false;
        document.body.style.overflow = ""; // Reset to default
    }
    // files upload
    openfiles() {
        this.showFiles = true;
        document.body.style.overflow = "hidden";
    }
    closefiles() {
        this.showFiles = false;
        document.body.style.overflow = ""; // Reset to default
    }
    handleClickactivites(event) {
        const clickedElement = event.target;
        const elementClass = clickedElement.classList.value;

        if (elementClass.includes(this.btnColorChange)) {
            const selectedOption = clickedElement.getAttribute("data-name");
            // Toggle the background color and update the selected values

            // Initialize this.recntBtn as an array if it's not already initialized
            if (!this.recntBtn) {
                this.recntBtn = [];
            }

            if (
                clickedElement.style.backgroundColor === "" ||
                clickedElement.style.backgroundColor === "white"
            ) {
                // If the background color is white, it means it's not selected
                clickedElement.style.backgroundColor = "#C6AA76"; // Set to selected color
                clickedElement.style.fontFamily = "Eina-Semibold";
                this.recntBtn.push(selectedOption);
            } else {
                // If the background color is not white, it means it's selected
                clickedElement.style.backgroundColor = "white"; // Reset to original color
                this.recntBtn = this.recntBtn.filter(
                    (option) => option !== selectedOption
                ); // Remove the selected option from the array
            }
        }
    }

    updatedRecordId;


  
    handleClickForAccept(event) {
       
        console.log('event',event)
        let globalThis = window;
        // Close all dropdowns except the fourth one
        this.isDropDownOpen4 = true;
        this.isDropDownOpen3 = false;
        this.isDropDownOpen2 = false;
        this.isDropDownOpen1 = false;
        // Store data labeled as 'recentactivity' in the session storage without altering custom labels.
        globalThis?.sessionStorage.setItem("recentActivity", this.recntBtn);
        // Set the class based on the condition whether recntBtn has only one item or not
        this.accordColorBtn = this.recntBtn ?
            "card-header-accord" :
            "another-class";
        try {
            this.recentActivity = true;
            if (this.lastsymptomid) {
                this.updatedRecordId = UPDATE_RECENT_VALUE({
                    symptomTrackerId: this.lastsymptomid,
                    valuesToUpdate: this.recntBtn
                });
                this.recentActivity = true;
            } else {
                this.updatedRecordId = UPDATE_RECENT_VALUE({
                    symptomTrackerId: this.resultId,
                    valuesToUpdate: this.recntBtn
                });
                this.recentActivity = true;
            }
        } catch (error) {
            this.error("Error occurred:", error.message, "Variant 1");
                console.log(error,';4')
        }
    }
    handleFileInputChange(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newImageUrls = [...this.imageUrls];
            const newtotalsizeimg = [...this.totalSize];
            const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
            const maxImagesAllowed = 4;

            if (newImageUrls.length + files.length > maxImagesAllowed) {
                // Trying to upload more than 5 images, show error message
                this.isLimitReached = true;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.type.includes("image")) {
                    //   this.totalSize += file.size;

                    if (file.size <= maxFileSize) {
                        newtotalsizeimg.push(file.size);
                        const reader = new FileReader();
                        reader.onload = () => {
                            newImageUrls.push(reader.result);
                            this.imageUrls = [...newImageUrls];
                        };
                        reader.readAsDataURL(file);

                        let sum = 0;
                        for (let j = 0; j < this.totalSize.length; j++) {
                            sum += this.totalSize[j];
                            if (sum > maxFileSize) {
                                this.upLoadedLarge = true;
                                this.totalSize.splice(j, 1);
                            }
                        }
                    } else {
                        // Individual file size exceeds 5MB, show error message
                        this.upLoadedLarge = false;
                        this.totalSize.pop();
                    }
                } else {
                    // Not an image file, show error message
                    this.upLoadedLarge = false;
                }
            }
        } else {
            // No files selected or none of them are images
            // this.imageUrls = [];
               this.upLoadedLarge = false;
            this.isLimitReached = false;
        }
    }

    handleClickpdf() {
        //  this.imageUrls = [];

        this.fileMessage = true;
        this.isDropDownOpen1 = false;
        this.isDropDownOpen2 = false;
        this.isDropDownOpen1 = false;
        this.isDropDownOpen4 = false;
        let newArray = [];
        // Get the file contents from imageUrls and save them
        for (let i = 0; i < this.imageUrls.length; i++) {
            if (!this.oldimageurl.includes(this.imageUrls[i])) {
                newArray.push(this.imageUrls[i]);
                this.oldimageurl = [...this.oldimageurl, this.imageUrls[i]];
            }
        }
        const fileContents = newArray.map((imageUrl) => imageUrl.split(",")[1]);
        this.recentImages = true;
        if (fileContents) {
            this.fileChangeColour = "card-header-accord";
            this.fileWork = true;
        }
        if (this.resultId) {
            try {
                SAVE_FILES({
                    fileContents,
                    parentId: this.resultId,
                    fileTitle: this.fileTitle,
                    filePath: this.filePath
                })
                    // Null data is checked and AuraHandledException is thrown from the Apex
                    .then((attachmentIds) => {
                        this.attachmentIdsValues = attachmentIds;
                        // Check the value of this.resultId
                        try {
                            CREATE_CONTENT_DOCUMENT_LINKS({
                                fileIds: this.attachmentIdsValues,
                                symptomTrackerId: this.resultId
                            });
                        } catch (error) {
                            this.error("Error occurred:", error.message, "Variant 1");
                                console.log(error,';6')
                        }
                    })
                    .catch((error) => {
                        // Handle error if needed
                        this.error("Error occurred:", error.message, "Variant 1");
                            console.log(error,';7')
                    });
            } catch (error) {
                // Handle synchronous error if needed
                this.error("Error occurred:", error.message, "Variant 1");
                    console.log(error,';8')
            }
        }
        if (this.resultId !== "") {
            try {
                SAVE_FILES({
                    fileContents,
                    parentId: this.lastsymptomid,
                    fileTitle: this.fileTitle,
                    filePath: this.filePath
                })
                    // Null data is checked and AuraHandledException is thrown from the Apex
                    .then((attachmentIds) => {
                        this.attachmentIdsValues = attachmentIds;
                        // Check the value of this.resultId
                        try {
                            CREATE_CONTENT_DOCUMENT_LINKS({
                                fileIds: this.attachmentIdsValues,
                                symptomTrackerId: this.lastsymptomid
                            });
                        } catch (error) {
                            this.error("Error occurred:", error.message, "Variant 1");
                                console.log(error,';2')
                        }
                    })
                    .catch((error) => {
                        // Handle error if needed
                        this.error("Error occurred:", error.message, "Variant 1");
                            console.log(error,';2')
                    });
            } catch (error) {
                // Handle synchronous error if needed
                this.error("Error occurred:", error.message, "Variant 1");
                    console.log(error,';2')
            }
        }
    }
    // Call this method to trigger the deletion
    async removeImage(event) {
        const index = event.target.dataset.index;
        this.imageUrls.splice(index, 1);

        if (this.imageUrls.length > 4) {
            this.isLimitReached = true;
        } else {
            this.isLimitReached = false;
        }
        try {
            await DELETE_CONTENT_DOCUMENT_LINKS({
                symptomTrackerId: this.lastsymptomid
            });
        } catch (error) {
            // Handle synchronous error if needed
            console.error(error);

        }

    }



    async handleSaveDate() {
        let globalThis = window;
        let accForInsert = this.accountId;
        let myBoolean = false;
        // Ensure isDateUnique is resolved before proceeding
        this.checkDateUniqueness();
        if (this.isDateUnique === false) {
            if (!this.lastsymptomid) {
                this.resultId = await RECORD_INSERT_STS({
                    accId: accForInsert,
                    editEntryDate: this.currentDate2
                });
            } else {
                this.resultId = await RECORD_INSERTST_UPDATE({
                    symptomTrackerId: this.lastsymptomid,
                    gpp: myBoolean,
                    editEntryDate: this.currentDate2
                });
            }
            if (this.resultId) {
                // Store data labeled as 'Time' in the session storage without altering custom labels.
                globalThis?.localStorage.setItem("Time", this.resultId);
                // Store data labeled as 'gppvalues' in the session storage without altering custom labels.
                globalThis?.sessionStorage.setItem("gppvalues", this.resultId);
                this.dataMandatory = true;
                this.dataMantroyDispable = true;
                this.Editdatedisable = true;
            }
        }

    }
    checkDateUniqueness() {
        if (this.currentDate) {
            CHECK_UNIQUE_DATE({
                editedDate: this.currentDate,
                accountId: this.accountId
            })
                .then(result => {
                    this.result = result;
                    if (this.result) {
                        this.isDateUnique = false;
                    } else {
                        this.isDateUnique = true;
                        this.dataMantroyDispable = true;
                    }
                })
                .catch(error => {
                    this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT_TOAST);
                        console.log(error,';iiiii')
                });
        }
    }





    handleDateChange(event) {
        //localStorage.clear()
        this.currentDate = event.target.value;
        this.currentDate2 = event.target.value;
        this.dataMantroyDispable = false; // Enable the 'Submit' button
        const selectedDate = new Date(this.currentDate);
        const today = new Date();
        if (selectedDate > today) {
            this.showText = true; // Show the message
            this.futuredatedisable = true;
            this.dataMantroyDispable = true; // Show the future date error message
        } else {
            this.showText = false; // Hide the message
            this.futuredatedisable = false; // Hide the future date error message
        }
        // Call the checkDateUniqueness function
        this.checkDateUniqueness();
    }

  

    handleRadioChange(event) {
        this.chsngedVal = event.detail.value;
        this.gpp = this.chsngedVal;

        // Assuming that this.chsngedVal is a string, use 'true' (string) instead of true (boolean)
        this.showMessage = this.chsngedVal === YES;
    }
    handleSavegpp() {
        
        let globalThis = window;
        // Check if sessionStorage values are empty
        //This code retrieves data labeled as  from the session storage without altering custom labels for all function.
        const changeValue = globalThis?.sessionStorage.getItem("myData");
        const changeValue1 = globalThis?.sessionStorage.getItem("redness");
        const changeValue2 = globalThis?.sessionStorage.getItem("Paindata");
        const changeValue3 = globalThis?.sessionStorage.getItem("Pustule");
        const changeValue6 = globalThis?.sessionStorage.getItem("mood");
        const changeValue7 = globalThis?.sessionStorage.getItem("fatigue");
        const changeValue8 = globalThis?.sessionStorage.getItem("temperature");
        if (
            !changeValue &&
            !changeValue1 &&
            !changeValue2 &&
            !changeValue3 &&
            !changeValue6 &&
            !changeValue7 &&
            !changeValue8 &&
            this.chsngedVal === YES
        ) {
            this.opensubmitModal();
            this.accordColor = "card-header-gpp";
            // Save radio value
            this.changerAdioBtn = true;
            this.isPopUpOpen = true;
            this.currentlyGpp = true;

            try {
                UPDATE_GPP_VALUE({
                    symptomTrackerId: this.resultId?
                        this.resultId :
                        this.lastsymptomid,
                    gpp: this.changerAdioBtn
                })
                    // Null data is checked and AuraHandledException is thrown from the Apex
                    .then((result) => {
                        console.log(result,'result')
                        if (result) {

                            console.log(result,'result')
                            this.accordColor = "card-header-gpp";
                        }
                    })
                    .catch((error) => {
                        this.error("Error occurred:", error.message, "Variant 1");
                    })
                    .finally(() => {
                        this.isEditMode = false;
                        globalThis?.sessionStorage.setItem("gpp", this.chsngedVal);
                    });
            } catch (err) {
                this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
            }
        } else if (this.lastsymptomid || this.chsngedVal === NO) {
            this.currentlyGpp = true;
            this.isPopupOpenUndersatand = true;
            this.isDropDownOpen2 = true;
            this.isDropDownOpen1 = false;
            this.accordColor = "card-header-gpp";
            this.changerAdioBtn = false;
            try {
                UPDATE_GPP_VALUE({
                    symptomTrackerId: this.lastsymptomid ?
                        this.lastsymptomid :
                        this.resultId,
                    gpp: this.changerAdioBtn
                });
               globalThis?.sessionStorage.setItem("gpp", this.chsngedVal);
                    console.log(this.chsngedVal,'result')
                    if(this.chsngedVal === 'No'){
                        this.isPopupOpenDisable = false;
                    }
            } catch (error) {
                this.error("Error occurred:", error.message, "Variant 1");
            }
        }
    }

    @wire(GET_LAST)
    wiredLastEntryDate({
        error,
        data
    }) {
        // Null data is checked and AuraHandledException is thrown from the Apex
        if (data) {
            console.log(data,';jjjj')
            try {
                for (let careplanimage of data) {
                    if (careplanimage.Name === ITCHINESS) {
                        this.imageItchiness = careplanimage.BI_PSP_Symptom_image__c;
                    } else if (careplanimage.Name === REDNESS) {
                        this.imageRedness = careplanimage.BI_PSP_Symptom_image__c;
                    } else if (careplanimage.Name === PAIN) {
                        this.imagePain = careplanimage.BI_PSP_Symptom_image__c;
                    } else if (careplanimage.Name === PUSTULES) {
                        this.imagePustules = careplanimage.BI_PSP_Symptom_image__c;
                    } else if (careplanimage.Name === FATIQUE) {
                        this.imageFatigue = careplanimage.BI_PSP_Symptom_image__c;
                    } else if (careplanimage.Name === TEMPERATURE) {
                        this.imageTemperature = careplanimage.BI_PSP_Symptom_image__c;
                    } else if (careplanimage.Name === MOOD) {
                        this.imageMood = careplanimage.BI_PSP_Symptom_image__c;
                    }
                }

                // const desiredWidth = '100px';
                // const desiredHeight = '100px';
                const imgTagRegex = /<img\s+[^>]*src='([^']+)'[^>]*>/giu;

                const formatImageContent = (image) =>
                    image.replace(imgTagRegex, (match, src) => `<img src='${src}'>`);
                // 			const formatImageContent = (image) =>
                // image.replace(imgTagRegex, (match, src) => <img src='${src}'>);

                this.image = formatImageContent(this.image);
                this.image1 = formatImageContent(this.image1);
                this.image2 = formatImageContent(this.image2);
                this.image3 = formatImageContent(this.image3);
                this.image4 = formatImageContent(this.image4);
                this.image5 = formatImageContent(this.image5);
                this.image6 = formatImageContent(this.image6);
            } catch (err) {
                // this.showToast(ERROR_MESSAGE, err.message, errorvariant);
                console.error(err)
            }
        } else if (error) {
            // this.showToast(ERROR_MESSAGE, error.body.message, errorvariant);
            // Handle error
            console.error(error)
        }
    }
    @wire(GET_SYMPTOM_RECORD_DATA, {
        symptomTrackerId: "$lastsymptomid"
    })
    wiredGetsymptomrecorddata({
        error,
        data
    }) {
        if (data && data !== null) {
            try {
                this.Editdatedisable = true;
                this.satrdate = false;
                this.symptomData = data[0].BI_PSP_EditEntrydates__c;
                this.symptomGpp = data[0].BI_PSP_Are_you_currently_experiencing__c;
                this.chsngedVal = this.symptomGpp;
                let getsymptombtn = data[0].BI_PSP_Recent_Activities__c;
                if (this.chsngedVal === true) {
                    this.chsngedVal = YES;
                } else {
                    this.chsngedVal = NO;
                }
                this.currentlyGpp = true;
                this.dateDisable = true;

                if (this.symptomGpp === true) {
                    this.showMessage = true;
                }

                if (this.symptomData) {
                    this.dataMandatory = true;
                }

                this.symptomGpp = true;

                if (getsymptombtn) {
                    this.recentActivity = true;
                    this.accordColorBtn = "card-header-accord";
                }

                for (let symptomrecord of data) {
                    let getsymtomdate = symptomrecord.BI_PSP_EditEntrydates__c;
                    let getsymptomrecentbtn = symptomrecord.BI_PSP_Recent_Activities__c;
                    this.currentDate2 = new Date(getsymtomdate)
                        .toISOString()
                        ?.split("T")[0];
                    this.recntBtn = getsymptomrecentbtn?.split(";");
                    this.recentActivity = true;
                    this.accordColor = "card-header-gpp";
                    this.accordColorBtn = "card-header-accord";
                    //The use of setInterval ensures optimal timing for thumb label position updates, enhancing animation smoothness and performance
                    this.recntBtn?.forEach((item) => {
                        let element = this.template.querySelector(
                            `[data-name='${item}']`
                        );
                        if (element) {
                            element.style.backgroundColor = "#C6AA76";
                            element.style.fontFamily = "Eina-Semibold";
                        }
                    });
                }
            } catch (err) {
                this.err(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
            }
        } else if (error) {
            this.err(ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
        }
    }

    @wire(GET_CASE_IMAGE_URL, {
        symptomTrackerId: "$lastsymptomid"
    })
    wiredgetCaseImageURL({
        data, error
    }) {
        if (data && data !== null) {
            try {
                this.caseImageURL = data;
                this.fileMessage = true;
                this.fileChangeColour = "card-header-accord";
                if (this.firstTime === false) {
                    let splitArray = data?.map((obj) => obj.split("data:")[1]);
                    for (let record of splitArray) {
                        if (record !== "") {
                            this.imageUrls = [...this.imageUrls, "data:" + record];
                            this.oldimageurl = [...this.oldimageurl, "data:" + record];
                        }
                    }
                    this.firstTime = true;
                    this.recentImages = true;
                } else if (this.imageUrls.length > 0) {
                    this.fileChangeColour = "card-header-accord";
                }
            } catch (err) {
                this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
                // Handle the error as needed
            }
        }
        else if (error) {
            this.err(ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
        }
    }

    readAsDataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                resolve(`data:image/${blob.type.split("/")[1]};base64,${base64String}`);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(blob);
        });
    }
    checksubmit() {
        if (this.carePlanTemplateName) {
            this.openundersatand();
        }
    }
    @wire(GET_ALLERGYINTOLERANCE_DATA, {
        symptomTrackerId: "$lastsymptomid"
    })
    wiredAllergyIntoleranceData({
        error,
        data
    }) {
        if (data && data !== null) {
            try {
                this.isPopupOpenDisable = false;
                this.whichSymptom = data;
                // ... (Previous code)
                for (let record of data) {
                    // Access values of each record
                    this.intensity = record.BI_PSP_Intensity__c;
                    this.carePlanTemplateName =
                        record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;
                    // Compare with the string 'Itchiness'
                    if (this.carePlanTemplateName === ITCHINESS) {
                        this.itchinessChange = true;
                        this.itchinessChange1 = true;
                        //As these are css class names, we haven't used custom label for this scenario
                        this.accordColorSymptom = "card-header-accord";
                    }
                    if (this.carePlanTemplateName === REDNESS) {
                        this.rednessChange = true;
                        //As these are css class names, we haven't used custom label for this scenario
                        this.accordColorSymptom = "card-header-accord";
                        this.itchinessChange1 = true;
                    }
                    if (this.carePlanTemplateName === PAIN) {
                        this.painChange = true;
                        //As these are css class names, we haven't used custom label for this scenario
                        this.accordColorSymptom = "card-header-accord";
                        this.itchinessChange1 = true;
                    }
                    if (this.carePlanTemplateName === PUSTULES) {
                        this.pustlesChange = true;
                        this.itchinessChange1 = true;
                        //As these are css class names, we haven't used custom label for this scenario
                        this.accordColorSymptom = "card-header-accord";
                    }
                    if (this.carePlanTemplateName === FATIQUE) {
                        this.fatiquesChange = true;
                        this.itchinessChange1 = true;
                        //As these are css class names, we haven't used custom label for this scenario
                        this.accordColorSymptom = "card-header-accord";
                    }
                    if (this.carePlanTemplateName === TEMPERATURE) {
                        this.itchinessChange1 = true;
                        this.temperatureChange = true;
                        //As these are css class names, we haven't used custom label for this scenario
                        this.accordColorSymptom = "card-header-accord";
                    }
                    if (this.carePlanTemplateName === MOOD) {
                        this.itchinessChange1 = true;
                        this.moodChange = true;
                        //As these are css class names, we haven't used custom label for this scenario
                        this.accordColorSymptom = "card-header-accord";
                    }
                }
                // ... (Rest of the code)
            } catch (err) {
                console.log('err : ',err);
                this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT_TOAST);
            }
        } else if (error) {
             console.log('err : ',error);
            this.showToast(ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
        }
    }

    // showToast used for all the error messages caught
    showToast(title, message, variant) {
        if (typeof window !== "undefined") {
            const event = new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            });
            this.dispatchEvent(event);
        }
    }

    lastModifiedDate;
    @wire(GET_SYMPTOM_TRACKER_DETAILS, {
        careProgramEnrolleeId: "$accountId"
    })
    wiredResult({
        data, error
    }) {
        try {
            if (data) {
                this.lastModifiedDate = data.lastModifiedDate;
                this.lastModifiedTime = data.lasttime;
                let newdate3 = this.lastModifiedTime.split(", ");
                const dateTime = new Date(newdate3);
                // Get the hours, minutes, and seconds from the Date object
                const hours = dateTime.getHours();
                const minutes = dateTime.getMinutes();
                const seconds = dateTime.getSeconds();
                // Format the time in HH:mm:ss format (24-hour format)
                const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                this.lastModifi = true;
                // Get the current date and time
                let date = new Date(this.lastModifiedDate);
                let options = {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                };
                let formattedDate = date.toLocaleString(undefined, options);
                let newdate = formattedDate.split(", ");
                this.formattedLastModifiedDate = `${newdate[0]} at ${formattedTime}`;
                // Log the extracted time
            }

            else if (error) {
                this.err(ERROR_MESSAGE, error.body.message, ERROR_VARIANT_TOAST);
            }
        } catch (err) {
            this.error("An error occurred:", err);
        }
    }
}