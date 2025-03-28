import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/data/operations';
import { selectData, selectIsLoading } from '../redux/data/selectors';
import {
  Container,
  Img,
  ImgContainer,
  Item,
  ItemContainer,
  List,
} from './DataTable.styled';

const DataTable = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);
  const isLoading = useSelector(selectIsLoading);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchData({})); // Ты можешь передать фильтры сюда
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const excelDateToFormattedDate = (excelDate) => {
    const excelEpoch = new Date(1900, 0, 1); // 1 января 1900 года
    const date = new Date(excelEpoch.getTime() + excelDate * 86400000); // Преобразуем в миллисекунды

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  return (
    <Container>
      {data.map((item) => {
        return (
          <ItemContainer key={item._id}>
            <div>{excelDateToFormattedDate(item.visitDate)}</div>
            <ItemContainer>
              {Object.entries(item.ttNumbers).map(([key, ttArray]) => (
                <List key={key}>
                  <div>{key}</div>
                  <ItemContainer>
                    <List key={key} style={{ display: 'flex', gap: '10px' }}>
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

                      {ttArray.map((tt, index) => (
                        <List
                          key={index}
                          style={{ display: 'flex', gap: '10px' }}
                        >
                          <div>
                            {tt.surveyPage === 'ФОТО-звіт анонсу ПРОМО'
                              ? ''
                              : `${tt.surveyElement} - ${tt.surveyAnswer}`}
                          </div>
                          {tt.surveyContentLink === '' ? (
                            ''
                          ) : (
                            <Img
                              src={tt.surveyContentLink}
                              alt={tt.surveyContentLink}
                            />
                          )}
                        </List>
                      ))}
                    </List>
                  </ItemContainer>
                </List>
              ))}
            </ItemContainer>

            {/* <ImgContainer>
              <Img src={item.surveyContentLink} alt={item.surveyContentLink} />
            </ImgContainer>
            <List>
              <Item>Візит: Дата {item.createdAt}</Item>
              <Item>Оргструктура: RSM {item.orgStructureRSM}</Item>
              <Item>Оргструктура: TSM {item.orgStructureTSM}</Item>
              <Item>Оргструктура: SUP {item.orgStructureSUP}</Item>
              <Item>Оргструктура: ТП {item.orgStructureTP}</Item>
              <Item>ТТ: Мережа {item.ttNetwork}</Item>
              <Item>ТТ: № {item.ttNumber}</Item>
              <Item>ТТ: Фактична назва {item.ttActualName}</Item>
              <Item>ТТ: Фактична адреса {item.ttActualAddress}</Item>
              <Item>ТТ: Підтип {item.ttSubtype}</Item>
              <Item>ТТ: Коментар (Сегмент) {item.ttComment}</Item>
              <Item>ТТ: Додатковий ідентифікатор {item.ttAdditionalId}</Item>
            </List> */}
          </ItemContainer>
        );
      })}
    </Container>
  );
};

export default DataTable;
