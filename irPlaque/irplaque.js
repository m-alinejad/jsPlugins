/*
 * IrPlaque v1.1.1
 * By Meghdad Alinejad
 * https://github.com/m-alinejad/jsPlugins
 */

function IrPlaque(element, options) {
    var defaults = {
        size: 'larg',
        defaultchar: 'PB',
        typeselector: null,
        validationlabel: null,
        tpl: {
            larg: '<div class="irplaque irplaque-larg"></div>',
            medium: '<div class="irplaque irplaque-medium"></div>',
            small: '<div class="irplaque irplaque-small"></div>'
        },
        types: {
            general: true,
            freeArea: true,
            taxi: true,
            pdi: true,
            none: true
        }
    };
    this.irplaque = this;
    this.element = element;
    this.input = $(this.element);
    this.wrapper = null;
    this.isInit = false;
    this.isDisabled = this.input.attr('disabled') === 'disabled';
    this.settings = $.extend(true, defaults, options, this.input.data());
    this.validationlabel = this.settings.validationlabel;
    this.leftBox = $('<input class="irplaque-left" type="text">');
    this.rightBox = $('<input class="irplaque-right" type="text">');
    this.irBox = $('<input class="irplaque-ir" type="text">');
    this.midBox = $('<select class="irplaque-mid">');
    this.inputText = $('<input class="hidden" type="text">').attr('id', this.input.attr('id') + 'ParsedText').attr('name', this.input.attr('id') + 'ParsedText');;
    this.typeselector = $(this.settings.typeselector);
    this.logoBox = $('<button type="button" class="irplaque-logo"></button>');
    this.popper = $('<div class="irplaque-popper"></div>');
    this.types = [
        { code: '#', title: 'عادی', 	  active: this.settings.types.general },
        { code: '$', title: 'منطقه آزاد', active: this.settings.types.freeArea },
        { code: '%', title: 'تاکسی',      active: this.settings.types.taxi },
        { code: '&', title: 'PDI',        active: this.settings.types.pdi },
        { code: '@', title: 'بدون پلاک',   active: this.settings.types.none }
    ];
    this.areas = [
		{ code: '-', title: '-', cssClass: 'noarea' },
        { code: 'A', title: 'انزلی', cssClass: 'anzali' },
        { code: 'R', title: 'ارس', cssClass: 'aras' },
        { code: 'V', title: 'اروند', cssClass: 'arvand' },
        { code: 'H', title: 'چابهار', cssClass: 'chabahar' },
        { code: 'G', title: 'قشم', cssClass: 'gheshm' },
        { code: 'K', title: 'کیش', cssClass: 'kish' },
        { code: 'M', title: 'ماکو', cssClass: 'maku' }
    ];
    this.groups = {
        diplomat: { code: 'D', title: 'دیپلمات، کنسولگری و سیاسی', bcolor: '#6699cc', fcolor: '#000000' },
        ministary: { code: 'S', title: 'سفارتخانه و نمایندگان', bcolor: '#6699cc', fcolor: '#000000' },

        armed: { code: 'F', title: 'ستاد کل نیروهای مسلح', bcolor: '#0066cc', fcolor: '#ffffff' },
        defence: { code: 'N', title: 'وزارت دفاع و پشتیبانی', bcolor: '#0066cc', fcolor: '#ffffff' },
        army: { code: 'A', title: 'ارتش', bcolor: '#0066cc', fcolor: '#ffffff' },

        protocol: { code: 'R', title: 'تشریفات', bcolor: '#cc0000', fcolor: '#ffffff' },
        goverment: { code: 'G', title: 'دولتی', bcolor: '#cc0000', fcolor: '#ffffff' },

        police: { code: 'O', title: 'پلیس', bcolor: '#006633', fcolor: '#ffffff' },
        sepaah: { code: 'H', title: 'سپاه', bcolor: '#006633', fcolor: '#ffffff' },

        agriculture: { code: 'I', title: 'ادوات کشاورزی', bcolor: '#ffff66', fcolor: '#000000' },
        general: { code: 'L', title: 'عمومی', bcolor: '#ffff66', fcolor: '#000000' },
        taxi: { code: 'X', title: 'تاکسی', bcolor: '#ffff66', fcolor: '#000000' },

        temparory: { code: 'T', title: 'گذر موقت', bcolor: '#ffffff', fcolor: '#000000' },
        veteran: { code: 'V', title: 'معلولان و جانبازان', bcolor: '#ffffff', fcolor: '#000000' },
        personal: { code: 'P', title: 'شخصی', bcolor: '#ffffff', fcolor: '#000000' }
    };
    this.charList = [
        { code: 'GA', title: 'الف', group: this.groups.goverment },
        { code: 'PB', title: 'ب', group: this.groups.personal },
        { code: 'PP', title: 'پ', group: this.groups.police },
        { code: 'XT', title: 'ت', group: this.groups.taxi },
        { code: 'SC', title: 'ث', group: this.groups.sepaah },
        { code: 'PJ', title: 'ج', group: this.groups.personal },
        { code: 'PX', title: 'چ', group: this.groups.personal },
        { code: 'Ph', title: 'ح', group: this.groups.personal },
        { code: 'PK', title: 'خ', group: this.groups.personal },
        { code: 'PD', title: 'د', group: this.groups.personal },
        { code: 'PZ', title: 'ذ', group: this.groups.personal },
        { code: 'PR', title: 'ر', group: this.groups.personal },
        { code: 'AZ', title: 'ز', group: this.groups.army },
        { code: 'Pj', title: 'ژ', group: this.groups.personal },
        { code: 'PC', title: 'س', group: this.groups.personal },
        { code: 'Pc', title: 'ش', group: this.groups.personal },
        { code: 'PS', title: 'ص', group: this.groups.personal },
        { code: 'Pz', title: 'ض', group: this.groups.personal },
        { code: 'Pt', title: 'ط', group: this.groups.personal },
        { code: 'Px', title: 'ظ', group: this.groups.personal },
        { code: 'LA', title: 'ع', group: this.groups.general },
        { code: 'Pq', title: 'غ', group: this.groups.personal },
        { code: 'FF', title: 'ف', group: this.groups.armed },
        { code: 'PQ', title: 'ق', group: this.groups.personal },
        { code: 'IK', title: 'ک', group: this.groups.agriculture },
        { code: 'TG', title: 'گ', group: this.groups.temparory },
        { code: 'PL', title: 'ل', group: this.groups.personal },
        { code: 'PM', title: 'م', group: this.groups.personal },
        { code: 'PN', title: 'ن', group: this.groups.personal },
        { code: 'PH', title: 'ه', group: this.groups.personal },
        { code: 'PV', title: 'و', group: this.groups.personal },
        { code: 'PE', title: 'ی', group: this.groups.personal },
        { code: 'DD', title: 'D', group: this.groups.diplomat },
        { code: 'SS', title: 'S', group: this.groups.ministary },
        { code: 'VV', title: 'V', group: this.groups.veteran }
    ];
    var tMidBox = this.midBox;
    $(this.charList).each(function () {
        $(tMidBox).append(
            $('<option/>',
                {
                    value: this.code,
                    text: this.title,
                    title: this.group.title,
                }
            )
        );
    });

    // Binde Type controller
    var irplaqueObject = this;
    if (this.typeselector.length) {
        var ttypeselector = this.typeselector;
		$($.grep(this.types, t => t.active)).each(function () {
            $(ttypeselector).append(
                $('<option/>',
                    {
                        value: this.code,
                        text: this.title
                    }
                )
            );
        });
        ttypeselector[0].value = this.input[0].value.substr(0, 1);
        ttypeselector.on('change', function (e) {
			
            // noPlaque type handler
            if (e.target.value === '@') {
                irplaqueObject.wrapper.removeClass('free-area');
                irplaqueObject.wrapper.addClass('no-plaque');
                irplaqueObject.input[0].value = '@';
                irplaqueObject.midBox[0].value = "";
				irplaqueObject.leftBox[0].value = "";
				irplaqueObject.rightBox[0].value = "";
				irplaqueObject.getText();
                irplaqueObject.validate();
            } else if (e.target.value === '&') {
                irplaqueObject.wrapper.removeClass('free-area');
                irplaqueObject.wrapper.removeClass('no-plaque');
				irplaqueObject.wrapper.addClass('pdi-plaque');
                irplaqueObject.input[0].value = '&';
                irplaqueObject.midBox[0].value = "";
				irplaqueObject.leftBox[0].value = "";
				irplaqueObject.rightBox[0].value = "";
				irplaqueObject.getText();
                irplaqueObject.validate();
            }
            else {
                if (irplaqueObject.input[0].value === '@' 
				|| irplaqueObject.input[0].value === ''
				|| irplaqueObject.input[0].value.substring(0,1) !== e.target.value
				
				) {
                    irplaqueObject.input[0].value = e.target.value;
                }
                irplaqueObject.wrapper.removeClass('no-plaque');
                irplaqueObject.destroy();
                irplaqueObject.init();
            }
        });
        this.init();
        ttypeselector.trigger('change');
        
    }
    else {
        this.init();
    }
    if (ttypeselector[0].value.trim() === '') ttypeselector[0].value = '#';

}

