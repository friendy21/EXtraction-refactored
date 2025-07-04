import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "src/app/components/Dashboard/Departments/DepartmentsView.tsx",
      "src/app/components/FirstTimeSetUp/DataSetup/DataQualityIssues.tsx",
      "src/app/components/FirstTimeSetUp/DataSetup/page.tsx",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "prefer-const": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/display-name": "off",
    },
  },
];

export default eslintConfig;
