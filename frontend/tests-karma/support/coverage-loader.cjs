// Loader de webpack que instrumenta el código de src/ con istanbul.
// Istanbul agrega contadores a cada línea, función y rama; al terminar las
// pruebas, karma-coverage lee esos contadores (window.__coverage__) y arma el reporte.
const { createInstrumenter } = require('istanbul-lib-instrument')

const instrumenter = createInstrumenter({
  esModules: true,
  produceSourceMap: true,
  parserPlugins: ['jsx'],
})

module.exports = function coverageLoader(source) {
  const codigo = instrumenter.instrumentSync(source, this.resourcePath)
  this.callback(null, codigo, instrumenter.lastSourceMap())
}
