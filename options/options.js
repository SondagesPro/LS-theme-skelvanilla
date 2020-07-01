
var ThemeOptions = function(){
    "use strict";
    //////////////////
    // Define necessary globals

    // general_inherit_active is not present at global level
    // see: https://github.com/LimeSurvey/LimeSurvey/blob/1cbfa11b081f54763b28364472926b155efea5dc/themes/survey/vanilla/options/options.twig#L71
    var inheritPossible = ($('#general_inherit_active').length > 0 );

    //get option Object from Template configuration options
    var optionObject = {"general_inherit" : 1};

    //get the global form
    var globalForm = $('.action_update_options_string_form');


    /////////////////
    // Define methods run on startup
    
    // #TemplateConfiguration_options is the id of the Options field in advanced option
    // getter for generalInherit
    var generalInherit = function(){
        return $('#TemplateConfiguration_options').val() === 'inherit';
    };

    //parse the options as set in the advanced form
    var parseOptionObject = function(){
        // If no general inherit, then pass the value of the "Options" field in advanced option to the object optionObject
        if($('#TemplateConfiguration_options').length>0 && !generalInherit()){
            try{
                optionObject = JSON.parse($('#TemplateConfiguration_options').val());
            } catch(e){
                console.ls ? console.ls.error('No valid option field!') : console.log('No valid option field!');
            }
        }
    };

    // Show/Hide fields on generalInherit
    // To hide a simple option on generalInherit: just add the class "action_hide_on_inherit" to the rows continaing it
    var startupGeneralInherit = function(){
        if(!inheritPossible) return false;

        if (generalInherit()){
            $('#general_inherit_on').prop('checked',true).trigger('change').closest('label').addClass('active');
            $('.action_hide_on_inherit').addClass('hidden');
        } else {
            $('#general_inherit_off').prop('checked',true).trigger('change').closest('label').addClass('active');

        }
    };

    // So this function find the selectors in the forum, and pass their values to the advanced options
    var updateFieldSettings = function(){
        if($('#general_inherit_on').prop('checked')){
            $('#TemplateConfiguration_options').val('inherit');
            return;
        }
        globalForm.find('.selector_option_value_field').each(function(i,item){
            //disabled items should be inherit or false
            if($(item).prop('disabled')){
                $(item).val((inheritPossible ? 'inherit' : false));
            }
            optionObject[$(item).attr('name')] = $(item).val();
        });

        globalForm.find('.selector_option_radio_field').each(function(i,item){
            //disabled items should be inherit or false
            if($(item).prop('disabled')){
                $(item).val((inheritPossible ? 'inherit' : false));
            }
            if($(item).attr('type') == 'radio'){
                if($(item).prop('checked')){
                    optionObject[$(item).attr('name')] = $(item).val();
                }
            }
        });
        globalForm.find('.text_option_string_field').each(function(i,item){
            if($(item).val() == "" && $(item).attr('placeholder')) {
                optionObject[$(item).attr('name')] = 'inherit';
            } else {
                optionObject[$(item).attr('name')] = $(item).val();
            }
        });
        var newOptionObject = $.extend(true, {}, optionObject);
        delete newOptionObject.general_inherit;
        $('#TemplateConfiguration_options').val(JSON.stringify(newOptionObject));
    };

    var updateThemeSettings = function(){
        if($('#general_inherit_on').prop('checked')){
            $('#TemplateConfiguration_cssframework_css').val('inherit');
            $('#TemplateConfiguration_cssframework_js').val('inherit');
            return;
        }
        var selectedCss = $("#simple_edit_options_theme").val();
        if (selectedCss == "inherit") {
            $('#TemplateConfiguration_cssframework_css').val('inherit');
            return;
        }
        var cssFrameworkCss = {};
        cssFrameworkCss.replace = [["css/bootstrap.css",selectedCss]];
        $('#TemplateConfiguration_cssframework_css').val(JSON.stringify(cssFrameworkCss));
    };
    ///////////////
    // Utility Methods
    // -- small utilities i.g. for images or similar, or very specialized functions
    
    //Disables image previews when the image selector is set to inherit
    var disableImagePreviewIfneeded = function(item){
        // Image selectors are disabled on inherit
        if($(item).hasClass('selector_image_selector')){
            if($(item).val() == 'inherit'){
                $('button[data-target="#'+$(item).attr('id')+'"]').prop('disabled',  true);
            } else {
                $('button[data-target="#'+$(item).attr('id')+'"]').prop('disabled',  false);
            }
        }
    };

    //Parses the option value for an item
    var parseOptionValue = function(item, fallbackValue){
        fallbackValue = fallbackValue || false;
        // If general inherit, then the value of the dropdown is inherit, else it's the value defined in advanced options
        var itemValue = generalInherit() ? 'inherit' : optionObject[$(item).attr('name')];
        // If anything goes wrong (manual edit or anything else), we make sure it will have a correct value
        if(itemValue == null || itemValue == undefined){
            itemValue = inheritPossible ? 'inherit' : fallbackValue;
            optionObject[$(item).attr('name')] = itemValue;
        }
        return itemValue;
    };
    
    //Set value and propagate to bootstrapSwitch
    var setAndPropageteToSwitch = function(item){
        $(item).prop('checked', true).trigger('change');
        $(item).closest('label').addClass('active');
    };


    ///////////////
    // Parser methods
    // -- These methods will either parse through existing fields, or set existing fields to their correct values

    // Update values in the form to the template options
    // selector_option_value_field are the select dropdown (like variations and fonts)
    var prepareSelectField = function(){
        globalForm.find('.selector_option_value_field').each(function(i,item){
            var itemValue = parseOptionValue(item, 'off');
            $(item).val(itemValue).trigger("change");
            disableImagePreviewIfneeded(item);
        });
    };

    var prepareTextField = function(){
        globalForm.find('.text_option_string_field').each(function(i,item){
            var itemValue = parseOptionValue(item);
            $(item).val(itemValue);
        });
    };

    // Generate the state of switches (On/Off/Inherit)
    var parseParentSwitchFields = function(){
        globalForm.find('.selector_option_radio_field').each(function(i,item){
            var defaultValue = 'off';
            if($(item).closest('[role="radiogroup"]').length && $(item).closest('[role="radiogroup"]').data("default")) {
                defaultValue = $(item).closest('[role="radiogroup"]').data("default");
            }
            var itemValue = parseOptionValue(item, defaultValue);
            //if it is a radio selector, check it and propagate the change to bootstrapSwitch
            if($(item).val() == itemValue || (itemValue == '' && $(item).data('default') ==1) ){
                setAndPropageteToSwitch(item);
            }
        });
    };

    var prepareThemeField = function(){
        var cssFrameworkCss = 'inherit';
        if(!inheritPossible) {
            cssFrameworkCss = {};
            cssFrameworkCss.replace = [["bootstrap.css","css/bootstrap.css"]];
        }
        if (typeof optionObject.theme !== 'undefined' && optionObject.theme) {
            if(optionObject.theme == "inherit" && inheritPossible) {
                cssFrameworkCss = 'inherit';
            }
            if(optionObject.theme != "inherit" && optionObject.theme != "off") {
                cssFrameworkCss = {};
                cssFrameworkCss.replace = [["bootstrap.css",optionObject.theme]];
            }
            if(optionObject.theme == "off") {
                optionObject.theme = "css/bootstrap.css";
                $("#simple_edit_options_theme").val("css/bootstrap.css");
            }
        }
        $('#TemplateConfiguration_cssframework_css').val(JSON.stringify(cssFrameworkCss));
    };
    ///////////////
    // HotSwap methods
    // -- These methods connect an input directly to the value in the optionsObject

    // Disable dependent inputs when their parents are set to off, or inherit
    var hotSwapParentRadioButtons = function(){
        // hotswapping the select fields to the radiobuttons
        // If an option is set to off, the attached selectors are disabled
        $('.selector_radio_childfield').each(function(i, selectorItem){
            $('input[name='+$(selectorItem).data('parent')+']').on('change', function(){
                if($(this).val() == 'on' && $(this).prop('checked') == true){
                    $(selectorItem).prop('disabled', false);
                } else {
                    $(selectorItem).prop('disabled', true);
                }

                if($(selectorItem).hasClass('selector_image_selector')){
                    $('button[data-target="#'+$(selectorItem).attr('id')+'"]').prop('disabled',  $(selectorItem).val() == 'inherit');
                }

            });
        });
    };

    // hotswapping the fields
    var hotSwapFields = function(){
        globalForm.find('.selector_option_value_field').on('change', function(evt){ 
            updateFieldSettings(); 
            disableImagePreviewIfneeded(this);
        });
        globalForm.find('.selector_option_radio_field').on('change', updateFieldSettings);
        globalForm.find('.text_option_string_field').on('blur focusout', updateFieldSettings);

    };

    var hotswapGeneralInherit = function(){
        //hotswapping the general inherit
        $('#general_inherit_on').on('change', function(evt){
            $('#TemplateConfiguration_options').val('inherit');
            $('#TemplateConfiguration_cssframework_css').val('inherit');
            $('.action_hide_on_inherit').addClass('hidden');
        });
        $('#general_inherit_off').on('change', function(evt){
            $('.action_hide_on_inherit').removeClass('hidden');
            updateFieldSettings();
            // Didn't know where is set … remove it …
            $("#theme-option-sidebody").height('auto');
        });
    };

    var hotswapThemeField = function(){
        $('#simple_edit_options_theme').on('change', function(evt){
            updateThemeSettings();
        });
    };

    ///////////////
    // Event methods
    // -- These methods are triggered on events. Please see `bind´ method for more information
    var onSaveButtonClickAction = function(evt){
        evt.preventDefault();
        if(generalInherit()){
            $('#TemplateConfiguration_options').val('inherit');
            $('#TemplateConfiguration_cssframework_css').val('inherit');
            $('#TemplateConfiguration_cssframework_js').val('inherit');
            $('#template-options-form').trigger('submit'); // submit the form
        } else {
            //Create a copy of the inherent optionObject
            var newOptionObject = $.extend(true, {}, optionObject);
            newOptionObject.generalInherit = null;
            if( $("#inherited-available-variation").length ) { // Force inherit for available variation (can be updated only in globval or gsid)
                newOptionObject.availablevariations = "inherit";
            }
            //now write the newly created object to the correspondent field as a json string
            $('#TemplateConfiguration_options').val(JSON.stringify(newOptionObject));
            // CSS part
            var selectedCss = $("#simple_edit_options_theme").val();
            if (selectedCss == "inherit") {
                $('#TemplateConfiguration_cssframework_css').val('inherit');
            } else {
                var cssFrameworkCss = {};
                cssFrameworkCss.replace = [["css/bootstrap.css",$('#simple_edit_cssframework').val()]];
                $('#TemplateConfiguration_cssframework_css').val(JSON.stringify(cssFrameworkCss));
            }
            //and submit the form
            $('#template-options-form').trigger('submit');
        }
    };


    ///////////////
    // Instance methods
    var bind = function(){
        //if the save button is clicked write everything into the template option field and send the form
        $('.action_update_options_string_button, #theme-options--submit').on('click', onSaveButtonClickAction);

        //Bind the hotwaps
        hotSwapParentRadioButtons();
        hotSwapFields();
        hotswapThemeField();
        hotswapGeneralInherit();
    };
    
    var run = function(){
        parseOptionObject();

        startupGeneralInherit();

        prepareSelectField();
        prepareTextField();
        parseParentSwitchFields();
        prepareThemeField();
        bind();
        $("#theme-option-sidebody").height('auto');
    };

    return run;
    
};

