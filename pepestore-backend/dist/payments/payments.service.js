"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const { Fintoc } = require('fintoc');
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor() {
        this.logger = new common_1.Logger(PaymentsService_1.name);
        const secretKey = process.env.FINTOC_SECRET_KEY;
        if (!secretKey) {
            this.logger.warn('FINTOC_SECRET_KEY is not defined');
        }
        else {
            this.fintoc = new Fintoc(secretKey);
        }
    }
    async createCheckoutSession(amount, currency = 'CLP') {
        if (!this.fintoc) {
            throw new Error('Fintoc client not initialized');
        }
        try {
            const session = await this.fintoc.checkoutSessions.create({
                amount,
                currency,
            });
            return session;
        }
        catch (error) {
            this.logger.error('Error creating checkout session', error);
            throw error;
        }
    }
    async handleWebhook(event) {
        this.logger.log(`Received webhook event: ${event.type}`);
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
    handleCheckoutSessionFinished(data) {
        this.logger.log('Checkout session finished', data);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map