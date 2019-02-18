import { Injectable, EventEmitter, NgZone } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/share";
import {
  setString,
  getString,
  remove,
  setNumber,
  getNumber,
  setBoolean,
  getBoolean
} from "application-settings";
// import * as http from "http";
const http = require("http");
import { UserStatusService } from "./userStatus.service";

import { User } from "../models/user.model";
import { McqItem, VSAItem } from "../models/questionMCQ.model";
// import { FeedItems } from "../models/question.model";
import * as fs from "file-system"; // to save image files from camera

import { Tag } from "../models/tag.model";

@Injectable()
export class FirebaseCreateService {
  public userDetailsEventEmitter = new EventEmitter<any>();
  public newQuestionEventEmitter = new EventEmitter<any>();
  public updatedQuestionEventEmitter = new EventEmitter<any>();
  public saveAnswerEventEmitter = new EventEmitter<any>();
  public updatedTagEmitter = new EventEmitter<any>();
  public newFinalQuestionEventEmitter = new EventEmitter<any>();
  public modifiedQuestionEventEmitter = new EventEmitter<any>();
  public finalModifiedQuestionEmitter = new EventEmitter<any>();
  public createQuestionSubmitStatusEmitter = new EventEmitter<any>();
  public firebaseQImageEmitter = new EventEmitter<string>();
  public tagsReceivedEmitter = new EventEmitter<string>();

  private comingToSearchFrom: string;
  private requestDetails: string;
  private draftQuestion: string;
  private allTags: any;

  constructor(
    private userStatusService: UserStatusService,
    private ngZone: NgZone // private userStatusService: UserStatusService,
  ) {
    // this.getUserSubjects();
    // const mySubjects = JSON.parse(this.userStatusService.getUserSubjects());
    // this.tags = this.getRelevantTags(mySubjects);
  }

  // Get the USer Details
  // public getUserDetails(userId) {
  //     const self = this;
  //     console.log("I have come to get user details of");
  //     firebase.query(
  //         function () { },
  //         //Soumen[11/09/17]:Path to save user detail is changed.
  //         //"kudoauthusers/" + userId,
  //         "/production/user/" + userId + "/userDetails",
  //         {
  //             singleEvent: true,
  //             // order by company.country
  //             orderBy: {
  //                 type: firebase.QueryOrderByType.CHILD,
  //                 value: 'since', // mandatory when type is 'child'
  //             },
  //         },
  //     ).then((result) => {
  //         if (result) {
  //             console.log("get user details has returned a result");
  //             this.userDetailsEventEmitter.emit(result);
  //         }
  //     }, (error) => {
  //         console.log("USER DETAILS NOT GOT!");
  //     });
  // }

  // Save a question created or modified by the user under the user node
  public updateNewFinalQuestionInUserNode(Uid, Qid, postComponent) {
    const user = JSON.parse(this.userStatusService.getUserAccount());
    
    const newQuestionUpdate = "production/user/" + Uid + "/myQuestions/" +  Qid;
    const userDetailPoints = "production/user/"+ user.uid + "/" + "userDetails/uPoints"
    const data ={};
    data[newQuestionUpdate] = postComponent;
    data[userDetailPoints] = user.uPoints;
    firebase
      // .update("production/user/" + Uid + "/myQuestions/" + Qid, postComponent)
      .update("/", data)
      .then(
        result => {
          // this.newFinalQuestionEventEmitter.emit(result);
        },
        error => {
          console.log("NEW QUESTION NOT GOT!");
        }
      );
  }

  // saves the original (non modified) version of a modified question for reference to see if the modification is suitable
  public saveOriginalFinalQuestion(Path, postComponent) {
    console.log("I am posting the original question to tha path " + Path);

    firebase
      .update(
        "production/userCreatedQuestions" + Path,
        postComponent
        //need to include grade after fix error in the above path once the grade issues are fixed
      )
      .then(
        result => {
          console.log("Modified question is submitted and saved in Firebase");
        }
      ).catch(
        error => {
          console.log("Modified question not submitted to firebase!");
        });
  }

  public pushModfiedFinalQuestion(Path, postComponent) {
    console.log(
      "I am posting the final version of the new question to path :" +
        Path +
        "  with data" +
        JSON.stringify(postComponent)
    );
    firebase
      .push(
        "production/userCreatedQuestions" + Path,
        postComponent
        //need to include grade after fix error in the above path once the grade issues are fixed
      )
      .then(
        result => {
          console.log("the new  question is submitted and saved in Firebase");
          this.finalModifiedQuestionEmitter.emit(result);
        },
        error => {
          console.log("Modified question not submitted to firebase!");
        }
      );
  }

