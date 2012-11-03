$(document).ready(function() {
  var qs = window.location.search;
  var parsed = parseQueryString(qs);
  if (parsed.url) {
    Listify.show(parsed.url);
  } else {
    doHomePage();
  }
});

var switchView = function(name, title) {
  $('.page').hide();
  $('.page.' + name).show();
}

var doHomePage = function() {
  setupGenerator();
  switchView('home');
}

var setupGenerator = function() {
  $('.gdocs-url').keyup(function(e) {
    var url = $('.gdocs-url').val();
    var $textarea = $('.copy-this').val(url);
  });
};

var demoShow = function() {
  var dataset = new recline.Model.Dataset({
    url: gdocsSourceUrl,
    backend: 'gdocs'
  });
  dataset.fetch().done(function(data) {
    var template = $('#booktpl').html();
    var html = Mustache.to_html(template, {
      resources: dataset.records.toJSON()
    });
    $('.js-my-listing').html(html);
  });
};


// --------------------------------------------------------
// ## Utilities

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
