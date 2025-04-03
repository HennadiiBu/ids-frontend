import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 30px;
  width: 90%;

  position: relative;

  margin-top: 180px;
`;

export const SubContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* align-items: center; */
  justify-content: center;
  gap: 30px;
  border: 1px solid;
  border-radius: 20px;
  flex-direction: column;
  width: 100%;
  padding: 10px;

  overflow-x: scroll;
`;

export const ItemContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px;

  /* width: 400px; */
`;
export const SemiContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px;
`;

export const ImgContainer = styled.div`
  /* width: 200px; */
  /* height: 500px; */
  display: flex;
  gap: 10px;
`;

export const Img = styled.img`
  margin: 0 auto;
  max-height: 200px;
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px;
  border: 1px solid;
  border-radius: 20px;

  /* width: 300px; */
`;
export const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const DataList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 5px;
`;

export const Item = styled.li`
  max-width: 300px;
`;

export const BoxData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
`;

export const Text = styled.p`
  width: 100px;
`;
