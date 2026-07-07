import {
  IntegrationGuideChecklistItem,
  IntegrationGuidePart,
  IntegrationTroubleshootItem,
} from './integration-setup-guide.component';

export const SHOPIFY_GUIDE_CHECKLIST: IntegrationGuideChecklistItem[] = [
  { label: 'Active Shopify store', desc: 'at least one product listed (a draft is fine for testing)' },
  { label: 'ScribeCount Email enabled', desc: 'with your sending domain authenticated' },
  { label: 'Shopify admin access', desc: 'store owner or staff with Apps permissions' },
  { label: 'Flows built in draft', desc: 'Post-Purchase, Abandoned Cart, and Abandoned Checkout ready to activate' },
];

export const SHOPIFY_GUIDE_CHECKLIST_WARNING =
  'Do not activate your email flows before the store connection is confirmed and tested. Activating too early may result in flows that never fire or fire on incomplete event data.';

export const SHOPIFY_GUIDE_PARTS: IntegrationGuidePart[] = [
  {
    title: 'Installing the ScribeCount App',
    subtitle: 'Connect Shopify to ScribeCount through the app store',
    steps: [
      {
        title: 'Access the Shopify App Store',
        desc: 'Log in to your Shopify admin at yourstore.myshopify.com/admin. Click Apps in the sidebar, then open the Shopify App Store or search for “ScribeCount”.',
      },
      {
        title: 'Install the ScribeCount Email app',
        desc: 'Open the ScribeCount Email listing, click Add App, review permissions (read orders, customers, products, marketing), and click Install App.',
        tip: 'ScribeCount does not request permission to modify orders, change prices, or access payment information.',
      },
      {
        title: 'Authorize the connection in ScribeCount',
        desc: 'After install, complete Shopify authorization and return to ScribeCount. Confirm your store URL and click Authorize Connection. A green status indicator means the handshake succeeded.',
      },
    ],
  },
  {
    title: 'Configuring Store Event Settings',
    subtitle: 'Map Shopify webhooks to your email flows',
    steps: [
      {
        title: 'Configure purchase events',
        desc: 'Set first-time buyer flow (Post-Purchase Thank You), repeat buyer flow (Repeat Purchase Thank You), auto-add purchasers with consent, purchase tags (first-time-buyer, purchased-[title]), and follow-up delay (3–5 days). Map Shopify product IDs to AuthorVault titles.',
        tip: 'Map every format (ebook, paperback, audiobook) of the same title to one AuthorVault record.',
      },
      {
        title: 'Configure abandoned cart events',
        desc: 'Set abandonment detection window (recommended: 60 minutes), choose your Abandoned Cart flow, set dwell before first email (default 60 minutes after event), and suppress readers who already own the abandoned title.',
      },
      {
        title: 'Configure abandoned checkout events',
        desc: 'Choose your Abandoned Checkout flow and a shorter first-email delay (recommended: 30 minutes). Checkout abandonment is higher intent than cart abandonment.',
      },
      {
        title: 'Configure subscriber opt-in settings',
        desc: 'For checkout capture, only add subscribers who check an explicit consent box; tag them shopify-checkout-optin. Embed ScribeCount forms as pop-ups, footer sign-ups, product-page inline forms, or landing pages — each with its own source tag.',
      },
    ],
  },
  {
    title: 'Testing and Verifying',
    subtitle: 'Confirm every event type before going live',
    steps: [
      {
        title: 'Use the Event Testing Console',
        desc: 'Go to Integrations → Shopify → Testing Console. Simulate completed purchase, abandoned cart, abandoned checkout, and new opt-in events. Verify profiles, tags, and queued flows for each.',
      },
      {
        title: 'Place a real test order',
        desc: 'Use a secondary email you control. In test mode, use Shopify’s Bogus Gateway. Within 60 seconds, confirm the purchase event in ScribeCount, correct tags, AuthorVault mapping, and post-purchase emails on desktop and mobile.',
      },
      {
        title: 'Check the activity log',
        desc: 'Review timestamp, event type (order.completed, cart.abandoned, checkout.abandoned, subscriber.optin), subscriber, flow triggered, and any errors. A clean log with no errors means you are ready to activate flows.',
      },
    ],
  },
  {
    title: 'Activating Flows and Going Live',
    subtitle: 'Turn on automations and optimize capture',
    steps: [
      {
        title: 'Activate store-connected flows',
        desc: 'In Flows, set these from Draft to Active: Order Confirmation, Digital Delivery (if applicable), Post-Purchase Thank You, Repeat Purchase Thank You, Post-Purchase Follow-Up, Review Request, Abandoned Cart, and Abandoned Checkout.',
        tip: 'Activate one flow at a time and watch the activity log before enabling the next.',
      },
      {
        title: 'Configure suppression and segmentation',
        desc: 'Suppress abandoned cart emails for buyers who already own the title. Build buyers, non-buyers, and series readers segments from Shopify purchase history for smarter campaigns.',
      },
      {
        title: 'Embed opt-in forms in your store',
        desc: 'Add exit-intent pop-ups on homepage and product pages, a footer newsletter form on every page, and inline reader-magnet forms below product descriptions. Tag each placement (shopify-exit-popup, shopify-footer, shopify-product-page).',
      },
    ],
  },
];

export const SHOPIFY_GUIDE_TROUBLESHOOTING: IntegrationTroubleshootItem[] = [
  {
    title: 'Webhooks not arriving',
    desc: 'Re-open Apps → ScribeCount Email in Shopify admin and confirm all permissions are granted. Re-authorize in ScribeCount if any permission was declined.',
  },
  {
    title: 'Purchase events but no flows',
    desc: 'Confirm flows are Active (not Draft or Paused), triggers match the event type, and the test address is not on your suppression list.',
  },
  {
    title: 'Unresolved AuthorVault mapping',
    desc: 'Assign the Shopify product ID to the correct AuthorVault title in store event configuration. Future purchases will resolve automatically.',
  },
  {
    title: 'Abandoned cart emails not sending',
    desc: 'Shopify must know the shopper’s email before abandonment. Encourage login or early email capture — anonymous cart sessions cannot be recovered.',
  },
];
