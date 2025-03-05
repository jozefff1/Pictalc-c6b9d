module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin',
      ['module-resolver', {
        root: ['.'],
        alias: {
          '@': '.',
          'app': './pictalk/app',
          'components': './pictalk/components',
          'constants': './pictalk/constants',
          'contexts': './pictalk/contexts',
          'config': './pictalk/config',
          'assets': './pictalk/assets',
        },
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
      }],
    ],
  };
}; 