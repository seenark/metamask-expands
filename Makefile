clean:
	rm -rf dist

compile:
	make clean; \
	node build.config.js; 

cp-packagejson:
	cp package.json dist/package.json

pub:
	npm version patch --no-git-tag-version; \
	npm publish --access public 

libs-compile-publish:
	make clean; \
	make compile; \
	make pub;