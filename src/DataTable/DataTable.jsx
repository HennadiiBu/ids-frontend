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

const DataTable = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectData);
  const isLoading = useSelector(selectIsLoading);
  const isZoomModalOpen = useSelector(selectZoomIn);

  const [link, setLink] = useState(null);

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

  const handleOpenImage = () => {
    dispatch(closeAllModals());
    dispatch(openModal('zoomIn'));
  };

  const handleCloseModal = () => {
    dispatch(closeModal('zoomIn'));
  };

  return (
    <Container>
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
