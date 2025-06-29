/**
 * @type {import('semantic-release').Config}
 */
export default {
	branches: ["main"],
	tagFormat: "${name}@${version}",
	extends: ["semantic-release-monorepo"],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		"@semantic-release/npm",
		[
			"@semantic-release/git",
			{
				message:
					"chore(release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}",
			},
		],
		"@semantic-release/github",
	],
};
