#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const get = require('lodash.get');
const set = require('lodash.set');
const inquirer = require('inquirer');
const semver = require('semver');

const ARGS = {
	FILE_PATH: '--file',
	PROP_PATH: '--key',
	PATCH: '--patch',
	PRERELEASE: '--prerelease',
	MINOR: '--minor',
	MAJOR: '--major'
};

const getFilePath = (file) => path.resolve(process.cwd(), file);
const getFile = (file) => JSON.parse(fs.readFileSync(getFilePath(file)));
const setFile = (file, json) => fs.writeFileSync(getFilePath(file), JSON.stringify(json, null, 2), 'utf8');
const getArg = (argName) => {
	const arg = process.argv.find((arg) => arg.startsWith(argName));
	if (!arg) return;
	return arg.replace(`${argName}=`, '') || true;
};

const versionFile = getArg(ARGS.FILE_PATH) || './package.json';
// .version will be the default for package.json projects
const versionPath = getArg(ARGS.PROP_PATH) || 'version';

const config = getFile(versionFile);
const currentVersion = get(config, versionPath);
const setNextFile = (nextVersion) => {
	setFile(versionFile, set(config, versionPath, nextVersion));
	console.log();
	console.log(`New version: ${nextVersion}`);
	console.log();
};

if (!currentVersion) throw new Error('Current version not set.');

const versions = {
	prerelease: semver.inc(currentVersion, 'prerelease', 'rc'),
	patch: semver.inc(currentVersion, 'patch'),
	minor: semver.inc(currentVersion, 'minor'),
	major: semver.inc(currentVersion, 'major')
};

console.log();
console.log(`Current version: ${currentVersion}`);
console.log();

if (getArg(ARGS.PRERELEASE)) {
	setNextFile(versions.prerelease);
	process.exit(0);
}

if (getArg(ARGS.PATCH)) {
	setNextFile(versions.patch);
	process.exit(0);
}

if (getArg(ARGS.MINOR)) {
	setNextFile(versions.minor);
	process.exit(0);
}

if (getArg(ARGS.MAJOR)) {
	setNextFile(versions.major);
	process.exit(0);
}

inquirer
	.prompt([
		{
			type: 'list',
			name: 'nextVersion',
			message: 'Update version to',
			choices: [
				{ name: `Prerelease:  ${versions.prerelease}`, value: versions.prerelease },
				{ name: `Patch:       ${versions.patch}`, value: versions.patch },
				{ name: `Minor:       ${versions.minor}`, value: versions.minor },
				{ name: `Major:       ${versions.major}`, value: versions.major },
				{ name: `Don't update.`, value: null }
			]
		}
	])
	.then((answer) => {
		if (!answer.nextVersion) return process.exit(0);
		setNextFile(answer.nextVersion);
		process.exit(0);
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