  public saveAnswerToFirebaseOnCreatePage() {
    const r = "";
    this.saveAnswerEventEmitter.emit(r);
  }

  // not used currently need to use with the ability for user to add new tags to a question
  // ********* NEED TO MODIFY METHOD TO ALSO SAVE AT production/questionTags/Subject
  public pushNewTagsToFirebase(
    subjects: any,
    key: string,
    newTagsCreated: any
  ) {
    const englishPath = "production/questionTags/English/" + key;
    const mathPath = "production/questionTags/Math/" + key;
    const sciencePath = "production/questionTags/Science/" + key;
    const newEnglishPath = "production/questionTags/newTags/English/" + key;
    const newMathPath = "production/questionTags/newTags/Math/" + key;
    const newSciencePath = "production/questionTags/newTags/Science/" + key;

    const data = {};
    if (subjects.indexOf("English") !== -1) {
      data[englishPath] = newTagsCreated;
      data[newEnglishPath] = newTagsCreated;
    }
    if (subjects.indexOf("Math") !== -1) {
      data[mathPath] = newTagsCreated;
      data[newMathPath] = newTagsCreated;
    }
    if (subjects.indexOf("Science") !== -1) {
      data[sciencePath] = newTagsCreated;
      data[newSciencePath] = newTagsCreated;
    }
    firebase.update("/", data).then(() => {
      console.log("New tags saved");
    });
  }

  // get tag list by subjects - Need to write this function to fetch tags on question create/modify flow
  getTagList() {
    // get tags from path /production/questionTags
  }

  public cleanDraftQuestionFromApplicationSettings() {
    this.removeComingToCreateFrom();
    this.removeRequestDetails();
    this.removeDraftQuestionType();
    this.removeDraftQuestionId();

    this.removeDraftQuestionText();
    this.removeDraftVSAAnswer();
    this.removeDraftAlternateVSAAnswer();
    this.removeDraftMCQAnswerOptions();
    this.removeCorrectMCQAnswers();
    this.removeDraftLAAnswer();
    this.removeDraftLAAnswerKeys();

    this.removeQuestionImageSaved();
    this.removeQuestionImageThumbnail();
    this.removeQuestionImageSource();
    this.removeSaveImageToFirebase();

    this.removeGradesForQuestion();
    this.removeQuestionTags();
    this.removeNewTagsCreated();
    this.removeNewTagKeys();
    this.removeAddNewTag();
    this.removeIsAdvanced();

    this.removeCreatedBy();
    this.removeOriginalQuestionDetail();
    this.removeModifiedQuestionKey();
    this.removeSubjectsForQuestion();
  }

  //Details saved and retreived from Application settings

  //coming to create From

  public setComingToCreateFrom(comingToCreateFrom: string) {
    setString("comingToCreateFrom", comingToCreateFrom);
  }

  public getComingToCreateFrom() {
    return getString("comingToCreateFrom");
  }

  public removeComingToCreateFrom() {
    remove("comingToCreateFrom");
  }

  //request details for draft question

  public setRequestDetails(requestDetails: string) {
    setString("requestDetails", requestDetails);
  }

  public getRequestDetails() {
    return getString("requestDetails");
  }

  public removeRequestDetails() {
    remove("requestDetails");
  }

  //DraftquestionId

  public setDraftQuestionId(draftQuestionId) {
    setString("draftQuestionId", draftQuestionId);
  }

  public getDraftQuestionId() {
    return getString("draftQuestionId");
  }

  public removeDraftQuestionId() {
    return remove("draftQuestionId");
  }

  //DraftQuestionText

  public setDraftQuestionText(draftQuestionText: string) {
    setString("draftQuestionText", draftQuestionText);
  }

  public getDraftQuestionText() {
    return getString("draftQuestionText");
  }

  public removeDraftQuestionText() {
    remove("draftQuestionText");
  }

  //Draft Question Type

  public setDraftQuestionType(draftQuestionType: string) {
    setString("draftQuestionType", draftQuestionType);
  }

  public getDraftQuestionType() {
    return getString("draftQuestionType");
  }

  public removeDraftQuestionType() {
    remove("draftQuestionType");
  }

  //Draft VSA answer
  public setDraftVSAAnswer(draftVSAAnswer: string) {
    setString("draftVSAAnswer", draftVSAAnswer);
  }

  public getDraftVSAAnswer() {
    return getString("draftVSAAnswer");
  }

  public removeDraftVSAAnswer() {
    remove("draftVSAAnswer");
  }

  //DraftAlternateAnswer

