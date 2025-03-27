import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { Modal } from '../Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';

import { openModal } from '../../redux/modals/slice';
import { selectIsAuthenticated } from '../../redux/auth/selectors';
import LoginForm from '../LoginForm/LoginForm';

const SharedLayout = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(openModal('signIn'));
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      {!isAuthenticated && (
        <Modal>
          <LoginForm />
        </Modal>
      )}
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
