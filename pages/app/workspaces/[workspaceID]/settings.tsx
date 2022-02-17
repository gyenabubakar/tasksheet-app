import { useRouter } from 'next/router';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { PageWithLayout } from '~/assets/ts/types';
import Navigation from '~/components/common/Navigation';
import Input from '~/components/common/Input';
import useFormValidation, {
  FormValidationErrors,
} from '~/hooks/useFormValidation';
import Button from '~/components/common/Button';
import { WorkspaceInfo } from '~/_serverless/lib/types';
import notify from '~/assets/ts/notify';
import Switch from '~/components/common/Switch';

interface WorkspaceFormErrors extends FormValidationErrors {
  name: string | null;
  description: string | null;
}

type TabType = 'general' | 'join-requests';

const WorkspaceSettingsPage: PageWithLayout = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const [pauseJoinRequests, setPauseJoinRequests] = useState(false);
  const [togglingPauseRequests, setTogglingPauseRequests] = useState(false);

  const router = useRouter();
  const { workspaceID } = router.query;

  const nameIsValid = name ? name.length >= 2 && name.length <= 100 : null;
  const descriptionIsValid = description.length <= 280;
  const formIsValid = nameIsValid === true && descriptionIsValid === true;

  const { errors } = useFormValidation<WorkspaceFormErrors>(
    {
      name: null,
      description: null,
    },
    [nameIsValid, descriptionIsValid],
    [
      'Name must be between 2 and 100 characters long.',
      'Description cannot be more than 280 characters long.',
    ],
  );

  function onUpdatePauseJoinRequests(pause: boolean) {
    if (!togglingPauseRequests) {
      let message: string;

      if (pause) {
        message = 'Paused join requests.';
      } else {
        message = 'Receiving join requests.';
      }

      setTogglingPauseRequests(true);
      const id = setTimeout(() => {
        notify(message, {
          type: 'success',
        });
        setTogglingPauseRequests(false);
        clearTimeout(id);
      }, 1000);
    }
  }

  function togglePauseJoinRequests() {
    setPauseJoinRequests((prevState) => !prevState);
    onUpdatePauseJoinRequests(!pauseJoinRequests);
  }

  function switchTabs(tab: TabType) {
    setActiveTab(tab);
    if (tab !== 'general') {
      router.push(
        `/app/workspaces/${workspaceID}/settings?tab=${tab}`,
        undefined,
        { shallow: true },
      );
    } else {
      router.push(`/app/workspaces/${workspaceID}/settings`, undefined, {
        shallow: true,
      });
    }
  }

  function handleUpdateWorkspace(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid) {
      const form: WorkspaceInfo = {
        name,
        description,
      };

      setSubmitting(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(form);
        setSubmitting(false);
        notify('Workspace updated!', {
          type: 'success',
        });
      }, 3000);
    }
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
        <title>Settings | {workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-workspace-settings">
        <Navigation />

        <div className="content">
          <h1 className="text-[48px] font-bold">Settings</h1>

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
                  activeTab === 'join-requests' ? 'active' : ''
                }`}
                onClick={() => switchTabs('join-requests')}
              >
                Join requests
              </div>
            </div>

            <div className="tab-content lg:col-start-5 lg:col-end-12">
              {activeTab === 'general' && (
                <form autoComplete="off" onSubmit={handleUpdateWorkspace}>
                  <h3 className="text-2xl text-center font-medium mb-10 md:text-4xl lg:text-left">
                    Update workspace info
                  </h3>

                  <Input
                    id="folder-title"
                    type="text"
                    value={name}
                    label="Workspace name"
                    className="lg:text-lg lg:px-8 lg:py-5"
                    wrapperClass="mb-1.5 mx-auto lg:mx-0 lg:w-[600px]"
                    error={errors.name}
                    placeholder="e.g. React Projects"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setName(e.target.value);
                    }}
                  />

                  <div className="input-wrapper max-w-[95%] mx-auto md:w-[450px] lg:mx-0 lg:w-[600px]">
                    <label
                      htmlFor="workspace-description"
                      className="font-medium inline-block mb-1 text-fakeblack"
                    >
                      Description
                    </label>

                    <textarea
                      id="workspace-description"
                      className="px-5 py-3 border border-lightgray rounded-small outline-none w-full min-h-[200px]"
                      maxLength={280}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />

                    <div className="flex justify-between items-center">
                      {errors.description ? (
                        <small className="text-red-600 font-medium">
                          {errors.description}
                        </small>
                      ) : (
                        <br />
                      )}

                      <small
                        className={
                          description.length >= 280
                            ? 'text-red-600'
                            : 'text-darkgray'
                        }
                      >
                        {description.length}/280
                      </small>
                    </div>

                    <div className="mt-16 flex justify-center items-center">
                      <Button
                        type="submit"
                        disabled={!formIsValid || submitting}
                        loading={submitting}
                      >
                        {submitting ? 'Saving...' : 'Save details'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === 'join-requests' && (
                <div className="join-requests border-b pb-5 flex justify-between items-center">
                  <p className="text-lg">Pause receiving join requests.</p>

                  <Switch
                    value={pauseJoinRequests}
                    onSwitch={() => togglePauseJoinRequests()}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

WorkspaceSettingsPage.layout = 'app';

export default WorkspaceSettingsPage;
