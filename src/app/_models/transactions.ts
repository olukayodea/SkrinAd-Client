import { Counts, Error, MiniUserData } from './data';

export class Transactions {
  success: true|false;
  error: Error;
  results: string;
  counts: Counts;
  data: TransactionsData[] = [];
}

export class TransactionsData {
    ref: number;
    transaction_id: string;
    amount: number;
    transaction_channel: string;
    transaction_status: string;
    country: string;
    transaction_type: string;
    transaction_type_id: number;
    user: MiniUserData;
    created: string;
    lastModified: string;

    constructor() {
        this.user = new MiniUserData();
    }
}