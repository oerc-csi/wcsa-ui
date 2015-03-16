from flask import render_template, redirect, url_for
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
@main.route('/', methods=['GET', 'POST'])
def index():
   return render_template("viewer.html")
