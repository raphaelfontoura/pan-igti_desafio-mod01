
const baseUrl = "http://localhost:3000";

async function fetchJson(url, options) {

    try {
        let response = await fetch(url, options);
        if (!response.ok) {
            const msg = `Error: ${response.text}. Status: ${response.status}`;
            throw new Error(msg);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export function getData(resource) {
    return fetchJson(`${baseUrl}/${resource}`);
}

export function updateEmployee(resource, id, employee) {
    return fetchJson(`${baseUrl}/${resource}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
    });
}

export function createEmployee(resource, employee) {
    return fetchJson(`${baseUrl}/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
    });
}

export function deleteEmployee(resource, id) {
    return fetchJson(`${baseUrl}/${resource}/${id}`, {
        method: "DELETE",
    });
}

