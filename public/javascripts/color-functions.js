/*------------------------------------------------------------------------------------------------------------------
*                                            Variables
------------------------------------------------------------------------------------------------------------------*/
var firstDropSpotSize = 10;
var dropSpotSize = 40;
var savedColorSize = 100;
var rowSize;
var currentColorsPerRow;
var unsavedChanges = true;
var unsavedColorEdits = false;

$(function(){

    /*------------------------------------------------------------------------------------------------------------------
    *                                            Event Listeners
    ------------------------------------------------------------------------------------------------------------------*/
    rowSize = $('.saved-colors-panel .row').width();
    currentColorsPerRow = savedColors.colorsPerRow(rowSize);

    // Check to see if the default color is a favorite
    colorInput.checkIfFavorite('408080');

    $(window).on('beforeunload', function(){
        if(unsavedChanges) {
            return 'Looks like you have some unsaved changes. (Your favorite colors list will not be affected either way).';
        }
    });

    $('body').on('click', '.cancel-palette', function(e) {
        if(!unsavedChanges) {
            e.preventDefault();
            var newUrl = $('#confirm-page-modal').attr('data-url');
            window.location = newUrl;
            return false;
        }
    });

    $('body').on('click', '.save-palette', function(e) {
        var newUrl = $(this).attr('data-url');
        if(!unsavedChanges) {
            e.preventDefault();
            window.location = newUrl;
            return false;
        }
        else {
            alert('Palette will be saved');
            window.location = newUrl;
        }
    });

    $('body').on('click', '.confirm-discard', function(e){
        var newUrl = $('#confirm-page-modal').attr('data-url');
        window.location = newUrl;
    });

    /* Make selected-color-circle draggable */
    $('.selected-color-circle').draggable({
        containment: '.color-picker',
        scroll: false,
        drag: function(e) {
            var hue = colors.hue();
            var saturation = colors.saturation();
            var brightness = colors.brightness();

            $('#saturation-input').val(saturation);
            $('#brightness-input').val(brightness);

            var rgb = convert.hsvToRgb(hue, saturation, brightness);
            var hex = convert.rgbToHex(rgb);
            colorInput.updateRgb(rgb);
            colorInput.updateHex(hex);
            colorInput.checkIfFavorite(hex);
        }
    });

    /* Make selected-color-circle draggable */
    $('.selected-hue-arrows').draggable({
        axis: 'y',
        containment: '.hue-slider',
        scroll: false,
        drag: function() {
            var hue = colors.hue();
            var saturation = colors.saturation();
            var brightness = colors.brightness();

            $('#hue-input').val(hue);

            colorInput.updatePickerBackground(convert.hsvToRgb(hue, 100, 100));

            var rgb = convert.hsvToRgb(hue, saturation, brightness)
            var hex = convert.rgbToHex(rgb);
            colorInput.updateRgb(rgb);
            colorInput.updateHex(hex);
            colorInput.checkIfFavorite(hex);
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
        var hex = convert.rgbToHex(rgb);
        colorInput.updateRgb(rgb);
        colorInput.updateHex(hex);
        colorInput.checkIfFavorite(hex);

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
        colorInput.updatePickerBackground(convert.hsvToRgb(hue, 100, 100));

        var rgb = convert.hsvToRgb(hue, saturation, brightness);
        var hex = convert.rgbToHex(rgb);
        colorInput.updateRgb(rgb);
        colorInput.updateHex(hex);
        colorInput.checkIfFavorite(hex);

        $arrows.triggerHandler(e);
    });

    /* Color Attribute Input Boxes*/
    $('#hue-input, #saturation-input, #brightness-input').change(function(){
        var valid = colorInput.checkForValue($(this));

        if(!valid) {
            var hsv = convert.rgbToHsv(colors.red(), colors.green(), colors.blue());
            colorInput.updateHsv(hsv);
        }
        else {
            colorInput.newHsvInput();
        }
    });
    $('#hue-input, #saturation-input, #brightness-input').blur(function(){
        var valid = colorInput.checkForValue($(this));

        if(!valid) {
            var hsv = convert.rgbToHsv(colors.red(), colors.green(), colors.blue());
            colorInput.updateHsv(hsv);
        }
        else {
            colorInput.newHsvInput();
        }
    });
    $('#hue-input, #saturation-input, #brightness-input').keydown(function(e){
        var character = e.which;

        if(character !== 38 && character !== 40) {
            return;
        }

        var valid = colorInput.incDecValue($(this), character);

        if(valid) {
            colorInput.newHsvInput();
        }
    });
    $('#hue-input, #saturation-input, #brightness-input').keyup(function(e){
        var valid = colorInput.validateRgbOrHsv($(this), e);
    });
    $('#red-input, #green-input, #blue-input').change(function(){
        var valid = colorInput.checkForValue($(this));

        if(!valid) {
            var rgb = convert.hexToRgb(colors.hex());
            colorInput.updateRgb(rgb);
        }
        else {
            colorInput.newRgbInput();
        }

        $('#rgb-copy-text').val('rgb(' + colors.red() + ',' + colors.green() + ',' + colors.blue() + ')');
    });
    $('#red-input, #green-input, #blue-input').blur(function(){
        var valid = colorInput.checkForValue($(this));

        if(!valid) {
            var rgb = convert.hexToRgb(colors.hex());
            colorInput.updateRgb(rgb);
        }
        else {
            colorInput.newRgbInput();
        }
    });
    $('#red-input, #green-input, #blue-input').keydown(function(e){
        var character = e.which;

        if(character !== 38 && character !== 40) {
            return;
        }

        var valid = colorInput.incDecValue($(this), character);

        if(valid) {
            colorInput.newRgbInput();
        }
    });
    $('#red-input, #green-input, #blue-input').keyup(function(e){
        var valid = colorInput.validateRgbOrHsv($(this), e);
    });
    /* Hex Input Box */
    $('#hex-input').change(function(){
        colorInput.checkForHexValue($(this));
    });
    $('#hex-input').blur(function(){
        colorInput.checkForHexValue($(this));
    });
    $('#hex-input').click(function(){
            $(this).select();
        });
    $('#hex-input').keyup(function(e){
        var hexValue = $(this).val();
        var allowedChars = /[^0-9a-fA-F#]/;
        var hideAlert = true;
        var updateColor = false;
        var ignoreFirstChar = hexValue.substr(0,1) !== '#';

        if(allowedChars.test(hexValue)) {
            message.showWarning('Warning', 'Hex contains an invalid character. Legal characters include 0-9 and A-F.');
            hideAlert = false;
        }
        else if(hexValue.length === 3 && ignoreFirstChar) {
            updateColor = true;
        }
        else if(hexValue.length === 4 && !ignoreFirstChar) {
            hexValue = hexValue.substr(1,3);
            updateColor = true;
        }
        else if(hexValue.length === 6 && ignoreFirstChar) {
            updateColor = true;
        }
        else if(hexValue.length === 7 && !ignoreFirstChar) {
            hexValue = hexValue.substr(1,6);
            updateColor = true;
        }
        else if(hexValue.length > 6 && ignoreFirstChar) {
            message.showWarning('Warning', 'Hex value cannot contain more than 6 characters');
            hideAlert = false;
        }

        if(updateColor) {
            var rgb = convert.hexToRgb(hexValue);
            colorInput.checkIfFavorite(hexValue);
            colorInput.updateRgb(rgb);
            var hsv = convert.rgbToHsv(rgb[0], rgb[1], rgb[2]);
            colorInput.updatePickerBackground(convert.hsvToRgb(hsv[0], 100, 100));
            colorInput.updateColorPreview(hexValue);
            colorInput.updateHsv(hsv);
            colorInput.updateSliders(hsv);
        }

        if(hideAlert) {
            message.hideAlert();
        }
    });

    /* Register droppable event listener */
    eventListeners.makeDroppable();

    $('.add-color').click(function(){
        savedColors.addNewColor(null, $('.preview-tile'), true);
    });

    $(window).resize(function(){
        var newRowSize = $('.saved-colors-panel .row').width();

        if(rowSize === newRowSize) {
            return;
        }

        rowSize = newRowSize;
        savedColors.repositionRows(true, newRowSize);
    });

    /* Copy color to clipboard */
    var clip = new ZeroClipboard($('.copy-to-clipboard'), { moviePath: "assets/javascripts/ZeroClipboard.swf" });

    clip.on('dataRequested', function(client, args){
        message.showInfo('Copied', client.options.text + ' copied to clipboard!');
    });

    clip.on('mouseover', function(client, args){
        $(this).attr('title', 'Copy').tooltip().mouseover();
    });

    clip.on('mouseout', function(client, args){
        $(this).tooltip('destroy').mouseout();
    });

    /* Remove saved color */
    $('body').on('click', '.remove-wrapper', function(){
        savedColors.removeColor($(this).parents('.saved-color'));
    });

    /* Select a Favorite color */
    $('body').on('click', '#favorites-list .favorite-color', function(){
        $('#hex-input').val($(this).attr('data-hex')).keyup();
    });

    /* Toggle favorite */
    $('body').on('click', '.toggle-favorite-wrapper', function(){
        var $context = $(this);
        var $colorWrapper = $context.parents('.color-wrapper');
        var hex = $colorWrapper.attr('data-hex');
        if($colorWrapper.hasClass('favorite-color')) {
            // is a fav, remove it
            colorInput.removeFavorite(hex);
        }
        else {
            // is not a fav, add it
            colorInput.addFavorite(hex);
        }
    });

    // Toggle edit mode
    $('body').on('click', '.toggle-edit-wrapper', function() {
        var $color = $(this).parents('.color');

        if($color.parent().hasClass('editing-color')) {
            var hasChanges = savedColors.hasEditChanges();

            if(hasChanges) {
                $('#confirm-edit-modal').modal('show');
            }
            else {
                savedColors.endEdit();
            }
        }
        else {
            savedColors.startEdit($color)
        }
    });

    // Cancel out of edit mode
    $('body').on('click', '.cancel-edit', function(){
        var hasChanges = savedColors.hasEditChanges();

        if(hasChanges) {
            $('#confirm-edit-modal').modal('show');
        }
        else {
            savedColors.endEdit();
        }
    });

    $('body').on('click', '.confirm-edit-discard', function(){
        savedColors.endEdit();
    });

    $('body').on('click', '.save-edit, .confirm-edit-save', function(){
        var hasChanges = savedColors.hasEditChanges();

        if(hasChanges) {
            savedColors.saveEdit();
        }
        else {
            savedColors.endEdit();
        }
    });
});

/*----------------------------------------------------------------------------------------------------------------------
*                                            Color Functions
----------------------------------------------------------------------------------------------------------------------*/
var colors = {
    // Calculates and returns the hue value based on the position of the hue slider
    hue: function(){
        var pos = $('.selected-hue-arrows').css('top')
        pos = parseInt(pos);
        var div = 256/360;
        return 360 - Math.round((pos + 8)/div);
    },
    // Returns the value of the hue input box
    hueInput: function(){
        return $('#hue-input').val();
    },
    // Calculates and returns the saturation value based on the left position of the sat/brightness circle slider
    saturation: function(){
        var pos = $('.selected-color-circle').css('left')
        pos = parseInt(pos);
        return Math.round((pos + 8)/2.56);
    },
    // Returns the value of the saturation input box
    saturationInput: function(){
        return $('#saturation-input').val();
    },
    // Calculates and returns the brightness value based on the top position of the sat/brightness circle slider
    brightness: function(){
        var pos = $('.selected-color-circle').css('top');
        pos = parseInt(pos);
        return Math.round(100 - (pos + 8) / 2.56);
    },
    // Returns the value of the brightness input box
    brightnessInput: function(){
        return $('#brightness-input').val();
    },
    // Returns the value of the red input box
    red: function(){
        return parseInt($('#red-input').val());
    },
    // Returns the value of the green input box
    green: function(){
        return parseInt($('#green-input').val());
    },
    // Returns the value of the blue input box
    blue: function(){
        return parseInt($('#blue-input').val());
    },
    // Returns the value of the hex input box
    hex: function() {
        return $('#hex-input').val();
    }
};

/*----------------------------------------------------------------------------------------------------------------------
*                                            Conversion Functions
----------------------------------------------------------------------------------------------------------------------*/
var convert = {
    // Converts the hue, saturation, and 'value' into an rgb value
    //   returns an array with the red, green, and blue values
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

        return [r, g, b];
    },
    // Converts the red, green, and blue values into an hsv value
    //   returns an array with the hue, saturation, and 'value' values
    rgbToHsv: function(red, green, blue){
        var h, s, v;

        red = parseInt(red);
        green = parseInt(green);
        blue = parseInt(blue);

        red /= 255;
        green /= 255;
        blue /= 255;

        var maxRgb = Math.max(red, green, blue);
        var minRgb = Math.min(red, green, blue);

        if(minRgb == maxRgb) {
            return [0, 0, Math.round(minRgb*100)];
        }

        var d = (red == minRgb) ? green - blue : ((blue == minRgb) ? red - green : blue - red);
        var hd = (red == minRgb) ? 3 : ((blue == minRgb) ? 1 : 5);
        h = 60 * (hd - d / (maxRgb - minRgb));
        s = (maxRgb - minRgb) / maxRgb;
        v = maxRgb;

        return [Math.round(h), Math.round(s*100), Math.round(v*100)];
    },
    // Converts the red, green, and blue values into a hex value
    //   accepts an rgb array
    //   returns a string
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

        return hex;

        function translate(value) {
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
                default:
                    newValue = value;
                    break;
            }

            return newValue;
        }
    },
    // Converts the hex value into an rgb value
    //   accepts a string
    //   returns an array with the red, green, and blue values
    hexToRgb: function(hex){
        var pos1, pos2, pos3, pos4, pos5, pos6,
            r, g, b;


        if(hex.length === 3) {
            pos1 = hex.substr(0,1);
            pos2 = pos1;
            pos3 = hex.substr(1,1);
            pos4 = pos3;
            pos5 = hex.substr(2,1);
            pos6 = pos5;
        }
        else {
            pos1 = hex.substr(0,1);
            pos2 = hex.substr(1,1);
            pos3 = hex.substr(2,1);
            pos4 = hex.substr(3,1);
            pos5 = hex.substr(4,1);
            pos6 = hex.substr(5,1);
        }

        r = translate(pos1) * 16 + translate(pos2);
        g = translate(pos3) * 16 + translate(pos4);
        b = translate(pos5) * 16 + translate(pos6);

        return [r,g,b];

        function translate(value) {
            var newValue;
            switch (value.toUpperCase()){
                case 'A':
                    newValue = 10;
                    break;
                case 'B':
                    newValue = 11;
                    break;
                case 'C':
                    newValue = 12;
                    break;
                case 'D':
                    newValue = 13;
                    break;
                case 'E':
                    newValue = 14;
                    break;
                case 'F':
                    newValue = 15;
                    break;
                default:
                    newValue = parseInt(value);
                    break;
            }

            return newValue;
        }
    },
    // Converts the hue, saturation, and 'value' values into an hsl value
    //   returns an array with the hue, saturation, and lightness values
    hsvToHsl: function(hue, sat, value){
        var h,
            s,
            l;

        sat /= 100;
        value /= 100;

        h = hue;
        l = (2 - sat) * value;
        s = sat * value;
        s /= (l <= 1) ? l : 2 - l;
        s = Math.floor(s * 100);
        l /= 2;
        l = Math.round(l * 100);

        return [h, s, l];
    }
};

