'use strict'

const year = new Date().getFullYear()

function getBanner(pluginFilename) {
  return `/*!
  * Bootstrap List Editor v0.0.3 (https://iqbalfn.github.io/bootstrap-list-editor/)
  * Copyright 2020 Iqbal Fauzi
  * Licensed under MIT (https://github.com/iqbalfn/bootstrap-list-editor/blob/master/LICENSE)
  */`
}

module.exports = getBanner