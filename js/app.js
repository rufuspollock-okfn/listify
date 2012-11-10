$(document).ready(function() {
  doHomePage();
});

var doHomePage = function() {
  setupGenerator();
}

var setupGenerator = function() {
  $('.gdocs-url').keyup(function(e) {
    var url = $('.gdocs-url').val();
    var embedUrl = window.location.href.replace('/index.html', '') + 'embed.html?url=' + url;
    var $iframe = '<iframe width="100%" height="500px" frameborder="0" src="' + embedUrl + '"></iframe>';
    $('.copy-this').val($iframe);
    console.log($iframe);
    $('.preview').html($iframe);
  });

  // prevent form submissions ...
  $('.generator').submit(function(e) {
    e.preventDefault();
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

