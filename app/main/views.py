from flask import render_template, redirect, url_for, current_app
from flask.ext.socketio import SocketIO, emit
from pprint import pprint
from SPARQLWrapper import SPARQLWrapper, JSON
from rdflib import Graph, plugin, URIRef, Literal
from rdflib.parser import Parser
from rdflib.serializer import Serializer
import json
import re

from . import main

@main.route('/index.html', methods=['GET', 'POST'])
@main.route('/viewer.html', methods=['GET', 'POST'])
@main.route('/viewer', methods=['GET', 'POST'])
@main.route('/', methods=['GET', 'POST'])
def all_worksets():
    worksets = select_worksets()
    return render_template("viewer.html", worksets = worksets)

@main.route('/eeboo/worksets/<workset>', methods=['GET', 'POST'])
def detail_workset(workset):
    ws = "BIND(<{0}> as ?workset) .".format("http://eeboo.oerc.ox.ac.uk/eeboo/worksets/" + workset)
    workset = select_worksets(ws)
    return render_template("workset.html", worksets=workset)

def select_worksets(specific_workset = ""):
    app = current_app._get_current_object()
    sparql = SPARQLWrapper(app.config["ENDPOINT"])
    selectWorksetsQuery = open(app.config["ELEPHANT_QUERY_DIR"] + "select_worksets.rq").read()
    query = selectWorksetsQuery.format(specific_workset)
    sparql.setQuery(query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    worksets = dict()
    for result in results["results"]["bindings"]:
        if result["workset"]["value"] not in worksets:
            worksets[result["workset"]["value"]] = {
                "uri": result["workset"]["value"],
                "urilocal": result["workset"]["value"].replace("http://eeboo.oerc.ox.ac.uk/", "http://127.0.0.1:5000/"),
                "mod_date": result["mod_date"]["value"],
                "title": result["title"]["value"],
                "abstract": result["abstract"]["value"],
                "user": result["username"]["value"],
                "works": list()
            }
        if (result["saltset"]["value"] == "http://127.0.0.1:8890/saltsets/htrc-wcsa_works"): 
            saltset = "htrc-wcsa_works"
        else:
            saltset = "eeboo_works"
        worksets[result["workset"]["value"]]["works"].append(
            {
                "uri": result["work"]["value"], 
                "worktitle": result["worktitle"]["value"], 
                "author": result["author"]["value"],
                "creator": result["creator"]["value"],
                "pubdate": result["pubdate"]["value"],
                "datePrecision": result["datePrecision"]["value"],
                "place": result["place"]["value"],
                "saltset":saltset
            }) 
    
    for workset in worksets:
        worksets[workset]["works"] = sorted(worksets[workset]["works"], key=lambda k: (k["author"], k["worktitle"]))
    return worksets

@main.route('/construct.html', methods = ['GET', 'POST'])
@main.route('/construct', methods = ['GET', 'POST'])
def construct_workset():
    app = current_app._get_current_object()
    sparql = SPARQLWrapper(app.config["ENDPOINT"])
    # Get a list of all eeboo persons plus all HTRC persons who are NOT aligned to eeboo persons
    selectPersonsQuery = open(app.config["ELEPHANT_QUERY_DIR"] + "select_persons.rq").read()
    sparql.setQuery(selectPersonsQuery)
    sparql.setReturnFormat(JSON)
    personResults = sparql.query().convert()
    persons = list()
    for p in personResults["results"]["bindings"]:
        persons.append({ "uri": p["uri"]["value"], "label": p["label"]["value"] })
    # Get a list of all place names, distinct among both datasets
    selectPlacesQuery = open(app.config["ELEPHANT_QUERY_DIR"] + "select_places.rq").read()
    sparql.setQuery(selectPlacesQuery)
    placeResults = sparql.query().convert()
    places = list()
    for p in placeResults["results"]["bindings"]:
        places.append(p["place"]["value"])
    return render_template("construct.html", persons = persons, places = places)






