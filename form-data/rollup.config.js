import multiInput from "rollup-plugin-multi-input"

const config = [
  ["test", "dist/test"],
  ["src", "dist/src"],
].map(([base, dest]) => ({
  input: [`${base}/**/*.js`],
  output: {
    dir: dest,
    preserveModules: true,
    sourcemap: true,
    format: "cjs",
    entryFileNames: "[name].cjs",
  },
  plugins: [multiInput({ relative: base })],
}))
export default config
