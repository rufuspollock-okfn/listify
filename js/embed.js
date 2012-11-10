$(document).ready(function() {
  var qs = window.location.search;
  var parsed = parseQueryString(qs);
  if (parsed.url) {
    var $el = $('.page.view');
    var app = new Listify.App({
      url: parsed.url,
      el: $el
    });
  }
});

parseQueryString = function(q) {
  if (!q) {
    return {};
  }
  var urlParams = {},
    e, d = function (s) {
      return unescape(s.replace(/\+/g, " "));
    },
    r = /([^&=]+)=?([^&]*)/g;

  if (q && q.length && q[0] === '?') {
    q = q.slice(1);
  }
  while (e = r.exec(q)) {
    // TODO: have values be array as query string allow repetition of keys
    urlParams[d(e[1])] = d(e[2]);
  }
  return urlParams;
};
