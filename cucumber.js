module.exports = {

  default: {
    require: [
      "tests/steps/**/*.ts"
    ],

    requireModule: [
      "ts-node/register"
    ],

    format: [
      "progress",
      "json:reports/cucumber-report.json"
    ],

    publishQuiet: true
  }

};