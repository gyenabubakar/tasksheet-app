import Head from 'next/head';
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { PageWithLayout } from '~/assets/ts/types';
import pageTitleSuffix from '~/assets/pageTitleSuffix';
import Navigation from '~/components/common/Navigation';
import notify from '~/assets/ts/notify';
import iconUser from '~/assets/icons/user.svg';
import Input from '~/components/common/Input';
import useFormValidation, {
  FormValidationErrors,
} from '~/hooks/useFormValidation';
import FormValidation from '~/assets/ts/form-validation';
import iconEmail from '~/assets/icons/email.svg';
import Button from '~/components/common/Button';
import validator from 'validator';
import iconLock from '~/assets/icons/lock.svg';

type TabType = 'general' | 'security';

interface FormDataType {
  name: string;
  email: string;
}

interface GeneralFormErrors extends FormValidationErrors {
  name: string | null;
  email: string | null;
}

interface SecurityFormErrors extends FormValidationErrors {
  currentPassword: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
}

const UserProfileSettingsPage: PageWithLayout = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // general tab
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submittingGeneralForm, setSubmittingGeneralForm] = useState(false);
  const [name, setName] = useState('');
  const email = 'john@doe.com';
  const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';

  const nameIsValid = name ? FormValidation.isValidName(name) : null;
  const generalFormIsValid = nameIsValid && validator.isEmail(email);

  // security tab
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordIsMasked, setPasswordIsMasked] = useState(false);
  const [submittingSecurityForm, setSubmittingSecurityForm] = useState(false);

  const passwordIsValid = currentPassword ? currentPassword.length > 0 : null;
  const newPassIsValid = newPassword
    ? validator.isStrongPassword(newPassword, {
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      })
    : null;
  const passwordsAreEqual = !confirmPassword
    ? null
    : newPassword === confirmPassword;

  const securityFormIsValid =
    passwordIsValid && newPassIsValid && passwordsAreEqual;

  const newAvatar = selectedFile
    ? window.URL.createObjectURL(selectedFile)
    : null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { errors: generalErrors } = useFormValidation<GeneralFormErrors>(
    {
      name: null,
      email: null,
    },
    [nameIsValid, true],
    ['Enter a valid name.', 'Enter a valid email address.'],
  );

  const { errors: securityErrors } = useFormValidation<SecurityFormErrors>(
    {
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
    },
    [passwordIsValid, newPassIsValid, passwordsAreEqual],
    [
      'This field is required.',
      'Password must be at least 6 characters long with at least 1 uppercase and lowercase letter, 1 number and 1 symbol.',
      "Passwords aren't the same.",
    ],
  );

  const errors = {
    ...generalErrors,
    ...securityErrors,
  };

  async function switchTabs(tab: TabType) {
    setActiveTab(tab);
    if (tab !== 'general') {
      await router.push(`/app/profile/settings?tab=${tab}`, undefined, {
        shallow: true,
      });
    } else {
      await router.push(`/app/profile/settings`, undefined, {
        shallow: true,
      });
    }
  }

  function onSelectFile() {
    if (!uploading) {
      fileInputRef.current!.click();
    }
  }

  function onUploadAvatar() {
    if (!uploading && selectedFile && newAvatar) {
      if (selectedFile.size / 1024 > 300) {
        notify('Maximum file size is 300KB.', {
          type: 'error',
        });
        fileInputRef.current!.value = '';
        return;
      }

      setUploading(true);
      setTimeout(() => {
        setSelectedFile(null);
        fileInputRef.current!.value = '';

        // eslint-disable-next-line no-console
        console.log(selectedFile);

        notify('New avatar uploaded!', {
          type: 'success',
        });
        setUploading(false);
      }, 2000);
    }
  }

  function submitPersonalInfo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (generalFormIsValid && !submittingGeneralForm) {
      const form: FormDataType = {
        name,
        email,
      };

      setSubmittingGeneralForm(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(form);

        notify('Details updated successfully.', {
          type: 'success',
        });
        setSubmittingGeneralForm(false);
      }, 3000);
    }
  }

  function handleChangePassword() {
    console.log('handleChangePassword');
  }

  useEffect(() => {
    if (!router.query.tab) {
      setActiveTab('general');
      return;
    }

    setActiveTab(router.query.tab as TabType);
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Profile Settings{pageTitleSuffix}</title>
      </Head>

      <Navigation />

      <main>
        <h1 className="text-2xl sm:text-4xl font-bold">Update your profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
          <div className="settings-tabs flex lg:block lg:col-start-1 lg:col-end-5">
            <div
              className={`settings-tab py-3 cursor-pointer ${
                activeTab === 'general' ? 'active' : ''
              }`}
              onClick={() => switchTabs('general')}
            >
              General
            </div>

            <div
              className={`settings-tab py-3 cursor-pointer ${
                activeTab === 'security' ? 'active' : ''
              }`}
              onClick={() => switchTabs('security')}
            >
              Security
            </div>
          </div>

          <div className="tab-content lg:col-start-5 lg:col-end-12">
            {activeTab === 'general' && (
              <div className="general-user-settings-wrapper">
                <div className="avatar-wrapper w-[max-content] relative mx-auto mt-12">
                  <input
                    ref={fileInputRef}
                    type="file"
                    // value={}
                    accept="image/jpeg, image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size / 1024 > 300) {
                          notify('Maximum file size is 300KB.', {
                            type: 'error',
                          });
                          fileInputRef.current!.value = '';
                          return;
                        }
                        setSelectedFile(file || null);
                      }
                    }}
                  />

                  <div className="h-32 w-32 rounded-full overflow-hidden relative ring-4 ring-white">
                    <Image src={newAvatar || avatar} layout="fill" />
                  </div>

                  <button
                    className="w-10 h-10 rounded-full bg-main absolute flex items-center justify-center shadow-lg left-[35%] bottom-[-15px] ring-2 ring-white focus:bg-darkmain"
                    onClick={() => onSelectFile()}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.0002 4C15.3902 4 14.8302 3.65 14.5502 3.11L13.8302 1.66C13.3702 0.75 12.1702 0 11.1502 0H8.86017C7.83017 0 6.63017 0.75 6.17017 1.66L5.45017 3.11C5.17017 3.65 4.61017 4 4.00017 4C1.83017 4 0.110168 5.83 0.250168 7.99L0.770168 16.25C0.890168 18.31 2.00017 20 4.76017 20H15.2402C18.0002 20 19.1002 18.31 19.2302 16.25L19.7502 7.99C19.8902 5.83 18.1702 4 16.0002 4ZM8.50017 5.25H11.5002C11.9102 5.25 12.2502 5.59 12.2502 6C12.2502 6.41 11.9102 6.75 11.5002 6.75H8.50017C8.09017 6.75 7.75017 6.41 7.75017 6C7.75017 5.59 8.09017 5.25 8.50017 5.25ZM10.0002 16.12C8.14017 16.12 6.62017 14.61 6.62017 12.74C6.62017 10.87 8.13017 9.36 10.0002 9.36C11.8702 9.36 13.3802 10.87 13.3802 12.74C13.3802 14.61 11.8602 16.12 10.0002 16.12Z"
                        fill="#ffffff"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  className={`actions text-sm mt-8 flex items-center justify-center ${
                    selectedFile && newAvatar ? 'visible' : 'invisible'
                  }`}
                >
                  <button
                    className="font-medium text-main"
                    onClick={onUploadAvatar}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>

                  {!uploading && (
                    <button
                      className={`font-medium ml-3 text-red-500 hover:text-red-600 ${
                        !uploading ? 'inline-block' : 'hidden'
                      }`}
                      onClick={() => {
                        fileInputRef.current!.value = '';
                        setSelectedFile(null);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <form onSubmit={submitPersonalInfo} className="mt-12">
                  <Input
                    id="name"
                    value={name}
                    maxLength={255}
                    label="Full name"
                    wrapperClass="mb-1.5 mx-auto"
                    error={errors.name}
                    placeholder="Enter your full name"
                    icon={{
                      position: 'left',
                      elements: [
                        <div className="absolute bottom-[0.55rem] left-[1.125rem]">
                          <Image
                            src={iconUser}
                            width="19px"
                            height="21px"
                            alt="User icon"
                          />
                        </div>,
                      ],
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setName(e.target.value);
                    }}
                  />

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    label="Email"
                    wrapperClass="mb-1.5 mx-auto"
                    error={"Changing email isn't supported yet."}
                    icon={{
                      position: 'left',
                      elements: [
                        <div className="absolute bottom-[0.55rem] left-[1.125rem] disabled:cursor-not-allowed">
                          <Image
                            src={iconEmail}
                            width="22px"
                            height="18px"
                            alt="User icon"
                          />
                        </div>,
                      ],
                    }}
                    placeholder="Enter email address"
                    disabled
                  />

                  <div className="flex justify-center mt-10">
                    <Button
                      type="submit"
                      loading={submittingGeneralForm}
                      disabled={submittingGeneralForm || !generalFormIsValid}
                    >
                      {submittingGeneralForm ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="user-security-settings-wrapper">
                <h3 className="text-3xl font-medium text-darkgray text-center mb-8">
                  Change your password
                </h3>

                <form onSubmit={handleChangePassword}>
                  <Input
                    id="current-password"
                    type={passwordIsMasked ? 'password' : 'text'}
                    value={currentPassword}
                    label="Current Password"
                    placeholder="Enter your current password"
                    wrapperClass="mb-1.5 mx-auto"
                    error={errors.currentPassword}
                    icon={{
                      position: 'both',
                      elements: [
                        <div className=" absolute bottom-[0.55rem] left-[1.125rem]">
                          <Image
                            src={iconLock}
                            width="22px"
                            height="20px"
                            alt="User icon"
                          />
                        </div>,

                        <button
                          type="button"
                          className="text-sm uppercase font-bold text-main inline-block absolute bottom-[0.95rem] right-[1.125rem] "
                          onClick={() => setPasswordIsMasked((state) => !state)}
                        >
                          {passwordIsMasked ? 'Show' : 'Hide'}
                        </button>,
                      ],
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setCurrentPassword(e.target.value);
                    }}
                  />

                  <Input
                    id="new-password"
                    type={passwordIsMasked ? 'password' : 'text'}
                    value={newPassword}
                    label="New Password"
                    placeholder="Enter new password"
                    wrapperClass="mb-1.5 mx-auto"
                    error={errors.newPassword}
                    icon={{
                      position: 'both',
                      elements: [
                        <div className=" absolute bottom-[0.55rem] left-[1.125rem]">
                          <Image
                            src={iconLock}
                            width="22px"
                            height="20px"
                            alt="User icon"
                          />
                        </div>,

                        <button
                          type="button"
                          className="text-sm uppercase font-bold text-main inline-block absolute bottom-[0.95rem] right-[1.125rem] "
                          onClick={() => setPasswordIsMasked((state) => !state)}
                        >
                          {passwordIsMasked ? 'Show' : 'Hide'}
                        </button>,
                      ],
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setNewPassword(e.target.value);
                    }}
                  />

                  <Input
                    id="confirm-password"
                    type={passwordIsMasked ? 'password' : 'text'}
                    value={confirmPassword}
                    label="Confirm Password"
                    placeholder="Repeat new password"
                    wrapperClass="mb-1.5 mx-auto"
                    error={errors.confirmPassword}
                    icon={{
                      position: 'both',
                      elements: [
                        <div className=" absolute bottom-[0.55rem] left-[1.125rem]">
                          <Image
                            src={iconLock}
                            width="22px"
                            height="20px"
                            alt="User icon"
                          />
                        </div>,

                        <button
                          type="button"
                          className="text-sm uppercase font-bold text-main inline-block absolute bottom-[0.95rem] right-[1.125rem]"
                          onClick={() => setPasswordIsMasked((state) => !state)}
                        >
                          {passwordIsMasked ? 'Show' : 'Hide'}
                        </button>,
                      ],
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />

                  <div className="flex justify-center mt-10">
                    <Button
                      type="submit"
                      loading={submittingSecurityForm}
                      disabled={submittingSecurityForm || !securityFormIsValid}
                    >
                      {submittingSecurityForm
                        ? 'Hang on...'
                        : 'Change Password'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

UserProfileSettingsPage.layout = 'app';

export default UserProfileSettingsPage;
