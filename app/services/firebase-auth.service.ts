import { Injectable, EventEmitter, NgZone } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";

// import "rxjs/add/operator/share";
import "rxjs/add/operator/map";

import { User } from "../models/user.model";
import { UserStatusService } from "./userStatus.service";

import { HttpClient } from "@angular/common/http";

@Injectable()
export class FirebaseAuthService {
  addressFoundFromGoogle = new EventEmitter<any>();
  constructor(
    private http: HttpClient,
    private userStatusService: UserStatusService,
  ) {}

  userresultx = new EventEmitter<any>();

  register(user: User) {
    const self = this;
    return firebase
      .createUser({
        email: user.email,
        password: user.password
      })
      .then(
        function(result: any) {
          //return JSON.stringify(result);
          return result;
        },
        function(errorMessage: any) {
          if (
            errorMessage ===
            "Creating a user requires an email and password argument"
          ) {
            errorMessage =
              "We need a valid email id and password to sign you up. Do try again.";
          } else if (
            errorMessage ===
            "Creating a user failed. com.google.firebase.auth.FirebaseAuthUserCollisionException: The email address is already in use by another account."
          ) {
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:max-line-length
            errorMessage =
              "This email is already signed-up. If its yours, just try logging in.";
          }
          // self.loader.hide();
          alert({
            title: "Speed Bump!",
            message: errorMessage,
            okButtonText: "OK"
          });
        }
      );
  }

  login(user: User) {
    return firebase
      .login({
        type: firebase.LoginType.PASSWORD,
        email: user.email,
        password: user.password
      })
      .then(
        (result: any) => {
          UserStatusService.token = result.uid;
          console.log(
            "The return payload of login with email: " + JSON.stringify(result)
          );
          return result;
        },
        (errorMessage: any) => {
          if (
            errorMessage ===
            "Auth type emailandpassword requires an email and password argument"
          ) {
            errorMessage = "Check your email and password and try again.";
          }
          // tslint:disable-next-line:max-line-length
          if (
            errorMessage ===
            "Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidUserException: There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            errorMessage =
              "We can't find your email in our system. Sure you've signed up?";
          } else if (
            errorMessage ===
            "Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The password is invalid or the user does not have a password."
          ) {
            // tslint:disable-next-line:max-line-length
            errorMessage = "Check your email and password and try again.";
          }
          alert({
            title: "Speed Bump!",
            message: errorMessage,
            okButtonText: "OK"
          });
        }
      );
  }

  loginWithFacebook() {
    return firebase
      .login({
        type: firebase.LoginType.FACEBOOK,
        facebookOptions: {
          scope: ["public_profile", "email"]
        }
      })
      .then(
        (result: any) => {
          // this.loadingService.showLoggingInLoader();
          UserStatusService.token = result.uid;
          console.log(
            "The return payload of login with facebook: " +
              JSON.stringify(result)
          );
          return result;
        },
        (errorMessage: any) => {
          // tslint:disable-next-line:max-line-length
          if (
            errorMessage ===
              "Logging in the user failed. com.google.firebase.auth.FirebaseAuthUserCollisionException: An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address." ||
            errorMessage ===
              "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
          ) {
            errorMessage =
              "Your facebook email account is already registered. Try to log in with the Email Account Option.";
          } else {
            errorMessage = "Something went wrong. Can you try again?";
          }
          return errorMessage;
        }
      );
  }

  getAddressFromGoogle(coordinates: any) {
    const self = this;
    // tslint:disable-next-line:max-line-length
    const url =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      coordinates.latitude +
      "," +
      coordinates.longitude +
      "&key=AIzaSyBIkciq9uOKr-qf0DznksI1mn8w0HNaUtA";
    this.http
      .get(url)
      // .map(address => address.json())
      .subscribe(
        address => {
          const addressObject = this.processLocationInformation(address);
          self.userStatusService.setLocationAvailable(true);
          self.userStatusService.setUserAddress(JSON.stringify(addressObject));
          self.addressFoundFromGoogle.emit(addressObject);
        },
        error => {
          self.userStatusService.setLocationAvailable(false);
          console.log("error getting address from google");
          self.addressFoundFromGoogle.emit("Unknown");
        }
      );
  }