IrPlaque.prototype.createElements = function () {
    // create the control
	
    this.isInit = true;
    this.input.wrap($(this.settings.tpl[this.settings.size]));
    this.wrapper = this.input.parent();
    this.wrapper.attr('id', this.input.attr('id') + '-wrapper');
    this.input.addClass('hidden');
    this.irBox.insertBefore(this.input);
    this.rightBox.insertBefore(this.irBox);
    this.midBox.insertBefore(this.rightBox);
    this.leftBox.insertBefore(this.midBox);
    this.inputText.insertAfter(this.input);
	
	this.midBox.attr('disabled', '');

    this.leftBox.mask('99');
    this.rightBox.mask('999');
    this.irBox.mask('99');

    var charList = this.charList;
    var wrapper = this.wrapper;
    this.midBox.on('change', function (event) {
        var tmp = charList.find(x => x.code === event.target.value);
        if (typeof(tmp) != undefined && tmp != null) {
            var cgroup = charList.find(x => x.code === event.target.value).group;
            $(wrapper).css('background-color', cgroup.bcolor);
            $(wrapper).css('color', cgroup.fcolor);
        }
    });
    this.midBox[0].value = this.settings.defaultchar;
    this.midBox.trigger('change');



    // set the value handler
    var leftBox = this.leftBox;
    var midBox = this.midBox;
    var rightBox = this.rightBox;
    var irBox = this.irBox;
    var input = this.input;
    var inputText = this.inputText;
    var irplaqueObject = this;

    function getChange(event) {
        input[0].value = irplaqueObject.getValue();;
        inputText[0].value = irplaqueObject.getText();
        irplaqueObject.validate();
        irplaqueObject.input.trigger('change');
    }
    this.leftBox.on('change', getChange);
    this.midBox.on('change', getChange);
    this.rightBox.on('change', getChange);
    this.irBox.on('change', getChange);


    // decode the current value
    this.parseValue();


    // Disable the control 
    if (this.isDisabled) {
        this.disable();
    }
    else {
        this.enable();
    }

    /*if (this.validationlabel) {
        $(this.validationlabel).hide();
    }*/
}

