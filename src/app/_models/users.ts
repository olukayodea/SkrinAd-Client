import { AccountStatus, CountryData, Error } from './data';

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
    username: string;
    name: string;
    phone: string;
    email: string;
    country: CountryData;
    accountStatus: AccountStatus;
    created: string;
    lastModified: string;

    constructor() {
      this.country = new CountryData();
      this.accountStatus = new AccountStatus();
    }
}