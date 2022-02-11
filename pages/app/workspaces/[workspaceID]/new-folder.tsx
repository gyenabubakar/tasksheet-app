import { useRouter } from 'next/router';
import Image from 'next/image';

import { PageWithLayout } from '~/assets/ts/types';
import iconArrowLeft from '~/assets/icons/arrow-left.svg';
import Head from 'next/head';
import Input from '~/components/common/Input';
import { ChangeEvent, FormEvent, useState } from 'react';
import useFormValidation, {
  FormValidationErrors,
} from '~/hooks/useFormValidation';
import Button from '~/components/common/Button';
import { NewFolderInfo } from '~/_serverless/lib/types';
import notify from '~/assets/ts/notify';

interface NewFolderForm extends FormValidationErrors {
  title: string | null;
  category: string | null;
}

const colours = ['#5C68FF', '#FF9F1A', '#3F8CFF', '#EB5A46', '#14CC8A'];

const NewFolderPage: PageWithLayout = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [colour, setColour] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { workspaceID } = router.query;

  const titleIsValid = title ? title.length >= 2 && title.length < 100 : null;
  const categoryIsValid = category
    ? category.length >= 2 && category.length < 50
    : null;
  const formIsValid = titleIsValid === true && categoryIsValid && colour !== '';

  const { errors } = useFormValidation<NewFolderForm>(
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

  function handleCreateFolder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid && !submitting) {
      const form: NewFolderInfo = {
        title,
        category,
        colour,
      };

      setSubmitting(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(form);
        setSubmitting(false);
        notify('Folder created!', {
          type: 'success',
        });
      }, 3000);
    }
  }

  return (
    <>
      <Head>
        <title>Create New Folder - {workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-new-folder">
        <div className="button-wrapper mb-10">
          <button onClick={() => router.back()}>
            <a>
              <Image src={iconArrowLeft} width="19px" height="14px" />
              <span className="inline-block ml-3 font-medium">Back</span>
            </a>
          </button>
        </div>

        <div className="content mt-16">
          <h1 className="text-4xl md:text-[36px] font-bold">
            Create a project folder in the <br />
            <span className="text-main">Montreal Projects</span> workspace.
          </h1>

          <p className="text-lg text-darkgray my-5">
            Folders are used to organise your tasks in a workspace.
          </p>

          <form
            className="mt-16"
            onSubmit={handleCreateFolder}
            autoComplete="off"
          >
            <Input
              id="folder-title"
              type="text"
              value={title}
              label="Title"
              wrapperClass="mb-1.5"
              error={errors.title}
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
              error={errors.category}
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
                {submitting ? 'Hang on...' : 'Create Folder'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

NewFolderPage.layout = 'app';

export default NewFolderPage;
