#!/bin/sh

ABSOLUT_PATH="$(dirname "$(dirname "$(readlink -f "$0")")")"
export DEBUG=true

cd "$ABSOLUT_PATH" || exit 1
DEBUG=$DEBUG coverage run ./manage.py test --settings=backend.test_settings
coverage report -m --skip-covered --skip-empty
coverage html --skip-covered
