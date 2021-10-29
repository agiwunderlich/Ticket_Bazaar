var pContainerHeight = $(".festival").height();

$(window).scroll(function() {
  var wScroll = $(this).scrollTop();

  // Parallax Header
  if (wScroll <= pContainerHeight) {
    $(".logo").css({
      transform: "translate(0px, " + wScroll / 10 + "%)"
    });

    $(".backblurred").css({
      transform: "translate(0px, " + wScroll / 20 + "%)"
    });

    $(".foreblurred").css({
      transform: "translate(0px, -" + wScroll / 30 + "%)"
    });
  }

  // Landing Elements
  if (wScroll > $(".tickets").offset().top - $(window).height() / 1.2) {
    $(".tickets figure").each(function(i) {
      setTimeout(function() {
        $(".tickets figure")
          .eq(i)
          .addClass("is-showing");
      }, 700 * Math.exp(i * 0.14) - 700);
    });
  }

  // Promoscope
  if (wScroll > $(".periscope").offset().top - $(window).height()) {
    $(".periscope").css({
      "background-position":
        "center " + (wScroll - $(".periscope").offset().top) + "px"
    });

    var opacity =
      (wScroll - $(".periscope").offset().top + 400) / (wScroll / 5);

    $(".window-tint").css({ opacity: opacity });
  }

  // Floating Elements
  if (wScroll > $(".blog-posts").offset().top - $(window).height()) {
    var offset = Math.min(
      0,
      wScroll - $(".blog-posts").offset().top + $(window).height() - 500
    ).toFixed();

    $(".post-1").css({
      transform: "translate(" + offset + "px, " + Math.abs(offset * 0.2) + "px)"
    });

    $(".post-3").css({
      transform:
        "translate(" +
        Math.abs(offset) +
        "px, " +
        Math.abs(offset * 0.2) +
        "px)"
    });
  }
});

// Ticket Bazaar Title

