async function extract() {  
  const docEl = document.getElementById("input1");
  const docUrl = URL.createObjectURL(docEl.files[0]);
  var range1 = document.getElementById("range1").value;
  var range2 = document.getElementById("range2").value;
  
  const inputBytes = await fetch(docUrl).then(res => res.arrayBuffer());
  const inputDoc = await PDFLib.PDFDocument.load(inputBytes);

  const pdfDoc = await PDFLib.PDFDocument.create();
  
  const docLength = inputDoc.getPageCount();
  if (range1 <= 0) {
    range1 = 1;
  }
  if (range2 == 0 || range2 > docLength) {
    range2 = docLength;
  }
  for(var i = range1; i <= range2; i++) {
    const [page] = await pdfDoc.copyPages(inputDoc, [i-1]);
    pdfDoc.addPage(page);
  }

  const pdfBytes = await pdfDoc.save()
  downloadPdf("download.pdf", pdfBytes)
}
