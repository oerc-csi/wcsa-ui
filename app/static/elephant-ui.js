function personInput(thisItem) { 
    var val = $(thisItem).val();
    previewHtml = "";
    $("#qperson .controls .button").css("visibility", "hidden");
    $("#qperson .preview").css("display", "none");
    if (val.length > 2) {  // don't fire on short input to prevent enormous lists
        var re = new RegExp(val, "i");
        personNames = Object.keys(persons)
        var includePersons = personNames.filter(function(val) { 
            return re.test(val);
        });
        previewHtml = "";
        for(var p in includePersons) { 
            previewHtml += '<div class="pperson" title="' + persons[includePersons[p]] + '"> '+ '<i class="fa fa-eye-slash" onclick="toggleListExclusion(this)"></i> <span onclick="toggleSelect(this)">' + includePersons[p] + '</span></div>\n';
        }
        $("#qperson .preview .persons").html(previewHtml);
        if(includePersons.length) { 
            $("#qperson .controls .button").css("visibility", "visible");
            $("#qperson .preview").css("display", "block");
        }
    }

    $(".preview .persons").html(previewHtml);
}

function placeInput(thisItem) { 
    var val = $(thisItem).val();
    previewHtml = "";
    $("#qplace .controls .button").css("visibility", "hidden");
    $("#qplace .preview").css("display", "none");
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
        if(includePlaces.length) { 
            $("#qplace .controls .button").css("visibility", "visible");
            $("#qplace .preview").css("display", "block");
        }
    }

    $("#qplace .preview .places").html(previewHtml);
}

function subjectInput(thisItem) { 
    var val = $(thisItem).val();
    previewHtml = "";
    $("#qsubject .controls .button").css("visibility", "hidden");
    $("#qsubject .preview").css("display", "none");
    if (val.length > 2) {  // dont fire on short input to prevent enormous lists
        var re = new RegExp(val, "i");
        var includeSubjects = [];
        for (var p in subjects) { 
            if(re.test(subjects[p])) { 
                includeSubjects.push(subjects[p]);
            }
        };
        previewHtml = "";
        for(var iP in includeSubjects) { 
            previewHtml += '<div class="psubject" title="' + includeSubjects[iP] + '"> '+ '<i class="fa fa-eye-slash" onclick="toggleListExclusion(this)"></i> <span onclick="toggleSelect(this)">' + includeSubjects[iP] + '</span></div>\n';
        }
        $("#qsubject .preview .subjects").html(previewHtml);
        if(includeSubjects.length) {
            $("#qsubject .controls .button").css("visibility", "visible");
            $("#qsubject .preview").css("display", "block");
        }
    }

    $("#qsubject .preview .subjects").html(previewHtml);
}

function genreInput(thisItem) { 
    var val = $(thisItem).val();
    previewHtml = "";
    $("#qgenre .controls .button").css("visibility", "hidden");
    $("#qgenre .preview").css("display", "none");
    if (val.length > 2) {  // dont fire on short input to prevent enormous lists
        var re = new RegExp(val, "i");
        var includeGenres = [];
        for (var p in genres) { 
            if(re.test(genres[p])) { 
                includeGenres.push(genres[p]);
            }
        };
        previewHtml = "";
        for(var iP in includeGenres) { 
            previewHtml += '<div class="pgenre" title="' + includeGenres[iP] + '"> '+ '<i class="fa fa-eye-slash" onclick="toggleListExclusion(this)"></i> <span onclick="toggleSelect(this)">' + includeGenres[iP] + '</span></div>\n';
        }
        $("#qgenre .preview .genres").html(previewHtml);
        if(includeGenres.length) { 
            $("#qgenre .controls .button").css("visibility", "visible");
            $("#qgenre .preview").css("display", "block");
        }
    }

    $("#qgenre .preview .genres").html(previewHtml);
}

function dateInput(element) { 
    var datetype = $("#datetype").val();
    var datetypestr = $("#datetype :selected").html();
    var daterelation = $("#daterelation").val();
    var daterelationstr = $("#daterelation :selected").html();
    var date = $("#date").val();
    datestr = "Dates: " + datetypestr + " " + daterelationstr + " " + date;
    var includeDates = $("#datesInQuery").html();
    includeDates += '<div onclick="removeFromQuery(this)" title="' + datestr + 
        '" data-datetype="' + datetype + '" data-daterelation="' + daterelation + 
        '" data-date="' + date + '" >' + datestr + '</div>';
    $("#datesInQuery").html(includeDates);

    
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
    includePersons(element, "#qperson .preview .persons .pperson.selected");
}

function includeListedPersons(element) { 
    // include all listed persons in our query
    includePersons(element, "#qperson .preview .persons .pperson:not(.unlisted)");
}

function includePersons(element, selector) { 
    includedPersons = $("#personsInQuery").html();
    alreadyIncluded = [];
    $("#personsInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    console.log(alreadyIncluded);
    $(selector).each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPersons += '<div title="' + $(this).attr("title") + '" onclick="removeFromQuery(this)"> Works by: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#personsInQuery").html(includedPersons);
}


function includeSelectedPlaces(element) { 
    // include all selected places in our query
    includePlaces(element, "#qplace .preview .places .pplace.selected");
}

function includeListedPlaces(element) { 
    // include all listed places in our query
    includePlaces(element, "#qplace .preview .places .pplace:not(.unlisted)");
}

function includePlaces(element, selector) { 
    // include all selected places in our query
    includedPlaces = $("#placesInQuery").html();
    alreadyIncluded = [];
    $("#placesInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    $(selector).each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPlaces += '<div title="' + $(this).children("span").html() + '" onclick="removeFromQuery(this)"> Publication place: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#placesInQuery").html(includedPlaces);

}

function includeSelectedSubjects(element) { 
    // include all selected subjects in our query
    includeSubjects(element, "#qsubject .preview .subjects .psubject.selected");
}

function includeListedSubjects(element) { 
    // include all listed subjects in our query
    includeSubjects(element, "#qsubject .preview .subjects .psubject:not(.unlisted)");
}

function includeSubjects(element, selector) { 
    // include all selected subjects in our query
    includedSubjects = $("#subjectsInQuery").html();
    alreadyIncluded = [];
    $("#subjectsInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    $(selector).each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedSubjects += '<div title="' + $(this).children("span").html() + '" onclick="removeFromQuery(this)"> Publication subject: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#subjectsInQuery").html(includedSubjects);

}

function includeSelectedGenres(element) { 
    // include all selected genres in our query
    includeGenres(element, "#qgenre .preview .genres .pgenre.selected");
}

function includeListedGenres(element) { 
    // include all listed genres in our query
    includeGenres(element, "#qgenre .preview .genres .pgenre:not(.unlisted)");
}

function includeGenres(element, selector) { 
    // include all selected genres in our query
    includedGenres = $("#genresInQuery").html();
    alreadyIncluded = [];
    $("#genresInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    $(selector).each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedGenres += '<div title="' + $(this).children("span").html() + '" onclick="removeFromQuery(this)"> Publication genre: ' + $(this).children("span").html() + '</div>\n';
        }
    });
    $("#genresInQuery").html(includedGenres);

}

function removeFromQuery(element) { 
    if(confirm("Removing from workset\n" + $(element).html() + "\nAre you sure?")) { 
        $(element).remove();
    }
}


$(document).ready(function() { 
    $("#person").val("");
    $("#place").val("");
    $("#subject").val("");
    $("#genre").val("");
    $("#date").val("");
    $(".preview").css("display", "none");
});
