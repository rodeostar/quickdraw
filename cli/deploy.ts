import { join, normalize } from "https://deno.land/std@0.132.0/path/mod.ts";

export type QuickdrawCLIConfig = {
  project: string;
  token: string;
  cli: string;
};

const base = (...paths: string[]) => join(Deno.cwd(), ...paths);
const rawConfig = await Deno.readTextFile(base("./quickdraw.json"));
const parsedConfig: Partial<QuickdrawCLIConfig> = JSON.parse(rawConfig);

if (!parsedConfig.cli)
  throw new Error(
    'Please specify the remote url for quickdraw/cli -> { "cli": "<url>" } in quickdraw.json'
  );

if (!parsedConfig.token)
  throw new Error("No access token specified in quickdraw.json");

if (!parsedConfig.project)
  throw new Error("No project specified in quickdraw.json");

const cmd = Deno.run({
  cmd: [
    "deployctl",
    "deploy",
    `--project=${parsedConfig.project} ${join(
      parsedConfig.cli,
      "quickdraw.prod.ts"
    )}`,
    `--import-map=${base("import_map.json")}`,
    `--token=${parsedConfig.token}`,
  ],
  stdout: "piped",
  stderr: "piped",
});

const output = await cmd.output();
const outStr = new TextDecoder().decode(output);
cmd.close();
