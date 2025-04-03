import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { selectData } from '../../redux/data/selectors';
import { setData } from '../../redux/data/slice';

const UploadExcel = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const data = useSelector(selectData);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length <= 1) {
        console.error('Файл пуст или не содержит данных');
        return;
      }

      const columnMap = {
        'Оргструктура: RSM': 'orgStructureRSM',
        'Оргструктура: TSM': 'orgStructureTSM',
        'Оргструктура: SUP': 'orgStructureSUP',
        'Оргструктура: ТП': 'orgStructureTP',
        'Візит: Дата': 'visitDate',
        "Міс'Рік": 'monthYear',
        'ТТ: Фактична назва': 'ttActualName',
        'Географія ТТ: Місто': 'ttCity',
        'ТТ: Фактична адреса': 'ttActualAddress',
        'ТТ: Підтип': 'ttSubtype',
        'ТТ: Коментар (Сегмент)': 'ttComment',
        'ТТ: Додатковий ідентифікатор': 'ttAdditionalId',
        'ТТ: Мережа': 'ttNetwork',
        'МРМ/МКК': 'mrmMkk',
        'ТТ: №': 'ttNumber',
        Анкета: 'survey',
        'Анкета: Сторінка': 'surveyPage',
        'Анкета: Елемент': 'surveyElement',
        'Анкета: Відповідь': 'surveyAnswer',
        'Анкета: Посилання на контент МБД': 'surveyContentLink',
        'Статус перевірки': 'verifiedResult',
      };

      const groupedData = {};

      jsonData.slice(1).forEach((row) => {
        let obj = {};
        jsonData[0].forEach((key, index) => {
          if (columnMap[key]) {
            let value = row[index] || '';

            // Обрабатываем дату
            if (key === 'Візит: Дата' && typeof value === 'string') {
              const timestamp = new Date(value).getTime();
              if (!isNaN(timestamp)) {
                const date = new Date(timestamp);
                value = `${String(date.getDate()).padStart(2, '0')}.${String(
                  date.getMonth() + 1
                ).padStart(2, '0')}.${date.getFullYear()}`;
              } else {
                value = '';
              }
            }

            obj[columnMap[key]] = value;
          }
        });

        const { visitDate, ttNumber } = obj;
        if (!visitDate || !ttNumber) return;

        if (!groupedData[visitDate]) {
          groupedData[visitDate] = {};
        }

        if (!groupedData[visitDate][ttNumber]) {
          groupedData[visitDate][ttNumber] = [];
        }

        // Добавляем поле verified
        const result = obj.verifiedResult?.toLowerCase();
        obj.verified = result === 'ок' || result === 'ok';

        groupedData[visitDate][ttNumber].push(obj);
      });

      // Записываем данные в Redux
      dispatch(setData(groupedData));
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadExcel = () => {
    if (!Object.keys(data).length) {
      console.warn('Нет данных для скачивания');
      return;
    }

    const transformedData = data.flatMap((doc) =>
      Object.entries(doc.ttNumbers).flatMap(([ttNumber, entries]) => {
        if (!Array.isArray(entries)) {
          console.error(
            `Ошибка: entries не массив для ttNumber ${ttNumber}`,
            entries
          );
          return [];
        }

        return entries.map((entry) => ({
          'Оргструктура: RSM': entry.orgStructureRSM,
          'Оргструктура: TSM': entry.orgStructureTSM,
          'Оргструктура: SUP': entry.orgStructureSUP,
          'Оргструктура: ТП': entry.orgStructureTP,
          'Візит: Дата': doc.visitDate,
          "Міс'Рік": entry.monthYear,
          'ТТ: Фактична назва': entry.ttActualName,
          'Географія ТТ: Місто': entry.ttCity,
          'ТТ: Фактична адреса': entry.ttActualAddress,
          'ТТ: Підтип': entry.ttSubtype,
          'ТТ: Коментар (Сегмент)': entry.ttComment,
          'ТТ: Додатковий ідентифікатор': entry.ttAdditionalId || '',
          'ТТ: Мережа': entry.ttNetwork || '',
          'МРМ/МКК': entry.mrmMkk || '',
          'ТТ: №': ttNumber,
          Анкета: entry.survey,
          'Анкета: Сторінка': entry.surveyPage,
          'Анкета: Елемент': entry.surveyElement,
          'Анкета: Відповідь': entry.surveyAnswer,
          'Анкета: Посилання на контент МБД': entry.surveyContentLink,
          'Статус перевірки': entry.verifiedResult || '',
        }));
      })
    );

    // Создаем рабочий лист
    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Генерируем файл и сохраняем его
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'data.xlsx');
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Загрузить</button>
      <button onClick={handleDownloadExcel}>Скачать</button>

      {data.map((item, index) => (
        <div key={item.visitDate || index}>
          <div>{item.visitDate}</div>
          <ul>
            {Object.entries(item.ttNumbers).map(([ttNumber, ttArray]) => (
              <li key={ttNumber}>
                <div>{ttNumber}</div>
                <ul>
                  {ttArray.map((tt, idx) => (
                    <li
                      key={`${ttNumber}-${idx}`}
                      style={{ display: 'flex', gap: '10px' }}
                    >
                      <div>{tt.orgStructureRSM}</div>
                      <div>{tt.orgStructureSUP}</div>
                      <div>{tt.orgStructureTP}</div>
                      <div>{tt.orgStructureTSM}</div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default UploadExcel;
