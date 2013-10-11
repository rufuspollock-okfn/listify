$(document).ready(function() {
  setupGenerator();
  setupGdocsPicker();

  $('.use-it a').click(function(e) {
    $('html,body').animate({
      scrollTop: $('#make-one').offset().top
      },
      'slow'
    );
  });
});

var setupGenerator = function() {
  $('.gdocs-url').keyup(function(e) {
    var url = $('.gdocs-url').val();
    onGdocsUrlChange(url);
  });

  // prevent form submissions ...
  $('.generator').submit(function(e) {
    e.preventDefault();
  });
};

var onGdocsUrlChange = function(url) {
  // may have come from gdocs picker ...
  $('.gdocs-url').val(url);
  // window.location.origin does not exist in firefox
  // var base = window.location.origin + window.location.pathname;
  // make sure we strip any query parameters or #hash
  var base = [location.protocol, '//', location.host, location.pathname].join('');
  base=base.replace("index.html","");  
  var options = '?url=' + encodeURIComponent(url);
  var embedUrl = base + 'embed.html' + options;
  var viewUrl = base + 'view/' + options;
  var $iframe = '<iframe width="100%" height="500px" frameborder="0" src="' + embedUrl + '"></iframe>';
  $('.copy-this').val($iframe);
  $('.preview').html($iframe);
  $('.view-url').attr('href', viewUrl);
}

var setupGdocsPicker = function() {
  $('.search-gdocs').click(function(e) {
    e.preventDefault();
    // Create and render a Picker object for searching images.
    var picker = new google.picker.PickerBuilder()
      .disableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .addView(google.picker.ViewId.SPREADSHEETS )
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  });

  // A simple callback implementation.
  function pickerCallback(data) {
    var url = 'nothing';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
      var doc = data[google.picker.Response.DOCUMENTS][0];
      url = doc[google.picker.Document.URL];
      onGdocsUrlChange(url);
    }
  }
}
