$(document).ready(function() {
  setupGenerator();
});

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

