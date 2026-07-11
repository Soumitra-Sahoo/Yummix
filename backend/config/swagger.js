import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, "../docs/openapi.yaml");

const swaggerSpec = yaml.load(
  fs.readFileSync(swaggerPath, "utf8")
);

export default swaggerSpec;