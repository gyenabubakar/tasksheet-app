import Head from 'next/head';
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
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

type TabType = 'general' | 'security';

interface FormDataType {
  name: string;
  email: string;
}

interface FormErrors extends FormValidationErrors {
  name: string | null;
  email: string | null;
}

const UserProfileSettingsPage: PageWithLayout = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const email = 'john@doe.com';
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';

  const nameIsValid = name ? FormValidation.isValidName(name) : null;
  const formIsValid = nameIsValid && validator.isEmail(email);

  const newAvatar = selectedFile
    ? window.URL.createObjectURL(selectedFile)
    : null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { errors } = useFormValidation<FormErrors>(
    {
      name: null,
      email: null,
    },
    [nameIsValid, true],
    [
      'Enter a valid name.',
      'Enter a valid email address.',
      'Password must be at least 6 characters long with at least 1 uppercase and lowercase letter, 1 number and 1 symbol.',
    ],
  );

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

    if (formIsValid && !submitting) {
      const form: FormDataType = {
        name,
        email,
      };

      setSubmitting(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(form);

        notify('Details updated successfully.', {
          type: 'success',
        });
        setSubmitting(false);
      }, 3000);
    }
  }

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
                className="w-10 h-10 rounded-full bg-main absolute flex items-center justify-center shadow-lg left-[35%] bottom-[-15px]"
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
                error={"Can't update your email at this time."}
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
                  loading={submitting}
                  disabled={submitting || !formIsValid}
                >
                  {submitting ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

UserProfileSettingsPage.layout = 'app';

export default UserProfileSettingsPage;
