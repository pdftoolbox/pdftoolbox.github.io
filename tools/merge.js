function getMode() {
  const appendMode = document.getElementById("append");
  const alternateMode = document.getElementById("alternate");
  const offsets = document.querySelectorAll(".offset");

  if (alternateMode.checked == true) {
    return "alternate"
  }
  return "append"
}

function modeChange() {
  const offsets = document.querySelectorAll(".offset");

  if (getMode() == "alternate") {
    offsets.forEach(offset => {
      offset.style.display = 'inline';
    });
  } else {
    offsets.forEach(offset => {
      offset.style.display = 'none';
    });
  }
}

function addInput() {
  const rows = document.getElementById("rows");
  const id = rows.children.length + 1;
  var display = "none";
  if (getMode() == "alternate") {
    display = "inline";
  }
  var row = "File "+id+": <input type=\"file\" id=\"input"+id+"\" name=\"input"+id+"\" /> ";
  row += "<span class=\"offset\" style=\"display: "+display+";\">Offset: <input type=\"number\" id=\"offset"+id+"\" name=\"offset"+id+"\" value=\"0\" /></span>";
  const rowEl = document.createElement("div");
  rowEl.innerHTML = row;
  rows.appendChild(rowEl)
}

async function merge() {
  const rows = document.getElementById("rows");
  var inputs = [];
  for(var i = 0; i < rows.children.length; i++) {
    const id = i + 1;
    const file = document.getElementById("input"+id);
    const offset = document.getElementById("offset"+id);
    if(file.files.length > 0){
      const url = URL.createObjectURL(file.files[0]);
      const inputBytes = await fetch(url).then(res => res.arrayBuffer());
      const inputDoc = await PDFLib.PDFDocument.load(inputBytes);
      const pageCount = inputDoc.getPageCount();
      var dim = [350, 400];
      if (pageCount > 0) {
        dim = inputDoc.getPages()[0].getSize();
      }
      inputs.push({
        "doc": inputDoc,
        "offset": offset.value,
        "pages": pageCount,
        "dim": [dim["width"], dim["height"]]
      })
    }
  }
  
  console.log(inputs);

  const pdfDoc = await PDFLib.PDFDocument.create();
  const numDocs = inputs.length;
  
  if (getMode() == "append") {
    for(var i = 0; i < numDocs; i++) {
        const docLength = inputs[i]["pages"];
        for(var k = 0; k < docLength; k++) {
            const [page] = await pdfDoc.copyPages(inputs[i]["doc"], [k]);
            //console.log("Doc " + i+ ", page " + k);
            pdfDoc.addPage(page);
        }
    }
  } else {
    var pages = {};
    var offsets = {};
    for(var i = 0; i < numDocs; i++) {
      const input = inputs[i];
      pages[i] = 0;
      offsets[i] = input['offset'];
    }
    var done = false;
    while (true) {
      for(var i = 0; i < numDocs; i++) {
        const input = inputs[i];
        if (offsets[i] > 0) {
          pdfDoc.addPage(input["dim"]);
          offsets[i]--;
        } else if (pages[i] < input["pages"]) {
          const [page] = await pdfDoc.copyPages(input["doc"], [pages[i]]);
          //console.log("Doc " + i+ ", page " + pages[i]);
          pdfDoc.addPage(page);
          pages[i]++;
        } else {
          var total = 0;
          for(var j = 0; j < numDocs; j++) {
            total += (inputs[j]["pages"] - pages[j])
          }
          if (total == 0) {
            done = true;
            break;
          }
          //pdfDoc.addPage(input["dim"]);
        }
      }
      if (done) {
        break;
      }
    }
  }

  const pdfBytes = await pdfDoc.save()
  downloadPdf("download.pdf", pdfBytes)
}
