import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
flex-wrap: wrap;
align-items: center;
justify-content: center;
gap: 30px;

`;

export const ItemContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px;
  border: 1px solid ;
`;

export const ImgContainer = styled.div`
  width: 300px;
  height: 500px;
`;

export const Img = styled.img`
  margin: 0 auto;
  max-height: 500px;
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Item = styled.li`
max-width: 300px;
`;
