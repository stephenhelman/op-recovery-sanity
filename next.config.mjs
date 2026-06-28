/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this project so Next doesn't pick a parent
  // directory's lockfile (silences the multi-lockfile root warning).
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
