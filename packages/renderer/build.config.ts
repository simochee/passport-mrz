import url from "@rollup/plugin-url";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["src/index"],
	declaration: true,
	clean: true,
	failOnWarn: false,
	rollup: {
		emitCJS: true,
	},
	hooks: {
		"rollup:options"(_ctx, options) {
			options.plugins ||= [];
			options.plugins.push(url());
		},
	},
});
