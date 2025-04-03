import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";
import { selectData } from "../../redux/data/selectors";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const reduxData = useSelector(selectData);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3001/api/data/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(res.data.data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  const handleDownloadExcel = () => {
    if (!reduxData.length) {
      console.warn("Нет данных для скачивания");
      return;
    }

    const transformedData = reduxData.flatMap((doc) =>
      Object.entries(doc.ttNumbers).flatMap(([ttNumber, entries]) => {
        if (!Array.isArray(entries)) {
          console.error(`Ошибка: entries не массив для ttNumber ${ttNumber}`, entries);
          return [];
        }

        return entries.map((entry) => ({
          "Оргструктура: RSM": entry.orgStructureRSM,
          "Оргструктура: TSM": entry.orgStructureTSM,
          "Оргструктура: SUP": entry.orgStructureSUP,
          "Оргструктура: ТП": entry.orgStructureTP,
          "Візит: Дата": doc.visitDate,
          "Міс'Рік": entry.monthYear,
          "ТТ: Фактична назва": entry.ttActualName,
          "Географія ТТ: Місто": entry.ttCity,
          "ТТ: Фактична адреса": entry.ttActualAddress,
          "ТТ: Підтип": entry.ttSubtype,
          "ТТ: Коментар (Сегмент)": entry.ttComment,
          "ТТ: Додатковий ідентифікатор": entry.ttAdditionalId || "",
          "ТТ: Мережа": entry.ttNetwork || "",
          "МРМ/МКК": entry.mrmMkk || "",
          "ТТ: №": ttNumber,
          Анкета: entry.survey,
          "Анкета: Сторінка": entry.surveyPage,
          "Анкета: Елемент": entry.surveyElement,
          "Анкета: Відповідь": entry.surveyAnswer,
          "Анкета: Посилання на контент МБД": entry.surveyContentLink,
          "Статус перевірки": entry.verifiedResult || "",
        }));
      })
    );

    // Создаем рабочий лист
    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Генерируем файл и сохраняем его
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "data.xlsx");
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
                    <li key={`${ttNumber}-${idx}`} style={{ display: "flex", gap: "10px" }}>
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
