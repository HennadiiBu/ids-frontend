import { useState } from 'react';
import axios from 'axios';

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        'http://localhost:3001/api/data/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setData(res.data.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  // const handleDownload = () => {
  //     window.open('http://localhost:3001/download', '_blank');
  // };

  return (
<div>
  <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
  <button onClick={handleUpload}>Загрузить</button>
  {/* <button onClick={handleDownload} disabled={!data.length}>Скачать</button> */}
  {data.map((item, index) => {
    return (
      <div key={item.visitDate || index}> {/* Используем visitDate или индекс как ключ */}
        <div>{item.visitDate}</div>
        <ul>
          {Object.entries(item.ttNumbers).map(([ttNumber, ttArray]) => (
            <li key={ttNumber}> {/* Используем ttNumber как ключ */}
              <div>{ttNumber}</div>
              <ul>
                {ttArray.map((tt, index) => (
                  <li key={`${ttNumber}-${index}`} style={{ display: 'flex', gap: '10px' }}>
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
    );
  })}
</div>
  );
};

export default UploadExcel;
