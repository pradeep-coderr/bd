"use client";

import { useInView } from "@/lib/useInView";

function Para({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const { setRef, inView } = useInView<HTMLParagraphElement>();
  return (
    <p ref={setRef} className={`${className} ${inView ? "in-view" : ""}`}>
      {children}
    </p>
  );
}

export default function Letter() {
  return (
    <section id="letter">
      <div className="letter-inner">
        <p className="letter-eyebrow">a letter</p>
        <Para className="letter-para letter-salutation">My Poku,</Para>

        <Para className="letter-para">
          I&apos;ve written this in my head a dozen times and it never comes out right, so let me just say it straight.
        </Para>

        <Para className="letter-para">
          It&apos;s your birthday, and I still haven&apos;t seen your face in person. I haven&apos;t hugged you, haven&apos;t sat across
          from you, haven&apos;t done any of the ordinary things people do for someone they love. And yet — somehow
          you&apos;re one of the most important people in my life. That still amazes me, if I&apos;m honest.
        </Para>

        <Para className="letter-para">
          I think about all the nights we&apos;ve fallen asleep on call, the days we&apos;ve talked through from morning
          straight into the next morning, the version of me that used to get moody and shut down — and how you never
          gave up on that version of me. You just kept talking to me, kept showing up, until I became someone
          steadier. I don&apos;t think I&apos;ve properly thanked you for that.
        </Para>

        <Para className="letter-para">
          I fall asleep some nights just listening to your voice, and I don&apos;t think you know how much that has held
          me together on the harder days.
        </Para>

        <Para className="letter-para">
          I hate that I can&apos;t be there today — no hug, no cake in front of you, nothing I can physically hand you. So
          this website is the closest I can get. It&apos;s not much. But it&apos;s mine, made for you.
        </Para>

        <Para className="letter-para">
          We talk about the future a lot — a home together, a life together — and I want that. Not just as an idea we
          talk about at 2am, but really. So here&apos;s me saying it plainly: I want to meet you. I want to stop talking
          about &quot;someday&quot; and start actually planning it. Let&apos;s talk about it — really talk — soon.
        </Para>

        <Para className="letter-para">
          Until then: happy birthday, my love. Thank you for staying, all this time, from so far away. I love you,
          distance and all.
        </Para>

        <Para className="letter-sign">— timro baccha</Para>
      </div>
    </section>
  );
}
