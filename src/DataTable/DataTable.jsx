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

const DataTable = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);
  const isLoading = useSelector(selectIsLoading);
  const isZoomModalOpen = useSelector(selectZoomIn);

  const [link, setLink] = useState(null);
  const [selected, setSelected] = useState({});
  const [newData, setNewData] = useState([...data]);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchData({})); // Ты можешь передать фильтры сюда
  }, [dispatch]);

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
    try {
      // Отправляем данные, которые уже обновлены в состоянии newData
      const response = await axios.patch('/api/data/update', {
        data: newData, // Используем новое состояние данных
      });

      // Обрабатываем успешный ответ
      if (response.status === 200) {
        console.log('База данных успешно обновлена');
        // Если нужно, можно выполнить дополнительную логику после успешного обновления
        // Например, уведомление пользователю или перезагрузка данных
      }
    } catch (error) {
      console.error('Ошибка при обновлении базы данных:', error);
      // Можно добавить уведомление об ошибке пользователю
    }
  };

  return (
    <Container>
      <button onClick={updateBD}>Оновити базу даних</button>
      {data.map((item) => {
        return (
          <SubContainer key={item._id}>
            <div style={{ margin: '0 auto', fontWeight: '700' }}>
              {excelDateToFormattedDate(item.visitDate)}
            </div>
            <ItemContainer>
              {Object.entries(item.ttNumbers).map(([key, ttArray]) => (
                <List key={key}>
                  <div>{key}</div>
                  <SemiContainer>
                    <DataList key={key}>
                      {ttArray[0]?.verified === true &&
                      ttArray[0]?.verifiedResult !== '' ? (
                        <div></div>
                      ) : (
                        <fieldset>
                          <legend>Перевірка фото:</legend>

                          <div>
                            <input
                              type="radio"
                              id={`true-${key}`}
                              name={`photoCheck-${key}-${item.visitDate}`}
                              value="ок"
                              checked={
                                selected[`${item.visitDate}-${key}`] === 'ок'
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
                              checked={
                                selected[`${item.visitDate}-${key}`] === 'не ок'
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
                          <p>
                            Вибрано:
                            {selected[`${item.visitDate}-${key}`] ??
                              'Нічого не вибрано'}{' '}
                          </p>
                        </fieldset>
                      )}

                      <BoxData>
                        <div>{ttArray[0].orgStructureRSM}</div>
                        <div>{ttArray[0].orgStructureTSM}</div>
                        <div>{ttArray[0].orgStructureSUP}</div>
                        <div>{ttArray[0].orgStructureTP}</div>
                        <div>{ttArray[0].ttNetwork}</div>
                        <div>{ttArray[0].ttActualName}</div>
                        <div>{ttArray[0].ttActualAddress}</div>
                        <div>{ttArray[0].ttSubtype}</div>
                        <div>{ttArray[0].ttComment}</div>
                        <div>{ttArray[0].ttAdditionalId}</div>
                      </BoxData>
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
                    </DataList>
                  </SemiContainer>
                </List>
              ))}
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
