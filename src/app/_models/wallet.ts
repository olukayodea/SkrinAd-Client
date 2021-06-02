import { Counts, FinanceData } from "./data";
import { TransactionsData } from "./transactions";
import { ClientsData } from "./users";

export class Wallet {
    success: true|false;
    results: string;
    error: Error;
    counts: Counts;
    range: WalletRange;
    data: WalletData[] = [];
}

export class OneWallet {
    success: true|false;
    results: string;
    error: Error;
    data: WalletData;
}

export class WalletData {
    ref: number;
    type: string;
    channel: ChannelData;
    owner: ClientsData;
    value: FinanceData;
    transactions: TransactionsData;
    created: string;
    lastModified: string;

    constructor() {
        this.channel = new ChannelData();
        this.owner = new ClientsData();
        this.value = new FinanceData();
        this.transactions = new TransactionsData();
    }
}

export class WalletRange {
    total: FinanceData;
    from: string;
    to: string;

    constructor() {
        this.total = new FinanceData();
    }
}

export class ChannelData {
    tag: string;
    text: string;
    ref: number;
    title: string;
}