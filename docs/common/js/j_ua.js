/*
j_ua.js
*/

function UA() {

    this._ua = navigator.userAgent;
    this._ver = navigator.appVersion;

    var ua = this._ua.toLowerCase();
    var ver = this._ver.toLowerCase();

    // IE(11以外)
    this.isMSIE = (ua.indexOf('msie') > -1) && (ua.indexOf('opera') == -1);
    // IE6
    this.isIE6 = this.isMSIE && (ver.indexOf('msie 6.') > -1);
    // IE7
    this.isIE7 = this.isMSIE && (ver.indexOf('msie 7.') > -1);
    // IE8
    this.isIE8 = this.isMSIE && (ver.indexOf('msie 8.') > -1);
    // IE9
    this.isIE9 = this.isMSIE && (ver.indexOf('msie 9.') > -1);
    // IE10
    this.isIE10 = this.isMSIE && (ver.indexOf('msie 10.') > -1);
    // IE11
    this.isIE11 = (ua.indexOf('trident/7') > -1);
    // IE
    this.isIE = this.isMSIE || this.isIE11;
    // Edge
    this.isEdge = (ua.indexOf('edge') > -1);

    // Google Chrome
    this.isChrome = (ua.indexOf('chrome') > -1) && (ua.indexOf('edge') == -1);
    // Firefox
    this.isFirefox = (ua.indexOf('firefox') > -1);
    // Safari
    this.isSafari = (ua.indexOf('safari') > -1) && (ua.indexOf('chrome') == -1);
    // Opera
    this.isOpera = (ua.indexOf('opera') > -1);


    // iPhone
    this.isIphone = ua.indexOf('iphone') > 0;
    // iPod
    this.isIpod = ua.indexOf('ipod') > 0;
    // Android
    this.isAndroid = (ua.indexOf('android') > 0) && (ua.indexOf('mobile') > 0);
    // Windows Phone
    this.isWinPhone = ua.indexOf('windows phone') > 0;
    // iPad
    this.isIpad = ua.indexOf('ipad') > 0;
    // Android Tablet (Android 4.x〜)
    this.isAndroidTab = (ua.indexOf('android') > 0 && ua.indexOf('mobile') == -1);

    // Sp
    this.isSp = this.isIphone || this.isIpod || this.isAndroid || this.isWinPhone;
    // Tab
    this.isTab = this.isIpad || this.isAndroidTab;
    // Touch Device
    this.isTouch = ('createTouch' in document) || ('ontouchstart' in document);

}

UA.prototype.GetIosVersion = function() {

    var v, versions;
    if ( this.isIphone || this.isIpod || this.isIpad ) {
        v = (this._ver).match(/OS (\d+)_(\d+)_?(\d+)?/);
        versions = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        return versions[ 0 ];
    }
    return versions;

}

UA.prototype.GetAndroidVersion = function() {

    if( this.isAndroid ) {
        return parseFloat(this._ua.slice(this._ua.indexOf("Android")+8));
    }

}
