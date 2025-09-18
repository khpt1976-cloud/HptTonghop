import { EmbeddedModeConfig } from '../types/common';

/**
 * Utility functions for handling embedded mode
 */
export class EmbeddedModeUtils {
  /**
   * Check if the app is running in embedded mode
   */
  static isEmbedded(): boolean {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const embedded = urlParams.get('embedded');
    
    // Check if running in iframe
    const inIframe = window.self !== window.top;
    
    // Check localStorage setting
    const storedEmbedded = localStorage.getItem('shell-config-embedded');
    
    return embedded === 'true' || inIframe || storedEmbedded === 'true';
  }

  /**
   * Get embedded mode configuration
   */
  static getEmbeddedConfig(): EmbeddedModeConfig {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      hideHeader: urlParams.get('hideHeader') === 'true' || this.isEmbedded(),
      hideFooter: urlParams.get('hideFooter') === 'true' || this.isEmbedded(),
      hideNavigation: urlParams.get('hideNavigation') === 'true' || this.isEmbedded(),
      parentOrigin: urlParams.get('parentOrigin') || document.referrer || undefined,
    };
  }

  /**
   * Send message to parent window (if embedded)
   */
  static sendMessageToParent(type: string, data?: any): void {
    if (this.isEmbedded() && window.parent) {
      const message = {
        type: `shell-config-${type}`,
        data,
        timestamp: Date.now(),
      };
      
      window.parent.postMessage(message, '*');
    }
  }

  /**
   * Listen for messages from parent window
   */
  static listenToParentMessages(callback: (type: string, data: any) => void): () => void {
    const messageHandler = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object' && event.data.type) {
        const { type, data } = event.data;
        
        // Only handle messages intended for this micro-frontend
        if (type.startsWith('shell-config-')) {
          const messageType = type.replace('shell-config-', '');
          callback(messageType, data);
        }
      }
    };

    window.addEventListener('message', messageHandler);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }

  /**
   * Notify parent about app ready state
   */
  static notifyAppReady(): void {
    this.sendMessageToParent('app-ready', {
      appName: 'shell-config-admin-frontend',
      version: '1.0.0',
    });
  }

  /**
   * Notify parent about navigation changes
   */
  static notifyNavigationChange(path: string): void {
    this.sendMessageToParent('navigation-change', { path });
  }

  /**
   * Notify parent about language changes
   */
  static notifyLanguageChange(language: string): void {
    this.sendMessageToParent('language-change', { language });
  }

  /**
   * Request full screen mode from parent
   */
  static requestFullScreen(): void {
    this.sendMessageToParent('request-fullscreen');
  }

  /**
   * Exit full screen mode
   */
  static exitFullScreen(): void {
    this.sendMessageToParent('exit-fullscreen');
  }

  /**
   * Get app dimensions for responsive design
   */
  static getAppDimensions(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  /**
   * Set up responsive design listeners
   */
  static setupResponsiveListeners(callback: (dimensions: { width: number; height: number }) => void): () => void {
    const resizeHandler = () => {
      callback(this.getAppDimensions());
    };

    window.addEventListener('resize', resizeHandler);
    
    // Initial call
    resizeHandler();
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }
}

export default EmbeddedModeUtils;