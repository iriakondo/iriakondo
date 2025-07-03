import { useState } from 'react';

export interface ExportOptions {
  filename?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  includeHeaders?: boolean;
  format?: 'pdf' | 'excel';
}

export interface ExportData {
  title: string;
  data: any[];
  columns: {
    key: string;
    label: string;
    width?: number;
    format?: (value: any) => string;
  }[];
  summary?: {
    label: string;
    value: string | number;
  }[];
}

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportToPDF = async (exportData: ExportData, options: ExportOptions = {}) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Import dynamique pour éviter les problèmes de SSR
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Configuration des couleurs
      const primaryColor = [59, 130, 246]; // Blue-600
      const secondaryColor = [107, 114, 128]; // Gray-500
      const accentColor = [16, 185, 129]; // Green-500

      // En-tête du document
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 30, 'F');

      // Logo et titre
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('MOUKONA GHIEME', 20, 20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(exportData.title, pageWidth - 20, 20, { align: 'right' });

      // Date de génération
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(10);
      const currentDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Généré le ${currentDate}`, 20, 40);

      setExportProgress(25);

      // Période si spécifiée
      if (options.dateRange) {
        const startDate = new Date(options.dateRange.start).toLocaleDateString('fr-FR');
        const endDate = new Date(options.dateRange.end).toLocaleDateString('fr-FR');
        doc.text(`Période: ${startDate} - ${endDate}`, 20, 48);
      }

      // Résumé si disponible
      let currentY = options.dateRange ? 60 : 52;
      if (exportData.summary && exportData.summary.length > 0) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Résumé', 20, currentY);
        currentY += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        exportData.summary.forEach((item, index) => {
          doc.setTextColor(...secondaryColor);
          doc.text(`${item.label}:`, 25, currentY);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.text(String(item.value), 100, currentY);
          doc.setFont('helvetica', 'normal');
          currentY += 8;
        });
        currentY += 10;
      }

      setExportProgress(50);

      // Tableau des données
      const tableColumns = exportData.columns.map(col => col.label);
      const tableRows = exportData.data.map(row => 
        exportData.columns.map(col => {
          const value = row[col.key];
          return col.format ? col.format(value) : String(value || '');
        })
      );

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: currentY,
        theme: 'grid',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        },
        columnStyles: exportData.columns.reduce((styles, col, index) => {
          if (col.width) {
            styles[index] = { cellWidth: col.width };
          }
          return styles;
        }, {} as any),
        margin: { left: 20, right: 20 },
        didDrawPage: (data) => {
          // Pied de page
          const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
          const totalPages = doc.internal.getNumberOfPages();
          
          doc.setFontSize(8);
          doc.setTextColor(...secondaryColor);
          doc.text(
            `Page ${pageNumber} sur ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
          );
          
          doc.text(
            'MOUKONA GHIEME - Rapport généré automatiquement',
            pageWidth - 20,
            pageHeight - 10,
            { align: 'right' }
          );
        }
      });

      setExportProgress(90);

      // Sauvegarde
      const filename = options.filename || `${exportData.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

      setExportProgress(100);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 1000);
    }
  };

  const exportToExcel = async (exportData: ExportData, options: ExportOptions = {}) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Import dynamique
      const XLSX = await import('xlsx');
      const { saveAs } = await import('file-saver');

      // Création du workbook
      const wb = XLSX.utils.book_new();

      setExportProgress(25);

      // Préparation des données
      const wsData = [];

      // En-tête avec informations
      wsData.push([exportData.title]);
      wsData.push([`Généré le ${new Date().toLocaleDateString('fr-FR')}`]);
      
      if (options.dateRange) {
        const startDate = new Date(options.dateRange.start).toLocaleDateString('fr-FR');
        const endDate = new Date(options.dateRange.end).toLocaleDateString('fr-FR');
        wsData.push([`Période: ${startDate} - ${endDate}`]);
      }
      
      wsData.push([]); // Ligne vide

      // Résumé si disponible
      if (exportData.summary && exportData.summary.length > 0) {
        wsData.push(['RÉSUMÉ']);
        exportData.summary.forEach(item => {
          wsData.push([item.label, item.value]);
        });
        wsData.push([]); // Ligne vide
      }

      setExportProgress(50);

      // En-têtes des colonnes
      wsData.push(exportData.columns.map(col => col.label));

      // Données
      exportData.data.forEach(row => {
        const rowData = exportData.columns.map(col => {
          const value = row[col.key];
          return col.format ? col.format(value) : value;
        });
        wsData.push(rowData);
      });

      setExportProgress(75);

      // Création de la feuille
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Style des en-têtes (si supporté)
      const headerRowIndex = wsData.findIndex(row => 
        row.length > 1 && exportData.columns.some(col => row.includes(col.label))
      );

      // Ajustement automatique des colonnes
      const colWidths = exportData.columns.map(col => ({
        wch: Math.max(col.label.length, 15)
      }));
      ws['!cols'] = colWidths;

      // Ajout de la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Données');

      setExportProgress(90);

      // Export
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const filename = options.filename || `${exportData.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);

      setExportProgress(100);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 1000);
    }
  };

  return {
    exportToPDF,
    exportToExcel,
    isExporting,
    exportProgress
  };
};
