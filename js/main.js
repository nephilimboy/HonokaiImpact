var timePicker;

jQuery(document).ready(function () {

//Preloader active
    jQuery(window).load(function () {
        jQuery(".loaded").fadeOut();
        jQuery(".preloader").delay(1000).fadeOut("slow");
    });

// sidenav navbar nav
    jQuery(".button-collapse").sideNav();


// localScroll js
    jQuery(".navbar-desktop").localScroll();

// Counter 
    jQuery('.statistic-counter').counterUp({
        delay: 10,
        time: 2000
    });

// Mixitube
    jQuery('#mixcontent').mixItUp({
        animation: {
            animateResizeContainer: false,
            effects: 'fade rotateX(-45deg) translateY(-10%)'
        }
    });

// MagnificPopup
    jQuery('.gallery-img').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        },
    });

// Home slider
    jQuery('.slider').slider({full_width: true});

// client slider
    jQuery('.carousel').carousel();

// accordion

    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function () {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }

// nav menu small menu
    jQuery(document).on("scroll", function () {
        if ($(document).scrollTop() > 120) {
            $("nav").addClass("small");
        } else {
            $("nav").removeClass("small");
        }
    });

    var options = {
        // now: "-:-", //hh:mm 24 hour format only, defaults to current time
        twentyFour: true, //Display 24 hour format, defaults to false
        close: 'wickedpicker__close', //The close class selector to use, for custom CSS
        hoverState: 'hover-state', //The hover state class to use, for custom CSS
        title: 'Timepicker', //The Wickedpicker's title,
        showSeconds: false, //Whether or not to show seconds,
        secondsInterval: 1, //Change interval for seconds, defaults to 1
        minutesInterval: 1, //Change interval for minutes, defaults to 1
        beforeShow: null, //A function to be called before the Wickedpicker is shown
        show: null, //A function to be called when the Wickedpicker is shown
        clearable: false, //Make the picker's input clearable (has clickable "x")
    };
    timePicker = $('.timepicker').wickedpicker(options);
    $('.timepicker').val('');

    initTimeZoneSelector();

    setDateLocal();
});

function initTimeZoneSelector() {
    const selectorOptions = moment.tz.names()
        .reduce(function (memo, tz) {
            memo.push({
                name: tz,
                offset: moment.tz(tz).utcOffset()
            });

            return memo;
        }, [])
        .sort(function (a, b) {
            return a.offset - b.offset
        })
        .reduce(function (memo, tz) {
            const timezone = tz.offset ? moment.tz(tz.name).format('Z') : '';

            return memo.concat(`<option style="color: black" value="${tz.name}">(GMT${timezone}) ${tz.name}</option>`);
            // return memo.concat(`<option style="color: black" value="timezone">(GMT${timezone})</option>`);
        }, "");

    document.querySelector(".timeZone-Selector").innerHTML = selectorOptions;

    document.querySelector(".timeZone-Selector").addEventListener("change", function (e) {
        setDate(e.target.value);
        if($('.timepicker').val() != ''){
            setReminder();
        }
    });


    document.querySelector(".timeZone-Selector").value = moment.tz.guess();

    const event = new Event("change");
    document.querySelector(".timeZone-Selector").dispatchEvent(event);

}

var secInterval, minInterval, hourInterval;

var timeZone;

function setDate(value) {
    timeZone = value;
    if (secInterval != null && minInterval != null && hourInterval != null) {
        clearIntv(secInterval);
        clearIntv(minInterval);
        clearIntv(hourInterval);
    }

    $('#Date').html(moment.tz(value).format('dddd') + " " + moment.tz(value).format('DD') + ' ' + moment.tz(value).format('MMM') + ' ' + moment.tz(value).format('YYYY'));
    secInterval = setInterval(function () {
        $("#sec").html(moment.tz(value).format('ss'));
    }, 1000);

    minInterval = setInterval(function () {
        $("#min").html(moment.tz(value).format('mm'));
    }, 1000);

    hourInterval = setInterval(function () {
        $("#hours").html((moment.tz(value).format('H') < 10 ? "0" : "") + moment.tz(value).format('H'));
    }, 1000);
}



var secIntervalLocal, minIntervalLocal, hourIntervalLocal;

function setDateLocal() {
    if (secIntervalLocal != null && minIntervalLocal != null && hourIntervalLocal != null) {
        clearIntv(secIntervalLocal);
        clearIntv(minIntervalLocal);
        clearIntv(hourIntervalLocal);
    }

    $('#Date3').html(moment().format('dddd') + " " + moment().format('DD') + ' ' + moment().format('MMM') + ' ' + moment().format('YYYY'));
    secIntervalLocal = setInterval(function () {
        $("#secYour").html(moment().format('ss'));
    }, 1000);

    minIntervalLocal = setInterval(function () {
        $("#minYour").html(moment().format('mm'));
    }, 1000);

    hourIntervalLocal = setInterval(function () {
        $("#hoursYour").html((moment().format('H') < 10 ? "0" : "") + moment().format('H'));
    }, 1000);
}


function clearIntv(interval) {
    clearInterval(interval);
}

var secIntervalDif, minIntervalDif, hourIntervalDif;

function setReminder() {
    if (secIntervalDif != null && minIntervalDif != null && hourIntervalDif != null) {
        clearIntv(secIntervalDif);
        clearIntv(minIntervalDif);
        clearIntv(hourIntervalDif);
    }
    if (timePicker != null && timeZone != null) {
        secIntervalDif = setInterval(function () {
            let timeDif = moment.utc(moment(moment(timePicker.wickedpicker('time'), "HH:mm:ss"),timeZone).diff(moment(moment.tz(timeZone).format("HH:mm:ss"), "HH:mm:ss")));
            $("#secDif").html(timeDif.format('ss'));
        }, 1000);

        minIntervalDif = setInterval(function () {
            let timeDif = moment.utc(moment(moment(timePicker.wickedpicker('time'), "HH:mm:ss"),timeZone).diff(moment(moment.tz(timeZone).format("HH:mm:ss"), "HH:mm")));
            $("#minDif").html(timeDif.format('mm'));
        }, 1000);

        hourIntervalDif = setInterval(function () {
            let timeDif = moment.utc(moment(moment(timePicker.wickedpicker('time'), "HH:mm:ss"),timeZone).diff(moment(moment.tz(timeZone).format("HH:mm:ss"), "HH:mm")));
            $("#hoursDif").html((timeDif.format('H') < 10 ? "0" : "") + timeDif.format('H'));
        }, 1000);
    }
    else {
        $("#hoursDif").html("--");
        $("#minDif").html("--");
        $("#secDif").html("--");
    }
}







