const BASE = "/customer";

function val(id) {
    const el = document.getElementById(id);
    return el ? String(el.value || "").trim() : "";
}

function getCustomer() {
    return {
        id: val("id") || null,
        firstName: val("firstName"),
        lastName: val("lastName"),
        email: val("email"),
        dob: val("dob"),
        mobileNumber: val("mobileNumber"),
        address: val("address"),
        idProof: val("idProof")
    };
}

function getSim() {
    return {
        customerId: val("customerId") ? Number(val("customerId")) : null,
        simNumber: val("simNumber"),
        iccid: val("iccid"),
        imei: val("imei"),
        mobileNumber: val("mobileNumber"),
        networkType: val("networkType"),
        planName: val("planName")
    };
}

function getResponseBox() {
    return document.getElementById("responseBox");
}

function show(message, success = true) {
    const box = getResponseBox();

    if (!box) {
        window.alert(message);
        return;
    }

    box.textContent = message;
    box.className = `response ${success ? "success" : "error"}`;
    box.style.display = "block";
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showInfo(message) {
    const box = getResponseBox();

    if (!box) {
        window.alert(message);
        return;
    }

    box.textContent = message;
    box.className = "response info";
    box.style.display = "block";
}

function setLoading(button, loading) {
    if (!button) return;
    button.classList.toggle("is-loading", loading);
    button.disabled = loading;
}

async function request(url, options = {}) {
    const response = await fetch(url, options);
    const message = await response.text();
    return { response, message };
}

async function addCustomer(button = null) {
    const trigger = button || document.activeElement;
    try {
        const customer = getCustomer();
        customer.id = null;

        if (!customer.firstName || !customer.lastName || !customer.email || !customer.dob || !customer.mobileNumber) {
            show("Please fill all required customer fields.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer)
        });

        show(message, response.ok);

        if (response.ok) {
            await loadDashboard();
            document.querySelectorAll("#firstName, #lastName, #email, #dob, #mobileNumber, #address, #idProof")
                .forEach(input => input.value = "");
        }
    } catch (error) {
        show("Unable to connect to backend. Make sure Spring Boot is running.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function validateCustomer(button = null) {
    const trigger = button || document.activeElement;
    try {
        const customer = getCustomer();
        if (!customer.email || !customer.dob) {
            show("Enter the customer email and date of birth.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: customer.email, dob: customer.dob })
        });
        show(message, response.ok);
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function validateDetails(button = null) {
    const trigger = button || document.activeElement;
    try {
        const customer = getCustomer();
        if (!customer.firstName || !customer.lastName || !customer.email) {
            show("Enter first name, last name and email.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/validateDetails`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer)
        });
        show(message, response.ok);
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function addSim(button = null) {
    const trigger = button || document.activeElement;
    try {
        const sim = getSim();

        if (!sim.customerId) {
            show("Customer ID is required for SIM management.", false);
            return;
        }
        if (!sim.simNumber || !sim.iccid || !sim.imei) {
            show("SIM Number, ICCID and IMEI are required.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/addSim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sim)
        });
        show(message, response.ok);

        if (response.ok) {
            await loadDashboard();
        }
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function validateSim(button = null) {
    const trigger = button || document.activeElement;
    try {
        const sim = getSim();
        if (!sim.simNumber) {
            show("Please enter a SIM Number.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/validateSim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ simNumber: sim.simNumber })
        });
        show(message, response.ok);
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function activateSim(button = null) {
    const trigger = button || document.activeElement;
    try {
        const sim = getSim();
        if (!sim.simNumber) {
            show("Please enter a SIM Number.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/activateSim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ simNumber: sim.simNumber })
        });
        show(message, response.ok);

        if (response.ok) {
            await loadDashboard();
        }
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function deactivateSim(button = null) {
    const trigger = button || document.activeElement;
    try {
        const sim = getSim();
        if (!sim.simNumber) {
            show("Please enter a SIM Number.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/deactivateSim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ simNumber: sim.simNumber })
        });
        show(message, response.ok);

        if (response.ok) {
            await loadDashboard();
        }
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function deleteSim(button = null) {
    const trigger = button || document.activeElement;
    try {
        const sim = getSim();
        if (!sim.simNumber) {
            show("Please enter a SIM Number.", false);
            return;
        }

        const confirmed = window.confirm(`Delete SIM ${sim.simNumber}? This action cannot be undone.`);
        if (!confirmed) return;

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/deleteSim/${encodeURIComponent(sim.simNumber)}`, {
            method: "DELETE"
        });
        show(message, response.ok);

        if (response.ok) {
            await loadDashboard();
        }
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function updateAddress(button = null) {
    const trigger = button || document.activeElement;
    try {
        const customer = getCustomer();
        if (!customer.id) {
            show("Please enter customer ID.", false);
            return;
        }
        if (!customer.address) {
            show("Please enter or generate the complete address.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/updateAddress/${encodeURIComponent(customer.id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: customer.address })
        });
        show(message, response.ok);
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function updateIdProof(button = null) {
    const trigger = button || document.activeElement;
    try {
        const customer = getCustomer();
        if (!customer.id) {
            show("Please enter customer ID.", false);
            return;
        }
        if (!customer.idProof) {
            show("Please enter the ID proof number.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/updateIdProof/${encodeURIComponent(customer.id)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idProof: customer.idProof })
        });
        show(message, response.ok);
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function validateId(button = null) {
    const trigger = button || document.activeElement;
    try {
        const customer = getCustomer();
        if (!customer.id) {
            show("Please enter customer ID.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/validateId`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: Number(customer.id) })
        });
        show(message, response.ok);
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function getOffers(button = null) {
    const trigger = button || document.activeElement;
    try {
        const sim = getSim();
        if (!sim.simNumber) {
            show("Please enter a SIM Number.", false);
            return;
        }

        setLoading(trigger, true);
        const { response, message } = await request(`${BASE}/offers/${encodeURIComponent(sim.simNumber)}`);
        show(message, response.ok);
    } catch (error) {
        show("Unable to connect to backend.", false);
    } finally {
        setLoading(trigger, false);
    }
}

async function loadDashboard() {
    try {
        const response = await fetch(`${BASE}/dashboard`);
        if (!response.ok) return;

        const data = await response.json();

        const customer = document.getElementById("customerCount");
        const sim = document.getElementById("simCount");
        const active = document.getElementById("activatedCount");
        const inactive = document.getElementById("inactiveCount");
        const rate = document.getElementById("activationRate");
        const progress = document.getElementById("activationProgress");

        if (customer) customer.textContent = data.totalCustomers ?? 0;
        if (sim) sim.textContent = data.totalSims ?? 0;
        if (active) active.textContent = data.activeSims ?? 0;
        if (inactive) inactive.textContent = data.inactiveSims ?? 0;

        const total = Number(data.totalSims || 0);
        const activeCount = Number(data.activeSims || 0);
        const activationRate = total > 0 ? Math.round((activeCount / total) * 100) : 0;

        if (rate) rate.textContent = `${activationRate}%`;
        if (progress) progress.style.width = `${activationRate}%`;
    } catch (error) {
        console.log("Dashboard data unavailable", error);
    }
}

function updateAddressPreview() {
    const preview = document.getElementById("addressPreview");
    if (!preview) return;

    const parts = ["houseNo", "street", "city", "state", "pincode"]
        .map(val)
        .filter(Boolean);

    if (parts.length === 0) {
        preview.textContent = "No address entered yet.";
        preview.classList.remove("has-address");
    } else {
        preview.textContent = parts.join(", ");
        preview.classList.add("has-address");
    }

    const proof = document.getElementById("proofType");
    const proofPreview = document.getElementById("proofPreview");
    if (proofPreview) proofPreview.textContent = proof && proof.value ? proof.value : "Not selected";

    const customerPreview = document.getElementById("customerPreview");
    if (customerPreview) customerPreview.textContent = val("id") || "—";
}

function prepareAddress() {
    const address = document.getElementById("address");
    if (!address) return "";

    const parts = ["houseNo", "street", "city", "state", "pincode"]
        .map(val)
        .filter(Boolean);

    address.value = parts.join(", ");
    updateAddressPreview();
    return address.value;
}

async function prepareAndUpdateAddress(button = null) {
    const address = prepareAddress();
    if (!address) {
        show("Please fill the address fields before saving.", false);
        return;
    }
    await updateAddress(button || document.activeElement);
}

function bindLivePreview() {
    ["houseNo", "street", "city", "state", "pincode", "proofType", "id"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updateAddressPreview);
        if (el && el.tagName === "SELECT") el.addEventListener("change", updateAddressPreview);
    });
    updateAddressPreview();
}

document.addEventListener("DOMContentLoaded", () => {
    loadDashboard();
    bindLivePreview();
});
