import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createCheckoutSession(body: {
        amount: number;
    }): Promise<any>;
    handleWebhook(event: any): Promise<{
        received: boolean;
    }>;
}
