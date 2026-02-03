import autoTable from 'jspdf-autotable';

// Helper for formatting Currency
const formatCurrency = (amount, symbol = '₹') => {
    if (!amount) return `${symbol} 0.00`;
    const num = parseFloat(amount.toString().replace(/[^0-9.]/g, ''));
    return `${symbol} ${num.toFixed(2)}`;
};

// Helper for Number to Words (Simplified for Indian Context)
const numToWords = (n) => {
    // Very basic implementation placeholder
    return "Rupees " + n + " Only";
};

// --- TEMPLATE 1: Standard ---
export const templateStandard = (doc, settings, title, details) => {
    // Header - Dark Blue
    doc.setFillColor(44, 62, 80);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(settings.storeName || 'Store Name', 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    let yPos = 22;
    if (settings.address) {
        doc.text(settings.address, 14, yPos);
        yPos += 5;
    }
    const contact = [settings.email, settings.phone].filter(Boolean).join(' | ');
    if (contact) doc.text(contact, 14, yPos);

    // Title
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(title, 196, 25, { align: 'right' });

    // Content
    doc.setTextColor(0, 0, 0);

    const bodyData = Object.entries(details).map(([key, value]) => [
        { content: key, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        value
    ]);

    autoTable(doc, {
        body: bodyData,
        startY: 55,
        theme: 'grid',
        styles: { fontSize: 12, cellPadding: 4 },
        columnStyles: { 0: { cellWidth: 50 } },
        headStyles: { fillColor: [22, 160, 133] }
    });
};

// --- TEMPLATE 2: Indian GST (Classic) ---
export const templateIndianGST = (doc, settings, title, details) => {
    const symbol = settings.currencySymbol || '₹';

    // Header Border
    doc.setDrawColor(0);
    doc.rect(5, 5, 200, 287); // Page Border

    // Store Info Centered
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(settings.storeName, 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(settings.address || '', 105, 22, { align: 'center' });
    doc.text(`GSTIN: ${settings.gstin || 'N/A'}`, 105, 27, { align: 'center' });

    doc.line(5, 30, 205, 30); // Separator

    // Bill To / Details Section
    doc.setFontSize(12);
    doc.text("TAX INVOICE", 105, 38, { align: 'center' });

    let y = 45;
    Object.entries(details).forEach(([key, value]) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${key}:`, 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${value}`, 60, y);
        y += 6;
    });

    // Mock Item Table for visual (Since we only have key-value details usually)
    // If details has 'Total Amount', we try to reverse calc tax
    // This is a visual representation for the 'Bill' feel

    const totalAmount = parseFloat(Object.values(details).find(v => v.toString().includes('₹'))?.toString().replace(/[^0-9.]/g, '') || 0);
    const taxRate = parseFloat(settings.taxRate || 18);
    const taxableValue = (totalAmount / (1 + taxRate / 100)).toFixed(2);
    const taxAmt = (totalAmount - taxableValue).toFixed(2);

    autoTable(doc, {
        startY: y + 5,
        head: [['Description', 'HSN/SAC', 'Qty', 'Rate', 'Taxable', `IGST (${taxRate}%)`, 'Total']],
        body: [
            ['Item/Service', '8512', '1', taxableValue, taxableValue, taxAmt, totalAmount]
        ],
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: 0, lineWidth: 0.1, lineColor: 0 },
        styles: { textColor: 0, lineWidth: 0.1, lineColor: 0 },
        margin: { left: 5, right: 5 }
    });

    // Footer Signatures
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text("Amount in Words:", 15, finalY);
    doc.setFont("helvetica", "italic");
    doc.text(numToWords(Math.round(totalAmount)), 45, finalY);

    doc.setFont("helvetica", "normal");
    doc.text("Authorized Signatory", 160, finalY + 20, { align: 'center' });
    doc.text(`For ${settings.storeName}`, 160, finalY + 25, { align: 'center' });
};

// --- TEMPLATE 3: Corporate Blue ---
export const templateCorporateBlue = (doc, settings, title, details) => {
    // Blue Side Bar
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 50, 297, 'F'); // Left sidebar

    // Store Name in Sidebar
    doc.setTextColor(255);
    doc.setFontSize(20);
    doc.text(settings.storeName.split(' ').join('\n'), 10, 30);

    doc.setFontSize(9);
    doc.text(settings.address.split(',').join('\n'), 10, 80);
    doc.text((settings.email || '') + '\n' + (settings.phone || ''), 10, 110);

    // Main Content
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(24);
    doc.text(title.toUpperCase(), 60, 30);

    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(60, 35, 200, 35);

    const bodyData = Object.entries(details).map(([key, value]) => [key, value]);

    autoTable(doc, {
        body: bodyData,
        startY: 50,
        margin: { left: 60 },
        theme: 'plain',
        visible: true,
        styles: { fontSize: 11, cellPadding: 5, textColor: [50, 50, 50] },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
    });

    // Footer Line
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(2);
    doc.line(60, 280, 200, 280);
    doc.setFontSize(10);
    doc.text(settings.footerText || "Thank you!", 60, 285);
};

