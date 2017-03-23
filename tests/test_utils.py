# pylint: disable=unused-variable,redefined-outer-name,expression-not-assigned,singleton-comparison

import pytest
from expecter import expect

from project.utils import URL, check_url


@pytest.fixture
def valid_url_with_200():
    return "http://example.com/"


@pytest.fixture
def valid_url_with_404():
    return "http://example.com/foobar"


def describe_url():

    def describe_status_code():

        def when_200(valid_url_with_200):
            url = URL(valid_url_with_200)
            url.validate()

            expect(url.status_code) == 200

        def when_404(valid_url_with_404):
            url = URL(valid_url_with_404)
            url.validate()

            expect(url.status_code) == 404


def describe_check_url():

    def with_valid_url(valid_url_with_200):
        response = check_url(valid_url_with_200)

        expect(response.valid) == True

    def with_valid_url_but_not_found(valid_url_with_404):
        response = check_url(valid_url_with_404)

        expect(response.valid) == False



def describe_check_urls():
    pass
