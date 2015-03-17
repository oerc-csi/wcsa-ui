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
@main.route('/', methods=['GET', 'POST'])
def viewer():
    app = current_app._get_current_object()
    sparql = SPARQLWrapper(app.config["ENDPOINT"])
    selectWorksetsQuery = open(app.config["ELEPHANT_QUERY_DIR"] + "select_worksets.rq").read()
    sparql.setQuery(selectWorksetsQuery)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    worksets = dict()
    for result in results["results"]["bindings"]:
        if result["workset"]["value"] not in worksets:
            worksets[result["workset"]["value"]] = {
                "uri": result["workset"]["value"],
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
                "saltset":saltset
            }) 
    
    for workset in worksets:
        worksets[workset]["works"] = sorted(worksets[workset]["works"], key=lambda k: (k["author"], k["worktitle"]))
    return render_template("viewer.html", worksets = worksets)

