function personInput(thisItem) { 
    var val = $(thisItem).val();
    if (val.length > 2) {  // dont fire on short input to prevent enormous lists
        var re = new RegExp(val, "i");
        personNames = Object.keys(persons)
        includePersons = personNames.filter(function(val) { 
            return re.test(val);
        });
        previewHtml = "";
        for(p in includePersons) { 
            previewHtml += '<div id="pperson" title="' + persons[includePersons[p]] + '">' + includePersons[p] + '</div>\n';
        }
        $("#preview").html(previewHtml);
           
    }
}


function expandItems(thisItem) { 
    if($(thisItem).find("i").hasClass("fa-plus-square-o")) {
        // we need to expand the items
        $(thisItem).children(".works").slideDown("fast");
        // and change the icon to afford contracting rather than expanding
        $(thisItem).find("i").removeClass("fa-plus-square-o");
        $(thisItem).find("i").addClass("fa-minus-square-o");
    } else { 
        // we need to contract the items
        $(thisItem).children(".works").slideUp("fast");
        // and change the icon to afford expanding rather than contracting 
        $(thisItem).find("i").removeClass("fa-minus-square-o");
        $(thisItem).find("i").addClass("fa-plus-square-o");
    }
}

$(document).ready(function() { 
    $("#person").val("");
});
