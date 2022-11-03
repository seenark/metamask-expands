const { dtsPlugin } = require("esbuild-plugin-d.ts")
const fg = require("fast-glob")

const files = fg.sync(["src/**/*"])

require("esbuild").build({
    entryPoints: files,
    outdir: "dist",
    bundle: false,
    minify: true,
    platform: "browser",
    // external: ["ethers"],
    sourcemap: true,
    target: ["es2016"],
    format: "cjs",
    plugins: [dtsPlugin()]
})