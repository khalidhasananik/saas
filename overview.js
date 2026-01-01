// 1. Retrieve Data
const rawData = localStorage.getItem('scrapedData');
const data = rawData ? JSON.parse(rawData) : [];

// Redirect if empty (safety check)
if (!data || data.length === 0) {
    alert("No data found. Please run the scraper first.");
    window.location.href = 'scraper.html';
}

// 2. Elements
const tableBody = document.getElementById('tableBody');
const jsonView = document.getElementById('json-view');
const tableView = document.getElementById('table-view');
const jsonActions = document.getElementById('json-actions');

const btnTable = document.getElementById('btnTable');
const btnJson = document.getElementById('btnJson');

// 3. Render Table
data.forEach((item, index) => {
    // Logic: Media (First thumbnail or placeholder)
    let thumb = 'https://placehold.co/40?text=No+Img';
    if (item.media && item.media.length > 0 && item.media[0].thumbnail) {
        thumb = item.media[0].thumbnail;
    }

    // Logic: Text Truncate (50 chars)
    let text = item.text || "";
    if (text.length > 50) {
        text = text.substring(0, 50) + "...";
    }

    // Logic: Comments default to 0
    const comments = item.comments !== undefined ? item.comments : 0;

    const row = `
        <tr>
            <td>${index + 1}</td>
            <td><img src="${thumb}" class="table-thumb" alt="Img"></td>
            <td><a href="${item.url}" target="_blank" style="color: #005DFF;">View</a></td>
            <td>${text}</td>
            <td>${item.likes || 0}</td>
            <td>${comments}</td>
            <td>${item.shares || 0}</td>
        </tr>
    `;
    tableBody.innerHTML += row;
});

// 4. Render JSON
jsonView.textContent = JSON.stringify(data, null, 4);

// 5. Toggle Logic
btnTable.addEventListener('click', () => {
    btnTable.classList.add('active');
    btnJson.classList.remove('active');
    tableView.style.display = 'block';
    jsonActions.style.display = 'none';
    jsonView.style.display = 'none';
});

btnJson.addEventListener('click', () => {
    btnJson.classList.add('active');
    btnTable.classList.remove('active');
    tableView.style.display = 'none';
    jsonActions.style.display = 'flex';
    jsonView.style.display = 'block';
});

// 6. Copy Function
document.getElementById('btnCopy').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 4));
    alert("JSON copied to clipboard!");
});

// 7. Download Function
document.getElementById('btnDownload').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "facebook-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});