anime
  .timeline({ loop: true })
  .add({
    targets: ".ml5 .line",
    opacity: [0.5, 1],
    scaleX: [0, 1],
    easing: "easeInOutExpo",
    duration: 700
  })
  .add({
    targets: ".ml5 .line",
    duration: 600,
    easing: "easeOutExpo",
    translateY: function(e, i, l) {
      var offset = -0.625 + 0.625 * 2 * i;
      return offset + "em";
    }
  })
  .add({
    targets: ".ml5 .ampersand",
    opacity: [0, 1],
    scaleY: [0.5, 1],
    easing: "easeOutExpo",
    duration: 600,
    offset: "-=600"
  })
  .add({
    targets: ".ml5 .letters-left",
    opacity: [0, 1],
    translateX: ["0.5em", 0],
    easing: "easeOutExpo",
    duration: 600,
    offset: "-=300"
  })
  .add({
    targets: ".ml5 .letters-right",
    opacity: [0, 1],
    translateX: ["-0.5em", 0],
    easing: "easeOutExpo",
    duration: 600,
    offset: "-=600"
  })
  .add({
    targets: ".ml5",
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

// lead title arts and festivals
// Wrap every letter in a span
$(".ml12").each(function() {
  $(this).html(
    $(this)
      .text()
      .replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>")
  );
});

anime
  .timeline({ loop: true })
  .add({
    targets: ".ml12 .letter",
    translateX: [40, 0],
    translateZ: 0,
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 1200,
    delay: function(el, i) {
      return 500 + 30 * i;
    }
  })
  .add({
    targets: ".ml12 .letter",
    translateX: [0, -30],
    opacity: [1, 0],
    easing: "easeInExpo",
    duration: 1100,
    delay: function(el, i) {
      return 100 + 30 * i;
    }
  });

// NAVBAR

var navbarHeight = $(".navbar").height();

$(window).scroll(function() {
  // var navbarColor = "62,195,246";//color attr for rgba
  var navbarColor = "0,0,0";
  var smallLogoHeight = $(".small-logo").height();
  // var bigLogoHeight = $('.big-logo').height();

  var smallLogoEndPos = 0;
  var smallSpeed = smallLogoHeight / pContainerHeight;
  var smallSpeedP = smallLogoHeight / 50;

  var ySmall = $(window).scrollTop() * smallSpeed;
  var ySmallP = $(window).scrollTop() * smallSpeedP;

  var smallPadding = pContainerHeight - ySmallP;
  if (smallPadding > navbarHeight) {
    smallPadding = navbarHeight;
  }
  if (smallPadding < smallLogoEndPos) {
    smallPadding = smallLogoEndPos;
  }
  if (smallPadding < 0) {
    smallPadding = 0;
  }

  $(".small-logo-container ").css({ "padding-top": smallPadding });

  var navOpacity = ySmall / smallLogoHeight;
  if (navOpacity > 1) {
    navOpacity = 1;
  }
  if (navOpacity <= 0) {
    navOpacity = 0;
  }
  var navBackColor = "rgba(" + navbarColor + "," + navOpacity + ")";
  $(".navbar").css({ "background-color": navBackColor });

  var shadowOpacity = navOpacity * 0.4;
  if (ySmall > 1) {
    $(".navbar").css({
      "box-shadow": "0 2px 3px rgba(0,0,0," + shadowOpacity + ")"
    });
  } else {
    $(".navbar").css({ "box-shadow": "none" });
  }
});

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

$(document).ready(function() {
  const validClass = "is-valid";
  const invalidClass = "is-invalid";

  // collect elements
  let $signUpBtn = $("#signUpBtn");
  let $tcCheckbox = $("#tcCheckbox");
  let $emailAddress = $("#emailAddress");
  let $password = $("#password");
  let $passwordAgain = $("#passwordAgain");
  let $invalidFieldList = $("div.signUpAlert ul");
  let $signUpAlert = $("div.signUpAlert");
  let $successAlert = $("div.successAlertBox");

  // react to button-click
  $signUpBtn.click(function(event) {
    event.preventDefault();

    let invalidFields = [];
    $invalidFieldList.html("");

    // validate email address
    function validateEmail($emailAddress) {
      let emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailRegExp.test($emailAddress);
    }

    let emailAddress = $emailAddress.val();
    if (emailAddress.length == 0 || !validateEmail(emailAddress)) {
      // invalid
      invalidFields.push("Invalid Email Address");
      $emailAddress.addClass(invalidClass);
      $emailAddress.removeClass(validClass);
    } else {
      // valid
      $emailAddress.addClass(validClass);
      $emailAddress.removeClass(invalidClass);
    }

    // validate password
    let password = $password.val();
    if (password.length <= 5) {
      // invalid
      invalidFields.push("Invalid Password");
      $password.addClass(invalidClass);
      $password.removeClass(validClass);
    } else {
      // valid
      $password.addClass(validClass);
      $password.removeClass(invalidClass);
    }

    // validate passwordAgain
    let passwordAgain = $passwordAgain.val();
    if (passwordAgain != password || passwordAgain.length <= 5) {
      // invalid
      invalidFields.push("Invalid Password Verification");
      $passwordAgain.addClass(invalidClass);
      $passwordAgain.removeClass(validClass);
    } else {
      // valid
      $passwordAgain.addClass(validClass);
      $passwordAgain.removeClass(invalidClass);
    }

    // validate terms and conditions
    let isChecked = $tcCheckbox.prop("checked");
    if (!isChecked) {
      // invalid
      invalidFields.push("Please accept Terms & Conditions");
      $tcCheckbox.addClass(invalidClass);
      $tcCheckbox.removeClass(validClass);
    } else {
      // valid
      // $tcCheckbox.addClass(validClass);
      $tcCheckbox.removeClass(invalidClass);
    }

    // valid or invalid
    if (invalidFields.length == 0) {
      // success alert
      $successAlert.show();
      $signUpAlert.hide();
    } else {
      $signUpAlert.show();

      // list invalidfields
      $.each(invalidFields, function(index, field) {
        $invalidFieldList.append("<li>" + field + "</li>");
      });
    }
  });
});

