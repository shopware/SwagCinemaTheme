require('@babel/register');

module.exports = (on, config) => {
    // eslint-disable-next-line global-require
    require('cypress-log-to-output').install(on),
    require('cypress-grep/src/plugin')(config);
};