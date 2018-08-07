import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'aefsfsannngarg21 1fgerf3fp0'
    
    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config): 
    DEBUG = True
    BASE_PATH= "/wcsa"
    SPARQLUSER = "elephant"
    SPARQLPASSWORD = "AOftYDpEakHIVTlLCi2O"
    ENDPOINT = "http://eeboo.oerc.ox.ac.uk/sparql"
    ELEPHANT_QUERY_DIR = os.environ.get("ELEPHANT_QUERY_DIR") or os.environ.get("HOME") + "/wcsa-ui/sparql/"
    USER = "testuser"


config = {
        'development': DevelopmentConfig,
        'default': DevelopmentConfig
}