  public setDraftAlternateVSAAnswer(draftAlternateVSAAnswer: string) {
    setString("draftAlternateVSAAnswer", draftAlternateVSAAnswer);
  }

  public getDraftAlternateVSAAnswer() {
    return getString("draftAlternateVSAAnswer");
  }

  public removeDraftAlternateVSAAnswer() {
    return remove("draftAlternateVSAAnswer");
  }

  //Draft MCQ answer options

  public setDraftMCQAnswerOptions(draftMCQAnswerOptions) {
    setString("draftMCQAnswerOptions", draftMCQAnswerOptions);
  }

  public getDraftMCQAnswerOptions() {
    return getString("draftMCQAnswerOptions");
  }

  public removeDraftMCQAnswerOptions() {
    remove("draftMCQAnswerOptions");
  }

  // correct MCQ Answers

  public setCorrectMCQAnswers(draftCorrectMCQAnswer) {
    setString("draftCorrectMCQAnswer", draftCorrectMCQAnswer);
  }

  public getCorrectMCQAnswers() {
    return getString("draftCorrectMCQAnswer");
  }

  public removeCorrectMCQAnswers() {
    return remove("draftCorrectMCQAnswer");
  }

  //Draft LA Answer
  public setDraftLAAnswer(draftLAAnswer: string) {
    setString("draftLAAnswer", draftLAAnswer);
  }

  public getDraftLAAnswer() {
    return getString("draftLAAnswer");
  }

  public removeDraftLAAnswer() {
    remove("draftLAAnswer");
  }

  //LA - number of Answer Keys

  public setDraftLAAnswerKeys(draftLAAnswerKeys: number) {
    setNumber("draftLAAnswerKeys", draftLAAnswerKeys);
  }

  public getDraftLAAnswerKeys() {
    return getNumber("draftLAAnswerKeys");
  }

  public removeDraftLAAnswerKeys() {
    remove("draftLAAnswerKeys");
  }

  //Question Image

  public getQuestionImageSaved() {
    return getString("questionImagesUrl");
  }

  public setQuestionImageSaved(questionImagesUrl: string) {
    setString("questionImagesUrl", questionImagesUrl);
  }

  public removeQuestionImageSaved() {
    remove("questionImagesUrl");
  }

  //Question Iamge thumbnail

  public getQuestionImageThumbnail() {
    return getString("questionImagesThumbnail");
  }

  public setQuestionImageThumbnail(questionImagesThumbnail: string) {
    setString("questionImagesThumbnail", questionImagesThumbnail);
  }

  public removeQuestionImageThumbnail() {
    remove("questionImagesThumbnail");
  }

  // Question Image Source Name

  public getQuestionImageSource() {
    return getString("questionImageSource");
  }

  public setQuestionImageSource(questionSource: string) {
    setString("questionImageSource", questionSource);
  }

  public removeQuestionImageSource() {
    remove("questionImageSource");
  }

  //Question Tags

  public getQuestionTags() {
    return getString("questionTags");
  }

  public setQuestionTags(questionTags: string) {
    setString("questionTags", questionTags);
  }

  public removeQuestionTags() {
    remove("questionTags");
  }

  //methods to access all Available Tags in application settings

  public getAllTags() {
    return getString("allTags");
  }

  public setAllTags(allTags: string) {
    setString("allTags", allTags);
  }

  public removeAllTags() {
    remove("allTags");
  }

  //methods to access new Tag created bu the user in application settings

  public getNewTag() {
    return getString("newTag");
  }

  public setNewTag(newTag: string) {
    setString("newTag", newTag);
  }

  public removeNewTag() {
    remove("newTag");
  }

  //methods to access showAddNewTag variable in tag component

  public getAddNewTag() {
    return getBoolean("addNewTag");
  }

  public setAddNewTag(addNewTag: boolean) {
    setBoolean("addNewTag", addNewTag);
  }

  public removeAddNewTag() {
    remove("addNewTag");
  }

  //methods to store an array of Keys for every new Tag created by a user

  public getNewTagKeys() {
    return getString("newTagKeys");
  }

  public setNewTagKeys(newTagKeys: string) {
    setString("newTagKeys", newTagKeys);
  }

  public removeNewTagKeys() {
    remove("newTagKeys");
  }

  //methods to store subject for which tags have been received last

  public getTagSubject() {
    return getString("tagSubject");
  }

  public setTagSubject(tagSubject: string) {
    setString("tagSubject", tagSubject);
  }

  public removeTagSubject() {
    remove("tagSubject");
  }

  //methods to access times that different subject tags were fetched from the databse

  public getEnglishTime() {
    return getString("englishTime");
  }

