

async function openPdf() {
  const input1 = document.getElementById("input1");
  document.getElementById('pdf').src = URL.createObjectURL(input1.files[0]);
}

async function createPdf() {
  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([350, 400]);
  page.moveTo(110, 200);
  page.drawText('Hello World!');
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  console.log(pdfDataUri);
  document.getElementById('pdf').src = pdfDataUri;
}

async function modifyPdf() {
  const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  firstPage.drawText('This text was added with JavaScript!', {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  })

  const pdfBytes = await pdfDoc.save()
}

function downloadPdf(fileName, bytes) {
    var blob = new Blob([bytes], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
};

