// ============================================================
// Tracking Engine v2
// Fetches CMS tracking scripts (Pixel, GTM, Custom) and
// injects them securely into the document head or body.
// ============================================================

import api from './api';

export interface CMSTrackingScript {
  id: number;
  name: string;
  type: string;
  position: 'head' | 'body_start' | 'body_end';
  script: string;
}

let trackingScriptsLoaded = false;

/**
 * Fetch tracking scripts from CMS API and inject them into the DOM.
 */
export async function initTrackingEngine(): Promise<void> {
  if (trackingScriptsLoaded || typeof window === 'undefined') return;

  try {
    const { data } = await api.get('/cms/tracking-scripts');
    
    if (Array.isArray(data)) {
      data.forEach(injectScript);
    }
    
    trackingScriptsLoaded = true;
  } catch (err) {
    console.error('[TrackingEngine] Failed to load tracking scripts:', err);
  }
}

/**
 * Inject a single script into the DOM securely.
 */
function injectScript(scriptObj: CMSTrackingScript): void {
  try {
    // Basic sanitization check for obvious malicious patterns could go here,
    // but assuming CMS users with tracking permissions are trusted.
    
    const wrapper = document.createElement('div');
    // Using Range to safely parse HTML and execute embedded <script> tags
    const range = document.createRange();
    range.selectNode(document.body);
    const documentFragment = range.createContextualFragment(scriptObj.script);
    
    if (scriptObj.position === 'head') {
      document.head.appendChild(documentFragment);
    } else if (scriptObj.position === 'body_start') {
      document.body.insertBefore(documentFragment, document.body.firstChild);
    } else {
      document.body.appendChild(documentFragment);
    }
    
    if (import.meta.env?.DEV) {
      console.log(`[TrackingEngine] Injected script: ${scriptObj.name} (${scriptObj.position})`);
    }
  } catch (err) {
    console.error(`[TrackingEngine] Error injecting script ${scriptObj.name}:`, err);
  }
}
