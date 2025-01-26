import * as os from 'os'
import path from 'path'
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

const RELEASE_URL = "https://github.com/neovim/neovim/releases/download"

function getReleaseName() {
	switch (os.type()) {
		case 'Linux':
			return "nvim-linux64.tar.gz"
		case 'Darwin':
			return `nvim-macos-${os.machine()}.tar.gz`
		default:
			return "nvim-win64.zip"
	}
}

export async function extractNeovimArchive(archivePath: string): Promise<string> {
	if (os.platform() === 'win32') {
		core.debug('Extracting Neovim zip file');
		return tc.extractZip(archivePath);
	}

	core.debug('Extracting Neovim tar.gz file');
	return tc.extractTar(archivePath);
}

export async function downloadNeovimRelease() {
	const version = core.getInput('neovim_version') || 'stable';
	const releaseName = getReleaseName()
	const url = path.join(RELEASE_URL, version, releaseName)

	core.debug(`Downloading Neovim ${url}`);
	const neovimDownloadPath = await tc.downloadTool(url)
	const neovimArchive = await extractNeovimArchive(neovimDownloadPath);

	if (!neovimArchive) {
		throw new Error(`Unable to download Neovim from ${url}`);
	}
	core.debug(`Downloaded Neovim to ${neovimArchive}`);

	let neovimBinPath = path.join(neovimArchive, releaseName.split('.')[0], 'bin')
	core.addPath(neovimBinPath);
	core.debug(`'${neovimBinPath}' was added to $PATH`);
}
