import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import Container from '~/components/common/Container';
import logo from '~/assets/images/logo.svg';
import iconOpenSource from '~/assets/icons/open-source.svg';
import iconFree from '~/assets/icons/free.svg';
import iconEasy from '~/assets/icons/easy.svg';

const Home: NextPage = () => (
  <>
    <Head>
      <title>
        TaskSheet - Simple, straight-forward task management solution
      </title>
      <meta
        name="description"
        content="A web application for creating and managing tasks."
      />
    </Head>

    <main className="landing-page">
      <header className="bg-white pb-24 pt-10">
        <nav className="sticky top-0 left-0 right-0 bg-white z-10">
          <Container className="flex items-center justify-between py-5">
            <Link href="/">
              <a className="flex logo-wrapper items-center justify-center">
                <div className="logo w-[40px] h-[37px] relative">
                  <Image src={logo} layout="fill" alt="TaskSheet logo" />
                </div>
                <h3 className="hidden md:block text-3xl font-bold text-main ml-2 select-none">
                  TaskSheet
                </h3>
              </a>
            </Link>

            <div className="actions flex">
              <Link href="/login">
                <a className="border border-main rounded-lg px-6 py-2 text-sm font-bold text-main hover:border-darkmain hover:text-darkmain">
                  Log in
                </a>
              </Link>

              <Link href="/signup">
                <a className="border-1 border-main bg-main hover:bg-darkmain hover:border-darkmain text-white rounded-lg px-6 py-2 text-sm font-bold ml-2">
                  Sign up
                </a>
              </Link>
            </div>
          </Container>
        </nav>

        <div className="hero mt-10">
          <Container className="grid grid-cols-2 gap-5">
            <div className="description pt-20">
              <h1 className="text-[2.5rem] font-bold leading-tight">
                An <span className="text-main">open-source</span> project
                management tool built for{' '}
                <span className="text-main">software developers</span>.
              </h1>

              <p className="text-darkgray my-5 text-xl font-medium">
                Manage everything from personal projects to freelance projects
                with a simple, intuitive interface that gives you only the
                features needed to get the job done.
              </p>

              <div className="mt-16">
                <Link href="/signup">
                  <a className="px-16 py-4 rounded-small text-white bg-main text-xl font-bold hover:bg-darkmain">
                    Get Started
                  </a>
                </Link>
              </div>
            </div>

            <div className="image relative flex items-center justify-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero.png"
                className="w-10/12 mx-auto inline-block"
                alt="App screenshots stacked"
              />
            </div>
          </Container>
        </div>
      </header>

      <section className="why-us py-16">
        <Container>
          <h2 className="text-base uppercase font-bold text-center text-darkgray">
            Why TaskSheet?
          </h2>

          <div className="reasons mt-10 w-10/12 mx-auto grid grid-cols-3 gap-8">
            <div className="reason text-center flex flex-col items-center">
              <Image src={iconEasy} width="100px" height="100px" />
              <p className="text-2xl font-bold my-5">Easy to use</p>
              <span className="text-darkgray text-lg">
                TaskSheet offers only the features you need to collaborate and
                execute tasks with the simplest of UIs you&apos;d see in a
                project management software.
              </span>
            </div>

            <div className="reason text-center flex flex-col items-center">
              <Image src={iconOpenSource} width="100px" height="100px" />
              <p className="text-2xl font-bold my-5">It&apos;s open-sourced</p>
              <span className="text-darkgray text-lg">
                TaskSheet&apos;s source code is public to everyone. You&apos;re
                free to contribute or use the code anyhow you deem fit.
              </span>
            </div>

            <div className="reason text-center flex flex-col items-center">
              <Image src={iconFree} width="100px" height="100px" />
              <p className="text-2xl font-bold my-5">It&apos;s free, forever</p>
              <span className="text-darkgray text-lg">
                You can clone the code and host it yourself, but you don&apos;t
                have to. With your support, TaskSheet can be hosted and be
                completely free to use.
              </span>
            </div>
          </div>
        </Container>
      </section>
    </main>
  </>
);

export default Home;