/*----------------------------------------------------------------------------------------------------------------------
*                                            Color Input Functions
----------------------------------------------------------------------------------------------------------------------*/
var colorInput = {
    // Updates the red, green, and blue input boxes with the new rgb values
    //   accepts an rgb array
    updateRgb: function(rgb) {
        $('#red-input').val(rgb[0]);
        $('#green-input').val(rgb[1]);
        $('#blue-input').val(rgb[2]);

        $('#rgb-copy-text').val('rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');
    },
    // Updates the hex input box the new hex value, and also updates the color preview tile
    //   accepts a string
    updateHex: function(hex) {
        $('#hex-input').val(hex);
        this.updateColorPreview(hex);
    },
    // Updates the hue, saturation, and brightness input boxes with the new hsv values
    //   accepts an hsv array
    updateHsv: function(hsv){
        $('#hue-input').val(hsv[0]);
        $('#saturation-input').val(hsv[1]);
        $('#brightness-input').val(hsv[2]);
    },
    // Updates the color preview tile with the new hex value
    //   accepts a string
    updateColorPreview: function(hex) {
        $('.preview-tile').attr('data-hex', hex);
        $('.preview-tile').attr('data-rgb', $('#rgb-copy-text').val());
        $('.preview-tile .color').css('background-color', '#' + hex);
    },
    // Updates the background color of the color picker
    //   accepts an rgb array
    updatePickerBackground: function(rgb) {
        $('.color-picker-backdrop').css('background-color', 'rgb(' + rgb + ')');
    },
    // Updates the hue slider arrows and color picker circle based on the new hsv value
    //   accepts an hsv array
    updateSliders: function(hsv) {
        var hue = parseInt(hsv[0]),
            sat = parseInt(hsv[1]),
            bri = parseInt(hsv[2]),
            mult = 256/360;
        var huePos = Math.round(((360 - hue) * mult) - 8);
        var satPos = Math.round((sat * 2.56) - 8);
        var briPos = Math.round(((100 - bri) * 2.56) - 8);

        $('.selected-hue-arrows').css('top', huePos);
        $('.selected-color-circle').css({
            'left': satPos + 'px',
            'top': briPos + 'px'
        });
    },
    // Checks whether or not the given input box contains a valid input value
    //   value can't be undefined, empty, less than zero, or greater than the specified maximum value
    //   returns a boolean
    checkForValue: function($inputBox) {
        var maxValue = parseInt($inputBox.attr('data-max-value'));
        var currentValue = parseInt($inputBox.val());
        var $parent = $inputBox.parent('.form-group');
        $parent.removeClass('has-warning');
        message.hideAlert();

        if($inputBox.val() === undefined || $inputBox.val() === '') {
            return false;
        }
        if(currentValue > maxValue) {
            return false;
        }
        if(currentValue < 0) {
            return false;
        }

        return true;
    },
    // Checks whether or not the given input box contains a valid hex value
    //   checks for '#' and strips it out if present
    //   if the input is invalid, the value is reset to the previous value (by checking the current rgb values)
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
        if(hexValue.length != 6) {
            resetValue = true;
        }

        if(resetValue) {
            var rgb = [$('#red-input').val(), $('#green-input').val(), $('#blue-input').val()];
            var hex = convert.rgbToHex(rgb);
            colorInput.updateHex(hex);
            colorInput.checkIfFavorite(hexValue);
        }
    },
    // Checks whether or not the given rgb or hsv input box contains a valid input value
    //   value can't be undefined, empty, less than zero, or greater than the specified maximum value
    //   if invalid, call the showWarning function
    //   returns a boolean
    validateRgbOrHsv: function($inputBox, e){
        var valid = true;

        var maxValue = parseInt($inputBox.attr('data-max-value'));
        var currentValue = parseInt($inputBox.val());
        var $parent = $inputBox.parent('.form-group');

        if(currentValue > maxValue) {
            $parent.addClass('has-warning');
            message.showWarning('Warning', 'Value cannot be greater than ' + maxValue);
            valid = false;
        }
        else if(currentValue < 0){
            $parent.addClass('has-warning');
            message.showWarning('Warning', 'Value cannot be less than 0');
            valid = false;
        }
        else {
            $parent.removeClass('has-warning');
            message.hideAlert();
        }

        return valid;
    },
    // Checks whether or not the given rgb or hsv input box can be increased or decreased
    //   checks the pressed key character value to determine whether trying to increase or decrease value
    //   if possible, increases or decreases the input value
    //   returns a boolean
    incDecValue: function($inputBox, character) {
        var maxValue = $inputBox.attr('data-max-value');
        var currentValue = parseInt($inputBox.val());
        var canIncrease = currentValue >= maxValue ? false : true;
        var canDecrease = currentValue == 0 ? false : true;
        var valueUpdated = false;

        if(character === 38 && canIncrease) {
            $inputBox.val(currentValue + 1);
            valueUpdated = true;
        }
        if(character === 40 && canDecrease){
            $inputBox.val(currentValue - 1);
            valueUpdated = true;
        }
        return valueUpdated;
    },
    // A new, valid hsv has been entered, update all other input boxes, preview tile and sliders
    newHsvInput: function() {
        var hue = colors.hueInput(),
            saturation = colors.saturationInput(),
            brightness = colors.brightnessInput();

        var rgb = convert.hsvToRgb(hue, saturation, brightness);
        colorInput.updateRgb(rgb);
        var hex = convert.rgbToHex(rgb);
        colorInput.checkIfFavorite(hex);
        colorInput.updateHex(hex);
        colorInput.updateColorPreview(hex);
        colorInput.updatePickerBackground(convert.hsvToRgb(hue, 100, 100));
        colorInput.updateSliders([hue, saturation, brightness]);
    },
    // A new, valid rgb has been entered, update all other input boxes, preview tile and sliders
    newRgbInput: function() {
        var red = colors.red(),
            green = colors.green(),
            blue = colors.blue();

        var hsv = convert.rgbToHsv(red, green, blue);
        colorInput.updateHsv(hsv);
        var hex = convert.rgbToHex([red, green, blue]);
        colorInput.checkIfFavorite(hex);
        colorInput.updateHex(hex);
        colorInput.updateColorPreview(hex);
        colorInput.updatePickerBackground(convert.hsvToRgb(hsv[0], 100, 100));
        colorInput.updateSliders(hsv);

        $('#rgb-copy-text').val('rgb(' + red + ',' + green + ',' + blue + ')');
    },
    // Check whether or not the specified color is a favorite
    //   if yes, show fav indicator on the preview
    //   if no, hide fav indicator on the preview
    checkIfFavorite: function(hex) {
        var $favorites = $('#favorites-list .favorite-color');
        var isFavorite = $favorites.filter(function(){
            return $(this).attr('data-hex').toLowerCase() === hex.toLowerCase();
        }).length > 0;

        if(isFavorite) {
            $('.preview-tile').addClass('favorite-color');
        }
        else {
            $('.preview-tile').removeClass('favorite-color');
        }
    },
    // Add the given color to the list of favorites and update all occurrences of that color on the page
    addFavorite: function(hex) {
        // ajax call
        $('.color-wrapper').filter(function(){
            return $(this).attr('data-hex').toLowerCase() === hex.toLowerCase();
        }).addClass('favorite-color');
        var $clone = $('#favorites-list .favorite-color-template > .favorite-color').clone();
        $clone.attr('data-hex', hex);
        $clone.children('.color').css('background-color', '#' + hex);
        $clone.children('span').html('#' + hex);
        $('.favorite-color-template').before($clone);
    },
    // Remove the given color from the list of favorites and update all occurrences of that color on the page
    removeFavorite: function(hex) {
        // ajax call
        $('.color-wrapper').filter(function(){
            return $(this).attr('data-hex').toLowerCase() === hex.toLowerCase();
        }).removeClass('favorite-color');
        $('#favorites-list .favorite-color').filter(function(){
            return $(this).attr('data-hex').toLowerCase() === hex.toLowerCase();
        }).remove();
    }
};

