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
            self.errors.append(self._translate_exception(exc))
            self.errors.append(self._translate_code(None)[-1])
        else:
            self.status_code = response.status_code
            success, message = self._translate_code(self.status_code)
            self.valid = success
            if message:
                self.errors.append(message)

    @staticmethod
    def _translate_exception(exc):
        """Translate a 'requests' exception to a user-facing message."""
        if isinstance(exc, requests.exceptions.ConnectionError):
            return "Unable to connect to domain."

        return str(exc)

    @staticmethod
    def _translate_code(code):
        """Determine if an HTTP status code should be consider successful."""
        pattern = "URL responded with a non-successful status code: {}"
        if code:
            success = 200 <= code < 400
            if success:
                message = None
            else:
                message = pattern.format(code)
        else:
            success = False
            message = pattern.format("(no response)")

        return success, message


def filter_invalid_urls(urls):
    """Yield a URL response for each invalid URL."""
    for url in urls:
        # TODO: pool these URL connections
        response = URL(url)
        if not response.valid:
            yield response
