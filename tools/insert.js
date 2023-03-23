async function insert() {  
  const docEl = document.getElementById("input1");
  const pagesEl = document.getElementById("input2");
  const docUrl = URL.createObjectURL(docEl.files[0]);
  const pagesUrl = URL.createObjectURL(pagesEl.files[0]);
  const offset = document.getElementById("offset").value;
  
  const inputBytes = await fetch(docUrl).then(res => res.arrayBuffer());
  const inputDoc = await PDFLib.PDFDocument.load(inputBytes);
  
  const pagesBytes = await fetch(pagesUrl).then(res => res.arrayBuffer());
  const inputPages = await PDFLib.PDFDocument.load(pagesBytes);

  const pdfDoc = await PDFLib.PDFDocument.create();
  
  const docLength = inputDoc.getPageCount();
  const pagesLength = inputPages.getPageCount();
  if (offset == 0) {
    for(var i = 0; i < pagesLength; i++) {
      const [page] = await pdfDoc.copyPages(inputPages, [i]);
      pdfDoc.addPage(page);
    }
  }
  for(var k = 0; k < docLength; k++) {
      const [page] = await pdfDoc.copyPages(inputDoc, [k]);
      pdfDoc.addPage(page);
      if (k == offset-1) {
        for(var i = 0; i < pagesLength; i++) {
          const [page] = await pdfDoc.copyPages(inputPages, [i]);
          pdfDoc.addPage(page);
        }
      }
  }

  const pdfBytes = await pdfDoc.save()
  downloadPdf("download.pdf", pdfBytes)
}
