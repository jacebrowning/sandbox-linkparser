import os

from flask_script import Manager, Server

from project.app import app


def find_assets():
    """Yield paths for all static files and templates."""
    for name in ['static', 'templates']:
        for entry in os.scandir('project'):
            if entry.is_file():
                yield entry.path

server = Server(host='0.0.0.0',
                use_debugger=True,
                extra_files=find_assets())

manager = Manager(app)
manager.add_command('run', server)


if __name__ == '__main__':
    manager.run()
