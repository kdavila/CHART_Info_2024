export interface ImageAnnotation {
    imageName: string;
    imageUrl: string;
    multiPanel?: boolean;
    hasChart?: boolean;
    chartClass?: string;
    n_reject?: number;
    score: number;
    ext?: string;
    preClass: string;
}