/* register after survey.js : update function needed for table role=presentation */
/* Update lines class when relevance:(on|off)  */
function updateLineClass(line){
    if($(line).hasClass("ls-odd") || $(line).hasClass("ls-even")){
        $(line).closest(".ls-answers").find(".ls-odd:visible,.ls-even:visible").each(function(index){ // not limited to table
            $(this).removeClass('ls-odd ls-even').addClass(((index+1)%2 == 0) ? "ls-odd" : "ls-even");
        });
    }
}
/* Update repeat heading */
function updateRepeatHeading(answers){
    /* Update only (at start) when all hidden line is done : @todo : do it only once */
    console.warn('start');
    $(function() {
        if($(answers).data("repeatHeading") || $(answers).find("tbody").find(".ls-heading").length > 1){
            /* set the data the first time */
            if(!$(answers).data("repeatHeading")){
                var repeatHeading = $(answers).find("tbody:first tr:not(.ls-heading)").length;
                console.warn(repeatHeading);
                $(answers).data("repeatHeading",repeatHeading)
                $(answers).data("repeatHeader",$(answers).find("tbody .ls-heading:not(.ls-header)").filter(":first")[0].outerHTML);
            }else{
                var repeatHeading=$(answers).data("repeatHeading");
            }
            /* can remove the heading and clone this one of thead */
            var header = $(answers).data("repeatHeader");
            $(answers).find("tbody .ls-heading:not(.ls-header)").remove();
            var lines = $(answers).find('tr:visible');
            var max = $(answers).find('tr:visible').length-1;
            $(lines).each(function(index){
                if(index != 0 && index % repeatHeading == 0 && index < max) {
                    $(header).insertAfter($(this));
                }
            });
        }
    });
}
