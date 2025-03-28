import UploadExcel from '../../components/UploadExcel/UploadExcel';
import { Container, Block } from './UploadPage.styled';

const UploadPage = () => {
  return (
    <Container>
      <Block>
       <UploadExcel />
      </Block>
    </Container>
  );
};

export default UploadPage;
