import { Injectable } from "@angular/core";
import {
  setString,
  getString,
  remove,
  setBoolean,
  getBoolean
} from "application-settings";

const tokenKey = "token";

// import { User, UserAccount } from "../models/user.model";

@Injectable()
export class UserStatusService {
  constructor() {}

  public storedUser = "NO_USER";
  // public userToken = <boolean> false;

  setUser(storingUser: string) {
    setString("storedUser", storingUser);
  }

  getUser(): string {
    return getString("storedUser");
  }

  removeUser() {
    remove("storedUser");
  }

  //Will determine the Authorization status.
  //1. unauthorized: not Logged in and not registered.
  //2. authorized: logged in and registered.
  //3. registration-pending: logged in but not registered.
  setAuthorizationStatus(status: string) {
    setString("authorizationStatus", status);
  }

  getAuthorizationStatus() {
    return getString("authorizationStatus", "unauthorized");
  }

  removeAuthorizationStatus() {
    remove("authorizationStatus");
  }

  setPushToken(pushToken: string) {
    setString("pushToken", pushToken);
  }

  getPushToken(): string {
    return getString("pushToken");
  }

  removePushToken() {
    remove("pushToken");
  }

  static isLoggedIn(): boolean {
    return !!getString("token");
  }

  static get token(): string {
    return getString("token");
  }

  static set token(theToken: string) {
    setString("token", theToken);
  }

  //to  track the Users chosen Subjects in Application Settings

  setUserSubjects(selectedSubjects: string) {
    setString("userSubjects", selectedSubjects);
  }

  getUserSubjects(): string {
    return getString("userSubjects");
  }

  removeUserSubjects() {
    remove("userSubjects");
  }

  //to  track the Users chosen Grades in Application Settings

  setUserGrades(selectedGrades: string) {
    setString("userGrades", selectedGrades);
  }

  getUserGrades(): string {
    return getString("userGrades");
  }

  removeUserGrades() {
    remove("userGrades");
  }

  //to  track the Users profile data such as Name etc in the UserAccount object

  setUserAccount(userAccount: string) {
    setString("userAccount", userAccount);
  }

  getUserAccount(): string {
    return getString("userAccount");
  }

  removeUserAccount() {
    remove("userAccount");
  }

  //to store the Users address as returned by google in Application Settings

  setUserAddress(address: string) {
    setString("userAddress", address);
  }

  getUserAddress(): string {
    return getString("userAddress");
  }

  removeUserAddress() {
    remove("userAddress");
  }

  //to store the whether user has given location permission

  setLocationPermission(permission: boolean) {
    setBoolean("locationPermission", permission);
  }

  getLocationPermission(): boolean {
    return getBoolean("locationPermission");
  }

  removeLocationPermssion() {
    remove("locationPermission");
  }

  //to store the whether user has added a new Question

  setNewQuestionAdded(qAdded: boolean) {
    setBoolean("newQuestionAdded", qAdded);
  }

  getNewQuestionAdded(): boolean {
    return getBoolean("newQuestionAdded");
  }

  removeNewQuestionAdded() {
    remove("newQuestionAdded");
  }

  //to store the whether user'd location has been obtained and saved

  setLocationAvailable(availability: boolean) {
    setBoolean("locationAvailable", availability);
  }

  getLocationAvailable(): boolean {
    return getBoolean("locationAvailable");
  }

  removeLocationAvailable() {
    remove("locationAvailable");
  }

  //to store the whether the user has granted location and messaging permissions in the modal view

  setModalPermission(permission: boolean) {
    setBoolean("modalPermission", permission);
  }

  getModalPermission(): boolean {
    return getBoolean("modalPermission");
  }

  removeModalPermission() {
    remove("modalPermission");
  }
}
