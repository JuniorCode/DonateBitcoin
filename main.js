var currency = "USD";
var currencies = ["USD", "EUR", "GBP"];
var currency_symbols = ["$", "€", "£"];
var bitcoin_address = "1HLuGUJfLPEkpL5aUN7n5p1eRMeV6uVnnL";
var q_amount = Number(window.location.hash.substring(1).slice(0, -3));
var q_currency = window.location.hash.substr(window.location.hash.length - 3);

var focused = true;

$(window).blur(function() {
  focused = false;
});

$(window).focus(function() {
  focused = true;
});

if (q_amount !== "" && q_currency !== "") {
  $("#amount-input").val(q_amount);
  $("#currency-symbol").text(currency_symbols[currencies.indexOf(q_currency)]);

  currency = q_currency;

  updatePrice();
}

function updatePrice() {
  $.getJSON("https://api.coindesk.com/v1/bpi/currentprice.json", function(data) {
    window.btcprice = {
      "USD": data.bpi.USD.rate_float,
      "EUR": data.bpi.EUR.rate_float,
      "GBP": data.bpi.GBP.rate_float
    };
  });
}

function donate() {
  var btc = $("#amount-input").val() / btcprice[currency];
  var mbits = btc * 1000;

  if (btc > 0) {
    window.location.href = "bitcoin:" + bitcoin_address + "?amount=" + btc;

    setTimeout(function() {
      if (focused == true) {
        swal(mbits.toFixed(2) + " mBTC", bitcoin_address);
      }
    }, 250);
  } else {
    $("#amount-input").addClass("is-invalid");

    $("#amount-input").one("focus", function() {
      $("#amount-input").removeClass("is-invalid");
    });
  }
}

function toggleCurrency() {
  var new_currency = currencies.indexOf(currency) + 1;

  if (new_currency >= currencies.length) {
    new_currency = 0;
  }

  currency = currencies[new_currency];

  $("#currency-symbol").text(currency_symbols[new_currency]);
}

updatePrice();
setInterval(updatePrice, 10000);

$("#currency-symbol").bind("click", toggleCurrency);
$("#donate-button").bind("click", donate);
