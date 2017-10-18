module.exports={
	collectCoverage: false,
	collectCoverageFrom: [
		"/src/**/*.{js}"
	],
	coverageThreshold: {
		global: {
      		branches: 50,
      		functions: 50,
      		lines: 50,
      		statements: 50
    	}
	},
	mapCoverage: true,
	moduleFileExtensions: [
		"js"
	],
	moduleDirectories: [
		"node_modules", 
		"src"
	],
	moduleNameMapper: {
		"^.+\\.(jpe?g|png|svg|ttf|eot|woff|woff2)$": "<rootDir>/test/__setup__/fileMock.js",
		"^.+\\.css$": "<rootDir>/test/__setup__/styleMock.js"	
	},
	setupFiles: [
		"<rootDir>/test/__setup__/index.js",
		"<rootDir>/test/__setup__/setup.js"
	],
	transform: {
		"^.+\\.js$": "babel-jest"	
	},
	testRegex: "(/test/.*?(\\.|/)test)\\.js$",
	verbose: true
};