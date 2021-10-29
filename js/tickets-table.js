$(document).ready(function() {
  var RESTURL = "http://localhost:3000";
  var searchString = "";
  var sortKey = "";
  var sortDirection = "";
  var ticketListTable = $("#ticket-list");

  // pagination
  var pageLimit = 5;
  var currentPage = 1;
  var maxPage = 0;
  var totalCount = 0;

  // render table from javscript object
  function fillTicketsTable(currentTickets) {
    var tbody = $("#ticket-list tbody");

    tbody.html("");

    $.each(currentTickets, function(index, ticket) {
      let row = $(".template .parentTR").clone();
      row
        .find("td")
        .eq(0)
        .html(ticket.id);
      row
        .find("th")
        .eq(0)
        .html(ticket.event);
      row
        .find("td")
        .eq(1)
        .html(ticket.genre);
      row
        .find("td")
        .eq(2)
        .html(ticket.date);
      row
        .find("td")
        .eq(3)
        .html(ticket.location);
      row
        .find("td")
        .eq(4)
        .html(ticket.seller);
      row
        .find("td")
        .eq(5)
        .html(ticket.quantity);
      row
        .find("td")
        .eq(6)
        .html(ticket.link);
      tbody.append(row);
    });
  }

  // load list with AJAX
  function renderTicketList() {
    var urlParams = [];
    var url = RESTURL + "/tickets";
    var reg = /\?.*event\=([0-9]*)/;
    var eventId = 0;

    urlParams.push("_limit=" + pageLimit);
    urlParams.push("_page=" + currentPage);

    // standard text search
    if (searchString.length > 0) {
      urlParams.push("q=" + searchString); // q means the search
    }

    if (sortKey.length > 0) {
      urlParams.push("_sort=" + sortKey);
      urlParams.push("_order=" + sortDirection);
    }

    // add eventId
    eventId = window.location.href.match(reg)[1];
    urlParams.push("eventId=" + sessionStorage.eventId);

    // if there's an url parameter then concatenate
    if (urlParams.length > 0) {
      url = url + "?" + urlParams.join("&");
    }

    $.getJSON(url).done(function(ticketList, textStatus, request) {
      var oldMaxPage = maxPage;
      totalCount = request.getResponseHeader("X-Total-Count");
      maxPage = totalCount / pageLimit;
      if (maxPage % 1 !== 0) {
        maxPage = parseInt(maxPage) + 1;
      }
      if (oldMaxPage != maxPage) {
        renderTicketTablePaginator();
      }

      refreshPaginate();
      fillTicketsTable(ticketList);
    });
  }

  function refreshPaginate() {
    var paginatorElem = $("#ticket-list-paginator");

    var firstElem = paginatorElem.find("ul > li:first-child"); // first-child is << arrow
    var lastElem = paginatorElem.find("ul > li:last-child"); // last-child is >> arrow

    if (currentPage == 1) {
      // disable first arrow
      firstElem.addClass("disabled");

      // enable last arrow
      lastElem.removeClass("disabled");
    } else if (currentPage == maxPage) {
      firstElem.removeClass("disabled");
      lastElem.addClass("disabled");
    } else {
      // we are in the middle somewhere
      firstElem.removeClass("disabled");
      lastElem.removeClass("disabled");
    }

    // which element is active
    var currentActiveElem = paginatorElem.find("ul > li.active");
    if (currentActiveElem.length > 0) {
      currentActiveElem.removeClass("active");
    }

    paginatorElem
      .find("ul > li")
      .eq(currentPage)
      .addClass("active");
  }

  function renderTicketTablePaginator() {
    var paginatorULElem = $("#ticket-list-paginator > ul");
    // regenerate paginator, so we have to clear it first
    paginatorULElem.html("");

    var html = [];
    // prev arrow html
    html.push(
      '<li class="page-item"><a class="page-link" href="#" aria-label="Previous" data-paginate-size="prev"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>'
    );

    for (var i = 1; i <= maxPage; i++) {
      // page numbers html
      html.push(
        ' <li class="page-item"><a class="page-link" href="#" data-paginate-size="' +
          i +
          '">' +
          i +
          "</a></li>"
      );
    }

    // next arrow html
    html.push(
      '<li class="page-item"><a class="page-link" href="#" aria-label="Next" data-paginate-size="next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span></a></li>'
    );
    // join html array
    paginatorULElem.html(html.join(""));

    bindPaginatorEvents();
  }

  function bindPaginatorEvents() {
    // paginator buttons
    $("#ticket-list-paginator > ul > li > a").click(function(event) {
      var oldCurrentPage = currentPage;
      event.preventDefault();

      var paginateSize = $(this).data("paginate-size");
      if (paginateSize == "prev") {
        // if clicked on prev button, the currentPage will be reduced
        currentPage--;
      } else if (paginateSize == "next") {
        currentPage++;
      } else {
        currentPage = parseInt(paginateSize);
      }
      if (oldCurrentPage != currentPage) {
        renderTicketList();
      }
    });
  }

  // ticket filter
  $("input#searchInput").on("keyup", function() {
    searchString = $(this).val();
    renderTicketList();
  });

  // Sorting tickets
  ticketListTable.find("thead th[data-key]").on("click", function() {
    var th = $(this);

    $.each(ticketListTable.find("thead th[data-key]"), function(index, elem) {
      var currentTh = $(elem);
      if (th.data("key") != currentTh.data("key")) {
        currentTh.removeClass("up").removeClass("down");
      }
    });

    sortKey = th.data("key");

    if (th.hasClass("up")) {
      sortDirection = "desc";
      th.removeClass("up").addClass("down");
    } else {
      sortDirection = "asc";
      th.removeClass("down").addClass("up");
    }

    renderTicketList();
  });

  // The app starts here
  renderTicketList();

  ticketListTable.on("ticketDataChanged", function() {
    renderTicketList();
});

  ////////////////////////
  // NEW TICKET SCRIPTS //
  ////////////////////////

  // server URL
  //var RESTURL = "http://localhost:3000";

  // disable input while server is slow
  function disableInputs(inputs) {
    inputs.prop("disabled", true);
  }

  function enableInputs(inputs) {
    inputs.prop("disabled", false);
  }

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

  // function refreshTicketList() {
  //   $.getJSON(RESTURL + "/tickets?_sort=id&_order=desc").done(function(
  //     ticketList
  //   ) {
  //     $("#ticket-list > pre")[0].innerText = JSON.stringify(
  //       ticketList,
  //       null,
  //       2
  //     );
  //   });
  // }

  //////////////////
  // SUBMIT FORM //
  /////////////////

  $(document).ready(function() {
    // load ticket list
    renderTicketList();

    window.currentEvent = null;

    function renderTicketList() {
      $("#ticket-list").trigger("ticketDataChanged");
  }

    function setEventDetails(event) {
      $("#event").val(event.title);
      $("#dateofevent").val(event.date);
      $("#genre").val(event.genre);
      $("#location").val(event.location);
    }

    // choose existing events from select
    $.getJSON("http://localhost:3000/events").done(function(events) {
      var select = $("#eventId").on("change", function(ev) {
        var event = $(this)
          .find("option:selected")
          .data("event");
        setEventDetails(event);
      });
     
      $.each(events, function(index, event) {
        var option = $("<option />");
        option.data("event", event);
        option.val(event.id);
        option.text(event.title);
        if (event.id == sessionStorage.eventId) {
          option.prop("selected", true);
          window.currentEvent = event;
          setEventDetails(event);
        }
        select.append(option);
      });
    });

    $("#new-ticket-form").submit(function(event) {
      event.preventDefault();

      var newTicketFormElem = $(this);
      var newTicketFormNativeElem = newTicketFormElem[0];

      // check html5 validator
      if (newTicketFormNativeElem.checkValidity() == true) {
        // the form is valid
        var serializedFormArray = newTicketFormElem.serializeArray();
        var data = {};

        $(serializedFormArray).each(function(index, elem) {
          data[elem["name"]] = elem["value"];
        });

        var inputs = $("input", newTicketFormElem); // = $("#new-ticket-form input")
        disableInputs(inputs);

        // AJAX
        $.ajax({
          type: "POST",
          url: RESTURL + "/tickets",
          data: data,
          dataType: "json"
        })
          .done(function(returnData) {
            console.log("returnData => ", returnData);
            newTicketFormElem.removeClass("was-validated");

            // reset form after successful submit
            newTicketFormNativeElem.reset();
            enableInputs(inputs);

            showAlert(
              newTicketFormElem,
              "dark",
              "You successfully saved your ticket!"
            );
            // refreshTicketList();
          })
          .fail(function() {
            alert("Failed to reach server");
            enableInputs(inputs);
            showAlert(
              newTicketFormElem,
              "warning",
              "Failed to reach the server"
            );
          });
      }

      if (newTicketFormElem.hasClass("was-validated") == false) {
        newTicketFormElem.addClass("was-validated");
      }
    });
  });
});
