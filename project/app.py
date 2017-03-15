from flask import Flask, request, render_template
from webargs import flaskparser, fields
import requests


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/proxy')
@flaskparser.use_kwargs({'url': fields.URL()})
def proxy(url):
    response = requests.get(url)
    return response.text


if __name__ == '__main__':
    app.run(debug=True)
