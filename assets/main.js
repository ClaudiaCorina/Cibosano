(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      document.attachEvent('onreadystatechange', function () {
        if (document.readyState !== 'loading') fn();
      });
    }
  }

  function getValue(form, name) {
    var el = form.elements[name];
    return el && typeof el.value === 'string' ? el.value.replace(/^\s+|\s+$/g, '') : '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  ready(function () {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.nav-mobile');

    function onScroll() {
      if (!header) return;
      if (window.pageYOffset > 16) {
        if (header.className.indexOf('is-scrolled') === -1) {
          header.className += ' is-scrolled';
        }
      } else {
        header.className = header.className.replace(' is-scrolled', '');
      }
    }
    onScroll();
    if (window.addEventListener) {
      window.addEventListener('scroll', onScroll, false);
    }

    if (toggle && mobileNav) {
      toggle.onclick = function () {
        var open = mobileNav.className.indexOf('is-open') !== -1;
        if (open) {
          mobileNav.className = mobileNav.className.replace(' is-open', '');
          toggle.className = toggle.className.replace(' is-open', '');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          mobileNav.className += ' is-open';
          toggle.className += ' is-open';
          toggle.setAttribute('aria-expanded', 'true');
        }
      };
    }

    var year = document.getElementById('year');
    if (year) year.innerHTML = new Date().getFullYear();

    /* Contact form */
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');

    function showStatus(message, kind) {
      if (!status) return;
      status.innerHTML = message;
      status.className = 'form-status is-visible ' + (kind === 'success' ? 'is-success' : 'is-error');
    }

    if (form) {
      form.onsubmit = function (e) {
        if (e && e.preventDefault) e.preventDefault();

        var name    = getValue(form, 'name');
        var email   = getValue(form, 'email');
        var phone   = getValue(form, 'phone');
        var service = getValue(form, 'service');
        var message = getValue(form, 'message');

        if (!name || !email || !message) {
          showStatus('Vul a.u.b. je naam, e-mailadres en bericht in.', 'error');
          return false;
        }
        if (!isValidEmail(email)) {
          showStatus('Vul een geldig e-mailadres in.', 'error');
          return false;
        }

        var subject = 'Nieuw contactbericht via website';
        if (service) subject += ' \u2014 ' + service;

        var body = 'Naam: ' + name + '\n';
        body += 'E-mail: ' + email + '\n';
        if (phone)   body += 'Telefoon: ' + phone + '\n';
        if (service) body += 'Dienst: ' + service + '\n';
        body += '\nBericht:\n' + message + '\n';

        var mailto = 'mailto:claudia.spruyt@outlook.be'
          + '?subject=' + encodeURIComponent(subject)
          + '&body='    + encodeURIComponent(body);

        showStatus('Je e-mailprogramma wordt geopend met je bericht. Bedankt voor je bericht!', 'success');

        try {
          window.location.href = mailto;
        } catch (err) {
          showStatus('Kon je e-mailprogramma niet openen. Stuur je bericht rechtstreeks naar claudia.spruyt@outlook.be.', 'error');
        }
        return false;
      };
    }
  });
})();
