import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  getFirestore,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

import { PageWithLayout } from '~/assets/ts/types';
import pageTitleSuffix from '~/assets/pageTitleSuffix';
import Navigation from '~/components/common/Navigation';
import useFormValidation, {
  FormValidationErrors,
} from '~/hooks/useFormValidation';
import notify from '~/assets/ts/notify';
import Input from '~/components/common/Input';
import Button from '~/components/common/Button';
import useFolder from '~/hooks/useFolder';
import Loading from '~/components/common/Loading';
import ErrorFallback from '~/components/common/ErrorFallback';
import alertDBError from '~/assets/firebase/alertDBError';

interface NewFolderForm extends FormValidationErrors {
  title: string | null;
  category: string | null;
}

const colours = ['#5C68FF', '#FF9F1A', '#3F8CFF', '#EB5A46', '#14CC8A'];

const EditFolderPage: PageWithLayout = () => {
  const { folder, error } = useFolder();
  const router = useRouter();
  const { folderID } = router.query;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [colour, setColour] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const titleIsValid = title ? title.length >= 2 && title.length < 100 : null;
  const categoryIsValid = category
    ? category.length >= 2 && category.length < 50
    : null;

  // are the changes made different from what's already saved?
  const infoIsDifferent =
    folder !== undefined &&
    folder !== null &&
    (folder.title !== title ||
      folder.category !== category ||
      folder.colour !== colour);

  const formIsValid =
    titleIsValid === true &&
    categoryIsValid &&
    colour !== '' &&
    infoIsDifferent;

  const { errors: validationErrors } = useFormValidation<NewFolderForm>(
    {
      title: null,
      category: null,
      colour: null,
    },
    [titleIsValid, categoryIsValid],
    [
      'Title must be between 2 and 100 characters long.',
      'Category must be between 2 and 50 characters long.',
    ],
  );

  async function handleUpdateFolder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid && infoIsDifferent && !submitting) {
      try {
        setSubmitting(true);
        const db = getFirestore();
        const folderRef = doc(db, 'folders', folder.id!);
        await updateDoc(folderRef, {
          title,
          category,
          colour,
          updatedAt: serverTimestamp(),
        }).then(async () => {
          notify('Folder updated!', {
            type: 'success',
          });
          await router.push(`/app/folder/${folder?.id}`);
        });
      } catch (err: any) {
        alertDBError(err, "Couldn't create workspace.").then(() => {
          setSubmitting(false);
        });
      }
    }
  }

  useEffect(() => {
    if (folder) {
      setTitle(folder.title);
      setCategory(folder.category);
      setColour(folder.colour);
    }
  }, [folder]);

  return (
    <>
      <Head>
        <title>
          Edit{folder ? `: ${folder.title}` : ' Folder'}
          {pageTitleSuffix}
        </title>
      </Head>

      <Navigation backUrl={`/app/folder/${folderID}`} />

      {!folder && !error && (
        <Loading loadingText="Getting folder info..." className="mt-12" />
      )}

      {error && !folder && (
        <ErrorFallback title={error.title} message={error.message} />
      )}

      {folder && !error && (
        <main>
          <div className="content mt-16">
            <h1 className="text-2xl md:text-[36px] font-bold line-h-50">
              Update folder details
            </h1>

            <form
              className="mt-8"
              onSubmit={handleUpdateFolder}
              autoComplete="off"
            >
              <Input
                id="folder-title"
                type="text"
                value={title}
                label="Title"
                wrapperClass="mb-1.5"
                error={validationErrors.title}
                placeholder="Enter folder title"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setTitle(e.target.value);
                }}
              />
              <Input
                id="folder-category"
                type="text"
                value={category}
                label="Category"
                wrapperClass="mb-1.5"
                error={validationErrors.category}
                placeholder="Enter folder category"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setCategory(e.target.value);
                }}
              />

              <div className="colours-wrapper flex">
                {colours.map((colr) => (
                  <div
                    key={colr}
                    className="colour w-10 h-10 rounded-full cursor-pointer transform hover:scale-110 border-[3px]"
                    onClick={() => setColour(colr)}
                    style={{
                      backgroundColor: colr,
                      borderColor: colour === colr ? '#121212' : '#F5F5F5',
                    }}
                  />
                ))}
              </div>

              <div className="mt-16">
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting || !formIsValid}
                >
                  {submitting ? 'Updating...' : 'Update Folder'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      )}
    </>
  );
};

EditFolderPage.layout = 'app';

export default EditFolderPage;
