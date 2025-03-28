import styled from '@emotion/styled';

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(4, 4, 4, 0.4);
`;

export const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  min-height: 280px;
  max-height: 100vh;
  transform: translate(-50%, -50%);
  padding: 48px 24px;
  background-color: #10100f;
  border-radius: 12px;
  border: 1px solid rgba(239, 237, 232, 0.2);

  @media screen and (min-width: 375px) {
    /* max-width: 335px; */
  }

  @media screen and (min-width: 768px) {
    min-width: 430px;
    /* max-width: 694px; */
    width: fit-content;
  }
`;

export const ModalClose = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 22px;
  height: 22px;
`;
