'use strict';

// Calculate the height in cm when ft/inch is entered. Called everytime ft/inch changes
(function( $ ) {
  $.fn.fitform_calculateHeight = function() {
    var inches = feet = 0;

    var inches = Number(document.getElementById("inches").value);
    var feet   = Number(document.getElementById("feet").value);

    var totalinch  = (feet * 12) + inches;
    var centimeter = Math.round(totalinch * 2.54);

    document.getElementById("height").value = centimeter;
  };
}( jQuery ));

//Calculate the BMI based on height and weight. Display results on 2nd step.
(function( $ ) {
  $.fn.fitform_computeBMI = function() {
    //Obtain user inputs
    var height        = Number(document.getElementById("height").value);
    var weight        = Number(document.getElementById("weight").value);
    var weightunits   = document.getElementById("weightunits").value;
    var bmiResult     = document.getElementById("bmiresult");
    var commentResult = document.getElementById("comment");
    var outputText    = document.getElementById("output");

    //Send error if height or weight is less then zero or not a number
    if (height <= 0 || weight <= 0
      || !(!isNaN(parseFloat(height)) && isFinite(height))
      || !(!isNaN(parseFloat(weight)) && isFinite(weight))
      ) {
        outputText.innerHTML    = "Please Input the data correctly in Step 1";
        commentResult.innerHTML = "";
        bmiResult.className     = " callout callout-danger";
        return;
    }

    //Convert all units to metric (meters and kg)
    height /= 100; // converting to meter from centimeter
    if (weightunits == "lb") weight /= 2.20462; // converting to kg from lb

    //Calculate the computeBMI
    var BMI = weight / Math.pow(height, 2);

    //Display result of calculation
    if (BMI > 0) {
        outputText.innerHTML = "BMI : " + (Math.round(BMI * 100) / 100);
    }

    //Display Comment based on the BMI
    if (BMI > 0 && BMI < 16) {
        commentResult.innerHTML = "You are Severely Thin";
        bmiResult.className = " callout callout-danger";
    }
    if (BMI >= 16 && BMI < 17) {
        commentResult.innerHTML = "You are Moderately Thin";
        bmiResult.className = " callout callout-warning";
    }
    if (BMI >= 17 && BMI < 18.5) {
        commentResult.innerHTML = "You are Mildly Thin";
        bmiResult.className = " callout callout-warning";
    }
    if (BMI >= 18.5 && BMI < 25) {
        commentResult.innerHTML = "You are Normal Weight";
        bmiResult.className = " callout callout-success";
    }
    if (BMI >= 25 && BMI < 30) {
        commentResult.innerHTML = "You are Overweight";
        bmiResult.className = " callout callout-warning";
    }
    if (BMI >= 30 && BMI < 35) {
        commentResult.innerHTML = "You are Obese Class I";
        bmiResult.className = " callout callout-warning";
    }
    if (BMI >= 35 && BMI < 40) {
        commentResult.innerHTML = "You are Obese Class II";
        bmiResult.className = " callout callout-danger";
    }
    if (BMI >= 40) {
        commentResult.innerHTML = "You are Obese Class III";
        bmiResult.className = " callout callout-danger";
    }
  };
}( jQuery ));

var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

// Show the next fieldset/step
(function( $ ) {
  $.fn.fitform_showNextFieldset = function() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $("#fitform #progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({
        opacity: 0
        }, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50) + "%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
                'transform': 'scale(' + scale + ')'
            });
            next_fs.css({
                'left': left,
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
  };
}( jQuery ));

// Show the previous fieldset/step
(function( $ ) {
  $.fn.fitform_showPreviousFieldset = function() {
    if (animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#fitform #progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({
        opacity: 0
        }, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1 - now) * 50) + "%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
                'left': left
            });
            previous_fs.css({
                'transform': 'scale(' + scale + ')',
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function() {
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
  };
}( jQuery ));

$("#feet, #inches").on( "change", $(this).fitform_calculateHeight );

$("#calculatebmi").on( "click", $(this).fitform_computeBMI );

$("#fitform .next").on( "click", $(this).fitform_showNextFieldset );

$("#fitform .previous").on( "click", $(this).fitform_showPreviousFieldset );
