import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Modal } from '../Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';

import { openModal } from '../../redux/modals/slice';
import { selectIsAuthenticated } from '../../redux/auth/selectors';
import LoginForm from '../LoginForm/LoginForm';
import { Header } from '../Header/Header';

const SharedLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(openModal('signIn'));
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      dispatch(openModal('signIn'));
    }
  }, [isAuthenticated, navigate, dispatch]);

  return (
    <>
      {!isAuthenticated && (
        <Modal>
          <LoginForm />
        </Modal>
      )}
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default SharedLayout;
