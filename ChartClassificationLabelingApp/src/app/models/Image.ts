export interface Image {
    imageName: string;
    paperCode?: string;
    imageCode?: string;
    imageUrl: string;

    preclass: string;
    preclassChartClass: string;
    preclassMultiAny: string;
    preclassHasChartAny: string;
    score: number;

    chartClass?: string;
    hasChart?: boolean;
    multiPanel?: boolean;

    assigned?: boolean;
    assignTo?: string;
    annotated?: boolean;
    validated?: boolean;
    validateBy?: string;
    rejectedCount: number;
}