import * as core from '@actions/core';
import { downloadNeovimRelease } from './main';

async function run() {
	try {
		await downloadNeovimRelease();
	} catch (error: any) {
		core.error(error);
		throw error;
	}
}

run();
