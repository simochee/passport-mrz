/**
 * @type {import('semantic-release').Config}
 */
export default {
	branches: ["main"],
	extends: "semantic-release-monorepo",
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		"@semantic-release/npm",
		[
			"@semantic-release/git",
			{
				message:
					// biome-ignore  lint: suspicious/noTemplateCurlyInString
					"chore(release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}",
			},
		],
		"@semantic-release/github",
	],
	preset: "angular",
};
