import { AreasData, CategoryData, ChartData, ChartImpression, Counts, Error, FinanceData } from './data';
import { ClientsData } from './users';

export class Adverts {
    success: true|false;
    results: string;
    error: Error;
    counts: Counts
    data: AdvertsData[] = [];
}

export class OneAdvert {
  success: true|false;
  error: Error;
  results: string;
  data: AdvertsData;
}

export class AdvertsData {
    ref: number;
    code: string;
    title: string;
    country: string;
    caption: string;
    category: CategoryData[] = [];
    impression: Impressions;
    type: string;
    url: string;
    areas: string[] = [];
    avail_date: string[] = [];
    age: string[] = [];
    gender: string[] = [];
    survey: boolean;
    question: string[] = [];
    status: AdvertStatus;
    payment_status: PaymentStatus;
    refund: string;
    gallery: [] = [];
    owner: ClientsData;
    subOwner: ClientsData;
    finance: AdvertFinance;
    statistics: AdvertStatistics;
    daysRemaining: number;
    startDate: string;
    endDate: string;
    created: string;
    lastModified: string;

    constructor() {
        this.impression = new Impressions();
        this.status = new AdvertStatus();
        this.payment_status = new PaymentStatus();
        this.owner = new ClientsData();
        this.subOwner = new ClientsData();
        this.finance = new AdvertFinance();
        this.statistics = new AdvertStatistics();
    }
}

export class MiniAdvert {
    ref: number;
    title: string;
    caption: string;
}

export class AdvertStatistics {
    advertProgress: number;
    impression: StatImpression;
    summary: StatSummary;
    budget: StatBudget;
    charts: StatCharts;

    constructor() {
        this.impression = new StatImpression();
        this.summary = new StatSummary();
        this.budget = new StatBudget();
        this.charts = new StatCharts();
    }
}

export class StatImpression {
    assigned: number = 0;
    used: number = 0;
    unused: number = 0;
    saved: number = 0;
    total: number = 0;
}

export class StatSummary {
    clicked: number = 0;
    seen: number = 0;
    urlVisit: number = 0;
    clickThroRate: number = 0;
    endDate: string;
}

export class StatBudget {
    used: FinanceData;
    unused: FinanceData;
    gross: FinanceData;
    net: FinanceData;
    gains: StatBudgetGains;

    constructor() {
        this.used = new FinanceData();
        this.unused = new FinanceData();
        this.gross = new FinanceData();
        this.net = new FinanceData();
        this.gains = new StatBudgetGains();
    }
}

export class StatBudgetGains {
    impression: FinanceData;
    wallet: FinanceData;

    constructor() {
        this.impression = new FinanceData();
        this.wallet = new FinanceData();
    }
}

export class StatCharts {
    dailyGaiins: ChartData;
    dailyImpression: ChartImpression;
    weekImpression: ChartImpression;
    monthlyImpression: ChartImpression;
    locationRequest: ChartData;
    deviceRequest: ChartData;

    constructor() {
        this.dailyGaiins = new ChartData();
        this.dailyImpression = new ChartImpression();
        this.weekImpression = new ChartImpression();
        this.monthlyImpression = new ChartImpression();
        this.locationRequest = new ChartData();
        this.deviceRequest = new ChartData();
    }
}

export class Impressions {
    issued: number = 0;
    used: number = 0;
    added: number = 0;
    dailyCap: number = 0;
    runTime: number = 0;
    total: number = 0;
    remaining: number = 0;
}

export class AdvertStatus {
    new: boolean;
    pending: boolean;
    active: boolean;
    inactive: boolean;
    deleted: boolean;
    complete: boolean;
}

export class PaymentStatus {
    approved: boolean;
    notApproved: boolean;
}

export class AdvertFinance {
    amtPerImp: FinanceData;
    campaignTotal: FinanceData;
    wallet: AdvertWalletData;

    constructor() {
        this.amtPerImp = new FinanceData();
        this.campaignTotal = new FinanceData();
        this.wallet = new AdvertWalletData();
    }
}

export class AdvertWalletData {
    currentBalance: FinanceData;
    newBalance: FinanceData;

    constructor() {
        this.currentBalance = new FinanceData();
        this.newBalance = new FinanceData();
    }
}

export class AllAdvertData {
    success: boolean;
    results: string;
    data: {
        min_imp: number;
        areas: AreasData[];
        categories: CategoryData[];
    };
}
