import { GoogleLogin } from "../components/google-login";
import { ModeToggle } from "@/components/mode-toggle";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { FaShieldAlt, FaUserSecret } from "react-icons/fa";
import { IoLogoFirebase } from "react-icons/io5";
import Feature from "@/components/feature";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <>
      {/* header */}
      <header className="fixed z-50 w-full border-b-2 bg-transparent backdrop-blur-md">
        <div className="container mx-auto flex max-w-screen-xl items-center justify-between p-4">
          <h1 className="font-bold">chat.kabsu</h1>
          <ModeToggle />
        </div>
      </header>

      {/* hero or login */}
      <div className="from-primary-foreground/60 to-background relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b">
        <DotPattern
          // glow={true}
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
          )}
        />

        <div className="z-10 container mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-8 px-4 lg:gap-y-10">
          <h1 className="text-center text-4xl font-semibold text-balance lg:text-5xl">
            Anonymously talk, interact, and connect with the Kabsu Community
          </h1>
          <p className="text-center text-balance lg:text-xl">
            Instantly connect with a fellow kabsuhenyo — one on one, in real
            time. No profile, just pure conversation.
          </p>

          <div className="flex flex-col gap-y-4">
            <div className="mx-auto">
              <GoogleLogin />
            </div>
            <p className="text-muted-foreground text-center text-sm">
              Log in with your CvSU account to start chatting anonymously.
            </p>
          </div>
        </div>
      </div>

      {/* Some other stuff */}
      {/* features */}
      <div className="from-primary-foreground/60 to-background border-t-2 bg-gradient-to-t py-24">
        <div className="container mx-auto max-w-screen-xl px-4">
          <h2 className="mb-12 text-center text-3xl font-semibold text-balance">
            What is chat.kabsu?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Feature {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* contact */}
      <div className="from-primary-foreground/60 to-background border-t-2 bg-gradient-to-b py-24">
        <div className="container mx-auto max-w-screen-md px-4">
          <h2 className="mb-6 text-center text-3xl font-semibold text-balance">
            Contact Us
          </h2>
          <p className="text-muted-foreground mb-6 text-center">
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, send us a message!
          </p>

          <form className="bg-card/40 flex flex-col gap-6 rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Your message"
                className="field-sizing-fixed min-h-0"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>

      <footer className="from-primary-foreground/60 to-background border-t-2 bg-gradient-to-t py-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} chat.kabsu
          </p>
        </div>
      </footer>
    </>
  );
}

const features = [
  {
    Icon: FaUserSecret,
    title: "Anonymous Conversations",
    description:
      "Connect with fellow CvSU peeps without revealing your identity. This real-time communication is powered by Socket.IO, ensuring a low latency experience.",
  },
  {
    Icon: IoLogoFirebase,
    title: "Secure Authentication",
    description:
      "We use Firebase Authentication to ensure that only verified users can join. Your account is safe, with no sensitive data stored on our end.",
  },
  {
    Icon: FaShieldAlt,
    title: "Your Data, Your Privacy",
    description:
      "No messages are stored in our database. Your conversations are secure, ephemeral, and private, ensuring your personal data stays private.",
  },
];
