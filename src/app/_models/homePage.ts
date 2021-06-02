import { AdvertsData } from "./advert";

export class Dashboard {
    success: true|false;
    results: string;
    error: Error;
    data: DashboardData;
}

export class DashboardData {
    dashData: DashData;
    advert: AdvertsData[] = [];
    survey: [];

    constructor() {
        this.dashData = new DashData();
    }
}

export class DashData {
    advert: LabelData;
    survey: LabelData;
    running: RunningData;
    refund: RefundData;

    constructor() {
        this.advert = new LabelData();
        this.survey = new LabelData();
        this.running = new RunningData();
        this.refund = new RefundData();
    }
}

export class RunningData {
    advert: LabelData;
    survey: LabelData;

    constructor() {
        this.advert = new LabelData();
        this.survey = new LabelData();
    }
}

export class RefundData {
    impression: LabelData;
    wallet: LabelData;

    constructor() {
        this.impression = new LabelData();
        this.wallet = new LabelData();
    }
}

export class LabelData {
    value: number;
    label: string;
}