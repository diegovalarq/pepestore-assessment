export declare class PaymentsService {
    private fintoc;
    private readonly logger;
    constructor();
    createCheckoutSession(amount: number, currency?: string): Promise<any>;
    handleWebhook(event: any): Promise<void>;
    private handleCheckoutSessionFinished;
}
