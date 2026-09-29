/* Zo Hotel Journal — small bits of behaviour, no dependencies.

   Everything here is an enhancement. If the script never runs the page is
   still complete: the masthead stays solid, the contents rail stays hidden
   and the progress bar stays empty.

   Geometry is measured once and re-measured on resize, so the scroll
   handler only reads window.scrollY and never forces a layout. */

(function () {
  'use strict';

  var masthead = document.getElementById('masthead');
  var progress = document.getElementById('progressBar');
  var article  = document.getElementById('article');
  var cover    = document.getElementById('cover');
  var rail     = document.querySelector('.rail');

  var railLinks = Array.prototype.slice.call(document.querySelectorAll('.rail a'));
  var bleeds    = Array.prototype.slice.call(document.querySelectorAll('.cover, .figure--full'));

  var geo = null;
  var lastHeight = 0;
  var activeLink = null;

  function docTop(el) {
    var y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  }

  function measure() {
    var mast = masthead ? masthead.offsetHeight : 0;

    geo = {
      coverEnd: cover ? docTop(cover) + cover.offsetHeight - mast * 1.4 : 0,
      articleTop: article ? docTop(article) : 0,
      articleEnd: article ? docTop(article) + article.offsetHeight : 0,
      bleeds: bleeds.map(function (el) {
        var top = docTop(el);
        return { top: top, bottom: top + el.offsetHeight };
      }),
      marks: railLinks.map(function (link) {
        var el = document.querySelector(link.getAttribute('href'));
        return el ? { top: docTop(el), link: link } : null;
      }).filter(Boolean)
    };

    lastHeight = document.documentElement.scrollHeight;
  }

  function setActive(link) {
    if (link === activeLink) return;
    if (activeLink) activeLink.classList.remove('is-active');
    if (link) link.classList.add('is-active');
    activeLink = link;
  }

  function update() {
    if (!geo) return;

    // Anything that changes the page height (a late webfont, an image that
    // finally arrives) invalidates the cache.
    if (document.documentElement.scrollHeight !== lastHeight) measure();

    var y = window.scrollY;
    var vh = window.innerHeight;
    var mid = y + vh / 2;

    if (progress && geo.articleEnd > geo.articleTop) {
      var span = geo.articleEnd - geo.articleTop - vh;
      var done = span > 0 ? (y - geo.articleTop) / span : 0;
      progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, done)) + ')';
    }

    // Transparent only while the cover is still behind the bar.
    if (masthead && cover) {
      masthead.classList.toggle('is-over', y < geo.coverEnd);
    }

    if (rail) {
      // A full-bleed plate under the rail would make it unreadable.
      var blocked = geo.bleeds.some(function (b) {
        return b.top < mid + vh * 0.12 && b.bottom > mid - vh * 0.12;
      });
      var reading = mid > geo.articleTop && mid < geo.articleEnd;
      rail.classList.toggle('is-on', reading && !blocked);

      var here = null;
      for (var i = 0; i < geo.marks.length; i++) {
        if (geo.marks[i].top <= y + vh * 0.3) here = geo.marks[i].link;
      }
      setActive(here);
    }
  }

  measure();
  update();

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', function () { measure(); update(); });
  window.addEventListener('load', function () { measure(); update(); });

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