IrPlaque.prototype.createElementsFreeArea = function () {
    // 
    // create the control
    this.isInit = true;
    this.input.wrap($(this.settings.tpl[this.settings.size]));
    this.wrapper = this.input.parent();
    this.wrapper.attr('id', this.input.attr('id') + '-wrapper').addClass('free-area');
    this.input.addClass('hidden');
    this.rightBox.insertBefore(this.input);
    this.leftBox.insertBefore(this.rightBox);
    this.logoBox.insertBefore(this.leftBox);
    this.inputText.insertAfter(this.input);
    this.popper.insertAfter(this.logoBox);
	this.logoBox.addClass('noarea');
    this.leftBox.mask('99999');
    this.rightBox.mask('99');

    var irplaqueObject = this;


    // View labels

    var labelLeft = $('<lable class="irplaque-area-label left">');
    var labelright = $('<lable class="irplaque-area-label right">');

    labelLeft.insertBefore(this.leftBox);
    labelright.insertBefore(this.rightBox);

    function repchar(str) {
        return str
            .replace(/0/g, '۰')
            .replace(/1/g, '۱')
            .replace(/2/g, '۲')
            .replace(/3/g, '۳')
            .replace(/4/g, '۴')
            .replace(/5/g, '۵')
            .replace(/6/g, '۶')
            .replace(/7/g, '۷')
            .replace(/8/g, '۸')
            .replace(/9/g, '۹');
    }


    this.leftBox.on('keyup', function (e) {
        labelLeft.text(repchar(e.target.value));
    });
    this.rightBox.on('keyup', function (e) {
        labelright.text(repchar(e.target.value));
    });
    //Bind popper

    // Create logo popper
    this.popper.html('');
    $(this.areas).each(function () {
        var box = $('<button type="button" class="irplaque-logo">').addClass(this.cssClass)
            .attr('value', this.code)
            .attr('title', this.title)
            .on('click', function () {
                $(irplaqueObject.logoBox)
                    .removeClass('anzali aras arvand chabahar gheshm kish maku noarea')
                    .addClass($(this).attr('class'))
                    .attr('value', $(this).attr('value'))
                    .attr('title', $(this).attr('title'))
                    .trigger('change');
                irplaqueObject.popper.toggle();

            });
        irplaqueObject.popper.append(box);
    });
    irplaqueObject.popper.hide();

    this.logoBox.on('click', function () {
        popper.toggle();
    });


    var pop = new Popper(this.logoBox[0], this.popper[0], {
        placement: 'right'
    });
    this.logoBox.off('click');
    this.logoBox.on('click', function () {
        irplaqueObject.popper.toggle();
    });

    // set the value handler
    var leftBox = this.leftBox;
    var rightBox = this.rightBox;
    var input = this.input;
    var inputText = this.inputText;

    function getChange(event) {
        // 
        input[0].value = irplaqueObject.getValue();
        inputText[0].value = irplaqueObject.getText();;
        irplaqueObject.validate();
        irplaqueObject.input.trigger('change');
    }
    this.leftBox.on('change', getChange);
    this.rightBox.on('change', getChange);
    this.logoBox.on('change', getChange);


    // decode the current value
    this.parseValue();
    labelLeft.text(repchar(this.leftBox[0].value));
    labelright.text(repchar(this.rightBox[0].value));

    // Disable the control 
    if (this.isDisabled) {
        this.disable();
    }
    else {
        this.enable();
    }

    /*if (this.validationlabel) {
        $(this.validationlabel).hide();
    }*/
}

