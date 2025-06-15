import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});

export async function createWhitepaperPDF(whitepaper: {
  introduction?: string;
  background?: string;
  problems?: string;
  solution?: string;
  technologies?: string;
  conclusion?: string;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 800;
  const sectionSpacing = 24;
  const lineSpacing = 18;
  const maxWidth = 495;
  const fontSize = 12;

  function drawSection(title: string, content?: string) {
    if (!content) return;
    page.drawText(title, { x: 50, y, size: fontSize + 2, font, color: rgb(0.1, 0.1, 0.5) });
    y -= lineSpacing + 2;
    const lines = content.match(/.{1,90}/g) || [content];
    for (const line of lines) {
      page.drawText(line, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
      y -= lineSpacing;
      if (y < 50) break;
    }
    y -= sectionSpacing;
  }

  drawSection("Introduction:", whitepaper.introduction);
  drawSection("Background:", whitepaper.background);
  drawSection("Problems:", whitepaper.problems);
  drawSection("Solution:", whitepaper.solution);
  drawSection("Technologies:", whitepaper.technologies);
  drawSection("Conclusion:", whitepaper.conclusion);

  return pdfDoc.save();
}

export async function uploadPDFToIPFS(pdfBuffer: Uint8Array, fileName = "whitepaper.pdf"): Promise<string> {
  // Use Buffer directly for Pinata SDK in Node.js
  const { IpfsHash } = await pinata.upload.file(Buffer.from(pdfBuffer), {
    fileName,
    contentType: "application/pdf",
  });
  return IpfsHash;
}
