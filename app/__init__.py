from flask import Flask, current_app
from config import config
from flask.ext.socketio import SocketIO
from SPARQLWrapper import SPARQLWrapper, JSON
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
def createWorkset(params, constructInsert):
    app = current_app._get_current_object()
    sparql = SPARQLWrapper(endpoint = app.config["ENDPOINT"])
    createWorksetQuery = open(app.config["ELEPHANT_QUERY_DIR"] + "create_workset_full.rq").read()
    # initialize parameters to be slotted into query
    querypersons    = ""
    queryplaces     = ""
    querysubjects   = ""
    querygenres     = ""
    querydates      = ""

    title = params["title"].replace('"', "'")
    abstract = params["abstract"].replace('"', "'")
    # set up parameters according to user's selections in constructor UI
    if params["persons"]: 
        querypersons = "\tVALUES ?eeboo_author { \n"
        for p in params["persons"]:
            querypersons += "\t<" + p + ">\n"
        querypersons += "}\n"
    
    if params["places"]:
        queryplaces = """
        ?eeboo_work eeboo:raw_pubplace ?eeboo_place .
        ?ht_work mods:placeOfOrigin ?ht_place_node .
        ?ht_place_node rdfs:label ?ht_place .
        VALUES ?eeboo_place {\n"""
        for p in params["places"]:
            queryplaces += '\t\t "' + p + '"^^<http://www.w3.org/2001/XMLSchema#string>\n'
        queryplaces += """
        \t\t}
        VALUES ?ht_place {\n"""
        for p in params["places"]:
            queryplaces += '\t "' + p + '"\n'
        queryplaces += "\t}\n"

    if params["subjects"]:
        querysubjects = """
        ?ht_work mods:subjectComplex ?subject .
        ?subject rdfs:label ?subjectLabel .
        VALUES ?subjectLabel { \n"""
        for p in params["subjects"]:
            querysubjects += '\t "' + p + '"\n'
        querysubjects += "\t}\n"

    if params["genres"]:
        querygenres = """
        ?ht_work mods:genre ?genre .
        ?genre rdfs:label ?genreLabel .
        VALUES ?genreLabel { \n"""
        for p in params["genres"]:
            querygenres += '\t "' + p + '"\n'
        querygenres += "\t}\n"
    
    if params["dates"]:
        for datetype in params["dates"]: 
            if datetype == "workpub":
                # both EEBOO and HT have publication dates to worry about
                querydates += """
                OPTIONAL {
                    ?eeboo_work eeboo:precise-publication ?precisepub .
                }
                OPTIONAL {
                    ?eeboo_work eeboo:approx-publication ?approxpub .
                }
                BIND(COALESCE(?precisepub, ?approxpub) as ?eeboo_pub) .
                ?ht_work mods:resourceDateIssued ?ht_pubdate.  
                FILTER(DATATYPE(?ht_pubdate) = <xsd:date>).
                BIND(STRDT(STR(?ht_pubdate), xsd:date) as ?ht_pub) ."""
                querydates += "\nFILTER("
                for ix, d in enumerate(params["dates"][datetype]):
                    querydates += "?eeboo_pub " + d["daterelation"] + ' "' + d["date"] + '"^^xsd:date' + " && " + "?ht_pub " + d["daterelation"] + ' "' + d["date"] + '"^^xsd:date'
                    if ix != len(params["dates"][datetype])-1:
                        querydates += " && "
                querydates += ") .\n"
            # for author-related dates, only worry about EEBOO since we have alignment on person level
            else: 
                nonhyphendt = datetype.replace("-", "")
                querydates += """
                OPTIONAL {{
                    ?eeboo_author eeboo:precise-{dt} ?precise{nonhyphendt} .
                }}
                OPTIONAL {{
                    ?eeboo_author eeboo:approximate-{dt} ?approx{nonhyphendt} .
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
    createWorksetQuery =  createWorksetQuery.format(workseturi = workseturi, created = '"' + datetime.now().isoformat() + '"^^xsd:date', modified =  '"' + datetime.now().isoformat() + '"^^xsd:date', title = '"'+title+'"', abstract = '"'+abstract+'"', useruri = '"testuser"', authors = querypersons, places = queryplaces, subjects = querysubjects, genres = querygenres, dates = querydates);
    print createWorksetQuery 
    return workseturi 

def get_websocket_handlers() : 
    return { 
            "createWorkset": createWorkset
    }

