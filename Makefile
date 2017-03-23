.PHONY: all
all: install

# DEPENDENCIES #################################################################

export PIPENV_SHELL_COMPAT=true
export PIPENV_VENV_IN_PROJECT=true

PYTHON_PACKAGES := .venv/.installed
NODE_MODULES := node_modules/.installed
BOWER_COMPONENTS := project/static/bower_components/.installed

PIP := .venv/bin/pip
BOWER := node_modules/bower/bin/bower

.PHONY: install
install: $(PYTHON_PACKAGES) $(NODE_MODULES) $(BOWER_COMPONENTS)

$(PYTHON_PACKAGES): Pipfile* $(PIP)
	pipenv install --dev
	pipenv run pip install MacFSEvents || pipenv run pip install pyinotify || pipenv run pip install pywin32
	@ touch $@

$(PIP):
	pipenv --python=python3.6

$(NODE_MODULES): package.json
	npm install
	@ touch $@

$(BOWER_COMPONENTS): bower.json $(BOWER)
	$(BOWER) install
	@ touch $@

$(BOWER): $(NODE_MODULES)

# BUILDERS #####################################################################

GULP := node_modules/gulp/bin/gulp.js

.PHONY: build
build: install
	$(GULP) build

.PHONY: watch
watch: install
	$(GULP) clean
	pipenv run sniffer

# RUNNERS ######################################################################

.PHONY: run
run: install build
	status=1; while [ $$status -eq 1 ]; do pipenv run python project/app.py; status=$$?; sleep 1; done

.PHONY: run-prod
run-prod: install
	pipenv shell -c "heroku local; exit $$?"

# CHECKS #######################################################################

.PHONY: check
check: install
	pipenv run pylint project tests --rcfile=.pylint.ini

# TESTS ########################################################################

.PHONY: test
test: install
	pipenv run pytest

# CLEANUP ######################################################################

.PHONY: clean
clean:
	$(GULP) del
	rm -rf project/static/bower_components
	rm -rf node_modules
	rm -rf .venv
