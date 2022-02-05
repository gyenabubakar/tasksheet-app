import Head from 'next/head';
import React, { ChangeEvent, useRef, useState } from 'react';
import { PageWithLayout } from '~/assets/ts/types';
import Container from '~/components/common/Container';
import Input from '~/components/common/Input';

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

  const inputsRef = useRef<InputsRefType>({
    input1: () => document.querySelector('#input1') as HTMLInputElement,
    input2: () => document.querySelector('#input2') as HTMLInputElement,
    input3: () => document.querySelector('#input3') as HTMLInputElement,
    input4: () => document.querySelector('#input4') as HTMLInputElement,
    input5: () => document.querySelector('#input5') as HTMLInputElement,
  });

  function handleFirstInputPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const digitsRgx = /^\d{6}$/;
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

  function handleVerify() {}

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
            className="signup-form width-max-content mx-auto bg-white pt-10 pb-16 md:p-16 mb-20 rounded-large"
          >
            <div className="digit-inputs flex justify-center">
              <Input
                id="input1"
                type="text"
                maxLength={1}
                value={inputs.input1}
                autoFocus
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
                onPaste={handleFirstInputPaste}
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
          </form>
        </Container>
      </main>
    </>
  );
};

VerifyEmailPage.layout = 'auth';

export default VerifyEmailPage;
