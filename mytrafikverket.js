// Parameters
var personalNum = "personalNum"; // (yyyymmdd-xxx)
var startDate = "2021-11-01";
var currentBooking = "2021-12-01";
var pause = 3000; // ms (5min = 300000; 3min = 180000)
var retryCount = 1000; // ms
var retry = 0;


var checkBooking = function () {
  // https://fp.trafikverket.se/Boka/occasion-bundles
  $.post('https://fp.trafikverket.se/Boka/occasion-bundles', {
    'bookingSession': {
      'socialSecurityNumber': personalNum,
      'licenceId': 5,
      'bookingModeId': 0,
      'ignoreDebt': false,
      'ignoreBookingHindrance': false,
      'paymentIsActive': false,
      'paymentReference': null,
      'paymentUrl': null,
      'rescheduleTypeId': 0,
      'examinationTypeId': 0
    },
    'occasionBundleQuery': {
      'startDate': startDate,
      'locationId': 1000019, //1000019 Farsta
      'languageId': 4,
      'vehicleTypeId': 4,
      'tachographTypeId': 1,
      'occasionChoiceId': 1,
      'examinationTypeId': 12
    }
  }).done(function (data) {
    $.each(data, function (index, item) {
      console.log(item);

      if (item.bundles !== undefined) {
        var nextAvailableDate = item.bundles[0].occasions[0].date;
        var nextAvailableTime = item.bundles[0].occasions[0].time;

        console.log('Cuurent: ' + currentBooking);
        console.log('Next: ' + nextAvailableDate);

        if (Date.parse(nextAvailableDate) < Date.parse(currentBooking)) {
          notifyMe('!!! TIME TO REBOOK = ' + nextAvailableDate + ' : ' + nextAvailableTime + ' !!!');

          // https://soundbible.com/grab.php?id=1746&type=mp3
          var audio = new Audio('https://soundbible.com/grab.php?id=1656&type=mp3'); // fire alert
          audio.play();

        } else {
          //var audio = new Audio('https://soundbible.com/grab.php?id=1815&type=mp3'); // tone
          //var audio = new Audio('https://soundbible.com/grab.php?id=1682&type=mp3'); // robot bleep
          //audio.play();
          console.log('Next Available: ' + nextAvailableDate);
        }
      }
  });
  });
}

function notifyMe(msg) {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
  }
  else if (Notification.permission === 'granted') {
    var notification = new Notification(msg);
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        var notification = new Notification(msg);
      }
    });
  }
}


//initial call
checkBooking();

// do the loop
var loop = setInterval(function () {
  checkBooking();
  if (retry >= retryCount) {
    console.log('Done!');
    clearInterval(loop);
  }
  retry++;
  console.log('Retry Count = ' + retry + ' (' + new Date() + ')');
}, pause);
