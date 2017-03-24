import logging

import requests


log = logging.getLogger(__name__)


class URL:
    """Stores validation results for a particular URL."""

    def __init__(self, url):
        self._url = url
        self.valid = None
        self.status_code = None
        self.errors = []
        self.validate()

    def __str__(self):
        return self._url

    def reset(self):
        self.valid = None
        self.status_code = None
        self.errors.clear()

    def validate(self):
        """Update validation fields based on URL response."""
        log.info("Validating %s", self)

        self.reset()

        try:
            response = requests.get(self._url, allow_redirects=False)
        except requests.exceptions.RequestException as exc:
            self.valid = False
            self.errors.append(str(exc))
        else:
            self.status_code = response.status_code
            self.valid = self._is_successful(self.status_code)

    @staticmethod
    def _is_successful(code):
        return 200 <= code < 400


def check_url(url):
    return URL(url)
