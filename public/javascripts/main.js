$(function(){
    /* Background Color Toggle*/
    $('.toggle-bg-color').click(function(){
        $('body').toggleClass('dark');
    });

    /* Make selected-color-circle draggable */
    $('.selected-color-circle').draggable({
        containment: ".color-picker",
        scroll: false,
        drag: function(e) {
            var hue = colors.hue();
            var saturation = colors.saturation();
            var brightness = colors.brightness();
            $('#saturation-input').val(saturation);
            $('#brightness-input').val(brightness);
            var rgb = convert.hsvToRgb(hue, saturation, brightness);
            convert.rgbToHex(rgb);
        }
    });

    /* Make selected-color-circle draggable */
    $('.selected-hue-arrows').draggable({
        axis: 'y',
        containment: ".hue-slider",
        scroll: false,
        drag: function() {
            var hue = colors.hue();
            var saturation = colors.saturation();
            var brightness = colors.brightness();
            var rgbBackGround = convert.hsvToRgb(hue, 100, 100);
            var rgb = convert.hsvToRgb(hue, saturation, brightness)
            $('.color-picker-backdrop').css('background-color', 'rgb(' + rgbBackGround + ')');
            convert.rgbToHex(rgb);
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
        convert.rgbToHex(rgb);

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
        var saturation = colors.saturation();
        var brightness = colors.brightness();

        $('#hue-input').val(hue);
        var rgbBackground = convert.hsvToRgb(hue, 100, 100);
        var rgb = convert.hsvToRgb(hue, saturation, brightness);
        $('.color-picker-backdrop').css('background-color', 'rgb(' + rgbBackground + ')');
        convert.rgbToHex(rgb);

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

    /* Hex Input Box */
    $('#hex-input').change(function(){
        colorInput.checkForHexValue($(this));
    });
    $('#hex-input').blur(function(){
        colorInput.checkForHexValue($(this));
    });
    $('#hex-input').keyup(function(e){
        var hexValue = $(this).val();
        var allowedChars = /[^0-9a-fA-F#]/;
        var hideAlert = true;
        var ignoreFirstChar = hexValue.substr(0,1) !== '#';

        if(allowedChars.test(hexValue)) {
            message.showWarning("Warning", "Hex contains an invalid character. Legal characters include 0-9 and A-F.");
            hideAlert = false;
        }
        else if(hexValue.length === 3 && ignoreFirstChar) {
            // update color
            alert('update color to ' + hexValue);
        }
        else if(hexValue.length === 4 && !ignoreFirstChar) {
            // strip # and update color
            alert('update color to ' + hexValue.substr(1,3));
        }
        else if(hexValue.length === 6 && ignoreFirstChar) {
            // update color
            alert('update color to ' + hexValue);
        }
        else if(hexValue.length > 6 && ignoreFirstChar) {
            message.showWarning("Warning", "Hex value cannot contain more than 6 characters");
            hideAlert = false;
        }
        else if(hexValue.length === 7 && !ignoreFirstChar) {
            // strip # and update color
            alert('update color to ' + hexValue.substr(1,6));
        }

        if(hideAlert) {
            message.hideAlert();
        }
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
    },
    rgbToHex: function(rgb) {
        var red = rgb[0],
            green = rgb[1],
            blue = rgb[2],
            r1, r2, g1, g2, b1, b2,
            hex;

        r1 = Math.floor(red / 16);
        r2 = red % 16;
        g1 = Math.floor(green / 16);
        g2 = green % 16;
        b1 = Math.floor(blue / 16);
        b2 = blue % 16;

        hex = translate(r1).toString() + translate(r2).toString() +
              translate(g1).toString() + translate(g2).toString() +
              translate(b1).toString() + translate(b2).toString();

        colorInput.updateHex(hex);

        return hex;

        function translate(value) {
            if(value < 10){
                return value;
            }

            var newValue;
            switch (value){
                case 10:
                    newValue = 'A';
                    break;
                case 11:
                    newValue = 'B';
                    break;
                case 12:
                    newValue = 'C';
                    break;
                case 13:
                    newValue = 'D';
                    break;
                case 14:
                    newValue = 'E';
                    break;
                case 15:
                    newValue = 'F';
                    break;
            }

            return newValue;
        }
    }
};

var colorInput = {
    updateRgb: function(rgb) {
        $('#red-input').val(rgb[0]);
        $('#green-input').val(rgb[1]);
        $('#blue-input').val(rgb[2]);
    },
    updateHex: function(hex) {
        $('#hex-input').val(hex);
        $('.color-preview-tile').css('background-color', '#' + hex);
    },
    updateSliders: function($inputBox) {
        //TODO: convert rgb to hsv and update the position of the sliders
        var maxValue = parseInt($inputBox.attr('data-max-value'));
        var currentValue = parseInt($inputBox.val());
        var $parent = $inputBox.parent('.form-group');

        if(currentValue > maxValue) {
            $parent.addClass('has-warning');
            message.showWarning('Warning', 'Value cannot be greater than ' + maxValue);
        }
        else if(currentValue < 0){
            $parent.addClass('has-warning');
            message.showWarning('Warning', 'Value cannot be less than 0');
        }
        else {
            $parent.removeClass('has-warning');
            message.hideAlert();
        }
    },
    checkForValue: function($inputBox) {
        var maxValue = parseInt($inputBox.attr('data-max-value'));
        var currentValue = parseInt($inputBox.val());
        var $parent = $inputBox.parent('.form-group');
        $parent.removeClass('has-warning');
        message.hideAlert();

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
    checkForHexValue: function($inputBox) {
        var hexValue = $inputBox.val();
        var resetValue = false;

        if(hexValue === undefined || hexValue === '') {
            resetValue = true;
        }
        if(hexValue.length == 7) {
            if(hexValue.substr(0,1) === '#') {
                $('#hex-input').val(hexValue.substr(1));
            }
            else {
                $('#hex-input').val(hexValue.substr(0, 6));
            }
        }
        if(hexValue.length != 3 && hexValue.length != 6) {
            resetValue = true;
        }

        if(resetValue) {
            var rgb = [$('#red-input').val(), $('#green-input').val(), $('#blue-input').val()];
            convert.rgbToHex(rgb);
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

var message = {
    baseHtml: function(title, content) {
        return '<div class="alert alert-dismissable"><button type="button" class="close" data-dismiss="alert">×</button><h4>' + title + '</h4><p>' + content + '</p></div>';
    },
    showWarning: function(title, content) {
        var $baseHtml = $(this.baseHtml(title, content));
        $baseHtml.addClass('alert-warning');
        $('.alert-container').html($baseHtml).fadeIn();
    },
    hideAlert: function() {
        $('.alert-container').fadeOut('slow', function(){
            $(this).html('');
        });
    }
}