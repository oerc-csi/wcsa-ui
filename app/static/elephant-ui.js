// websocket variable (initialized in $(document).ready) 

var socket;


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
    $("#datesIncludedHeader").css("display", "none");
    var datetype = $("#datetype").val();
    var datetypestr = $("#datetype :selected").html();
    var daterelation = $("#daterelation").val();
    var daterelationstr = $("#daterelation :selected").html();
    var date = $("#date").val();
    if(!date) { 
        return;
    }
    datestr = "Dates: " + datetypestr + " " + daterelationstr + " " + date;
    var includeDates = $("#datesInQuery").html();
    includeDates += '<div onclick="removeFromQuery(this)" title="' + datestr + 
        '" data-datetype="' + datetype + '" data-daterelation="' + daterelation + 
        '" data-date="' + date + '" >' + datestr + '</div>';
    $("#datesInQuery").html(includeDates);
    if(includeDates !== " ") { 
        $("#datesIncludedHeader").css("display", "block");
    }
    $("#date").val("");

    
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
    $("#personsIncludedHeader").css("display", "none");
    includedPersons = $("#personsInQuery").html();
    alreadyIncluded = [];
    $("#personsInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    $(selector).each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPersons += '<div title="' + $(this).attr("title") + '" onclick="removeFromQuery(this)"> Works by: <span>' + $(this).children("span").html() + '</span></div>\n';
        }
    });
    $("#personsInQuery").html(includedPersons);
    if(includedPersons !== " ") { 
        $("#personsIncludedHeader").css("display", "block");
    }
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
    $("#placesIncludedHeader").css("display", "none");
    includedPlaces = $("#placesInQuery").html();
    alreadyIncluded = [];
    $("#placesInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    $(selector).each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedPlaces += '<div title="' + $(this).children("span").html() + '" onclick="removeFromQuery(this)"> Publication place: <span>' + $(this).children("span").html() + '</span></div>\n';
        }
    });
    if(includedPlaces !== " ") { 
        $("#placesIncludedHeader").css("display", "block");
    }
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
    $("#subjectsIncludedHeader").css("display", "none");
    includedSubjects = $("#subjectsInQuery").html();
    alreadyIncluded = [];
    $("#subjectsInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    $(selector).each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedSubjects += '<div title="' + $(this).children("span").html() + '" onclick="removeFromQuery(this)"> Publication subject: <span>' + $(this).children("span").html() + '</span></div>\n';
        }
    });
    if(includedSubjects !== " ") { 
        $("#subjectsIncludedHeader").css("display", "block");
    }
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
    $("#genresIncludedHeader").css("display", "none");
    includedGenres = $("#genresInQuery").html();
    alreadyIncluded = [];
    $("#genresInQuery div").each(function() { 
        alreadyIncluded.push($(this).attr("title"));
    });
    $(selector).each(function() { 
        if(alreadyIncluded.indexOf($(this).attr("title")) < 0) { 
            // only if not already included
            includedGenres += '<div title="' + $(this).children("span").html() + '" onclick="removeFromQuery(this)"> Publication genre: <span>' + $(this).children("span").html() + '</span></div>\n';
        }
    });
    if(includedGenres !== " ") { 
        $("#genresIncludedHeader").css("display", "block");
    }
    $("#genresInQuery").html(includedGenres);

}

function removeFromQuery(element) { 
    if(confirm("Removing from workset\n" + $(element).children("span").html() + "\nAre you sure?")) { 
        if($(element).siblings("div").size() == 0) { 
            // removed the last item of this type
            // so hide the header
            $(element).parent().prev("span").css("display", "none");
        }   
        $(element).remove();
    }
}

function packQuery() { 
    // construct our query parameters based on user's activities in the constructor
    var person_params = [];
    var place_params = [];
    var subject_params = [];
    var genre_params = [];
    var date_params = {};
    var title = $("#workset-title").val().replace('"', "'");
    var description = $("#workset-abstract").val().replace('"', "'");
    if($("#personsInQuery").html()) {
        $("#personsInQuery").children("div").each(function() { 
            person_params.push($(this).attr("title"));
        });
        $("#placesInQuery").children("div").each(function() { 
            place_params.push($(this).attr("title"));
        });
        $("#subjectsInQuery").children("div").each(function() { 
            subject_params.push($(this).attr("title"));
        });
        $("#genresInQuery").children("div").each(function() { 
            genre_params.push($(this).attr("title"));
        });
        $("#datesInQuery").children("div").each(function() { 
            if(typeof date_params[$(this).attr("data-datetype")] === "undefined") {
                date_params[$(this).attr("data-datetype")] = [];
            }
            date_params[$(this).attr("data-datetype")].push(
                {
                    "date": $(this).attr("data-date"),
                    "daterelation": $(this).attr("data-daterelation")
                }
            )
        });
        console.log("Trying to request workset construction");
        socket.emit('createWorksetRequest', {"persons": person_params, "places": place_params, "genres": genre_params, "subjects":subject_params, "dates":date_params, "title":title, "abstract":description});
        console.log("done.");
    }
}

$(document).ready(function() { 
    // set up websocket
    console.log("Trying to connect...");
    socket=io.connect('http://' + document.domain + ':' +  location.port);
    socket.on('connect', function() { 
        socket.emit('clientConnectionEvent', 'Client connected.');
        console.log("Connected to server at http://" + document.domain + ':' + location.port);
    });

    socket.on('createWorksetHandled', function(msg) { 
        console.log("createWorksetHandled: ", msg);
    });
    
    socket.on('createWorksetFailed', function() { 
        console.log("createWorksetFailed :( ");
    });

    $("#person").val("");
    $("#place").val("");
    $("#subject").val("");
    $("#genre").val("");
    $("#date").val("");
    $("#workset-title").val("");
    $("#workset-abstract").val("");
    $("#personsIncludedHeader").css("display", "none");
    $("#placesIncludedHeader").css("display", "none");
    $("#subjectsIncludedHeader").css("display", "none");
    $("#genresIncludedHeader").css("display", "none");
    $("#datesIncludedHeader").css("display", "none");
    $(".preview").css("display", "none");
});
