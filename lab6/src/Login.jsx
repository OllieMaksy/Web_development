import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const navigate = useNavigate();


    function handleLogin(e) {
        e.preventDefault();
        if (username === '' || password === '') {
          setError('Please fill in all fields');
        } else if (username === 'Olha' && password === 'Olha3') {
          setError('');
          navigate('/dashboard');
        } else {
          setError('Incorrect username or password');
        }
      }

    let errorMessage = null;
    if(error !== '') {
     errorMessage = <p className="error-message">{error}</p>;
    }

    return (
      <div className="login-card">
        <h1>Welcome weather app!</h1>
        <p>Please log in to continue</p>
  
        <form onSubmit={handleLogin}>
        {errorMessage}
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />   
  
          <input
          type ="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

          <label className="remember-me">
            <input type="checkbox" />
            Remember me
           </label>
          <button type="submit">Log in</button>
        </form>
      </div>
    );
  }
  
  export default Login;