'use client';

import { useState } from 'react';

export default function AccessForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const f = new FormData(e.currentTarget);
    if (f.get('website')) {
      setLoading(false);
      setDone(true);
      return;
    }
    const res = await fetch('/api/access', {
      method: 'POST',
      body: JSON.stringify({
        email: f.get('email'),
        name: f.get('name') || undefined,
        interest: f.get('interest') || undefined,
      }),
      headers: { 'content-type': 'application/json' },
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else setError('Request could not be submitted. Please try again.');
  }

  if (done) {
    return (
      <div className="panel mt-10 p-6">
        <p className="kicker">Request received</p>
        <p className="body mt-3">
          Your collector access request is logged for private review. We respond by invitation only.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 max-w-lg space-y-3">
      <input className="field" name="email" type="email" required placeholder="Email address" autoComplete="email" />
      <input className="field" name="name" placeholder="Name (optional)" autoComplete="name" />
      <select className="field" name="interest" defaultValue="">
        <option value="" disabled>
          Primary interest
        </option>
        <option value="Watches">Watches</option>
        <option value="Jewelry">Jewelry</option>
        <option value="Both">Both</option>
      </select>
      <input
        className="hidden"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {error && <p className="text-sm text-amber-400/90">{error}</p>}
      <button className="btn w-full" disabled={loading}>
        <span>{loading ? 'Submitting…' : 'Request Access'}</span>
        <span>→</span>
      </button>
      <p className="text-[10px] uppercase tracking-[.18em] text-white/35">
        Private list · No marketing noise · Invitation only
      </p>
    </form>
  );
}
