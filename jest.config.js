module.exports = {
    preset: "jest-expo",
    moduleFileExtensions: ['js','jsx','json', 'ts', 'tsx'],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    testMatch: [
      "**/*.test.ts?(x)"
    ],
    setupFiles: ["./test/init.js"],
    transformIgnorePatterns: [
      "node_modules/(?!("
      + "jest-)?react-native"
      + "|react-(native|universal|navigation)-(.*)"
      + "|@react-native-community/(.*)"
      + "|@react-navigation/(.*)"
      + "|expo-random/(.*)"
      + "|nanoid/(.*)"
      + "|@unimodules/(.*)"
      + "|bs-platform)"
    ],
    snapshotResolver: './test/snapshotResolver.js'
  };