export interface Question {
  createdBy: {
    // followerNum: number;
    userName: string;
    userImageUrl: string;
    uid?: string;
    // userLevel: string;
  };
  grades: any;
  hiddenTags?: [
    {
      detailedTag?: string;
      tagType: string;
      tagUnit?: string;
      value: string;
    }
  ];
  indiaGrade?: any;
  indiaLesson?: any;
  indiaStream?: any;
  isAdvanced?: boolean;
  // questionStatus: string;
  forReview?: boolean;
  questionText: string;
  questionType: string;
  subjectApplicable: any;
  visibleTags: [
    {
      detailedTag?: string;
      tagType: string;
      tagUnit?: string;
      value: string;
    }
  ];
  dateCreated?: string;
  difficultyLevel?: string;
  flagCount?: [
    {
      uid: string;
      time: string;
    }
  ];
  gradesDetail?: any;
  nrQuestionId?: string;
  pathToCreateQuestionPage?: string;
  questionId?: string;
  questionImagesUrl?: string;
  // questionMarks?: number;
  // questionViews?: number;
  reviewAccepts?: [
    {
      uid: string;
      time: string;
    }
  ];
  reviewRequests?: [
    {
      uid: string;
      time: string;
    }
  ];
  selected?: boolean;
  upvotes?: [
    {
      uid: string;
      time: string;
    }
  ];
  usageCount?: [
    {
      uid: string;
      time: string;
    }
  ];
}

export interface MCQItem extends Question {
  answerOptions: {
    option1: string;
    option2: string;
    option3: string;
    option4: string;
  };
  correctAnswer: [
    {
      optionNumber: string;
      text: string;
    }
  ];
}

export interface MCQImageItem extends Question {
  correctAnswer: [
    {
      optionNumber: string;
      text: string;
    }
  ];
  answerImages?: [
    {
      order: string;
      url: string;
    }
  ];
}

export interface VSAItem extends Question {
  correctAnswer: [
    {
      type: string;
      text: string;
      imageURL?: string;
    }
  ];
}

export interface LAItem extends Question {
  correctAnswer: [
    {
      keyImage?: string;
      keyMarks?: string;
      keyOrderNumber?: string;
      text: string;
      type: string;
    }
  ];
}

export interface MPItem extends Question {
  subQuestions: [MCQItem | VSAItem | LAItem];
}
