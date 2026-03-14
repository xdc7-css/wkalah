import { ShieldCheck, Mail, Lock } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { loginAction } from "@/server/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_22%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),linear-gradient(to_bottom,rgba(15,23,42,1),rgba(15,23,42,0.96),rgba(2,6,23,1))]" />

      <div className="absolute inset-0 opacity-[0.06]">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="1440" height="900" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-[-80px] left-[-60px] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.07] shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />

          <div className="p-3">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/40 p-3 sm:p-4">
              {/* Header box */}
              <div className="mb-5 overflow-hidden rounded-[26px] border border-violet-300/15 bg-gradient-to-l from-violet-500/20 via-fuchsia-500/10 to-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
                <div className="px-5 py-6 text-center sm:px-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-violet-300/20 bg-white/10 text-violet-200 shadow-inner shadow-white/10">
                    <ShieldCheck className="size-8" />
                  </div>

                  <h1 className="text-2xl font-extrabold tracking-tight text-white">
                    {APP_NAME}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    تسجيل دخول خاص بالإدارة فقط للوصول إلى لوحة التحكم
                  </p>
                </div>
              </div>

              {/* Form */}
              <form action={loginAction} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      name="email"
                      required
                      placeholder="admin@example.com"
                      className="h-12 rounded-2xl border-white/10 bg-white/5 pr-11 text-right text-white placeholder:text-slate-400 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      className="h-12 rounded-2xl border-white/10 bg-white/5 pr-11 text-right text-white placeholder:text-slate-400 focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                <Button
                  className="h-12 w-full rounded-2xl border border-violet-300/20 bg-gradient-to-l from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-400 hover:to-fuchsia-400 hover:shadow-[0_14px_35px_rgba(139,92,246,0.45)] active:translate-y-0"
                  type="submit"
                >
                  تسجيل الدخول
                </Button>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                  <p className="text-xs leading-6 text-slate-300">
                    تم تعطيل التسجيل العام. أنشئ المستخدم الأول من Supabase Auth.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}