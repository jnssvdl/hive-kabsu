import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function ContactForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    if (!data.name || !data.email || !data.message) {
      alert("All fields are required.");
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Message sent!");
    } else {
      alert("Failed to send message.");
    }
  }

  return (
    <form
      className="bg-card/40 flex flex-col gap-6 rounded-lg border p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your name" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
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
  );
}
