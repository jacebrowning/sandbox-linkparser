.PHONY: all
all: install

# DEPENDENCIES #################################################################

export PIPENV_SHELL_COMPAT=true
export PIPENV_VENV_IN_PROJECT=true

PYTHON_PACKAGES := .venv/.installed
NODE_MODULES := node_modules/.installed
BOWER_COMPONENTS := project/static/bower_components/.installed

.PHONY: install
install: $(PYTHON_PACKAGES) $(NODE_MODULES) $(BOWER_COMPONENTS)

$(PYTHON_PACKAGES): Pipfile* $(PIP)
	pipenv install --dev
	@ touch $@

$(PIP):
	pipenv --python=python3.6

$(NODE_MODULES): package.json
	npm install
	@ touch $@

$(BOWER_COMPONENTS): bower.json
	bower install
	@ touch $@

# RUNNERS ######################################################################

.PHONY: run
run: install
	pipenv run python project/app.py

.PHONY: run-prod
run-prod: install
	pipenv shell -c "heroku local; exit $$?"

# TESTS ########################################################################

.PHONY: test
test: install
	echo "TODO: run tests"
