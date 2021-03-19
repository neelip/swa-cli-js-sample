const fetch = require("node-fetch").default;
const baseUrl = "https://gentle-sand-07379f510.azurestaticapps.net";

test("root returns /index.html", async () => {
    const { doc } = await fetchHtmlDoc(`${baseUrl}/`);
    expect(doc.title).toBe("/index.html");
});

test("rewrite to file returns correct content", async () => {
    const { doc } = await fetchHtmlDoc(`${baseUrl}/rewrite_index2`);
    expect(doc.title).toBe("/index2.html");
});

test("rewrite to function returns function response", async () => {
    jest.setTimeout(10000);
    const { json } = await fetchJson(`${baseUrl}/rewrite-to-function`);
    expect(json["x-swa-custom"]).toBe("/api/headers");
});

test("content response contains global headers", async () => {
    const response = await fetch(`${baseUrl}/`);
    expect(response.headers.get("a")).toBe("b");
});

// test("function response contains global headers", async () => {
//     const response = await fetch(`${baseUrl}/api/headers`);
//     expect(response.headers.get("a")).toBe("b");
// })

test("route headers override global headers", async () => {
    const response = await fetch(`${baseUrl}/redirect_index2`);
    expect(response.headers.get("a")).toBe("c");
});

test("default redirect returns 302 with correct location", async () => {
    const response = await fetch(`${baseUrl}/redirect/foo`, { redirect: "manual" });
    expect(response.status).toBe(302);
    expect(response.headers.get("location").replace(new RegExp(`^${baseUrl.replace(".", "\\.")}`), "")).toBe("/index2.html")
});

test("redirect with statusCode 302 returns 302 with correct location", async () => {
    const response = await fetch(`${baseUrl}/redirect/302`, { redirect: "manual" });
    expect(response.status).toBe(302);
    expect(response.headers.get("location").replace(new RegExp(`^${baseUrl.replace(".", "\\.")}`), "")).toBe("/index2.html")
});

test("redirect with statusCode 301 returns 301 with correct location", async () => {
    const response = await fetch(`${baseUrl}/redirect/301`, { redirect: "manual" });
    expect(response.status).toBe(301);
    expect(response.headers.get("location").replace(new RegExp(`^${baseUrl.replace(".", "\\.")}`), "")).toBe("/index2.html")
});

// TODO: remove default headers with global headers
// TODO: remove default headers with route headers

async function fetchHtmlDoc(url, options) {
    const response = await fetch(url, options);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return {
        doc,
        response
    };
}

async function fetchJson(url) {
    const response = await fetch(url);
    return {
        json: await response.json(),
        response
    };
}