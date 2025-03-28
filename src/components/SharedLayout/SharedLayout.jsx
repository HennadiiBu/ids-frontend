import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { Modal } from '../Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';

import { openModal } from '../../redux/modals/slice';
import { selectIsAuthenticated, selectToken } from '../../redux/auth/selectors';
import LoginForm from '../LoginForm/LoginForm';
import { Header } from '../Header/Header';

const SharedLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(openModal('signIn'));
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
      dispatch(openModal('signIn'));
    }
  }, [token, navigate, dispatch]);

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

      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default SharedLayout;
