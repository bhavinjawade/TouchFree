window.gest = function (e) {
    "use strict";
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    var t, n, a, i, o = {
        framerate: 25,
        videoCompressionRate: 4,
        sensitivity: 80,
        skinFilter: !1,
        debug: {
            state: !1,
            canvas: null,
            context: null
        }
    },
        r = !1,
        s = !1,
        d = function () {
            if (d.prototype._singletonInstance) return d.prototype._singletonInstance;

            function t() {
                return g.removeEventListener("DOMContentLoaded", document, t), g.removeEventListener("load", e, t), u() && (r = !0), !(!s || !r) && e.gest.start()
            }
            return d.prototype._singletonInstance = this, "complete" === document.readyState ? t.call() : (g.addEventListener("DOMContentLoaded", document, t), g.addEventListener("load", e, t)), !0
        },
        c = function (e) {
            var t = g.createCustomEvent("gest", document);
            t.direction = e.direction || null, t.up = e.up || !1, t.down = e.down || !1, t.left = e.left || !1, t.right = e.right || !1, t.error = e.error || null, g.fireEvent(t)
        },
        u = function () {
            return n = document.createElement("video"), a = document.createElement("canvas"), n.canPlayType && a.getContext && a.getContext("2d") && navigator.getUserMedia ? (n.width = 300, n.height = 225, n.setAttribute("style", "visibility: hidden;"), document.body.appendChild(n), a.setAttribute("style", "width: 300px; display: none;"), document.body.appendChild(a), i = a.getContext("2d"), !0) : (h(0), !1)
        },
        h = function (e, t) {
            var n;
            switch (e) {
                case 0:
                    n = {
                        code: e,
                        message: "gest.js can't run in your browser :("
                    };
                    break;
                case 1:
                    n = {
                        code: e,
                        message: "gest.js could not start."
                    };
                    break;
                case 2:
                    n = {
                        code: e,
                        message: "gest.js has already started."
                    };
                    break;
                case 10:
                    n = {
                        code: e,
                        message: "DEEENIED! gest.js needs webcam access.",
                        obj: t
                    };
                    break;
                case 11:
                    n = {
                        code: e,
                        message: "A constraint specified is not supported by the web-browser.",
                        obj: t
                    };
                    break;
                case 12:
                    n = {
                        code: e,
                        message: "No media tracks of the type specified in the constraints are found.",
                        obj: t
                    };
                    break;
                case 13:
                    n = {
                        code: e,
                        message: "Couldn't get access to webcam.",
                        obj: t
                    };
                    break;
                default:
                    n = null
            }
            o.debug.state && console.error(n.message), c({
                error: n
            })
        },
        l = {
            huemin: 0,
            huemax: .1,
            satmin: .3,
            satmax: 1,
            valmin: .4,
            valmax: 1,
            rgb2hsv: function (e, t, n) {
                e /= 255, t /= 255, n /= 255;
                var a, i, o = Math.max(e, t, n),
                    r = Math.min(e, t, n),
                    s = o,
                    d = o - r;
                if (i = 0 === o ? 0 : d / o, o == r) a = 0;
                else {
                    switch (o) {
                        case e:
                            a = (t - n) / d + (t < n ? 6 : 0);
                            break;
                        case t:
                            a = (n - e) / d + 2;
                            break;
                        case n:
                            a = (e - t) / d + 4
                    }
                    a /= 6
                }
                return [a, i, s]
            },
            apply: function (e) {
                for (var t = e.width * e.height * 4, n = 0, a = 0; a < e.height; a++)
                    for (var i = 0; i < e.width; i++) {
                        t = i + a * e.width;
                        var o = e.data[n],
                            r = e.data[n + 1],
                            s = e.data[n + 2],
                            d = e.data[n + 3],
                            c = this.rgb2hsv(o, r, s);
                        (c[0] > this.huemin && c[0] < this.huemax || c[0] > .59 && c[0] < 1) && c[1] > this.satmin && c[1] < this.satmax && c[2] > this.valmin && c[2] < this.valmax ? (e[n] = o, e[n + 1] = r, e[n + 2] = s, e[n + 3] = d) : (e.data[n] = 255, e.data[n + 1] = 255, e.data[n + 2] = 255, e.data[n + 3] = 0), n = 4 * t
                    }
                return e
            }
        },
        v = {
            priorFrame: !1,
            get: function (e, t, n, a) {
                var r = i.createImageData(n, a),
                    s = 0,
                    d = 0,
                    c = 0;
                if (!1 !== this.priorFrame)
                    for (var u = r.width * r.height * 4;
                        (u -= 4) >= 0;) Math.abs(e.data[u] - this.priorFrame.data[u]) + Math.abs(e.data[u + 1] - this.priorFrame.data[u + 1]) + Math.abs(e.data[u + 2] - this.priorFrame.data[u + 2]) > 768 * Math.abs((t - 100) / 100) ? (r.data[u] = 255, r.data[u + 1] = 0, r.data[u + 2] = 0, r.data[u + 3] = 255, c += 1, s += u / 4 % r.width, d += Math.floor(u / 4 / r.height)) : (r.data[u] = e.data[u], r.data[u + 1] = e.data[u + 1], r.data[u + 2] = e.data[u + 2], r.data[u + 3] = e.data[u + 3]);
                c > 0 && (m.search({
                    x: s,
                    y: d,
                    d: c
                }), o.debug.state && o.debug.context.putImageData && (o.debug.canvas.width = n, o.debug.canvas.height = a, o.debug.context.putImageData(r, 0, 0))), this.priorFrame = e
            }
        },
        m = {
            prior: !1,
            filteringFactor: .9,
            filteredTotal: 0,
            minTotalChange: 300,
            minDirChange: 2,
            longDirChange: 7,
            state: 0,
            search: function (e) {
                var t = {
                    x: e.x / e.d,
                    y: e.y / e.d,
                    d: e.d
                };
                this.filteredTotal = this.filteringFactor * this.filteredTotal + (1 - this.filteringFactor) * t.d;
                var n = t.d - this.filteredTotal > this.minTotalChange;
                switch (this.state) {
                    case 0:
                        n && (this.state = 1, m.prior = t);
                        break;
                    case 1:
                        this.state = 2;
                        var a = t.x - m.prior.x,
                            i = t.y - m.prior.y,
                            o = Math.abs(i) < Math.abs(a);
                        a < -this.minDirChange && o ? c({
                            direction: "Right",
                            right: !0
                        }) : a > this.minDirChange && o && c({
                            direction: "Left",
                            left: !0
                        }), i > this.minDirChange && !o ? Math.abs(i) > this.longDirChange ? c({
                            direction: "Long down",
                            down: !0
                        }) : c({
                            direction: "Down",
                            down: !0
                        }) : i < -this.minDirChange && !o && (Math.abs(i) > this.longDirChange ? c({
                            direction: "Long up",
                            up: !0
                        }) : c({
                            direction: "Up",
                            up: !0
                        }));
                        break;
                    case 2:
                        n || (this.state = 0)
                }
            }
        },
        g = {
            htmlEvents: {
                onload: 1,
                onunload: 1,
                onblur: 1,
                onchange: 1,
                onfocus: 1,
                onreset: 1,
                onselect: 1,
                onsubmit: 1,
                onabort: 1,
                onkeydown: 1,
                onkeypress: 1,
                onkeyup: 1,
                onclick: 1,
                ondblclick: 1,
                onmousedown: 1,
                onmousemove: 1,
                onmouseout: 1,
                onmouseover: 1,
                onmouseup: 1
            },
            addEventListener: function (e, t, n) {
                t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent && this.htmlEvents["on" + e] ? t.attachEvent("on" + e, n) : t["on" + e] = n
            },
            removeEventListener: function (e, t, n) {
                t.removeEventListener ? t.removeEventListener(e, n, !1) : t.detachEvent && this.htmlEvents["on" + e] ? t.detachEvent("on" + e, n) : t["on" + e] = null
            },
            createCustomEvent: function (e, t) {
                try {
                    var n;
                    return t.createEvent ? (n = t.createEvent("Event")).initEvent(e, !0, !0) : t.createEventObject && ((n = t.createEventObject()).eventType = e), n.evntName = e, n.evntElement = t, n
                } catch (e) {
                    return console.error(e), !1
                }
            },
            fireEvent: function (e) {
                try {
                    e.evntElement.dispatchEvent ? e.evntElement.dispatchEvent(e) : e.evntElement.fireEvent && this.htmlEvents["on" + e.evntName] ? e.evntElement.fireEvent("on" + e.eventType, e) : e.evntElement[e.evntName] ? e.evntElement[e.evntName]() : e.evntElement["on" + e.evntName] && e.evntElement["on" + e.evntName]()
                } catch (e) {
                    console.error(e)
                }
            }
        };
    return d.prototype.start = function () {
        return s = !0, !!r && (n && (n.paused || n.ended || n.seeking || n.readyState < n.HAVE_FUTURE_DATA) ? (navigator.getUserMedia({
            audio: !1,
            video: !0
        }, function (r) {
            t = r, e.URL = e.URL || e.webkitURL, n.srcObject = t, g.addEventListener("canplaythrough", n, function () {
                n.play(), g.addEventListener("playing", n, function () {
                    var e = Math.floor(n.getBoundingClientRect().width / o.videoCompressionRate),
                        t = Math.floor(n.getBoundingClientRect().height / o.videoCompressionRate);
                    a.width = e, a.height = t, setInterval(function () {
                        ! function (e, t) {
                            try {
                                i.drawImage(n, 0, 0, e, t);
                                var a = i.getImageData(0, 0, e, t);
                                o.skinFilter ? v.get(l.apply(a), o.sensitivity, e, t) : v.get(a, o.sensitivity, e, t)
                            } catch (e) {
                                if ("NS_ERROR_NOT_AVAILABLE" === e.name) return !1;
                                throw e
                            }
                        }(e, t)
                    }, 1e3 / o.framerate)
                })
            })
        }, function (e) {
            e.PERMISSION_DENIED || "PERMISSION_DENIED" === e.name ? h(10, e) : e.NOT_SUPPORTED_ERROR || "NOT_SUPPORTED_ERROR" === e.name ? h(11, e) : e.MANDATORY_UNSATISFIED_ERROR || "MANDATORY_UNSATISFIED_ERROR" === e.name ? h(12, e) : h(13, e)
        }), !!navigator.getUserMedia) : (h(2), !1))
    }, d.prototype.stop = function () {
        return !(!r || !s || (n && (n.src = ""), !t.stop()))
    }, d.prototype.options = {
        subscribeWithCallback: function (e) {
            e && g.addEventListener("gest", document, function (t) {
                e(t)
            })
        },
        sensitivity: function (e) {
            o.sensitivity = e >= 100 ? 100 : e <= 0 ? 0 : e
        },
        debug: function (e) {
            return o.debug.state = e, e ? (o.debug.canvas = document.createElement("canvas"), o.debug.canvas.setAttribute("style", "width: 100%; height: 100%; display: block; position: absolute; top: 0; left: 0;"), document.body.appendChild(o.debug.canvas), o.debug.context = o.debug.canvas.getContext("2d")) : (o.debug.canvas.setAttribute("style", "display: none;"), o.debug.canvas.parentNode.removeChild(o.debug.canvas)), o.debug
        },
        skinFilter: function (e) {
            o.skinFilter = e
        }
    }, new d
}(window);

