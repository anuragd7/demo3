// export class Question {
//     constructor(
// 	public id:number,
//     public type: "questionMCQ"| "questionSA"| "request" | "referral" | "interestLink",
// 	public grades: any,
//     public date: string
//     ){}
// }

export class McqItem {
    constructor(
        public questionId: string,
        public grades: any,
        public questionType: string,
        public subjectApplicable: any,
        questionText: string,
        correctAnswer: any,
        hiddenTags: any,
        upvotes: number,
        flagCount: number,
        questionStatus: any,
        public createdBy: {
            userName: string,
            userImageUrl?: string,
            followerNum: number,
            userLevel: string
        },
        answerOptions?: {
            option1: string,
            option2: string,
            option3: string,
            option4: string,
        },
        difficultyLevel?: string,
        visibleTags?: any,
        questionViews?: string,
        usageCount?: number,
        questionMarks?: number,
        reviewRequest?: number,
        reviewAccepts?: number,
        pathToCreateQuestionPage?: string,
        public isAdvanced?: boolean,
        date?: string,
        nrQuestionId?: string,
        questionImagesUrl?: string,
        public answerImages?: {
            order: number,
            url: string,
        }
    ) { }
    // ){super(id,type,grades, date);}
}

export class VSAItem {
    constructor(
        public questionId: string,
        public questionType: string,
        public questionText: string,
        public correctAnswer: [{
            type: string,
            text: string,
            imageURL?: string,
        }],
        subjectApplicable?: any,
        questionImagesUrl?: string,
        upvotes?: number,
        flagCount?: number,
        questionStatus?: any,
        createdBy?: {
            userName: string,
            userImageUrl?: string,
            followerNum: number,
            userLevel: string
        },
        grades?: any,
        difficultyLevel?: string,
        visibleTags?: any,
        hiddenTags?: any,
        questionViews?: string,
        usageCount?: number,
        questionMarks?: number,
        reviewRequest?: number,
        reviewAccepts?: number,
        pathToCreateQuestionPage?: string,
        public isAdvanced?: boolean,
        date?: string,
        nrQuestionId?: string,
        public answerImages?: {
            order: number,
            url: string,
        }
    ) { }
    // ){super(id,type,grades, date);}
}