  public setEnglishTime(time: string) {
    setString("englishTime", time);
  }

  public removeEnglishTime() {
    remove("englishTime");
  }

  public getScienceTime() {
    return getString("scienceTime");
  }

  public setScienceTime(time: string) {
    setString("scienceTime", time);
  }

  public removeScienceTime() {
    remove("scienceTime");
  }

  public getMathTime() {
    return getString("mathTime");
  }

  public setMathTime(time: string) {
    setString("mathTime", time);
  }

  public removeMathTime() {
    remove("mathTime");
  }

  //methods to access all the new Tags created by user locally

  public getNewTagsCreated() {
    return getString("newTagsCreated");
  }

  public setNewTagsCreated(newTagsCreated: string) {
    setString("newTagsCreated", newTagsCreated);
  }

  public removeNewTagsCreated() {
    remove("newTagsCreated");
  }

  //Advanced Question?
  public getIsAdvanced() {
    return getBoolean("isAdvanced", false);
  }

  // public setIsAdvanced(isAdvanced: string) {
  //     setString('isAdvanced', isAdvanced);
  // }
  public setIsAdvanced(isAdvanced: boolean) {
    setBoolean("isAdvanced", isAdvanced);
  }

  public removeIsAdvanced() {
    remove("isAdvanced");
  }

  //Grades for Question

  public getGradesForQuestion() {
    return getString("gradesForQuestion");
  }

  public setGradesForQuestion(gradesForQuestion: string) {
    setString("gradesForQuestion", gradesForQuestion);
  }

  public removeGradesForQuestion() {
    remove("gradesForQuestion");
  }

  //Subjects for Question

  public getSubjectsForQuestion() {
    return getString("subjectApplicable");
  }

  public setSubjectsForQuestion(subjectsForQuestion: string) {
    setString("subjectApplicable", subjectsForQuestion);
  }

  public removeSubjectsForQuestion() {
    remove("subjectApplicable");
  }

  //CreatedBy

  public getCreatedBy() {
    return getString("createdBy");
  }

  public setCreatedBy(createdBy: string) {
    setString("createdBy", createdBy);
  }

  public removeCreatedBy() {
    remove("createdBy");
  }

  //modified question key
  public getModifiedQuestionKey() {
    return getString("modifiedQuestionKey");
  }

  public setModifiedQuestionKey(modifiedQuestionKey: string) {
    setString("modifiedQuestionKey", modifiedQuestionKey);
  }

  public removeModifiedQuestionKey() {
    remove("modifiedQuestionKey");
  }

  //original question detail

  public getOriginalQuestionDetail() {
    return getString("originalQuestionDetail");
  }

  public setOriginalQuestionDetail(originalQuestionDetail: string) {
    setString("originalQuestionDetail", originalQuestionDetail);
  }

  public removeOriginalQuestionDetail() {
    remove("originalQuestionDetail");
  }

  setSaveImageToFirebase(savingStatus: string) {
    setString("savingStatus", savingStatus);
  }

  getSaveImageToFirebase() {
    return getString("savingStatus");
  }

  public removeSaveImageToFirebase() {
    remove("savingStatus");
  }

  // next two methods for saving images in the file system

  public getFilename(path: string) {
    const parts = path.split("/");
    return parts[parts.length - 1];
  }

  public documentsPath(filename: string) {
    return `${fs.knownFolders.documents().path}/${filename}`;
  }

  // to upload file in firebase storage
  uploadLocalFile(localPath: string, userId: string, file?: any): Promise<any> {
    const filename = this.getFilename(localPath);
    // const filePath = "'qImages' + '/' + 'usercreated'";
    // const filePath = "qImages/usercreated";
    const remotePath = `qImages/usercreated/` + userId + "/" + `${filename}`;
    // this.changeQuestionImageUrl(remotePath);
    // const remotePath = this.documentsPath(filename);
    return firebase.storage.uploadFile({
      remoteFullPath: remotePath,
      localFullPath: localPath,
      onProgress: function(status) {
        console.log("Uploaded fraction: " + status.fractionCompleted);
        console.log("Percentage complete: " + status.percentageCompleted);
      }
    });
    // ,((error) => console.log("Could not upload File. error = " + error));
  }

  // to upload file in firebase storage
  uploadUserImage(localPath: string, userId: string, file?: any): Promise<any> {
    const filename = this.getFilename(localPath);
    const remotePath =
      `production/user/` + userId + "/userDetails/" + `${filename}`;
    return firebase.storage.uploadFile({
      remoteFullPath: remotePath,
      localFullPath: localPath,
      onProgress: function(status) {
        console.log("Uploaded fraction: " + status.fractionCompleted);
        console.log("Percentage complete: " + status.percentageCompleted);
      }
    });
    // ,((error) => console.log("Could not upload File. error = " + error));
  }

