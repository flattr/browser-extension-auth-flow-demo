const environment = process.env.TARGET_ENV || 'development'

import replace from '@rollup/plugin-replace'
import {
  chromeExtension,
  simpleReloader,
} from 'rollup-plugin-chrome-extension'

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
    replace({
      'process.env.TARGET_ENV': JSON.stringify(environment) 
    })
  ],
}