# Shopify Setup Guide for BoundarySpace

## Quick Setup Options

### Option 1: Shopify Partners Dashboard
1. Go to https://partners.shopify.com
2. Create account → "Apps" → "Create app"
3. Choose "Public app" or "Custom app"
4. Get API credentials from the app settings

### Option 2: Shopify Admin (Simpler)
1. In your Shopify store admin, go to:
   - Settings → Apps and sales channels
   - "Develop apps" → "Create an app"
2. Configure API access with these permissions:
   - Customers: read/write
   - Orders: read/write
   - Checkouts: read/write

### Option 3: Alternative Payment Solutions
If Shopify setup is complex, we can use:
- **Stripe**: Simpler integration, good for subscriptions
- **PayPal**: Quick business account setup
- **Square**: Easy online payments

## Required Environment Variables
```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_ACCESS_TOKEN=your_access_token
SHOPIFY_APP_URL=your_replit_app_url
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
```

## Demo Mode
The app will work in demo mode without these credentials - payment buttons will show appropriate error messages directing users to contact support.