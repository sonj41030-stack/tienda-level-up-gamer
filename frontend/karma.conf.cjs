// Configuración de Karma: ejecuta las pruebas de Jasmine (tests-karma/*.spec.jsx)
// en un navegador Chrome real y genera el reporte de cobertura de código.
//
//   npm test                 -> corre todas las pruebas una vez (Chrome sin ventana)
//   npm run test:chrome      -> abre Chrome y vuelve a correr al guardar cambios
//
// El reporte de cobertura queda en coverage-karma/index.html

const path = require('path')

module.exports = function (config) {
  config.set({
    // jasmine = framework de pruebas; webpack = empaqueta los specs con React/JSX
    frameworks: ['jasmine', 'webpack'],

    files: [
      { pattern: 'tests-karma/**/*.spec.js?(x)', watched: false },
      // Las imágenes de public/ se sirven para que las <img> no den error 404
      { pattern: 'public/images/*', included: false, served: true, watched: false },
    ],

    proxies: {
      '/images/': '/base/public/images/',
    },

    preprocessors: {
      'tests-karma/**/*.spec.js?(x)': ['webpack'],
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          // 1) Antes de transformar el JSX, se "instrumenta" el código de src/
          //    con istanbul para medir qué líneas ejecutan las pruebas.
          {
            test: /\.jsx?$/,
            enforce: 'pre',
            include: path.resolve(__dirname, 'src'),
            exclude: [/\.test\.jsx?$/, /setupTests\.js$/, /main\.jsx$/],
            use: path.resolve(__dirname, 'tests-karma/support/coverage-loader.cjs'),
          },
          // 2) Babel transforma el JSX y la sintaxis moderna a JavaScript del navegador.
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
          // Algunas librerías importan archivos sin extensión.
          {
            test: /\.m?js$/,
            resolve: { fullySpecified: false },
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
    },

    // spec = lista cada prueba con ✓ o ✗ en la consola; coverage = reporte de cobertura
    reporters: ['spec', 'coverage'],

    specReporter: {
      suppressSkipped: false,
      showSpecTiming: true,
    },

    coverageReporter: {
      dir: path.resolve(__dirname, 'coverage-karma'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text' },
        { type: 'text-summary' },
        { type: 'lcovonly', file: 'lcov.info' },
      ],
      // Umbral mínimo: si la cobertura baja de esto, Karma marca la ejecución como fallida.
      check: {
        global: { statements: 80, branches: 80, functions: 80, lines: 80 },
      },
    },

    browsers: ['ChromeHeadless'],
    customLaunchers: {
      // Para entornos sin interfaz gráfica (por ejemplo, integración continua en Linux)
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
    },

    singleRun: true,
    autoWatch: false,
    port: 9876,
    browserNoActivityTimeout: 60000,
  })
}