/*----------------------------------------------------------------------------------------------------------------------
*                                            Saved Color Functions
----------------------------------------------------------------------------------------------------------------------*/
var savedColors = {
    addNewColor: function(position, $newColor, showMessage) {
        var $lastRow = $('.saved-colors-panel .row').last();
        var rowWidth = $lastRow.width();
        var dropSpotCount = $('.reorder-drop-spot', $lastRow).length;
        var savedColorCount = $('.saved-color', $lastRow).length;
        var fullColorCount = $('.saved-color').length;

        var newHex = $newColor.attr('data-hex');
        var newRgb = $newColor.attr('data-rgb');
        var newTag = $('#tag-input').val();
        var isEditing = $newColor.hasClass('editing-color');

        if(position === undefined || position === null) {
            position = fullColorCount;
            $('.new-color-template .reorder-drop-spot').attr('data-new-pos', position);
        }

        $('.new-color-template .saved-color').attr('data-pos', position).attr('data-hex', newHex).attr('data-rgb', newRgb);
        if($newColor.hasClass('favorite-color')) {
            $('.new-color-template .saved-color').addClass('favorite-color');
        }
        else {
            $('.new-color-template .saved-color').removeClass('favorite-color');
        }
        $('.new-color-template .color').css('background-color', '#' + newHex);
        if(isEditing) {
            $('.new-color-template').addClass('editing-color');
            $('.new-color-template .color').attr('data-original-color', newHex);
        }
        $('.new-color-template .saved-hex').html('#' + newHex);
        $('.new-color-template .saved-rgb').html(newRgb);
        $('.new-color-template .saved-tag').html(newTag);

        var clone = $('.new-color-template').html();

        // Check to see if new row is needed
        var dropSpotSpace = (dropSpotCount - 1) * dropSpotSize + firstDropSpotSize;
        var savedColorSpace = savedColorCount * savedColorSize;
        var spaceNeeded = dropSpotSize + savedColorSize;
        var spaceRemaining = rowWidth - dropSpotSpace - savedColorSpace;
        if(spaceRemaining < spaceNeeded) {
            $lastRow.after('<div class="row"></div>');
            var $dropSpot = $('.last-drop-spot');
            $lastRow = $('.saved-colors-panel .row').last();
            $lastRow.html($dropSpot);
        }
        if(position === fullColorCount) {
//            $('.color-drop-spot').before(clone);
            $('.last-drop-spot').before(clone);
        }
        else {
            // put in new spot and increment all items after it
            var $newSpot = $('.reorder-drop-spot', '.saved-colors-panel').filter(function(){
                return $(this).attr('data-new-pos') === position;
            });

            $newSpot.before(clone);
            var index = 1;
            $('.reorder-drop-spot').each(function(){
                $(this).attr('data-new-pos', index);
                index++;
            });
            var index = 1;
            $('.saved-color').each(function(){
                $(this).attr('data-pos', index);
                index++;
            });

            var newRowSize = $('.saved-colors-panel .row').width();
            savedColors.repositionRows(false, newRowSize);
        }

        eventListeners.makeDraggable();
        eventListeners.makeDroppable();
        if(showMessage) {
            message.showSuccess('Success', 'Color successfully added!');
        }

        $('#tag-input').val('');
    },
    removeColor: function($color){
        $color.prev('.reorder-drop-spot').remove();
        $color.remove();
        var newRowSize = $('.saved-colors-panel .row').width();
        savedColors.repositionRows(false, newRowSize);
    },
    repositionRows: function(resized, rowWidth) {
        var dropSpotCount = $('.reorder-drop-spot').length;
        var savedColorCount = $('.saved-colors-panel .saved-color').length;
        var perRow = this.colorsPerRow(rowWidth);

        if((resized && (savedColorCount <= 0 || currentColorsPerRow === perRow)) || savedColorCount === 0) {
            return;
        }

        var rowsRequired = Math.ceil(savedColorCount / perRow);
        var $newHtml =  $('<div></div>');
        for(i = 0; i < rowsRequired; i++) {
            $newHtml.append('<div class="row"></div>');
        }

        currentColorsPerRow = perRow;
        var currRow = 1,
            itemsCount = 0,
            currentDropSpots = $('.saved-colors-panel .reorder-drop-spot').toArray();
            currentColors = $('.saved-colors-panel .saved-color').toArray();
            $currentRow = $($newHtml.find('.row')[0]);

        while(currentColors.length > 0) {
            if(itemsCount === perRow) {
                currRow++;
                itemsCount = 0;
                $currentRow = $($newHtml.find('.row')[currRow - 1]);
            }

            $currentRow.append(currentDropSpots.shift());
            $currentRow.append(currentColors.shift());
            itemsCount++;
        }

        var $dropSpot = $('.last-drop-spot');
        $lastRow = $newHtml.find('.row').last();
        $lastRow.append($dropSpot);
        $('.saved-colors-panel').html($newHtml.html());
        eventListeners.makeDraggable();
        eventListeners.makeDroppable();
    },
    colorsPerRow: function(rowWidth) {
        var spaceAfterFirstColor = rowWidth - firstDropSpotSize - savedColorSize;
        return Math.floor(spaceAfterFirstColor / (dropSpotSize + savedColorSize)) + 1;
    },
    startEdit: function($color) {
        var $colorWrapper = $color.parents('.color-wrapper');
        var currentColor = $colorWrapper.attr('data-hex');

        // Enter edit mode, all changes happen to this color
        $('#hex-input').val(currentColor).keyup();
        $colorWrapper.addClass('editing-color');
        $color.attr('data-original-color', currentColor);
        $('#tag-input').val($colorWrapper.find('.saved-tag').html());
        $('.preview-tile').addClass('editing-color');
        $('.color-wrapper').not('.preview-tile, .editing-color').addClass('disabled-color');
        $('.saved-color').draggable('disable');
        $('.edit-color-state').show();
        $('.add-color-state').hide();
        $('.cancel-palette, .save-palette').prop('disabled', true);
        unsavedColorEdits = true;
    },
    hasEditChanges: function(){
        var hasChanges = false;

        var originalColor = $('.saved-color.editing-color .color').attr('data-original-color').toLowerCase();
        var savedHex = $('.saved-color.editing-color .saved-hex').html().substring(1).toLowerCase();
        var savedTag = $('.saved-color.editing-color .saved-tag').html().toLowerCase();

        // ask if changes should be saved
        // if the original color equals the current hex value of the preview tile, no changes need to be saved so just exit
        if(originalColor !== $('.preview-tile').attr('data-hex').toLowerCase()) {
            hasChanges = true;
        }

        if(savedHex !== $('#hex-input').val().toLowerCase()) {
            hasChanges = true;
        }

        if(savedTag !== $('#tag-input').val().toLowerCase()) {
            hasChanges = true;
        }

        return hasChanges;
    },
    endEdit: function() {
        var $color = $('.saved-color.editing-color .color');
        var $colorWrapper = $color.parents('.color-wrapper');

        $colorWrapper.removeClass('editing-color');
        $color.removeAttr('data-original-color');
        $('.preview-tile').removeClass('editing-color');
        $('.color-wrapper').removeClass('disabled-color');
        $('.saved-color').draggable('enable')
        $('.edit-color-state').hide();
        $('.add-color-state').show();
        $('.cancel-palette, .save-palette').prop('disabled', false);
        unsavedColorEdits = false;
    },
    saveEdit: function() {
        $preview = $('.preview-tile');
        var newHex = $preview.attr('data-hex');
        var newRgb = $preview.attr('data-rgb');
        var newTag = $('#tag-input').val();

        var $colorWrapper = $('.saved-color.editing-color');
        var $color = $('.saved-color.editing-color .color');
        $colorWrapper.attr('data-hex', newHex).attr('data-rgb', newRgb);
        $color.css('background-color', '#' + newHex);
        $('.saved-hex', $colorWrapper).html('#' + newHex);
        $('.saved-rgb', $colorWrapper).html(newRgb);
        $('.saved-tag', $colorWrapper).html(newTag);

        this.endEdit();
    }
};

