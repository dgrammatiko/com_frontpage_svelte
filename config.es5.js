import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: false,
    format: 'iife',
    name: 'app',
    file: 'docs/bundle-es5.js'
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write('docs/bundle-es5.css');
      }
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve(),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('docs'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),


    babel({
      externalHelpers: false,
      // exclude: './node_modules/**',
      "presets": [
        [
          "@babel/preset-env",
          {
            modules: false,
            "targets": {
              "browsers": ["last 2 versions", "ie 11"]
            }
          }
        ]
      ]

    })
  ],
};
