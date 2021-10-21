import { useEffect } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { api } from '../../services/api';

// import { useAuth } from '../../hooks/useAuth';
import styles from './styles.module.scss';

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
};

export function LoginBox() {
  // const { signInUrl } = useAuth()
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=98a45a4a8613cbbfcc3e`;

  async function signIn(code: string) {
    // setIsSigningIn(true);

    try {
      const response = await api.post<AuthResponse>('/authenticate', {
        code,
      });

      const { token, user } = response.data;

      localStorage.setItem('@dowhile:token', token);

      api.defaults.headers.common.authorization = `Bearer ${token}`;

      console.log(user);

      // setUser(user)
    } catch (err) {
      console.log(err);
    } finally {
      // setIsSigningIn(false);
    }
  }

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  });

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signWithGithubButton}>
        <VscGithubInverted size={24} />
        Entrar com Github
      </a>
    </div>
  );
}
