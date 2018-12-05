#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const get = require('lodash.get');
const set = require('lodash.set');
const inquirer = require('inquirer');
const semver = require('semver');

const ARGS = {
	FILE_PATH: '--file',
	PROP_PATH: '--key'
};

const getFilePath = (file) => path.resolve(process.cwd(), file);
const getFile = (file) => JSON.parse(fs.readFileSync(getFilePath(file)));
const setFile = (file, json) => fs.writeFileSync(getFilePath(file), JSON.stringify(json, null, 2), 'utf8');
const getArg = (argName) => {
	const arg = process.argv.find((arg) => arg.startsWith(argName));
	if (!arg) return;
	return arg.replace(`${argName}=`, '');
};

const versionFile = getArg(ARGS.FILE_PATH) || './package.json';
// .version will be the default for package.json projects
const versionPath = getArg(ARGS.PROP_PATH) || 'version';

const config = getFile(versionFile);
const currentVersion = get(config, versionPath);

if (!currentVersion) throw new Error('Current version not set.');

const prerelease = semver.inc(currentVersion, 'prerelease', 'rc');
const patch = semver.inc(currentVersion, 'patch');
const minor = semver.inc(currentVersion, 'minor');
const major = semver.inc(currentVersion, 'major');

console.log();
console.log(`Current version: ${currentVersion}`);
console.log();

inquirer
	.prompt([
		{
			type: 'list',
			name: 'nextVersion',
			message: 'Update version to',
			choices: [
				{ name: `Prerelease:  ${prerelease}`, value: prerelease },
				{ name: `Patch:       ${patch}`, value: patch },
				{ name: `Minor:       ${minor}`, value: minor },
				{ name: `Major:       ${major}`, value: major },
				{ name: `Don't update.`, value: null }
			]
		}
	])
	.then((answer) => {
		if (!answer.nextVersion) return process.exit(0);
		const newConfigFile = set(config, versionPath, answer.nextVersion);
		setFile(versionFile || './package.json', newConfigFile);
		process.exit(0);
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
