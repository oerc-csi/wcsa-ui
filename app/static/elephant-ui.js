function personInput(thisItem) { 
    var val = $(thisItem).val();
    previewHtml = "";
    $(".controls .button").css("visibility", "hidden");
    if (val.length > 2) {  // dont fire on short input to prevent enormous lists
        var re = new RegExp(val, "i");
        personNames = Object.keys(persons)
        includePersons = personNames.filter(function(val) { 
            return re.test(val);
        });
        previewHtml = "";
        for(p in includePersons) { 
            previewHtml += '<div class="pperson" title="' + persons[includePersons[p]] + '"> '+ '<i class="fa fa-eye-slash" onclick="toggleListExclusion(this)"></i> <span onclick="toggleSelect(this)">' + includePersons[p] + '</span></div>\n';
        }
        $("#preview .persons").html(previewHtml);
        $(".controls .button").css("visibility", "visible");
    }

    $("#preview .persons").html(previewHtml);
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

function toggleSelect(element) {
    $(element).parent().toggleClass("selected")
}


function toggleListExclusion(element) { 
    if($(element).hasClass("fa-eye-slash")) { 
        // unlist this item
        $(element).removeClass("fa-eye-slash");
        $(element).addClass("fa-eye");
        $(element).parent().addClass("unlisted");
    } else { 
        // relist this item
        $(element).removeClass("fa-eye");
        $(element).addClass("fa-eye-slash");
        $(element).parent().removeClass("unlisted");
    }
}


function includeSelected(element) { 
    // include all selected persons in our query
    includedPersons = $("#personsInQuery").html();
    alreadyIncluded = [];
    $("#personsInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    console.log(alreadyIncluded);
    $("#preview .persons .pperson.selected").each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPersons += '<div title="' + $(this).attr("title") + '" onclick="removeFromQuery(this)"> Works by: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#personsInQuery").html(includedPersons);
}

function includeListed(element) { 
    // include all listed persons in our query
    // TODO refactor with above includeSelected function
    includedPersons = $("#personsInQuery").html();
    alreadyIncluded = [];
    $("#personsInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    console.log(alreadyIncluded);
    $("#preview .persons .pperson:not(.unlisted)").each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPersons += '<div title="' + $(this).attr("title") + '" onclick="removeFromQuery(this)"> Works by: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#personsInQuery").html(includedPersons);
}

function removeFromQuery(element) { 
    if(confirm("Removing from workset\n" + $(element).html() + "\nAre you sure?")) { 
        $(element).remove();
    }
}


$(document).ready(function() { 
    $("#person").val("");
});
