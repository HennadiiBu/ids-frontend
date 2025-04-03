import { useState } from 'react';
import { signIn } from '../../redux/auth/operations';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modals/slice';
import { logIn } from '../../redux/auth/slice';

const LoginForm = () => {
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');

  const PASS = import.meta.env.VITE_API_PASS;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === PASS) {
      dispatch(logIn());
      dispatch(closeModal('signIn'));
    } else {
      alert('Пароль не вірний!');
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default LoginForm;
