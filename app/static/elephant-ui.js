function personInput(thisItem) { 
    var val = $(thisItem).val();
    previewHtml = "";
    $("#qperson .controls .button").css("visibility", "hidden");
    if (val.length > 2) {  // don't fire on short input to prevent enormous lists
        var re = new RegExp(val, "i");
        personNames = Object.keys(persons)
        includePersons = personNames.filter(function(val) { 
            return re.test(val);
        });
        previewHtml = "";
        for(var p in includePersons) { 
            previewHtml += '<div class="pperson" title="' + persons[includePersons[p]] + '"> '+ '<i class="fa fa-eye-slash" onclick="toggleListExclusion(this)"></i> <span onclick="toggleSelect(this)">' + includePersons[p] + '</span></div>\n';
        }
        $("#qperson .preview .persons").html(previewHtml);
        $("#qperson .controls .button").css("visibility", "visible");
    }

    $(".preview .persons").html(previewHtml);
}

function placeInput(thisItem) { 
    var val = $(thisItem).val();
    previewHtml = "";
    $("#qplace .controls .button").css("visibility", "hidden");
    if (val.length > 2) {  // dont fire on short input to prevent enormous lists
        var re = new RegExp(val, "i");
        var includePlaces = [];
        for (var p in places) { 
            if(re.test(places[p])) { 
                includePlaces.push(places[p]);
            }
        };
        previewHtml = "";
        for(var iP in includePlaces) { 
            previewHtml += '<div class="pplace" title="' + includePlaces[iP] + '"> '+ '<i class="fa fa-eye-slash" onclick="toggleListExclusion(this)"></i> <span onclick="toggleSelect(this)">' + includePlaces[iP] + '</span></div>\n';
        }
        $("#qplace .preview .places").html(previewHtml);
        $("#qplace .controls .button").css("visibility", "visible");
    }

    $("#qplace .preview .places").html(previewHtml);
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


function includeSelectedPersons(element) { 
    // include all selected persons in our query
    includedPersons = $("#personsInQuery").html();
    alreadyIncluded = [];
    $("#personsInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    console.log(alreadyIncluded);
    $("#qperson .preview .persons .pperson.selected").each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPersons += '<div title="' + $(this).attr("title") + '" onclick="removeFromQuery(this)"> Works by: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#personsInQuery").html(includedPersons);
}

function includeListedPersons(element) { 
    // include all listed persons in our query
    // TODO refactor with above includeSelected function
    includedPersons = $("#personsInQuery").html();
    alreadyIncluded = [];
    $("#personsInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    console.log(alreadyIncluded);
    $("#qperson .preview .persons .pperson:not(.unlisted)").each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPersons += '<div title="' + $(this).attr("title") + '" onclick="removeFromQuery(this)"> Works by: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#personsInQuery").html(includedPersons);
}

// TODO refactor all of these includeSelected and includeListed functions down to one
function includeSelectedPlaces(element) { 
    // include all selected places in our query
    includedPlaces = $("#placesInQuery").html();
    alreadyIncluded = [];
    $("#placesInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    console.log(alreadyIncluded);
    $("#qplace .preview .places .pplace.selected").each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPlaces += '<div title="' + $(this).children("span").html() + '" onclick="removeFromQuery(this)"> Publication place: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#placesInQuery").html(includedPlaces);
}

function includeListedPlaces(element) { 
    // include all listed places in our query
    // TODO refactor with above includeSelected function
    includedPlaces = $("#placesInQuery").html();
    alreadyIncluded = [];
    $("#placesInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    $("#qplace .preview .places .pplace:not(.unlisted)").each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPlaces += '<div title="' + $(this).children("span").html() + '" onclick="removeFromQuery(this)"> Publication place: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#placesInQuery").html(includedPlaces);
}

function removeFromQuery(element) { 
    if(confirm("Removing from workset\n" + $(element).html() + "\nAre you sure?")) { 
        $(element).remove();
    }
}


$(document).ready(function() { 
    $("#person").val("");
    $("#place").val("");
});
