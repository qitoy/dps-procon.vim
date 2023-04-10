export const config: Record<string, unknown> = {
    lang: "",
};

export function setConfig(newConfig: Record<string, unknown>) {
    for(const key in newConfig) {
        config[key] = newConfig[key];
    }
}
