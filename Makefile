NODE_PATH ?= ./node_modules
MINIFIER = ${NODE_PATH}/uglify-js/bin/uglifyjs
DOCS = ${NODE_PATH}/docco/bin/docco
TEST = ${NODE_PATH}/jasmine-node/bin/jasmine-node
CONCAT = cat > $@ $^

all: classic.min.js classic.amd.min.js classic.node.js docs

install:
	mkdir -p node_modules
	npm install

docs:
	${DOCS} src/classic.js

test:
	${TEST} ./spec/

classic.js: lib/license.js lib/std.header.js src/classic.js lib/std.footer.js
	${CONCAT}

classic.amd.js: lib/license.js lib/amd.header.js src/classic.js lib/amd.footer.js
	${CONCAT}

classic.node.js: lib/license.js src/classic.js lib/node.exports.js
	${CONCAT}

%.min.js: %.js Makefile
	${MINIFIER} < $< > $@