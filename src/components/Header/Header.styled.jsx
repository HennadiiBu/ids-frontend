import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const HeaderContainer = styled.div`
  /* padding: 20px; */
position: relative;
`;

export const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 100%;
  background-color: gray;
  z-index: 1000;

  padding: 10px 0;
`;

export const StyledLink = styled(Link)`
  padding: 8px 16px;
  color: #000;

  font-size: 24px;
`;

export const IconWrapper = styled.svg`
  width: ${(props) => props.size || '12px'};
  height: ${(props) => props.size || '12px'};
  fill: ${(props) => props.color || '#d02222'};
  display: inline-block;
  margin-right: 5px;
`;
