module.exports = {
	preset: "ts-jest",
	moduleDirectories: ['node_modules', 'src', 'test'],
	moduleNameMapper: {
		"obsidian": "mocks/obsidian.ts"
	}
}
