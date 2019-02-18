export class ActiveTest {
    constructor(
        public testId: string,
        public lastModified: string,
        public numberOfQuestions: number,
        public testStatus: string,
        public testName: string,
        public testQuestionIds: any,
        public firstQuestion: any,
    ) { }
    // ){super(id,type,grades, date);}
}

