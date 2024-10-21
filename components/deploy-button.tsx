import Link from "next/link";
import Image from "next/image";

export default function DeployButton() {
  return (
    <>
      <Link
        href="https://app.netlify.com/start/deploy?repository=https://github.com/jamsocket/y-sweet-supabase-demo"
        target="_blank"
      >
        <Image
          alt="Deploy to Netlify"
          width={150}
          height={20}
          priority
          src="https://www.netlify.com/img/deploy/button.svg"
        />
      </Link>
    </>
  );
}