  processLocationInformation(result: any) {
    const addressObject = {
      address: "",
      country: "",
      state: ""
    };
    if (result.status === "OK") {
      const firstResult = result.results[0];
      addressObject.address = firstResult;
      for (let i = firstResult.address_components.length - 1; i >= 0; i--) {
        if (firstResult.address_components[i].types[0] === "country") {
          addressObject.country = firstResult.address_components[i].long_name;
        }
        if (
          firstResult.address_components[i].types[0] ===
          "administrative_area_level_1"
        ) {
          addressObject.state = firstResult.address_components[i].long_name;
        }
      }
      addressObject.address = firstResult.formatted_address;
      return addressObject;
    }
  }

  loginWithGoogle() {
    const self = this;
    return firebase
      .login({
        type: firebase.LoginType.GOOGLE
      })
      .then(
        (result: any) => {
          UserStatusService.token = result.uid;
          console.log(
            "The return payload of login with google: " + JSON.stringify(result)
          );
          return result;
        },
        (errorMessage: any) => {
          // tslint:disable-next-line:max-line-length
          if (
            errorMessage ===
            "Logging in the user failed. com.google.firebase.auth.FirebaseAuthUserCollisionException: An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
          ) {
            errorMessage =
              "Your gmail has been used to sign up using the Email Account option. Log in with the Email Account Option.";
          } else {
            errorMessage = "Something went wrong. Can you try again?";
          }
          return errorMessage;
        }
      );
  }

  logout() {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
    console.log("removing the push token for the user from firebase");
    this.removePushTokenFromFirebase(
      userId,
      this.userStatusService.getPushToken()
    );
    this.userStatusService.removePushToken();
    this.userStatusService.removeUser();
    this.userStatusService.removeUserAccount();
    this.userStatusService.removeUserAddress();
    this.userStatusService.removeUserGrades();
    this.userStatusService.removeUserSubjects();
    this.userStatusService.removeAuthorizationStatus();
    UserStatusService.token = "";
    firebase.logout();
  }

  resetPassword(uemail) {
    return firebase
      .resetPassword({
        email: uemail
      })
      .then(
        (result: any) => {
          alert({
            title: "Done!",
            message: "An email to help you reset your password is on its way.",
            okButtonText: "OK"
          });
        },
        function(errorMessage: any) {
          if (errorMessage === "Sending password reset email failed") {
            errorMessage =
              "We coudn't find an account with that email address. Please try again. If you are stuck, reach out at feedback@onmyfingertips.com.";
          }
          alert({
            title: "Uh, oh!",
            message: errorMessage,
            okButtonText: "OK"
          });
        }
      )
      .catch(this.handleErrors);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }

  checkUsersRegistration(data) {
    return firebase
      .query(
        // onQueryEvent,
        function() {},
        "/production/user/" + data.uid + "/userDetails/",
        {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: "since"
          }
        }
        // tslint:disable-next-line:no-shadowed-variable
      )
      .then(
        function(result: any) {
          console.log("result from QUERY is " + JSON.stringify(result));
          return result;
        },
        error => {
          console.log("Error is" + error);
          alert(error);
        }
      );
  }

  saveUserDetails(userAccountObject: any) {
    userAccountObject.registrationComplete = true;

  }

  
  updateUserProfile(user: any) {
    firebase.update("/production/user/" + user.uid + "/userDetails/", {
      subjectsEnrolled: user.subjectsEnrolled,
      gradesEnrolled: user.gradesEnrolled
    });
  }

  saveUserDetailsFromSocialLogin(result) {
    console.log("Saved");
  }

  generatePushToken() {
    // console.log("IN GENERATE PUSH TOKEN");
    const self = this;
    // if (self.userStatusService.getPushToken() !== undefined) {
    //   // console.log("User Status Service token " + UserStatusService.token + " and User Status Service Push Token " + UserStatusService.pushToken);
    //   self.savePushTokenOnFirebase(self.userStatusService.getPushToken());
    // } else {
    return firebase.addOnPushTokenReceivedCallback(function(token) {
        console.log("Firebase push token: " + token);
        self.savePushTokenOnFirebase(token);
        self.userStatusService.setPushToken(token);
        console.log(
          "The push token at addPushToken and saved to user status service is" +
            self.userStatusService.getPushToken()
        );
      });
    // }
  }

  savePushTokenOnFirebase(token) {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
    if (userId !== undefined) {
      const userTokenPath =
        "/production/user/" + userId + "/pushToken/" + token;
      const userDetailTokenPath =
        "/production/user/" + userId + "/userDetails/pushToken/" + token;
      const data = {};
      data[userTokenPath] = {
        timeAdded: firebase.ServerValue.TIMESTAMP
      };
      data[userDetailTokenPath] = {
        timeAdded: firebase.ServerValue.TIMESTAMP
      };
      console.log("adding the push token in firebase" + token);
      firebase.update("/", data);
    } else {
      console.log("NO USER FOR PUSH TOKEN DEFINED YET");
    }
  }

  getNewPushToken() {
    const currentToken = firebase.getCurrentPushToken();
    // console.log("THE PUSH TOKEN ON LOGIN IS " + currentToken);
    return currentToken;
  }

  removePushTokenFromFirebase(userId, token) {
    console.log("in the function to remove the push token from firebase");
    if (userId !== undefined) {
      const userTokenPath = "/production/user/" + userId + "/pushToken/";
      const userDetailTokenPath =
        "/production/user/" + userId + "/userDetails/pushToken/";
      const data = {};

      data[userTokenPath] = null;
      data[userDetailTokenPath] = null;
      firebase.update("/", data);
    } else {
      console.log("USER IS NOT ASSIGNED TO THIS PUSH TOKEN");
    }
  }

  registrationEvent() {
    firebase.analytics
      .logEvent({
        key: "registered",
        parameters: []
      })
      .then(() => console.log("Registration event logged"));
  }

  signupEvent() {
    firebase.analytics
      .logEvent({
        key: "signup",
        parameters: []
      })
      .then(() => console.log("Signup event logged"));
  }

  setUserProperties(grades, subjects) {
    this.checkMultiSubjects(subjects);
    // tslint:disable-next-line:forin
    for (const key in grades) {
      if (grades.hasOwnProperty(key)) {
        switch (key) {
          case "Pre-Primary":
            firebase.analytics
              .setUserProperty({
                key: "pre_primary_grades",
                value: "true"
              })
              .then(() => console.log("User Property Pre-Primary set"));
            break;
          case "Early Primary (1-2)":
            firebase.analytics
              .setUserProperty({
                key: "early_primary_grades",
                value: "true"
              })
              .then(() => console.log("User Property Early Primary (1-2) set"));
            break;
          case "Primary (3-5)":
            firebase.analytics
              .setUserProperty({
                key: "primary_grades",
                value: "true"
              })
              .then(() => console.log("User Property Primary (3-5) set"));
            break;
          case "Middle School (6-8)":
            firebase.analytics
              .setUserProperty({
                key: "middle_grades",
                value: "true"
              })
              .then(() => console.log("User Property Middle School (6-8) set"));
            break;
          case "High School (9-10)":
            firebase.analytics
              .setUserProperty({
                key: "high_grades",
                value: "true"
              })
              .then(() => console.log("User Property High School (9-10) set"));
            break;
        }
      }
    }
    for (const key in subjects) {
      if (subjects.hasOwnProperty(key)) {
        switch (key) {
          case "English":
            firebase.analytics
              .setUserProperty({
                key: "english_subscriber",
                value: "true"
              })
              .then(() => console.log("User Property English set"));
            break;
          case "Math":
            firebase.analytics
              .setUserProperty({
                key: "math_subscriber",
                value: "true"
              })
              .then(() => console.log("User Property Math set"));
            break;
          case "Science":
            firebase.analytics
              .setUserProperty({
                key: "science_subscriber",
                value: "true"
              })
              .then(() => console.log("User Property Science set"));
            break;
        }
      }
    }
  }

  checkMultiSubjects(subjects: any) {
    if (Object.keys(subjects).length > 1) {
      firebase.analytics
        .setUserProperty({
          key: "multiple_subjects",
          value: "true"
        })
        .then(() => console.log("User Property MultiSubject set"));
    }
  }

  logLoginScreen() {
    firebase.analytics
      .setScreenName({
        screenName: "Login Screen"
      })
      .then(function() {
        console.log("Login Screen visible");
      });
  }

  logRegistrationScreen() {
    firebase.analytics
      .setScreenName({
        screenName: "Registration Screen"
      })
      .then(function() {
        console.log("Registration Screen visible");
      });
  }
}
