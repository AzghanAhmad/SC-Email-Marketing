# Amazon SES + SNS setup guide (ScribeCount Email)

Use this guide to connect **your own AWS account** so ScribeCount can send campaigns, flows, landing-page signups, and platform mail through **Amazon SES**, and receive **bounce, complaint, and delivery** events via **SNS**.

Personal inbox (IMAP/SMTP under **Settings → Inbox Connection**) is only for reading mail. It is **not** the marketing send path.

**In the app:** open **Settings → Domain Setup** or the full walkthrough at **Settings → Amazon SES setup guide**.

---

## Before you start

| Item | Why you need it |
|------|-----------------|
| AWS account | Hosts SES and SNS |
| Domain you control | DNS access to add records (Cloudflare, GoDaddy, Namecheap, etc.) |
| Public HTTPS API URL | SNS must reach `POST /api/v1/webhooks/sns` (use ngrok locally) |
| IAM access keys | App credentials to call SES |

**Recommended region:** **US East (N. Virginia) — `us-east-1`**. Your backend `AmazonSes:Region` must match the region you use in the AWS console.

---

## Step 1: Log in to AWS

1. Go to [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
2. Log in to your AWS account.

---

## Step 2: Open Amazon SES

1. In the search bar at the top, search for **Amazon SES** and open it.
2. Check the **region** in the top-right corner.

**Recommendation:** use **US East (N. Virginia) — us-east-1**. Your backend must use this same region later.

---

## Step 3: Verify your domain

Verify your **entire domain** (not just one email address).

Example domain: `yourdomain.com`

Inside SES:

1. Click **Identities** → **Create identity**
2. Choose **Domain**
3. Enter `yourdomain.com`
4. Enable **Easy DKIM**
5. Click **Create identity**

---

## Step 4: Add DNS records

SES shows about **3–6 DNS records** (CNAME, TXT, MX, etc.).

1. Go to your domain registrar or DNS host (Cloudflare, GoDaddy, Namecheap, Squarespace, Hostinger, …)
2. Open **DNS management**
3. Copy **every record exactly** from AWS into your DNS
4. **Do not change** names or values

---

## Step 5: Wait for verification

1. Return to SES → **Identities**
2. Refresh every few minutes
3. Wait until the domain shows **Verified**

Typical wait: **5–30 minutes**, sometimes up to **1 hour**.

---

## Step 6: Request production access (very important)

New SES accounts start in **Sandbox mode**:

| Sandbox | Production |
|---------|------------|
| Can send | Can send |
| Only to **verified** recipient addresses | To **any** valid address |

1. In SES, open **Account dashboard**
2. Click **Request production access**
3. Fill the form. Typical answers:

| Field | Example |
|-------|---------|
| Purpose | Transactional and marketing emails for our SaaS application |
| Website | `https://yourwebsite.com` |
| Mail type | Transactional, or Transactional + Marketing |

4. Submit — approval often takes **a few hours to 24 hours**.

---

## Step 7: Create IAM user

1. Search **IAM** in AWS and open it
2. Left side: **Users** → **Create user**
3. Example name: `scribecount-ses`
4. Continue to permissions (next step)

---

## Step 8: Give permissions

1. Choose **Attach policies directly**
2. Attach **AmazonSESFullAccess** (easiest for setup; use a tighter custom policy in production if you prefer)
3. Finish creating the user

---

## Step 9: Create access keys

1. Open the new IAM user
2. Go to **Security credentials**
3. Under **Access keys**, click **Create access key**
4. Choose **Application running outside AWS** → Continue
5. Save both values immediately — **you cannot see the Secret Access Key again**

```
Access Key ID:     AKIA....
Secret Access Key: abc123....
```

Store them in a password manager or secrets store. **Never commit them to git.**

---

## Step 10: Create SNS topic

1. Search **SNS** and open it
2. **Topics** → **Create topic**
3. Type: **Standard**
4. Topic name: `scribecount-ses-events`
5. Create

---

## Step 11: Create HTTPS subscription

1. Open the topic → **Create subscription**
2. Protocol: **HTTPS**
3. Endpoint (your **API** host, not the Angular app):

   **Production:**
   ```text
   https://your-api-domain.com/api/v1/webhooks/sns
   ```

   **Local testing (ngrok tunnel to port 5065):**
   ```text
   https://xxxxx.ngrok.io/api/v1/webhooks/sns
   ```

4. Create subscription. When AWS sends `SubscriptionConfirmation`, this API **auto-confirms** by calling the `SubscribeURL`.

> SNS cannot call `http://localhost`. Use [ngrok](https://ngrok.com/) or Cloudflare Tunnel for local webhook testing.

---

## Step 12: Create configuration set

1. Back in **SES** → **Configuration sets** → **Create**
2. Example name: `scribecount-default` (must match appsettings later)

---

## Step 13: Add event destination

Inside the configuration set:

1. **Add event destination**
2. Destination type: **SNS**
3. Select your `scribecount-ses-events` topic
4. Enable events:
   - Send
   - Delivery
   - Bounce
   - Complaint
5. Save

All platform sends attach this configuration set so events flow: **SES → SNS → your webhook**.

---

## Step 14: Update your backend

Open `backend/appsettings.json` (or use environment variables / User Secrets in production):

```json
"AmazonSes": {
  "Enabled": true,
  "Region": "us-east-1",
  "AccessKeyId": "YOUR_ACCESS_KEY",
  "SecretAccessKey": "YOUR_SECRET_KEY",
  "FromEmail": "noreply@yourdomain.com",
  "FromName": "ScribeCount Email",
  "ConfigurationSetName": "scribecount-default",
  "VerifySnsSignatures": true
}
```

Replace:

- `YOUR_ACCESS_KEY` / `YOUR_SECRET_KEY` — from Step 9
- `noreply@yourdomain.com` — an address on your **verified domain**
- `scribecount-default` — must match Step 12

**Alternative (no keys in files):**

```text
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=us-east-1
```

Leave `AccessKeyId` / `SecretAccessKey` empty in JSON to use the default credential chain.

---

## Step 15: Restart backend

Stop the API process and start it again so new `AmazonSes` settings load.

---

## Step 16: Test SES status in the app

1. Start backend + frontend
2. Open **Settings → Domain Setup**
3. Confirm badge shows **SES configured** and the checklist looks correct

---

## Step 17: Send test email

In **Settings → Domain Setup**, use **Send test email**.

| Mode | Who can receive |
|------|-----------------|
| **Sandbox** | Only **verified** email addresses in SES |
| **Production** | Any valid email address |

Or call the API (with JWT):

```http
POST /api/v1/deliverability/ses/test-send
Authorization: Bearer <token>
Content-Type: application/json

{ "toEmail": "you@example.com" }
```

---

## Step 18: Verify SNS events

1. Ensure the SNS subscription status is **Confirmed**
2. Send a test email
3. Check backend logs for delivery / bounce / complaint processing

| Event | Meaning |
|-------|---------|
| **Delivery** | Recipient's provider accepted the message |
| **Bounce** | Message could not be delivered |
| **Complaint** | Recipient marked it as spam |

Open **Analytics → Deliverability** to see metrics update from stored events.

---

## What the app uses SES for

| Feature | Send path |
|---------|-----------|
| Campaigns | `SesEmailService` → SES v2 |
| Flows | Same |
| Landing page / sign-up welcome emails | Same |
| Personal inbox compose | IMAP/SMTP (not SES) |

Webhook handler: `POST /api/v1/webhooks/sns` → `SnsWebhookService` (stores events, suppresses hard bounces and complaints).

---

## Troubleshooting

| Problem | What to check |
|---------|----------------|
| “Amazon SES is not configured” | `Enabled=true`, `FromEmail`, `Region`, credentials; restart API |
| MessageRejected / email not verified | Verify domain; in sandbox verify **recipient** too |
| SNS never hits API | Public HTTPS URL, subscription **Confirmed**, firewall |
| Signature verification failed | Keep `VerifySnsSignatures: true` in prod; check server clock |
| Metrics stay at zero | Configuration set name matches; event destination includes Bounce/Complaint/Delivery |
| Test says success but no inbox mail | Spam folder; sandbox recipient not verified; SES sending limits |

---

## Security notes

- Do **not** commit real AWS keys to git. Use User Secrets, environment variables, or IAM roles.
- Keep `VerifySnsSignatures: true` in production.
- Rotate access keys if they are ever exposed.
