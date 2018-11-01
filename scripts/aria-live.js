var TemplateAccessible = {
    init : function (options) {
        this.triggerEmClassChangeAccessible();
        this.triggerMandatoryUpdate();
        this.triggerRelevanceOnOff();
    },
    triggerEmClassChangeAccessible: function () {
        $(document).on('classChangeError','.ls-em-tip', function () {
            if($(this).attr("role") != "alert") {
                parent = $(this).parent('.ls-question-help');
                $(this).closest(".question-container").find("[aria-describedby*='ls-question-help-']").attr("aria-invalid",true);
                $(this).attr("role","alert");
            }
        });
       $(document).on('classChangeGood','.ls-em-tip', function () {
            $(this).removeAttr("role");
            if($(this).parent('.ls-question-help').find(".ls-em-error").length == 0) {
                $(this).closest(".question-container").find("[aria-describedby*='ls-question-help-']").removeAttr("aria-invalid");
            }
        });
    },
    triggerMandatoryUpdate: function() {
        /* @todo #1 add (and remove) required to dropdown, input:text, input:radio and textarea according to relevance */
        /* @todo #2 dynamic "aria-invalid" on group for checkbox (multiple choice and array-number / checkbox */
        /* @todo #3 dynamic "aria-invalid" on dropdown, input:text and textarea */
    },
    triggerRelevanceOnOff: function() {
        this.triggerRelevanceOnOffQuestion();
        this.triggerRelevanceOnOffSubQuestion();
    },
    triggerRelevanceOnOffQuestion: function() {
        $(document).on('relevance:on',"[id^='question']",function(event,data) {
            /* @todo : attach only to this. Use http://stackoverflow.com/a/6411507/2239406 solution for now. 
            Don't want to stop propagation. */
            if(event.target != this) return;
            if($(this).attr("hidden")) {
                $(this).attr("aria-live",'polite');
            }
            $(this).attr("hidden",false);
            $(this).attr("aria-hidden",false);
        });
        $(document).on('relevance:off',"[id^='question']",function(event,data) {
            if(event.target != this) return;
            if(!$(this).attr("hidden")) {
                $(this).attr("aria-live",'polite');
            }
            $(this).attr("hidden",true);
            $(this).attr("aria-hidden",true);
        });
    },
    triggerRelevanceOnOffSubQuestion: function() {
        this.hideQuestionWithRelevanceSubQuestion();
        $("[id^='question']").on('relevance:on',"[id^='javatbd']",function(event,data) {
            if(event.target != this) return;
            data = $.extend({style:'hidden'}, data);
            if(data.style=='disabled'){
                if($(event.target).attr("aria-disabled")) {
                    $(event.target).attr("aria-live",'polite');
                }
                $(event.target).attr("aria-disabled",false);
            }
            if(data.style=='hidden'){
                if($(event.target).attr("hidden")) {
                    $(event.target).attr("aria-live",'polite');
                }
                $(event.target).attr("hidden",false);
                $(event.target).attr("aria-hidden",false);
            }
        });
        $("[id^='question']").on('relevance:off',"[id^='javatbd']",function(event,data) {
            if(event.target != this) return;
            data = $.extend({style:'hidden'}, data);
            if(data.style=='disabled'){
                if(!$(event.target).attr("aria-disabled")) {
                    $(event.target).attr("aria-live",'polite');
                }
                $(event.target).attr("aria-disabled",true);
            }
            if(data.style=='hidden'){
                if(!$(event.target).attr("hidden")) {
                    $(event.target).attr("aria-live",'polite');
                }
                $(event.target).attr("hidden",true);
                $(event.target).attr("aria-hidden",true);
            }
        });
    },
    hideQuestionWithRelevanceSubQuestion: function () {
        if(!jQuery.isFunction(window.TemplateCoreClass) ) {
            // console.log("TemplateCoreClass seems not loaded");
            return;
        }
        $("[id^='question']:not(.ls-irrelevant)").on('relevance:on', "[id^='javatbd']", function (event, data) {
            if (event.target != this) return; // not needed now, but after (2016-11-07)
            data = $.extend({style:'hidden'}, data);
            if (data.style == 'hidden') {
                var targetQuestion = $(this).closest("[id^='question']");
                if($(targetQuestion).attr("hidden")) {
                    $(targetQuestion).attr("aria-live",'polite');
                }
                $(targetQuestion).attr("hidden",false);
                $(targetQuestion).attr("aria-hidden",false);
            }
        });
        $("[id^='question']:not(.ls-hidden)").on('relevance:off', "[id^='javatbd']", function (event, data) {
            if (event.target != this) return; // not needed now, but after (2016-11-07)
            data = $.extend({style:'hidden'}, data);
            if (data.style == 'hidden') {
                var targetQuestion = $(this).closest("[id^='question']");
                if ($(targetQuestion).find("[id^='javatbd']:visible").length == 0) {
                    if(!$(targetQuestion).attr("hidden")) {
                        $(targetQuestion).attr("aria-live",'polite');
                    }
                    $(targetQuestion).attr("hidden",true);
                    $(targetQuestion).attr("aria-hidden",true);
                }
            }
        });
    }
}
