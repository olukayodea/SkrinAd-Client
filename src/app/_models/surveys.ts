import { MiniAdvert, StatImpression } from './advert';
import { ClientsData } from './users';
import { ContentStatus, CategoryData, CountryData, Counts, Error, Finance, FinanceData, PaymentStatus, AreasData } from './data';

export class Survery {
    success: true|false;
    results: string;
    error: Error;
    counts: Counts
    data: SurveyData[] = [];
}

export class OneSurvey {
  success: true|false;
  error: Error;
  results: string;
  data: SurveyData;
}

export class SurveyData {
    ref: number;
    advert: MiniAdvert;
    country: string;
    code: string;
    title: string;
    caption: string;
    description: string;
    impression: Impressions;
    category: CategoryData[] = [];
    type: string;
    url: string;
    logo: string;
    areas: string[] = [];
    avail_date: string[] = [];
    age: string[] = [];
    gender: string[] = [];
    payment_status: PaymentStatus;
    status: ContentStatus;
    owner: ClientsData;
    subOwner: ClientsData;
    finance: Finance;
    getPersonalData: boolean;
    multipleAnswers: boolean;
    randomOrder: boolean;
    statistics: SurveyStatistics;
    qustions: Question;
    created: string;
    lastModified: string;

    constructor() {
        this.advert = new MiniAdvert();
        this.impression = new Impressions();
        this.status = new ContentStatus();
        this.payment_status = new PaymentStatus();
        this.owner = new ClientsData();
        this.subOwner = new ClientsData();
        this.qustions = new Question();
        this.finance = new Finance();
        this.statistics = new SurveyStatistics();
    }
}

export class SurveyStatistics {
    surveyProgress: number;
    impression: StatImpression;
    budget: StatBudget;

    constructor() {
        this.impression = new StatImpression();
        this.budget = new StatBudget();
    }
}

export class StatBudget {
    used: FinanceData;
    unused: FinanceData;
    total: FinanceData;

    constructor() {
        this.used = new FinanceData();
        this.unused = new FinanceData();
        this.total = new FinanceData();
    }
}

export class Question {
    count: number;
    time: string;
    data: QuestionData[] = [];
}

export class QuestionData {
    ref: number;
    title: string;
    response: boolean;
    response_type: string;
    responseData: string[] = [];
    minimumSelection: number;
    allowManualInput: boolean;
}

export class Impressions {
    issued: number = 0;
    used: number = 0;
    remaining: number = 0;
    fee: FinanceData;
    budget: FinanceData;

    constructor() {
        this.fee = new FinanceData();
        this.budget = new FinanceData();
    }
}

export class AllSurveyData {
    success: boolean;
    results: string;
    data: {
        imp_cost: number;
        min_survey_imp: number;
        min_survey_budget: number;
        areas: AreasData[];
        categories: CategoryData[];
    };
}
