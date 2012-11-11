$(document).ready(function() {
  var qs = window.location.search;
  var parsed = parseQueryString(qs);
  if (parsed.url) {
    var $el = $('.page.view');
    var app = new Listify.App({
      url: parsed.url,
      el: $el
    });
    $(document).bind('listify:data:loaded', function() {
      document.title = app.metadata.spreadsheetTitle + ' - Listify';
      $('.page-header h1').text(app.metadata.spreadsheetTitle);
      $('footer .source-url').attr('href', app.metadata.url);
    });
  }
});

