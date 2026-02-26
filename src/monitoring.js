/**
 * Production Monitoring and Error Tracking
 * Integrates with Sentry for error tracking and Google Analytics for usage tracking
 */

// Initialize Sentry for error tracking
// Replace 'YOUR_SENTRY_DSN' with your actual Sentry DSN from https://sentry.io
const SENTRY_DSN = 'YOUR_SENTRY_DSN';
const SENTRY_ENABLED = SENTRY_DSN && SENTRY_DSN !== 'YOUR_SENTRY_DSN';

if (SENTRY_ENABLED) {
    // Load Sentry SDK
    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/7.99.0/bundle.min.js';
    script.integrity = 'sha384-6/Qj6pZXnRpXhVhKlFPvpLvZvqKqVvqKqVvqKqVvqKqVvqKqVvqKqVvqKqVvqKq';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
        Sentry.init({
            dsn: SENTRY_DSN,
            integrations: [
                new Sentry.BrowserTracing(),
                new Sentry.Replay()
            ],
            tracesSampleRate: 0.1, // 10% of transactions
            replaysSessionSampleRate: 0.1, // 10% of sessions
            replaysOnErrorSampleRate: 1.0, // 100% of errors
            environment: window.location.hostname === 'localhost' ? 'development' : 'production',
            beforeSend(event, hint) {
                // Filter out sensitive data
                if (event.request) {
                    delete event.request.cookies;
                }
                return event;
            }
        });
    };
    document.head.appendChild(script);
}

// Performance monitoring
const performanceMonitor = {
    marks: {},
    
    start(label) {
        this.marks[label] = performance.now();
    },
    
    end(label) {
        if (this.marks[label]) {
            const duration = performance.now() - this.marks[label];
            this.log(label, duration);
            delete this.marks[label];
            return duration;
        }
    },
    
    log(label, duration) {
        console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
        
        // Send to analytics if available
        if (window.gtag) {
            gtag('event', 'timing_complete', {
                name: label,
                value: Math.round(duration),
                event_category: 'Performance'
            });
        }
        
        // Send to Sentry as breadcrumb
        if (SENTRY_ENABLED && window.Sentry) {
            Sentry.addBreadcrumb({
                category: 'performance',
                message: `${label}: ${duration.toFixed(2)}ms`,
                level: 'info'
            });
        }
    }
};

// Error tracking wrapper
function trackError(error, context = {}) {
    console.error('Error:', error, context);
    
    if (SENTRY_ENABLED && window.Sentry) {
        Sentry.captureException(error, {
            contexts: {
                custom: context
            }
        });
    }
}

// Usage tracking
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
    
    // Sentry breadcrumb
    if (SENTRY_ENABLED && window.Sentry) {
        Sentry.addBreadcrumb({
            category: 'user-action',
            message: eventName,
            data: eventData,
            level: 'info'
        });
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    trackError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    trackError(event.reason, {
        type: 'unhandledRejection',
        promise: event.promise
    });
});

// Export for use in app.js
window.performanceMonitor = performanceMonitor;
window.trackError = trackError;
window.trackEvent = trackEvent;
