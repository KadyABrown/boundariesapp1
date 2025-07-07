import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import { Request, Response } from 'express';
import { db } from './db.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Initialize Shopify API only if environment variables are available
let shopify: any = null;

if (process.env.SHOPIFY_API_KEY && process.env.SHOPIFY_API_SECRET && process.env.SHOPIFY_APP_URL) {
  shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ['read_customers', 'write_customers', 'read_orders', 'write_orders'],
    hostName: process.env.SHOPIFY_APP_URL,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false,
  });
}

interface ShopifyCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

interface ShopifySubscription {
  id: number;
  customer_id: number;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  created_at: string;
  updated_at: string;
  next_billing_date: string;
}

interface ShopifyOrder {
  id: number;
  customer: ShopifyCustomer;
  financial_status: 'pending' | 'authorized' | 'partially_paid' | 'paid' | 'partially_refunded' | 'refunded' | 'voided';
  fulfillment_status: 'fulfilled' | 'partial' | 'restocked' | null;
  total_price: string;
  created_at: string;
  line_items: Array<{
    id: number;
    title: string;
    price: string;
    quantity: number;
  }>;
}

export class ShopifyService {
  private static instance: ShopifyService;
  private session: any;

  constructor() {
    // Initialize with store credentials if available
    if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ACCESS_TOKEN) {
      this.session = {
        shop: process.env.SHOPIFY_STORE_DOMAIN,
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
      };
    }
  }

  static getInstance(): ShopifyService {
    if (!ShopifyService.instance) {
      ShopifyService.instance = new ShopifyService();
    }
    return ShopifyService.instance;
  }

  // Create checkout URL for subscription
  async createSubscriptionCheckout(userId: string, email: string, returnUrl: string): Promise<string> {
    if (!shopify || !this.session) {
      throw new Error('Shopify integration not configured. Please contact support.');
    }
    
    try {
      const client = new shopify.clients.Rest({ session: this.session });
      
      // Create checkout for subscription product
      const response = await client.post({
        path: 'checkouts',
        data: {
          checkout: {
            email: email,
            line_items: [
              {
                variant_id: process.env.SHOPIFY_SUBSCRIPTION_VARIANT_ID!, // Your subscription variant ID
                quantity: 1,
              }
            ],
            custom_attributes: [
              {
                key: 'user_id',
                value: userId
              }
            ]
          }
        }
      });

      const checkout = response.body as any;
      return checkout.checkout.web_url;
    } catch (error) {
      console.error('Error creating Shopify checkout:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  // Create or get customer in Shopify
  async createOrGetCustomer(userData: { email: string; firstName?: string; lastName?: string; phone?: string }): Promise<ShopifyCustomer> {
    if (!shopify || !this.session) {
      throw new Error('Shopify integration not configured. Please contact support.');
    }
    
    try {
      const client = new shopify.clients.Rest({ session: this.session });

      // First, try to find existing customer by email
      const searchResponse = await client.get({
        path: 'customers/search',
        query: { query: `email:${userData.email}` }
      });

      const existingCustomers = (searchResponse.body as any).customers;
      
      if (existingCustomers && existingCustomers.length > 0) {
        return existingCustomers[0];
      }

      // Create new customer if not found
      const createResponse = await client.post({
        path: 'customers',
        data: {
          customer: {
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            verified_email: true,
            send_email_welcome: false
          }
        }
      });

      return (createResponse.body as any).customer;
    } catch (error) {
      console.error('Error creating/getting Shopify customer:', error);
      throw new Error('Failed to manage customer');
    }
  }

  // Get customer subscription status
  async getSubscriptionStatus(customerId: string): Promise<{ status: string; nextBillingDate?: string }> {
    try {
      const client = new shopify.clients.Rest({ session: this.session });

      // Get customer orders to check for active subscriptions
      const ordersResponse = await client.get({
        path: `customers/${customerId}/orders`,
        query: { 
          status: 'any',
          financial_status: 'paid'
        }
      });

      const orders = (ordersResponse.body as any).orders;
      
      // Check for subscription orders (you'll need to identify these based on your product setup)
      const subscriptionOrders = orders.filter((order: ShopifyOrder) => 
        order.line_items.some(item => 
          item.title.toLowerCase().includes('subscription') || 
          item.title.toLowerCase().includes('boundarycore')
        )
      );

      if (subscriptionOrders.length > 0) {
        const latestOrder = subscriptionOrders[0];
        // For subscription management, you might want to use Shopify's Subscription API
        // or integrate with a subscription app like ReCharge or Bold Subscriptions
        return {
          status: 'active',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        };
      }

      return { status: 'inactive' };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return { status: 'error' };
    }
  }

  // Handle webhook from Shopify (order creation, payment, etc.)
  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const hmac = req.get('X-Shopify-Hmac-Sha256');
      const body = req.body;
      const topic = req.get('X-Shopify-Topic');

      // Verify webhook authenticity
      if (!this.verifyWebhook(body, hmac)) {
        res.status(401).send('Unauthorized');
        return;
      }

      switch (topic) {
        case 'orders/create':
          await this.handleOrderCreated(body);
          break;
        case 'orders/paid':
          await this.handleOrderPaid(body);
          break;
        case 'orders/cancelled':
          await this.handleOrderCancelled(body);
          break;
        case 'customers/create':
          await this.handleCustomerCreated(body);
          break;
        default:
          console.log(`Unhandled webhook topic: ${topic}`);
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  private verifyWebhook(data: any, hmacHeader?: string): boolean {
    if (!hmacHeader) return false;
    
    const crypto = require('crypto');
    const calculated_hmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!)
      .update(JSON.stringify(data), 'utf8')
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(calculated_hmac, 'base64'),
      Buffer.from(hmacHeader, 'base64')
    );
  }

  private async handleOrderCreated(order: ShopifyOrder): Promise<void> {
    console.log('Order created:', order.id);
    
    // Check if this is a subscription order
    const isSubscription = order.line_items.some(item => 
      item.title.toLowerCase().includes('subscription') || 
      item.title.toLowerCase().includes('boundarycore')
    );

    if (isSubscription && order.customer) {
      // Find user by email and update subscription info
      const user = await db.select().from(users).where(eq(users.email, order.customer.email)).limit(1);
      
      if (user.length > 0) {
        await db.update(users)
          .set({
            shopifyCustomerId: order.customer.id.toString(),
            shopifyOrderId: order.id.toString(),
            subscriptionStatus: order.financial_status === 'paid' ? 'active' : 'pending',
            updatedAt: new Date()
          })
          .where(eq(users.id, user[0].id));
      }
    }
  }

  private async handleOrderPaid(order: ShopifyOrder): Promise<void> {
    console.log('Order paid:', order.id);
    
    // Activate subscription for paid orders
    if (order.customer) {
      const user = await db.select().from(users).where(eq(users.email, order.customer.email)).limit(1);
      
      if (user.length > 0) {
        await db.update(users)
          .set({
            subscriptionStatus: 'active',
            trialEndsAt: null, // Clear trial end date
            updatedAt: new Date()
          })
          .where(eq(users.id, user[0].id));
      }
    }
  }

  private async handleOrderCancelled(order: ShopifyOrder): Promise<void> {
    console.log('Order cancelled:', order.id);
    
    // Handle subscription cancellation
    if (order.customer) {
      const user = await db.select().from(users).where(eq(users.email, order.customer.email)).limit(1);
      
      if (user.length > 0) {
        await db.update(users)
          .set({
            subscriptionStatus: 'canceled',
            updatedAt: new Date()
          })
          .where(eq(users.id, user[0].id));
      }
    }
  }

  private async handleCustomerCreated(customer: ShopifyCustomer): Promise<void> {
    console.log('Customer created:', customer.id);
    // Handle customer creation if needed
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (user.length === 0 || !user[0].shopifyCustomerId) {
        throw new Error('User or Shopify customer not found');
      }

      // Update user subscription status
      await db.update(users)
        .set({
          subscriptionStatus: 'canceled',
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  // Get subscription details
  async getSubscriptionDetails(userId: string): Promise<any> {
    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (user.length === 0) {
        throw new Error('User not found');
      }

      const userData = user[0];
      
      if (!userData.shopifyCustomerId) {
        return {
          status: 'inactive',
          hasSubscription: false
        };
      }

      const subscriptionStatus = await this.getSubscriptionStatus(userData.shopifyCustomerId);
      
      return {
        status: userData.subscriptionStatus,
        hasSubscription: userData.subscriptionStatus === 'active',
        shopifyCustomerId: userData.shopifyCustomerId,
        shopifyOrderId: userData.shopifyOrderId,
        nextBillingDate: subscriptionStatus.nextBillingDate,
        trialEndsAt: userData.trialEndsAt
      };
    } catch (error) {
      console.error('Error getting subscription details:', error);
      throw error;
    }
  }
}

export default ShopifyService;