#!/usr/bin/env node

const { program } = require('@caporal/core');
const yeoman = require('yeoman-environment');
const validatePackageName = require('validate-npm-package-name');

program
    .argument('<app name>', 'ScandiPWA package name to create', {
        validator: (value) => {
            const name = value.startsWith('@') ? value : value.split('/').pop();

            const {
                validForNewPackages: isValidPackageName = true,
                errors = []
            } = validatePackageName(name);

            if (isValidPackageName) {
                return value;
            }

            if (errors.length) {
                throw new Error(
                    `The package name '${ value }' breaks following rules: \n`
                    + errors.map((e, i) => `${ ++i }) ${ e }`).join('\n')
                );
            }

            throw new Error('The package name is invalid!');
        }
    })
    .option('--template <type>', 'Template to use', {
        default: 'theme',
        validator: ['theme', 'magento']
    })
    .action(({ args: { appName: name }, options: { template } }) => {
        const env = yeoman.createEnv();
        env.register(require.resolve(`generator-scandipwa/generators/${ template }/index.js`));
        env.run(`scandipwa:${ template } ${ name }`);
    });

program.run();
