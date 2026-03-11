'use strict';

const PDFMerger = require('@severi/pdf-merger-js');
module.exports = function PdfMerge () {
  async function mergeDocumentAll (pdf1, pdf2 = null, pdfOut = null, option1 = null, option2 = null) {
    const merger = new PDFMerger();
    if (!option1) {
      merger.add(pdf1);
    } else {
      merger.add(pdf1, option1);
    }
    if (!option2) {
      if (pdf2) {
        merger.add(pdf2);
      }
    } else {
      if (pdf2) {
        merger.add(pdf2, option2);
      }
    }
    if (pdfOut) {
      await merger.save(pdfOut);
    }
    await merger.save(pdf1);
  }
  async function mergeDocument (pdf, pdfOut) {
    const merger = new PDFMerger();
    pdf.forEach(path => {
      try {
        merger.add(path);
      } catch (_) {}
    });
    await merger.save(pdfOut);
  }
  return {
    mergeDocumentAll,
    mergeDocument
  };
};
