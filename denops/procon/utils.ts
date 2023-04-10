import {
    mergeReadableStreams, TextLineStream,
    $,
    ensureDir,
    z,
} from "./deps.ts";
import {
    Problem, problemSchema,
    Contest, contestSchema,
} from "./types.ts";

const responseSchema = z.object({
    status: z.string(),
    messages: z.array(z.string()),
    result: z.unknown().nullable(),
});

async function parseResponse(...query: string[]) {
    const response = responseSchema.parse(await $`oj-api ${query}`.stderr("null").json());
    if(response.status !== "ok") {
        throw Error((response.messages).join('\n'));
    }
    return response!.result;
}

export async function getProblem(url: string): Promise<Problem> {
    return problemSchema.parse(await parseResponse("get-problem", url));
}

export async function getContest(url: string): Promise<Contest> {
    return contestSchema.parse(await parseResponse("get-contest", url));
}

export async function ojTest(problem: Problem, exec: string[], buffer: (line: string) => Promise<void>): Promise<boolean> {
    await ensureDir("/tmp/procon");
    const tmpDir = await Deno.makeTempDir({ dir: "/tmp/procon" });
    for(const test of problem.tests) {
        const name = test.name!;
        await Deno.writeTextFile(`${tmpDir}/${name}.in`, test.input);
        await Deno.writeTextFile(`${tmpDir}/${name}.out`, test.output);
    }
    const child = $`oj test -N -c ${exec.join(' ')} --tle 2 -d ${tmpDir}`
        .stdout("piped").stderr("piped").noThrow().spawn();
    const stream = mergeReadableStreams(child.stdout(), child.stderr())
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
    for await (const line of stream) {
        await buffer(line);
    }
    const success = (await child).code === 0;
    await Deno.remove(tmpDir, { recursive: true });
    return success;
}

export async function ojSubmit(problem: Problem, file: string): Promise<void> {
    await $`oj submit -y --wait=0 ${problem.url} ${file}`.quiet();
}
