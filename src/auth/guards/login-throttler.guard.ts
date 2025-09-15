import { ExecutionContext, Injectable } from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerLimitDetail,
} from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'anonymus';
    return `login-${email}`;
  }

  //set limitto 5 attemps
  protected getLimit(): Promise<number> {
    return Promise.resolve(5);
  }

  //time window time of 1 minute
  protected getTl(): Promise<number> {
    return Promise.resolve(60000);
  }

  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      `Too many attpts. Please tyr again after 1 minute`,
    );
  }
}
