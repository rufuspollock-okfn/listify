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
