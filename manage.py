#!/usr/bin/env python
import os
from app import create_app, create_socketio, get_websocket_handlers
from flask.ext.script import Manager, Shell
from flask.ext.socketio import emit

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
socketio = create_socketio(app)
handlers = get_websocket_handlers()
manager = Manager(app)

def make_shell_context():
    return dict(app=app)

manager.add_command("shell", Shell(make_context=make_shell_context))


@manager.command
def runserver():
    socketio.run(app)

@socketio.on('clientConnectionEvent')
def client_connection_event(message):
    print message

@socketio.on('constructWorksetRequest')
def create_workset_request(message): 
    print handlers['createWorkset'](message, "construct")
    emit('constructWorksetHandled', message)

if __name__ == '__main__':
    manager.run()
