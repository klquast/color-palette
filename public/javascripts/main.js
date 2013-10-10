$(function(){
    $('.show-popover').popover();

    /* Background Color Toggle*/
    $('.toggle-bg-color').click(function(){
        $('body').toggleClass('dark');
    });

    /* Make selected-color-circle draggable */
    $('.selected-color-circle').draggable({
        containment: ".color-picker",
        scroll: false,
        drag: function(e) {
            var saturation = colors.saturation();
            var brightness = colors.brightness();
            $('#saturation-input').val(saturation);
            $('#brightness-input').val(brightness);
            var rgb = convert.hsvToRgb($('#hue-input').val(), saturation, brightness);
        }
    });

    /* Make selected-color-circle draggable */
    $('.selected-hue-arrows').draggable({
        axis: 'y',
        containment: ".hue-slider",
        scroll: false,
        drag: function() {
            var hue = colors.hue();
            var rgb = convert.hsvToRgb(hue, 100, 100);
            $('.color-picker-backdrop').css('background-color', 'rgb(' + rgb + ')');
            $('#hue-input').val(hue);
        }
    });

    /* Click (mousedown) on the color picker image */
    $('body').on('mousedown', '.color-picker-backdrop', function(e){
        var posX = $(this).offset().left,
            posY = $(this).offset().top,
            $circle = $('.selected-color-circle');
        if(e.pageY < posY || e.pageY > (posY + 256) || e.pageX < posX || e.pageX > (posX + 256)) {
            return false;
        }
        $circle.css({
            top: (e.pageY - posY) - 8.5,
            left: (e.pageX - posX) - 8
        });
        var saturation = colors.saturation();
        var brightness = colors.brightness();
        $('#saturation-input').val(saturation);
        $('#brightness-input').val(brightness);
        var rgb = convert.hsvToRgb($('#hue-input').val(), saturation, brightness);

        $circle.triggerHandler(e);
    });

    /* Click (mousedown) on the hue slider image */
    $('body').on('mousedown', '.hue-slider-backdrop', function(e){
        var posY = $(this).offset().top,
            $arrows = $('.selected-hue-arrows');
        if(e.pageY < posY || e.pageY > (posY + 256)) {
            return false;
        }
        $arrows.css({
            top: (e.pageY - posY) - 8.5
        });
        var hue = colors.hue();

        $('#hue-input').val(hue);
        var rgb = convert.hsvToRgb(hue, 100, 100);
        $('.color-picker-backdrop').css('background-color', 'rgb(' + rgb + ')');

        $arrows.triggerHandler(e);
    });

    /* Color Attribute Input Boxes*/
    $('#hue-input, #saturation-input, #brightness-input, #red-input, #green-input, #blue-input').change(function(){
        colorInput.checkForValue($(this));
    });
    $('#hue-input, #saturation-input, #brightness-input, #red-input, #green-input, #blue-input').blur(function(){
        colorInput.checkForValue($(this));
    });
    $('#hue-input, #saturation-input, #brightness-input, #red-input, #green-input, #blue-input').keyup(function(e){
        var character = e.which;
        if(character === 38 || character === 40) {
            colorInput.incDecValue($(this), character);
        }

        colorInput.updateSliders($(this));
    });
});

/***************
*   FUNCTIONS
***************/
var colors = {
    hue: function(){
        var pos = $('.selected-hue-arrows').css('top')
        pos = parseInt(pos);
        var div = 256/360;
        return 360 - Math.round((pos + 8)/div);
    },
    saturation: function(){
        var pos = $('.selected-color-circle').css('left')
        pos = parseInt(pos);
        return Math.round((pos + 8)/2.56);
    },
    brightness: function(){
        var pos = $('.selected-color-circle').css('top');
        pos = parseInt(pos);
        return Math.round(100 - (pos + 8) / 2.56);
    }
};

var convert = {
    hsvToRgb: function(hue, sat, value){
        var r, g, b;
        hue /= 360;
        sat /= 100;
        value /= 100;

        var i = Math.floor(hue * 6);
        var f = hue * 6 - i;
        var p = value * (1 - sat);
        var q = value * (1 - f * sat);
        var t = value * (1 - (1 - f) * sat);

        switch (i % 6) {
            case 0: r = value, g = t, b = p; break;
            case 1: r = q, g = value, b = p; break;
            case 2: r = p, g = value, b = t; break;
            case 3: r = p, g = q, b = value; break;
            case 4: r = t, g = p, b = value; break;
            case 5: r = value, g = p, b = q; break;
        }

        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        colorInput.updateRgb([r,g,b]);

        return [r, g, b];
    },
    rgbToHsv: function(red, green, blue){
        var h, s, v;

        red /= 255;
        green /= 255;
        blue /= 255;

        var maxRgb = Math.max(red, green, blue);
        var minRgb = Math.min(red, green, blue);

        if(minRgb == maxRgb) {
            return [0, 0, minRbg];
        }

        var d = (red == minRgb) ? green - blue : ((blue == minRgb) ? red - green : blue - red);
        var hd = (red == minRgb) ? 3 : ((blue == minRgb) ? 1 : 5);
        h = 60 * (hd - d / (maxRgb - minRgb));
        s = (maxRgb - minRgb) / maxRgb;
        v = maxRgb;

        return [Math.round(h), Math.round(s*100), Math.round(v*100)];
    }
};

var colorInput = {
    updateRgb: function(rgb) {
        $('#red-input').val(rgb[0]);
        $('#green-input').val(rgb[1]);
        $('#blue-input').val(rgb[2]);
    },
    updateSliders: function($inputBox) {
        //TODO: convert rgb to hsv and update the position of the sliders
        var maxValue = parseInt($inputBox.attr('data-max-value'));
        var currentValue = parseInt($inputBox.val());
        var $parent = $inputBox.parent('.form-group');

        if(currentValue > maxValue) {
            $parent.addClass('has-warning').attr('title', 'Warning: Value cannot be greater than ' + maxValue);
        }
        else if(currentValue < 0) {
            $parent.addClass('has-warning').attr('title', 'Warning: Value cannot be less than 0');
        }
        else {
            $parent.removeClass('has-warning').attr('title', '');
        }
    },
    checkForValue: function($inputBox) {
        var maxValue = parseInt($inputBox.attr('data-max-value'));
        var currentValue = parseInt($inputBox.val());
        var $parent = $inputBox.parent('.form-group');
        $parent.removeClass('has-warning').attr('title', '');


        if($inputBox.val() === undefined || $inputBox.val() === '') {
            $inputBox.val(0);
        }
        if(currentValue > maxValue) {
            $inputBox.val(maxValue);
        }
        if(currentValue < 0) {
            $inputBox.val(0);
        }
    },
    incDecValue: function($inputBox, character) {
        var maxValue = $inputBox.attr('data-max-value');
        var currentValue = parseInt($inputBox.val());
        var canIncrease = currentValue >= maxValue ? false : true;
        var canDecrease = currentValue == 0 ? false : true;

        if(character === 38 && canIncrease) {
            $inputBox.val(currentValue + 1);
            return;
        }
        if(character === 40 && canDecrease){
            $inputBox.val(currentValue - 1);
            return;
        }
        return;
    }
}