/*----------------------------------------------------------------------------------------------------------------------
*                                            Alert Functions
----------------------------------------------------------------------------------------------------------------------*/
var message = {
    baseHtml: function(title, content) {
        return '<div class="alert alert-dismissable"><button type="button" class="close" data-dismiss="alert">×</button><h4>' + title + '</h4><p>' + content + '</p></div>';
    },
    showWarning: function(title, content) {
        var $baseHtml = $(this.baseHtml(title, content));
        $baseHtml.addClass('alert-warning');
        $('.alert-container').html($baseHtml);
        $baseHtml.fadeIn();
    },
    hideAlert: function() {
        $('.alert').fadeOut('slow', function(){
            $(this).html('');
        });
    },
    showSuccess: function(title, content) {
        var $baseHtml = $(this.baseHtml(title, content));
        var $alertContainer = $('.alert-container');
        $baseHtml.addClass('alert-success');
        var dateTime = new Date().getTime();
        $baseHtml.attr('data-time-stamp', dateTime);
        $alertContainer.append($baseHtml);
        var $thisAlert = $alertContainer.find('.alert-success').filter(function(){
             return $(this).attr('data-time-stamp') === dateTime.toString();
         });
        $thisAlert.fadeIn('slow', function(){
            $thisAlert.delay(3000).fadeOut('slow', function(){
                $thisAlert.html('');
            });
        });
    },
    showInfo: function(title, content) {
        var $baseHtml = $(this.baseHtml(title, content));
        var $alertContainer = $('.alert-container');
        $baseHtml.addClass('alert-info');
        var dateTime = new Date().getTime();
        $baseHtml.attr('data-time-stamp', dateTime);
        $alertContainer.append($baseHtml);
        var $thisAlert = $alertContainer.find('.alert-info').filter(function(){
             return $(this).attr('data-time-stamp') === dateTime.toString();
         });
        $thisAlert.fadeIn('slow', function(){
            $thisAlert.delay(3000).fadeOut('slow', function(){
                $thisAlert.html('');
            });
        });
    }
};

