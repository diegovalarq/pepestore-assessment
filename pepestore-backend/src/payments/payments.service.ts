import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Fintoc } = require('fintoc');

@Injectable()
export class PaymentsService {
  private fintoc: any;
  private readonly logger = new Logger(PaymentsService.name);

  constructor() {
    const secretKey = process.env.FINTOC_SECRET_KEY;
    if (!secretKey) {
      this.logger.warn('FINTOC_SECRET_KEY is not defined');
    } else {
      this.fintoc = new Fintoc(secretKey);
    }
  }

  async createCheckoutSession(amount: number, currency: string = 'CLP') {
    if (!this.fintoc) {
      throw new Error('Fintoc client not initialized');
    }

    try {
      const session = await this.fintoc.checkoutSessions.create({
        amount,
        currency,
        // In a real app, you might want to pass metadata or customer info
      });
      return session;
    } catch (error) {
      this.logger.error('Error creating checkout session', error);
      throw error;
    }
  }

  async handleWebhook(event: any) {
    this.logger.log(`Received webhook event: ${event.type}`);
    
    // Handle specific events
    switch (event.type) {
      case 'checkout_session.finished':
        this.handleCheckoutSessionFinished(event.data);
        break;
      case 'payment_intent.succeeded':
        this.logger.log('Payment succeeded', event.data);
        break;
      case 'payment_intent.failed':
        this.logger.warn('Payment failed', event.data);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private handleCheckoutSessionFinished(data: any) {
    // Logic to update order status in database would go here
    this.logger.log('Checkout session finished', data);
  }
}
