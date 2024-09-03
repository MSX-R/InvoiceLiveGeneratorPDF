import jsPDF from 'jspdf';

function generatePDF(invoice) {
  const doc = new jsPDF();

  doc.text(`Invoice for ${invoice.clientName}`, 10, 10);
  invoice.items.forEach((item, index) => {
    doc.text(
      `${item.quantity} x ${item.description} @ ${item.price} = ${item.quantity * item.price}`,
      10,
      20 + index * 10
    );
  });

  const total = invoice.items.reduce((total, item) => total + item.quantity * item.price, 0);
  doc.text(`Total: ${total}`, 10, 30 + invoice.items.length * 10);

  doc.save('invoice.pdf');
}

export default generatePDF;
