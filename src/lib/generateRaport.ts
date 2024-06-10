import { getTodayDate } from './utils';

interface RaportData {
  name: string;
  total: number;
}

interface CombinedRaportData {
  section: string;
  data: RaportData[] | undefined;
}

const generateCombinedCSVReport = (combinedData: CombinedRaportData[]) => {
  const csvRows: string[] = [];

  combinedData.forEach((sectionData) => {
    csvRows.push(`${sectionData.section}`);
    csvRows.push('"Miesiąc";"Liczba podopiecznych"');
    sectionData.data?.forEach((row) => {
      csvRows.push(`"${row.name}";"${row.total}"`);
    });

    csvRows.push('');
  });

  const csv = csvRows.join('\r\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `raport_od_poczatku_roku_do_${getTodayDate()}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

export default generateCombinedCSVReport;
