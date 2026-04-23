function createDisclaimer() {
    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.textContent = "Disclaimer: This website is intended exclusively for authorized users. The operators of this site make no representations or warranties, express or implied, regarding the accuracy or completeness of the information provided.";
    disclaimerDiv.style.backgroundColor = 'lightyellow';
    disclaimerDiv.style.padding = '10px';
    disclaimerDiv.style.border = '1px solid #ccc';
    disclaimerDiv.style.margin = '20px 0';

    document.body.appendChild(disclaimerDiv);
}

// Call createDisclaimer on page load
window.onload = function() {
    createDisclaimer();
    load();
};