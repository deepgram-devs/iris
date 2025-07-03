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
          max: 4,
        },
      ],
      "max-lines-per-function": "off",
      "complexity": "off"
    },
  },
  {
    ignores: ["src/interfaces/supabase.ts"]
  }
];
