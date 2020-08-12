module.exports = {
resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath
    .replace(/.test.([tj]sx?)/, '.test' + snapshotExtension)
    .replace(/src([/\\]components)/, '__snapshots__'),

    resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.replace(snapshotExtension, '.js').replace('__snapshots__', 'src/components'),

    testPathForConsistencyCheck: 'src/components/some.test.js',
}