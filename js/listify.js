// Listify module
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


