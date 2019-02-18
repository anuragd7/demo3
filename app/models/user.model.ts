import { Question, MCQItem, LAItem, VSAItem, MPItem } from "./question.model";

//this is the basic user we use only on signup by email
export class User {
  email: string;
  password: string;
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

export class UserAccount {
  uid: string;
  email: string;
  gradesEnrolled: {
    "Pre-Primary"?: boolean;
    "Early Primary (1-2)"?: boolean;
    "Primary (3-5)"?: boolean;
    "Middle School (6-8)"?: boolean;
    "High School (9-10)"?: boolean;
  };
  phoneNumber: string;
  pushToken: any;
  registrationComplete: boolean;
  registrationDate: string;
  subjectsEnrolled: { Math?: boolean; English?: boolean; Science?: boolean };
  testFrequency: string;
  testReminders: boolean;
  userName: string;
  address?: string;
  country?: string;
  state?: string;
  feedItemsActedOnByUser?: [
    {
      feedItemId: string;
      feedItemActedDate: string;
      feedItemCreatedDate: string;
      feedItemDescription;
    }
  ];
  gender?: string;
  isFirstTime?: {
    detailedTest?: boolean;
    searchResult?: boolean;
    questionInput?: boolean;
    tagInput?: boolean;
  };
  followingMe?: [
    { uid: string; userLevel: string; userName: string; datedFollowed: string }
  ];
  iFollow?: [
    { uid: string; userLevel: string; userName: string; datedFollowed: string }
  ];
  userActions?: {
    appOpenHistory?: string[];
    peopleReferred?: number;
    questionsFlagged?: [
      { questionId: string; questionType: string; dateFlagged: string }
    ];
    questionsLiked?: [
      { questionId: string; questionType: string; dateLiked: string }
    ];
    searchPhrasesUsed?: [
      { phrase: string; date: string; numerOfResults: number }
    ];
    questionsApproved?: [
      { dateAprroved: string; questionId: string; questionType: string }
    ];
    testsPrintedIds?: [{ testId: string; dateLastPrinted: string }];
  };
  profileImageURL?: string;
  userImageUrl?: string;
  userLevel?: string;
  uPoints?: number;

  constructor(userEmail) {
    this.email = userEmail;
  }
}
