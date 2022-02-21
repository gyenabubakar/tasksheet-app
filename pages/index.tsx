import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import Container from '~/components/common/Container';
import logo from '~/assets/images/logo.svg';

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
        <nav>
          <Container className="flex items-center justify-between">
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

              <p className="text-white text-darkgray my-5 text-xl font-medium">
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
    </main>
  </>
);

export default Home;