IrPlaque.prototype.createElementsTaxi = function () {
    this.createElements();
    this.midBox[0].value = 'XT';
    this.midBox.attr('disabled', 'disabled');
    this.midBox.trigger('change');
}

IrPlaque.prototype.getValue = function () {

    // 

    var pValue = "#";
    if (this.typeselector.length) {

        if (this.typeselector.hasClass('hidden') || this.typeselector.css('display') === 'none') {
            return this.input[0].value;
        }

        pValue = this.typeselector[0].value;
    }

    // General | Taxi
    if (pValue === '#' || pValue === '%') {
        var ch = this.charList.find(x => x.code === this.midBox[0].value);
        if (ch) {
            pValue += ch.group.code;
            pValue += this.leftBox[0].value;
            pValue += ch.code;
            pValue += this.rightBox[0].value;
            pValue += ':';
            pValue += this.irBox[0].value;
        }
    }
    // Free area
    else if (pValue === '$') {
        pValue += this.logoBox.attr('value');
        pValue += this.leftBox[0].value;
        pValue += ':';
        pValue += this.rightBox[0].value;
    }
    // PDI
    else if (pValue === '&') {
        pValue = '&';
    }
	// No plaque
    else {
        pValue = '@';
    }
    return pValue;
}

IrPlaque.prototype.getText = function () {
    var pValue = "#";
    if (this.typeselector.length) {
        pValue = this.typeselector[0].value;
    }

    // General | Taxi
    if (pValue === '#' || pValue === '%') {
        var ch = this.charList.find(x => x.code === this.midBox[0].value);
        if (ch) {
            pValue += this.leftBox[0].value.padStart(2, '0');
            pValue += ch.title;
            pValue += this.rightBox[0].value.padStart(3, '0');
            pValue += 'ایران';
            pValue += this.irBox[0].value.padStart(2, '0');
        }
    }
    // Free area
    else if (pValue === '$') {
        pValue += this.logoBox.attr('title') + ' ';
        pValue += this.leftBox[0].value.padStart(5, '0');
        pValue += '/';
        pValue += this.rightBox[0].value.padStart(2, '0');
    }
	// PDI
	else if (pValue === '&'){
        pValue = '&PDI';
    }
    // No plaque
    else {
        pValue = '@-';
    }

    this.inputText[0].value = pValue;

    return pValue;


}

