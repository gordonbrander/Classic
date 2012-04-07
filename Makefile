NODE_PATH ?= ./node_modules
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs
DOCCO = $(NODE_PATH)/docco/bin/docco
TEST = $(NODE_PATH)/jasmine-node/bin/jasmine-node

all: classic.min.js classic.amd.min.js classic.node.js docs

install:
	mkdir -p node_modules
	npm install

docs:
	$(DOCCO) src/classic.js

test:
	$(TEST) ./spec/

classic.js: lib/std.header.js src/classic.js lib/std.footer.js
	cat > $@ $^

classic.amd.js: lib/amd.header.js src/classic.js lib/amd.footer.js
	cat > $@ $^

classic.node.js: src/classic.js lib/node.exports.js
	cat > $@ $^

%.min.js: %.js Makefile
	$(JS_COMPILER) < $< > $@