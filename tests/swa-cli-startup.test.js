const spawn = require("cross-spawn");
const waitOn = require("wait-on");
const fetch = require("node-fetch").default;
const path = require("path");
const find = require('find-process');

afterEach(async () => {
    jest.setTimeout(30000);
    await killStuckProcesses();
});

test('starts with static files only', async () => {
    const cli = await spawnAndWait("swa", ["start", "../static"], 4280);

    const frontendResponse = await fetch("http://localhost:4280/");
    const doc = parseHtml(await frontendResponse.text());
    const title = doc.title;

    expect(title).toBe("/index.html");
});

test('starts with static files and api', async () => {
    const cli = await spawnAndWait("swa", ["start", "../static", "--api", "../api"], 7071);

    const frontendResponse = await fetch("http://localhost:4280/");
    const doc = parseHtml(await frontendResponse.text());
    const title = doc.title;
    const backendResponse = await fetch("http://localhost:4280/api/headers");
    const json = await backendResponse.json();

    expect(title).toBe("/index.html");
    expect(json["x-swa-custom"]).toBe("/api/headers");
});

test('starts with dev server', async () => {
    jest.setTimeout(30000);
    const reactDevServer = await spawnAndWait("npm", ["start"], 3000, { cwd: path.join("..", "frontend") });
    const cli = await spawnAndWait("swa", ["start", "http://localhost:3000"], 4280);

    const frontendResponse = await fetch("http://localhost:4280/");
    const doc = parseHtml(await frontendResponse.text());
    const title = doc.title;

    expect(title).toBe("React App");
});

test('starts with dev server and api', async () => {
    jest.setTimeout(30000);
    const reactDevServer = await spawnAndWait("npm", ["start"], 3000, { cwd: path.join("..", "frontend") });
    const cli = await spawnAndWait("swa", ["start", "http://localhost:3000", "--api", "../api"], 7071);

    const frontendResponse = await fetch("http://localhost:4280/");
    const doc = parseHtml(await frontendResponse.text());
    const title = doc.title;
    const backendResponse = await fetch("http://localhost:4280/api/headers");
    const json = await backendResponse.json();

    expect(title).toBe("React App");
    expect(json["x-swa-custom"]).toBe("/api/headers");
});

async function spawnAndWait(command, args, waitPort, opts) {
    const child = spawn(command, args, opts);
    await waitOn({
        resources: [
            `tcp:localhost:${waitPort}`
        ],
        timeout: 30000
    });
    return child;
}

function parseHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc;
}

async function killStuckProcesses() {
    for (const port of [4280, 3000, 7071]) {
        const list = await find("port", port);
        if (list && list.length) {
            killProcess(list[0].pid);
        }
    }
    function killProcess(pid) {
        console.log(`killing ${pid}`)
        try {
            process.kill(pid, 9);
        } catch {
        }
    }
}