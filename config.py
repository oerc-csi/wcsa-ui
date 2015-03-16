import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or ' adfasfasfaf wf32faardfv dawr32r2ersa'
    
    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config): 
    DEBUG = True
    BASE_URI = "http://127.0.0.1:8890"
    USER = "testuser"


config = {
        'development': DevelopmentConfig,
        'default': DevelopmentConfig
}
