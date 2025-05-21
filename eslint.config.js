import NaomisConfig from "@nhcarrigan/eslint-config";

export default [
  ...NaomisConfig,
  {
    rules: {
      "jsdoc/check-values": [
        "warn",
        {
          allowedLicenses: ["MIT"],
        },
      ],
      "@typescript-eslint/max-params": [
        "warn",
        {
          max: 4,
          ignoreRestArgs: true,
        },
      ]
    },
  },
];
