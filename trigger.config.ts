import { defineConfig } from "@trigger.dev/sdk/v3";
import { rscExtension } from "@trigger.dev/rsc";

export default defineConfig({
  project: "<your-project-ref>",
  dirs: ["./src/trigger"],
  build: {
    extensions: [rscExtension({ reactDomEnvironment: "worker" })],
  },
});
