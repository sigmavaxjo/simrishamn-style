const {
    src,
    dest,
} = require('gulp');

const dss = require('gulp-docs');
const streamify = require('gulp-streamify');
const Transform = require('stream').Transform;
const Vinyl = require('vinyl');

function convertFileToVinyl() {
    const doSomethingWithTheFile = (input) => {
        return new Vinyl({
            cwd: input.cwd,
            base: input.base,
            path: input.path,
            contents: input._contents,
        });
    }

    // Monkey patch Transform or create your own subclass,
    // implementing `_transform()` and optionally `_flush()`
    var transformStream = new Transform({objectMode: true});
    /**
     * @param {Buffer|string} file
     * @param {string=} encoding - ignored if file contains a Buffer
     * @param {function(Error, object)} callback - Call this function (optionally with an
     *          error argument and data) when you are done processing the supplied chunk.
     */
    transformStream._transform = function(file, encoding, callback) {
      var error = null,
          output = doSomethingWithTheFile(file);
      callback(error, output);
    };

    return transformStream;
  };

function dssSass() {
    return src([
            'source/sass/**/*.scss',
            '!source/sass/themes/*.scss',
            '!source/sass/config/*.scss',
            '!source/sass/_bootstrap.scss'
        ], { base: './' })
        .pipe(
            streamify(
                dss({
                    fileName: "documentation-sass",
                    parsers: {
                        // @state :hover - When the button is hovered over.
                        state: function(i, line, block, file, endOfBlock) {
                            var values = line.split(' - '),
                            states = (values[0]) ? (values[0].replace(":::", ":").replace("::", ":")) : "";

                            return {
                                name: states,
                                escaped: states.replace(":", " :").replace(".", " ").trim(),
                                description: (values[1]) ? values[1].trim() : ""
                            };
                        }
                    }
                })
            )
        )
        .pipe(convertFileToVinyl())
        .pipe(dest('.'));
}

function dssScripts() {
    return src([
            'source/js/**/*.js',
            '!source/js/app.js',
        ], { base: './' })
        .pipe(dss({
            fileName: "documentation-js",
            parsers: {
                // @state :hover - When the button is hovered over.
                state: function(i, line, block, file, endOfBlock) {
                    var values = line.split(' - '),
                    states = (values[0]) ? (values[0].replace(":::", ":").replace("::", ":")) : "";

                    return {
                        name: states,
                        escaped: states.replace(":", " :").replace(".", " ").trim(),
                        description: (values[1]) ? values[1].trim() : ""
                    };
                }
            }
        }))
        .pipe(convertFileToVinyl())
        .pipe(dest('./'));
}

module.exports = {
    dssSass,
    dssScripts,
};
