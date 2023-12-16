import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Router from 'next/router';
import Link from 'next/link';

import { en } from '@/locale/en';
import { ru } from '@/locale/ru';
import { schema } from '@/validation/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAuthError } from '../../utils/getAuthError';
import { useAuth } from '../../context/AuthProvider';
import { ROUTES } from '@/constants/routes';
import AuthButton from '../AuthButton/AuthButton';
import AuthInput from '../AuthInput/AuthInput';
import { AuthViewProps, schemaType } from '@/types/types';

import styles from './style.module.scss';

const SignUpController = ({ authCallback }: AuthViewProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const lang: 'ru' | 'en' = 'en';
  const curLang = lang === 'en' ? en : ru;

  const handlePasswordVisibility = (): void => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (user) {
      setLoading(false);
      Router.push(ROUTES.MAIN);
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<schemaType>({ mode: 'all', resolver: yupResolver(schema) });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setLoading(true);
    try {
      await authCallback(email, password);
    } catch (e) {
      const err = getAuthError(e);
      setAuthError(err);
      setLoading(false);
    }
  });

  return (
    <section className={styles['form__wrapper']}>
      <div className={styles['form__block']}>
        <form className={styles['form']} onSubmit={onSubmit}>
          <div className={styles['form__title-container']}>
            <h3 className={styles['form__title']}>
              {curLang.auth.signUpTitle}
            </h3>
            {authError && (
              <p className={styles['form__error']}>
                {curLang.auth.alreadyExists}
              </p>
            )}
          </div>
          <p className={styles['form__account']}>
            {curLang.auth.alreadyRegistered}{' '}
            <Link className={styles['form__link']} href={ROUTES.SIGN_IN}>
              {curLang.auth.signInHere}
            </Link>
            <br />
            or{' '}
            <Link className={styles['form__link']} href={ROUTES.WELCOME}>
              back to welcome page
            </Link>
          </p>
          <div
            className={`${styles['form__controls']} ${styles['form__controls_signin']}`}
          >
            <AuthInput
              id="email"
              type="text"
              register={register('email')}
              label={curLang.auth.email}
              error={errors.email?.message}
              placeholder={''}
            />
            <AuthInput
              id="password"
              type={isVisible ? 'text' : 'password'}
              register={register('password')}
              label={curLang.auth.password}
              error={errors.password?.message}
              placeholder={''}
              isVisible={isVisible}
              handlePasswordVisibility={handlePasswordVisibility}
            />
          </div>

          <AuthButton
            text={curLang.auth.signUp}
            type="submit"
            isLoading={loading}
            isDisabled={!isValid || loading}
          />
        </form>
      </div>
    </section>
  );
};

export default SignUpController;