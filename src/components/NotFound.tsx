import awardPng from '@/assets/award.png?url';
import awardWebp from '@/assets/award.webp?url';
import awardAvif from '@/assets/award.avif?url';
import { Link } from 'preact-router';
import { HOME_ROUTE } from '@/constants/routes';

export function NotFound() {
  return (
    <div class="bg-bg-softer rounded-lg py-32 md:py-48 px-16">
      <picture>
        <source srcset={awardAvif} type="image/avif" />
        <source srcset={awardWebp} type="image/webp" />
        <img
          src={awardPng}
          alt=""
          width="300"
          height="300"
          class="mx-auto mb-lg w-256 h-256"
        />
      </picture>
      <h1 class="text-center">
        <span class="text-heading-md font-semibold">Congratulations!</span>
        <br />
        <span class="text-heading-sm text-text-soft">
          You are lost&#8230; 🤷
        </span>
      </h1>
      <div class="mt-48 mx-auto w-fit">
        <Link href={HOME_ROUTE} class="ms-button-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
