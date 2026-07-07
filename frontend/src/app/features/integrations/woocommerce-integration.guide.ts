import {
  IntegrationGuidePart,
  IntegrationTroubleshootItem,
} from './integration-setup-guide.component';

export const WOO_GUIDE_PARTS: IntegrationGuidePart[] = [
  {
    title: 'Installing the ScribeCount WooCommerce Plugin',
    subtitle: 'Download, upload, and connect your WordPress store',
    steps: [
      {
        title: 'Download the plugin from ScribeCount',
        desc: 'Go to Settings → Integrations → WooCommerce. Download the plugin zip (do not unzip) and copy your ScribeCount API Key and Webhook Endpoint URL.',
      },
      {
        title: 'Install the plugin in WordPress',
        desc: 'In wp-admin, go to Plugins → Add New → Upload Plugin, select the zip, Install Now, then Activate. The plugin appears as “ScribeCount Email”.',
        tip: 'If upload fails due to file size, increase upload_max_filesize in wp-config.php or ask your host to raise the PHP upload limit.',
      },
      {
        title: 'Enter your ScribeCount API credentials',
        desc: 'Open WooCommerce → Settings → ScribeCount Email. Paste your API Key and Webhook Endpoint URL, Save Settings, then click Test Connection.',
      },
    ],
  },
  {
    title: 'Configuring Store Events in WordPress',
    subtitle: 'Choose which WooCommerce actions send data to ScribeCount',
    steps: [
      {
        title: 'Configure order status triggers',
        desc: 'Digital products (ebooks, audiobooks): trigger on Processing. Physical products: trigger on Completed. Mixed carts: use Processing so digital delivery and emails start immediately.',
      },
      {
        title: 'Configure cart abandonment detection',
        desc: 'Set inactivity window (default 60 minutes), minimum cart value if needed, and map to your Abandoned Cart flow. Requires WordPress cron running reliably.',
      },
      {
        title: 'Configure abandoned checkout detection',
        desc: 'Capture shoppers who enter billing info but do not complete checkout. Use a shorter window (recommended 30 minutes) and your Abandoned Checkout flow.',
      },
      {
        title: 'Map products to AuthorVault titles',
        desc: 'In WooCommerce → Settings → ScribeCount Email → Product Mapping, link each WooCommerce product to the correct AuthorVault title and format.',
        tip: 'Add new products to the mapping after every book launch — new products are not mapped automatically.',
      },
      {
        title: 'Configure checkout opt-in checkbox',
        desc: 'Enable the GDPR-compliant checkout checkbox (unchecked by default). Only subscribers who opt in are added to your list, tagged wordpress-checkout.',
      },
      {
        title: 'Configure embedded opt-in forms',
        desc: 'Use Gutenberg blocks, shortcodes [scribecount_form id="…"], widgets, or exit-intent pop-ups. Each placement can have its own source tag and welcome flow.',
      },
    ],
  },
  {
    title: 'Testing the Integration',
    subtitle: 'Verify webhooks end-to-end before activating flows',
    steps: [
      {
        title: 'Use the Event Testing Console',
        desc: 'Simulate completed order, abandoned cart, abandoned checkout, and opt-in events. Use “Force Abandonment Event” to test cart recovery without waiting 60 minutes.',
      },
      {
        title: 'Place a real test order',
        desc: 'Complete a test purchase with a secondary email. Confirm the order event in ScribeCount within 60 seconds, correct tags, product mapping, and post-purchase emails.',
      },
      {
        title: 'Review the activity log',
        desc: 'Check each webhook: timestamp, event type, subscriber, flow triggered, and errors. Resolve any unresolved product mappings before going live.',
      },
    ],
  },
  {
    title: 'Activating Flows and Optimizing Capture',
    subtitle: 'Go live and build intelligent segments',
    steps: [
      {
        title: 'Activate store-connected flows',
        desc: 'Set Post-Purchase, Abandoned Cart, Abandoned Checkout, Welcome, and Digital Delivery flows to Active. Activate one at a time and monitor the log.',
      },
      {
        title: 'Configure segmentation rules',
        desc: 'Buyers: at least one Processing/Completed order. Non-buyers: zero purchases. Series readers: bought Book 1. High-value: three or more purchases for ARC and community invites.',
      },
      {
        title: 'Set up WordPress opt-in placements',
        desc: 'Exit-intent pop-up (once per session or 30 days), post-purchase thank-you page form, footer widget, and inline form below each book’s buy button with reader-magnet copy.',
      },
    ],
  },
];

export const WOO_GUIDE_TROUBLESHOOTING: IntegrationTroubleshootItem[] = [
  {
    title: 'Connection test fails',
    desc: 'Verify API key and webhook URL, confirm PHP 8.0+, and ensure your host allows outbound HTTPS to ScribeCount.',
  },
  {
    title: 'Order events not arriving',
    desc: 'Confirm the plugin is active, credentials are saved, and the configured order status (Processing vs Completed) matches your product type.',
  },
  {
    title: 'Cart abandonment not detecting',
    desc: 'Check WP-Cron health in plugin settings. If cron is stale, configure a server cron job to hit wp-cron.php.',
  },
  {
    title: 'Checkout opt-in checkbox missing',
    desc: 'Another plugin or your theme may override checkout markup. Temporarily disable conflicting email plugins to find the conflict.',
  },
  {
    title: 'Unresolved products in activity log',
    desc: 'Add missing products in Product Mapping after each new WooCommerce product is created.',
  },
];
