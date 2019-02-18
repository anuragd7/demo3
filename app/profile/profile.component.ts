import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  AfterViewInit
} from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router/router-extensions";

import { ObservableArray } from "data/observable-array"; // for the grade and subject selection lists (rad list view)
import { Page } from "ui/page";
import { Subscription } from "rxjs/Subscription";
import { Color } from "color";
import { isAndroid } from "platform";

import { User, UserAccount } from "../models/user.model";
import { FirebaseAuthService } from "../services/firebase-auth.service"; // to logout the user
import { UserStatusService } from "../services/userStatus.service"; //for getting the user details name image etc

import * as scrollViewModule from "ui/scroll-view";
import { ListViewEventData } from "nativescript-ui-listview";

// import * as Toast from "nativescript-toast"; // for showing toast on updating profile

import {
  GradeDataArray,
  SubjectDataArray
} from "../registration/registration-items";

import { backgroundColorProperty } from "tns-core-modules/ui/editable-text-base/editable-text-base";
import { AndroidBackButtonHandlerService } from "../services/androidBackButtonHandler.service";
import { TabNavigationService } from "../services/tab-navigation.service";

import * as SocialShare from "nativescript-social-share";
import { getBoolean } from "application-settings";

@Component({
  moduleId: module.id,
  selector: "app-profile",
  templateUrl: "./profile.component.html"
})
export class ProfileComponent implements OnInit, AfterViewInit {
  public userId: any;
  public userAccount: UserAccount; // this object contain the users grades and subject selection also
  public displayName: string;
  public displayImage: string;
  public updatedProfileSubscription: Subscription;
  public changesMadeToProfile: boolean = false;

  // variables needed for grades and subjects
  public gradesContent: any;
  public subjectContent: any;
  public grades: ObservableArray<any>;
  public subjects: ObservableArray<any>;
  public selectedGrades: any;
  public selectedSubjects: any;
  public gradeTimer;
  public subjectTimer;

  // public selectedSubjectJSON: any;
  public gradeSelectedStatus = {
    "grade-0": false,
    "grade-1": false,
    "grade-2": false,
    "grade-3": false,
    "grade-4": false
  };

  public subjectSelectedStatus = {
    "subject-0": false,
    "subject-1": false,
    "subject-2": false
  };

