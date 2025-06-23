import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["src/types", "src/browser", "src/node"],
	declaration: true,
	clean: true,
	failOnWarn: false,
	rollup: {
		emitCJS: true,
	},
});