  changeQuestionImageUrl(firebasePath: string) {
    this.firebaseQImageEmitter.emit(firebasePath);
  }

  downloadImage(url: string) {
    return http.getImage(url);
  }

  // to get download url of file in firebase storage
  getDownloadUrl(remoteFilePath: string): Promise<any> {
    return firebase.storage
      .getDownloadUrl({
        remoteFullPath: remoteFilePath
      })
      .then(
        function(url: string) {
          return url;
        },
        function(errorMessage: any) {
          console.log(errorMessage);
        }
      );
  }

  logQuestionCreated() {
    firebase.analytics
      .logEvent({
        key: "question_created",
        parameters: []
      })
      .then(() => console.log("Question created event logged"));
  }

  logQInputScreen() {
    firebase.analytics
      .setScreenName({
        screenName: "Qusetion Input Screen"
      })
      .then(function() {
        console.log("On Question Input Screen");
      });
  }

  logTagScreen() {
    firebase.analytics
      .setScreenName({
        screenName: "Question Tag Screen"
      })
      .then(function() {
        console.log("On Question Tag Screen");
      });
  }

  logReviewScreen() {
    firebase.analytics
      .setScreenName({
        screenName: "Question Review Screen"
      })
      .then(function() {
        console.log("On Question Review Screen");
      });
  }

  logImageSearchScreen() {
    firebase.analytics
      .setScreenName({
        screenName: "Image Search Screen"
      })
      .then(function() {
        console.log("On Image Search Screen");
      });
  }

  getRelevantTags(subject: string) {
    const self = this;
    // const subjectMarker = (subjects.length - 1);
    // for (let i = 0; i < subjects.length; i++) {
    firebase
      .query(function() {}, "production/questionTags/" + subject, {
        singleEvent: true,
        orderBy: {
          type: firebase.QueryOrderByType.CHILD,
          value: "since"
        }
      })
      .then(
        result => {
          if (result.value) {
            console.log("tags returned from FIREBASE");
            // if (self.getAllTags() !== undefined && self.getAllTags() !== null) {
            // self.allTags = JSON.parse(self.getAllTags());
            // } else {
            self.allTags = [];
            // }
            const tagDate = new Date();
            const dateString = tagDate.toISOString();
            if (result.key === "English") {
              self.setEnglishTime(dateString);
            } else if (result.key === "Math") {
              self.setMathTime(dateString);
            } else if (result.key === "Science") {
              self.setScienceTime(dateString);
            }
            self.setTagSubject(result.key);
            const newTagArray = self.convertTagsToArray(result.value);
            const tagsWithImage = self.addImagePathToTags(newTagArray);
            for (let i = 0; i < tagsWithImage.length; i++) {
              // if (self.allTags.indexOf(tagsWithImage[i]) === -1) {
              self.allTags.push(tagsWithImage[i]);
              // }
            }
            self.setAllTags(JSON.stringify(self.allTags));
            self.tagsReceivedEmitter.emit(self.allTags);
          }
        },
        error => {
          console.log("Tags NOT GOT FROM FIREBASE");
        }
      );
    // }
  }

  convertTagsToArray(object: any) {
    const tempArray = [];
    for (let item in object) {
      if (object.hasOwnProperty(item)) {
        tempArray.push(object[item]);
      }
    }
    return tempArray;
  }

  addImagePathToTags(tagArray: any) {
    for (let i = 0; i < tagArray.length; i++) {
      switch (tagArray[i].tagType) {
        case "topic": {
          tagArray[i].imagePath = "res://topic";
          console.log("topic");
          break;
        }
        case "skill": {
          tagArray[i].imagePath = "res://skill";
          console.log("skill");
          break;
        }
        case "learningOutcome": {
          tagArray[i].imagePath = "res://learningoutcome";
          console.log("learning outcome");
          break;
        }
        case "commonCore": {
          tagArray[i].imagePath = "res://commoncore";
          console.log("common core");
          break;
        }
        case "user created": {
          tagArray[i].imagePath = "res://usercreated";
          console.log("user created");
          break;
        }
      }

      // tagArray[i].imagePath = "res://" + tagArray[i].tagType;
    }
    return tagArray;
  }

