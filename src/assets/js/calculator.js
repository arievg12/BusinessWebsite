document.addEventListener('DOMContentLoaded', () => {
    const pricing = {
        sub: { upfront: 0, monthly: 150 },
        lump: { upfront: 2500, monthly: 25 },
        addons: { gmb: 25, analytics: 25 }
    };

    const addonGMB = document.getElementById('addonGoogleMyBusiness');
    const addonGA = document.getElementById('addonGoogleAnalytics');
    const breakEvenDisplay = document.getElementById('break-even-message');
    const costTableBody = document.querySelector('#costTable tbody');
    const ctx = document.getElementById('costChart').getContext('2d');

    let costChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Subscription',
                    data: [],
                    borderColor: '#1a73e8', // Professional Blue
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    fill: true,
                    borderWidth: 4,
                    tension: 0.3
                },
                {
                    label: 'Traditional Lump Sum',
                    data: [],
                    borderColor: '#6c757d', // Muted Grey
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false }
        }
    });

    const calculate = () => {
        const maxMonths = 36;
        const months = [];
        const subData = [];
        const lumpData = [];
        let breakEvenMonth = null;

        costTableBody.innerHTML = '';

        // Subscription: Add-ons are $0 (included)
        // Lump Sum: Add-ons cost extra monthly
        let monthlyExtrasLump = 0;
        if (addonGMB.checked) monthlyExtrasLump += pricing.addons.gmb;
        if (addonGA.checked) monthlyExtrasLump += pricing.addons.analytics;

        for (let m = 0; m <= maxMonths; m++) {
            months.push(`Month ${m}`);

            const currentSub = (pricing.sub.monthly * m);
            const currentLump = pricing.lump.upfront + ((pricing.lump.monthly + monthlyExtrasLump) * m);

            subData.push(currentSub);
            lumpData.push(currentLump);

            if (breakEvenMonth === null && currentLump < currentSub) breakEvenMonth = m;

            // Milestone Rows
            if ([0, 6, 12, 24, 36].includes(m)) {
                const row = costTableBody.insertRow();
                
                // Add a special class if it's the 24-month mark
                if (m === 24) row.classList.add('milestone-row');

                row.innerHTML = `
                    <td>
                        ${m === 0 ? 'Start Today' : m + ' Months'}
                        ${m === 24 ? '<br><span class="bonus-text">(FREE REDESIGN)</span>' : ''}
                    </td>
                    <td class="sub-cell">$${currentSub.toLocaleString()}</td>
                    <td>$${currentLump.toLocaleString()}</td>
                `;
            }
        }

        breakEvenDisplay.innerHTML = breakEvenMonth 
            ? `⚠️ <strong>Comparison:</strong> The Lump Sum option doesn't become "cheaper" until <strong>Month ${breakEvenMonth}</strong>.`
            : `✅ <strong>Value Insight:</strong> Under this setup, the Subscription remains the most cost-effective way to power your business for over 3 years.`;

        costChart.data.labels = months;
        costChart.data.datasets[0].data = subData;
        costChart.data.datasets[1].data = lumpData;
        costChart.update();
    };

    [addonGMB, addonGA].forEach(el => el.addEventListener('change', calculate));
    calculate();
});