// page change animation
$("ul.nav li a").click(function(event) {
  event.preventDefault();
  var link = $(this);

  $(document.body).animate(
    {
      opacity: "0"
    },
    600,
    function() {
      document.location = link.attr("href");
    }
  );
});

// Tickets array
let tickets = [
  {
    id: "001",
    event: "Verdi's Requiem",
    genre: "Ballet",
    date: "03-12-2018",
    location: "Royal Ballet London",
    seller: "John Smith",
    quantity: 3,
    link: "<a href='#'><i class='fas fa-angle-double-right'></i></a>"
  },
  {
    id: "002",
    event: "Impressionists: From Manet to Cézanne",
    genre: "Exhibition",
    date: "20-01-2019",
    location: "National Gallery London",
    seller: "Robert Williams",
    quantity: 5,
    link: "<a href='#'><i class='fas fa-angle-double-right'></i></a>"
  },
  {
    id: "003",
    event: "Florence and the Machine",
    genre: "Concert",
    date: "21-01-2019",
    location: "Royal Albert Hall",
    seller: "Stewe King",
    quantity: 8,
    link: "<a href='#'><i class='fas fa-angle-double-right'></i></a>"
  },
  {
    id: "004",
    event: "Death of a Salesman",
    genre: "Theatre",
    date: "16-11-2018",
    location: "The Old Vic Theatre",
    seller: "Kate Mid",
    quantity: 6,
    link: "<a href='#'><i class='fas fa-angle-double-right'></i></a>"
  },
  {
    id: "005",
    event: "The Unknown Soldier / Infra / Symphony in C",
    genre: "Ballet",
    date: "29-11-2018",
    location: "Royal Ballet London",
    seller: "Peter Dinklage",
    quantity: 2,
    link: "<a href='#'><i class='fas fa-angle-double-right'></i></a>"
  },
  {
    id: "006",
    event: "Björk",
    genre: "Concert",
    date: "04-12-2018",
    location: "Royal Albert Hall",
    seller: "Christine Sloane",
    quantity: 12,
    link: "<a href='#'><i class='fas fa-angle-double-right'></i></a>"
  },
  {
    id: "007",
    event: "Ed Ruscha: Course of Empire",
    genre: "Exhibition",
    date: "12-12-2018",
    location: "National Gallery London",
    seller: "Sarah Stanley",
    quantity: 4,
    link: "<a href='#'><i class='fas fa-angle-double-right'></i></a>"
  }
];

// Generate ticket table
function fillTicketsTable(currentTickets) {
  let ticketTable = $("table.table.table-hover tbody");
  ticketTable.html("");

  currentTickets = currentTickets || tickets;
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
    ticketTable.append(row);
  });
}
fillTicketsTable();

// search tickets
// $("#searchInput").on("keyup", function(ev) {
//   $.each($(".ticketvalue"), function(i, e) {
//     var elem = $(e);
//     var search = ev.target.value.toLowerCase();
//     var content = elem.html().toLowerCase();
//     if (content.indexOf(search) == -1) {
//       elem.parents(".parentTR").hide();
//     } else {
//       elem.parents(".parentTR").show();
//     }
//   });
// });

// ticket filter
$("input#searchInput").on("keyup", filterTickets);
function filterTickets() {
  var currentValue = $(this)
    .val()
    .toLowerCase();
  var filteredTickets = [];
  if (currentValue == "") {
    filteredTickets = tickets;
  } else {
    filteredTickets = tickets.filter(function(item) {
      var done = false;
      for (var key in item) {
        if (
          item[key]
            .toString()
            .toLowerCase()
            .indexOf(currentValue) > -1
        ) {
          done = true;
        }
      }
      return done;
    });
  }
  fillTicketsTable(filteredTickets);
}

// Sorting tickets
let thead = $("table.table-hover thead th[data-key]");

thead.on("click", sortTickets);
function sortTickets() {

  let th = $(this);

  $.each(thead, function(index, elem) {
    var currentTh = $(elem);
    if (th.data("key") != currentTh.data("key")) {
      currentTh.removeClass("up").removeClass("down");
    }
  });

  let key = th.data("key");
  let sortedTickets = tickets.map(function(item) {
    return item;
  });

  if (th.hasClass("up")) {
    th.removeClass("up").addClass("down");
  } else {
    th.removeClass("down").addClass("up");
  }

  sortedTickets.sort(function(a, b) {
    if (th.hasClass("up")) {
      return a[key].toString().localeCompare(b[key].toString());
    } else {
      return b[key].toString().localeCompare(a[key].toString());
    }
  });
  fillTicketsTable(sortedTickets);
}
