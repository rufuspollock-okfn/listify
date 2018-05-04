// Listify module
var Listify = {};

(function($) {

/**
  Create a Listify listing

  var listify = Listify.App({
    // element to attach to (or jquery selector for that element)
    el: #my-element
    url: google spreadsheet url
    // optional
    template: mustache template to use for rendering
  });
  */
Listify.App = function(options, initCallback) {

var my = {
  options: options,
  dataStore: null,
  queryResults: [],
  $el: $(options.el)
};

if (!my.options.template) {
  my.options.template = ' \
    <div class="booky"> \
    {{#records}} \
       <div class="record"> \
        <div class="cover" style="background: url(\'{{imageurl}}\') no-repeat center;"></div> \
        <div class="rhs"> \
          <h2><a href="{{url}}" target="_blank">{{title}}</a></h2> \
          <h3> \
            {{#author}} \
            <a href="{{authorurl}}" target="_blank">by {{author}}</a> \
            {{/author}} \
            &nbsp; \
          </h3> \
          <p class="type">{{type}}</p> \
          <p class="description" title="{{description}}">{{description}}</p> \
        </div> \
      </div> \
    {{/records}} \
   </div> \
   '
}

my.initialize = function() {
  my.$el.html(my.templateOuter);
  // bind search actions etc
  my.$el.find('.query input').keyup(function(e) {
    my.query()
  });

  // load the data
  recline.Backend.GDocs.fetch({url: my.options.url}).done(function(data) {
    my.$el.find('.loading').hide();
    my.metadata = data.metadata;
    my.metadata.url = my.options.url;
    my.dataStore = new recline.Backend.Memory.Store(data.records, data.fields);
    my.queryResults = my.dataStore.data;
    my.render();
    initCallback(null);
    $(document).trigger('listify:data:loaded');
  });
};

my.query = function() {
  var q = my.$el.find('.query input').val();
  var queryObj = {};
  if (q) {
    queryObj.q = q;
  }
  my.dataStore.query(queryObj).done(function(results) {
    my.queryResults = results.hits;
    my.render();
  });
}

my.render = function() {
  var results = Mustache.render(my.options.template, {
    records: my.queryResults
  });
  my.$el.find('.results').html(results);
  my.$el.find('.total .matching').text(my.queryResults.length);
  my.$el.find('.total .allofthem').text(my.dataStore.data.length);
};

my.templateOuter = ' \
  <div class="listify"> \
    <div class="loading"> \
      <h2> \
        Loading data <img src="https://assets.okfn.org/images/icons/ajaxload-circle.gif" alt="loading" /> \
      </h2> \
    </div> \
    <div class="controls"> \
      <div class="query"> \
        <input type="text" name="q" value="" placeholder="Filter ..." /> \
      </div> \
    </div> \
    <div class="total"><span class="matching"></span> matching (out of <span class="allofthem"></span>)</div> \
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

my.initialize();
return my;

}

}(jQuery));

// convenience utility
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

