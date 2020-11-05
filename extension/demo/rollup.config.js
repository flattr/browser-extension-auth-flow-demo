const environment = process.env.TARGET_ENV || 'development'

import {
  chromeExtension,
  simpleReloader,
} from 'rollup-plugin-chrome-extension'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { emptyDir } from 'rollup-plugin-empty-dir'

export default {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    // always put chromeExtension() before other plugins
    chromeExtension(),
    simpleReloader(),
    resolve(),
    commonjs(),
    replace({
      'process.env.TARGET_ENV': JSON.stringify(environment) 
    }),
    emptyDir()
  ],
}
