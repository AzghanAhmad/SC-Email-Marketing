import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-root">
      <header class="nav" [class.scrolled]="navScrolled">
        <div class="nav-inner">
          <a routerLink="/login" class="nav-logo">
            <span class="logo-mark">
              <svg viewBox="0 0 36 36" fill="none">
                <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#60a5fa"/><stop offset="50%" stop-color="#818cf8"/><stop offset="100%" stop-color="#a78bfa"/>
                </linearGradient></defs>
                <rect width="36" height="36" rx="10" fill="url(#lg)" opacity="0.2"/>
                <path d="M10 12h16M10 17h10M10 22h13" stroke="url(#lg)" stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="logo-text">ScribeCount Email</span>
          </a>
          <nav class="nav-links">
            <a routerLink="/login">Log In</a>
            <a routerLink="/signup" class="btn-signup nav-active">Sign Up</a>
          </nav>
        </div>
      </header>

      <section class="auth-hero">
        <div class="auth-hero-inner">
          <div class="hero-left">
            <h1 class="hero-title anim-up">Start Building<br>Your <span class="gradient-text">Reader List</span></h1>
            <p class="hero-sub anim-up d2">
              Join authors who use ScribeCount Email to send stunning campaigns, automate their reader journeys, and grow their audience with data-driven insights.
            </p>
            <div class="hero-badges anim-up d3">
              <span class="badge-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>
                Free to start
              </span>
              <span class="badge-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Automation flows
              </span>
              <span class="badge-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                Unlimited subscribers
              </span>
            </div>
          </div>

          <div class="form-side anim-up d2">
            <div class="auth-card">
              <h2 class="card-title">Create your account</h2>
              <p class="card-subtitle">By continuing you agree to our <a href="#" class="link-accent">Terms</a> and <a href="#" class="link-accent">Privacy Policy</a></p>

              <div class="auth-success" *ngIf="successMessage()">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>
                {{ successMessage() }}
              </div>
              <div class="auth-error animate-shake" *ngIf="generalError()">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
                {{ generalError() }}
              </div>

              <form (ngSubmit)="onSubmit()" class="auth-form" novalidate>
                <div class="form-group">
                  <label class="form-label">Full name</label>
                  <input type="text" [(ngModel)]="name" name="name" placeholder="Your name"
                    (input)="clearError('name')" [class.input-error]="errors().name" class="auth-input" />
                  <p class="field-error" *ngIf="errors().name">{{ errors().name }}</p>
                </div>
                <div class="form-group">
                  <label class="form-label">Email address</label>
                  <input type="email" [(ngModel)]="email" name="email" placeholder="you@example.com"
                    (input)="clearError('email')" [class.input-error]="errors().email" class="auth-input" />
                  <p class="field-error" *ngIf="errors().email">{{ errors().email }}</p>
                </div>
                <div class="form-group">
                  <label class="form-label">Password</label>
                  <div class="input-wrapper">
                    <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password"
                      placeholder="Min 6 characters" (input)="clearError('password')"
                      [class.input-error]="errors().password" class="auth-input" />
                    <button type="button" class="toggle-pw" (click)="showPassword = !showPassword">
                      <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                      <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                    </button>
                  </div>
                  <p class="field-error" *ngIf="errors().password">{{ errors().password }}</p>
                </div>
                <div class="form-group">
                  <label class="form-label">Confirm password</label>
                  <div class="input-wrapper">
                    <input [type]="showConfirm ? 'text' : 'password'" [(ngModel)]="confirmPassword" name="confirmPassword"
                      placeholder="Repeat password" (input)="clearError('confirmPassword')"
                      [class.input-error]="errors().confirmPassword" class="auth-input" />
                    <button type="button" class="toggle-pw" (click)="showConfirm = !showConfirm">
                      <svg *ngIf="!showConfirm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                      <svg *ngIf="showConfirm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                    </button>
                  </div>
                  <p class="field-error" *ngIf="errors().confirmPassword">{{ errors().confirmPassword }}</p>
                </div>

                <button type="submit" class="auth-submit-btn" [disabled]="isSubmitting() || !!successMessage()">
                  <span class="spinner" *ngIf="isSubmitting()"></span>
                  {{ isSubmitting() ? 'Creating account...' : 'Create Account' }}
                </button>
              </form>

              <div class="card-divider"><span>or</span></div>
              <p class="card-alt-text">Already have an account?</p>
              <a routerLink="/login" class="btn-outline">Sign in</a>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="footer-inner">
          <span class="footer-logo">ScribeCount Email</span>
          <span class="footer-copy">&copy; {{ year }} ScribeCount. All rights reserved.</span>
          <div class="footer-links-row">
            <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Help</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .auth-root { min-height:100vh;background:linear-gradient(135deg,#16263e 0%,#1e375f 40%,#101c2e 100%);font-family:'Inter',system-ui,sans-serif;overflow-x:hidden; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    .anim-up { opacity:0;animation:fadeUp .7s cubic-bezier(.4,0,.2,1) forwards; }
    .d2{animation-delay:.1s} .d3{animation-delay:.2s}
    .animate-shake { animation:shake .4s ease-in-out; }
    .nav { position:fixed;top:0;left:0;right:0;z-index:100;background:transparent;transition:background .35s,box-shadow .35s; }
    .nav.scrolled { background:rgba(16,28,46,.95);backdrop-filter:blur(18px);box-shadow:0 4px 30px rgba(0,0,0,.3); }
    .nav-inner { max-width:1200px;margin:0 auto;padding:.85rem 1.5rem;display:flex;align-items:center;justify-content:space-between; }
    .nav-logo { display:flex;align-items:center;gap:.6rem;text-decoration:none;color:white; }
    .logo-mark { width:32px;height:32px;display:flex;align-items:center;justify-content:center; }
    .logo-mark svg { width:100%;height:100%; }
    .logo-text { font-weight:700;font-size:1.05rem;letter-spacing:-.02em; }
    .nav-links { display:flex;align-items:center;gap:1.5rem; }
    .nav-links a { color:rgba(255,255,255,.7);text-decoration:none;font-size:.9rem;font-weight:500;transition:color .2s; }
    .nav-links a:hover,.nav-active { color:white !important; }
    .btn-signup { background:rgba(255,255,255,.12) !important;color:white !important;padding:.5rem 1.1rem;border-radius:10px;font-weight:600 !important;border:1px solid rgba(255,255,255,.2) !important; }
    .auth-hero { min-height:100vh;display:flex;align-items:center;padding:5rem 1.5rem 3rem;position:relative; }
    .auth-hero::before { content:'';position:absolute;top:0;left:0;width:50%;height:100%;background:radial-gradient(ellipse at 20% 50%,rgba(167,139,250,0.06) 0%,transparent 70%);pointer-events:none; }
    .auth-hero-inner { max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center; }
    .hero-left { color:white; }
    .hero-title { font-size:3.25rem;font-weight:800;line-height:1.08;letter-spacing:-.04em;margin:0 0 1.25rem; }
    .gradient-text { background:linear-gradient(135deg,#60a5fa,#818cf8,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
    .hero-sub { font-size:1.05rem;line-height:1.7;color:rgba(226,232,240,.8);max-width:460px;margin:0 0 2rem; }
    .hero-badges { display:flex;gap:.6rem;flex-wrap:wrap; }
    .badge-pill { display:inline-flex;align-items:center;gap:.4rem;padding:.45rem .9rem;background:rgba(255,255,255,.08);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);border-radius:100px;font-size:.8rem;font-weight:600;color:rgba(255,255,255,.85); }
    .form-side { display:flex;justify-content:center; }
    .auth-card { width:100%;max-width:420px;background:rgba(255,255,255,.07);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:2.25rem;box-shadow:0 24px 64px rgba(0,0,0,.4); }
    .card-title { font-size:1.4rem;font-weight:700;color:white;margin:0 0 .35rem;text-align:center; }
    .card-subtitle { font-size:.83rem;color:rgba(255,255,255,.5);text-align:center;margin:0 0 1.5rem;line-height:1.5; }
    .link-accent { color:#818cf8;font-weight:600;text-decoration:none; }
    .link-accent:hover { text-decoration:underline; }
    .auth-form { display:flex;flex-direction:column;gap:.875rem; }
    .form-group { display:flex;flex-direction:column; }
    .form-label { font-size:.8rem;font-weight:600;color:rgba(255,255,255,.6);margin-bottom:.375rem; }
    .input-wrapper { position:relative;display:flex;align-items:center; }
    .auth-input { width:100%;padding:.8rem 1rem;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.12);border-radius:12px;font-size:.9rem;font-family:inherit;color:white;transition:all .2s;outline:none; }
    .auth-input:focus { border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.15); }
    .auth-input::placeholder { color:rgba(255,255,255,.3); }
    .auth-input.input-error { border-color:#ef4444; }
    .toggle-pw { position:absolute;right:.85rem;display:flex;background:none;border:none;cursor:pointer;padding:0;color:rgba(255,255,255,.4);transition:color .2s; }
    .toggle-pw:hover { color:rgba(255,255,255,.8); }
    .toggle-pw svg { width:18px;height:18px; }
    .field-error { margin:.3rem 0 0;font-size:.75rem;color:#f87171;font-weight:500; }
    .auth-success { display:flex;align-items:center;gap:.5rem;padding:.75rem 1rem;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.2);border-radius:10px;color:#34d399;font-size:.85rem;font-weight:500;margin-bottom:1rem; }
    .auth-success svg { width:16px;height:16px;flex-shrink:0; }
    .auth-error { display:flex;align-items:center;gap:.5rem;padding:.75rem 1rem;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.2);border-radius:10px;color:#f87171;font-size:.85rem;font-weight:500;margin-bottom:1rem; }
    .auth-error svg { width:16px;height:16px;flex-shrink:0; }
    .auth-submit-btn { width:100%;padding:.875rem 1rem;background:linear-gradient(135deg,#60a5fa,#818cf8);color:white;border:none;border-radius:12px;font-size:.9rem;font-weight:700;font-family:inherit;cursor:pointer;transition:all .25s;box-shadow:0 6px 20px rgba(96,165,250,.3);display:flex;align-items:center;justify-content:center;gap:.5rem;margin-top:.25rem; }
    .auth-submit-btn:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 10px 30px rgba(96,165,250,.4); }
    .auth-submit-btn:disabled { opacity:.6;cursor:not-allowed; }
    .spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .8s linear infinite; }
    .card-divider { display:flex;align-items:center;gap:1rem;margin:1.25rem 0 1rem; }
    .card-divider::before,.card-divider::after { content:'';flex:1;height:1px;background:rgba(255,255,255,.1); }
    .card-divider span { font-size:.8rem;color:rgba(255,255,255,.3);font-weight:500; }
    .card-alt-text { text-align:center;font-size:.85rem;color:rgba(255,255,255,.5);margin:0 0 .6rem; }
    .btn-outline { display:block;width:100%;padding:.8rem;text-align:center;border:1.5px solid rgba(255,255,255,.15);border-radius:12px;background:transparent;color:rgba(255,255,255,.8);font-size:.9rem;font-weight:600;text-decoration:none;font-family:inherit;cursor:pointer;transition:all .2s; }
    .btn-outline:hover { border-color:rgba(255,255,255,.3);color:white;background:rgba(255,255,255,.06); }
    .footer { background:rgba(0,0,0,.3);border-top:1px solid rgba(255,255,255,.06); }
    .footer-inner { max-width:1200px;margin:0 auto;padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem; }
    .footer-logo { font-size:.875rem;font-weight:700;color:rgba(255,255,255,.6); }
    .footer-copy { font-size:.8rem;color:rgba(255,255,255,.3); }
    .footer-links-row { display:flex;gap:1.25rem; }
    .footer-links-row a { font-size:.8rem;color:rgba(255,255,255,.3);text-decoration:none;transition:color .2s; }
    .footer-links-row a:hover { color:rgba(255,255,255,.7); }
    @media(max-width:900px) {
      .auth-hero-inner { grid-template-columns:1fr;gap:2.5rem; }
      .hero-left { text-align:center; }
      .hero-title { font-size:2.2rem; }
      .hero-sub { margin-left:auto;margin-right:auto; }
      .hero-badges { justify-content:center; }
    }
    @media(max-width:480px) { .hero-title { font-size:1.8rem; } .auth-card { padding:1.5rem; } }
  `]
})
export class SignupComponent {
  name = ''; email = ''; password = ''; confirmPassword = '';
  showPassword = false; showConfirm = false; navScrolled = false;
  readonly year = new Date().getFullYear();
  isSubmitting = signal(false);
  generalError = signal('');
  successMessage = signal('');
  errors = signal<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

  constructor(private authService: AuthService, private router: Router) {}

  @HostListener('window:scroll')
  onScroll() { this.navScrolled = window.scrollY > 40; }

  clearError(field: string) {
    this.errors.update(e => ({ ...e, [field]: undefined }));
  }

  onSubmit() {
    const errs: any = {};
    if (!this.name.trim()) errs.name = 'Full name is required';
    if (!this.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) errs.email = 'Please enter a valid email';
    if (!this.password) errs.password = 'Password is required';
    else if (this.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!this.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (this.password !== this.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { this.errors.set(errs); return; }

    this.isSubmitting.set(true);
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.successMessage.set('Account created! Redirecting...');
        this.isSubmitting.set(false);
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => { this.generalError.set(err.message); this.isSubmitting.set(false); }
    });
  }
}
