import Head from 'next/head';
import Image from 'next/image';
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PageWithLayout } from '~/assets/ts/types';
import Container from '~/components/common/Container';
import Input from '~/components/common/Input';
import iconArrowLeft from '~/assets/icons/arrow-left.svg';
import illustrationVerification from '~/assets/illustrations/verification.svg';
import Link from 'next/link';
import Button from '~/components/common/Button';
import { VerificationCodeInfo } from '~/_serverless/lib/types';
import notify from '~/assets/ts/notify';

type DigitInput = 'input1' | 'input2' | 'input3' | 'input4' | 'input5';

type InputsRefType = {
  [key in DigitInput]: () => HTMLInputElement;
};

const handleKeyDown =
  (inputsRef: React.MutableRefObject<InputsRefType>) =>
  (e: React.KeyboardEvent<HTMLInputElement>) => {
    const targetInput = e.target as HTMLInputElement;
    const position = parseInt(targetInput.id.slice(5), 10);

    if (position > 1 && e.key === 'Backspace' && !targetInput.value) {
      const getPrevInput =
        inputsRef.current[`input${position - 1}` as DigitInput];
      const prevInput = getPrevInput();
      prevInput.focus();
    }
  };

const handleKeyUp =
  (inputsRef: React.MutableRefObject<InputsRefType>) =>
  (e: React.KeyboardEvent<HTMLInputElement>) => {
    const targetInput = e.target as HTMLInputElement;
    const position = parseInt(targetInput.id.slice(5), 10);

    if (position < 5 && targetInput.value !== '') {
      const getNextInput =
        inputsRef.current[`input${position + 1}` as DigitInput];
      const nextInput = getNextInput();
      nextInput.focus();
    }
  };

