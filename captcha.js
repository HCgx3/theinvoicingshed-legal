// Runs the Cloudflare Turnstile robot check for The Invoicing Shed app and
// sends the one-time token back to the app. The site key is public and comes
// after the # in this page's address, so it is never sent to the web server.
(function () {
  var match = /[#&]sitekey=([0-9A-Za-z_-]{10,100})(&|$)/.exec(location.hash);
  var siteKey = match ? match[1] : null;
  var note = document.getElementById('note');

  function send(message) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }

  window.startCaptcha = function () {
    if (!siteKey) {
      note.textContent = 'This page is used by The Invoicing Shed app. Open the app to sign in.';
      return;
    }
    window.turnstile.render('#widget', {
      sitekey: siteKey,
      action: 'sign-in',
      theme: 'auto',
      callback: function (token) {
        note.textContent = 'Done. Signing you in...';
        send({ type: 'token', token: token });
      },
      'error-callback': function () {
        send({ type: 'error' });
      },
      'expired-callback': function () {
        window.turnstile.reset('#widget');
      }
    });
  };
})();
