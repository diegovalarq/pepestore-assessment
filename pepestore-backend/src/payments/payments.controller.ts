import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  async createCheckoutSession(@Body() body: { amount: number }) {
    try {
      const session = await this.paymentsService.createCheckoutSession(body.amount);
      return session;
    } catch (error) {
      throw new HttpException('Failed to create checkout session', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('webhook')
  async handleWebhook(@Body() event: any) {
    await this.paymentsService.handleWebhook(event);
    return { received: true };
  }
}
