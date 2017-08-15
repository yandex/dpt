import Qs from 'qs';

export default class DepotPlatform {
    constructor() {
        this.platform = this.qsPlatform() || this.fnPlatform() || this.uaPlatform() || 'desktop';
    }

    qsPlatform() {
        let qs = Qs.parse(window.location.search.substr(1));
        return qs.platform || qs.p;
    }

    fnPlatform() {
        let pathname = window.location.pathname;
        let pathParts = pathname.split('/');
        let filenameParts = pathParts[pathParts.length - 1].split('.');

        let fnPlatform;

        if (/\.html$/.test(pathname) && filenameParts.length > 2 && filenameParts[1] !== 'bml') {
            fnPlatform = filenameParts[1];
        }

        return fnPlatform;
    }

    uaPlatform() {
        let userAgent = window.navigator.userAgent;
        if (/iPhone/.test(userAgent)) {
            return 'mobile';
        } else if (/iPad/.test(userAgent)) {
            return 'tablet';
        } else if (/Android/.test(userAgent) || window.screen.availWidth <= 1024) {
            if (Math.min(window.screen.availHeight, window.screen.availWidth) < 768) {
                return 'mobile';
            } else {
                return 'tablet';
            }
        }
    }

    is(platform) {
        return this.platform === platform || this.platform === platform + '-experimental';
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
