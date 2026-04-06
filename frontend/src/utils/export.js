import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function exportJSON(analysis, topClass) {
  const data = {
    topClass,
    timestamp: new Date().toISOString(),
    classification: analysis.classification || [],
    detections: analysis.detections || [],
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analysis-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(analysis, topClass) {
  const rows = [
    ['Land Cover Class', 'Probability (%)'],
    ...(analysis.classification || []).map((c) => [c.class, c.probability]),
    [],
    ['Detected Object', 'Confidence (%)'],
    ...(analysis.detections || []).map((d) => [d.class, (d.confidence * 100).toFixed(1)]),
  ];
  const csv = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analysis-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPDF(analysis, topClass) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Satellite Image Analysis Report', 14, 20);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.text(`Top class: ${topClass}`, 14, 35);

  const classData = (analysis.classification || []).map((c) => [c.class, `${c.probability}%`]);
  doc.autoTable({
    startY: 42,
    head: [['Land Cover Class', 'Probability']],
    body: classData,
    theme: 'plain',
    headStyles: { fillColor: [0, 180, 120] },
  });

  const detData = (analysis.detections || []).map((d) => [d.class, `${(d.confidence * 100).toFixed(1)}%`]);
  if (detData.length > 0) {
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Detected Object', 'Confidence']],
      body: detData,
      theme: 'plain',
      headStyles: { fillColor: [0, 180, 120] },
    });
  }

  doc.save(`analysis-${Date.now()}.pdf`);
}
