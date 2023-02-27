const actionButton = document.querySelector('.button');
const refUrl = "https://rocketbets.com/br/popup/registration";

// Referral cookie class
class ReferralCookie {
    constructor(cookieName, cookieExpireDays) {
        this.cookieName = cookieName;
        this.cookieExpireDays = cookieExpireDays;
        this.btag = null;
    }

    setBtagFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const btag = urlParams.get("btag");
        if (btag) {
            this.btag = btag;
            const expireDate = new Date();
            expireDate.setTime(
                expireDate.getTime() + this.cookieExpireDays * 24 * 60 * 60 * 1000
            );
            document.cookie = `${this.cookieName}=${this.btag}; expires=${expireDate.toUTCString()}; path=/`;
        }
    }

    getBtagFromCookie() {
        const cookiePairs = document.cookie.split("; ");
        for (let i = 0; i < cookiePairs.length; i++) {
            const pair = cookiePairs[i].split("=");
            if (pair[0] === this.cookieName) {
                return pair[1];
            }
        }
        return null;
    }

    appendBtagToUrl(url) {
        const btag = this.getBtagFromCookie() || this.btag;
        if (btag) {
            const urlObj = new URL(url);
            urlObj.searchParams.set("btag", btag);
            return urlObj.href;
        }
        return url;
    }
}
const referralCookie = new ReferralCookie("btag", 30);

// Set btag from URL when the document is ready
document.addEventListener("DOMContentLoaded", () => {
    referralCookie.setBtagFromUrl();
});

// Append btag to the redirect URL on popup button click
actionButton.addEventListener("click", () => {
    const redirectUrl = referralCookie.appendBtagToUrl(refUrl);
    window.location.href = redirectUrl;
});