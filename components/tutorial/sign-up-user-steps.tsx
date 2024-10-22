import Link from "next/link";
import { TutorialStep } from "./tutorial-step";
import { ArrowUpRight } from "lucide-react";

export default function SignUpUserSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Sign up your first user">
        <p>
          Head over to the{" "}
          <Link
            href="/sign-up"
            className="font-bold hover:underline text-foreground/80"
          >
            Sign up
          </Link>{" "}
          page and sign up your first user. It's okay if this is just you for
          now. Your awesome idea will have plenty of users later!
        </p>
      </TutorialStep>
      <TutorialStep title="Create a collaborative document">
        <p>
          Head over to the{" "}
          <Link
            href="/document"
            className="font-bold hover:underline text-foreground/80"
          >
            Document
          </Link>{" "}
          page create your first document. Add friends or make it public and
          collaborate live!
        </p>
      </TutorialStep>
    </ol>
  );
}
