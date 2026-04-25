import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      // Campaigns
      {
        path: 'campaigns',
        loadComponent: () => import('./features/campaigns/campaigns.component').then(m => m.CampaignsComponent)
      },
      // Flows
      {
        path: 'flows',
        loadComponent: () => import('./features/flows/flows.component').then(m => m.FlowsComponent)
      },
      // Website
      {
        path: 'website/sign-up-forms',
        loadComponent: () => import('./features/website/sign-up-forms/sign-up-forms.component').then(m => m.SignUpFormsComponent)
      },
      {
        path: 'website/landing-pages',
        loadComponent: () => import('./features/website/landing-pages/landing-pages.component').then(m => m.LandingPagesComponent)
      },
      // Audience
      {
        path: 'audience',
        loadComponent: () => import('./features/audience/audience.component').then(m => m.AudienceComponent)
      },
      {
        path: 'audience/growth-tools',
        loadComponent: () => import('./features/audience/growth-tools/growth-tools.component').then(m => m.GrowthToolsComponent)
      },
      {
        path: 'audience/lists-segments',
        loadComponent: () => import('./features/audience/lists-segments/lists-segments.component').then(m => m.ListsSegmentsComponent)
      },
      {
        path: 'audience/profiles',
        loadComponent: () => import('./features/audience/profiles/profiles.component').then(m => m.ProfilesComponent)
      },
      // Content
      {
        path: 'content/templates',
        loadComponent: () => import('./features/templates/templates.component').then(m => m.TemplatesComponent)
      },
      {
        path: 'templates',
        redirectTo: '/content/templates',
        pathMatch: 'full'
      },
      {
        path: 'content/universal-content',
        loadComponent: () => import('./features/content/universal-content/universal-content.component').then(m => m.UniversalContentComponent)
      },
      {
        path: 'content/media-brand',
        loadComponent: () => import('./features/content/media-brand/media-brand.component').then(m => m.MediaBrandComponent)
      },
      // Analytics
      {
        path: 'analytics/dashboards',
        loadComponent: () => import('./features/analytics/dashboards/dashboards.component').then(m => m.AnalyticsDashboardsComponent)
      },
      {
        path: 'analytics/metrics',
        loadComponent: () => import('./features/analytics/metrics/metrics.component').then(m => m.MetricsComponent)
      },
      {
        path: 'analytics/benchmarks',
        loadComponent: () => import('./features/analytics/benchmarks/benchmarks.component').then(m => m.BenchmarksComponent)
      },
      {
        path: 'analytics/deliverability',
        loadComponent: () => import('./features/analytics/deliverability/deliverability.component').then(m => m.DeliverabilityComponent)
      },
      {
        path: 'analytics/custom-reports',
        loadComponent: () => import('./features/analytics/custom-reports/custom-reports.component').then(m => m.CustomReportsComponent)
      },
      // Advanced
      {
        path: 'marketing-analytics',
        loadComponent: () => import('./features/marketing-analytics/marketing-analytics.component').then(m => m.MarketingAnalyticsComponent)
      },
      // Integrations
      {
        path: 'integrations',
        loadComponent: () => import('./features/integrations/integrations.component').then(m => m.IntegrationsComponent)
      },
      // Reports (legacy redirect)
      {
        path: 'reports',
        redirectTo: '/analytics/dashboards',
        pathMatch: 'full'
      },
      // Email
      {
        path: 'email',
        redirectTo: '/email/inbox',
        pathMatch: 'full'
      },
      {
        path: 'email/:folder',
        loadComponent: () => import('./features/email/email-page.component').then(m => m.EmailPageComponent)
      },
      // Settings
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
