import Head from 'next/head';
import Image from 'next/image';
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  FirestoreError,
} from 'firebase/firestore';

import { PageWithLayout } from '~/assets/ts/types';
import iconArrowLeft from '~/assets/icons/arrow-left.svg';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import useFormValidation, {
  FormValidationErrors,
} from '~/hooks/useFormValidation';
import Input from '~/components/common/Input';
import Button from '~/components/common/Button';
import iconWhiteArrowRight from '~/assets/icons/workspace/arrow-right-white.svg';
import notify from '~/assets/ts/notify';
import { WorkspacesModel } from '~/assets/firebase/firebaseTypes';
import useUser from '~/hooks/useUser';

interface NewWorkspaceFormErrors extends FormValidationErrors {
  name: string | null;
  description: string | null;
}

const NewWorkspacePage: PageWithLayout = () => {
  const [stage, setStage] = useState<'name' | 'description'>('name');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  const nameIsValid = name ? name.length >= 2 && name.length <= 100 : null;
  const descriptionIsValid = description.length <= 280;
  const formIsValid =
    nameIsValid === true && descriptionIsValid && stage === 'description';

  const { errors } = useFormValidation<NewWorkspaceFormErrors>(
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

  function handleNextStage(e?: FormEvent<HTMLButtonElement>) {
    e?.preventDefault();
    e?.stopPropagation();

    if (nameIsValid) {
      setStage('description');
    }
  }

  async function handleCreateWorkspace(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid) {
      setSubmitting(true);
      const db = getFirestore();
      const workspaceCollRef = collection(db, 'workspaces');

      const workspace: WorkspacesModel = {
        name,
        description,
        createdBy: user.uid,
        admins: [],
        members: [],
        settings: {
          joinRequests: {
            pauseRequests: true,
          },
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const doc = await addDoc(workspaceCollRef, workspace);
      setSubmitting(false);
      router.push(`/app/workspaces/${doc.id}`).then(() => {
        notify('Workspace created!', {
          type: 'success',
        });
      });
    }
  }

  return (
    <>
      <Head>
        <title>Create New Workspace · TaskSheet</title>
      </Head>

      <main className="page-new-workspace">
        <div className="button-wrapper mb-10">
          <button onClick={() => router.back()}>
            <a>
              <Image src={iconArrowLeft} width="19px" height="14px" />
              <span className="inline-block ml-3 font-medium">Back</span>
            </a>
          </button>
        </div>

        <div className="content mt-12">
          <h1 className="text-3xl md:text-[36px] font-medium">
            Create New Workspace
          </h1>

          <div className="stages mt-10 flex items-center">
            <div
              className={`h-2 w-28 rounded-full cursor-pointer ${
                stage === 'name' ? 'bg-main' : 'bg-faintmain'
              }`}
              onClick={() => {
                setStage('name');
              }}
            />
            <div
              className={`h-2 w-28 rounded-full cursor-pointer ml-3 ${
                stage === 'description' ? 'bg-main' : 'bg-faintmain'
              }`}
              onClick={() => {
                if (nameIsValid) {
                  setStage('description');
                }
              }}
            />
          </div>

          <form
            autoComplete="off"
            className="mt-24"
            onSubmit={handleCreateWorkspace}
          >
            {stage === 'name' && (
              <div className="stage-name">
                <h2 className="font-bold text-4xl lg:text-[48px] line-h-50">
                  What’s the <span className="text-main">name</span> of your new{' '}
                  <br className="hidden md:block" />
                  workspace?
                </h2>

                <Input
                  id="folder-title"
                  type="text"
                  value={name}
                  className="lg:text-lg lg:px-8 lg:py-5"
                  wrapperClass="mb-1.5 md:w-[600px]"
                  error={errors.name}
                  placeholder="e.g. React Projects"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && nameIsValid) {
                      handleNextStage();
                    }
                  }}
                />

                <div className="mt-16">
                  <Button
                    type="button"
                    disabled={!nameIsValid}
                    onClick={(e) => handleNextStage(e)}
                  >
                    <span>Next</span>
                    <div className="w-[28px] h-[20px] ml-8 relative">
                      <Image src={iconWhiteArrowRight} layout="fill" />
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {stage === 'description' && (
              <div className="stage-description">
                <h2 className="font-bold text-4xl lg:text-[48px] line-h-50">
                  In a few words, <span className="text-main">describe</span>{' '}
                  your <br className="hidden md:block" />
                  workspace.
                </h2>

                <p className="text-lg text-darkgray mt-5 mb-16">
                  This is optional. You can always add a description in your
                  workspace settings.
                </p>

                <div className="input-wrapper w-full md:w-[600px]">
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
                </div>

                <div className="mt-16">
                  <Button
                    type="submit"
                    disabled={!formIsValid || submitting}
                    loading={submitting}
                  >
                    {submitting ? 'On it...' : 'Create Workspace'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

NewWorkspacePage.layout = 'app';

export default NewWorkspacePage;
