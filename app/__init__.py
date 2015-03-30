import sys
from flask import Flask, current_app
from config import config
from flask.ext.socketio import SocketIO
from SPARQLWrapper import SPARQLWrapper, JSON, POST
from pprint import pprint
from datetime import datetime
from uuid import uuid4

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app

def create_socketio(app):
    return SocketIO(app)

# websocket handlers:
def createWorkset(params, constructInsert = "construct"):
    app = current_app._get_current_object()
    sparql = SPARQLWrapper(endpoint = app.config["ENDPOINT"]) 
    sparql.setMethod(POST) 
    sparql.setReturnFormat(JSON)
    createWorksetQuery = open(app.config["ELEPHANT_QUERY_DIR"] + "create_workset_full.rq").read()
    # initialize parameters to be slotted into query
    querypersons    = ""
    queryplaces     = ""
    querysubjects   = ""
    querygenres     = ""
    querydates      = ""
    genre_ht = ""
    genre_both = ""
    subject_ht = ""
    subject_both = ""
    subjGenrUnionStart = ""
    subjGenrUnionEnd = ""
    if params["genres"] or params["subjects"]:
	eeboo_only = ""
	subjGenrUnionStart = "{"
	subjGenrUnionEnd = """
	} UNION { 
	?work eeboo:creator ?author ;
	<http://www.loc.gov/mods/rdf/v1#titlePrincipal> ?eeboo_title_bnode .
        ?eeboo_title_bnode rdfs:label ?title .
	}"""
    else: 
	eeboo_only = """
{
?author salt:in_salt_set saltset:eeboo_creators .    

?work eeboo:creator ?author ;
<http://www.loc.gov/mods/rdf/v1#titlePrincipal> ?eeboo_title_bnode .
?eeboo_title_bnode rdfs:label ?title .
} UNION """
    title = params["title"].replace('"', "'")
    abstract = params["abstract"].replace('"', "'")
    # set up parameters according to user's selections in constructor UI
    if params["persons"]: 
        querypersons = "VALUES ?author { \n"
        for p in params["persons"]:
            querypersons += "<" + p.encode('utf-8') + ">\n"
        querypersons += "}\n"
    
    if params["places"]:
        queryplaces = """
{ 
   ?work eeboo:raw_pubplace ?eeplace .
} UNION{ 
   ?work mods:placeOfOrigin ?ht_place_node .
   ?ht_place_node rdfs:label ?htplace .
}
BIND(COALESCE(?eeplace, ?htplace) as ?place) .
VALUES ?place {\n"""
        for p in params["places"]:
            queryplaces += '"' + p.encode('utf-8') + '"^^xsd:string\n'
            queryplaces += '"' + p.encode('utf-8') + '"\n' #FIXME - to handle EEBOO wanting xsd:strings and HT not wanting datatype. 
        queryplaces += "}\n"

    if params["subjects"]:
	subject_ht = """
?subjwork dc:creator ?author .
?subjwork mods:subjectComplex ?subject .
"""
	subject_both = """
?subjwork dc:creator ?ht_author .
?subjwork mods:subjectComplex ?subject .
"""

        querysubjects = """
FILTER(BOUND(?subject)) .
?subject rdfs:label ?subjectLabel .
VALUES ?subjectLabel { \n"""
        for p in params["subjects"]:
            querysubjects += '"' + p.encode('utf-8') + '"\n'
        querysubjects += "}\n"

    if params["genres"]:
	genre_ht = """
?genrwork dc:creator ?author .
?genrwork mods:genre ?genre.
"""
	genre_both = """
?genrwork dc:creator ?ht_author .
?genrwork mods:genre ?genre.
"""
        querygenres = """
FILTER(BOUND(?genre)) .
?genre rdfs:label ?genreLabel
VALUES ?genreLabel { \n"""
        for p in params["genres"]:
            querygenres += '"' + p.encode('utf-8') + '"\n'
        querygenres += "}\n"
    
    if params["dates"]:
        for datetype in params["dates"]: 
            if datetype == "workpub":
                # both EEBOO and HT have publication dates to worry about
                querydates += """
{
    ?work eeboo:precise-publication ?precisepub .
} UNION {
    ?work eeboo:approx-publication ?approxpub .
} UNION { 
    ?work mods:resourceDateIssued ?ht_pubdate . 
    FILTER(DATATYPE(?ht_pubdate) = <xsd:date>).
    BIND(STRDT(STR(?ht_pubdate), xsd:date) as ?ht_pub) .
} 
BIND(COALESCE(?precisepub, ?approxpub, ?ht_pub) as ?pubDate) ."""
                querydates += "\nFILTER("
                for ix, d in enumerate(params["dates"][datetype]):
                    querydates += "?pubDate " + d["daterelation"] + ' "' + d["date"] + '"^^xsd:date' 
                    if ix != len(params["dates"][datetype])-1:
                        querydates += " && "
                querydates += ") .\n"
            # for author-related dates, only worry about EEBOO since we have alignment on person level
            else: 
                nonhyphendt = datetype.replace("-", "")
                querydates += """
{{
    ?author eeboo:precise-{dt} ?precise{nonhyphendt} .
}} UNION {{
    ?author eeboo:approximate-{dt} ?approx{nonhyphendt} .
}}
BIND(COALESCE(?precise{nonhyphendt}, ?approx{nonhyphendt}) as ?{nonhyphendt}) . """.format(dt = datetype, nonhyphendt = nonhyphendt)
                querydates += "\nFILTER("
                for ix, d in enumerate(params["dates"][datetype]):
                    querydates += "?"+ nonhyphendt + " " +d["daterelation"] + ' "' + d["date"] + '"^^xsd:date'
                    if ix != len(params["dates"][datetype])-1:
                        querydates += " && "
                querydates += ") .\n"
                # sparql doesn't like hyphens in variable names...
                querydates.replace("?precisefloruit-start", "?precisefloruitstart").replace("?approxfloruit-start", "?approxfloruitstart").replace("?floruit-start", "?floruitstart").replace("?floruit-end", "?floruitend")

    workseturi = "<http://eeboo.oerc.ox.ac.uk/worksets/workset_" + str(uuid4()).replace("-", "") + ">"
    createWorksetQuery =  createWorksetQuery.format(constructInsert = constructInsert, workseturi = workseturi, created = '"' + datetime.now().isoformat() + '"^^xsd:date', modified =  '"' + datetime.now().isoformat() + '"^^xsd:date', title = '"'+title.encode('utf-8')+'"', abstract = '"'+abstract.encode('utf-8')+'"', user = '"Test user"', authors = querypersons, places = queryplaces, subjects = querysubjects, genres = querygenres, dates = querydates, genre_ht = genre_ht, genre_both = genre_both, subject_ht = subject_ht, subject_both = subject_both, subjGenrUnionStart = subjGenrUnionStart, subjGenrUnionEnd = subjGenrUnionEnd, eeboo_only = eeboo_only)
    sparql.setQuery(createWorksetQuery)
    with open("elephant.log", "a") as logfile:
	logfile.write(createWorksetQuery)
    results = sparql.query().convert()
    return workseturi 

def get_websocket_handlers() : 
    return { 
            "createWorkset": createWorkset
    }

