import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import validator from 'validator';

import iconArrowLeft from '~/assets/icons/arrow-left.svg';
import iconEmail from '~/assets/icons/email.svg';
import { PageWithLayout } from '~/assets/ts/types';
import ReactTooltip from 'react-tooltip';
import Button from '~/components/common/Button';
import swal from '~/assets/ts/sweetalert';

interface Invite {
  timestamp: number;
  email: string;
}

const WorkspaceInviteMembers: PageWithLayout = () => {
  const [invites, setInvites] = useState<Invite[]>([
    { timestamp: Date.now(), email: '' },
  ]);
  const [isMounted, setIsMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { workspaceID } = router.query;

  const formIsValid = (() => {
    const validInputs: boolean[] = [];
    invites.forEach(({ email }) => validInputs.push(validator.isEmail(email)));
    return !validInputs.includes(false);
  })();

  function isEmailValid(email: string) {
    const isValid = !email || validator.isEmail(email);

    if (isValid === false) {
      return 'Enter a valid email address.';
    }

    const isDuplicate =
      email && invites.filter(({ email: _e }) => _e === email).length > 1;
    return isDuplicate ? 'Duplicate email address.' : null;
  }

  function handleSendInvites(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid) {
      const emails = invites.map(({ email }) => email);

      setSubmitting(true);
      setTimeout(() => {
        const invitesWord = emails.length === 1 ? 'Invite' : 'Invites';

        setSubmitting(false);
        swal({
          icon: 'success',
          title: `${invitesWord} sent successfully!`,
          timer: 3000,
        }).finally(() => {
          router.push(`/app/workspaces/${workspaceID}`);
        });
      }, 3000);
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Invite Members | {workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-new-workspace">
        <div className="button-wrapper mb-10">
          <Link href={`/app/workspaces/${workspaceID}`}>
            <a>
              <Image src={iconArrowLeft} width="19px" height="14px" />
              <span className="inline-block ml-3 font-medium">
                Montreal Projects
              </span>
            </a>
          </Link>
        </div>

        <div className="content mt-12">
          <h1 className="text-[48px] font-bold">
            Invite Team Members to
            <br />
            <span className="text-main">Workspace Name</span>.
          </h1>

          <p className="mt-5 mb-16 w-[435px] text-lg text-darkgray">
            Enter one or more email addresses below and we’ll send them
            invitation mails.
          </p>

          <form autoComplete="off" onSubmit={handleSendInvites}>
            <div className="invites">
              {invites.map(({ timestamp, email }, index) => (
                <div key={timestamp} className="invite flex">
                  <div className="input">
                    <div className="input-et-actions flex items-center">
                      <div className="input-inner w-[500px] relative">
                        <div className="absolute top-4 left-4">
                          <Image
                            src={iconEmail}
                            width="22px"
                            height="18px"
                            alt="User icon"
                          />
                        </div>

                        <input
                          type="email"
                          value={email}
                          placeholder="Enter email address"
                          className="border border-lightgray rounded-small outline-none w-full pl-12 pr-5 py-3"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const invitesCopy = [...invites];
                            invitesCopy.splice(index, 1, {
                              email: e.target.value,
                              timestamp,
                            });
                            setInvites(invitesCopy);
                          }}
                        />
                      </div>

                      <div className="ml-2">
                        <button
                          type="button"
                          data-tip
                          data-for="remove-invite"
                          className="bg-white border-2 border-lightgray rounded-[10px] p-2 flex items-center justify-center"
                          onClick={() => {
                            if (invites.length !== 1) {
                              const invitesCopy = [...invites];
                              invitesCopy.splice(index, 1);
                              setInvites(invitesCopy);
                            }
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 13 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.1136 1.12519C1.288 0.95084 1.52451 0.852896 1.77111 0.852896C2.01771 0.852896 2.25422 0.95084 2.42862 1.12519L6.42111 5.11768L10.4136 1.12519C10.4994 1.03636 10.602 0.965514 10.7155 0.916773C10.8289 0.868033 10.951 0.842378 11.0745 0.841305C11.1979 0.840232 11.3204 0.863762 11.4347 0.910523C11.549 0.957284 11.6528 1.02634 11.7401 1.11366C11.8275 1.20098 11.8965 1.30482 11.9433 1.41911C11.99 1.5334 12.0136 1.65587 12.0125 1.77935C12.0114 1.90284 11.9858 2.02487 11.937 2.13833C11.8883 2.2518 11.8174 2.35442 11.7286 2.44021L7.73613 6.4327L11.7286 10.4252C11.898 10.6006 11.9918 10.8355 11.9896 11.0794C11.9875 11.3232 11.8897 11.5564 11.7173 11.7289C11.5449 11.9013 11.3116 11.9991 11.0678 12.0012C10.8239 12.0034 10.589 11.9096 10.4136 11.7402L6.42111 7.74772L2.42862 11.7402C2.25322 11.9096 2.0183 12.0034 1.77446 12.0012C1.53061 11.9991 1.29736 11.9013 1.12493 11.7289C0.952499 11.5564 0.854692 11.3232 0.852573 11.0794C0.850454 10.8355 0.944193 10.6006 1.1136 10.4252L5.10609 6.4327L1.1136 2.44021C0.939252 2.26581 0.841309 2.0293 0.841309 1.7827C0.841309 1.53609 0.939252 1.29959 1.1136 1.12519Z"
                              fill="#EB4335"
                            />
                          </svg>
                        </button>
                        {isMounted && (
                          <ReactTooltip
                            id="remove-invite"
                            place="top"
                            type="dark"
                            effect="solid"
                          >
                            Remove
                          </ReactTooltip>
                        )}
                      </div>

                      {(invites.length === 1
                        ? true
                        : index + 1 === invites.length) && (
                        <div className="ml-2">
                          <button
                            type="button"
                            data-tip
                            data-for="add-invite"
                            className="bg-white border-2 border-lightgray rounded-[10px] p-2 flex items-center justify-center"
                            onClick={() => {
                              setInvites((prevInvites) => [
                                ...prevInvites,
                                {
                                  timestamp: Date.now(),
                                  email: '',
                                },
                              ]);
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 13 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="transform  rotate-45"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.1136 1.12519C1.288 0.95084 1.52451 0.852896 1.77111 0.852896C2.01771 0.852896 2.25422 0.95084 2.42862 1.12519L6.42111 5.11768L10.4136 1.12519C10.4994 1.03636 10.602 0.965514 10.7155 0.916773C10.8289 0.868033 10.951 0.842378 11.0745 0.841305C11.1979 0.840232 11.3204 0.863762 11.4347 0.910523C11.549 0.957284 11.6528 1.02634 11.7401 1.11366C11.8275 1.20098 11.8965 1.30482 11.9433 1.41911C11.99 1.5334 12.0136 1.65587 12.0125 1.77935C12.0114 1.90284 11.9858 2.02487 11.937 2.13833C11.8883 2.2518 11.8174 2.35442 11.7286 2.44021L7.73613 6.4327L11.7286 10.4252C11.898 10.6006 11.9918 10.8355 11.9896 11.0794C11.9875 11.3232 11.8897 11.5564 11.7173 11.7289C11.5449 11.9013 11.3116 11.9991 11.0678 12.0012C10.8239 12.0034 10.589 11.9096 10.4136 11.7402L6.42111 7.74772L2.42862 11.7402C2.25322 11.9096 2.0183 12.0034 1.77446 12.0012C1.53061 11.9991 1.29736 11.9013 1.12493 11.7289C0.952499 11.5564 0.854692 11.3232 0.852573 11.0794C0.850454 10.8355 0.944193 10.6006 1.1136 10.4252L5.10609 6.4327L1.1136 2.44021C0.939252 2.26581 0.841309 2.0293 0.841309 1.7827C0.841309 1.53609 0.939252 1.29959 1.1136 1.12519Z"
                                fill="#5C68FF"
                              />
                            </svg>
                          </button>
                          {isMounted && (
                            <ReactTooltip
                              id="add-invite"
                              place="top"
                              type="dark"
                              effect="solid"
                            >
                              Add email
                            </ReactTooltip>
                          )}
                        </div>
                      )}
                    </div>

                    <small className="text-red-600 font-medium block h-8">
                      {isEmailValid(email) && isEmailValid(email)}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <Button
                type="submit"
                disabled={!formIsValid || submitting}
                loading={submitting}
              >
                {submitting ? 'Sending...' : 'Send Invites'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

WorkspaceInviteMembers.layout = 'app';

export default WorkspaceInviteMembers;
