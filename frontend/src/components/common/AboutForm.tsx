const AboutForm = () => {
  return (
    <section className="bg-slate-50 relative mx-7 mt-6 rounded-3xl shadow-md mb-6">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-4">
          <div className="mb-6 max-w-3xl text-center mx-auto">
            <h2 className="font-heading mb-4 font-bold tracking-tight text-slate-800 text-3xl sm:text-5xl">
              Let’s Build Something Great Together
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Got a project idea, a startup vision, or just exploring
              possibilities? Share your thoughts — we’re here to collaborate,
              create, and innovate with you.
            </p>
          </div>
        </div>

        <div className="flex items-stretch justify-center">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left: Contact Info */}
            <div className="h-full pr-4">
              <p className="mt-3 mb-12 text-base text-slate-600">
                At LearnPulse, we value genuine connections. Whether you're
                curious about our offerings or have something specific in mind —
                reach out. We're just a message away.
              </p>
              <ul className="space-y-6">
                {/* Address */}
                <li className="flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-800 text-white">
                    📍
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-800">
                      Our Address
                    </h3>
                    <p className="text-slate-600">1230 Bhajanpura Street</p>
                    <p className="text-slate-600">New Delhi, India</p>
                  </div>
                </li>
                {/* Contact */}
                <li className="flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-800 text-white">
                    📞
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-800">
                      Contact
                    </h3>
                    <p className="text-slate-600">+91 98765 43210</p>
                    <p className="text-slate-600">hello@learnpulse.io</p>
                  </div>
                </li>
                {/* Hours */}
                <li className="flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-800 text-white">
                    🕒
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-800">
                      Working Hours
                    </h3>
                    <p className="text-slate-600">Mon–Fri: 9:00 – 18:00</p>
                    <p className="text-slate-600">Sat–Sun: Closed</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right: Form */}
            <div className="card bg-white h-fit p-5 md:p-10 rounded-lg shadow">
              <h2 className="mb-4 text-2xl font-semibold text-slate-800">
                Start the Conversation
              </h2>
              <form id="contactForm">
                <div className="mb-6">
                  <div className="mb-4">
                    <input
                      type="text"
                      id="name"
                      autoComplete="name"
                      placeholder="Your name"
                      className="w-full rounded-md border border-slate-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      name="name"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      id="email"
                      autoComplete="email"
                      placeholder="Your email address"
                      className="w-full rounded-md border border-slate-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      name="email"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      id="textarea"
                      placeholder="Tell us what you’re thinking..."
                      rows={5}
                      className="w-full rounded-md border border-slate-300 py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    ></textarea>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="w-full bg-slate-800 text-white px-6 py-3 rounded-md hover:bg-slate-700 transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutForm;
