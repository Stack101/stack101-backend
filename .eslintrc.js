module.exports = {
  extends: "airbnb-base",
  settings: {
    "import/resolver": {
      node: {
        paths: ["./"]
      }
    }
  },
  rules: {
    "no-bitwise": ["error", { allow: ["~"] }],
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "spaced-comment": ["error", "always", { markers: ["/", "//"] }]
  }
};
