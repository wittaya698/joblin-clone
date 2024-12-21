const { getDefaultConfig } = require('expo/metro-config');
module.exports = (async () => {
    const defaultConfig = await getDefaultConfig(__dirname);
    defaultConfig.resolver.extraNodeModules = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify')
    };
    // defaultConfig.resolver.sourceExts = [
    //     ...defaultConfig.resolver.sourceExts,
    //     'ts',
    //     'tsx'
    // ];
    return defaultConfig;
})();
