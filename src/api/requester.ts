// import fetch from "node-fetch";

export async function getJson(url: string, requestHeaders: any): Promise<any> {
    let response = await fetch(url, {headers: requestHeaders});

    return response.json();
}