  public backButtonHandler: Subscription;
  public isTablet: boolean;

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private routerExtensions: RouterExtensions,
    private userStatusService: UserStatusService,
    private tabNavigationService: TabNavigationService,
    private androidBackButtonService: AndroidBackButtonHandlerService,
    private page: Page
  ) {
    this.isTablet = getBoolean("isTablet");
    this.gradesContent = new GradeDataArray();
    this.grades = new ObservableArray(this.gradesContent.data);
    this.subjectContent = new SubjectDataArray();
    this.subjects = new ObservableArray(this.subjectContent.data);
    //Initialising the list of selected grades
    this.userId = JSON.parse(this.userStatusService.getUserAccount());
    const tempUser = this.userStatusService.getUserAccount();
    this.userAccount = JSON.parse(tempUser); // stores user details like grade, subject etc
    this.displayName = this.userAccount.userName;
    if (this.userId.profileImageURL) {
      this.displayImage = this.userId.profileImageURL;
    } else if (this.userAccount.profileImageURL) {
      this.displayImage = this.userAccount.profileImageURL;
    }
    this.selectedGrades = this.userAccount.gradesEnrolled;
    this.selectedSubjects = this.userAccount.subjectsEnrolled;
    this.page.actionBarHidden = true;
    console.log(
      "The grades selected are: " + JSON.stringify(this.selectedGrades)
    );
    console.log(
      "The type of selectedSubjects is" + typeof this.selectedSubjects
    );
  }

  public logout() {
    this.firebaseAuthService.logout();
    this.routerExtensions.navigate(["/main"], { clearHistory: true });
  }

  public ngOnInit() {
    if (isAndroid) {
      this.backButtonHandler = this.androidBackButtonService.myProfileHandler.subscribe(
        status => {
          console.log(
            "Back button pressed on myQuestions component and the status is: " +
              JSON.stringify(status)
          );
          this.goBack();
        }
      );
    }
  }

  public onGradeSelected(args) {
    this.changesMadeToProfile = true;
    const selectedGrade = this.grades.getItem(args.index);
    selectedGrade.selected = true;
    const listview = args.object;
    const selectedGrades = listview.getSelectedItems() as any[];

    const grade = "grade-" + args.index.toString();
    this.gradeSelectedStatus[grade] = true;

    const allSelectedGrades = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < selectedGrades.length; i++) {
      allSelectedGrades.push(selectedGrades[i].gradeName);
    }
    this.selectedGrades = allSelectedGrades;
    console.log(JSON.stringify(this.selectedGrades));

    if (args.view.parent) {
      //transparent, so that list item has same color as page-background
      if (args.view.parent._androidView) {
        const colorAndroid = new Color("#FFFFFF");
        args.view.parent.backgroundColor = colorAndroid;
      }

      if (args.view.parent._iosView) {
        const colorIos = new Color("#FFFFFF");
        args.view.parent.backgroundColor = colorIos;
      }
    }
  }

  public onSubjectSelected(args) {
    this.changesMadeToProfile = true;
    const selectedSubject = this.subjects.getItem(args.index);
    console.log("selectedSubject.selected" + selectedSubject.selected);
    selectedSubject.selected = true;
    const listview = args.object;
    const selectedSubjects = listview.getSelectedItems() as any[];

    const subject = "subject-" + args.index.toString();
    this.subjectSelectedStatus[subject] = true;

    const allSelectedSubjects = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < selectedSubjects.length; i++) {
      allSelectedSubjects.push(selectedSubjects[i].subjectName);
    }
    this.selectedSubjects = allSelectedSubjects;
    console.log(JSON.stringify(this.selectedSubjects));

    if (args.view.parent) {
      //transparent, so that list item has same color as page-background
      if (args.view.parent._androidView) {
        const colorAndroid = new Color("#FFFFFF");
        args.view.parent.backgroundColor = colorAndroid;
      }
      if (args.view.parent._iosView) {
        const colorIos = new Color("#FFFFFF");
        args.view.parent.backgroundColor = colorIos;
      }
    }
  }

  public onGradeDeselected(args: ListViewEventData) {
    this.changesMadeToProfile = true;
    const selectedGrade = this.grades.getItem(args.index);
    selectedGrade.selected = false;
    const listview = args.object;
    const selectedItems = listview.getSelectedItems() as any[];

    const grade = "grade-" + args.index.toString();
    this.gradeSelectedStatus[grade] = false;

    const allSelectedGrades = [];
    if (selectedItems.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < selectedItems.length; i++) {
        allSelectedGrades.push(selectedItems[i].gradeName);
      }
      this.selectedGrades = allSelectedGrades;
      console.log(JSON.stringify(this.selectedGrades));
    } else {
      this.selectedGrades = [];
    }
    console.log("Grade deselected. " + JSON.stringify(this.selectedGrades));
  }

  public onSubjectDeselected(args: ListViewEventData) {
    this.changesMadeToProfile = true;
    const selectedSubject = this.subjects.getItem(args.index);
    selectedSubject.selected = false;
    console.log("selectedSubject.selected" + selectedSubject.selected);
    const listview = args.object;
    const selectedSubjects = listview.getSelectedItems() as any[];

    const subject = "subject-" + args.index.toString();
    this.subjectSelectedStatus[subject] = false;

    const allSelectedSubjects = [];
    if (selectedSubjects.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < selectedSubjects.length; i++) {
        allSelectedSubjects.push(selectedSubjects[i].subjectName);
      }
      this.selectedSubjects = allSelectedSubjects;
      console.log(JSON.stringify(this.selectedSubjects));
    } else {
      this.selectedSubjects = [];
    }
    console.log("Subject deselected. " + JSON.stringify(this.selectedSubjects));
  }

  // updateUserDetailsInFirebase(user: any) {
  //   this.firebaseAuthService.updateUserProfile(user);
  //   this.userStatusService.setAuthorizationStatus("authorized");
  //   this.routerExtensions.navigate(["/main/tab/0"], { clearHistory: true });
  // }

  onUpdateSubmit() {
    console.log(
      "submitting the update USer " + JSON.stringify(this.userAccount)
    );
    this.updateUserAccountGrades();
    this.updateUserAccountSubjects();
    this.userStatusService.setUserGrades(
      JSON.stringify(this.userAccount.gradesEnrolled)
    );
    this.userStatusService.setUserSubjects(
      JSON.stringify(this.userAccount.subjectsEnrolled)
    );
    this.userStatusService.setUserAccount(JSON.stringify(this.userAccount));
    this.firebaseAuthService.updateUserProfile(this.userAccount);
    this.changesMadeToProfile = false;
    // Toast.makeText("Got it! Your profile is updated", "2").show();
  }

  updateUserAccountGrades() {
    const tempGrades: any = {};
    for (let grade of this.selectedGrades) {
      let myGrade = grade;
      tempGrades[myGrade] = true;
    }
    this.userAccount.gradesEnrolled = tempGrades;
  }

  updateUserAccountSubjects() {
    const tempSubjects: any = {};
    for (let subject of this.selectedSubjects) {
      let mySubject = subject;
      tempSubjects[mySubject] = true;
    }
    this.userAccount.subjectsEnrolled = tempSubjects;
  }

  //On loading handler to show the previously selected grades by getting their position in the radlistview array
  onGradeItemLoading(args) {
    const self = this;
    // self.gradeTimer = setTimeout(() => {
      console.log("On item loading called of grade");
      const selectedGradeIndexes = self.getSelectedGradeIndexes();
      selectedGradeIndexes.forEach(element => {
        args.object.selectItemAt(element);
      });
      // clearTimeout(self.gradeTimer);
    // }, 100);
  }

  onSubjectItemLoading(args) {
    const self = this;
    // self.subjectTimer = setTimeout(() => {
      console.log("On item loading called of subjects");
      const selectedSubjectIndexes = self.getSelectedSubjectIndexes();
      selectedSubjectIndexes.forEach(element => {
        args.object.selectItemAt(element);
      });
      // clearTimeout(self.subjectTimer);
    // }, 100);
  }

  getSelectedGradeIndexes() {
    const self = this;
    const gradesEnrolled = self.userAccount.gradesEnrolled;
    const selectedItemIndexes = [];
    //checks for every grade in the list
    if (self.grades.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < self.grades.length; i++) {
        const gradeName = self.grades.getItem(i).gradeName;
        //checks if self.selectedGrades is matchign this gradeName if yes pushes index to selectedItemIndexes
        if (self.selectedGrades) {
          for (let grade in self.selectedGrades) {
            if (grade === gradeName) {
              selectedItemIndexes.push(i);
              self.grades.getItem(i).selected = true;
              grade = "grade-" + i.toString();
              self.gradeSelectedStatus[grade] = true;
            }
          }
        }
      }
    }
    return selectedItemIndexes;
  }

  getSelectedSubjectIndexes() {
    const self = this;
    const subjectsEnrolled = self.userAccount.gradesEnrolled;
    const selectedItemIndexes = [];
    //checks for every grade in the list
    if (self.subjects.length > 0) {
      for (let i = 0; i < self.subjects.length; i++) {
        const subjectName = self.subjects.getItem(i).subjectName;
        //checks if self.selectedGrades is matchign this gradeName if yes pushes index to selectedItemIndexes
        if (self.selectedSubjects) {
          for (let subject in self.selectedSubjects) {
            if (subject === subjectName) {
              selectedItemIndexes.push(i);
              self.subjects.getItem(i).selected = true;
              subject = "subject-" + i.toString();
              self.subjectSelectedStatus[subject] = true;
            }
          }
        }
      }
    }
    return selectedItemIndexes;
  }

  ngAfterViewInit() {
    const self = this;
    setTimeout(() => {
      self.changesMadeToProfile = false;
    }, 110);
  }

  goBack() {
    this.backButtonHandler.unsubscribe();
    this.tabNavigationService.goToTab(0);
    this.tabNavigationService.androidBackPressed();
  }

  inviteFriends() {
    SocialShare.shareUrl(
      "http://www.demoerror.com/#signup/",
      "I Found This Really Useful",
      "Try This"
    );
  }

  // inviteText() {
  //   SocialShare.shareText(
  //     "I Found This Really Useful",
  //     "https://www.demoerror.com/#signup"
  //   );
  // }

  // inviteImage() {
  //   SocialShare.shareImage(
  //     "http://www.demoerror.com/#signup",
  //     "I Found This Really Useful"
  //   );
  // }
}