var prepare = function(){

    var deferred = $.Deferred();

    //activate the bootstrap switch for checkboxes
    $('.action_activate_bootstrapswitch').bootstrapSwitch();

    var themeOptionStarter = new ThemeOptions();
    themeOptionStarter();
    
    setTimeout(function(){ deferred.resolve(); },650);
    return deferred.promise();
};



$(document).off('pjax:scriptcomplete.templateOptions').on('ready pjax:scriptcomplete.templateOptions',function(){
    $('.simple-template-edit-loading').css('display','block');
    prepare().then(function(runsesolve){
        $('.simple-template-edit-loading').css('display','none');
    });

    $('.selector__open_lightbox').on('click', function(e){
        e.preventDefault();
        var imgSrc = $($(this).data('target')).find('option:selected').data('lightbox-src');
        var imgTitle = $($(this).data('target')).val();
        if(!imgSrc) {
            return;
        }
        if(imgTitle) {
            imgTitle = imgTitle.split('/').pop();
        }
        if(imgTitle !== 'inherit'){
            $('#lightbox-modal').find('.selector__title').text(imgTitle);
            $('#lightbox-modal').find('.selector__image').attr({'src' : imgSrc, 'alt': imgTitle});
        }
        $('#lightbox-modal').modal('show');
    });

    var uploadImageBind = new bindUpload({
        form: '#upload_frontend',
        input: '#upload_image_frontend',
        progress: '#upload_progress_frontend',
        onBeforeSend : function(){
            $('.simple-template-edit-loading').css('display','block');
        },
        onSuccess : function(){
            setTimeout(function(){$(document).trigger('pjax:load', {url : window.location.href});}, 2500);
        }
    });
});
