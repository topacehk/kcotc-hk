function createDisclaimer() {
    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.textContent = "Disclaimer: This website is intended exclusively for authorized users. The operators of this site make no representations or warranties, express or implied, regarding the accuracy, completeness, or fitness for any particular purpose of the information contained herein. In no event shall the site operators, their affiliates, or their respective officers, directors, employees, or agents be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with the use of or inability to use this site or the information provided thereon. Users assume all risk and responsibility for their use of this site and the information contained herein.";
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
