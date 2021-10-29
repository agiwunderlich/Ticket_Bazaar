var RESTURL = "http://localhost:3000";
function startEventsPage() {
  $.getJSON(RESTURL + "/events").done(function(eventList) {
    showEventList(eventList);
  });
}

// render events
function showEventList(eventList) {
  var template = $("#eventTemplate");
  var parentElement = $("#event-render");
  parentElement.html("");
  $.each(eventList, function(index, event) {
    var eventElement = template.clone();
    eventElement.find("a").attr("href", "tickets.html?event=" + event.id);
    eventElement.find("h4").text(event.title);
    eventElement.find("span").text(event.date);
    eventElement.find("img").attr("src", event.image);
    eventElement.data("event", event);
    eventElement.on("click", function(){
      sessionStorage.eventId = $(this).data("event").id;
    });
    parentElement.append(eventElement);
  });
}

// filter tickets for genre
function filterEventList() {
  var buttonExhibition = $("#buttonExhibition");

  $(buttonExhibition).click(function() {});
}

function openNewEventModal() {
  $("#newEventModal").modal("show");
}

// file preview
$("input#image").on("change", function(){
  if (this.files[0].type.indexOf("image") < 0) {
    return false;
  } 
  var reader = new FileReader();
  reader.addEventListener("load", function(){
   $(".preview-holder img")[0].src = reader.result;
  }, false);

  if (this.files[0]){
    reader.readAsDataURL(this.files[0]);
  }
});

startEventsPage();

// show alerts after submit
function showAlert(beforeElem, type, text) {
  var formAlertId = "form-alert";

  $("#" + formAlertId).remove();

  $(
    '<div class="alert alert-' +
      type +
      '" id="' +
      formAlertId +
      '" role="alert">' +
      text +
      "</div>"
  )
    .insertBefore(beforeElem)
    .fadeIn();

  setTimeout(function() {
    $("#" + formAlertId).fadeOut(function() {
      $(this).remove();
    });
  }, 3000);
}

// jQuery plugin for send form data
$.fn.sendForm = function() {
  var form = $(this);
  var action = form.attr("action");
  var method = form.attr("method") || "post";
  var callBack = form.attr("callBack");

  function checkFormItem(input) {
    input = $(input);
    if (input.attr("required") && input.val() == "") {
      input.parents(".form-group").addClass("invalid");
      return false;
    } else {
      input.parents(".form-group").removeClass("invalid");
    }
    return true;
  }

  form.on("submit", function(ev) {
    ev.preventDefault();
    var formData = {};
    var formIsValid = [];

    var newEventFormNativeElem = form[0];

    $(this)
      .find("input, select")
      .each(function(index, input) {
        formData[input.name] = input.value;
        formIsValid.push(checkFormItem(input));
      });

    if (formIsValid.indexOf(false) > -1) {
      return;
    }

    $.ajax({
      type: method.toUpperCase(),
      url: action,
      data: formData,
      dataType: "json"
    }).done(function(resp) {
      console.log(resp);
      if (window[callBack]) {
        window[callBack]();
      }
      newEventFormNativeElem.reset();

      showAlert(form, "dark", "You successfully saved your event!");
    });
  });
  return this;
};

$("#newEventForm").sendForm();
