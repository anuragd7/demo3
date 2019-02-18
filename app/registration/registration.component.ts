import {
  Component,
  AfterViewInit,
  OnInit,
  ViewContainerRef,
  ViewChild,
  ElementRef
} from "@angular/core";
import { UserAccount } from "../models/user.model";
import { RouterExtensions } from "nativescript-angular/router/router-extensions";
// import { Subscription } from "rxjs/Subscription";
// import listViewModule = require("nativescript-ui-listview");
// import { ObservableArray } from "data/observable-array";
import { Page } from "ui/page";
// import scrollViewModule = require("ui/scroll-view");
import * as firebase from "nativescript-plugin-firebase";
import { UserStatusService } from "../services/userStatus.service";
// import { LoadingService } from "../services/loading.service";
import { TabNavigationService } from "../services/tab-navigation.service";
// import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { FirebaseAuthService } from "../services/firebase-auth.service";
import { FirebaseCreateService } from "../services/firebase-create.service";
import { DeviceDetailService } from "../services/device-detail.service";
// import { ListViewEventData } from "nativescript-ui-listview";
// import { ModalDialogService } from "nativescript-angular/directives/dialogs"; // For kaleido modal login and signup view

// import { GradeDataArray, SubjectDataArray } from "./registration-items";
// import { isEnabled, enableLocationRequest, getCurrentLocation } from "nativescript-geolocation";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { FormControl, FormGroup, Validators } from "@angular/forms"; // for form validation

import { action, alert } from "ui/dialogs";
import * as camera from "nativescript-camera";
import { Image } from "ui/image";
import * as imageSource from "image-source";
import * as enums from "ui/enums";
import * as imagepicker from "nativescript-imagepicker"; // for picking image from photo gallery
// import * as dialogs from "ui/dialogs"; // for the dialog on form validation checking
// import { PermissionComponent } from "./permission/permission.component";
// import { Color } from "color"; //to set the color of the radlist view selection
import { ModalComponent } from "../shared/modal/modal.component";
// import * as Toast from "nativescript-toast"; // to show toast if permission refused
import { SlidesComponent } from "nativescript-ngx-slides";
import { getBoolean } from "tns-core-modules/application-settings/application-settings";
import { Countries } from "../shared/countries/countries";

// New filterable list plugin for country selection
import * as elementRegistryModule from "nativescript-angular/element-registry";
// elementRegistryModule.registerElement(
//   "FilterSelect",
//   () => require("nativescript-filter-select").FilterSelect
// );
// next 4 lines to enable filter select to work with webpack
require("globals");
global.registerModule("ui/layouts/grid-layout", () =>
  require("tns-core-modules/ui/layouts/grid-layout")
);
global.registerModule("ui/label", () => require("tns-core-modules/ui/label"));
global.registerModule("nativescript-web-image-cache", () =>
  require("nativescript-web-image-cache")
);

