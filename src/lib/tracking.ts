declare global {
  interface Window {
    fbq: any;
    _fbq: any;
    dataLayer: any[];
    dataLayer_initialized: boolean;
  }
}

// Store test event code globally so trackFBEvent can use it
let _fbTestEventCode: string | null = null;

/**
 * Facebook Pixel Tracking (with Test Event Code support)
 */
export const trackFBEvent = (eventName: string, data: any = {}, eventId?: string) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    const options: any = {};
    if (eventId) {
      options.eventID = eventId;
    }
    (window as any).fbq('track', eventName, data, options);
  }
};

/**
 * GTM DataLayer Push
 */
export const trackGTMEvent = (eventName: string, data: any = {}) => {
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      ...data,
    });
  }
};

/**
 * Initialize Scripts
 */
export const initTrackingScripts = (settings: Record<string, any>) => {
  const fb_pixel_id = settings.fb_pixel_id;
  const fb_pixel_enabled = settings.fb_pixel_enabled === 'true' || settings.fb_pixel_enabled === true;
  const fb_test_event_code = settings.fb_test_event_code;
  const gtm_id = settings.gtm_id;
  const gtm_enabled = settings.gtm_enabled === 'true' || settings.gtm_enabled === true;

  // Store test event code
  _fbTestEventCode = fb_test_event_code || null;

  // Initialize FB Pixel
  if (fb_pixel_enabled && fb_pixel_id) {
    if (!(window as any).fbq) {
      // @ts-ignore
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          // @ts-ignore
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        // @ts-ignore
        t.async = !0;
        // @ts-ignore
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      // Set test event code if provided (for Facebook Events Manager → Test Events)
      if (_fbTestEventCode) {
        (window as any).fbq('set', 'autoConfig', false, fb_pixel_id);
      }

      (window as any).fbq('init', fb_pixel_id, {}, {
        ...(fb_test_event_code ? { test_event_code: fb_test_event_code } : {}),
      });
      (window as any).fbq('track', 'PageView');

      // NoScript fallback
      if (!document.getElementById('fb-pixel-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'fb-pixel-noscript';
        const img = document.createElement('img');
        img.height = 1;
        img.width = 1;
        img.style.display = 'none';
        img.src = `https://www.facebook.com/tr?id=${fb_pixel_id}&ev=PageView&noscript=1`;
        noscript.appendChild(img);
        document.body.appendChild(noscript);
      }
    }
  }

  // Initialize GTM
  if (gtm_enabled && gtm_id) {
    if (!(window as any).dataLayer_initialized) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
      const scripts = document.getElementsByTagName('script');
      if (scripts.length > 0) {
        const f = scripts[0];
        const j = document.createElement('script');
        j.async = true;
        j.src = `https://www.googletagmanager.com/gtm.js?id=${gtm_id}`;
        f.parentNode?.insertBefore(j, f);
      }

      // NoScript fallback
      if (!document.getElementById('gtm-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'gtm-noscript';
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtm_id}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);
      }
      (window as any).dataLayer_initialized = true;
    }
  }
};
