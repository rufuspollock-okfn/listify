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

var Listify = function($) {
var my = {};

my.show = function(url) {
  var $el = $('.page.view');
  switchView('view');
  recline.Backend.GDocs.fetch({url: url}).done(function(data) {
    // var results = _.map(data.records, my.renderGeneric).join('\n');
    var results = Mustache.render(templates['books'], {
      records: data.records
    });
    var html = Mustache.render(my.template, {
      results: results,
      total: data.records.length
    });
    $el.html(html);
  });

};

my.template = ' \
  <div class="controls"> \
    <div class="query-here"></div> \
  </div> \
  <div class="total"><h2><span>{{total}}</span> records found</h2></div> \
  <div class="body"> \
    <div class="sidebar"></div> \
    <div class="results"> \
      {{{results}}} \
    </div> \
  </div> \
  <div style="clear: both;"></div> \
';

my.renderGeneric = function(record) {
  var template = '<div class="record"> \
    <ul> \
     {{#data}} \
     <li>{{key}}: {{value}}</li> \
     {{/data}} \
   </ul> \
  </div> \
  ';
  var data = _.map(_.keys(record), function(key) {
    return { key: key, value: record[key] };
  });
  return Mustache.render(template, {
    data: data
  });
}

var templates = {
  books: ' \
    <div class="row"> \
    {{#records}}  \
     <div class="span4 booksection"> \
      <div id="cover" style="background:black url(\'{{imageurl}}\') no-repeat center;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;"> \
      </div> \
      <h2>{{title}}</h2> \
      <h3><a href="{{authorurl}}" target="_blank">{{author}}</a></h3> \
      <p class="level">{{type}}</p> \
      <p class="description">{{description}}</p> \
      <p><a class="btn" href="{{url}}">OPEN</a></p> \
    </div> \
    {{/records}} \
   </div> \
   '
}

return my;
}(jQuery);

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
