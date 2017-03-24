"""Configuration file for sniffer."""

from subprocess import call

from sniffer.api import select_runnable, file_validator, runnable


watch_paths = ["project", "tests"]


@select_runnable('run_tests')
@file_validator
def python_files(filename):
    return filename.endswith('.py')


@select_runnable('rebuild_js_from_jsx')
@file_validator
def jsx_files(filename):
    return filename.endswith('.jsx')


@select_runnable('run_tests')
@file_validator
def html_files(filename):
    return filename.split('.')[-1] in ['html', 'css', 'js']


@runnable
def rebuild_js_from_jsx(*_):
    return call(['make', 'build']) == 0


@runnable
def run_tests(*_):
    return call(['make', 'test', 'check']) == 0
