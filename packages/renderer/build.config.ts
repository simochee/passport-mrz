import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["src/browser", "src/node"],
	declaration: true,
	clean: true,
	failOnWarn: false,
	rollup: {
		emitCJS: true,
	},
});
