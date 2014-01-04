function Color(data) {
    var self = this;

    self.hex = ko.observable(data.hex);
    self.rgb = ko.observable(data.rgb);
    self.tag = ko.observable(data.tag);
}

function EditPaletteViewModel() {
    var self = this;

    // Color lists
    self.favorites = ko.observableArray([ "408080", "6F4080", "804062", "404180", "508040" ]);
    self.colors = ko.observableArray([new Color({ hex: "123456", rgb: "rgb(18,52,86)", tag: "start color" })]);

    // Current color values
    self.currentHex = ko.observable("408080");
    self.currentRed = ko.computed({
        read: function(){
            return convert.hexToRgb(self.currentHex())[0];
        },
        write: function(value) {
            self.currentHex(convert.rgbToHex([value, self.currentGreen(), self.currentBlue()]));
        }
    });
    self.currentGreen = ko.computed({
        read: function(){
            return convert.hexToRgb(self.currentHex())[1];
        },
        write: function(value) {
            self.currentHex(convert.rgbToHex([self.currentRed(), value, self.currentBlue()]));
        }
    });
    self.currentBlue = ko.computed({
        read: function(){
            return convert.hexToRgb(self.currentHex())[2];
        },
        write: function(value) {
            self.currentHex(convert.rgbToHex([self.currentRed(), self.currentGreen(), value]));
        }
    });
    self.currentRgb = ko.computed(function(){
        return 'rgb(' + self.currentRed() + ',' + self.currentGreen() + ',' + self.currentBlue() + ')';
    });
    self.currentHue = ko.computed({
        read: function(){
            return convert.rgbToHsv(self.currentRed(), self.currentGreen(), self.currentBlue())[0];
        },
        write: function(value) {
            var rgb = convert.hsvToRgb(value, self.currentSaturation(), self.currentBrightness());
            self.currentRed(rgb[0]);
            self.currentGreen(rgb[1]);
            self.currentBlue(rgb[2]);
        }
    });
    self.currentSaturation = ko.computed({
        read: function(){
            return convert.rgbToHsv(self.currentRed(), self.currentGreen(), self.currentBlue())[1];
        },
        write: function(value) {
            var rgb = convert.hsvToRgb(self.currentHue(), value, self.currentBrightness());
            self.currentRed(rgb[0]);
            self.currentGreen(rgb[1]);
            self.currentBlue(rgb[2]);
        }
    });
    self.currentBrightness = ko.computed({
        read: function(){
            return convert.rgbToHsv(self.currentRed(), self.currentGreen(), self.currentBlue())[2];
        },
        write: function(value) {
            var rgb = convert.hsvToRgb(self.currentHue(), self.currentSaturation(), value);
            self.currentRed(rgb[0]);
            self.currentGreen(rgb[1]);
            self.currentBlue(rgb[2]);
        }
    });
    self.currentTag = ko.observable();

    // Slider positioning
    self.hueSliderTop = ko.computed({
        read: function(){
            var hue = self.currentHue(),
                mult = 256/360;
            return Math.round(((360 - hue) * mult) - 8) + 'px';
        }
    });

    // Color picker positioning and color
    self.colorPickerLeft = ko.computed({
        read: function(){
            var sat = self.currentSaturation();
            return Math.round((sat * 2.56) - 8) + 'px';
        }
    });

    self.colorPickerTop = ko.computed({
        read: function(){
            var bri = self.currentBrightness();
            return Math.round(((100 - bri) * 2.56) - 8) + 'px';
        }
    });

    self.colorPickerBackground = ko.computed(function(){
        var rgb = convert.hsvToRgb(self.currentHue(), 100, 100);
        return 'rgb(' + rgb + ')';
    });

    // Model modification functions
    self.changeCurrentHex = function(color) {
        self.currentHex(color);
    }

    self.toggleFavorite = function(color) {
        if(self.favorites().indexOf(color) > -1) {
            self.favorites.remove(color);
        }
        else {
            self.favorites.push(color);
        }
    }

    self.addColor = function(color) {
        self.colors.push(color);
    }

    self.removeColor = function(color) {
        self.colors.remove(color);
    }

    self.removeAllColors = function() {
        self.colors.removeAll();
    }
}

var viewModel = new EditPaletteViewModel();

ko.applyBindings(viewModel);