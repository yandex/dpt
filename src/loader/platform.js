import Qs from 'qs';

export default class DepotPlatform {
    constructor() {
        let qs = Qs.parse(window.location.search.substr(1));
        let pathname = window.location.pathname;
        let pathParts = pathname.split('/');
        let filenameParts = pathParts[pathParts.length - 1].split('.');

        let qsPlatform = qs.platform || qs.p;
        let fnPlatform;

        if (/\.html$/.test(pathname) && filenameParts.length > 2 && filenameParts[1] !== 'bml') {
            fnPlatform = filenameParts[1];
        }

        // Detect platform from userAgent
        let uaPlatform;
        let userAgent = window.navigator.userAgent;
        if (/iPhone/.test(userAgent)) {
            uaPlatform = 'mobile';
        } else if (/iPad/.test(userAgent)) {
            uaPlatform = 'tablet';
        } else if (/Android/.test(userAgent) || window.screen.availWidth <= 1024) {
            let minRez = Math.min(window.screen.availHeight, window.screen.availWidth);
            if (minRez < 768) {
                uaPlatform = 'mobile';
            } else {
                uaPlatform = 'tablet';
            }
        }

        this.platform = qsPlatform || fnPlatform || uaPlatform || 'desktop';
    }

    is(platform) {
        return this.platform === platform
            || this.platform === platform + '-experimental';
    }

    isDesktop() {
        return this.is('desktop');
    }

    isMobile() {
        return this.is('mobile');
    }

    isTablet() {
        return this.is('tablet');
    }

    isExperimental() {
        return /-experimental$/.test(this.platform);
    }
}