// --- TEMPLATE 4: Modern Dark ---
export const templateModernDark = (doc, settings, title, details) => {
    // Full dark background header
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, 210, 60, 'F');

    doc.setTextColor(255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(title, 105, 30, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(settings.storeName, 105, 45, { align: 'center' });

    // Table
    const bodyData = Object.entries(details).map(([key, value]) => [key.toUpperCase(), value]);

    autoTable(doc, {
        body: bodyData,
        startY: 70,
        theme: 'striped',
        headStyles: { fillColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: { fontSize: 11, textColor: [20, 20, 20] },
    });
};

// --- TEMPLATE 5: Minimalist ---
export const templateMinimalist = (doc, settings, title, details) => {
    doc.setFont("times", "roman");
    doc.setFontSize(28);
    doc.setTextColor(0);
    doc.text(settings.storeName, 105, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.text("INVOICE", 105, 55, { align: 'center' });

    doc.setLineWidth(0.2);
    doc.line(80, 58, 130, 58);

    const bodyData = Object.entries(details).map(([key, value]) => [key, value]);

    autoTable(doc, {
        body: bodyData,
        startY: 70,
        theme: 'plain',
        styles: { fontSize: 11, font: "times", cellPadding: 3 },
        columnStyles: { 0: { cellWidth: 60, fontStyle: "italic" } },
        margin: { left: 40, right: 40 }
    });
};

// --- TEMPLATE 6: Pro Orange ---
export const templateProOrange = (doc, settings, title, details) => {
    const ORANGE = [255, 153, 0];
    const DARK = [30, 30, 30];

    doc.setFillColor(...DARK);
    doc.rect(0, 0, 210, 15, 'F');

    doc.setFillColor(...ORANGE);
    doc.rect(0, 15, 210, 2, 'F');

    doc.setFontSize(20);
    doc.setTextColor(...DARK);
    doc.text(settings.storeName, 14, 30);

    doc.setFontSize(24);
    doc.setTextColor(...ORANGE);
    doc.text(title, 196, 30, { align: 'right' });

    const bodyData = Object.entries(details).map(([key, value]) => [key, value]);

    autoTable(doc, {
        body: bodyData,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: ORANGE, textColor: 255 },
        styles: { lineColor: [230, 230, 230] }
    });
};

// --- TEMPLATE 7: Classic Red (Bahi Khata style) ---
export const templateClassicRed = (doc, settings, title, details) => {
    doc.setDrawColor(180, 0, 0); // URL
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 287);
    doc.rect(7, 7, 196, 283); // Double border

    doc.setTextColor(180, 0, 0);
    doc.setFont("courier", "bold");
    doc.setFontSize(24);
    doc.text("|| SRI GANESHAY NAMAH ||", 105, 20, { align: 'center' });

    doc.setTextColor(0);
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text(settings.storeName, 105, 35, { align: 'center' });

    doc.setFontSize(14);
    doc.text(title, 105, 50, { align: 'center' });

    const bodyData = Object.entries(details).map(([key, value]) => [key, value]);

    autoTable(doc, {
        body: bodyData,
        startY: 60,
        theme: 'grid',
        styles: { lineColor: [180, 0, 0], textColor: 0, font: "times" },
        headStyles: { fillColor: [255, 240, 240], textColor: [180, 0, 0] }
    });
};

// --- TEMPLATE 8: Compact ---
export const templateCompact = (doc, settings, title, details) => {
    doc.setFontSize(12);
    doc.text(settings.storeName, 14, 15);
    doc.text(title, 196, 15, { align: 'right' });

    doc.line(14, 18, 196, 18);

    const bodyData = Object.entries(details).map(([key, value]) => [`${key}: ${value}`]);

    // Split into 2 columns if possible? autoTable basic list
    autoTable(doc, {
        body: bodyData,
        startY: 22,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 1 },
    });
};

// --- TEMPLATE 9: Tech Startup ---
export const templateTech = (doc, settings, title, details) => {
    // Green accent, monospace
    doc.setFont("courier", "normal");

    doc.setFillColor(240, 255, 240);
    doc.rect(0, 0, 210, 297, 'F'); // Light green bg

    doc.setTextColor(0, 100, 0);
    doc.setFontSize(24);
    doc.text(settings.storeName.toLowerCase(), 14, 25);

    doc.setDrawColor(0, 100, 0);
    doc.line(14, 30, 50, 30);

    doc.setFontSize(14);
    doc.text(`> ${title}`, 14, 45);

    const bodyData = Object.entries(details).map(([key, value]) => [key, value]);

    autoTable(doc, {
        body: bodyData,
        startY: 55,
        theme: 'plain',
        styles: { font: "courier", textColor: [0, 50, 0] },
        columnStyles: { 0: { fontStyle: "bold" } }
    });
};

// --- TEMPLATE 10: Elegant ---
export const templateElegant = (doc, settings, title, details) => {
    // Gold/Yellow header
    doc.setFillColor(212, 175, 55);
    doc.rect(0, 0, 210, 5, 'F');

    doc.setFont("times", "normal");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(26);
    doc.text(settings.storeName.toUpperCase(), 105, 30, { align: 'center', charSpace: 2 });

    doc.setFontSize(10);
    doc.text(settings.address, 105, 40, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(title, 105, 60, { align: 'center' });

    doc.setDrawColor(212, 175, 55);
    doc.line(80, 65, 130, 65);

    const bodyData = Object.entries(details).map(([key, value]) => [key, value]);

    autoTable(doc, {
        body: bodyData,
        startY: 75,
        theme: 'plain',
        styles: { fontSize: 12, cellPadding: 5, halign: 'center', font: "times" },
        columnStyles: { 0: { fontStyle: 'bold', textColor: [150, 150, 150] } }
    });
};

export const TEMPLATES = {
    'standard': templateStandard,
    'indian_gst': templateIndianGST,
    'corporate_blue': templateCorporateBlue,
    'modern_dark': templateModernDark,
    'minimalist': templateMinimalist,
    'pro_orange': templateProOrange,
    'classic_red': templateClassicRed,
    'compact': templateCompact,
    'tech': templateTech,
    'elegant': templateElegant
};
