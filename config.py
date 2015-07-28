import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a SECRET key that is hard to GUESS!!! (cryptic elephants!)'
    
    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config): 
    DEBUG = True
    BASE_URI = "http://127.0.0.1:8890" # default virtuoso port
    SPARQLUSER = "sparqlusername"
    SPARQLPASSWORD = "sparqlpassword"
    ENDPOINT = "http://127.0.0.1:8890/sparql" # default virtuoso endpoint location
    ELEPHANT_QUERY_DIR = os.environ.get("ELEPHANT_QUERY_DIR") or os.environ.get("HOME") + "/elephant-ui/sparql/"
    USER = "testuser"


config = {
        'development': DevelopmentConfig,
        'default': DevelopmentConfig
}
