export interface ChartAvailable {
    n_reject?: number;
    score: number;
    ext?: string;
}

export interface ChartAssigned {
    n_reject?: number;
    score: number;
    ext?: string;
    preClass: string;
}

export interface ChartAnnotated {
    n_reject?: number;
    score: number;
    ext?: string;
    preClass: string;
    chartClass: string;
    hasChart: boolean;
    multiPanel: boolean;
    assignTo: string;
}

export interface ChartValidated {
    n_reject?: number;
    score: number;
    ext?: string;
    preClass: string;
    chartClass: string;
    hasChart: boolean;
    multiPanel: boolean;
    assignTo: string;
    validate_by: string;
}