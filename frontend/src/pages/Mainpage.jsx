import React from 'react'
import Navbarmainpage from './Navbarmainpage'
import CodeTyping from './CodeTyping';

// function Mainpage() {
// 	return (
// 		<div>
// 			<Navbarmainpage/>

// 		</div>
// 	)
// }

// export default Mainpage
import { Link } from "react-router-dom";

function Mainpage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

     
      <nav className="w-full flex items-center justify-between px-6 py-4  w-full
      min-h-[64px]
      h-auto
      px-4 sm:px-6 lg:px-12
      bg-slate-900
      text-white
      flex
      items-center
      justify-between">
        <h1 className="text-xl font-bold">CodePlatform</h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded border border-gray-600"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded bg-blue-600"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Practice Coding.
            <br />
            Become Interview Ready.
          </h2>

          <p className="mt-4 text-gray-400">
            Solve curated coding problems, run code instantly,
            and improve your problem-solving skills.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 rounded text-white"
            >
              Start Coding
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-gray-600 rounded"
            >
              Login
            </Link>
          </div>
        </div>

        {/* CODE PREVIEW */}
        <div className="bg-slate-900 rounded-xl p-4 text-sm text-green-400 font-mono">
        <CodeTyping />
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16 grid md:grid-cols-3 gap-8">
        <Feature title="Real Coding Problems" />
        <Feature title="Instant Code Execution" />
        <Feature title="Admin-Curated Content" />
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <h3 className="text-3xl font-bold">
          Ready to start coding?
        </h3>
        <Link
          to="/signup"
          className="inline-block mt-6 px-8 py-3 bg-blue-600 rounded"
        >
          Create Free Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-6 text-center text-gray-500">
        © 2026 CodePlatform. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ title }) {
  return (
    <div className="bg-slate-900 p-6 rounded-xl text-center">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-gray-400">
        Designed to help you learn effectively.
      </p>
    </div>
  );
}

export default Mainpage;

