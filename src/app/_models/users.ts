import { AccountStatus, CountryData, Error, FinanceData } from './data';

export class User {
  success: true|false;
  error: Error;
  results: string;
  status: string;
  token: string;
  data: UserData;
}

export class UserData {
    ref: number;
    token: string;
    country: CountryData;
    username: string;
    name: string;
    companyName: string;
    contactEmail: string;
    contactPhone: string;
    accountStatus: AccountStatus;
    wallet: FinanceData;
    created: string;
    lastModified: string;

    constructor() {
      this.country = new CountryData();
      this.accountStatus = new AccountStatus();
    }
}

export class ClientsData {
    ref: number;
    token: string;
    country: CountryData;
    username: string;
    name: string;
    companyName: string;
    contactEmail: string;
    contactPhone: string;
    accountStatus: AccountStatus;
    wallet: FinanceData;
    created: string;
    lastModified: string;

    constructor() {
      this.country = new CountryData();
      this.accountStatus = new AccountStatus();
    }
}