IrPlaque.prototype.parseValue = function () {

    var cValue = this.input[0].value;
    if (cValue === '') {
        cValue = '@';
        this.input[0].value = cValue;
    }

    var pValue = cValue.substr(0, 1);

    this.typeselector[0].value = pValue;

    // General | Taxi
    if (pValue === '#' || pValue === '%') {
        this.leftBox[0].value = cValue.substr(2, 2);;
        this.midBox[0].value = cValue.substr(4, 2);;
        this.rightBox[0].value = cValue.substr(6, 3);;
        this.irBox[0].value = cValue.substr(10, 2);;
        this.midBox.trigger('change');
    }
    // Free area
    else if (pValue === '$') {

        var cl = this.areas.find(a => a.code === cValue.substr(1, 1));
        if (cl) {
            this.logoBox.removeClass('anzali aras arvand chabahar gheshm kish maku noarea')
                .addClass(cl.cssClass)
                .attr('title', cl.title)
                .attr('value', cValue.substr(1, 1))
        }
        this.leftBox[0].value = cValue.substr(2, 5);
        this.rightBox[0].value = cValue.substr(8, 2);
    }
    // No value
    else {
        this.leftBox[0].value = '';
        this.midBox[0].value = this.settings.defaultchar;
        this.rightBox[0].value = cValue.substr(6, 3);
        this.irBox[0].value = cValue.substr(10, 2);
        this.logoBox.removeClass('anzali aras arvand chabahar gheshm kish maku')
            .attr('value', '');
        this.leftBox.trigger('change');
    }
    this.getText();
    this.validate();
    this.input.trigger('change');

}

IrPlaque.prototype.setValue = function (value) {
    this.input[0].value = value;
    this.destroy();
    this.init();
}

IrPlaque.prototype.isIrPlaqued = function () {
    return this.isInit;
};

IrPlaque.prototype.destroy = function () {
    if (!this.isInit) return;
    this.input.siblings().remove();
    this.input.unwrap();
    this.isInit = false;
};

IrPlaque.prototype.init = function () {
    if (this.isInit) return;
    var cValue = this.input[0].value.substr(0, 1);

    if ((this.typeselector.length && this.typeselector[0].value === '$') || cValue == '$') {
        this.createElementsFreeArea();
    }
    else if ((this.typeselector.length && this.typeselector[0].value === '%') || cValue == '%') {
        this.createElementsTaxi();
    }
    else {
        this.createElements();
    }
    this.isInit = true;

};

IrPlaque.prototype.toggle = function () {
    this.isDisabled = !this.isDisabled;
    if (this.isDisabled) {
        this.wrapper.find('*').attr('disabled', 'disabled');
    }
    else {
        this.wrapper.find('*').removeAttr('disabled');
    }
};

IrPlaque.prototype.disable = function () {
    this.isDisabled = true;
    this.wrapper.find('*').attr('disabled', 'disabled');
    if (this.typeselector) this.typeselector.hide();
};

IrPlaque.prototype.enable = function () {
    this.isDisabled = false;
    this.wrapper.find('*').removeAttr('disabled');
    if (this.typeselector) this.typeselector.show();
};

IrPlaque.prototype.validate = function () {
    
    var value = this.getValue();
    var type = "#";
    if (this.typeselector.length) {
        type = this.typeselector[0].value;
    }
    var regex = (type === '#') ? /^#\w\d{2}\w{2}\d{3}:\d{2}$/ :
        (type === '%') ? /^%X\d{2}XT\d{3}:\d{2}$/ :
            (type === '$') ? /^\$\w\d{5}:\d{2}$/ :
			   (type === '&') ? /^&$/ :
                /^@$/;
    var result = regex.test(value.trim());

    if (!result) {
        this.input[0].setCustomValidity('شماره پلاک وارد شده معتبر نیست.');
        this.leftBox[0].setCustomValidity('شماره پلاک وارد شده معتبر نیست.');
        if (this.validationlabel) {
            $(this.validationlabel).show().text(this.input[0].validationMessage);
        }
    }
    else {
        this.input[0].setCustomValidity('');
        this.leftBox[0].setCustomValidity('');
        if (this.validationlabel) {
            $(this.validationlabel).hide();
        }
    }
    return result;
}

$.fn['irplaque'] = function (options) {
    this.each(function () {
        if (!$.data(this, 'irplaque')) {
            $.data(this, 'irplaque', new IrPlaque(this, options));
        }
    });

    return this;
};
