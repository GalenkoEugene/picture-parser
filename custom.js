$(document).ready(function () {
  const $ulrInputField = $("#url-input");
  const $searchForm = $("#search-images-form");
  const $submitButton = $('form button[type="submit"]');
  const $gallery = $("#gallery");
  const baseUrl = "https://picture-parser-api.herokuapp.com";
  const apiUrl = `${baseUrl}/api/v1/parser/`;
  const template = _.template(
    "<div class='col-lg-3 col-md-4 col-6'> \
      <a href='<%= url %>' class='d-block mb-4 h-100' target='_blank'> \
        <img class='img-fluid img-thumbnail' src='<%= url %>' alt='<%= url %>'> \
      </a> \
    </div>"
  );
  const functions = {
    wakeUpFreeHerokuDino: function () {
      $.ajax({ url: baseUrl });
    },
    onSubmitForm: function (event) {
      event.preventDefault();
      functions.getImages($ulrInputField.val());
    },
    getImages: function (requested_url) {
      $.ajax({
        url: apiUrl,
        dataType: "json",
        data: { url: requested_url },
        beforeSend: functions.onBeforeSend,
        success: functions.onSuccess,
        error: functions.onError,
        complete: functions.onComplete,
      });
    },
    onBeforeSend: function () {
      $ulrInputField.removeClass("is-invalid");
      $submitButton.prop("disabled", true);
    },
    onSuccess: function (data) {
      let urls = data.data.attributes.urls;
      if (urls.length > 0) {
        let htmlData = _.map(urls, function (url) {
          return template({ url: url });
        });
        $gallery.html(htmlData.join(""));
      } else {
        alert("There are no images on the specified resource, try another...");
      }
    },
    onError: function () {
      $ulrInputField.addClass("is-invalid");
    },
    onComplete: function () {
      $submitButton.prop("disabled", false);
    },
  };

  $searchForm.submit(functions.onSubmitForm);
  functions.wakeUpFreeHerokuDino();
});
