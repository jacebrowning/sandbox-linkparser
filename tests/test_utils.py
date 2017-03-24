# pylint: disable=unused-variable,redefined-outer-name,expression-not-assigned,singleton-comparison

import pytest
from expecter import expect

from project.utils import URL


URL_200 = "http://example.com"
URL_301 = "https://en.wikipedia.org/wiki/react"
URL_404 = "http://example.com/foo/bar"
URL_BAD_SCHEME = "foobar://example.com"
URL_NO_SCHEME = "example.com"
URL_NO_TLD = "http://example"
NON_URL = "example"


def describe_url():

    def describe_status_code():

        @pytest.mark.parametrize("url,valid", [
            (URL_200, 200),
            (URL_301, 301),
            (URL_404, 404),
        ])
        def is_based_on_response_status_code(url, valid):
            expect(URL(url).status_code) == valid

        def is_none_with_invalid_url():
            expect(URL(URL_BAD_SCHEME).status_code) == None


    def describe_valid():

        @pytest.mark.parametrize("url,valid", [
            (URL_200, True),
            (URL_301, True),
            (URL_404, False),
            (URL_BAD_SCHEME, False),
            (URL_NO_SCHEME, False),
            (URL_NO_TLD, False),
            (NON_URL, False),
        ])
        def is_based_on_valid_url_and_success_status(url, valid):
            expect(URL(url).valid) == valid

    def describe_errors():

        def with_valid_url():
            expect(URL(URL_200).errors) == []

        def with_invalid_scheme():
            expect(URL(URL_BAD_SCHEME).errors) == [
                "No connection adapters were found for 'foobar://example.com'"
            ]

        def with_missing_scheme():
            expect(URL(URL_NO_SCHEME).errors) == [
                "Invalid URL 'example.com': No schema supplied. Perhaps you meant http://example.com?"
            ]

        def with_missing_tld():
            expect(URL(URL_NO_TLD).errors) == [
                "Unable to connect to domain."
            ]

        def with_non_url():
            expect(URL(NON_URL).errors) == [
                "Invalid URL 'example': No schema supplied. Perhaps you meant http://example?"
            ]


def describe_filter_invalid_urls():
    pass
