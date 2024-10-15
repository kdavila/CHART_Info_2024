export interface ImageValidation {
    imageName: string;
    imageUrl: string;
    validate_by: string;
    selected: boolean;
    chartClass: string;
    hasChart: boolean;
    multiPanel: boolean;
    n_reject?: number;
    score: number;
    ext?: string;
    preClass: string;
    assignTo: string;
}