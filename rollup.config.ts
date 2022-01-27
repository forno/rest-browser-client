import pluginTypescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name}
 * Licensed under the ${pkg.license} license.
 */`;

export default [
  {
    input: "src/index.ts",
    output: {
      name: "index.js",
      file: pkg.module,
      format: "es",
      sourcemap: "inline",
      banner,
    },
    plugins: [pluginTypescript({
      tsconfig: "./tsconfig.json",
    })],
    external: ['js-base64'],
  },
  {
    input: "src/index.ts",
    output: {
      name: "rest-browser-client",
      file: pkg.browser,
      format: "es",
      sourcemap: "inline",
      banner,
    },
    plugins: [
      pluginTypescript(),
    ],
  },
];
