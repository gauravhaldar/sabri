import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate and download PDF invoice from HTML element
 * @param {HTMLElement} element - The HTML element containing the invoice
 * @param {string} filename - The filename for the downloaded PDF
 */
export const generateInvoicePDF = async (element, filename = 'invoice.pdf') => {
  try {
    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Calculate dimensions for A4 size (210mm x 297mm)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm (leaving margin)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Generate filename for invoice based on order data
 * @param {Object} orderData - The order data
 * @returns {string} - Generated filename
 */
export const generateInvoiceFilename = (orderData) => {
  const orderId = orderData.orderId || 'invoice';
  const date = orderData.createdAt 
    ? new Date(orderData.createdAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
  
  return `Sabri_Invoice_${orderId}_${date}.pdf`;
};

/**
 * Download invoice as PDF using the Invoice component
 * @param {Object} orderData - The order data
 * @param {Function} renderInvoice - Function to render the invoice component
 */
export const downloadInvoice = async (orderData, renderInvoice) => {
  try {
    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '210mm';
    tempContainer.style.backgroundColor = '#ffffff';
    
    document.body.appendChild(tempContainer);

    // Render the invoice component
    const invoiceElement = renderInvoice();
    
    // Use ReactDOM to render the component
    const React = require('react');
    const ReactDOM = require('react-dom');
    
    ReactDOM.render(invoiceElement, tempContainer);

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate PDF
    const filename = generateInvoiceFilename(orderData);
    const success = await generateInvoicePDF(tempContainer, filename);

    // Clean up
    document.body.removeChild(tempContainer);

    return success;
  } catch (error) {
    console.error('Error downloading invoice:', error);
    return false;
  }
};
