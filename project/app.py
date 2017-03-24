from flask import Flask, request, render_template, jsonify
from webargs import flaskparser, fields
import requests

from .utils import filter_invalid_urls


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/proxy')
@flaskparser.use_kwargs({'url': fields.URL()})
def proxy(url):
    try:
        response = requests.get(url)
    except IOError:
        return ""
    else:
        return response.text


@app.route('/validate', methods=['POST'])
@flaskparser.use_kwargs({'urls': fields.List(fields.Str(), missing=[])})
def validate(urls):
    data = []

    for url in filter_invalid_urls(urls):
        data.append(serialize(url))

    return jsonify(data)


def serialize(url):
    return {
        'url': str(url),
        'status_code': url.status_code,
        'errors': url.errors,
    }
