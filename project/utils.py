import requests


class URL:
    """Stores validation results for a particular URL."""

    def __init__(self, url):
        self._url = url
        self.status_code = None
        self.valid = None

    def __str__(self):
        return self._url

    def validate(self):
        """Update validation fields based on URL response."""
        response = requests.get(self._url)

        self.status_code = response.status_code
        self.valid = self._is_successful(self.status_code)

        return self.valid

    @staticmethod
    def _is_successful(code):
        return 200 <= code < 400


def check_url(value):
    url = URL(value)

    url.validate()

    return url
