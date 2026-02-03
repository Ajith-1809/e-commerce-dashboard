import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TEMPLATES } from './pdfTemplates';

/**
 * Generates a PDF report with a title and a data table (List View).
 * This typically uses a standard table layout as it's for internal reporting.
 */
export const generatePDF = (title, columns, data, filename = 'report.pdf', mode = 'download') => {
    try {
        const doc = new jsPDF();
        const settings = JSON.parse(localStorage.getItem('storeSettings')) || { storeName: 'Store' };

        // --- Standard List Report Header ---
        doc.setFillColor(44, 62, 80);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFontSize(22);
        doc.setTextColor(255);
        doc.text(settings.storeName || 'Store Report', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(200);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

        doc.setFontSize(16);
        doc.setTextColor(255);
        doc.text(title, 196, 25, { align: 'right' });

        // --- Table ---
        autoTable(doc, {
            head: [columns],
            body: data,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            styles: { fontSize: 9 }
        });

        // --- Footer ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(`${settings.footerText || ''} - Page ${i}/${pageCount}`, 105, 290, { align: 'center' });
        }

        if (mode === 'view') {
            window.open(doc.output('bloburl'), '_blank');
        } else {
            doc.save(filename);
        }
    } catch (error) {
        console.error("List Report Error:", error);
        alert("Failed to generate list report.");
    }
};

/**
 * Generates a detailed PDF (Bill/Invoice/Sheet) using the selected Template.
 */
export const generateDetailPDF = (title, details, filename = 'detail.pdf', mode = 'view') => {
    try {
        const doc = new jsPDF();

        // Load Settings
        const settings = JSON.parse(localStorage.getItem('storeSettings')) || {
            storeName: 'My E-Commerce Store',
            selectedTemplate: 'standard'
        };

        // Select and Run Template
        const templateKey = settings.selectedTemplate || 'standard';
        const renderTemplate = TEMPLATES[templateKey] || TEMPLATES['standard'];

        renderTemplate(doc, settings, title, details);

        // Output
        if (mode === 'view') {
            window.open(doc.output('bloburl'), '_blank');
        } else {
            doc.save(filename);
        }

    } catch (error) {
        console.error("Detail PDF Error:", error);
        alert(`Failed to generate PDF using template '${settings?.selectedTemplate}'.`);
    }
};

/**
 * Generates a sample PDF for previewing a specific template with current (potentially unsaved) settings.
 */
export const generatePreviewPDF = (templateId, currentSettings) => {
    try {
        const doc = new jsPDF();

        // Use provided settings or fallback
        const settings = {
            ...currentSettings,
            storeName: currentSettings.storeName || 'Store Name',
            selectedTemplate: templateId
        };

        const renderTemplate = TEMPLATES[templateId] || TEMPLATES['standard'];

        // Sample Data for Preview
        const sampleTitle = "PREVIEW INVOICE";
        const sampleDetails = {
            "Invoice No": "INV-001",
            "Date": new Date().toLocaleDateString(),
            "Customer Name": "John Doe",
            "Item 1": "Wireless Headphones - 1 pc",
            "Item 2": "Mechanical Keyboard - 1 pc",
            "Subtotal": "4500.00",
            "Tax (18%)": "810.00",
            "Total Amount": settings.currencySymbol + " 5310.00"
        };

        renderTemplate(doc, settings, sampleTitle, sampleDetails);

        window.open(doc.output('bloburl'), '_blank');

    } catch (error) {
        console.error("Preview Error:", error);
        alert("Failed to generate preview.");
    }
};
