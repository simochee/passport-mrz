import copy from "rollup-plugin-copy";
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
			options.plugins.push(
				copy({
					targets: [
						{
							src: "../ocrb-webfont/assets/OCRB.ttf",
							dest: "dist",
						},
					],
				}),
			);
		},
	},
});
