module.exports = {
  presets: [
    [
      "@babel/preset-typescript",
      {
        isTSX: true,
        allExtensions: true
      }
    ],
    [
      "@babel/preset-env",
      {
        forceAllTransforms: true
      }
    ]
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ]
};
