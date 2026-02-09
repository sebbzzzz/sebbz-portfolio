export default function HomePage() {
  return (
    <main className="container h-svh">
      <div className="row h-full">
        <section className="col-6 flex flex-col justify-center gap-20">
          <div className="grid gap-5">
            <h1 className="text-4xl">
              Hello! <strong>I’m Sebastián,</strong>
            </h1>

            <p className="text-xl">
              I really enjoy creating visually captivating projects that adhere
              to rigorous standards of performance, accessibility, and coding
              best practices.
            </p>
          </div>

          <ul>
            <li>
              <a href="https://www.linkedin.com/in/sebbz/" target="_blank">
                Linkedin
              </a>
            </li>
            <li>
              <a href="https://x.com/sebbz__" target="_blank">
                Twitter
              </a>
            </li>
            <li>
              <a href="mailto:sebastian.1546@gmail.com">Email</a>
            </li>
          </ul>
        </section>

        <section className="col-1"></section>

        <section className="col-5 bg-slate-500"></section>
      </div>
    </main>
  );
}
