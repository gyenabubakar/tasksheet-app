import { useRouter } from 'next/router';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  getFirestore,
  updateDoc,
  doc,
  FirestoreError,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';

import { PageWithLayout } from '~/assets/ts/types';
import Navigation from '~/components/common/Navigation';
import Input from '~/components/common/Input';
import useFormValidation, {
  FormValidationErrors,
} from '~/hooks/useFormValidation';
import Button from '~/components/common/Button';
import notify from '~/assets/ts/notify';
import Switch from '~/components/common/Switch';
import swal from '~/assets/ts/sweetalert';
import useWorkspace from '~/hooks/useWorkspace';
import Loading from '~/components/common/Loading';
import pageTitleSuffix from '~/assets/pageTitleSuffix';
import useUser from '~/hooks/useUser';
import ErrorFallback from '~/components/common/ErrorFallback';

interface WorkspaceFormErrors extends FormValidationErrors {
  name: string | null;
  description: string | null;
}

type TabType = 'general' | 'join-requests' | 'deactivate';

const WorkspaceSettingsPage: PageWithLayout = () => {
  const { user } = useUser();
  const { error, workspace } = useWorkspace();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('general');

  const [pauseJoinRequests, setPauseJoinRequests] = useState(true);
  const [togglingPauseRequests, setTogglingPauseRequests] = useState(false);

  const router = useRouter();
  const { workspaceID } = router.query;

  const isJustMember = !workspace?.isAdmin && !workspace?.isOwner;

  const nameIsValid = name ? name.length >= 2 && name.length <= 100 : null;
  const descriptionIsValid = description.length <= 280;
  const formIsValid =
    nameIsValid === true &&
    descriptionIsValid &&
    (name !== workspace?.name || description !== workspace?.description) &&
    !isJustMember;

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

  async function onUpdatePauseJoinRequests(pause: boolean) {
    if (!togglingPauseRequests) {
      let message: string;

      if (pause) {
        message = 'Paused join requests.';
      } else {
        message = 'Receiving join requests.';
      }

      setTogglingPauseRequests(true);

      const settings = { ...workspace!.settings };
      settings.joinRequests.pauseRequests = pause;

      try {
        const db = getFirestore();
        const workspaceRef = doc(db, 'workspaces', workspace!.id!);
        await updateDoc(workspaceRef, {
          settings,
          updatedAt: serverTimestamp(),
        });
        notify(message, {
          type: 'success',
        });
      } catch (err) {
        await swal({
          icon: 'error',
          title: "Couldn't update workspace.",
          text: `Request failed with error: ${(err as FirestoreError).code}`,
          timer: 3000,
        });
      }
      setTogglingPauseRequests(false);
    }
  }

  function togglePauseJoinRequests() {
    if (workspace?.isOwner || workspace?.isAdmin) {
      setPauseJoinRequests((prevState) => {
        const newState = !prevState;
        onUpdatePauseJoinRequests(newState);
        return newState;
      });
    }
  }

  async function switchTabs(tab: TabType) {
    setActiveTab(tab);
    if (tab !== 'general') {
      await router.push(
        `/app/workspaces/${workspaceID}/settings?tab=${tab}`,
        undefined,
        { shallow: true },
      );
    } else {
      await router.push(`/app/workspaces/${workspaceID}/settings`, undefined, {
        shallow: true,
      });
    }
  }

  function handleUpdateWorkspace(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid) {
      const form = {
        name,
        description,
      };

      setSubmitting(true);
      // TODO: edit workspace
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

  function handleLeaveWorkspace() {
    if (!workspace?.isOwner) {
      swal({
        icon: 'warning',
        title: (
          <span>
            Sure you want to leave{' '}
            <span className="text-main">{workspace!.name}</span>?
          </span>
        ),
        text: "You'll lose access to all tasks and folders in this workspace.",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Leave workspace!',
        cancelButtonText: 'No, cancel',
        showLoaderOnConfirm: true,
        preConfirm(confirmed: boolean) {
          if (confirmed) {
            let admins = [...workspace!.admins];
            const members = [...workspace!.members];
            const memberIndex = members.findIndex(
              (memberUID) => memberUID === user.uid,
            );
            if (memberIndex !== -1) {
              members.splice(memberIndex, 1);
              if (workspace?.isAdmin) {
                admins = admins.filter((adminUID) => adminUID !== user.uid);
              }

              const db = getFirestore();
              const workspaceRef = doc(db, 'workspaces', workspace!.id!);
              return updateDoc(workspaceRef, {
                admins,
                members,
                updatedAt: serverTimestamp(),
              });
            }
          }
          return null;
        },
      })
        .then(async (results) => {
          if (results.isConfirmed) {
            await router.replace('/app/workspaces');

            await swal({
              icon: 'success',
              title: (
                <span>
                  You&apos;re no longer a member of{' '}
                  <span className="text-main">{workspace?.name}</span>.
                </span>
              ),
            });
          }
        })
        .catch(async (err) => {
          await swal({
            icon: 'error',
            title: "Couldn't leave workspace.",
            text: `Request failed with error: ${(err as FirestoreError).code}`,
            timer: 3000,
          });
        });
    }
  }

  function handleDeleteWorkspace() {
    if (workspace?.isOwner) {
      swal({
        icon: 'warning',
        title: 'Proceed to delete workspace?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Delete!',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm(confirmed: boolean): Promise<any> | null {
          if (confirmed) {
            const db = getFirestore();
            const workspaceRef = doc(db, 'workspaces', workspace!.id!);
            return deleteDoc(workspaceRef);
          }
          return null;
        },
      }).then(async (results) => {
        if (results.isConfirmed) {
          await router.replace('/app/workspaces');

          await swal({
            icon: 'success',
            title: (
              <span>
                Deleted workspace,{' '}
                <span className="text-main">{workspace.name}</span>!
              </span>
            ),
          });
        }
      });
    }
  }

  useEffect(() => {
    if (!router.query.tab) {
      setActiveTab('general');
      return;
    }

    setActiveTab(router.query.tab as TabType);
  }, [router.query]);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setDescription(workspace.description);
      setPauseJoinRequests(workspace.settings.joinRequests.pauseRequests);
    }
  }, [workspace]);

  return (
    <>
      <Head>
        <title>
          {workspace && `${workspace.name} | `}
          Settings
          {pageTitleSuffix}
        </title>
      </Head>

      <Navigation backUrl={`/app/workspaces/${workspaceID}`}>
        {isJustMember ||
          (workspace?.isAdmin && (
            <button
              className="bg-red-100 text-sm px-3 py-1 rounded-md flex items-center"
              onClick={handleLeaveWorkspace}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM13.5 10.75H8.31L10.03 12.47C10.32 12.76 10.32 13.24 10.03 13.53C9.88 13.68 9.69 13.75 9.5 13.75C9.31 13.75 9.12 13.68 8.97 13.53L5.97 10.53C5.68 10.24 5.68 9.76 5.97 9.47L8.97 6.47C9.26 6.18 9.74 6.18 10.03 6.47C10.32 6.76 10.32 7.24 10.03 7.53L8.31 9.25H13.5C13.91 9.25 14.25 9.59 14.25 10C14.25 10.41 13.91 10.75 13.5 10.75Z"
                  fill="rgb(239,68,68)"
                />
              </svg>

              <span className="text-red-500 font-medium ml-2">
                Leave <span className="hidden sm:inline">Workspace</span>
              </span>
            </button>
          ))}
      </Navigation>

      <main className="page-workspace-settings">
        <div className="content">
          {!workspace && !error && (
            <Loading loadingText="Loading workspace..." className="mt-12" />
          )}

          {error && !workspace && (
            <ErrorFallback title={error.title} message={error.message} />
          )}

          {workspace && !error && (
            <>
              <h1 className="text-[48px] font-bold">Settings</h1>

              <p className="text-base text-gray-500">
                Only admins and the workspace owner can modify workspace
                settings.
              </p>

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
                  {workspace.isOwner && (
                    <div
                      className={`settings-tab py-3 cursor-pointer ${
                        activeTab === 'deactivate' ? 'active' : ''
                      }`}
                      onClick={async () => {
                        if (workspace.isOwner) {
                          await switchTabs('deactivate');
                        }
                      }}
                    >
                      Deactivate
                    </div>
                  )}
                </div>

                <div className="tab-content lg:col-start-5 lg:col-end-13">
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
                        className="lg:text-lg lg:px-8 lg:py-5 disabled:cursor-not-allowed"
                        disabled={isJustMember}
                        wrapperClass="mb-1.5 mx-auto lg:mx-0 lg:w-[600px]"
                        error={errors.name}
                        placeholder="e.g. React Projects"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          if (!isJustMember) {
                            setName(e.target.value);
                          }
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
                          className="px-5 py-3 border border-lightgray rounded-small outline-none w-full min-h-[200px] disabled:cursor-not-allowed"
                          maxLength={280}
                          value={description}
                          disabled={isJustMember}
                          onChange={(e) => {
                            if (!isJustMember) {
                              setDescription(e.target.value);
                            }
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

                  {activeTab === 'deactivate' && (
                    <div className="deactivation border-b pb-5">
                      <h3 className="text-xl md:text-3xl font-medium">
                        Delete workspace
                      </h3>

                      <p className="text-lg mt-3 text-darkgray">
                        This will remove all folders and tasks in the workspace.
                        You cannot revert this action.
                      </p>

                      <div className="text-left mt-3">
                        <button
                          className="px-10 py-2 rounded-lg text-white font-medium bg-red-500 hover:bg-red-700"
                          onClick={handleDeleteWorkspace}
                        >
                          Delete Workspace
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

WorkspaceSettingsPage.layout = 'app';

export default WorkspaceSettingsPage;
