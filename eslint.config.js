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
        "error",
        {
          max: 5,
        },
      ],
      "max-lines-per-function": "off",
      "complexity": "off",
      "max-statements": "off",
    },
  },
  {
    ignores: ["src/interfaces/supabase.ts"]
  }
];