@Component({
  moduleId: module.id,
  selector: "registration",
  templateUrl: "./registration.component.html"
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  @ViewChild(ModalComponent)
  modal: ModalComponent;
  @ViewChild("slides")
  slides: SlidesComponent;
  @ViewChild("myCountries")
  myCountries: ElementRef;

  public registrationFormGroup: FormGroup;
  public displayName: string;
  public displayImage: string;
  //   public grades: ObservableArray<any>;
  //   public subjects: ObservableArray<any>;
  public user: UserAccount;
  // public userAccount: UserAccount;
  public getAddressFromService: any;
  //   public gradesContent: any;
  //   public subjectContent: any;

  //   public _selectedGrades: any;
  //   public _selectedSubjects: any;
  public registrationComplete: boolean;
  // public subscription: Subscription;
  public selectedSubjectJSON: any;
  public userImageUrl: any;
  //   public gradeSelectedStatus = {
  //     "grade-0": false,
  //     "grade-1": false,
  //     "grade-2": false,
  //     "grade-3": false,
  //     "grade-4": false
  //   };

  //   public subjectSelectedStatus = {
  //     "subject-0": false,
  //     "subject-1": false,
  //     "subject-2": false
  //   };

  permissionStatus: boolean; // permission for using location initial
  public gradesEnrolled: any;
  public subjectsEnrolled: any;
  public testReminders: boolean = true;
  isTablet: boolean;
  gotAddress: boolean;
  gradeSelected: boolean;
  subjectSelected: boolean;
  frequencySelected: boolean;
  testFrequency: string;
  showPhoneNumber: boolean;
  screenWidth: number;
  screenHeight: number;
  messageTopMargin: number;
  loadingMore: boolean;
  formReady: boolean; // to indicate if all variables for the form are ready to be shown
  countryList: any[];

  // this is the item template for the list of countries in the filter select
  public item_template = `
  <GridLayout columns="*, 33*, 7*, *">
  <Label col="1"  text="{{ name }}" textWrap="true"></Label>
  <Label col="2"  text="{{ dial_code }}" textWrap="true"></Label>
  </GridLayout>
  `;

  constructor(
    // private activatedRoute: ActivatedRoute,
    private routerExtensions: RouterExtensions,
    private page: Page,
    // private http: Http,
    private userStatusService: UserStatusService,
    private firebaseCreateService: FirebaseCreateService,
    private firebaseAuthService: FirebaseAuthService,
    private deviceDetailService: DeviceDetailService,
    private tabNavigationService: TabNavigationService,
    // private modalDialogService: ModalDialogService,
    private vcRef: ViewContainerRef
  ) {
    this.userImageUrl = "";
    this.loadingMore = false;
    console.log(
      "ORIGINAL SCREEN WIDTH IN DIP IS " +
        this.deviceDetailService.deviceScreen.width +
        "ORIGINAL SCREEN HEIGHT IN DIP IS " +
        this.deviceDetailService.deviceScreen.height
    );
    // if (this.deviceDetailService.deviceScreen.height > 320) {
    this.screenHeight =
      (this.deviceDetailService.deviceScreen.height * 76) / 100;
    // } else {
    //   this.screenHeight =
    //     this.deviceDetailService.deviceScreen.height * 76 / 100;
    // }
    if (this.deviceDetailService.currentPlatform === "IOS") {
      if (this.deviceDetailService.deviceScreen.width > 580) {
        this.messageTopMargin =
          (this.deviceDetailService.deviceScreen.width * 15) / 100;
      } else {
        this.messageTopMargin =
          (this.deviceDetailService.deviceScreen.width * 1) / 10;
      }
    } else {
      // if (this.deviceDetailService.deviceScreen.width > 640) {
      //   this.messageTopMargin =
      //     this.deviceDetailService.deviceScreen.width * 10 / 100;
      // } else {
      this.messageTopMargin =
        (this.deviceDetailService.deviceScreen.width * 5) / 100;
      // }
    }
    // this.screenHeight = this.deviceDetailService.deviceScreen.height - 100;
    // console.log("screen width is " + this.screenWidth);
    this.gradesEnrolled = {};
    this.subjectsEnrolled = {};
    this.gradeSelected = false;
    this.subjectSelected = false;
    this.frequencySelected = false;
    this.showPhoneNumber = false;
    this.formReady = false;
    this.permissionStatus = true;
    this.user = JSON.parse(this.userStatusService.getUserAccount());
    // this.gradesContent = new GradeDataArray();
    // this.grades = new ObservableArray(this.gradesContent.data);
    //this.grades = new ObservableArray(GradeDataArray);
    // this.subjectContent = new SubjectDataArray();
    // this.subjects = new ObservableArray(this.subjectContent.data);
    //this.subjects = new ObservableArray(SubjectDataArray);

    // this.user = new UserAccount(this.user.email);
    this.isTablet = getBoolean("isTablet"); //Anurag still required for html view to show correctly
    if (this.userStatusService.getUserAccount()) {
      const tempUser = JSON.parse(this.userStatusService.getUserAccount());
      if (tempUser.country) {
        this.gotAddress = true;
      } else {
        this.gotAddress = false;
      }
    }
    this.countryList = Countries;
  }

  //   get selectedGrades() {
  //     console.log(this._selectedGrades);
  //     return this._selectedGrades;
  //   }

  //   get selectedSubjects() {
  //     return this._selectedSubjects;
  //   }

  ngOnInit() {
    const self = this;
    this.page.actionBarHidden = true;
    this.getAddressFromService = this.firebaseAuthService.addressFoundFromGoogle.subscribe(
      result => {
        // first condition handles case when we dont get location from geolocation
        if (result === "Unknown") {
          self.permissionStatus = false;
          // self.showPhoneNumber = true;
          // self.user.country = "Unknown";
          // self.gotAddress = true;
        } else {
          self.permissionStatus = true;
          if (
            self.userStatusService.getUserAddress() !== undefined &&
            self.userStatusService.getUserAddress() !== null
          ) {
            self.user.country = JSON.parse(
              self.userStatusService.getUserAddress()
            ).country;
          }
          self.gotAddress = true;
          // self.proceedToSaveUserAccount();
          // console.log(
          //   "USER ACCOUNT IN SETTINGS IS " +
          //     JSON.stringify(self.userStatusService.getUserAccount())
          // );
          self.showPhoneNumber = true;
        }
      }
    );

    if (
      this.user.profileImageURL !== undefined &&
      this.user.profileImageURL !== null
    ) {
      this.displayImage = this.user.profileImageURL;
    }
    this.displayName = this.user.userName;
    this.registrationFormGroup = new FormGroup({
      nameInput: new FormControl(this.displayName, Validators.required),
      mySubjects: new FormControl("", Validators.required),
      myGrades: new FormControl("", Validators.required),
      testFrequency: new FormControl("", Validators.required),
      testReminders: new FormControl(this.testReminders, Validators.required),
      phoneNumber: new FormControl("", Validators.required)
    });
    this.formReady = true;
  }

  ngAfterViewInit() {
    this.firebaseAuthService.logRegistrationScreen();
  }

  // Anurag Nov2 to check form validity
  checkFormValidity() {
    if (
      this.registrationFormGroup.get("nameInput").valid &&
      this.registrationFormGroup.get("myGrades").valid &&
      this.registrationFormGroup.get("mySubjects").valid &&
      this.registrationFormGroup.get("testFrequency").valid &&
      this.registrationFormGroup.get("testReminders").valid &&
      this.registrationFormGroup.get("phoneNumber").valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  //Soumen[1/9/17]: Handler of the page loadedEvent event.
  //   onloaded() {
  // console.log("stopping loading indicator from registration component");
  //Soumen[1/9/17]: Looking to stop the loding indicator fron service
  // this.loadingService.hideLoggingInLoader();
  // console.log("stopping loading indicator from registration component");
  //   }

  onPrePrimarySelected() {
    if (this.gradesEnrolled["Pre-Primary"] === true) {
      delete this.gradesEnrolled["Pre-Primary"];
      console.log("Pre-Primary removed");
    } else {
      this.gradesEnrolled["Pre-Primary"] = true;
      console.log("Pre-Primary added");
      this.gradeSelected = true;
    }
    this.registrationFormGroup.patchValue({
      myGrades: this.gradesEnrolled
    });
    if (Object.keys(this.gradesEnrolled).length === 0) {
      this.gradeSelected = false;
    }
  }

  onEarlyPrimarySelected() {
    if (this.gradesEnrolled["Early Primary (1-2)"] === true) {
      delete this.gradesEnrolled["Early Primary (1-2)"];
      console.log("Early Primary (1-2) removed");
    } else {
      this.gradeSelected = true;
      this.gradesEnrolled["Early Primary (1-2)"] = true;
      console.log("Early Primary (1-2) added");
    }
    this.registrationFormGroup.patchValue({
      myGrades: this.gradesEnrolled
    });
    if (Object.keys(this.gradesEnrolled).length === 0) {
      this.gradeSelected = false;
    }
  }

  onPrimarySelected() {
    if (this.gradesEnrolled["Primary (3-5)"] === true) {
      delete this.gradesEnrolled["Primary (3-5)"];
      console.log("Primary (3-5) removed");
    } else {
      this.gradeSelected = true;
      this.gradesEnrolled["Primary (3-5)"] = true;
      console.log("Primary (3-5) added");
    }
    this.registrationFormGroup.patchValue({
      myGrades: this.gradesEnrolled
    });
    if (Object.keys(this.gradesEnrolled).length === 0) {
      this.gradeSelected = false;
    }
  }

  onMiddleSelected() {
    if (this.gradesEnrolled["Middle School (6-8)"] === true) {
      delete this.gradesEnrolled["Middle School (6-8)"];
      console.log("Middle School (6-8) removed");
    } else {
      this.gradeSelected = true;
      this.gradesEnrolled["Middle School (6-8)"] = true;
      console.log("Middle School (6-8) added");
    }
    this.registrationFormGroup.patchValue({
      myGrades: this.gradesEnrolled
    });
    if (Object.keys(this.gradesEnrolled).length === 0) {
      this.gradeSelected = false;
    }
  }

  onHighSelected() {
    if (this.gradesEnrolled["High School (9-10)"] === true) {
      delete this.gradesEnrolled["High School (9-10)"];
      console.log("High School (9-10) removed");
    } else {
      this.gradeSelected = true;
      this.gradesEnrolled["High School (9-10)"] = true;
      console.log("High School (9-10) added");
    }
    this.registrationFormGroup.patchValue({
      myGrades: this.gradesEnrolled
    });
    if (Object.keys(this.gradesEnrolled).length === 0) {
      this.gradeSelected = false;
    }
  }

  onScienceSelected() {
    if (this.subjectsEnrolled["Science"] === true) {
      delete this.subjectsEnrolled["Science"];
      console.log("Science removed");
    } else {
      this.subjectSelected = true;
      this.subjectsEnrolled["Science"] = true;
      console.log("Science added");
    }
    this.registrationFormGroup.patchValue({
      mySubjects: this.subjectsEnrolled
    });
    if (Object.keys(this.subjectsEnrolled).length === 0) {
      this.subjectSelected = false;
    }
  }

  onEnglishSelected() {
    if (this.subjectsEnrolled["English"] === true) {
      delete this.subjectsEnrolled["English"];
      console.log("English removed");
    } else {
      this.subjectSelected = true;
      this.subjectsEnrolled["English"] = true;
      console.log("English added");
    }
    this.registrationFormGroup.patchValue({
      mySubjects: this.subjectsEnrolled
    });
    if (Object.keys(this.subjectsEnrolled).length === 0) {
      this.subjectSelected = false;
    }
  }

  onMathSelected() {
    if (this.subjectsEnrolled["Math"] === true) {
      delete this.subjectsEnrolled["Math"];
      console.log("Math removed");
    } else {
      this.subjectSelected = true;
      this.subjectsEnrolled["Math"] = true;
      console.log("Math added");
    }
    this.registrationFormGroup.patchValue({
      mySubjects: this.subjectsEnrolled
    });
    if (Object.keys(this.subjectsEnrolled).length === 0) {
      this.subjectSelected = false;
    }
  }

  everydaySelected() {
    if (this.testFrequency === "everyday") {
      this.testFrequency = undefined;
    } else {
      this.frequencySelected = true;
      this.testFrequency = "everyday";
    }
    this.registrationFormGroup.patchValue({
      testFrequency: this.testFrequency
    });
    if (!this.testFrequency) {
      this.frequencySelected = false;
    }
  }

  weekSelected() {
    if (this.testFrequency === "week") {
      this.testFrequency = undefined;
    } else {
      this.frequencySelected = true;
      this.testFrequency = "week";
    }
    this.registrationFormGroup.patchValue({
      testFrequency: this.testFrequency
    });
    if (!this.testFrequency) {
      this.frequencySelected = false;
    }
  }

  fortnightSelected() {
    if (this.testFrequency === "fortnight") {
      this.testFrequency = undefined;
    } else {
      this.frequencySelected = true;
      this.testFrequency = "fortnight";
    }
    this.registrationFormGroup.patchValue({
      testFrequency: this.testFrequency
    });
    if (!this.testFrequency) {
      this.frequencySelected = false;
    }
  }

  monthSelected() {
    if (this.testFrequency === "month") {
      this.testFrequency = undefined;
    } else {
      this.frequencySelected = true;
      this.testFrequency = "month";
    }
    this.registrationFormGroup.patchValue({
      testFrequency: this.testFrequency
    });
    if (!this.testFrequency) {
      this.frequencySelected = false;
    }
  }

  //   public onGradeSelected(args) {
  //     console.log("hello");
  //     const selectedGrade = this.grades.getItem(args.index);
  //     selectedGrade.selected = true;
  //     const listview = args.object;
  //     const selectedGrades = listview.getSelectedItems() as any[];

  //     // const grade = "grade-" + item.itemIndex.toString();
  //     const grade = "grade-" + args.index.toString();
  //     this.gradeSelectedStatus[grade] = true;

  //     const allSelectedGrades = {};
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let i = 0; i < selectedGrades.length; i++) {
  //       allSelectedGrades[selectedGrades[i].gradeName] = true;
  //     }
  //     this._selectedGrades = allSelectedGrades;
  //     this.registrationFormGroup.patchValue({
  //       myGrades: allSelectedGrades
  //     });
  //     console.log("THE SELECTED GRADES " + JSON.stringify(this._selectedGrades));

  //     if (args.view.parent) {
  //       //transparent, so that list item has same color as page-background
  //       if (args.view.parent._androidView) {
  //         const colorAndroid = new Color("#FFFFFF");
  //         args.view.parent.backgroundColor = colorAndroid;
  //       }
  //       if (args.view.parent._iosView) {
  //         const colorIos = new Color("#FFFFFF");
  //         args.view.parent.backgroundColor = colorIos;
  //       }
  //     }
  //   }

  //   public onSubjectSelected(args) {
  //     const selectedSubject = this.subjects.getItem(args.index);
  //     console.log("selectedSubject.selected" + selectedSubject.selected);
  //     selectedSubject.selected = true;
  //     const listview = args.object;
  //     const selectedSubjects = listview.getSelectedItems() as any[];

  //     // const subject = "subject-" + item.itemIndex.toString();
  //     const subject = "subject-" + args.index.toString();
  //     this.subjectSelectedStatus[subject] = true;

  //     const allSelectedSubjects = {};
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let i = 0; i < selectedSubjects.length; i++) {
  //       allSelectedSubjects[selectedSubjects[i].subjectName] = true;
  //     }
  //     this._selectedSubjects = allSelectedSubjects;

  //     this.registrationFormGroup.patchValue({
  //       mySubjects: allSelectedSubjects
  //     });
  //     console.log(
  //       "THE SELECTED SUBJECTS ARE " + JSON.stringify(this._selectedSubjects)
  //     );

  //     if (args.view.parent) {
  //       //transparent, so that list item has same color as page-background
  //       if (args.view.parent._androidView) {
  //         const colorAndroid = new Color("#FFFFFF");
  //         args.view.parent.backgroundColor = colorAndroid;
  //       }
  //       if (args.view.parent._iosView) {
  //         const colorIos = new Color("#FFFFFF");
  //         args.view.parent.backgroundColor = colorIos;
  //       }
  //     }
  //   }

  //   public onGradeDeselected(args: ListViewEventData) {
  //     const selectedGrade = this.grades.getItem(args.index);
  //     selectedGrade.selected = false;
  //     const listview = args.object;
  //     const selectedItems = listview.getSelectedItems() as any[];

  //     // const grade = "grade-" + item.itemIndex.toString();
  //     const grade = "grade-" + args.index.toString();
  //     this.gradeSelectedStatus[grade] = false;

  //     const allSelectedGrades = {};
  //     if (selectedItems.length > 0) {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let i = 0; i < selectedItems.length; i++) {
  //         allSelectedGrades[selectedItems[i].gradeName] = true;
  //       }
  //       this._selectedGrades = allSelectedGrades;
  //       console.log(JSON.stringify(this._selectedGrades));
  //     } else {
  //       this._selectedGrades = {};
  //     }
  //     this.registrationFormGroup.patchValue({
  //       myGrades: allSelectedGrades
  //     });
  //     console.log("Grade deselected. " + JSON.stringify(this._selectedGrades));
  //   }

  //   public onSubjectDeselected(args: ListViewEventData) {
  //     const selectedSubject = this.subjects.getItem(args.index);
  //     selectedSubject.selected = false;
  //     console.log("selectedSubject.selected" + selectedSubject.selected);
  //     const listview = args.object;
  //     const selectedItems = listview.getSelectedItems() as any[];

  //     // const subject = "subject-" + item.itemIndex.toString();
  //     const subject = "subject-" + args.index.toString();
  //     this.subjectSelectedStatus[subject] = false;

  //     const allSelectedSubjects = {};
  //     if (selectedItems.length > 0) {
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let i = 0; i < selectedItems.length; i++) {
  //         allSelectedSubjects[selectedItems[i].subjectName] = true;
  //       }
  //       // allSelectedSubjects[selectedItems[i].subjectName] = false;
  //       this._selectedSubjects = allSelectedSubjects;
  //       // console.log(JSON.stringify(this._selectedSubjects));
  //     } else {
  //       this._selectedSubjects = {};
  //     }
  //     console.log(
  //       "Subject deselected. " + JSON.stringify(this._selectedSubjects)
  //     );
  //     this.registrationFormGroup.patchValue({
  //       mySubjects: allSelectedSubjects
  //     });
  //   }

  // onRegisterSubmit() {
  //   if (this.registrationFormGroup.valid) {
  //     this.showLocationAndMessagingModal();
  //   } else {
  //     this.displayAlertDialog();
  //   }
  // }

  userPermissionGranted() {
    const self = this;
    if (!geolocation.isEnabled()) {
      geolocation.enableLocationRequest().then(
        approve => {
          self.userStatusService.setLocationPermission(true);
          self.getLatitudeLongitude();
        },
        error => {
          self.permissionStatus = false;
          self.userStatusService.setLocationPermission(false);
          // self.proceedToSaveUserAccount();
          console.log("Location permission refused!");
        }
      );
    } else {
      self.permissionStatus = true;
      self.userStatusService.setLocationPermission(true);
      self.getLatitudeLongitude();
    }
    // self.proceedToSaveUserAccount();
    //this.saveUserDetailsInFirebase();
  }

  getLatitudeLongitude() {
    const self = this;

    geolocation
      .getCurrentLocation({
        desiredAccuracy: Accuracy.any,
        updateDistance: 0.1,
        timeout: 10000
      }) //, maximumAge: 5000
      .then(
        coordinates => {
          if (coordinates) {
            self.firebaseAuthService.getAddressFromGoogle(coordinates);
          }
        },
        function(e) {
          console.log("Error in location: " + e.message);
          self.userStatusService.setLocationAvailable(false);
          self.firebaseAuthService.addressFoundFromGoogle.emit("Unknown");
          // self.proceedToSaveUserAccount();
        }
      );
  }

  checkForm() {
    // AD June 30 adding phone verification code below for testing
    if (this.checkFormValidity()) {
      // this.phoneToast();
      this.validatePhoneNumber();
    } else {
      // Toast.makeText(
      //   "You seem to have missed some details. Please check the form before pressing submit.",
      //   "long"
      // ).show();
    }
  }

  validatePhoneNumber() {
    const self = this;
    const checkPhoneNumber = this.getCountryCode();
    firebase
      .login({
        type: firebase.LoginType.PHONE,
        phoneOptions: {
          phoneNumber: checkPhoneNumber,
          verificationPrompt: "Enter the received verification code" // default "Verification code"
        }
      })
      .then(
        function(result) {
          self.loadingMore = true;
          self.registrationFormGroup.patchValue({
            phoneNumber: result.phoneNumber
          });
          console.log(
            "Phone verification succeeded. Result is " + JSON.stringify(result)
          );
          self.proceedToSaveUserAccount();
        },
        function(errorMessage) {
          if (
            errorMessage ===
            "Logging in the user failed. com.google.firebase.auth.FirebaseAuthUserCollisionException: This credential is already associated with a different user account."
          ) {
            alert(
              "This number is associated with another user account. Check the number and try again "
            );
          } else {
            alert(
              "Your number could not be validated. Check your input and try again"
            );
          }
          console.log("Phone number validation not received" + errorMessage);
        }
      );
  }

  phoneToast() {
    // Toast.makeText(
    //   "A code is being sent to your phone. Thanks for your patience",
    //   "long"
    // ).show();
  }

  getCountryCode() {
    if (this.user.country !== "Unknown") {
      const userCountry = this.user.country;
      for (let i = 0; i < Countries.length; i++) {
        if (Countries[i].name === this.user.country) {
          const countryCode = Countries[i].dial_code;
          const fullPhoneNumber =
            countryCode + this.registrationFormGroup.get("phoneNumber").value;
          return fullPhoneNumber;
        }
      }
    }
  }

  proceedToSaveUserAccount() {
    if (
      this.userImageUrl !== undefined &&
      this.userImageUrl !== null &&
      this.userImageUrl !== ""
    ) {
      this.generateFirebaseImageLink();
    } else {
      this.user.profileImageURL = "";
      this.createUserAccountObject();
    }
  }

  // displayAlertDialog() {
  //   if (!this.registrationFormGroup.get("nameInput").valid) {
  //     dialogs
  //       .alert({
  //         title: "Hi......",
  //         message: "We're excited to meet you. Do share your name.",
  //         okButtonText: "OK"
  //       })
  //       .then(() => {
  //         console.log("Warning dialog closed");
  //       });
  //   } else {
  //     dialogs
  //       .alert({
  //         title: "Help Us, Help You",
  //         message: "Choose grades and subjects to find more relevant questions",
  //         okButtonText: "OK"
  //       })
  //       .then(() => {
  //         console.log("Warning dialog closed");
  //       });
  //   }
  // }

  //creates a userAccount object that will be saved in application settings
  createUserAccountObject() {
    const pushTokenTime = Date.now();
    let token = this.userStatusService.getPushToken();
    let tokenObject = {};
    tokenObject[token] = {
      timeAdded: pushTokenTime
    };
    this.user.pushToken = tokenObject;
    this.user.registrationDate = pushTokenTime.toString();
    this.user.userName = this.registrationFormGroup.get("nameInput").value;
    this.user.gradesEnrolled = this.gradesEnrolled;
    this.user.subjectsEnrolled = this.subjectsEnrolled;
    this.user.testFrequency = this.testFrequency;
    this.user.testReminders = this.testReminders;
    this.user.phoneNumber = this.registrationFormGroup.get("phoneNumber").value;
    if (
      this.userStatusService.getUserAddress() !== undefined &&
      this.userStatusService.getUserAddress() !== null
    ) {
      this.user.country = JSON.parse(
        this.userStatusService.getUserAddress()
      ).country;
      this.user.address = JSON.parse(
        this.userStatusService.getUserAddress()
      ).address;
      this.user.state = JSON.parse(
        this.userStatusService.getUserAddress()
      ).state;
    }
    //setting isFirstTime as a variable to determine if overlay needs to be shown
    this.user.isFirstTime = {};
    this.user.isFirstTime["detailedTest"] = true;
    this.user.isFirstTime["searchResult"] = true;
    this.user.isFirstTime.questionInput = true;
    this.user.isFirstTime.tagInput = true;
    this.user.userLevel = "Contributor";
    this.user.uPoints = 500;
    // this.user.followerNum = 0;
    //For Analytics
    this.firebaseAuthService.setUserProperties(
      this.gradesEnrolled,
      this.subjectsEnrolled
    );
    this.firebaseAuthService.registrationEvent();

    this.userStatusService.setUserGrades(JSON.stringify(this.gradesEnrolled));
    this.userStatusService.setUserSubjects(
      JSON.stringify(this.subjectsEnrolled)
    );
    this.userStatusService.setUserAccount(JSON.stringify(this.user));

    this.firebaseAuthService.saveUserDetails(this.user);
    this.userStatusService.setAuthorizationStatus("authorized");
    // this.routerExtensions.navigate(["/main/tab/0"], { clearHistory: true });
    this.loadingMore = false;
    this.tabNavigationService.goToTab0(0);
  }

  // showLocationAndMessagingModal() {
  //     const self = this;
  //     const options = {
  //         context: {},
  //         fullscreen: false,
  //         viewContainerRef: this.vcRef,
  //     };
  //     this.modalDialogService.showModal(PermissionComponent, options).then((res) => {
  //         if (this.userStatusService.getModalPermission()) {
  //             this.userPermissionGranted();
  //         }
  //         else {
  //             this.proceedToSaveUserAccount();

  //         }
  //         console.log("Modal is closed here");
  //     });
  // }

  // METHODS FOR THE MODAL VIEW

  showLocationAndMessagingModal() {
    this.openModal();
  }

  public permissionGranted() {
    this.permissionStatus = true;
    this.userStatusService.setModalPermission(this.permissionStatus);
    this.closeModal();
    this.userPermissionGranted();
  }

  public permissionRefused() {
    // this.permissionStatus = false;
    this.userStatusService.setModalPermission(this.permissionStatus);
    this.showToast();
    // this.closeModal();
    // this.proceedToSaveUserAccount();
  }

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }

  onOpenModal() {
    console.log("opened modal");
  }

  onCloseModal() {
    console.log("closed modal");
  }

  public showToast() {
    // Toast.makeText(
    //   "We need one time access to your location to register you",
    //   "long"
    // ).show();
  }

  onChanged() {
    console.log("NEXT SLIDE PRESSED");  
    this.slides.nextSlide(3);
  }

  changeRemindMe(result) {
    if (result) {
      this.testReminders = true;
    } else {
      this.testReminders = false;
    }
  }

  getImageDialog() {
    console.log("getting image dialog ************");
    const self = this;
    const options = {
      message: "Get Image from",
      actions: ["Camera", "Photo Gallery", "Cancel"]
    };
    // using a dialog action to define code block to be executed on choosing different dialog actions
    action(options).then(r => {
      console.log("dialog result is" + r);

      if (r === "Camera") {
        // check if camera is available
        if (camera.isAvailable()) {
          camera.requestPermissions();
          // Open the camera
          const cameraOptions = {
            height: 200,
            keepAspectRatio: true,
            saveToGallery: true
          };
          camera
            .takePicture(cameraOptions)
            .then(imageAsset => {
              imageSource.fromAsset(imageAsset).then(res => {
                console.log(
                  "Size: " +
                    imageAsset.options.width +
                    "x" +
                    imageAsset.options.height
                );
                console.log(
                  "keepAspectRatio: " + imageAsset.options.keepAspectRatio
                );
                console.log(
                  "Photo saved in Photos/Gallery for Android or in Camera Roll for iOS"
                );
                this.userImageUrl = res;
                // this.questionImagesSource = "Community Contributor";
                //save the source image to a file, then send that file path to firebase
                this.saveToFile(this.userImageUrl);
                this.user.profileImageURL = this.userImageUrl;
                this.displayImage = this.user.profileImageURL;
                this.userStatusService.setUserAccount(
                  JSON.stringify(this.user)
                );
              });
            })
            .catch(err => {
              console.log("Error -> " + err.message);
            });
        }
      } else if (r === "Photo Gallery") {
        //open photo gallery
        const context = imagepicker.create({
          mode: "single"
        });
        context
          .authorize()
          .then(() => {
            return context.present();
          })
          .then(selection => {
            selection.forEach(selected => {
              imageSource.fromAsset(selected).then(res => {
                this.userImageUrl = res;
                // this.questionImagesSource = "Community Contributor";
                //save the source image to a file, then send that file path to firebase
                this.saveToFile(this.userImageUrl);
                this.user.profileImageURL = this.userImageUrl;
                this.displayImage = this.user.profileImageURL;
                this.userStatusService.setUserAccount(
                  JSON.stringify(this.user)
                );
                // this.firebaseCreateService.setQuestionImageSaved(this.questionImagesUrl);
                // this.firebaseCreateService.setQuestionImageThumbnail(this.questionImagesUrl);
                // this.firebaseCreateService.setQuestionImageSource(this.questionImagesSource);
                // this.firebaseCreateService.setSaveImageToFirebase('local');
              });
            });
          })
          .catch(err => {
            console.log("Error -> " + err.message);
          });
      } else if (r === "Cancel") {
        console.log("Image cancelled");
      }
    });
  }

  saveToFile(res) {
    const imgsrc = res;
    this.userImageUrl = this.firebaseCreateService.documentsPath(
      `photo-${Date.now()}.png`
    );
    imgsrc.saveToFile(this.userImageUrl, enums.ImageFormat.png);
  }

  // if image exists upload it to firebase store and  get a url for the image
  generateFirebaseImageLink() {
    const self = this;
    if (
      this.userImageUrl !== undefined &&
      this.userImageUrl !== null &&
      this.userImageUrl !== ""
    ) {
      this.firebaseCreateService
        .uploadUserImage(this.userImageUrl, this.user.uid)
        .then(result => {
          console.log("User Image uploaded is " + JSON.stringify(result));
          self.userImageUrl = result.url;
          self.user.profileImageURL = result.url;
          self.userStatusService.setUserAccount(JSON.stringify(self.user));
          self.createUserAccountObject();
        });
    }
  }

  // handles showing user option to select country manually when location detection fails
  opened() {
    const self = this;
    this.myCountries.nativeElement.open();
    console.log("Opened");
  }

  onCountrySelected(args) {
    this.user.country = args.selected.name;
    this.showPhoneNumber = true;
    this.gotAddress = true;
    const userAddressObject = {
      address: "",
      country: args.selected.name,
      state: ""
    };
    this.userStatusService.setUserAddress(JSON.stringify(userAddressObject));
    this.firebaseAuthService.addressFoundFromGoogle.emit(userAddressObject);
  }
}
