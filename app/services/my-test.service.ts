import { Injectable, EventEmitter, NgZone } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/share";
import "rxjs/add/operator/map";
import { UserStatusService } from "./userStatus.service";
import { SearchStatusService } from "./search-status.service";
import { McqItem } from "../models/questionMCQ.model";
import * as ApplicationSettings from "application-settings";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams
} from "@angular/common/http";
import { UserAccount } from "../models/user.model";

@Injectable()
export class MyTestService {
  questionAdded: boolean;
  myTestEventEmitter = new EventEmitter<any>();
  myRequestEventEmitter = new EventEmitter<any>();
  user: UserAccount;
  public selectedTestQuestions: McqItem[] = [];
  selectedTest: any;
  selectedTestId: string = "";

  testResultx = new EventEmitter<any>();
  myTestToSearchEventEmitter = new EventEmitter<any>();
  newTestCreatedEventEmitter = new EventEmitter<any>();
  newTestUpdatedEventEmitter = new EventEmitter<any>();
  deletionOfQuestionFromTestStatusEventEmitter = new EventEmitter<any>();
  updatedDetailedTestQuestionsEmitter = new EventEmitter<any>();
  deletionOfTestStatusEventEmitter = new EventEmitter<any>();

  constructor(
    private userStatusService: UserStatusService,
    private searchStatusService: SearchStatusService,
    private ngZone: NgZone,
    private http: HttpClient,
    // private utils: UtilsService,
  ) {
    this.user = JSON.parse(this.userStatusService.getUserAccount());
  }

  items: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public _allItems: any[] = [];

  addQuestion(testInUse: any, item: any, likeObjects?: any) {
    const self = this;
    const createdDate = new Date();
    const time = createdDate.toISOString();
    const timeOfSave = time.replace(/[-.:]/g, "");
    // const timeOfSave = JSON.stringify(Date.now());
    console.log("Current Test" + JSON.stringify(testInUse));
    const userId = this.user.uid;
    
  }

  removeQuestion(testInUse: any, item: any) {
    const self = this;

    console.log("when removing Current Test" + JSON.stringify(testInUse));
  }

  //Fetching detailed test
  public getTestDetails(uid, testId) {
    const self = this;
  }

  // getting the current active test for a user
  getSelectedTest() {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
    const self = this;
  }

  // getting all the tests created by a particular user
  getTestList() {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
    const self = this;
  }

  // set a selected test as active test for the user
  setAsActiveTest(testID: string, testDetails: any) {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
    const testId = testID;
    const testData = testDetails;
  }

  // Add a newly created test to the users test list
  saveNewTestInUserTestList(postcontent: any) {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
    const self = this;
  }

  // Add information about a newly created test to the active test and test details paths
  updateDataOnTestCreationHandler(testId: string, testDetails: any) {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
  }

  // updates the QIDs, last modified date and question details in all 3 paths - testDetails, userActiveTest and userTestList
  updateDataOnQuestionDeletionFromTest(
    testId: string,
    dataToSaveIntestDetails: any
  ) {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
    
  }

  // updates the QIDs and last modified date in all 3 paths - testDetails, userActiveTest and userTestList
  updateDataOnQuestionReorder(testId: string, dataToSaveonReorder: any) {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;

  }

  // when in a test a question is modified update all 3 paths with QID and last modified dates
  updateTestDataOnQuestionModify(
    modifiedQn: any,
    modifiedDate: any,
    Qid: string,
    modifiedQid: string
  ) {
    const self = this;
  }

  addNewQuestionToDetailedTest(uid: string, newQ: any, newQKey: string) {
    const self = this;

  }

  updateDataOnTestDeletion(testId: string, isActiveTest: boolean) {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
  }

  logTestPrintEvent(uid, email, testName, noOfQs) {
    const testLog = testName + "-" + noOfQs.toString();
  }

  logQTypeScreen() {
    firebase.analytics
      .setScreenName({
        screenName: "Question Type Screen"
      })
      .then(function() {
        console.log("On QType Screen");
      });
  }

  // FUNCTIONS USING APPLICATION SETTINGS

  setActiveTest(result) {
    ApplicationSettings.setString("activeTestInfo", result);
  }

  getActiveTest() {
    return ApplicationSettings.getString("activeTestInfo");
  }

  removeActiveTest() {
    ApplicationSettings.remove("activeTestInfo");
  }

  setQuestionForDetailedView(result) {
    ApplicationSettings.setString(
      "questionForDetailedView",
      JSON.stringify(result)
    );
  }

  getQuestionForDetailedView() {
    const questionForDetailedView: string = ApplicationSettings.getString(
      "questionForDetailedView"
    );
    if (questionForDetailedView) {
      return JSON.parse(questionForDetailedView);
    } else {
      return questionForDetailedView;
    }
  }

  removeQuestionForDetailedView() {
    ApplicationSettings.remove("questionForDetailedView");
  }

  setQuestionToAddToTest(result) {
    ApplicationSettings.setString("questionToBeAdded", JSON.stringify(result));
  }