/*----------------------------------------------------------------------------------------------------------------------
*                                            Droppable Event Listeners
----------------------------------------------------------------------------------------------------------------------*/
var eventListeners = {
    makeDroppable: function(){
//        $('.color-drop-spot').droppable({
//            accept: '.preview-tile',
//            activeClass: 'ui-state-hover',
//            hoverClass: 'ui-state-active',
//            drop: function(e, ui) {
//                $('.preview-tile').animate({
//                    'top': '0',
//                    'left': '0'
//                });
//                savedColors.addNewColor(null, $('.preview-tile'), true);
//            }
//        });
        $('.reorder-drop-spot').droppable({
            accept: '.preview-tile, .saved-color',
            activeClass: 'ui-state-hover',
            hoverClass: 'ui-state-active',
            drop: function(e, ui) {
                if($(ui.helper.context).hasClass('preview-tile')) {
                    $('.preview-tile').animate({
                        'top': '0',
                        'left': '0'
                    });
                    var position = $(e.target).attr('data-new-pos');
                    savedColors.addNewColor(position, $('.preview-tile'), true);
                }
                else {
                    var position = $(e.target).attr('data-new-pos');
                    var $movedColor = $(ui.helper.context);
                    $(ui.helper.context).remove();
                    savedColors.addNewColor(position, $movedColor, false);
                }
            }
        });
    },
    makeDraggable: function() {
       $('.saved-color').draggable({
           revert: 'invalid'
       });
    }
}