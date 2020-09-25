export default () => ({

    content: `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-122971269-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
    
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());
    
            gtag('config', 'UA-122971269-1');
    
        </script>
        <!-- Facebook Pixel Code -->
        <script>
            ! function(f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function() {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '257310718238849');
            fbq('track', 'PageView');
    
        </script>
        <noscript>
            <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=257310718238849&ev=PageView&noscript=1" />
        </noscript>
        <!-- End Facebook Pixel Code -->
        <script>
            window['_fs_debug'] = false;
            window['_fs_host'] = 'fullstory.com';
            window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
            window['_fs_org'] = 'QKWTV';
            window['_fs_namespace'] = 'FS';
            (function(m, n, e, t, l, o, g, y) {
                if (e in m) {
                    if (m.console && m.console.log) {
                        m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
                    }
                    return;
                }
                g = m[e] = function(a, b, s) {
                    g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
                };
                g.q = [];
                o = n.createElement(t);
                o.async = 1;
                o.crossOrigin = 'anonymous';
                o.src = 'https://' + _fs_script;
                y = n.getElementsByTagName(t)[0];
                y.parentNode.insertBefore(o, y);
                g.identify = function(i, v, s) {
                    g(l, {
                        uid: i
                    }, s);
                    if (v) g(l, v, s)
                };
                g.setUserVars = function(v, s) {
                    g(l, v, s)
                };
                g.event = function(i, v, s) {
                    g('event', {
                        n: i,
                        p: v
                    }, s)
                };
                g.anonymize = function() {
                    g.identify(!!0)
                };
                g.shutdown = function() {
                    g("rec", !1)
                };
                g.restart = function() {
                    g("rec", !0)
                };
                g.log = function(a, b) {
                    g("log", [a, b])
                };
                g.consent = function(a) {
                    g("consent", !arguments.length || a)
                };
                g.identifyAccount = function(i, v) {
                    o = 'account';
                    v = v || {};
                    v.acctId = i;
                    g(o, v)
                };
                g.clearUserCookie = function() {};
                g._w = {};
                y = 'XMLHttpRequest';
                g._w[y] = m[y];
                y = 'fetch';
                g._w[y] = m[y];
                if (m[y]) m[y] = function() {
                    return g._w[y].apply(this, arguments)
                };
                g._v = "1.2.0";
            })(window, document, window['_fs_namespace'], 'script', 'user');
    
        </script>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta content="Relate is the first interface design tool that empowers design and development teams to collaborate in the creation of digital products - visually and straightforwardly" name="description">
        <meta content="https://relate.app/img/fb.png" property="og:image">
        <title>Relate - Design and develop at the same time</title>
        <link rel="icon" href="img/favicon.png">
        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js"></script>
    </head>
    
    <body>
        <a class="ph_notification" href="/pricing">
            <span>Thank you Producthunt! You made us blush 😻 And for all of ya'hunters, get a 15% discount with the following promocode: NOHANDOFF</span>
        </a>
        <section class="grid-section second-section">
            <nav class="navbar">
                <a href="https://relate.app">
                    <img src="img/logo.svg" alt="logo">
                </a>
                <div class="links">
                    We're on<a href="https://www.producthunt.com/posts/relate-3" target="_blank" style="color: #DC5525;"> Product Hunt 😻</a>
                    <a href="/about">Why Relate?</a>
                    <a href="/pricing">Pricing</a>
                    <a href="https://relate.app/login">Log in</a>
                    <a class="signin" href="https://relate.app/signup">Sign up</a>
                </div>
            </nav>
    
            <div class="heading center">
                <h1 class="hero-text bottom">Design & develop<br>at the same time</h1>
                <h4 class="gray">Relate is a visual development environment for fast, live team collaboration
                </h4>
                <div class="bottom"><span style="color: blueviolet">Our Preview Release is live! No waitlist, simply signup and try it out -></span></div>
    
                <a class="signin bottom" href="https://relate.app/signup">Sign up for Relate</a>
            </div>
            <div class="big-image">
                <script>
                    $(document).ready(function() {
                        $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                            disableOn: 700,
                            type: 'iframe',
                            mainClass: 'mfp-fade',
                            removalDelay: 160,
                            preloader: true,
                            fixedContentPos: false
                        });
                    });
    
                </script>
                <a class="popup-youtube" href="https://www.youtube.com/watch?v=fW5X-4apCus"><img src="img/video.png" width="1360px"></a>
            </div>
    
    
            <div class="heading center">
                <h3>Design directly in the web</h3>
                <h4 class="gray">While you design,  code is generated in the background<br>and can be published anywhere.</h4>
            </div>
            <img src="img/app.png" class="big-image">
    
            <div class="heading center">
                <span class="gray">Coming soon</span>
                <h3 class="bottom">Your design is a living system of components</h3>
                <h4 class="gray">Build production-ready UI components,<br>handle deploying & versioning.</h4>
            </div>
            <div class="big-left-block">
                <img src="img/codeview.png">
    
            </div>
            <div class="right-block">
    
                <span class="gray">Coming soon</span>
    
                <h2 class="bottom">Design + Code. 10x faster<br>and infinitely more efficient</h2>
                <p>Define the real logic behind your interface. Manage everything visually, consistently and systematically. React? Vue? Web Components? No problem.</p>
                <img class="logos-block bottom" src="img/logosblock.png" width="100px" alt="logos">
            </div>
            <div class="left-block">
                <span class="gray">Coming soon</span>
    
                <h2 class="bottom">Continuous Design Delivery</h2>
                <p>Relate outputs legible presentational code that you can sync to a codebase and share with your production environment.</p>
            </div>
    
            <div class="big-right-block">
                <img src="img/sync.png">
            </div>
            <div class="heading center">
                <span class="gray">Coming soon</span>
                <h3 class="bottom">We believe in Open Design</h3>
                <h4 class="gray">Share open UI libraries with your team or the entire world</h4>
            </div>
            <div class="big-image">
                <img src="img/lib.png" width="1200px">
            </div>
    
            <div class="heading center">
                <h3 class="bottom">We're getting ready</h3>
    
                <h4 class="gray">No waitlist, simply signup and try it out!<br>Our full feature set will be working like a swiss clock by the end of 2020.
                </h4>
                <a class="signin bottom" href="https://relate.app/signup">Sign up</a>
            </div>
        </section>
        <section class="grid-section footer">
            <div class="link-block1">
                <img class="logosmall" src="img/logo.svg" alt="logo">
                <div>
                    <h2>relate</h2>
                    <div class="label">The visual development environment
                        <br>for fast, live team collaboration.
                        <br>© 2020 Relate Design, Ltd.
                    </div>
                    <a href="https://www.notion.so/relate/Terms-and-Privacy-25ac9effdf3a413cb03a7ff94f9185b2" target="_blank">Terms and Privacy</a>
                </div>
            </div>
            <div class="link-block">
                <a href="/about">Why Relate</a>
                <a href="/faqs">FAQs</a>
                <a href="/pricing">Pricing</a>
            </div>
            <div class="link-block">
                <a href="https://www.notion.so/relate/Release-Notes-af6d79e3826f4635878709119f537198" target="_blank">What's new</a>
                <a href="https://www.notion.so/relate/33f18440d2e245a89b2c9d11769f3d54?v=44d2b4916e6646eeb2c03339855a988f" target="_blank">Public Roadmap</a>
                <a href="https://medium.com/relate" target="_blank">Blog</a>
    
            </div>
            <div class="link-block">
                <a href="https://twitter.com/relatedesign" target="_blank">Twitter</a>
                <a href="mailto:hello@relate.app" target="_blank">Get in Touch</a>
            </div>
        </section>
        <script>
            window.intercomSettings = {
                app_id: "efp5cdu4"
            };
    
        </script>
    
        <script>
            // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/efp5cdu4'
            (function() {
                var w = window;
                var ic = w.Intercom;
                if (typeof ic === "function") {
                    ic('reattach_activator');
                    ic('update', w.intercomSettings);
                } else {
                    var d = document;
                    var i = function() {
                        i.c(arguments);
                    };
                    i.q = [];
                    i.c = function(args) {
                        i.q.push(args);
                    };
                    w.Intercom = i;
                    var l = function() {
                        var s = d.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = 'https://widget.intercom.io/widget/efp5cdu4';
                        var x = d.getElementsByTagName('script')[0];
                        x.parentNode.insertBefore(s, x);
                    };
                    if (w.attachEvent) {
                        w.attachEvent('onload', l);
                    } else {
                        w.addEventListener('load', l, false);
                    }
                }
            })();
        </script>
        <script>
            const PATH = 'producthunt';
            const url = new URL(window.location.href);
            const params =  new URLSearchParams(url.search);
            const phBanner = document.querySelector('.ph_notification');
    
            if (params.get('ref') === PATH) {
                phBanner.style = 'display: block';
            }
        </script>
    </body>
    
    </html>
    
    `,
    url: 'https://relate.app/'
})