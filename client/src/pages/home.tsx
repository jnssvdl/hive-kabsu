import { GoogleLogin } from "../components/google-login";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { FaShieldAlt, FaUserSecret } from "react-icons/fa";
import { IoLogoFirebase } from "react-icons/io5";
import Feature from "@/components/feature";
import ContactForm from "@/components/contact-form";
import { ModeButton } from "@/components/mode-button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      {/* header */}
      <header className="fixed z-50 w-full border-b-2 bg-transparent backdrop-blur-md">
        <div className="container mx-auto flex max-w-screen-xl items-center justify-between p-4">
          <h1 className="text-primary text-lg font-bold">Hive</h1>
          {/* <ModeToggle /> */}
          <ModeButton />
        </div>
      </header>

      {/* hero or login */}
      <div className="from-secondary/60 to-background relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b">
        <DotPattern
          // glow={true}
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
          )}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="z-10 container mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center gap-y-8 px-4 lg:gap-y-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center text-4xl font-semibold text-balance lg:text-5xl"
          >
            Anonymously talk, interact, and connect with the Kabsu Community
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center text-balance lg:text-xl"
          >
            Instantly connect with a fellow kabsuhenyo — one on one, in real
            time. No profile, just pure conversation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="flex flex-col gap-y-4"
          >
            <div className="mx-auto">
              <GoogleLogin />
            </div>
            <p className="text-muted-foreground text-center text-sm">
              Log in with your CvSU account to start chatting anonymously.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Some other stuff */}
      {/* features */}
      <div className="from-secondary/60 to-background border-t-2 bg-gradient-to-t py-24">
        <div className="container mx-auto max-w-screen-xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="mb-12 text-center text-3xl font-semibold text-balance">
              What is Hive?
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <Feature {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* contact */}
      <div className="from-secondary/60 to-background border-t-2 bg-gradient-to-b py-24">
        <div className="container mx-auto max-w-screen-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-center text-3xl font-semibold text-balance">
              Contact Us
            </h2>

            <p className="text-muted-foreground mb-6 text-center">
              We'd love to hear from you! Whether you have a question, feedback,
              feature request or just want to say hello, send us a message!
            </p>

            <ContactForm />
          </motion.div>
        </div>
      </div>

      <footer className="from-secondary/60 to-background border-t-2 bg-gradient-to-t py-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Hive</p>
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
