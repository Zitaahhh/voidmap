"use client";

import { FormEvent, useState } from "react";
import { loginUser, registerUser, type VoidMapUser } from "@/lib/auth";
import { VoidCTA } from "./VoidCTA";

type AuthMode = "login" | "register";

type AuthGateProps = {
  onAuthenticated: (user: VoidMapUser) => void;
};

export function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === "register";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = isRegister ? registerUser(username, password) : loginUser(username, password);
    if (result.error || !result.user) {
      setError(result.error ?? "无法进入 VoidMap。");
      return;
    }

    onAuthenticated(result.user);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-3 py-3 text-[var(--vm-text-primary)] sm:px-6 sm:py-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pixel-noise opacity-[0.14]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(var(--vm-user-color-rgb),0.12),transparent_28%),radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.06),transparent_20%),radial-gradient(circle_at_82%_78%,rgba(216,219,227,0.08),transparent_24%)]" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-24px)] max-w-6xl place-items-center rounded-[28px] border border-[var(--vm-border-soft)] bg-[rgba(4,6,14,0.72)] px-4 py-8 shadow-[var(--vm-shadow-panel)] backdrop-blur-[var(--vm-blur-panel)] sm:min-h-[calc(100vh-48px)] sm:rounded-[36px] sm:px-6">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="mx-auto grid h-12 w-12 place-items-center border border-[#3a3a46] bg-[#0a0a0d] text-sm font-semibold tracking-[0.16em] text-[var(--vm-user-color)] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] lg:mx-0">
              V
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-[var(--vm-user-color)]">
                private signal access
              </p>
              <h1 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.08em] text-[#f7f7fa] sm:text-5xl">
                进入 VoidMap
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-[1.8] text-[#a9a9b4] lg:text-base">
                先建立一个临时身份。你的城市暗面信号，会被保存在这个浏览器里的私有入口中。
              </p>
            </div>
            <div className="mx-auto grid max-w-md grid-cols-3 gap-2 font-mono text-[8px] uppercase tracking-[0.28em] text-[#8e8e9a] lg:mx-0">
              <span className="border border-[#282832] bg-[#08080b] px-3 py-2">hidden</span>
              <span className="border border-[#282832] bg-[#08080b] px-3 py-2">local</span>
              <span className="border border-[#282832] bg-[#08080b] px-3 py-2">beta</span>
            </div>
          </div>

          <form className="pixel-panel border border-[#2b2b34] bg-[#07070b] p-5 shadow-[0_22px_80px_rgba(0,0,0,0.62)]" onSubmit={handleSubmit}>
            <div className="flex items-start justify-between gap-4 border-b border-[#26262f] pb-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--vm-user-color)]">
                  {isRegister ? "CREATE NODE" : "SIGN IN"}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#f7f7fa]">
                  {isRegister ? "注册入口" : "登录入口"}
                </h2>
              </div>
              <button
                className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#a9a9b4] transition hover:text-[#f7f7fa]"
                onClick={() => {
                  setMode(isRegister ? "login" : "register");
                  setError(null);
                }}
                type="button"
              >
                {isRegister ? "log in" : "register"}
              </button>
            </div>

            <label className="mt-5 block text-left font-mono text-[9px] uppercase tracking-[0.3em] text-[#8e8e9a]">
              username
              <input
                className="mt-2 w-full border border-[#30303a] bg-[#050507] px-3 py-3 text-sm tracking-[0.02em] text-[#f7f7fa] outline-none transition placeholder:text-[#555560] focus:border-[var(--vm-user-color)]"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="zita"
                type="text"
                value={username}
              />
            </label>

            <label className="mt-4 block text-left font-mono text-[9px] uppercase tracking-[0.3em] text-[#8e8e9a]">
              password
              <input
                className="mt-2 w-full border border-[#30303a] bg-[#050507] px-3 py-3 text-sm tracking-[0.02em] text-[#f7f7fa] outline-none transition placeholder:text-[#555560] focus:border-[var(--vm-user-color)]"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="至少 4 位"
                type="password"
                value={password}
              />
            </label>

            {error ? (
              <p className="mt-4 border border-[#4a2525] bg-[#160707] px-3 py-2 text-left text-xs leading-relaxed text-[#ffb4b4]">
                {error}
              </p>
            ) : null}

            <div className="mt-6">
              <VoidCTA label={isRegister ? "CREATE ACCOUNT" : "ENTER VOIDMAP"} size="md" type="submit" />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#777783]">
              早期内测版：账号暂时只保存在当前浏览器。正式版再接入数据库和云端账户。
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
