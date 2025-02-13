import * as os from "os";
import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

const NEOVIM_URL = "https://github.com/neovim/neovim";
const RELEASE_URL = `${NEOVIM_URL}/releases/download`;

function getReleaseVersion(): string {
	const version = core.getInput("neovim_version") || "stable";
	if (version == "stable" || version == "nightly") {
		return version;
	}

	const gitTagsRaw = require("child_process").execSync(
		`git ls-remote --tags ${NEOVIM_URL} | awk -F'/' '{print $3}' | cut -d '^' -f1 | uniq`,
	);
	const gitTags = gitTagsRaw.toString().split("\n");
	if (gitTags.includes(version)) {
		return version;
	}
	return "stable";
}

function isLinuxArchNeeded(version: string): boolean {
	if (!version.startsWith("v0.")) {
		return true;
	}
	const splitVersion = version.split(".");
	if (splitVersion.length !== 3 || Number(splitVersion[1]) > 10) {
		return true;
	}
	if (Number(splitVersion[1]) === 10 && Number(splitVersion[2]) >= 4) {
		return true;
	}
	return false;
}

function getReleaseName(version: string) {
	const osName = os.type() == "Darwin" ? "macos" : os.type().toLowerCase();
	if (osName.startsWith("windows")) {
		return "nvim-win64.zip";
	} else if (osName == "linux" && !isLinuxArchNeeded(version)) {
		// Neovim v0.10.3 and before returns linux64 with no arch type
		return "nvim-linux64.tar.gz";
	}
	return `nvim-${osName}-${os.machine()}.tar.gz`;
}

export async function extractNeovimArchive(
	archivePath: string,
): Promise<string> {
	if (os.platform() === "win32") {
		core.debug("Extracting Neovim zip file");
		return await tc.extractZip(archivePath);
	}

	core.debug("Extracting Neovim tar.gz file");
	return await tc.extractTar(archivePath);
}

export async function downloadNeovimRelease() {
	const version = getReleaseVersion();
	const releaseName = getReleaseName(version);
	const url = path.join(RELEASE_URL, version, releaseName);

	core.debug(`Downloading Neovim ${url}`);
	const neovimDownloadPath = await tc.downloadTool(url);
	const neovimArchive = await extractNeovimArchive(neovimDownloadPath);

	if (!neovimArchive) {
		throw new Error(`Unable to download Neovim from ${url}`);
	}
	core.debug(`Downloaded Neovim to ${neovimArchive}`);

	const neovimBinPath = path.join(
		neovimArchive,
		releaseName.split(".")[0],
		"bin",
	);
	core.addPath(neovimBinPath);
	core.debug(`'${neovimBinPath}' was added to $PATH`);
}
