$(document).ready(function() {
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
});

