async function loadApplications() {
  try {
    const apps = await apiRequest("/applications");
    const table = document.getElementById("applicationsTable");
    table.innerHTML = "";

    apps.forEach((app) => {
      const statusClass = app.status ? app.status.toLowerCase() : 'applied';
      
      let optionsHtml = '';
      if (app.status === 'APPLIED') {
        optionsHtml = `
          <option value="APPLIED" selected>Applied</option>
          <option value="INTERVIEW">Interviewing</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        `;
      } else if (app.status === 'INTERVIEW') {
        optionsHtml = `
          <option value="INTERVIEW" selected>Interviewing</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
        `;
      } else if (app.status === 'OFFER') {
        optionsHtml = `
          <option value="OFFER" selected>Offer</option>
          <option value="REJECTED">Rejected</option>
        `;
      } else if (app.status === 'REJECTED') {
        optionsHtml = `<option value="REJECTED" selected>Rejected</option>`;
      } else {
        optionsHtml = `<option value="${app.status}" selected>${app.status}</option>`;
      }

      const isDisabled = app.status === 'REJECTED' ? 'disabled' : '';

      const row = `
        <tr>
          <td>
            <div style="font-weight: 500; margin-bottom: 2px;">${app.companyName}</div>
            <div class="text-muted text-sm">${app.location || 'Remote'}</div>
          </td>
          <td style="font-weight: 500;">${app.jobTitle}</td>
          <td>
            <div class="status-select-wrapper status-${statusClass}">
              <select onchange='updateStatus(${app.id}, this.value, ${JSON.stringify(app).replace(/'/g, "&#39;")})' class="status-select" ${isDisabled}>
                ${optionsHtml}
              </select>
            </div>
          </td>
          <td class="text-muted text-sm">${app.applicationDate}</td>
        </tr>
      `;
      table.innerHTML += row;
    });
  } catch (e) {
    console.log("API not ready", e);
  }
}

async function updateStatus(id, newStatus, appData) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const updatePayload = {
      ...appData,
      status: newStatus,
      applicationDate: today
    };
    
    await apiRequest(`/applications/${id}`, "PUT", updatePayload);
    loadApplications(); 
  } catch (e) {
    alert("Failed to update status");
    console.error(e);
    loadApplications(); 
  }
}

function openModal() {
  document.getElementById("modal").classList.add("active");
  document.getElementById("company").value = "";
  document.getElementById("title").value = "";
  document.getElementById("location").value = "";
  document.getElementById("status").value = "APPLIED";
  document.getElementById("appDate").value = new Date().toISOString().split("T")[0]; 
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

async function addApplication() {
  let dateVal = document.getElementById("appDate").value;
  if (!dateVal) {
    dateVal = new Date().toISOString().split("T")[0];
  }

  const data = {
    companyName: document.getElementById("company").value,
    jobTitle: document.getElementById("title").value,
    location: document.getElementById("location").value,
    status: document.getElementById("status").value,
    applicationDate: dateVal
  };

  try {
    await apiRequest("/applications", "POST", data);
    closeModal();
    loadApplications();
  } catch(e) {
    alert("Failed to save application");
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
    loadApplications();
});
