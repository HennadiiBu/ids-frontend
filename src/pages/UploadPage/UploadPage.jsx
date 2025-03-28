import UploadExcel from '../../components/UploadExcel/UploadExcel';
import { Container, Block, Title } from './UploadPage.styled';

const UploadPage = () => {
  return (
    <Container>
      <Block>
        <Title>Second Page</Title>
       <UploadExcel />
      </Block>
    </Container>
  );
};

export default UploadPage;
