# pylint: disable=unused-variable,redefined-outer-name,expression-not-assigned,singleton-comparison

import json

import pytest
from expecter import expect

from project.app import app

from .utils import load


@pytest.fixture
def client():
    return app.test_client()


def describe_validate():

    def with_no_urls(client):
        status, content = load(client.post('/validate'))

        expect(status) == 200
        expect(content) == []

    def with_valid_urls(client):
        params = {
            'urls': [
                "http://example.com",
            ],
        }
        status, content = load(client.post('/validate', data=params))

        expect(status) == 200
        expect(content) == []

    def with_invalid_urls(client):
        params = {
            'urls': [
                "http://example.com",
                "http://example.com/foo/bar",
                "foobar://example.com",
            ],
        }
        response = client.post('/validate', data=params)
        data = json.loads(response.data)

        expect(data) == [
            {
                'url': "http://example.com/foo/bar",
                'status_code': 404,
                'errors': [
                    "URL responded with a non-successful status code: 404",
                ],
            },
            {
                'url': "foobar://example.com",
                'status_code': None,
                'errors': [
                    "No connection adapters were found for 'foobar://example.com'",
                    "URL responded with a non-successful status code: (no response)",
                ],
            },
        ]
