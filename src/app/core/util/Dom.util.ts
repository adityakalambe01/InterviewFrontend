export class DomUtil {
  static onVisibilityChange(): boolean {
    return !document.hidden;
  }

  static enableFullScreen(): void {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    }

    // Listen for fullscreen exit attempts and force fullscreen mode again
    document.addEventListener('fullscreenchange', this.preventFullscreenExit);
    document.addEventListener(
      'webkitfullscreenchange',
      this.preventFullscreenExit
    );
    document.addEventListener(
      'mozfullscreenchange',
      this.preventFullscreenExit
    );
    document.addEventListener('MSFullscreenChange', this.preventFullscreenExit);
  }

  static preventFullscreenExit = (): void => {
    if (!document.fullscreenElement) {
      this.enableFullScreen(); // Re-enable fullscreen if exited
    }
  };

  static disableFullScreen(): void {
    document.removeEventListener(
      'fullscreenchange',
      this.preventFullscreenExit
    );
    document.removeEventListener(
      'webkitfullscreenchange',
      this.preventFullscreenExit
    );
    document.removeEventListener(
      'mozfullscreenchange',
      this.preventFullscreenExit
    );
    document.removeEventListener(
      'MSFullscreenChange',
      this.preventFullscreenExit
    );

    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  }

  static preventExit(): void {
    // Prevent back/forward navigation
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function () {
      history.pushState(null, document.title, location.href);
    });

    // Prevent closing the tab or refreshing
    window.addEventListener('beforeunload', function (event) {
      event.preventDefault();
      event.returnValue =
        'Are you sure you want to leave? Your progress may be lost.';
    });
  }

  static blockBackButton() {
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', this.preventBackNavigation);
  }

  static restoreBackButton() {
    window.removeEventListener('popstate', this.preventBackNavigation);
  }
  static preventBackNavigation = (): void => {
    window.history.pushState(null, '', window.location.href);
  };
}