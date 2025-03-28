import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/data/operations';
import { selectData, selectIsLoading } from '../redux/data/selectors';
import { Container, Img, ItemContainer, List } from './DataTable.styled';

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

  return (
    <Container>
      {data.map((item) => {
        return (
          <ItemContainer key={item._id}>
            <Img src={item.surveyContentLink} alt={item.surveyContentLink} />
            <List>
              <li>Візит: Дата {item.createdAt}</li>
              <li>Міс'Рік {item.monthYear}</li>
              <li>Оргструктура: RSM {item.orgStructureRSM}</li>
              <li>Оргструктура: TSM {item.orgStructureTSM}</li>
              <li>Оргструктура: SUP {item.orgStructureSUP}</li>
              <li>Оргструктура: ТП {item.orgStructureTP}</li>
              <li>ТТ: Мережа {item.ttNetwork}</li>
              <li>ТТ: № {item.ttNumber}</li>
              <li>ТТ: Фактична назва {item.ttActualName}</li>
              <li>ТТ: Фактична адреса {item.ttActualAddress}</li>
              <li>ТТ: Підтип {item.ttSubtype}</li>
              <li>ТТ: Коментар (Сегмент) {item.ttComment}</li>
              <li>ТТ: Додатковий ідентифікатор {item.ttAdditionalId}</li>
            </List>
          </ItemContainer>
        );
      })}
    </Container>
  );
};

export default DataTable;
