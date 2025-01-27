import * as core from "@actions/core";
import { downloadNeovimRelease } from "./main";

async function run() {
	try {
		await downloadNeovimRelease();
	} catch (error) {
		core.error(error as Error);
		throw error;
	}
}

run();
