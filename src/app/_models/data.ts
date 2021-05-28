export class ErrorCodes {
    constructor() {}
    "en" = {
      10001: "Please login to continue",
      20001: "Your new password has been set, you can now login now",
      200001: "Your wallet deposit request has been completed and verified, we will deposit the funds to your wallet in a moment",
      200002: "Your wallet deposit request has been completed and we will verify and deposit the funds to your wallet in a moment",
      400001: "Your wallet deposit request has failed, no deposit will be made to your account at the moment, please try again",
      400002: "Your wallet deposit request has failed, an unknwm error has occured",
      400003: "Your wallet deposit request has failed, the payment was rejected by the gateway",
      210000: "Your Order has been placed",
      210001: "Payment for this order has been completed and verified, your order will be processed in a moment",
      210002: "Payment for this order has been completed and we will verify the payment and complete the order  in a moment",
      410001: "Payment for this order has failed, no order has been placed, please try again",
      410002: "Your order placement has failed, an unknwm error has occured with the payment",
      410003: "Payment for this order has failed, the payment was rejected by the gateway",
    };
}

export class Counts {
    currentPage: number;
    maxRowPerPage: number;
    rowOnCurrentPage: number;
    totalPage: number;
    totalRows: number;
}
    
export class Error {
    code: number;
    message: string;
}

export class MiniUserData {
    userId: number;
    otherName: string;
    lastName: string;
    email: string;
}

export class MainStatus {
    active: boolean;
    inactive: boolean;
    deleted: boolean;
}

export class AccountStatus {
    activeAccount: true|false;
    newAccount: true|false;
    inactiveAccount: true|false;
    passwordChange: true|false;
}

export class FinanceData {
    amount: number = 0;
    label: string = "";
    currency: CurrencyData;

    constructor() {
        this.currency = new CurrencyData();
    }
}

export class CountryData {
    ref: number;
    title: string;
    iso: string;
    currency: CurrencyData;
    minPayment: number;

    constructor() {
        this.currency = new CurrencyData();
    }
}

export class CurrencyData {
    ref: number;
    title: string;
    symbol: string;
}

export class ChartImpression {
    label: string[] = [];
    impression: number[] = [];
    click: number[] = [];
    url: number[] = [];
}

export class ChartData {
    label: string[] = [];
    data: number[] = [];
    shade: string[] = [];
}
