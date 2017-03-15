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
	$(GULP) transform

.PHONY: rebuild
rebuild: install
	status=1; while [ $$status -eq 1 ]; do $(GULP); status=$$?; sleep 1; done

# RUNNERS ######################################################################

.PHONY: run
run: install build
	pipenv run python project/app.py

.PHONY: run-prod
run-prod: install
	pipenv shell -c "heroku local; exit $$?"

# TESTS ########################################################################

.PHONY: test
test: install
	echo "TODO: run tests"

# CLEANUP ######################################################################

.PHONY: clean
clean:
	$(GULP) del
	rm -rf project/static/bower_components
	rm -rf node_modules
	rm -rf .venv
