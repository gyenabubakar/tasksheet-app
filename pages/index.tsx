import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import Container from '~/components/common/Container';
import logo from '~/assets/images/logo.svg';
import iconOpenSource from '~/assets/icons/open-source.svg';
import iconFree from '~/assets/icons/free.svg';
import iconEasy from '~/assets/icons/easy.svg';
import logoWhite from '~/public/images/logo-white.svg';

const Home: NextPage = () => (
  <>
    <Head>
      <title>TaskSheet - An open-source project management solution</title>
      <meta
        name="description"
        content="A web application for creating and managing tasks."
      />
    </Head>

    <main className="landing-page">
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

      <header className="bg-white pb-24 pt-10">
        <div className="hero mt-10">
          <Container className="">
            <div className="description w-full md:w-8/12 xl:7/12 2xl:6/12 mx-auto lg:pt-20">
              <h1 className="text-3xl md:text-[2.5rem] xl:text-6xl font-bold leading-tight text-center">
                An <span className="text-main">open-source</span> project
                management tool built with{' '}
                <span className="text-main">software developers</span> in mind.
              </h1>

              <p className="text-darkgray my-5 text-xl text-center font-medium">
                Manage everything from personal projects to freelance projects
                with a simple, intuitive interface that gives you only the
                features needed to get the job done.
              </p>

              <div className="mt-16 text-center">
                <Link href="/signup">
                  <a className="px-16 py-4 rounded-small text-white bg-main text-xl font-bold hover:bg-darkmain">
                    Get Started
                  </a>
                </Link>
              </div>
            </div>

            <div className="image relative flex items-center justify-end mt-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero.png"
                className="w-full md:w-8/12 mx-auto inline-block"
                alt="App screenshots stacked"
              />
            </div>
          </Container>
        </div>
      </header>

      <section className="why-us py-20">
        <Container>
          <h2 className="text-base uppercase font-bold text-center text-darkgray">
            Why TaskSheet?
          </h2>

          <div className="reasons mt-10 w-10/12 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="reason text-center flex flex-col items-center">
              <Image src={iconEasy} width="100px" height="100px" />
              <p className="text-2xl font-bold my-5">Easy to use</p>
              <span className="text-darkgray text-lg">
                TaskSheet offers only the features you need to collaborate and
                execute tasks with the simplest of UIs in a project management
                software.
              </span>
            </div>

            <div className="reason text-center flex flex-col items-center">
              <Image src={iconOpenSource} width="100px" height="100px" />
              <p className="text-2xl font-bold my-5">It&apos;s open-sourced</p>
              <span className="text-darkgray text-lg">
                TaskSheet&apos;s source code is public. You&apos;re free to
                contribute or use the code anyhow you deem fit.
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

      <section className="workspaces bg-white py-20">
        <Container className="flex flex-col-reverse text-center xl:text-left xl:grid grid-cols-5">
          <div className="description w-full md:w-9/12 mx-auto xl:w-[unset] xl:mx-[unset] col-start-1 col-end-4 flex flex-col justify-center">
            <h2 className="text-3xl font-bold">
              Create and manage workspaces.
            </h2>

            <p className="text-xl font-medium text-darkgray mt-7">
              Workspaces are the parent containers for related projects. You can
              create a new workspace in 4 easy steps. The last one is even
              optional.
            </p>
          </div>

          <div className="image col-start-4 col-end-6">
            <div className="w-[250px] xl:w-9/12 h-[300px] mx-auto relative">
              <Image
                src="/images/landing-page/online_organizer.svg"
                layout="fill"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="invitation bg-white py-20">
        <Container className="flex flex-col text-center xl:text-left xl:grid grid-cols-5">
          <div className="image col-start-1 col-end-3">
            <div className="w-[250px] xl:w-9/12 h-[300px] mx-auto relative">
              <Image src="/images/landing-page/co_workers.svg" layout="fill" />
            </div>
          </div>

          <div className="description w-full md:w-9/12 mx-auto xl:w-[unset] xl:mx-[unset] col-start-3 col-end-6 ml-auto flex flex-col justify-center">
            <h2 className="text-3xl font-bold">
              Invite other people into your workspace.
            </h2>

            <p className="text-xl font-medium text-darkgray mt-7">
              Need help with a task? The Invitation feature has got you! Invite
              as many people as you want into your workspace so that you can
              collaborate on tasks.
            </p>
          </div>
        </Container>
      </section>

      <section className="workspaces bg-white py-20">
        <Container className="flex flex-col-reverse text-center xl:text-left xl:grid grid-cols-5">
          <div className="description w-full md:w-9/12 mx-auto xl:w-[unset] xl:mx-[unset] col-start-1 col-end-4 flex flex-col justify-center">
            <h2 className="text-3xl font-bold">
              Stay in the loop with notifications
            </h2>

            <p className="text-xl font-medium text-darkgray mt-7">
              Creating folders in your workspaces, inviting people, creating and
              assigning tasks — with time it gets hard to keep track of
              everything. With realtime notifications you&apos;re made aware of
              any changes that happen in your workspaces.
            </p>
          </div>

          <div className="image w-full md:w-9/12 mx-auto xl:w-[unset] xl:mx-[unset] col-start-4 col-end-6">
            <div className="w-[250px] xl:w-9/12 h-[300px] mx-auto relative">
              <Image
                src="/images/landing-page/push_notifications.svg"
                layout="fill"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="cta py-20">
        <h3 className="text-3xl font-bold text-center w-full md:w-9/12 xl:w-7/12 mx-auto">
          You&apos;re still here? 😲
        </h3>

        <div className="mt-8 text-center">
          <Link href="/signup">
            <a className="px-8 py-4 rounded-small text-white bg-main text-xl font-bold hover:bg-darkmain">
              Get Started Already! 🏃‍♂️💨
            </a>
          </Link>
        </div>
      </section>
    </main>

    <footer className="bg-main text-white">
      <Container className="py-10 flex flex-col md:flex-row justify-between items-center">
        <div className="brand">
          <Link href="/">
            <a className="flex logo-wrapper items-center justify-center">
              <div className="logo w-[40px] h-[37px] relative">
                <Image src={logoWhite} layout="fill" alt="TaskSheet logo" />
              </div>
              <h3 className="text-3xl font-bold text-white ml-2 select-none">
                TaskSheet
              </h3>
            </a>
          </Link>
        </div>

        <div className="social text-center mt-10 md:mt-0 md:text-right">
          <a
            href="https://github.com/gyenabubakar/tasksheet-app"
            className="text-xl font-bold inline-block border-b-2 border-b-white"
          >
            Get the source code
          </a>
        </div>
      </Container>
    </footer>
  </>
);

export default Home;
