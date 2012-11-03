// Listify module
var Listify = {};

(function($) {

Listify.show = function(url) {
  var $el = $('.page.view');
  switchView('view');
  var app = new Listify.App({
    url: url,
    el: $el
  });
};

Listify.App = function(options) {

var my = {
  options: options,
  dataStore: null
};
my.$el = $(options.el);

my.initialize = function($el) {
  my.$el.html(my.template);
  recline.Backend.GDocs.fetch({url: my.options.url}).done(function(data) {
    my.metadata = data.metadata;
    my.dataStore = data;
    my.render();
  });
};

my.render = function() {
  var results = Mustache.render(templates['books'], {
    records: my.dataStore.records
  });
  my.$el.find('.results').html(results);
  my.$el.find('.total span').text(my.dataStore.records.length);
};

my.template = ' \
  <div class="listify"> \
    <div class="controls"> \
      <div class="query"> \
        <input type="text" name="q" value="" /> \
      </div> \
    </div> \
    <div class="total"><span></span> records found</div> \
    <div class="body"> \
      <div class="results"></div> \
    </div> \
  </div> \
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
    <div class="row booky"> \
    {{#records}}  \
     <div class="span5 record"> \
      <div class="cover" style="background: url(\'{{imageurl}}\') no-repeat center;"></div> \
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

my.initialize();
return my;

}

}(jQuery));


