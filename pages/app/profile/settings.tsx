import Head from 'next/head';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { PageWithLayout } from '~/assets/ts/types';
import pageTitleSuffix from '~/assets/pageTitleSuffix';
import Navigation from '~/components/common/Navigation';
import notify from '~/assets/ts/notify';

type TabType = 'general' | 'security';

const UserProfileSettingsPage: PageWithLayout = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde';

  const newAvatar = selectedFile
    ? window.URL.createObjectURL(selectedFile)
    : null;

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <Head>
        <title>Profile Settings{pageTitleSuffix}</title>
      </Head>

      <Navigation />

      <main>
        <h1 className="text-4xl font-bold">Update your profile</h1>

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
            <div>
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

              {selectedFile && newAvatar && (
                <div className="actions text-sm mt-8 flex items-center justify-center">
                  <button
                    className="font-medium text-main"
                    onClick={onUploadAvatar}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>

                  {!uploading && (
                    <button className="font-medium ml-3 text-red-500 hover:text-red-600">
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

UserProfileSettingsPage.layout = 'app';

export default UserProfileSettingsPage;
