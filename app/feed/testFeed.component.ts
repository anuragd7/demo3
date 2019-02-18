import { Component, NgZone, ViewContainerRef } from "@angular/core";
import { UserStatusService } from "../services/userStatus.service";

@Component({
  moduleId: module.id,
  selector: "test-feed",
  templateUrl: "./testFeed.component.html"
})
export class TestFeedComponent {
  demoUser: any;
  
  constructor(
    private userStatusService: UserStatusService,
  ){
    this.demoUser = {
      "subjectsEnrolled": { "English": true },
      "profileImageURL": "",
      "anonymous": false,
      "country": "India",
      "uPoints": 1400,
      "isFirstTime": {
        "searchResult": true,
        "questionInput": true,
        "detailedTest": false,
        "tagInput": true
      },
      "registrationDate": "1531576923524",
      "testReminders": true,
      "pushToken": {
        "ch2VTo6FYmk:APA91bHoPZtpkdwsj59o0FTVcLZhm9gBVKWmKthR9DT2GYv_4DYdZZ_J4r-C2usZuQW8H3m1A22URocQvWhvXfqiKw5YLzm2eOj-GDDXESbg3j5ILA9l47M7kdsmpcOmUZv4aZmdG36P": {
          "timeAdded": 1550324125976
        },
        "d6T0TsGBtWc:APA91bGLr-sABHwMe9RO3N3TnAQbUcAaGMwrHAfijboCCjtREc77-4XsjIvOMtdiJcYUSACDBuqGMoCmrkHdTqN5EzuLtof3QLuePmFEOc74T_Ij-IG1PzmGPpXCUkEfLtvOpj4X2GFC": {
          "timeAdded": 1550304830746
        },
        "cfe2eM19nK0:APA91bG3WZWPPo_srs542HsTHK8FZPoDx_1gNAvs0uJkUiWqwdsP6Ym6iucLE1l2dLLMNHrHIXocecPENGdIeI13FrxPu3Tex92QXwiGdo3wN2foqKVbCsdIKLYthhWtBD5d4ocgItEf": {
          "timeAdded": 1550303723483
        },
        "eLBH3a5RRlI:APA91bFz3w2caiORLgkJ_hmVSGjEXxcrb0XTp2EoMBs7Oo8G2tRDyfT6YZxGnVMu5kiWVWEhEZoRuAzl8XDI8BbKIBxFyf48WjKatJJ13YG_bQMS3U7jtQnyi-7Vxhds-TdmxohrvbSS": {
          "timeAdded": 1550307548861
        }
      },
      "name": "Demo user",
      "userLevel": "Contributor",
      "state": "XCXC",
      "registrationComplete": true,
      "isAdmin": false,
      "email": "abc@gmail.com",
      "uid": "abcabcabc",
      "emailVerified": true,
      "testFrequency": "month",
      "isAnonymous": false,
      "gradesEnrolled": { "High School (9-10)": true },
      "userName": "Anurag Dwivedi",
      "phoneNumber": "+91123456789",
      "address": "Masjid Rd, Shivaji Nagar, Basavanna Nagar, Whitefield, Bengaluru, Karnataka 560048, India",
      "providers": [{ "id": "firebase" }, { "id": "google.com" }]
    }
    this.userStatusService.setUserAccount(JSON.stringify(this.demoUser));
  }
}
