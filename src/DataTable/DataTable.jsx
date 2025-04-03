import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/data/operations';
import { selectData, selectIsLoading } from '../redux/data/selectors';
import {
  Box,
  BoxData,
  Container,
  DataList,
  Img,
  ImgContainer,
  ItemContainer,
  List,
  SemiContainer,
  SubContainer,
  Text,
} from './DataTable.styled';
import { Modal } from '../components/Modal/Modal';
import { closeAllModals, closeModal, openModal } from '../redux/modals/slice';
import { selectZoomIn } from '../redux/modals/selectors';
import axios from 'axios';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const DataTable = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);
  const isLoading = useSelector(selectIsLoading);
  const isZoomModalOpen = useSelector(selectZoomIn);

  const [link, setLink] = useState(null);
  const [selected, setSelected] = useState({});
  const [newData, setNewData] = useState([...data]);

  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredData, setFilteredData] = useState([...data]);

  const [isVisibleDetails, setIsVisibleDeteils] = useState(false);

  const notify = () => toast('Wow so easy!');

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchData({})); // Ты можешь передать фильтры сюда
  }, [dispatch]);

  // В useEffect загружаем данные в стейт
  useEffect(() => {
    if (data.length > 0) {
      setFilters(extractFields(data));
    }
  }, [data]);

  useEffect(() => {
    // Функция для применения фильтров
    const applyFilters = () => {
      return data.filter((item) => {
        return Object.entries(selectedFilters).every(
          ([filterKey, filterValue]) => {
            // Если фильтр не выбран (или выбран "Выбрати все"), пропускаем фильтрацию
            if (!filterValue) return true;

            // Фильтрация по каждому объекту ttNumbers
            const matchesFilter = Object.values(item.ttNumbers).some(
              (ttArray) => ttArray.some((tt) => tt[filterKey] === filterValue)
            );

            return matchesFilter;
          }
        );
      });
    };

    // Применяем фильтры и обновляем filteredData
    const newFilteredData = applyFilters();
    setFilteredData(newFilteredData);
  }, [selectedFilters, data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const excelDateToFormattedDate = (excelDate) => {
    const excelEpoch = new Date(1900, 0, 1); // 1 января 1900 года
    // Учитываем ошибку Excel с високосным 1900 годом
    const date = new Date(excelEpoch.getTime() + (excelDate - 1) * 86400000); // -1 для учета ошибки

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const handleOpenImage = () => {
    dispatch(closeAllModals());
    dispatch(openModal('zoomIn'));
  };

  const handleCloseModal = () => {
    dispatch(closeModal('zoomIn'));
  };

  const handleCheckClick = async (visitDate, key, selected) => {
    if (!selected) return; // Если ничего не выбрано, не отправляем запрос

    const updatedData = data.map((item) => {
      if (item.visitDate === visitDate && item.ttNumbers[key]) {
        return {
          ...item,
          ttNumbers: {
            ...item.ttNumbers,
            [key]: item.ttNumbers[key].map((tt) => ({
              ...tt,
              verified: true,
              verifiedResult: selected,
            })),
          },
        };
      }
      return item;
    });

    setNewData(updatedData); // Обновляем локально
  };

  const handleRadioChange = (visitDate, key, value) => {
    setSelected((prevState) => ({
      ...prevState,
      [`${visitDate}-${key}`]: value,
    }));
  };

  const updateBD = async () => {
    const batchSize = 100;
    const totalBatches = Math.ceil(newData.length / batchSize);
    const requests = [];
  
    for (let i = 0; i < totalBatches; i++) {
      const batch = newData.slice(i * batchSize, (i + 1) * batchSize);
      requests.push(
        axios.patch('/api/data/update', { data: batch })
      );
    }
  
    try {
      await Promise.all(requests);
      console.log("Все батчи обновлены");
      notify();
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    }
  };
  
 
  

  const extractFields = (data) => {
    const result = {
      orgStructureRSM: new Set(),
      orgStructureTSM: new Set(),
      orgStructureSUP: new Set(),
      orgStructureTP: new Set(),
      mrmMkk: new Set(),
      ttSubtype: new Set(),
      ttComment: new Set(),
      verifiedResult: new Set(),
    };
    data.forEach((item) => {
      Object.entries(item.ttNumbers).forEach(([ttId, ttArray]) => {
        ttArray.forEach((tt) => {
          result.orgStructureRSM.add(tt.orgStructureRSM);
          result.orgStructureTSM.add(tt.orgStructureTSM);
          result.orgStructureSUP.add(tt.orgStructureSUP);
          result.orgStructureTP.add(tt.orgStructureTP);
          result.mrmMkk.add(tt.mrmMkk);
          result.ttSubtype.add(tt.ttSubtype);
          result.ttComment.add(tt.ttComment);
          result.verifiedResult.add(tt.verifiedResult);
        });
      });
    });

    return result;
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value || null, // Если "Выбрати все", то убираем фильтр
    }));
  };

  // console.log('selectedFilters', selectedFilters);
  // console.log('filteredData', filteredData);

  const temp = () => {
    let tempArr = [];

    data.forEach((item) => {
      // Преобразуем дату в нужный формат
      const formattedDate = excelDateToFormattedDate(item.visitDate);

      // Создаем объект для текущей даты, если он еще не существует
      let dateEntry = tempArr.find((entry) => entry.date === formattedDate);

      // Если для этой даты еще нет записи, создаем новую
      if (!dateEntry) {
        dateEntry = { date: formattedDate, keys: [] };
        tempArr.push(dateEntry);
      }

      // Перебираем ttNumbers
      Object.entries(item.ttNumbers).forEach(([key, ttArray]) => {
        ttArray.forEach((tt) => {
          // Проверка, что surveyContentLink не пустое
          if (tt.surveyContentLink !== '') {
            dateEntry.keys.push(key); // Добавляем ключ в массив для текущей даты
          }
        });
      });
    });

    return tempArr;
  };

  return (
    <Container>
      <div
        style={{
          position: 'fixed',
          top: '100px',
          width: '100%',
          height: '100px',
          backgroundColor: 'gray',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <ul>
        {filters && Object.keys(filters).length > 0 ? (
          Object.keys(filters).map((elem, index) => (
            <li key={index}>
              <select name={elem} onChange={handleFilterChange}>
                <option value="">Выбрати все</option>
                {filters[elem] instanceof Set
                  ? [...filters[elem]].map((item, i) => (
                      <option value={item} key={i}>
                        {item}
                      </option>
                    ))
                  : null}
              </select>
            </li>
          ))
        ) : (
          <p>Загрузка фильтров...</p>
        )}
      </ul> */}
        <button onClick={updateBD} style={{ height: '60px' }}>
          Оновити базу даних
        </button>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </div>
      {filteredData.map((item) => {
        const formattedDate = excelDateToFormattedDate(item.visitDate);
        const tempData = temp();
        return (
          <SubContainer key={item._id}>
            <div style={{ fontWeight: '700', fontSize: '32px' }}>
              {formattedDate}
            </div>
            <ItemContainer>
              {Object.entries(item.ttNumbers).map(([key, ttArray]) => {
                const isKeyInTemp = tempData.some(
                  (tempItem) =>
                    tempItem.date === formattedDate &&
                    tempItem.keys.includes(key)
                );
                return isKeyInTemp ? (
                  <div key={key}>
                    <List key={key}>
                      <div style={{ fontSize: '32px', fontWeight: '700' }}>
                        {key}
                      </div>
                      <SemiContainer>
                        <DataList key={key}>
                          {ttArray[0]?.verified === true &&
                          ttArray[0]?.verifiedResult !== '' &&
                          ttArray[0]?.verifiedResult !== '(пусто)' ? (
                            <div></div>
                          ) : (
                            <fieldset
                              style={{
                                display: 'flex',
                                gap: '15px',
                                alignItems: 'center',
                              }}
                            >
                              <legend>Перевірка фото:</legend>

                              <div>
                                <input
                                  type="radio"
                                  id={`true-${key}`}
                                  name={`photoCheck-${key}-${item.visitDate}`}
                                  value="ок"
                                  style={{ marginRight: '5px' }}
                                  checked={
                                    selected[`${item.visitDate}-${key}`] ===
                                    'ок'
                                  }
                                  onChange={(e) =>
                                    handleRadioChange(
                                      item.visitDate,
                                      key,
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor="true">ОК</label>
                              </div>

                              <div>
                                <input
                                  type="radio"
                                  id={`false-${key}`}
                                  name={`photoCheck-${key}-${item.visitDate}`}
                                  value="не ок"
                                  style={{ marginRight: '5px' }}
                                  checked={
                                    selected[`${item.visitDate}-${key}`] ===
                                    'не ок'
                                  }
                                  onChange={(e) =>
                                    handleRadioChange(
                                      item.visitDate,
                                      key,
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor="false">НЕ ОК</label>
                              </div>
                              <button
                                onClick={() =>
                                  handleCheckClick(
                                    item.visitDate,
                                    key,
                                    selected[`${item.visitDate}-${key}`]
                                  )
                                }
                              >
                                Перевірити
                              </button>
                            </fieldset>
                          )}
                          <button
                            onClick={() =>
                              setIsVisibleDeteils(!isVisibleDetails)
                            }
                          >
                            Деталі ...
                            {isVisibleDetails ? (
                              <span>приховати &#x2191; </span>
                            ) : (
                              <span>показати &#x2193;</span>
                            )}
                          </button>
                          {isVisibleDetails && (
                            <BoxData>
                              <div>
                                <b>Дивізіон:</b> {ttArray[0].orgStructureRSM}
                              </div>
                              <div>
                                <b>Регіон:</b> {ttArray[0].orgStructureTSM}
                              </div>
                              <div>
                                <b>ТС:</b> {ttArray[0].orgStructureSUP}
                              </div>
                              <div>
                                <b>Маршрут:</b> {ttArray[0].orgStructureTP}
                              </div>
                              <div>
                                <b>Мережа:</b> {ttArray[0].ttNetwork}
                              </div>
                              <div>
                                <b>ТТ Назва:</b> {ttArray[0].ttActualName}
                              </div>
                              <div>
                                <b>ТТ Адреса:</b> {ttArray[0].ttActualAddress}
                              </div>
                              <div>
                                <b>ТТ Тип:</b> {ttArray[0].ttSubtype}
                              </div>
                              <div>
                                <b>ТТ Сегмент:</b> {ttArray[0].ttComment}
                              </div>
                              <div>{ttArray[0].ttAdditionalId}</div>
                            </BoxData>
                          )}
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {ttArray.map((tt, index) => (
                              <Box
                                key={index}
                                style={{ display: 'flex', gap: '10px' }}
                              >
                                <div>
                                  {tt.surveyPage === 'ФОТО-звіт анонсу ПРОМО'
                                    ? ''
                                    : tt.surveyAnswer === '(пусто)'
                                    ? '0'
                                    : `${tt.surveyElement} - ${tt.surveyAnswer}`}
                                </div>
                                {tt.surveyContentLink === '' ? (
                                  ''
                                ) : (
                                  <ImgContainer>
                                    <Text>{tt.surveyElement}</Text>
                                    <button
                                      onClick={() => {
                                        handleOpenImage();
                                        setLink(tt.surveyContentLink);
                                      }}
                                    >
                                      <Img
                                        src={tt.surveyContentLink}
                                        alt={tt.surveyContentLink}
                                      />
                                    </button>
                                  </ImgContainer>
                                )}
                              </Box>
                            ))}
                          </div>
                        </DataList>
                      </SemiContainer>
                    </List>
                  </div>
                ) : (
                  ''
                );
              })}
            </ItemContainer>
          </SubContainer>
        );
      })}
      {isZoomModalOpen && (
        <Modal onClose={handleCloseModal}>
          <ZoomImg link={link} />
        </Modal>
      )}
    </Container>
  );
};

export default DataTable;

const ZoomImg = ({ link }) => {
  return (
    <>
      <img
        src={link}
        alt={link}
        style={{
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100vh',
          display: 'block',
          margin: '0 auto',
        }}
      />
    </>
  );
};