  getQuestionToAddToTest() {
    const questionToBeAdded: string = ApplicationSettings.getString(
      "questionToBeAdded"
    );
    if (questionToBeAdded) {
      return JSON.parse(questionToBeAdded);
    } else {
      return questionToBeAdded;
    }
    //return JSON.parse(questionToBeAdded);
  }

  removeQuestionToBeAddedFromApplicationSettings() {
    ApplicationSettings.remove("questionToBeAdded");
  }

  setModifiedQuestionIndex(index) {
    ApplicationSettings.setNumber("modifiedQuestionIndex", index);
  }

  getModifiedQuestionIndex() {
    return ApplicationSettings.getNumber("modifiedQuestionIndex");
  }

  removeModifiedQuestionIndex() {
    ApplicationSettings.remove("modifiedQuestionIndex");
  }

  setComingToDetailedTestFrom(result) {
    ApplicationSettings.setString("toTestDetailFrom", result);
  }

  getComingToDetailedTestFrom() {
    return ApplicationSettings.getString("toTestDetailFrom");
  }

  removeComingToDetailedTestFrom() {
    ApplicationSettings.remove("toTestDetailFrom");
  }

  setTestId(result) {
    ApplicationSettings.setString("testIdFromTestList", result);
  }

  getTestId() {
    return ApplicationSettings.getString("testIdFromTestList");
  }

  removeTestId() {
    ApplicationSettings.remove("testIdFromTestList");
  }

  setEmailSelection(status) {
    ApplicationSettings.setBoolean("emailstatus", status);
  }

  getEmailSelection() {
    return ApplicationSettings.getBoolean("emailstatus");
  }

  removeEmailSelection() {
    ApplicationSettings.remove("emailstatus");
  }

  // gone to detiled test is used to clearhistory on returning to the test feed component
  // to take care of a bug in routerextensions clearhistory with nested routes
  setGoneToDetailTest(status) {
    ApplicationSettings.setBoolean("toDetailTest", status);
  }

  getGoneToDetailTest() {
    return ApplicationSettings.getBoolean("toDetailTest");
  }

  removeGoneToDetailTest() {
    ApplicationSettings.remove("toDetailTest");
  }

  // Question Added to test
  setQuestionAdded(added) {
    ApplicationSettings.setBoolean("questionAdded", added);
  }

  getQuestionAdded() {
    return ApplicationSettings.getBoolean("questionAdded");
  }

  removeQuestionAdded() {
    ApplicationSettings.remove("questionAdded");
  }

  // Questions liked array
  setLikedQuestions(qArray: any) {
    ApplicationSettings.setString("likedQuestions", qArray);
  }

  getLikedQuestions() {
    return ApplicationSettings.getString("likedQuestions");
  }

  removeLikedQuestions() {
    ApplicationSettings.remove("likedQuestions");
  }

  // Question creators whose questions were liked
  setlikedCreators(creators: any) {
    ApplicationSettings.setString("likedCreators", creators);
  }

  getLikedCreators() {
    return ApplicationSettings.getString("likedCreators");
  }

  removeLikedCreators() {
    ApplicationSettings.remove("likedCreators");
  }

  // sends the email request to the server to process the data
  sendEmailRequest(testJson) {
    console.log("Iam sending an email request");
    // const serverUrl =
    // "http://192.168.6.15:9001/pdfrequest?api_key=XaBcdX138yfDEuiyW&pdf=true";
    const serverUrl =
      "https://setyourtest.com/api/testprint/pdfrequest?api_key=XaBcdX138yfDEuiyW&pdf=true";
    const data = testJson;
    const options = this.createRequestOptions();
    console.log("the options are" + JSON.stringify(options));
    this.http
      .post(serverUrl, data, options)
      // .map(result => result.json())
      .subscribe(result => console.log("result" + result));
  }

  createRequestOptions() {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    // headers.append("api_key", "XaBcdX138yfDEuiyW");
    // headers.append("Content-Type", "application/json");
    // headers.append("pdf", "true");
    // tslint:disable-next-line:object-literal-shorthand
    // const options = new RequestOptions({ headers: headers });
    const options = {
      headers
    };

    return options;
  }

  updateTestStatus(testId: string, status: string) {
    const user = JSON.parse(this.userStatusService.getUserAccount());
    const userId = user.uid;
    const uPoints = user.uPoints;

  }

  saveRequestToFirebase(requestDetails: any) {
      console.log("Request successfully saved in firebase");
  }

  saveMyRequestToFirebase(requestKey: string, requestDetails: any) {
    const userId = JSON.parse(this.userStatusService.getUserAccount()).uid;
  }

  getNewTestObject(testName) {
    const createdDate = new Date();
    const dateString = createdDate.toISOString();
    const test = {
      createdDate: dateString,
      lastModified: dateString,
      numberOfQuestions: "0",
      testName: testName,
      testQuestionIds: [],
      testStatus: "Draft",
      show: true
    };
    return test;
  }

  // clears all selected question in search result when new test is created

  clearQuestionSelection() {
    const storedSearchResults = this.searchStatusService.getSearchResult();
    storedSearchResults.forEach(element => {
      element.selected = false;
    });
    this.searchStatusService.setSearchResult(storedSearchResults);
  }
}