var curr_zoom = 100;
var scroll_limit = 500;
var count = 0;
var now = 0;
var prev_now = 0;

gest.start(), gest.options.subscribeWithCallback(function (e) {
    console.log(e);
    if (window.location.hostname == "www.youtube.com") {
        e.up && window.scrollBy({ top: -scroll_limit, left: 0, behavior: 'smooth' });
        e.down && window.scrollBy({ top: scroll_limit, left: 0, behavior: 'smooth' });
        if (e.left) {
            now = new Date().getTime();
            if(now - prev_now > 2000){
                document.getElementsByClassName("ytp-play-button")[0].click();
                count += 1;
            }
            prev_time = now;
        }
        else if (e.right) {
            document.getElementsByClassName("ytp-ad-skip-button")[0].click();
        }
    }
    else if (window.location.hostname == "www.netflix.com") {
        e.up && window.scrollBy({ top: -scroll_limit, left: 0, behavior: 'smooth' });
        e.down && window.scrollBy({ top: scroll_limit, left: 0, behavior: 'smooth' });
        if (e.left) {
            if(document.getElementsByClassName("button-nfplayerPlay").length > 0)
                document.getElementsByClassName("button-nfplayerPlay")[0].click();
            else
                document.getElementsByClassName("button-nfplayerPause")[0].click();
        }
        else if (e.right) {
            document.getElementsByClassName("nf-flat-button-text")[0].click();
        }
    }
    else if (window.location.hostname == "www.twitch.tv"){
        e.up && window.scrollBy({ top: -scroll_limit, left: 0, behavior: 'smooth' });
        e.down && window.scrollBy({ top: scroll_limit, left: 0, behavior: 'smooth' });
        if (e.left) {
                document.querySelector('button[data-a-target="player-play-pause-button"]').click();
        }
        else if (e.right) {
            document.querySelector('button[data-a-target="player-mute-unmute-button"]').click();
        }
    }
    
    else {
        e.up && window.scrollBy({ top: -scroll_limit, left: 0, behavior: 'smooth' });
        e.down && window.scrollBy({ top: scroll_limit, left: 0, behavior: 'smooth' });
        if (e.left) {
            curr_zoom -= 10;
            document.body.style.zoom = curr_zoom + "%";
        }
        else if (e.right) {
            curr_zoom += 10;
            document.body.style.zoom = curr_zoom + "%"        
        }
    }
});

function stop() {
    console.log("Stopping");
    gest.stop();
}