  // convert a html string into text
  public getTextFromHtml(inputHtml: string) {
    const pRemoved = inputHtml.replace(/<p>/g, "\x00");
    const ppRemoved = pRemoved.replace(/<\/p>/gm, "\x00\r\n");
    let liReplaced = ppRemoved;
    if (liReplaced.indexOf("<ul>") >= 0) {
      const ul = ppRemoved.match(/<ul>/gi).length;
      for (let i = 0; i <= ul; i++) {
        liReplaced = liReplaced.replace(/<li>/, "\n\u2022\x0d");
        liReplaced = liReplaced.replace(/<ul>/, "\x00\x00");
        liReplaced = liReplaced.replace(/<\/li>/, "\x13");
        liReplaced = liReplaced.replace(/<\/ul>/, "\x00\x00\x00");
      }
    }
    if (ppRemoved.indexOf("<ol>") >= 0) {
      const ol = ppRemoved.match(/<ol>/gi).length;
      console.log("Number of ol is" + ol);
      for (let i = 0; i <= ol; i++) {
        const num3 = "\x15\n";
        const num1 = (i + 1).toString();
        const num2 = ". ";
        const num = num3.concat(num1).concat(num2);
        liReplaced = liReplaced.replace(/<li>/, num);
        liReplaced = liReplaced.replace(/<ol>/, "\x00\x00");
        liReplaced = liReplaced.replace(/<\/li>/, "\x13");
        liReplaced = liReplaced.replace(/<\/ol>/, "\x00\x00\x00");
      }
    }

    if (liReplaced.indexOf("<br>") >= 0) {
      liReplaced = liReplaced.replace(/<br>/g, "\x0f\n");
    }

    if (liReplaced.indexOf("<strong>") >= 0) {
      liReplaced = liReplaced.replace(/<strong>/g, "\x0f");
      liReplaced = liReplaced.replace(/<\/strong>/g, "\x0f\x0f");
    }

    if (liReplaced.indexOf("<u>") >= 0) {
      liReplaced = liReplaced.replace(/<u>/g, "\x0e");
      liReplaced = liReplaced.replace(/<\/u>/g, "\x0e\x0e");
    }

    if (liReplaced.indexOf("<em>") >= 0) {
      liReplaced = liReplaced.replace(/<em>/g, "\x18");
      liReplaced = liReplaced.replace(/<\/em>/g, "\x18\x18");
    }

    if (liReplaced.indexOf("<h1>") >= 0) {
      liReplaced = liReplaced.replace(/<h1>/g, "\x14");
      liReplaced = liReplaced.replace(/<\/h1>/g, "\x14\x14");
    }

    if (liReplaced.indexOf("<h2>") >= 0) {
      liReplaced = liReplaced.replace(/<h2>/g, "\x19");
      liReplaced = liReplaced.replace(/<\/h2>/g, "\x19\x19");
    }

    if (liReplaced.indexOf("<h3>") >= 0) {
      liReplaced = liReplaced.replace(/<h3>/g, "\x17");
      liReplaced = liReplaced.replace(/<\/h3>/g, "\x17\x17");
    }

    if (liReplaced.indexOf("<sup>") >= 0) {
      liReplaced = liReplaced.replace(/<sup>0/g, "\u2070");
      liReplaced = liReplaced.replace(/<sup>1/g, "\u2071");
      liReplaced = liReplaced.replace(/<sup>2/g, "\u000B2");
      liReplaced = liReplaced.replace(/<sup>3/g, "\u000B3");
      liReplaced = liReplaced.replace(/<sup>4/g, "\u2074");
      liReplaced = liReplaced.replace(/<sup>5/g, "\u2075");
      liReplaced = liReplaced.replace(/<sup>6/g, "\u2076");
      liReplaced = liReplaced.replace(/<sup>7/g, "\u2077");
      liReplaced = liReplaced.replace(/<sup>8/g, "\u2078");
      liReplaced = liReplaced.replace(/<sup>9/g, "\u2079");
      liReplaced = liReplaced.replace(/<sup>-/g, "\u207B");
      liReplaced = liReplaced.replace(/<\/sup>/, "\x11");
    }

    if (liReplaced.indexOf("<sub>") >= 0) {
      // let sup = liReplaced.match(/<sub>/gi).length;
      // for (let i =0; i <=sup; i++) {
      // let indexOfSub = liReplaced.indexOf("<sub>");
      // let subscript = liReplaced.charAt(indexOfSub+5);
      // console.log("index is at: " + indexOfSub+ ", subscript value is at:" + subscript);
      // let unicodeSubscript = this.selectUnicodeSubscript(subscript);
      // console.log("Thee unicode subscript is: "+ unicodeSubscript);
      liReplaced = liReplaced.replace(/<sub>0/g, "\u2080");
      liReplaced = liReplaced.replace(/<sub>1/g, "\u2081");
      liReplaced = liReplaced.replace(/<sub>2/g, "\u2082");
      liReplaced = liReplaced.replace(/<sub>3/g, "\u2083");
      liReplaced = liReplaced.replace(/<sub>4/g, "\u2084");
      liReplaced = liReplaced.replace(/<sub>5/g, "\u2085");
      liReplaced = liReplaced.replace(/<sub>6/g, "\u2086");
      liReplaced = liReplaced.replace(/<sub>7/g, "\u2087");
      liReplaced = liReplaced.replace(/<sub>8/g, "\u2088");
      liReplaced = liReplaced.replace(/<sub>9/g, "\u2089");
      liReplaced = liReplaced.replace(/<sub>-/g, "\u208B");
      liReplaced = liReplaced.replace(/<\/sub>/, "\x12");
    }

    if (liReplaced.indexOf("&#39;") >= 0) {
      liReplaced = liReplaced.replace(/&#39;/g, "'");
    }

    if (liReplaced.indexOf("&nbsp;") >= 0) {
      liReplaced = liReplaced.replace(/&nbsp;/g, " ");
    }

    if (liReplaced.indexOf("&deg;") >= 0) {
      liReplaced = liReplaced.replace(/&deg;/g, "°");
    }
    return liReplaced;
  }

  public getHtmlFromText(inputString: string) {
    let inputUpdated = inputString;
    // Replace all unicode charcaters first
    if (inputUpdated.indexOf("\x12") >= 0) {
      inputUpdated = inputUpdated.replace(/\u2080/g, "<sub>0");
      inputUpdated = inputUpdated.replace(/\u2081/g, "<sub>1");
      inputUpdated = inputUpdated.replace(/\u2082/g, "<sub>2");
      inputUpdated = inputUpdated.replace(/\u2083/g, "<sub>3");
      inputUpdated = inputUpdated.replace(/\u2084/g, "<sub>4");
      inputUpdated = inputUpdated.replace(/\u2085/g, "<sub>5");
      inputUpdated = inputUpdated.replace(/\u2086/g, "<sub>6");
      inputUpdated = inputUpdated.replace(/\u2087/g, "<sub>7");
      inputUpdated = inputUpdated.replace(/\u2088/g, "<sub>8");
      inputUpdated = inputUpdated.replace(/\u2089/g, "<sub>9");
      inputUpdated = inputUpdated.replace(/\x12/g, "</sub>");
    }

    if (inputUpdated.indexOf("\x11") >= 0) {
      inputUpdated = inputUpdated.replace(/\u2070/g, "<sup>0");
      inputUpdated = inputUpdated.replace(/\u2071/g, "<sup>1");
      inputUpdated = inputUpdated.replace(/\u2072/g, "<sup>2");
      inputUpdated = inputUpdated.replace(/\u2073/g, "<sup>3");
      inputUpdated = inputUpdated.replace(/\u2074/g, "<sup>4");
      inputUpdated = inputUpdated.replace(/\u2075/g, "<sup>5");
      inputUpdated = inputUpdated.replace(/\u2076/g, "<sup>6");
      inputUpdated = inputUpdated.replace(/\u2077/g, "<sup>7");
      inputUpdated = inputUpdated.replace(/\u2078/g, "<sup>8");
      inputUpdated = inputUpdated.replace(/\u2079/g, "<sup>9");
      inputUpdated = inputUpdated.replace(/\x11/g, "</sup>");
    }

    if (inputUpdated.indexOf("\x17") >= 0) {
      inputUpdated = inputUpdated.replace(/\x17\x17/g, "</h3>");
      inputUpdated = inputUpdated.replace(/\x17/g, "<h3>");
    }

    if (inputUpdated.indexOf("\x19") >= 0) {
      inputUpdated = inputUpdated.replace(/\x19\x19/g, "</h2>");
      inputUpdated = inputUpdated.replace(/\x19/g, "<h2>");
    }

    if (inputUpdated.indexOf("\x14") >= 0) {
      inputUpdated = inputUpdated.replace(/\x14\x14/g, "</h1>");
      inputUpdated = inputUpdated.replace(/\x14/g, "<h1>");
    }

    if (inputUpdated.indexOf("\x18") >= 0) {
      inputUpdated = inputUpdated.replace(/\x18\x18/g, "</em>");
      inputUpdated = inputUpdated.replace(/\x18/g, "<em>");
    }

    if (inputUpdated.indexOf("\x0e") >= 0) {
      inputUpdated = inputUpdated.replace(/\x0e\x0e/g, "</u>");
      inputUpdated = inputUpdated.replace(/\x0e/g, "<u>");
    }

    if (inputUpdated.indexOf("\x0f") >= 0) {
      inputUpdated = inputUpdated.replace(/\x0f\x0f/g, "</strong>");
      inputUpdated = inputUpdated.replace(/\x0f\n/g, "<br>");
      inputUpdated = inputUpdated.replace(/\x0f/g, "<strong>");
    }

    // handling the ul case
    if (inputUpdated.indexOf("\x00") >= 0) {
      inputUpdated = inputUpdated.replace(/\x00\x00\x00/g, "</ul>");
      inputUpdated = inputUpdated.replace(/\x00\x00/g, "<ul>");
      inputUpdated = inputUpdated.replace(/\x13/g, "</li>");
      inputUpdated = inputUpdated.replace(/\n\u2022\x0d/g, "<li>");
    }

    if (inputUpdated.indexOf("\x15") >= 0) {
      inputUpdated = inputUpdated.replace(/\x13\x13\x13/g, "</ol>");
      inputUpdated = inputUpdated.replace(/\x13\x13/g, "<0l>");
      inputUpdated = inputUpdated.replace(/\x13/g, "</li>");
      const ol = inputUpdated.match(/\x15\n/gi).length;
      for (let i = 0; i <= ol; i++) {
        const num3 = "\x15\n";
        const num1 = (i + 1).toString();
        const num2 = ". ";
        const num = num3.concat(num1).concat(num2);
        inputUpdated = inputUpdated.replace(num, "<li>");
      }
    }

    inputUpdated = inputUpdated.replace(/\x00\r\n/g, "</p>");
    inputUpdated = inputUpdated.replace(/\x00/g, "<p>");

    return inputUpdated;
  }
}

// public deleteDraftModifiedQuestion(Uid, Qid) {
//     console.log("I am posting the final version of the modified question");

//     firebase.remove(
//         'production/draftQuestions/fixError/' + Uid  + '/' + Qid
//     ).then(
//         (result) => {
//             console.log("Modifications are submitted and draft deleted");
//         },
//         (error) => {
//             console.log("Draft is not deleted!");

//         });
// }

// public updateFinalQuestionDetail(Grade, Qid, postComponent) {
//     console.log("Iam updating question detail in firebase for Grade and QID:" + Grade + ", " + Qid);
//     console.log("the post component Iam posting is" + JSON.stringify(postComponent));
//     firebase.update(
//         'production/userCreatedQs/' + Grade + '/' + Qid, postComponent
//     ).then(
//         (result) => {
//             console.log("data updated in firebase");
//         },
//     );
// }

// public deleteDraftQuestionFromFirebase(Uid, Qid) {
//     console.log("Iam deleting question detail in firebase");
//     console.log("The uid is" + Uid);
//     // let removeQ = null;
//     firebase.remove(
//         'production/draftQuestions/' + Uid + '/' + Qid
//     ).then(
//         (result) => {
//             console.log("Iam removing question" + Qid + "for user " + Uid);
//         },
//     );
// }

// functions to save data when modifying question

// public pushDraftModifiedQuestionDetail(Uid, Qid, postComponent) {
//     console.log("the post component Iam posting is" + JSON.stringify(postComponent));
//     firebase.update(
//         'production/draftQuestions/fixError/' + Uid + '/' + Qid + '/ originalQuestion', postComponent
//     ).then(
//         (result) => {
//             console.log("Original question pushed to firebase and modification started");
//         },
//     );
// }

// public updateDraftModifiedQuestionDetail(Uid, Qid, postComponent) {
//     console.log("Iam updating MODIFIED question detail in firebase");
//     console.log("the modified data iam pushing is" + JSON.stringify(postComponent));

//     firebase.push(
//         'production/draftQuestions/fixError/' + Uid + '/' + Qid + '/ modifiedQuestion', postComponent
//     ).then(
//         (result) => {
//             console.log("Modified question pushed to firebase");
//             this.modifiedQuestionEventEmitter.emit(result);
//         },
//         (error) => {
//             console.log("MODIFIED QN NOT PUSHED!");
//         }
//         );
// }

// Create a new Questioon and get the Question Id
// public createNewQuestion(Uid, postComponent) {
//     console.log("I have come to createNewQuestion()");
//     console.log("The uid is" + Uid);
//     // var postComponent = this.getItemToSave();
//     // var self = this;
//     firebase.push(
//         'production/draftQuestions/' + Uid, postComponent,
//     ).then(
//         (result) => {
//             this.newQuestionEventEmitter.emit(result);
//         },
//         (error) => {
//             console.log("NEW QUESTION NOT GOT!");

//         });
// }
