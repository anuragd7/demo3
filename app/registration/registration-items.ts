/* tslint:disable:max-line-length */
// let mockedDescription = "Cras ut turpis mollis, vestibulum leo a, eleifend enim. Nam rutrum justo vestibulum dignissim tempor. Cras ac consequat ante. Nullam malesuada vulputate leo fringilla consectetur. In ligula felis, pharetra nec lacus ornare, laoreet pellentesque odio.";
// let mockedDescriptionType2 = "Nunc vel augue quam. Phasellus pharetra lobortis nulla, at tincidunt augue consectetur sit amet. Praesent eget tellus diam. Suspendisse potenti. Praesent commodo lacinia consectetur. Pellentesque lacinia accumsan semper.";
// let mockedDescriptionType3 = "Nulla convallis urna eu est tristique, in ullamcorper sapien rutrum. Donec dictum tortor leo, ac pharetra leo fringilla vitae. Cras pellentesque ac arcu sed auctor. Aenean vitae nisl ut diam imperdiet sagittis. Maecenas eget scelerisque orci, vitae maximus ante.";
// let mockedDescriptionType4 = "Donec dictum tortor leo, ac pharetra leo fringilla vitae. Cras pellentesque ac arcu sed auctor.";

export class Grade {
    constructor(public gradeName: string, public grades: string, public image: string, public selected: boolean, public index: string) { }
}

export class GradeDataArray {
    public data: any[];
    constructor() {
        this.data = [
            new Grade("Pre-Primary", "Nursery, KinderGarten", "\ue013", false, "grade-0"),
            new Grade("Early Primary (1-2)", "Grades 1 & 2", "\ue014", false, "grade-1"),
            new Grade("Primary (3-5)", "Grades 3, 4 & 5", "\ue015", false, "grade-2"),
            new Grade("Middle School (6-8)", "Grades 6, 7 & 8", "\ue016", false, "grade-3"),
            new Grade("High School (9-10)", "Grades 9, 10, 11 & 12", "\ue018", false, "grade-4"),
        ];
    }
}

export class Subject {
    constructor(public subjectName: string, public subjectAlias: any, public image: string, public selected: boolean, public index: string) { }
}

export class SubjectDataArray {
    public data: any[];
    constructor() {
        this.data = [
            new Subject("Science", "[Environmental Studies]", "\ue010", false, "subject-0"),
            new Subject("Math", "[Mathematics]", "\ue007", false, "subject-1"),
            new Subject("English", "[Language, Literature]", "\ue006", false, "subject-2"),
        ];
    }
}
