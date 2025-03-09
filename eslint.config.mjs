import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-console": "off",  // อนุญาตให้ใช้ console.log ได้
      "react/prop-types": "off", // ปิดการเตือนเรื่อง prop-types ใน React
      "@next/next/no-img-element": "off", // อนุญาตให้ใช้ <img> แทน <Image> ของ Next.js
    },
  },
];

export default eslintConfig;
