# 🚀 Deployment Guide - Diff Checker

Complete step-by-step guide to deploy your Diff Checker with custom domain and Google AdSense.

**Total Cost: ~$10-15/year** 💰

---

## 📋 Table of Contents
1. [Google AdSense Setup](#1-google-adsense-setup)
2. [Deploy to Netlify](#2-deploy-to-netlify)
3. [Custom Domain Setup](#3-custom-domain-setup)
4. [Final AdSense Configuration](#4-final-adsense-configuration)
5. [SEO & Traffic Tips](#5-seo--traffic-tips)

---

## 1. Google AdSense Setup

### Step 1.1: Sign Up for Google AdSense
1. Go to [https://www.google.com/adsense](https://www.google.com/adsense)
2. Click "Get Started" and sign in with your Google account
3. Fill in your website URL (you can use a temporary one initially)
4. Accept terms and conditions
5. Submit your application

**⏱️ Wait Time:** Approval can take 1-7 days

### Step 1.2: Get Your Publisher ID
Once approved:
1. Log into your AdSense account
2. Go to **Account** → **Settings**
3. Find your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)
4. Copy this ID - you'll need it later

### Step 1.3: Create Ad Units (After Domain Setup)
We'll come back to this after deployment.

---

## 2. Deploy to Netlify (FREE)

### Step 2.1: Prepare Your Files
Make sure you have these files ready:
- `index.html`
- `styles.css`
- `app.js`
- `README.md`

### Step 2.2: Create Netlify Account
1. Go to [https://www.netlify.com](https://www.netlify.com)
2. Click "Sign Up" (use GitHub, GitLab, or email)
3. It's completely **FREE** for this type of site!

### Step 2.3: Deploy Your Site

**Option A: Drag & Drop (Easiest)**
1. Log into Netlify Dashboard
2. Scroll down to **"Want to deploy a new site without connecting to Git?"**
3. Drag and drop your entire `Diff-Checker` folder
4. Wait ~30 seconds for deployment
5. You'll get a URL like: `https://random-name-12345.netlify.app`

**Option B: GitHub (Recommended for Updates)**
1. Create a GitHub account if you don't have one
2. Create a new repository called "diff-checker"
3. Push your files to GitHub:
```bash
cd /Users/c083701/Desktop/Diff-Checker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/diff-checker.git
git push -u origin main
```
4. In Netlify Dashboard, click "Add new site" → "Import an existing project"
5. Choose GitHub and authorize
6. Select your "diff-checker" repository
7. Click "Deploy site"

**✅ Your site is now live!** Copy the Netlify URL.

---

## 3. Custom Domain Setup

### Step 3.1: Buy a Domain

**Recommended Registrars (Cheapest):**

| Registrar | .com Price | .io Price | .app Price |
|-----------|-----------|-----------|-----------|
| **Porkbun** | $9/year | $29/year | $16/year |
| **Namecheap** | $13/year | $33/year | $15/year |
| **Cloudflare** | $10/year | $35/year | $10/year |
| **Google Domains** | $12/year | $60/year | $20/year |

**💡 Recommendation:** Use **Porkbun** for best prices + free WHOIS privacy

### Step 3.2: Purchase Your Domain
1. Go to [Porkbun.com](https://porkbun.com) (or your chosen registrar)
2. Search for your desired domain (e.g., `mydiffchecker.com`)
3. Add to cart and checkout (~$9-15 for .com)
4. **Enable WHOIS Privacy** (usually free)

### Step 3.3: Connect Domain to Netlify

**In Netlify:**
1. Go to your site's dashboard
2. Click **"Domain Settings"**
3. Click **"Add custom domain"**
4. Enter your domain (e.g., `mydiffchecker.com`)
5. Click "Verify" → "Add domain"

**In Your Domain Registrar (Porkbun/Namecheap):**
1. Log into your registrar account
2. Go to DNS Management for your domain
3. Add these DNS records:

**For Apex Domain (mydiffchecker.com):**
```
Type: A Record
Name: @
Value: 75.2.60.5
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

4. Save DNS settings
5. Wait 10-60 minutes for DNS propagation

**📝 Netlify automatically provides FREE SSL certificate!**

### Step 3.4: Set Primary Domain
In Netlify:
1. Go to **Domain Settings**
2. Choose whether `mydiffchecker.com` or `www.mydiffchecker.com` is primary
3. Netlify will auto-redirect the other version

**✅ Your custom domain is now live with HTTPS!**

---

## 4. Final AdSense Configuration

Now that your site is live with a custom domain:

### Step 4.1: Update AdSense Site URL
1. Log into [AdSense](https://www.google.com/adsense)
2. Go to **Sites**
3. Add your custom domain if not already there
4. Wait for verification (usually instant if code is already in HTML)

### Step 4.2: Create Ad Units
1. In AdSense, go to **Ads** → **By ad unit**
2. Click **"New ad unit"** → **"Display ads"**
3. Name it "Top Banner"
4. Choose **Responsive** ad size
5. Click **"Create"**
6. Copy the `data-ad-slot` number (looks like: `1234567890`)

Repeat for bottom banner (create another ad unit called "Bottom Banner")

### Step 4.3: Update Your HTML
1. Open `index.html`
2. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual Publisher ID
3. Replace `YYYYYYYYYY` with your Top Banner ad slot ID
4. Replace `ZZZZZZZZZZ` with your Bottom Banner ad slot ID

**Example:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
        crossorigin="anonymous"></script>
```

```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

### Step 4.4: Redeploy to Netlify
**If using drag & drop:** Drag your updated folder again
**If using GitHub:** Push changes:
```bash
git add index.html
git commit -m "Add AdSense IDs"
git push
```

**⏱️ Wait 10-20 minutes for ads to appear**

---

## 5. SEO & Traffic Tips

### Get More Visitors (More Traffic = More Ad Revenue)

1. **Submit to Search Engines**
   - [Google Search Console](https://search.google.com/search-console)
   - [Bing Webmaster Tools](https://www.bing.com/webmasters)

2. **Social Media**
   - Share on Reddit (r/webdev, r/programming, r/coding)
   - Post on Twitter/X with hashtags #coding #webdev
   - Share in programming Discord servers
   - Post on Product Hunt

3. **SEO Optimization** (Already included in your HTML)
   - Meta descriptions ✅
   - Keywords ✅
   - Descriptive title ✅

4. **Content Ideas**
   - Write a blog post: "How I Built a Diff Checker"
   - Create a YouTube tutorial
   - Share on Dev.to or Medium

5. **Backlinks**
   - Add to "awesome lists" on GitHub
   - List on tool directories like AlternativeTo
   - Comment on relevant blog posts with your tool link

---

## 💰 Revenue Expectations

**Realistic AdSense Earnings:**
- 1,000 visitors/month = $5-20
- 10,000 visitors/month = $50-200
- 100,000 visitors/month = $500-2,000

**Factors:**
- CPC (Cost Per Click): $0.20-$2.00 for tech/programming niche
- CTR (Click Through Rate): 1-5% average
- Geographic location of visitors (US/UK/CA pays more)

---

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional, FREE)
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new property
3. Get your Measurement ID (G-XXXXXXXXXX)
4. Add before `</head>` in index.html:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## ✅ Final Checklist

- [ ] Google AdSense account approved
- [ ] Site deployed to Netlify
- [ ] Custom domain purchased (~$10-15)
- [ ] DNS configured and propagated
- [ ] SSL certificate active (automatic with Netlify)
- [ ] AdSense code added to HTML with correct IDs
- [ ] Site redeployed with AdSense codes
- [ ] Ads showing correctly (wait 20 mins after deployment)
- [ ] Submitted to Google Search Console
- [ ] Shared on social media

---

## 🆘 Troubleshooting

**Problem: Ads not showing**
- Wait 20-30 minutes after deployment
- Check browser console for errors (F12)
- Verify AdSense account is fully approved
- Make sure ad blocker is disabled when testing
- Confirm Publisher ID and Ad Slot IDs are correct

**Problem: Domain not working**
- Wait up to 24 hours for DNS propagation
- Check DNS records are correct
- Clear browser cache
- Try incognito/private browsing mode

**Problem: SSL certificate error**
- Netlify provides auto SSL - wait 10 minutes
- Check DNS is properly configured
- Contact Netlify support (they're very helpful!)

---

## 🎉 Congratulations!

Your Diff Checker is now:
- ✅ Live on the internet
- ✅ Has a professional custom domain
- ✅ Secured with HTTPS
- ✅ Monetized with Google AdSense
- ✅ Costing you only ~$10-15/year!

**Need help?** Create an issue or reach out!

---

**Estimated Total Time:** 2-3 hours (mostly waiting for approvals/DNS)
**Total Cost:** $10-15/year for domain only!
