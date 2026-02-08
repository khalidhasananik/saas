const startBtn = document.getElementById('startBtn');
const productInput = document.getElementById('productInput');
const countrySelect = document.getElementById('countrySelect');
const errorMsg = document.getElementById('errorMessage');
const loader = document.getElementById('loaderSpinner');
const backdrop = document.getElementById('loaderBackdrop');

const PROXY_URL = 'https://utilbook.khalid-hasan1.workers.dev';

startBtn.addEventListener('click', async () => {
    const product = productInput.value.trim();
    const countryCode = countrySelect.value;
    const countryName = countrySelect.options[countrySelect.selectedIndex].text.split(' (')[0];

    // 1. Validation
    if (!product) {
        showError("Please enter a product name.");
        return;
    }

    // 2. Construct Query: "Product X Price in Country Y"
    const finalQuery = `${product} Price in ${countryName}`;

    // 3. UI State
    errorMsg.style.display = 'none';
    startBtn.disabled = true;
    loader.style.display = 'block';
    backdrop.style.display = 'block';

    try {
        // 4. Request to Worker
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: finalQuery,
                country_code: countryCode
            })
        });

        if (!response.ok) throw new Error('Worker failed');

        const data = await response.json();

        // 5. Save Data & Redirect
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No results found.");
        }

        localStorage.setItem('priceData', JSON.stringify(data));
        window.location.href = 'price-results.html';

    } catch (error) {
        console.error(error);
        showError("Something went wrong! Server might be busy.");
        loader.style.display = 'none';
        backdrop.style.display = 'none';
        startBtn.disabled = false;
    }
});

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
}