export interface Module {
  main: {
    name: string;
    source: string;
  };
  testPre: (sourcePath: string) => Promise<string[]>;
  submitPre: (sourcePath: string) => Promise<string>;
}

export const modules: Record<string, Module> = {};

export async function loadModules(url: string) {
  const newModules = (await import(url)).modules;
  for (const lang in newModules) {
    modules[lang] = newModules[lang];
  }
}

export interface Config extends Record<string, unknown> {
  lang: string,
}

export const config: Config = {
  lang: "",
};

export function setConfig(newConfig: Partial<Config>) {
  for (const key in newConfig) {
    config[key] = newConfig[key];
  }
}
