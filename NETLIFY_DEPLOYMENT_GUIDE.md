# 🚀 Netlify Deployment Guide for NutSphere E-Commerce

## ⚠️ CRITICAL: Security Warning

Your `.env.production` file **contains production secrets** and is likely tracked by git! This is a **security risk**.

### Immediate Action Required:

1. **Remove `.env.production` from git** (if committed):
   ```bash
   git rm --cached .env.production
   git commit -m "Remove production secrets from git"
   ```

2. **Never commit files with secrets**. Use Netlify's environment variables instead.

---

## 📋 Pre-Deployment Checklist

### ✅ 1. Install Netlify Next.js Plugin

```bash
npm install --save-dev @netlify/plugin-nextjs
```

### ✅ 2. Verify Local Environment Works

```bash
# Test locally first
npm run dev
# Open http://localhost:3000 and test:
# - Login/Signup
# - Browse products
# - Add to cart
# - Checkout (both COD and Razorpay)
# - Admin dashboard
```

### ✅ 3. Build Test

```bash
npm run build
npm start
# Verify production build works locally
```

---

## 🌐 Deploy to Netlify

### Option A: Deploy via Netlify CLI (Recommended)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site (first time only)
netlify init

# Build and deploy to production
netlify deploy --prod
```

### Option B: Deploy via Git (Easier)

1. **Push to GitHub/GitLab/Bitbucket**:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your repository
   - Netlify will auto-detect Next.js settings

3. **Configure Build Settings** (should auto-fill):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `20`

---

## 🔐 Set Environment Variables in Netlify

**DO NOT use .env.production for secrets!** Instead:

### In Netlify Dashboard:

1. Go to: **Site settings → Environment variables**
2. Add these variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL = https://ukshvkdnwjjihinumuuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrc2h2a2Rud2pqaWhpbnVtdXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTQ3ODEsImV4cCI6MjA4NDYzMDc4MX0.WKkUTFowEyDjIJZ-hBIBYHfzlZsv2Tie_KIcmE0Y-Y4
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrc2h2a2Rud2pqaWhpbnVtdXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA1NDc4MSwiZXhwIjoyMDg0NjMwNzgxfQ.5N5HbMm-dUAka_bVLV8a0z7vHWOvI3LPBYX4c69lryA

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_S7zHeOSOLqJZsI
RAZORPAY_KEY_SECRET = Wkg9Ec701lNLeXxlwiMJKhLj

# Email (Resend)
RESEND_API_KEY = re_N8KtVmAk_MDsWFoiq3PdCbGorSKBJSgjc
EMAIL_FROM = orders@nutsphere.com

# Site URL (will update after deployment)
NEXT_PUBLIC_SITE_URL = https://your-site-name.netlify.app
```

### ⚠️ Important Notes:

- Mark `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, and `RESEND_API_KEY` as **sensitive** in Netlify
- These variables are available at **build time and runtime**
- For `NEXT_PUBLIC_*` variables: changes require rebuild

---

## 🔄 After First Deployment

### 1. Update Site URL

After Netlify assigns your domain (e.g., `nutsphere.netlify.app`):

1. Update environment variable in Netlify:
   ```
   NEXT_PUBLIC_SITE_URL = https://nutsphere.netlify.app
   ```

2. Update in Supabase:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add Netlify URL to **Redirect URLs**:
     ```
     https://nutsphere.netlify.app/auth/callback
     ```

3. Trigger a new deploy in Netlify (or push a commit)

### 2. Configure Custom Domain (Optional)

If you have `nutsphere.com`:

1. In Netlify: **Domain settings → Add custom domain**
2. Add DNS records (Netlify will show you what to add)
3. Wait for DNS propagation (up to 24 hours)
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
5. Update Supabase redirect URLs to your custom domain

### 3. Set Up Razorpay Webhook

1. Go to Razorpay Dashboard → **Settings → Webhooks**
2. Add webhook URL:
   ```
   https://your-netlify-domain.netlify.app/api/razorpay-webhook
   ```
3. Select events: `payment.captured`, `payment.failed`
4. Copy the webhook secret
5. Add to Netlify environment variables:
   ```
   RAZORPAY_WEBHOOK_SECRET = whsec_your_webhook_secret
   ```

### 4. Configure Email Domain (Critical for Production Emails)

Currently using `orders@nutsphere.com` with Resend:

1. Go to Resend Dashboard → **Domains**
2. Click "Add Domain" → Enter `nutsphere.com`
3. Add DNS records shown by Resend:
   - TXT record for domain verification
   - CNAME records for DKIM
   - MX records (if needed)
4. Verify domain (can take up to 48 hours)
5. Once verified, emails will be sent from `orders@nutsphere.com`

---

## 🧪 Post-Deployment Testing

After deployment, test these critical flows:

### 1. User Flow:
```
✓ Signup new account
✓ Browse products
✓ Add items to cart (with variants)
✓ Checkout with COD
✓ Checkout with Razorpay (test payment)
✓ View order in profile
✓ Track order by ID
✓ Receive order confirmation email
```

### 2. Admin Flow:
```
✓ Login as admin (check with existing admin user)
✓ View dashboard metrics
✓ Add new product with variants
✓ View orders list
✓ Update order status to "shipped"
✓ Update order status to "delivered"
✓ Check customer receives delivery email
✓ Generate invoice
✓ Create coupon code
✓ View reports
```

### 3. Payment Flow:
```
✓ Test Razorpay test cards:
   - Success: 4111 1111 1111 1111
   - Failure: 4012 0010 3714 1112
✓ Verify payment webhook received
✓ Check order status updates correctly
✓ Verify email sent after payment success
```

---

## 🐛 Troubleshooting

### Build Fails on Netlify

```bash
# Common issues:

1. Node version mismatch
   Solution: Ensure Node 20 in netlify.toml

2. Missing dependencies
   Solution: npm install --legacy-peer-deps

3. Environment variables not set
   Solution: Check all variables in Netlify dashboard

4. TypeScript errors
   Solution: Run locally first: npm run build
```

### App Works Locally But Not on Netlify

1. **Check environment variables** in Netlify dashboard
2. **Check build logs** for errors
3. **Check function logs** for runtime errors
4. **Verify Supabase redirect URLs** include your Netlify domain

### Razorpay Payments Not Working

1. Test mode keys start with `rzp_test_`
2. Check if webhook is configured correctly
3. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is accessible on client

### Emails Not Sending

1. Check `RESEND_API_KEY` is correct
2. Verify domain is verified in Resend (if using custom domain)
3. Check Resend logs: https://resend.com/logs
4. Ensure `EMAIL_FROM` matches verified domain

---

## 📊 Monitor Your Deployment

### Netlify:
- **Functions logs**: Monitor API endpoint errors
- **Build logs**: Check deployment success
- **Analytics**: Track traffic and performance

### Supabase:
- **Database**: Monitor query performance
- **Auth**: Track user signups and logins
- **Storage**: Check image uploads

### Razorpay:
- **Dashboard**: Monitor transactions
- **Webhooks**: Check webhook delivery status

### Resend:
- **Logs**: Monitor email delivery
- **Analytics**: Track open rates

---

## 🎉 Success Checklist

After deployment, you should have:

- ✅ Site accessible at Netlify URL
- ✅ All pages loading correctly
- ✅ User authentication working
- ✅ Products displayed with images
- ✅ Cart functionality working
- ✅ Both payment methods functional
- ✅ Order tracking working
- ✅ Admin dashboard accessible
- ✅ Emails sending (from test or verified domain)
- ✅ No console errors on homepage

---

## 🔒 Security Reminders

1. **Never commit** `.env.local` or `.env.production` to git
2. **Rotate secrets** if they were exposed in git history
3. **Use Netlify environment variables** for all secrets
4. **Enable HTTPS** (Netlify does this automatically)
5. **Review Supabase RLS policies** regularly
6. **Monitor logs** for suspicious activity

---

## 📚 Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Razorpay Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/)

---

**Need Help?** Check:
1. Netlify build logs
2. Browser console (F12)
3. Supabase logs
4. This project's documentation files