const VerifyEmailPage: PageWithLayout = () => {
  const [inputs, setInputs] = useState({
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
  });
  const [seconds, setSeconds] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [isInvalidCode, setIsInvalidCode] = useState(false);

  const [timerMode, setTimerMode] = useState<'start' | 'stop' | null>('stop');
  const [intervalID, setIntervalID] = useState<number | null>(null);

  const otpCode = (() => {
    let code = '';
    Object.keys(inputs).forEach((input) => {
      code += inputs[input as DigitInput];
    });
    return code;
  })();

  const formIsValid = /^\d{5}$/.test(otpCode);

  const inputsRef = useRef<InputsRefType>({
    input1: () => document.querySelector('#input1') as HTMLInputElement,
    input2: () => document.querySelector('#input2') as HTMLInputElement,
    input3: () => document.querySelector('#input3') as HTMLInputElement,
    input4: () => document.querySelector('#input4') as HTMLInputElement,
    input5: () => document.querySelector('#input5') as HTMLInputElement,
  });

  function handleFirstInputPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const digitsRgx = /^\d{5}$/;
    const data = e.clipboardData.getData('Text');
    if (digitsRgx.test(data)) {
      e.preventDefault();
      setInputs({
        input1: data[0],
        input2: data[1],
        input3: data[2],
        input4: data[3],
        input5: data[4],
      });

      setTimeout(() => {
        inputsRef.current.input5().focus();
      }, 0);
    }
  }

  function startResendTimer() {
    setSeconds(60);
    setTimerMode('start');
  }

  function stopResendTimer() {
    if (intervalID !== null) {
      setTimerMode('stop');
      clearInterval(intervalID);
    }
  }

  function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid && !submitting) {
      const form: VerificationCodeInfo = {
        code: otpCode,
        email: 'john@doe.com',
      };
      setIsInvalidCode(false);
      setSubmitting(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(form);
        setSubmitting(false);
      }, 3000);
    }
  }

  function handleResendCode() {
    if (seconds === 0) {
      setResending(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('Code resent!');
        setResending(false);
        startResendTimer();
      }, 3000);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      notify('Code resent!');
      startResendTimer();
    }, 2000);

    return () => {
      stopResendTimer();
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      stopResendTimer();
    }
  }, [seconds]);

  useEffect(() => {
    if (timerMode === 'start') {
      setSeconds(60);
      setIntervalID(
        setInterval(() => {
          setSeconds((prevSecs) => prevSecs - 1);
        }, 1000) as unknown as number,
      );
    } else if (timerMode === 'stop') {
      stopResendTimer();
    }

    return () => {
      stopResendTimer();
    };
  }, [timerMode]);

  return (
    <>
      <Head>
        <title>Verify your email | TaskSheet</title>
      </Head>

      <main>
        <Container>
          <form
            onSubmit={handleVerify}
            autoComplete="off"
            className="signup-form width-max-content mx-auto bg-white pt-10 pb-16 md:p-16 md:pt-10 mb-16 rounded-large"
          >
            <div className="form-head mb-12">
              <Link href="/signup">
                <a type="button">
                  <Image
                    src={iconArrowLeft}
                    width="19px"
                    height="14px"
                    alt="arrow left icon"
                  />
                  <span className="inline-block ml-3">Back</span>
                </a>
              </Link>

              <div className="max-w-[168px] h-[158px] relative mx-auto mt-12">
                <Image src={illustrationVerification} layout="fill" />
              </div>

              <h3 className="font-bold text-2xl text-center mt-4 mb-5">
                Email Verification
              </h3>

              <p className="text-darkgray text-center">
                We sent a 5-digit code to{' '}
                <span className="text-main font-medium">john@doe.com</span>.{' '}
                <br />
                Enter the code in the fields below.
              </p>
            </div>

            <div className="digit-inputs flex justify-center">
              <Input
                id="input1"
                type="text"
                maxLength={1}
                value={inputs.input1}
                wrapperClass="w-[56px] md:w-[56px]"
                className="text-center text-lg font-bold"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setInputs((prevInputs) => ({
                    ...prevInputs,
                    input1: e.target.value,
                  }));
                }}
                onKeyDown={handleKeyDown(inputsRef)}
                onKeyUp={handleKeyUp(inputsRef)}
                onPaste={(e) => handleFirstInputPaste(e)}
              />
              <Input
                id="input2"
                type="text"
                maxLength={1}
                value={inputs.input2}
                disabled={!inputs.input1}
                wrapperClass="w-[56px] md:w-[56px]"
                className="text-center text-lg font-bold disabled:cursor-not-allowed"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setInputs((prevInputs) => ({
                    ...prevInputs,
                    input2: e.target.value,
                  }));
                }}
                onKeyDown={handleKeyDown(inputsRef)}
                onKeyUp={handleKeyUp(inputsRef)}
              />
              <Input
                id="input3"
                type="text"
                maxLength={1}
                value={inputs.input3}
                disabled={!inputs.input2}
                wrapperClass="w-[56px] md:w-[56px]"
                className="text-center text-lg font-bold disabled:cursor-not-allowed"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setInputs((prevInputs) => ({
                    ...prevInputs,
                    input3: e.target.value,
                  }));
                }}
                onKeyDown={handleKeyDown(inputsRef)}
                onKeyUp={handleKeyUp(inputsRef)}
              />
              <Input
                id="input4"
                type="text"
                maxLength={1}
                value={inputs.input4}
                disabled={!inputs.input3}
                wrapperClass="w-[56px] md:w-[56px]"
                className="text-center text-lg font-bold disabled:cursor-not-allowed"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setInputs((prevInputs) => ({
                    ...prevInputs,
                    input4: e.target.value,
                  }));
                }}
                onKeyDown={handleKeyDown(inputsRef)}
                onKeyUp={handleKeyUp(inputsRef)}
              />
              <Input
                id="input5"
                type="text"
                maxLength={1}
                value={inputs.input5}
                disabled={!inputs.input4}
                wrapperClass="w-[56px] md:w-[56px]"
                className="text-center text-lg font-bold disabled:cursor-not-allowed"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setInputs((prevInputs) => ({
                    ...prevInputs,
                    input5: e.target.value,
                  }));
                }}
                onKeyDown={handleKeyDown(inputsRef)}
                onKeyUp={handleKeyUp(inputsRef)}
              />
            </div>

            <div className="text-center text-[16px] mt-8">
              <p className="text-darkgray">Didn’t receive the code?</p>
              <p className="text-darkgray">
                Resend after{' '}
                <span className="text-fakeblack font-medium">
                  {seconds?.toString().padStart(2, '0')}
                </span>{' '}
                seconds.
              </p>

              <div className="text-center mt-3">
                <button
                  type="button"
                  disabled={seconds !== 0 || resending}
                  className="text-main font-medium disabled:opacity-25 disabled:cursor-not-allowed"
                  onClick={() => handleResendCode()}
                >
                  {resending ? 'Resending...' : 'Resend Code'}
                </button>
              </div>
            </div>

            {isInvalidCode && (
              <div className="text-center mt-8">
                <span className="text-red-600 font-medium">
                  The code you entered is incorrect.
                </span>
              </div>
            )}

            <div className="text-center mt-10">
              <Button
                type="submit"
                loading={submitting}
                disabled={submitting || !formIsValid}
              >
                {submitting ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </form>
        </Container>
      </main>
    </>
  );
};

VerifyEmailPage.layout = 'auth';

export default VerifyEmailPage;
