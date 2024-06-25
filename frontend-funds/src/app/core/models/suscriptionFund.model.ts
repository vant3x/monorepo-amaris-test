import { Fund } from "./fund.model";
import { Subscription } from "./subscription.model";

export interface SubscriptionFund extends Fund {
    isSubscribed: boolean;
    subscription?: Subscription;
  }
  