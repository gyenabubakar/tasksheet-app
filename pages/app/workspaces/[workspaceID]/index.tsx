import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import { PageWithLayout } from '~/assets/ts/types';
import iconArrowLeft from '~/assets/icons/arrow-left.svg';

const WorkspaceDetailsPage: PageWithLayout = (props) => {
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(props);
  }, [router]);

  return (
    <>
      <Head>
        <title>Workspace ID · TaskSheet</title>
      </Head>

      <main className="py-5 lg:py-12">
        <div className="heading">
          <div className="button-wrapper">
            <button className="">
              <Image src={iconArrowLeft} width="19px" height="14px" />
              <span className="inline-block ml-3 font-medium">Workspaces</span>
            </button>
          </div>

          <div className="workspace-info mt-8 md:mt-12 flex flex-col-reverse justify-between items-center lg:justify-start lg:items-start lg:grid grid-cols-12">
            <div className="div col-span-8">
              <h1 className="font-bold text-4xl md:text-[48px] md:text-center lg:text-left">
                Montreal Projects
              </h1>

              <p className="mt-5 text-darkgray md:text-center lg:text-left">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Dignissimos iusto quibusdam nam eaque enim eum officia quam
                perspiciatis nisi impedit a commodi pariatur obcaecati dolores
                facere, reprehenderit esse saepe doloremque?
              </p>
            </div>

            <div className="cover-wrapper w-full mb-5 lg:mb-0 col-start-10 col-span-3">
              <div className="cover w-full h-56 md:w-8/12 md:h-72 md:mx-auto lg:mx-0 lg:w-72 lg:h-40 relative">
                <Image
                  src="/images/macbook.jpeg"
                  layout="fill"
                  className="rounded-md"
                />
              </div>
              <div className="text-center">
                <button className="my-2 font-medium text-main hover:text-darkmain">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="body" />
      </main>
    </>
  );
};

WorkspaceDetailsPage.layout = 'app';

export const getServerSideProps = () => ({
  props: {
    message: 'Workspace ID',
  },
});

export default WorkspaceDetailsPage;
